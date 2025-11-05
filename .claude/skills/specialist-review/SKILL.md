---
name: specialist-review
description: Conducts a focused architectural review from a specific specialist's perspective. Use when the user requests "Ask [specialist role] to review [target]", "Get [specialist]'s opinion on [topic]", or when they want focused expertise on a specific architectural concern like security, performance, or domain design.
---

# Specialist Review

This skill conducts focused architectural reviews from a specific specialist's perspective, providing deep expertise in a particular area without the overhead of a full multi-perspective review.

## When to Use This Skill

Automatically invoke this skill when users request:
- "Ask [role] to review [target]"
- "Get [specialist]'s opinion on [topic]"
- "Have [specialist] review [component]"
- "[Specialist] review of [feature]"
- "What would [specialist] think about [decision]?"
- When targeted expertise is needed on a specific concern

Examples:
- "Ask Security Architect to review authentication flow"
- "Get Performance Specialist's opinion on database queries"
- "Have Ruby Expert review my use of modules"
- "Domain Expert review of the payment processing logic"

## Prerequisites

- The AI Software Architect framework must be set up (`.architecture/` directory exists)
- `.architecture/members.yml` should exist with architecture team members

## Specialist Review Process

### 1. Identify the Specialist and Target

**Parse the request to extract:**
- **Specialist Role**: Which expert is being requested?
- **Review Target**: What should be reviewed?

Examples:
- "Ask Security Specialist to review API authentication"
  - Specialist: Security Specialist
  - Target: API authentication

- "Get Performance Expert's opinion on our caching strategy"
  - Specialist: Performance Expert
  - Target: Caching strategy

- "Ruby Expert review of my ActiveRecord models"
  - Specialist: Ruby Expert
  - Target: ActiveRecord models

### 2. Load or Create Specialist Profile

Read `.architecture/members.yml` and look for the requested specialist.

**If the specialist exists:**
- Load their profile (specialties, disciplines, skillsets, domains, perspective)
- Use their defined expertise

**If the specialist does NOT exist:**
- Create a new specialist entry in `members.yml`
- Inform the user you're adding this specialist to the team
- Define appropriate specialties, disciplines, and perspective for the role

**Creating New Specialists:**

Use this template:
```yaml
- id: [role_id]
  name: "[Person Name]"
  title: "[Role Title]"
  specialties:
    - "[Specialty 1]"
    - "[Specialty 2]"
    - "[Specialty 3]"
  disciplines:
    - "[Discipline 1]"
    - "[Discipline 2]"
    - "[Discipline 3]"
  skillsets:
    - "[Skill 1]"
    - "[Skill 2]"
    - "[Skill 3]"
  domains:
    - "[Domain 1]"
    - "[Domain 2]"
    - "[Domain 3]"
  perspective: "[Brief description of their unique perspective]"
```

**Example new specialist roles:**

- **Ruby Expert**: Ruby language best practices, Rails patterns, gem ecosystem
- **React Specialist**: Component design, hooks, state management, performance
- **Security Architect**: OWASP top 10, secure coding, threat modeling, compliance
- **API Designer**: REST/GraphQL design, API versioning, documentation
- **Database Architect**: Schema design, query optimization, data modeling
- **DevOps Specialist**: CI/CD, infrastructure, deployment, monitoring
- **Accessibility Expert**: WCAG compliance, inclusive design, assistive technologies
- **Data Engineer**: Data pipelines, ETL, data quality, analytics

### 3. Analyze the Target

Before conducting the review, analyze the target thoroughly:

**Locate the Target:**
- Find relevant files, components, or systems
- Understand the context and current implementation
- Identify dependencies and relationships

**Gather Context:**
- What is the target's purpose?
- How does it fit into the overall system?
- What are the requirements and constraints?
- Are there related ADRs or previous reviews?

**Use appropriate tools:**
- Search for relevant code files
- Read implementation details
- Review related documentation
- Check for existing architectural decisions

### 4. Conduct the Specialist Review

Adopt the specialist's persona and perspective. Think through their lens.

**Review Structure:**

