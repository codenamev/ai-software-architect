# AGENTS.md - AI Software Architect Framework

> **For Claude Code Users**: This file contains cross-platform instructions. For Claude-specific features including Skills and MCP integration, see [CLAUDE.md](CLAUDE.md).

## Project Overview

AI Software Architect is a markdown-based framework for implementing rigorous software architecture practices with AI assistant collaboration. The framework provides structured architecture documentation, multi-perspective reviews, and architectural decision tracking for any project.

**Technology Stack:**
- Markdown-based documentation framework
- Node.js MCP (Model Context Protocol) server for tool integration
- Claude Skills for reusable architecture operations
- YAML configuration files
- Git for version control

## Framework Development Setup

This repository contains the AI Software Architect framework itself. If you're contributing to or customizing the framework:

### Repository Structure

```
.architecture/          # Framework's own architecture documentation
├── decisions/          # ADRs for framework design decisions
├── reviews/           # Architecture reviews of framework features
├── members.yml        # Architecture team member definitions
├── principles.md      # Architectural principles
├── config.yml         # Framework configuration
└── templates/         # Templates for ADRs, reviews, AGENTS.md

.claude/               # Claude Code integration
└── skills/           # Reusable Claude Skills

.coding-assistants/    # Multi-assistant configurations
├── claude/           # Claude-specific configs
├── cursor/           # Cursor-specific configs
└── codex/            # GitHub Copilot configs

mcp/                  # MCP Server implementation
├── index.js         # Main MCP server code
├── package.json     # Node.js dependencies
└── README.md        # MCP server documentation
```

### Installation for Framework Development

```bash
# Clone the repository
git clone https://github.com/codenamev/ai-software-architect
cd ai-software-architect

# Install MCP server dependencies (optional)
cd mcp && npm install && cd ..

# Review framework structure
ls -la .architecture/
cat .architecture/principles.md
cat .architecture/members.yml
```

### Testing Framework Components

```bash
# Verify directory structure
ls -la .architecture/

# Check configuration
cat .architecture/config.yml

# List architecture members
cat .architecture/members.yml

# View templates
ls .architecture/templates/

# Test MCP server (if Node.js installed)
cd mcp && npm test
```

## Using the Framework in Your Project

