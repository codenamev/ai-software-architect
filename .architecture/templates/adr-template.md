# ADR-XXX: [Title]

## Status

[Draft | Proposed | Accepted | Implemented | Deprecated | Superseded]

If superseded, link to the new ADR: [New ADR Link]

## Context

[Describe the context and problem statement that led to this decision. Include any relevant constraints, requirements, or background information. Reference the architectural review findings if applicable.]

## Decision Drivers

* [Driver 1: Briefly describe a factor influencing the decision]
* [Driver 2: ...]
* [Driver n: ...]

## Decision

[Describe the decision that was made. Be clear and precise about the architectural change being implemented.]

**Architectural Components Affected:**
* [Component 1]
* [Component 2]
* [...]

**Interface Changes:**
* [Detail any changes to public interfaces]

## Consequences

### Positive

* [Positive consequence 1]
* [Positive consequence 2]
* [...]

### Negative

* [Negative consequence 1]
* [Negative consequence 2]
* [...]

### Neutral

* [Neutral consequence 1]
* [Neutral consequence 2]
* [...]

## Confirmation

> **Note**: Optional. Borrowed from MADR 4.0. Where *Validation* (below) says how the implementation will be tested, this says how you'll check, later, that the codebase still follows the decision.

**How compliance is verified:** [Review checkpoint, lint rule, ADR recalibration pass, or "by inspection" — name the mechanism]

**Who checks and when:** [Role / specialist and the trigger: each release, each recalibration, when the affected component changes]

**Signals of drift:** [What would show up in code, reviews, or metrics if this decision were quietly abandoned]

## Implementation Strategy

> **Note**: This section externalizes the "senior thinking" about HOW and WHEN to implement this decision, not just WHAT to implement.

### Blast Radius

**Impact Scope**: [Describe the scope of impact if this decision fails or needs reversal]

**Affected Components**:
- [Component/Service 1] - [Impact description]
- [Component/Service 2] - [Impact description]
- [...]

**Affected Teams**:
- [Team 1] - [Coordination needs]
- [Team 2] - [Coordination needs]
- [...]

**User Impact**: [Description of user-facing risks or changes]

**Risk Mitigation**:
- [Mitigation strategy 1]
- [Mitigation strategy 2]
- [...]

### Reversibility

**Reversibility Level**: [High | Medium | Low | Irreversible]

**Rollback Feasibility**:
- [Description of how easily this can be undone]
- [What makes it reversible or irreversible]
- [Time and effort required for reversal]

**Migration Paths**:
- **Forward Migration**: [Path to implement this decision]
- **Rollback Migration**: [Path to reverse this decision if needed]
- **Evolution Path**: [How this decision can evolve over time]

**Options Preserved**:
- [Future options this decision keeps open]
- [Alternatives that remain viable]

**Commitments Made**:
- [Decisions this locks us into]
- [Future options this decision closes]

### Sequencing & Timing

**Prerequisites**:
- [ ] [Prerequisite 1 - with status]
- [ ] [Prerequisite 2 - with status]
- [ ] [...]

**System Readiness**:
- **Observability**: [Is monitoring/logging adequate for this change?]
- **Dependencies**: [Are dependent systems stable and ready?]
- **Infrastructure**: [Is infrastructure sufficient?]
- **Data Migration**: [Are data migration paths clear and tested?]

**Team Readiness**:
- **Understanding**: [Does the team understand the patterns being introduced?]
- **Skills**: [Does the team have necessary skills?]
- **Training Needs**: [What training or documentation is required?]
- **Consensus**: [Is there team buy-in for this approach?]

**Sequencing Concerns**:
- [Should other changes happen first?]
- [What coordination is required?]
- [Are there timing dependencies?]

**Readiness Assessment**: [Ready to implement | Needs preparation | Requires prerequisites]

### Social Cost

**Learning Curve**: [Low | Medium | High]
- [Description of what team members need to learn]
- [Time estimate for team to become proficient]

**Cognitive Load**:
- [Mental overhead this pattern/approach adds]
- [Complexity vs. clarity trade-off analysis]

**Clarity Assessment**:
- **Will this help more than confuse?**: [Yes | No | Depends]
- **Explanation required**: [What needs to be documented or explained?]
- **Onboarding impact**: [Effect on new team members]

**Documentation Needs**:
- [ ] [Documentation item 1]
- [ ] [Documentation item 2]
- [ ] [...]

