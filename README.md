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

For detailed usage instructions, see [USAGE.md](USAGE.md). For troubleshooting and advanced usage, see [TROUBLESHOOTING.md](TROUBLESHOOTING.md).

## Installation

Choose the installation method for your AI assistant:

### Claude Code Installation

Claude Code supports three installation methods:

**Option 1: Claude Code Plugin (Recommended)** 🆕

Install via the Claude Code plugin system with automatic updates:

```bash
# In Claude Code, run these commands:
/plugin marketplace add codenamev/ai-software-architect
/plugin install ai-software-architect@ai-software-architect
```

That's it! The framework is now available in all your projects — including the seven skills, MCP server, and generated subagents as a single unit.

See [USAGE-WITH-CLAUDE-PLUGIN.md](USAGE-WITH-CLAUDE-PLUGIN.md) for detailed installation guide, troubleshooting, and comparison with other methods.

**Benefits**: Simplest installation, automatic updates, works across all projects, no manual file management, ships skills + MCP + hooks as a unit

**When to use**: You use Claude Code and want the most streamlined experience with automatic updates.

---

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

**Benefits**: Programmatic automation, external tool integration, advanced project analysis

**When to use**: You need programmatic access or integration with other MCP-compatible tools.

---

**Option 3: Traditional Setup**

```
Setup architecture using: https://github.com/codenamev/ai-software-architect
```

See [USAGE-WITH-CLAUDE.md](USAGE-WITH-CLAUDE.md) for detailed instructions.

**Benefits**: No installation required, works immediately, maximum flexibility

**When to use**: Quick experiments, no installation permissions, or maximum customization needs.

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

## Installation Method Comparison

Choose the right installation method for your workflow:

| Feature | Plugin 🆕 | MCP Server | Traditional | Best For |
|---------|----------|------------|-------------|----------|
| **Installation** | Two commands | npm install -g | Clone repo | Plugin: Simplest<br>MCP: Programmatic<br>Traditional: Quick |
| **Setup Complexity** | ⭐ Simplest | ⭐⭐ Medium | ⭐ Simple | Plugin easiest |
| **AI Assistants** | Claude Code | Claude, Cursor | All assistants | Plugin: Claude only<br>MCP: Claude, Cursor<br>Traditional: Universal |
| **Invocation** | Automatic (MCP + Skills) | Programmatic tools | Natural language | Plugin: Seamless<br>MCP: Precise<br>Traditional: Flexible |
| **Dependencies** | Node.js ≥18 (auto) | Node.js ≥18 | None | Traditional: No deps<br>Plugin & MCP: Node auto-managed |
| **Auto-Updates** | ✅ `/plugin update` | ✅ `npm update` | ❌ Git pull | Plugin & MCP: Auto-update |
| **Offline Use** | ⚠️ Needs npm | ⚠️ Needs npm | ✅ Full | Traditional: Offline ready |
| **Tier-1 Deterministic Tools** | ✅ All 6 | ✅ All 6 | ✅ All 6 | All methods identical |
| **Tier-2 Reviews / Enforcement** | ✅ Skills | ❌ MCP-only install | ✅ Yes | Plugin & Traditional run reviews |
| **Advanced Features** | ⚠️ 33% | ⚠️ 33% | ✅ 100% | Traditional most complete |
| **Input Validation** | ✅ Yes | ⚠️ Basic | ❌ No | Plugin best |
| **Pragmatic Mode** | ✅ Yes | ⚠️ Config only | ✅ Yes | MCP configures; reviews are Tier 2 |
| **Dynamic Members** | ✅ Yes | ❌ No | ✅ Yes | Plugin & Traditional auto-create |
| **Recalibration** | ❌ No | ❌ No | ✅ Yes | Traditional only |
| **Project Analysis** | ✅ Advanced | ✅ Advanced | ⚠️ Basic | Plugin & MCP: Advanced |
| **Error Handling** | ✅ Explicit | ✅ Explicit | ⚠️ Implicit | Plugin, MCP clearest |
| **Documentation** | ✅ Detailed | ✅ Detailed | ✅ Detailed | All well-documented |
| **Customization** | ⚠️ Fork npm pkg | ⚠️ Fork npm pkg | ✅ Easy | Traditional most flexible |
| **Multi-Project** | ✅ Automatic | ✅ Automatic | ⚠️ Per-project | Plugin, MCP global |
| **Version Control** | ❌ External | ❌ External | ✅ In repo | Traditional best for VCS |

### Recommendation by Use Case

**Choose Plugin if** (Recommended for most Claude Code users):
- ✅ You use Claude Code exclusively
- ✅ You want the absolute simplest installation (2 commands)
- ✅ You want automatic updates (`/plugin update`)
- ✅ You're okay with internet dependency for updates
- ✅ You want zero manual file management

**Choose MCP Server if**:
- You use Claude Code or Cursor
- You want programmatic automation
- You need advanced project analysis
- You're building integrations
- You prefer npm-based package management

