# Pragmatic Guard Mode: Usage Examples

This document provides concrete, real-world examples of using Pragmatic Guard Mode to prevent over-engineering and maintain simplicity in AI-assisted development.

## Table of Contents

1. [Setup and Activation](#setup-and-activation)
2. [Architecture Review Examples](#architecture-review-examples)
3. [Specific Architect Review Examples](#specific-architect-review-examples)
4. [ADR Creation Examples](#adr-creation-examples)
5. [Implementation Planning Examples](#implementation-planning-examples)
6. [Intensity Level Examples](#intensity-level-examples)
7. [Conflict Resolution Examples](#conflict-resolution-examples)
8. [Exemption Examples](#exemption-examples)

---

## Setup and Activation

### Example 1: First-Time Setup

**User**:
```
Enable pragmatic mode for this project
```

**Claude**:
```
I'll enable Pragmatic Guard Mode for your project.

Setting up pragmatic mode...

✓ Created .architecture/config.yml from template
✓ Set pragmatic_mode.enabled: true
✓ Using default intensity: balanced
✓ Created .architecture/deferrals.md for tracking deferred decisions
✓ Pragmatic Enforcer added to architecture team

Configuration summary:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Mode: Balanced
  - Challenges thoughtfully
  - Accepts justified complexity
  - Seeks middle ground

Applies to:
  ✓ Architecture reviews
  ✓ Implementation planning
  ✓ ADR creation
  ✓ Specific architect reviews

Exemptions (always rigorous):
  ✓ Security-critical features
  ✓ Data integrity requirements
  ✓ Compliance requirements
  ✓ Accessibility requirements

Pragmatic mode is now active. The Pragmatic Enforcer will
participate in architecture discussions, challenging complexity
and proposing simpler alternatives.

Would you like to adjust any settings or proceed with your next task?
```

### Example 2: Adjusting Intensity

**User**:
```
I want strict pragmatic mode - really push back on any complexity
```

**Claude**:
```
I'll update the configuration to use strict mode.

Updated .architecture/config.yml:
  pragmatic_mode.intensity: strict

Strict mode characteristics:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  - Challenges aggressively
  - Requires strong justification for any complexity
  - Pushes for absolute minimal implementation
  - Questions every "should" and "could"
  - Default recommendation: simplify or defer

This mode is best for:
  • Greenfield projects
  • MVP/prototype development
  • Projects with tight deadlines
  • Learning to embrace simplicity

Note: Security, compliance, and data integrity areas
still receive appropriate rigor due to exemptions.

Strict pragmatic mode is now active.
```

---

## Architecture Review Examples

### Example 3: New Feature Review (E-commerce Checkout)

**User**:
```
Review the architecture for our new checkout feature
```

**Claude conducts review with Pragmatic Enforcer**:

```markdown
# Architecture Review: Checkout Feature

## Systems Architect Review

**Recommendation**:
Implement comprehensive checkout service with:
- Payment gateway abstraction (support Stripe, PayPal, Square)
- Order state machine with full event history
- Inventory reservation system with distributed locks
- Async order processing with message queue
- Retry logic with exponential backoff
- Dead letter queue for failed orders
- Idempotency handling
- Webhook support for payment notifications

**Complexity**: High
**Benefits**: Production-ready, scalable solution

---

## Pragmatic Enforcer Review

**Mode**: Balanced

### Challenge to Systems Architect

**Original Recommendation**:
"Implement comprehensive checkout service with payment gateway abstraction..."

**Analysis**:

Necessity Assessment: 5/10
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Current need:
  • Need checkout: YES (10/10)
  • Need multiple payment gateways: UNCERTAIN (we're starting with Stripe only)
  • Need full state machine: UNCERTAIN (current flow is linear)
  • Need message queue: UNCERTAIN (current volume < 100 orders/day)

Future need:
  • Multiple gateways: Maybe, but no timeline
  • Complex state transitions: Possible if returns/exchanges added
  • High volume requiring async: Not for 6+ months

Cost of waiting:
  • Payment abstraction: LOW - can extract interface when adding 2nd gateway
  • Message queue: LOW - can add when volume increases
  • Full state machine: MEDIUM - refactoring state logic later has some cost

Complexity Assessment: 8/10
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Added complexity:
  • Payment abstraction: 3 interfaces, multiple implementations
  • State machine: ~200 LOC for states/transitions
  • Message queue: New infrastructure, deployment complexity
  • Retry/DLQ: Error handling complexity

Maintenance burden: HIGH
  • Unused payment gateways to maintain
  • State machine logic to maintain
  • Message queue monitoring and debugging
  • Testing all error paths

Learning curve: MEDIUM-HIGH
  • New developers must understand abstraction
  • State machine patterns
  • Async processing implications

Simpler Alternative
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Phase 1 (implement now):
  • Direct Stripe integration
  • Simple status field: pending → confirmed → fulfilled
  • Synchronous order processing
  • Basic error handling with customer notification
  • Webhook for Stripe payment confirmation

Defer to Phase 2 (when needed):
  • Payment abstraction → when we add 2nd gateway
  • Complex state machine → when we add returns/cancellations
  • Async processing → when volume > 500 orders/day
  • Advanced retry logic → when we see specific failure patterns

Benefits of simpler approach:
  ✓ 1 week vs. 3 weeks implementation
  ✓ ~500 LOC vs. ~2000 LOC
  ✓ Easier to test and debug
  ✓ Faster to market
  ✓ Learn from real usage before over-architecting

Recommendation: ⚠️  Implement Simplified Version
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Justification:
This is a new feature with uncertain requirements. The comprehensive
solution solves problems we don't have yet. Starting simple lets us:
1. Launch faster and start learning from real orders
2. Understand actual failure modes before building retry logic
3. See if we actually need multiple payment methods
4. Add complexity based on real needs, not speculation

The suggested Phase 1 is production-ready and handles the actual
requirement: "let customers pay and receive their orders."

Deferred decisions tracked in .architecture/deferrals.md:
  • Payment gateway abstraction
  • Order state machine
  • Asynchronous order processing
```

**Collaborative Discussion**:
```markdown
## Collaborative Discussion

Systems Architect:
"I see the pragmatic concerns. However, we've discussed supporting
PayPal in Q2. Wouldn't we have to refactor if we build Stripe-specific?"

Pragmatic Enforcer:
"Q2 discussion isn't a commitment. But if it is committed: we can
still start simple. Adding a payment interface when we add PayPal
(~3 days) is cheaper than maintaining unused abstraction for 3 months
(~5 days of cognitive overhead, testing, documentation).

If PayPal gets cancelled or delayed, we saved all that effort."

Domain Expert:
"We should consider order state carefully. Returns and exchanges are
planned for Q3."

Pragmatic Enforcer:
"Agreed that's real. But Q3 is when we should add complex state handling.
Q1 needs: place order, confirm payment, fulfill order. Simple status
flow handles this. We'll learn from Q1 what states Q3 actually needs."

Security Specialist:
"The webhook handling for Stripe needs to be secure - idempotency,
signature verification, etc."

Pragmatic Enforcer:
"✓ Agreed - security is exempt from aggressive simplification. Proper
webhook handling is part of Phase 1. Not suggesting we skip security."

## Final Consolidated Recommendation

**Decision**: Implement Phase 1 (simplified version)

**Rationale**:
- Core checkout requirement met immediately
- Security maintained appropriately
- Can ship in 1 week vs 3 weeks
- Learn from real usage before committing to architecture
- Clear triggers for adding Phase 2 features
- Refactoring cost is acceptable given uncertainty

**Deferred to Phase 2** (triggers in deferrals.md):
- Payment gateway abstraction → when PayPal confirmed
- Complex state machine → when returns feature starts development
- Async processing → when orders > 500/day sustained
```

### Example 4: Performance Optimization Review

**User**:
```
Review our API performance optimizations
```

**Systems Architect**:
```
Recommend implementing:
- Redis caching layer with cache warming
- Database query optimization and indexing
- GraphQL to reduce over-fetching
- CDN for static assets
- Response compression
- Connection pooling
- Load balancing
```

**Pragmatic Enforcer (Strict Mode)**:
```markdown
## Pragmatic Enforcer Analysis

**Mode**: Strict

⛔ Strong Challenge to All Performance Optimizations

Question 1: Do we have a performance problem?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  • Current metrics: Not provided
  • User complaints: None mentioned
  • Response time targets: Not defined
  • Evidence of bottlenecks: None presented

Result: Cannot justify optimization without evidence

Question 2: Have we measured?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  • Profiling data: None
  • Slow query log analysis: None
  • Response time percentiles: Unknown
  • Resource utilization: Unknown

Result: Don't know what to optimize

"Premature optimization is the root of all evil" - Donald Knuth

Necessity Assessment: 1/10
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
No evidence of need. This is speculative optimization.

Complexity Assessment: 9/10
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  • Redis: New infrastructure, cache invalidation complexity
  • GraphQL: Major API redesign, different query patterns
  • CDN: Additional service, cache invalidation challenges
  • Others: Less complex but still added moving parts

Required Alternative: Measure First
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Step 1: Add observability (1-2 days)
  • Add response time logging
  • Track P50, P95, P99 latencies
  • Log slow queries (>100ms)
  • Monitor resource usage

Step 2: Set targets (1 day)
  • Define acceptable response times
  • Identify critical endpoints
  • Establish SLAs

Step 3: Measure against targets (1 week)
  • Collect real usage data
  • Identify actual bottlenecks
  • Find slow queries

Step 4: Optimize proven bottlenecks (if needed)
  • Add specific database indexes for slow queries
  • Optimize N+1 query patterns
  • Cache only expensive operations
  • Use simplest solution for each bottleneck

Estimated effort: 2 weeks vs 6 weeks for proposed solution
Added complexity: Minimal vs High

Strong Recommendation: ❌ Skip Optimizations, Add Measurement
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Justification:
Without evidence of performance problems, these optimizations are
premature. They add significant complexity that will hinder future
development without proven benefit.

Add measurement first. If we find performance problems, optimize
the specific bottlenecks with targeted solutions.

This is a textbook case of YAGNI.
```

---

## Specific Architect Review Examples

### Example 5: Security Review with Pragmatic Mode

**User**:
```
Ask Security Specialist to review our authentication implementation
```

**Security Specialist**:
```
I recommend:
- JWT with refresh tokens
- Token rotation on each refresh
- Refresh token family tracking for breach detection
- Device fingerprinting
- Rate limiting on all auth endpoints
- Account lockout after failed attempts
- 2FA support
- Security headers (CSP, HSTS, etc.)
- Session fixation protection
- CSRF tokens for state-changing operations
```

**Pragmatic Enforcer (Balanced Mode)**:
```markdown
## Pragmatic Enforcer Analysis

**Mode**: Balanced

⚠️  Partial Challenge (Security Exempt but Phasing Suggested)

Security is exempt from aggressive simplification. However,
we can question implementation *phasing* without compromising security.

Core Security (Implement Now - Phase 1):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ JWT with appropriate expiration
✅ Secure password hashing (bcrypt/argon2)
✅ HTTPS only (enforce)
✅ Basic rate limiting (prevent brute force)
✅ Security headers (CSP, HSTS, X-Frame-Options)
✅ CSRF protection
✅ Input validation

Justification: These are fundamental security controls. Not negotiable.
Estimated effort: 3-4 days

Enhanced Security (Phase 2 - Defer until):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏸️  Refresh tokens → Add when JWT expiration causes UX issues
⏸️  Token rotation → Add with refresh tokens
⏸️  Device fingerprinting → Add if account takeover issues occur
⏸️  2FA → Add when enterprise customers require it OR after launch

Justification:
These are valuable security enhancements but add complexity.
They can be added based on actual requirements and threat patterns.

Balanced Recommendation: ⚠️  Phase the Implementation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Phase 1 (now): Core security - production-ready
Phase 2 (when needed): Enhanced features based on requirements

This maintains strong security while avoiding complexity that
may not be needed. Security isn't compromised, but implementation
is right-sized.

Important: If threat model indicates higher risk (e.g., financial
data, healthcare), implement all recommendations now.
```

### Example 6: Performance Review - Database Schema

**User**:
```
Ask Performance Specialist to review our database schema for the user profiles feature
```

**Performance Specialist**:
```
Recommendations:
- Add indexes on all foreign keys
- Add composite indexes for common query patterns
- Implement database partitioning for user table
- Use materialized views for dashboard queries
- Add read replicas for scaling
- Implement connection pooling
- Use database-level caching
```

**Pragmatic Enforcer (Balanced Mode)**:
```markdown
## Pragmatic Enforcer Challenge

Question: Do we have query performance data?

If no → Implement with basic indexes, measure, optimize as needed
If yes → Challenge specific recommendations based on data

Assuming no data yet (new feature):

Basic Indexes (Implement Now):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Primary keys (automatic)
✅ Foreign keys (prevents slow joins)
✅ Unique constraints as needed

Complexity: Minimal
Cost: Negligible
Benefit: Prevents obviously slow queries

Wait and Measure (Defer):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏸️  Composite indexes → Add when slow query log shows specific queries
⏸️  Partitioning → User table would need millions of rows to benefit
⏸️  Materialized views → Add when dashboard queries are slow
⏸️  Read replicas → Add when primary DB CPU > 70%

Reasoning:
- Composite indexes: Need actual query patterns to design effectively
- Partitioning: Adds complexity, only helps at massive scale
- Materialized views: Adds refresh complexity, only needed if queries slow
- Read replicas: Infrastructure complexity, only needed at scale

Pragmatic Approach:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Implement with basic indexes
2. Add slow query logging (log queries > 100ms)
3. Monitor for 2 weeks after launch
4. Add specific indexes for slow queries found
5. Revisit scaling options if DB becomes bottleneck

Recommendation: ⚠️  Start Simple, Optimize Based on Data

This is responsible performance engineering: measure, then optimize.
```

---

## ADR Creation Examples

### Example 7: ADR for API Design

**User**:
```
Create ADR for our public API design
```

**Claude creates ADR with pragmatic analysis**:

```markdown
# ADR-003: Public API Design

## Status

Proposed

## Context

We need to expose a public API for third-party integrations...

## Decision

Implement RESTful API with:
- Resource-based URLs
- Standard HTTP methods
- JSON request/response
- API key authentication
- Basic rate limiting

## Pragmatic Analysis

### Necessity Assessment

**Current Need**: 9/10
✅ Core requirement for partner integrations
✅ Blocking Q1 launch commitments
✅ Clear use cases defined

**This must be implemented now.**

### Complexity Assessment

**Original proposal included:**
- REST + GraphQL endpoints
- Versioning strategy (URL-based + header-based)
- OAuth2 + API keys
- Advanced rate limiting (per-endpoint, per-resource)
- Request/response transformation layer
- API gateway with routing rules

**Complexity score**: 8/10

### Simpler Alternative

**Phase 1 (MVP):**
```
Implement:
  ✅ REST endpoints for core resources
  ✅ JSON request/response
  ✅ API key authentication
  ✅ Simple rate limiting (1000 req/hour per key)
  ✅ Basic versioning (URL-based: /v1/)
  ✅ Standard error responses

Defer:
  ⏸️  GraphQL → when partners request it
  ⏸️  OAuth2 → when partners need user-context access
  ⏸️  Advanced rate limiting → when abuse detected
  ⏸️  API gateway → when we have multiple backend services

Estimated effort: 2 weeks vs 6 weeks for full proposal
Complexity: Moderate vs High
```

### Cost of Waiting Analysis

**GraphQL**:
- Cost of adding now: 2 weeks + ongoing maintenance
- Cost of adding later: 1 week (we'll know required queries)
- Cost of waiting: Zero unless partners specifically request it
- **Decision**: Wait for requirement

**OAuth2**:
- Cost of adding now: 2 weeks + complexity in all API calls
- Cost of adding later: 1.5 weeks + migration path
- Cost of waiting: May block some enterprise integrations
- **Decision**: Defer, but document trigger clearly

**Advanced rate limiting**:
- Cost of adding now: 1 week + complexity
- Cost of adding later: 3 days for specific limits needed
- Cost of waiting: Risk of abuse (mitigated by basic limits)
- **Decision**: Defer, monitor for abuse

### Pragmatic Recommendation

✅ **Implement Phase 1 (simplified version)**

**Reasoning**:
The Phase 1 API is production-ready and meets all confirmed requirements.
Additional features can be added when partners demonstrate need.

Building for imagined API use cases often leads to wrong abstractions.
Better to learn from partner usage, then extend based on real patterns.

**Clear triggers for Phase 2 features** (document in deferrals.md):
- GraphQL → when 3+ partners request it
- OAuth2 → when partner needs user-context operations
- Advanced rate limiting → when abuse detected or requested
- API gateway → when coordinating multiple services

## Alternatives Considered

### Alternative 1: GraphQL Only
...

### Alternative 2: Full-Featured from Start
(This was challenged by Pragmatic Enforcer above)

## Decision

Implement Phase 1 RESTful API as described in Pragmatic Analysis.
Track Phase 2 features in deferrals.md with clear triggers.
```

---

## Implementation Planning Examples

### Example 8: Feature Implementation Plan

**User**:
```
Plan the implementation of our notification system
```

**Developer's Initial Plan**:
```
1. Set up message queue (RabbitMQ or Kafka)
2. Build notification service
3. Implement email, SMS, and push notification providers
4. Add notification preferences per user
5. Build notification template system
6. Add notification history and read status
7. Implement delivery retry logic
8. Add webhook support for delivery status
```

**Pragmatic Enforcer Review**:
```markdown
## Pragmatic Analysis of Implementation Plan

Question: What notifications do we actually need for MVP?

[After discussion, need is: password reset emails]

Significant Challenge: ⛔ This plan is over-engineered by 10x
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Current plan effort: 3-4 weeks
Actual requirement: Send password reset emails
Reasonable implementation: 2-3 days

Necessity Assessment:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Need notification system: NO
  Need to send password reset emails: YES
  Need other notification types: UNCONFIRMED

Massively Simplified Alternative:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For MVP (2-3 days):
```javascript
// utils/email.js
const sendEmail = async (to, subject, html) => {
  // Use SendGrid/Mailgun/SES directly
  await emailService.send({ to, subject, html });
};

// Email templates as simple functions
const passwordResetEmail = (resetLink) => {
  return {
    subject: 'Reset Your Password',
    html: `<p>Click here to reset: ${resetLink}</p>`
  };
};
```

That's it. This handles the requirement.

When to add notification "system":
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ⏸️  Message queue → when we need async/batch sending (volume > 1000/hour)
  ⏸️  Multiple providers → when we add SMS, push (confirmed requirement)
  ⏸️  Template system → when we have 10+ email types
  ⏸️  Notification history → when users ask "what emails did you send me?"
  ⏸️  Preference management → when we have marketing emails
  ⏸️  Webhooks → when we need delivery tracking

Revised Implementation Plan:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Phase 1 - Now (2-3 days):
  1. ✅ Integrate SendGrid/Mailgun for transactional email
  2. ✅ Create passwordResetEmail template function
  3. ✅ Send email in password reset flow
  4. ✅ Basic error handling

Phase 2 - When needed (deferred):
  • Notification service → when adding non-email channels
  • Template system → when we have many email types
  • History/preferences → when users need control
  • Advanced features → based on actual requirements

Savings: ~3 weeks of implementation time
         ~2000 LOC of maintenance burden avoided (until needed)

Strong Recommendation: ✅ Implement Phase 1 Only

This is a classic case of building a "system" when a few
functions would suffice. Start simple, extract patterns
when you have several real examples to inform the design.
```

---

## Intensity Level Examples

### Example 9: Same Scenario, Different Intensities

**Scenario**: Adding logging to the application

**Systems Architect Recommends**:
```
Implement structured logging with:
- Centralized logging service (ELK stack or Datadog)
- Correlation IDs across services
- Log levels with filtering
- JSON structured logs
- Log sampling for high-volume endpoints
- PII scrubbing
- Log retention policies
```

#### Strict Mode Response:

```markdown
❌ Strong Challenge

Do we have a logging problem? NO.
Do we have more than one service? NO.
Do we have high volume? NO.

This is massive over-engineering.

Simplest Alternative:
  • Use console.log with timestamps
  • Add to error handling
  • That's it for MVP

Add proper logging when:
  • Multiple services need correlation
  • Debugging becomes difficult
  • Compliance requires log retention

Strong Recommendation: Skip most of this, use basic logging

Effort saved: 2 weeks
Complexity avoided: Very high
```

#### Balanced Mode Response:

```markdown
⚠️  Thoughtful Challenge

The comprehensive logging system is valuable but may be premature.

Balanced Approach:

Phase 1 (implement now):
  ✅ Use logging library (winston/pino)
  ✅ Structured JSON logs
  ✅ Basic log levels
  ✅ Console output (for now)

Phase 2 (when needed):
  ⏸️  Centralized service → when debugging across environments is difficult
  ⏸️  Correlation IDs → when we have multiple services
  ⏸️  Sampling → when log volume becomes a cost issue
  ⏸️  PII scrubbing → when we log user data

Recommendation: Implement Phase 1, defer Phase 2

Reasoning:
Structured logging is low-effort foundation that doesn't lock us in.
Full infrastructure can wait until we have the problem it solves.
```

#### Lenient Mode Response:

```markdown
ℹ️  Consideration

The logging approach is reasonable. Some thoughts:

Observations:
  • ELK/Datadog setup is significant infrastructure
  • Most features are valuable but may not be day-1 needs
  • Consider starting with managed solution

Suggestion:
Perhaps start with simpler logging service (Logtail, Papertrail)
and upgrade to full ELK stack if needs become more complex?

Recommendation: Architect's approach is reasonable

The comprehensive plan is solid. Just noting there might be
simpler options to get similar value with less infrastructure
management.
```

---

## Conflict Resolution Examples

### Example 10: Pragmatic Enforcer vs. Security Specialist

**Context**: Pragmatic Enforcer challenges security recommendation

**Security Specialist**:
```
All API endpoints must have rate limiting, even internal ones
```

**Pragmatic Enforcer (Strict Mode)**:
```
⏸️  Challenge: Internal endpoints don't face external threats
   Recommendation: Skip rate limiting for internal endpoints
```

**Resolution**:
```markdown
## Collaborative Discussion

Security Specialist:
"Internal endpoints can still be abused if any service is compromised.
Defense in depth requires protection at all layers."

Pragmatic Enforcer:
"Valid point. However, which is more likely:
a) Service compromise leading to API abuse, or
b) We never experience internal abuse

If (a), we have bigger problems than missing rate limits.
If (b), we maintained unused code."

Security Architect:
"I see the pragmatic argument, but security isn't just about
likelihood—it's about impact. A compromised internal service
could cause system-wide damage."

Pragmatic Enforcer:
"Acknowledged. This falls under 'security_critical' exemption
in the config. I withdraw the challenge for security-related
rate limiting."

## Resolution

✅ Implement rate limiting for all endpoints

Reasoning:
Security exemption applies. While the pragmatic analysis about
likelihood is valid, the security defense-in-depth principle
takes precedence for security-related features.

Updated config.yml exemption: security_critical: true
```

### Example 11: Pragmatic Enforcer vs. Systems Architect

**Context**: Disagreement about abstraction layer

**Systems Architect**:
```
Add repository pattern to abstract data access
```

**Pragmatic Enforcer**:
```
⏸️  We have one data source (PostgreSQL). Why abstract?
```

**Collaborative Discussion**:
```markdown
Systems Architect:
"Repository pattern provides:
1. Testability (mock data layer)
2. Flexibility (could swap databases)
3. Clean separation of concerns"

Pragmatic Enforcer:
"Let's evaluate each justification:

1. Testability:
   - Can already test with test database
   - Repository adds mocking complexity
   - Is mocking better than test DB?

2. Flexibility:
   - Are we actually going to swap databases?
   - If yes, when and for what reason?
   - What's the cost of refactoring if we do?

3. Separation of concerns:
   - This is valid
   - But what does it cost?
   - ~100 LOC per entity, ~500 LOC total

Is the abstraction worth 500 LOC?"

Systems Architect:
"Those are fair questions. We're not planning to swap databases.
Testability can use test DB. The separation is nice but perhaps
not essential for our 5 domain entities."

Domain Expert:
"I'm more concerned about domain logic leaking into data access.
Could we just separate concerns without full repository pattern?"

Pragmatic Enforcer:
"Yes. Simple separation:
```javascript
// domain/user.js - business logic
class User {
  canPurchase() { /* rules */ }
}

// data/userQueries.js - data access
const findUser = (id) => db.query(...)

// No repository interface, just separated
```

This gives separation without abstraction overhead."

## Resolution

✅ Implement simple separation (not full repository pattern)

Reasoning:
- Achieve core goal (separation) with less complexity
- Avoid premature abstraction
- Can extract repository pattern later if needed
- Start with concrete implementation, abstract when patterns emerge

Deferred: Repository pattern
Trigger: When we need to swap data sources OR when testing
         with real database becomes problematic
```

---

## Exemption Examples

### Example 12: Security Exemption (GDPR Compliance)

**Context**: GDPR data handling requirements

**User**:
```
We need to implement GDPR data export and deletion
```

**Systems Architect**:
```
Implement:
- Data export in machine-readable format
- Cascading deletion across all systems
- Audit trail of data operations
- Consent tracking
- Data retention policies
```

**Pragmatic Enforcer**:
```markdown
**Category**: Compliance (Exempt)

✅ No Challenge - Compliance Requirement

Exemption applies: compliance_required: true

All recommendations should be implemented as specified.

Pragmatic contribution: Implementation phasing suggestion

Phase 1 (Immediate - Required for compliance):
  ✅ User data export endpoint (JSON format)
  ✅ Account deletion with cascading
  ✅ Basic consent tracking
  ✅ Audit log of data operations

Phase 2 (Enhanced - Within 30 days):
  ✅ Multiple export formats (JSON, CSV, XML)
  ✅ Scheduled data retention policies
  ✅ Granular consent options

All features are justified by GDPR requirements.
Pragmatic mode defers to compliance needs.

Note: Even with exemption, phasing can help manage implementation
without compromising compliance.
```

### Example 13: Data Integrity Exemption (Financial Transactions)

**Context**: Payment processing system

**Developer**:
```
Should I add database transactions for the payment flow?
```

**Pragmatic Enforcer**:
```markdown
**Category**: Data Integrity (Exempt)

✅ Strong Recommendation: Yes, implement transactions

Exemption applies: data_integrity: true

For payment flows:
  ✅ Database transactions (ACID)
  ✅ Idempotency keys
  ✅ Reconciliation processes
  ✅ Audit trail
  ✅ Error handling with rollback

This is NOT negotiable for financial data.

Pragmatic mode does NOT question:
  • Data consistency mechanisms
  • Financial integrity controls
  • Audit requirements
  • Reconciliation processes

Even in strict mode, financial data integrity is paramount.
```

---

## Conclusion

These examples demonstrate how Pragmatic Guard Mode:

1. **Challenges complexity** while respecting necessary rigor
2. **Proposes alternatives** that meet actual requirements
3. **Defers decisions** until requirements are clear
4. **Respects exemptions** for security and compliance
5. **Adapts intensity** to project needs
6. **Resolves conflicts** through collaborative discussion
7. **Maintains quality** while avoiding over-engineering

The key principle: **Build what you need now, add what you need later.**

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────────┐
│ Pragmatic Mode Quick Reference                              │
├─────────────────────────────────────────────────────────────┤
│ Activation:                                                 │
│   "Enable pragmatic mode"                                   │
│                                                              │
│ Intensity:                                                  │
│   Strict   → ❌ Challenge aggressively                      │
│   Balanced → ⚠️  Challenge thoughtfully (default)           │
│   Lenient  → ℹ️  Suggest alternatives                       │
│                                                              │
│ Always Questions:                                           │
│   • Do we need this now?                                    │
│   • What's the simplest thing that could work?              │
│   • What's the cost of waiting?                             │
│   • Can we defer this decision?                             │
│                                                              │
│ Never Compromises:                                          │
│   ✓ Security requirements                                   │
│   ✓ Data integrity                                          │
│   ✓ Compliance needs                                        │
│   ✓ Accessibility requirements                              │
│                                                              │
│ Tracks:                                                     │
│   • Deferred decisions in .architecture/deferrals.md        │
│   • Trigger conditions for implementation                   │
│   • Cost-benefit analysis                                   │
└─────────────────────────────────────────────────────────────┘
```
