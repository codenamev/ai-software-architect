---
name: create-adr
description: Creates a NEW Architectural Decision Record (ADR) documenting a specific architectural decision. Use when the user requests "Create ADR for [topic]", "Document decision about [topic]", "Write ADR for [choice]", or when documenting technology choices, patterns, or architectural approaches. Do NOT use for reviews (use architecture-review or specialist-review), finding existing ADRs on a topic (use find-adrs), ADR counts (use architecture-status), or general documentation.
allowed-tools: Read,Write,Edit,Glob,Grep,Bash(ls:*)
disable-model-invocation: true
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
- Does this replace an existing ADR? If so, which one (`ADR-NNN`)?

Then read `.architecture/principles.md` if it exists. The decision is written against it in step 6.

### 2. Generate ADR Number
```bash
# Find highest ADR number
ls .architecture/decisions/adrs/ | grep -E "^ADR-[0-9]+" | sed 's/ADR-//' | sed 's/-.*//' | sort -n | tail -1
```
New ADR = next sequential number (e.g., if highest is 003, create 004)

### 3. Validate and Sanitize Input
**Security**: Sanitize user input to prevent path traversal and injection:
- Remove or replace: `..`, `/`, `\`, null bytes, control characters
- Convert to lowercase kebab-case: spaces → hyphens, remove special chars
- Limit length: max 80 characters for filename portion
- Validate result: ensure filename contains only [a-z0-9-]

### 4. Create Filename
Format: `ADR-XXX-kebab-case-title.md`

Examples:
- `ADR-001-use-react-for-frontend.md`
- `ADR-002-choose-postgresql-database.md`

**Valid input**: "Use React for Frontend" → `use-react-for-frontend`
**Invalid blocked**: "../etc/passwd" → sanitized or rejected

### 5. Check Configuration
- Read `.architecture/config.yml` to check if pragmatic_mode is enabled
- If enabled and applies to ADR creation, include Pragmatic Enforcer analysis

### 6. Write ADR
Use the template from `.architecture/templates/adr-template.md`:

**Core sections**:
- Status, Context, Decision Drivers, Decision, Consequences
- Implementation, Alternatives Considered, Validation, References

**Principles check** (when `.architecture/principles.md` exists): name each recorded principle the decision upholds under Decision Drivers, and each one it conflicts with under Consequences → Negative. A decision that conflicts with a principle is still recordable; an unacknowledged conflict is not. If the point of the decision is to change or retire a principle, say so in the first sentence of Context and edit `.architecture/principles.md` in the same change, citing the ADR number next to the edited principle. The two files move together or not at all.

**If pragmatic_mode is enabled**: Add Pragmatic Enforcer Analysis section:
- Necessity Assessment (0-10): Current need, future need, cost of waiting, evidence
- Complexity Assessment (0-10): Added complexity, maintenance, learning curve, dependencies
- Alternative Analysis: Review if simpler alternatives adequately considered
- Simpler Alternative Proposal: Concrete proposal for simpler approach
- Recommendation: Approve / Approve with simplifications / Defer / Recommend against
- Pragmatic Score: Necessity, Complexity, Ratio (target <1.5)
- Overall Assessment: Appropriate engineering vs over-engineering

**If deferrals enabled**: Track deferred decisions in `.architecture/deferrals.md`

**If this ADR supersedes another**: confirm the old file exists in `.architecture/decisions/adrs/` before writing anything. If it doesn't, stop and ask; don't create a dangling link. Add `supersedes: ADR-NNN` to the new ADR's frontmatter.

### 7. Save ADR
Write to: `.architecture/decisions/adrs/ADR-XXX-title.md`

**If this ADR supersedes another**, edit the old ADR in the same change:
- frontmatter `status: superseded`
- frontmatter `superseded-by: ADR-XXX` (the new number)
- if the old ADR keeps a `## Status` section, change it to `Superseded` and link the new ADR so it matches the frontmatter

Leave the rest of the old ADR alone. It's the record of what was decided then. `validate-adr` checks that both sides of the link agree, so a half-written pair fails validation.

### 8. Report to User
```
Created ADR-XXX: [Title]

Location: .architecture/decisions/adrs/ADR-XXX-title.md
Status: [Status]
Supersedes: [ADR-NNN, now marked superseded | none]

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
- **Superseded**: Replaced by a newer ADR. Set by the new ADR's `supersedes:` field (step 7), never by hand alone

## Related Skills

**Before Creating ADR**:
- "Which ADRs cover [topic]?" - Find a decision that already covers this, or one the new ADR supersedes
- "What's our architecture status?" - Check existing ADRs to avoid duplication
- "List architecture members" - See who should review the decision

**After Creating ADR**:
- "Ask [specialist] to review [the ADR]" - Get focused expert review
- "Start architecture review for [version]" - Include in comprehensive review

**Workflow Examples**:
1. Create ADR → Ask Security Specialist to review → Revise ADR
2. Architecture review → Create ADRs for key decisions → Status check

## Notes
- Focus on "why" more than "what"
- Be honest about trade-offs
- Keep it concise but complete
- ADRs can be updated as new information emerges
