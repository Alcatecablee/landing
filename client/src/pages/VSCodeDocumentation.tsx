import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useNavigate, Link } from "react-router-dom";
import {
  Download,
  Code,
  Puzzle,
  Zap,
  ExternalLink,
  Settings,
  BarChart3,
  Shield,
  Terminal,
  Keyboard,
  Eye,
} from "lucide-react";

export default function VSCodeDocumentation() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-16">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="mb-6 border-2 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-600 bg-black px-6 py-3 rounded-xl"
          >
            ← Back
          </Button>
          <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight text-white">
            VS Code Extension
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl font-medium">
            Advanced rule-based code analysis and transformation directly in VS
            Code
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="bg-[#111111] border-2 border-zinc-800 p-2 rounded-2xl">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-gray-400 px-6 py-3 rounded-xl font-medium"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="installation"
              className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-gray-400 px-6 py-3 rounded-xl font-medium"
            >
              Installation
            </TabsTrigger>
            <TabsTrigger
              value="features"
              className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-gray-400 px-6 py-3 rounded-xl font-medium"
            >
              Features
            </TabsTrigger>
            <TabsTrigger
              value="commands"
              className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-gray-400 px-6 py-3 rounded-xl font-medium"
            >
              Commands
            </TabsTrigger>
            <TabsTrigger
              value="configuration"
              className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-gray-400 px-6 py-3 rounded-xl font-medium"
            >
              Configuration
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="bg-[#111111] border-2 border-zinc-800 rounded-3xl hover:border-zinc-600 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-white">
                  NeuroLint VS Code Extension: Real-time Code Intelligence
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Advanced analysis, intelligent fixes, and seamless integration
                  with your development workflow
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-zinc-400 mb-4">
                    <strong>NeuroLint VS Code Extension</strong> brings the
                    power of advanced code analysis directly into your editor.
                    Get real-time insights, intelligent fixes, and comprehensive
                    analysis without leaving VS Code.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-zinc-800 p-4 rounded-lg">
                      <h4 className="font-medium text-white mb-2">
                        Real-time Analysis
                      </h4>
                      <p className="text-zinc-400 text-sm">
                        Instant code analysis as you type with intelligent
                        diagnostics and suggestions
                      </p>
                    </div>
                    <div className="bg-zinc-800 p-4 rounded-lg">
                      <h4 className="font-medium text-white mb-2">
                        One-click Fixes
                      </h4>
                      <p className="text-zinc-400 text-sm">
                        Apply fixes instantly with context-aware code actions
                        and quick fixes
                      </p>
                    </div>
                    <div className="bg-zinc-800 p-4 rounded-lg">
                      <h4 className="font-medium text-white mb-2">
                        Explorer Integration
                      </h4>
                      <p className="text-zinc-400 text-sm">
                        Project overview and file-level insights directly in the
                        VS Code sidebar
                      </p>
                    </div>
                    <div className="bg-zinc-800 p-4 rounded-lg">
                      <h4 className="font-medium text-white mb-2">
                        Enterprise Ready
                      </h4>
                      <p className="text-zinc-400 text-sm">
                        Team collaboration, compliance reporting, and audit
                        logging for enterprise
                      </p>
                    </div>
                  </div>
                </div>

                <Separator className="bg-zinc-700" />

                <div>
                  <h3 className="font-semibold text-white mb-3">
                    Key Features
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-zinc-800 p-4 rounded-lg">
                      <Zap className="w-8 h-8 text-white mb-3" />
                      <h4 className="font-medium text-white mb-2">
                        Instant Diagnostics
                      </h4>
                      <p className="text-zinc-400 text-sm">
                        Real-time analysis with inline diagnostics and hover
                        documentation
                      </p>
                    </div>
                    <div className="bg-zinc-800 p-4 rounded-lg">
                      <Code className="w-8 h-8 text-white mb-3" />
                      <h4 className="font-medium text-white mb-2">
                        Smart Code Actions
                      </h4>
                      <p className="text-zinc-400 text-sm">
                        Context-aware code actions and automated refactoring
                        suggestions
                      </p>
                    </div>
                    <div className="bg-zinc-800 p-4 rounded-lg">
                      <Shield className="w-8 h-8 text-white mb-3" />
                      <h4 className="font-medium text-white mb-2">
                        Enterprise Features
                      </h4>
                      <p className="text-zinc-400 text-sm">
                        Team management, SSO integration, and compliance
                        reporting
                      </p>
                    </div>
                  </div>
                </div>

                <Separator className="bg-zinc-700" />

                <div>
                  <h3 className="font-semibold text-white mb-3">
                    What It Fixes
                  </h3>
                  <div className="bg-zinc-800 p-4 rounded-lg">
                    <ul className="space-y-2 text-zinc-400">
                      <li>
                        • Missing <strong>key</strong> props in mapped React
                        components
                      </li>
                      <li>
                        • HTML entity issues like{" "}
                        <code className="bg-zinc-700 px-1 rounded">
                          &quot; → "
                        </code>
                      </li>
                      <li>
                        • Accessibility problems (missing <strong>alt</strong>{" "}
                        attributes, ARIA labels)
                      </li>
                      <li>
                        • SSR hydration bugs and unsafe{" "}
                        <strong>localStorage</strong> calls
                      </li>
                      <li>
                        • TypeScript configuration and Next.js optimization
                        issues
                      </li>
                      <li>
                        • Component best practices and prop type improvements
                      </li>
                    </ul>
                  </div>
                </div>

                <Separator className="bg-zinc-700" />

                <div>
                  <h3 className="font-semibold text-white mb-3">
                    External Resources
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href="https://marketplace.visualstudio.com/items?itemName=neurolint.neurolint-vscode"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      VS Code Marketplace
                    </a>
                    <a
                      href="https://github.com/neurolint/neurolint-vscode"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      View on GitHub
                    </a>
                    <a
                      href="https://docs.neurolint.com/vscode"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white text-black hover:bg-zinc-200 px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      Documentation
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Installation Tab */}
          <TabsContent value="installation" className="space-y-6">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Installation</CardTitle>
                <CardDescription className="text-zinc-400">
                  Get the NeuroLint VS Code extension up and running
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-white mb-4">
                      From VS Code Marketplace
                    </h3>
                    <div className="bg-zinc-800 p-4 rounded-lg">
                      <h4 className="font-medium text-white mb-3">
                        Quick Install
                      </h4>
                      <ol className="space-y-2 text-sm text-zinc-300 mb-3">
                        <li className="flex items-start gap-2">
                          <span className="text-white font-medium">1.</span>
                          Open VS Code
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-white font-medium">2.</span>
                          Go to Extensions (Ctrl+Shift+X)
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-white font-medium">3.</span>
                          Search for "NeuroLint"
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-white font-medium">4.</span>
                          Click Install
                        </li>
                      </ol>
                      <p className="text-zinc-400 text-sm">
                        The extension will activate automatically for TypeScript
                        and JavaScript projects
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-white mb-4">
                      Command Line Installation
                    </h3>
                    <div className="bg-zinc-800 p-4 rounded-lg">
                      <h4 className="font-medium text-white mb-3">
                        Using VS Code CLI
                      </h4>
                      <pre className="text-sm text-zinc-300 bg-zinc-900 p-3 rounded font-mono mb-3">
                        {`# Install from command line
code --install-extension neurolint.neurolint-vscode

# Or from VSIX file
code --install-extension neurolint-vscode-1.0.0.vsix`}
                      </pre>
                      <p className="text-zinc-400 text-sm">
                        Perfect for automated setups and CI/CD environments
                      </p>
                    </div>
                  </div>
                </div>

                <Separator className="bg-zinc-700" />

                <div>
                  <h3 className="font-semibold text-white mb-3">
                    Initial Setup
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-zinc-800 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      <div>
                        <h4 className="font-medium text-white mb-1">
                          Configure API Key
                        </h4>
                        <p className="text-zinc-400 text-sm">
                          Open Command Palette (Ctrl+Shift+P) and run
                          "NeuroLint: Login" to set your API key
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-zinc-800 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                      <div>
                        <h4 className="font-medium text-white mb-1">
                          Set Analysis Layers
                        </h4>
                        <p className="text-zinc-400 text-sm">
                          Configure which analysis layers to enable via
                          "NeuroLint: Configure"
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-zinc-800 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        3
                      </div>
                      <div>
                        <h4 className="font-medium text-white mb-1">
                          Start Analyzing
                        </h4>
                        <p className="text-zinc-400 text-sm">
                          Open any TypeScript/JavaScript file and see real-time
                          analysis in action
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Real-time Analysis */}
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Zap className="w-8 h-8 text-white" />
                    <h3 className="text-xl font-semibold text-white">
                      Real-time Analysis
                    </h3>
                  </div>
                  <p className="text-zinc-400 mb-4">
                    Instant code analysis as you type with intelligent
                    diagnostics and suggestions.
                  </p>
                  <ul className="space-y-2 text-zinc-400 text-sm mb-4">
                    <li>• Live error detection</li>
                    <li>• Inline diagnostics</li>
                    <li>• Smart hover documentation</li>
                    <li>• Performance insights</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Code Actions */}
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Code className="w-8 h-8 text-white" />
                    <h3 className="text-xl font-semibold text-white">
                      Smart Code Actions
                    </h3>
                  </div>
                  <p className="text-zinc-400 mb-4">
                    Context-aware code actions and automated refactoring
                    suggestions.
                  </p>
                  <ul className="space-y-2 text-zinc-400 text-sm mb-4">
                    <li>• Quick fixes</li>
                    <li>• Automated refactoring</li>
                    <li>• Code transformations</li>
                    <li>• Import optimization</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Explorer Integration */}
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Eye className="w-8 h-8 text-white" />
                    <h3 className="text-xl font-semibold text-white">
                      Explorer Integration
                    </h3>
                  </div>
                  <p className="text-zinc-400 mb-4">
                    Project overview and file-level insights directly in the VS
                    Code sidebar.
                  </p>
                  <ul className="space-y-2 text-zinc-400 text-sm mb-4">
                    <li>• File analysis status</li>
                    <li>• Project health overview</li>
                    <li>• Issue tracking</li>
                    <li>• Progress monitoring</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Separator className="bg-zinc-700" />

            {/* Enterprise Features */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">
                  Enterprise Features
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Advanced capabilities for enterprise development teams
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-white">
                      Team Collaboration
                    </h3>
                    <div className="space-y-3">
                      <div className="bg-zinc-800 p-4 rounded-lg">
                        <h4 className="font-medium text-white mb-2">
                          Shared Configurations
                        </h4>
                        <p className="text-zinc-400 text-sm">
                          Sync team settings and analysis preferences
                        </p>
                      </div>
                      <div className="bg-zinc-800 p-4 rounded-lg">
                        <h4 className="font-medium text-white mb-2">
                          Team Analytics
                        </h4>
                        <p className="text-zinc-400 text-sm">
                          Track code quality metrics across your team
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-white">
                      Security & Compliance
                    </h3>
                    <div className="space-y-3">
                      <div className="bg-zinc-800 p-4 rounded-lg">
                        <h4 className="font-medium text-white mb-2">
                          SSO Integration
                        </h4>
                        <p className="text-zinc-400 text-sm">
                          SAML, OAuth 2.0, and OpenID Connect support
                        </p>
                      </div>
                      <div className="bg-zinc-800 p-4 rounded-lg">
                        <h4 className="font-medium text-white mb-2">
                          Audit Logging
                        </h4>
                        <p className="text-zinc-400 text-sm">
                          Comprehensive activity tracking and compliance
                          reporting
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Commands Tab */}
          <TabsContent value="commands" className="space-y-6">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Available Commands</CardTitle>
                <CardDescription className="text-zinc-400">
                  All NeuroLint commands and their keyboard shortcuts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div className="bg-zinc-800 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white">
                        NeuroLint: Analyze Current File
                      </h4>
                      <code className="text-sm bg-zinc-700 px-2 py-1 rounded text-zinc-300">
                        Ctrl+Shift+L
                      </code>
                    </div>
                    <p className="text-zinc-400 text-sm">
                      Analyze the currently open file with all enabled layers
                    </p>
                  </div>

                  <div className="bg-zinc-800 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white">
                        NeuroLint: Fix Current File
                      </h4>
                      <code className="text-sm bg-zinc-700 px-2 py-1 rounded text-zinc-300">
                        Ctrl+Shift+F
                      </code>
                    </div>
                    <p className="text-zinc-400 text-sm">
                      Apply automatic fixes to the current file
                    </p>
                  </div>

                  <div className="bg-zinc-800 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white">
                        NeuroLint: Analyze Workspace
                      </h4>
                      <code className="text-sm bg-zinc-700 px-2 py-1 rounded text-zinc-300">
                        Ctrl+Shift+W
                      </code>
                    </div>
                    <p className="text-zinc-400 text-sm">
                      Analyze all files in the current workspace
                    </p>
                  </div>

                  <div className="bg-zinc-800 p-4 rounded-lg">
                    <h4 className="font-medium text-white mb-2">
                      NeuroLint: Configure
                    </h4>
                    <p className="text-zinc-400 text-sm">
                      Open configuration settings and preferences
                    </p>
                  </div>

                  <div className="bg-zinc-800 p-4 rounded-lg">
                    <h4 className="font-medium text-white mb-2">
                      NeuroLint: Show Output
                    </h4>
                    <p className="text-zinc-400 text-sm">
                      Show the NeuroLint output panel with detailed logs
                    </p>
                  </div>

                  <div className="bg-zinc-800 p-4 rounded-lg">
                    <h4 className="font-medium text-white mb-2">
                      NeuroLint: Login
                    </h4>
                    <p className="text-zinc-400 text-sm">
                      Authenticate with your NeuroLint API key
                    </p>
                  </div>
                </div>

                <Separator className="bg-zinc-700" />

                <div>
                  <h3 className="font-semibold text-white mb-3">
                    Enterprise Commands
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-zinc-800 p-3 rounded-lg">
                      <h5 className="font-medium text-white text-sm">
                        NeuroLint Enterprise: Dashboard
                      </h5>
                      <p className="text-xs text-zinc-400 mt-1">
                        Open enterprise analytics dashboard
                      </p>
                    </div>
                    <div className="bg-zinc-800 p-3 rounded-lg">
                      <h5 className="font-medium text-white text-sm">
                        NeuroLint Enterprise: Team
                      </h5>
                      <p className="text-xs text-zinc-400 mt-1">
                        Manage team members and permissions
                      </p>
                    </div>
                    <div className="bg-zinc-800 p-3 rounded-lg">
                      <h5 className="font-medium text-white text-sm">
                        NeuroLint Enterprise: Compliance
                      </h5>
                      <p className="text-xs text-zinc-400 mt-1">
                        View compliance reports and audit trail
                      </p>
                    </div>
                    <div className="bg-zinc-800 p-3 rounded-lg">
                      <h5 className="font-medium text-white text-sm">
                        NeuroLint Enterprise: Analytics
                      </h5>
                      <p className="text-xs text-zinc-400 mt-1">
                        View detailed team analytics
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configuration Tab */}
          <TabsContent value="configuration" className="space-y-6">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Configuration</CardTitle>
                <CardDescription className="text-zinc-400">
                  Customize the NeuroLint VS Code extension settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-white mb-4">
                      Basic Settings
                    </h3>
                    <div className="bg-zinc-800 p-4 rounded-lg">
                      <h4 className="font-medium text-white mb-3">
                        VS Code Settings
                      </h4>
                      <pre className="text-sm text-zinc-300 bg-zinc-900 p-3 rounded font-mono">
                        {`{
  "neurolint.apiUrl": "https://api.neurolint.com",
  "neurolint.apiKey": "your-api-key-here",
  "neurolint.enabledLayers": [1, 2, 3, 4],
  "neurolint.autoFix": false,
  "neurolint.diagnosticsLevel": "warning",
  "neurolint.timeout": 30000
}`}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-white mb-4">
                      Enterprise Settings
                    </h3>
                    <div className="bg-zinc-800 p-4 rounded-lg">
                      <h4 className="font-medium text-white mb-3">
                        Team Configuration
                      </h4>
                      <pre className="text-sm text-zinc-300 bg-zinc-900 p-3 rounded font-mono">
                        {`{
  "neurolint.enterpriseFeatures.enabled": true,
  "neurolint.enterpriseFeatures.teamId": "your-team-id",
  "neurolint.enterpriseFeatures.auditLogging": true,
  "neurolint.enterpriseFeatures.complianceMode": true
}`}
                      </pre>
                    </div>
                  </div>
                </div>

                <Separator className="bg-zinc-700" />

                <div>
                  <h3 className="font-semibold text-white mb-3">
                    Analysis Layers Configuration
                  </h3>
                  <div className="grid gap-4">
                    <div className="bg-zinc-800 p-6 rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-zinc-700 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          1-4
                        </div>
                        <h4 className="text-lg font-semibold text-white">
                          Recommended Layers
                        </h4>
                      </div>
                      <p className="text-zinc-400 mb-3">
                        Enable layers 1-4 for comprehensive analysis without
                        experimental features
                      </p>
                      <pre className="text-sm text-zinc-300 bg-zinc-900 p-3 rounded font-mono">
                        {`"neurolint.enabledLayers": [1, 2, 3, 4]`}
                      </pre>
                    </div>

                    <div className="bg-zinc-800 p-6 rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-zinc-700 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          5-6
                        </div>
                        <h4 className="text-lg font-semibold text-white">
                          Experimental Layers
                        </h4>
                      </div>
                      <p className="text-zinc-400 mb-3">
                        Advanced features that may require additional setup
                      </p>
                      <pre className="text-sm text-zinc-300 bg-zinc-900 p-3 rounded font-mono">
                        {`"neurolint.enabledLayers": [1, 2, 3, 4, 5, 6]`}
                      </pre>
                    </div>
                  </div>
                </div>

                <Separator className="bg-zinc-700" />

                <div>
                  <h3 className="font-semibold text-white mb-3">
                    Workspace Settings
                  </h3>
                  <div className="bg-zinc-800 p-4 rounded-lg">
                    <pre className="text-sm text-zinc-300 bg-zinc-900 p-3 rounded font-mono">
                      {`{
  "neurolint.workspace.maxFileSize": 10485760,
  "neurolint.workspace.maxFiles": 1000,
  "neurolint.workspace.excludePatterns": [
    "**/node_modules/**",
    "**/dist/**",
    "**/build/**",
    "**/.next/**"
  ],
  "neurolint.workspace.includePatterns": [
    "**/*.ts",
    "**/*.tsx",
    "**/*.js",
    "**/*.jsx"
  ]
}`}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card className="bg-zinc-900 border-zinc-800 mt-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-white mb-1">
                  Ready to Get Started?
                </h3>
                <p className="text-zinc-400 text-sm">
                  Install the extension and start improving your code quality
                  today
                </p>
              </div>
              <div className="flex gap-3">
                <Link to="/cli-docs">
                  <Button
                    variant="outline"
                    className="border-zinc-600 text-zinc-300 hover:bg-zinc-700"
                  >
                    CLI Docs
                  </Button>
                </Link>
                <Link to="/api-docs">
                  <Button
                    variant="outline"
                    className="border-zinc-600 text-zinc-300 hover:bg-zinc-700"
                  >
                    API Docs
                  </Button>
                </Link>
                <a
                  href="https://marketplace.visualstudio.com/items?itemName=neurolint.neurolint-vscode"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-white text-black hover:bg-zinc-200">
                    Install Extension
                  </Button>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-xs text-center text-zinc-400 mt-8">
          NeuroLint VS Code Extension is open source (MIT License), built as
          part of the NeuroLint project.
          <br />
          Like it? Star us on GitHub, or drop us feedback!
        </div>
      </div>
    </div>
  );
}
