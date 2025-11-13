# Using AI Software Architect with Claude Skills

Quick guide for using AI Software Architect framework as Claude Skills in Claude Code.

## What are Claude Skills?

Claude Skills are modular capabilities that extend Claude through organized prompts. The AI Software Architect skills provide seamless architectural guidance and documentation.

## Why Skills?

**vs MCP:**
- Simpler setup (no Node.js/npm)
- No dependencies
- Automatic invocation
- Portable and version-controllable

**vs CLAUDE.md:**
- Modular and focused
- Auto-discovered by Claude
- Reusable across projects
- Easier to maintain

## Installation

### Personal Skills (Recommended)

Use across all projects:

```bash
git clone https://github.com/codenamev/ai-software-architect
cp -r ai-software-architect/.claude/skills ~/.claude/
rm -rf ai-software-architect
```

### Project-Specific Skills

For one project only:

```bash
mkdir -p .claude/skills
git clone https://github.com/codenamev/ai-software-architect temp
cp -r temp/.claude/skills/* .claude/skills/
rm -rf temp
```

### Quick Install Script

```bash
#!/bin/bash
# install-skills.sh

TYPE="${1:-personal}"

if [ "$TYPE" = "personal" ]; then
    TARGET="$HOME/.claude/skills"
else
    TARGET=".claude/skills"
fi

mkdir -p "$TARGET"
git clone https://github.com/codenamev/ai-software-architect /tmp/arch
cp -r /tmp/arch/.claude/skills/* "$TARGET/"
rm -rf /tmp/arch

echo "✅ Installed to $TARGET"
```

Usage:
```bash
chmod +x install-skills.sh
./install-skills.sh personal   # All projects
./install-skills.sh project    # Current project
```

## Available Skills

### 1. setup-architect
Sets up framework for your project.

**Usage**: "Setup ai-software-architect"

**Actions**:
- Analyzes codebase
- Customizes for your tech stack
- Creates architecture team
- Conducts initial analysis

### 2. create-adr
Creates Architectural Decision Records.

**Usage**: "Create ADR for [decision]"

**Actions**:
- Generates sequential ADR number
- Creates structured document
- Captures alternatives and trade-offs

**Example**: "Create ADR for JWT authentication"

### 3. architecture-review
Comprehensive multi-perspective reviews.

**Usage**: "Start architecture review for version 2.0.0"

**Actions**:
- All team members review
- Collaborative discussion
- Prioritized recommendations

### 4. specialist-review
Focused expert reviews.

**Usage**: "Ask Security Specialist to review authentication"

**Actions**:
- Deep-dive from specific perspective
- Targeted recommendations
- Auto-creates new specialists

### 5. list-members
View architecture team.

**Usage**: "List architecture members"

**Actions**:
- Shows all members and specialties
- Groups by category
- Explains how to request reviews

### 6. architecture-status
Check documentation state.

**Usage**: "What's our architecture status?"

**Actions**:
- Scans all directories
- Analyzes documentation health
- Provides recommendations

### 7. pragmatic-guard
Enables Pragmatic Mode (YAGNI Enforcement).

**Usage**: "Enable pragmatic mode" or "Turn on YAGNI enforcement"

**Actions**:
- Configures pragmatic mode settings
- Challenges over-engineering
- Proposes simpler alternatives
- Tracks deferred decisions

**Example**: "Enable pragmatic mode with balanced intensity"

## Standard Commands

Once skills are installed, use these commands in Claude Code:

**Setup**:
```
Setup ai-software-architect
```

**Create ADR**:
```
Create ADR for [decision topic]
```
Example: "Create ADR for database choice"

**Architecture Review**:
```
Start architecture review for [version/feature]
```
Example: "Start architecture review for version 1.0"

**Specialist Review**:
```
Ask [Specialist Name] to review [target]
```
Example: "Ask Security Specialist to review authentication"

**List Members**:
```
List architecture members
```

**Check Status**:
```
What's our architecture status?
```

**Enable Pragmatic Mode**:
```
Enable pragmatic mode
```
Example: "Enable pragmatic mode with balanced intensity"

## Quick Start

```bash
# 1. Install skills
cp -r ai-software-architect/.claude/skills ~/.claude/

# 2. In Claude Code, setup framework
Setup ai-software-architect

# 3. Start documenting
Create ADR for database choice
Ask Security Specialist to review auth
Start architecture review for version 1.0
What's our architecture status?

# 4. Optional: Enable pragmatic mode to prevent over-engineering
Enable pragmatic mode
```

## Typical Workflow

### Initial Setup
```
You: Setup ai-software-architect

Claude: [Analyzes your React+Node.js project]
        [Adds JavaScript Expert, React Specialist, Node.js Expert]
        [Creates initial architectural analysis]
        [Sets up directory structure]
```

### Document Decisions
```
You: Create ADR for PostgreSQL database

Claude: [Creates structured ADR with context, alternatives, trade-offs]
        [Saves to .architecture/decisions/adrs/ADR-001-postgresql.md]
```

### Get Reviews
```
# Focused review
You: Ask Security Specialist to review authentication

Claude: [Security-focused analysis]
        [Identifies issues and improvements]
        [Creates review document]

# Comprehensive review
You: Start architecture review for version 1.0.0

Claude: [All members review from their perspectives]
        [Collaborative discussion]
        [Comprehensive document with priorities]
```

