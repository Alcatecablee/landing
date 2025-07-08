import React, { useState } from "react";
import { NeuroLintLayerResult } from "@/lib/neurolint/orchestrator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock,
  CheckCircle,
  XCircle,
  Code,
  Zap,
  TrendingUp,
  Settings,
  Shield,
  Sparkles,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  Target,
  BarChart3,
  Info,
  FileCode,
  Gauge,
} from "lucide-react";

interface TransformationInsightsProps {
  insights: NeuroLintLayerResult[];
}

interface LayerMetrics {
  changeRate: number;
  efficiency: number;
  impact: "high" | "medium" | "low";
  category: string;
}

export function TransformationInsights({
  insights,
}: TransformationInsightsProps) {
  const [expandedLayers, setExpandedLayers] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState("overview");

  if (!insights || !Array.isArray(insights)) {
    return (
      <div className="flex items-center justify-center p-8 text-zinc-400 bg-zinc-900/30 rounded-lg border border-zinc-800">
        <div className="text-center">
          <FileCode className="w-12 h-12 mx-auto mb-4 text-zinc-600" />
          <h3 className="text-lg font-semibold mb-2">No Analysis Results</h3>
          <p className="text-sm">
            Upload or paste code to see transformation insights
          </p>
        </div>
      </div>
    );
  }

  const totalChanges = insights.reduce(
    (sum, result) => sum + (result.changeCount || 0),
    0,
  );
  const totalTime = insights.reduce(
    (sum, result) => sum + (result.executionTime || 0),
    0,
  );
  const successfulLayers = insights.filter((r) => r.success).length;
  const allImprovements = insights.flatMap((r) => r.improvements || []);
  const failedLayers = insights.filter((r) => !r.success);

  // Calculate advanced metrics
  const getLayerMetrics = (
    layer: NeuroLintLayerResult,
    index: number,
  ): LayerMetrics => {
    const changeRate =
      totalChanges > 0 ? ((layer.changeCount || 0) / totalChanges) * 100 : 0;
    const efficiency = layer.executionTime
      ? ((layer.changeCount || 0) / layer.executionTime) * 1000
      : 0;
    const impact =
      changeRate > 40 ? "high" : changeRate > 15 ? "medium" : "low";

    const categories = [
      "Configuration",
      "Code Quality",
      "Component Structure",
      "Performance",
      "Framework Optimization",
      "Testing & Quality",
    ];

    return {
      changeRate,
      efficiency,
      impact,
      category: categories[index] || "Other",
    };
  };

  const toggleLayer = (index: number) => {
    const newExpanded = new Set(expandedLayers);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedLayers(newExpanded);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "text-green-400 bg-green-400/10 border-green-400/20";
      case "medium":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "low":
        return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      default:
        return "text-zinc-400 bg-zinc-400/10 border-zinc-400/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Executive Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Code className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-zinc-400">Total Changes</span>
            </div>
            <div className="text-2xl font-bold text-white">{totalChanges}</div>
            <div className="text-xs text-zinc-500">transformations applied</div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-green-400" />
              <span className="text-xs text-zinc-400">Processing Time</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {Math.round(totalTime)}ms
            </div>
            <div className="text-xs text-zinc-500">analysis duration</div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Gauge className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-zinc-400">Success Rate</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {Math.round((successfulLayers / insights.length) * 100)}%
            </div>
            <div className="text-xs text-zinc-500">
              {successfulLayers}/{insights.length} layers
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-xs text-zinc-400">Improvements</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {allImprovements.length}
            </div>
            <div className="text-xs text-zinc-500">enhancements made</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-zinc-900/50">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-zinc-700"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="layers"
            className="data-[state=active]:bg-zinc-700"
          >
            Layer Details
          </TabsTrigger>
          <TabsTrigger
            value="insights"
            className="data-[state=active]:bg-zinc-700"
          >
            Deep Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Layer Performance Overview */}
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Layer Performance Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {insights.map((result, idx) => {
                const metrics = getLayerMetrics(result, idx);
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-zinc-800/30 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={result.success ? "default" : "destructive"}
                        className="shrink-0"
                      >
                        Layer {idx + 1}
                      </Badge>
                      <div>
                        <div className="font-medium text-white text-sm">
                          {result.name}
                        </div>
                        <div className="text-xs text-zinc-400">
                          {metrics.category}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-medium text-white">
                          {result.changeCount || 0} changes
                        </div>
                        <div className="text-xs text-zinc-400">
                          {Math.round(result.executionTime || 0)}ms
                        </div>
                      </div>
                      <Badge
                        className={`text-xs ${getImpactColor(metrics.impact)}`}
                      >
                        {metrics.impact} impact
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Key Improvements */}
          {allImprovements.length > 0 && (
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Key Improvements Applied
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[...new Set(allImprovements)].map((improvement, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 p-2 bg-zinc-800/30 rounded"
                    >
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                      <span className="text-sm text-zinc-300">
                        {improvement}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="layers" className="space-y-4">
          {insights.map((result, idx) => {
            const metrics = getLayerMetrics(result, idx);
            const isExpanded = expandedLayers.has(idx);

            return (
              <Card key={idx} className="bg-zinc-900/50 border-zinc-800">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={result.success ? "default" : "destructive"}
                      >
                        {result.success ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <XCircle className="w-3 h-3 mr-1" />
                        )}
                        Layer {idx + 1}
                      </Badge>
                      <CardTitle className="text-white text-lg">
                        {result.name}
                      </CardTitle>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleLayer(idx)}
                      className="text-zinc-400 hover:text-white"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center gap-6 text-sm">
                    <span className="text-zinc-400">{result.description}</span>
                    <Badge className={`${getImpactColor(metrics.impact)}`}>
                      {metrics.impact} impact
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-2 bg-zinc-800/30 rounded">
                      <div className="text-lg font-bold text-white">
                        {result.changeCount || 0}
                      </div>
                      <div className="text-xs text-zinc-400">Changes</div>
                    </div>
                    <div className="text-center p-2 bg-zinc-800/30 rounded">
                      <div className="text-lg font-bold text-white">
                        {Math.round(result.executionTime || 0)}ms
                      </div>
                      <div className="text-xs text-zinc-400">Duration</div>
                    </div>
                    <div className="text-center p-2 bg-zinc-800/30 rounded">
                      <div className="text-lg font-bold text-white">
                        {Math.round(metrics.changeRate)}%
                      </div>
                      <div className="text-xs text-zinc-400">Change Rate</div>
                    </div>
                    <div className="text-center p-2 bg-zinc-800/30 rounded">
                      <div className="text-lg font-bold text-white">
                        {Math.round(metrics.efficiency)}
                      </div>
                      <div className="text-xs text-zinc-400">Efficiency</div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="space-y-4 pt-4 border-t border-zinc-800">
                      {result.improvements &&
                        result.improvements.length > 0 && (
                          <div>
                            <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                              <Sparkles className="w-4 h-4" />
                              Specific Improvements
                            </h4>
                            <div className="space-y-2">
                              {result.improvements.map((improvement, i) => (
                                <div
                                  key={i}
                                  className="flex items-start gap-2 text-sm"
                                >
                                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                                  <span className="text-zinc-300">
                                    {improvement}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      {result.message && (
                        <div>
                          <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                            <Info className="w-4 h-4" />
                            Additional Information
                          </h4>
                          <div className="p-3 bg-zinc-800/30 rounded text-sm text-zinc-300">
                            {result.message}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          {/* Performance Analysis */}
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Performance Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-800/30 rounded-lg">
                  <h4 className="font-medium text-white mb-2">
                    Processing Efficiency
                  </h4>
                  <div className="text-2xl font-bold text-green-400">
                    {totalTime > 0
                      ? Math.round((totalChanges / totalTime) * 1000)
                      : 0}
                  </div>
                  <div className="text-sm text-zinc-400">
                    changes per second
                  </div>
                </div>

                <div className="p-4 bg-zinc-800/30 rounded-lg">
                  <h4 className="font-medium text-white mb-2">
                    Average Layer Time
                  </h4>
                  <div className="text-2xl font-bold text-blue-400">
                    {insights.length > 0
                      ? Math.round(totalTime / insights.length)
                      : 0}
                    ms
                  </div>
                  <div className="text-sm text-zinc-400">
                    per layer execution
                  </div>
                </div>
              </div>

              {failedLayers.length > 0 && (
                <div className="p-4 bg-red-900/20 border border-red-800/30 rounded-lg">
                  <h4 className="font-medium text-red-400 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Issues Detected
                  </h4>
                  <div className="space-y-2">
                    {failedLayers.map((layer, i) => (
                      <div key={i} className="text-sm text-red-300">
                        <strong>{layer.name}:</strong>{" "}
                        {layer.message || "Execution failed"}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Transformation Impact */}
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="w-5 h-5" />
                Transformation Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-zinc-800/30 rounded-lg">
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      {Math.round((successfulLayers / insights.length) * 100)}%
                    </div>
                    <div className="text-sm text-zinc-400">Success Rate</div>
                  </div>

                  <div className="text-center p-4 bg-zinc-800/30 rounded-lg">
                    <div className="text-3xl font-bold text-blue-400 mb-2">
                      {[...new Set(allImprovements)].length}
                    </div>
                    <div className="text-sm text-zinc-400">
                      Unique Improvements
                    </div>
                  </div>

                  <div className="text-center p-4 bg-zinc-800/30 rounded-lg">
                    <div className="text-3xl font-bold text-purple-400 mb-2">
                      {
                        insights.filter(
                          (l) => getLayerMetrics(l, 0).impact === "high",
                        ).length
                      }
                    </div>
                    <div className="text-sm text-zinc-400">
                      High Impact Layers
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-zinc-800/30 rounded-lg">
                  <h4 className="font-medium text-white mb-3">
                    Transformation Quality Score
                  </h4>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-zinc-700 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-1000"
                        style={{
                          width: `${Math.min((successfulLayers / insights.length) * 100, 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-lg font-bold text-white">
                      {Math.round((successfulLayers / insights.length) * 100)}
                      /100
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-zinc-400">
                    Based on layer success rate, changes applied, and processing
                    efficiency
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
