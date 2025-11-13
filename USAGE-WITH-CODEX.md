# Using AI Software Architect with GitHub Copilot / Codex

This guide explains how to effectively use the AI Software Architect framework with GitHub Copilot and OpenAI Codex. The framework uses context-based recognition, so you can use natural language commands without mentioning the framework explicitly.

For general usage instructions, see [USAGE.md](USAGE.md).

## Installation

Use the universal setup command:

```
Setup architecture using: https://github.com/codenamev/ai-software-architect
```

GitHub Copilot/Codex will automatically:
- Clone the framework to `.architecture/`
- Detect that you're using GitHub Copilot/Codex
- Configure context-based recognition
- Analyze and customize for your project
- Conduct a collaborative architectural analysis with all framework members
- Create an initial system analysis document in `.architecture/reviews/initial-system-analysis.md`

## Standard Commands

The framework uses context-based recognition. You can use structured commands or natural language:

### Structured Commands (Recommended for Clarity)

**Setup**:
```
Setup architecture
```

**Create ADR**:
```
Create an ADR for [decision]
```
Example: "Create an ADR for database choice"

**Architecture Review**:
```
Start architecture review for [version/feature]
```
OR
```
Review this architecture
```

**Specialist Review**:
```
Review this for [concern] issues
```
Examples:
- "Review this for security issues"
- "Analyze this database schema for performance"
- "Check this code for maintainability problems"

**Check Status**:
```
Summarize our architectural decisions
```

**Enable Pragmatic Mode**:
```
Enable pragmatic mode
```
Examples:
- "Enable YAGNI enforcement with balanced intensity"
- "Turn on simplicity guard"

### Natural Language Alternatives

Copilot/Codex also understands natural phrasing:
- "What are the architectural implications of this change?"
- "What are the scalability concerns here?"
- "Does this code follow our architectural principles?"
- "Generate code following our architecture patterns"
- "Refactor this to match our ADRs"
- "Help me write an ADR for microservices"

## Context-Based Features

### Inline Assistance
GitHub Copilot provides architectural suggestions directly in your IDE:
- Suggests code patterns that align with your ADRs
- Recommends architectural improvements during coding
- Provides context-aware documentation

### Chat-Based Architecture Discussion
Use GitHub Copilot Chat for deeper architectural conversations:

```
What patterns should I use for this payment processing feature?
```

```
How should I structure this microservice based on our current architecture?
```

```
Review this API design for our e-commerce platform
```

### Project-Aware Recommendations
The framework ensures Copilot understands your project context:
- References existing ADRs in suggestions
- Follows established coding patterns
- Maintains consistency with architectural decisions

## Advanced Usage

### Multi-Perspective Analysis
Request analysis from different architectural viewpoints:

```
Analyze this from security, performance, and maintainability perspectives
```

### Evolution Planning
Get guidance on architectural evolution:

```
How should we evolve this architecture for our next major version?
```

### Best Practices Integration
Leverage architectural wisdom in real-time:

```
What would Martin Fowler recommend for this refactoring?
```

## Working with Architecture Documents

### Review Existing ADRs
```
Summarize our current architectural decisions
```

### Update Documentation
```
Update our architecture documentation based on recent changes
```

### Gap Analysis
```
What architectural decisions are we missing?
```

## Tips for Effective Use

1. **Be Specific**: Include relevant context in your questions
2. **Reference Components**: Mention specific files, classes, or modules
3. **Ask Follow-ups**: Dive deeper into recommendations
4. **Request Examples**: Ask for concrete code examples
5. **Validate Decisions**: Check if suggestions align with existing ADRs

## Integration with Development Workflow

### Code Reviews
Use Copilot during code reviews to check architectural compliance:

```
Does this PR follow our established patterns?
```

### Planning Sessions
Get architectural input during planning:

```
What are the technical risks of this proposed feature?
```

### Refactoring
Guide refactoring efforts with architectural principles:

```
How should I refactor this to improve our architecture?
```

The framework transforms GitHub Copilot and Codex into architectural advisors that understand your project's specific context and principles.