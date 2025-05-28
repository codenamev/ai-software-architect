# Using AI Software Architect with Cursor

This guide explains how to effectively use the AI Software Architect framework with Cursor. The framework is designed to streamline architectural discussions, reviews, and decisions with the help of AI assistants.

For general usage instructions, see [USAGE.md](USAGE.md).

## Installation

Use the universal setup command:

```
Setup architecture using: https://github.com/codenamev/ai-software-architect
```

Cursor will automatically:
- Clone the framework to `.architecture/`
- Detect that you're using Cursor
- Configure Rule files in `.coding-assistants/cursor/` directory
- Set up integration following Cursor's Rules documentation
- Analyze and customize for your project
- Conduct a collaborative architectural analysis with all framework members
- Create an initial system analysis document in `.architecture/reviews/initial-system-analysis.md`

## Cursor Rules Integration

The framework provides pre-configured Rule files for Cursor:

```
.coding-assistants/cursor/
├── ai_software_architect_overview.mdc
├── ai_software_architect_setup.mdc
├── ai_software_architect_usage.mdc
├── ai_software_architect_structure.mdc
└── ai_software_architect_reviews.mdc
```

This follows Cursor's updated [Rules documentation](https://docs.cursor.com/context/rules).

## Setup Commands

After installation, Cursor recognizes these setup commands:

| Command | Description |
|---------|-------------|
| `Setup ai-software-architect` | Full framework setup and customization |
| `Setup architecture` | Alias for framework setup |
| `Customize software architect` | Customize existing framework for project changes |

## Key Commands for Cursor

### Architecture Reviews

| Command | Description |
|---------|-------------|
| `Review this architecture` | Begin a comprehensive review |
| `Analyze this feature` | Review a specific feature or component |
| `Evaluate this code's architecture` | Analyze existing code architecture |

### Specialized Reviews

| Command | Description |
|---------|-------------|
| `Analyze this from a security perspective` | Get security-focused review |
| `Review this for performance` | Get performance-focused review |
| `Evaluate maintainability` | Get maintainability assessment |

### Documentation Creation

| Command | Description |
|---------|-------------|
| `Create an ADR for this decision` | Draft an Architectural Decision Record |
| `Document this architectural approach` | Create documentation in the framework style |
| `Help me write an architecture review` | Create a review document |

## Advanced Usage

### Multi-Perspective Reviews

For comprehensive reviews, ask Cursor to adopt multiple architectural perspectives:

```
Review this authentication system using AI Software Architect framework, focusing on:
1. Security implications
2. Performance characteristics 
3. Long-term maintainability
```

### Implementation Planning

Get detailed implementation plans based on architectural reviews:

```
Create an implementation plan based on the architecture review in .architecture/reviews/auth-system.md using the AI Software Architect framework
```

## Tips for Effective Interaction

1. **Reference the Framework Explicitly**: Always mention "AI Software Architect" in your prompts.

2. **Be Specific**: Clearly describe what aspect of architecture you want to focus on.

3. **Provide Context**: Give Cursor enough background information about your specific system.

4. **Request Multiple Perspectives**: Ask for analysis from different architectural viewpoints.

5. **Link to Existing Documents**: Reference previous ADRs, reviews, or principles when relevant.

## Example Workflows

### New Feature Design

```
1. "Design a new authentication feature using the AI Software Architect framework"
2. "Create an ADR for the authentication approach using AI Software Architect format"
3. "Review the authentication design from a security perspective with AI Software Architect"
4. "Create an implementation plan for the authentication feature based on the AI Software Architect review"
```

### Architectural Assessment

```
1. "Review our current API design using the AI Software Architect framework"
2. "Identify architectural debt in our codebase using AI Software Architect principles"
3. "Create a recalibration plan for API improvements using AI Software Architect"
```

## Integration with Other Tools

The AI Software Architect framework is designed to work alongside other development tools:

- **Version Control**: Store architecture documents in Git alongside code
- **Issue Tracking**: Reference architecture reviews and decisions in issues
- **CI/CD**: Include architecture checks in your pipeline
- **Documentation**: Link to ADRs from other documentation

## Remember

The framework works best when it's regularly maintained and integrated into your development workflow. Use Cursor to keep your architectural documentation up-to-date and to foster discussions about important architectural decisions.
