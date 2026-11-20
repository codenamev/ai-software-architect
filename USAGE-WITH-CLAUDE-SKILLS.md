# Using AI Software Architect with Claude Skills

> **This document has been retired.** As of 1.4.0 ([ADR-012](.architecture/decisions/adrs/ADR-012-claude-plugin-distribution-hardening.md)), the seven framework skills are distributed exclusively through the Claude Code plugin. Installing the plugin gives you the skills, MCP server, generated subagents, and ADR-validation hook as a single unit.

## Install via the plugin

```bash
# In Claude Code:
/plugin marketplace add codenamev/ai-software-architect
/plugin install ai-software-architect@ai-software-architect
```

That installs:

| Skill                  | Trigger phrase example                              |
|------------------------|-----------------------------------------------------|
| `setup-architect`      | "Setup ai-software-architect"                       |
| `create-adr`           | "Create ADR for [topic]"                            |
| `architecture-review`  | "Start architecture review for version 2.0.0"       |
| `specialist-review`    | "Ask Security Specialist to review authentication"  |
| `list-members`         | "List architecture members"                         |
| `architecture-status`  | "What's our architecture status?"                   |
| `find-adrs`            | "Which ADRs cover mcp/index.js?"                    |
| `pragmatic-guard`      | "Enable pragmatic mode"                             |

For full installation, troubleshooting, and feature comparison, see [USAGE-WITH-CLAUDE-PLUGIN.md](USAGE-WITH-CLAUDE-PLUGIN.md).

## Why the cp-based install was retired

Before the Claude Code plugin existed, the framework documented a `git clone … && cp -r .../skills ~/.claude/skills/` recipe as a separate "Claude Skills" install channel. The plugin now ships those same skills alongside the MCP server, hooks, and subagents — so the cp recipe was a strict subset that delivered only the skills and silently skipped everything else. Documenting two install paths with different feature sets was a sustained source of confusion.

The skill files still live in this repo at [`skills/`](skills/) for transparency and contributor editing, but installation is via `/plugin marketplace add`.

## Migration

If you previously installed via the cp recipe:

1. Optionally remove the manually-copied directories: `rm -rf ~/.claude/skills/{setup-architect,create-adr,architecture-review,specialist-review,list-members,architecture-status,find-adrs,pragmatic-guard}`.
2. Install the plugin per the commands above.

No project-side changes are required — your existing `.architecture/` content is unaffected.
