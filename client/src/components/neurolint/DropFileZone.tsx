import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileCode, Zap, Shield } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface DropFileZoneProps {
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
  private static readonly ALLOWED_EXTENSIONS = [
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".json",
  ];

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
    { pattern: /on\w+\s*=/gi, description: "event handler attributes" },
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

    // Extension validation
    const extension = this.getFileExtension(filename);
    if (!this.ALLOWED_EXTENSIONS.includes(extension)) {
      errors.push(
        `File type '${extension}' not allowed. Use .js, .jsx, .ts, .tsx, or .json`,
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

  private static getFileExtension(filename: string): string {
    const lastDot = filename.lastIndexOf(".");
    return lastDot === -1 ? "" : filename.substring(lastDot).toLowerCase();
  }
}

export function DropFileZone({ onFile, processing }: DropFileZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Validate props on mount and prop changes
  React.useEffect(() => {
    if (typeof onFile !== "function") {
      console.warn(
        "DropFileZone: onFile prop is not a function. Type:",
        typeof onFile,
        "Value:",
        onFile,
      );
    }
  }, [onFile]);

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

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const file = files[0];

    // Pre-validation
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `File size (${Math.round(file.size / 1024 / 1024)}MB) exceeds 10MB limit`,
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      if (typeof ev.target?.result === "string") {
        const content = ev.target.result;

        // Security validation
        const validation = FileSecurityValidator.validate(
          file.name,
          content,
          file.size,
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
            description: `${validation.warnings.length} potential issues detected. Proceeding with caution.`,
            variant: "default",
          });
        }

        // Safety check to ensure onFile is a function before calling
        if (typeof onFile === "function") {
          try {
            onFile(validation.sanitizedContent || content, file.name);
          } catch (error) {
            console.error("Error calling onFile:", error);
            toast({
              title: "Processing error",
              description: "Failed to process file upload",
              variant: "destructive",
            });
            return;
          }
        } else {
          console.error(
            "onFile is not a function. Type:",
            typeof onFile,
            "Value:",
            onFile,
          );
          toast({
            title: "Configuration error",
            description: "File handler not properly configured",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "File uploaded successfully",
          description: `${file.name} validated and ready for transformation`,
        });
      }
    };

    reader.onerror = () => {
      toast({
        title: "File read error",
        description: "Failed to read the uploaded file",
        variant: "destructive",
      });
    };

    reader.readAsText(file);
  }

  return (
    <div className="space-y-6">
      {/* Security Status Indicator */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Shield className="w-4 h-4 text-zinc-400" />
        <span>
          Security validation enabled - Files are automatically scanned for
          malicious content
        </span>
      </div>

      {/* File Upload Zone */}
      <div
        className={`border-2 border-dashed border-zinc-800 rounded-2xl bg-zinc-900/30 py-12 sm:py-16 px-4 sm:px-8 flex flex-col items-center justify-center text-center shadow transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1) cursor-pointer will-change-transform touch-manipulation min-h-[280px] sm:min-h-[320px] ${
          processing
            ? "opacity-50 pointer-events-none animate-pulse"
            : "hover:border-white/50 hover:bg-zinc-900/40 hover:scale-[1.01] focus:border-blue-500 focus:bg-zinc-900/40 focus:scale-[1.01] active:scale-[0.99]"
        }`}
        onClick={() => !processing && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          e.currentTarget.classList.add("border-blue-500", "bg-zinc-900/50");
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.currentTarget.classList.remove("border-blue-500", "bg-zinc-900/50");
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.currentTarget.classList.remove("border-blue-500", "bg-zinc-900/50");
          if (!processing) {
            handleFiles(e.dataTransfer.files);
          }
        }}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !processing) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        tabIndex={0}
        role="button"
        aria-label={
          processing
            ? "Processing file upload"
            : "Upload code file for transformation. Supports JS, JSX, TS, TSX, and JSON files up to 10MB"
        }
        aria-disabled={processing}
        aria-describedby="upload-description"
      >
        <input
          type="file"
          ref={inputRef}
          className="sr-only"
          accept=".js,.jsx,.ts,.tsx,.json"
          onChange={(e) => handleFiles(e.target.files)}
          disabled={processing}
          aria-label="Upload JavaScript, TypeScript, or JSON file"
          aria-describedby="upload-description file-types"
        />

        <div className="flex flex-col items-center gap-4 mb-6">
          {processing ? (
            <div className="relative">
              <Zap className="w-12 h-12 sm:w-16 sm:h-16 text-white animate-pulse" />
              <div className="absolute inset-0 animate-ping">
                <Zap className="w-12 h-12 sm:w-16 sm:h-16 text-white opacity-30" />
              </div>
            </div>
          ) : (
            <div className="relative group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-zinc-800 to-zinc-700 rounded-2xl flex items-center justify-center border border-zinc-600/50 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <FileCode className="w-8 h-8 sm:w-10 sm:h-10 text-white transition-all duration-300 group-hover:scale-110" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full border-2 border-black shadow-lg animate-pulse" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
          )}

          <div className="text-xl sm:text-2xl font-bold text-white transition-all duration-300">
            {processing
              ? "Rule-based transformation in progress..."
              : "Drop your files here"}
          </div>
        </div>

        <div
          id="upload-description"
          className="text-base sm:text-lg text-zinc-300 mb-6 max-w-lg text-center"
        >
          {processing ? (
            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-white/80 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
              <span className="font-medium">
                Running 6-layer transformation pipeline
              </span>
            </div>
          ) : (
            <div className="space-y-2">
              <p>
                Advanced rule-based analysis for{" "}
                <strong className="text-white">
                  React, Next.js, TypeScript
                </strong>{" "}
                files
              </p>
              <p
                id="file-types"
                className="text-sm text-zinc-400 leading-relaxed"
              >
                Supports .js, .jsx, .ts, .tsx, .json files up to 10MB
                <br className="hidden sm:inline" />
                <span className="block sm:inline sm:ml-2">
                  Drag & drop or click to browse
                </span>
              </p>
            </div>
          )}
        </div>

        {!processing && (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current?.click();
            }}
            disabled={processing}
            size="lg"
            className="bg-gradient-to-r from-zinc-800 to-zinc-700 text-white border border-zinc-600/50 hover:from-zinc-700 hover:to-zinc-600 hover:border-zinc-500 px-6 py-3 sm:px-8 sm:py-4 shadow-lg hover:shadow-xl transition-all duration-300 min-h-[48px]"
            aria-describedby="file-types"
          >
            <Upload className="w-4 h-4 sm:w-5 sm:h-5 mr-2 transition-transform duration-300 group-hover:scale-110" />
            <span className="font-medium">Browse Files</span>
          </Button>
        )}
      </div>
    </div>
  );
}
