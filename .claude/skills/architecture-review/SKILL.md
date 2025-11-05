---
name: architecture-review
description: Conducts a comprehensive multi-perspective architecture review using all architecture team members. Use when the user requests "Start architecture review", "Review architecture for version X.Y.Z", "Conduct architecture review", or when they want a full architectural assessment of their system or a specific feature.
---

# Architecture Review

This skill conducts comprehensive, multi-perspective architecture reviews following the AI Software Architect framework's collaborative review process.

## When to Use This Skill

Automatically invoke this skill when users request:
- "Start architecture review for version X.Y.Z"
- "Start architecture review for [feature name]"
- "Review architecture for [component/feature]"
- "Conduct architecture review"
- "Perform architectural assessment"
- Before major releases
- After significant feature additions
- When architectural concerns arise

## Prerequisites

- The AI Software Architect framework must be set up (`.architecture/` directory exists)
- `.architecture/members.yml` must exist with architecture team members defined
- You should understand the codebase being reviewed

## Review Process

### 1. Determine Review Scope and Target

**Identify what's being reviewed:**

- **Version Review**: "version X.Y.Z" format
  - Review filename: `.architecture/reviews/X-Y-Z.md` (e.g., `1-0-0.md`)
  - Scope: Entire system at this version

- **Feature Review**: "feature name" format
  - Review filename: `.architecture/reviews/feature-kebab-case-name.md` (e.g., `feature-user-authentication.md`)
  - Scope: Specific feature or component

- **Component Review**: Specific component or subsystem
  - Review filename: `.architecture/reviews/component-kebab-case-name.md`
  - Scope: Targeted architectural component

If unclear, ask: "What would you like me to review? A specific version, feature, or component?"

### 2. Load Architecture Team

Read `.architecture/members.yml` to get all architecture team members.

Each member has:
- `id`: Unique identifier
- `name`: Person name
- `title`: Role/title
- `specialties`: List of specialty areas
- `disciplines`: Methodologies and approaches
- `skillsets`: Technical skills
- `domains`: Areas of expertise
- `perspective`: Their unique viewpoint

### 3. Analyze the System

Before conducting member reviews, analyze the system thoroughly:

**For Version Reviews:**
- Review overall architecture and structure
- Examine all major components and their interactions
- Check adherence to architectural principles
- Identify patterns, anti-patterns, and technical debt
- Review recent ADRs and their implementation
- Check documentation quality and completeness

**For Feature Reviews:**
- Examine feature implementation in detail
- Review integration with existing system
- Check data flow and dependencies
- Review API design and contracts
- Assess security implications
- Evaluate performance characteristics
- Check test coverage

**For Component Reviews:**
- Deep dive into component architecture
- Review internal structure and design
- Check dependencies and coupling
- Assess component boundaries
- Review interface design
- Evaluate maintainability

### 4. Conduct Individual Member Reviews

For each member in `members.yml`, conduct a review from their perspective:

**Adopt the member's persona:**
- Think from their specialty areas
- Apply their disciplines and methodologies
- Use their unique perspective

**Review structure for each member:**

```markdown
### [Member Name] - [Member Title]

**Perspective**: [Their perspective from members.yml]

#### Analysis

[Detailed analysis from this member's viewpoint, considering their specialties and domains]

**Key Observations:**
- [Observation 1]
- [Observation 2]
- [Observation 3]

#### Strengths Identified

[What this member sees as architectural strengths]

1. **[Strength 1 Title]**: [Description]
2. **[Strength 2 Title]**: [Description]
3. **[Strength 3 Title]**: [Description]

#### Concerns Raised

[What concerns or issues this member identifies]

1. **[Concern 1 Title]**: [Description]
   - **Impact**: [Severity and scope]
   - **Recommendation**: [What should be done]

2. **[Concern 2 Title]**: [Description]
   - **Impact**: [Severity and scope]
   - **Recommendation**: [What should be done]

#### Recommendations

[Specific recommendations from this perspective]

1. **[Recommendation 1]**: [Detailed description]
   - **Priority**: [High/Medium/Low]
   - **Effort**: [Estimated effort]
   - **Value**: [Expected value/benefit]

2. **[Recommendation 2]**: [Detailed description]
   - **Priority**: [High/Medium/Low]
   - **Effort**: [Estimated effort]
   - **Value**: [Expected value/benefit]
```