```markdown
# [Specialist Title] Review: [Target]

**Reviewer**: [Specialist Name], [Specialist Title]
**Target**: [What is being reviewed]
**Date**: [Current Date]
**Review Type**: Specialist Focus Review

---

## Specialist Perspective

**Expertise Areas:**
- [Specialty 1]
- [Specialty 2]
- [Specialty 3]

**Review Focus:**
[What this specialist is specifically looking for based on their expertise]

---

## Executive Summary

[2-3 sentence high-level summary of the review findings]

**Overall Assessment**: [Excellent | Good | Adequate | Needs Improvement | Critical Issues]

**Key Findings:**
- [Finding 1]
- [Finding 2]
- [Finding 3]

**Priority Actions:**
- [Action 1]
- [Action 2]

---

## Target Analysis

### Current Implementation

[Description of what exists now - be specific with file locations, patterns used, etc.]

**Key Components:**
- `[file/component 1]`: [Description]
- `[file/component 2]`: [Description]
- `[file/component 3]`: [Description]

**Architecture Pattern**: [Pattern being used]

**Dependencies**: [Key dependencies]

### Context

[Background and context for this target]

**Purpose**: [What it's meant to accomplish]
**Scope**: [What it covers]
**Requirements**: [Key requirements it must meet]

---

## Detailed Assessment

### Strengths

Things this implementation does well from this specialist's perspective:

1. **[Strength 1 Title]**
   - **Description**: [What's good]
   - **Why It Matters**: [Why this is important from specialist perspective]
   - **Examples**: [Specific examples from code]

2. **[Strength 2 Title]**
   [Same structure]

3. **[Strength 3 Title]**
   [Same structure]

### Concerns

Issues or areas of concern from this specialist's perspective:

1. **[Concern 1 Title]** - [Severity: Critical | High | Medium | Low]
   - **Issue**: [What's wrong]
   - **Location**: [Where in code - file:line]
   - **Impact**: [What problems this causes]
   - **Risk Level**: [High/Medium/Low]
   - **Example**: [Specific code example if applicable]

2. **[Concern 2 Title]** - [Severity]
   [Same structure]

3. **[Concern 3 Title]** - [Severity]
   [Same structure]

### Observations

Neutral observations or things to be aware of:

- **[Observation 1]**: [Description]
- **[Observation 2]**: [Description]
- **[Observation 3]**: [Description]

---

## Recommendations

### Immediate Actions (Do First)

1. **[Recommendation 1]**
   - **What**: [What to do]
   - **Why**: [Why this is important]
   - **How**: [Specific implementation guidance]
   - **Effort**: [Small | Medium | Large]
   - **Impact**: [High | Medium | Low]
   - **Code Example**: [If applicable]

2. **[Recommendation 2]**
   [Same structure]

### Short-term Improvements (Next Sprint/Release)

1. **[Recommendation 1]**
   [Same structure]

2. **[Recommendation 2]**
   [Same structure]

### Long-term Enhancements (Future Consideration)

1. **[Recommendation 1]**
   [Same structure]

2. **[Recommendation 2]**
   [Same structure]

---

## Best Practices for This Domain

[Specialist-specific best practices relevant to this target]

1. **[Best Practice 1]**: [Description and how it applies]
2. **[Best Practice 2]**: [Description and how it applies]
3. **[Best Practice 3]**: [Description and how it applies]

**Industry Standards:**
- [Relevant standard 1]
- [Relevant standard 2]

**Recommended Patterns:**
- [Pattern 1]: [When to use]
- [Pattern 2]: [When to use]

---

## Code Examples

### Current Approach (Problematic)

```[language]
[Code example showing the concern]
```

**Issues:**
- [Issue 1]
- [Issue 2]

### Recommended Approach

```[language]
[Code example showing the improvement]
```

**Benefits:**
- [Benefit 1]
- [Benefit 2]

**Why This Is Better:**
[Explanation from specialist perspective]

---

## Alternative Approaches

### Option 1: [Approach Name]

**Description**: [What this approach involves]

**Pros:**
- [Pro 1]
- [Pro 2]

**Cons:**
- [Con 1]
- [Con 2]

**When to Use**: [Circumstances where this is appropriate]

### Option 2: [Approach Name]

[Same structure]

---

## Testing & Validation

[Specialist-specific guidance on testing this target]

**What to Test:**
- [Test scenario 1]
- [Test scenario 2]
- [Test scenario 3]

**Testing Approach:**
[Recommended testing strategy from specialist perspective]

**Success Criteria:**
- [Criterion 1]
- [Criterion 2]

---

## Resources & References

**Relevant Documentation:**
- [Link/reference 1]
- [Link/reference 2]

**Related ADRs:**
- [ADR-XXX: Title]

**Industry Resources:**
- [Resource 1]
- [Resource 2]

**Tools & Libraries:**
- [Tool 1]: [Purpose]
- [Tool 2]: [Purpose]

---

## Risk Assessment

**Risks if recommendations are not addressed:**

1. **[Risk 1]** - [Likelihood: High/Medium/Low]
   - **Impact**: [Description of impact]
   - **Mitigation**: [How to mitigate]

2. **[Risk 2]** - [Likelihood]
   [Same structure]

---

## Follow-up

**Suggested Review Schedule**: [When to re-review]

**Monitoring**: [What to monitor going forward]

**Success Metrics**: [How to measure improvement]

---

## Conclusion

[Summary paragraph from the specialist's perspective, emphasizing key takeaways and most important actions]

---

**Review completed by**: [Specialist Name], [Specialist Title]
**Date**: [Date]
**Next Review**: [Suggested date/milestone]
```

