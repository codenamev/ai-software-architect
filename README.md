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

## Integration Method Comparison

Choose the right integration method for your workflow:

| Feature | Claude Skills | MCP Server | Traditional | Best For |
|---------|---------------|------------|-------------|----------|
| **Installation** | Copy skills to ~/.claude/ | npm install -g | Clone repo | Skills: Reusable across projects<br>MCP: Programmatic use<br>Traditional: Quick start |
| **Setup Complexity** | ⭐ Simple | ⭐⭐ Medium | ⭐ Simple | Skills & Traditional easiest |
| **AI Assistants** | Claude Code | Claude, Cursor | All assistants | Skills: Claude only<br>MCP: Claude, Cursor<br>Traditional: Universal |
| **Invocation** | Automatic | Programmatic tools | Natural language | Skills: Most seamless<br>MCP: Most precise<br>Traditional: Most flexible |
| **Dependencies** | None | Node.js ≥18 | None | Skills & Traditional: No deps |
| **Core Features** | ✅ All 7 | ✅ All 7 | ✅ All 7 | All methods support core features |
| **Advanced Features** | ⚠️ 60% | ⚠️ 33% | ✅ 100% | Traditional most feature-complete |
| **Input Validation** | ✅ Yes | ⚠️ Basic | ❌ No | Skills has best validation |
| **Pragmatic Mode** | ✅ Yes | ✅ Yes | ✅ Yes | All methods support YAGNI enforcement |
| **Dynamic Members** | ✅ Yes | ❌ No | ✅ Yes | Skills & Traditional auto-create specialists |
| **Recalibration** | ⚠️ Planned | ❌ No | ✅ Yes | Traditional fully supports |
| **Project Analysis** | ⚠️ Basic | ✅ Advanced | ⚠️ Basic | MCP has best analysis |
| **Error Handling** | ✅ Explicit | ✅ Explicit | ⚠️ Implicit | Skills & MCP clearest |
| **Documentation** | ✅ Detailed | ✅ Detailed | ✅ Detailed | All well-documented |
| **Customization** | ⚠️ Edit skills | ⚠️ Fork code | ✅ Easy | Traditional most customizable |
| **Updates** | Re-copy files | npm update | Git pull | Each has update path |
| **Portability** | ✅ High | ⚠️ Medium | ✅ High | Skills & Traditional most portable |

### Recommendation by Use Case

**Choose Claude Skills if**:
- You use Claude Code exclusively
- You want the simplest setup
- You want automatic skill invocation
- You value portability across projects

**Choose MCP Server if**:
- You use Claude Code or Cursor
- You want programmatic automation
- You need advanced project analysis
- You're building integrations

**Choose Traditional if**:
- You use multiple AI assistants
- You want maximum flexibility
- You need all advanced features (pragmatic mode, recalibration)
- You want easy customization

### Feature Availability Matrix

| Feature | Claude Skills | MCP Server | Traditional |
|---------|---------------|------------|-------------|
| Setup Architecture | ✅ | ✅ | ✅ |
| Create ADR | ✅ | ✅ | ✅ |
| Architecture Review | ✅ | ✅ | ✅ |
| Specialist Review | ✅ | ✅ | ✅ |
| List Members | ✅ | ✅ | ✅ |
| Get Status | ✅ | ✅ | ✅ |
| Pragmatic Mode (YAGNI) | ✅ | ✅ | ✅ |
| Dynamic Member Creation | ✅ | ❌ | ✅ |
| Recalibration Process | ⚠️ | ❌ | ✅ |
| Initial System Analysis | ❌ | ✅ | ✅ |
| Input Validation | ✅ | ⚠️ | ❌ |
| Tool Restrictions | ✅ | N/A | N/A |

**Legend**: ✅ Fully supported, ⚠️ Partially supported, ❌ Not supported, N/A Not applicable

See [Feature Parity Analysis](.architecture/reviews/feature-parity-analysis.md) for detailed comparison.

## Getting Started

After installation, start using the framework with these standardized commands:

### Standard Commands

**Setup**:
```
Setup ai-software-architect
```

**Create ADR**:
```
Create ADR for [decision topic]
```
Example: "Create ADR for PostgreSQL database choice"

**Architecture Review**:
```
Start architecture review for [version/feature]
```
Examples: "Start architecture review for version 2.0.0" or "Start architecture review for authentication feature"

