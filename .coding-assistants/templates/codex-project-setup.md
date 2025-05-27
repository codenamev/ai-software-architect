# GitHub Copilot/Codex Project Setup Template

This template provides guidance for setting up GitHub Copilot/Codex integration in user projects.

## Setup Process

During framework setup for GitHub Copilot/Codex users:

1. **Copy Configuration Files**: Ensure setup-instructions.md is available for reference
2. **Context Integration**: Verify architecture files are accessible to Copilot
3. **Pattern Recognition**: Confirm natural language commands are properly documented

## Configuration Approach

GitHub Copilot/Codex uses context-based recognition rather than explicit configuration files:

- **No explicit config files required**
- **Context-driven suggestions** based on architecture documentation
- **Natural language command recognition**
- **Pattern-aware code generation**

## Project Integration

### Directory Structure Setup
Ensure these directories are accessible to Copilot:

```
.architecture/
├── decisions/          # ADRs and architectural decisions
├── reviews/           # Architecture review documents  
├── recalibration/     # Post-review action plans
├── members.yml        # Architecture team definitions
└── principles.md      # Project architectural principles

.coding-assistants/codex/
├── setup-instructions.md
└── README.md
```

### Context Files

GitHub Copilot automatically references:

- **Architecture Decision Records** in `.architecture/decisions/`
- **Review documents** in `.architecture/reviews/`
- **Project principles** in `.architecture/principles.md`
- **Team member definitions** in `.architecture/members.yml`

## Natural Language Commands

After setup, users can use these natural language patterns:

### Architecture Reviews
```
Review this architecture
Start architecture review for version 2.0.0  
Review this feature
What are the architectural implications of this change?
```

### Specialized Reviews
```
Review this for security issues
Analyze this database schema for performance
Check this code for maintainability problems
What are the scalability concerns here?
```

### ADR Creation
```
Create an ADR for our database choice
Document this architectural decision
Help me write an ADR for microservices
```

### Code Generation & Analysis
```
Generate code following our architecture patterns
Refactor this to match our ADRs
Does this code follow our architectural principles?
```

## Technology-Specific Examples

### Web Applications
```
How should I structure this React component based on our architecture?
Review this API design for our e-commerce platform
Generate a service layer following our patterns
```

### Mobile Applications  
```
What patterns should I use for this mobile data layer?
Review this navigation structure for our iOS app
Generate authentication code following our security principles
```

### Backend Services
```
How should I design this microservice boundary?
Review this database schema for performance
Generate middleware following our patterns
```

## User Guidance Template

Provide this guidance to users after setup:

```markdown
# AI Software Architect Framework - GitHub Copilot Integration

Your project now includes GitHub Copilot integration with the AI Software Architect framework.

## How It Works

GitHub Copilot automatically references your architectural documentation to provide:
- **Architecture-aware code suggestions**
- **Pattern-consistent code generation**  
- **Architectural guidance in chat**
- **Context-aware refactoring suggestions**

## Available Commands

Use natural language with GitHub Copilot Chat:

### Architecture Analysis
- "Review this architecture"
- "What are the architectural implications of this change?"
- "Analyze this from [perspective] perspective"

### Code Generation
- "Generate code following our architecture patterns"
- "Refactor this to match our ADRs"
- "Create a component following our established patterns"

### Documentation
- "Create an ADR for [topic]"
- "Document this architectural decision"
- "Help me write an architecture review"

### Best Practices
- "Does this code follow our architectural principles?"
- "What would be the best architectural approach here?"
- "How can I improve this design?"

## Framework Integration

Copilot automatically references:
- Your ADRs in `.architecture/decisions/`
- Architecture reviews in `.architecture/reviews/`
- Project principles in `.architecture/principles.md`
- Team member expertise from `.architecture/members.yml`

This ensures all suggestions align with your established architectural decisions and principles.
```

## Integration Notes

- **No manual configuration required** - Copilot automatically discovers architecture files
- **Context-driven suggestions** - Recommendations based on project's architectural context
- **Natural language interface** - No need to remember specific framework commands
- **Pattern consistency** - Code suggestions follow established architectural patterns