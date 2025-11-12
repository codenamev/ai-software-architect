# Pragmatic Guard Mode Integration Guide

## Overview

This document provides detailed guidance on integrating the Pragmatic Guard Mode into the AI Software Architect framework. It covers the technical integration points, behavioral patterns, and usage examples.

## Integration Points

### 1. Members Configuration (members.yml)

Add the Pragmatic Enforcer to the architecture team:

```yaml
- id: pragmatic_enforcer
  name: "Pragmatic Enforcer"
  title: "YAGNI Guardian & Simplicity Advocate"
  specialties:
    - "YAGNI principles"
    - "incremental design"
    - "complexity analysis"
    - "requirement validation"
    - "minimum viable solutions"
  disciplines:
    - "scope management"
    - "cost-benefit analysis"
    - "technical debt prevention"
    - "simplification strategies"
    - "deferral decision-making"
  skillsets:
    - "identifying premature optimization"
    - "challenging unnecessary abstractions"
    - "proposing simpler alternatives"
    - "calculating cost of waiting"
    - "questioning best-practice applicability"
  domains:
    - "implementation simplicity"
    - "requirement sufficiency"
    - "appropriate complexity"
  perspective: "Rigorously questions whether proposed solutions, abstractions, and features are actually needed right now, pushing for the simplest approach that solves the immediate problem."

  # Pragmatic mode specific configuration
  mode_specific:
    # Only active when pragmatic mode is enabled
    active_when: pragmatic_mode.enabled == true

    # Can be tuned via intensity setting
    tunable: true

    # Participates in these phases (can be controlled via config)
    default_phases:
      - individual_reviews
      - collaborative_discussions
      - implementation_planning
      - adr_creation
```

### 2. Configuration System (config.yml)

Place config.yml in the project's `.architecture/` directory:

```
.architecture/
├── config.yml              # Project-specific configuration
├── members.yml            # Architecture team members
├── principles.md          # Architectural principles
├── decisions/             # ADRs and explorations
└── reviews/              # Architecture reviews
```

**Configuration Loading**:
- AI assistant checks for `.architecture/config.yml` at startup
- Falls back to `.architecture/templates/config.yml` defaults if not present
- Settings override default framework behavior

### 3. CLAUDE.md Updates

Add pragmatic mode recognition to CLAUDE.md:

```markdown
### Pragmatic Guard Mode Requests

When a user requests to enable pragmatic mode using phrases like:
- "Enable pragmatic mode"
- "Turn on YAGNI enforcement"
- "Activate simplicity guard"
- "Challenge complexity"
- "Push back on over-engineering"

Follow these steps:

1. **Check Configuration**
   - Read `.architecture/config.yml`
   - Check if pragmatic_mode.enabled is true
   - Note the intensity level (strict/balanced/lenient)

2. **Include Pragmatic Enforcer**
   - Add Pragmatic Enforcer to active reviewers
   - Apply to phases specified in config
   - Respect exemption categories

3. **Apply Question Framework**
   - For each recommendation, ask necessity questions
   - Propose simpler alternatives
   - Calculate cost of waiting
   - Provide pragmatic analysis

4. **Document Challenges**
   - Include pragmatic analysis in review documents
   - Note when recommendations are accepted despite challenges
   - Track deferred decisions if enabled
```

### 4. Review Template Updates

Add Pragmatic Enforcer section to `.architecture/templates/review-template.md`:

```markdown
### Pragmatic Enforcer Review

**Reviewer**: Pragmatic Enforcer
**Mode**: [Strict | Balanced | Lenient]

**Overall Assessment**:
[High-level assessment of the architecture's simplicity and appropriateness of complexity]

**Strengths**:
- [Areas where simplicity is maintained]
- [Good examples of appropriate complexity]
- [Well-justified abstractions]

**Concerns**:
- [Areas of potentially unnecessary complexity]
- [Abstractions that may be premature]
- [Features that might be YAGNI]

**Challenges to Other Members' Recommendations**:

#### Challenge to Systems Architect
**Original Recommendation**: [Quote from Systems Architect]

**Necessity Assessment**: [Score 0-10]
- Current need: [Analysis]
- Future need: [Analysis]
- Cost of waiting: [Analysis]

**Complexity Assessment**: [Score 0-10]
- Added complexity: [Details]
- Maintenance burden: [Details]
- Learning curve: [Details]

**Simpler Alternative**:
[Concrete simpler proposal]

**Recommendation**: [Implement now | Simplified version | Defer | Skip]

**Justification**: [Reasoning]

---

[Repeat for each member's significant recommendations]

**Recommendations**:
1. [Recommendation 1 with priority]
2. [Recommendation 2 with priority]
3. [...]
```

