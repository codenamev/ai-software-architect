# GitHub Copilot/Codex Configuration

This directory contains configuration for GitHub Copilot/Codex integration with the AI Software Architect framework.

## Available Files

- `setup-instructions.md` - Comprehensive setup process and command recognition
- `README.md` - This file, providing overview and integration guidance

## Setup Process

GitHub Copilot/Codex supports automated setup using natural language commands. See `setup-instructions.md` for detailed setup recognition patterns and the 6-step configuration process.

### Quick Setup
Use this command to trigger automated setup:
```
Setup architecture using: https://github.com/codenamev/ai-software-architect
```

## Configuration Approach

GitHub Copilot/Codex uses context-based recognition rather than explicit configuration files. The framework provides:

- **Natural Language Commands**: Recognizes architectural requests without explicit framework mentions
- **Context Integration**: Automatically references architecture documentation
- **Pattern Recognition**: Follows established architectural patterns in suggestions

### Documentation References

For GitHub Copilot documentation, see:
- [GitHub Copilot documentation](https://docs.github.com/en/copilot)
- [GitHub Copilot in VS Code documentation](https://docs.github.com/en/copilot/getting-started-with-github-copilot)

## Integration with Architecture

Copilot/Codex integrates with the `.architecture/` directory structure:

- **Architecture Decision Records (ADRs)** in `.architecture/decisions/`
- **Architecture reviews** in `.architecture/reviews/`
- **Recalibration plans** in `.architecture/recalibration/`
- **Architecture members** defined in `.architecture/members.yml`
- **Project principles** in `.architecture/principles.md`

## Natural Language Interface

After setup, GitHub Copilot/Codex recognizes these patterns:

### Architecture Operations
- "Review this architecture"
- "Create an ADR for [topic]"
- "Analyze this from [perspective] perspective"
- "Generate code following our architecture patterns"

### Specialized Analysis
- Security reviews, performance analysis, maintainability assessments
- Language-specific and framework-specific guidance
- Best practices integration based on project context