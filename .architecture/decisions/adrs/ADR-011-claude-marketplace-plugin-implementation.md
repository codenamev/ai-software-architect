# ADR-011: Claude Marketplace Plugin Implementation

## Status

Accepted

**Path Selected**: Path A - Immediate Marketplace Submission (Revised)
**Decision Date**: 2026-01-21
**Decision Maker**: Framework Maintainer
**Research Update**: 2026-01-21 - Post-decision research revealed Claude Code uses distributed marketplace model, significantly reducing implementation timeline from 6-10 weeks to 2-3 weeks

## Context

The AI Software Architect framework currently distributes through three channels: Claude Skills (reusable skills in ~/.claude/skills/), MCP Server (npm package: ai-software-architect), and Traditional Clone (git clone to .architecture/). The framework has achieved organic growth through GitHub and strong technical foundations with version 1.3.0.

**Opportunity**: Claude Code's distributed marketplace system enables creation of self-hosted plugin marketplaces that improve discoverability for Claude-native users. Unlike centralized app stores (iOS, Chrome), anyone can create and host their own marketplace via a GitHub repository with a `marketplace.json` file. This provides a fourth distribution channel without submission/approval processes.

**Current State**:
- **Technology**: Node.js 18+, @modelcontextprotocol/sdk 1.0.4, comprehensive YAML-based configuration
- **Codebase**: ~2,000 lines in MCP server (mcp/index.js), mature documentation (ADRs, reviews, principles), production-ready features (architecture reviews, ADR creation, pragmatic mode)
- **Maintenance**: Solo maintainer managing three distribution channels
- **Growth**: Organic through GitHub with demonstrated market validation

**Marketplace Characteristics (Research Findings)**:
- **Distributed Model**: Each organization/project hosts their own marketplace (no centralized Anthropic marketplace)
- **Self-Publishing**: No submission/approval process - create marketplace.json and publish to GitHub
- **User Installation**: Users add marketplaces via `/plugin marketplace add owner/repo`
- **Discovery Challenge**: No centralized discovery - relies on GitHub, SEO, and community awareness
- **Quality Standards**: Self-enforced - no mandatory review process
- **Thin Wrapper Pattern**: Plugins can delegate to existing npm packages (95%+ code sharing)

**Implementation Requirements (Revised)**:
Post-decision research revealed actual requirements are minimal compared to initial assessment:
- **Plugin Manifest**: `.claude-plugin/plugin.json` with name, version, description (1 hour)
- **Marketplace Catalog**: `.claude-plugin/marketplace.json` listing plugins (1 hour)
- **MCP Configuration**: `.mcp.json` delegating to existing npm package (30 minutes)
- **Documentation**: README updates with installation instructions (2-3 hours)
- **Testing**: Local validation with `claude --plugin-dir ./` (1 hour)
- **Total Timeline**: 2-3 weeks (down from original 6-10 weeks estimate)

**Readiness Gap Reassessment**:
Original 4-7 week preparation timeline was based on assumption of centralized marketplace with quality gates. Distributed model eliminates:
- ❌ Submission approval process (no waiting)
- ❌ Mandatory test suite before publishing (self-enforced standards)
- ❌ Mandatory security audit before publishing (self-enforced standards)
- ❌ Mandatory performance benchmarks before publishing (self-enforced standards)
- ✅ Quality improvements still valuable but can be done iteratively post-launch

**Strategic Tension (Resolved by Research)**:
The architecture review recommended a two-phase approach to validate demand before committing to a 4-7 week marketplace preparation phase. Post-decision research revealed the preparation timeline drops to 2-3 weeks due to the distributed marketplace model. This eliminates the primary rationale for phased validation (avoiding expensive upfront investment), making immediate marketplace creation a lower-risk decision.

This ADR documents the original analysis and the revised implementation approach based on research findings.

## Decision Drivers

* **Discovery Enhancement**: Marketplace provides Claude-native discovery path for users who don't browse GitHub, potentially expanding user base significantly
* **Market Positioning**: Early presence in emerging marketplace creates first-mover advantage and establishes framework as primary architecture tool
* **Quality Requirements**: Marketplace submission requires production-grade quality (tests, security audit, performance benchmarks) that benefits all users
* **Maintenance Burden**: Fourth distribution channel increases ongoing support obligations for solo maintainer (version sync, marketplace compliance, increased user expectations)
* **Competitive Landscape**: No direct competitors visible in marketplace currently, creating opportunity window
* **Technical Foundation**: Existing MCP server provides excellent base; thin wrapper architecture (95%+ code sharing) minimizes additional burden
* **Demand Validation**: Framework growing organically without marketplace; unclear if marketplace addresses acute pain point or represents nice-to-have growth accelerator
* **Readiness Assessment**: Preparation gap (4-7 weeks) between current state and marketplace-ready; premature submission risks poor ratings and reputation damage
* **Reversibility**: Enhanced GitHub presence is fully reversible; marketplace creates ongoing obligations that are harder to exit
* **Progressive Disclosure Advantage**: ADR-005 instruction capacity optimization positions framework competitively for marketplace semantic search and token efficiency

## Decision

**We will pursue Path A: Immediate Marketplace Creation** with a revised 2-3 week implementation timeline.

This decision prioritizes marketplace presence while acknowledging that post-decision research fundamentally changed the implementation approach. The distributed marketplace model eliminates submission approval processes and mandatory quality gates, reducing implementation from 6-10 weeks to 2-3 weeks. The thin wrapper architecture (delegating to existing MCP npm package) minimizes new code and maintenance burden.

**Key Implementation Points**:
1. Create self-hosted marketplace in our GitHub repository (`.claude-plugin/marketplace.json`)
2. Create plugin manifest (`.claude-plugin/plugin.json`) referencing existing MCP package
3. Configure MCP delegation (`.mcp.json` invoking npm package via `npx`)
4. Update documentation with plugin installation instructions
5. Self-publish immediately (no approval process)
6. Quality improvements (tests, security, performance) remain valuable but can be implemented iteratively post-launch

### Path A: Immediate Marketplace Creation (Revised)

**Description**: Create self-hosted marketplace immediately with 2-3 week implementation timeline, leveraging distributed marketplace model.

**Revised Approach** (Based on Research Findings):
1. **Week 1**: Plugin manifest creation, MCP configuration, local testing (5-8 hours total)
2. **Week 2**: Documentation updates, installation guide, demo video (8-12 hours total)
3. **Week 3**: Announcement, community engagement, initial feedback gathering (4-6 hours total)

**No Longer Required for Initial Launch**:
- ❌ Centralized marketplace submission/approval (no centralized marketplace exists)
- ❌ Extensive test suite before publishing (can iterate post-launch)
- ❌ Formal security audit before publishing (can iterate post-launch)
- ❌ Performance benchmarks before publishing (can iterate post-launch)
- ❌ Beta phase with approval gates (self-publish, self-promote)

**Architecture**: Thin wrapper pattern (unchanged)
```
GitHub Repository (.claude-plugin/marketplace.json)
         ↓
Plugin Manifest (.claude-plugin/plugin.json)
         ↓
MCP Configuration (.mcp.json)
         ↓ (delegates via npx)
MCP Core Package (ai-software-architect npm)
```

**Rationale (Revised)**: Distributed marketplace model makes immediate creation low-risk (2-3 weeks vs. 6-10 weeks). No submission approval means fully under our control. Thin wrapper delegates to existing npm package, minimizing maintenance burden. Quality improvements remain valuable but can be implemented iteratively rather than as prerequisites.

**What Changed Post-Decision**:
After deciding on Path A, comprehensive research of official Claude Code documentation revealed:
- **No centralized marketplace**: Claude Code uses distributed, self-hosted marketplaces (not an Anthropic-curated app store)
- **No submission process**: We create `.claude-plugin/marketplace.json` in our GitHub repo and self-publish
- **No approval gates**: No waiting for review, no quality requirements to meet before publishing
- **Lower implementation cost**: 2-3 weeks (manifest creation + docs) vs. 6-10 weeks (extensive preparation + beta + approval)
- **Higher reversibility**: Fully under our control (our GitHub repo), no external approval to unwind
- **Different discovery model**: No centralized search/ratings; discovery via GitHub, SEO, community

See [Research Document](../../research/claude-marketplace-requirements.md) for complete findings.

### Path B: Phased Approach (Two-Phase Strategy) [Not Chosen]

**Note**: This path was recommended unanimously by the architecture team but not selected. It is documented here for reference and future consideration.

**Description**: Phase 1 validates demand through enhanced GitHub presence before conditionally proceeding to Phase 2 marketplace submission.

**Phase 1** (Immediate, Weeks 1-2):
- Improve README (video, install decision tree, quick-start)
- Enable GitHub Discussions (FAQ, use cases, showcase)
- Create SHOWCASE.md (example projects, testimonials)
- Optimize SEO (repo description, topics, keywords)
- Establish baseline metrics (clone rate, installation preferences)

**Phase 2** (Conditional, Month 3-4):
- **Triggers**: Proceed only if:
  - GitHub clone rate plateaus after Phase 1 enhancements, OR
  - 10+ explicit user requests for marketplace listing, OR
  - Marketplace becomes dominant Claude discovery channel, OR
  - Maintainer capacity increases (co-maintainer, automation complete)
- **Execution**: 6-week marketplace preparation (same as Path A)

**Architecture** (if Phase 2 triggered): Same thin wrapper as Path A

**Rationale**: Reduces risk by validating demand first, delivers quick value (2 weeks) while preserving marketplace option, fully reversible Phase 1 improves experience regardless of Phase 2 decision.

### Architectural Decision (Regardless of Path)

> **Amended by [ADR-015](./ADR-015-mcp-skills-parity-reconciliation.md) (2026-06-16):** Two claims in
> this section did not hold and are corrected there (this passage is preserved as the historical
> record, per the append-only ADR-amendment convention). (1) "**95%+ code sharing**" (line below)
> describes the *marketplace-wrapper → MCP-npm* relationship only; the MCP server and the Skills share
> **zero** code — they are independent reimplementations. (2) "**All channels provide identical core
> features**" is false for LLM-orchestrated reviews: those are plugin/Skills-only by capability (an MCP
> server cannot dispatch host subagents). ADR-015 adopts a two-tier capability model and **removed** the
> three MCP pseudo-review tools rather than continue implying parity.

**If marketplace plugin is built, the architectural approach is:**

**Thin Wrapper Architecture** with 95%+ code sharing:
- Marketplace plugin package (@ai-software-architect/marketplace) contains only marketplace-specific metadata and minimal adapter code
- Core functionality delegated to existing MCP npm package (ai-software-architect)
- Benefits: Minimizes maintenance burden, ensures feature parity across all channels, improvements benefit all users simultaneously
- Trade-off: Limits marketplace-specific optimizations initially (can evolve based on validated demand)