### 5. ADR Template Updates

Add pragmatic analysis section to `.architecture/templates/adr-template.md`:

```markdown
## Pragmatic Analysis

[Include this section when pragmatic mode is enabled]

### Necessity Assessment

**Current Need**: [0-10 score]
- Why this decision is needed now: [Explanation]
- What breaks without it: [Impact analysis]
- Requirements driving this: [List requirements]

**Future Need**: [0-10 score]
- Likelihood of needing this: [Probability]
- Timeframe when needed: [Estimate]
- Indicators that will trigger need: [List indicators]

**Cost of Waiting**: [Low | Medium | High]
- Technical cost of deferring: [Analysis]
- Business cost of deferring: [Analysis]
- Opportunity cost: [Analysis]

### Complexity Assessment

**Complexity Score**: [0-10]
- New abstractions: [List with justification]
- New dependencies: [List with justification]
- New patterns: [List with justification]
- Lines of code estimate: [Estimate]
- Files affected: [Count and list major ones]

**Maintenance Burden**: [Low | Medium | High]
- Ongoing maintenance effort: [Analysis]
- Documentation requirements: [Analysis]
- Testing requirements: [Analysis]

**Learning Curve**: [Low | Medium | High]
- New concepts to learn: [List]
- Time for developer onboarding: [Estimate]
- Prerequisite knowledge: [List]

### Simpler Alternatives

**Alternative 1: [Name]**
- Description: [How this is simpler]
- Trade-offs: [What we give up]
- When to reconsider: [Conditions for revisiting]

**Alternative 2: [Name]**
- Description: [How this is simpler]
- Trade-offs: [What we give up]
- When to reconsider: [Conditions for revisiting]

### Deferral Option

**Can this be deferred?**: [Yes | No | Partially]

If yes or partially:
- What can be built now without this: [Description]
- Clear trigger for implementing later: [Specific conditions]
- Refactoring cost estimate: [Effort to add later]
- Decision: [Implement now | Implement simplified | Defer]

### Pragmatic Recommendation

[Final recommendation from Pragmatic Enforcer perspective with clear reasoning]
```

## Behavioral Patterns

### Pattern 1: Challenge and Response

**Architect makes recommendation** → **Pragmatic Enforcer challenges** → **Collaborative discussion** → **Final decision**

Example:
```
Security Specialist: "Implement OAuth2 + JWT + SAML authentication"
                              ↓
Pragmatic Enforcer: "Do we need all three? Current requirements show
                    only JWT for API auth. Suggest starting with JWT,
                    adding others when needed. Cost of waiting: zero."
                              ↓
Collaborative Discussion: "Security Specialist: Valid point. However,
                          client has mentioned possible partner integrations.
                          Pragmatic Enforcer: Can we defer until those
                          integrations are confirmed? Hard cost vs. soft
                          possibility."
                              ↓
Final Decision: "Implement JWT now. Document SAML as deferred decision
                with trigger: 'when partner integration is confirmed'.
                Track in deferrals.md"
```

### Pattern 2: Intensity-Based Behavior

**Strict Mode**:
```
Architect: "Add caching layer for performance"
Pragmatic Enforcer: "❌ Do we have evidence of performance problems?
                     Without profiling data, this is premature optimization.
                     RECOMMENDATION: Profile first, optimize specific
                     bottlenecks if found."
```

**Balanced Mode**:
```
Architect: "Add caching layer for performance"
Pragmatic Enforcer: "⚠️  Caching adds complexity. Do we have performance
                     requirements or measured problems? If so, suggest
                     starting with simple in-memory cache for hotspots
                     rather than full Redis infrastructure.
                     RECOMMENDATION: Measure, then add simplest caching
                     that solves proven problems."
```

**Lenient Mode**:
```
Architect: "Add caching layer for performance"
Pragmatic Enforcer: "ℹ️  Consider whether caching is needed now. If
                     implementing, suggest starting simple. Full Redis
                     setup might be more than needed initially.
                     RECOMMENDATION: Architect's suggestion is reasonable,
                     but watch for over-engineering."
```

### Pattern 3: Exemption Handling

Security-critical features bypass aggressive challenges:

