# Claude Code Configuration

This directory contains configuration files for Claude Code integration with the AI Software Architect framework.

## Available Files

### `CLAUDE.md`
Core configuration file that provides Claude Code with:
- **Framework overview** and project context
- **Setup recognition patterns** and automation process
- **Architecture review workflows** and specialized review capabilities
- **Command documentation** for framework usage
- **Development guidelines** and architectural principles

## Configuration Approach

Claude Code uses a **single comprehensive configuration file** approach:
- **CLAUDE.md** contains all framework guidance and commands
- **Embedded documentation** provides context for architectural decisions
- **Setup automation** handles framework installation and customization
- **Dynamic member creation** allows specialized architecture roles

## Setup Process

When users trigger setup with commands like "Setup architecture", Claude Code:

1. **Detects Setup Context**: Verifies framework availability and project location
2. **Analyzes Target Project**: Identifies technology stack and architectural patterns  
3. **Framework Installation**: Moves framework files and creates directory structure
4. **Customizes for Project**: Updates members.yml and principles for technology stack
5. **Cleanup & Finalize**: Removes template files and ensures clean installation
6. **Guides Next Steps**: Provides project-specific usage guidance

## Framework Integration

Claude Code integrates with the `.architecture/` directory structure:
- **Architecture Decision Records (ADRs)** in `.architecture/decisions/`
- **Architecture reviews** in `.architecture/reviews/`
- **Recalibration plans** in `.architecture/recalibration/`
- **Architecture members** defined in `.architecture/members.yml`
- **Project principles** in `.architecture/principles.md`

## Key Capabilities

### Setup Recognition
- "Setup .architecture"
- "Setup ai-software-architect"
- "Setup software architect"
- "Customize architecture"

### Architecture Reviews
- "Start architecture review for version X.Y.Z"
- "Start architecture review for 'feature name'"
- Full multi-perspective analysis using defined architecture members

### Specialized Reviews
- "Ask Security Architect to review these code changes"
- "Have Performance Specialist review this database schema"
- Dynamic creation of new architecture member roles as needed

### Recalibration
- "Start architecture recalibration for version X.Y.Z"
- Translation of review findings into actionable implementation plans

## User Project Integration

During setup, Claude Code appends framework content to the user's existing CLAUDE.md file using the template from `../templates/claude-project-setup.md`. This ensures:
- **Preservation** of existing project instructions
- **Technology-specific customization** based on detected stack
- **Relevant examples** for the user's project type
- **Clear command documentation** for immediate framework usage

## Documentation References

- [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code)
- [AI Software Architect Framework](../../README.md)
- [Setup Templates](../templates/claude-project-setup.md)