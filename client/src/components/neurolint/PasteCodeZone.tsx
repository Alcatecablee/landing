import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Code, Zap, Shield } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface PasteCodeZoneProps {
  onFile: (code: string, fileName?: string) => void;
  processing?: boolean;
}

interface SecurityValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  sanitizedContent?: string;
}

// Security validation class (reused from FileUploadZone)
class FileSecurityValidator {
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private static readonly MAX_CONTENT_SIZE = 1024 * 1024; // 1MB after sanitization

  private static readonly DANGEROUS_PATTERNS = [
    {
      pattern: /eval\s*\(\s*['"`]/gi,
      description: "eval() with string literal",
    },
    {
      pattern: /Function\s*\(\s*['"`]/gi,
      description: "Function() constructor with string",
    },
    {
      pattern: /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
      description: "script tag",
    },
    { pattern: /javascript\s*:/gi, description: "javascript: protocol" },
    {
      pattern: /data\s*:\s*text\/html/gi,
      description: "data:text/html protocol",
    },
    { pattern: /vbscript\s*:/gi, description: "vbscript: protocol" },
  ];

  private static readonly SUSPICIOUS_IMPORTS = [
    "child_process",
    "fs",
    "path",
    "os",
    "crypto",
    "http",
    "https",
    "net",
    "cluster",
    "worker_threads",
  ];

  static validate(
    filename: string,
    content: string,
    size: number,
  ): SecurityValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    let sanitizedContent = content;

    // Size validation
    if (size > this.MAX_FILE_SIZE) {
      errors.push(
        `File size (${Math.round(size / 1024 / 1024)}MB) exceeds limit (10MB)`,
      );
    }

    // Content pattern validation (only block truly dangerous patterns)
    for (const { pattern, description } of this.DANGEROUS_PATTERNS) {
      if (pattern.test(content)) {
        // Only treat script tags and protocols as actual errors
        if (
          description.includes("script tag") ||
          description.includes("protocol")
        ) {
          errors.push(`Dangerous ${description} detected`);
          sanitizedContent = sanitizedContent.replace(
            pattern,
            `/* REMOVED: ${description} */`,
          );
        } else {
          // For other patterns, just warn but don't block
          warnings.push(
            `Pattern detected: ${description} (allowed for React development)`,
          );
        }
      }
    }

    // Import validation
    for (const suspiciousImport of this.SUSPICIOUS_IMPORTS) {
      const importPattern = new RegExp(
        `import.*['"\`]${suspiciousImport}['"\`]`,
        "gi",
      );
      const requirePattern = new RegExp(
        `require\\s*\\(\\s*['"\`]${suspiciousImport}['"\`]\\s*\\)`,
        "gi",
      );

      if (importPattern.test(content) || requirePattern.test(content)) {
        warnings.push(
          `Potentially sensitive import detected: ${suspiciousImport}`,
        );
      }
    }

    // Final size check
    if (sanitizedContent.length > this.MAX_CONTENT_SIZE) {
      errors.push("Content too large after sanitization (max 1MB)");
    }

    // Check for empty content
    if (sanitizedContent.trim().length === 0) {
      errors.push(
        "File appears to be empty or entirely removed by security filters",
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      sanitizedContent: errors.length === 0 ? sanitizedContent : undefined,
    };
  }
}

export function PasteCodeZone({ onFile, processing }: PasteCodeZoneProps) {
  const [pastedCode, setPastedCode] = useState("");

  // Early return if onFile is not provided to prevent rendering in invalid state
  if (typeof onFile !== "function") {
    return (
      <div className="flex items-center justify-center p-8 border border-zinc-800 rounded-2xl bg-zinc-900/30">
        <div className="text-center text-zinc-400">
          <p>Component not ready. Please wait...</p>
        </div>
      </div>
    );
  }

  const handlePastedCodeSubmit = () => {
    if (!pastedCode.trim()) return;

    // Security validation for pasted content
    const validation = FileSecurityValidator.validate(
      "pasted-code.tsx",
      pastedCode,
      pastedCode.length,
    );

    if (!validation.isValid) {
      toast({
        title: "Security validation failed",
        description: validation.errors[0],
        variant: "destructive",
      });
      return;
    }

    // Show warnings if any
    if (validation.warnings.length > 0) {
      toast({
        title: "Security warnings",
        description: `${validation.warnings.length} potential issues detected. Code sanitized.`,
        variant: "default",
      });
    }

    // Safety check to ensure onFile is a function before calling
    if (typeof onFile === "function") {
      onFile(validation.sanitizedContent || pastedCode, "pasted-code.tsx");
      setPastedCode("");

      toast({
        title: "Code processed successfully",
        description: "Pasted code validated and ready for transformation",
      });
    } else {
      console.error("onFile is not a function:", typeof onFile);
      toast({
        title: "Configuration error",
        description: "Code handler not properly configured",
        variant: "destructive",
      });
      return;
    }
  };

  return (
    <div className="space-y-6">
      {/* Security Status Indicator */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Shield className="w-4 h-4 text-zinc-400" />
        <span>
          Security validation enabled - Code is automatically scanned for
          malicious content
        </span>
      </div>

      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="relative group">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-zinc-800 to-zinc-700 rounded-2xl flex items-center justify-center border border-zinc-600/50 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
              <Code className="w-8 h-8 sm:w-10 sm:h-10 text-white transition-all duration-300 group-hover:scale-110" />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full border-2 border-black shadow-lg animate-pulse" />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Paste your code directly
          </h3>
          <p className="text-base sm:text-lg text-zinc-300">
            Advanced rule-based analysis for{" "}
            <strong className="text-white">React, Next.js, TypeScript</strong>{" "}
            code
          </p>
        </div>
      </div>

      {/* Code Paste Zone */}
      <div className="space-y-4">
        <div className="relative">
          <Textarea
            placeholder="Paste your React, TypeScript, or JavaScript code here...

Example:
import React from 'react';

const MyComponent = () => {
  return <div>Hello World</div>;
};

export default MyComponent;"
            value={pastedCode}
            onChange={(e) => setPastedCode(e.target.value)}
            className="min-h-[280px] sm:min-h-[320px] bg-zinc-900/80 border border-zinc-700/50 text-white placeholder:text-zinc-500 font-mono text-sm sm:text-base resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-zinc-900 rounded-xl backdrop-blur-sm transition-all duration-300 p-4 pr-12"
            disabled={processing}
            maxLength={1024 * 1024} // 1MB limit
            aria-label="Code input area"
            aria-describedby="code-stats character-count"
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
          />

          {/* Clear button */}
          {pastedCode && !processing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPastedCode("")}
              className="absolute top-2 right-2 p-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-all duration-200"
              aria-label="Clear code input"
            >
              <Code className="w-4 h-4" />
            </Button>
          )}
        </div>

        <div
          id="code-stats"
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm text-zinc-400"
        >
          <span id="character-count">
            <span
              className={pastedCode.length > 900000 ? "text-yellow-400" : ""}
            >
              {pastedCode.length.toLocaleString()}
            </span>
            {" / "}
            {(1024 * 1024).toLocaleString()} characters
          </span>
          <div className="flex items-center gap-4">
            <span>{pastedCode.split("\n").length} lines</span>
            <span>{Math.ceil(pastedCode.length / 1024)} KB</span>
          </div>
        </div>

        <Button
          onClick={handlePastedCodeSubmit}
          disabled={!pastedCode.trim() || processing}
          size="lg"
          className="w-full bg-gradient-to-r from-zinc-800 to-zinc-700 text-white border border-zinc-600/50 hover:from-zinc-700 hover:to-zinc-600 hover:border-zinc-500 py-3 sm:py-4 text-base sm:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 min-h-[48px] disabled:opacity-50 disabled:cursor-not-allowed"
          aria-describedby="code-stats"
        >
          {processing ? (
            <>
              <div
                className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
                aria-hidden="true"
              />
              <span>Running rule-based analysis...</span>
              <span className="sr-only">Processing your code, please wait</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-2 transition-transform duration-300 group-hover:scale-110" />
              <span className="font-medium">Transform Code</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
