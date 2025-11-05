# Deferred Architectural Decisions

This document tracks architectural features, patterns, and complexity that have been consciously deferred for future implementation. Each deferral includes the rationale for waiting and clear trigger conditions for when it should be reconsidered.

## Status Key

- **Deferred**: Decision to defer is active, watching for trigger
- **Triggered**: Trigger condition met, needs implementation
- **Implemented**: Feature has been implemented (moved to ADR)
- **Cancelled**: No longer needed or relevant

---

## Deferred Decisions

### [Feature/Pattern Name]

**Status**: Deferred
**Deferred Date**: YYYY-MM-DD
**Category**: [Architecture | Performance | Testing | Infrastructure | Security]
**Priority**: [Low | Medium | High]

**What Was Deferred**:
[Brief description of the feature, pattern, or complexity that was deferred]

**Original Proposal**:
[What was originally suggested - can quote from review or ADR]

**Rationale for Deferring**:
- Current need score: [0-10]
- Complexity score: [0-10]
- Cost of waiting: [Low | Medium | High]
- Why deferring makes sense: [Explanation]

**Simpler Current Approach**:
[What we're doing instead for now]

**Trigger Conditions** (Implement when):
- [ ] [Specific condition 1 - make this measurable]
- [ ] [Specific condition 2]
- [ ] [Specific condition 3]

**Implementation Notes**:
[Notes for when this is implemented - gotchas, considerations, references]

**Related Documents**:
- [Link to ADR or review]
- [Link to discussion]

**Last Reviewed**: YYYY-MM-DD

---

## Example Entries

### OAuth2 and SAML Authentication

**Status**: Deferred
**Deferred Date**: 2024-01-15
**Category**: Security
**Priority**: Medium

**What Was Deferred**:
Support for OAuth2 and SAML authentication providers in addition to JWT

**Original Proposal**:
Security Specialist recommended implementing comprehensive authentication middleware with support for OAuth2, SAML, and JWT with pluggable providers.

**Rationale for Deferring**:
- Current need score: 3/10 (only JWT needed now)
- Complexity score: 8/10 (multiple abstractions, provider interfaces)
- Cost of waiting: Low
- All current requirements satisfied by JWT
- No confirmed need for other providers
- Can add later without major refactoring

**Simpler Current Approach**:
JWT-only authentication with standard Express middleware. Clean interface makes adding other providers feasible later.

**Trigger Conditions** (Implement when):
- [ ] Confirmed partner integration requiring OAuth2
- [ ] Enterprise customer requiring SAML
- [ ] Three or more requests for alternative auth methods
- [ ] Strategic decision to support social login

**Implementation Notes**:
When implementing:
- Extract current JWT logic into provider interface
- Ensure passport.js strategies are compatible
- Consider Auth0 or similar service instead of custom implementation
- Update user model to track auth provider

**Related Documents**:
- ADR-005: Authentication System
- Review 1.0.0: Security Specialist section

**Last Reviewed**: 2024-01-15

---

### Redis Caching Layer

**Status**: Deferred
**Deferred Date**: 2024-01-15
**Category**: Performance
**Priority**: Low

**What Was Deferred**:
Redis-based caching layer with cache invalidation strategy

**Original Proposal**:
Performance Specialist recommended implementing Redis caching for database queries, API responses, and session data with intelligent cache invalidation.

**Rationale for Deferring**:
- Current need score: 2/10 (no performance problems)
- Complexity score: 9/10 (cache invalidation is hard)
- Cost of waiting: Zero until we have performance problems
- No evidence of slow operations
- Premature optimization
- Can optimize specific bottlenecks when they appear

**Simpler Current Approach**:
No caching. Using database directly with optimized queries. Monitoring response times for degradation.

**Trigger Conditions** (Implement when):
- [ ] Average response time > 500ms for key endpoints
- [ ] 95th percentile response time > 2 seconds
- [ ] Database CPU consistently > 70%
- [ ] Specific queries identified as bottlenecks via profiling
- [ ] Traffic exceeds 1000 req/sec

**Implementation Notes**:
When implementing:
1. Profile first to identify actual bottlenecks
2. Start with simple in-memory cache for hot paths
3. Only add Redis if in-memory insufficient
4. Use cache-aside pattern
5. Consider read replicas before caching

**Related Documents**:
- Review 1.0.0: Performance Specialist section
- Performance monitoring dashboard: [link]

**Last Reviewed**: 2024-01-15

---

### Comprehensive Integration Test Suite

**Status**: Deferred
**Deferred Date**: 2024-01-15
**Category**: Testing
**Priority**: Medium

**What Was Deferred**:
Full integration test suite with contract tests and property-based tests

**Original Proposal**:
Maintainability Expert recommended comprehensive testing: unit tests, integration tests, contract tests, E2E tests, and property-based tests for all business logic.

**Rationale for Deferring**:
- Current need score: 6/10 (tests needed but not all types)
- Complexity score: 8/10 (multiple frameworks, test data)
- Cost of waiting: Low (can add incrementally)
- Basic unit tests provide current value
- Can add test types as problems emerge
- Avoid testing implementation details that will change

**Simpler Current Approach**:
Focused unit tests for business logic core and smoke tests for critical user flows. ~70% coverage on core domain logic.

**Trigger Conditions** (Implement when):
- [ ] Integration failures between services (→ add integration tests)
- [ ] User-reported bugs in E2E flows (→ add E2E tests)
- [ ] Edge case bugs in business logic (→ add property tests)
- [ ] Contract breaking changes between teams (→ add contract tests)

**Implementation Notes**:
When implementing:
- Add test types incrementally based on actual failures
- Integration tests: Start with most critical integration points
- E2E tests: Cover top 5 user journeys first
- Property tests: Focus on business logic with complex invariants
- Track which test types provide most value

**Related Documents**:
- Review 1.0.0: Maintainability Expert section
- Testing strategy: [link]

**Last Reviewed**: 2024-01-15

---

### Service Mesh (Istio/Linkerd)

**Status**: Deferred
**Deferred Date**: 2024-01-15
**Category**: Architecture
**Priority**: Low

**What Was Deferred**:
Service mesh for microservices communication, observability, and traffic management

**Original Proposal**:
Systems Architect recommended implementing service mesh (Istio or Linkerd) for service-to-service communication with circuit breakers, retries, and distributed tracing.

**Rationale for Deferring**:
- Current need score: 3/10 (3 services, simple communication)
- Complexity score: 9/10 (major infrastructure, learning curve)
- Cost of waiting: Near zero (can add when needed)
- Current service count doesn't justify mesh complexity
- Simple HTTP with retries sufficient for now
- Major operational overhead for small benefit

**Simpler Current Approach**:
Direct service-to-service HTTP calls with exponential backoff retry logic. Using standard HTTP health checks.

**Trigger Conditions** (Implement when):
- [ ] Service count exceeds 10
- [ ] Need circuit breakers for multiple services
- [ ] Need mTLS between services for security
- [ ] Need advanced traffic routing (canary, blue-green)
- [ ] Debugging service communication becomes difficult
- [ ] Need unified observability across services

**Implementation Notes**:
When implementing:
- Evaluate Istio vs. Linkerd vs. newer alternatives
- Start with observability features first
- Phase in mTLS gradually
- Consider managed service mesh offerings
- Ensure team has time for learning curve
- Budget for operational overhead

**Related Documents**:
- Review 2.0.0: Systems Architect section
- Current architecture diagram: [link]

**Last Reviewed**: 2024-01-15

---

### Event Sourcing Architecture

**Status**: Deferred
**Deferred Date**: 2024-01-15
**Category**: Architecture
**Priority**: Low

**What Was Deferred**:
Event sourcing pattern for capturing all changes as events

**Original Proposal**:
Domain Expert recommended event sourcing to maintain complete audit trail and enable temporal queries.

**Rationale for Deferring**:
- Current need score: 4/10 (audit trail needed, but basic version sufficient)
- Complexity score: 9/10 (major architectural change)
- Cost of waiting: Low (can add audit logging incrementally)
- Simple audit logging meets current compliance requirements
- Event sourcing is a one-way door decision
- Complexity of event sourcing not justified by current needs

**Simpler Current Approach**:
Standard CRUD with audit logging table tracking changes to critical entities. Includes who, what, when for key operations.

**Trigger Conditions** (Implement when):
- [ ] Need to reconstruct entity state at any point in time
- [ ] Current audit logging doesn't meet compliance requirements
- [ ] Need to replay events for new projections
- [ ] Temporal queries become core business requirement
- [ ] Need event-driven architecture for system integration

**Implementation Notes**:
When implementing:
- Start with single bounded context, not whole system
- Choose event store carefully (EventStore, Kafka, custom)
- Plan migration strategy carefully
- Consider CQRS pattern alongside
- Ensure team understands event modeling
- This is a major architectural shift - not to be taken lightly

**Related Documents**:
- Review 1.0.0: Domain Expert section
- Audit requirements: [link]
- Event sourcing investigation: [link]

**Last Reviewed**: 2024-01-15

---

## Review Process

This document should be reviewed:

**Monthly**: Check for triggered conditions
- Review each deferred item
- Check if any trigger conditions have been met
- Update priority if context has changed

**Quarterly**: Re-evaluate deferrals
- Are deferred items still relevant?
- Have requirements changed?
- Should priority be adjusted?
- Can any be cancelled?

**During Architecture Reviews**: Reference deferrals
- Check if new features relate to deferrals
- Consider if triggered conditions met
- Avoid re-proposing already-deferred items
- Update relevant entries

**When Triggers Met**:
1. Update status to "Triggered"
2. Create or update ADR for implementation
3. Plan implementation in next sprint/release
4. Reference this deferral in the ADR
5. After implementation, update status to "Implemented"

## Metrics

Track deferral outcomes to improve decision-making:

| Metric | Value | Notes |
|--------|-------|-------|
| Total deferrals | [count] | All-time count |
| Active deferrals | [count] | Currently deferred |
| Triggered awaiting implementation | [count] | Need to address |
| Implemented | [count] | Were eventually needed |
| Cancelled | [count] | Were never needed |
| Average time before trigger | [days] | How long before we needed it |
| Hit rate (implemented/total) | [%] | How often deferred things are needed |

**Target**: < 40% hit rate (most deferred things remain unneeded, validating deferral decisions)

---

*This template should be copied to `.architecture/deferrals.md` in each project using pragmatic mode.*
