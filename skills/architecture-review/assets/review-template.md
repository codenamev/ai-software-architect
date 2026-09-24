# Architecture Review: [Target]

**Date**: [YYYY-MM-DD]
**Review Type**: Version | Feature | Component
**Reviewers**: [List all participating members]

## Executive Summary

[Write 2-3 paragraphs summarizing the overall state of the architecture, key findings, and critical actions needed. This should be readable by non-technical stakeholders.]

**Overall Assessment**: Strong | Adequate | Needs Improvement

**Key Findings**:
- [Finding 1 - Most significant discovery]
- [Finding 2 - Second most significant]
- [Finding 3 - Third most significant]

**Critical Actions**:
- [Action 1 - Most urgent action required]
- [Action 2 - Second most urgent]

---

## System Overview

[Provide context about what was reviewed. Include:
- Version number or feature name
- Scope of review (whole system, specific component, feature)
- Key technologies and frameworks
- Architecture style (monolith, microservices, etc.)
- Team size and structure
- Any relevant constraints or context]

---

## Individual Member Reviews

[Insert each member's review using the format from references/review-process.md]

### [Member Name] - [Title]

**Perspective**: [Their unique viewpoint]

#### Key Observations
- [Observation 1]
- [Observation 2]

#### Strengths
1. **[Strength]**: [Description]

#### Concerns
1. **[Concern]** (Impact: High/Medium/Low)
   - **Issue**: [What's wrong]
   - **Why it matters**: [Impact]
   - **Recommendation**: [What to do]

#### Recommendations
1. **[Recommendation]** (Priority: High/Medium/Low, Effort: Small/Medium/Large)
   - **What**: [Action]
   - **Why**: [Benefit]
   - **How**: [Approach]

[If pragmatic mode enabled, add Pragmatic Enforcer Analysis section here - see references/pragmatic-integration.md]

[Repeat for each member]

---

## Challenges

[Every critical/high finding from the individual reviews was sent to one other member with instructions to refute it. Record each outcome here. Rebuttals are verbatim from the challenger, not paraphrased by the orchestrator.]

| Finding | Author | Rated | Challenger | Outcome | Now rated |
|---------|--------|-------|------------|---------|-----------|
| [Finding title] | [Member] | Critical | [Member] | Survived | Critical |
| [Finding title] | [Member] | High | [Member] | Downgraded | Medium |
| [Finding title] | [Member] | Critical | [Member] | Refuted | — |

### Rebuttals

**[Finding title]** — challenged by [Member], **downgraded to Medium**
> [Challenger's response verbatim, with the file:line evidence they cited]

**[Finding title]** — challenged by [Member], **refuted**
> [Challenger's response verbatim]

[Unchallenged critical/high findings, if any, are listed here with the reason no counterweight member was available.]

---

## Principle Conflicts

[Every member checked their findings against `.architecture/principles.md`. One row per conflict. A finding listed here is never bucketed below Important in Consolidated Findings, whatever its severity. If the project has no principles file, write "no principles recorded" and leave both lists empty.]

| Principle | Finding | Raised by | Rated | Where |
|-----------|---------|-----------|-------|-------|
| [Principle name] | [Finding title] | [Member] | High | [file:line] |

### Proposed Principle Changes

[Recommendations that would change or retire a recorded principle. They do not appear under Recommendations below: each is a decision to record with `create-adr`, not a fix to schedule.]

- **[Principle name]** — [what the member proposed and why, verbatim]. Proposed by [Member]. Next: `create-adr`.

---

## Collaborative Discussion

[Synthesize the post-challenge findings from all members. Show how different perspectives interact and what consensus emerges. Refuted findings do not appear below.]

**Opening Context**:

**[Systems Architect]**: "[Opening statement]"

**[Domain Expert]**: "[Response or complementary view]"

[Continue natural discussion flow between members]

### Common Ground

The team agrees on:
1. [Consensus point 1]
2. [Consensus point 2]
3. [Consensus point 3]

### Areas of Debate

**Topic: [Topic Title]**
- **[Member 1]**: [Their position and reasoning]
- **[Member 2]**: [Their position and reasoning]
- **Resolution**: [How team reconciles different views]

### Priorities Established

**Critical (Address Immediately)**:
1. [Critical priority with brief justification]
2. [Critical priority]

**Important (Address Soon)**:
1. [Important priority]
2. [Important priority]

**Nice-to-Have (Consider Later)**:
1. [Nice-to-have improvement]
2. [Nice-to-have improvement]

---

## Consolidated Findings

### Strengths

1. **[Strength Title]**: [Description of what's working well, why it's valuable, and how to sustain it]
2. **[Strength Title]**: [Description]
3. **[Strength Title]**: [Description]

[Aim for 4-7 key strengths]

### Areas for Improvement

1. **[Area Title]**:
   - **Current state**: [What exists now]
   - **Desired state**: [What it should be]
   - **Gap**: [What's missing]
   - **Priority**: High | Medium | Low
   - **Impact**: [Why this matters]

2. **[Area Title]**: [Details]

[Aim for 5-10 areas depending on review scope]

### Technical Debt

**High Priority**:
- **[Debt Item]**:
  - **Impact**: [How it affects development/operations]
  - **Resolution**: [What needs to be done]
  - **Effort**: Small | Medium | Large
  - **Recommended Timeline**: [When to address]

**Medium Priority**:
- **[Debt Item]**: [Details]

**Low Priority**:
- **[Debt Item]**: [Details]

### Risks

**Technical Risks**:
- **[Risk Title]** (Likelihood: High/Medium/Low, Impact: High/Medium/Low)
  - **Description**: [What could go wrong]
  - **Mitigation**: [How to reduce or eliminate risk]
  - **Owner**: [Who should monitor/address]

**Business Risks**:
- **[Risk Title]** (Likelihood: High/Medium/Low, Impact: High/Medium/Low)
  - **Description**: [Business impact]
  - **Mitigation**: [How to address]

**Operational Risks**:
- **[Risk Title]** (Likelihood: High/Medium/Low, Impact: High/Medium/Low)
  - **Description**: [Operations/reliability concern]
  - **Mitigation**: [How to address]

---

## Recommendations

### Immediate (0-2 weeks)

1. **[Action Title]**
   - **Why**: [Problem being solved or value being created]
   - **How**: [High-level implementation approach]
   - **Owner**: [Team or person responsible]
   - **Success Criteria**: [How to know it's done successfully]
   - **Estimated Effort**: [Time or story points]

2. **[Action Title]**: [Details]

### Short-term (2-8 weeks)

1. **[Action Title]**
   - **Why**: [Justification]
   - **How**: [Approach]
   - **Owner**: [Responsible party]
   - **Success Criteria**: [Completion criteria]
   - **Estimated Effort**: [Effort estimate]

2. **[Action Title]**: [Details]

### Long-term (2-6 months)

1. **[Action Title]**
   - **Why**: [Strategic value or risk mitigation]
   - **How**: [High-level roadmap]
   - **Owner**: [Responsible party]
   - **Success Criteria**: [Long-term goals]
   - **Estimated Effort**: [Effort estimate]

2. **[Action Title]**: [Details]

---

## Success Metrics

Define measurable criteria to track improvement:

1. **[Metric Name]**:
   - **Current**: [Current value]
   - **Target**: [Target value]
   - **Timeline**: [When to achieve]
   - **Measurement**: [How to measure]

2. **[Metric Name]**: Current → Target (Timeline)

3. **[Metric Name]**: Current → Target (Timeline)

[Examples:
- Test Coverage: 45% → 75% (3 months)
- Build Time: 15 min → 5 min (6 weeks)
- P95 Response Time: 500ms → 200ms (2 months)
- Code Review Time: 2 days → 4 hours (1 month)
]

---

## Follow-up

**Next Review**: [Specific date or milestone]

**Tracking**: [How recommendations will be tracked]
- Create GitHub issues for immediate actions
- Add to sprint backlog
- Use architecture recalibration process (see below)

**Recalibration**:
After implementing recommendations, conduct architecture recalibration to assess progress:
```
"Start architecture recalibration for [target]"
```

**Accountability**:
- [Who is responsible for tracking implementation]
- [How often to check progress - weekly, bi-weekly, etc.]
- [Where to document status updates]

---

## Related Documentation

**Architectural Decision Records**:
- [ADR-XXX: Title](../decisions/adrs/ADR-XXX-title.md) - [How it relates to this review]
- [ADR-YYY: Title](../decisions/adrs/ADR-YYY-title.md) - [Relationship]

**Previous Reviews**:
- [Previous review filename] - [Date] - [How architecture has evolved since then]

**Referenced Documents**:
- [Document title] - [Link] - [Relevance]

---

## Appendix

### Review Methodology

This review was conducted using the AI Software Architect framework with the following team members:

- **Systems Architect**: Overall system coherence and patterns
- **Domain Expert**: Business domain representation
- **Security Specialist**: Security analysis and threat modeling
- **Performance Specialist**: Performance and scalability
- **Maintainability Expert**: Code quality and technical debt
- [Additional members as applicable]

Each member reviewed independently. Every critical/high finding was then sent to one other member to refute (the challenge round); surviving severities drove the consolidated findings and prioritization.

[If pragmatic mode was enabled, note:]
**Pragmatic Mode**: [Strict | Balanced | Lenient]
- Complexity ratio target: [<1.0 | <1.5 | <2.0]
- All recommendations evaluated through YAGNI lens

### Glossary

[If needed, define domain-specific terms or acronyms used in the review]

- **[Term]**: [Definition]
- **[Acronym]**: [Expansion and meaning]

---

**Review Complete**
