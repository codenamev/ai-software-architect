---
name: setup-architect
description: Sets up and installs the AI Software Architect framework in a NEW project for the FIRST time. Use when the user requests "Setup .architecture", "Setup ai-software-architect", "Initialize architecture framework", "Install software architect", or similar setup/installation phrases. Do NOT use for checking status (use architecture-status), creating documents (use create-adr or reviews), or when framework is already set up.
allowed-tools: Read,Write,Edit,Glob,Grep,Bash
---

# Setup AI Software Architect Framework

Sets up and customizes the AI Software Architect framework for a project.

## Overview

This skill performs a complete framework installation:
1. Analyzes project (languages, frameworks, structure, patterns)
2. Installs framework skeleton via deterministic script (templates, directories, config)
3. Creates team members based on detected tech stack
4. Creates architectural principles based on detected frameworks
5. Updates CLAUDE.md integration
6. Performs initial system analysis
7. Reports customizations and findings

**Customization guide**: [references/customization-guide.md](references/customization-guide.md)
**Troubleshooting**: [references/installation-procedures.md](references/installation-procedures.md)

## High-Level Workflow

### 1. Analyze Project

Identify project characteristics before installation:
- **Languages**: JavaScript/TypeScript, Python, Ruby, Java, Go, Rust
- **Frameworks**: React, Vue, Django, Rails, Spring, etc.
- **Infrastructure**: Testing setup, CI/CD, package managers
- **Structure**: Directory layout, architectural patterns

Use `Glob` and `Grep` to detect technologies, `Read` to examine configs.

### 2. Install Framework

Run the installation script. The script clones the framework repo to `/tmp`, reads `.install-manifest` to determine what to copy, installs only template files and agent docs, creates empty directories for project content, and initializes config. No manual cloning needed.

```bash
bash "<skill-base-dir>/scripts/install-framework.sh" "$(pwd)"
```

Where `<skill-base-dir>` is this skill's base directory shown at the top of the skill prompt.

The script outputs structured status tokens. If it fails, check stderr for the specific error. See [references/installation-procedures.md § Troubleshooting](references/installation-procedures.md#troubleshooting) for recovery steps.

**What the script installs:**
- `templates/` — ADR, review, config, and other templates
- `agent_docs/` — reference documentation for progressive disclosure (ADR-006)
- Empty directories: `decisions/adrs/`, `reviews/`, `recalibration/`, `comparisons/`
- `config.yml` — initialized from `templates/config.yml` (only if not already present)

**What the script does NOT install** (created by later steps):
- `members.yml` — created in step 3
- `principles.md` — created in step 4
- `reviews/initial-system-analysis.md` — created in step 6

### 3. Create Architecture Team

Create `.architecture/members.yml` from scratch based on the project analysis from step 1. This file does not exist yet — the install script does not copy one.

Use the format from [assets/member-template.yml](assets/member-template.yml).

**Always include core members**: Systems Architect, Domain Expert, Security, Performance, Maintainability, AI Engineer, Pragmatic Enforcer.

**Add technology-specific members** based on detected stack:
- **JavaScript/TypeScript**: JavaScript Expert, framework specialists (React/Vue/Angular)
- **Python**: Python Expert, framework specialists (Django/Flask/FastAPI)
- **Ruby**: Ruby Expert, Rails Architect
- **Java**: Java Expert, Spring Boot Specialist
- **Go**: Go Expert, Microservices Architect
- **Rust**: Rust Expert, Systems Programmer

**Customization details**: [references/customization-guide.md § Customize Team Members](references/customization-guide.md#customize-architecture-team-members)

### 4. Create Architectural Principles

Create `.architecture/principles.md` from scratch based on the project analysis from step 1. This file does not exist yet — the install script does not copy one.

**Always include universal principles**: simplicity, separation of concerns, testability, security by default.

**Add framework-specific principles** based on detected stack:
- **React**: Component composition, hooks, unidirectional data flow
- **Rails**: Convention over configuration, DRY, RESTful design
- **Django**: Explicit over implicit, reusable apps, use built-ins

**Principle examples**: [references/customization-guide.md § Customize Principles](references/customization-guide.md#customize-architectural-principles)

### 5. Update CLAUDE.md Integration

If `CLAUDE.md` exists in project root, append framework usage section:
- Available commands
- Where to find documentation
- How to invoke skills

**Template**: [references/customization-guide.md § Update CLAUDE.md](references/customization-guide.md#update-claudemd-integration)

### 6. Create Initial System Analysis

Generate comprehensive initial analysis document:
- Each member analyzes system from their perspective
- System overview (stack, structure, patterns)
- Strengths identified
- Concerns raised (with impact levels)
- Recommendations prioritized (Critical/Important/Nice-to-Have)
- Collaborative synthesis of findings

Save to `.architecture/reviews/initial-system-analysis.md`.

**Template**: [assets/initial-analysis-template.md](assets/initial-analysis-template.md)

### 7. Report to User

Provide setup summary:

```
AI Software Architect Framework Setup Complete

Customizations:
- Added [N] technology specialists: [list]
- Customized principles for: [frameworks]
- Configuration: Pragmatic mode [enabled/disabled]

Initial Analysis Highlights:
- Overall assessment: [assessment]
- Top strength: [strength]
- Top concern: [concern]
- Critical recommendation: [recommendation]

Location: .architecture/reviews/initial-system-analysis.md

Next Steps:
- Review initial analysis findings
- "List architecture members" to see customized team
- "Create ADR for [first decision]" to start documenting
- "What's our architecture status?" to verify setup
```

## Error Handling

**Installation script fails**:
```
The installation script exited with an error. Check the error message above.

Common causes:
- Exit 1: Clone failed or bad project path
- Exit 2: File copy failed (check permissions)
- Exit 3: Manifest not found (repo may not support manifest-based installation)
- Exit 4: Installation incomplete (missing files after copy)

For recovery: see references/installation-procedures.md § Troubleshooting
```

**Already set up**:
```
Framework appears to be already set up.

To verify: "What's our architecture status?"
To reconfigure: Manually edit .architecture/members.yml and .architecture/principles.md
```

**Unclear project structure**:
```
Could not clearly identify project type. Please describe:
- Primary programming language(s)
- Framework(s) used
- Project purpose

I'll customize the framework accordingly.
```

## Related Skills

**After Setup**:
- `list-members` - View customized team
- `architecture-status` - Verify setup completion
- `create-adr` - Document first decision

**Initial Work**:
- Review `initial-system-analysis.md` findings
- `specialist-review` - Deep-dive on specific concerns
- `create-adr` - Document existing key decisions

**Workflow Example**:
Setup → Review initial analysis → Create ADRs → Status check → Regular reviews

## Notes

- Customize based on **actual** project, not every possible option
- Be specific about **why** each customization was made
- Initial analysis should be thorough but focused on actionable findings
- The installation script handles all file operations — do not manually run cp/mkdir/rm commands

## Documentation

- **Troubleshooting & recovery**: [references/installation-procedures.md](references/installation-procedures.md)
- **Customization guide**: [references/customization-guide.md](references/customization-guide.md)
- **Initial analysis template**: [assets/initial-analysis-template.md](assets/initial-analysis-template.md)
- **Member template**: [assets/member-template.yml](assets/member-template.yml)
- **Common patterns**: [../_patterns.md](../_patterns.md)
