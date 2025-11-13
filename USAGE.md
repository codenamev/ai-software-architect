# Usage Guide

This document explains how to use the AI Software Architect framework in your project. For installation instructions, see [INSTALL.md](INSTALL.md). For AI assistant-specific guides, see [USAGE-WITH-CLAUDE.md](USAGE-WITH-CLAUDE.md) and [USAGE-WITH-CURSOR.md](USAGE-WITH-CURSOR.md).

## Architecture Process Overview

The framework implements a structured architecture process with three main phases:

1. **Architecture Documentation** - Documenting decisions and principles
2. **Architecture Review** - Evaluating architecture from multiple perspectives
3. **Architecture Recalibration** - Translating review findings into action

## Getting Started

### 1. Document Architectural Principles

Begin by customizing the architectural principles document:

```bash
# Edit the principles document
nano .architecture/principles.md
```

These principles will guide all future architectural decisions and reviews.

### 2. Document Architectural Decisions

Use Architectural Decision Records (ADRs) to document significant design decisions:

```bash
# Copy the ADR template
cp .architecture/templates/adr-template.md .architecture/decisions/adrs/ADR-001-your-decision-name.md

# Edit the new ADR
nano .architecture/decisions/adrs/ADR-001-your-decision-name.md
```

### 3. Conduct Architecture Reviews

Schedule regular architecture reviews before major versions:

### 4. Plan Recalibration

```
Start architecture recalibration for version X.Y.Z
```

## Working with AI Assistants

This framework is optimized for AI assistant collaboration. For detailed assistant-specific instructions, see:
- [USAGE-WITH-CLAUDE-SKILLS.md](USAGE-WITH-CLAUDE-SKILLS.md) - For Claude Skills (recommended)
- [USAGE-WITH-CLAUDE.md](USAGE-WITH-CLAUDE.md) - For Claude Code (traditional method)
- [USAGE-WITH-CURSOR.md](USAGE-WITH-CURSOR.md) - For Cursor users
- [USAGE-WITH-CODEX.md](USAGE-WITH-CODEX.md) - For GitHub Copilot/Codex users

### Standard Commands

All AI assistants support these standardized commands:

**Setup**:
```
Setup ai-software-architect
```

**Create ADR**:
```
Create ADR for [decision topic]
```

**Architecture Review**:
```
Start architecture review for [version/feature]
```

**Specialist Review**:
```
Ask [Specialist Name] to review [target]
```

**List Members**:
```
List architecture members
```

**Check Status**:
```
What's our architecture status?
```

**Enable Pragmatic Mode** (Optional):
```
Enable pragmatic mode
```

**Recalibration**:
```
Start architecture recalibration for [target]
```

### How Commands Work

**Architecture Review**: "Start architecture review for version 2.0.0"

The AI will:
1. Create a new review document based on the template
2. Adopt personas from members.yml for multiple perspectives
3. Conduct a thorough review from each perspective
4. Synthesize findings into cohesive recommendations

**Recalibration**: "Start architecture recalibration for version 2.0.0"

The AI will:
1. Analyze the review document for actionable findings
2. Create a prioritized recalibration plan
3. Draft necessary ADRs for architectural changes
4. Create an implementation roadmap
5. Set up progress tracking

**Create ADR**: "Create ADR for PostgreSQL database choice"

The AI will:
1. Use the ADR template
2. Document context, decision drivers, and alternatives
3. Outline implementation approach
4. Define validation criteria

## Best Practices

1. **Keep ADRs concise** - Focus on the decision and its rationale, not implementation details
2. **Involve multiple perspectives** - Use the members.yml roles as a checklist for review participation
3. **Update documentation continuously** - Treat architecture docs as living documents
4. **Track architectural debt** - Use the technical debt section in reviews to maintain awareness
5. **Visualize architecture** - Include diagrams in reviews and ADRs
6. **Reference principles** - Always tie decisions back to architectural principles
7. **Monitor progress** - Regularly update progress tracking documents

## Example Workflow

1. **Initial Setup**
   - Customize principles
   - Define architecture review team in members.yml

2. **During Development**
   - Create ADRs for significant decisions
   - Reference ADRs in code comments and PRs

3. **Pre-Release**
   - Conduct architecture review
   - Document findings in review document

4. **Post-Review**
   - Initiate recalibration process
   - Create implementation roadmap
   - Draft new/updated ADRs

5. **Implementation**
   - Track progress against roadmap
   - Update documentation as architecture evolves

6. **Post-Release**
   - Create version comparison document
   - Plan for next cycle

## Advanced Usage

- **Integration with CI/CD** - Add validation of architectural compliance to your pipeline
- **Architecture Visualization** - Integrate with tools like C4 model, PlantUML, or Mermaid
- **Metrics Collection** - Track architectural metrics over time
- **Custom Review Roles** - Add specialized roles to members.yml based on your domain
- **Workshop Templates** - Create templates for architecture workshops in the templates directory