**Choose Traditional if**:
- You use multiple AI assistants (Copilot, Codex, etc.)
- You want maximum flexibility and customization
- You need recalibration (only the Traditional path implements it)
- You want the framework files in your repository
- You need offline capability with full features

### Feature Availability Matrix

| Feature | Plugin 🆕 | MCP Server | Traditional |
|---------|----------|------------|-------------|
| Setup Architecture (Tier 1) | ✅ | ✅ | ✅ |
| Create ADR (Tier 1) | ✅ | ✅ | ✅ |
| List Members (Tier 1) | ✅ | ✅ | ✅ |
| Get Status (Tier 1) | ✅ | ✅ | ✅ |
| Configure Pragmatic Mode (Tier 1) | ✅ | ✅ | ✅ |
| Implementation Guidance (Tier 1) | ✅ | ✅ | ✅ |
| Architecture Review (Tier 2) | ✅ Skills | ❌ MCP tool | ✅ |
| Specialist Review (Tier 2) | ✅ Skills | ❌ MCP tool | ✅ |
| Pragmatic Enforcement (Tier 2) | ✅ Subagent | ❌ MCP tool | ✅ |
| Dynamic Member Creation | ✅ | ❌ | ✅ |
| Recalibration Process | ❌ | ❌ | ✅ |
| Initial System Analysis | ✅ | ✅ | ✅ |
| Input Validation | ✅ | ⚠️ | ❌ |
| Tool Restrictions | ✅ | N/A | N/A |
| Auto-Update | ✅ | ✅ | ❌ |

**Legend**: ✅ Fully supported, ⚠️ Partially supported, ❌ Not supported, N/A Not applicable

**Note**: The Plugin bundles the same npm package as the MCP Server option, plus the seven skills, generated subagents, and ADR-validation hook as a single install unit.

**Two-tier capability model** (see [ADR-015](.architecture/decisions/adrs/ADR-015-mcp-skills-parity-reconciliation.md)): Tier-1 operations are deterministic file/config tasks available on every channel, including the MCP server. Tier-2 capabilities — orchestrated architecture reviews, specialist reviews, and pragmatic enforcement — require LLM reasoning and are delivered only through the plugin/Skills (`architecture-review`, `specialist-review`, and the `pragmatic-enforcer` subagent), not as MCP tools. The Plugin gets Tier 2 via its bundled Skills; an MCP-only install does not.

See [Feature Parity Analysis](.architecture/reviews/feature-parity-analysis.md) for detailed comparison.

### Quick Installation Decision Tree

```
Do you use Claude Code?
├─ Yes → ✅ Choose Plugin (simplest, ships skills + MCP + hooks together)
│
└─ No → Do you use Cursor?
         ├─ Yes → ✅ Choose MCP Server (Cursor compatible)
         └─ No  → Choose Traditional (universal — Copilot, Codex, etc.)
```

**Still unsure?** Start with Plugin if you use Claude Code. It's the easiest to set up and you can always switch later. All methods provide identical core functionality.

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

**Implement with Methodology**:
```
Implement [feature] as the architects
```
Examples: "Implement authentication as the architects" or "Implement user registration as the architects"

**Recalibration** (Traditional method):
```
Start architecture recalibration for [target]
```

See [USAGE.md](USAGE.md) for detailed workflow instructions and platform-specific variations.

## Upgrading

Already have AI Software Architect installed? Update to get the latest features and improvements.

### Quick Update (Recommended)

For any AI assistant, simply ask:

```
Update the software architect framework from https://github.com/codenamev/ai-software-architect
```

Your AI assistant will fetch the latest framework files from the main branch while preserving your project's architecture artifacts (ADRs, reviews, recalibration plans).

### Manual Update Methods

**If using Claude Skills:**
```bash
# Update skills to latest version - backup old versions first
mkdir -p ~/.ai-architect-backups/skills-$(date +%Y%m%d-%H%M%S)
cd ~/.claude/skills
mv setup-architect architecture-review create-adr list-members architecture-status specialist-review ~/.ai-architect-backups/skills-$(date +%Y%m%d-%H%M%S)/ 2>/dev/null || true

# Install from latest
git clone https://github.com/codenamev/ai-software-architect /tmp/ai-architect-$$
cp -r /tmp/ai-architect-$$/skills/* ./

echo "Backup created at ~/.ai-architect-backups/skills-TIMESTAMP/"
echo "You can safely remove this backup once you've verified the update works correctly."
echo "Temporary files will be automatically cleaned up on system restart."
```

**If using MCP Server:**
```bash
# Update to latest version
npm update -g ai-software-architect

# Or reinstall
npm install -g ai-software-architect
```

**If using Traditional Setup:**
```bash
# From your project root
cd .architecture
git fetch origin main
git reset --hard origin/main
cd ..
```

**Note**: Updates preserve your project's custom architecture artifacts (ADRs, reviews, member customizations) while updating framework files (templates, base configuration, scripts).

### What Gets Updated

