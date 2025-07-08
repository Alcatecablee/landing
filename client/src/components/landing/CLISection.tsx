import React, { useState, useEffect } from "react";
import {
  Terminal,
  Users,
  BarChart3,
  Key,
  FileText,
  Download,
  ExternalLink,
  Monitor,
  Zap,
  Database,
  Shield,
  Settings,
  Webhook,
  Check,
} from "lucide-react";

interface TerminalLine {
  type: "command" | "output" | "success" | "warning" | "info";
  content: string;
  delay?: number;
  typingSpeed?: number;
}

const terminalSequence: TerminalLine[] = [
  {
    type: "command",
    content: "$ npm install -g @neurolint/cli",
    delay: 1000,
    typingSpeed: 80,
  },
  {
    type: "output",
    content: "Installing NeuroLint CLI...",
    delay: 500,
    typingSpeed: 30,
  },
  {
    type: "success",
    content: "✓ Installation complete",
    delay: 1500,
    typingSpeed: 40,
  },
  {
    type: "command",
    content: "$ neurolint login --enterprise",
    delay: 1000,
    typingSpeed: 90,
  },
  { type: "info", content: "NeuroLint CLI", delay: 300, typingSpeed: 50 },
  {
    type: "warning",
    content: "⚠ Enterprise authentication required.",
    delay: 200,
    typingSpeed: 35,
  },
  {
    type: "success",
    content: "✓ Authentication successful",
    delay: 2000,
    typingSpeed: 40,
  },
  {
    type: "command",
    content: "$ neurolint enterprise",
    delay: 800,
    typingSpeed: 85,
  },
  {
    type: "info",
    content: "NeuroLint Enterprise Features",
    delay: 300,
    typingSpeed: 45,
  },
  {
    type: "output",
    content: "neurolint team - Team management",
    delay: 100,
    typingSpeed: 25,
  },
  {
    type: "output",
    content: "neurolint analytics - Analytics and reporting",
    delay: 100,
    typingSpeed: 25,
  },
  {
    type: "output",
    content: "neurolint webhook - Webhook management",
    delay: 100,
    typingSpeed: 25,
  },
  {
    type: "output",
    content: "neurolint sso - Single Sign-On",
    delay: 100,
    typingSpeed: 25,
  },
  {
    type: "output",
    content: "neurolint audit - Audit trail and compliance",
    delay: 100,
    typingSpeed: 25,
  },
  {
    type: "command",
    content: "$ neurolint team --list",
    delay: 1200,
    typingSpeed: 95,
  },
  { type: "info", content: "Teams:", delay: 200, typingSpeed: 40 },
  {
    type: "output",
    content: "● Development Team (team-123)",
    delay: 300,
    typingSpeed: 30,
  },
  { type: "output", content: "  Members: 12", delay: 200, typingSpeed: 35 },
  { type: "output", content: "  SSO: Enabled", delay: 200, typingSpeed: 35 },
];

function TypingTerminal() {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (currentLineIndex >= terminalSequence.length) {
      setIsTyping(false);
      return;
    }

    const currentLine = terminalSequence[currentLineIndex];

    if (currentCharIndex === 0) {
      // Start typing a new line after delay
      const timer = setTimeout(() => {
        setIsTyping(true);
      }, currentLine.delay || 0);
      return () => clearTimeout(timer);
    }

    if (currentCharIndex <= currentLine.content.length) {
      const timer = setTimeout(() => {
        setDisplayedLines((prev) => {
          const newLines = [...prev];
          newLines[currentLineIndex] = currentLine.content.substring(
            0,
            currentCharIndex,
          );
          return newLines;
        });
        setCurrentCharIndex((prev) => prev + 1);
      }, currentLine.typingSpeed || 50);
      return () => clearTimeout(timer);
    } else {
      // Line completed, move to next line
      setCurrentLineIndex((prev) => prev + 1);
      setCurrentCharIndex(0);
      setIsTyping(false);
    }
  }, [currentLineIndex, currentCharIndex]);

  // Cursor blinking effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const renderLine = (
    content: string,
    index: number,
    isCurrentLine: boolean,
  ) => {
    const line = terminalSequence[index];
    if (!line) return null;

    const parts = content.split(
      /(\$|npm|neurolint|install|login|enterprise|team|--\w+|@\w+\/\w+|✓|⚠|●)/g,
    );

    return (
      <div key={index} className="flex items-center">
        {line.type === "command" && (
          <>
            <span className="text-green-400">$</span>
            <span className="ml-2">
              {parts.map((part, i) => {
                if (part === "npm" || part === "neurolint")
                  return (
                    <span key={i} className="text-blue-400">
                      {part}
                    </span>
                  );
                if (part.startsWith("--"))
                  return (
                    <span key={i} className="text-cyan-400">
                      {part}
                    </span>
                  );
                if (part.startsWith("@"))
                  return (
                    <span key={i} className="text-yellow-400">
                      {part}
                    </span>
                  );
                if (part === "enterprise" || part === "team")
                  return (
                    <span key={i} className="text-purple-400">
                      {part}
                    </span>
                  );
                return (
                  <span key={i} className="text-white">
                    {part}
                  </span>
                );
              })}
            </span>
          </>
        )}
        {line.type === "output" && (
          <span className="text-gray-300 pl-2">
            {parts.map((part, i) => {
              if (part === "neurolint" || part.startsWith("neurolint "))
                return (
                  <span key={i} className="text-cyan-400">
                    {part}
                  </span>
                );
              if (part === "●")
                return (
                  <span key={i} className="text-green-400">
                    {part}
                  </span>
                );
              return <span key={i}>{part}</span>;
            })}
          </span>
        )}
        {line.type === "success" && (
          <span className="text-green-400 pl-2">{content}</span>
        )}
        {line.type === "warning" && (
          <span className="text-yellow-400 pl-2">{content}</span>
        )}
        {line.type === "info" && (
          <span className="text-white font-bold pl-2">{content}</span>
        )}
        {isCurrentLine && isTyping && showCursor && (
          <span className="text-green-400 ml-1 animate-pulse">█</span>
        )}
      </div>
    );
  };

  return (
    <div className="font-mono text-sm space-y-3 bg-black p-6 rounded-2xl border border-zinc-800 min-h-[400px]">
      {displayedLines.map((line, index) =>
        renderLine(line, index, index === currentLineIndex - 1),
      )}
      {currentLineIndex >= terminalSequence.length && (
        <div className="flex items-center pt-1">
          <span className="text-green-400">$</span>
          <span className="text-green-400 ml-2 animate-pulse">█</span>
        </div>
      )}
    </div>
  );
}

