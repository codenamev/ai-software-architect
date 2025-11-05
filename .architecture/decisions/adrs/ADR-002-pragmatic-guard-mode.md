# ADR-002: Pragmatic Guard Mode (YAGNI Enforcement)

## Status

Draft

## Context

AI coding assistants, including Claude Code, Cursor, and GitHub Copilot, are powerful tools that accelerate development. However, they have a natural tendency toward over-engineering:

1. **Comprehensive Solutions**: AI assistants often suggest complete, production-ready implementations when simpler prototypes would suffice
2. **Best Practice Overload**: Every solution incorporates multiple design patterns and best practices, even for small features
3. **Premature Abstraction**: Flexible architectures are built for problems that may never materialize
4. **Feature Creep**: Suggestions include enhancements and extensions beyond stated requirements
5. **Speculative Generality**: Code is written to handle future scenarios that aren't currently needed

### Real-World Examples

**Example 1 - Simple Configuration**:
- Request: "Add a config file for database connection"
- AI suggests: YAML parser, environment variable override system, schema validation, configuration hot-reloading, encrypted secrets, multiple environment support
- Actually needed: JSON file with host, port, database name

**Example 2 - Basic Error Handling**:
- Request: "Add error handling to the API"
- AI suggests: Custom error class hierarchy, error codes, i18n support, structured logging, error reporting service integration
- Actually needed: Try-catch blocks with descriptive error messages

**Example 3 - User Authentication**:
- Request: "Add user login"
- AI suggests: OAuth2 + JWT + SAML, refresh tokens, role-based access control, permission system, audit logging, 2FA support
- Actually needed: Simple password authentication with sessions

### Current Framework Gaps

While our `.architecture/principles.md` includes "Pragmatic Simplicity" and quotes "Do The Simplest Thing That Could Possibly Work", we lack:

1. **Active Enforcement**: No systematic mechanism to question complexity
2. **Structured Pushback**: No defined process for challenging over-engineering
3. **Cost-Benefit Analysis**: No framework for evaluating "is this needed now?"
4. **Deferral Tracking**: No system for documenting "we'll add this when..."

The Maintainability Expert role includes simplification, but focuses on existing code cleanup rather than preventing complexity upfront.

### Problem Impact

Over-engineering causes:
- **Slower Delivery**: More code takes longer to write, test, and review
- **Higher Maintenance**: More complexity means more to maintain and debug
- **Steeper Learning Curve**: New developers face unnecessary conceptual overhead
- **Technical Debt**: Code built for imagined futures often needs rewriting when real needs emerge
- **Opportunity Cost**: Time spent on unnecessary features could address real needs

## Decision Drivers

* Need to balance AI assistant capabilities with YAGNI principles
* Desire to ship working software faster without sacrificing quality
* Recognition that future requirements are uncertain
* Understanding that premature optimization/abstraction is costly
* Existing principle: "Pragmatic Simplicity" needs enforcement mechanism
* Existing wisdom: "Do The Simplest Thing That Could Possibly Work" needs application
* Team feedback: AI assistants often suggest more than needed
* Cost of deferral is often low or zero for many features

## Decision

We will implement a **Pragmatic Guard Mode** for the AI Software Architect framework that adds a specialized "Pragmatic Enforcer" architecture member who:

1. **Actively Challenges Complexity**: Questions abstractions, patterns, and features
2. **Demands Justification**: Requires clear rationale for complexity additions
3. **Proposes Simpler Alternatives**: Suggests minimal viable implementations
4. **Calculates Cost of Waiting**: Analyzes what happens if implementation is deferred
5. **Tracks Deferred Decisions**: Documents features to implement "when needed"

**Architectural Components Affected:**
* `.architecture/members.yml` - Add Pragmatic Enforcer member
* `.architecture/config.yml` - New configuration system for mode control
* `.architecture/reviews/template.md` - Add Pragmatic Enforcer section
* `.architecture/templates/adr.md` - Add pragmatic analysis section
* `CLAUDE.md` - Add pragmatic mode request recognition
* `.architecture/deferrals.md` - New file for tracking deferred decisions

**Interface Changes:**
* Architecture reviews include Pragmatic Enforcer perspective
* ADRs include pragmatic analysis section
* Configuration file controls mode behavior
* New interaction pattern: challenge and response dialog

## Consequences

### Positive

* **Faster Initial Implementation**: Simpler solutions ship faster
* **Lower Maintenance Burden**: Less code to maintain, debug, and refactor
* **Reduced Technical Debt**: Build for actual needs, not imagined futures
* **Better Resource Allocation**: Time spent on features that matter now
* **Clearer Codebases**: Simpler code is easier to understand
* **Adaptive Architecture**: Defer commitments until requirements are clear
* **Learning Opportunity**: Team learns when/why to apply patterns
* **Configurable**: Can tune intensity to project needs
* **Exemptions for Critical Areas**: Security and compliance remain rigorous

