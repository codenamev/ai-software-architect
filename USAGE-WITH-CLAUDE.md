# Using AI Software Architect with Claude Code

This guide explains how to effectively use the AI Software Architect framework with Claude Code. The framework is designed to streamline architectural discussions, reviews, and decisions with the help of AI assistants.

For general usage instructions, see [USAGE.md](USAGE.md).

## Installation

Use the universal setup command:

```
Setup architecture using: https://github.com/codenamev/ai-software-architect
```

Claude will automatically:
- Clone the framework to `.architecture/`
- Detect that you're using Claude Code
- Configure the integration
- Analyze and customize for your project
- Set up proper directory structure
- Conduct a collaborative architectural analysis with all framework members
- Create an initial system analysis document in `.architecture/reviews/initial-system-analysis.md`

## Getting Started

After installation, Claude is ready to help with architecture tasks. Use natural language commands - Claude understands the framework context automatically.

## Key Commands for Claude Code

### Setup & Customization

| Command | Description |
|---------|-------------|
| `Setup .architecture` | Initial setup and customization of the framework |
| `Customize architecture` | Refine or update the framework configuration |
| `Setup software architect` | Alternative phrasing for initial setup |

### Architecture Reviews

| Command | Description |
|---------|-------------|
| `Start architecture review for version X.Y.Z` | Begin a comprehensive review for a version |
| `Start architecture review for 'feature name'` | Review a specific feature or component |
| `Review architecture for 'component description'` | Analyze a particular component |

### Specialized Reviews

| Command | Description |
|---------|-------------|
| `Ask Security Architect to review these code changes` | Get security-focused review |
| `Have Performance Specialist review this database schema` | Get performance-focused review |
| `Ask Ruby Expert if my use of modules follows best practices` | Get language-specific expertise |

Claude will dynamically create new specialist roles if they don't exist in your members.yml file.

### Recalibration

| Command | Description |
|---------|-------------|
| `Start architecture recalibration for version X.Y.Z` | Plan implementation based on review |
| `Recalibrate architecture for 'feature name'` | Create action plan for a feature |
| `Implement architecture changes for 'component'` | Get implementation guidance |

### ADR Creation

| Command | Description |
|---------|-------------|
| `Create an ADR for 'topic'` | Draft an Architectural Decision Record |
| `Document architectural decision for 'approach'` | Alternative way to create an ADR |

## Advanced Usage

### Multi-Perspective Reviews

For comprehensive reviews, Claude can adopt multiple architectural perspectives:

```
Start a collaborative architecture review for our authentication system with:
1. Security Specialist focusing on potential vulnerabilities
2. Performance Expert analyzing bottlenecks
3. Maintainability Architect evaluating long-term support
```

### Incremental Refinement

Refine architectural documents incrementally:

```
Review our latest ADR on microservice boundaries and suggest improvements for clarity and completeness
```

### Implementation Planning

Get detailed implementation plans:

```
Create an implementation roadmap for the architectural changes identified in our latest review
```

## Tips for Effective Interaction

1. **Be Specific**: Clearly describe the scope of your request - what component, feature, or aspect of the architecture you're focusing on.

2. **Provide Context**: Give Claude enough background information to make informed recommendations.

3. **Request Multiple Perspectives**: Ask for analysis from different architectural viewpoints.

4. **Iterative Refinement**: Start broad, then refine based on Claude's initial analysis.

5. **Link to Existing Documents**: Reference previous ADRs, reviews, or principles when relevant.

6. **Prioritize Feedback**: Ask Claude to prioritize recommendations by impact or implementation effort.

7. **Challenge Assumptions**: Ask Claude to identify and question underlying assumptions in your architecture.

## Example Workflows

### New Feature Review

```
1. "Start architecture review for adding OAuth 2.0 to our authentication system"
2. "Ask Security Specialist to focus on the token handling in the OAuth implementation"
3. "Create an ADR documenting our OAuth integration approach"
4. "Start architecture recalibration based on the OAuth review"
5. "Create implementation roadmap for OAuth integration"
```

### Technical Debt Assessment

```
1. "Review our current data access layer for technical debt"
2. "Ask Maintainability Expert to suggest refactoring priorities"
3. "Create an ADR for our data access layer refactoring approach"
4. "Start architecture recalibration for data layer improvements"
```

### Cross-Cutting Concern Analysis

```
1. "Start architecture review for our logging and monitoring infrastructure"
2. "Ask Operations Specialist to review our observability approach"
3. "Create an ADR for standardizing observability across services"
4. "Start architecture recalibration for implementing the new standards"
```

## Remember

The AI Software Architect framework works best when it's regularly maintained and integrated into your development workflow. Use Claude Code to keep your architectural documentation up-to-date and to foster discussions about important architectural decisions.

The framework is designed to be flexible - adapt it to your team's specific needs and processes. The goal is to make architecture more accessible and maintainable, not to add bureaucracy or overhead.
