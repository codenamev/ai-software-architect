# Using AI Software Architect with Claude Skills

This guide explains how to use the AI Software Architect framework as Claude Skills in Claude Code.

## What are Claude Skills?

Claude Skills are specialized capabilities that extend Claude's functionality through organized prompts and instructions. When you install the AI Software Architect skills, Claude automatically recognizes when to use them based on your requests, providing seamless architectural guidance and documentation capabilities.

## Benefits of Using Skills

**Compared to MCP (Model Context Protocol):**
- ✅ **Simpler Setup**: No Node.js or server configuration required
- ✅ **Pure Claude Code Integration**: Works natively within Claude Code
- ✅ **Automatic Invocation**: Claude recognizes when to use skills
- ✅ **Portable**: Skills files can be version controlled with your project
- ✅ **No Dependencies**: No npm packages or external processes

**Compared to CLAUDE.md Instructions:**
- ✅ **Modular**: Each skill is focused and specialized
- ✅ **Discoverable**: Claude automatically finds relevant skills
- ✅ **Reusable**: Skills work across all your projects
- ✅ **Maintainable**: Update skills independently

## Installation

### Option 1: Personal Skills (Recommended)

Install skills in your home directory to use across all projects:

```bash
# Clone the repository
git clone https://github.com/codenamev/ai-software-architect

# Copy skills to your Claude Code personal skills directory
cp -r ai-software-architect/.claude/skills ~/.claude/

# Clean up
rm -rf ai-software-architect
```

**Location**: `~/.claude/skills/`

**Advantage**: Available in all projects automatically

### Option 2: Project-Specific Skills

Install skills for a specific project only:

```bash
# In your project root
git clone https://github.com/codenamev/ai-software-architect

# Copy skills to project's .claude directory
mkdir -p .claude/skills
cp -r ai-software-architect/.claude/skills/* .claude/skills/

# Clean up
rm -rf ai-software-architect
```

**Location**: `.claude/skills/` (in your project)

**Advantage**: Version control skills with your project, customize per-project

### Option 3: Quick Install Script

Save this script as `install-architect-skills.sh`:

```bash
#!/bin/bash

# Install AI Software Architect Skills for Claude Code

INSTALL_TYPE="${1:-personal}"

if [ "$INSTALL_TYPE" = "personal" ]; then
    TARGET_DIR="$HOME/.claude/skills"
    echo "Installing skills to: $TARGET_DIR (all projects)"
elif [ "$INSTALL_TYPE" = "project" ]; then
    TARGET_DIR=".claude/skills"
    echo "Installing skills to: $TARGET_DIR (this project only)"
else
    echo "Usage: $0 [personal|project]"
    echo "  personal - Install for all projects (default)"
    echo "  project  - Install for current project only"
    exit 1
fi

# Create skills directory
mkdir -p "$TARGET_DIR"

# Clone repository
echo "Cloning AI Software Architect..."
git clone https://github.com/codenamev/ai-software-architect /tmp/ai-software-architect

# Copy skills
echo "Copying skills..."
cp -r /tmp/ai-software-architect/.claude/skills/* "$TARGET_DIR/"

# Clean up
rm -rf /tmp/ai-software-architect

echo "✅ Successfully installed AI Software Architect skills!"
echo ""
echo "Available skills:"
echo "  - setup-architect: Set up framework in your project"
echo "  - create-adr: Create Architectural Decision Records"
echo "  - architecture-review: Conduct comprehensive reviews"
echo "  - specialist-review: Get focused expert reviews"
echo "  - list-members: View architecture team"
echo "  - architecture-status: Check documentation status"
echo ""
echo "Try: 'Setup ai-software-architect' in Claude Code"
```

Run it:
```bash
chmod +x install-architect-skills.sh
./install-architect-skills.sh personal   # For all projects
# or
./install-architect-skills.sh project    # For this project only
```

## Available Skills

Once installed, Claude Code has access to these skills:

### 1. setup-architect
**Purpose**: Set up the AI Software Architect framework in your project

**Usage**:
- "Setup ai-software-architect"
- "Setup .architecture"
- "Setup software architect"

**What it does**:
- Analyzes your codebase (languages, frameworks, patterns)
- Installs and customizes the framework
- Creates architecture team with relevant specialists
- Conducts initial architectural analysis
- Sets up directory structure

