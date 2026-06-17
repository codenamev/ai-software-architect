# ADR-016: Setup Must Derive Team and Stack from Canonical Sources

## Status

Accepted

> **Status (2026-06-16):** Accepted and implemented (core: preserve canonical members.yml + fail-closed
> validation, generate subagents, seed pragmatic config via the copied canonical config, fix the
> principles location, multi-valued stack detection, Skill-doc reconciliation, and an end-to-end
> fidelity test). The implementation found a simplification the draft missed: setup already copies the
> canonical files in, so the fix is to **stop overwriting** them — the discovery-rewiring (Phase 0) is
> not needed for the team fix and remains a deferred robustness follow-up, along with the re-run merge,
> the shared MCP/Skill module, and datastore surfacing.
>
> **Revision note (2026-06-16):** Revised after a full 8-architect review (see
> [adr-016-architecture-review.md](../../reviews/adr-016-architecture-review.md)), which verified four
> factual errors in the first draft against `mcp/index.js` and added a critical missing step. Changes:
> corrected the false "setup reuses source-discovery / copies templates from the resolved source" claim
> (F1 — it copies from `__dirname`); added subagent generation + `config.yml` seeding, without which a
> seeded team is not dispatchable (F2); resolved the re-run guarantee, which was unbuilt and currently
> blocked by an abort-on-existing guard (F3); corrected the drift to **4 missing members** and the
> mislocated `principles.md` file (F4); folded in the Skill-doc reconciliation; added vocabulary,
> security validation, and a discovery-failure policy; and trimmed scope (datastore surfacing and
> dynamic analysis regeneration deferred). Companion to
> [ADR-015](./ADR-015-mcp-skills-parity-reconciliation.md).

## Context

A live dogfood of `setup_architecture` (MCP) against a Rails + Express fixture produced output that
does not faithfully represent the framework's canonical model. Verified against `mcp/index.js`:

1. **Divergent, smaller team.** `customizeMembers` (line 394) hardcodes **4** base members and never
   reads canonical `.architecture/members.yml`. Against the canonical **8**, it omits **four**
   architects — `domain_expert`, `implementation_strategist`, `ai_engineer`, and `pragmatic_enforcer`
   — and uses the wrong id `security_architect` (canonical: `security_specialist`). Even though setup
   copies the framework dir to a temp clone, `customizeMembers` then **overwrites** the copied roster
   with its hardcoded list (write at line 467).
2. **The seeded team is not dispatchable.** Setup never runs the subagent generator, and `agents/*.md`
   live at the **repo root** (not under `.architecture/`), so they are not carried into the target. A
   fresh install has the team YAML but **zero `agents/*.md`** — reviews and pragmatic-mode reviews
   cannot run end-to-end. Seeding the roster is necessary but not sufficient.
3. **Stack misdetection.** `analyzeProject` reports a single `framework` (first-non-empty: Express wins
   over Rails) and a single `packageManager` (last-write-wins: bundler), yielding the inconsistent
   "Ruby package manager + JavaScript framework." The datastore (`sqlite3` in the Gemfile) is not
   surfaced. The fix is to make these fields **multi-valued**, not to reorder checks.
4. **Mislocated principles + broken link.** `customizePrinciples` **writes** principles to
   `.architecture/decisions/principles.md` (line 525); the canonical location is
   `.architecture/principles.md`. The wrong path is referenced at three sites (525/703/804). So the
   file itself is mislocated, not merely linked wrong.
5. **No source-discovery, and abort-on-existing.** Setup copies from `path.resolve(__dirname, '..')`
   (line 229) — it does **not** use `tools/lib/setup-source-discovery.js` (that is wired only into
   `tools/cli.js`). And setup **aborts** if `.architecture` already exists (line 206); there is no
   merge/idempotency path today.

The common root cause: **setup reimplements, in hardcoded form, knowledge that already exists
canonically** (the team in `members.yml`, the perspectives in the subagents, principles in
`principles.md`). ADR-015's second tier-axis says a Tier-1 operation must read the same canonical
artifacts as the other channels; setup currently violates it.

