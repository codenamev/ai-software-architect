# Architecture Review: ADR-015 (MCP/Skills Parity Reconciliation)

**Review target:** ADR-015 — Reconciling MCP and Skills (Two-Tier Channel Parity), Status: Proposed
**Date:** 2026-06-16
**Process:** Full multi-perspective review (ADR-013 orchestrator pattern) — all 8 architecture team
members dispatched as independent subagents, plus a live dogfood of `setup_architecture`.
**Pragmatic mode:** Enabled (balanced).

> This review was produced by running the framework on its own ADR — the architecture-review
> orchestrator dispatched eight specialist subagents in parallel, each reviewing from one lens only.

## Executive Summary

**Consensus verdict: Approve-with-changes — 8 of 8 architects.** No member approved as-is; none
rejected. The decision's *direction* (a capability-based two-tier model + honest tool naming) is
endorsed unanimously, but the ADR as written contains two factual inaccuracies and one
possibly-unnecessary mechanism that must be addressed first. Several corrections make the decision
**stronger**, not weaker.

The four highest-priority findings (each raised independently by 2–4 members and corroborated by the
dogfood run):

1. **P1 — The "Tier-1 is genuinely at parity" claim is false.** `setup_architecture` (a declared
   Tier-1 "full parity" op) diverges: `mcp/index.js:471-548` `customizeMembers` hardcodes a 4–6 member
   roster, omits `pragmatic_enforcer` and `domain_expert`, uses divergent ids (`security_architect` vs
   canonical `security_specialist`), and never reads canonical `.architecture/members.yml`. *(Systems,
   Domain, Maintainability, AI Engineer + dogfood.)*
2. **P2 — The "MCP has no agent loop / orchestration is architecturally infeasible" rationale is
   overstated.** The MCP spec's `sampling` lets a server drive nested LLM calls ("agentic behaviors").
   The accurate — and stronger — claim: MCP servers cannot dispatch the *host's* Agent/Task subagents;
   Claude Code does not currently expose `sampling`; and even sampling is single-shot/human-gated, not
   ADR-013's forked parallel fan-out. *(AI Engineer, High.)*
3. **P3 — The deprecation-alias shim may be YAGNI.** Its removal trigger ("usage signal/telemetry")
   can never fire for an stdio MCP server with no telemetry, so the "temporary" alias is
   permanent-by-default. Independent Pragmatic score **0.67** vs the ADR's self-score 0.43. *(Pragmatic
   Enforcer High; Maintainability, Implementation, Security Med.)*
4. **P4 — Permission allow-list is in the blast radius, uncounted.** `.claude/settings.json` allow-lists
   two of the three renamed tools by exact name; renaming silently de-scopes them. *(Security, High;
   verified.)*

## Dogfood Evidence (setup_architecture)

A live `setup_architecture` run against a fresh Rails+Express fixture produced independent corroboration
for P1 and exposed setup-specific bugs:

- **Divergent team:** generated 6 members (systems/security/performance/maintainability + javascript/
  express experts) vs the canonical 8; **omits pragmatic-enforcer and domain-expert**; divergent ids.
- **Stack misdetection:** reported "Framework: Express" and built `javascript_expert` + `express_specialist`
  while missing the Rails/Ruby stack entirely (Gemfile present; package manager *was* detected as
  "bundler" — internally inconsistent). SQLite (Gemfile) not surfaced.
- **Initial analysis hardcoded to 4 perspectives** (Systems/Security/Performance/Maintainability), not
  the roster.
- **Broken generated link:** `initial-system-analysis.md` points to `.architecture/decisions/principles.md`
  (actual: `.architecture/principles.md`) — ironic post-1.5.4 link cleanup.

These are out of ADR-015's scope but should be filed as a separate setup-fidelity issue/ADR; they prove
the MCP↔canonical drift is broader than the review tools.

## Individual Perspectives

**Systems Architect — Approve-with-changes.** Root-cause framing (capability property, not bug) is at
the right altitude. But the tier boundary is drawn on incomplete evidence: `setup_architecture` is also
divergent yet filed under full parity. Add a second tier axis: "deterministic **and** reads the same
canonical artifacts." Amend ADR-011's *code-sharing* claim, not just the parity sentence.

**Domain Expert — Approve-with-changes.** The split names a real domain concept honestly (one term had
denoted two operations). But the vocabulary isn't yet a coherent ubiquitous language: "channel" is
overloaded (ADR-011 = distribution; ADR-015 title = capability), and "Tier-2" denotes *both* the
orchestrated op and its hollow scaffold — reintroducing one-term-two-meanings one level up. Retitle to
"Two-Tier **Capability** Model"; define tiers by domain *outcome*, not mechanism; reserve "channel" for
distribution.

**Security Specialist — Approve-with-changes.** Rename is security-positive (kills a name-spoofing
trap). But `.claude/settings.json` allow-lists `specialist_review` and `start_architecture_review` by
exact name; after rename the deprecated alias is the only *pre-approved* path — inverting trust (the
safer-named tool prompts; the legacy name runs silently). Add settings.json to blast radius; never leave
a deprecated name as the only allow-listed path; add a stderr deprecation log for real evidence; bump
semver + CHANGELOG "BREAKING (aliased)".

