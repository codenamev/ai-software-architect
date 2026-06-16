# ADR-015: Reconciling MCP and Skills — Two-Tier Capability Model

## Status

Accepted

> **History.** v1 (draft): rename the three MCP review tools to `scaffold_*` with deprecation aliases.
> v2 (after the 8-architect review — see [adr-015-architecture-review.md](../../reviews/adr-015-architecture-review.md)
> — and a live `setup_architecture` dogfood): corrected the false "Tier-1 is at parity" claim (P1),
> reframed the overstated "MCP has no agent loop" rationale via the MCP `sampling` nuance (P2), added
> `.claude/settings.json` to the blast radius (P4), dropped the deprecation aliases. **v3 (accepted,
> 2026-06-16): the maintainer ratified Alternative 2 — DELETE the three Tier-2 MCP tools outright**
> rather than rename them. The two-tier model and the P1/P2/P4 corrections are retained; the
> `scaffold_*` rename is now a rejected alternative. The Tier-1 setup-parity fix is split into
> [ADR-016](./ADR-016-setup-fidelity-canonical-sources.md).

## Context

ADR-011 founded the plugin's "thin wrapper" architecture on uniform feature parity: *"All channels
provide identical core features (setup, ADR creation, reviews, status, pragmatic mode)"* and *"95%+ code
sharing."* ADR-012 then bundled Skills, subagents, hooks, and the MCP server into one plugin.

A structural examination
([structural-first-principles-examination.md](../../reviews/structural-first-principles-examination.md))
and the 8-architect review of this ADR found the parity claim contradicted by the channels' own
behavior, and the "95% code sharing" figure misapplied:

- The **Skills** `architecture-review` / `specialist-review` orchestrate real subagent reviews —
  dispatching one subagent per team member via the Agent tool and aggregating (ADR-013).
- The **MCP tools** of effectively the same name (`start_architecture_review`, `specialist_review`,
  and `pragmatic_enforcer`) emit an **empty template/framework for manual completion** — two of them
  write a blank template file into `.architecture/reviews/`; `pragmatic_enforcer` returns text only.
- The MCP server (`mcp/index.js`, ~1,822 lines) and the Skills (`skills/*/SKILL.md`) **share zero
  code** — two independent reimplementations. ADR-011's "95%+ code sharing" describes the
  *marketplace-wrapper → MCP-npm* relationship only; it was never evidence of MCP↔Skills parity.

A user who invokes the review operation gets a genuine multi-perspective review through the Skill and a
hollow scaffold through the MCP tool of the same name, inside the same plugin. "Same name, different
behavior" is the single coherence gap most likely to mislead.

**Why the orchestrated tier cannot reach parity via MCP (corrected per review P2):** the MCP spec's
`sampling` capability *does* let a server drive nested LLM completions through the host, so it is **not**
true that "MCP can do no agentic work." The accurate — and stronger — statement is threefold:
1. An MCP server **cannot dispatch the host's Agent/Task subagents**; orchestration as ADR-013 defines
   it (forked-context subagents, parallel fan-out per member, persona isolation) is a host capability.
2. Claude Code does **not currently expose `sampling`** (it exposes `elicitation`).
3. Even if `sampling` were available, it is **single-shot and human-gated per call** — not the parallel
   subagent fan-out a review requires.

So orchestrated-review parity is **unavailable in this host and insufficient by mechanism**, not merely
unbuilt. The MCP review tools return templates *because that is the most they can do* — which makes them
low-value relative to the Skills a plugin user already has.

**The deterministic tier is NOT actually at parity either (corrected per review P1).** The dogfood of
`setup_architecture` produced a 6-member team omitting `pragmatic_enforcer`/`domain_expert`, using
divergent ids, and never reading canonical `.architecture/members.yml`. Parity for the deterministic
tier is therefore a **target, not a current fact**; the fix is [ADR-016](./ADR-016-setup-fidelity-canonical-sources.md).

The framework's operations fall into two tiers, distinguished by **outcome**:

