# ADR-016: Setup Must Derive Team and Stack from Canonical Sources

## Status

Proposed

> Created via the framework's own ADR process. Companion to
> [ADR-015](./ADR-015-mcp-skills-parity-reconciliation.md) (which tracks Tier-1 setup parity as
> follow-up) and to the [ADR-015 architecture review](../../reviews/adr-015-architecture-review.md),
> whose dogfood run surfaced these defects.

## Context

A live dogfood of `setup_architecture` (MCP) against a fresh Rails + Express fixture (a `Gemfile` with
`rails`/`sqlite3` plus a `package.json` with `express`) produced output that does not faithfully
represent the framework's canonical model:

1. **Divergent team.** Setup generated a 6-member roster (4 hardcoded base members + `javascript_expert`
   + `express_specialist`). It **omitted `pragmatic_enforcer` and `domain_expert`**, and used divergent
   ids (`security_architect` vs the canonical `security_specialist`). `customizeMembers`
   (`mcp/index.js:471-548`) builds members from a hardcoded list and **never reads the canonical
   `.architecture/members.yml`** that defines the 8 architects. A new project therefore starts with a
   *structurally different and smaller* team than the framework documents — and silently loses the
   pragmatic-enforcer that pragmatic mode depends on.
2. **Stack misdetection.** Setup reported `Framework: Express` and built JS-oriented members while
   **missing the Rails/Ruby stack entirely**, even though the package manager was correctly detected as
   `bundler` — an internal inconsistency (Ruby package manager, JavaScript framework). The SQLite
   dependency (in the `Gemfile`) was not surfaced anywhere. One manifest masked another.
3. **Hardcoded initial analysis.** `initial-system-analysis.md` contains exactly four perspectives
   (Systems, Security, Performance, Maintainability), independent of the actual roster, so it neither
   reflects the generated team nor the canonical 8.
4. **Broken generated link.** The generated analysis points to `.architecture/decisions/principles.md`;
   the file is at `.architecture/principles.md`. (Ironic immediately after the 1.5.4 link-rot cleanup.)

The common root cause: **setup reimplements, in hardcoded form, knowledge that already exists
canonically in the framework source** (the team in `members.yml`, the document structure in
`templates/`, the perspectives in the subagents). ADR-015 generalized this as the second tier-assignment
axis — *a Tier-1 operation must read the same canonical artifacts as the other channels* — and setup
currently violates it.

## Decision Drivers

* **Fidelity**: a fresh install must reproduce the framework's actual team and principles, not a
  lossy hardcoded subset.
* **Single source of truth**: `members.yml` (and `templates/`, `principles.md`) already define the
  canonical model; setup should seed from them, not duplicate them in code that drifts.
* **Pragmatic-mode integrity**: omitting `pragmatic_enforcer` silently disables the reviewer pragmatic
  mode relies on.
* **Honest stack detection**: polyglot repos are common; detection must not let one manifest mask
  another, and should surface the datastore.
* **Consistency with ADR-015**: this is the tracked Tier-1 setup-parity fix that makes ADR-015's
  "deterministic tier is at parity" claim actually true.

## Decision

**Setup derives its outputs from the framework's canonical sources, not from hardcoded logic.**

1. **Team from canonical `members.yml`.** `setup_architecture` seeds the new project's `members.yml`
   by copying the framework's canonical roster (resolved via the existing source-discovery path) — all
   8 architects with canonical ids, including `pragmatic_enforcer` and `domain_expert`. Stack-specific
   advisors (e.g., a Rails or React specialist) may be **appended** to the canonical 8, never
   substituted for them.
2. **Full stack detection.** Detect across *all* manifests present (`Gemfile` → Ruby/Rails,
   `package.json` → JS/framework, `requirements.txt`/`pyproject.toml` → Python, etc.) and surface the
   datastore (e.g., `sqlite3` in the Gemfile) rather than reporting the first framework found. Report a
   *set* of languages/frameworks, not a single masked value.
3. **Roster-driven initial analysis.** Generate `initial-system-analysis.md` from the actual seeded
   roster, so every member that exists contributes a perspective — no hardcoded 4.
4. **Correct generated links.** Fix the `principles.md` path in the generated analysis and add the
   generated analysis to the link-validation scope so this cannot regress.

**Architectural Components Affected:**
* `mcp/index.js` — `analyzeProject` (multi-manifest detection), `customizeMembers` (seed from canonical
  `members.yml`), `conductInitialAnalysis` (roster-driven), the generated-link path