export function CLISection() {
  const [copied, setCopied] = useState(false);

  const handleInstallClick = async () => {
    const installCommand = "npm install -g @neurolint/cli";

    try {
      await navigator.clipboard.writeText(installCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement("textarea");
      textArea.value = installCommand;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section className="py-24 px-4" role="region" aria-labelledby="cli-heading">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2
            id="cli-heading"
            className="text-5xl md:text-7xl font-black mb-8 tracking-tight text-white"
          >
            Enterprise CLI Tool
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto font-medium">
            Production-ready command line interface with robust error handling,
            team management, and enterprise-grade security features.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-black text-white tracking-tight">
                Install from NPM
              </h3>
              <div className="flex gap-4 flex-wrap">
                <button
                  onClick={handleInstallClick}
                  className="bg-white text-black px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-xl flex items-center gap-3"
                >
                  {copied ? (
                    <>
                      <Check className="w-6 h-6" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Download className="w-6 h-6" />
                      Install CLI
                    </>
                  )}
                </button>
                <a
                  href="https://docs.neurolint.dev/cli"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-2 border-zinc-800 text-white px-8 py-4 rounded-xl font-bold text-lg hover:border-zinc-600 transition-all duration-300 flex items-center gap-3"
                >
                  <ExternalLink className="w-5 h-5" />
                  View Documentation
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-black/70 backdrop-blur-xl p-6 rounded-3xl border-2 border-zinc-800/50 hover:border-zinc-600/80 transition-all duration-300 hover:bg-black/90 group">
                <div className="flex items-center gap-4 mb-3">
                  <Users className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
                  <h4 className="text-xl font-black text-white">
                    Team Management
                  </h4>
                </div>
                <p className="text-gray-300 leading-relaxed font-medium">
                  Complete team collaboration with role-based access
                </p>
              </div>
              <div className="bg-black/70 backdrop-blur-xl p-6 rounded-3xl border-2 border-zinc-800/50 hover:border-zinc-600/80 transition-all duration-300 hover:bg-black/90 group">
                <div className="flex items-center gap-4 mb-3">
                  <BarChart3 className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
                  <h4 className="text-xl font-black text-white">
                    Analytics & Reports
                  </h4>
                </div>
                <p className="text-gray-300 leading-relaxed font-medium">
                  Executive dashboards and compliance reporting
                </p>
              </div>
              <div className="bg-black/70 backdrop-blur-xl p-6 rounded-3xl border-2 border-zinc-800/50 hover:border-zinc-600/80 transition-all duration-300 hover:bg-black/90 group">
                <div className="flex items-center gap-4 mb-3">
                  <Key className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
                  <h4 className="text-xl font-black text-white">
                    SSO Integration
                  </h4>
                </div>
                <p className="text-gray-300 leading-relaxed font-medium">
                  SAML, OIDC, and OAuth2 enterprise authentication
                </p>
              </div>
              <div className="bg-black/70 backdrop-blur-xl p-6 rounded-3xl border-2 border-zinc-800/50 hover:border-zinc-600/80 transition-all duration-300 hover:bg-black/90 group">
                <div className="flex items-center gap-4 mb-3">
                  <FileText className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
                  <h4 className="text-xl font-black text-white">
                    Audit & Compliance
                  </h4>
                </div>
                <p className="text-gray-300 leading-relaxed font-medium">
                  SOC2, GDPR, ISO27001 compliance tracking
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#111111] border-2 border-zinc-800 rounded-3xl p-10 hover:border-zinc-600 transition-all duration-300 hover:bg-zinc-900/50">
            <div className="flex items-center gap-3 mb-6 text-sm text-gray-300">
              <Terminal className="w-5 h-5" />
              <span className="font-medium">Terminal</span>
              <div className="flex gap-2 ml-auto">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
            <TypingTerminal />
          </div>
        </div>
      </div>
    </section>
  );
}