| MCP tool | Outcome | Tier | Deterministic? | Reads canonical artifacts? | Disposition |
|---|---|---|---|---|---|
| `setup_architecture` | scaffolds `.architecture/` | 1 | Yes | **No (ADR-016)** | Keep; fix parity |
| `create_adr` | writes a numbered ADR | 1 | Yes | n/a | Keep |
| `list_architecture_members` | reads roster | 1 | Yes | Yes | Keep |
| `get_architecture_status` | counts files | 1 | Yes | Yes | Keep |
| `configure_pragmatic_mode` | edits config | 1 | Yes | Yes | Keep |
| `get_implementation_guidance` | reads config.yml | 1 | Yes | Yes | Keep |
| `start_architecture_review` | blank review template | 2 | No | — | **Remove** |
| `specialist_review` | blank review template | 2 | No | — | **Remove** |
| `pragmatic_enforcer` | blank analysis framework | 2 | No | — | **Remove** |

**Tier-assignment rule (two axes):** an operation is **Tier 1** only if it is *both* deterministic *and*
reads the same canonical artifacts as the other channels. An operation whose value is an LLM-produced
analysis is **Tier 2** and belongs to the host-agent channels (plugin/Skills) only.

## Decision Drivers

* **Honesty of the contract**: a tool name is a promise read by the host model at selection time; a tool
  that promises a review and delivers a blank template breaks it. The simplest way to stop making a
  false promise is to stop shipping the tool.
* **Simplicity**: the three tools are ~⅓ of `mcp/index.js` and produce only blank templates the host can
  generate inline; removing them is a large, clean simplification with no internal callers.
* **Accurate rationale**: the tier boundary rests on true platform constraints (no host subagent
  dispatch; sampling unavailable and insufficient).
* **Preserve MCP's real value**: the deterministic Tier-1 tools (and the static templates in
  `templates/`) remain; MCP keeps doing what it can do honestly.
* **Vocabulary integrity**: "channel" means *distribution* (ADR-011); the capability split needs its own
  noun ("tier").

## Decision

Adopt an explicit **two-tier capability model** and **delete the three Tier-2 MCP tools**.

**Tiers vs channels.** Tiers classify *operations* by capability/outcome; channels classify
*distributions* by install method. They are orthogonal — every channel offers Tier 1; only host-agent
channels (plugin/Skills) offer Tier 2.

**Tier 1 — Deterministic operations (kept in MCP; parity is the target):** `setup_architecture`,
`create_adr`, `list_architecture_members`, `get_architecture_status`, `configure_pragmatic_mode`,
`get_implementation_guidance`. `setup_architecture` parity is fixed by ADR-016.

**Tier 2 — LLM-produced analysis (plugin/Skills only):** architecture review, specialist review,
pragmatic enforcement. Delivered by the Skills/subagents (ADR-013). Cost note for users: Tier-2
orchestration fans out one subagent per active member and is the framework's most token- and
latency-intensive operation (full review > specialist review > pragmatic pass); there is no cheaper MCP
stand-in by design.

**Remove the three Tier-2 MCP tools:** delete `start_architecture_review`, `specialist_review`, and
`pragmatic_enforcer` from `mcp/index.js` (their schemas, switch cases, and handler bodies — ~600 lines,
no internal callers). MCP then "does fewer things, all honestly." Rationale for deletion over renaming:
the tools only ever emit blank templates a host agent can produce inline; the framework already ships
those structures as static files (`.architecture/templates/review.md`, `adr.md`) that any MCP client can
read; and no external caller is evidenced. Renaming would preserve a near-zero-value surface and a
capability cliff; deletion erases both.

**Migrate permissions:** remove the now-dead allow-list entries
`mcp__ai-software-architect__start_architecture_review` and
`mcp__ai-software-architect__specialist_review` from `.claude/settings.json`
(`pragmatic_enforcer` is not allow-listed).

