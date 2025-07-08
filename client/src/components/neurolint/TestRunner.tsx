"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  PlayCircle,
  CheckCircle,
  XCircle,
  Clock,
  Code,
  Zap,
  Settings,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Target,
  Layers,
  Wrench,
  ShieldCheck,
  BarChart3,
  Timer,
  Gauge,
  Activity,
  TestTube,
  FileCheck,
  Cpu,
  MemoryStick,
  PieChart,
  LineChart,
  Sparkles,
  Database,
  RefreshCw,
  Filter,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Download,
  Share,
  Bug,
  Workflow,
} from "lucide-react";
import {
  NeuroLintOrchestrator,
  LAYER_LIST,
} from "@/lib/neurolint/orchestrator";
import {
  TEST_CASES,
  validateTestResult,
  TestResult,
} from "@/lib/neurolint/testSuite";
import { LayerSelector } from "./LayerSelector";

export function TestRunner() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResultWithLayers[]>([]);
  const [currentTest, setCurrentTest] = useState<string>("");
  const [progress, setProgress] = useState(0);
  const [useAST, setUseAST] = useState(true);
  const [enabledLayers, setEnabledLayers] = useState(
    LAYER_LIST.map((l) => l.id),
  );
  const [pipelineStates, setPipelineStates] = useState<string[][]>([]);

  // Enhanced state management
  const [activeTab, setActiveTab] = useState("dashboard");
  const [filterStatus, setFilterStatus] = useState<"all" | "passed" | "failed">(
    "all",
  );
  const [expandedTests, setExpandedTests] = useState<Set<number>>(new Set());
  const [testHistory, setTestHistory] = useState<TestResultWithLayers[][]>([]);
  const [benchmarkMode, setBenchmarkMode] = useState(false);
  const [realTimeMode, setRealTimeMode] = useState(false);

  // Performance tracking
  const [memoryUsage, setMemoryUsage] = useState<number>(0);
  const [cpuUsage, setCpuUsage] = useState<number>(0);

  // We need to store the enabledLayers used for each test run, so we update TestResult type below
  type TestResultWithLayers = TestResult & {
    pipeline: string[];
    testEnabledLayers: number[];
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setResults([]);
    setProgress(0);
    setPipelineStates([]);

    const testResults: TestResultWithLayers[] = [];
    const layerPipelines: string[][] = [];

    for (let i = 0; i < TEST_CASES.length; i++) {
      const testCase = TEST_CASES[i];
      setCurrentTest(testCase.name);
      setProgress((i / TEST_CASES.length) * 100);

      // Capture enabledLayers for this test run
      const testEnabledLayers = [...enabledLayers];

      const startTime = Date.now();
      try {
        // Pass enabledLayers to orchestrator
        const { transformed, layers, layerOutputs } =
          await NeuroLintOrchestrator(
            testCase.input,
            undefined,
            useAST,
            testEnabledLayers,
          );
        const validation = validateTestResult(testCase, transformed);
        const executionTime = Date.now() - startTime;

        testResults.push({
          testCase,
          transformedCode: transformed,
          passed: validation.passed,
          detectedFixes: validation.detectedFixes,
          missingFixes: validation.missingFixes,
          executionTime,
          // Store per-test pipeline and enabled layers
          pipeline: layerOutputs,
          testEnabledLayers,
        });
        layerPipelines.push(layerOutputs);
      } catch (error) {
        const executionTime = Date.now() - startTime;
        testResults.push({
          testCase,
          transformedCode: testCase.input,
          passed: false,
          detectedFixes: [],
          missingFixes: testCase.expectedFixes,
          executionTime,
          pipeline: [testCase.input],
          testEnabledLayers,
        });
        layerPipelines.push([testCase.input]);
      }
      setResults([...testResults]);
      setPipelineStates([...layerPipelines]);
    }

    setProgress(100);
    setCurrentTest("");
    setIsRunning(false);
  };

  // Enhanced Analytics Calculations
  const passedTests = results.filter((r) => r.passed).length;
  const totalTests = results.length;
  const passRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;
  const failedTests = results.filter((r) => !r.passed).length;

  // Advanced metrics
  const totalExecutionTime = results.reduce(
    (sum, r) => sum + r.executionTime,
    0,
  );
  const avgExecutionTime = totalTests > 0 ? totalExecutionTime / totalTests : 0;
  const fastestTest =
    results.length > 0 ? Math.min(...results.map((r) => r.executionTime)) : 0;
  const slowestTest =
    results.length > 0 ? Math.max(...results.map((r) => r.executionTime)) : 0;

  // Quality metrics
  const totalDetectedFixes = results.reduce(
    (sum, r) => sum + r.detectedFixes.length,
    0,
  );
  const totalMissedFixes = results.reduce(
    (sum, r) => sum + r.missingFixes.length,
    0,
  );
  const detectionRate =
    totalDetectedFixes + totalMissedFixes > 0
      ? (totalDetectedFixes / (totalDetectedFixes + totalMissedFixes)) * 100
      : 0;

  // Layer-specific analytics
  const layerPerformance = LAYER_LIST.map((layer) => {
    const layerTests = results.filter((r) =>
      r.testEnabledLayers.includes(layer.id),
    );
    const layerPassed = layerTests.filter((r) => r.passed).length;
    const layerAvgTime =
      layerTests.length > 0
        ? layerTests.reduce((sum, r) => sum + r.executionTime, 0) /
          layerTests.length
        : 0;

    return {
      ...layer,
      testsRun: layerTests.length,
      passed: layerPassed,
      passRate:
        layerTests.length > 0 ? (layerPassed / layerTests.length) * 100 : 0,
      avgTime: layerAvgTime,
      reliability: layerTests.length > 0 ? layerPassed / layerTests.length : 0,
    };
  });

  // Category performance
  const categoryPerformance = [
    "config",
    "pattern",
    "component",
    "hydration",
  ].map((category) => {
    const categoryTests = results.filter(
      (r) => r.testCase.category === category,
    );
    const categoryPassed = categoryTests.filter((r) => r.passed).length;

    return {
      category,
      total: categoryTests.length,
      passed: categoryPassed,
      failed: categoryTests.length - categoryPassed,
      passRate:
        categoryTests.length > 0
          ? (categoryPassed / categoryTests.length) * 100
          : 0,
      avgTime:
        categoryTests.length > 0
          ? categoryTests.reduce((sum, r) => sum + r.executionTime, 0) /
            categoryTests.length
          : 0,
    };
  });

  // Trend analysis
  const performanceTrend = useMemo(() => {
    if (testHistory.length < 2) return "stable";
    const currentPassRate = passRate;
    const previousPassRate =
      testHistory[testHistory.length - 2]?.length > 0
        ? (testHistory[testHistory.length - 2].filter((r) => r.passed).length /
            testHistory[testHistory.length - 2].length) *
          100
        : 0;

    if (currentPassRate > previousPassRate + 5) return "improving";
    if (currentPassRate < previousPassRate - 5) return "declining";
    return "stable";
  }, [testHistory, passRate]);

  // Real-time monitoring
  useEffect(() => {
    if (realTimeMode && isRunning) {
      const interval = setInterval(() => {
        // Simulate memory and CPU monitoring
        setMemoryUsage(Math.random() * 100);
        setCpuUsage(Math.random() * 100);
      }, 500);

      return () => clearInterval(interval);
    }
  }, [realTimeMode, isRunning]);

  // Key layer insights (config, pattern, hydration)
  const keyLayers = [1, 2, 4]; // Config, Pattern, Hydration
  const keyLayerResults = useMemo(() => {
    const layerStats = keyLayers.map((layerId) => {
      const layerTests = results.filter(
        (r) => r.testCase.category === getCategoryForLayer(layerId),
      );
      const passed = layerTests.filter((r) => r.passed).length;
      const total = layerTests.length;
      const avgTime =
        total > 0
          ? layerTests.reduce((sum, r) => sum + r.executionTime, 0) / total
          : 0;

      return {
        layerId,
        name: LAYER_LIST.find((l) => l.id === layerId)?.name || "",
        category: getCategoryForLayer(layerId),
        passed,
        total,
        passRate: total > 0 ? (passed / total) * 100 : 0,
        avgTime: Math.round(avgTime),
        icon: getLayerIcon(layerId),
      };
    });
    return layerStats;
  }, [results]);

  function getCategoryForLayer(layerId: number): string {
    switch (layerId) {
      case 1:
        return "config";
      case 2:
        return "pattern";
      case 4:
        return "hydration";
      default:
        return "component";
    }
  }

  function getLayerIcon(layerId: number) {
    switch (layerId) {
      case 1:
        return Settings;
      case 2:
        return Wrench;
      case 4:
        return ShieldCheck;
      default:
        return Layers;
    }
  }

  // Performance insights
  const performanceInsights = useMemo(() => {
    if (results.length === 0) return [];

    const insights: string[] = [];
    const avgExecutionTime =
      results.reduce((sum, r) => sum + r.executionTime, 0) / results.length;

    if (avgExecutionTime > 100) {
      insights.push(
        "Consider optimizing transformation algorithms - average execution time is above 100ms",
      );
    }

    const failedTests = results.filter((r) => !r.passed);
    if (failedTests.length > 0) {
      const commonFailures = failedTests.reduce(
        (acc, test) => {
          test.missingFixes.forEach((fix) => {
            acc[fix] = (acc[fix] || 0) + 1;
          });
          return acc;
        },
        {} as Record<string, number>,
      );

      const mostCommonFailure = Object.entries(commonFailures).sort(
        ([, a], [, b]) => b - a,
      )[0];
      if (mostCommonFailure) {
        insights.push(
          `Most common failure: "${mostCommonFailure[0]}" (${mostCommonFailure[1]} occurrences)`,
        );
      }
    }

    const keyLayerEnabled = enabledLayers.some((id) => keyLayers.includes(id));
    if (!keyLayerEnabled) {
      insights.push(
        "Enable config, pattern, or hydration layers for comprehensive testing",
      );
    }

    return insights;
  }, [results, enabledLayers]);

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-white">
              <TestTube className="w-5 h-5" />
              Test Control Panel
              {isRunning && (
                <Badge variant="secondary" className="ml-2">
                  <Activity className="w-3 h-3 mr-1 animate-pulse" />
                  Running
                </Badge>
              )}
            </CardTitle>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-zinc-300">
                {useAST ? "AST Mode" : "Regex Mode"}
              </Badge>
              {realTimeMode && (
                <Badge variant="secondary">
                  <Database className="w-3 h-3 mr-1" />
                  Live Monitoring
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* NeuroLint Layer Cards - Side by Side */}
          <div className="space-y-4">
            <LayerSelector
              enabledLayers={enabledLayers}
              setEnabledLayers={setEnabledLayers}
            />
          </div>

          {/* All Control Buttons Below Cards */}
          <div className="space-y-4">
            {/* Primary Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={runAllTests}
                disabled={isRunning || enabledLayers.length === 0}
                className="flex items-center gap-2"
              >
                <PlayCircle className="w-4 h-4" />
                {isRunning
                  ? "Running Tests..."
                  : `Run ${enabledLayers.length} Layer${enabledLayers.length !== 1 ? "s" : ""}`}
              </Button>

              <Button
                variant="outline"
                onClick={() => setUseAST(!useAST)}
                className="flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                {useAST ? "Switch to Regex" : "Switch to AST"}
              </Button>

              <Button
                variant="outline"
                onClick={() => setRealTimeMode(!realTimeMode)}
              >
                <Activity className="w-3 h-3 mr-1" />
                {realTimeMode ? "Stop" : "Start"} Monitoring
              </Button>
            </div>

            {/* Secondary Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEnabledLayers(LAYER_LIST.map((l) => l.id))}
                disabled={enabledLayers.length === LAYER_LIST.length}
              >
                Select All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEnabledLayers([])}
                disabled={enabledLayers.length === 0}
              >
                Clear All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBenchmarkMode(!benchmarkMode)}
                className={benchmarkMode ? "bg-blue-100" : ""}
              >
                <Timer className="w-3 h-3 mr-1" />
                Benchmark
              </Button>

              {results.length > 0 && (
                <>
                  <Button variant="outline" size="sm">
                    <Download className="w-3 h-3 mr-1" />
                    Export Results
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share className="w-3 h-3 mr-1" />
                    Share Report
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Real-time Progress */}
          {isRunning && (
            <div className="space-y-3 p-4 bg-zinc-800/30 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-zinc-300">
                  <Clock className="w-4 h-4" />
                  <span>Running: {currentTest}</span>
                </div>
                <div className="text-sm text-zinc-400">
                  {Math.round(progress)}% Complete
                </div>
              </div>

              <Progress value={progress} className="w-full h-2" />

              {realTimeMode && (
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-zinc-300">
                      CPU: {Math.round(cpuUsage)}%
                    </span>
                    <Progress value={cpuUsage} className="flex-1 h-1" />
                  </div>
                  <div className="flex items-center gap-2">
                    <MemoryStick className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-zinc-300">
                      Memory: {Math.round(memoryUsage)}%
                    </span>
                    <Progress value={memoryUsage} className="flex-1 h-1" />
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Executive Dashboard */}
      {results.length > 0 && (
        <div className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-zinc-400">Pass Rate</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {Math.round(passRate)}%
                </div>
                <div className="text-xs text-zinc-500">
                  {passedTests}/{totalTests} tests passed
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Timer className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-zinc-400">Avg Time</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {Math.round(avgExecutionTime)}ms
                </div>
                <div className="text-xs text-zinc-500">per test execution</div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-zinc-400">Detection Rate</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {Math.round(detectionRate)}%
                </div>
                <div className="text-xs text-zinc-500">
                  {totalDetectedFixes} fixes detected
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp
                    className={`w-4 h-4 ${
                      performanceTrend === "improving"
                        ? "text-green-400"
                        : performanceTrend === "declining"
                          ? "text-red-400"
                          : "text-yellow-400"
                    }`}
                  />
                  <span className="text-xs text-zinc-400">Trend</span>
                </div>
                <div className="text-2xl font-bold text-white capitalize">
                  {performanceTrend}
                </div>
                <div className="text-xs text-zinc-500">vs previous run</div>
              </CardContent>
            </Card>
          </div>

          {/* Comprehensive Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 bg-zinc-900/50">
              <TabsTrigger
                value="dashboard"
                className="data-[state=active]:bg-zinc-700"
              >
                <BarChart3 className="w-4 h-4 mr-1" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger
                value="tests"
                className="data-[state=active]:bg-zinc-700"
              >
                <FileCheck className="w-4 h-4 mr-1" />
                Test Results
              </TabsTrigger>
            </TabsList>

            {/* Enhanced Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              {/* Category Performance */}
              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    Category Performance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {categoryPerformance.map((category) => (
                      <div
                        key={category.category}
                        className="p-4 bg-zinc-800/30 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-white capitalize">
                            {category.category}
                          </h4>
                          <Badge
                            variant={
                              category.passRate >= 80
                                ? "default"
                                : category.passRate >= 60
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {Math.round(category.passRate)}%
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-zinc-400">Passed</span>
                            <span className="text-green-400">
                              {category.passed}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-zinc-400">Failed</span>
                            <span className="text-red-400">
                              {category.failed}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-zinc-400">Avg Time</span>
                            <span className="text-zinc-300">
                              {Math.round(category.avgTime)}ms
                            </span>
                          </div>
                          <Progress value={category.passRate} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Summary */}
              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Gauge className="w-5 h-5" />
                    Performance & Execution Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-zinc-800/30 rounded-lg">
                      <div className="text-2xl font-bold text-green-400 mb-2">
                        {fastestTest}ms
                      </div>
                      <div className="text-sm text-zinc-400">Fastest Test</div>
                    </div>
                    <div className="text-center p-4 bg-zinc-800/30 rounded-lg">
                      <div className="text-2xl font-bold text-blue-400 mb-2">
                        {Math.round(avgExecutionTime)}ms
                      </div>
                      <div className="text-sm text-zinc-400">Average Time</div>
                    </div>
                    <div className="text-center p-4 bg-zinc-800/30 rounded-lg">
                      <div className="text-2xl font-bold text-red-400 mb-2">
                        {slowestTest}ms
                      </div>
                      <div className="text-sm text-zinc-400">Slowest Test</div>
                    </div>
                    <div className="text-center p-4 bg-zinc-800/30 rounded-lg">
                      <div className="text-2xl font-bold text-purple-400 mb-2">
                        {totalTests > 0
                          ? Math.round(1000 / avgExecutionTime)
                          : 0}
                      </div>
                      <div className="text-sm text-zinc-400">Tests/Sec</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Layer Analysis Summary */}
              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Layers className="w-5 h-5" />
                    Layer Performance Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {layerPerformance.slice(0, 6).map((layer) => (
                      <div
                        key={layer.id}
                        className="flex items-center gap-4 p-3 bg-zinc-800/30 rounded-lg"
                      >
                        <Badge variant="outline" className="shrink-0">
                          Layer {layer.id}
                        </Badge>
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-zinc-300 font-medium">
                              {layer.name}
                            </span>
                            <span className="text-zinc-400">
                              {Math.round(layer.avgTime)}ms avg
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-zinc-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                                style={{
                                  width: `${Math.min((layer.avgTime / (slowestTest || 1)) * 100, 100)}%`,
                                }}
                              />
                            </div>
                            <Badge
                              variant={
                                layer.passRate >= 80 ? "default" : "destructive"
                              }
                              className="text-xs shrink-0"
                            >
                              {Math.round(layer.passRate)}%
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Smart Insights Summary */}
              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    Key Insights & Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {performanceInsights.slice(0, 3).map((insight, idx) => (
                      <Alert
                        key={idx}
                        className="border-zinc-700 bg-zinc-800/30"
                      >
                        <Lightbulb className="h-4 w-4" />
                        <AlertDescription className="text-zinc-300">
                          {insight}
                        </AlertDescription>
                      </Alert>
                    ))}

                    {avgExecutionTime > 50 && (
                      <Alert className="border-yellow-700 bg-yellow-900/20">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription className="text-yellow-300">
                          <strong>Performance Alert:</strong> Average execution
                          time ({Math.round(avgExecutionTime)}ms) is above
                          optimal threshold.
                        </AlertDescription>
                      </Alert>
                    )}

                    {passRate < 80 && (
                      <Alert className="border-red-700 bg-red-900/20">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription className="text-red-300">
                          <strong>Quality Alert:</strong> Pass rate (
                          {Math.round(passRate)}%) is below 80%. Review failed
                          tests.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Enhanced Test Results Tab */}
            <TabsContent value="tests" className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-zinc-400" />
                  <span className="text-sm text-zinc-400">Filter:</span>
                </div>
                <div className="flex gap-2">
                  {["all", "passed", "failed"].map((status) => (
                    <Button
                      key={status}
                      variant={filterStatus === status ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterStatus(status as any)}
                    >
                      {status === "all"
                        ? `All (${results.length})`
                        : status === "passed"
                          ? `Passed (${passedTests})`
                          : `Failed (${failedTests})`}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4">
                {results
                  .filter(
                    (r) =>
                      filterStatus === "all" ||
                      (filterStatus === "passed" && r.passed) ||
                      (filterStatus === "failed" && !r.passed),
                  )
                  .map((result, index) => {
                    const isExpanded = expandedTests.has(index);

                    return (
                      <Card
                        key={index}
                        className={`bg-zinc-900/50 border-zinc-800 ${
                          result.passed
                            ? "border-l-4 border-l-green-500"
                            : "border-l-4 border-l-red-500"
                        }`}
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {result.passed ? (
                                <CheckCircle className="w-5 h-5 text-green-400" />
                              ) : (
                                <XCircle className="w-5 h-5 text-red-400" />
                              )}
                              <CardTitle className="text-white">
                                {result.testCase.name}
                              </CardTitle>
                              <Badge
                                variant="outline"
                                className="text-zinc-300"
                              >
                                {result.testCase.category}
                              </Badge>
                            </div>

                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">
                                <Clock className="w-3 h-3 mr-1" />
                                {result.executionTime}ms
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const newExpanded = new Set(expandedTests);
                                  if (isExpanded) {
                                    newExpanded.delete(index);
                                  } else {
                                    newExpanded.add(index);
                                  }
                                  setExpandedTests(newExpanded);
                                }}
                              >
                                {isExpanded ? (
                                  <ChevronDown className="w-4 h-4" />
                                ) : (
                                  <ChevronRight className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </CardHeader>

                        {isExpanded && (
                          <CardContent>
                            <div className="space-y-4">
                              <p className="text-sm text-zinc-400">
                                {result.testCase.description}
                              </p>

                              {/* Enhanced Code Transformation Visualization */}
                              {result.pipeline &&
                                result.pipeline.length > 1 && (
                                  <div className="space-y-4">
                                    <h4 className="font-medium text-white flex items-center gap-2">
                                      <Workflow className="w-4 h-4" />
                                      Code Transformation Pipeline
                                    </h4>
                                    <div className="space-y-6">
                                      {result.pipeline.map((codeSnap, i) => (
                                        <div
                                          key={i}
                                          className="border border-zinc-700 rounded-lg overflow-hidden"
                                        >
                                          <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 border-b border-zinc-700">
                                            <Badge
                                              variant={
                                                i === 0 ? "outline" : "default"
                                              }
                                              className="text-sm"
                                            >
                                              {i === 0
                                                ? "Original Code"
                                                : `After Layer ${result.testEnabledLayers[i - 1]}`}
                                            </Badge>
                                            {i > 0 && (
                                              <span className="text-sm text-zinc-400">
                                                {
                                                  LAYER_LIST.find(
                                                    (l) =>
                                                      l.id ===
                                                      result.testEnabledLayers[
                                                        i - 1
                                                      ],
                                                  )?.name
                                                }
                                              </span>
                                            )}
                                            {i > 0 && (
                                              <Badge
                                                variant="secondary"
                                                className="text-xs ml-auto"
                                              >
                                                Transformation {i}
                                              </Badge>
                                            )}
                                          </div>
                                          <div className="p-4 bg-zinc-900/50">
                                            <ScrollArea className="h-48 w-full rounded border border-zinc-600 bg-black/50 p-4">
                                              <pre className="text-sm text-zinc-100 whitespace-pre-wrap font-mono leading-relaxed">
                                                <code>{codeSnap}</code>
                                              </pre>
                                            </ScrollArea>
                                          </div>
                                        </div>
                                      ))}
                                    </div>

                                    {/* Before/After Comparison for the final result */}
                                    {result.pipeline.length >= 2 && (
                                      <div className="mt-6 p-4 bg-zinc-800/30 rounded-lg">
                                        <h5 className="font-medium text-white mb-4 flex items-center gap-2">
                                          <Code className="w-4 h-4" />
                                          Before vs After Summary
                                        </h5>
                                        <div className="grid md:grid-cols-2 gap-4">
                                          <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                              <Badge
                                                variant="outline"
                                                className="text-xs"
                                              >
                                                BEFORE
                                              </Badge>
                                              <span className="text-xs text-zinc-400">
                                                Original Code
                                              </span>
                                            </div>
                                            <ScrollArea className="h-32 rounded border border-zinc-600 bg-red-950/20 p-3">
                                              <pre className="text-xs text-zinc-200 whitespace-pre-wrap font-mono">
                                                <code>
                                                  {result.pipeline[0]}
                                                </code>
                                              </pre>
                                            </ScrollArea>
                                          </div>
                                          <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                              <Badge
                                                variant="default"
                                                className="text-xs"
                                              >
                                                AFTER
                                              </Badge>
                                              <span className="text-xs text-zinc-400">
                                                Transformed Code
                                              </span>
                                            </div>
                                            <ScrollArea className="h-32 rounded border border-zinc-600 bg-green-950/20 p-3">
                                              <pre className="text-xs text-zinc-200 whitespace-pre-wrap font-mono">
                                                <code>
                                                  {
                                                    result.pipeline[
                                                      result.pipeline.length - 1
                                                    ]
                                                  }
                                                </code>
                                              </pre>
                                            </ScrollArea>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}

                              {/* Detailed Results */}
                              <div className="grid md:grid-cols-2 gap-4">
                                {result.detectedFixes.length > 0 && (
                                  <div className="p-3 bg-green-900/20 border border-green-800/30 rounded-lg">
                                    <h4 className="font-medium text-green-400 mb-2 flex items-center gap-2">
                                      <CheckCircle className="w-4 h-4" />
                                      Detected Fixes (
                                      {result.detectedFixes.length})
                                    </h4>
                                    <div className="space-y-1">
                                      {result.detectedFixes.map((fix, i) => (
                                        <div
                                          key={i}
                                          className="text-sm text-green-300 flex items-center gap-2"
                                        >
                                          <CheckCircle className="w-3 h-3" />
                                          {fix}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {result.missingFixes.length > 0 && (
                                  <div className="p-3 bg-red-900/20 border border-red-800/30 rounded-lg">
                                    <h4 className="font-medium text-red-400 mb-2 flex items-center gap-2">
                                      <Bug className="w-4 h-4" />
                                      Missing Fixes (
                                      {result.missingFixes.length})
                                    </h4>
                                    <div className="space-y-1">
                                      {result.missingFixes.map((fix, i) => (
                                        <div
                                          key={i}
                                          className="text-sm text-red-300 flex items-center gap-2"
                                        >
                                          <XCircle className="w-3 h-3" />
                                          {fix}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    );
                  })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}

function getCategoryColor(category: string): string {
  switch (category) {
    case "config":
      return "border-zinc-500 text-zinc-700";
    case "pattern":
      return "border-zinc-500 text-zinc-700";
    case "hydration":
      return "border-zinc-500 text-zinc-700";
    case "component":
      return "border-zinc-500 text-zinc-700";
    default:
      return "border-gray-500 text-gray-700";
  }
}
