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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileCode,
  Github,
  Zap,
  Play,
  Sparkles,
  Clock,
  TrendingUp,
  Upload,
  Code,
  Wand2,
  Settings,
} from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/components/AppLayout";

interface RepoFile {
  path: string;
  content: string;
  transformed?: string;
  insights?: NeuroLintLayerResult[];
}

export function ProtectedApp() {
  const [originalCode, setOriginalCode] = useState<string>("");
  const [transformedCode, setTransformedCode] = useState<string>("");
  const [insights, setInsights] = useState<NeuroLintLayerResult[]>([]);
  const [processing, setProcessing] = useState(false);
  const [enabledLayers, setEnabledLayers] = useState<number[]>([1, 2, 3, 4]);
  const [mode, setMode] = useState<"drop" | "paste" | "github" | "repo">(
    "drop",
  );
  const [repoFiles, setRepoFiles] = useState<RepoFile[]>([]);
  const [processingTime, setProcessingTime] = useState<number>(0);

  const processCode = useCallback(
    async (code: string) => {
      setProcessing(true);
      setOriginalCode(code);
      setProcessingTime(0);

      const startTime = Date.now();

      try {
        const result = await NeuroLintOrchestrator(
          code,
          undefined, // filePath
          true, // useAST
          enabledLayers, // layerIds
        );
        const endTime = Date.now();

        setTransformedCode(result.transformed);
        setInsights(result.layers);
        setProcessingTime(endTime - startTime);
      } catch (error) {
        console.error("Processing failed:", error);
      } finally {
        setProcessing(false);
      }
    },
    [enabledLayers],
  );

  const handleRepoProcessing = (files: RepoFile[]) => {
    setRepoFiles(files);
    setMode("repo");
  };

  const resetAll = () => {
    setOriginalCode("");
    setTransformedCode("");
    setInsights([]);
    setRepoFiles([]);
    setProcessingTime(0);
  };

  return (
    <ProtectedRoute>
      <AppLayout>
        <main
          id="main-content"
          className="h-full p-6 space-y-6"
          role="main"
          aria-label="Code transformation interface"
        >
          {/* Stats Cards */}
          {processingTime > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-zinc-400" />
                    <span className="text-sm text-zinc-400">
                      Processing Time
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-white">
                    {formatProcessingTime(processingTime)}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-zinc-400" />
                    <span className="text-sm text-zinc-400">
                      Layers Applied
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-white">
                    {enabledLayers.length} / {LAYER_LIST.length}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-zinc-400" />
                    <span className="text-sm text-zinc-400">Improvements</span>
                  </div>
                  <p className="text-lg font-semibold text-white">
                    {
                      insights.filter(
                        (insight) =>
                          insight.changes && insight.changes.length > 0,
                      ).length
                    }
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Layer Selector */}
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Layer Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LayerSelector
                enabledLayers={enabledLayers}
                setEnabledLayers={setEnabledLayers}
              />
            </CardContent>
          </Card>

          {/* Main Content */}
          {!originalCode && repoFiles.length === 0 ? (
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardContent className="p-8">
                <Tabs
                  value={mode}
                  onValueChange={(value) => setMode(value as any)}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-3 mb-8 bg-zinc-800/50">
                    <TabsTrigger
                      value="drop"
                      className="flex items-center gap-2 data-[state=active]:bg-zinc-700"
                    >
                      <Upload className="w-4 h-4" />
                      Upload Files
                    </TabsTrigger>
                    <TabsTrigger
                      value="paste"
                      className="flex items-center gap-2 data-[state=active]:bg-zinc-700"
                    >
                      <Code className="w-4 h-4" />
                      Paste Code
                    </TabsTrigger>
                    <TabsTrigger
                      value="github"
                      className="flex items-center gap-2 data-[state=active]:bg-zinc-700"
                    >
                      <Github className="w-4 h-4" />
                      GitHub Repo
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="drop" className="space-y-6">
                    <DropFileZone
                      onFile={processCode}
                      processing={processing}
                    />
                  </TabsContent>

                  <TabsContent value="paste" className="space-y-6">
                    <PasteCodeZone
                      onFile={processCode}
                      processing={processing}
                    />
                  </TabsContent>

                  <TabsContent value="github" className="space-y-6">
                    <GitHubUpload onRepoProcessed={handleRepoProcessing} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : repoFiles.length > 0 ? (
            <RepoProcessor
              files={repoFiles}
              onFileTransform={(path, content) => processCode(content)}
            />
          ) : (
            <div className="space-y-6">
              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white">
                    Code Analysis Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CodeDiffViewer
                    originalCode={originalCode}
                    transformedCode={transformedCode}
                    processing={processing}
                  />
                </CardContent>
              </Card>

              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white">
                    Transformation Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TransformationInsights insights={insights} />
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </AppLayout>
    </ProtectedRoute>
  );
}