**Update the parity claims (append-only):** annotate ADR-011 — both the "identical core features across
all channels" sentence and the "thin wrapper / 95%+ code sharing" framing — with "Amended by ADR-015,"
leaving its Status `Accepted`. Replace the docs' uniform-parity matrices with the two-tier table.

**Non-goal:** this ADR does **not** consolidate the duplicated MCP and Skills implementations of Tier-1
operations; that duplication persists and is deferred to a future ADR (ADR-016 fixes the most acute
instance — the setup roster).

**ADR-amendment convention (codified here):** Accepted ADRs are amended only by an append-only
`> Amended by ADR-NNN (date)` annotation at the relevant passage; their bodies are never rewritten and
their Status remains `Accepted`.

**Architectural Components Affected:**
* `mcp/index.js` — remove three tool schemas, three switch cases, three handler methods (~600 lines)
* `.claude/settings.json` — remove two dead allow-list entries
* `mcp/README.md`, `TROUBLESHOOTING.md`, `USAGE-WITH-CLAUDE.md` — remove references to the deleted tools
* `ADR-011` — append-only amendment of the parity and code-sharing claims
* Channel/feature matrices in `README.md`, `AGENTS.md`, `USAGE-WITH-CLAUDE-PLUGIN.md`, `.coding-assistants/*`
* No change to Skills, subagents, hooks, or any Tier-1 tool

**Interface Changes:**
* Three MCP tools removed (breaking) — CHANGELOG "BREAKING" + minor version bump (held consistent by the
  `version-check` guard from the version-unification work)
* No schema/parameter changes to surviving tools

## Consequences

### Positive

* The "same name, different behavior" trap is eliminated outright — there is no second tool to misread.
* `mcp/index.js` shrinks ~⅓; the surviving surface is exactly the deterministic operations MCP can do
  honestly.
* The framework's documented contract matches actual behavior; the rationale survives a reader checking
  the MCP spec.
* Removes the maintenance and conceptual load of explaining a capability cliff forever.

### Negative

* Breaking change for any (unevidenced) MCP-only integration that scripted the three tools — mitigated
  by CHANGELOG "BREAKING" + version bump.
* MCP-only (non-Claude) clients lose a blank-template generator. Mitigation: the same structures exist as
  static files in `.architecture/templates/` and can be read directly; no orchestrated review existed
  there to lose.
* Amending an Accepted ADR sets a precedent — bounded by the codified append-only convention.

### Neutral

* Surviving Tier-1 tools are unchanged (setup parity handled by ADR-016).
* `members.yml`, the subagent generator, and the `pragmatic_enforcer` *subagent/member* (distinct from
  the deleted MCP tool) are unaffected.

## Implementation Strategy

> Senior thinking on HOW and WHEN.

### Blast Radius

**Impact Scope**: Low–Medium. Removes ~600 lines from one file, two permission entries, and some doc
references; touches the published MCP server's tool surface (breaking, announced).

**Affected Components**: `mcp/index.js` (deletions), `.claude/settings.json`, MCP/usage docs, ADR-011
(annotation), channel matrices.

**Affected Teams**: Solo maintainer; downstream MCP-only integrators learn via CHANGELOG "BREAKING."

**User Impact**: Plugin/Skills users unaffected. MCP users lose three blank-template tools; templates
remain on disk.

**Risk Mitigation**: deletions land in one commit with the settings.json migration; verified by a real
`claude --plugin-dir ./` load (do not assume ADR-012 Phase-5 is live) asserting the surviving tool set;
the `version-check` guard keeps the version bump consistent across channels.

### Reversibility

**Reversibility Level**: High. The change is deletions + text; a single `git revert` restores the tools.
No data/schema migration.

**Migration Paths**: Forward — delete tools + migrate allow-list (one commit) → docs + ADR-011
annotation. Rollback — revert the commit. Evolution — if a real MCP-only need for structured templates
emerges, expose the static `templates/` via a Tier-1 read tool rather than reviving pseudo-review tools.

**Commitments Made**: MCP carries only Tier-1 operations; Tier-2 lives in the plugin/Skills.

