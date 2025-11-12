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
- `.architecture/templates/review-template.md`
- `.architecture/PHASE-1-TEST.md`

**Last Reviewed**: 2025-11-05

---

### Multiple Example ADRs (Phase 3B)

**Status**: Deferred
**Deferred Date**: 2025-11-05
**Category**: Documentation
**Priority**: Low

**What Was Deferred**:
Creating 3-5 comprehensive example ADRs demonstrating pragmatic mode analysis for various decision types

**Original Proposal**:
Phase 3 roadmap included creating 3-5 complete example ADRs to demonstrate pragmatic analysis in different contexts:
- Infrastructure decisions
- Technology stack choices
- Design pattern adoptions
- Performance optimization decisions
- Security architecture decisions

**Rationale for Deferring**:
- Current need score: 4/10 (helpful but not essential)
- Complexity score: 7/10 (more complex than review examples, need realistic decisions)
- Cost of waiting: Very low
- Already have one complete example (`example-pragmatic-caching-layer.md`)
- ADR format is well-understood, adding pragmatic section is straightforward
- Real ADRs will provide better examples than synthetic ones
- Risk of creating examples that don't reflect actual architectural decisions
- Technology choices in examples may become dated

**Simpler Current Approach**:
Single comprehensive ADR example demonstrating complete pragmatic analysis pattern. Users understand ADR format; one example shows how to add pragmatic section.

**Trigger Conditions** (Implement when):
- [ ] Users request more ADR examples
- [ ] First 3 real ADRs with pragmatic mode reveal patterns not covered
- [ ] Feedback indicates one example is insufficient
- [ ] Specific decision types emerge that need dedicated examples
- [ ] Common architectural decisions need documented patterns

**Implementation Notes**:
When creating additional examples:
- Base on real ADRs that have been created with pragmatic mode
- Focus on decision types that proved challenging
- Show different pragmatic outcomes (approved, simplified, deferred, rejected)
- Include examples at different intensity levels
- Cover different trigger scenarios and exemptions

**Related Documents**:
- `.architecture/decisions/adrs/example-pragmatic-caching-layer.md` (current example)
- `.architecture/templates/adr-template.md` (updated template)
- `.architecture/decisions/phase-3-pragmatic-analysis.md` (deferral decision)

**Last Reviewed**: 2025-11-05

---

### Extensive ADR Process Documentation (Phase 3B)

**Status**: Deferred
**Deferred Date**: 2025-11-05
**Category**: Documentation
**Priority**: Low

**What Was Deferred**:
Additional documentation for ADR creation process with pragmatic mode beyond template and single example

**Original Proposal**:
Create comprehensive documentation covering:
- Detailed ADR creation workflow with pragmatic mode
- How to conduct pragmatic analysis
- Guidelines for scoring necessity and complexity
- When to defer decisions
- How to set trigger conditions
- Best practices for phased implementations
- Integration with architecture reviews

**Rationale for Deferring**:
- Current need score: 3/10 (would be nice but not required)
- Complexity score: 5/10 (time-consuming)
- Cost of waiting: Very low
- ADR template is self-documenting
- Example ADR shows complete pattern
- CLAUDE.md already covers ADR creation process
- Don't know yet what users will find confusing about ADR pragmatic analysis
- Can document actual pain points instead of speculating

**Simpler Current Approach**:
Rely on existing documentation:
- ADR template with Pragmatic Enforcer Analysis section
- One complete example showing full pattern
- CLAUDE.md instructions for pragmatic mode
- Configuration file with thresholds and settings
- Review example showing pragmatic analysis patterns

**Trigger Conditions** (Implement when):
- [ ] Users ask questions not covered in existing docs
- [ ] Specific pain points emerge from actual ADR creation
- [ ] Common scoring confusion emerges
- [ ] 5+ support requests on same ADR-related topic
- [ ] Teams struggle with pragmatic analysis despite example

**Implementation Notes**:
Document actual problems users encounter when creating ADRs with pragmatic mode. Focus on real confusion, not imagined difficulties.

**Related Documents**:
- `.architecture/templates/adr-template.md`
- `.architecture/decisions/adrs/example-pragmatic-caching-layer.md`
- `CLAUDE.md`
- `.architecture/config.yml`

**Last Reviewed**: 2025-11-05

---

### Comprehensive ADR Integration Testing (Phase 3B)

**Status**: Deferred
**Deferred Date**: 2025-11-05
**Category**: Testing
**Priority**: Medium

**What Was Deferred**:
Extensive integration testing suite for Phase 3 ADR template with pragmatic analysis

**Original Proposal**:
Create comprehensive tests:
- ADR template rendering with pragmatic section
- Different decision types and outcomes
- Necessity/complexity scoring calculations
- Trigger condition formats
- Integration with review process
- Different intensity levels affecting recommendations
- Exemption scenario handling
- Migration paths and phased approaches

