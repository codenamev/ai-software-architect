# Installation Guide

This document explains how to integrate the AI Software Architect framework into your project. After installation, refer to [USAGE.md](USAGE.md) for usage instructions.

## Option 1: Clone Repository into Project (Recommended)

This is the simplest approach for adding the framework to your project:

```bash
# Navigate to your project root
cd your-project-root

# Clone the framework repository into a .architecture directory
git clone https://github.com/yourusername/ai-software-architect.git .architecture

# Remove git history (optional)
rm -rf .architecture/.git
```

## Option 2: Copy Selected Files

If you want to select specific parts of the framework:

```bash
# Create the architecture directory structure in your project
mkdir -p .architecture/{decisions/adrs,reviews,recalibration,templates,docs}

# Copy only the files you need from this repository
cp -r path/to/ai-software-architect/.architecture/templates/* your-project/.architecture/templates/
cp path/to/ai-software-architect/.architecture/recalibration_process.md your-project/.architecture/
# ...and so on for other files you want
```

## Option 3: Git Submodule

If you want to track updates to the framework:

```bash
# Add as a submodule
git submodule add https://github.com/yourusername/ai-software-architect.git .architecture

# Initialize and update the submodule
git submodule update --init
```

## Customization

After installation, customize the framework for your project:

1. Edit `.architecture/members.yml` to define your architecture review team
2. Modify templates in `.architecture/templates/` to match your project needs
3. Update principles in `.architecture/principles.md`
4. Create a basic README in your `.architecture` directory to guide team members

## Usage with AI Assistants

This framework is designed to work well with AI assistants. To use it:

1. Introduce the assistant to your architecture process
   - "Please review our architecture process in .architecture/recalibration_process.md"

2. Request architectural help from the assistant
   - "Help me create an ADR for our new authentication system"
   - "Start an architecture review for version 2.0.0"
   - "Begin architecture recalibration based on our latest review"

3. Use the structured templates to guide the assistant's output

For detailed instructions on using specific AI assistants with this framework, see:
- [USAGE-WITH-CLAUDE.md](USAGE-WITH-CLAUDE.md) - For Claude Code users
- [USAGE-WITH-CURSOR.md](USAGE-WITH-CURSOR.md) - For Cursor users

## Integration with Development Workflow

Consider these steps to integrate the framework into your workflow:

1. Add architecture review checkpoints to your release process
2. Create pull request templates that reference architectural principles
3. Configure CI/CD to validate architectural compliance
4. Schedule regular architecture recalibration sessions

## Troubleshooting

- **Git conflicts with framework files**: If you're using Option 1 or 3, you may need to stash your changes before pulling updates
- **Template customization issues**: Create copies of templates before modifying them
- **AI assistant confusion**: Provide clear references to specific files when asking for assistance