### Negative

* **Potential Under-Engineering**: Risk of being too minimal
* **Increased Discussion Time**: Challenge/response adds to review time
* **Possible Team Friction**: Some may prefer comprehensive solutions upfront
* **Learning Curve**: Team must understand when to apply vs. challenge simplicity
* **Risk of Accumulating Debt**: Constant deferral could accumulate technical debt
* **Additional Configuration**: Teams must configure and maintain settings

### Neutral

* **Shifts Mindset**: From "what could we need?" to "what do we need now?"
* **Changes Review Process**: Adds new perspective to architectural discussions
* **Requires Documentation**: Deferred decisions must be tracked
* **Adds Complexity to Framework**: Framework itself becomes more complex

## Implementation

### Phase 1: Core Infrastructure (Week 1)

**Milestone**: Basic pragmatic mode functional

1. Add Pragmatic Enforcer to `.architecture/members.yml`
   - Define complete member specification
   - Document behavioral guidelines
   - Include mode_specific configuration

2. Create configuration system
   - Implement `.architecture/templates/config.yml` template
   - Document all settings and options
   - Provide examples for common scenarios

3. Update CLAUDE.md
   - Add pragmatic mode request recognition
   - Document activation phrases
   - Explain behavior in different modes

4. Create deferrals tracking
   - Design `.architecture/deferrals.md` template
   - Define deferral entry format
   - Include trigger conditions for implementation

### Phase 2: Review Process Integration (Week 2)

**Milestone**: Pragmatic mode works in architecture reviews

1. Update review template
   - Add Pragmatic Enforcer section
   - Include challenge/response format
   - Update collaborative discussion to integrate pragmatic perspective

2. Create example reviews
   - Document 3-5 complete review examples
   - Show challenge/response patterns
   - Demonstrate value and balance

3. Update review process documentation
   - Define when Pragmatic Enforcer participates
   - Establish conflict resolution patterns
   - Document intensity level behaviors

### Phase 3: ADR Integration (Week 3)

**Milestone**: Pragmatic mode works in decision documentation

1. Update ADR template
   - Add pragmatic analysis section
   - Include necessity and complexity assessments
   - Add simpler alternatives section
   - Include deferral analysis

2. Create example ADRs
   - Document 3-5 example ADRs with pragmatic analysis
   - Show different outcomes (implement/simplify/defer/skip)
   - Demonstrate trade-off analysis

3. Update ADR process
   - Include pragmatic challenges in decision drivers
   - Require responses to simplicity questions
   - Document deferral decisions properly

### Phase 4: Documentation & Testing (Week 4)

**Milestone**: Complete, tested, documented feature

1. Create comprehensive guide
   - Write integration guide (completed)
   - Create usage examples
   - Document best practices
   - Provide troubleshooting guidance

2. Develop test scenarios
   - Test strict mode behavior
   - Test balanced mode behavior
   - Test lenient mode behavior
   - Test exemption handling

3. Gather feedback
   - Test with real project scenarios
   - Collect user feedback
   - Refine behavioral patterns
   - Adjust default settings

4. Create migration guide
   - Document how to add to existing projects
   - Provide upgrade path from current version
   - Include rollback procedures

## Alternatives Considered

### Alternative 1: Manual Simplicity Emphasis

**Description**: Simply emphasize YAGNI principles in CLAUDE.md and trust AI assistants to apply them.

**Pros:**
* No implementation effort required
* No added framework complexity
* No configuration needed

**Cons:**
* No systematic enforcement
* AI assistants naturally tend toward completeness
* No structured challenge process
* No deferral tracking
* Inconsistent application across projects

**Rejected**: Insufficient - current approach already includes principles but lacks enforcement

### Alternative 2: Hardcoded Simplicity Rules

**Description**: Add hard rules to AI assistant instructions: "Never suggest more than X files", "Always start with minimal implementation", etc.

**Pros:**
* Simple to implement
* Consistent application
* No configuration needed

**Cons:**
* Inflexible - can't adjust to project needs
* May block legitimate complexity when needed
* Can't exempt security/compliance areas
* Doesn't educate team on trade-offs
* May frustrate users with arbitrary constraints

**Rejected**: Too rigid, doesn't adapt to context

### Alternative 3: Post-Implementation Simplification

**Description**: Let AI assistants suggest comprehensive solutions, then have a separate "simplification pass" to remove unnecessary parts.

**Pros:**
* Starts with complete solution
* Can learn from comprehensive approach
* Easier to remove than add

**Cons:**
* Wastes time implementing unnecessary features
* Harder to remove than to not add
* May miss simpler architectural approaches
* Team already invested in complex solution
* Sunk cost fallacy makes removal difficult

**Rejected**: Inefficient, attacks problem too late

### Alternative 4: Complexity Budgets

**Description**: Assign complexity budgets (e.g., "max 5 files for this feature") and enforce them.

**Pros:**
* Quantifiable constraint
* Forces prioritization
* Clear success criteria

