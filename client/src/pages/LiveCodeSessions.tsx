import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useTeams, useTeam } from "@/hooks/useTeams";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { NeuroLintOrchestrator } from "@/lib/neurolint/orchestrator";
import { NeuroLintLayerResult } from "@/lib/neurolint/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Users,
  MessageCircle,
  Code,
  Play,
  Pause,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Share,
  ArrowLeft,
  Settings,
  Zap,
  CheckCircle,
  AlertCircle,
  Layers,
  Target,
} from "lucide-react";

interface Participant {
  id: string;
  name: string;
  role: "host" | "collaborator" | "observer";
  isOnline: boolean;
  micStatus: "on" | "off";
  videoStatus: "on" | "off";
}

interface LiveSession {
  id: string;
  name: string;
  repository: string;
  branch: string;
  participants: Participant[];
  isActive: boolean;
  startedAt: string;
  currentCode?: string;
  layerResults?: NeuroLintLayerResult[];
  isAnalyzing?: boolean;
}

interface LayerStatus {
  layerId: number;
  name: string;
  status: "pending" | "running" | "success" | "error";
  result?: NeuroLintLayerResult;
}

interface SessionSettings {
  maxParticipants: number;
  allowGuestAccess: boolean;
  analysisDelay: number;
  autoSave: boolean;
}

