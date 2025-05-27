# Using AI Software Architect with Cursor

This guide explains how to effectively use the AI Software Architect framework with Cursor. The framework is designed to streamline architectural discussions, reviews, and decisions with the help of AI assistants.

For general usage instructions, see [USAGE.md](USAGE.md). For installation options, see [INSTALL.md](INSTALL.md).

## Quick Setup for Cursor Users

### Option 1: In-Project Setup (Recommended)

1. **Clone into your project**:
   ```bash
   # From your project root directory
   git clone https://github.com/codenamev/ai-software-architect.git .architecture
   ```

2. **Add to your project's .cursorrules file** (create if it doesn't exist):
   ```
   # Include AI Software Architect framework
   @.architecture/.coding-assistants/cursor/ai_software_architect_overview.mdc
   @.architecture/.coding-assistants/cursor/ai_software_architect_setup.mdc
   ```

3. **Setup the framework**:
   Open Cursor in your project and ask:
   ```
   Setup ai-software-architect
   ```
   
   Cursor will analyze your project and customize the framework templates for your specific codebase.

### Option 2: Manual Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/codenamev/ai-software-architect.git .architecture
   rm -rf .architecture/.git  # Remove Git history if desired
   ```

2. **Configure Cursor**:
   - Make sure the `.coding-assistants/cursor` directory is present in your project
   - Cursor will automatically use the `.mdc` rule files in this directory

3. **Use Cursor with AI Software Architect Commands**:
   - Open Cursor
   - Start prompts with AI Software Architect-specific language
   - Cursor will reference the rule files to understand the framework

## Setup Commands

After installation, Cursor recognizes these setup commands:

| Command | Description |
|---------|-------------|
| `Setup ai-software-architect` | Full framework setup and customization |
| `Setup architecture` | Alias for framework setup |
| `Customize architecture` | Customize existing framework for project changes |

## Key Commands for Cursor

### Architecture Reviews

| Command | Description |
|---------|-------------|
| `Review this architecture using the AI Software Architect framework` | Begin a comprehensive review |
| `Analyze this feature using the AI Software Architect framework` | Review a specific feature or component |
| `Evaluate this code's architecture using AI Software Architect` | Analyze existing code architecture |

### Specialized Reviews

| Command | Description |
|---------|-------------|
| `Analyze this from a security perspective using AI Software Architect` | Get security-focused review |
| `Review this for performance using the AI Software Architect framework` | Get performance-focused review |
| `Evaluate maintainability using AI Software Architect principles` | Get maintainability assessment |

### Documentation Creation

| Command | Description |
|---------|-------------|
| `Create an ADR for this decision using the AI Software Architect format` | Draft an Architectural Decision Record |
| `Document this architectural approach using AI Software Architect` | Create documentation in the framework style |
| `Help me write an architecture review following AI Software Architect` | Create a review document |

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