### 5. Save the Review

Save to: `.architecture/reviews/[specialist-role]-[target-name].md`

Format the filename as: `[role-kebab-case]-[target-kebab-case].md`

Examples:
- `.architecture/reviews/security-specialist-api-authentication.md`
- `.architecture/reviews/performance-specialist-database-queries.md`
- `.architecture/reviews/ruby-expert-activerecord-models.md`

### 6. Update members.yml if New Specialist

If you created a new specialist, update `.architecture/members.yml` by appending the new member.

Inform the user:
```
I've added [Specialist Name] ([Specialist Title]) to your architecture team in .architecture/members.yml.
This specialist can now be consulted for future reviews.
```

### 7. Report Results

Provide a clear summary to the user:

```
[Specialist Title] Review Complete: [Target]

**Reviewer**: [Specialist Name]
**Location**: .architecture/reviews/[filename].md

**Overall Assessment**: [Assessment]

**Key Findings:**
1. [Finding 1]
2. [Finding 2]
3. [Finding 3]

**Priority Actions:**
1. [Action 1]
2. [Action 2]

**Critical Issues**: [Number] identified
**Recommendations**: [Number] provided

**Next Steps:**
- Address critical issues immediately
- Review detailed recommendations in the full report
- [Specific next step based on findings]

**Suggested Commands:**
- To document a decision: "Create ADR for [topic]"
- To get another perspective: "Ask [another specialist] to review [target]"
- For a full review: "Start architecture review for [scope]"
```

## Specialist-Specific Guidelines

### Security Specialist

**Focus on:**
- Authentication and authorization
- Input validation and sanitization
- Data protection and encryption
- OWASP Top 10 vulnerabilities
- Security headers and configurations
- Secrets management
- Compliance requirements (GDPR, HIPAA, etc.)

**Look for:**
- SQL injection risks
- XSS vulnerabilities
- CSRF protection
- Insecure dependencies
- Sensitive data exposure
- Missing security controls

### Performance Specialist

**Focus on:**
- Algorithm efficiency
- Database query optimization
- Caching strategies
- Resource utilization
- Load handling
- Response times
- Bottlenecks

**Look for:**
- N+1 query problems
- Missing indexes
- Inefficient algorithms
- Memory leaks
- Blocking operations
- Unnecessary data loading

### Domain Expert

**Focus on:**
- Business logic correctness
- Domain model accuracy
- Ubiquitous language usage
- Bounded context boundaries
- Domain rules and invariants
- Business process alignment

**Look for:**
- Misaligned business logic
- Domain concept confusion
- Anemic domain models
- Missing business rules
- Incorrect terminology

### Maintainability Expert

**Focus on:**
- Code readability
- Documentation quality
- Test coverage
- Code organization
- Dependency management
- Technical debt
- Refactoring opportunities

**Look for:**
- Code smells
- Duplicated code
- Complex methods
- Poor naming
- Missing tests
- Outdated dependencies

### Systems Architect