const LiveCodeSessions = () => {
  // Authentication check
  const { isAuthenticated, loading: authLoading, user } = useAuth();

  // Error and loading states
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Core session state
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [activeSessions, setActiveSessions] = useState<LiveSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [currentCode, setCurrentCode] = useState<string>("");

  // Analysis state with proper initialization
  const initialLayerAnalysis = useMemo(
    () => [
      { layerId: 1, name: "Configuration", status: "pending" as const },
      { layerId: 2, name: "Entity Cleanup", status: "pending" as const },
      { layerId: 3, name: "Component Structure", status: "pending" as const },
      { layerId: 4, name: "Hydration Patterns", status: "pending" as const },
      { layerId: 5, name: "Next.js Optimization", status: "pending" as const },
      { layerId: 6, name: "Testing & Quality", status: "pending" as const },
    ],
    [],
  );

  const [layerAnalysis, setLayerAnalysis] =
    useState<LayerStatus[]>(initialLayerAnalysis);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // UI state
  const [micEnabled, setMicEnabled] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [autoAnalysis, setAutoAnalysis] = useState(true);

  // Session settings with validation
  const [sessionSettings, setSessionSettings] = useState<SessionSettings>({
    maxParticipants: 10,
    allowGuestAccess: false,
    analysisDelay: 1000,
    autoSave: true,
  });

  // Refs for cleanup and real-time functionality
  const analysisTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Real-time collaboration state
  const [wsConnected, setWsConnected] = useState(false);
  const [wsError, setWsError] = useState<string | null>(null);
  const [collaborators, setCollaborators] = useState<string[]>([]);
  const [cursorPositions, setCursorPositions] = useState<
    Record<string, number>
  >({});

  // Fetch teams data with error handling
  const {
    data: teams,
    isLoading: teamsLoading,
    error: teamsError,
  } = useTeams();
  const {
    data: teamData,
    isLoading: teamLoading,
    error: teamError,
  } = useTeam(selectedTeamId);

  // WebSocket connection management
  const connectWebSocket = useCallback(() => {
    if (!selectedSession || !isAuthenticated || wsRef.current) return;

    try {
      // For development, the WebSocket server may not be available
      // This is a graceful degradation - the app still works without real-time sync
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const host = window.location.host;
      const wsUrl = `${protocol}//${host}/ws/sessions/${selectedSession}`;

      console.log("Attempting WebSocket connection to:", wsUrl);
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        if (mountedRef.current) {
          setWsConnected(true);
          setWsError(null);
          console.log("WebSocket connected for session:", selectedSession);
        }
      };

      ws.onmessage = (event) => {
        if (!mountedRef.current) return;

        try {
          const data = JSON.parse(event.data);

          switch (data.type) {
            case "code_update":
              if (data.userId !== user?.id) {
                setCurrentCode(data.code);
              }
              break;
            case "collaborator_joined":
              setCollaborators((prev) => [
                ...prev.filter((id) => id !== data.userId),
                data.userId,
              ]);
              break;
            case "collaborator_left":
              setCollaborators((prev) =>
                prev.filter((id) => id !== data.userId),
              );
              break;
            case "cursor_update":
              setCursorPositions((prev) => ({
                ...prev,
                [data.userId]: data.position,
              }));
              break;
            case "analysis_result":
              setLayerAnalysis(data.results);
              setIsAnalyzing(false);
              break;
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      ws.onerror = (error) => {
        console.warn(
          "WebSocket connection failed - continuing without real-time sync:",
          error,
        );
        if (mountedRef.current) {
          setWsError("Real-time sync unavailable");
          // Don't block the app - sessions still work locally
        }
      };

      ws.onclose = (event) => {
        if (mountedRef.current) {
          setWsConnected(false);
          wsRef.current = null;

          // Only attempt reconnection for unexpected disconnects
          if (event.code !== 1000 && selectedSession && !wsError) {
            setWsError("Reconnecting...");
            reconnectTimeoutRef.current = setTimeout(() => {
              if (mountedRef.current && selectedSession) {
                console.log("Attempting WebSocket reconnection...");
                connectWebSocket();
              }
            }, 3000);
          } else if (event.code !== 1000) {
            setWsError("Real-time sync disconnected");
          }
        }
      };
    } catch (error) {
      console.warn(
        "WebSocket not available - continuing without real-time sync:",
        error,
      );
      if (mountedRef.current) {
        setWsError("Real-time sync unavailable");
      }
    }
  }, [selectedSession, isAuthenticated, user?.id]);

  // Disconnect WebSocket
  const disconnectWebSocket = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close(1000, "User left session");
      wsRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    setWsConnected(false);
    setWsError(null);
    setCollaborators([]);
    setCursorPositions({});
  }, []);

  // Send WebSocket message
  const sendWebSocketMessage = useCallback((message: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      if (analysisTimeoutRef.current) {
        clearTimeout(analysisTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      disconnectWebSocket();
    };
  }, [disconnectWebSocket]);

  // Initialize component with error handling
  useEffect(() => {
    const initializeComponent = async () => {
      try {
        setError(null);

        // Check authentication
        if (!authLoading && !isAuthenticated) {
          setError("Authentication required to access live sessions");
          return;
        }

        // Check for teams/team data errors
        if (teamsError) {
          setError(
            `Failed to load teams: ${teamsError.message || "Unknown error"}`,
          );
          return;
        }

        if (teamError) {
          setError(
            `Failed to load team data: ${teamError.message || "Unknown error"}`,
          );
          return;
        }

        // Auto-select first team when teams are loaded
        if (
          teams &&
          teams.length > 0 &&
          !selectedTeamId &&
          mountedRef.current
        ) {
          setSelectedTeamId(teams[0].id);
        }

        // Check for session ID in URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const sessionFromUrl = urlParams.get("session");

        if (sessionFromUrl) {
          // Try to join existing session
          try {
            const response = await fetch(`/api/sessions/${sessionFromUrl}`, {
              headers: {
                "x-user-id": user?.id || "",
              },
            });

            if (response.ok) {
              const sessionData = await response.json();
              setActiveSessions((prev) => {
                const exists = prev.find((s) => s.id === sessionData.id);
                return exists ? prev : [...prev, sessionData];
              });
              setSelectedSession(sessionData.id);
              setCurrentCode(sessionData.currentCode || "");

              // Clear URL parameter
              window.history.replaceState({}, "", window.location.pathname);
            }
          } catch (error) {
            console.warn("Failed to join session from URL:", error);
            setError("Failed to join the shared session");
          }
        }

        // Load persisted sessions from localStorage
        try {
          const savedSessions = localStorage.getItem("neurolint-live-sessions");
          if (savedSessions) {
            const sessions: LiveSession[] = JSON.parse(savedSessions);
            const validSessions = sessions.filter((session) => {
              // Remove sessions older than 24 hours
              const sessionAge =
                Date.now() - new Date(session.startedAt).getTime();
              return sessionAge < 24 * 60 * 60 * 1000;
            });

            if (validSessions.length > 0) {
              setActiveSessions((prev) => {
                const merged = [...prev];
                validSessions.forEach((session) => {
                  if (!merged.find((s) => s.id === session.id)) {
                    merged.push(session);
                  }
                });
                return merged;
              });

              // Auto-select the most recent session if none selected from URL
              if (!sessionFromUrl) {
                const mostRecent = validSessions.sort(
                  (a, b) =>
                    new Date(b.startedAt).getTime() -
                    new Date(a.startedAt).getTime(),
                )[0];

                if (mostRecent && !selectedSession) {
                  setSelectedSession(mostRecent.id);
                  setCurrentCode(mostRecent.currentCode || "");
                }
              }
            }
          }
        } catch (error) {
          console.warn("Failed to load saved sessions:", error);
        }
      } catch (err) {
        console.error("Error initializing Live Code Sessions:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to initialize live sessions",
        );
      } finally {
        if (mountedRef.current) {
          setIsInitializing(false);
        }
      }
    };

    initializeComponent();
  }, [
    teams,
    selectedTeamId,
    authLoading,
    isAuthenticated,
    teamsError,
    teamError,
  ]);

  // Connect to WebSocket when session is selected
  useEffect(() => {
    if (selectedSession && isAuthenticated) {
      connectWebSocket();
    } else {
      disconnectWebSocket();
    }
  }, [selectedSession, isAuthenticated, connectWebSocket, disconnectWebSocket]);

  // Convert team members to participants
  const teamParticipants: Participant[] =
    teamData?.members?.map((member) => ({
      id: member.id,
      name: member.userId,
      role: member.role === "owner" ? "host" : "collaborator",
      isOnline: false,
      micStatus: "off",
      videoStatus: "off",
    })) || [];

  // Enhanced real-time analysis with proper cleanup
  useEffect(() => {
    // Clear existing timeout
    if (analysisTimeoutRef.current) {
      clearTimeout(analysisTimeoutRef.current);
      analysisTimeoutRef.current = null;
    }

    if (
      autoAnalysis &&
      currentCode.trim() &&
      selectedSession &&
      mountedRef.current
    ) {
      analysisTimeoutRef.current = setTimeout(
        () => {
          if (mountedRef.current) {
            runLayerAnalysis(currentCode);
          }
        },
        Math.max(100, Math.min(5000, sessionSettings.analysisDelay)),
      ); // Constrain delay
    }

    return () => {
      if (analysisTimeoutRef.current) {
        clearTimeout(analysisTimeoutRef.current);
        analysisTimeoutRef.current = null;
      }
    };
  }, [
    currentCode,
    autoAnalysis,
    sessionSettings.analysisDelay,
    selectedSession,
  ]);

  // Real-time NeuroLint analysis with comprehensive error handling
  const runLayerAnalysis = useCallback(async (code: string) => {
    if (!code.trim() || !mountedRef.current) return;

    // Abort previous request if running
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      setIsAnalyzing(true);
      setError(null);

      if (!mountedRef.current) return;

      setLayerAnalysis((prev) =>
        prev.map((layer) => ({ ...layer, status: "running" as const })),
      );

      // Add timeout for analysis
      const analysisPromise = NeuroLintOrchestrator(
        code,
        "live-session",
        true,
        [1, 2, 3, 4, 5, 6],
      );

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Analysis timeout")), 30000),
      );

      const { transformed, layers } = (await Promise.race([
        analysisPromise,
        timeoutPromise,
      ])) as any;

      if (signal.aborted || !mountedRef.current) return;

      if (layers && Array.isArray(layers)) {
        setLayerAnalysis((prev) =>
          prev.map((layer) => {
            const result = layers.find(
              (r: NeuroLintLayerResult) =>
                r.name &&
                r.name
                  .toLowerCase()
                  .includes(layer.name.split(" ")[0].toLowerCase()),
            );
            return {
              ...layer,
              status: result?.success
                ? ("success" as const)
                : ("error" as const),
              result: result,
            };
          }),
        );
      } else {
        throw new Error("Invalid analysis response");
      }
    } catch (error) {
      if (signal.aborted || !mountedRef.current) return;

      console.error("Layer analysis failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Analysis failed";
      setError(`Analysis failed: ${errorMessage}`);

      setLayerAnalysis((prev) =>
        prev.map((layer) => ({
          ...layer,
          status: "error" as const,
          result: undefined,
        })),
      );
    } finally {
      if (mountedRef.current) {
        setIsAnalyzing(false);
      }
    }
  }, []);

  // Enhanced session creation with comprehensive validation
  const createSession = useCallback(
    (sessionData: Partial<LiveSession>) => {
      try {
        setError(null);

        // Validation checks
        if (!isAuthenticated) {
          setError("Authentication required to create sessions");
          return;
        }

        if (activeSessions.length >= sessionSettings.maxParticipants) {
          setError(
            `Maximum ${sessionSettings.maxParticipants} sessions allowed`,
          );
          return;
        }

        if (!teamParticipants || teamParticipants.length === 0) {
          setError("No team members available for collaboration");
          return;
        }

        // Validate session name
        const sessionName =
          sessionData.name?.trim() ||
          `Session - ${new Date().toLocaleTimeString()}`;
        if (sessionName.length > 100) {
          setError("Session name too long (max 100 characters)");
          return;
        }

        // Validate repository name
        const repository =
          sessionData.repository?.trim() || "live-collaboration";
        if (!/^[a-zA-Z0-9_-]+$/.test(repository)) {
          setError(
            "Invalid repository name (alphanumeric, dash, underscore only)",
          );
          return;
        }

        // Create session with validated data
        const newSession: LiveSession = {
          id: `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          name: sessionName,
          repository,
          branch: sessionData.branch?.trim() || "main",
          participants: teamParticipants.slice(
            0,
            Math.min(3, sessionSettings.maxParticipants),
          ),
          isActive: true,
          startedAt: new Date().toISOString(),
          currentCode: sessionData.currentCode?.substring(0, 50000) || "", // Limit code size
        };

        setActiveSessions((prev) => {
          const updated = [...prev, newSession];

          // Persist to localStorage
          try {
            localStorage.setItem(
              "neurolint-live-sessions",
              JSON.stringify(updated),
            );
          } catch (error) {
            console.warn("Failed to save session to localStorage:", error);
          }

          return updated;
        });

        setSelectedSession(newSession.id);

        if (newSession.currentCode) {
          setCurrentCode(newSession.currentCode);
        }

        // Send session creation to backend for persistence
        try {
          fetch("/api/sessions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-user-id": user?.id || "",
            },
            body: JSON.stringify(newSession),
          }).catch((error) => {
            console.warn("Failed to persist session to backend:", error);
          });
        } catch (error) {
          console.warn("Failed to create session on backend:", error);
        }

        console.log("Session created successfully:", newSession.id);
      } catch (error) {
        console.error("Failed to create session:", error);
        setError(
          error instanceof Error ? error.message : "Failed to create session",
        );
      }
    },
    [
      isAuthenticated,
      activeSessions.length,
      sessionSettings.maxParticipants,
      teamParticipants,
    ],
  );

  // Handle code changes with validation, persistence, and real-time sync
  const handleCodeChange = useCallback(
    (newCode: string) => {
      try {
        // Validate code length (prevent memory issues)
        if (newCode.length > 100000) {
          setError("Code too large (max 100,000 characters)");
          return;
        }

        setCurrentCode(newCode);
        setError(null);

        if (sessionSettings.autoSave && selectedSession && mountedRef.current) {
          // Update local session state
          setActiveSessions((prev) => {
            const updated = prev.map((session) =>
              session.id === selectedSession
                ? { ...session, currentCode: newCode }
                : session,
            );

            // Persist to localStorage
            try {
              localStorage.setItem(
                "neurolint-live-sessions",
                JSON.stringify(updated),
              );
            } catch (error) {
              console.warn("Failed to save session to localStorage:", error);
            }

            return updated;
          });

          // Broadcast changes to other collaborators via WebSocket
          sendWebSocketMessage({
            type: "code_update",
            code: newCode,
            userId: user?.id,
            sessionId: selectedSession,
            timestamp: Date.now(),
          });
        }
      } catch (error) {
        console.error("Error handling code change:", error);
        setError("Failed to update code");
      }
    },
    [sessionSettings.autoSave, selectedSession, sendWebSocketMessage, user?.id],
  );

  // Early return for loading and error states
  if (authLoading || isInitializing) {
    return (
      <div
        className="min-h-screen bg-black p-6 flex items-center justify-center"
        role="status"
        aria-live="polite"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-zinc-700 border-t-white"></div>
          <div className="text-white text-lg">Loading live sessions...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Authentication Required
          </h2>
          <p className="text-zinc-400 mb-6">
            Please sign in to access live code sessions.
          </p>
          <Button onClick={() => (window.location.href = "/dashboard")}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (teamsLoading || teamLoading) {
    return (
      <div
        className="min-h-screen bg-black p-6 flex items-center justify-center"
        role="status"
        aria-live="polite"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-zinc-700 border-t-white"></div>
          <div className="text-white text-lg">Loading team data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Page Header */}
      <div className="border-b border-zinc-800 bg-zinc-900/50 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
              className="text-zinc-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <div className="flex items-center gap-3">
            {/* Connection Status */}
            {selectedSession && (
              <div className="flex items-center gap-2 px-3 py-1 bg-zinc-800 rounded border border-zinc-600">
                <div
                  className={`w-2 h-2 rounded-full ${
                    wsConnected
                      ? "bg-white"
                      : wsError
                        ? "bg-zinc-400"
                        : "bg-zinc-500"
                  }`}
                />
                <span className="text-xs text-zinc-300">
                  {wsConnected
                    ? `Live (${collaborators.length + 1})`
                    : wsError
                      ? "Reconnecting..."
                      : "Connecting..."}
                </span>
              </div>
            )}

            {teams && teams.length > 0 && (
              <select
                value={selectedTeamId}
                onChange={(e) => setSelectedTeamId(e.target.value)}
                className="bg-zinc-800 text-white px-3 py-1 rounded border border-zinc-600 text-sm"
              >
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            )}
            <Button
              size="sm"
              className="bg-white text-black hover:bg-zinc-200"
              onClick={() =>
                createSession({
                  name: `Team Session - ${new Date().toLocaleTimeString()}`,
                })
              }
            >
              <Play className="w-4 h-4 mr-2" />
              Start Session
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Error Display */}
        {error && (
          <Alert className="mb-6 border-zinc-600 bg-zinc-900/20 text-zinc-300">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="ml-2">
              {error}
              <Button
                variant="ghost"
                size="sm"
                className="ml-4 text-zinc-400 hover:text-zinc-300"
                onClick={() => setError(null)}
              >
                Dismiss
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Active Sessions Panel */}
          <div className="lg:col-span-1">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Users className="w-5 h-5" />
                  Active Sessions ({activeSessions.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activeSessions.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Code className="w-8 h-8 text-zinc-600" />
                    </div>
                    <p className="text-zinc-400 text-sm">No active sessions</p>
                    <p className="text-zinc-500 text-xs mt-1">
                      Start a new session to collaborate
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeSessions.map((session) => (
                      <div
                        key={session.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedSession === session.id
                            ? "bg-zinc-700 border-white"
                            : "bg-zinc-800 border-zinc-700 hover:bg-zinc-750"
                        }`}
                        onClick={() => setSelectedSession(session.id)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium text-sm">
                            {session.name}
                          </span>
                          <Badge
                            className={
                              session.isActive
                                ? "bg-zinc-900 text-zinc-200"
                                : "bg-zinc-900 text-zinc-200"
                            }
                          >
                            {session.isActive ? "Live" : "Paused"}
                          </Badge>
                        </div>
                        <p className="text-zinc-400 text-xs">
                          {session.repository}/{session.branch}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex -space-x-1">
                            {session.participants
                              .slice(0, 3)
                              .map((participant) => (
                                <Avatar
                                  key={participant.id}
                                  className="w-6 h-6 border-2 border-zinc-800"
                                >
                                  <AvatarFallback className="text-xs bg-zinc-700">
                                    {participant.name
                                      .substring(0, 2)
                                      .toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                              ))}
                          </div>
                          <span className="text-zinc-500 text-xs">
                            {session.participants.length} participants
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Team Members */}
            <Card className="bg-zinc-900 border-zinc-800 mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Users className="w-5 h-5" />
                  Team Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                {teamParticipants.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-zinc-400 text-sm">No team members</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {teamParticipants.map((participant) => (
                      <div
                        key={participant.id}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-800"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-zinc-700">
                              {participant.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-white text-sm font-medium">
                              {participant.name}
                            </p>
                            <p className="text-zinc-400 text-xs">
                              {participant.role}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <div
                            className={`w-2 h-2 rounded-full ${participant.isOnline ? "bg-white" : "bg-zinc-600"}`}
                          />
                          <span className="text-xs text-zinc-500">
                            {participant.isOnline ? "Online" : "Offline"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* NeuroLint Layers Panel */}
          <div className="lg:col-span-1">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Layers className="w-5 h-5 text-white" />
                  NeuroLint Analysis
                  {isAnalyzing && (
                    <Badge className="bg-zinc-800 text-white">Running</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {layerAnalysis.map((layer) => (
                    <div
                      key={layer.layerId}
                      className="p-3 bg-zinc-800 rounded-lg border-l-4"
                      style={{
                        borderLeftColor:
                          layer.status === "success"
                            ? "#ffffff"
                            : layer.status === "error"
                              ? "#a1a1aa"
                              : layer.status === "running"
                                ? "#d4d4d8"
                                : "#71717a",
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium text-sm">
                          Layer {layer.layerId}: {layer.name}
                        </span>
                        <div className="flex items-center gap-1">
                          {layer.status === "success" && (
                            <CheckCircle className="w-4 h-4 text-white" />
                          )}
                          {layer.status === "error" && (
                            <AlertCircle className="w-4 h-4 text-zinc-400" />
                          )}
                          {layer.status === "running" && (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          )}
                        </div>
                      </div>
                      {layer.result && (
                        <div className="space-y-1">
                          <p className="text-zinc-400 text-xs">
                            {layer.result.description || layer.result.message}
                          </p>
                          {layer.result.changeCount &&
                            layer.result.changeCount > 0 && (
                              <Badge className="text-xs bg-zinc-800 text-zinc-300">
                                {layer.result.changeCount} improvements
                              </Badge>
                            )}
                          {layer.result.executionTime && (
                            <span className="text-zinc-500 text-xs">
                              {layer.result.executionTime}ms
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-700 space-y-2">
                  <Button
                    size="sm"
                    onClick={() => runLayerAnalysis(currentCode)}
                    disabled={isAnalyzing || !currentCode.trim()}
                    className="w-full bg-white text-black hover:bg-zinc-200"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    {isAnalyzing ? "Analyzing..." : "Run Analysis"}
                  </Button>
                  <div className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={autoAnalysis}
                      onChange={(e) => setAutoAnalysis(e.target.checked)}
                      className="w-3 h-3"
                    />
                    <label className="text-zinc-400">Auto-run analysis</label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Session Area */}
          <div className="lg:col-span-2">
            {selectedSession ? (
              <Card className="bg-zinc-900 border-zinc-800 h-full">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-2">
                      <Code className="w-5 h-5" />
                      Session Workspace
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const shareUrl = `${window.location.origin}/team/live-sessions?session=${selectedSession}`;
                          navigator.clipboard.writeText(shareUrl);

                          // Show success feedback
                          const button =
                            document.activeElement as HTMLButtonElement;
                          const originalText = button.textContent;
                          button.textContent = "Copied!";
                          setTimeout(() => {
                            if (button) button.textContent = originalText;
                          }, 2000);
                        }}
                      >
                        <Share className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSettingsOpen(true)}
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-zinc-950 rounded-lg p-4 min-h-[400px]">
                    <div className="flex items-center justify-between mb-4 p-2 bg-zinc-900 rounded">
                      <div className="flex items-center gap-2">
                        <Code className="w-4 h-4 text-white" />
                        <span className="text-white text-sm font-medium">
                          Live Code Editor
                        </span>
                        <Badge className="bg-zinc-800 text-zinc-300 text-xs">
                          NeuroLint Active
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => runLayerAnalysis(currentCode)}
                          disabled={isAnalyzing || !currentCode.trim()}
                        >
                          <Target className="w-3 h-3 mr-1" />
                          Analyze
                        </Button>
                      </div>
                    </div>
                    <textarea
                      value={currentCode}
                      onChange={(e) => handleCodeChange(e.target.value)}
                      placeholder="// Start typing your code here...
// NeuroLint will analyze in real-time with 6 layers:
// 1. Configuration validation
// 2. Entity cleanup
// 3. Component structure
// 4. Hydration patterns
// 5. Next.js optimization
// 6. Testing & quality

export default function Component() {
  return <div>Hello World</div>;
}"
                      className="w-full h-80 bg-zinc-950 text-white p-4 rounded border border-zinc-700 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-white"
                    />
                    <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
                      <span>
                        {currentCode.split("\n").length} lines •{" "}
                        {currentCode.length} characters
                      </span>
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-white rounded-full" />
                          Real-time analysis
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {teamParticipants.length} collaborators
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-zinc-900 border-zinc-800 h-full">
                <CardContent className="flex items-center justify-center min-h-[500px]">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Play className="w-10 h-10 text-zinc-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Start Your First Live Session
                    </h3>
                    <p className="text-zinc-400 mb-6 max-w-md">
                      Collaborate with your team in real-time. Share code, debug
                      together, and boost productivity with live coding
                      sessions.
                    </p>
                    <Button
                      className="bg-white text-black hover:bg-zinc-200"
                      onClick={() =>
                        createSession({
                          name: `New Session - ${new Date().toLocaleTimeString()}`,
                        })
                      }
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Create New Session
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Session Controls */}
        {selectedSession && (
          <Card className="bg-zinc-900 border-zinc-800 mt-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setMicEnabled(!micEnabled)}
                    className={micEnabled ? "bg-zinc-700 border-zinc-600" : ""}
                  >
                    {micEnabled ? (
                      <Mic className="w-4 h-4 mr-2" />
                    ) : (
                      <MicOff className="w-4 h-4 mr-2" />
                    )}
                    {micEnabled ? "Mic On" : "Mic Off"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setVideoEnabled(!videoEnabled)}
                    className={
                      videoEnabled ? "bg-zinc-700 border-zinc-600" : ""
                    }
                  >
                    {videoEnabled ? (
                      <Video className="w-4 h-4 mr-2" />
                    ) : (
                      <VideoOff className="w-4 h-4 mr-2" />
                    )}
                    {videoEnabled ? "Video On" : "Video Off"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setChatOpen(!chatOpen)}
                    className={chatOpen ? "bg-zinc-700 border-zinc-600" : ""}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {chatOpen ? "Hide Chat" : "Show Chat"}
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setActiveSessions((prev) =>
                        prev.map((session) =>
                          session.id === selectedSession
                            ? { ...session, isActive: !session.isActive }
                            : session,
                        ),
                      );
                    }}
                  >
                    <Pause className="w-4 h-4 mr-2" />
                    {activeSessions.find((s) => s.id === selectedSession)
                      ?.isActive
                      ? "Pause Session"
                      : "Resume Session"}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      if (selectedSession) {
                        setActiveSessions((prev) =>
                          prev.filter(
                            (session) => session.id !== selectedSession,
                          ),
                        );
                        setSelectedSession(null);
                        setCurrentCode("");
                        setLayerAnalysis((prev) =>
                          prev.map((layer) => ({
                            ...layer,
                            status: "pending",
                            result: undefined,
                          })),
                        );
                      }
                    }}
                  >
                    End Session
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Settings Modal */}
        {settingsOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="bg-zinc-900 border-zinc-800 max-w-md w-full mx-4">
              <CardHeader>
                <CardTitle className="text-white">Session Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-white text-sm font-medium">
                    Max Participants
                  </label>
                  <input
                    type="number"
                    value={sessionSettings.maxParticipants}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (isNaN(value) || value < 1 || value > 50) return;
                      setSessionSettings((prev) => ({
                        ...prev,
                        maxParticipants: value,
                      }));
                    }}
                    className="w-full mt-1 p-2 bg-zinc-800 text-white rounded border border-zinc-600"
                    min="1"
                    max="50"
                    aria-describedby="max-participants-help"
                  />
                  <div
                    id="max-participants-help"
                    className="text-xs text-zinc-500 mt-1"
                  >
                    Between 1 and 50 participants
                  </div>
                </div>
                <div>
                  <label className="text-white text-sm font-medium">
                    Analysis Delay (ms)
                  </label>
                  <input
                    type="number"
                    value={sessionSettings.analysisDelay}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (isNaN(value) || value < 100 || value > 5000) return;
                      setSessionSettings((prev) => ({
                        ...prev,
                        analysisDelay: value,
                      }));
                    }}
                    className="w-full mt-1 p-2 bg-zinc-800 text-white rounded border border-zinc-600"
                    min="100"
                    max="5000"
                    step="100"
                    aria-describedby="delay-help"
                  />
                  <div id="delay-help" className="text-xs text-zinc-500 mt-1">
                    Between 100ms and 5000ms
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={sessionSettings.autoSave}
                    onChange={(e) =>
                      setSessionSettings((prev) => ({
                        ...prev,
                        autoSave: e.target.checked,
                      }))
                    }
                    className="w-4 h-4"
                  />
                  <label className="text-white text-sm">
                    Auto-save code to session
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={autoAnalysis}
                    onChange={(e) => setAutoAnalysis(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label className="text-white text-sm">
                    Auto-run NeuroLint analysis
                  </label>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setSettingsOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => setSettingsOpen(false)}>
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveCodeSessions;