### Check Status
```
You: What's our architecture status?

Claude: [Reports: 5 ADRs, 3 reviews, 8 team members]
        [Health: Good]
        [Recommendations for improvement]
```

## How Skills Work

Claude automatically invokes skills based on your request:

- "Setup ai-software-architect" → setup-architect
- "Create ADR for..." → create-adr
- "Ask [specialist] to review..." → specialist-review
- "Start architecture review..." → architecture-review
- "List architecture members" → list-members
- "What's our architecture status?" → architecture-status

## Customization

### Modify Skills

```bash
# Edit any skill
vim ~/.claude/skills/setup-architect/SKILL.md

# Changes take effect immediately
```

### Create Custom Skills

```bash
mkdir ~/.claude/skills/my-custom-skill

cat > ~/.claude/skills/my-custom-skill/SKILL.md <<'EOF'
---
name: my-custom-skill
description: Custom skill for my needs. Use when...
---

# My Custom Skill

## Process
1. [Step 1]
2. [Step 2]
EOF
```

### Combine with CLAUDE.md

Skills work alongside project instructions:

```markdown
# CLAUDE.md

## Project Overview
[Your project details]

## Architecture

Uses AI Software Architect skills.

**Commands**:
- "Setup ai-software-architect" - Setup
- "Create ADR for [topic]" - Document
- "Ask [specialist] to review [target]" - Review
- "What's our architecture status?" - Status

[Rest of your instructions]
```

## Troubleshooting

### Skills Not Found

```bash
# Verify installation
ls ~/.claude/skills/

# Should show:
# setup-architect/
# create-adr/
# architecture-review/
# specialist-review/
# list-members/
# architecture-status/
```

### Skills Not Invoked

Use exact trigger phrases:
- ✅ "Setup ai-software-architect"
- ❌ "Set up the architecture thing"

Or be explicit:
- "Use the setup-architect skill"

### Update Skills

```bash
# Backup current
mv ~/.claude/skills ~/.claude/skills.backup

# Reinstall
git clone https://github.com/codenamev/ai-software-architect /tmp/arch
cp -r /tmp/arch/.claude/skills ~/.claude/
rm -rf /tmp/arch
```

## Best Practices

1. **Start with personal installation** - Use across all projects
2. **Customize per-project if needed** - Copy to `.claude/skills/`
3. **Version control project skills** - Commit if customized
4. **Document your workflow** - Add to README or CLAUDE.md
5. **Keep skills updated** - Periodically pull latest versions

## Examples

### New Project

```
You: Setup ai-software-architect

Claude: [Analyzes codebase: Next.js + TypeScript]
        [Adds JavaScript Expert, React Specialist, TypeScript Expert]
        [Creates initial analysis: 15 pages]
        [Identifies: Good structure, improve error handling, add tests]

You: Create ADR for error handling strategy

Claude: [Creates ADR-001-error-handling-strategy.md]
        [Documents try/catch vs error boundaries decision]
```

### Pre-Release Review

```
You: We're releasing v2.0. Full architecture review please.

Claude: [Reviews from 9 perspectives]
        [Finds: N+1 queries, rate limiting needed, docs gaps]
        [Creates 45-page review with priorities]
        [Suggests: Fix queries (critical), add rate limiting (high)]

You: Ask Performance Specialist to review the N+1 query issue

Claude: [Deep-dive on query performance]
        [Identifies 3 problem areas]
        [Provides specific fixes with code examples]
```

## Migration from MCP

Currently using MCP? Switch to skills:

```bash
# 1. Install skills
cp -r ai-software-architect/.claude/skills ~/.claude/

# 2. Remove MCP config (optional)
# Edit ~/.claude/config.json, remove ai-software-architect MCP entry

# 3. Test
# In Claude Code: "List architecture members"

# 4. Continue using existing docs
# All .architecture/ files remain compatible
```

## FAQ

**Q: Install for every project?**
A: No! Install once in `~/.claude/skills/` for all projects.

**Q: Customize per project?**
A: Yes. Copy to `.claude/skills/` in project and modify.

**Q: Work offline?**
A: Yes. Skills are local text files.

**Q: Update skills?**
A: Re-run installation to get latest.

**Q: Create custom skills?**
A: Yes. Add directory with `SKILL.md` in `.claude/skills/`.

**Q: Replace CLAUDE.md?**
A: No. Use both - skills for framework, CLAUDE.md for project specifics.

**Q: Use with MCP?**
A: Possible but unnecessary. Choose one.

## Structure

```
~/.claude/skills/                    # Personal (all projects)
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
├── architecture-status/
│   └── SKILL.md
└── pragmatic-guard/
    └── SKILL.md

.claude/skills/                      # Project-specific (optional)
└── [same structure, customized]
```

## Next Steps

1. **Install**: Copy skills to `~/.claude/skills/`
2. **Setup**: In project, say "Setup ai-software-architect"
3. **Use**: Start documenting decisions and requesting reviews
4. **Iterate**: Check status, address findings, repeat

Happy architecting! 🏗️

## Additional Resources

- General usage: [USAGE.md](USAGE.md)
- Traditional Claude setup: [USAGE-WITH-CLAUDE.md](USAGE-WITH-CLAUDE.md)
- Framework overview: [README.md](README.md)
- Issues: https://github.com/codenamev/ai-software-architect/issues