**Specialist Review**:
```
Ask [Specialist Name] to review [target]
```
Example: "Ask Security Specialist to review API authentication"

**List Members**:
```
List architecture members
```

**Check Status**:
```
What's our architecture status?
```

**Enable Pragmatic Mode** (Optional):
```
Enable pragmatic mode
```
Example: "Enable pragmatic mode with balanced intensity"

**Recalibration** (Traditional method):
```
Start architecture recalibration for [target]
```

See [USAGE.md](USAGE.md) for detailed workflow instructions and platform-specific variations.

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

**Standard Commands**:
- **Setup**: "Setup ai-software-architect"
- **Create ADR**: "Create ADR for [topic]"
- **Architecture Review**: "Start architecture review for [version/feature]"
- **Specialist Review**: "Ask [Specialist Name] to review [target]"
- **List Members**: "List architecture members"
- **Check Status**: "What's our architecture status?"
- **Recalibration**: "Start architecture recalibration for [target]" (Traditional method)

**Alternative Phrases**:
- Setup: "Setup .architecture", "Initialize architecture framework"
- Create ADR: "Document architectural decision for [topic]", "Write ADR about [topic]"
- Reviews: "Conduct architecture review", "Review architecture for [scope]"
- Specialist: "Get [specialist]'s opinion on [topic]", "Have [role] review [component]"

Claude can dynamically create new specialist roles if they don't exist in your `members.yml` file.

### Cursor

For Cursor users, see [USAGE-WITH-CURSOR.md](USAGE-WITH-CURSOR.md) for detailed instructions.

**Standard Commands**:
- **Setup**: "Setup ai-software-architect"
- **Create ADR**: "Create ADR for [topic]"
- **Architecture Review**: "Start architecture review for [version/feature]"
- **Specialist Review**: "Ask [Specialist Name] to review [target]"
- **List Members**: "List architecture members"
- **Check Status**: "What's our architecture status?"

**Natural Alternatives** (Cursor also understands):
- "Review this architecture"
- "Analyze this from a security perspective"
- "Create an ADR for this decision"

Cursor uses .mdc rule files in the `.coding-assistants/cursor/` directory to understand the framework.

### GitHub Copilot / Codex

For GitHub Copilot and OpenAI Codex users, see [USAGE-WITH-CODEX.md](USAGE-WITH-CODEX.md) for detailed instructions.

**Natural Language Commands** (context-based recognition):
- **Setup**: "Setup architecture"
- **Create ADR**: "Create an ADR for [decision]"
- **Architecture Review**: "Review this architecture", "Start architecture review for [target]"
- **Specialist Review**: "Review this for security issues", "Analyze this for performance"
- **Check Status**: "Summarize our architectural decisions"

**Key Features**:
- No need to mention the framework explicitly
- Context-based recognition from project files
- Inline architectural guidance in your IDE
- Code generation following established patterns
- Natural conversation about architecture

**Example Commands**:
- "What are the architectural implications of this change?"
- "Review this database schema for performance"
- "Does this code follow our architectural principles?"

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

### Pragmatic Mode (YAGNI Enforcement)

Pragmatic Mode helps prevent over-engineering by adding a "Pragmatic Enforcer" who:
- **Challenges complexity** - Questions abstractions, patterns, and "best practices" that may not be needed yet
- **Proposes simpler alternatives** - Suggests minimal implementations that meet current requirements
- **Calculates trade-offs** - Scores necessity vs. complexity (target ratio <1.5)
- **Tracks deferrals** - Documents decisions to defer features with clear trigger conditions

**When to use**:
- New projects or MVPs
- Teams prone to over-engineering
- Resource-constrained environments
- Projects with tight deadlines

**Configurable intensity**:
- **Strict**: Challenges aggressively, requires strong justification
- **Balanced**: Thoughtful challenges, accepts justified complexity (recommended)
- **Lenient**: Raises concerns without blocking

Enable with:
```
Enable pragmatic mode
```

See [ADR-002](/.architecture/decisions/adrs/ADR-002-pragmatic-guard-mode.md) and [Pragmatic Mode Summary](/.architecture/decisions/PRAGMATIC-MODE-SUMMARY.md) for details.

### Feature-Based Architecture Management

The framework now supports:
- Version-based reviews and recalibration (e.g., for v2.1.0)
- Feature-based reviews and recalibration (e.g., for "payment processing")
- Component-specific reviews (e.g., for "authentication system")

## License

MIT
