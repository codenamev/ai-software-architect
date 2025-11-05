# Deferred Architectural Decisions

This document tracks architectural features, patterns, and complexity that have been consciously deferred for future implementation. Each deferral includes the rationale for waiting and clear trigger conditions for when it should be reconsidered.

## Status Key

- **Deferred**: Decision to defer is active, watching for trigger
- **Triggered**: Trigger condition met, needs implementation
- **Implemented**: Feature has been implemented (moved to ADR)
- **Cancelled**: No longer needed or relevant

---

## Deferred Decisions

### Multiple Example Reviews (Phase 2B)

**Status**: Deferred
**Deferred Date**: 2025-11-05
**Category**: Documentation
**Priority**: Low

**What Was Deferred**:
Creating 3-5 comprehensive example architectural reviews demonstrating pragmatic mode in various scenarios

**Original Proposal**:
Phase 2 roadmap included creating 3-5 complete example reviews to demonstrate pragmatic mode in different contexts (performance optimization, security features, test infrastructure, etc.)

**Rationale for Deferring**:
- Current need score: 5/10 (helpful but not essential)
- Complexity score: 6/10 (time-consuming to create realistic examples)
- Cost of waiting: Low
- Already have one complete example (`example-pragmatic-api-feature.md`)
- Already have 13+ scenarios in `pragmatic-mode-usage-examples.md`
- Real usage will inform better examples than synthetic ones
- Risk of creating examples that don't match actual usage patterns

**Simpler Current Approach**:
Single comprehensive example demonstrating core pragmatic mode patterns. Reference existing usage examples documentation for additional scenarios.

**Trigger Conditions** (Implement when):
- [ ] Users request more example reviews
- [ ] First 3 real reviews reveal patterns not covered in current example
- [ ] Feedback indicates template alone is insufficient
- [ ] Specific scenario gaps identified through actual usage

**Implementation Notes**:
When creating additional examples:
- Base on real reviews that have been conducted
- Focus on scenarios that proved confusing or needed clarification
- Prioritize examples that show different intensity levels
- Include examples with different exemption scenarios

**Related Documents**:
- `.architecture/reviews/example-pragmatic-api-feature.md` (current example)
- `.architecture/decisions/pragmatic-mode-usage-examples.md` (13+ scenarios)
- `.architecture/decisions/phase-2-pragmatic-analysis.md` (deferral decision)

**Last Reviewed**: 2025-11-05

---

### Extensive Phase 2 Documentation

**Status**: Deferred
**Deferred Date**: 2025-11-05
**Category**: Documentation
**Priority**: Low

**What Was Deferred**:
Additional documentation for review process integration beyond template and single example

**Original Proposal**:
Create comprehensive documentation covering:
- Detailed review process with pragmatic mode
- Integration patterns
- Troubleshooting guide
- Best practices

**Rationale for Deferring**:
- Current need score: 4/10 (would be nice but not required)
- Complexity score: 5/10 (time-consuming)
- Cost of waiting: Very low
- Existing integration guide covers technical details
- Existing usage examples cover scenarios
- Template provides structure
- Don't know yet what users will find confusing

**Simpler Current Approach**:
Rely on existing documentation:
- Review template with clear structure
- One complete example
- Integration guide
- Usage examples document
- CLAUDE.md instructions

**Trigger Conditions** (Implement when):
- [ ] Users ask questions not covered in existing docs
- [ ] Specific pain points emerge from actual usage
- [ ] Common patterns emerge that need documentation
- [ ] 5+ support requests on same topic

**Implementation Notes**:
Document actual problems users encounter, not imagined ones. This ensures documentation addresses real needs.

**Related Documents**:
- `.architecture/decisions/pragmatic-mode-integration-guide.md`
- `.architecture/decisions/pragmatic-mode-usage-examples.md`
- `CLAUDE.md`

**Last Reviewed**: 2025-11-05

---

### Comprehensive Integration Testing

**Status**: Deferred
**Deferred Date**: 2025-11-05
**Category**: Testing
**Priority**: Medium

**What Was Deferred**:
Extensive integration testing suite for Phase 2 review process integration

**Original Proposal**:
Create comprehensive tests:
- Template rendering with all architect combinations
- Pragmatic mode enabled/disabled scenarios
- Different intensity levels
- All trigger conditions
- Exemption scenarios
- Error cases

**Rationale for Deferring**:
- Current need score: 6/10 (testing is valuable)
- Complexity score: 7/10 (time-consuming, requires test framework)
- Cost of waiting: Low
- Manual testing verifies core functionality
- First real usage will reveal actual edge cases
- Can test with real scenarios vs synthetic ones
- Template is straightforward enough for manual verification

**Simpler Current Approach**:
- Manual verification that template is well-formed
- Test with simple review scenario (done)
- Monitor first real reviews for issues
- Add tests for patterns that prove problematic

**Trigger Conditions** (Implement when):
- [ ] Bugs found in review process
- [ ] Template changes frequently and needs regression protection
- [ ] Complex logic added that's hard to verify manually
- [ ] Multiple contributors need test suite

**Implementation Notes**:
When implementing:
- Focus on testing actual failure modes discovered
- Test template rendering and structure
- Test pragmatic mode activation/deactivation
- Test different intensity levels

**Related Documents**:
- `.architecture/reviews/template.md`
- `.architecture/PHASE-1-TEST.md`

**Last Reviewed**: 2025-11-05

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
| Total deferrals | 3 | All-time count |
| Active deferrals | 3 | Currently deferred |
| Triggered awaiting implementation | 0 | Need to address |
| Implemented | 0 | Were eventually needed |
| Cancelled | 0 | Were never needed |
| Average time before trigger | - | How long before we needed it |
| Hit rate (implemented/total) | 0% | How often deferred things are needed |

**Target**: < 40% hit rate (most deferred things remain unneeded, validating deferral decisions)

---

## Template for New Deferrals

When adding a deferral, use this format:

```markdown
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
```

---

*See `.architecture/templates/deferrals.md` for detailed examples of deferral entries.*