### Sequencing & Timing

**Prerequisites**:
- [x] ADR-013 accepted (defines Tier 2); ADR-011/012 plugin shipped
- [ ] **Confirm against the current MCP SDK** that a server cannot dispatch host Agent/Task subagents
  and that Claude Code does not expose `sampling` (validates the rationale) — gates the change
- [ ] Confirm the ADR-012 Phase-5 smoke test runs the real CLI; if not, add a direct surviving-tool-set
  load assertion

**System Readiness**: Adequate. **Team Readiness**: High. **Data Migration**: None.

**Sequencing Concerns**: tool deletion + allow-list migration must be atomic; doc/matrix updates follow.
ADR-016 (setup parity) is independent.

**Readiness Assessment**: Ready once the prerequisite confirmations pass.

### Social Cost

**Learning Curve**: Low — fewer tools, one concept ("tier ≠ channel").

**Cognitive Load**: Reduced — nothing to explain about a hollow tool that no longer exists.

**Clarity Assessment**: Helps more than confuses — MCP doing fewer things honestly is clearer than three
tools that under-deliver.

**Documentation Needs**:
- [ ] CHANGELOG "BREAKING" entry for the removals
- [ ] ADR-011 append-only amendment (parity + code-sharing)
- [ ] Two-tier capability matrix in README/AGENTS/plugin docs
- [ ] CI grep guard: the three tool names appear only in CHANGELOG/ADRs after removal

### Confidence Assessment

**Model Correctness Confidence**: High — anchored to verified platform facts and a reproduced behavior
(the tools emit only blank templates).

**Assumptions**:
1. MCP servers cannot dispatch host Agent/Task subagents; Claude Code exposes `elicitation`, not
   `sampling`. — **Validation**: verified against the MCP spec in review; re-confirm at implementation.
2. No external MCP caller depends on the three tools. — **Validation**: unevidenced; accepted as the
   basis for deletion. If one surfaces, expose `templates/` via a Tier-1 read tool instead of reviving
   these.

**Uncertainty Areas**: whether to later expose static templates via a small Tier-1 tool (deferred until
a real need appears).

**Validation Approach**: real-CLI load of the surviving tool set; CI grep guard; manual review of the
rewritten matrices.

**Edge Cases**: a user on an old MCP client after the bump — covered by CHANGELOG "BREAKING" + version
pin.

## Implementation

**Phase 1: Remove the tools + migrate permissions (atomic)**
* Delete the three tool schemas, switch cases, and handler methods from `mcp/index.js`.
* Remove the two dead entries from `.claude/settings.json`.
* CHANGELOG "BREAKING" entry; minor version bump (consistent via `version-check`).
* Verify with `claude --plugin-dir ./` that the surviving tool set loads.

**Phase 2: Reconcile the claims (docs)**
* Append-only amend ADR-011 (parity + code-sharing) with "Amended by ADR-015."
* Remove deleted-tool references from `mcp/README.md`, `TROUBLESHOOTING.md`, `USAGE-WITH-CLAUDE.md`.
* Replace channel/feature matrices with the two-tier capability table.
* Add the CI grep guard for the three tool names.

## Alternatives Considered

### Alternative A: Rename to `scaffold_*` with honest descriptions *(was the v2 decision — rejected)*

Rename the three tools, reword descriptions, point to the Skill; no aliases.

**Pros:** preserves a structured-template generator for non-Claude clients under an honest name.
**Cons:** keeps a near-zero-value surface and a capability cliff to explain forever; ~600 lines of
blank-template code remain. The maintainer judged the scaffold value ≈ zero (host can produce templates
inline; static templates already on disk), so renaming preserves cost without benefit.

### Alternative B: Make the MCP tools actually orchestrate reviews

**Cons:** unavailable and insufficient — no host-subagent dispatch; Claude Code doesn't expose
`sampling`; sampling is single-shot/human-gated, not ADR-013 fan-out. Would require embedding an agent
runtime in the server.

