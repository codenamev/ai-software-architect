# CLAUDE.md - Claude Code Integration

> **This file contains Claude Code-specific enhancements for the AI Software Architect framework.**

## Core Framework Documentation

**👉 See [AGENTS.md](AGENTS.md) for complete framework documentation:**
- Project overview and technology stack
- Installation options (Skills, Direct Clone, MCP)
- Core workflows (reviews, ADRs, pragmatic mode, implementation)
- Architecture principles and team members
- Framework configuration and customization
- Development guidelines and conventions

**This file (CLAUDE.md) adds Claude Code-specific features and optimizations.**

## About This Structure

The AI Software Architect framework uses a **progressive disclosure** pattern to respect LLM instruction capacity limits (see [ADR-005](/.architecture/decisions/adrs/ADR-005-llm-instruction-capacity-constraints.md)):

- **AGENTS.md**: Cross-platform core documentation (~150 instructions)
- **CLAUDE.md**: Claude Code-specific enhancements (this file, ~30 instructions)
- **.architecture/agent_docs/**: Detailed task-specific guidance (loaded as needed)

## Claude Code-Specific Features

### 1. Claude Skills Integration

Claude Code users can access framework operations as reusable skills:

**Available Skills:**
- `setup-architect`: Set up framework in a new project
- `architecture-review`: Conduct multi-perspective reviews
- `specialist-review`: Get single specialist's perspective
- `create-adr`: Create Architectural Decision Records
- `list-members`: Show architecture team members
- `architecture-status`: Framework health and documentation status
- `pragmatic-guard`: Enable YAGNI enforcement mode

**See [AGENTS.md](AGENTS.md#installation-options) for installation instructions.**

### 2. MCP Server Integration

Framework operations available via Model Context Protocol:

```json
{
  "mcpServers": {
    "ai-software-architect": {
      "command": "npx",
      "args": ["ai-software-architect"]
    }
  }
}
```

MCP provides tools for setup, reviews, ADR creation, and status checks.

### 3. Natural Language Request Patterns

Claude Code optimizes for natural language commands:

**Architecture Reviews:**
- "Start architecture review for version X.Y.Z"
- "Start architecture review for [feature name]"
- "Ask [Specialist] to review [component]"

**Create ADRs:**
- "Create ADR for [topic]"
- "Document architectural decision for [topic]"

**Implementation with Methodology:**
- "Implement [feature] as the architects"
- "Implement as [specific architect]"

**Enable Pragmatic Mode:**
- "Enable pragmatic mode"
- "Turn on YAGNI enforcement"

**Framework Operations:**
- "Setup ai-software-architect"
- "Update the software architect framework"

## Quick Reference

| What You Want | Where to Find It |
|---------------|------------------|
| **Install framework** | [AGENTS.md § Installation Options](AGENTS.md#installation-options) |
| **Core workflows** | [AGENTS.md § Core Workflows](AGENTS.md#core-workflows) |
| **Implementation config** | [AGENTS.md § Configuring Implementation Guidance](AGENTS.md#configuring-implementation-guidance) |
| **Architecture principles** | [AGENTS.md § Architectural Principles](AGENTS.md#architectural-principles) |
| **Team members** | [.architecture/members.yml](.architecture/members.yml) |
| **Framework config** | [.architecture/config.yml](.architecture/config.yml) |
| **ADR examples** | [.architecture/decisions/adrs/](.architecture/decisions/adrs/) |
| **Review examples** | [.architecture/reviews/](.architecture/reviews/) |

## Critical Guidelines for Claude Code

**When working with this framework:**

1. **Follow AGENTS.md instructions** - Core workflows and principles are cross-platform
2. **Use natural language** - Request patterns above are optimized for Claude
3. **Reference architecture artifacts** - Always check existing ADRs and reviews
4. **Apply pragmatic analysis** - When enabled, challenge complexity (see [ADR-002](/.architecture/decisions/adrs/ADR-002-pragmatic-guard-mode.md))
5. **Respect instruction capacity** - Keep documentation concise and relevant (see [ADR-005](/.architecture/decisions/adrs/ADR-005-llm-instruction-capacity-constraints.md))

**When conducting reviews:**
- Adopt the persona of architecture members from [.architecture/members.yml](.architecture/members.yml)
- Follow review process from [.architecture/templates/review-template.md](.architecture/templates/review-template.md)
- Reference architectural principles from [.architecture/principles.md](.architecture/principles.md)

**When creating ADRs:**
- Use template from [.architecture/templates/adr-template.md](.architecture/templates/adr-template.md)
- Include pragmatic analysis when pragmatic mode enabled
- Reference related reviews and existing ADRs

**When implementing with methodology:**
- Read implementation config from [.architecture/config.yml](.architecture/config.yml)
- Apply configured methodology, influences, and practices
- See [AGENTS.md § Configuring Implementation Guidance](AGENTS.md#configuring-implementation-guidance) for details

## Version Information

**Framework Version**: 1.6.0
**Last Updated**: 2025-12-04
**Optimized For**: Claude Code with instruction capacity constraints (ADR-005)