**👉 For detailed installation procedures, see [.architecture/agent_docs/workflows.md § Setup Procedures](.architecture/agent_docs/workflows.md#setup-procedures)**

### Installation Options (Quick Reference)

**Option 1: Claude Skills (Recommended for Claude Code)**
- Install skills to `~/.claude/skills/`
- Run: `Setup ai-software-architect`

**Option 2: Direct Clone (For any AI assistant)**
- Clone to `.architecture/` in your project
- Run: `Setup software architect`

**Option 3: MCP Server (For MCP-compatible assistants)**
- Install: `npm install -g ai-software-architect`
- Configure in `claude_desktop_config.json`

**See [.architecture/agent_docs/workflows.md § Setup Procedures](.architecture/agent_docs/workflows.md#setup-procedures) for complete installation instructions.**

### Core Workflows

**👉 For detailed workflow procedures, see [.architecture/agent_docs/workflows.md](.architecture/agent_docs/workflows.md)**

Once installed in your project, you can:

**Request Architecture Reviews:**
- "Start architecture review for version X.Y.Z"
- "Start architecture review for [feature name]"
- "Ask [Specialist] to review [component]"

**Create Architectural Decision Records:**
- "Create ADR for [topic]"
- "Document architectural decision for [topic]"

**Enable Pragmatic Mode:**
- "Enable pragmatic mode"
- "Turn on YAGNI enforcement"
- "Challenge complexity"
- **See**: [.architecture/agent_docs/reference.md § Pragmatic Guard Mode](.architecture/agent_docs/reference.md#pragmatic-guard-mode)

**Architecture Recalibration:**
- "Start architecture recalibration for version X.Y.Z"
- "Recalibrate architecture for [feature]"
- **See**: [.architecture/agent_docs/reference.md § Architecture Recalibration](.architecture/agent_docs/reference.md#architecture-recalibration)

**Implement Features with Methodology:**
- "Implement [feature] as the architects"
- "Implement as the architects" (with prior context)
- "Implement [feature] as [specific architect]"
- **See**: [.architecture/agent_docs/workflows.md § Implementation with Methodology](.architecture/agent_docs/workflows.md#implementation-with-methodology)

**Configuring Implementation Guidance:**

**👉 For complete details and examples, see [.architecture/agent_docs/workflows.md § Implementation with Methodology](.architecture/agent_docs/workflows.md#implementation-with-methodology)**

Configure AI assistants to automatically apply your development methodology via `.architecture/config.yml`:

```yaml
implementation:
  enabled: true
  methodology: "TDD"  # or BDD, DDD, Test-Last, Exploratory
  influences:
    - "Kent Beck - TDD by Example"
    - "Sandi Metz - POODR"
  languages:
    ruby:
      style_guide: "Rubocop"
```

Then say: `"Implement [feature] as the architects"`

AI will automatically apply configured methodology, influences, and language practices.

## Framework Architecture

### Architectural Principles

This framework follows its own architectural principles defined in `.architecture/principles.md`:

1. **Livable Code**: Design for developers who inhabit the codebase
2. **Clarity over Cleverness**: Prefer simple, clear designs
3. **Separation of Concerns**: Clear boundaries and responsibilities
4. **Evolvability**: Facilitate change without rewrites
5. **Observability**: Provide insights into system behavior
6. **Security by Design**: Security integral, not afterthought
7. **Domain-Centric Design**: Reflect and serve the problem domain
8. **Pragmatic Simplicity**: Working solutions over theoretical perfection

### Architecture Team Members

The framework includes specialized architecture reviewers (see `.architecture/members.yml`):

- **Systems Architect**: Overall system coherence and architectural patterns
- **Domain Expert**: Business logic representation and semantic accuracy
- **Security Specialist**: Security implications and threat modeling
- **Performance Specialist**: Performance optimization and scalability
- **Maintainability Expert**: Code quality and technical debt management
- **AI Engineer**: AI/ML integration patterns and observability
- **Pragmatic Enforcer**: YAGNI principles and simplicity advocacy

### Decision Records

Framework design decisions are documented in `.architecture/decisions/adrs/`:

- **ADR-001**: CLI Functional Requirements
- **ADR-002**: Pragmatic Guard Mode (YAGNI Enforcement)
- **ADR-003**: Adoption of Agents.md Standard
- **ADR-004**: Implementation Command with Configuration

### Configuration

Framework behavior is controlled via `.architecture/config.yml`:

- Pragmatic mode settings (enabled/disabled, intensity level)
- Exemption categories (security, compliance, accessibility)
- Deferral tracking preferences
- Review process customization

## Contributing to the Framework

If you're improving the AI Software Architect framework itself:

### Making Changes

1. **Review Architectural Principles**: Read `.architecture/principles.md` before making changes
2. **Check Existing ADRs**: Review `.architecture/decisions/adrs/` for context
3. **Follow the Process**: Use the framework on itself
   - Create ADRs for significant decisions
   - Request architecture reviews for major changes
   - Enable pragmatic mode to avoid over-engineering
4. **Test Changes**: Verify templates, configurations, and documentation work
5. **Update Documentation**: Keep README, USAGE, and CLAUDE.md in sync

### Development Guidelines

**When Adding Features:**
- Create an ADR documenting the decision
- Consider pragmatic mode analysis (is this needed now?)
- Update templates if adding new document types
- Add examples demonstrating the feature
- Update CLAUDE.md with any new request patterns

**When Modifying Templates:**
- Test template generation with sample projects
- Ensure placeholders are clearly marked
- Validate against different project types
- Update setup instructions if needed

**When Changing Architecture:**
- Conduct architecture review using framework members
- Document trade-offs and alternatives
- Update principles.md if needed
- Consider impact on existing projects

### Testing Approach

**Manual Testing:**
```bash
# Test framework setup in a sample project
cd /path/to/test-project
# Follow installation steps
# Verify all files created correctly
# Test core workflows (reviews, ADRs, etc.)
```

**Template Validation:**
```bash
# Check all templates exist
ls .architecture/templates/

# Validate template structure
cat .architecture/templates/adr-template.md
cat .architecture/templates/review-template.md
cat .architecture/templates/AGENTS.md
```

**MCP Server Testing:**
```bash
cd mcp
npm test  # Run test suite
npm run dev  # Test in watch mode
```

## Build & Test Commands

### MCP Server

```bash
# Install dependencies
cd mcp && npm install

# Start MCP server
npm start

# Development mode (auto-reload)
npm run dev

# Run tests
npm test
```

### Framework Validation

```bash
# Verify framework structure
bash -c 'test -d .architecture && test -d .claude && test -d .coding-assistants && echo "✓ Structure valid" || echo "✗ Structure invalid"'

# Check required files exist
bash -c 'test -f .architecture/members.yml && test -f .architecture/principles.md && test -f CLAUDE.md && echo "✓ Core files present" || echo "✗ Missing files"'

# Validate YAML configuration
cat .architecture/config.yml .architecture/members.yml

# List all templates
find .architecture/templates -type f -name "*.md"
```

## Project Conventions

### File Naming

- **ADRs**: `ADR-###-topic-name.md` (sequential numbering)
- **Reviews**: `version-review.md` or `feature-name-review.md`
- **Recalibration**: Match review naming (version or feature)
- **Templates**: `template-name.md` or `TEMPLATE-NAME.md`

### Markdown Style

- Use ATX-style headers (`#` not underlines)
- Include blank line before/after lists
- Use fenced code blocks with language tags
- Keep lines under 120 characters where possible
- Use tables for structured comparisons

### Git Workflow

- Commit ADRs separately from implementation
- Reference ADR numbers in commit messages
- Keep commits focused and atomic
- Write descriptive commit messages
- Use conventional commit format where applicable

### Documentation

- Keep CLAUDE.md and AGENTS.md in sync for shared concepts
- Cross-reference between documents using relative links
- Update templates when changing document structure
- Include examples for new features
- Document configuration options in config.yml

## Assistant-Specific Features

### Claude Code

Claude Code users get enhanced capabilities:

- **Claude Skills**: Reusable skills for architecture operations
- **MCP Integration**: Tools via Model Context Protocol
- **Advanced Setup**: Intelligent project analysis and customization
- **Request Patterns**: Natural language commands optimized for Claude

**See [CLAUDE.md](CLAUDE.md) for complete documentation.**

### Cursor

Cursor users can configure via `.coding-assistants/cursor/`:
- Custom rules for architecture operations
- Tab completion and inline suggestions
- Integration with Cursor's composer

**See [.coding-assistants/cursor/README.md](.coding-assistants/cursor/README.md) for details.**

### GitHub Copilot / Codex

Copilot users can access features via `.coding-assistants/codex/`:
- Comment-triggered operations
- Inline suggestions for ADRs and reviews

**See [.coding-assistants/codex/README.md](.coding-assistants/codex/README.md) for details.**

### Other AI Assistants

The framework works with any AI assistant that can:
- Read markdown files
- Follow structured instructions
- Create and edit files
- Use the templates in `.architecture/templates/`

## Updating the Framework

**👉 For detailed update procedures, see [.architecture/agent_docs/workflows.md § Update Procedures](.architecture/agent_docs/workflows.md#update-procedures)**

### Quick Reference

**For Framework Repository:**
- `git pull origin main`
- Reinstall MCP dependencies if needed

**For Installed Projects:**
- Claude Skills: Backup and reinstall skills from latest
- Direct Clone: Ask assistant or manually fetch/reset
- Preserves your ADRs and reviews automatically

**See [.architecture/agent_docs/workflows.md § Update Procedures](.architecture/agent_docs/workflows.md#update-procedures) for complete instructions.**

## Additional Resources

### Detailed Documentation
- **Workflow Procedures**: [.architecture/agent_docs/workflows.md](.architecture/agent_docs/workflows.md)
- **Advanced Topics**: [.architecture/agent_docs/reference.md](.architecture/agent_docs/reference.md)
- **Documentation Guide**: [.architecture/agent_docs/README.md](.architecture/agent_docs/README.md)

### Framework Files
- **Framework Principles**: [.architecture/principles.md](.architecture/principles.md)
- **Architecture Members**: [.architecture/members.yml](.architecture/members.yml)
- **Framework Configuration**: [.architecture/config.yml](.architecture/config.yml)

### Templates & Examples
- **ADR Template**: [.architecture/templates/adr-template.md](.architecture/templates/adr-template.md)
- **Review Template**: [.architecture/templates/review-template.md](.architecture/templates/review-template.md)
- **AGENTS.md Template**: [.architecture/templates/AGENTS.md](.architecture/templates/AGENTS.md)
- **Example ADRs**: [.architecture/decisions/adrs/](.architecture/decisions/adrs/)
- **Example Reviews**: [.architecture/reviews/](.architecture/reviews/)

### Integration Guides
- **MCP Server Docs**: [mcp/README.md](mcp/README.md)
- **Usage Guide**: [USAGE-WITH-CLAUDE.md](USAGE-WITH-CLAUDE.md)
- **Skills Guide**: [USAGE-WITH-CLAUDE-SKILLS.md](USAGE-WITH-CLAUDE-SKILLS.md)

## Version Information

**Framework Version**: 1.6.0
**Documentation Version**: 2.0.0 (Progressive Disclosure - ADR-006)
**MCP Server Version**: 1.6.0
**Last Updated**: 2025-12-04
**Maintained By**: AI Software Architect Framework Contributors
**Repository**: https://github.com/codenamev/ai-software-architect
**Issues**: https://github.com/codenamev/ai-software-architect/issues
