# AI Software Architect MCP Server

Model Context Protocol (MCP) server providing the AI Software Architect framework as programmatic tools for Claude Code, Cursor, and other MCP-compatible AI assistants.

## Overview

The MCP server exposes the framework's core capabilities as callable tools, enabling:
- **Programmatic Access**: Use tools in automated workflows and scripts
- **Precise Control**: Call specific tools with exact parameters
- **Integration**: Connect with other MCP tools and services
- **Multi-Assistant Support**: Works with Claude Code, Cursor, and MCP-compatible assistants

For comparison with other integration methods, see the [main README](../README.md#integration-method-comparison).

## When to Choose MCP Server

**Choose MCP Server if you:**
- Need programmatic access to framework tools (automation, scripts, CI/CD)
- Want precise control with explicit tool parameters
- Use Claude Code or Cursor (MCP-compatible)
- Want advanced project analysis and automatic initial assessment
- Need to integrate with other MCP tools and services
- Prefer structured tool calls over natural language

**Choose Claude Skills if you:**
- Use Claude Code exclusively
- Want the simplest setup (no dependencies)
- Prefer automatic skill invocation
- Need all advanced features (pragmatic mode, dynamic members)
- Value portability across projects

**Choose Traditional Method if you:**
- Use multiple AI assistants (Copilot, Codex, etc.)
- Want maximum flexibility and customization
- Need full feature support (recalibration, pragmatic mode)
- Prefer natural language commands
- Want easiest setup (just clone repository)

See [Feature Comparison Table](../README.md#integration-method-comparison) for detailed breakdown.

## Installation

### Option 1: Using Claude Code

First install the package:
```bash
npm install -g ai-software-architect
```

Then add it to Claude Code:
```bash
claude mcp add ai-software-architect mcp
```

### Option 2: Install via npm

```bash
npm install -g ai-software-architect
```

### Option 3: Install from source

```bash
git clone https://github.com/codenamev/ai-software-architect.git
cd ai-software-architect/mcp
npm install
```

## Configuration

### Claude Code Configuration

Add this to your Claude Code configuration file (`~/.claude/config.json`):

**For npm global install:**
```json
{
  "mcpServers": {
    "ai-software-architect": {
      "command": "mcp",
      "args": [],
      "env": {}
    }
  }
}
```

**For source install:**
```json
{
  "mcpServers": {
    "ai-software-architect": {
      "command": "node",
      "args": ["/path/to/ai-software-architect/mcp/index.js"],
      "env": {}
    }
  }
}
```

### Cursor Configuration

Add this to your Cursor settings (`settings.json`):

**For npm global install:**
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

**For source install:**
```json
{
  "mcp.servers": {
    "ai-software-architect": {
      "command": "node",
      "args": ["/path/to/ai-software-architect/mcp/index.js"]
    }
  }
}
```

## Quick Start

### For Claude Code Users (Easiest)

1. **Install with Claude Code**:
   ```bash
   npm install -g ai-software-architect
   claude mcp add ai-software-architect mcp
   ```

2. **Test the installation**:
   Open Claude Code and try:
   ```
   Use the setup_architecture tool to set up the AI Software Architect framework in my current project.
   ```

3. **Start using the framework**:
   - Create ADRs: "Use create_adr to document our database choice"
   - List your team: "Use list_architecture_members"
   - Check status: "Use get_architecture_status"

   > **Note**: Orchestrated architecture reviews and pragmatic enforcement are
   > **not** MCP tools. Run them via the plugin/Skills instead (the
   > `architecture-review` and `specialist-review` skills and the
   > `pragmatic-enforcer` subagent). See [Two-Tier Capability Model](#two-tier-capability-model).

### For Other AI Assistants

1. **Install the MCP server**:
   ```bash
   npm install -g ai-software-architect
   ```

2. **Configure your AI assistant** (see configuration sections above)

3. **Test and use** (same as steps 2-3 above)

## Two-Tier Capability Model

The framework splits capabilities into two tiers (see [ADR-015](../.architecture/decisions/adrs/ADR-015-mcp-skills-parity-reconciliation.md)):

- **Tier 1 — Deterministic operations**: File and config operations with
  predictable output. Available on **all channels, including this MCP server**:
  `setup_architecture`, `create_adr`, `list_architecture_members`,
  `get_architecture_status`, `configure_pragmatic_mode`,
  `get_implementation_guidance`.
- **Tier 2 — LLM-orchestrated analysis**: Multi-perspective reviews and
  pragmatic enforcement that require an LLM to reason and generate content.
  These are **plugin/Skills only** and are **not** exposed as MCP tools. Use the
  `architecture-review` and `specialist-review` skills and the
  `pragmatic-enforcer` subagent.

## Available Tools (6 Tier-1 Tools)

The MCP server provides 6 deterministic Tier-1 tools corresponding to the framework's core operations:

### `setup_architecture`
**Standard Command Equivalent**: "Setup ai-software-architect"

Sets up the AI Software Architect framework in your project with full customization and analysis.

**What it does:**
1. **Project Analysis** - Detects languages, frameworks, and architectural patterns
2. **Framework Installation** - Creates complete `.architecture/` structure
3. **Customization** - Tailors team members, principles, and templates to your stack
4. **Integration Setup** - Configures CLAUDE.md for AI assistant collaboration
5. **Initial Analysis** - Conducts multi-perspective architectural analysis
6. **Documentation** - Creates customized templates and principles

**Parameters:**
- `projectPath` (string, required): Path to your project root directory

**Creates:**
- `.architecture/` with subdirectories (decisions, reviews, recalibration, comparisons, templates)
- `.coding-assistants/` configuration directories
- `CLAUDE.md` integration (created or enhanced)
- `.architecture/reviews/initial-system-analysis.md` - Comprehensive initial assessment

**MCP-Specific Features:**
- Advanced project analysis (language/framework detection)
- Automatic member customization based on tech stack
- Initial architectural analysis from all team members

### `create_adr`
**Standard Command Equivalent**: "Create ADR for [decision topic]"

Creates a new Architectural Decision Record with automatic numbering.

**Parameters:**
- `title` (string, required): Title of the ADR
- `context` (string, required): Context and background for the decision
- `decision` (string, required): The architectural decision being made
- `consequences` (string, required): Consequences of this decision
- `projectPath` (string, required): Path to your project root directory

**Creates:**
- `.architecture/decisions/adrs/ADR-XXX-title.md` with sequential numbering
- Formatted ADR with status, context, decision, and consequences

**Example:**
```javascript
{
  title: "Use PostgreSQL for primary database",
  context: "Need reliable ACID-compliant relational database with JSONB support",
  decision: "Adopt PostgreSQL 15+ as primary database",
  consequences: "Better data integrity, requires PostgreSQL expertise on team",
  projectPath: "/path/to/project"
}
```

> **Reviews are Tier 2, not MCP tools.** Orchestrated architecture reviews and
> specialist reviews require LLM reasoning and are available only via the
> plugin/Skills (`architecture-review` and `specialist-review`). See
> [Two-Tier Capability Model](#two-tier-capability-model).

### `list_architecture_members`
**Standard Command Equivalent**: "List architecture members"

Lists all architecture team members with their specialties and domains.

**Parameters:**
- `projectPath` (string, required): Path to your project root directory

**Returns:**
- Formatted list of team members from `.architecture/members.yml`
- Each member's name, title, specialties, domains, and perspective

### `get_architecture_status`
**Standard Command Equivalent**: "What's our architecture status?"

Gets current state of architecture documentation with counts and metrics.

**Parameters:**
- `projectPath` (string, required): Path to your project root directory

**Returns:**
- ADR count (from `.architecture/decisions/adrs/`)
- Review count (from `.architecture/reviews/`)
- Team member count (from `.architecture/members.yml`)
- Framework setup status
- Available actions summary

### `configure_pragmatic_mode`
**Standard Command Equivalent**: "Enable pragmatic mode"

Enables and configures Pragmatic Mode (YAGNI Enforcement) to prevent over-engineering.

**What it does:**
1. **Configuration Management** - Creates or updates `.architecture/config.yml` with pragmatic mode settings
2. **Mode Activation** - Enables/disables the Pragmatic Enforcer in reviews
3. **Intensity Control** - Sets how aggressively complexity is challenged
4. **Deferrals Setup** - Creates deferrals tracking file if enabled

**Parameters:**
- `projectPath` (string, required): Path to your project root directory
- `enabled` (boolean, optional): Enable or disable Pragmatic Mode
- `intensity` (string, optional): Intensity level - "strict", "balanced", or "lenient"

**Creates/Updates:**
- `.architecture/config.yml` - Pragmatic mode configuration
- `.architecture/deferrals.md` - Deferred decisions tracking (if enabled)

**Behavior by Intensity:**
- **Strict**: Challenges aggressively, requires strong justification for any complexity
- **Balanced**: Thoughtful challenges, accepts justified complexity (recommended)
- **Lenient**: Raises concerns without blocking, suggests alternatives as options

**When Pragmatic Mode is Enabled:**
This tool writes the configuration. The Pragmatic Enforcer that *acts* on that
configuration — challenging complexity, scoring necessity vs. complexity, and
proposing simpler alternatives — is a Tier-2 capability delivered by the
`pragmatic-enforcer` subagent and the orchestrated review skills, not an MCP
tool. With pragmatic mode enabled, those plugin/Skills flows will:
- Challenge complexity and abstractions with structured questions
- Score necessity vs. complexity (target ratio <1.5)
- Propose simpler alternatives that meet current requirements
- Track deferred decisions with trigger conditions

**Example:**
```javascript
{
  projectPath: "/path/to/project",
  enabled: true,
  intensity: "balanced"
}
```

**Note**: This tool only manages configuration. To *run* pragmatic analysis, use
the `pragmatic-enforcer` subagent via the plugin/Skills (see
[Two-Tier Capability Model](#two-tier-capability-model)).

### `get_implementation_guidance`
**Standard Command Equivalent**: "What implementation guidance applies here?"

Reads `.architecture/config.yml` and returns the configured implementation
methodology, influences, and practices for the project.

**Parameters:**
- `projectPath` (string, required): Path to your project root directory

**Returns:**
- Configured methodology, influences, and practices from `config.yml`

## Usage Examples

Once configured, you can use these tools through your AI assistant:

### Setup
```
Use the setup_architecture tool to set up the framework in my current project at /Users/me/projects/myapp
```

### Create an ADR
```
Use the create_adr tool with:
- title: "Use PostgreSQL for primary database"
- context: "Need ACID compliance and JSONB support for semi-structured data"
- decision: "Adopt PostgreSQL 15+ as our primary database"
- consequences: "Improves data integrity and flexibility, requires PostgreSQL expertise"
- projectPath: /Users/me/projects/myapp
```

### Run a Review (plugin/Skills, not MCP)
Orchestrated and specialist reviews are Tier-2 capabilities. Invoke them through
the plugin/Skills:
```
Start an architecture review for version 2.0.0
Ask the Security Specialist to review our API authentication system
```
These run via the `architecture-review` and `specialist-review` skills. See
[Two-Tier Capability Model](#two-tier-capability-model).

### Check Status
```
Use the get_architecture_status tool to see the current state of architecture documentation at /Users/me/projects/myapp
```

### Enable Pragmatic Mode
```
Use the configure_pragmatic_mode tool with:
- projectPath: /Users/me/projects/myapp
- enabled: true
- intensity: "balanced"
```

### Run Pragmatic Enforcement (plugin/Skills, not MCP)
Pragmatic analysis is a Tier-2 capability delivered by the `pragmatic-enforcer`
subagent. Configure it with `configure_pragmatic_mode` (above), then invoke the
analysis through the plugin/Skills:
```
Ask the Pragmatic Enforcer to review these code changes for over-engineering
```

### Example Workflow

**Complete Setup and First Review**:
```
1. Use setup_architecture tool (sets up framework, analyzes project, creates initial review)
2. Review the initial analysis in .architecture/reviews/initial-system-analysis.md
3. Use create_adr to document key existing decisions
4. Use list_architecture_members to see your customized team
5. Use get_architecture_status to verify setup
```

**Pre-Release Review Workflow**:
```
1. Use get_architecture_status to check current state (MCP)
2. Start an architecture review for version 2.0.0 (plugin/Skills — Tier 2)
3. Use create_adr for any new decisions identified (MCP)
```

## Feature Parity

The MCP server provides the 6 deterministic Tier-1 tools. Orchestrated reviews
and pragmatic enforcement (Tier 2) are delivered by the plugin/Skills, not MCP
(see [Two-Tier Capability Model](#two-tier-capability-model)).

### ✅ Fully Supported Features (Tier 1, via MCP)
- **Setup Architecture**: With advanced project analysis and initial system analysis
- **Create ADR**: With automatic numbering
- **List Members**: Complete team roster
- **Get Status**: Documentation metrics and health
- **Configure Pragmatic Mode**: config.yml reading and mode configuration
- **Implementation Guidance**: Configured methodology, influences, and practices

### 🔀 Tier-2 Capabilities (plugin/Skills only, not MCP)
- **Architecture Review**: Multi-perspective orchestrated review (`architecture-review` skill)
- **Specialist Review**: Focused single-specialist review (`specialist-review` skill)
- **Pragmatic Enforcement**: On-demand YAGNI analysis (`pragmatic-enforcer` subagent)

### ⚠️ Partially Supported Features
- **Input Validation**: Basic filename sanitization (no security-focused validation guidance)

### ❌ Not Yet Supported Features
- **Dynamic Member Creation**: Returns error for missing specialists (vs. auto-creating them)
- **Recalibration Process**: No tool for architecture recalibration
- **Health Analysis**: Basic status counts only (no health scoring or recommendations)

### MCP-Specific Advantages
- **Advanced Project Analysis**: Best-in-class language/framework detection
- **Initial System Analysis**: Automatically created during setup
- **Programmatic Access**: Can be called from scripts and automation
- **Precise Control**: Exact parameters for each tool

### Comparison with Other Methods

| Feature | MCP Server | Claude Skills | Traditional |
|---------|-----------|---------------|-------------|
| Tier-1 Deterministic Tools (6) | ✅ All | ✅ All | ✅ All |
| Orchestrated/Specialist Reviews (Tier 2) | ❌ Plugin/Skills only | ✅ | ✅ |
| Pragmatic Mode config | ✅ | ✅ | ✅ |
| Pragmatic Enforcement (Tier 2) | ❌ Plugin/Skills only | ✅ | ✅ |
| Dynamic Members | ❌ | ✅ | ✅ |
| Recalibration | ❌ | ⚠️ Planned | ✅ |
| Initial Analysis | ✅ Best | ❌ | ✅ |
| Input Validation | ⚠️ Basic | ✅ Comprehensive | ❌ |
| Setup Complexity | ⭐⭐ Medium | ⭐ Simple | ⭐ Simple |
| Programmatic Use | ✅ Best | ❌ | ❌ |

For complete feature comparison, see [main README](../README.md#integration-method-comparison) and [Feature Parity Analysis](../.architecture/reviews/feature-parity-analysis.md).

### Roadmap

**Planned Improvements** (Priority: High):
1. Add dynamic member creation (auto-create missing specialists)
2. Add recalibration tool (parse reviews, generate action plans)
3. Enhance input validation (security-focused checks)
4. Add health analysis to status tool (documentation completeness scoring)

**Recently Completed**:
- ✅ Pragmatic mode support (configure_pragmatic_mode tool) - Full config.yml reading and YAGNI enforcement

## Development

To modify or extend the server:

1. Edit `index.js` to add new tools or modify existing ones
2. Update the tool schemas in the `ListToolsRequestSchema` handler
3. Add corresponding implementation methods
4. Test with `npm start`

**Contributing**: Contributions welcome! Priority areas:
- Pragmatic mode integration
- Dynamic member creation
- Recalibration tool implementation
- Enhanced validation and error handling

## Directory Structure

The MCP server creates and manages this structure in your project:

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

## Alternative Integration Methods

If the MCP server doesn't fit your needs, consider these alternatives:

### Claude Skills (Recommended for Claude Code users)
- **Installation**: Copy skills to `~/.claude/skills/`
- **Advantages**: Simpler setup, no dependencies, automatic invocation, all advanced features
- **Documentation**: [USAGE-WITH-CLAUDE-SKILLS.md](../USAGE-WITH-CLAUDE-SKILLS.md)

### Traditional CLAUDE.md Method (Recommended for multi-assistant)
- **Installation**: Clone repository and add to CLAUDE.md
- **Advantages**: Works with all AI assistants, maximum flexibility, complete feature set
- **Documentation**: [USAGE-WITH-CLAUDE.md](../USAGE-WITH-CLAUDE.md), [USAGE-WITH-CURSOR.md](../USAGE-WITH-CURSOR.md), [USAGE-WITH-CODEX.md](../USAGE-WITH-CODEX.md)

### Feature Comparison
See [main README](../README.md#integration-method-comparison) for detailed feature comparison matrix.

## Troubleshooting

**MCP server not connecting**:
- Verify installation: `which mcp` or `npm list -g ai-software-architect`
- Check configuration file syntax (valid JSON)
- Restart your AI assistant after configuration changes
- Check logs: MCP server outputs to stderr

**Tools not appearing**:
- Ensure MCP server is running: Check assistant's MCP status
- Verify configuration points to correct command/path
- Check Node.js version: Requires Node.js ≥18

**Permission errors**:
- Ensure project path is accessible
- Check file permissions in `.architecture/` directory
- Verify write permissions for creating files

**Need a specialist review**:
- Specialist reviews are a Tier-2 capability — run them via the
  `specialist-review` skill (plugin/Skills), not the MCP server
- The MCP server does not auto-create specialists; add them to
  `.architecture/members.yml`, or use the plugin/Skills for auto-creation

## Support

- **Issues**: https://github.com/codenamev/ai-software-architect/issues
- **Documentation**: See repository root for full documentation
- **Feature Requests**: Open an issue with [Feature Request] prefix

## License

MIT