# Architectural Review: Version X.Y.Z

## Overview

This document contains the comprehensive architectural review for version X.Y.Z, conducted from [START DATE] to [END DATE]. The review evaluates the current architecture against project goals, industry best practices, and future requirements.

## Review Details

- **Version Reviewed**: X.Y.Z
- **Review Period**: [START DATE] - [END DATE]
- **Review Team**: [NAMES OR ROLES]
- **Review Methodology**: [DESCRIPTION OF REVIEW PROCESS]

## Senior Thinking Checklist

> **Note**: This checklist frames the architectural review by externalizing the "silent questions" that senior engineers ask before diving into technical details. Each reviewer should consider these questions from their specialist perspective.

Before diving into detailed strengths and weaknesses, reviewers should address these framing questions:

### Change Characterization
- **Nature of changes in this version**: Are we introducing new ideas, or expressing existing ones in new places?
- **Architectural depth**: Do changes belong at the surface (API, UX) or deep in the system?
- **Conceptual alignment**: How well do changes align with existing architectural patterns and domain model?

### Spread Analysis
- **Pattern propagation**: If the patterns/approaches in this version spread across the codebase, is that desirable or a liability?
- **Consistency impact**: Do these changes establish patterns we want repeated or should be contained?
- **Technical debt trajectory**: Are we creating consistency or divergence?

### Blast Radius Assessment
- **Failure scope**: What's the blast radius if these changes are wrong and need to be undone?
- **Component coupling**: Which components/services/modules are directly affected?
- **Team impact**: Which teams need to coordinate if changes fail or evolve?
- **User impact**: What's the user-facing risk if this goes wrong?

### Reversibility Analysis
- **Rollback feasibility**: How easily can these changes be reversed if needed?
- **Migration complexity**: What migration paths exist for reverting or evolving?
- **Option preservation**: Do these changes keep future options open or close doors?
- **Commitment level**: Are we making reversible decisions or permanent commitments?

### Timing & Sequencing
- **System readiness**: Is the system technically ready for these changes?
  - Do we have adequate observability?
  - Are dependencies stable?
  - Is infrastructure sufficient?
- **Team readiness**: Is the team prepared for these changes?
  - Do they understand the patterns being introduced?
  - Do they have necessary skills?
  - Is documentation adequate?
- **Sequencing concerns**: Are there prerequisites that should have come first?
- **Coordination needs**: What cross-team coordination is required?

### Social Cost Evaluation
- **Complexity burden**: Will these changes confuse more people than they help?
- **Learning curve**: What's the onboarding impact for new team members?
- **Cognitive load**: How much mental overhead do these patterns add?
- **Documentation needs**: What explanation is required for maintainability?

### Confidence Assessment
- **Model correctness**: Are we confident in the architectural model, not just the implementation?
- **Test coverage**: Could tests pass while the model is still wrong?
- **Assumption validation**: What assumptions underpin these changes? How validated are they?
- **Edge cases**: What edge cases might not be captured by current testing?

### Overall Architectural Direction
- **Alignment**: Do these changes move us toward or away from target architecture?
- **Evolution path**: Do they represent progress on our architectural evolution journey?
- **Technical debt**: Do they add to, reduce, or shift technical debt?

---

*Each specialist reviewer should consider these questions through their domain lens before providing detailed technical analysis.*

## Executive Summary