**Related contributor work (issue #9 / PR #10, by sgbett).** Independently, sgbett identified a
*complementary* setup defect: the install also copies the framework's **own** work product — its
internal ADRs, reviews, comparisons, and `deferrals.md` — into target projects as cruft. This ADR does
not fix that leak; PR #10 does, via a manifest that copies only what a new project needs. (Note #9's
premise that the MCP path is already clean is outdated — `setupArchitecture` still moves the entire
`.architecture/` into the target, so the leak affects both paths.) The two efforts converge cleanly: the
manifest should **copy** the canonical `members.yml`/`principles.md` and **exclude** the framework's own
decisions/reviews/comparisons/deferrals — pairing #10's exclusion with this ADR's
copy-canonical-and-validate rule, with subagent generation running off the copied roster. A single
manifest-driven installer shared by the MCP and skill paths is the natural end state (cf. ADR-015's
deferred shared-module non-goal). Convergence is being coordinated on PR #10; pending that, manifest-based
cruft exclusion is tracked as follow-up here rather than implemented in this ADR.

## Decision Drivers

* **Fidelity**: a fresh install must reproduce the framework's real, *usable* team — YAML **and**
  dispatchable subagents — not a lossy hardcoded subset.
* **Single source of truth**: `members.yml`, the subagents, and `principles.md` are canonical; setup
  should derive from them, not duplicate them in code that drifts.
* **Pragmatic-mode integrity**: omitting `pragmatic_enforcer` (and not generating its subagent or
  seeding `pragmatic_mode` config) silently disables the reviewer pragmatic mode depends on.
* **Honest stack detection**: polyglot repos are common; one manifest must not mask another.
* **Truthful risk accounting**: wiring source-discovery into MCP setup is *new* work; the ADR must say
  so (corrects the first draft).

## Decision

**Setup derives its outputs from canonical sources, produces a *usable* install, and reports what it
did.** Concretely:

1. **Resolve the framework source via discovery (new).** Wire `discoverSource`
   (`tools/lib/setup-source-discovery.js`) into `setup_architecture`, replacing the
   `path.resolve(__dirname, '..')` shortcut. **Discovery-failure policy: fail loudly** — if the source
   cannot be resolved, abort with guidance; **never** fall back to a partial hardcoded roster (that
   would reintroduce the drift this ADR removes).
2. **Seed the team from canonical `members.yml`, and validate it.** `customizeMembers` copies the
   canonical roster (all 8 core members, canonical ids) and **replaces** its hardcoded write (line 467),
   never appends over it. Before seeding, **validate**: assert the copied roster contains exactly the 8
   canonical core ids (incl. `pragmatic_enforcer`, `domain_expert`); fail closed on a malformed/partial
   roster. Stack-specific **advisors** may be appended (additive; never substitute a core member; ids
   must not collide with any core id).
3. **Make the team dispatchable (new — closes F2).** After seeding `members.yml`, setup **generates
   `agents/*.md`** from it (invoke the existing `generateAll`) into the target, and **seeds `config.yml`
   with the `pragmatic_mode` block** so `active_when: pragmatic_mode.enabled` can resolve. Acceptance
   includes `agents/pragmatic-enforcer.md` existing post-setup.
4. **Fix the principles location.** Write principles to canonical `.architecture/principles.md` (not
   `decisions/principles.md`) and correct all three reference sites (525/703/804); add the generated
   analysis to link validation.
5. **Multi-valued stack detection (trimmed).** `analyzeProject` reports a **set** of languages and
   frameworks so no manifest masks another; detection stays **root-only** (no recursion into
   `node_modules`/`vendor`). **Sanitize** any manifest-derived value (framework/dep names) before it is
   interpolated into ids or generated markdown; **bound** the number/size of manifests parsed, wrapping
   each parse in try/catch. *(Deferred as out of scope: surfacing the datastore as a first-class field —
   no consumer uses it yet; and dynamic roster-driven regeneration of the initial analysis — the
   required outcome is only that generated links resolve and the analysis does not contradict the seeded
   team.)*
6. **Reconcile the Skill.** The `setup-architect` Skill already copies canonical `members.yml`, but its
   docs encode a stale core (SKILL.md step 4 = 7 members; `customization-guide.md` = 6; checklist =
   "seven"), omitting `implementation_strategist` and `ai_engineer`. Update those to reference the
   canonical roster **by file**, not a hand-listed subset. Run the fidelity test against **both** the
   MCP and Skill outputs.
