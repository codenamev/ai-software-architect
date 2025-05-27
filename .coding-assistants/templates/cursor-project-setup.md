# Cursor Project Setup Template

This template provides guidance for setting up Cursor Rules integration in user projects.

## Setup Process

During framework setup for Cursor users:

1. **Copy Rule Files**: Copy all .mdc files from `.coding-assistants/cursor/` to the user's project
2. **Create Rules Directory**: Ensure the user has appropriate Rule file organization
3. **Configure Integration**: Set up proper Rule file references

## Rule File Organization

Cursor users should have these Rule files available:

```
.coding-assistants/cursor/
├── ai_software_architect_overview.mdc
├── ai_software_architect_setup.mdc
├── ai_software_architect_usage.mdc
├── ai_software_architect_structure.mdc
└── ai_software_architect_reviews.mdc
```

## Rule Configuration

Each Rule file includes:

### ai_software_architect_overview.mdc
- **Purpose**: High-level framework overview and principles
- **Globs**: `**/*.md`, `.architecture/**/*`
- **Always Apply**: `true`

### ai_software_architect_setup.mdc
- **Purpose**: Setup and configuration instructions
- **Globs**: `CLAUDE.md`, `.coding-assistants/**/*`
- **Always Apply**: `false`

### ai_software_architect_usage.mdc
- **Purpose**: Workflow instructions and commands
- **Globs**: `.architecture/**/*`, `**/*.md`
- **Always Apply**: `false`

### ai_software_architect_structure.mdc
- **Purpose**: Directory structure and organization
- **Globs**: `.architecture/**/*`
- **Always Apply**: `false`

### ai_software_architect_reviews.mdc
- **Purpose**: Review process and member roles
- **Globs**: `.architecture/reviews/**/*`, `.architecture/members.yml`
- **Always Apply**: `false`

## Project-Specific Customization

### Technology-Specific Examples

Add relevant examples to ai_software_architect_usage.mdc based on detected technology:

#### React Projects
```markdown
### React-Specific Architecture Commands
- "Review this component architecture"
- "Analyze this state management pattern"
- "Create an ADR for our React component structure"
```

#### Backend Services
```markdown
### Backend Service Architecture Commands
- "Review this API design"
- "Analyze this database schema"
- "Create an ADR for our service boundaries"
```

#### Mobile Applications
```markdown
### Mobile Architecture Commands
- "Review this navigation structure"
- "Analyze this data persistence approach"
- "Create an ADR for our app architecture pattern"
```

## Integration Instructions

When setting up for Cursor users:

1. **Verify Rule Files**: Ensure all 5 .mdc files are properly formatted with correct frontmatter
2. **Check Globs**: Verify glob patterns match the user's project structure
3. **Test Recognition**: Confirm Cursor recognizes the Rule files and applies them appropriately
4. **Document Usage**: Provide clear instructions on how to use the framework commands

## User Guidance Template

Provide this guidance to users after setup:

```markdown
# AI Software Architect Integration Complete

Your project now includes Cursor Rules for the AI Software Architect framework.

## Available Commands

Use these natural language commands with Cursor:

### Setup & Customization
- "Setup ai-software-architect"
- "Customize architecture"

### Architecture Reviews
- "Review this architecture"
- "Analyze this feature"
- "Evaluate this code's architecture"

### Specialized Analysis
- "Analyze this from a security perspective"
- "Review this for performance"
- "Evaluate maintainability"

### Documentation
- "Create an ADR for this decision"
- "Document this architectural approach"
- "Help me write an architecture review"

## Framework Structure

The framework files are organized in:
- `.architecture/` - All architectural documentation
- `.coding-assistants/cursor/` - Cursor-specific Rule files

Cursor will automatically apply these Rules based on the files you're working with.
```