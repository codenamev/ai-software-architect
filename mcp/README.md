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
   - Run reviews: "Use start_architecture_review for version 1.0.0"
   - Get specialist input: "Use specialist_review with Security Architect for our API"

### For Other AI Assistants

1. **Install the MCP server**:
   ```bash
   npm install -g ai-software-architect
   ```

2. **Configure your AI assistant** (see configuration sections above)

3. **Test and use** (same as steps 2-3 above)

## Available Tools (7 Core Tools)

The MCP server provides 7 core tools corresponding to the framework's main capabilities:

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

### `start_architecture_review`
**Standard Command Equivalent**: "Start architecture review for [version/feature]"

Creates a comprehensive multi-perspective architecture review template.

**Parameters:**
- `reviewTarget` (string, required): Version ('1.0.0') or feature name ('authentication')
- `projectPath` (string, required): Path to your project root directory

**Creates:**
- `.architecture/reviews/[target].md` with sections for each team member
- Review template with individual perspectives and collaborative discussion sections

**Note**: This tool creates the review template. You'll need to fill in the analysis for each team member.

### `specialist_review`
**Standard Command Equivalent**: "Ask [Specialist Name] to review [target]"

Creates a focused review template from a specific specialist's perspective.

**Parameters:**
- `specialist` (string, required): Specialist name or role (e.g., 'Security Specialist', 'Performance Expert')
- `target` (string, required): What to review (e.g., 'API authentication', 'database queries')
- `projectPath` (string, required): Path to your project root directory

**Creates:**
- `.architecture/reviews/specialist-[role]-[target].md` with specialist focus template

**Behavior:**
- If specialist exists in `members.yml`: Uses their defined perspective
- If specialist doesn't exist: Returns error with list of available specialists

**Note**: Unlike Claude Skills/Traditional methods, MCP does not auto-create missing specialists.

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
The Pragmatic Enforcer participates in:
- Architecture reviews (`start_architecture_review`)
- Specialist reviews (`specialist_review`)
- ADR creation (`create_adr`)

The Pragmatic Enforcer will:
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

**Note**: This tool provides the same pragmatic mode capabilities available in Claude Skills via the `pragmatic-guard` skill.

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

### Start a Review
```
Use the start_architecture_review tool to review version 2.0.0 of our system at /Users/me/projects/myapp
```

### Get Specialist Input
```
Use the specialist_review tool with:
- specialist: "Security Specialist"
- target: "API authentication system"
- projectPath: /Users/me/projects/myapp
```

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
1. Use get_architecture_status to check current state
2. Use start_architecture_review for version 2.0.0
3. Fill in team member perspectives in the created template
4. Use create_adr for any new decisions identified
```

## Feature Parity

The MCP server provides all 7 core framework tools with full feature parity to Claude Skills:

### ✅ Fully Supported Features
- **Setup Architecture**: With advanced project analysis and initial system analysis
- **Create ADR**: With automatic numbering
- **Architecture Review**: Template creation with all team members
- **Specialist Review**: Focused review templates
- **List Members**: Complete team roster
- **Get Status**: Documentation metrics and health
- **Pragmatic Mode**: Full config.yml reading, mode configuration, and YAGNI enforcement

### ⚠️ Partially Supported Features
- **Input Validation**: Basic filename sanitization (no security-focused validation guidance)
- **Review Generation**: Creates templates (manual completion required vs. AI-generated)

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
| Core Tools (7) | ✅ All | ✅ All | ✅ All |
| Pragmatic Mode | ✅ | ✅ | ✅ |
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

**Missing specialists in specialist_review**:
- MCP server doesn't auto-create specialists
- Manually add to `.architecture/members.yml` or
- Use Claude Skills/Traditional method for auto-creation

## Support

- **Issues**: https://github.com/codenamev/ai-software-architect/issues
- **Documentation**: See repository root for full documentation
- **Feature Requests**: Open an issue with [Feature Request] prefix

## License

MIT