7. **Re-run behavior (resolve F3).** Setup **continues to abort** when `.architecture` exists; a
   preserve-and-reseed-canonical-block merge (key: member `id`) is **future work**, tracked separately.
   This ADR makes **fresh** installs correct; it does **not** claim non-destructive re-run (the first
   draft's guarantee is withdrawn as unbuilt).
8. **Observability.** Setup's output reports the seeded roster (count + ids), the generated subagents,
   and the detected language/framework set — so an operator can trust an install without inspecting
   files (this is how the bug survived).

**Domain vocabulary (per review):** **member** = any roster entry; **core member** = one of the
canonical 8 (the invariant floor); **advisor** = an appended, stack-derived member (additive, never
substitutes a core member, id unique across the roster). "Advisor" is not called "specialist" (reserved
for the canonical `*_specialist` core members).

**Architectural Components Affected:**
* `mcp/index.js` — wire `discoverSource`; `customizeMembers` (seed+validate+replace); new generator +
  `config.yml` seeding step; `customizePrinciples` (correct location); `analyzeProject` (multi-valued,
  sanitized, bounded); setup output (observability)
* `skills/setup-architect/` — SKILL.md, `references/customization-guide.md`, success checklist:
  reference the canonical roster by file
* `tools/` — a setup-fidelity test (run against MCP and Skill outputs)

**Interface Changes:**
* No tool signatures change. `setup_architecture` output changes: full canonical team **+ generated
  subagents + `pragmatic_mode` config**, richer stack report, principles at the canonical path.

## Consequences

### Positive

* A fresh install is **usable**: canonical team, dispatchable subagents, pragmatic mode working — not
  just a YAML file.
* Eliminates the MCP↔canonical drift at the source and satisfies ADR-015's second tier axis (Tier-1
  parity becomes true and testable).
* Polyglot repos are represented honestly; principles live at the canonical path.
* The risk is now stated truthfully (new discovery dependency), so the plan is trustworthy.

### Negative

* Larger than the first draft implied: a **new** source-discovery dependency for MCP setup (with a
  fail-loud policy) and a new generator/ config-seeding step — not a "small extension."
* Re-run still aborts on an existing `.architecture`; existing installs do not auto-gain the canonical
  team (must re-init or await the future merge work).
* The Skill and MCP remain two implementations (the shared-module refactor is deferred — ADR-015
  non-goal); mitigated by running one fidelity test against both.

### Neutral

* `members.yml` becomes the authoritative team source for setup, not code.
* Datastore surfacing and dynamic analysis regeneration are deferred until a consumer/justification
  exists.

## Implementation Strategy

> Senior thinking on HOW/WHEN.

### Blast Radius

**Impact Scope**: Medium. Affects every future `setup_architecture` (and the `setup-architect` Skill
docs); existing installs are untouched (re-run still aborts). Introduces a runtime dependency on
source-discovery resolving at MCP/npx time — the key new failure mode (handled by the fail-loud policy).

**Affected Components**: `analyzeProject`, `customizeMembers`, `customizePrinciples`,
`conductInitialAnalysis`, and a new generator/config step in `mcp/index.js`; the Skill docs; a new test.

**User Impact**: New installs get a usable, full team. No change for existing users until they re-init.

**Risk Mitigation**: fail-loud discovery policy; roster validation (fail closed); fidelity test across
both surfaces; sanitize/bound untrusted manifest parsing.

### Reversibility

**Reversibility Level**: High. Logic changes within setup helpers + Skill doc edits; revert restores
prior behavior. No data migration (only newly generated files).

**Migration Paths**: Forward — wire discovery → seed+validate+generate+config → fix principles location
→ multi-valued detection → Skill docs → test. Rollback — revert. Evolution — appended advisors and the
future re-run merge build on this without rework.

**Commitments Made**: `members.yml` + the subagents + `principles.md` are the canonical sources setup
must derive from; setup fails loudly rather than seeding a partial roster.

### Sequencing & Timing

**Prerequisites**:
- [x] `tools/lib/setup-source-discovery.js` exists and resolves the framework root (used by the CLI)
- [ ] Confirm `generateAll` can run against a freshly-seeded `members.yml` in the target context
- [ ] Decide advisor-selection policy per stack (ship with **none** initially — canonical 8 only)

