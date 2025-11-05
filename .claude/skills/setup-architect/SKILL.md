---
name: setup-architect
description: Sets up the AI Software Architect framework in a project. Use when the user requests "Setup .architecture", "Setup ai-software-architect", "Setup software architect", "Setup architect", "Setup architecture", or similar phrases. This skill analyzes the project, customizes the framework, and creates an initial architectural analysis.
---

# Setup AI Software Architect Framework

This skill sets up the AI Software Architect framework in a user's project by analyzing their codebase, customizing templates, and creating an initial architectural analysis.

## When to Use This Skill

Automatically invoke this skill when users request:
- "Setup .architecture"
- "Setup ai-software-architect"
- "Setup software architect"
- "Setup architect"
- "Setup architecture"
- "Customize software architect"
- Any similar phrase indicating they want to set up the architecture framework

## Prerequisites

Before running this skill, ensure:
1. You're in the root directory of the user's project
2. The ai-software-architect framework has been cloned to `.architecture/` (from https://github.com/codenamev/ai-software-architect)
3. The framework files are in `.architecture/.architecture/` (nested structure from cloning)

## Setup Process

Follow these steps in order:

### 1. Detect Setup Context

First, verify the setup environment:
- Check if `.architecture/` directory exists with the cloned framework files
- Verify you're running from the user's project root (not from within .architecture)
- Look for `.architecture/.architecture/` which contains the actual framework files

### 2. Analyze Target Project

Examine the current directory (user's project) to understand their codebase:

**Languages to detect:**
- JavaScript/TypeScript: Look for `package.json`, `.js`, `.ts`, `.jsx`, `.tsx` files
- Python: Look for `requirements.txt`, `pyproject.toml`, `setup.py`, `.py` files
- Ruby: Look for `Gemfile`, `Rakefile`, `.rb` files
- Java: Look for `pom.xml`, `build.gradle`, `.java` files
- Go: Look for `go.mod`, `.go` files
- Rust: Look for `Cargo.toml`, `.rs` files

**Frameworks to detect:**
- JavaScript: React, Vue, Angular, Next.js, Express, Nest.js
- Python: Django, Flask, FastAPI
- Ruby: Rails, Sinatra
- Java: Spring Boot, Quarkus
- Go: Gin, Echo

**Project patterns to identify:**
- Testing frameworks and test directories
- CI/CD configuration (.github/workflows, .gitlab-ci.yml, etc.)
- Package managers (npm, pip, bundler, cargo, etc.)
- Documentation patterns (existing README, docs/ directory)
- Monorepo vs single project structure

### 3. Framework Installation

Move the framework files into place:

```bash
# Move framework files from nested location to .architecture/
cp -r .architecture/.architecture/* .architecture/
rm -rf .architecture/.architecture
```

Create `.coding-assistants/` directory structure:
```bash
mkdir -p .coding-assistants/claude
mkdir -p .coding-assistants/cursor
mkdir -p .coding-assistants/codex
```

### 4. Customize for Project

Based on your project analysis, customize these files:

#### A. Update `.architecture/members.yml`

Add architecture members relevant to the detected technology stack:

**For JavaScript/TypeScript projects:**
- JavaScript Expert
- React Specialist (if React detected)
- Vue Specialist (if Vue detected)
- Node.js Expert (if backend detected)

**For Python projects:**
- Python Expert
- Django Architect (if Django detected)
- FastAPI Specialist (if FastAPI detected)
- Data Engineer (if data science libraries detected)

**For Ruby projects:**
- Ruby Expert
- Rails Architect (if Rails detected)

**For Java projects:**
- Java Expert
- Spring Boot Specialist (if Spring detected)

**For Go projects:**
- Go Expert
- Microservices Architect (if microservices pattern detected)

**For Rust projects:**
- Rust Expert
- Systems Programmer

Format for new members:
```yaml
- id: javascript_expert
  name: "Alex Rivera"
  title: "JavaScript Expert"
  specialties:
    - "Modern JavaScript/TypeScript"
    - "Frontend architecture"
    - "Build tools and bundlers"
  disciplines:
    - "Clean code practices"
    - "Performance optimization"
    - "Cross-browser compatibility"
  skillsets:
    - "ES6+ features"
    - "Async programming"
    - "Module systems"
  domains:
    - "Web applications"
    - "Node.js backends"
    - "Build pipelines"
  perspective: "Focuses on JavaScript best practices, modern language features, and optimal build configurations"
```

#### B. Update `.architecture/principles.md`

Add framework-specific principles based on detected technologies:

**For React projects:**
```markdown
### React-Specific Principles
- Component composition over inheritance
- Keep components focused and single-purpose
- Use hooks for state and side effects
- Props down, events up
```

**For Rails projects:**
```markdown
### Rails-Specific Principles
- Convention over configuration
- DRY (Don't Repeat Yourself)
- Fat models, skinny controllers
- RESTful design by default
```

**For Django projects:**
```markdown
### Django-Specific Principles
- Explicit is better than implicit
- Apps should be reusable
- Keep business logic in models
- Use Django's built-in features before custom solutions
```

#### C. Create Initial Directory Structure

Set up the architecture directories:
```bash
mkdir -p .architecture/decisions/adrs
mkdir -p .architecture/reviews
mkdir -p .architecture/recalibration
mkdir -p .architecture/comparisons
```

#### D. Update User's CLAUDE.md

**IMPORTANT**: Only append framework usage instructions to CLAUDE.md, NOT the setup instructions.

Append this section to the user's `CLAUDE.md`:

```markdown
## AI Software Architect Framework

This project uses the AI Software Architect framework for architecture documentation and decision-making.

### Framework Structure

- `.architecture/decisions/` - Architectural Decision Records (ADRs)
- `.architecture/reviews/` - Architecture review documents
- `.architecture/recalibration/` - Post-review action plans
- `.architecture/members.yml` - Architecture team definitions
- `.architecture/principles.md` - Architectural principles

### Key Commands

**Create ADR**: "Create ADR for [decision title]"
**Architecture Review**: "Start architecture review for version X.Y.Z" or "Start architecture review for [feature name]"
**Specialist Review**: "Ask [role] to review [target]" (e.g., "Ask Security Architect to review authentication flow")
**List Members**: "List architecture members" or "Who's on the architecture team?"
**Architecture Status**: "What's our architecture status?" or "Show architecture documentation"

### Usage

Reference `.architecture/decisions/ArchitectureConsiderations.md` when making architectural decisions.

For more details, see `.architecture/` directory.
```

### 5. Cleanup & Finalize

Remove template repository files (these are for the framework repo, not the user's project):
- `README.md` (from .architecture, if it's the framework's README)
- `USAGE*.md` files from .architecture
- `INSTALL.md` from .architecture

**CRITICAL**: Remove `.architecture/.git/` directory specifically:
```bash
rm -rf .architecture/.git
```

Never touch the project root `.git` directory!

Remove any other temporary files from the framework installation.

### 6. Collaborative Architectural Analysis

This is the most important step - creating an initial analysis of the user's system.

Conduct a comprehensive analysis from multiple architectural perspectives:

1. **Adopt Multiple Roles**: Use all members defined in `.architecture/members.yml`
2. **Analyze from Each Perspective**: Each member should examine:
   - System structure and organization
   - Design patterns in use
   - Technology choices and their implications
   - Architectural strengths
   - Areas for improvement
   - Technical debt
   - Recommendations

3. **Create Analysis Document**: Write `.architecture/reviews/initial-system-analysis.md`

Use this structure:

```markdown
# Initial System Analysis

**Date**: [Current Date]
**Project**: [Project Name]
**Version**: [Current Version or "Initial"]

## Executive Summary

[2-3 paragraph overview of the system and key findings]

## Project Overview

**Primary Languages**: [Detected languages]
**Frameworks**: [Detected frameworks]
**Project Type**: [web app, API, CLI tool, library, etc.]
**Scale**: [small/medium/large - based on file count, complexity]

## Individual Member Reviews

### [Member 1 Name] - [Member 1 Title]

**Perspective**: [Their perspective from members.yml]

#### Findings
- [Key finding 1]
- [Key finding 2]
- [Key finding 3]

#### Strengths
- [Strength 1]
- [Strength 2]

#### Areas for Improvement
- [Improvement 1]
- [Improvement 2]

#### Recommendations
- [Recommendation 1]
- [Recommendation 2]

[Repeat for each member in members.yml]

## Collaborative Discussion

[Synthesized discussion between members, highlighting:
- Points of agreement
- Different perspectives on the same issues
- Prioritization of concerns
- Recommended focus areas]

## Consolidated Recommendations

### Priority 1: Critical Items
1. [Critical recommendation 1]
2. [Critical recommendation 2]

### Priority 2: Important Items
1. [Important recommendation 1]
2. [Important recommendation 2]

### Priority 3: Nice-to-Have Items
1. [Nice-to-have recommendation 1]
2. [Nice-to-have recommendation 2]

## Technical Debt Assessment

[Assessment of existing technical debt, including:
- Areas of concern
- Estimated impact
- Suggested remediation timeline]

## Next Steps

1. [Immediate next step 1]
2. [Immediate next step 2]
3. [Longer-term next step 1]

## Conclusion

[Final summary paragraph bringing together all perspectives]
```

### 7. Guide Next Steps

After setup, provide the user with:

1. **Summary of customizations made** and why (based on their tech stack)
2. **Key findings from initial analysis** (2-3 most important points)
3. **How to use the framework** with their specific project:
   - Example: "To document your authentication decision, say: 'Create ADR for JWT authentication strategy'"
   - Example: "To get a security review of your API, say: 'Ask Security Specialist to review the API authentication flow'"
4. **Suggested immediate next steps** based on the analysis:
   - If technical debt was found: "Consider creating ADRs for the database schema decisions"
   - If security concerns found: "Request a Security Specialist review of the authentication system"
   - If performance concerns: "Consider a Performance Specialist review of the critical paths"

## Example Interaction

**User**: "Setup ai-software-architect"

**You**:
1. Analyze their codebase (find it's a React + Express app with TypeScript)
2. Move framework files to `.architecture/`
3. Add JavaScript Expert, React Specialist, and Node.js Expert to members.yml
4. Add React and Node.js specific principles
5. Update their CLAUDE.md with usage instructions
6. Remove template files and .architecture/.git
7. Conduct analysis from all 9 members (original 6 + 3 new specialists)
8. Create comprehensive initial-system-analysis.md
9. Report back:

"I've set up the AI Software Architect framework for your React + Express TypeScript project.

**Customizations Made:**
- Added JavaScript Expert, React Specialist, and Node.js Expert to the architecture team
- Added React and Node.js specific principles to the architectural guidance
- Created initial directory structure for ADRs and reviews

**Key Findings from Initial Analysis:**
- Your component structure follows good separation of concerns
- API authentication could benefit from more structured error handling
- Performance optimization opportunities in the data fetching layer

**Next Steps:**
1. Document your API design decisions: 'Create ADR for REST API structure'
2. Get a detailed security review: 'Ask Security Specialist to review authentication flow'
3. Address performance concerns: 'Ask Performance Specialist to review data fetching'

**Using the Framework:**
- To create architectural decisions: 'Create ADR for [topic]'
- To get specialist reviews: 'Ask [specialist] to review [component]'
- To start a full review: 'Start architecture review for version 1.0.0'

See `.architecture/reviews/initial-system-analysis.md` for the complete analysis."

## Error Handling

If you encounter issues:
- **No .architecture directory found**: Ask the user to clone the framework first: `git clone https://github.com/codenamev/ai-software-architect .architecture`
- **Already set up**: Check if framework is already installed and inform user
- **Permission errors**: Explain the issue and suggest running with appropriate permissions
- **Unclear project structure**: Ask the user about their project's architecture
- **Never proceed with potentially destructive actions**: Always confirm with user if unsure

## Notes

- Focus on customization based on actual project characteristics
- Make the initial analysis thorough but actionable
- Ensure all members in members.yml participate in the analysis
- Keep the user informed of what you're doing at each step
- Be specific about why you made each customization
