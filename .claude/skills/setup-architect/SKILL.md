---
name: setup-architect
description: Sets up the AI Software Architect framework in a project. Use when the user requests "Setup .architecture", "Setup ai-software-architect", "Setup software architect", "Setup architect", "Setup architecture", or similar phrases. This skill analyzes the project, customizes the framework, and creates an initial architectural analysis.
---

# Setup AI Software Architect Framework

Sets up and customizes the AI Software Architect framework for a project.

## Process

### 1. Verify Prerequisites
- Check `.architecture/.architecture/` exists (cloned framework)
- Confirm we're in project root

### 2. Analyze Project
Identify:
- Primary languages (JavaScript/TypeScript, Python, Ruby, Java, Go, Rust)
- Frameworks (React, Vue, Django, Rails, Spring, etc.)
- Testing setup, CI/CD, package managers
- Project structure and patterns

### 3. Install Framework
```bash
cp -r .architecture/.architecture/* .architecture/
rm -rf .architecture/.architecture
mkdir -p .coding-assistants/{claude,cursor,codex}
mkdir -p .architecture/decisions/adrs
mkdir -p .architecture/{reviews,recalibration,comparisons}
```

### 4. Customize Members
Update `.architecture/members.yml` with specialists for detected tech stack:
- **JavaScript/TypeScript**: JavaScript Expert, React/Vue/Angular Specialist, Node.js Expert
- **Python**: Python Expert, Django/Flask/FastAPI Specialist
- **Ruby**: Ruby Expert, Rails Architect
- **Java**: Java Expert, Spring Boot Specialist
- **Go**: Go Expert, Microservices Architect
- **Rust**: Rust Expert, Systems Programmer

Use this format:
```yaml
- id: javascript_expert
  name: "Alex Rivera"
  title: "JavaScript Expert"
  specialties: ["Modern JavaScript/TypeScript", "Frontend architecture", "Build tools"]
  disciplines: ["Clean code", "Performance", "Cross-browser compatibility"]
  skillsets: ["ES6+", "Async programming", "Module systems"]
  domains: ["Web applications", "Node.js backends", "Build pipelines"]
  perspective: "Focuses on JavaScript best practices and modern features"
```

### 5. Customize Principles
Add framework-specific principles to `.architecture/principles.md`:
- **React**: Component composition, hooks, props down/events up
- **Rails**: Convention over configuration, DRY, fat models/skinny controllers
- **Django**: Explicit over implicit, reusable apps, use built-in features

### 6. Update CLAUDE.md
Append (don't include setup instructions, only usage):
```markdown
## AI Software Architect Framework

### Commands
- Create ADR: "Create ADR for [decision]"
- Architecture Review: "Start architecture review for version X.Y.Z"
- Specialist Review: "Ask [role] to review [target]"
- List Members: "List architecture members"
- Status: "What's our architecture status?"

See `.architecture/` for all documentation.
```

### 7. Cleanup
Remove from `.architecture/`:
- Framework's README.md, USAGE*.md, INSTALL.md
- `.git/` directory (**CRITICAL**: Only from .architecture, never project root!)

### 8. Initial Analysis
Create `.architecture/reviews/initial-system-analysis.md`:
- Have each member from members.yml analyze the system from their perspective
- Include: system structure, patterns, strengths, concerns, recommendations
- Add collaborative discussion synthesizing findings
- Prioritize recommendations (Critical/Important/Nice-to-have)

### 9. Report to User
Summarize:
- Customizations made (which specialists added, why)
- Key findings from initial analysis (top 2-3)
- How to use framework with their stack
- Suggested next steps based on analysis

## Error Handling
- No `.architecture/`: Ask user to clone framework first
- Already set up: Inform user
- Unclear project: Ask about architecture

## Notes
- Customize based on actual project, not every possible option
- Keep initial analysis thorough but focused
- Be specific about why each customization was made
