---
name: architecture-review
description: Conducts a comprehensive multi-perspective architecture review using all architecture team members. Use when the user requests "Start architecture review", "Review architecture for version X.Y.Z", "Conduct architecture review", or when they want a full architectural assessment of their system or a specific feature.
---

# Architecture Review

Conducts comprehensive multi-perspective architecture reviews with all team members.

## Process

### 1. Determine Scope
- **Version review**: "version X.Y.Z" → filename: `X-Y-Z.md` (e.g., `1-0-0.md`)
- **Feature review**: "feature name" → filename: `feature-kebab-case.md`
- **Component review**: specific component → filename: `component-kebab-case.md`

If unclear, ask: "What would you like me to review?"

### 2. Load Team
Read `.architecture/members.yml` to get all members (id, name, title, specialties, perspective).

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

## Notes
- Be comprehensive but focused
- Reference actual code/files/patterns
- Highlight both strengths and weaknesses
- Make recommendations actionable and realistic
- Consider constraints and context