**Rationale for Deferring**:
- Current need score: 5/10 (testing is valuable but not urgent)
- Complexity score: 7/10 (time-consuming, requires test framework)
- Cost of waiting: Low
- Manual testing verifies template is well-formed
- First real ADRs will reveal actual edge cases
- Can test with real scenarios vs synthetic ones
- ADR template is straightforward enough for manual verification
- Template structure is simpler than review template

**Simpler Current Approach**:
- Manual verification that template is well-formed
- Verify example ADR uses template correctly
- Monitor first real ADRs for issues
- Add tests for patterns that prove problematic

**Trigger Conditions** (Implement when):
- [ ] Bugs found in ADR pragmatic analysis
- [ ] ADR template changes frequently and needs regression protection
- [ ] Complex logic added for scoring or recommendations
- [ ] Multiple contributors need test suite
- [ ] Automated validation of necessity/complexity ratios needed

**Implementation Notes**:
When implementing:
- Focus on testing actual failure modes discovered
- Test template structure and completeness
- Test pragmatic scoring calculations if automated
- Test integration with review process
- Test different intensity levels if behavior varies

**Related Documents**:
- `.architecture/templates/adr-template.md`
- `.architecture/decisions/adrs/example-pragmatic-caching-layer.md`
- `.architecture/PHASE-1-TEST.md`

**Last Reviewed**: 2025-11-05

---

### Cross-Reference Example Library (Phase 3B)

**Status**: Deferred
**Deferred Date**: 2025-11-05
**Category**: Documentation
**Priority**: Low

**What Was Deferred**:
Building a comprehensive cross-referenced library of pragmatic mode examples across reviews, ADRs, and decision scenarios

**Original Proposal**:
Create an organized library:
- Index of all examples by scenario type
- Cross-references between review and ADR examples
- Searchable catalog of pragmatic challenges
- Decision tree for when to defer vs simplify vs implement
- Pattern library of common architectural over-engineering traps

**Rationale for Deferring**:
- Current need score: 3/10 (nice to have, not essential)
- Complexity score: 6/10 (requires corpus of examples to cross-reference)
- Cost of waiting: Very low
- Only have 2 examples currently (1 review, 1 ADR)
- Need more real examples before patterns emerge
- Premature to create index with limited content
- Pattern library should emerge from actual usage, not speculation

**Simpler Current Approach**:
Let example corpus grow organically from real usage. Cross-reference when patterns emerge naturally.

**Trigger Conditions** (Implement when):
- [ ] 10+ documented examples exist (reviews + ADRs)
- [ ] Clear patterns emerge across multiple examples
- [ ] Users request ability to search examples by scenario
- [ ] Common architectural traps documented from real usage
- [ ] Teaching/training need for organized example library

**Implementation Notes**:
When implementing:
- Wait for corpus of real examples to accumulate
- Identify patterns from actual usage, not speculation
- Create taxonomy based on real decision types encountered
- Build index only when content justifies the structure

**Related Documents**:
- `.architecture/reviews/example-pragmatic-api-feature.md`
- `.architecture/decisions/adrs/example-pragmatic-caching-layer.md`
- Future examples to be added as they're created

**Last Reviewed**: 2025-11-05

---

### Comprehensive Usage Guide (Phase 4B)

**Status**: Deferred
**Deferred Date**: 2025-11-05
**Category**: Documentation
**Priority**: Low

**What Was Deferred**:
Creating a comprehensive usage guide for pragmatic mode beyond existing CLAUDE.md instructions

**Original Proposal**:
Phase 4 roadmap included creating detailed usage guide covering:
- When to enable pragmatic mode
- How to configure intensity levels
- Handling exemptions
- Best practices for usage
- Integration workflows
- Troubleshooting guide

**Rationale for Deferring**:
- Current need score: 3/10 (helpful but not essential)
- Complexity score: 6/10 (significant documentation effort)
- Cost of waiting: Very low
- CLAUDE.md already has comprehensive 9-step activation guide
- config.yml has extensive inline documentation
- Examples demonstrate usage patterns
- Don't know yet what users will struggle with
- Cannot create effective guide without seeing real usage questions

**Simpler Current Approach**:
Rely on existing documentation:
- CLAUDE.md: Complete "Pragmatic Guard Mode Requests" section with 9-step process
- config.yml: Extensive inline documentation for all settings
- Review template: Self-documenting with clear structure
- ADR template: Self-documenting with clear structure
- Examples: 1 review + 1 ADR demonstrate all patterns

**Trigger Conditions** (Implement when):
- [ ] 5+ support questions about how to use pragmatic mode
- [ ] Users report confusion despite existing documentation
- [ ] Common usage patterns emerge that aren't documented
- [ ] Specific workflows prove difficult to understand
- [ ] Feedback indicates current docs insufficient