**System Readiness**: The discovery path exists but is **not yet wired into MCP setup** (corrects the
first draft); Phase 0 wires it. No new deps; no data migration.

**Team Readiness**: High; no new concepts beyond the vocabulary block.

**Sequencing Concerns**: Phase 0 (wire discovery) gates seeding. Generation must follow seeding. The
link/location fix is independent and can land first. Skill-doc reconciliation can land in parallel.

**Readiness Assessment**: Ready once the `generateAll`-in-target check passes.

### Social Cost

**Learning Curve**: Low. **Cognitive Load**: Reduced (one source of truth for the team).

**Clarity Assessment**: Helps — a fresh install that matches the docs and actually runs reviews is far
less confusing than a silently lossy one. Explanation: a CHANGELOG note that setup seeds the full
canonical team **and** generates its subagents.

**Documentation Needs**:
- [ ] CHANGELOG entry
- [ ] Setup docs: full canonical team is seeded, subagents generated, advisors appended
- [ ] Skill docs reference the canonical roster by file

### Confidence Assessment

**Model Correctness Confidence**: High — defects reproduced and verified in code; the fix removes
duplication.

**Assumptions**:
1. `discoverSource` resolves the framework root at MCP/npx runtime. — **Validation**: covered by
   `setup-source-discovery` tests for the CLI; **must be re-validated in the MCP runtime context** (new
   usage). Fail-loud policy bounds the downside.
2. `generateAll` runs correctly against a seeded `members.yml` in the target. — **Validation**: Phase
   check before relying on it.
3. Appending advisors (vs substitution) matches the 8-member model. — **Validation**: fidelity test
   enforces core-block equality.

**Uncertainty Areas**: advisor-selection heuristics; whether MCP and the Skill should share one
detection/seeding module (ADR-015 duplication non-goal — deferred; both bound to the fidelity test
meanwhile); the future re-run merge semantics.

**Validation Approach**: a setup-fidelity test over polyglot fixtures asserting (a) the seeded core
block equals the canonical ids **exactly** (catches omission **and** id-drift like
`security_architect`), plus zero-or-more advisors with unique ids; (b) all present manifests detected;
(c) `agents/<kebab-id>.md` exists for every seeded member, incl. `pragmatic-enforcer`; (d) `config.yml`
contains `pragmatic_mode`; (e) generated links resolve and principles are at the canonical path. Run
against **both** MCP and Skill outputs.

**Edge Cases**: monorepos with many manifests (bounded, root-only); malformed/hostile manifest (parse
in try/catch, sanitize derived values); tampered/spoofed source (validate copied roster, fail closed);
existing `.architecture` (abort — re-run merge is future work).

## Implementation

**Phase 0: Wire source-discovery into MCP setup**
* Replace `path.resolve(__dirname,'..')` with `discoverSource(...)`; fail loudly on resolution failure.

**Phase 1: Detection + principles location + link fix**
* `analyzeProject` reports multi-valued languages/frameworks (root-only, sanitized, bounded).
* `customizePrinciples` writes to `.architecture/principles.md`; fix the 3 reference sites; add the
  generated analysis to link validation.

**Phase 2: Canonical team seeding (+ validation, replace not append)**
* `customizeMembers` copies + validates canonical `members.yml` (fail closed if not the canonical 8);
  replaces the line-467 write; appends advisors (none initially) with id-uniqueness.

**Phase 3: Make it dispatchable**
* Generate `agents/*.md` from the seeded roster (`generateAll`); seed `config.yml` with `pragmatic_mode`.

**Phase 4: Skill reconciliation + fidelity test + observability**
* Update Skill docs to reference the canonical roster by file.
* Add the setup-fidelity test (run against MCP and Skill outputs).
* Setup reports seeded roster + generated subagents + detected stack.

## Alternatives Considered

### Alternative 1: Keep hardcoded members; just add the missing ones + fix ids

**Pros:** smallest diff.
**Cons:** the hardcoded list has already drifted (wrong id, **4 of 8** missing); patching it re-drifts
the next time the canonical team changes, and does nothing for F2 (no subagents) or the principles
location. Treats symptoms.

### Alternative 2: Do nothing; document that MCP setup yields a reduced team

**Cons:** ships a silently lossy, non-functional install; leaves ADR-015's Tier-1 parity claim false.