```yaml
# config.yml
exemptions:
  security_critical: true
```

```
Security Specialist: "Implement comprehensive input validation,
                     parameterized queries, and output encoding"

Pragmatic Enforcer: "✓ Security-critical - exemption applies.
                     These are fundamental security controls.
                     RECOMMENDATION: Implement as specified.

                     However, suggest phasing:
                     - Phase 1: Core validation and parameterized queries
                     - Phase 2: Output encoding for all render paths

                     This allows thorough implementation without rushing."
```

## Usage Examples

### Example 1: Enabling Pragmatic Mode

**User**: "Enable pragmatic mode to help keep our codebase simple"

**Claude Response**:
```
I'll enable Pragmatic Guard Mode for your architecture reviews.

Reading .architecture/config.yml...

Current settings:
- Mode: balanced (challenges thoughtfully, accepts justified complexity)
- Applies to: reviews, planning, ADRs
- Exemptions: security, data integrity, compliance
- Tracking: deferrals will be logged to .architecture/deferrals.md

The Pragmatic Enforcer will now participate in architecture discussions,
challenging complexity and proposing simpler alternatives. This helps
guard against over-engineering while still maintaining quality where
it matters.

Would you like to adjust the intensity level (strict/balanced/lenient)
or modify any other settings?
```

### Example 2: Architecture Review with Pragmatic Mode

**User**: "Start architecture review for version 2.0.0"

**Claude conducts review including Pragmatic Enforcer**:

```markdown
## Individual Perspectives

### Systems Architect Review
[... standard review ...]

**Recommendations**:
1. Implement service mesh for microservices communication
2. Add API gateway for request routing
3. Implement distributed tracing

### Pragmatic Enforcer Review

**Mode**: Balanced

**Overall Assessment**:
The Systems Architect recommendations are solid for a mature
microservices architecture, but we need to question whether we're
at that scale yet. Current system has 3 services. This is ambitious
infrastructure for our current scale.

**Challenges**:

#### Challenge to Service Mesh Recommendation

**Original Recommendation**: Implement service mesh for microservices communication

**Necessity Assessment**: 3/10
- Current need: Have 3 services with simple REST communication
- Future need: May need if we scale to many services
- Cost of waiting: Near zero - can add when service count increases

**Complexity Assessment**: 9/10
- Added complexity: New infrastructure, learning curve, debugging complexity
- Maintenance burden: Mesh configuration, version management
- Learning curve: Team must learn Istio/Linkerd concepts

**Simpler Alternative**:
For 3 services, use simple HTTP clients with retry logic. Add service
mesh when we have 10+ services or need advanced routing.

**Recommendation**: ☑ Defer until needed

**Trigger for implementation**: When service count > 10 or when we need
circuit breakers, advanced routing, or mTLS between services.

[... challenges to other recommendations ...]

**Summary Recommendations**:
1. ☑ Defer service mesh (document in deferrals.md)
2. ⚠️  Implement lightweight API gateway (simpler alternative: nginx)
3. ☑ Skip distributed tracing for now (add when debugging is difficult)
```

### Example 3: ADR with Pragmatic Analysis

**User**: "Create ADR for adding authentication system"

**Claude creates ADR with pragmatic section**:

```markdown
# ADR-005: Authentication System

## Context
Need to add user authentication to the application...

## Decision
Implement JWT-based authentication with role-based access control...

## Pragmatic Analysis

### Necessity Assessment

**Current Need**: 9/10
- Why needed now: Core requirement for MVP, blocking other features
- What breaks without it: Cannot deploy - no way to secure user data
- Requirements driving this: Security requirement, user stories 1-5

**Trigger**: ✓ This must be implemented now

### Complexity Assessment

**Complexity Score**: 6/10
- New abstractions: Auth middleware, token service, user service
- New dependencies: jsonwebtoken, bcrypt
- New patterns: Middleware pattern, JWT flow
- Estimated effort: 3-4 days

**Maintenance Burden**: Medium
- Need to maintain token refresh logic
- Need to handle token expiration
- Need to update user roles

### Simpler Alternatives

**Alternative 1: Basic Authentication**
- Description: Use HTTP Basic Auth for initial release
- Trade-offs: Less secure, no token refresh, but simpler
- When to reconsider: Before any public deployment
- Assessment: ❌ Not acceptable for security requirements

**Alternative 2: Simplified JWT (no refresh tokens initially)**
- Description: Implement JWT with longer expiration, add refresh later
- Trade-offs: Less secure but significantly simpler to implement
- When to reconsider: When users report logout issues
- Assessment: ✓ Viable simplification

**Alternative 3: Use OAuth provider (Auth0, Firebase)**
- Description: Delegate authentication to third-party provider
- Trade-offs: External dependency, but much less code to maintain
- When to reconsider: If we need custom auth flows
- Assessment: ✓ Consider for MVP

### Pragmatic Recommendation

**Recommendation**: Implement Simplified Alternative 2

**Reasoning**:
Authentication is clearly needed (necessity: 9/10). However, we can
reduce complexity by:

1. Start with JWT without refresh tokens (add refresh in v2)
2. Use longer expiration (24h) for MVP
3. Simple role-based auth (admin/user only initially)

This cuts implementation time in half while meeting core requirements.
We can add refresh tokens when user sessions become a pain point.

**Deferred**: Token refresh logic
**Trigger**: User complaints about frequent re-login OR security audit
```