* The `setup-architect` **skill** — same fidelity expectations, so MCP and Skill setup agree
* `tools/` — a setup-fidelity test asserting the seeded roster equals the canonical 8 (+ any appended
  advisors) and includes `pragmatic_enforcer`

**Interface Changes:**
* No tool signature changes. Output of `setup_architecture` changes: full canonical team, richer stack
  report. Existing installs are unaffected unless re-run.

## Consequences

### Positive

* New projects start with the framework's real team and principles; pragmatic mode works out of the box.
* Eliminates a silent MCP↔canonical drift and satisfies ADR-015's second tier axis (Tier-1 parity
  becomes true and testable).
* Polyglot repos are represented honestly; the datastore is visible to the security/performance lenses.

### Negative

* Setup must resolve the framework source to read canonical `members.yml` — adds a dependency on
  source-discovery succeeding (already required for templates; low marginal risk).
* Slightly larger generated `members.yml` (8 + advisors vs 6); intended.

### Neutral

* The subagent generator and Skills are unaffected (they already read canonical `members.yml`).
* Re-running setup on an existing project should remain non-destructive to a customized `members.yml`
  (preserve existing; this ADR does not change merge behavior).

## Implementation Strategy

> Senior thinking on HOW/WHEN.

### Blast Radius

**Impact Scope**: Medium. Affects every future `setup_architecture` (and `setup-architect` skill) run;
does not touch existing installs unless re-run.

**Affected Components**: `analyzeProject`, `customizeMembers`, `conductInitialAnalysis` in
`mcp/index.js`; the `setup-architect` skill; a new setup-fidelity test.

**Affected Teams**: Solo maintainer; downstream new adopters benefit.

**User Impact**: New installs get the full team and accurate stack report. No change for existing users
until they re-run setup.

**Risk Mitigation**: seed-from-canonical reuses the proven source-discovery path; a fidelity test
golden-checks the seeded roster against canonical `members.yml`; re-run preserves customized members.

### Reversibility

**Reversibility Level**: High. Logic changes within setup helpers; revert restores prior behavior. No
data migration (only affects newly generated files).

**Migration Paths**: Forward — update detection + seeding + analysis, add test. Rollback — revert the
commit. Evolution — appended stack advisors can grow without touching the canonical 8.

**Options Preserved**: how advisors are chosen per stack remains tunable; canonical seed is the floor.

**Commitments Made**: `members.yml` is the authoritative team source for setup, not code.

### Sequencing & Timing

**Prerequisites**:
- [x] Source-discovery path exists (`tools/lib/setup-source-discovery.js`) and resolves the framework root
- [ ] Decide advisor-selection policy per detected stack (can ship with "none" initially — canonical 8 only)

**System Readiness**: Adequate — setup already copies templates from the resolved source; reading
`members.yml` from the same source is a small extension.

**Team Readiness**: High; no new concepts.

**Sequencing Concerns**: Land detection + seeding together (a richer roster without richer detection is
fine; the reverse is not). The link-path fix is independent and can land first.

**Readiness Assessment**: Ready to implement.

### Social Cost

**Learning Curve**: Low.

**Cognitive Load**: Reduced — one source of truth for the team instead of two (code + YAML).

**Clarity Assessment**: Helps. A fresh install matching the docs is less confusing than a silently
smaller team. Explanation: a CHANGELOG note that setup now seeds the full canonical team.

**Documentation Needs**:
- [ ] CHANGELOG entry
- [ ] Note in setup docs that the full canonical team is seeded and stack advisors are appended

### Confidence Assessment

**Model Correctness Confidence**: High — the defects are reproduced (dogfood), and the fix removes a
duplication rather than adding a model.

**Assumptions**:
1. Source discovery reliably resolves the framework root during setup. — **Validation**: already relied
   on for templates; covered by `setup-source-discovery` tests.
2. Appending advisors to the canonical 8 is preferable to substitution. — **Validation**: matches the
   framework's stated 8-member model; revisit if a stack genuinely needs a core member replaced.

