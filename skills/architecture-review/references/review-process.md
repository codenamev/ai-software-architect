# Architecture Review Process - Detailed Guide

This document provides detailed instructions for conducting architecture reviews with all team members.

## Table of Contents

1. [Individual Member Review Format](#individual-member-review-format)
2. [Collaborative Discussion Process](#collaborative-discussion-process)
3. [Analysis Guidelines by Review Type](#analysis-guidelines-by-review-type)

---

## Individual Member Review Format

Each member from `.architecture/members.yml` should review from their unique perspective using this structure:

### Review Template

```markdown
### [Member Name] - [Title]

**Perspective**: [Their unique viewpoint from members.yml]

#### Key Observations
- [Observation 1 - Specific finding about the system]
- [Observation 2 - Another specific finding]
- [Continue with notable observations]

#### Strengths
1. **[Strength Title]**: [Detailed description of what's working well and why it matters]
2. **[Strength Title]**: [Description]
3. [Continue with strengths - aim for 3-5 key strengths]

#### Concerns
1. **[Concern Title]** (Impact: High | Medium | Low)
   - **Issue**: [Clear description of what's wrong or could be improved]
   - **Why it matters**: [Impact on system, users, or development]
   - **Recommendation**: [Specific actionable recommendation]

2. **[Concern Title]** (Impact: High | Medium | Low)
   - **Issue**: [Description]
   - **Why it matters**: [Impact]
   - **Recommendation**: [Action]

[Continue with concerns - prioritize by impact]

#### Recommendations
1. **[Recommendation Title]** (Priority: High/Medium/Low, Effort: Small/Medium/Large)
   - **What**: [What to do]
   - **Why**: [Benefit or risk addressed]
   - **How**: [Brief implementation approach]

2. **[Recommendation Title]** (Priority: High/Medium/Low, Effort: Small/Medium/Large)
   - [Details]

[Continue with recommendations - 3-7 recommendations per member]
```

### Member-Specific Guidance

**Systems Architect**:
- Focus on overall system coherence and architectural patterns
- Evaluate component interactions and integration points
- Assess alignment with architectural principles
- Consider long-term evolvability

**Domain Expert**:
- Review how well architecture represents business domain
- Evaluate bounded contexts and domain model accuracy
- Check ubiquitous language usage
- Assess semantic correctness

**Security Specialist**:
- Identify security vulnerabilities and threats
- Evaluate authentication, authorization, encryption
- Review data protection and privacy considerations
- Assess security boundaries and attack surface

**Performance Specialist**:
- Identify performance bottlenecks
- Evaluate scalability patterns
- Review resource utilization
- Assess caching, optimization opportunities

**Maintainability Expert**:
- Evaluate code organization and clarity
- Assess technical debt
- Review complexity and coupling
- Consider developer experience

**AI Engineer** (if applicable):
- Review AI/ML integration patterns
- Evaluate LLM application design
- Assess agent orchestration
- Review observability and evaluation

**Pragmatic Enforcer** (if pragmatic mode enabled):
- See [pragmatic-integration.md](./pragmatic-integration.md) for detailed process

---

## Collaborative Discussion Process

After individual reviews, the orchestrator runs the **challenge round** (SKILL.md step 5): every critical/high finding is sent to the member best positioned to refute it, and the outcome (survived / downgraded / refuted, rebuttal verbatim) is recorded under a Challenges section. The discussion below is then synthesized from the post-challenge findings; refuted findings do not enter it.

### Discussion Structure

```markdown
## Collaborative Discussion

**[Systems Architect]**: "[Opening statement about overall architecture]"

**[Domain Expert]**: "[Response or complementary view from domain perspective]"

**[Security Specialist]**: "[Security concerns or validation]"

[Continue discussion flow naturally]

### Common Ground

Team members agree on:
1. [Consensus point 1]
2. [Consensus point 2]
3. [Consensus point 3]

### Areas of Debate

**Topic: [Topic Title]**
- **[Member 1]**: [Their position]
- **[Member 2]**: [Their position]
- **Resolution**: [How team resolves or agrees to disagree]

### Priorities Established

The team agrees on these priorities:

**Critical (Address Immediately)**:
1. [Critical priority]
2. [Critical priority]

**Important (Address Soon)**:
1. [Important priority]
2. [Important priority]

**Nice-to-Have (Consider Later)**:
1. [Nice-to-have]
2. [Nice-to-have]
```

### Discussion Best Practices

1. **Cross-Reference Findings**: Members should reference and build on each other's observations
2. **Resolve Conflicts**: When members disagree on something the challenge round did not settle, discuss trade-offs and reach consensus
3. **Prioritize Together**: Collaborate to rank recommendations by urgency and impact
4. **Be Realistic**: Consider project constraints, deadlines, and team capacity
5. **Stay Constructive**: Frame concerns as improvement opportunities

---

## Analysis Guidelines by Review Type

### Version Reviews

**Focus on**:
- Overall architecture health at this milestone
- Components and their interactions
- Patterns and consistency
- Technical debt accumulated
- ADRs implemented or needed
- Alignment with original architecture vision

**Key Questions**:
- Is the architecture still coherent as system has evolved?
- What technical debt needs addressing before next version?
- Are architectural principles being followed?
- What risks should be mitigated?

### Feature Reviews

**Focus on**:
- Feature implementation approach
- Integration with existing architecture
- Data flow and state management
- Security implications
- Performance impact
- Test coverage

**Key Questions**:
- Does this feature fit the existing architecture?
- Are there better architectural approaches?
- What are the integration risks?
- How does this impact scalability?

### Component Reviews

**Focus on**:
- Component architecture and structure
- Dependencies and coupling
- Boundaries and interfaces
- Responsibilities and cohesion
- Testability

**Key Questions**:
- Is component well-designed and focused?
- Are boundaries clear and appropriate?
- Is it properly decoupled?
- Does it follow single responsibility principle?

---

## Tips for High-Quality Reviews

### Be Specific
- ❌ "The code is messy"
- ✅ "The `UserService` class has 15 methods mixing authentication, authorization, and profile management - violates single responsibility"

### Provide Context
- ❌ "Add caching"
- ✅ "Add Redis caching for user profile queries - currently hitting DB 50+ times per page load causing 200ms delays"

### Suggest Solutions
- ❌ "Performance is bad"
- ✅ "Batch database queries in `OrderProcessor.process()` to reduce N+1 queries - should improve processing time by 70%"

### Balance Positive and Negative
- Don't just list problems
- Recognize what's working well
- Explain why good patterns should be sustained

### Be Actionable
- Every concern should have a recommendation
- Recommendations should be concrete and implementable
- Estimate effort (Small/Medium/Large) and priority (High/Medium/Low)

---

## Reference Documentation

For the full review document template, see [../assets/review-template.md](../assets/review-template.md).

For pragmatic mode integration, see [pragmatic-integration.md](./pragmatic-integration.md).