**Core Parity + Optional Enhancements**:
- All channels provide identical core features (setup, ADR creation, reviews, status, pragmatic mode, implementation guidance)
- Platform-specific enhancements remain optional (Skills auto-invocation, marketplace ratings UI, MCP programmatic API)
- Users can switch installation methods without losing functionality

**Version Synchronization**:
- Single version number shared across all channels
- Automated release pipeline: git tag → npm publish → Skills update → marketplace sync
- Prevents version drift and user confusion

**Architectural Components Affected:**
* mcp/index.js - Needs modularization (extract to tools/ directory)
* mcp/package.json - Version coordination, marketplace metadata
* .github/workflows/ - New CI/CD pipeline for multi-channel releases
* README.md - Installation decision tree (Phase 1) or marketplace listing (Path A/Phase 2)
* .architecture/templates/ - No changes (core functionality unchanged)

**Interface Changes:**
* New installation path: Claude marketplace (fourth channel)
* Automated release process (replaces manual coordination)
* Optional marketplace-specific features (ratings, in-app UI) in future iterations

## Consequences

### Path A: Immediate Marketplace Submission

#### Positive

* **Earliest Market Presence**: 6-week path to marketplace listing captures first-mover advantage in emerging platform
* **Brand Recognition**: Early presence establishes framework as "the" architecture tool for Claude users before competitors appear
* **Comprehensive Preparation**: 6-week preparation phase delivers production-grade improvements (tests, security audit, performance optimization) that benefit all users regardless of marketplace success
* **Quality Foundation**: Marketplace submission forces addressing technical debt (test suite, modularization) that improves long-term maintainability
* **Single Decision Point**: Clear 6-week plan with defined deliverables eliminates ongoing "should we do marketplace?" debate
* **Semantic Search Advantage**: Progressive disclosure pattern (ADR-005) optimizes for marketplace discovery through LLM-powered search
* **Auto-Update Infrastructure**: Marketplace enables automatic updates for users, reducing version fragmentation

#### Negative

* **Unvalidated Demand**: Proceeding without evidence that marketplace solves acute discovery problem; framework growing organically without it
* **Opportunity Cost**: 6 weeks invested before validating if marketplace drives meaningful adoption; could address other user needs instead
* **Limited Reversibility**: Marketplace submission creates ongoing obligations (support, compliance, maintenance); harder to exit than not entering
* **Maintenance Burden**: Fourth channel increases support surface for solo maintainer even with thin wrapper architecture; version sync, marketplace-specific issues, increased user expectations
* **Premature Commitment**: If marketplace doesn't deliver ROI, stuck with maintenance burden and missed opportunity to pursue alternatives
* **Quality Risk**: Aggressive 6-week timeline may compromise preparation quality if unexpected issues arise; poor launch ratings are hard to recover from

#### Neutral

* **Preparation Timeline**: 6-week preparation is significant investment but necessary for quality; no shortcuts available
* **Beta Phase**: Beta submission mitigates risk but adds 2-4 weeks before stable promotion; extends timeline but improves quality
* **Competitive Window**: First-mover advantage assumes marketplace becomes primary discovery; timing uncertain
* **User Distribution**: Unknown what percentage of potential users will discover framework via marketplace vs. GitHub vs. npm

### Path B: Phased Approach (Two-Phase Strategy)

#### Positive

* **Risk Reduction**: Phase 1 (2 weeks) validates marketplace demand before Phase 2 (6 weeks) commitment; data-driven decision-making
* **Quick Value**: Phase 1 improvements (README, Discussions, SHOWCASE) deliver immediate benefits to all users regardless of Phase 2
* **Fully Reversible**: Phase 1 enhances GitHub presence with zero downside; can proceed or stop based on evidence
* **Resource Efficiency**: Avoid 6-week marketplace investment if Phase 1 reveals demand is satisfied by enhanced GitHub presence
* **Capacity Flexibility**: Gives time for automation and tooling to mature, potentially adding co-maintainer before fourth channel
* **Lower Pressure**: Phase 1 success creates natural momentum for Phase 2; failure provides clear signal not to proceed
* **Validates Assumption**: Tests whether discovery is actual problem vs. framework perception issue (documentation, positioning)

#### Negative

* **Delayed Marketplace**: Earliest marketplace presence is Month 3-4 (if triggered); risks losing first-mover advantage to competitors
* **Two Decision Points**: Requires evaluation after Phase 1 (Month 3) to determine Phase 2; ongoing strategic consideration
* **Competitor Risk**: Delayed entry allows competitors to claim marketplace positioning first
* **Signal Interpretation**: Phase 1 metrics (clone rate, user requests) may not perfectly predict marketplace success; could miss opportunity due to false negative
* **Extended Timeline**: 8-10 weeks total (2 weeks Phase 1 + monitoring + 6 weeks Phase 2) vs. 6 weeks for immediate path
* **Analysis Burden**: Requires establishing metrics, monitoring, and decision framework for Phase 2 trigger evaluation

#### Neutral

* **Trigger Conditions**: Success criteria for Phase 2 (10+ requests, clone rate plateau) are somewhat arbitrary; require judgment
* **Preparation Reuse**: If Phase 2 triggered, can reuse some Phase 1 work (documentation, showcase) for marketplace listing
* **Timing Flexibility**: Phase 2 can be deferred indefinitely if Phase 1 continues delivering value; not now-or-never decision

### Shared Consequences (Both Paths)

#### Positive

* **Thin Wrapper Architecture**: 95%+ code sharing minimizes maintenance burden of fourth channel
* **Quality Improvements**: Test suite, security audit, performance optimization benefit all users regardless of marketplace outcome
* **Multi-Channel Strategy**: Framework supports multiple user preferences (Skills, MCP, Traditional, Marketplace) maximizing accessibility

#### Negative

* **Complexity Increase**: Four distribution channels adds conceptual overhead for users ("which should I use?") requiring clear decision guidance
* **Support Surface**: More channels means more potential support questions and edge cases even with feature parity

#### Neutral

* **Solo Maintainer Constraint**: Both paths face fundamental capacity limitation; automation and thin wrapper mitigate but don't eliminate
* **Marketplace Maturity**: Claude marketplace is emerging platform; both paths bet on marketplace becoming significant discovery channel

## Implementation Strategy

### Blast Radius

#### Impact Scope

**If marketplace plugin succeeds**:
- Positive blast radius: New user segment (Claude-native users unfamiliar with GitHub/npm)
- Expands framework reach and accelerates adoption
- Increases visibility through marketplace ratings and curation

**If marketplace plugin fails (poor ratings, low adoption)**:
- Negative blast radius: Reputation damage in Claude ecosystem
- Poor ratings are public and persistent, affecting all channels
- Support burden without corresponding adoption benefit
- Time investment (6 weeks) lost to opportunity cost

**If marketplace plugin creates maintenance issues**:
- Affects solo maintainer capacity for all channels
- Version drift risk if release automation inadequate
- Support questions increase without proportional value

#### Affected Components

**Codebase**:
- mcp/index.js - Modularization (1,823 lines → focused modules)
- mcp/tools/ - New directory structure (setup.js, adr.js, review.js, pragmatic.js, status.js, implementation.js)
- mcp/tests/ - New test suite (integration tests for all operations)
- .github/workflows/ - CI/CD pipeline for multi-channel releases

**Distribution**:
- Existing: Claude Skills, MCP npm package, Traditional clone
- New: Claude marketplace listing (fourth channel)
- Release process: Manual → Automated git tag workflow

**Documentation**:
- README.md - Installation decision tree (helps users choose channel)
- SECURITY.md - Formal security policy for marketplace trust
- Marketplace listing - Descriptions, screenshots, onboarding

#### Affected Teams

**Internal** (Solo Maintainer):
- Development: 6 weeks preparation work (tests, refactoring, optimization)
- Support: Increased support surface from fourth channel
- Operations: Release automation setup and monitoring
- Strategy: Ongoing marketplace performance evaluation

**External** (Users):
- Current users: No disruption (existing channels unchanged)
- New users: Additional installation option with marketplace discovery
- Community: Potential growth in GitHub Discussions and SHOWCASE contributions

#### User Impact

**Positive**:
- Improved discoverability for Claude-native users
- Auto-update capability for marketplace installs
- Trust signals from marketplace curation and ratings
- Installation decision tree clarifies channel choices

**Negative**:
- Potential confusion from four installation methods
- Marketplace-specific issues (if quality preparation inadequate)
- Support response time may increase with larger user base