**✅ Updated Files:**
- `.architecture/templates/` - Templates for ADRs, reviews, AGENTS.md
- `.architecture/principles.md` - Core architectural principles (if not customized)
- Framework scripts and helper files
- MCP server (if using MCP installation)
- Claude Skills (if using Skills installation)

**✅ Preserved Files:**
- `.architecture/decisions/adrs/` - Your architectural decision records
- `.architecture/reviews/` - Your architecture review documents
- `.architecture/recalibration/` - Your recalibration plans
- `.architecture/members.yml` - Your customized team members
- `.architecture/config.yml` - Your configuration settings
- All your project-specific customizations

See [UPGRADE.md](UPGRADE.md) for detailed upgrade instructions and troubleshooting.

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
├── agent_docs/              # Detailed AI assistant guidance (progressive disclosure)
├── templates/               # Templates for various documents
└── members.yml              # Architecture review team members
```

## Usage with AI Assistants

This framework is designed to work seamlessly with AI assistants. Each assistant has specialized instructions in the `.coding-assistants` directory.

For general usage instructions, see [USAGE.md](USAGE.md).

### Claude Code

For Claude Code users, see [USAGE-WITH-CLAUDE-PLUGIN.md](USAGE-WITH-CLAUDE-PLUGIN.md) (recommended plugin-based install) or [USAGE-WITH-CLAUDE.md](USAGE-WITH-CLAUDE.md) (traditional clone-based path) for detailed instructions.

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

**Adding new specialists**: edit `.architecture/members.yml` directly and run `node tools/cli.js generate-subagents` to refresh the corresponding `agents/<id>.md` subagent. Auto-creation during `specialist-review` was removed in 1.5.0 (see [ADR-013](.architecture/decisions/adrs/ADR-013-skill-orchestrator-subagent-delegation.md)) — the trade-off keeps the generated subagents and `members.yml` in sync at all times.

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

The framework incorporates wisdom from influential software architects including Martin Fowler, Sandi Metz, Robert C. Martin, Eric Evans, Sarah Mei, Obie Fernandez, and others. These principles are embedded in the architectural documentation.

**Externalizing Senior Thinking**: The framework systematically captures "senior engineering thinking"—the invisible architectural reasoning about blast radius, reversibility, timing, and social cost that typically stays undocumented. By forcing explicit documentation of these considerations, we're creating the corpus of senior architectural thinking that the industry lacks.

### Multi-Perspective Reviews

Architecture reviews consider multiple specialized perspectives:
- Systems Architecture
- Domain Expertise
- Security
- Performance
- Maintainability
- Implementation Strategy (HOW and WHEN)
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

**Exemptions for Critical Areas**:
Pragmatic Mode maintains rigorous standards for:
- **Security-critical features**: Authentication, authorization, encryption, input validation
- **Data integrity**: Database transactions, data validation, backup strategies
- **Compliance requirements**: GDPR, HIPAA, PCI-DSS, audit logging
- **Accessibility**: WCAG compliance, screen reader support

Enable with:
```
Enable pragmatic mode
```

See [ADR-002](/.architecture/decisions/adrs/ADR-002-pragmatic-guard-mode.md) and [Pragmatic Mode Summary](/.architecture/decisions/PRAGMATIC-MODE-SUMMARY.md) for details.

**Using with Implementation Guidance**: When using both Pragmatic Mode and Implementation Guidance together, pragmatic mode respects your configured security practices and methodological choices while challenging unnecessary complexity in other areas. The pragmatic enforcer ensures implementations remain simple while still following your team's documented standards for security, testing, and code quality.

### Implementation Guidance

Configuration-driven implementation that applies your team's methodology and best practices automatically:

**Configure once**:
```yaml
implementation:
  enabled: true
  methodology: "TDD"
  influences:
    - "Kent Beck - TDD by Example"
    - "Sandi Metz - POODR"
    - "Martin Fowler - Refactoring"
```

**Then simply say**:
```
Implement authentication as the architects
```

**Benefits**:
- **90% prompt reduction**¹: 4 words instead of 40+
- **Consistent quality**: Methodology applied systematically
- **Team standards**: Documented practices in version control
- **Cross-session persistence**: Configuration always applied

**Supports**:
- Multiple methodologies (TDD, BDD, DDD, Test-Last, Exploratory)
- Coding influences (Kent Beck, Sandi Metz, Martin Fowler, Gary Bernhardt, etc.)
- Language-specific practices and style guides
- Security practices (always applied, exempt from YAGNI)
- Quality standards and refactoring guidelines

Use with:
```
Implement [feature] as the architects
```

¹ *Measurement methodology documented in [ADR-004 § Validation](/.architecture/decisions/adrs/ADR-004-implementation-command-configuration.md#validation)*

See [ADR-004](/.architecture/decisions/adrs/ADR-004-implementation-command-configuration.md) for details.

### Feature-Based Architecture Management

The framework now supports:
- Version-based reviews and recalibration (e.g., for v2.1.0)
- Feature-based reviews and recalibration (e.g., for "payment processing")
- Component-specific reviews (e.g., for "authentication system")

## License

MIT