**Example**:
```
You: Setup ai-software-architect

Claude: I'll set up the AI Software Architect framework for your project...
[Analyzes codebase, finds it's a React + Node.js TypeScript app]
[Customizes members.yml with JavaScript Expert, React Specialist, Node.js Expert]
[Creates initial architectural analysis from all perspectives]
[Reports findings and next steps]
```

### 2. create-adr
**Purpose**: Create Architectural Decision Records

**Usage**:
- "Create ADR for [decision topic]"
- "Document architectural decision for [topic]"

**What it does**:
- Generates sequential ADR number
- Creates structured decision document
- Captures context, options, trade-offs
- Documents implementation plan
- Defines success criteria

**Example**:
```
You: Create ADR for using JWT authentication

Claude: I'll create an ADR for JWT authentication...
[Asks clarifying questions about requirements]
[Creates ADR-004-jwt-authentication.md]
[Documents decision drivers, alternatives, trade-offs]
[Provides implementation guidance]
```

### 3. architecture-review
**Purpose**: Conduct comprehensive multi-perspective architecture reviews

**Usage**:
- "Start architecture review for version 2.0.0"
- "Start architecture review for user-authentication feature"
- "Conduct architecture review"

**What it does**:
- Loads all architecture team members
- Each member reviews from their perspective
- Conducts collaborative discussion
- Creates consolidated recommendations
- Prioritizes actions

**Example**:
```
You: Start architecture review for version 2.0.0

Claude: I'll conduct a comprehensive architecture review...
[Systems Architect reviews overall structure]
[Security Specialist checks security practices]
[Performance Specialist identifies bottlenecks]
[Domain Expert analyzes business logic]
[All members collaborate and discuss]
[Creates comprehensive review document]
[Provides prioritized recommendations]
```

### 4. specialist-review
**Purpose**: Get focused reviews from specific specialists

**Usage**:
- "Ask Security Specialist to review authentication"
- "Get Performance Expert's opinion on database queries"
- "Have Ruby Expert review my modules"

**What it does**:
- Identifies or creates requested specialist
- Conducts focused review from that perspective
- Provides deep expertise in specific area
- Creates targeted recommendations
- Automatically adds new specialists to team

**Example**:
```
You: Ask Security Specialist to review our API authentication

Claude: I'll have the Security Specialist review your API authentication...
[Analyzes authentication implementation]
[Reviews from security perspective]
[Identifies 2 critical issues, 3 improvements]
[Provides specific fixes and code examples]
[Creates security-specialist-api-authentication.md]
```

### 5. list-members
**Purpose**: View your architecture team

**Usage**:
- "List architecture members"
- "Who's on the architecture team?"
- "What specialists are available?"

**What it does**:
- Displays all team members and their specialties
- Groups members by category
- Shows how to request reviews
- Explains each member's role

**Example**:
```
You: List architecture members

Claude: Your architecture team consists of 9 members...
[Lists each member with specialties and domains]
[Groups by category: Security, Performance, etc.]
[Shows example commands for requesting reviews]
```

### 6. architecture-status
**Purpose**: Check current state of architecture documentation

**Usage**:
- "What's our architecture status?"
- "Show architecture documentation"
- "What architectural decisions have we made?"

**What it does**:
- Scans all architecture directories
- Counts ADRs, reviews, recalibration docs
- Analyzes documentation health
- Provides recommendations
- Suggests next steps

**Example**:
```
You: What's our architecture status?

Claude: Here's your architecture status...
[Reports: 12 ADRs, 5 reviews, 2 recalibrations]
[Health Status: Excellent]
[Recent activity summary]
[Recommendations for continued momentum]
```

## Typical Workflow

### 1. Initial Setup

```
# Start a new project or add to existing one
You: Setup ai-software-architect

# Claude analyzes your codebase
# Customizes framework for your tech stack
# Creates initial architectural analysis
# Sets up architecture team
```

### 2. Document Decisions

```
# As you make architectural decisions
You: Create ADR for choosing PostgreSQL database

# Claude creates structured decision record
# Documents context, alternatives, trade-offs
# Saves to .architecture/decisions/adrs/
```

### 3. Get Focused Reviews

```
# When you need specific expertise
You: Ask Security Specialist to review authentication flow

# Claude conducts focused security review
# Identifies issues and improvements
# Creates detailed specialist review document
```

### 4. Conduct Comprehensive Reviews

