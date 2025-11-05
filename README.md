# AI Software Architect

A markdown-based framework for implementing rigorous software architecture practices in any project, with specialized AI assistant integration.

<div>
  <a href="https://www.loom.com/share/b83f478045e04bb9ba7e70f5fe057d14">
    <p>Introducing AI Software Architect 🚀 - Watch Video</p>
  </a>
  <a href="https://www.loom.com/share/b83f478045e04bb9ba7e70f5fe057d14">
    <img style="max-width:300px;" src="https://cdn.loom.com/sessions/thumbnails/b83f478045e04bb9ba7e70f5fe057d14-901889c69de34909-full-play.gif">
  </a>
</div>

## Overview

This framework provides a structured approach to:

1. **Architecture Documentation** - Templates and processes for documenting architectural decisions
2. **Architecture Reviews** - A multi-perspective review process with specialized reviewers
3. **Architecture Recalibration** - Process for translating reviews into concrete implementation plans
4. **Progress Tracking** - Tools for monitoring the implementation of architectural changes
5. **AI Integration** - Seamless collaboration with AI coding assistants

For detailed usage instructions, see [USAGE.md](USAGE.md).

## Installation

Choose the installation method for your AI assistant:

### Claude Code Installation

Claude Code supports three installation methods:

**Option 1: Claude Skills (Recommended for Claude Code)**

Install as reusable skills that work across all your projects:

```bash
# Clone and install skills
git clone https://github.com/codenamev/ai-software-architect
cp -r ai-software-architect/.claude/skills ~/.claude/
rm -rf ai-software-architect
```

Then in any project:
```
Setup ai-software-architect
```

See [USAGE-WITH-CLAUDE-SKILLS.md](USAGE-WITH-CLAUDE-SKILLS.md) for detailed instructions.

**Benefits**: Simpler setup, no dependencies, automatic skill invocation, portable

**Option 2: MCP Server**

```bash
npm install -g ai-software-architect
```

Then configure in `~/.claude/config.json`:
```json
{
  "mcpServers": {
    "ai-software-architect": {
      "command": "mcp",
      "args": []
    }
  }
}
```

**Benefits**: Programmatic automation, external tool integration

**Option 3: Traditional Setup**

```
Setup architecture using: https://github.com/codenamev/ai-software-architect
```

See [USAGE-WITH-CLAUDE.md](USAGE-WITH-CLAUDE.md) for detailed instructions.

**Benefits**: No installation required, works immediately

### Cursor Installation  

If you're using Cursor, you have two options:

**Option 1: MCP Server (Recommended)**
```bash
npm install -g ai-software-architect
```
Then configure in Cursor settings (`settings.json`):
```json
{
  "mcp.servers": {
    "ai-software-architect": {
      "command": "mcp",
      "args": []
    }
  }
}
```

**Option 2: Traditional Setup**
```
Setup architecture using @https://github.com/codenamev/ai-software-architect
```
See [USAGE-WITH-CURSOR.md](USAGE-WITH-CURSOR.md) for detailed traditional setup instructions.

### GitHub Copilot / Codex Installation

**MCP Support**: GitHub Copilot and Codex currently have limited MCP support. Use the traditional setup method:

```
Setup architecture using: https://github.com/codenamev/ai-software-architect
```

See [USAGE-WITH-CODEX.md](USAGE-WITH-CODEX.md) for detailed setup instructions. The framework will be configured with context files that GitHub Copilot and Codex can automatically understand.

## Getting Started

After installation, start using the framework:

- **Create architecture decisions**: "Help me create an ADR for our new authentication system"
- **Start architecture reviews**: "Start an architecture review for version 2.0.0"
- **Get specialist opinions**: "Ask Security Architect to review this API design"

See [USAGE.md](USAGE.md) for detailed workflow instructions.

## Upgrading

Already have AI Software Architect installed? Upgrade to get the latest features:

```
Upgrade my AI Software Architect framework from https://github.com/codenamev/ai-software-architect
```

See [UPGRADE.md](UPGRADE.md) for detailed upgrade instructions.

## Directory Structure

