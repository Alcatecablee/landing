import React, {
  ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { supabase, type User, type AuthError } from "@/lib/supabase";
import type {
  AuthError as SupabaseAuthError,
  User as SupabaseUser,
} from "@supabase/supabase-js";

// Safety check for React
if (!React || typeof React.useState !== "function") {
  throw new Error("React is not properly loaded. Please check your imports.");
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
  ) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  // Safety check for environment
  const isValidEnvironment = React.useMemo(() => {
    return (
      typeof window !== "undefined" &&
      typeof fetch !== "undefined" &&
      window.location &&
      window.location.origin &&
      window.location.protocol !== "file:"
    );
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Get initial session with timeout
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Session timeout")), 5000),
        );

        const {
          data: { session },
        } = (await Promise.race([sessionPromise, timeoutPromise])) as any;

        if (session?.user) {
          await updateUserProfile(session.user);
        }
      } catch (error) {
        console.debug(
          "Auth initialization skipped:",
          error instanceof Error ? error.message : "Unknown error",
        );
        // Don't block the app if auth initialization fails
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (session?.user) {
          await updateUserProfile(session.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.debug(
          "Auth state change error:",
          error instanceof Error ? error.message : "Unknown error",
        );
        // Set user to null even if there's an error
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const updateUserProfile = async (supabaseUser: SupabaseUser) => {
    // Always create the mapped user first
    const mappedUser: User = {
      id: supabaseUser.id,
      email: supabaseUser.email || "",
      user_metadata: {
        full_name:
          supabaseUser.user_metadata?.full_name ||
          supabaseUser.email?.split("@")[0],
        avatar_url: supabaseUser.user_metadata?.avatar_url,
      },
      app_metadata: {
        plan_type: supabaseUser.app_metadata?.plan_type || "free",
        monthly_transformations_used:
          supabaseUser.app_metadata?.monthly_transformations_used || 0,
        monthly_limit: supabaseUser.app_metadata?.monthly_limit || 25,
      },
    };

    // Set user immediately to avoid blocking the UI
    setUser(mappedUser);

    // Try to sync with database in the background (optional)
    // This is completely optional and won't block authentication
    setTimeout(async () => {
      try {
        // Check if we're in a valid environment
        if (!isValidEnvironment) {
          console.debug("Skipping user sync: invalid environment");
          return;
        }

        // Simple health check with better error handling
        const healthController = new AbortController();
        const healthTimeout = setTimeout(() => healthController.abort(), 2000);

        let healthResponse: Response | null = null;
        try {
          healthResponse = await fetch("/api/health", {
            method: "GET",
            signal: healthController.signal,
            credentials: "same-origin",
          });
        } catch (fetchError) {
          clearTimeout(healthTimeout);
          // Network error, server down, or CORS issue
          console.debug(
            "Health check failed:",
            fetchError instanceof Error ? fetchError.message : "Network error",
          );
          return;
        }
        clearTimeout(healthTimeout);

        if (!healthResponse || !healthResponse.ok) {
          console.debug("Health check failed: server not responding properly");
          return;
        }

        // Sync user data
        const syncController = new AbortController();
        const syncTimeout = setTimeout(() => syncController.abort(), 3000);

        let syncResponse: Response | null = null;
        try {
          syncResponse = await fetch("/api/auth/sync-user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: supabaseUser.id,
              email: supabaseUser.email,
              user_metadata: supabaseUser.user_metadata,
            }),
            signal: syncController.signal,
            credentials: "same-origin",
          });
        } catch (syncError) {
          clearTimeout(syncTimeout);
          console.debug(
            "User sync failed:",
            syncError instanceof Error ? syncError.message : "Network error",
          );
          return;
        }
        clearTimeout(syncTimeout);

        if (syncResponse?.ok) {
          try {
            const syncedUser = await syncResponse.json();
            console.debug(
              "User synced successfully with database:",
              syncedUser.id,
            );
          } catch (parseError) {
            console.debug(
              "User sync response parsing failed:",
              parseError instanceof Error ? parseError.message : "Parse error",
            );
          }
        } else {
          console.debug("User sync failed: server response not ok");
        }
      } catch (error) {
        // Silently handle all sync failures - user is already set with local data
        console.debug(
          "User sync completely failed:",
          error instanceof Error ? error.message : "Unknown error",
        );
      }
    }, 500); // Increased delay to let everything settle
  };

  const signIn = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        await updateUserProfile(data.user);
        return { success: true };
      }

      return { success: false, error: "Sign in failed" };
    } catch (error) {
      return { success: false, error: "Network error" };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            plan_type: "free",
            monthly_transformations_used: 0,
            monthly_limit: 25,
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        // User will be updated via onAuthStateChange
        return { success: true };
      }

      return { success: false, error: "Registration failed" };
    } catch (error) {
      return { success: false, error: "Network error" };
    }
  };

  const updateUser = async () => {
    const {
      data: { user: supabaseUser },
    } = await supabase.auth.getUser();

    if (supabaseUser) {
      await updateUserProfile(supabaseUser);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    signIn,
    signUp,
    signOut,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
