---
name: architecture-review
description: Conducts a comprehensive multi-perspective architecture review using ALL architecture team members. Use when the user requests "Start architecture review", "Full architecture review", "Review architecture for version X.Y.Z", "Conduct comprehensive review", or when they want assessment from multiple perspectives. Do NOT use for single-specialist reviews (use specialist-review instead) or for status checks (use architecture-status instead).
---

# Architecture Review

Conducts comprehensive multi-perspective architecture reviews with all team members.

## Process

### 1. Determine Scope
- **Version review**: "version X.Y.Z" → filename: `X-Y-Z.md` (e.g., `1-0-0.md`)
- **Feature review**: "feature name" → filename: `feature-kebab-case.md`
- **Component review**: specific component → filename: `component-kebab-case.md`

If unclear, ask: "What would you like me to review?"

**Validate and Sanitize Input**:
- **Version numbers**: Validate format (X.Y.Z), only digits and dots, convert dots to hyphens
- **Feature/component names**: Remove `..`, `/`, `\`, null bytes, control characters
- Convert to lowercase kebab-case: spaces → hyphens, remove special chars
- Limit length: max 80 characters
- Validate result: [a-z0-9-] for names, [0-9-] for versions

**Examples**:
- Valid: "version 2.1.0" → `2-1-0.md`
- Valid: "User Authentication" → `feature-user-authentication.md`
- Invalid blocked: "../../../etc" → sanitized or rejected

### 2. Load Configuration and Team
- Read `.architecture/config.yml` to check if pragmatic_mode is enabled
- Read `.architecture/members.yml` to get all members (id, name, title, specialties, perspective)
- If pragmatic_mode.enabled is true and applies to reviews, include pragmatic_enforcer member

### 3. Analyze System
**For version reviews**: Overall architecture, components, interactions, patterns, technical debt, ADRs
**For feature reviews**: Feature implementation, integration, data flow, security, performance, tests
**For component reviews**: Component architecture, structure, dependencies, boundaries, interfaces

### 4. Individual Member Reviews
For each member in members.yml, review from their perspective:

```markdown
### [Name] - [Title]

**Perspective**: [Their unique viewpoint]

#### Key Observations
- [Observation 1]
- [Observation 2]

#### Strengths
1. **[Strength]**: [Description]

#### Concerns
1. **[Concern]** (Impact: [High/Medium/Low])
   - Issue: [What's wrong]
   - Recommendation: [What to do]

#### Recommendations
1. **[Recommendation]** (Priority: High/Medium/Low, Effort: Small/Medium/Large)
```

**If pragmatic_enforcer is included**: Add pragmatic analysis after each member's review:
- Apply necessity assessment (0-10): current need, future need, cost of waiting
- Apply complexity assessment (0-10): added complexity, maintenance, learning curve
- Propose simpler alternatives where applicable
- Recommend: Implement now / Simplified version / Defer / Skip
- Calculate pragmatic score (complexity/necessity ratio, target <1.5)

### 5. Collaborative Discussion
Simulate discussion between members:
- Identify common concerns
- Discuss different perspectives
- Agree on priorities

### 6. Create Review Document
Save to `.architecture/reviews/[filename].md`:

```markdown
# Architecture Review: [Target]

**Date**: [Date]
**Review Type**: Version | Feature | Component
**Reviewers**: [All members]

## Executive Summary
[2-3 paragraphs]

**Overall Assessment**: Strong | Adequate | Needs Improvement

**Key Findings**:
- [Finding 1]
- [Finding 2]

**Critical Actions**:
- [Action 1]
- [Action 2]

## System Overview
[Description of what was reviewed]

## Individual Member Reviews
[Insert each member's review]

## Collaborative Discussion
[Synthesized discussion with consensus]

## Consolidated Findings

### Strengths
1. **[Strength]**: [Value and how to sustain]

### Areas for Improvement
1. **[Area]**: [Current → Desired state, Priority]

### Technical Debt
**High Priority**:
- [Debt item]: Impact, Resolution, Effort

### Risks
**Technical Risks**:
- [Risk]: Likelihood, Impact, Mitigation

## Recommendations

### Immediate (0-2 weeks)
1. **[Action]**: Why, How, Owner, Success Criteria

### Short-term (2-8 weeks)
1. **[Action]**: Details

### Long-term (2-6 months)
1. **[Action]**: Details

## Success Metrics
1. **[Metric]**: Current → Target (Timeline)

## Follow-up
**Next Review**: [Date/milestone]
**Tracking**: Use recalibration process

## Related Documentation
- [ADR-XXX: Title]
- [Previous reviews]
```

### 7. Report to User
```
Architecture Review Complete: [Target]

Location: .architecture/reviews/[filename].md
Overall Assessment: [Assessment]

Top 3 Priorities:
1. [Priority 1]
2. [Priority 2]
3. [Priority 3]

Immediate Actions:
- [Action 1]
- [Action 2]

Next Steps:
- Review findings with team
- "Start architecture recalibration for [target]"
- Create ADRs for key decisions
```

## Review Frequency
- **Major versions**: Before release
- **Features**: Significant features before merge
- **Regular**: Quarterly or bi-annually
- **Triggered**: When concerns arise

## Related Skills

**Before Architecture Review**:
- "What's our architecture status?" - Check current documentation state
- "List architecture members" - See who will participate in review

**During Review** (if specific concerns emerge):
- "Ask [specialist] to review [specific concern]" - Deep-dive on particular issues
- "Create ADR for [decision]" - Document key decisions discovered

**After Architecture Review**:
- "Start architecture recalibration for [target]" - Plan implementation of recommendations
- Create ADRs for critical architectural decisions identified

**Workflow Examples**:
1. Status check → Full architecture review → Create ADRs → Recalibration
2. Architecture review → Specialist reviews for concerns → Address findings → Follow-up review

## Notes
- Be comprehensive but focused
- Reference actual code/files/patterns
- Highlight both strengths and weaknesses
- Make recommendations actionable and realistic
- Consider constraints and context