**Uncertainty Areas**: advisor-selection heuristics per stack; whether the Skill and MCP should share a
single detection module to prevent re-divergence (likely yes — see ADR-015's duplication non-goal).

**Validation Approach**: a setup-fidelity test that runs setup against polyglot fixtures and asserts
(a) the seeded roster ⊇ the canonical 8 including `pragmatic_enforcer`, (b) all present manifests are
detected, (c) the datastore is surfaced, (d) generated links resolve.

**Edge Cases**: monorepos with multiple manifests of the same ecosystem; a project that already has a
customized `members.yml` (must be preserved on re-run).

## Implementation

**Phase 1: Stack detection + generated-link fix**
* Make `analyzeProject` scan all manifests and report language/framework *sets* + datastore.
* Fix the `principles.md` path in `conductInitialAnalysis`; add the generated analysis to link validation.

**Phase 2: Canonical team seeding**
* Change `customizeMembers` to copy the framework's canonical `members.yml` (via source discovery) as the
  base, then append any stack advisors. Never drop the canonical 8.

**Phase 3: Roster-driven analysis + fidelity test**
* Generate `initial-system-analysis.md` from the seeded roster.
* Add the setup-fidelity test (polyglot fixtures; assert canonical-8 ⊆ roster, multi-manifest detection,
  datastore surfaced, links resolve).

## Alternatives Considered

### Alternative 1: Keep hardcoded members; just add the missing ones

Add `pragmatic_enforcer`/`domain_expert` to the hardcoded list and fix ids.

**Pros:** smallest diff.
**Cons:** leaves the duplication that caused the drift; the hardcoded list will diverge from
`members.yml` again the next time the canonical team changes. Treats the symptom, not the cause.

### Alternative 2: Do nothing; document that MCP setup yields a reduced team

**Pros:** zero work.
**Cons:** ships a silently lossy install that contradicts the docs and breaks pragmatic mode; leaves
ADR-015's Tier-1 parity claim false.

### Alternative 3: Share one detection/seeding module between the Skill and MCP

Extract setup logic into a shared module both surfaces import.

**Pros:** prevents future MCP↔Skill divergence at the source (the real fix).
**Cons:** larger refactor; overlaps ADR-015's deferred "consolidate duplication" non-goal. Worth doing,
but bigger than this ADR — fold into the duplication-consolidation ADR rather than block this fix.

## Pragmatic Enforcer Analysis

**Reviewer**: Pragmatic Enforcer
**Mode**: Balanced

**Overall Decision Complexity Assessment**:
This fixes concrete, reproduced defects by *removing* duplicated knowledge (hardcoded team) in favor of
the canonical source. It adds detection breadth and one test — proportionate. The temptation to
over-reach (Alternative 3's shared-module refactor) is explicitly deferred.

**Decision Challenge**:

**Proposed Decision**: "Setup seeds the full canonical team from `members.yml`, detects all manifests,
drives the initial analysis from the roster, and fixes generated links."

**Necessity Assessment**: 8/10 — reproduced defects that ship a lossy install and break pragmatic mode;
also unblocks ADR-015's parity claim. Present, not speculative.

**Complexity Assessment**: 3/10 — bounded changes to three setup helpers + a fidelity test; reuses
existing source discovery; no new deps.

**Alternative Analysis**: "Do nothing" and "patch the hardcoded list" were considered; both leave the
root duplication. The shared-module refactor is the deeper fix but is deferred to avoid scope creep.

**Simpler Alternative Proposal**: Phase 1 (detection + link fix) alone removes the most visible defects
if Phase 2 must wait; but Phase 2 is the one that fixes the parity root cause and should not be skipped.

**Recommendation**: ✅ Approve decision

**Pragmatic Score**:
- **Necessity**: 8/10
- **Complexity**: 3/10
- **Ratio**: 0.38 *(Target: <1.5 for balanced mode)*

**Overall Assessment**: Appropriate, root-cause fix for current defects; defers the larger refactor
honestly.

## Validation

**Acceptance Criteria:**
- [ ] Setup against a polyglot fixture seeds a `members.yml` containing all 8 canonical architects
  (incl. `pragmatic_enforcer`, `domain_expert`) with canonical ids, plus any appended stack advisors.
- [ ] All present manifests are detected (Ruby/Rails + JS/Express in the dogfood case) and the datastore
  is surfaced.
- [ ] `initial-system-analysis.md` reflects the seeded roster and contains no broken links.
- [ ] A setup-fidelity test enforces the above and runs under `npm test`.
- [ ] Re-running setup on a project with a customized `members.yml` preserves it.

**Testing Approach:**
* Setup-fidelity test over polyglot fixtures (assert roster ⊇ canonical 8, multi-manifest detection,
  datastore surfaced, links resolve); golden compare the seeded roster to canonical `members.yml`.

## References

* [ADR-015: Reconciling MCP and Skills](./ADR-015-mcp-skills-parity-reconciliation.md) — second tier axis; tracks this as the Tier-1 setup-parity fix
* [Architecture Review: ADR-015](../../reviews/adr-015-architecture-review.md) — dogfood that surfaced these defects
* [Structural First-Principles Examination](../../reviews/structural-first-principles-examination.md) — the MCP↔canonical drift theme
