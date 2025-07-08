import { WebSocket, WebSocketServer } from "ws";
import { IncomingMessage } from "http";
import { parse } from "url";

interface SessionConnection {
  ws: WebSocket;
  userId: string;
  sessionId: string;
  isAlive: boolean;
}

class LiveSessionsWebSocketServer {
  private wss: WebSocketServer;
  private sessions: Map<string, SessionConnection[]> = new Map();
  private connections: Set<SessionConnection> = new Set();

  constructor(server: any) {
    this.wss = new WebSocketServer({
      server,
      path: "/ws/sessions",
      verifyClient: (info) => {
        // Basic URL parsing to extract session ID
        const url = parse(info.req.url || "", true);
        const pathParts = url.pathname?.split("/") || [];
        return (
          pathParts.length >= 4 &&
          pathParts[1] === "ws" &&
          pathParts[2] === "sessions"
        );
      },
    });

    this.wss.on("connection", this.handleConnection.bind(this));
    this.startHeartbeat();
  }

  private handleConnection(ws: WebSocket, req: IncomingMessage) {
    const url = parse(req.url || "", true);
    const pathParts = url.pathname?.split("/") || [];
    const sessionId = pathParts[3];

    if (!sessionId) {
      ws.close(1008, "Session ID required");
      return;
    }

    // Extract user ID from headers (should be set by auth middleware)
    const userId = (req.headers["x-user-id"] as string) || "anonymous";

    const connection: SessionConnection = {
      ws,
      userId,
      sessionId,
      isAlive: true,
    };

    this.connections.add(connection);

    // Add to session
    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, []);
    }
    this.sessions.get(sessionId)!.push(connection);

    console.log(`User ${userId} joined session ${sessionId}`);

    // Notify other participants
    this.broadcastToSession(
      sessionId,
      {
        type: "collaborator_joined",
        userId,
        timestamp: Date.now(),
      },
      userId,
    );

    // Send current participants list
    const participants =
      this.sessions.get(sessionId)?.map((conn) => conn.userId) || [];
    ws.send(
      JSON.stringify({
        type: "participants_list",
        participants,
        timestamp: Date.now(),
      }),
    );

    ws.on("message", (data) => {
      this.handleMessage(connection, data);
    });

    ws.on("pong", () => {
      connection.isAlive = true;
    });

    ws.on("close", () => {
      this.handleDisconnection(connection);
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
      this.handleDisconnection(connection);
    });
  }

  private handleMessage(connection: SessionConnection, data: any) {
    try {
      const message = JSON.parse(data.toString());
      const { sessionId, userId } = connection;

      // Validate message structure
      if (!message.type) {
        return;
      }

      // Add sender info and timestamp
      message.userId = userId;
      message.timestamp = Date.now();

      switch (message.type) {
        case "code_update":
          // Broadcast code changes to other participants
          this.broadcastToSession(sessionId, message, userId);
          break;

        case "cursor_update":
          // Broadcast cursor position changes
          this.broadcastToSession(sessionId, message, userId);
          break;

        case "analysis_request":
          // Could trigger server-side analysis and broadcast results
          // For now, just echo back to sender
          connection.ws.send(
            JSON.stringify({
              type: "analysis_result",
              requestId: message.requestId,
              status: "completed",
              timestamp: Date.now(),
            }),
          );
          break;

        case "chat_message":
          // Broadcast chat messages
          this.broadcastToSession(sessionId, message, userId);
          break;

        default:
          console.warn("Unknown message type:", message.type);
      }
    } catch (error) {
      console.error("Error handling WebSocket message:", error);
    }
  }

  private handleDisconnection(connection: SessionConnection) {
    const { sessionId, userId } = connection;

    this.connections.delete(connection);

    // Remove from session
    const sessionConnections = this.sessions.get(sessionId);
    if (sessionConnections) {
      const index = sessionConnections.indexOf(connection);
      if (index > -1) {
        sessionConnections.splice(index, 1);

        // Clean up empty sessions
        if (sessionConnections.length === 0) {
          this.sessions.delete(sessionId);
        } else {
          // Notify remaining participants
          this.broadcastToSession(sessionId, {
            type: "collaborator_left",
            userId,
            timestamp: Date.now(),
          });
        }
      }
    }

    console.log(`User ${userId} left session ${sessionId}`);
  }

  private broadcastToSession(
    sessionId: string,
    message: any,
    excludeUserId?: string,
  ) {
    const sessionConnections = this.sessions.get(sessionId);
    if (!sessionConnections) return;

    const messageStr = JSON.stringify(message);

    sessionConnections.forEach((connection) => {
      if (
        connection.userId !== excludeUserId &&
        connection.ws.readyState === WebSocket.OPEN
      ) {
        try {
          connection.ws.send(messageStr);
        } catch (error) {
          console.error("Error broadcasting message:", error);
          this.handleDisconnection(connection);
        }
      }
    });
  }

  private startHeartbeat() {
    setInterval(() => {
      this.connections.forEach((connection) => {
        if (!connection.isAlive) {
          console.log("Terminating dead connection");
          connection.ws.terminate();
          this.handleDisconnection(connection);
          return;
        }

        connection.isAlive = false;
        if (connection.ws.readyState === WebSocket.OPEN) {
          connection.ws.ping();
        }
      });
    }, 30000); // 30 seconds
  }

  public getStats() {
    return {
      totalConnections: this.connections.size,
      activeSessions: this.sessions.size,
      sessionDetails: Array.from(this.sessions.entries()).map(
        ([sessionId, connections]) => ({
          sessionId,
          participants: connections.length,
          users: connections.map((conn) => conn.userId),
        }),
      ),
    };
  }
}

export { LiveSessionsWebSocketServer };