### Alternative C: Description-only fix (keep names and behavior)

**Cons:** the tool *name* still reads as "do a review" and biases host selection; weakest option; leaves
the dead-weight code.

### Alternative D: Do nothing / prose caveat

**Cons:** leaves the false parity claim and the same-name trap. Rejected.

### Alternative E: Retire the MCP server entirely

Out of scope; overbroad — MCP delivers real Tier-1 value (once ADR-016 lands). Deserves its own ADR.

## Pragmatic Enforcer Analysis

**Reviewer**: Pragmatic Enforcer (reconciled with the independent 8-architect review)
**Mode**: Balanced

**Overall Decision Complexity Assessment**:
The accepted decision is *subtractive* — it removes ~⅓ of the MCP file and a whole confusion class, adds
no runtime path, and introduces no abstraction. The independent review explicitly recommended deletion
over the earlier rename-with-aliases as the simplest, most honest end-state; the maintainer ratified it.

**Decision Challenge**:

**Proposed Decision**: "Adopt a two-tier capability model and delete the three Tier-2 MCP tools;
correct the parity/code-sharing claims; surviving Tier-1 setup parity handled by ADR-016."

**Necessity Assessment**: 7/10 — an Accepted ADR makes claims the code contradicts and users hit a
same-name/cost cliff today; deletion resolves it at the root.

**Complexity Assessment**: 2/10 — deletions + doc edits + one allow-list change; net negative LOC.

**Alternative Analysis**: Rename (A), description-only (C), and do-nothing (D) all preserve the
dead-weight surface; orchestrate (B) is infeasible; retire-MCP (E) is overbroad. Deletion is the
minimal honest change.

**Recommendation**: ✅ Approve decision.

**Pragmatic Score**:
- **Necessity**: 7/10
- **Complexity**: 2/10
- **Ratio**: 0.29 *(Target: <1.5 for balanced mode)*

**Overall Assessment**: Corrective and simplifying — removes surface rather than adding it.

## Validation

**Acceptance Criteria:**
- [ ] `start_architecture_review`, `specialist_review`, `pragmatic_enforcer` are removed from
  `mcp/index.js` (schemas, switch cases, handlers); a real `claude --plugin-dir ./` load shows only the
  six Tier-1 tools.
- [ ] `.claude/settings.json` no longer lists the two removed tools; no dead allow-list entries remain.
- [ ] ADR-011's parity **and** code-sharing claims carry an append-only "Amended by ADR-015" annotation;
  Status stays Accepted.
- [ ] README/AGENTS/plugin docs show the two-tier capability matrix; `get_implementation_guidance`
  appears in the Tier-1 list; no how-to doc references the removed tools.
- [ ] CHANGELOG "BREAKING" entry present; version bumped consistently (`version-check` passes).
- [ ] CI grep guard: the three tool names appear only in CHANGELOG/ADRs.

**Testing Approach:**
* Real-CLI load of the surviving tool set.
* CI grep guard for residual references.
* Manual review of the rewritten matrices against `mcp/index.js`.

## References

* [Architecture Review: ADR-015](../../reviews/adr-015-architecture-review.md) — the 8-architect review behind this decision
* [ADR-016: Setup Must Derive Team and Stack from Canonical Sources](./ADR-016-setup-fidelity-canonical-sources.md) — the Tier-1 setup-parity fix
* [ADR-011: Claude Marketplace Plugin Implementation](./ADR-011-claude-marketplace-plugin-implementation.md) — parity + code-sharing claims amended here
* [ADR-012: Claude Plugin Distribution and Configuration Hardening](./ADR-012-claude-plugin-distribution-hardening.md) — bundled the surfaces; Phase-5 smoke test
* [ADR-013: Skill Orchestrator Pattern with Subagent Delegation](./ADR-013-skill-orchestrator-subagent-delegation.md) — defines Tier-2 orchestration
* [Structural First-Principles Examination](../../reviews/structural-first-principles-examination.md) — surfaced the parity gap
