import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { SignInButton } from "@/components/auth/SignInButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Sparkles } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div
        className="min-h-screen bg-black flex items-center justify-center"
        role="status"
        aria-live="polite"
        aria-label="Loading application"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-zinc-700 border-t-white transition-all duration-300"></div>
            <div className="animate-ping absolute inset-0 rounded-full h-12 w-12 border-4 border-white opacity-20"></div>
          </div>
          <div className="text-white text-sm font-medium animate-pulse">
            Initializing NeuroLint...
          </div>
        </div>
        <span className="sr-only">
          Loading NeuroLint application, please wait
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 sm:p-6">
        <Card className="w-full max-w-md bg-zinc-900/80 border-zinc-800/60 backdrop-blur-xl shadow-2xl animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
          <CardHeader className="text-center pb-4">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F5bfca0956849490eb780ab0a75998b6f%2F2d5a865290fc4ee18b2436780ac69040?format=webp&width=800"
              alt="NeuroLint Icon"
              className="mx-auto mb-6 w-20 h-20 animate-in zoom-in-50 duration-700 delay-200"
            />
            <CardTitle className="text-2xl sm:text-3xl font-bold text-white animate-in slide-in-from-bottom-2 duration-500 delay-300">
              Welcome to NeuroLint
            </CardTitle>
            <p className="text-zinc-400 text-sm sm:text-base animate-in slide-in-from-bottom-2 duration-500 delay-400">
              Sign in to experience Advanced Code Analysis
            </p>
          </CardHeader>
          <CardContent className="space-y-6 pt-2">
            <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-500 delay-500">
              <div className="flex flex-col items-center space-y-4">
                <SignInButton />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
