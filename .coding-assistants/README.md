# Coding Assistants Configuration

This directory contains configuration files, templates, and supporting materials for integrating various AI coding assistants with the AI Software Architect framework.

## Directory Structure

### Assistant Configuration Directories
- **`claude/`** - Claude Code configuration and documentation
- **`cursor/`** - Cursor Rules files for framework integration  
- **`codex/`** - GitHub Copilot/Codex setup and configuration

### Supporting Directories
- **`templates/`** - Setup templates used during automated framework installation
- **`examples/`** - Real-world project configuration examples for different technology stacks
- **`testing/`** - Testing procedures and verification guides for assistant setup

## Configuration Approaches

Each assistant uses a different configuration method tailored to its capabilities:

### Claude Code
- **Single file approach**: Uses `CLAUDE.md` with comprehensive framework guidance
- **Setup automation**: Automated 6-step setup process with project customization
- **Dynamic adaptation**: Creates new architecture member roles as needed

### Cursor  
- **Rules-based approach**: Uses multiple `.mdc` files following Cursor's Rules documentation
- **Contextual activation**: Rules apply automatically based on file patterns (globs)
- **Modular organization**: Separate rules for overview, setup, usage, structure, and reviews

### GitHub Copilot/Codex
- **Context-driven approach**: Uses natural language recognition and project context
- **Implicit configuration**: No explicit config files, relies on architecture documentation
- **Pattern recognition**: Learns from existing architecture files and conventions

## Directory Relationships

### Assistant Directories → User Projects
During setup, assistants use their configuration files to:
- Install and configure the framework in user projects
- Customize architecture members for detected technology stacks
- Append appropriate content to user project configuration files

### Templates → Setup Automation
Templates provide the content that assistants use to:
- Generate technology-specific guidance for user projects
- Append framework commands to user configuration files
- Provide post-setup onboarding and usage instructions

### Examples → Reference Material
Examples demonstrate how the framework should be customized for:
- Different technology stacks (Rails, Node.js, Python, etc.)
- Various project types (web apps, mobile apps, backend services)
- Specific architectural patterns and conventions

### Testing → Quality Assurance
Testing files ensure that:
- All assistants can successfully set up the framework
- Cross-assistant compatibility is maintained
- Setup processes work consistently across different project types

## Shared Architecture Understanding

All coding assistants integrate with the common `.architecture/` directory structure:

- `.architecture/decisions/` - Architecture Decision Records (ADRs)
- `.architecture/reviews/` - Architecture review documents
- `.architecture/recalibration/` - Post-review action plans
- `.architecture/members.yml` - Architecture team member definitions
- `.architecture/principles.md` - Project architectural principles

## Setup Flow

1. **User triggers setup** with command like "Setup architecture using: https://github.com/codenamev/ai-software-architect"
2. **Assistant detects technology stack** from project files (package.json, Gemfile, etc.)
3. **Framework installation** from cloned repository to `.architecture/` directory
4. **Configuration customization** using templates and examples for detected stack
5. **User guidance** provided with technology-specific commands and examples

## Documentation Links

- [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code)
- [Cursor Rules Documentation](https://docs.cursor.com/context/rules)
- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)