### Alternative 3: Share one detection/seeding module between Skill and MCP

**Pros:** prevents future MCP↔Skill divergence at the source (the real fix).
**Cons:** larger refactor overlapping ADR-015's deferred "consolidate duplication" non-goal. Deferred —
but both surfaces are bound to the same fidelity test meanwhile so divergence is caught.

## Pragmatic Enforcer Analysis

**Reviewer**: Pragmatic Enforcer (reconciled with the independent review panel)
**Mode**: Balanced

**Overall Decision Complexity Assessment**:
The core (seed-from-canonical, replacing a drifted hardcoded list) *removes* duplication. The review
correctly flagged that the first draft both **under-scoped** (missing F2 — generation/config, without
which the install doesn't work) and **over-scoped** (datastore surfacing, dynamic analysis regen — no
consumer). This revision adds the necessary completeness and defers the gold-plating.

**Decision Challenge**:

**Proposed Decision**: "Setup resolves the source via discovery, seeds + validates the canonical team,
generates its subagents, seeds pragmatic config, fixes the principles location, detects all manifests,
and reconciles the Skill docs."

**Necessity Assessment**: 7/10 — reproduced defects that ship a non-functional, lossy install and break
pragmatic mode; also unblocks ADR-015's parity claim.

**Complexity Assessment**: 5/10 — honestly higher than the first draft's self-rated 3: a new discovery
dependency, a generation/config step, detection changes, and Skill reconciliation. The independent
panel scored the *original* at Necessity 7 / Complexity 5 / **Ratio 0.71**; trimming the scope (defer
datastore + dynamic analysis) and removing the unbuilt re-run guarantee brings the *necessary* work's
ratio back toward ~0.5.

**Alternative Analysis**: Alt 1 (patch the list) re-drifts and ignores F2; Alt 2 ships broken; Alt 3 is
the deeper fix, deferred with a test-based guard.

**Recommendation**: ✅ Approve decision (scope-trimmed).

**Pragmatic Score (revised, scope-trimmed)**:
- **Necessity**: 7/10
- **Complexity**: 5/10
- **Ratio**: 0.71 *(Target: <1.5 — clears the balanced gate; honest, not the first draft's 0.38)*

**Overall Assessment**: Appropriate root-cause fix once corrected for completeness and trimmed of
speculative additions.

## Validation

**Acceptance Criteria:**
- [ ] MCP setup resolves the source via `discoverSource` and **fails loudly** (no partial seed) if it
  cannot.
- [ ] The seeded core block equals the canonical ids **exactly** (incl. `pragmatic_enforcer`,
  `domain_expert`, `implementation_strategist`, `ai_engineer`; `security_specialist` not
  `security_architect`), plus zero-or-more advisors with unique ids.
- [ ] `agents/<kebab-id>.md` exists for every seeded member after setup; `config.yml` contains
  `pragmatic_mode`.
- [ ] Principles are written to `.architecture/principles.md`; generated links resolve.
- [ ] All present manifests are detected (Ruby/Rails + JS/Express in the dogfood case); manifest-derived
  values are sanitized; the scan is bounded/root-only.
- [ ] Skill docs reference the canonical roster by file; the fidelity test runs against **both** MCP and
  Skill outputs under `npm test`.
- [ ] Setup output reports the seeded roster + generated subagents + detected stack.

**Testing Approach:**
* Setup-fidelity test over polyglot fixtures (stub manifests), asserting the criteria above; run against
  MCP and Skill outputs.

## References

* [Architecture Review: ADR-016](../../reviews/adr-016-architecture-review.md) — the 8-architect review this revision incorporates
* [ADR-015: Reconciling MCP and Skills](./ADR-015-mcp-skills-parity-reconciliation.md) — second tier axis; tracks this as the Tier-1 setup-parity fix
* [Structural First-Principles Examination](../../reviews/structural-first-principles-examination.md) — the MCP↔canonical drift theme
* [Issue #9: Skills-based setup copies framework's own files into target projects](https://github.com/codenamev/ai-software-architect/issues/9) — complementary cruft-leak defect (sgbett)
* [PR #10: manifest-based selective installation for skills setup](https://github.com/codenamev/ai-software-architect/pull/10) — the manifest fix this ADR converges with (sgbett)
