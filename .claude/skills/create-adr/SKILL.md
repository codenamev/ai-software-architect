---
name: create-adr
description: Creates an Architectural Decision Record (ADR) in the AI Software Architect framework. Use when the user requests "Create ADR for [topic]", "Document architectural decision for [topic]", "Write ADR about [topic]", or when they describe an architectural decision that should be documented.
---

# Create Architectural Decision Record (ADR)

Creates structured ADRs following the framework's template.

## Process

### 1. Gather Context
Ask if needed:
- What decision is being made?
- What problem does it solve?
- What alternatives were considered?
- What are the trade-offs?

### 2. Generate ADR Number
```bash
# Find highest ADR number
ls .architecture/decisions/adrs/ | grep -E "^ADR-[0-9]+" | sed 's/ADR-//' | sed 's/-.*//' | sort -n | tail -1
```
New ADR = next sequential number (e.g., if highest is 003, create 004)

### 3. Create Filename
Format: `ADR-XXX-kebab-case-title.md`

Examples:
- `ADR-001-use-react-for-frontend.md`
- `ADR-002-choose-postgresql-database.md`

### 4. Write ADR
Use this structure:

```markdown
# ADR-XXX: [Title]

**Date**: [YYYY-MM-DD]
**Status**: Proposed | Accepted | Deprecated | Superseded
**Deciders**: [Who made this decision]

## Context
[What's the background? What problem are we solving?]

### Goals
- [Goal 1]
- [Goal 2]

### Constraints
- [Constraint 1]
- [Constraint 2]

## Decision Drivers
- **[Driver 1]**: [Why this matters]
- **[Driver 2]**: [Why this matters]

## Considered Options

### Option 1: [Name]
**Pros**: [Pro 1], [Pro 2]
**Cons**: [Con 1], [Con 2]

### Option 2: [Name]
**Pros**: [Pro 1], [Pro 2]
**Cons**: [Con 1], [Con 2]

## Decision
Chose **Option X** because: [rationale]

## Consequences

### Positive
- [Benefit 1]
- [Benefit 2]

### Negative
- [Trade-off 1 and mitigation]
- [Trade-off 2 and mitigation]

## Implementation
1. [Step 1]
2. [Step 2]

**Timeline**: [Estimated timeframe]
**Risks**: [Key risks and mitigations]

## Validation
**Success Criteria**:
- [How we'll know this was right]

**Review**: [When to review this decision]

## References
- [Related ADR-XXX]
- [External resources]
```

### 5. Save ADR
Write to: `.architecture/decisions/adrs/ADR-XXX-title.md`

### 6. Report to User
```
Created ADR-XXX: [Title]

Location: .architecture/decisions/adrs/ADR-XXX-title.md
Status: [Status]

Key Points:
- Decision: [Summary]
- Main benefit: [Key benefit]
- Main trade-off: [Key trade-off]

Next Steps:
- [Immediate action 1]
- [Immediate action 2]
```

## When to Create ADRs
**Do create for**:
- Technology choices (frameworks, databases, languages)
- Architectural patterns (microservices, event-driven, etc.)
- Infrastructure decisions (cloud provider, deployment)
- Security approaches (authentication, encryption)

**Don't create for**:
- Implementation details (function names, variable names)
- Temporary decisions
- Minor decisions with limited impact

## Status Lifecycle
- **Proposed**: Documented but not approved
- **Accepted**: Approved and should be implemented
- **Deprecated**: No longer best practice
- **Superseded**: Replaced by newer ADR (reference it)

## Notes
- Focus on "why" more than "what"
- Be honest about trade-offs
- Keep it concise but complete
- ADRs can be updated as new information emerges