**Cons:**
* Difficult to set appropriate budgets
* Complexity isn't just file count
* May encourage bad patterns to stay under budget
* Doesn't address "is this needed" question
* Doesn't help team learn judgment

**Rejected**: Metrics-focused, misses conceptual simplicity

### Alternative 5: Required Justification for Complexity

**Description**: Require written justification for any abstraction or pattern added.

**Pros:**
* Forces conscious decisions
* Creates documentation of reasoning
* Slows rush to complexity

**Cons:**
* No active challenge or alternatives
* Burden on team to write justifications
* Easy to write justifications that sound good
* No cost-benefit analysis framework
* No deferral consideration

**Partially Accepted**: Incorporated as part of pragmatic mode (require_justification setting)

## Validation

**Acceptance Criteria:**
- [x] Pragmatic Enforcer defined in members.yml
- [x] Configuration system implemented (config.yml template created)
- [x] Three intensity modes defined (strict, balanced, lenient)
- [x] Exemption categories documented (security, compliance, etc.)
- [x] Review template updated with pragmatic section
- [ ] ADR template updated with pragmatic analysis
- [x] Integration guide created
- [ ] Usage examples created (3-5 complete scenarios)
- [ ] Test scenarios documented
- [ ] Deferral tracking template created
- [ ] CLAUDE.md updated with pragmatic mode recognition

**Testing Approach:**

1. **Unit Testing**: Test each component in isolation
   - Pragmatic Enforcer provides appropriate challenges
   - Configuration loads and applies correctly
   - Exemptions work as expected
   - Intensity levels behave differently

2. **Integration Testing**: Test complete workflows
   - Full architecture review with pragmatic mode enabled
   - ADR creation with pragmatic analysis
   - Specific architect review with pragmatic challenges
   - Deferral decision tracking

3. **Scenario Testing**: Test with real-world scenarios
   - Over-engineered authentication proposal
   - Premature optimization suggestion
   - Speculative abstraction layer
   - Unnecessary dependency addition
   - Feature creep in implementation

4. **User Acceptance Testing**: Test with actual users
   - Developers using framework for real projects
   - Gather feedback on value and friction
   - Measure impact on delivery speed
   - Assess code complexity metrics

5. **Regression Testing**: Ensure existing functionality preserved
   - Normal reviews work without pragmatic mode
   - Existing ADRs remain valid
   - Configuration is optional
   - Framework works without config.yml

**Success Metrics:**

* Reduced complexity in code reviews (measured by cyclomatic complexity, file count)
* Faster time to initial implementation (measured by time to first working version)
* Positive user feedback (qualitative survey)
* Adoption rate (% of projects enabling pragmatic mode)
* Balance achieved (security/compliance not compromised)

## References

* [Exploration Document](../exploration-pragmatic-guard-mode.md)
* [Integration Guide](../pragmatic-mode-integration-guide.md)
* [Architectural Principles](../../principles.md) - Pragmatic Simplicity section
* [Martin Fowler on YAGNI](https://martinfowler.com/bliki/Yagni.html)
* [Kent Beck on Simple Design](https://www.martinfowler.com/bliki/BeckDesignRules.html)
* [Sandi Metz Rules](https://thoughtbot.com/blog/sandi-metz-rules-for-developers)

## Future Considerations

### Metrics and Analytics

Track pragmatic mode impact:
- Complexity scores before/after enabling mode
- Time to implementation before/after
- Number of features deferred vs. implemented
- Deferred features that were later needed vs. never needed
- Developer satisfaction scores

### AI-Specific Enhancements

Train AI assistants specifically on:
- Recognizing over-engineering patterns
- Proposing minimal viable implementations first
- Asking "do you need X?" before implementing X
- Understanding cost of waiting vs. cost of building

### Integration with Other Tools

- Editor plugins that show "pragmatic score" for proposed changes
- CI/CD gates that flag complexity increases
- Dashboard showing deferred decisions and trigger conditions
- Automated alerts when deferral triggers are met

### Community Patterns

- Collect and share common over-engineering patterns
- Crowdsource "pragmatic alternatives" library
- Build database of "when we needed it" vs. "still deferred" data
- Create industry-specific pragmatic guidelines

## Conclusion

The Pragmatic Guard Mode addresses a real need in AI-assisted development: systematic, configurable pushback against over-engineering. By adding a specialized architecture perspective that questions complexity, demands justification, and proposes simpler alternatives, we help teams build what they need, when they need it.

The mode is designed to be:
- **Opt-in**: Disabled by default, enable when valuable
- **Configurable**: Tune to project needs
- **Balanced**: Security and compliance remain rigorous
- **Educational**: Help teams learn when to apply vs. defer
- **Practical**: Focus on real value, not theoretical purity

This ADR proposes the architecture for pragmatic mode. Implementation will proceed through the four phases outlined above, with continuous feedback and refinement based on real-world usage.
