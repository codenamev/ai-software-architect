# Installation Guide

This document explains how to integrate the AI Software Architect framework into your project in just one command.

## Quick Setup (Recommended)

Run this single command from your project root:

```bash
git clone https://github.com/codenamev/ai-software-architect .architecture && echo -e "\n# AI Software Architect Framework\n# Include setup instructions from .architecture/CLAUDE.md\n" >> CLAUDE.md
```

Then start Claude Code and say:

```
Setup architecture
```

Claude will handle everything else automatically!

## What This Does

1. **Clones the framework** into `.architecture/` directory
2. **Updates your CLAUDE.md** to reference the framework setup instructions
3. **Claude handles the rest** when you request setup:
   - Analyzes your project structure and tech stack
   - Customizes the framework for your specific needs
   - Sets up proper directory structure
   - Cleans up template files
   - Configures architecture team roles
   - Provides next steps

## Manual Setup (Alternative)

If you prefer to do this step by step:

1. Clone the repository:
   ```bash
   git clone https://github.com/codenamev/ai-software-architect .architecture
   ```

2. Add framework reference to your CLAUDE.md:
   ```bash
   echo -e "\n# AI Software Architect Framework\n# Include setup instructions from .architecture/CLAUDE.md\n" >> CLAUDE.md
   ```

3. Start Claude Code and say "Setup architecture"

## Git Submodule Option

To track framework updates:

```bash
git submodule add https://github.com/codenamev/ai-software-architect.git .architecture
git submodule update --init
echo -e "\n# AI Software Architect Framework\n# Include setup instructions from .architecture/CLAUDE.md\n" >> CLAUDE.md
```

## Next Steps

After setup, you can immediately start using the framework:

- **Create architecture decisions**: "Help me create an ADR for our new authentication system"
- **Start architecture reviews**: "Start an architecture review for version 2.0.0"  
- **Get specialist opinions**: "Ask Security Architect to review this API design"

For detailed usage instructions, see [USAGE.md](USAGE.md) or your project-specific documentation that Claude created during setup.
