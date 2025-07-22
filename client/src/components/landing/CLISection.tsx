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
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  const terminalLines = [
    "$ npm install -g @neurolint/cli",
    "Installing NeuroLint CLI...",
    "✓ Installation complete",
    "$ neurolint scan my-react-app",
    "NeuroLint - React & Next.js Modernization",
    "Analyzing legacy patterns...",
    "✓ Found 47 modernization opportunities",
    "$ neurolint modernize",
    "Modernization Plan:",
    "● React 16 → 18 upgrade (12 files)",
    "● Class to hooks conversion (8 components)",
    "● Next.js App Router migration (15 pages)",
    "● TypeScript config upgrade (1 file)",
    "● Deprecated pattern fixes (11 issues)",
    "$ neurolint migrate --react-18",
    "✓ Migrating to React 18...",
    "✓ Updated 12 files successfully",
    "✓ Migration complete",
  ];

  useEffect(() => {
    if (currentLineIndex >= terminalLines.length) return;

    let timeout: NodeJS.Timeout;
    const currentLine = terminalLines[currentLineIndex];
    const isCommand = currentLine.startsWith("$");
    const typingSpeed = isCommand ? 80 : 40;

    if (currentCharIndex < currentLine.length) {
      // Type next character
      timeout = setTimeout(() => {
        setCurrentText(currentLine.substring(0, currentCharIndex + 1));
        setCurrentCharIndex((prev) => prev + 1);
      }, typingSpeed);
    } else {
      // Line completed, wait then move to next line
      timeout = setTimeout(
        () => {
          setDisplayedLines((prev) => [...prev, currentLine]);
          setCurrentLineIndex((prev) => prev + 1);
          setCurrentCharIndex(0);
          setCurrentText("");
        },
        isCommand ? 1000 : 500,
      );
    }

    return () => clearTimeout(timeout);
  }, [currentLineIndex, currentCharIndex, terminalLines]);

  const renderLine = (line: string) => {
    if (line.startsWith("$ ")) {
      // Command line with syntax highlighting
      return (
        <div className="flex">
          <span className="text-green-400">$</span>
          <span className="text-blue-400 ml-2">npm</span>
          <span className="text-white ml-2">install -g</span>
          <span className="text-yellow-400 ml-2">@neurolint/cli</span>
        </div>
      );
    } else if (line.startsWith("$ neurolint login")) {
      return (
        <div className="flex">
          <span className="text-green-400">$</span>
          <span className="text-blue-400 ml-2">neurolint</span>
          <span className="text-white ml-2">login</span>
          <span className="text-cyan-400 ml-2">--enterprise</span>
        </div>
      );
    } else if (line.startsWith("$ neurolint enterprise")) {
      return (
        <div className="flex">
          <span className="text-green-400">$</span>
          <span className="text-blue-400 ml-2">neurolint</span>
          <span className="text-purple-400 ml-2">enterprise</span>
        </div>
      );
    } else if (line.startsWith("$ neurolint team")) {
      return (
        <div className="flex">
          <span className="text-green-400">$</span>
          <span className="text-blue-400 ml-2">neurolint</span>
          <span className="text-purple-400 ml-2">team</span>
          <span className="text-cyan-400 ml-2">--list</span>
        </div>
      );
    } else if (line.startsWith("✓")) {
      return <div className="text-green-400 pl-2">{line}</div>;
    } else if (line.startsWith("⚠")) {
      return <div className="text-yellow-400 pl-2">{line}</div>;
    } else if (
      line === "NeuroLint CLI" ||
      line === "NeuroLint Enterprise Features" ||
      line === "Teams:"
    ) {
      return <div className="text-white font-bold pl-2">{line}</div>;
    } else if (line.startsWith("●")) {
      return (
        <div className="text-gray-300 pl-4">
          <span className="text-green-400">●</span>
          <span className="ml-2">{line.substring(2)}</span>
        </div>
      );
    } else if (line.startsWith("  ")) {
      return <div className="text-gray-300 pl-6">{line}</div>;
    } else if (line.includes("neurolint") && line.includes(" - ")) {
      const [command, description] = line.split(" - ");
      return (
        <div className="text-gray-300 pl-2">
          <span className="text-cyan-400">{command}</span>
          <span> - {description}</span>
        </div>
      );
    } else {
      return <div className="text-gray-400 pl-2">{line}</div>;
    }
  };

  return (
    <div className="font-mono text-sm space-y-2 bg-black p-6 rounded-2xl border border-zinc-800 min-h-[400px]">
      {/* Completed lines */}
      {displayedLines.map((line, index) => (
        <div key={index}>{renderLine(line)}</div>
      ))}

      {/* Currently typing line */}
      {currentLineIndex < terminalLines.length && (
        <div className="flex items-center">
          <span className="text-white">{currentText}</span>
          <span className="text-green-400 ml-1 animate-pulse">█</span>
        </div>
      )}

      {/* Final prompt when done */}
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
            React Modernization CLI
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto font-medium">
            Automate React & Next.js modernization with safe, automated upgrades
            and technical debt analysis for legacy codebases.
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
                  href="https://docs.neurolint.dev/modernization"
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
                    React 18 Migration
                  </h4>
                </div>
                <p className="text-gray-300 leading-relaxed font-medium">
                  Automated class-to-hooks conversion and React 18 upgrades
                </p>
              </div>
              <div className="bg-black/70 backdrop-blur-xl p-6 rounded-3xl border-2 border-zinc-800/50 hover:border-zinc-600/80 transition-all duration-300 hover:bg-black/90 group">
                <div className="flex items-center gap-4 mb-3">
                  <BarChart3 className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
                  <h4 className="text-xl font-black text-white">
                    Technical Debt Analysis
                  </h4>
                </div>
                <p className="text-gray-300 leading-relaxed font-medium">
                  Detailed reports on legacy patterns and modernization opportunities
                </p>
              </div>
              <div className="bg-black/70 backdrop-blur-xl p-6 rounded-3xl border-2 border-zinc-800/50 hover:border-zinc-600/80 transition-all duration-300 hover:bg-black/90 group">
                <div className="flex items-center gap-4 mb-3">
                  <Key className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
                  <h4 className="text-xl font-black text-white">
                    Next.js App Router Migration
                  </h4>
                </div>
                <p className="text-gray-300 leading-relaxed font-medium">
                  Automated Pages Router to App Router conversion
                </p>
              </div>
              <div className="bg-black/70 backdrop-blur-xl p-6 rounded-3xl border-2 border-zinc-800/50 hover:border-zinc-600/80 transition-all duration-300 hover:bg-black/90 group">
                <div className="flex items-center gap-4 mb-3">
                  <FileText className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
                  <h4 className="text-xl font-black text-white">
                    Safe Migration Workflows
                  </h4>
                </div>
                <p className="text-gray-300 leading-relaxed font-medium">
                  Rollback protection and detailed diff previews
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
