# Templates Directory

This directory contains setup templates that AI assistants use during the automated framework installation process to configure user projects.

## Purpose

Templates provide:
- **Content to append** to user project configuration files
- **Setup guidance** for each AI assistant integration
- **Customization instructions** for different technology stacks
- **User onboarding content** after framework installation

## Available Templates

### `claude-project-setup.md`
Template for Claude Code integration containing:
- **CLAUDE.md content** to append to user's project CLAUDE.md file
- **Framework command examples** tailored to detected technology stack
- **Customization guidelines** for project-specific adaptation
- **Technology-specific examples** (Web, Mobile, Backend services)

### `cursor-project-setup.md`  
Template for Cursor integration containing:
- **Rule file organization** guidance for proper Cursor setup
- **Project configuration** for Cursor Rules integration
- **User guidance template** to provide after setup completion
- **Technology-specific customization** examples

### `codex-project-setup.md`
Template for GitHub Copilot/Codex integration containing:
- **Context integration** setup for natural language recognition
- **User guidance template** explaining Copilot's framework integration
- **Natural language command examples** by technology stack
- **Integration notes** for context-based operation

## Template Usage

### During Framework Setup
AI assistants use these templates to:
1. **Generate user-specific content** based on detected technology stack
2. **Append framework instructions** to existing project configuration
3. **Customize examples and commands** for the project's technology
4. **Provide appropriate next steps** for the user

### Template Structure

Each template includes:
- **Template Content**: Markdown content to append or create
- **Customization Guidelines**: How to adapt content for specific projects  
- **Technology Examples**: Sections for different technology stacks
- **Integration Notes**: Special instructions for proper setup

## Relationship to Other Directories

### vs Assistant Directories (`claude/`, `cursor/`, `codex/`)
- **Assistant directories**: Contain the actual configuration files used by each AI assistant
- **Templates directory**: Contains setup automation content for user project integration

### vs Examples Directory
- **Templates**: Content used during automated setup for user projects
- **Examples**: Reference material showing complete configuration examples

### vs Testing Directory
- **Templates**: Active content used in setup automation
- **Testing**: Verification procedures to ensure templates work correctly

## Template Customization

Templates adapt content based on:
- **Detected technology stack** (Rails, Node.js, Python, etc.)
- **Project structure** (web app, mobile app, backend service, etc.)
- **Existing configuration** (package.json, Gemfile, requirements.txt, etc.)
- **Architecture patterns** (MVC, microservices, monolith, etc.)

## Technology-Specific Adaptation

Templates include conditional sections for:
- **Web Applications**: React, Vue, Angular examples
- **Backend Services**: API design, database architecture, microservices
- **Mobile Applications**: iOS, Android, cross-platform patterns
- **Data Applications**: ETL, analytics, machine learning architectures

## User Experience

After setup completion, users receive:
- **Clear framework command documentation** tailored to their technology
- **Relevant examples** for their specific project type
- **Next steps guidance** for immediate framework usage
- **Integration instructions** specific to their AI assistant