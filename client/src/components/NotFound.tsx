import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Mail } from "lucide-react";

interface NotFoundProps {
  onJoinWaitlist?: () => void;
}

export function NotFound({ onJoinWaitlist }: NotFoundProps) {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        {/* 404 Header */}
        <div className="mb-8">
          <h1 className="text-8xl md:text-9xl font-black text-zinc-800 mb-4">
            404
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            App Not Ready Yet
          </h2>
          <p className="text-xl text-zinc-300 leading-relaxed">
            The NeuroLint application is currently under development. We're
            working hard to bring you the most advanced code analysis platform.
          </p>
        </div>

        {/* Call to Action */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 mb-8 backdrop-blur-xl">
          <div className="mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Be the First to Know
            </h3>
            <p className="text-zinc-300">
              Join our waitlist to get notified when NeuroLint launches with
              exclusive early access.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={onJoinWaitlist}
              className="bg-white text-black font-bold hover:bg-gray-100 px-8 py-3"
            >
              <Mail className="w-4 h-4 mr-2" />
              Join Waitlist
            </Button>
            <Button
              onClick={() => (window.location.href = "/")}
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-600 px-8 py-3"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>

        {/* Features Teaser */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <div className="p-4 bg-zinc-900/30 rounded-xl border border-zinc-800">
            <h4 className="font-semibold text-white mb-2">
              🧠 Advanced AI Analysis
            </h4>
            <p className="text-zinc-400 text-sm">
              6-layer code analysis using cutting-edge AI and machine learning
            </p>
          </div>
          <div className="p-4 bg-zinc-900/30 rounded-xl border border-zinc-800">
            <h4 className="font-semibold text-white mb-2">
              ⚡ Real-time Feedback
            </h4>
            <p className="text-zinc-400 text-sm">
              Get instant suggestions and improvements as you code
            </p>
          </div>
          <div className="p-4 bg-zinc-900/30 rounded-xl border border-zinc-800">
            <h4 className="font-semibold text-white mb-2">🔧 Auto-fixes</h4>
            <p className="text-zinc-400 text-sm">
              Automatically apply code transformations and optimizations
            </p>
          </div>
          <div className="p-4 bg-zinc-900/30 rounded-xl border border-zinc-800">
            <h4 className="font-semibold text-white mb-2">
              🔌 IDE Integration
            </h4>
            <p className="text-zinc-400 text-sm">
              Seamless integration with VS Code, CLI, and API access
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-zinc-500 text-sm">
            Expected launch: Q1 2024 • Follow us for updates
          </p>
        </div>
      </div>
    </div>
  );
}
