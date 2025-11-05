---
name: create-adr
description: Creates an Architectural Decision Record (ADR) in the AI Software Architect framework. Use when the user requests "Create ADR for [topic]", "Document architectural decision for [topic]", "Write ADR about [topic]", or when they describe an architectural decision that should be documented.
---

# Create Architectural Decision Record (ADR)

This skill creates well-structured Architectural Decision Records (ADRs) following the AI Software Architect framework's template and best practices.

## When to Use This Skill

Automatically invoke this skill when users request:
- "Create ADR for [topic]"
- "Document architectural decision for [topic]"
- "Write ADR about [topic]"
- "Add architectural decision record for [topic]"
- When a significant architectural decision has been made that should be documented
- When architectural discussions conclude and need formal documentation

## Prerequisites

- The AI Software Architect framework must be set up in the project (`.architecture/` directory exists)
- You should be in the project root directory

## ADR Creation Process

### 1. Understand the Decision Context

Before creating the ADR, gather information about:

**The Decision Topic:**
- What architectural decision is being made?
- What problem does it solve?
- What is the scope and impact?

**Key Questions to Consider:**
- What prompted this decision?
- What alternatives were considered?
- What are the trade-offs?
- What are the consequences (positive and negative)?
- How will this be implemented?
- How will we validate this decision?

If the user hasn't provided enough context, ask clarifying questions before proceeding.

### 2. Generate ADR Number

Determine the next ADR number:

```bash
# Find the highest ADR number
ls .architecture/decisions/adrs/ | grep -E "^ADR-[0-9]+" | sed 's/ADR-//' | sed 's/-.*//' | sort -n | tail -1
```

The new ADR number should be the next sequential number (e.g., if highest is 003, create 004).

### 3. Create Filename

Format: `ADR-XXX-kebab-case-title.md`

Examples:
- `ADR-001-use-react-for-frontend.md`
- `ADR-002-adopt-microservices-architecture.md`
- `ADR-003-choose-postgresql-for-database.md`

### 4. Write the ADR

Use the template from `.architecture/templates/adr.md` as a guide.

**ADR Structure:**

```markdown
# ADR-XXX: [Title in Title Case]

**Date**: [Current Date - YYYY-MM-DD]
**Status**: [Proposed | Accepted | Deprecated | Superseded]
**Deciders**: [List of people/roles involved in the decision]
**Technical Story**: [Link to related issue/ticket if applicable]

## Context

[Describe the context and problem statement. What is the background? What forces are at play? What constraints exist?]

### Problem Statement

[Clear, concise statement of the problem being addressed]

### Goals

- [Goal 1]
- [Goal 2]
- [Goal 3]

### Constraints

- [Constraint 1]
- [Constraint 2]

## Decision Drivers

[List the key factors that influenced this decision]

- **[Driver 1 Name]**: [Description]
- **[Driver 2 Name]**: [Description]
- **[Driver 3 Name]**: [Description]

## Considered Options

### Option 1: [Option Name]

**Description**: [What is this option?]

**Pros:**
- [Pro 1]
- [Pro 2]

**Cons:**
- [Con 1]
- [Con 2]

**Trade-offs:**
- [Trade-off consideration]

### Option 2: [Option Name]

[Same structure as Option 1]

### Option 3: [Option Name]

[Same structure as Option 1]

## Decision

**Chosen Option**: [Option X: Name]

[Explain why this option was chosen. Reference the decision drivers and how this option best addresses them.]

### Rationale

[Detailed explanation of the reasoning behind this decision]

### Decision Criteria Met

- [How it meets driver 1]
- [How it meets driver 2]
- [How it meets driver 3]

## Consequences

### Positive

- [Positive consequence 1]
- [Positive consequence 2]
- [Positive consequence 3]

### Negative

- [Negative consequence 1 and how we'll mitigate it]
- [Negative consequence 2 and how we'll mitigate it]

### Neutral

- [Neutral consequence 1]
- [Neutral consequence 2]

## Implementation

### Technical Approach

[High-level description of how this will be implemented]

### Steps

1. [Implementation step 1]
2. [Implementation step 2]
3. [Implementation step 3]

### Timeline

- **Phase 1**: [Description] - [Timeframe]
- **Phase 2**: [Description] - [Timeframe]

### Dependencies

- [Dependency 1]
- [Dependency 2]

### Risks

- **[Risk 1]**: [Description and mitigation]
- **[Risk 2]**: [Description and mitigation]

## Validation

### Success Criteria

[How will we know this decision was correct?]

- [Criterion 1]
- [Criterion 2]
- [Criterion 3]

### Metrics

[What will we measure?]

- [Metric 1]: [Target value]
- [Metric 2]: [Target value]

### Review Schedule

[When will we review this decision?]

- **First Review**: [Date/Timeframe]
- **Regular Reviews**: [Frequency]

## Alternatives Not Chosen

### [Alternative Option Name]

**Why Not Chosen**: [Brief explanation of why this option was rejected]

**When to Reconsider**: [Under what conditions might we revisit this option?]

## References

- [Link to related documentation]
- [Link to related ADRs]
- [Link to external resources]
- [Link to technical research]

## Notes

[Any additional notes, context, or considerations]

---

**Related ADRs:**
- [ADR-XXX: Related Decision]
- [ADR-YYY: Another Related Decision]

**Supersedes:** [ADR-XXX if applicable]
**Superseded by:** [ADR-XXX if applicable]
```

