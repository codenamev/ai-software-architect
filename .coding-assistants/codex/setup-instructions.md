# AI Software Architect Setup for GitHub Copilot/Codex

This document provides setup instructions for configuring the AI Software Architect framework with GitHub Copilot and OpenAI Codex.

## Setup Recognition

GitHub Copilot/Codex should recognize these setup requests and follow the setup process:

- "Setup architecture using: https://github.com/codenamev/ai-software-architect"
- "Setup ai-software-architect"
- "Setup architecture" 
- "Setup software architect"
- "Setup architect"
- "Customize architecture"

## Setup Process

When a user requests setup using any of the recognized phrases:

### 1. Detect Setup Context
- Check if `.architecture/` directory exists with framework files
- Verify running from user's project root (not within .architecture)
- Confirm the framework is properly cloned

### 2. Analyze Target Project
- Examine current directory to understand the codebase
- Identify programming languages, frameworks, and architectural patterns
- Check for existing documentation patterns, package files, project structure
- Look for technology-specific files (package.json, requirements.txt, etc.)

### 3. Framework Installation
- Move framework from `.architecture/.architecture/` to `.architecture/`
- Create `.coding-assistants/` directory structure in project root
- Set up initial directory structure for decisions, reviews, recalibration

### 4. Customize for Project
- Update `.architecture/members.yml` with roles relevant to their technology stack
- Modify `.architecture/principles.md` to align with project's architectural needs
- Customize templates in `.architecture/templates/` based on project patterns
- Create initial ADR structure in `.architecture/decisions/adrs/`

### 5. Cleanup & Finalize
- Remove template repository files (README.md, USAGE*.md, INSTALL.md, etc.)
- Remove `.architecture/.git/` directory specifically (never touch project root .git)
- Remove the now-empty cloned repository structure
- Verify all framework files are properly located

### 6. Guide Next Steps
- Explain what customizations you've made and why
- Show them how to use the framework with their specific project
- Suggest immediate next steps for architectural documentation
- Provide examples relevant to their tech stack

## Configuration Files

When setting up, ensure these files are properly configured:

- `.coding-assistants/codex/` - Codex configuration files
- `.architecture/members.yml` - Customize for project's needs
- `.architecture/principles.md` - Align with project architecture

## Natural Language Commands

After setup, GitHub Copilot/Codex should recognize these natural language patterns:

### Architecture Reviews
- "Review this architecture"
- "Start architecture review for version X.Y.Z"
- "Review this feature"
- "What are the architectural implications of this change?"

### Specialized Reviews
- "Review this for security issues"
- "Analyze this database schema for performance"
- "Check this code for maintainability problems"
- "What are the scalability concerns here?"

### ADR Creation
- "Create an ADR for our database choice"
- "Document this architectural decision"
- "Help me write an ADR for microservices"

### Code Generation & Analysis
- "Generate code following our architecture patterns"
- "Refactor this to match our ADRs"
- "Does this code follow our architectural principles?"

## Context Integration

The framework ensures GitHub Copilot/Codex understands project context by:

- Referencing existing ADRs in suggestions
- Following established coding patterns
- Maintaining consistency with architectural decisions
- Providing architecture-aware code completions