```
# Before major releases or milestones
You: Start architecture review for version 1.0.0

# All team members review from their perspectives
# Collaborative discussion synthesizes findings
# Comprehensive review document created
# Prioritized recommendations provided
```

### 5. Check Status

```
# Periodically check documentation health
You: What's our architecture status?

# Claude reports on all documentation
# Identifies gaps and strengths
# Recommends next steps
```

## How Skills Work

### Automatic Invocation

Claude automatically invokes the appropriate skill based on your request:

```
You: "Setup ai-software-architect"
→ Claude invokes: setup-architect skill

You: "Create ADR for microservices"
→ Claude invokes: create-adr skill

You: "Ask Security Specialist to review auth"
→ Claude invokes: specialist-review skill
```

### Skill Discovery

Each skill has a `description` field that helps Claude know when to use it:

```yaml
---
name: create-adr
description: Creates an Architectural Decision Record (ADR)...
  Use when the user requests "Create ADR for [topic]"...
---
```

### Multiple Skills

Claude can chain multiple skills together:

```
You: Setup ai-software-architect and then show me the architecture status

→ Claude invokes: setup-architect skill
→ Then invokes: architecture-status skill
```

## Skill File Structure

Each skill is a directory containing a `SKILL.md` file:

```
.claude/skills/
├── setup-architect/
│   └── SKILL.md
├── create-adr/
│   └── SKILL.md
├── architecture-review/
│   └── SKILL.md
├── specialist-review/
│   └── SKILL.md
├── list-members/
│   └── SKILL.md
└── architecture-status/
    └── SKILL.md
```

Each `SKILL.md` contains:
- YAML frontmatter (name, description)
- Detailed instructions for Claude
- Step-by-step processes
- Best practices
- Example interactions

## Customizing Skills

### Modifying Existing Skills

Edit skill files to customize behavior:

```bash
# Edit the setup-architect skill
vim ~/.claude/skills/setup-architect/SKILL.md

# Or project-specific
vim .claude/skills/setup-architect/SKILL.md
```

Changes take effect immediately in Claude Code.

### Creating Custom Skills

Add your own skills for project-specific needs:

```bash
# Create new skill directory
mkdir ~/.claude/skills/my-custom-skill

# Create SKILL.md
cat > ~/.claude/skills/my-custom-skill/SKILL.md <<'EOF'
---
name: my-custom-skill
description: Does something specific for my project. Use when...
---

# My Custom Skill

## When to Use This Skill
[Description]

## Process
[Step-by-step instructions]
EOF
```

### Combining with Project Instructions

Skills work alongside your `CLAUDE.md`:

```markdown
# CLAUDE.md

## Project Overview
[Your project details]

## AI Software Architect Skills

This project uses AI Software Architect skills for architecture documentation.

Available commands:
- "Setup ai-software-architect" - Initial setup
- "Create ADR for [topic]" - Document decisions
- "Ask [specialist] to review [target]" - Focused reviews
- "Start architecture review" - Comprehensive assessment

[Rest of your project instructions]
```

## Comparison with Other Methods

### Skills vs MCP

| Feature | Skills | MCP |
|---------|--------|-----|
| **Setup Complexity** | Simple (copy files) | Complex (Node.js, config) |
| **Dependencies** | None | Node.js, npm packages |
| **Performance** | Fast (native) | External process overhead |
| **Portability** | Highly portable | Requires runtime |
| **Debugging** | Read SKILL.md files | Debug Node.js code |
| **Customization** | Edit markdown | Edit JavaScript |
| **Version Control** | Easy (text files) | Possible but more complex |

**When to use Skills**: Most cases, especially for simpler setups and better portability

**When to use MCP**: Need programmatic file manipulation, external tool integration, or complex automation

### Skills vs CLAUDE.md

| Feature | Skills | CLAUDE.md |
|---------|--------|-----------|
| **Organization** | Modular, focused | Monolithic |
| **Discoverability** | Automatic | Manual reference |
| **Reusability** | Cross-project | Per-project |
| **Maintenance** | Update individual skills | Update entire doc |
| **Context Usage** | Only when needed | Always loaded |

**When to use Skills**: Framework features, reusable capabilities, automatic invocation

**When to use CLAUDE.md**: Project-specific instructions, custom workflows, team guidelines

**Best Practice**: Use both! Skills for framework capabilities, CLAUDE.md for project specifics.