### Confidence Assessment

**Model Correctness Confidence**: [High | Medium | Low]
- [Are we confident in the architectural model, not just the implementation?]
- [What could make tests pass while the model is still wrong?]

**Assumptions**:
1. [Assumption 1] - **Validation**: [How validated is this?]
2. [Assumption 2] - **Validation**: [How validated is this?]
3. [...]

**Uncertainty Areas**:
- [Area 1 where we're uncertain]
- [Area 2 where we're uncertain]
- [...]

**Validation Approach**:
- [How will we validate the model is correct?]
- [What experiments or prototypes are needed?]
- [What feedback loops will verify assumptions?]

**Edge Cases**:
- [Edge case 1 not captured by testing]
- [Edge case 2 not captured by testing]
- [...]

## Implementation

[Provide a high-level implementation plan, including any phasing or migration strategies.]

**Phase 1: [Phase Name]**
* [Implementation step 1]
* [Implementation step 2]
* [...]

**Phase 2: [Phase Name]**
* [Implementation step 1]
* [Implementation step 2]
* [...]

## Alternatives Considered

### [Alternative 1]

[Describe alternative approach]

**Pros:**
* [Pro 1]
* [Pro 2]

**Cons:**
* [Con 1]
* [Con 2]

### [Alternative 2]

[Describe alternative approach]

**Pros:**
* [Pro 1]
* [Pro 2]

**Cons:**
* [Con 1]
* [Con 2]

## Pragmatic Enforcer Analysis

**Reviewer**: [NAME]
**Mode**: [Strict | Balanced | Lenient]

**Note**: *This section only appears when pragmatic_mode is enabled in `.architecture/config.yml`*

**Overall Decision Complexity Assessment**:
[High-level assessment of whether this decision maintains appropriate simplicity or shows signs of over-engineering. Consider: Is this solving a current problem or a future possibility? Are we adding complexity for speculative needs?]

**Decision Challenge**:

**Proposed Decision**: "[Briefly quote the decision being made]"

**Necessity Assessment**: [Score 0-10]
- **Current need**: [Is this decision addressing a current, concrete requirement?]
- **Future need**: [What's the likelihood and timeframe for this being actually needed?]
- **Cost of waiting**: [What breaks if we defer this decision? What's the cost of implementing later?]
- **Evidence of need**: [What concrete evidence justifies this decision now?]

**Complexity Assessment**: [Score 0-10]
- **Added complexity**: [What complexity does this decision introduce to the system?]
- **Maintenance burden**: [What is the ongoing cost to maintain this?]
- **Learning curve**: [What is the impact on team/new developers?]
- **Dependencies introduced**: [What new dependencies or abstractions are added?]

**Alternative Analysis**:
[Review of whether simpler alternatives were adequately considered]
- Are the listed alternatives genuinely simpler, or just different?
- Is there a "do nothing" or "minimal change" option missing?
- Could we solve this with existing tools/patterns?

**Simpler Alternative Proposal**:
[If applicable, concrete proposal for a simpler approach that meets current actual requirements. This might be:
- A phased approach (implement minimal now, extend later)
- Using existing tools instead of custom solutions
- Deferring the decision until more information is available
- A less abstract/more direct solution]

**Recommendation**: [✅ Approve decision | ⚠️ Approve with simplifications | ⏸️ Defer until triggered | ❌ Recommend against]

**Justification**:
[Clear reasoning for the recommendation, balancing current needs vs future flexibility vs complexity costs]

**If Deferring or Simplifying**:
- **Trigger conditions**: [What would trigger implementing this decision or the full version?]
- **Minimal viable alternative**: [What's the simplest thing that could work right now?]
- **Migration path**: [If we implement the minimal version, how do we migrate later if needed?]

**Pragmatic Score**:
- **Necessity**: [X/10]
- **Complexity**: [X/10]
- **Ratio**: [Complexity/Necessity = X.X] *(Target: <1.5 for balanced mode)*

**Overall Assessment**:
[Summary judgment: Does this decision represent appropriate engineering for current needs, or potential over-engineering for future possibilities?]

## Validation

**Acceptance Criteria:**
- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [...]

**Testing Approach:**
* [Describe how the implementation of this decision will be tested]

## References

* [Architectural Review X.Y.Z](link-to-review)
* [Reference 1](link)
* [Reference 2](link)