### 5. Collaborative Discussion Phase

After individual reviews, synthesize findings across all members:

**Identify common themes:**
- What concerns were raised by multiple members?
- Where do perspectives align?
- Where do they differ?

**Create dialogue:**
Simulate a discussion between members about key findings:

```markdown
## Collaborative Discussion

**[Systems Architect]**: "I'm concerned about the tight coupling between modules X and Y."

**[Domain Expert]**: "I agree, and from a business logic perspective, these domains should be more separated. The current structure makes it hard to evolve each domain independently."

**[Performance Specialist]**: "That coupling is also creating performance issues. Module X has to load all of Y's dependencies even when they're not needed."

**[Security Specialist]**: "And it creates a security boundary issue - we can't apply different security policies to each module."

**[Maintainability Expert]**: "This is a good example of where refactoring would have multiple benefits. The effort would be justified by improvements across several dimensions."

[Continue discussion covering major findings]

### Consensus Recommendations

Based on our discussion, we agree on these priorities:

1. **[Priority 1]**: [Description and why it's prioritized]
2. **[Priority 2]**: [Description and why it's prioritized]
3. **[Priority 3]**: [Description and why it's prioritized]
```

### 6. Create Consolidated Report

Generate the final review document with this structure:

```markdown
# Architecture Review: [Version/Feature Name]

**Date**: [Current Date]
**Review Target**: [Version number or Feature name]
**Review Type**: [Version | Feature | Component]
**Reviewers**: [List all members who participated]

## Executive Summary

[2-3 paragraph high-level summary of findings, suitable for leadership]

**Overall Assessment**: [Strong/Adequate/Needs Improvement]

**Key Findings:**
- [Finding 1]
- [Finding 2]
- [Finding 3]

**Critical Actions Required:**
- [Action 1]
- [Action 2]

## Review Scope

**What Was Reviewed:**
[Description of scope]

**Review Methodology:**
- Multi-perspective analysis using [N] specialized architecture roles
- Individual assessments followed by collaborative synthesis
- Focus on: [key areas of focus]

**Timeline:**
- **Review Period**: [Date range]
- **Version/Feature Status**: [Current state]

## System Overview

[For version reviews: overall system description]
[For feature reviews: feature description and context]
[For component reviews: component description and role]

**Key Characteristics:**
- **Architecture Style**: [e.g., microservices, monolithic, event-driven]
- **Technology Stack**: [Main technologies]
- **Scale**: [Size/complexity indicators]
- **Maturity**: [Development stage]

## Individual Member Reviews

[Insert each member's review following the structure from step 4]

## Collaborative Discussion

[Insert the collaborative discussion from step 5]

## Consolidated Findings

### Architectural Strengths

1. **[Strength 1]**: [Description]
   - **Value**: [How this benefits the system]
   - **Sustainability**: [How to maintain this strength]

2. **[Strength 2]**: [Description]
   - **Value**: [How this benefits the system]
   - **Sustainability**: [How to maintain this strength]

### Areas for Improvement

1. **[Area 1]**: [Description]
   - **Current State**: [What exists now]
   - **Desired State**: [What should exist]
   - **Gap Analysis**: [What needs to change]
   - **Priority**: [High/Medium/Low]

2. **[Area 2]**: [Description]
   [Same structure]

### Technical Debt Assessment

**High Priority Debt:**
- **[Debt Item 1]**: [Description]
  - **Impact**: [Current cost/impact]
  - **Resolution**: [What needs to be done]
  - **Estimated Effort**: [Time/resources]

**Medium Priority Debt:**
- [Similar structure]

**Low Priority Debt:**
- [Similar structure]

### Risk Analysis

**Technical Risks:**
- **[Risk 1]**: [Description]
  - **Likelihood**: [High/Medium/Low]
  - **Impact**: [High/Medium/Low]
  - **Mitigation**: [How to address]

**Organizational Risks:**
- [Similar structure]

**External Risks:**
- [Similar structure]

## Recommendations

### Immediate Actions (0-2 weeks)

1. **[Action 1]**: [Description]
   - **Why**: [Rationale]
   - **How**: [Implementation approach]
   - **Owner**: [Suggested owner]
   - **Success Criteria**: [How to measure]

2. **[Action 2]**: [Description]
   [Same structure]

### Short-term Actions (2-8 weeks)

1. **[Action 1]**: [Description]
   [Same structure]

### Long-term Actions (2-6 months)

1. **[Action 1]**: [Description]
   [Same structure]

### Strategic Recommendations

[Longer-term architectural direction and evolution]

1. **[Strategic Recommendation 1]**: [Description]
2. **[Strategic Recommendation 2]**: [Description]

## Trade-off Analysis

For major recommendations, analyze trade-offs:

### [Recommendation Name]

**Benefits:**
- [Benefit 1]
- [Benefit 2]

**Costs:**
- [Cost 1]
- [Cost 2]

**Risks:**
- [Risk 1]
- [Risk 2]

**Alternatives Considered:**
- [Alternative 1]: [Why not chosen]
- [Alternative 2]: [Why not chosen]

## Success Metrics

**How to measure improvement:**

1. **[Metric 1]**: [Description]
   - **Current**: [Current value]
   - **Target**: [Target value]
   - **Timeline**: [When to achieve]

2. **[Metric 2]**: [Description]
   [Same structure]

## Follow-up Plan

**Next Review**: [Suggested date/milestone]

**Interim Checkpoints:**
- [Checkpoint 1]: [Date/milestone]
- [Checkpoint 2]: [Date/milestone]

**Tracking Mechanism**: [How to track progress - suggest using recalibration process]

## Related Documentation

**Relevant ADRs:**
- [ADR-XXX: Title]
- [ADR-YYY: Title]

**Previous Reviews:**
- [Review name]: [Key points]

**Other References:**
- [Reference 1]
- [Reference 2]

## Conclusion

[Final summary paragraph bringing together all perspectives and providing clear direction forward]

---

**Review Completed by AI Software Architect Team**
**Date**: [Date]
**Document Version**: 1.0
```

