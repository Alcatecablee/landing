import { Button } from "@/components/ui/button";
import { Home, Mail, Zap, Settings, Code, Database } from "lucide-react";

export function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/3 -left-1/4 w-1/3 h-1/3 bg-zinc-900/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "5s" }}
        ></div>
        <div
          className="absolute bottom-1/3 -right-1/4 w-1/3 h-1/3 bg-zinc-800/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "7s", animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl w-full">
          {/* 404 Header */}
          <div className="mb-12 sm:mb-16 animate-fade-in-blur">
            <h1 className="text-7xl sm:text-8xl md:text-9xl font-black text-zinc-800 mb-6 animate-slide-in-down">
              404
            </h1>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 animate-slide-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              Looking for the App?
            </h2>
            <p
              className="text-lg sm:text-xl text-zinc-300 leading-relaxed max-w-2xl mx-auto px-4 animate-slide-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              The NeuroLint application is available at app.neurolint.dev. Get
              started with our advanced code analysis platform.
            </p>
          </div>

          {/* Call to Action */}
          <div
            className="bg-zinc-900/60 border border-zinc-700 rounded-2xl p-6 sm:p-8 mb-12 backdrop-blur-xl transform transition-all duration-500 hover:scale-[1.02] animate-slide-in-up"
            style={{ animationDelay: "0.6s" }}
          >
            <div className="mb-8">
              <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6 transform transition-all duration-300 hover:scale-110">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
                Ready to Get Started?
              </h3>
              <p className="text-zinc-400 max-w-lg mx-auto leading-relaxed">
                Access NeuroLint's powerful code analysis tools and start
                improving your code today.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Button
                onClick={() =>
                  window.open("https://app.neurolint.dev/dashboard", "_blank")
                }
                className="bg-white text-black font-semibold hover:bg-zinc-100 active:bg-zinc-200 px-6 sm:px-8 py-3 h-12 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex-1 sm:flex-none"
              >
                <Zap className="w-4 h-4 mr-2" />
                Go to App
              </Button>
              <Button
                onClick={() => (window.location.href = "/")}
                variant="outline"
                className="border-zinc-600 text-zinc-300 hover:text-white hover:border-zinc-500 hover:bg-zinc-800/50 px-6 sm:px-8 py-3 h-12 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex-1 sm:flex-none"
              >
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </div>
          </div>

          {/* Features Teaser */}
        </div>
      </div>
    </div>
  );
}