**Implementation Notes**:
When creating usage guide:
- Base on actual user questions and confusion points
- Focus on scenarios that proved unclear in practice
- Include real-world usage examples from actual projects
- Address specific pain points identified through support
- Avoid documenting what users already understand

**Related Documents**:
- `CLAUDE.md` (current usage instructions)
- `.architecture/config.yml` (configuration documentation)
- `.architecture/reviews/example-pragmatic-api-feature.md`
- `.architecture/decisions/adrs/example-pragmatic-caching-layer.md`
- `.architecture/decisions/phase-4-pragmatic-analysis.md` (deferral decision)

**Last Reviewed**: 2025-11-05

---

### YAGNI Principles Reference Document (Phase 4B)

**Status**: Deferred
**Deferred Date**: 2025-11-05
**Category**: Documentation
**Priority**: Low

**What Was Deferred**:
Creating a comprehensive reference document on YAGNI principles, resources, and best practices

**Original Proposal**:
Phase 4 roadmap included creating reference documentation covering:
- Link to YAGNI resources (Martin Fowler, Kent Beck, XP principles)
- Common pitfalls in architectural decision-making
- Decision frameworks for complexity vs simplicity
- When YAGNI applies and when it doesn't
- Examples of appropriate vs premature optimization
- Cost-benefit frameworks for architectural decisions

**Rationale for Deferring**:
- Current need score: 2/10 (nice to have, not required)
- Complexity score: 5/10 (research and compilation effort)
- Cost of waiting: Zero
- Can link to external resources (Martin Fowler, Kent Beck) as needed
- Don't know yet what principles users need reinforcement on
- Cannot document "common pitfalls" that haven't been encountered
- Better to create based on actual user needs vs speculation

**Simpler Current Approach**:
Link to external resources when needed:
- Martin Fowler's YAGNI article: https://martinfowler.com/bliki/Yagni.html
- Kent Beck's XP principles (reference in principles.md)
- Pragmatic mode config and examples demonstrate principles in action
- Users can request specific references if needed

**Trigger Conditions** (Implement when):
- [ ] Users request deeper learning resources on YAGNI
- [ ] Questions show misunderstanding of when YAGNI applies
- [ ] Common misconceptions emerge from real usage
- [ ] Teams struggle with philosophical understanding despite examples
- [ ] 5+ requests for learning resources or deeper principles

**Implementation Notes**:
When creating principles reference:
- Focus on areas where users show actual confusion
- Include real examples from user projects (anonymized)
- Address specific misconceptions that emerged
- Link to authoritative external resources
- Keep practical and actionable, not purely theoretical

**Related Documents**:
- `.architecture/principles.md` (existing principles)
- External: Martin Fowler YAGNI article
- External: Kent Beck XP principles
- `.architecture/decisions/exploration-pragmatic-guard-mode.md` (rationale)

**Last Reviewed**: 2025-11-05

---

### Common Pitfalls Documentation (Phase 4B)

**Status**: Deferred
**Deferred Date**: 2025-11-05
**Category**: Documentation
**Priority**: Low

**What Was Deferred**:
Documenting common pitfalls and anti-patterns when using pragmatic mode

**Original Proposal**:
Phase 4 roadmap included documenting common pitfalls:
- Mistakes users make when applying pragmatic mode
- Anti-patterns in using YAGNI principles
- When pragmatic mode is applied inappropriately
- Balancing simplicity with necessary complexity
- Avoiding under-engineering critical systems

**Rationale for Deferring**:
- Current need score: 1/10 (cannot do without real usage)
- Complexity score: 4/10 (straightforward documentation once known)
- Cost of waiting: Zero - literally cannot do this before it happens!
- **CANNOT document pitfalls that haven't been encountered**
- Don't know yet what mistakes users will make
- Speculating about pitfalls risks documenting wrong things
- Real usage will reveal actual problems vs imagined ones

**Simpler Current Approach**:
Wait for real usage to reveal pitfalls:
- Monitor first users' experiences
- Collect actual problems encountered
- Document real anti-patterns as they emerge
- Learn from mistakes rather than speculate

**Trigger Conditions** (Implement when):
- [ ] 5+ users have used pragmatic mode on real projects
- [ ] Common mistakes emerge from real usage
- [ ] Patterns of misuse are observed
- [ ] Specific scenarios repeatedly cause problems
- [ ] Anti-patterns identified from actual projects

**Implementation Notes**:
When creating pitfalls documentation:
- Base entirely on real problems encountered
- Include real examples (anonymized if needed)
- Explain why the pitfall is problematic
- Provide corrective guidance
- Show before/after examples
- This document MUST wait for real usage data