### 7. Save the Review

Write the review to the appropriate location:
- Version reviews: `.architecture/reviews/X-Y-Z.md`
- Feature reviews: `.architecture/reviews/feature-kebab-case-name.md`
- Component reviews: `.architecture/reviews/component-kebab-case-name.md`

### 8. Suggest Next Steps

After creating the review, guide the user:

```
Architecture Review Complete: [Version/Feature Name]

**Location**: .architecture/reviews/[filename].md

**Overall Assessment**: [Assessment level]

**Top 3 Priorities:**
1. [Priority 1]
2. [Priority 2]
3. [Priority 3]

**Immediate Actions:**
- [Action 1]
- [Action 2]

**Next Steps:**
1. Review the detailed findings with your team
2. Start recalibration process: "Start architecture recalibration for [target]"
3. Create ADRs for key decisions identified in the review
4. Schedule follow-up review for [suggested date]

**Suggested Commands:**
- To begin addressing findings: "Start architecture recalibration for [target]"
- To document a decision from the review: "Create ADR for [topic]"
- To get more details on a specific area: "Ask [specialist] to review [component]"
```

## Best Practices

### Conducting Thorough Reviews

1. **Be Comprehensive**: Cover all aspects relevant to the scope
2. **Be Specific**: Reference actual code, files, and patterns
3. **Be Balanced**: Highlight both strengths and weaknesses
4. **Be Actionable**: Provide clear, implementable recommendations
5. **Be Realistic**: Consider constraints and context

