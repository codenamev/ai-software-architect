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

## Standard Commands

After installation, use these standardized commands in Cursor:

### Setup & Customization

**Primary Command**:
```
Setup ai-software-architect
```

**Alternative Phrases**:
- "Setup architecture"
- "Initialize architecture framework"
- "Customize software architect" (for updates)

### Create ADR

**Primary Command**:
```
Create ADR for [decision topic]
```

**Alternative Phrases**:
- "Create an ADR for this decision"
- "Document architectural decision for [topic]"

### Architecture Review

**Primary Command**:
```
Start architecture review for [version/feature]
```

**Natural Alternatives** (Cursor understands):
- "Review this architecture"
- "Analyze this feature"
- "Evaluate this code's architecture"

### Specialist Review

**Primary Command**:
```
Ask [Specialist Name] to review [target]
```

**Natural Alternatives** (Cursor understands):
- "Analyze this from a security perspective"
- "Review this for performance"
- "Evaluate maintainability"

### List Members

**Primary Command**:
```
List architecture members
```

**Alternative**: "Who's on the architecture team?"

### Check Status

**Primary Command**:
```
What's our architecture status?
```

**Alternative**: "Show architecture documentation"

### Enable Pragmatic Mode

**Primary Command**:
```
Enable pragmatic mode
```

**Examples**:
- "Enable pragmatic mode with balanced intensity"
- "Turn on YAGNI enforcement"

**Note**: Available when using Cursor Rules integration. This mode adds a Pragmatic Enforcer who challenges over-engineering.

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
1. "Start architecture review for authentication feature"
2. "Ask Security Specialist to review authentication design"
3. "Create ADR for authentication approach"
4. "Start architecture recalibration for authentication feature"
```

### Architectural Assessment

```
1. "Start architecture review for API design"
2. "Ask Maintainability Expert to review architectural debt"
3. "Create ADR for API improvements"
4. "Start architecture recalibration for API improvements"
```

### Pre-Release Workflow

```
1. "What's our architecture status?"
2. "Start architecture review for version 2.0.0"
3. "Create ADR for key decisions"
4. "Start architecture recalibration for version 2.0.0"
```

## Integration with Other Tools

The AI Software Architect framework is designed to work alongside other development tools:

- **Version Control**: Store architecture documents in Git alongside code
- **Issue Tracking**: Reference architecture reviews and decisions in issues
- **CI/CD**: Include architecture checks in your pipeline
- **Documentation**: Link to ADRs from other documentation

## Remember

The framework works best when it's regularly maintained and integrated into your development workflow. Use Cursor to keep your architectural documentation up-to-date and to foster discussions about important architectural decisions.