## Troubleshooting

### Skills Not Found

**Problem**: Claude doesn't seem to recognize the skills

**Solutions**:
1. Verify installation location:
   ```bash
   ls ~/.claude/skills/  # Personal
   ls .claude/skills/    # Project
   ```

2. Check SKILL.md files exist:
   ```bash
   ls ~/.claude/skills/*/SKILL.md
   ```

3. Restart Claude Code if recently installed

### Skills Not Invoked

**Problem**: Claude doesn't automatically use the skill

**Solutions**:
1. Use the exact trigger phrases from skill descriptions
2. Be explicit: "Use the setup-architect skill"
3. Check skill's description field matches your request

### Skills Conflict

**Problem**: Personal and project skills both exist

**Solution**: Project skills override personal skills. Either:
- Remove project skills to use personal ones
- Customize project skills for project-specific behavior

### Outdated Skills

**Problem**: Skills reference old framework features

**Solution**: Update skills:
```bash
# Backup current
mv ~/.claude/skills ~/.claude/skills.backup

# Reinstall fresh
[Follow installation steps]

# Restore any customizations
```

## Best Practices

### 1. Start with Personal Installation

Install skills personally first to use across all projects:
```bash
cp -r ai-software-architect/.claude/skills ~/.claude/
```

### 2. Customize Project-Specific

Copy to project only if you need customization:
```bash
cp -r ~/.claude/skills .claude/
# Now customize for this project
```

### 3. Version Control Project Skills

If using project-specific skills, commit them:
```bash
git add .claude/skills
git commit -m "Add AI Software Architect skills"
```

### 4. Document Your Workflow

In your project's README or CLAUDE.md:
```markdown
## Architecture Documentation

This project uses AI Software Architect skills.

**Quick Commands**:
- Setup: "Setup ai-software-architect"
- ADR: "Create ADR for [topic]"
- Review: "Ask [specialist] to review [target]"
- Status: "What's our architecture status?"
```

### 5. Keep Skills Updated

Periodically update skills for improvements:
```bash
# Update personal skills
git clone https://github.com/codenamev/ai-software-architect /tmp/arch
cp -r /tmp/arch/.claude/skills/* ~/.claude/skills/
rm -rf /tmp/arch
```

### 6. Combine with CLAUDE.md

Use skills for framework features, CLAUDE.md for project specifics:

```markdown
# CLAUDE.md

## Project: My Awesome App
[Project-specific instructions]

## Architecture Framework
Uses AI Software Architect skills (installed in ~/.claude/skills/)

Commands: See USAGE-WITH-CLAUDE-SKILLS.md
```

## Examples

### Example 1: New Project Setup

```bash
# 1. Create new project
mkdir my-new-app
cd my-new-app
npm init -y

# 2. Start Claude Code and setup architecture
# In Claude Code:
You: Setup ai-software-architect

# Claude sets up the framework, analyzes your codebase,
# creates initial analysis

You: What's our architecture status?

# Claude shows you the setup results and next steps
```

### Example 2: Documenting a Decision

```
You: We're deciding between REST and GraphQL for our API.
     Can you help me create an ADR?

Claude: I'll create an ADR for your API design decision.
        Let me ask a few questions first...

Claude: What are the main requirements driving this decision?

You: We need to support mobile apps and web clients,
     and we want to minimize over-fetching.

Claude: [Creates comprehensive ADR]
        ADR-001: Choose GraphQL for API Architecture
        Location: .architecture/decisions/adrs/ADR-001-graphql-api.md
        [Documents context, alternatives, trade-offs, implementation]
```

### Example 3: Pre-Release Review

```
You: We're about to release version 2.0.0.
     I want a full architecture review.

Claude: I'll conduct a comprehensive architecture review for v2.0.0...

[Systems Architect reviews structure]
[Security Specialist checks security]
[Performance Specialist identifies bottlenecks]
[All members collaborate]

Claude: Architecture Review Complete for Version 2.0.0
        Location: .architecture/reviews/2-0-0.md

        Overall Assessment: Good with areas for improvement

        Top 3 Priorities:
        1. Address N+1 query in user dashboard
        2. Implement rate limiting on public API
        3. Refactor authentication module

        Next Steps: "Start architecture recalibration for version 2.0.0"
```

### Example 4: Focused Security Review