**Related Documents**:
- Future: Real user feedback and usage reports
- `.architecture/decisions/phase-4-pragmatic-analysis.md` (why deferred)

**Last Reviewed**: 2025-11-05

---

### Behavioral Pattern Refinement (Phase 4B)

**Status**: Deferred
**Deferred Date**: 2025-11-05
**Category**: Enhancement
**Priority**: Medium

**What Was Deferred**:
Refining pragmatic mode behavioral patterns based on real-world usage feedback

**Original Proposal**:
Phase 4 roadmap included behavioral refinement:
- Test with real projects
- Refine question frameworks
- Adjust response patterns
- Improve challenge structure
- Enhance collaborative discussion integration

**Rationale for Deferring**:
- Current need score: 0/10 (literally impossible without usage data)
- Complexity score: 6/10 (requires analysis and iteration)
- Cost of waiting: Zero until we have usage data
- **CANNOT refine patterns without seeing them in real usage**
- Current patterns are well-designed based on YAGNI principles
- Need real usage to know what works and what doesn't
- Premature refinement risks optimizing wrong things

**Simpler Current Approach**:
Ship current behavioral patterns as-is:
- Question framework is well-designed
- Response patterns are clear and structured
- Assessment framework (0-10 scoring) is straightforward
- Wait for real usage to show what needs refinement

**Trigger Conditions** (Implement when):
- [ ] 10+ pragmatic mode reviews/ADRs conducted
- [ ] Patterns emerge showing specific questions are unclear
- [ ] Users report challenge structure is confusing
- [ ] Response format proves inadequate for real scenarios
- [ ] Feedback indicates specific improvements needed
- [ ] Behavioral patterns produce unhelpful or confusing results

**Implementation Notes**:
When refining behavioral patterns:
- Analyze actual reviews and ADRs created with pragmatic mode
- Identify what worked well vs what caused confusion
- Refine based on real usage patterns, not speculation
- A/B test changes if possible
- Update templates, examples, and documentation consistently

**Related Documents**:
- `.architecture/templates/review-template.md` (current patterns)
- `.architecture/templates/adr-template.md` (current patterns)
- Future: Analysis of real pragmatic mode usage

**Last Reviewed**: 2025-11-05

---

### Intensity Calibration Adjustment (Phase 4B)

**Status**: Deferred
**Deferred Date**: 2025-11-05
**Category**: Enhancement
**Priority**: Medium

**What Was Deferred**:
Adjusting intensity level calibration (strict, balanced, lenient) based on real project data

**Original Proposal**:
Phase 4 roadmap included intensity calibration:
- Validate current thresholds with real projects
- Adjust complexity/necessity ratio targets
- Refine strict/balanced/lenient behaviors
- Tune trigger sensitivity
- Optimize for different project types/sizes

**Rationale for Deferring**:
- Current need score: 0/10 (impossible without real project data)
- Complexity score: 7/10 (requires data collection and analysis)
- Cost of waiting: Zero until we have real usage data
- **CANNOT calibrate without seeing actual intensity levels in use**
- Current calibration is well-designed based on principles
- Thresholds (e.g., <1.5 ratio for balanced mode) are reasonable
- Need real projects to validate or adjust thresholds

**Simpler Current Approach**:
Ship current calibration as-is:
- Strict: Aggressive challenges, high bar for complexity
- Balanced: Thoughtful challenges, middle ground (RECOMMENDED)
- Lenient: Raise concerns, suggest alternatives
- Thresholds: complexity/necessity ratio <1.5 for balanced
- Wait for real usage to show if calibration is appropriate

**Trigger Conditions** (Implement when):
- [ ] 20+ projects using pragmatic mode
- [ ] Data shows intensity levels produce unexpected results
- [ ] Users report strict/balanced/lenient not behaving as expected
- [ ] Thresholds prove too aggressive or too permissive
- [ ] Different project types/sizes need different calibration
- [ ] Quantitative analysis shows calibration issues

**Implementation Notes**:
When adjusting intensity calibration:
- Collect data from real projects using each intensity level
- Analyze necessity scores, complexity scores, and ratios
- Identify patterns in recommendations (approve/simplify/defer/reject)
- Measure project outcomes with different intensity levels
- Adjust thresholds based on data, not intuition
- Document reasoning for any calibration changes
- Update config.yml, examples, and documentation

**Related Documents**:
- `.architecture/config.yml` (current calibration)
- `.architecture/reviews/example-pragmatic-api-feature.md` (balanced mode example)
- `.architecture/decisions/adrs/example-pragmatic-caching-layer.md` (balanced mode example)
- Future: Analysis of intensity level usage across projects

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
| Total deferrals | 12 | All-time count (3 Phase 2B + 4 Phase 3B + 5 Phase 4B) |
| Active deferrals | 12 | Currently deferred |
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
