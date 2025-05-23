# AI Software Architect

A markdown-based framework for implementing rigorous software architecture practices in any project, with specialized AI assistant integration.

## Overview

This framework provides a structured approach to:

1. **Architecture Documentation** - Templates and processes for documenting architectural decisions
2. **Architecture Reviews** - A multi-perspective review process with specialized reviewers
3. **Architecture Recalibration** - Process for translating reviews into concrete implementation plans
4. **Progress Tracking** - Tools for monitoring the implementation of architectural changes
5. **AI Integration** - Seamless collaboration with AI coding assistants

For detailed usage instructions, see [USAGE.md](USAGE.md) and [INSTALL.md](INSTALL.md) for installation options.

## Getting Started

1. Copy this repository into your project:
   ```bash
   git clone https://github.com/yourusername/ai-software-architect.git .architecture
   rm -rf .architecture/.git  # Remove Git history if desired
   ```
   See [INSTALL.md](INSTALL.md) for additional installation options.

2. Use an AI assistant to customize the framework for your project:
   - For Claude Code users, simply ask: "Setup .architecture" or "Customize architecture"
   - The assistant will analyze your repository and customize the templates accordingly
   - Follow the assistant's guidance to further refine the setup
   - See [USAGE-WITH-CLAUDE.md](USAGE-WITH-CLAUDE.md) for Claude-specific instructions

3. Start using the framework:
   - Create ADRs in `.architecture/decisions/adrs/`
   - Conduct architecture reviews in `.architecture/reviews/`
   - Document recalibration plans in `.architecture/recalibration/`
   - See [USAGE.md](USAGE.md) for detailed workflow instructions

## Directory Structure

```
.architecture/
├── decisions/
│   ├── adrs/                # Architectural Decision Records
│   └── principles.md        # Architectural principles document
├── reviews/                 # Architecture review documents
├── recalibration/           # Recalibration plans and tracking
├── comparisons/             # Version-to-version comparisons
├── docs/                    # General architecture documentation
├── templates/               # Templates for various documents
└── members.yml              # Architecture review team members
```

## Usage with AI Assistants

This framework is designed to work seamlessly with AI assistants. Each assistant has specialized instructions in the `.coding-assistants` directory.

For general usage instructions, see [USAGE.md](USAGE.md).

### Claude Code

For Claude Code users, see [USAGE-WITH-CLAUDE.md](USAGE-WITH-CLAUDE.md) for detailed instructions. Key capabilities include:

- **Setup & Customization**: "Setup .architecture", "Customize architecture"
- **Reviews**: "Start architecture review for version X.Y.Z" or "Review architecture for 'component'"
- **Specialized Reviews**: "Ask Security Architect to review these code changes"
- **Recalibration**: "Start architecture recalibration for 'feature name'"
- **ADR Creation**: "Create an ADR for 'topic'"

Claude can dynamically create new specialist roles if they don't exist in your `members.yml` file.

### Cursor

For Cursor users, see [USAGE-WITH-CURSOR.md](USAGE-WITH-CURSOR.md) for detailed instructions. Key capabilities include:

- **Architecture Reviews**: "Review this architecture using the AI Software Architect framework"
- **Specialized Reviews**: "Analyze this from a security perspective using AI Software Architect"
- **Documentation Creation**: "Create an ADR for this decision using the AI Software Architect format"

Cursor uses rule files in the `.coding-assistants/cursor` directory to understand the framework.

### Other AI Assistants

Support for other AI assistants like GitHub Copilot, etc. can be added by creating appropriate configuration files in the `.coding-assistants` directory.

## Key Features

### Architectural Wisdom

The framework incorporates wisdom from influential software architects including Martin Fowler, Sandi Metz, Robert C. Martin, Eric Evans, Sarah Mei, and others. These principles are embedded in the architectural documentation.

### Multi-Perspective Reviews

Architecture reviews consider multiple specialized perspectives:
- Systems Architecture
- Domain Expertise
- Security
- Performance
- Maintainability
- AI Engineering
- And dynamically created specialists as needed

### Feature-Based Architecture Management

The framework now supports:
- Version-based reviews and recalibration (e.g., for v2.1.0)
- Feature-based reviews and recalibration (e.g., for "payment processing")
- Component-specific reviews (e.g., for "authentication system")

## License

MIT