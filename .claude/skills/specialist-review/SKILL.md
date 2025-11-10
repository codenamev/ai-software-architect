---
name: specialist-review
description: Conducts a focused architectural review from a specific specialist's perspective. Use when the user requests "Ask [specialist role] to review [target]", "Get [specialist]'s opinion on [topic]", or when they want focused expertise on a specific architectural concern like security, performance, or domain design.
---

# Specialist Review

Conducts focused reviews from a specific specialist's perspective.

## Process

### 1. Parse Request
Extract:
- **Specialist role**: Which expert? (e.g., "Security Specialist", "Performance Expert", "Ruby Expert")
- **Target**: What to review? (e.g., "API authentication", "database queries", "ActiveRecord models")

### 2. Load or Create Specialist
Check `.architecture/members.yml` for the specialist.

**If exists**: Load their profile (specialties, disciplines, domains, perspective)

**If doesn't exist**: Create new member and add to members.yml:
```yaml
- id: [role_id]
  name: "[Person Name]"
  title: "[Role Title]"
  specialties: ["[Specialty 1]", "[Specialty 2]", "[Specialty 3]"]
  disciplines: ["[Discipline 1]", "[Discipline 2]"]
  skillsets: ["[Skill 1]", "[Skill 2]"]
  domains: ["[Domain 1]", "[Domain 2]"]
  perspective: "[Their unique viewpoint]"
```

Inform user: "I've added [Name] ([Title]) to your architecture team."

### 3. Analyze Target
- Locate relevant files/components
- Understand current implementation
- Identify dependencies and context
- Check for related ADRs

### 4. Conduct Review
Adopt specialist's persona. Create review document:

```markdown
# [Specialist Title] Review: [Target]

**Reviewer**: [Name], [Title]
**Target**: [What's being reviewed]
**Date**: [Date]

## Specialist Perspective
**Focus**: [What this specialist looks for based on expertise]

## Executive Summary
[2-3 sentences]

**Overall Assessment**: Excellent | Good | Adequate | Needs Improvement | Critical Issues

**Key Findings**:
- [Finding 1]
- [Finding 2]

## Current Implementation
[Description with specific file references]

**Key Components**:
- `[file:line]`: [Description]

**Pattern Used**: [Pattern name]

## Assessment

### Strengths
1. **[Strength]**: Why it matters from specialist perspective

### Concerns
1. **[Concern]** (Severity: Critical | High | Medium | Low)
   - **Issue**: [What's wrong]
   - **Location**: [file:line]
   - **Impact**: [Problems this causes]
   - **Fix**: [Specific recommendation]

### Observations
- [Neutral observation 1]
- [Neutral observation 2]

## Recommendations

### Immediate
1. **[Recommendation]**
   - **What**: [Action]
   - **Why**: [Reason]
   - **How**: [Implementation]
   - **Effort**: Small | Medium | Large

### Short-term
1. **[Recommendation]**: [Details]

### Long-term
1. **[Recommendation]**: [Details]

## Best Practices
1. **[Practice]**: [Description and how it applies]

**Industry Standards**: [Relevant standards]

## Code Examples

### Current (Problematic)
```[language]
[Example showing concern]
```
Issues: [Issue 1], [Issue 2]

### Recommended
```[language]
[Example showing improvement]
```
Benefits: [Benefit 1], [Benefit 2]

## Risks
**If not addressed**:
1. **[Risk]** (Likelihood: High/Medium/Low)
   - Impact: [Description]
   - Mitigation: [How to address]

## Follow-up
**Review Schedule**: [When to re-review]
**Success Metrics**: [How to measure improvement]
```

### 5. Save Review
Save to: `.architecture/reviews/[specialist-role]-[target].md`

Format: `[role-kebab-case]-[target-kebab-case].md`

Examples:
- `security-specialist-api-authentication.md`
- `performance-specialist-database-queries.md`

### 6. Report to User
```
[Specialist Title] Review Complete: [Target]

Reviewer: [Name]
Location: .architecture/reviews/[filename].md
Assessment: [Overall assessment]

Key Findings:
1. [Finding 1]
2. [Finding 2]

Priority Actions:
1. [Action 1]
2. [Action 2]

Critical Issues: [Count]
Recommendations: [Count]

Next Steps:
- Address critical issues immediately
- Review detailed recommendations
- [Specific next step]
```

## Common Specialists

### Security Specialist
Focus: Authentication, authorization, input validation, encryption, OWASP Top 10, secrets management, compliance

### Performance Specialist
Focus: Efficiency, query optimization, caching, resource utilization, bottlenecks, load handling

### Domain Expert
Focus: Business logic, domain models, ubiquitous language, bounded contexts, business rules

### Maintainability Expert
Focus: Code quality, documentation, testability, code smells, technical debt, refactoring

### Language/Framework Experts (Ruby, JavaScript, etc.)
Focus: Idiomatic usage, best practices, framework conventions, ecosystem patterns

## Notes
- Stay laser-focused within specialist domain
- Reference exact files and line numbers
- Provide actionable, implementable advice
- Explain "why", not just "what"
- Consider context and constraints
- New specialists become permanent team members
