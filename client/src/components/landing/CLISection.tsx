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

function TypingTerminal() {
  const [currentText, setCurrentText] = useState("");
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isWaiting, setIsWaiting] = useState(false);

  const terminalLines = [
    "$ npm install -g @neurolint/cli",
    "Installing NeuroLint CLI...",
    "✓ Installation complete",
    "$ neurolint login --enterprise",
    "NeuroLint CLI",
    "⚠ Enterprise authentication required.",
    "✓ Authentication successful",
    "$ neurolint enterprise",
    "NeuroLint Enterprise Features",
    "neurolint team - Team management",
    "neurolint analytics - Analytics and reporting",
    "neurolint webhook - Webhook management",
    "neurolint sso - Single Sign-On",
    "neurolint audit - Audit trail and compliance",
    "$ neurolint team --list",
    "Teams:",
    "● Development Team (team-123)",
    "  Members: 12",
    "  SSO: Enabled",
  ];

  useEffect(() => {
    if (currentLineIndex >= terminalLines.length) return;

    let timeout: NodeJS.Timeout;
    const currentLine = terminalLines[currentLineIndex];
    const isCommand = currentLine.startsWith("$");
    const typingSpeed = isCommand ? 100 : 50;
    const lineDelay = isCommand ? 1000 : 300;

    if (currentCharIndex === 0 && !isWaiting) {
      // Wait before starting to type
      setIsWaiting(true);
      timeout = setTimeout(() => {
        setIsWaiting(false);
      }, lineDelay);
    } else if (!isWaiting && currentCharIndex < currentLine.length) {
      // Type next character
      timeout = setTimeout(() => {
        setCurrentText(currentLine.substring(0, currentCharIndex + 1));
        setCurrentCharIndex((prev) => prev + 1);
      }, typingSpeed);
    } else if (!isWaiting && currentCharIndex >= currentLine.length) {
      // Move to next line
      timeout = setTimeout(() => {
        setCurrentLineIndex((prev) => prev + 1);
        setCurrentCharIndex(0);
        setCurrentText("");
      }, 800);
    }

    return () => clearTimeout(timeout);
  }, [currentLineIndex, currentCharIndex, isWaiting, terminalLines]);

  const renderCompletedLines = () => {
    return terminalLines
      .slice(0, currentLineIndex)
      .map((line, index) => (
        <div key={index}>{renderTerminalLine(line, true)}</div>
      ));
  };

  const renderTerminalLine = (line: string, isComplete: boolean) => {
    const displayLine = isComplete ? line : currentText;

    if (line.startsWith("$")) {
      // Command line
      const parts = displayLine.split(" ");
      return (
        <div className="flex items-start">
          <span className="text-green-400">$</span>
          <span className="ml-2">
            {parts.slice(1).map((part, i) => {
              if (part === "npm" || part === "neurolint") {
                return (
                  <span key={i} className="text-blue-400">
                    {part}{" "}
                  </span>
                );
              }
              if (part.startsWith("--")) {
                return (
                  <span key={i} className="text-cyan-400">
                    {part}{" "}
                  </span>
                );
              }
              if (part.startsWith("@")) {
                return (
                  <span key={i} className="text-yellow-400">
                    {part}{" "}
                  </span>
                );
              }
              if (part === "enterprise" || part === "team") {
                return (
                  <span key={i} className="text-purple-400">
                    {part}{" "}
                  </span>
                );
              }
              return (
                <span key={i} className="text-white">
                  {part}{" "}
                </span>
              );
            })}
          </span>
        </div>
      );
    } else if (line.startsWith("✓")) {
      // Success message
      return <div className="text-green-400 pl-2">{displayLine}</div>;
    } else if (line.startsWith("⚠")) {
      // Warning message
      return <div className="text-yellow-400 pl-2">{displayLine}</div>;
    } else if (
      line === "NeuroLint CLI" ||
      line === "NeuroLint Enterprise Features" ||
      line === "Teams:"
    ) {
      // Headers
      return <div className="text-white font-bold pl-2">{displayLine}</div>;
    } else if (line.startsWith("●")) {
      // Team item
      return (
        <div className="text-gray-300 pl-4">
          <span className="text-green-400">●</span>
          <span className="ml-2">{displayLine.substring(2)}</span>
        </div>
      );
    } else if (line.startsWith("  ")) {
      // Indented info
      return <div className="text-gray-300 pl-6">{displayLine}</div>;
    } else if (line.includes("neurolint")) {
      // Command help
      const parts = displayLine.split(" - ");
      return (
        <div className="text-gray-300 pl-2">
          <span className="text-cyan-400">{parts[0]}</span>
          {parts[1] && <span> - {parts[1]}</span>}
        </div>
      );
    } else {
      // Regular output
      return <div className="text-gray-400 pl-2">{displayLine}</div>;
    }
  };

  return (
    <div className="font-mono text-sm space-y-2 bg-black p-6 rounded-2xl border border-zinc-800 min-h-[400px]">
      {renderCompletedLines()}
      {currentLineIndex < terminalLines.length && (
        <div className="flex items-center">
          {renderTerminalLine(terminalLines[currentLineIndex], false)}
          {!isWaiting && (
            <span className="text-green-400 ml-1 animate-pulse">█</span>
          )}
        </div>
      )}
      {currentLineIndex >= terminalLines.length && (
        <div className="flex items-center">
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
