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

## Standard Commands

### Setup & Customization

**Primary Command**:
```
Setup ai-software-architect
```

**Alternative Phrases**:
- "Setup .architecture"
- "Setup architecture"
- "Initialize architecture framework"
- "Customize software architect" (for updates)

### Create Architectural Decision Record (ADR)

**Primary Command**:
```
Create ADR for [decision topic]
```

**Examples**:
- "Create ADR for PostgreSQL database choice"
- "Create ADR for microservices architecture"
- "Create ADR for authentication approach"

**Alternative Phrases**:
- "Document architectural decision for [topic]"
- "Write ADR about [topic]"

### Architecture Reviews

**Primary Command**:
```
Start architecture review for [version/feature]
```

**Examples**:
- "Start architecture review for version 2.0.0"
- "Start architecture review for authentication system"
- "Start architecture review for payment feature"

**Alternative Phrases**:
- "Review architecture for [component]"
- "Conduct architecture review for [scope]"

### Specialist Reviews

**Primary Command**:
```
Ask [Specialist Name] to review [target]
```

**Examples**:
- "Ask Security Specialist to review API authentication"
- "Ask Performance Expert to review database queries"
- "Ask Ruby Expert to review module structure"

**Alternative Phrases**:
- "Have [specialist] review [target]"
- "Get [specialist]'s opinion on [topic]"

**Note**: Claude will dynamically create new specialist roles if they don't exist in your members.yml file.

### List Architecture Team

**Primary Command**:
```
List architecture members
```

**Alternative Phrases**:
- "Who's on the architecture team?"
- "Show me the architects"
- "What specialists are available?"

### Check Architecture Status

**Primary Command**:
```
What's our architecture status?
```

**Alternative Phrases**:
- "Show architecture documentation"
- "Architecture health check"
- "How many ADRs do we have?"

### Enable Pragmatic Mode (YAGNI Enforcement)

**Primary Command**:
```
Enable pragmatic mode
```

**Examples**:
- "Enable pragmatic mode with balanced intensity"
- "Turn on YAGNI enforcement"
- "Activate simplicity guard"

**Alternative Phrases**:
- "Challenge complexity"
- "Configure pragmatic enforcer"

**Note**: Available when using CLAUDE.md integration. This mode adds a Pragmatic Enforcer who challenges over-engineering and proposes simpler alternatives.

### Recalibration

**Primary Command**:
```
Start architecture recalibration for [target]
```

**Examples**:
- "Start architecture recalibration for version 2.0.0"
- "Recalibrate architecture for authentication feature"
- "Create action plan from security review"

**Alternative Phrases**:
- "Plan implementation of [review findings]"
- "Implement architecture changes for [component]"

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
1. "Start architecture review for OAuth 2.0 authentication feature"
2. "Ask Security Specialist to review token handling"
3. "Create ADR for OAuth integration approach"
4. "Start architecture recalibration for OAuth feature"
```

### Technical Debt Assessment

```
1. "Start architecture review for data access layer"
2. "Ask Maintainability Expert to review refactoring priorities"
3. "Create ADR for data layer refactoring approach"
4. "Start architecture recalibration for data layer improvements"
```

### Cross-Cutting Concern Analysis

```
1. "Start architecture review for logging infrastructure"
2. "Ask Performance Specialist to review observability approach"
3. "Create ADR for standardized observability"
4. "Start architecture recalibration for observability standards"
```

### Pre-Release Workflow

```
1. "What's our architecture status?"
2. "Start architecture review for version 2.0.0"
3. "Create ADR for key decisions identified in review"
4. "Start architecture recalibration for version 2.0.0"
```

## Remember

The AI Software Architect framework works best when it's regularly maintained and integrated into your development workflow. Use Claude Code to keep your architectural documentation up-to-date and to foster discussions about important architectural decisions.

The framework is designed to be flexible - adapt it to your team's specific needs and processes. The goal is to make architecture more accessible and maintainable, not to add bureaucracy or overhead.