```
.architecture/
├── decisions/
│   ├── adrs/                # Architectural Decision Records
│   └── principles.md        # Architectural principles document
├── reviews/                 # Architecture review documents
├── recalibration/           # Recalibration plans and tracking
├── comparisons/             # Version-to-version comparisons
├── docs/                    # General architecture documentation
├── templates/               # Templates for various documents
└── members.yml              # Architecture review team members
```

## Usage with AI Assistants

This framework is designed to work seamlessly with AI assistants. Each assistant has specialized instructions in the `.coding-assistants` directory.

For general usage instructions, see [USAGE.md](USAGE.md).

### Claude Code

For Claude Code users, see [USAGE-WITH-CLAUDE-SKILLS.md](USAGE-WITH-CLAUDE-SKILLS.md) (Skills method) or [USAGE-WITH-CLAUDE.md](USAGE-WITH-CLAUDE.md) (Traditional method) for detailed instructions.

**Available Skills** (when using Claude Skills installation):
- **setup-architect**: Automatically sets up and customizes the framework
- **create-adr**: Creates Architectural Decision Records
- **architecture-review**: Conducts comprehensive multi-perspective reviews
- **specialist-review**: Gets focused reviews from specific experts
- **list-members**: Shows your architecture team
- **architecture-status**: Displays current documentation state

**Key Commands**:
- **Setup & Customization**: "Setup ai-software-architect", "Setup .architecture"
- **Reviews**: "Start architecture review for version X.Y.Z" or "Review architecture for 'component'"
- **Specialized Reviews**: "Ask Security Specialist to review these code changes"
- **Recalibration**: "Start architecture recalibration for 'feature name'"
- **ADR Creation**: "Create ADR for 'topic'"
- **Status Check**: "What's our architecture status?"
- **Team Info**: "List architecture members"

Claude can dynamically create new specialist roles if they don't exist in your `members.yml` file.

### Cursor

For Cursor users, see [USAGE-WITH-CURSOR.md](USAGE-WITH-CURSOR.md) for detailed instructions. Key capabilities include:

- **Setup & Customization**: "Setup ai-software-architect", "Setup architecture"
- **Architecture Reviews**: "Review this architecture using the AI Software Architect framework"
- **Specialized Reviews**: "Analyze this from a security perspective using AI Software Architect"
- **Documentation Creation**: "Create an ADR for this decision using the AI Software Architect format"

Cursor uses .mdc rule files in the `.coding-assistants/cursor` directory to understand the framework.

### GitHub Copilot / Codex

For GitHub Copilot and OpenAI Codex users, see [USAGE-WITH-CODEX.md](USAGE-WITH-CODEX.md) for detailed instructions. Key features include:

- **Natural Language Commands**: Uses context-based recognition - no need to mention the framework explicitly
- **Architecture Reviews**: "Review this architecture", "What are the security implications?"
- **ADR Creation**: "Create an ADR for our database choice"
- **Code Generation**: Generate code that follows established architectural patterns and ADRs
- **Inline Guidance**: Get architectural suggestions directly in your IDE

Examples of natural commands:
- "What are the architectural implications of this change?"
- "Review this database schema for performance"
- "Create an ADR for our microservices approach"

### Other AI Assistants

Support for additional AI assistants can be added by creating appropriate configuration files in the `.coding-assistants` directory following the established patterns.

## Key Features

### Architectural Wisdom

The framework incorporates wisdom from influential software architects including Martin Fowler, Sandi Metz, Robert C. Martin, Eric Evans, Sarah Mei, and others. These principles are embedded in the architectural documentation.

### Multi-Perspective Reviews

Architecture reviews consider multiple specialized perspectives:
- Systems Architecture
- Domain Expertise
- Security
- Performance
- Maintainability
- AI Engineering
- And dynamically created specialists as needed

### Feature-Based Architecture Management

The framework now supports:
- Version-based reviews and recalibration (e.g., for v2.1.0)
- Feature-based reviews and recalibration (e.g., for "payment processing")
- Component-specific reviews (e.g., for "authentication system")

## License

MIT