### 5. Save the ADR

Write the ADR to: `.architecture/decisions/adrs/ADR-XXX-title.md`

### 6. Update Related Documentation

If this ADR relates to existing decisions:
1. Check for related ADRs in `.architecture/decisions/adrs/`
2. Add cross-references in the "Related ADRs" section
3. If this supersedes an old ADR, update the old ADR's status to "Superseded" and add a reference to the new ADR

### 7. Inform the User

Provide a summary:
```
Created ADR-XXX: [Title]

**Status**: [Status]
**Location**: .architecture/decisions/adrs/ADR-XXX-title.md

**Key Points:**
- Decision: [Brief summary]
- Main benefit: [Key benefit]
- Main trade-off: [Key trade-off]

**Next Steps:**
- [Immediate next step 1]
- [Immediate next step 2]

The ADR is ready for review. You can:
- Share it with the team for feedback
- Update the status to "Accepted" once approved
- Reference it in related code with a comment: "See ADR-XXX"
```

## Best Practices

### Writing Clear ADRs

1. **Be Specific**: Avoid vague language. Be concrete about what, why, and how.

2. **Focus on Why**: The decision itself is less important than the reasoning behind it.

3. **Consider the Reader**: Someone should be able to understand the decision months or years later.

4. **Be Honest About Trade-offs**: Every decision has downsides. Document them.

5. **Make it Actionable**: Include clear implementation steps.

6. **Keep it Concise**: Aim for thoroughness, not length. Each section should be focused.

### Status Lifecycle

- **Proposed**: Decision is documented but not yet approved
- **Accepted**: Decision has been approved and should be implemented
- **Deprecated**: Decision is no longer considered best practice but hasn't been replaced
- **Superseded**: Decision has been replaced by a newer ADR (reference the new one)

### When to Create an ADR

Create ADRs for:
- **Technology Choices**: Frameworks, libraries, languages, tools
- **Architectural Patterns**: Microservices, event-driven, layered, etc.
- **Infrastructure Decisions**: Cloud provider, deployment strategy, CI/CD approach
- **Data Decisions**: Database choice, data modeling approach, caching strategy
- **Security Decisions**: Authentication approach, encryption methods, security patterns
- **Integration Patterns**: API design, communication protocols, data formats

Don't create ADRs for:
- **Implementation Details**: Specific function names, variable names
- **Temporary Decisions**: Things that will change within days/weeks
- **Obvious Choices**: Decisions with no real alternatives or trade-offs
- **Minor Decisions**: Things with limited scope and impact

## Example Interaction

**User**: "Create ADR for using JWT for authentication"

**You**:
1. Check `.architecture/decisions/adrs/` for existing ADRs (find highest is ADR-003)
2. Ask clarifying questions if needed:
   - "Are you considering any alternatives like session-based auth or OAuth?"
   - "What are the main requirements driving this decision?"
   - "Any specific constraints (mobile app, microservices, etc.)?"
3. Create comprehensive ADR-004-use-jwt-for-authentication.md
4. Include:
   - Context about authentication needs
   - Alternatives considered (session-based, OAuth, API keys)
   - Decision drivers (stateless, mobile support, microservices)
   - Pros and cons of JWT approach
   - Implementation plan
   - Security considerations
5. Report back:

"Created ADR-004: Use JWT for Authentication

**Status**: Proposed
**Location**: .architecture/decisions/adrs/ADR-004-use-jwt-for-authentication.md

**Key Points:**
- Decision: Use JWT (JSON Web Tokens) for stateless authentication
- Main benefit: Stateless authentication enabling easy horizontal scaling
- Main trade-off: Token revocation requires additional infrastructure

**Next Steps:**
- Review with security team
- Implement token generation and validation middleware
- Set up refresh token rotation strategy
- Configure token expiration policies

The ADR is ready for team review. Once approved, update the status to 'Accepted'."

## Integration with Architecture Reviews

When creating ADRs:
- Reference relevant architecture review findings
- Consider recommendations from specialist reviews
- Link to related recalibration items
- Update architecture status with new decisions

## Error Handling

- **No .architecture directory**: Inform user to set up framework first
- **Missing ADR template**: Use the structure provided in this skill
- **Unclear decision**: Ask clarifying questions before creating ADR
- **Duplicate decision**: Check if similar ADR exists and suggest updating it instead

## Notes

- ADRs are living documents - they can be updated as new information emerges
- The goal is clarity and traceability, not perfection
- When in doubt, create the ADR - it's better to document decisions than to lose the reasoning
- ADRs should be version controlled with the rest of the codebase