[A concise summary of the review's key findings, major recommendations, and overall architectural health assessment. This should highlight critical areas that need attention and strengths to preserve.]

**Overall Architecture Health**: [Excellent/Good/Fair/Concerning/Critical]

**Key Strengths**:
- [Strength 1]
- [Strength 2]
- [Strength 3]

**Critical Concerns**:
- [Concern 1]
- [Concern 2]
- [Concern 3]

## Individual Perspectives

### Systems Architect Review

**Reviewer**: [NAME]

**Strengths**:
- [Strength 1]
- [Strength 2]
- [...]

**Weaknesses**:
- [Weakness 1]
- [Weakness 2]
- [...]

**Recommendations**:
- [Recommendation 1]
- [Recommendation 2]
- [...]

### Domain Expert Review

**Reviewer**: [NAME]

**Strengths**:
- [Strength 1]
- [Strength 2]
- [...]

**Weaknesses**:
- [Weakness 1]
- [Weakness 2]
- [...]

**Recommendations**:
- [Recommendation 1]
- [Recommendation 2]
- [...]

### Security Specialist Review

**Reviewer**: [NAME]

**Strengths**:
- [Strength 1]
- [Strength 2]
- [...]

**Weaknesses**:
- [Weakness 1]
- [Weakness 2]
- [...]

**Recommendations**:
- [Recommendation 1]
- [Recommendation 2]
- [...]

### Maintainability Expert Review

**Reviewer**: [NAME]

**Strengths**:
- [Strength 1]
- [Strength 2]
- [...]

**Weaknesses**:
- [Weakness 1]
- [Weakness 2]
- [...]

**Recommendations**:
- [Recommendation 1]
- [Recommendation 2]
- [...]

### Performance Specialist Review

**Reviewer**: [NAME]

**Strengths**:
- [Strength 1]
- [Strength 2]
- [...]

**Weaknesses**:
- [Weakness 1]
- [Weakness 2]
- [...]

**Recommendations**:
- [Recommendation 1]
- [Recommendation 2]
- [...]

### Implementation Strategist Review

**Reviewer**: [NAME]

**Blast Radius Analysis**:
- [Assessment of change impact scope]
- [Components/teams/users affected]
- [Risk level and mitigation strategies]

**Reversibility Assessment**:
- [How easily changes can be rolled back]
- [Migration paths for evolution or reversal]
- [Options preserved vs. doors closed]

**Timing & Readiness**:
- **System Readiness**: [Technical readiness assessment]
- **Team Readiness**: [Skill and understanding assessment]
- **Sequencing Concerns**: [Prerequisites or coordination needs]

**Social Cost**:
- [Learning curve and cognitive load impact]
- [Clarity vs. confusion trade-offs]
- [Documentation and training needs]

**Strengths**:
- [Strength 1]
- [Strength 2]
- [...]

**Weaknesses**:
- [Weakness 1]
- [Weakness 2]
- [...]

**Recommendations**:
- [Recommendation 1]
- [Recommendation 2]
- [...]

### AI Engineer Review

**Reviewer**: [NAME]

**Strengths**:
- [Strength 1]
- [Strength 2]
- [...]

**Weaknesses**:
- [Weakness 1]
- [Weakness 2]
- [...]

**Recommendations**:
- [Recommendation 1]
- [Recommendation 2]
- [...]

### Pragmatic Enforcer Review

**Reviewer**: [NAME]
**Mode**: [Strict | Balanced | Lenient]

**Note**: *This section only appears when pragmatic_mode is enabled in `.architecture/config.yml`*

**Overall Simplicity Assessment**:
[High-level assessment of whether the architecture and recommendations maintain appropriate simplicity or show signs of over-engineering]

**Strengths**:
- [Areas where simplicity is maintained well]
- [Good examples of appropriate complexity]
- [Well-justified abstractions]

**Concerns**:
- [Areas of potentially unnecessary complexity]
- [Abstractions that may be premature]
- [Features that might be YAGNI violations]

**Challenges to Recommendations**:

#### Challenge to [Architect Role]

**Original Recommendation**: "[Quote the recommendation being challenged]"

**Necessity Assessment**: [Score 0-10]
- **Current need**: [Why this is/isn't needed right now]
- **Future need**: [Likelihood and timeframe for actual need]
- **Cost of waiting**: [What happens if we defer this]

**Complexity Assessment**: [Score 0-10]
- **Added complexity**: [What complexity this introduces]
- **Maintenance burden**: [Ongoing cost to maintain]
- **Learning curve**: [Impact on team/new developers]

**Simpler Alternative**:
[Concrete proposal for a simpler approach that meets current actual requirements]

**Recommendation**: [✅ Implement now | ⚠️ Implement simplified version | ⏸️ Defer until needed | ❌ Skip entirely]

**Justification**:
[Clear reasoning for the recommendation, balancing current needs vs future flexibility]

---

*[Repeat the Challenge section for each significant recommendation from other architects]*

**Summary Recommendations**:
1. [Key recommendation 1 with action: implement/simplify/defer/skip]
2. [Key recommendation 2 with action]
3. [...]

**Deferred Decisions** (tracked in `.architecture/deferrals.md`):
- [Feature/pattern being deferred] → Trigger: [condition]
- [Feature/pattern being deferred] → Trigger: [condition]

## Collaborative Analysis

This section reflects the consensus reached after cross-functional discussion of individual findings.

### Consolidated Strengths

1. [Strength 1] - [Brief explanation]
2. [Strength 2] - [Brief explanation]
3. [...]

### Consolidated Weaknesses

1. [Weakness 1] - [Brief explanation]
2. [Weakness 2] - [Brief explanation]
3. [...]

### Prioritized Improvements

**Critical (Address in next release)**:
1. [Improvement 1]
2. [Improvement 2]

**High (Address within next 2 releases)**:
1. [Improvement 3]
2. [Improvement 4]

**Medium (Address within next 3-4 releases)**:
1. [Improvement 5]
2. [Improvement 6]

**Low (Address as resources permit)**:
1. [Improvement 7]
2. [Improvement 8]

## Technical Debt Assessment

| Area | Current Debt Level | Trend | Impact | Notes |
|------|-------------------|-------|--------|-------|
| [Area 1] | [High/Medium/Low] | [Increasing/Stable/Decreasing] | [High/Medium/Low] | [Notes] |
| [Area 2] | [...] | [...] | [...] | [...] |

## Architectural Evolution

### Current Architecture vs. Target Architecture

[Describe the gap between the current architecture and where it needs to be in the future. Include diagrams if helpful.]

### Migration Path

[Outline a high-level path for evolving from the current architecture to the target state, considering backward compatibility, phasing, and risk mitigation.]

## Conclusion

[Summarize the review's key points and provide a clear path forward. Emphasize both immediate actions and longer-term directions.]

## Appendices

### A. Review Methodology

[Detailed description of the review process, including any tools, frameworks, or metrics used.]

### B. Architecture Diagrams

[Current architecture diagrams and any proposed future state diagrams.]

### C. Metrics Analysis

[Quantitative analysis of architectural metrics, if available.]

### D. Referenced Documents

[List of documents referenced during the review.]

### E. Low-confidence Findings

[Concerns a single reviewer raised at confidence below 0.7, kept out of the consolidated findings and prioritization but not dropped: the maintainer decides whether to promote or dismiss each one. Concerns raised by two or more reviewers never land here.]

| Finding | Reviewer | Severity | Confidence | Location |
|---------|----------|----------|------------|----------|
| [Finding title] | [Reviewer] | Medium | 0.5 | `path/to/file:line` |