**Focus on:**
- Overall structure
- Component interactions
- Scalability
- Deployment architecture
- Integration patterns
- System boundaries

**Look for:**
- Tight coupling
- Missing abstractions
- Scalability limits
- Integration issues
- Architectural drift

### Language/Framework Experts (Ruby, JavaScript, etc.)

**Focus on:**
- Idiomatic usage
- Language-specific best practices
- Framework conventions
- Ecosystem patterns
- Version compatibility
- Performance characteristics

**Look for:**
- Non-idiomatic code
- Misused language features
- Framework anti-patterns
- Outdated patterns
- Better alternatives

## Best Practices

### Conducting Effective Specialist Reviews

1. **Be Laser-Focused**: Stay within your specialist domain
2. **Be Specific**: Reference exact files, lines, and code examples
3. **Be Practical**: Provide actionable, implementable advice
4. **Be Educational**: Explain why, not just what
5. **Be Realistic**: Consider context and constraints

### When to Use Specialist Reviews

**Use specialist reviews when:**
- You need deep expertise in one area
- Quick turnaround is needed
- Specific concern needs addressing
- Full review would be overkill
- Targeted validation is required

**Use full architecture reviews when:**
- Comprehensive assessment needed
- Before major releases
- Multiple concerns exist
- System-wide view required

### Combining Multiple Specialists

For complex targets, consider multiple specialist reviews:
```
"Ask Security Specialist and Performance Specialist to review the authentication API"
```

Conduct each review separately, then create a synthesis:
```markdown
# Combined Specialist Review: Authentication API

## Security Perspective
[Security Specialist's review]

## Performance Perspective
[Performance Specialist's review]

## Synthesis
[How the concerns interact, prioritization, combined recommendations]
```

## Integration with Architecture Process

**After a Specialist Review:**
- Create ADRs for decisions identified
- Update relevant documentation
- Consider if findings warrant full architecture review
- Track implementation of recommendations

**Before a Specialist Review:**
- Check if related ADRs exist
- Review previous specialist feedback
- Prepare specific questions or concerns

## Example Interactions

### Example 1: Security Review

**User**: "Ask Security Specialist to review our API authentication"

**You**:
1. Load Security Specialist from members.yml (or create if needed)
2. Find and analyze API authentication implementation
3. Conduct security-focused review covering:
   - Authentication mechanism (JWT, sessions, etc.)
   - Token storage and transmission
   - Authorization checks
   - Input validation
   - Rate limiting
   - Security headers
4. Identify 2 critical issues, 3 high-priority improvements
5. Provide specific code examples and fixes
6. Create `.architecture/reviews/security-specialist-api-authentication.md`
7. Report findings with actionable next steps

### Example 2: Creating New Specialist

**User**: "Have Accessibility Expert review our form components"

**You**:
1. Check members.yml - Accessibility Expert doesn't exist
2. Create new member:
   ```yaml
   - id: accessibility_expert
     name: "Jordan Kim"
     title: "Accessibility Expert"
     specialties:
       - "WCAG 2.1 compliance"
       - "Screen reader optimization"
       - "Keyboard navigation"
     disciplines:
       - "Inclusive design"
       - "Assistive technology"
       - "Accessibility testing"
     skillsets:
       - "ARIA attributes"
       - "Semantic HTML"
       - "Focus management"
     domains:
       - "Web accessibility"
       - "User experience"
       - "Compliance"
     perspective: "Ensures all users can access and use the system regardless of ability"
   ```
3. Inform user: "I've added Jordan Kim (Accessibility Expert) to your architecture team."
4. Conduct accessibility-focused review of form components
5. Create review document
6. Report findings

## Error Handling

- **Specialist not clear**: Ask which specialist role they want
- **Target unclear**: Ask what specifically should be reviewed
- **Target not found**: Search broader or ask for clarification
- **No members.yml**: Create specialist anyway, suggest full setup
- **Insufficient information**: Ask for more context before reviewing

## Notes

- Specialist reviews are more focused but less comprehensive than full reviews
- Multiple specialist reviews can be combined for complex targets
- New specialists become permanent team members for future reviews
- Keep reviews practical and actionable
- Balance thoroughness with brevity
- Always provide specific code locations and examples
- Make recommendations implementable within project constraints
