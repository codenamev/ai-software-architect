# Architecture Review: ADR-016 (Setup Fidelity — Canonical Sources)

**Review target:** ADR-016 — "Setup Must Derive Team and Stack from Canonical Sources," Status: Proposed
**Date:** 2026-06-16
**Process:** Full multi-perspective review (ADR-013 orchestrator) — all 8 architects dispatched as
independent subagents; claims verified against `mcp/index.js`.
**Pragmatic mode:** Enabled (balanced).

## Executive Summary

**Consensus: Approve-with-changes — 7 of 8; Performance: Approve (narrow lens).** The decision's
direction — seed the team from the canonical `members.yml` instead of a hardcoded list — is endorsed
unanimously as the correct root-cause fix. But the review found **four factual errors in the ADR** (all
verified in code) that materially change its risk, effort, and completeness, plus scope and
vocabulary issues.

**Verified factual corrections (must-fix):**

1. **F1 — Setup does NOT use source-discovery.** The ADR's load-bearing risk claim ("reuses the proven
   source-discovery path… already relied on for templates… low marginal risk," Complexity 3/10) is
   false. `mcp/index.js` setup copies from `path.resolve(__dirname, '..')` via `fs.copy` (line 229) and
   never references `setup-source-discovery.js`. Wiring discovery into MCP setup is **new work and a new
   failure mode**, not a marginal extension. *(Systems, Implementation, AI Engineer — High; verified.)*
2. **F2 — Setup never generates subagents.** Setup seeds `members.yml` but never runs the generator, and
   `agents/*.md` live at repo root (not copied into the target). A fresh install therefore has the team
   YAML but **zero dispatchable subagents** — reviews and pragmatic mode cannot run end-to-end. The
   ADR's "subagent generator and Skills unaffected / pragmatic mode works out of the box" is false for
   new installs. *(AI Engineer — High; verified: no `generateAll` call.)*
3. **F3 — Re-run is impossible today; the "preserves customized members.yml" guarantee is unbuilt.**
   Setup **aborts** when `.architecture` exists (line 206). There is no merge path, so the ADR's
   "non-destructive re-run preserves customizations" is neither current behavior nor built by any phase,
   and it hides a real fork (preserve → fix never reaches existing installs; reseed → loses edits).
   *(Implementation — High; Maintainability — Med; verified.)*
4. **F4 — The drift is 4 missing members, not 2, plus a mislocated file.** `customizeMembers` (line 394)
   hardcodes 4 base members (and `security_architect`, not canonical `security_specialist`), omitting
   **`domain_expert`, `implementation_strategist`, `ai_engineer`, and `pragmatic_enforcer`**.
   Separately, `customizePrinciples` writes principles to `decisions/principles.md` (line 525) — the
   *file is mislocated*, not merely linked wrong (canonical: `.architecture/principles.md`; 3 reference
   sites at 525/703/804). *(Pragmatic, Maintainability, AI Engineer; verified.)*

## Individual Perspectives

