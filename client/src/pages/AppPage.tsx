import { useState, useCallback } from "react";
import { DropFileZone } from "@/components/neurolint/DropFileZone";
import { PasteCodeZone } from "@/components/neurolint/PasteCodeZone";
import { GitHubUpload } from "@/components/neurolint/GitHubUpload";
import { RepoProcessor } from "@/components/neurolint/RepoProcessor";
import { CodeDiffViewer } from "@/components/neurolint/CodeDiffViewer";
import { TransformationInsights } from "@/components/neurolint/TransformationInsights";
import { LayerSelector } from "@/components/neurolint/LayerSelector";
import {
  NeuroLintOrchestrator,
  NeuroLintLayerResult,
  LAYER_LIST,
} from "@/lib/neurolint/orchestrator";
import { formatProcessingTime } from "@/lib/utils/timeFormat";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  FileCode,
  Github,
  Zap,
  Settings,
  Play,
  Sparkles,
  Clock,
  TrendingUp,
  ArrowLeft,
  Upload,
  Code,
} from "lucide-react";
import { BetaBanner } from "@/components/BetaBanner";

interface RepoFile {
  path: string;
  content: string;
  transformed?: string;
  insights?: NeuroLintLayerResult[];
}

const AppPage = () => {
  const [originalCode, setOriginalCode] = useState<string>("");
  const [transformedCode, setTransformedCode] = useState<string>("");
  const [insights, setInsights] = useState<NeuroLintLayerResult[]>([]);
  const [processing, setProcessing] = useState(false);
  const [enabledLayers, setEnabledLayers] = useState<number[]>([1, 2, 3, 4]);
  const [mode, setMode] = useState<"drop" | "paste" | "github" | "repo">(
    "drop",
  );
  const [repoFiles, setRepoFiles] = useState<RepoFile[]>([]);

  const handleFileUpload = useCallback(
    async (code: string) => {
      setOriginalCode(code);
      setProcessing(true);
      try {
        const startTime = Date.now();
        const { transformed, layers } = await NeuroLintOrchestrator(
          code,
          undefined,
          true,
          enabledLayers,
        );
        setTransformedCode(transformed);
        setInsights(layers);
        console.log(
          `NeuroLint ran in ${Date.now() - startTime}ms for layers`,
          enabledLayers,
        );
      } catch (error) {
        console.error("NeuroLint processing failed:", error);
      } finally {
        setProcessing(false);
      }
    },
    [enabledLayers],
  );

  const handleRepoUpload = useCallback(
    (files: { path: string; content: string }[]) => {
      setRepoFiles(files.map((f) => ({ ...f })));
      setMode("repo");
    },
    [],
  );

  const handleRepoProcessingComplete = useCallback(
    (processedFiles: RepoFile[]) => {
      setRepoFiles(processedFiles);
    },
    [],
  );

  const stats =
    insights.length > 0
      ? {
          totalChanges: insights.reduce(
            (sum, r) => sum + (r.changeCount || 0),
            0,
          ),
          totalTime: insights.reduce(
            (sum, r) => sum + (r.executionTime || 0),
            0,
          ),
          successfulLayers: insights.filter((r) => r.success).length,
        }
      : null;

  return (
    <div className="min-h-screen bg-black">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-zinc-900/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-zinc-800/20 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="container mx-auto px-6 py-8 max-w-6xl">
          {/* Layer Selection */}
          <div className="mb-12">
            <LayerSelector
              enabledLayers={enabledLayers}
              setEnabledLayers={setEnabledLayers}
            />
          </div>

          {/* Upload Method Selection */}
          <div className="max-w-4xl mx-auto">
            <Tabs
              value={mode}
              onValueChange={(value) =>
                setMode(value as "drop" | "paste" | "github")
              }
              className="w-full"
            >
              <TabsList className="inline-flex h-14 items-center justify-center rounded-2xl bg-zinc-900/50 border border-zinc-800/50 p-1.5 mx-auto backdrop-blur-sm">
                <TabsTrigger
                  value="drop"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=inactive]:text-zinc-400 data-[state=inactive]:hover:text-white data-[state=inactive]:hover:bg-zinc-800/50 min-w-[140px] gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Drop Files</span>
                </TabsTrigger>
                <TabsTrigger
                  value="paste"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=inactive]:text-zinc-400 data-[state=inactive]:hover:text-white data-[state=inactive]:hover:bg-zinc-800/50 min-w-[140px] gap-2"
                >
                  <Code className="w-4 h-4" />
                  <span>Paste Code</span>
                </TabsTrigger>
                <TabsTrigger
                  value="github"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=inactive]:text-zinc-400 data-[state=inactive]:hover:text-white data-[state=inactive]:hover:bg-zinc-800/50 min-w-[140px] gap-2"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub Repo</span>
                </TabsTrigger>
              </TabsList>

              {/* Tab Content */}
              <div className="mt-8 space-y-8">
                <TabsContent value="drop" className="space-y-6">
                  <div className="border border-zinc-800/50 rounded-2xl p-6 backdrop-blur-sm bg-zinc-900/30">
                    <DropFileZone
                      onFile={handleFileUpload}
                      processing={processing}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="paste" className="space-y-6">
                  <div className="border border-zinc-800/50 rounded-2xl p-6 backdrop-blur-sm bg-zinc-900/30">
                    <PasteCodeZone
                      onFile={handleFileUpload}
                      processing={processing}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="github" className="space-y-6">
                  <div className="border border-zinc-800/50 rounded-2xl p-6 backdrop-blur-sm bg-zinc-900/30">
                    <GitHubUpload onRepoUpload={handleRepoUpload} />
                  </div>

                  {repoFiles.length > 0 && (
                    <div className="border border-zinc-800/50 rounded-2xl p-6 backdrop-blur-sm bg-zinc-900/30">
                      <RepoProcessor
                        files={repoFiles}
                        enabledLayers={enabledLayers}
                        onProcessingComplete={handleRepoProcessingComplete}
                      />
                    </div>
                  )}
                </TabsContent>

                {/* Processing Indicator */}
                {processing && (
                  <div className="flex flex-col items-center justify-center gap-4 py-8 px-6 border border-zinc-800/50 rounded-2xl backdrop-blur-sm bg-zinc-900/30">
                    <div className="relative">
                      <div className="w-12 h-12 border-4 border-zinc-700 border-t-white rounded-full animate-spin"></div>
                      <Sparkles className="absolute inset-0 w-6 h-6 m-auto text-white animate-pulse" />
                    </div>
                    <div className="text-center">
                      <div className="text-white font-semibold text-lg mb-1">
                        Code Analysis in Progress
                      </div>
                      <span className="text-zinc-400 font-medium">
                        Running {enabledLayers.length} advanced layer
                        {enabledLayers.length !== 1 ? "s" : ""}...
                      </span>
                    </div>
                  </div>
                )}

                {/* Stats Cards */}
                {stats && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border border-zinc-800/50 rounded-xl p-5 backdrop-blur-sm bg-zinc-900/30">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-zinc-700/50 rounded-lg">
                          <TrendingUp className="w-4 h-4 text-zinc-300" />
                        </div>
                        <span className="text-zinc-300 font-medium text-sm">
                          Changes Applied
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">
                        {stats.totalChanges}
                      </div>
                      <div className="text-xs text-zinc-500">
                        improvements made
                      </div>
                    </div>

                    <div className="border border-zinc-800/50 rounded-xl p-5 backdrop-blur-sm bg-zinc-900/30">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-zinc-700/50 rounded-lg">
                          <Clock className="w-4 h-4 text-zinc-300" />
                        </div>
                        <span className="text-zinc-300 font-medium text-sm">
                          Processing Time
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">
                        {formatProcessingTime(stats.totalTime)}
                      </div>
                      <div className="text-xs text-zinc-500">
                        analysis duration
                      </div>
                    </div>

                    <div className="border border-zinc-800/50 rounded-xl p-5 backdrop-blur-sm bg-zinc-900/30">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-zinc-700/50 rounded-lg">
                          <Zap className="w-4 h-4 text-zinc-300" />
                        </div>
                        <span className="text-zinc-300 font-medium text-sm">
                          Success Rate
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">
                        {stats.successfulLayers}/{enabledLayers.length}
                      </div>
                      <div className="text-xs text-zinc-500">
                        layers completed
                      </div>
                    </div>
                  </div>
                )}

                {/* Code Diff Viewer */}
                <div className="border border-zinc-800/50 rounded-2xl overflow-hidden backdrop-blur-sm bg-zinc-900/30">
                  <CodeDiffViewer
                    original={originalCode}
                    transformed={transformedCode}
                    loading={processing}
                  />
                </div>

                {/* Transformation Insights */}
                {insights.length > 0 && (
                  <div className="border border-zinc-800/50 rounded-2xl p-6 backdrop-blur-sm bg-zinc-900/30">
                    <TransformationInsights insights={insights} />
                  </div>
                )}
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppPage;
