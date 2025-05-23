# Coding Assistants Configuration

This directory contains configuration files for various AI coding assistants used with this project.

## Directory Structure

- `claude/` - Configuration for Claude Code (Anthropic)
- `cursor/` - Configuration for Cursor
- `codex/` - Configuration for GitHub Copilot/Codex

## Documentation Links

- Claude Code: https://docs.anthropic.com/en/docs/claude-code
- Cursor: https://docs.cursor.com/context/rules
- GitHub Copilot: https://docs.github.com/en/copilot

## Configuration Approach

Each assistant has different configuration requirements:

- **Claude Code**: Uses a CLAUDE.md file for project guidance and commands
- **Cursor**: Uses Rules files for contextual instructions
- **Codex/Copilot**: Uses GitHub Copilot configuration format

The architectural guidance from `.architecture/` is referenced by all assistants, while assistant-specific settings are maintained in their respective directories.

## Shared Architecture Understanding

All coding assistants refer to the `.architecture/` directory structure:

- `.architecture/decisions/` - Architecture Decision Records (ADRs)
- `.architecture/reviews/` - Architecture review documents
- `.architecture/recalibration/` - Post-review action plans
- `.architecture/comparisons/` - Version comparisons
- `.architecture/templates/` - Document templates