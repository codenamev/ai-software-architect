# Setup Verification Testing Guide

This document provides testing procedures to verify that each coding assistant can successfully set up and configure the AI Software Architect framework.

## Testing Overview

Each assistant should be able to:
1. Recognize setup commands
2. Execute the 6-step setup process
3. Customize configuration for the target project
4. Provide appropriate next steps guidance

## Claude Code Testing

### Setup Recognition Test
```
Command: "Setup architecture using: https://github.com/codenamev/ai-software-architect"
Expected: Claude recognizes setup request and begins 6-step process
```

### Configuration Test
```
Prerequisites: Empty project directory with package.json (Node.js project)
Command: "Setup .architecture"
Expected: 
- Framework installed to .architecture/
- .coding-assistants/claude/ created
- CLAUDE.md updated with framework content
- members.yml customized for Node.js stack
```

### Customization Test
```
Prerequisites: Rails project (Gemfile present)
Command: "Customize architecture"
Expected:
- Rails-specific members added to members.yml
- Principles updated for Rails conventions
- Ruby/Rails examples in guidance
```

## Cursor Testing

### Rule File Test
```
Prerequisites: Project with .coding-assistants/cursor/ directory
Expected Files:
- ai_software_architect_overview.mdc ✓
- ai_software_architect_setup.mdc ✓
- ai_software_architect_usage.mdc ✓
- ai_software_architect_structure.mdc ✓
- ai_software_architect_reviews.mdc ✓
```

### Setup Recognition Test
```
Command: "Setup ai-software-architect"
Expected: Cursor recognizes command via ai_software_architect_setup.mdc
```

### Rule Integration Test
```
Prerequisites: Cursor with Rules enabled
Test: Open architecture files
Expected: Appropriate rules auto-apply based on globs patterns
```

## GitHub Copilot/Codex Testing

### Context Recognition Test
```
Prerequisites: Project with .architecture/ directory containing ADRs
Command: "Review this architecture"
Expected: Copilot references existing ADRs and provides contextual analysis
```

### Setup Command Test
```
Command: "Setup architecture using: https://github.com/codenamev/ai-software-architect"
Expected: Copilot follows setup-instructions.md process
```

### Natural Language Test
```
Command: "Create an ADR for our database choice"
Expected: Copilot generates ADR following framework templates
```

## Cross-Assistant Compatibility

### Shared Architecture Test
```
Setup: Configure framework with Claude Code
Test: Use Cursor to review .architecture/ files
Expected: Cursor understands and works with Claude-configured architecture
```

### Documentation Consistency Test
```
Setup: Create ADR with one assistant
Test: Reference ADR with different assistant
Expected: All assistants understand and reference the same architectural decisions
```

## Technology-Specific Testing

### Rails Project Test
```
Prerequisites: Rails project (Gemfile with rails gem)
Command: "Setup architecture"
Expected Customizations:
- Rails Architect role in members.yml
- Ruby Expert role in members.yml
- Rails-specific principles
- ActiveRecord and database architecture focus
```

### Node.js Project Test
```
Prerequisites: Node.js project (package.json present)
Command: "Setup architecture"
Expected Customizations:
- Frontend/Backend Architect roles
- JavaScript/TypeScript expertise
- Modern JS framework considerations
```

## Verification Checklist

### Framework Installation ✓
- [ ] .architecture/ directory created
- [ ] Framework files moved from nested structure
- [ ] .git directory removed from framework
- [ ] Template files cleaned up

### Configuration Files ✓
- [ ] members.yml customized for technology stack
- [ ] principles.md updated for project type
- [ ] Templates directory populated
- [ ] Initial ADR structure created

### Assistant Integration ✓
- [ ] Claude: CLAUDE.md updated with framework content
- [ ] Cursor: .mdc rule files properly configured
- [ ] Codex: setup-instructions.md accessible

### Command Recognition ✓
- [ ] Setup commands recognized
- [ ] Architecture review commands work
- [ ] ADR creation commands function
- [ ] Specialized review commands operational

## Common Issues

### Claude Code Issues
- **Missing CLAUDE.md content**: Framework content not appended to user's CLAUDE.md
- **Incomplete cleanup**: Template files still present after setup

### Cursor Issues  
- **Rule files not found**: .mdc files not in expected location
- **Glob patterns not matching**: Rules not applying to intended files

### Codex Issues
- **Context not available**: Architecture files not accessible to Copilot
- **Commands not recognized**: Natural language patterns not working

## Success Criteria

Each assistant should achieve:
1. **100% Setup Success Rate**: Setup commands consistently work
2. **Technology Detection**: Correctly identifies and customizes for project stack
3. **Command Recognition**: All documented commands function as expected
4. **Cross-Compatibility**: Works with architecture configured by other assistants
5. **Documentation Quality**: Generated content follows framework standards