**Mitigation**:
- Clear installation decision tree in README and marketplace listing
- Feature parity documentation matrix (what's core vs. platform-enhanced)
- Set expectations: 3-5 day support response time in marketplace description
- Beta phase validates quality before stable promotion

#### Risk Mitigation

1. **Quality Risk** (poor marketplace ratings):
   - Mitigation: Complete 6-week preparation checklist (no shortcuts)
   - Beta submission for early feedback before stable
   - User testing (3-5 unfamiliar users) validates UX
   - Success criteria: 4+ stars after 100 installs

2. **Maintenance Burnout**:
   - Mitigation: Thin wrapper architecture (95%+ code sharing)
   - Automated release pipeline reduces manual work
   - Community moderators for GitHub Discussions
   - Deprecation path: Remove least-used channel if unsustainable

3. **Version Drift**:
   - Mitigation: Single version number across all channels
   - Automated workflow: git tag → all channels updated
   - CI tests verify feature parity
   - Monitoring: Track version distribution monthly

4. **Demand Mismatch** (marketplace doesn't drive adoption):
   - Mitigation: Phase 1 validates demand (Path B only)
   - Success metrics: 20%+ new users from marketplace
   - Review at Month 6: Deprecate if <10% usage + high burden
   - Reversibility: Thin wrapper enables graceful sunset

### Reversibility

#### Reversibility Level

**Path A (Immediate Marketplace)**: **Low-Medium Reversibility**
- Marketplace submission creates public commitment and user expectations
- Poor ratings are persistent and visible, affecting reputation
- Deprecation possible but creates user disruption and negative perception
- Time investment (6 weeks preparation) is sunk cost

**Path B, Phase 1 (Enhanced GitHub)**: **High Reversibility**
- GitHub improvements have zero downside, benefit all users
- No commitment to Phase 2; can stop at any point
- Investment (2 weeks) delivers value regardless of marketplace decision

**Path B, Phase 2 (Marketplace if triggered)**: **Low-Medium Reversibility**
- Same reversibility profile as Path A once marketplace submitted
- Difference: Validated demand reduces likelihood of needing reversal

**Thin Wrapper Architecture**: **Improves Reversibility**
- 95% code sharing means deprecating marketplace has minimal technical debt
- No marketplace-specific core features to migrate users away from
- Can sunset marketplace listing while preserving MCP npm package

#### Rollback Feasibility

**Before Marketplace Submission**:
- **Feasibility**: High
- **Process**: Stop preparation work, document learnings in ADR update
- **Impact**: Lost time investment, no external commitment
- **Timeline**: Immediate

**During Beta Phase**:
- **Feasibility**: Medium-High
- **Process**: Acknowledge beta didn't meet quality bar, withdraw submission
- **Impact**: Some reputation hit ("beta didn't work out"), but recoverable
- **Timeline**: 1-2 weeks (communication, cleanup)

**After Stable Launch**:
- **Feasibility**: Low-Medium
- **Process**: Announce deprecation (3-6 month timeline), guide users to alternative channels
- **Impact**: User disruption, negative perception, permanent marketplace record
- **Timeline**: 3-6 months (graceful migration period)

#### Migration Paths

**Forward Migration** (implementing marketplace):
- Path A: Direct 6-week preparation → beta → stable
- Path B: Phase 1 (2 weeks) → trigger evaluation → Phase 2 (6 weeks) → beta → stable

**Rollback Migration** (exiting marketplace):
1. Announce deprecation with clear timeline (3-6 months)
2. Update marketplace listing: "Deprecated - use MCP or Skills instead"
3. Create migration guide: Marketplace → MCP npm package (identical functionality)
4. Redirect support: Marketplace issues → GitHub Discussions
5. Archive marketplace listing (if platform allows) or mark unmaintained

**Evolution Path** (marketplace succeeds):
1. Start: Thin wrapper with feature parity (MVP)
2. Validation: Gather usage data via observability (3-6 months)
3. Enrichment: Add marketplace-specific features if data justifies (e.g., guided tutorials, in-app analytics, visual member customization)
4. Optimization: Leverage platform capabilities (auto-updates, ratings integration, community showcase)

#### Options Preserved

**By Phased Approach** (Path B):
- Option to stop after Phase 1 if metrics don't justify Phase 2
- Option to delay Phase 2 until maintainer capacity increases
- Option to validate assumptions before costly commitment
- All Phase 1 improvements retained regardless of Phase 2 decision

**By Thin Wrapper Architecture**:
- Option to add marketplace-specific features later (progressive enrichment)
- Option to deprecate marketplace without losing core codebase
- Option to repurpose wrapper for future distribution channels
- Flexibility to optimize per-platform without code duplication

**By Beta Submission**:
- Option to iterate based on early feedback before stable
- Option to withdraw if beta reveals fundamental issues
- Option to validate quality with limited blast radius

#### Commitments Made

**Marketplace Submission Commits To**:
- Ongoing support and maintenance for marketplace users
- Marketplace policy compliance (security, privacy, content)
- Public ratings and reviews (reputation risk)
- Version synchronization across all channels
- Support response time expectations (<3-5 days)

**Path A Commits Immediately**:
- 6-week preparation timeline before any validation
- Fourth distribution channel maintenance from Day 1
- Marketplace submission outcome (accept/reject) outside our control

**Path B Defers Commitment**:
- Only commit to 2-week Phase 1 immediately
- Marketplace commitment (Phase 2) is conditional on triggers
- Data-driven decision point at Month 3 review

### Sequencing & Timing

#### Prerequisites

**For Either Path**:
- [ ] Strategic decision documented (this ADR)
- [ ] Maintainer capacity assessment (hours/week available)
- [ ] Current baseline metrics (GitHub clone rate, support time/week)

**For Path A or Path B Phase 2**:
- [ ] Test framework selected (Node.js test runner or vitest)
- [ ] Security audit schedule confirmed
- [ ] Performance benchmarking tools identified
- [ ] CI/CD platform ready (GitHub Actions)
- [ ] Beta testing plan and tester recruitment strategy
- [ ] Marketplace submission requirements researched

**For Path B Phase 1**:
- [ ] Video recording software/plan (demo video for README)
- [ ] GitHub Discussions categories defined
- [ ] SHOWCASE examples identified (need 3-5 example projects)

#### System Readiness

**Observability**: **Partially Ready**
- Current: GitHub Issues for feedback, qualitative only
- Needed: Local telemetry for usage patterns (deferred to Month 2-3)
- Marketplace Impact: Can proceed without, but limits iteration capability
- **Assessment**: Adequate for launch, improve post-launch

**Dependencies**: **Ready**
- MCP SDK: Stable (@modelcontextprotocol/sdk 1.0.4)
- Node.js: LTS versions well-supported (18+)
- YAML parsing: Mature (js-yaml)
- **Assessment**: No dependency blockers

**Infrastructure**: **Needs Preparation**
- Current: Manual npm publish, manual release coordination
- Needed: CI/CD pipeline for multi-channel releases (3-4 days)
- Marketplace Impact: Critical for preventing version drift
- **Assessment**: Build during preparation phase (Week 5-6)

**Data Migration**: **Not Applicable**
- No user data migrations required
- No breaking changes to existing channels
- **Assessment**: No concerns

#### Team Readiness

**Understanding**: **High for Core, Medium for Marketplace**
- Team (architecture review members) understands marketplace opportunity thoroughly
- Maintainer understands MCP architecture and framework internals
- Marketplace-specific knowledge (submission process, policies) needs research (1-2 days)
- **Assessment**: Research needed but not blocking

**Skills**: **High for Core, Medium for Marketplace**
- Strong: Node.js development, MCP protocol, architecture documentation
- Adequate: Testing (setup needed but concept understood), security practices
- Needs Development: CI/CD pipeline setup, performance benchmarking, user testing facilitation
- **Assessment**: Skill gaps addressable during preparation

**Training Needs**:
- Marketplace submission guidelines (2-4 hours research)
- Test framework setup and best practices (1 day learning)
- Performance benchmarking tools (4-8 hours)
- CI/CD pipeline configuration (4-8 hours)
- User testing facilitation techniques (4 hours)
- **Total**: ~3 days learning budget within 6-week timeline

**Consensus**: **Strong for Phased, Mixed for Immediate**
- Architecture team unanimous: Two-phase approach (Path B) recommended
- User stated preference: "Pursue marketplace now" (Path A)
- **Resolution**: This ADR presents both paths for informed decision
- **Assessment**: Consensus on phased approach; immediate path requires accepting architects' concerns

#### Sequencing Concerns

**Should Other Changes Happen First?**

**Path A Sequencing**:
1. ✅ **First**: Test suite + modularization (Week 1-2) - Foundation for confident changes
2. ✅ **Second**: Security audit + performance baseline (Week 3-4) - Quality gates for submission
3. ✅ **Third**: Error UX + metadata (Week 5) - User-facing polish
4. ✅ **Fourth**: Beta submission + testing (Week 6) - Validation before stable
5. ✅ **Last**: Stable promotion (Month 3) - Full marketplace presence

**Path B Sequencing**:
1. ✅ **First**: Phase 1 GitHub enhancements (Week 1-2) - Quick value, validate demand
2. ✅ **Second**: Monitor metrics (Month 1-3) - Gather evidence
3. ⏸️ **Conditional**: Phase 2 marketplace preparation (same as Path A sequencing) - Only if triggered

**Sequencing Rationale**:
- **Tests first** because they enable confident refactoring and catch regressions
- **Modularization first** because it improves all subsequent work (easier to test, audit, optimize modular code)
- **Security before beta** because marketplace requires trust, can't fix post-submission
- **Performance before beta** because first impressions matter, poor performance affects ratings
- **Beta before stable** because validation with limited blast radius catches issues
- **Path B Phase 1 first** because low-cost validation reduces Phase 2 risk

**What Coordination Is Required?**

**Internal Coordination** (Solo Maintainer):
- No team coordination needed (single contributor)
- Self-coordination: Block calendar for 6-week preparation (Path A) or 2-week Phase 1 (Path B)
- Priority trade-offs: Marketplace preparation vs. feature requests vs. support

**External Coordination** (Community):
- Beta tester recruitment (announce 2-3 weeks before Week 6)
- SHOWCASE contributor outreach (for example projects)
- GitHub Discussions seeding (recruit 2-3 power users to seed discussions)
- Social media timing (coordinate marketplace launch announcement)

**Platform Coordination** (Claude Marketplace):
- Submit inquiry about marketplace requirements (Week 0, 1-2 day response)
- Beta submission review (Week 6, 1-2 week review cycle)
- Stable promotion approval (Month 3, variable timeline)

**Are There Timing Dependencies?**

**Claude Marketplace Maturity**:
- Marketplace is emerging (new platform, evolving)
- Risk: Submitting too early → immature platform, limited discoverability
- Risk: Submitting too late → competitors claim positioning
- **Assessment**: Timing window open now but closing (next 3-6 months)

**Framework Roadmap**:
- No upcoming breaking changes planned
- No features in flight that would conflict
- **Assessment**: No internal timing blockers

**Maintainer Capacity**:
- Solo maintainer availability fluctuates
- 6-week preparation requires sustained focus (~20-30 hours/week)
- **Assessment**: Confirm capacity before committing to Path A

**Competitive Timing**:
- No direct competitors visible in marketplace currently
- Risk increases over time as marketplace matures
- **Assessment**: First-mover window is limited (months, not years)

#### Readiness Assessment

**Path A (Immediate Marketplace)**: **Needs Preparation**
- System: Ready after 6-week preparation phase
- Team: Ready with 3 days learning budget
- Timing: Window open, capacity needs confirmation
- **Recommendation**: Proceed if maintainer capacity available (20-30 hrs/week for 6 weeks)

**Path B, Phase 1 (Enhanced GitHub)**: **Ready to Implement**
- System: Ready (no technical prerequisites)
- Team: Ready (skills available)
- Timing: Optimal (immediate value, no dependencies)
- **Recommendation**: Proceed immediately (2 weeks distributed effort)

**Path B, Phase 2 (Marketplace if Triggered)**: **Conditional on Phase 1**
- Evaluate readiness after 3-month Phase 1 monitoring
- Reassess maintainer capacity, automation maturity, demand signals
- **Recommendation**: Defer decision until Phase 1 complete

### Social Cost

#### Learning Curve

**For Users**:
- **Path A**: Medium
  - New installation option (marketplace) requires decision guidance
  - Four installation methods create choice complexity
  - Mitigation: Installation decision tree in README and marketplace listing
  - Time to proficiency: <30 minutes (choosing channel + installation)

- **Path B, Phase 1**: Low
  - Improvements to existing GitHub experience (README, Discussions)
  - No new concepts or installation methods
  - Time to proficiency: <5 minutes (marginally better onboarding)

- **Both Paths**: Core functionality unchanged
  - Users who choose any channel get same features (ADRs, reviews, pragmatic mode)
  - No new architectural concepts to learn
  - Existing users unaffected

**For Maintainer**:
- **Path A**: High
  - Test framework setup and writing tests (new skill, 1 day learning)
  - CI/CD pipeline configuration (4-8 hours)
  - Performance benchmarking (4-8 hours)
  - Marketplace submission process (2-4 hours)
  - Total learning time: ~3 days within 6-week timeline
  - Ongoing: Fourth channel support patterns (learn through experience)

- **Path B, Phase 1**: Low
  - Content creation (README, SHOWCASE) uses existing skills
  - GitHub Discussions administration (< 2 hours learning)
  - Ongoing: Minimal new knowledge required

#### Cognitive Load

**Path A (Marketplace)**:

**Mental Overhead**:
- Four distribution channels to maintain (Skills, MCP, Traditional, Marketplace)
- Version synchronization across channels (mitigated by automation)
- Channel-specific support questions ("How do I install from marketplace?")
- Marketplace policy compliance monitoring
- Multi-channel release coordination (mitigated by CI/CD)

**Complexity vs. Clarity Trade-off**:
- **Complexity Added**: Fourth distribution channel, marketplace-specific issues, release automation pipeline
- **Clarity Improved**: Forces documentation of installation decision criteria, formalizes security practices, improves test coverage
- **Net Assessment**: Complexity increase justified IF marketplace drives significant adoption (>20% of users)

**Decision Fatigue**:
- Four-channel strategy requires ongoing "which channel for this user?" thinking
- Feature parity maintenance: "Should this feature work in marketplace?" decisions
- Support prioritization: "Which channel's issues are most urgent?"

**Path B, Phase 1 (Enhanced GitHub)**:

**Mental Overhead**:
- Minimal: Improves existing channel documentation
- GitHub Discussions moderation (incremental, ~1 hour/week)
- SHOWCASE maintenance (ad-hoc, community-driven)

**Complexity vs. Clarity Trade-off**:
- **Complexity Added**: Minimal (content creation, community engagement)
- **Clarity Improved**: Better README, documented installation choices, community examples
- **Net Assessment**: Clarity gains significantly outweigh minimal complexity

**Path B, Phase 2 (Marketplace if Triggered)**:
- Same cognitive load as Path A
- Difference: Validated demand justifies cognitive overhead

#### Clarity Assessment

**Will This Help More Than Confuse?**

**Path A**: **Depends on Execution**
- **Helps if**: Marketplace becomes primary Claude discovery, installation decision tree is clear, feature parity maintained
- **Confuses if**: Users don't know which channel to choose, marketplace-specific issues create support burden, documentation unclear
- **Probability of Help**: Medium (60% - depends on marketplace adoption and documentation quality)
- **Mitigation**: Excellent installation decision tree, feature parity matrix, clear channel differentiation

**Path B, Phase 1**: **Yes - Clear Help**
- Better README helps all users immediately
- GitHub Discussions reduces "where do I ask questions?" confusion
- SHOWCASE provides concrete examples and inspiration
- **Probability of Help**: High (90% - direct improvements to existing pain points)

**Explanation Required**:

**Path A**:
- Installation decision tree (visual flowchart + text)
- Channel comparison matrix (when to use Skills vs. MCP vs. Traditional vs. Marketplace)
- Feature parity documentation (what's core vs. platform-specific)
- Marketplace-specific setup guide (first-run experience)
- Support channels guide (where to get help for each installation method)

**Path B, Phase 1**:
- Updated README with video and quick-start
- GitHub Discussions welcome post and FAQ
- SHOWCASE contribution guidelines

**Onboarding Impact**:

**Path A**:
- **Positive**: Marketplace onboarding can be optimized (tutorial flow, guided setup)
- **Negative**: More choices create decision paralysis for new users
- **Net**: Neutral to slightly negative unless decision tree is exceptional
- **Recommendation**: User testing (3-5 unfamiliar users) validates onboarding

**Path B, Phase 1**:
- **Positive**: Improved README and video accelerate time-to-value
- **Negative**: None (improvements only)
- **Net**: Positive onboarding impact
- **Recommendation**: Quick implementation, immediate benefit

#### Documentation Needs

**Path A (Immediate Marketplace)**:
- [ ] Installation decision tree (flowchart + text) - 1 day
- [ ] Feature parity matrix (core vs. platform-enhanced) - 0.5 days
- [ ] Marketplace-specific setup guide - 0.5 days
- [ ] SECURITY.md (formal security policy) - 0.5 days
- [ ] Marketplace listing description (semantic search optimized) - 1 day
- [ ] Contributing guidelines update (new structure after modularization) - 0.5 days
- [ ] Release process documentation (CI/CD pipeline) - 0.5 days
- [ ] Support channels guide (where to get help) - 0.5 days
- **Total**: ~5 days documentation work (within 6-week timeline)

**Path B, Phase 1 (Enhanced GitHub)**:
- [ ] README improvements (video embed, quick-start, decision tree) - 1 day
- [ ] GitHub Discussions welcome post and FAQ seeding - 0.5 days
- [ ] SHOWCASE.md creation (template + 3 examples) - 1 day
- [ ] Installation decision tree (for README) - 0.5 days
- **Total**: ~3 days documentation work (within 2-week timeline)

**Path B, Phase 2 (If Triggered)**:
- Same documentation needs as Path A
- Can reuse Phase 1 work (installation decision tree, SHOWCASE examples)

### Confidence Assessment

#### Model Correctness Confidence

**Overall Confidence**: **Medium-High (7/10)**

**High Confidence Areas** (8-9/10):
- Thin wrapper architecture will minimize maintenance burden (proven pattern from Skills implementation)
- Test suite will improve quality and catch regressions (industry standard practice)
- Enhanced GitHub presence will improve onboarding (validated by user feedback on documentation gaps)
- Progressive disclosure (ADR-005) provides competitive advantage for marketplace semantic search

**Medium Confidence Areas** (6-7/10):
- Marketplace will become primary discovery channel for Claude users (assumption, not validated)
- Marketplace adoption will justify fourth channel maintenance burden (depends on platform maturity and user behavior)
- 6-week preparation timeline is sufficient for marketplace-ready quality (based on estimates, not experience)
- Phase 1 metrics (clone rate, user requests) will accurately predict marketplace demand (assumption about signal correlation)

**Lower Confidence Areas** (4-5/10):
- First-mover advantage will persist as marketplace matures (depends on competitive landscape and platform evolution)
- Solo maintainer can sustainably support four channels even with automation (capacity constraint)
- Claude marketplace will become dominant enough to justify investment (platform adoption risk)

**What Could Make Tests Pass While Model Is Wrong?**

**Scenario 1**: Tests verify thin wrapper delegates to MCP core correctly, but marketplace users encounter issues that don't affect other channels
- **Example**: Marketplace-specific permission model, version conflicts, platform-specific bugs
- **Mitigation**: Beta phase with real marketplace users before stable promotion

**Scenario 2**: Performance benchmarks show acceptable metrics in test projects, but real user projects hit scaling issues
- **Example**: Large monorepos (1000s of files), complex .architecture configurations, concurrent operations
- **Mitigation**: Beta testing with diverse project types and sizes

**Scenario 3**: Security audit finds no issues in current code, but marketplace environment exposes new attack vectors
- **Example**: Marketplace-specific permissions, interaction with other plugins, platform security model
- **Mitigation**: Marketplace security review process, file system isolation tests

**Scenario 4**: Phase 1 metrics show strong GitHub engagement, but marketplace users have different needs/expectations
- **Example**: Marketplace users expect guided tutorials, in-app UI, different UX patterns than GitHub/npm users
- **Mitigation**: Phase 2 user research before implementation, don't assume channel equivalence

#### Assumptions

**Critical Assumptions** (High Impact if Wrong):

1. **Assumption**: Marketplace will provide significant discoverability improvement over GitHub/npm
   - **Validation**: Medium - No data on marketplace reach, assuming based on platform prominence
   - **Impact if Wrong**: Marketplace investment doesn't deliver ROI, fourth channel maintenance burden without benefit
   - **Test**: Phase 1 establishes baseline, Phase 2 measures marketplace contribution

2. **Assumption**: Thin wrapper architecture (95% code sharing) adequately minimizes maintenance burden
   - **Validation**: High - Proven pattern from Skills implementation shows viability
   - **Impact if Wrong**: Fourth channel creates unsustainable maintenance load even with automation
   - **Test**: Beta phase reveals actual maintenance burden before stable commitment

3. **Assumption**: Solo maintainer capacity can sustain four channels with automation and thin wrapper
   - **Validation**: Low - No experience managing four channels yet
   - **Impact if Wrong**: Maintainer burnout, project stagnation, quality degradation across all channels
   - **Test**: Monitor time spent on support/maintenance during beta phase

**Moderate Assumptions** (Medium Impact if Wrong):

4. **Assumption**: 6-week preparation timeline produces marketplace-ready quality
   - **Validation**: Medium - Based on estimates, not prior marketplace submission experience
   - **Impact if Wrong**: Rushed preparation leads to marketplace rejection or poor launch ratings
   - **Test**: Beta submission reveals preparation adequacy before stable

5. **Assumption**: Marketplace users have similar needs/expectations as GitHub/npm users (feature parity sufficient)
   - **Validation**: Low - No data on marketplace user preferences yet
   - **Impact if Wrong**: Marketplace users dissatisfied with experience, poor ratings, requires rework
   - **Test**: Beta phase user feedback reveals marketplace-specific needs

6. **Assumption**: Phase 1 metrics (GitHub clone rate, user requests) accurately predict marketplace demand
   - **Validation**: Low - Correlation between GitHub and marketplace adoption is assumed
   - **Impact if Wrong**: Phase 1 shows weak signals, defer Phase 2, miss marketplace opportunity
   - **Test**: Cannot fully validate without actually launching marketplace (chicken-and-egg problem)

**Lower Assumptions** (Lower Impact if Wrong):

7. **Assumption**: Claude marketplace will mature into dominant discovery channel for plugins
   - **Validation**: Low - Marketplace is emerging, adoption trajectory uncertain
   - **Impact if Wrong**: Marketplace never achieves critical mass, but framework still benefits from quality improvements
   - **Test**: Monitor marketplace growth metrics quarterly

8. **Assumption**: No direct competitors will claim marketplace positioning in next 3-6 months
   - **Validation**: Low - Competitive landscape can change rapidly
   - **Impact if Wrong**: Lose first-mover advantage, but framework quality still valuable
   - **Test**: Monthly competitive research (marketplace plugin search)

#### Uncertainty Areas

**Technical Uncertainties**:
- Marketplace submission requirements and review process (unknown until researched)
- Marketplace-specific technical constraints (permissions, APIs, limitations)
- Performance at scale with real user projects (not benchmarked yet)
- Thin wrapper edge cases (marketplace-specific issues not visible in other channels)

**Market Uncertainties**:
- Marketplace adoption trajectory (will it become primary discovery channel?)
- User preferences between channels (why choose marketplace vs. npm vs. Skills?)
- Competitive landscape evolution (who else is building architecture tools?)
- Platform risk (marketplace policies, curation criteria, platform changes)

**Resource Uncertainties**:
- Solo maintainer capacity sustainability (can four channels be maintained long-term?)
- Automation effectiveness (will CI/CD reduce coordination burden enough?)
- Community contribution potential (will users contribute to SHOWCASE, Discussions?)
- Time-to-marketplace-ready (are 6-week estimates accurate?)

#### Validation Approach

**Phase 1 Validation** (Path B):
1. **Implement GitHub enhancements** (2 weeks)
2. **Establish baseline metrics** (Week 1): GitHub clone rate, installation method preferences, support question frequency
3. **Monitor monthly** (Month 1-3): Track metrics, count marketplace requests, note user feedback themes
4. **Evaluate at Month 3**: Do metrics justify Phase 2? (10+ requests OR clone rate plateau OR clear demand signals)
5. **Decision point**: Proceed to Phase 2 or continue enhancing GitHub presence

**Preparation Validation** (Path A or Path B Phase 2):
1. **Test suite validation** (Week 2): Verify 80%+ coverage, all operations tested, CI passing
2. **Security validation** (Week 3): npm audit clean, security policy documented, isolation tests passing
3. **Performance validation** (Week 4): Baselines meet targets (startup <500ms, setup <10s, memory <50MB)
4. **UX validation** (Week 5): User testing (3-5 unfamiliar users) reveals no blocking issues

**Beta Validation** (Week 6):
1. **Submit beta** to marketplace, respond to review feedback
2. **Recruit beta testers** (10-20 users), gather feedback through surveys and interviews
3. **Monitor metrics**: Installation success rate, error frequency, support question volume
4. **Iterate** based on feedback
5. **Decision gate**: Proceed to stable only if 4+ star average rating, no blocking issues

**Post-Launch Validation** (Month 3+):
1. **Track success metrics**: Marketplace installs, ratings, user distribution across channels
2. **Monitor maintenance burden**: Time spent on marketplace-specific support, release coordination
3. **Evaluate ROI at Month 6**: Does marketplace justify fourth channel? (>20% users + manageable burden)
4. **Decision gate**: Continue, optimize, or deprecate based on evidence

#### Edge Cases

**Edge Cases Not Captured by Testing**:

1. **Large Monorepo Performance**:
   - **Description**: Framework setup in repository with 10,000+ files, multiple .architecture directories, complex configurations
   - **Why Missed**: Test projects typically small (100s of files), performance tests use reference project size
   - **Impact**: Poor marketplace experience for enterprise users, slow operations, timeouts
   - **Mitigation**: Document known limitations, add configurable timeouts, implement sample-based analysis for large projects

2. **Concurrent Multi-User Operations**:
   - **Description**: Multiple developers in same repository running architecture operations simultaneously
   - **Why Missed**: Tests assume single-user usage, no concurrency testing
   - **Impact**: File locking issues, race conditions, corrupted YAML
   - **Mitigation**: Document single-user-at-a-time limitation, add file locking if becomes common pain point

3. **Marketplace-Specific Permission Models**:
   - **Description**: Claude marketplace may have different permission requirements or file system access constraints
   - **Why Missed**: Tests run in standard Node.js environment, marketplace environment unknown until submission
   - **Impact**: Submission rejection or runtime failures in marketplace but not other channels
   - **Mitigation**: Beta phase reveals environment-specific issues before stable

4. **Plugin Interaction Edge Cases**:
   - **Description**: Framework interacting with other Claude marketplace plugins, potential conflicts or unexpected behaviors
   - **Why Missed**: Tests assume isolated environment, no other plugins present
   - **Impact**: Mysterious bugs that only manifest when specific plugin combinations installed
   - **Mitigation**: Document known incompatibilities as discovered, isolate file operations to .architecture/ namespace

5. **Version Drift During Transition**:
   - **Description**: User has v1.3.0 via MCP, marketplace releases v1.4.0, user confused by feature availability differences
   - **Why Missed**: Tests verify single channel, not cross-channel user experience
   - **Impact**: Support burden, user confusion about feature availability
   - **Mitigation**: Prominent version synchronization messaging, automated release pipeline enforces parity

6. **Internationalization Issues**:
   - **Description**: Framework assumes English, but marketplace may have international users with different locales, file systems (non-ASCII paths)
   - **Why Missed**: Tests use English and standard ASCII paths
   - **Impact**: File operations fail for users with non-ASCII home directories, error messages unclear for non-English users
   - **Mitigation**: Document English-only limitation currently, prioritize i18n if marketplace shows international adoption

## Implementation

### Overview

Implementation follows the revised Path A approach based on research findings showing distributed marketplace model. Original 6-10 week timeline reduced to 2-3 weeks by eliminating submission approval processes and mandatory pre-launch quality gates.

### Path A: Immediate Marketplace Creation (2-3 Weeks, Revised)

**Week 1: Plugin Manifest & Configuration (5-8 hours total)**

**Day 1: Create Plugin Structure (2-3 hours)**
- Create `.claude-plugin/` directory
- Write `plugin.json` manifest:
  - Required fields: name, version, description
  - Optional fields: author, homepage, repository, license, keywords
  - Component paths: mcpServers reference
- Write `marketplace.json` catalog:
  - Marketplace metadata: name, owner
  - Plugin entry with source path
- Create `.mcp.json` configuration:
  - Delegate to npm package via npx
  - Configure environment variables

**Day 2: Local Testing & Validation (2-3 hours)**
- Test locally: `claude --plugin-dir ./`
- Validate manifests: `claude plugin validate .`
- Verify MCP server starts correctly
- Test all framework operations (setup, ADR, reviews, status, pragmatic mode)
- Fix any issues discovered

**Day 3: Documentation Review (1-2 hours)**
- Review current documentation for accuracy
- Plan README updates and installation guide

**Week 2: Documentation & Demo Materials (8-12 hours total)**

**Days 1-2: README Updates (4-6 hours)**
- Add "Install as Claude Code Plugin" section to README
- Installation instructions:
  ```bash
  /plugin marketplace add anthropics/ai-software-architect
  /plugin install architect-tools@ai-software-architect
  ```
- Create installation decision tree (when to use Plugin vs. MCP vs. Skills vs. Clone)
- Add plugin badge/button
- Update existing documentation references

**Days 3-4: Demo Video & Installation Guide (4-6 hours)**
- Record demo video (5-10 minutes):
  - Installing the plugin
  - Running setup
  - Creating an ADR
  - Starting an architecture review
- Create detailed installation guide with screenshots
- Embed video in README and documentation site

**Day 5: SEO & Discovery Optimization (1-2 hours)**
- Update repository topics: `claude-code`, `claude-plugin`, `architecture`, `adr`, `documentation`
- Update repository description
- Optimize README for searchability: "claude code architecture plugin"

**Week 3: Launch & Community Engagement (4-6 hours total)**

**Day 1: Commit & Push (1 hour)**
- Commit all plugin files to repository
- Push to GitHub
- Verify marketplace.json is accessible
- Test installation from published repository

**Day 2: Announcement (2-3 hours)**
- GitHub Discussions: "Now available as Claude Code plugin"
- Update project documentation site
- Social media announcement (if applicable)
- Community engagement (Reddit, Discord, etc.)

**Days 3-5: Monitor & Respond (1-2 hours)**
- Monitor GitHub Discussions for questions
- Respond to installation issues
- Gather initial feedback
- Track metrics: clone rate, discussions activity, reported issues

**Total Timeline**: 2-3 weeks from decision to marketplace availability

**Post-Launch (Ongoing)**:
- Monitor adoption metrics (installations via clone rate, GitHub Discussions activity)
- Respond to user feedback and issues
- Iterate on documentation based on common questions
- Consider quality improvements based on validated usage patterns:
  - Test suite (if regression issues emerge)
  - Performance optimization (if performance complaints arise)
  - Error message improvements (if users report confusion)
  - Security formalization (if enterprise adoption increases)
  - Release automation (if multi-channel coordination becomes burden)

**Quality Improvements (Deferred, Iterative)**:

The original 6-week preparation phase included quality improvements that remain valuable but are no longer prerequisites for launch in the distributed marketplace model. These can be implemented iteratively based on validated need:

1. **Test Suite** (5-7 days, if needed):
   - Implement if regression bugs become frequent
   - Target 80%+ coverage of core MCP operations
   - Integrate into CI for ongoing quality

2. **Code Modularization** (3-5 days, if needed):
   - Extract mcp/index.js (1,823 lines) to focused modules
   - Implement if codebase navigation becomes problem
   - Benefits all channels, not just plugin

3. **Security Audit** (1-2 days, if needed):
   - Formalize security practices
   - Document in SECURITY.md
   - Implement if enterprise adoption requires it

4. **Performance Optimization** (3-4 days, if needed):
   - Benchmark and optimize if performance complaints arise
   - Config caching, template pre-loading
   - Progress indicators for long operations

5. **Release Automation** (3-4 days, if needed):
   - CI/CD pipeline for multi-channel releases
   - Implement if manual coordination becomes unsustainable
   - Version synchronization automation

These improvements transition from "required before launch" to "valuable when validated by actual usage patterns."

### Thin Wrapper Architecture (If Marketplace Pursued)

**Package Structure**:
```
@ai-software-architect/marketplace (thin wrapper)
├── package.json (marketplace metadata + ai-software-architect dependency)
├── index.js (~50 lines: import MCP core, export marketplace adapter)
├── README.md (marketplace-specific installation guide)
└── assets/
    ├── icon.png
    ├── screenshot1.png
    └── screenshot2.png

ai-software-architect (MCP core, existing package)
├── mcp/
│   ├── index.js (main export, delegates to tools/)
│   ├── tools/
│   │   ├── setup.js
│   │   ├── adr.js
│   │   ├── review.js
│   │   ├── pragmatic.js
│   │   ├── status.js
│   │   └── implementation.js
│   ├── tests/ (integration tests)
│   └── package.json
└── .architecture/ (framework templates and config)
```

**Code Sharing Visualization**:
```
┌─────────────────────────────────────────────────┐
│ Claude Marketplace Plugin                       │
│ (~50 lines wrapper code)                        │
│ - Marketplace metadata                          │
│ - Adapter layer (if needed)                     │
└────────────────┬────────────────────────────────┘
                 │ 95% delegation
                 ↓
┌─────────────────────────────────────────────────┐
│ MCP Core Package (ai-software-architect)        │
│ (~2000 lines core functionality)                │
│ - All tool implementations                      │
│ - Configuration handling                        │
│ - Template rendering                            │
│ - YAML parsing                                  │
└─────────────────────────────────────────────────┘
```

**Version Synchronization**:
- Single semver version number shared across all channels (e.g., v1.4.0)
- Git tag triggers automated workflow:
  1. Run tests (all must pass)
  2. Publish npm package (ai-software-architect@1.4.0)
  3. Update Skills bundle (if installed, prompt upgrade)
  4. Trigger marketplace update (@ai-software-architect/marketplace@1.4.0)
  5. Generate changelog (GitHub Releases)
- Prevents version drift, ensures feature parity

**Platform-Specific Enhancements** (Future, Optional):
- Phase 1 (MVP): Feature parity, thin wrapper only
- Phase 2 (Validated): Marketplace-specific features if usage data justifies
  - Guided tutorials (if onboarding drop-off high)
  - In-app analytics dashboard (if usage metrics valuable)
  - Visual member customization (if users request)
  - Ratings integration (display framework's own architecture reviews)

### Release Automation Details

**CI/CD Pipeline** (GitHub Actions):
```yaml
# .github/workflows/release.yml
name: Multi-Channel Release

on:
  push:
    tags:
      - 'v*.*.*'  # Trigger on semver tags (e.g., v1.4.0)

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test  # All tests must pass

  publish-npm:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{secrets.NPM_TOKEN}}

  update-marketplace:
    needs: publish-npm
    runs-on: ubuntu-latest
    steps:
      # Marketplace-specific update process
      # (Details depend on Claude marketplace API/process)
      - run: echo "Trigger marketplace update to ${{ github.ref_name }}"

  generate-changelog:
    needs: [publish-npm, update-marketplace]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0  # Full history for changelog
      - uses: release-drafter/release-drafter@v5
        with:
          version: ${{ github.ref_name }}
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**Manual Release Process** (Fallback):
1. Update version in mcp/package.json
2. Commit: "chore: release v1.4.0"
3. Create git tag: `git tag v1.4.0`
4. Push with tags: `git push origin main --tags`
5. CI/CD pipeline handles the rest

## Alternatives Considered

### Alternative 1: Immediate Marketplace Submission Without Preparation

**Description**: Submit to marketplace immediately using current codebase (v1.3.0 as-is) without 6-week preparation phase.

**Approach**:
- Create marketplace listing with current MCP server
- Minimal metadata and description
- No additional testing, security audit, or optimization
- Submit and iterate based on marketplace feedback

**Pros**:
* **Fastest Time to Market**: 1-2 weeks vs. 6-10 weeks for Path A or Path B
* **Validates Marketplace Opportunity Early**: Discovers if marketplace drives adoption without preparation investment
* **Lower Upfront Investment**: No 6-week preparation effort, minimal sunk cost if marketplace doesn't work out
* **Real Feedback Quickly**: Marketplace users provide feedback on actual pain points vs. anticipated issues

**Cons**:
* **High Rejection Risk**: Marketplace may require tests, security audit, performance benchmarks before approval
* **Reputation Damage**: Poor ratings due to inadequate preparation are public and persistent
* **Quality Concerns**: No test suite means higher bug risk, no security audit raises trust issues, no performance benchmarks means poor experience possible
* **Difficult Recovery**: Bad first impression is hard to fix; users may not give second chance after poor experience
* **Maintainer Stress**: Issues discovered post-launch create firefighting and reactive work
* **Architectural Debt**: Skipping modularization makes future improvements harder

**Rejection Rationale**: **Rejected - Too High Risk**

The marketplace submission without preparation risks reputation damage that's difficult to recover from. Marketplace ratings are public and persistent; poor launch reception affects all channels, not just marketplace. The 6-week preparation phase addresses real quality gaps (no tests, unaudited security, no performance baselines) that could lead to marketplace rejection or poor user experience. While faster, this approach optimizes for speed at the expense of quality, contradicting the framework's positioning as a tool for thoughtful architectural decision-making. The preparation work (tests, security, performance) benefits all users regardless of marketplace outcome, making the investment worthwhile.

### Alternative 2: No Marketplace Plugin (Status Quo)

**Description**: Continue with current three-channel distribution strategy (Claude Skills, MCP npm package, Traditional clone) without adding marketplace presence.

**Approach**:
- Focus on enhancing existing channels
- Improve GitHub presence (README, Discussions, SHOWCASE)
- Optimize Skills and MCP packages
- Rely on organic discovery through GitHub, npm, social media

**Pros**:
* **Zero New Maintenance Burden**: Avoids fourth channel support obligations
* **Proven Channels**: Existing distribution working well, framework growing organically
* **Solo Maintainer Sustainability**: Three channels already at capacity limit; adding fourth risks burnout
* **Investment in Core**: Time spent on features and improvements vs. distribution infrastructure
* **Flexibility**: Can reconsider marketplace at any time based on demand signals
* **Risk Avoidance**: No marketplace rejection risk, no reputation concerns, no preparation effort required

**Cons**:
* **Limited Discoverability**: Claude-native users may not discover framework through GitHub/npm
* **Competitive Risk**: Competitors may claim marketplace positioning first, establishing mindshare
* **Missed Opportunity**: Marketplace could provide significant user growth if it becomes dominant discovery channel
* **No Auto-Updates**: Users on npm or Skills require manual update checks
* **No Marketplace Benefits**: Miss ratings/reviews social proof, curation trust signals, marketplace search optimization

**Rejection Rationale**: **Partially Rejected - Path B Phase 1 Delivers Value First**

Status quo misses the legitimate opportunity for improved discoverability that marketplace represents. However, this alternative correctly identifies sustainability concerns for solo maintainer. The phased approach (Path B) incorporates the best of this alternative: Phase 1 enhances existing channels (similar to this alternative) while preserving the option for Phase 2 marketplace (addresses discoverability gap). This alternative is too conservative if marketplace could significantly expand user base, but too risky if it immediately adds fourth channel burden. Path B provides the middle ground: Enhance what exists, validate demand, then conditionally pursue marketplace.

### Alternative 3: Marketplace-Only Distribution (Sunset Other Channels)

**Description**: Consolidate to marketplace as single distribution channel, deprecate Claude Skills, MCP npm package, and Traditional clone over 6-12 month transition.

**Approach**:
- Announce marketplace as primary/recommended installation method
- Deprecate other channels with 6-12 month timeline
- Migrate existing users to marketplace
- Focus all support and development on marketplace experience

**Pros**:
* **Single Channel Simplicity**: Eliminates multi-channel maintenance burden completely
* **Focused Support**: All users on same distribution, easier to support and troubleshoot
* **Marketplace Optimization**: Can build marketplace-specific features without cross-channel parity concerns
* **Resource Efficiency**: Solo maintainer manages one channel, not four
* **Clear Messaging**: Users know exactly how to install (marketplace only)

**Cons**:
* **User Disruption**: Forces migration on users happy with current channels (Skills, MCP, Traditional)
* **Platform Lock-In**: Fully dependent on Claude marketplace for distribution; platform risk
* **Reduced Flexibility**: Users can't choose installation method based on their preferences/constraints
* **Accessibility Loss**: Some users prefer npm (CI/CD integration), git clone (offline use), or Skills (programmatic automation)
* **Reversibility**: Hard to re-add channels after deprecation; significant trust damage
* **Marketplace Dependence**: If marketplace fails or changes policies, framework loses all distribution

**Rejection Rationale**: **Strongly Rejected - Unnecessary Lock-In**

Marketplace-only distribution creates unacceptable platform risk and user disruption without proportional benefit. Current multi-channel strategy respects user preferences and provides redundancy against platform changes. The thin wrapper architecture (95% code sharing) already minimizes maintenance burden of multiple channels. Users genuinely prefer different installation methods for valid reasons: npm enables CI/CD integration, Skills enable programmatic automation, Traditional enables offline use and version control. Forcing migration would alienate existing user base to solve a maintainer capacity problem that thin wrapper + automation already address. This alternative optimizes for maintainer convenience at the expense of user agency and platform resilience.

### Alternative 4: Rich Marketplace-Native Plugin (Not Thin Wrapper)

**Description**: Build marketplace plugin as standalone package with marketplace-optimized features and UX, separate from MCP npm package.

**Approach**:
- Create @ai-software-architect/marketplace as full-featured package
- Implement marketplace-specific features from Day 1:
  - Guided tutorials and onboarding flows
  - In-app analytics dashboard
  - Visual member customization UI
  - Interactive setup wizard
  - Ratings integration
- Separate codebase from MCP package (10-20% code sharing instead of 95%)

**Pros**:
* **Optimized Experience**: Marketplace plugin feels native to platform, leverages all marketplace capabilities
* **Competitive Differentiation**: Rich features distinguish from potential competitors who use thin wrapper
* **User Delight**: Polished, marketplace-specific UX creates "wow" experience
* **Platform-Native**: Embraces marketplace capabilities rather than treating as afterthought
* **Feature Innovation**: Freedom to experiment with marketplace-unique features without cross-channel constraints

**Cons**:
* **Massive Maintenance Burden**: Two separate codebases (marketplace + MCP) with only 10-20% code sharing
* **Development Time**: 3-6 months to build rich marketplace-native features vs. 6 weeks for thin wrapper
* **Feature Drift**: Marketplace and MCP packages diverge over time; users confused about feature availability
* **Bug Duplication**: Bugs must be fixed in two places; regressions more likely
* **Unsustainable for Solo**: Solo maintainer cannot realistically maintain two divergent implementations
* **Speculative Features**: Building rich features before validating demand violates YAGNI principles
* **Testing Overhead**: Must test marketplace-specific features separately; double the test suite

**Rejection Rationale**: **Strongly Rejected - Violates Pragmatic Principles**

Rich marketplace-native plugin violates ADR-002 Pragmatic Guard Mode by building speculative features before validating demand. We don't yet know if marketplace users need guided tutorials, in-app analytics, or visual customization—these are assumptions. The thin wrapper approach (Alternative chosen in Decision) follows "core + 1 example + defer" pattern: Start with feature parity (MVP), gather usage data, add marketplace-specific features if validated demand justifies. Solo maintainer cannot sustainably maintain two divergent codebases. This alternative optimizes for theoretical user delight at the expense of maintainability, pragmatism, and sustainability. If marketplace succeeds and data shows specific features would improve adoption, progressive enrichment can add them without initial commitment.

## Pragmatic Enforcer Analysis

**Reviewer**: Pragmatic Enforcer
**Mode**: Balanced

### Overall Decision Complexity Assessment

The marketplace plugin decision addresses a real but non-critical opportunity: improved discoverability for Claude-native users. The framework is functioning well and growing organically without marketplace presence (necessity: moderate). Adding a fourth distribution channel introduces maintenance complexity, version synchronization overhead, and support burden (complexity: moderately high). The thin wrapper architecture and phased approach mitigate complexity, but the fundamental question remains: Is this solving a current, validated problem or speculating on future growth?

Key observation: The architecture team's unanimous recommendation for the two-phase approach (Path B) reflects appropriate pragmatic thinking. Phase 1 (2 weeks) delivers immediate value while validating assumptions before Phase 2 (6 weeks) commitment. This aligns with YAGNI principles: Build what's needed when evidence supports it, not before.

### Decision Challenge

**Proposed Decision**: "Pursue Claude marketplace distribution to improve discoverability and establish early presence in emerging platform"

#### Necessity Assessment: 6/10

**Current Need**:
- Framework is growing organically through GitHub (⬆ necessity: proven demand exists)
- Discovery problem is real for Claude-native users unfamiliar with GitHub/npm (⬆ necessity: validates gap)
- BUT: No explicit user requests for marketplace listing (⬇ necessity: unvalidated demand)
- BUT: Framework functioning well without marketplace (⬇ necessity: not solving acute pain)

**Future Need**:
- Marketplace could become primary Claude plugin discovery channel (⬆ necessity IF marketplace matures)
- Early presence captures first-mover advantage (⬆ necessity: timing window exists)
- BUT: Marketplace adoption trajectory uncertain (⬇ necessity: platform risk)
- BUT: Competitors may not materialize (⬇ necessity: speculative competitive pressure)

**Cost of Waiting**:
- Lose first-mover advantage if marketplace becomes dominant (moderate cost, conditional on platform success)
- Competitors may claim positioning (moderate cost, conditional on competitors appearing)
- Current growth continues via GitHub/npm (minimal cost: status quo working)
- Preparation work (tests, security, modularization) benefits all channels regardless (waiting doesn't prevent later marketplace submission)

**Evidence of Need**:
- Architecture review: Thorough analysis, identifies real opportunity but not acute need
- User feedback: No explicit marketplace requests (0 recorded)
- Market data: No competitors visible (validates opportunity but doesn't validate necessity)
- Growth metrics: Organic growth without marketplace (reduces urgency)

**Necessity Score**: **6/10** - Nice to have for accelerated growth and competitive positioning, but not must-have for function. Framework succeeds without marketplace; marketplace accelerates success but doesn't enable it.

#### Complexity Assessment: 7/10

**Added Complexity**:
- Fourth distribution channel (⬆ complexity: multi-channel coordination)
- Marketplace-specific compliance and policies (⬆ complexity: platform obligations)
- Version synchronization across four channels (⬆ complexity: coordination overhead)
- Marketplace-specific support questions (⬆ complexity: increased support surface)
- Release automation pipeline (⬆ complexity: CI/CD setup and maintenance)
- BUT: Thin wrapper architecture (95% code sharing) significantly mitigates (⬇ complexity: minimal code duplication)
- BUT: Automated release pipeline reduces manual coordination (⬇ complexity: reduces ongoing burden)

**Maintenance Burden**:
- 6-week preparation phase (⬆ complexity: significant upfront investment)
- Ongoing support for fourth channel (⬆ complexity: incremental support load)
- Marketplace policy monitoring and compliance (⬆ complexity: platform changes)
- BUT: Preparation work benefits all channels (⬇ complexity: improvements reusable)
- BUT: Solo maintainer already managing three channels successfully (⬇ complexity: pattern established)

**Learning Curve**:
- Test framework setup (⬆ complexity: new tooling, ~1 day learning)
- CI/CD pipeline configuration (⬆ complexity: GitHub Actions, ~4-8 hours)
- Performance benchmarking (⬆ complexity: new metrics, ~4-8 hours)
- Marketplace submission process (⬆ complexity: platform-specific, ~2-4 hours)
- Total: ~3 days learning, manageable within 6-week timeline (⬇ complexity: contained learning investment)

**Dependencies Introduced**:
- Marketplace platform dependency (⬆ complexity: platform risk, policy changes)
- CI/CD infrastructure dependency (⬆ complexity: GitHub Actions reliability)
- BUT: No new code dependencies (⬇ complexity: thin wrapper delegates to existing MCP)
- BUT: Automated release reduces human coordination dependency (⬇ complexity: less manual coordination)

**Complexity Score**: **7/10** - Moderately high complexity from fourth channel and multi-channel coordination, but thin wrapper (95% code sharing) and automation significantly mitigate. Preparation work (tests, security, performance) adds one-time complexity that delivers ongoing value.

#### Alternative Analysis

**Are Simpler Alternatives Adequately Considered?**

Yes, the ADR presents four alternatives:

1. **Alternative 2 (Status Quo - No Marketplace)**: Simplest approach, zero new complexity
   - Adequately considered: Pros/cons documented, identifies sustainability benefit
   - Appropriately rejected: Misses legitimate discoverability opportunity
   - **Pragmatic Assessment**: This is the true "do nothing" baseline; rejected for valid reasons (competitive positioning, discovery gap)

2. **Path B, Phase 1 (Enhanced GitHub Before Marketplace)**: Simpler than immediate marketplace
   - Well-designed: 2-week investment, immediate value, validates demand before Phase 2
   - Aligns with pragmatic principles: Quick wins first, defer marketplace until triggered
   - **Pragmatic Assessment**: This IS the simpler alternative and is appropriately recommended by architecture team

3. **Alternative 1 (Immediate Without Preparation)**: Simpler timeline but higher risk
   - Appropriately rejected: Quality concerns and reputation risk justify 6-week preparation
   - **Pragmatic Assessment**: Simplicity here is false economy; skipping preparation creates technical debt

4. **Alternative 3 (Marketplace-Only)**: Simpler maintenance (one channel) but harmful user impact
   - Appropriately rejected: User disruption and platform lock-in outweigh simplicity
   - **Pragmatic Assessment**: Optimizes for wrong simplicity (maintainer) at expense of user agency

**Is There a Missing Simpler Alternative?**

**Simpler Alternative Proposal**: **Phase 1 Only (Enhanced GitHub) + No Marketplace Commitment**

- Implement Path B, Phase 1 (2 weeks): README, Discussions, SHOWCASE, SEO
- Monitor metrics quarterly (not monthly) to reduce overhead
- No formal commitment to ever do Phase 2; marketplace remains option, not plan
- Revisit marketplace annually: "Is demand validated yet?" If yes, then consider

**Rationale**:
- Delivers all Phase 1 value (better onboarding, community, examples)
- Validates whether discovery is actually the problem vs. documentation/positioning
- Zero marketplace complexity added
- Preserves marketplace option indefinitely without commitment
- Allows maintainer capacity to naturally increase (automation, co-maintainer) before considering fourth channel

**Why This Is Simpler**:
- No Phase 2 trigger monitoring (eliminates metrics tracking overhead)
- No expectation management ("we'll do marketplace if...") removes decision burden
- Framework continues thriving on three channels; marketplace becomes "nice to have someday" not "let's validate to decide"

#### Recommendation: ⚠️ Approve with Simplifications

**Selected Path**: **Path B, Phase 1 with Simplified Phase 2 Triggers**

**Justification**:

**Why Approve**:
1. **Legitimate Opportunity**: Marketplace could improve discoverability; opportunity is real even if not urgent
2. **Phased Approach**: Path B Phase 1 delivers immediate value (2 weeks) while deferring marketplace decision
3. **Quality Improvements**: Preparation work (tests, security, performance) benefits all users regardless of marketplace
4. **Thin Wrapper Mitigation**: 95% code sharing minimizes fourth channel maintenance burden
5. **Alignment with Principles**: Phased approach respects "Change Impact Awareness" (ADR-010) by validating demand first

**Why Simplifications**:
1. **Necessity is Moderate (6/10)**: Nice to have, not must-have; justifies cautious approach
2. **Complexity is Moderate-High (7/10)**: Fourth channel adds real burden for solo maintainer
3. **Ratio is 1.17 (below 1.5 threshold but close)**: Acceptable but warrants simplifications
4. **Unvalidated Demand**: No user requests for marketplace; speculative opportunity

**Simplifications Recommended**:

1. **Reduce Phase 2 Trigger Complexity**:
   - **Current**: Monitor monthly, track multiple metrics (clone rate, requests, marketplace dominance, capacity)
   - **Simplified**: Monitor quarterly, single primary trigger (15+ explicit user requests for marketplace)
   - **Rationale**: Monthly tracking adds overhead; user requests are clearest signal of actual demand

2. **Extend Phase 1 Timeline**:
   - **Current**: 3-month evaluation period before Phase 2 decision
   - **Simplified**: 6-month evaluation period (defer decision longer)
   - **Rationale**: Gives Phase 1 improvements more time to impact metrics; reduces urgency on marketplace decision

3. **Add "Do Nothing" Option to Phase 2**:
   - **Current**: Phase 2 triggered if conditions met (binary: proceed or defer)
   - **Simplified**: Phase 2 triggered only if conditions met AND maintainer capacity confirmed (add capacity gate)
   - **Rationale**: Prevents proceeding to Phase 2 if solo maintainer overwhelmed even if demand validated

4. **Defer Observability Implementation**:
   - **Current**: Implement local telemetry during preparation phase (Month 2-3)
   - **Simplified**: Defer observability until after stable marketplace launch (Month 6+)
   - **Rationale**: Observability is nice-to-have for iteration; not necessary for launch; focus on core quality (tests, security, performance)

5. **Reduce Marketplace-Specific Features Scope**:
   - **Current**: Consider marketplace-specific features (guided tutorials, in-app analytics, visual customization) if usage data justifies
   - **Simplified**: Explicitly commit to thin wrapper only; no marketplace-specific features for first 12 months
   - **Rationale**: Feature parity is sufficient; marketplace-specific features are speculative; defer until proven necessary

**Pragmatic Score**:
- **Necessity**: 6/10 (nice to have for growth, not critical for function)
- **Complexity**: 7/10 (fourth channel adds burden, mitigated by thin wrapper and automation)
- **Ratio**: 7/6 = **1.17** (below 1.5 threshold for balanced mode, acceptable)

**Overall Assessment**:

The marketplace decision represents reasonable, slightly aggressive growth strategy. Complexity-to-necessity ratio of 1.17 is below the 1.5 threshold for balanced mode, indicating acceptable engineering. However, the closeness to the threshold (1.17 vs. 1.5) and moderate necessity score (6/10) justify simplifications to reduce risk.

**Key Insight**: Path B (phased approach) already embodies pragmatic thinking by deferring marketplace commitment until demand validated. The architecture team's unanimous recommendation for Path B demonstrates appropriate YAGNI application. The simplifications above further reduce complexity and risk while preserving the legitimate marketplace opportunity.

**If Proceeding to Phase 2**:
- Complete 6-week preparation checklist without shortcuts (tests, security, performance)
- Use beta phase to validate quality before stable
- Monitor maintenance burden monthly after launch
- Be willing to deprecate marketplace if ROI doesn't justify burden (review at Month 12)

**Final Recommendation**:
- ✅ **Approve Path B, Phase 1 immediately** (2 weeks, high value, zero downside)
- ⏸️ **Defer Phase 2 decision to Month 6** (simplified triggers: 15+ user requests + maintainer capacity confirmation)
- 📊 **Quarterly metric review** (not monthly) to reduce overhead
- 🎯 **Thin wrapper only** for first 12 months (no marketplace-specific features)
- ⚖️ **Capacity gate**: Proceed to Phase 2 only if maintainer capacity sustainable (automation complete, co-maintainer considered, support burden manageable)

## Validation

### Acceptance Criteria

**For Either Path**:
- [ ] Strategic path decision documented in this ADR (Path A, Path B, or hybrid)
- [ ] Decision rationale clearly articulated
- [ ] Maintainer capacity confirmed (hours/week available for chosen path)
- [ ] Baseline metrics established (GitHub clone rate, support time/week, installation method distribution)

**Path A or Path B Phase 2 Preparation**:
- [ ] Test suite implemented: 80%+ integration test coverage, all MCP tools tested (setup, ADR, reviews, status, pragmatic, implementation)
- [ ] Tests integrated into CI (GitHub Actions): All tests pass before any release
- [ ] MCP server modularized: mcp/index.js extracted to tools/ directory (<500 lines per module)
- [ ] All tests passing after modularization (no regressions)
- [ ] Security audit complete: npm audit clean (no high/critical CVEs), file operations reviewed, SECURITY.md documented
- [ ] File system isolation tests passing (validates .architecture/ namespace boundaries)
- [ ] Performance baselines established and documented: startup time <500ms, setup <10s with progress, memory <50MB
- [ ] Config caching implemented (in-memory cache with file watcher invalidation)
- [ ] Error messages rewritten (user-friendly language, actionable next steps, tested with unfamiliar users)
- [ ] Release automation pipeline implemented (GitHub Actions): git tag → npm publish → Skills update → marketplace sync
- [ ] Marketplace metadata created: semantic search-optimized description, icon (multiple sizes), 3+ screenshots, category chosen
- [ ] Installation decision tree created (flowchart + text) and added to README
- [ ] Feature parity documentation matrix completed (core vs. platform-enhanced features)
- [ ] User testing conducted: 3-5 unfamiliar users, screen-share sessions, issues identified and addressed
- [ ] Beta submission approved by marketplace (no blocking issues in review feedback)

**Path B, Phase 1 (Enhanced GitHub)**:
- [ ] Demo video recorded and embedded prominently in README
- [ ] "Install with Claude" quick-start section added to README
- [ ] Installation decision tree created (flowchart + text) and added to README
- [ ] GitHub Discussions enabled with categories (FAQ, Use Cases, Show and Tell, Feature Requests)
- [ ] 10+ discussion topics seeded in GitHub Discussions
- [ ] SHOWCASE.md created with template and 3-5 example projects
- [ ] Repository description and topics updated for SEO (Claude, architecture, ADR, documentation)
- [ ] Baseline metrics documented (GitHub clone rate, installation method preferences, support question frequency)
- [ ] Metrics tracking sheet created (monthly updates for 6 months)

**Path B, Phase 2 Triggers (for proceeding to marketplace)**:
- [ ] One or more triggers met:
  - [ ] 15+ explicit user requests for marketplace listing (Pragmatic Enforcer simplification from 10+), OR
  - [ ] GitHub clone rate plateaued after Phase 1 enhancements (<10% growth over 3 months), OR
  - [ ] Marketplace becoming dominant Claude discovery channel (research indicates), OR
  - [ ] Maintainer capacity increased (co-maintainer added, automation matured, support burden reduced)
- [ ] Maintainer capacity confirmed sustainable for fourth channel (Pragmatic Enforcer capacity gate)

**Beta Phase Success** (if marketplace pursued):
- [ ] Beta submission approved within 2 weeks
- [ ] 50+ beta installs achieved
- [ ] 4+ star average rating maintained
- [ ] No blocking issues discovered during beta
- [ ] User feedback gathered and addressed (top 3 issues fixed)

**Stable Marketplace Success** (if beta successful):
- [ ] Stable promotion approved
- [ ] 100+ installs within first month
- [ ] 4+ star average rating maintained after 100 installs
- [ ] 20%+ of new users attributed to marketplace (via user survey or install analytics)
- [ ] Support burden remains manageable (<2 hours/week on marketplace-specific issues)
- [ ] No major security or performance incidents

### Testing Approach

**Preparation Phase Testing** (Path A or Path B Phase 2):

1. **Test Suite Validation**:
   - Framework: Node.js built-in test runner or vitest
   - Coverage: Integration tests for all MCP tools (9 tools total)
   - Scope: Happy paths + error cases + edge cases (large projects, invalid configs, permission issues)
   - CI Integration: GitHub Actions runs tests on every commit and before every release
   - Success: 80%+ coverage, all tests passing, no regressions detected

2. **Security Audit Validation**:
   - Automated: Run `npm audit` weekly in CI, block releases with high/critical CVEs
   - Manual: Review file operations scope (ensure .architecture/ namespace isolation), check dependency chain
   - Isolation Tests: Test suite verifies operations don't escape .architecture/ directory
   - Documentation: SECURITY.md documents data handling policy, file system scope, no external API calls
   - Success: No high/critical vulnerabilities, isolation tests passing, policy documented

3. **Performance Benchmark Validation**:
   - Benchmarks: Startup time, setup duration, operation latency (ADR creation, review start), memory footprint
   - Reference Projects: Small (10 files), medium (100 files), large (1000+ files)
   - Targets: Startup <500ms, setup <10s with progress indicators, memory <50MB baseline
   - Optimization: Config caching, template pre-loading, setup progress indicators
   - Success: All targets met on reference projects, baselines documented

4. **User Experience Validation**:
   - Error Messages: Audit all error cases, rewrite with user-friendly language and actionable next steps
   - User Testing: Recruit 3-5 users unfamiliar with framework, conduct screen-share installation and first-use sessions
   - Observation: Note confusion points, abandoned flows, error encounters (don't intervene)
   - Iteration: Address top 3 issues discovered across testers
   - Success: User testing reveals no blocking onboarding issues, error messages validated as clear

**Beta Phase Testing** (if marketplace pursued):

1. **Real-World Validation**:
   - Recruit 10-20 beta testers (announce in README, GitHub Discussions, social media)
   - Monitor install success rate, error frequency, support question volume
   - Gather feedback via surveys and interviews
   - Track metrics: installs, ratings, review content analysis
   - Success: 4+ star average rating, actionable feedback gathered, no blocking issues

2. **Marketplace Environment Validation**:
   - Verify plugin works in marketplace environment (may differ from local testing)
   - Test marketplace-specific features (auto-updates, ratings integration)
   - Check for marketplace-specific issues (permissions, interaction with other plugins)
   - Success: No marketplace-specific bugs discovered, environment-compatible

**Post-Launch Testing** (stable marketplace):

1. **Ongoing Quality Monitoring**:
   - CI/CD tests prevent regressions on every release
   - Monitor error rates via user reports
   - Track performance metrics if observability implemented
   - Quarterly security audits (npm audit, dependency updates)
   - Success: No major incidents, quality maintained over time

2. **Multi-Channel Parity Testing**:
   - Verify feature parity across all channels (Skills, MCP, Traditional, Marketplace)
   - Test version synchronization (all channels updated simultaneously)
   - User testing: Can users switch channels without losing functionality?
   - Success: Core features identical across channels, no version drift, smooth channel switching

## References

* **Research Findings**: [Claude Marketplace Requirements Research](../../research/claude-marketplace-requirements.md) - Post-decision research revealing distributed marketplace model, significantly reducing implementation timeline from 6-10 weeks to 2-3 weeks
* **Architecture Review**: [Claude Marketplace Plugin Architecture Review](../../reviews/claude-marketplace-plugin.md) - Comprehensive architecture team evaluation with unanimous two-phase recommendation
* **Related ADRs**:
  - [ADR-002: Pragmatic Guard Mode](./ADR-002-pragmatic-guard-mode.md) - YAGNI principles and complexity analysis framework applied in this decision
  - [ADR-005: LLM Instruction Capacity Constraints](./ADR-005-llm-instruction-capacity-constraints.md) - Progressive disclosure pattern provides marketplace competitive advantage for semantic search
  - [ADR-010: Externalizing Senior Engineering Thinking](./ADR-010-externalizing-senior-engineering-thinking.md) - Implementation Strategy framework guides this ADR's structure (blast radius, reversibility, sequencing, social cost, confidence)
* **Framework Artifacts**:
  - [.architecture/principles.md](../../principles.md) - Architectural principles guiding this decision (Pragmatic Simplicity, Livable Code, Change Impact Awareness, Evolvability)
  - [.architecture/members.yml](../../members.yml) - Architecture team member definitions (Systems Architect, Implementation Strategist, Pragmatic Enforcer, etc.)
  - [.architecture/config.yml](../../config.yml) - Pragmatic mode configuration (balanced intensity, 1.5 ratio threshold)
* **Official Claude Code Documentation**:
  - [Plugin Marketplaces Overview](https://code.claude.com/docs/en/plugin-marketplaces.md) - Understanding Claude marketplace ecosystem, discovery, and curation
  - [Plugin Creation Guide](https://code.claude.com/docs/en/plugins.md) - How to build and structure Claude plugins
  - [Plugins Reference](https://code.claude.com/docs/en/plugins-reference.md) - Technical reference for plugin APIs and capabilities
  - [MCP Documentation](https://code.claude.com/docs/en/mcp.md) - Model Context Protocol integration, which provides the technical foundation for marketplace plugins
  - [Skills Documentation](https://code.claude.com/docs/en/skills.md) - Claude Skills distribution channel (existing channel 1)
  - [Settings Reference](https://code.claude.com/docs/en/settings-reference.md) - Claude Code configuration affecting plugin behavior
* **Technical Foundation**:
  - Current MCP Server: `mcp/index.js` (1,823 lines, version 1.3.0)
  - MCP SDK: `@modelcontextprotocol/sdk` 1.0.4
  - Framework version: 1.3.0 (production-ready)

---

**Created**: 2026-01-21
**Updated**: 2026-01-21 (post-decision research findings incorporated)
**Author**: Architecture Team (8 members: Systems Architect, Domain Expert, Security Specialist, Performance Specialist, Maintainability Expert, Implementation Strategist, AI Engineer, Pragmatic Enforcer)
**Next Steps**:
1. Create plugin manifests (.claude-plugin/plugin.json, .claude-plugin/marketplace.json, .mcp.json)
2. Test locally with `claude --plugin-dir ./`
3. Update README with plugin installation instructions
4. Commit and push to GitHub
5. Announce plugin availability

**Review Cycle**: Monthly monitoring of adoption metrics (GitHub clone rate, Discussions activity, installation method distribution)