### Member Perspective Guidelines

**Systems Architect**: Focus on overall structure, patterns, scalability
**Domain Expert**: Focus on business logic, domain boundaries, language
**Security Specialist**: Focus on security practices, vulnerabilities, compliance
**Maintainability Expert**: Focus on code quality, documentation, testability
**Performance Specialist**: Focus on efficiency, bottlenecks, resource usage
**[Custom Members]**: Apply their defined specialties and perspective

### Review Frequency

- **Major Versions**: Always conduct full review before release
- **Features**: Review significant features before merging to main
- **Regular Cadence**: Quarterly or bi-annually for ongoing projects
- **Triggered**: When concerns arise or after significant changes

### What to Look For

**Architectural Alignment:**
- Does the implementation follow stated architectural principles?
- Are ADRs being followed?
- Is the architecture evolving as planned?

**Quality Attributes:**
- Security, performance, reliability, maintainability
- Scalability, availability, usability
- Testability, deployability, observability

**Technical Debt:**
- Shortcuts taken
- Deferred work
- Areas needing refactoring

**Patterns and Anti-patterns:**
- Good patterns being used
- Anti-patterns that should be addressed

## Integration with Other Processes

**After Architecture Review:**
1. Start recalibration process to address findings
2. Create ADRs for decisions identified during review
3. Update architecture documentation based on findings
4. Plan implementation of recommendations

**Before Architecture Review:**
1. Review recent ADRs and their implementation
2. Check status of previous review recommendations
3. Gather metrics and data about system performance

## Example Interaction

**User**: "Start architecture review for version 2.0.0"

**You**:
1. Load all members from `.architecture/members.yml` (6 standard + 3 custom = 9 members)
2. Analyze the codebase comprehensively
3. Conduct individual reviews from each member's perspective:
   - Systems Architect: Reviews overall structure, identifies tight coupling
   - Domain Expert: Analyzes domain boundaries, finds mixed concerns
   - Security Specialist: Checks security practices, flags auth issues
   - Performance Specialist: Identifies bottlenecks in data layer
   - Maintainability Expert: Reviews code quality, notes documentation gaps
   - AI Engineer: Examines ML pipeline architecture
   - [Custom members]: Apply their specialized perspectives
4. Conduct collaborative discussion synthesizing findings
5. Create comprehensive review document
6. Report back:

"Architecture Review Complete for Version 2.0.0

**Location**: .architecture/reviews/2-0-0.md

**Overall Assessment**: Adequate with areas for improvement

**Top 3 Priorities:**
1. Decouple authentication module from user management (High priority)
2. Implement caching layer for database queries (Medium priority)
3. Improve API documentation coverage (Medium priority)

**Immediate Actions:**
- Create ADR for authentication separation strategy
- Benchmark current database query performance
- Schedule security audit of authentication flow

**Next Steps:**
1. Review the 47-page detailed findings with your team
2. Start recalibration: 'Start architecture recalibration for version 2.0.0'
3. Address high-priority items before GA release

The review includes individual assessments from 9 architecture specialists and a consolidated action plan."

## Error Handling

- **No .architecture directory**: Inform user to set up framework first
- **No members.yml**: Cannot conduct multi-perspective review, ask user to set up framework
- **Empty members.yml**: Use default set of members (Systems Architect, Domain Expert, Security Specialist, etc.)
- **Unclear scope**: Ask clarifying questions about what to review

## Notes

- Reviews should be honest and thorough - sugarcoating helps no one
- Balance technical depth with readability
- Include both tactical (immediate) and strategic (long-term) recommendations
- Make the review actionable - vague feedback isn't useful
- Consider the audience - executives need different information than developers
- Reviews are living documents - they can be updated as the system evolves
