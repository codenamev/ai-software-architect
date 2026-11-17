# Agent Workflows - Detailed Procedures

This document provides step-by-step procedures for common AI Software Architect framework workflows.

**👉 For framework overview, see [../../AGENTS.md](../../AGENTS.md)**

---

## Table of Contents

- [Setup Procedures](#setup-procedures)
- [Update Procedures](#update-procedures)
- [Architecture Review Workflows](#architecture-review-workflows)
- [ADR Creation Workflow](#adr-creation-workflow)
- [Implementation with Methodology](#implementation-with-methodology)

---

## Setup Procedures

### Installing in Your Project

The AI Software Architect framework can be installed using three methods:

#### Option 1: Claude Skills (Recommended for Claude Code)

```bash
# Install as reusable skills
git clone https://github.com/codenamev/ai-software-architect /tmp/ai-architect-$$
cp -r /tmp/ai-architect-$$/.claude/skills ~/.claude/
```

Then in any project with Claude Code:
```
Setup ai-software-architect
```

#### Option 2: Direct Clone (For any AI assistant)

```bash
# In your project root
git clone https://github.com/codenamev/ai-software-architect .architecture
```

Then ask your AI assistant:
```
Setup software architect
```

#### Option 3: MCP Server (For MCP-compatible assistants)

```bash
# Install globally
npm install -g ai-software-architect

# Or add to claude_desktop_config.json
{
  "mcpServers": {
    "ai-software-architect": {
      "command": "npx",
      "args": ["ai-software-architect"]
    }
  }
}
```

### What Happens During Setup

When you request setup, the AI assistant will:

1. **Analyze Your Project**
   - Identify primary programming languages
   - Detect frameworks and architectural patterns
   - Examine existing documentation
   - Understand project structure

2. **Customize Templates**
   - Create `AGENTS.md` with your project specifics
   - Populate technology stack information
   - Configure build and test commands
   - Set up project conventions

3. **Create Directory Structure**
   ```
   .architecture/
   ├── decisions/adrs/    # Architecture Decision Records
   ├── reviews/          # Architecture reviews
   ├── recalibration/   # Recalibration plans
   ├── members.yml      # Team member definitions
   ├── principles.md    # Architectural principles
   └── config.yml       # Framework configuration
   ```

4. **Initial Analysis**
   - Conduct comprehensive architectural analysis
   - Multiple perspective review from architecture team
   - Document findings in initial system analysis
   - Provide recommendations for next steps

---

## Update Procedures

### Updating Framework Installation

To update an existing installation to the latest version:

#### For Claude Skills

```bash
# Backup old versions first
mkdir -p ~/.ai-architect-backups/skills-$(date +%Y%m%d-%H%M%S)
cd ~/.claude/skills
mv setup-architect architecture-review create-adr list-members architecture-status specialist-review ~/.ai-architect-backups/skills-$(date +%Y%m%d-%H%M%S)/ 2>/dev/null || true

# Install from latest
git clone https://github.com/codenamev/ai-software-architect /tmp/ai-architect-$$
cp -r /tmp/ai-architect-$$/.claude/skills/* ./

echo "Backup created at ~/.ai-architect-backups/skills-TIMESTAMP/"
```

#### For Direct Clone

Ask your AI assistant:
```
Update the software architect framework from main branch
```

Or manually:
```bash
cd .architecture
git fetch origin main
git reset --hard origin/main
```

### What Gets Updated

**Updated Files:**
- `.architecture/templates/` (all templates)
- `.architecture/principles.md` (if not customized)
- Framework helper scripts
- Base configuration files

**Preserved Files:**
- `.architecture/decisions/adrs/` (your ADRs)
- `.architecture/reviews/` (your reviews)
- `.architecture/recalibration/` (your plans)
- `.architecture/members.yml` (if customized)
- `.architecture/config.yml` (your settings)

---

## Architecture Review Workflows

### Requesting a Full Architecture Review

**Command Pattern:**
```
Start architecture review for version X.Y.Z
Start architecture review for [feature name]
```

**Process:**

1. **Individual Review Phase**
   - Each architecture member reviews independently
   - Focus on their area of expertise
   - Document findings from their perspective

2. **Collaborative Discussion Phase**
   - Members discuss findings
   - Resolve conflicting perspectives
   - Prioritize recommendations
   - Identify trade-offs

3. **Final Report Phase**
   - Produce comprehensive review document
   - Balance all perspectives
   - Provide actionable recommendations
   - Document in `.architecture/reviews/`

### Requesting a Specialist Review

**Command Pattern:**
```
Ask [Specialist] to review [component]
Have [Role] review [code/design]
Get [Expert]'s opinion on [topic]
```

**Example:**
```
Ask Security Specialist to review authentication flow
Have Performance Specialist review database schema
```

**Process:**
1. AI adopts the specialist's persona
2. Reviews from that specific perspective
3. Provides focused recommendations
4. Documents in `.architecture/reviews/[role]-[topic].md`

---

## ADR Creation Workflow

### Creating an Architectural Decision Record

**Command Pattern:**
```
Create ADR for [topic]
Document architectural decision for [topic]
```

**Template Structure:**

```markdown
# ADR-###: [Title]

## Status
[Draft | Proposed | Accepted | Deprecated | Superseded]

## Context
[Problem statement, background, constraints]

## Decision
[The decision that was made]

## Consequences
### Positive
### Negative
### Neutral

## Alternatives Considered
[Alternative approaches and why they were rejected]
```

**Best Practices:**

1. **Write ADRs Early**: Document decisions as you make them, not after
2. **Be Specific**: Clear, precise language about what's changing
3. **Include Context**: Future readers need to understand why
4. **Document Alternatives**: Show you considered other approaches
5. **Update Status**: Mark as Accepted when implemented. When a new ADR replaces an old one, link both ways in frontmatter: the new ADR gets `supersedes: ADR-NNN`, the old one gets `status: superseded` and `superseded-by: ADR-new`. Do both in the same change; `validate-adr` fails a one-sided link. The MCP `create_adr` tool does this for you when you pass `supersedes`.

---

## Implementation with Methodology

### Configuring Implementation Guidance

To have AI assistants automatically apply your development methodology during implementation, configure the `implementation` section in `.architecture/config.yml`:

```yaml
implementation:
  enabled: true
  methodology: "TDD"  # or BDD, DDD, Test-Last, Exploratory

  influences:
    - "Kent Beck - TDD by Example"
    - "Sandi Metz - POODR"
    - "Martin Fowler - Refactoring"

  languages:
    ruby:
      style_guide: "Rubocop"
      idioms: "Blocks over loops, meaningful names"

  testing:
    framework: "RSpec"
    style: "BDD"
    coverage_target: 90

  quality:
    definition_of_done:
      - "Tests passing"
      - "Code refactored"
      - "Documentation updated"
```

### Using Implementation Command

**Command Pattern:**
```
Implement [feature] as the architects
Implement [feature] as [specific architect]
```

**What Happens:**

1. AI reads implementation config from `.architecture/config.yml`
2. Applies configured methodology (e.g., TDD)
3. Follows influences (e.g., Kent Beck, Sandi Metz)
4. Uses language-specific idioms and style guides
5. Ensures quality standards met

**Example with TDD:**
```
"Implement user authentication as the architects"
```

AI will:
1. Write test first (RED phase)
2. Write minimal code to pass (GREEN phase)
3. Refactor for clarity (REFACTOR phase)
4. Apply Sandi Metz principles (small methods, clear names)
5. Follow configured style guide
6. Repeat cycle for each aspect

### Methodology Details

#### TDD (Test-Driven Development)
- Write test first (RED)
- Write minimal code to pass (GREEN)
- Refactor for clarity (REFACTOR)
- Repeat cycle
- Inspiration: Kent Beck's "TDD by Example"

#### BDD (Behavior-Driven Development)
- Write behavior-focused tests
- Outside-in development
- Describe expected behavior before implementation
- Use Given-When-Then format

#### DDD (Domain-Driven Design)
- Focus on domain modeling
- Use ubiquitous language
- Define bounded contexts
- Model business concepts accurately

#### Test-Last
- Implement feature first
- Write tests after
- Ensure coverage meets targets

#### Exploratory
- Experiment with approaches
- Iterate and learn
- Codify successful patterns
- Refactor as understanding grows

---

## Troubleshooting Common Issues

### Setup Issues

**Issue**: Framework files not created
- **Solution**: Ensure you're in project root, not inside `.architecture/`

**Issue**: Templates not customized
- **Solution**: AI needs to analyze project first - ensure project files present

### Review Issues

**Issue**: Review doesn't include all members
- **Solution**: Check `.architecture/members.yml` and `.architecture/config.yml`

**Issue**: Pragmatic Enforcer too aggressive/lenient
- **Solution**: Adjust `pragmatic_mode.intensity` in `.architecture/config.yml`

### Implementation Issues

**Issue**: Methodology not applied
- **Solution**: Ensure `implementation.enabled: true` in `.architecture/config.yml`

**Issue**: Wrong style guide used
- **Solution**: Check `implementation.languages` section for your language

---

## Next Steps

After completing workflows, consider:

1. **Conduct Regular Reviews**: Schedule reviews for major versions or features
2. **Document Decisions**: Create ADRs for significant architectural choices
3. **Enable Pragmatic Mode**: Keep complexity in check
4. **Customize Configuration**: Tailor framework to your needs
5. **Share with Team**: Ensure all team members understand the framework

**For more information, see:**
- [AGENTS.md](../../AGENTS.md) - Framework overview
- [.architecture/principles.md](../principles.md) - Architectural principles
- [.architecture/members.yml](../members.yml) - Team members
- [.architecture/config.yml](../config.yml) - Configuration