```
You: Ask Security Specialist to review our authentication implementation

Claude: I'll have the Security Specialist review your authentication...

[Analyzes authentication code]
[Reviews from security perspective]

Claude: Security Review Complete: Authentication Implementation

        Overall Assessment: Needs Improvement

        Critical Issues:
        1. Passwords stored with weak hashing (MD5)
        2. No rate limiting on login endpoint
        3. Session tokens not properly invalidated

        Recommendations:
        1. Migrate to bcrypt with cost factor 12
        2. Implement rate limiting: 5 attempts/15 min
        3. Add logout endpoint that invalidates tokens

        Location: .architecture/reviews/security-specialist-authentication.md
```

## Migration from MCP

If you're currently using the MCP server, you can migrate to skills:

### Step 1: Install Skills

```bash
cp -r ai-software-architect/.claude/skills ~/.claude/
```

### Step 2: Remove MCP Configuration

Edit your Claude Code config (if you configured MCP):
```json
// Remove or comment out:
{
  "mcpServers": {
    "ai-software-architect": {
      "command": "mcp",
      "args": []
    }
  }
}
```

### Step 3: Test Skills

```
You: List architecture members

# Should invoke the list-members skill
```

### Step 4: Continue Using Existing Documentation

Skills work with your existing `.architecture/` directory:
- ADRs remain in `.architecture/decisions/adrs/`
- Reviews remain in `.architecture/reviews/`
- All existing documentation is compatible

### What's Different?

**Same**:
- All architecture documentation formats
- Directory structure
- Workflow and processes

**Different**:
- No MCP server process
- Skills invoked by Claude naturally
- No need for explicit tool calls
- Can't programmatically modify files (but Claude can still edit them)

## Advanced Usage

### Skill Composition

Use multiple skills together:

```
You: Setup ai-software-architect, then list the architecture members,
     and show me our status

[Claude invokes three skills in sequence]
```

### Conditional Skills

Skills activate based on context:

```
# If .architecture/ doesn't exist:
You: Create ADR for database choice

Claude: [Detects no framework]
        Would you like to set up the AI Software Architect framework first?

# After setup:
You: Create ADR for database choice

Claude: [Uses create-adr skill successfully]
```

### Custom Workflows

Create project-specific workflows in CLAUDE.md that use skills:

```markdown
# CLAUDE.md

## Release Process

Before each release:
1. "Start architecture review for version X.Y.Z"
2. Address critical findings
3. "Create ADR for [any new decisions]"
4. "What's our architecture status?" - Ensure documentation is current
5. Update CHANGELOG
```

## FAQ

**Q: Do I need to install skills for every project?**
A: No! Install once in `~/.claude/skills/` to use across all projects.

**Q: Can I customize skills per project?**
A: Yes! Copy skills to `.claude/skills/` in your project and modify them.

**Q: Do skills work offline?**
A: Yes! Skills are just text files read by Claude Code locally.

**Q: How do I update skills?**
A: Re-run the installation process to get the latest versions.

**Q: Can I create my own skills?**
A: Yes! Create a directory in `.claude/skills/` with a `SKILL.md` file.

**Q: Do skills replace CLAUDE.md?**
A: No, they complement it. Use both together.

**Q: Can I use skills and MCP together?**
A: Yes, but it's usually unnecessary. Choose one approach.

**Q: Are skills compatible with other Claude Code features?**
A: Yes! Skills work with all Claude Code features.

**Q: How much do skills add to context?**
A: Skills are only loaded when needed, minimizing context usage.

**Q: Can skills modify files?**
A: Skills provide instructions for Claude, who can then use tools to modify files.

## Getting Help

**Documentation**:
- This file: `USAGE-WITH-CLAUDE-SKILLS.md`
- General usage: `USAGE.md`
- Framework overview: `README.md`

**Issues**:
- GitHub: https://github.com/codenamev/ai-software-architect/issues

**Skill Files**:
- Read the `SKILL.md` files directly to understand what each skill does
- Location: `~/.claude/skills/*/SKILL.md` or `.claude/skills/*/SKILL.md`

## Next Steps

1. **Install Skills**: Follow installation instructions above
2. **Setup Framework**: "Setup ai-software-architect" in your project
3. **Explore**: Try each skill to understand capabilities
4. **Document**: Start creating ADRs for key decisions
5. **Review**: Conduct architecture reviews regularly
6. **Refine**: Customize skills for your workflow

Happy architecting! 🏗️