## Best Practices

### When to Use Strict Mode

- Greenfield projects starting from scratch
- Projects with history of over-engineering
- Time-constrained projects (MVPs, prototypes)
- Projects with junior team (need to learn simplicity)

### When to Use Balanced Mode (Recommended)

- Most projects
- Teams with mix of experience levels
- Projects with both immediate and future needs
- When you want guidance without rigid enforcement

### When to Use Lenient Mode

- Mature projects with established patterns
- Projects approaching scale where complexity is justified
- Teams experienced in making these trade-offs
- When you want awareness without active challenges

### When to Disable Pragmatic Mode

- Security-critical systems where defense-in-depth is required
- Systems with strict compliance requirements
- Projects where upfront architectural investment is justified
- When technical debt is already high and cleanup is the goal

## Troubleshooting

### Issue: Pragmatic Enforcer too aggressive

**Solution**: Lower intensity or adjust thresholds

```yaml
pragmatic_mode:
  intensity: lenient  # or balanced if using strict
  thresholds:
    min_complexity_score: 7  # only challenge high complexity
```

### Issue: Pragmatic Enforcer not challenging enough

**Solution**: Increase intensity or lower thresholds

```yaml
pragmatic_mode:
  intensity: strict
  thresholds:
    min_complexity_score: 3  # challenge even low complexity
    min_necessity_score: 8   # require strong justification
```

### Issue: Conflicts with other architects

**Solution**: Review collaborative discussion, ensure exemptions are set correctly

```yaml
exemptions:
  security_critical: true  # Security Specialist wins on security
  data_integrity: true     # Domain Expert wins on data issues
```

### Issue: Too much analysis paralysis

**Solution**: Reduce scope of application

```yaml
apply_to:
  individual_reviews: true
  collaborative_discussions: false  # Skip to reduce back-and-forth
  implementation_planning: true
  adr_creation: false  # Skip to speed up decisions
```

## Migration Guide

### Step 1: Add to Existing Project

```bash
# Copy template config to your project
cp .architecture/templates/config.yml .architecture/config.yml

# Edit to enable pragmatic mode
vim .architecture/config.yml
# Set: pragmatic_mode.enabled: true
```

### Step 2: Test with Single Review

```bash
# Request a focused review to test the mode
"Have the architecture team review this authentication module"
```

### Step 3: Adjust Based on Feedback

- Too aggressive? Lower intensity
- Not helpful? Adjust triggers and thresholds
- Wrong areas? Modify apply_to settings

### Step 4: Adopt Fully

- Update CLAUDE.md with project-specific guidance
- Train team on pragmatic mode philosophy
- Establish team norms for challenge/response patterns

## Conclusion

The Pragmatic Guard Mode integrates into the existing AI Software Architect framework through:

1. **Configuration**: `config.yml` controls behavior
2. **Member Addition**: Pragmatic Enforcer joins the team
3. **Template Updates**: Review and ADR templates include pragmatic sections
4. **Behavioral Patterns**: Defined interaction patterns with other architects
5. **Usage Guidance**: Clear examples and best practices

The mode is designed to be:
- **Opt-in**: Disabled by default, enable when needed
- **Tunable**: Intensity and thresholds adjust to project needs
- **Respectful**: Exemptions ensure security/compliance aren't compromised
- **Practical**: Focus on real value, not theoretical purity

Use pragmatic mode to keep your AI assistant focused on building what you need, when you need it, without over-engineering.
