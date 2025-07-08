# NeuroLint CLI

[![npm version](https://badge.fury.io/js/%40neurolint%2Fcli.svg)](https://badge.fury.io/js/%40neurolint%2Fcli)
[![Node.js CI](https://github.com/neurolint/cli/workflows/Node.js%20CI/badge.svg)](https://github.com/neurolint/cli/actions)

> **Advanced rule-based code analysis and transformation tool using AST parsing and sophisticated pattern matching**

NeuroLint CLI is a production-ready command-line tool that brings enterprise-grade code analysis and transformation capabilities directly to your terminal. Built for modern development workflows with support for TypeScript, React, Next.js, and more.

## 🚀 Quick Start

```bash
# Install globally
npm install -g @neurolint/cli

# Initialize in your project
neurolint init

# Authenticate (optional, for advanced features)
neurolint login

# Analyze your code
neurolint analyze src/

# Fix issues automatically
neurolint fix src/
```

## 📦 Installation

### Global Installation (Recommended)

```bash
npm install -g @neurolint/cli
```

### Local Installation

```bash
# npm
npm install --save-dev @neurolint/cli

# yarn
yarn add --dev @neurolint/cli

# pnpm
pnpm add -D @neurolint/cli
```

### Requirements

- Node.js 16.0.0 or higher
- npm, yarn, or pnpm
- TypeScript 4.5+ (for TypeScript projects)

## 🎯 Features

### ✨ **6-Layer Analysis Engine**

- **Layer 1**: Configuration validation (tsconfig, package.json)
- **Layer 2**: Pattern & entity fixes (HTML entities, legacy patterns)
- **Layer 3**: Component best practices (React keys, accessibility)
- **Layer 4**: Hydration & SSR protection
- **Layer 5**: Next.js optimizations (App Router patterns)
- **Layer 6**: Quality & performance (error handling, optimization)

### 🛠️ **Smart Code Transformation**

- Automatic issue detection and fixing
- Safe transformations with backup support
- Dry-run mode for preview
- Customizable layer selection

### 🏢 **Enterprise Ready**

- Team management and collaboration
- SSO integration (SAML, OAuth2, OpenID)
- Audit trails and compliance reporting
- Webhook integrations
- Analytics and usage tracking

## 📖 Usage

### Basic Commands

```bash
# Get help
neurolint --help
neurolint help

# Initialize project
neurolint init
neurolint init --force  # Overwrite existing config

# Check project status
neurolint status
neurolint status --detailed

# Analyze code
neurolint analyze src/
neurolint scan components/  # 'scan' is an alias
neurolint analyze --layers=1,2,3
neurolint analyze --output=json

# Fix issues
neurolint fix src/
neurolint fix --dry-run     # Preview changes
neurolint fix --backup      # Create backups
neurolint fix --layers=1,2  # Fix specific layers
```

### Authentication

```bash
# Interactive login
neurolint login

# Login with API key
neurolint login --api-key YOUR_API_KEY

# Custom server
neurolint login --url https://api.neurolint.com
```

### Advanced Options

```bash
# Recursive analysis
neurolint analyze --recursive src/

# Custom file patterns
neurolint analyze --include="**/*.ts,**/*.tsx" --exclude="**/*.test.*"

# Different output formats
neurolint analyze --output=table    # Default
neurolint analyze --output=json     # JSON format
neurolint analyze --output=summary  # Brief summary
```

## ⚙️ Configuration

NeuroLint uses `.neurolint.json` for project configuration:

```json
{
  "version": "1.0.0",
  "layers": {
    "enabled": [1, 2, 3, 4],
    "config": {
      "1": { "name": "Configuration Validation", "timeout": 30000 },
      "2": { "name": "Pattern & Entity Fixes", "timeout": 45000 },
      "3": { "name": "Component Best Practices", "timeout": 60000 },
      "4": { "name": "Hydration & SSR Guard", "timeout": 45000 }
    }
  },
  "files": {
    "include": ["**/*.{ts,tsx,js,jsx}"],
    "exclude": ["node_modules/**", "dist/**", "build/**"]
  },
  "output": {
    "format": "table",
    "verbose": false
  },
  "api": {
    "url": "http://localhost:5000",
    "timeout": 60000
  }
}
```

### Environment Variables

```bash
# API Configuration
export NEUROLINT_API_KEY=your_api_key_here
export NEUROLINT_API_URL=https://api.neurolint.com

# Enterprise Features
export NEUROLINT_TEAM_ID=team_123456789
```

## 🏗️ Framework Support

### React & Next.js

```bash
# React-specific analysis
neurolint analyze --layers=3,4 src/components/

# Next.js optimizations
neurolint analyze --layers=5 src/app/
```

### TypeScript

```bash
# TypeScript configuration validation
neurolint analyze --layers=1 tsconfig.json

# Type-aware analysis
neurolint analyze --recursive src/ --include="**/*.ts,**/*.tsx"
```

### Vue.js & Svelte

```bash
# Vue component analysis
neurolint analyze src/ --include="**/*.vue"

# Svelte component analysis
neurolint analyze src/ --include="**/*.svelte"
```

## 🎨 Output Examples

### Table Format (Default)

```
┌─────────────────────────────────────────────────┐
│                Analysis Results                 │
├─────────────────────────────────────────────────┤
│ Files analyzed: 42                              │
│ Issues found: 8                                 │
│ Layers used: [1, 2, 3, 4]                      │
├─────────────────────────────────────────────────┤
│ Issues by Layer:                                │
│   Layer 1 (Config): 2 issues                   │
│   Layer 2 (Patterns): 3 issues                 │
│   Layer 3 (Components): 2 issues               │
│   Layer 4 (Hydration): 1 issue                 │
└─────────────────────────────────────────────────┘
```

### JSON Format

```json
{
  "summary": {
    "filesAnalyzed": 42,
    "issuesFound": 8,
    "layersUsed": [1, 2, 3, 4]
  },
  "issues": [
    {
      "layer": 1,
      "file": "tsconfig.json",
      "rule": "typescript-target",
      "severity": "warning",
      "message": "Consider upgrading TypeScript target to ES2022"
    }
  ]
}
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/neurolint/cli.git
cd cli

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Start development mode
npm run dev
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Website](https://neurolint.com)
- [Documentation](https://docs.neurolint.com)
- [API Reference](https://api.neurolint.com/docs)
- [GitHub Issues](https://github.com/neurolint/cli/issues)
- [Discord Community](https://discord.gg/neurolint)

## 🆘 Support

- 📧 Email: support@neurolint.com
- 💬 Discord: [Join our community](https://discord.gg/neurolint)
- 📖 Docs: [documentation](https://docs.neurolint.com)
- 🐛 Issues: [GitHub Issues](https://github.com/neurolint/cli/issues)

---

<div align="center">
  <strong>Made with ❤️ by the NeuroLint Team</strong>
</div>