**Maintainability Expert — Approve-with-changes.** Honest naming is a durable win and the tier rule is a
real invariant. But the ADR relabels without reducing the actual liability: MCP and Skills are two
independent reimplementations sharing **zero** code; Tier-1 duplication persists and must be maintained
in parallel forever (already drifting — see setup). Add an explicit non-goal ("does not consolidate the
duplication"), a parity smoke-test driven by canonical `members.yml`, a version-bound alias-removal
default, and a CI grep that old names appear only in CHANGELOG/ADRs.

**Performance Specialist — Approve-with-changes.** Narrow lens, stated honestly. The tier boundary is
also a *cost* boundary the ADR never names: Tier-2 orchestration fans out N subagents (most expensive op
in the framework); a scaffold is ~free. Name the asymmetry; add "when to use scaffold vs orchestration"
routing guidance; sub-label the three Tier-2 ops by cost (N-subagent / 1-subagent / 1-pass).

**Implementation Strategist — Approve-with-changes.** Reversibility/sequencing are honest. But the
deprecation window has no anchor version ("one minor" from undefined base), the removal trigger is
unactionable (no telemetry), the ADR-011 amendment mechanics are unspecified (where/Status change?), and
it assumes the ADR-012 Phase-5 smoke test is live when it's gated behind a manual fallback. Pin versions;
make removal time-based ("absence of objection = remove"); specify the annotation mechanics; add a
prerequisite to confirm the MCP-capability assumption and the smoke test before Phase 1.

**AI Engineer — Approve-with-changes.** The agent-UX outcome is right (the pointer-in-payload pattern is
correct LLM-orchestration design). But the central rationale is factually overstated against the MCP
spec (sampling enables server-side agentic behavior). Reframe to the accurate, *stronger* claim — and
note that even sampling (single-shot, human-gated) ≠ ADR-013 fan-out, which is the durable reason parity
is out of reach. Also flags the `setup_architecture` Tier-1 divergence as the same family of bug.

**Pragmatic Enforcer — Approve-with-changes (independent).** Did not rubber-stamp the self-analysis.
The coherence fix is needed now; the alias shim is not — it defends an unevidenced audience with an
unfireable removal trigger and becomes permanent-by-default. Recommends **dropping the alias + Phase 3**
and doing a one-shot rename, and **seriously elevating Alternative 2 (delete the three template tools)**
since the host can produce the same template inline. Also: justify rename vs a cheaper description-only
fix. **Independent score: Necessity 6 / Complexity 4 / Ratio 0.67** (vs self 0.43); stripped of the
alias, the reduced decision earns ~0.29.

## Collaborative Discussion (Cross-Cutting Synthesis)

- **The decision is right; the justification and scope need work.** Every member endorses two tiers +
  honest naming. The corrections (P1, P2) remove false claims that would have undermined the ADR on
  inspection — fixing them is net-strengthening.
- **The real disease is duplication, not naming.** Maintainability + Systems + the dogfood converge:
  MCP and Skills are independent reimplementations that already drift (setup roster). ADR-015 should
  explicitly scope this out (non-goal) rather than imply it's fixed, and add a parity test so Tier-1
  claims become *enforced*, not asserted.
- **Simplicity tension on the alias.** Pragmatic/Maintainability/Implementation lean "drop the alias";
  Security leans "be careful" — but Security's concern is *resolved by removing the alias* (no
  name-divergence window). The synthesis favors a one-shot rename with a CHANGELOG breaking note, with
  Alternative 2 (delete) elevated as a live option for maintainer ratification.

## Prioritized Recommendations

**Must-fix before acceptance (factual/correctness):**
1. (P1) Correct the Tier-1 parity claim; add the second axis ("deterministic **and** reads canonical
   artifacts"); mark `setup_architecture` parity as *target, not actual*; file the setup divergence as
   tracked follow-up + add a canonical-driven parity smoke test as acceptance criterion.
2. (P2) Reframe the agent-loop rationale to: no host-subagent dispatch; Claude Code doesn't expose
   `sampling`; sampling ≠ ADR-013 fan-out. Update Assumption #1 to the verified result.
3. (P4) Add `.claude/settings.json` to the blast radius; migrate allow-list entries in lockstep; note
   `pragmatic_enforcer` is not allow-listed.
4. Add the 9th shipped tool `get_implementation_guidance` to the tier table (Tier-1).
5. Amend ADR-011's "95% code-sharing/thin-wrapper" framing too (it describes wrapper→npm, not
   MCP↔Skills, which share zero code).

**Should-fix (design/clarity — includes the ratification call):**
6. (P3) Drop the deprecation alias + Phase 3; do a one-shot rename with CHANGELOG "BREAKING"; OR pin a
   concrete removal version with "absence of objection = remove." Elevate Alternative 2 (delete) to a
   ratification option. Reconcile the self Pragmatic score with the panel's 0.67.
7. (P5) Retitle to "Two-Tier Capability Model"; reserve "channel" for distribution; define tiers by
   outcome; add a glossary mapping operation → tier → orchestrated form → scaffold form.
8. (P7) Name the Tier-2 cost asymmetry; add scaffold-vs-orchestration routing guidance + per-op cost
   sub-labels.

**Nice-to-have (process):**
9. Add a non-goal: this ADR does not consolidate MCP/Skills duplication (deferred).
10. Codify the ADR-amendment convention (append-only `> Amended by ADR-NNN` annotation; Status stays
    Accepted). Add a CI grep guard that old tool names appear only in CHANGELOG/ADRs.
11. Don't assume ADR-012 Phase-5 smoke test is live; verify or add a direct `claude --plugin-dir ./`
    tool-load check.

## Overall Recommendation

**Approve-with-changes.** Accept the two-tier direction. Apply the must-fix corrections (P1, P2, P4,
#4, #5) before moving the ADR to Accepted, and ratify the alias/delete decision (P3). The review
*increased* confidence in the core decision while catching two claims that would not have survived
scrutiny.