**Systems Architect — Approve-with-changes.** Right instinct (one canonical source). But the ADR rests
on F1 (setup doesn't use discovery), so its risk/effort is understated; needs an explicit
**discovery-failure policy** (fail loudly, never fall back to a partial hardcoded roster, or drift
returns). Also: `principles.md`/templates are *also* hardcoded inline — same root cause, fix or scope
out. Define the `analyzeProject` output as a named contract (languages[]/frameworks[]/datastore[]) so
the three consumers don't re-diverge. Advisor ids need a canonical-precedence/uniqueness rule.

**Domain Expert — Approve-with-changes.** "advisor" is load-bearing but undefined; "specialist" is
overloaded (core `*_specialist` vs a stack "Rails specialist"). Add a Domain Vocabulary block:
**member** (any entry), **core member** (canonical 8, invariant floor), **advisor** (appended,
stack-derived, additive, never substitutes). State whether advisors share the schema and join review
phases; add id-uniqueness.

**Security Specialist — Approve-with-changes.** Copying `members.yml` from a *discovered* source and
parsing untrusted manifests are higher-trust ops than the ADR treats them. Add: **validate the copied
roster** (assert canonical-8 ids incl. `pragmatic_enforcer`; fail closed); **sanitize** manifest-derived
values (framework/dep names get interpolated into ids and the generated analysis — injection path);
**bound** manifest scan size/count (DoS); log which `source` (env/plugin/clone) resolved (env var is
the highest-priority, spoofable resolver).

**Maintainability Expert — Approve-with-changes.** Removes real duplication and the golden test is the
right guard. But the Skill is **not** fully unaffected (F-adjacent): it copies canonical `members.yml`
yet its docs encode a stale 6/7-member core (SKILL.md step 4 = 7; customization-guide = 6; checklist =
"seven"), omitting `implementation_strategist` + `ai_engineer`. Fixing only MCP leaves a doc-level
second source of truth that re-drifts. Tighten the test from `⊇ canonical-8` to **set-equality on the
canonical block** (a superset passes even with a wrong-id member, missing the `security_architect`
drift). Resolve the re-run fork (F3) and define the merge key (`id`).

**Performance Specialist — Approve.** Negligible lens (one-shot, root-scoped). Only ask: bound detection
to root-only (don't recurse into `node_modules`/`vendor`); keep fidelity-test fixtures as minimal stub
manifests.

**Implementation Strategist — Approve-with-changes.** The plan rests on F1 (false prerequisite — add a
Phase 0 to wire `discoverSource` into MCP setup) and F3 (re-run preservation is unbuilt and currently
blocked by the line-206 abort — give it its own phase + test or drop it). Phase 2 must **replace** the
hardcoded `writeFile` (line 467), not append. The Skill↔MCP divergence needs a coordination contract:
run the fidelity test against **both** surfaces, or scope the Skill out explicitly.

**AI Engineer — Approve-with-changes.** F2 is the central gap: seeding YAML without generating
`agents/*.md` (and without seeding a `config.yml` carrying `pragmatic_mode`) means the team isn't
dispatchable and "pragmatic mode works out of the box" is unproven. Add: setup runs the generator and
seeds `config.yml`; assert `agents/pragmatic-enforcer.md` exists post-setup. Add an **observability**
criterion: setup reports the seeded roster (count + ids), generated subagents, and detected stack +
datastore, so an operator can trust the install without inspecting files. Fix `principles.md` at its
source (mislocated, 3 sites).

**Pragmatic Enforcer — Approve-with-changes (independent: Necessity 7 / Complexity 5 / Ratio 0.71,
disagrees with self-score 0.38).** The core (seed-from-canonical) is justified — Alternative 1 (patch
the hardcoded list) would need ~4 members + id fixes and re-drifts. But the ADR **bundles scope creep**:
datastore-surfacing has no named consumer (YAGNI), and dynamic roster-driven analysis regeneration is
the heaviest part for the least defect value (the link bug is one line). Trim to: canonical seed +
multi-valued framework (so no masking) + principles/link fix + generator + Skill-doc reconcile. Relax
the golden test to canonical-block equality (less brittle than full golden). Self-score Complexity 3
undercounts the bundled work.

## Collaborative Discussion (Synthesis)

- **The decision is right; the ADR's description of current reality was wrong.** F1–F4 all stem from the
  ADR being written from the dogfood symptom + a partial read, asserting a reuse ("source-discovery,
  templates") that doesn't exist and a completeness ("subagents/pragmatic work") that the new-install
  path never delivers. Correcting them makes the ADR bigger but honest.
- **"Seed the YAML" is necessary but not sufficient.** Three things must co-occur for a fresh install to
  actually function: (1) seed canonical `members.yml`, (2) **generate `agents/*.md`** from it, (3) seed
  `config.yml` with `pragmatic_mode`. F2 means the ADR currently specifies only (1).
- **Drift is relocated unless the Skill is included.** MCP and the Skill are two setup paths; the Skill's
  copy is right but its docs aren't. The cheap hedge (until the shared-module ADR) is: fix the Skill
  docs to reference the canonical file, and run the fidelity test against both surfaces.
- **Trim the scope.** The bug is "wrong team + masked stack + mislocated principles." Datastore-surfacing
  and dynamic analysis regeneration exceed it; defer them.

## Prioritized Recommendations

**Must-fix (correctness):**
1. (F1) Correct the premise; add **Phase 0: wire `discoverSource` into MCP setup**, replacing the
   `__dirname` copy. Add a **discovery-failure policy** (fail loudly; never partial-seed).
2. (F2) Add to the Decision: setup **generates `agents/*.md`** from the seeded roster and **seeds
   `config.yml` with `pragmatic_mode`**; acceptance: `agents/pragmatic-enforcer.md` exists + config has
   the block.
3. (F3) Resolve re-run: either build preserve+reseed-canonical-block (own phase + idempotency test,
   merge key = `id`) or **drop the guarantee** and state setup still aborts on an existing `.architecture`
   (existing installs out of scope).
4. (F4) Correct the count to **4 missing members**; fix `principles.md` **location** (write to
   `.architecture/principles.md`) at all 3 sites, not just the link.
5. Phase 2 must **replace** the hardcoded member write (line 467), not append.

**Should-fix (design/clarity):**
6. (Maintainability) Reconcile the **Skill docs** (SKILL.md / customization-guide / checklist) to
   reference the canonical roster by file; run the fidelity test against **both** MCP and Skill, or
   scope the Skill out explicitly.
7. (Maintainability/Pragmatic) Test asserts the **canonical block = canonical ids exactly** (catches
   id-drift) + zero-or-more advisors; avoid brittle full-golden.
8. (Domain) Add a **Vocabulary** block (member / core member / advisor); advisor id-uniqueness;
   stop calling advisors "specialists."
9. (Security) Validate the copied roster (fail closed); sanitize manifest-derived values; bound the
   scan; log the resolved source.
10. (Pragmatic) **Trim scope**: defer datastore-surfacing (no consumer) and dynamic analysis
    regeneration; keep multi-valued framework + the one-line link/location fix.

**Nice-to-have:**
11. (AI Engineer) Setup **reports** the seeded roster + generated subagents + detected stack
    (observability).
12. (Systems/Performance) Define the `analyzeProject` output contract once; bound detection to root-only.

## Overall Recommendation

**Approve-with-changes.** Keep the canonical-seed direction. Before moving to Accepted, apply the
correctness fixes (F1–F4 + the generator/config gap), reconcile the Skill, and trim the bundled scope.
The review's net effect: the fix is **larger and more dependency-laden than the ADR claimed**, but also
**incomplete as written** — seeding YAML alone would have shipped a still-broken install.
