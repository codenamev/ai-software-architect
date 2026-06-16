# Structural Examination: First Principles

> A critical look at the *shape* of the AI Software Architect framework — not its features, but
> whether its fundamental structure is justified. Companion to the feature inventory; written to be
> disagreed with.
>
> **Date:** 2026-06-09
> **Method:** Full-surface inventory (skills, MCP, agents, hooks, tools, artifacts, docs) →
> first-principles interrogation of each structural choice.

---

## Thesis

**This is a methodology wearing a framework's clothes.**

~80% of the value is a *way of thinking* — eight specialist lenses, senior-thinking checklists
(blast radius, reversibility, social cost), pragmatic YAGNI pressure, durable decision records.
~20% is *code* — validators, a generator, two hooks, a CLI.

The methodology is the product. But it is **packaged, versioned, and distributed like a software
product** — semver, a plugin, an MCP server, CI matrices, a four-surface delivery story. Most of the
structural tension in the repo traces back to that single mismatch. A methodology doesn't need four
delivery surfaces or four version numbers; it needs to be *read, internalized, and invoked*. The code
parts that genuinely matter are thin wrappers around "ask the model to think this way, in independent
contexts."

The rest of this document argues that from first principles, then names what's load-bearing and what
has calcified into surface area.

---

## Seven first-principles questions

### 1. Is the *persona* the load-bearing primitive, or the *dimension*?

The framework reifies eight architects (`members.yml` → `agents/*.md`). But one model does not host
eight minds. "Be the security specialist" yields the model's security knowledge through a persona
filter. The real signal of a multi-perspective review is **coverage of dimensions** — did we examine
security, performance, maintainability, blast radius? — not the existence of named characters.

The persona buys two real things: (a) **independent contexts** when dispatched as separate subagents
(ADR-013), which genuinely reduces anchoring and forces breadth; (b) narrative identity, which is
mostly flavor. The danger is mistaking (b) for the value. If personas were collapsed to a checklist
of review dimensions run in parallel sub-contexts, almost no signal would be lost and a lot of
maintenance (roster YAML, generator, drift-checks, protection hook) would disappear.

**Question to sit with:** if you deleted the names and kept the dimensions + independent contexts,
what would actually get worse for the user?

### 2. Four surfaces (Skills + MCP + subagents + hooks) — what does MCP earn?

This is the clearest over-build. Every operation exists as both a Skill and an MCP tool **with
different behavior**: Skills *orchestrate real subagent reviews*; the MCP equivalents *emit empty
templates for manual completion*. A user who invokes `start_architecture_review` over MCP gets a
hollow shell of the same-named Skill. That is not two surfaces serving two audiences — it is one good
implementation and one inferior duplicate sharing names.

MCP's only first-principles justification is non-Claude MCP clients. But the framework is so
Claude-centric (skills, subagents, hooks, plugin) that an MCP-only client already gets a degraded
experience. So MCP carries weight — a 1,800-line `index.js`, its own version, its own test surface —
to serve an audience the rest of the framework doesn't really serve.

**Question to sit with:** is MCP a product surface, or development archaeology that was never retired?

### 3. "Cross-platform" — real, or aspirational tax?

The framework's canonical-core story (AGENTS.md as platform-neutral truth, CLAUDE.md as the Claude
layer) is built for three platforms. The actual investment:

- **Claude:** 7 skills, 8 subagents, 2 hooks, plugin, MCP. (Everything.)
- **Cursor:** 5 static `.mdc` files.
- **Codex:** "context recognition" — i.e., it reads the docs and hopes.

So "cross-platform" is "Claude, plus breadcrumbs." Yet the abstraction imposes real, ongoing cost:
the AGENTS.md/CLAUDE.md split, the instruction-counting machinery built to police it (ADR-005/006),
and duplicated setup prose across five files. The framework pays cross-platform taxes for a
single-platform reality.

**Question to sit with:** if Cursor and Codex support were dropped tomorrow, would any real user
notice — and how much structure would collapse if they did?

### 4. Do the artifacts serve users, or the framework's own development?

**All 14 ADRs are about the framework's own construction.** Zero document a decision in any domain
the framework exists to help with. CLI requirements, pragmatic mode, agents.md adoption, instruction
capacity, skills, the plugin, the orchestrator pattern, setup. The reviews are the same — Claude
marketplace plugin, skills implementation, feature parity, progressive disclosure.

This is dogfooding, which is healthy. But it means the structure has been shaped by *what the
framework needed during its own development*, not by what a downstream user's project needs. The
`comparisons/` directory (148KB of phase-2 results, skills deep-dives, PoC writeups) is R&D notes
**shipped inside the product**. A user installing this to govern *their* Rails app inherits the
framework's own development diary.

**Question to sit with:** what in `.architecture/` would a brand-new adopter actually want present on
day one, versus what is the author's lab notebook?

### 5. Instruction-capacity governance — proportional cure, or Goodhart?

There is real machinery here: an instruction counter, a counting-methodology doc, CI enforcement, and
the three-tier doc split (AGENTS ≤150 / CLAUDE ≤30 / agent_docs on demand). The underlying concern —
context dilution degrades instruction-following — is legitimate and well-observed.

But a regex that counts "commands, conditionals, procedures, guidelines" is a *proxy*. The real
failure is the model ignoring or contradicting instructions, which correlates with count only loosely.
150 well-organized, non-conflicting instructions outperform 80 contradictory ones. Building CI that
fails a build for crossing a count threshold optimizes the number, not the outcome — the textbook
shape of a Goodhart trap. The cure has grown its own bureaucracy (a methodology doc *about how to
count*, metrics tracking) that itself adds surface area.

**Question to sit with:** has anyone measured that staying under 150 actually improves model behavior,
or is the number self-justifying because it's enforced?

### 6. Protected files — who is protected from whom?

Two hooks block the *agent* from editing `members.yml`, `principles.md`, `config.yml`. The same agent
is trusted to author ADRs, run architecture reviews, and design systems. The stated reason is drift:
editing `members.yml` without regenerating `agents/*.md` desyncs source and output.

But that's a **build-system problem** — a generated artifact going stale relative to its source. The
correct fix is to make generation automatic (regenerate on change, or treat `agents/*.md` as a pure
build product never committed). Blocking edits is a guardrail compensating for a missing build step,
and it encodes a distrust that sits oddly against everything else the agent is trusted to do.

**Question to sit with:** if `agents/*.md` regenerated automatically, would the protection hook have
any remaining reason to exist?

### 7. Is it a framework or a methodology — and does the packaging fight its nature?

Return to the thesis. The four-way version drift is the tell: **plugin 1.5.4, MCP 1.3.0, tools 1.0.0,
config/CLAUDE 1.2.0.** Four components, four versions, one product, no single answer to "what version
am I running." That is what happens when a methodology is forced into software's release model: the
parts version independently because they were never really one shippable unit — they're facets of an
idea that got `package.json`s.

A methodology's "release" is a revised way of thinking. This one's releases are CI-validated artifact
bumps. The mismatch is the root cause feeding questions 2–6: the multi-surface duplication, the
artifact sprawl, the counting bureaucracy, and the version chaos are all symptoms of packaging a
*practice* as a *product*.

---

## What is genuinely load-bearing

Be fair: the value is real and concentrated. Three things carry the framework.

1. **Subagent review orchestration (ADR-013).** Dispatching independent sub-contexts for
   multi-dimension review is the one place the "multi-agent" claim cashes out into real signal:
   parallel coverage, reduced anchoring. This is the product.
2. **Senior-thinking scaffolds.** Blast radius, reversibility, sequencing, social cost, confidence —
   these checklists are high-quality prompting structure that reliably improves the *shape* of an
   AI's architectural reasoning. (`principles.md` belongs here too.)
3. **Pragmatic guard / YAGNI pressure.** A direct, well-aimed counter to the LLM's strong bias toward
   over-building. Conceptually the most original part.

The clean engineering — `members.yml` as single source, generated subagents, drift detection — is
good *craft*. The question (per #1 and #6) is whether the thing being engineered needs to exist.

---

## What has calcified into surface area

| Item | Verdict | First-principles reason |
|---|---|---|
| MCP server | **Retire or fully merge** | Inferior duplicate of Skills; serves an audience the framework doesn't otherwise serve (#2) |
| Cross-platform abstraction | **Demote to honest "Claude-first"** | Real cost, notional benefit; Cursor/Codex are breadcrumbs (#3) |
| `comparisons/` (148KB) | **Move out of shipped product** | Author's R&D diary, not user-facing (#4) |
| Instruction-count CI gate | **Keep, but see stress-test** | Critique softened — research-backed and self-policed (#5, revised below) |
| Protection hooks | **Keep, but see stress-test** | Critique partly misfired — drift is handled, hooks guard source not output (#6, revised below) |
| Four version numbers | **✅ FIXED** | Unified to 1.5.4 across all 8 sources + added `version-check` guard (CI-enforced). ADR-011 commitment now honored. |
| `CLAUDE-example.md` | **Delete** | Documents an unrelated project ("Agentic" Ruby gem) |
| `.ai-assistants/` | **Delete** | Empty; dead directory |
| `docs/` (untracked) | **Decide: vendor properly or remove** | Claude Code *platform* docs sitting untracked in repo root |
| 5 overlapping setup docs | **Consolidate** | Same 6-step process duplicated; one retired doc still shipping |

---

## Stress test: what the recorded rationale says back

The critique above was written before reading the ADRs it names. Read honestly, the framework's own
decision records defend some of these choices well and expose others as worse than first stated. In
the spirit of the framework (confident updating on evidence), here is the accounting.

### Critiques that get *weaker*

**#5 Instruction counting — overreached.** ADR-005 grounds the ~150-instruction limit in external
research (HumanLayer), not invention. More tellingly, the framework's *own* Pragmatic Enforcer
reviewed ADR-006 and flagged exactly the over-engineering I did — it pushed back on a 6-file split and
forced consolidation to 2-3 files, with a documented "split further only when a file exceeds 300 lines"
trigger. Success metrics include *user-reported effectiveness*, not just the count. This is not blind
Goodharting; it's a proxy used with awareness of its limits. **Revised verdict:** the CI gate is
defensible. The fair residual concern is narrow — *failing a build* on a proxy is still stronger
enforcement than the proxy's confidence warrants; advisory warning would lose little. Minor, not
structural.

**#6 Protection hooks / drift — partly misfired.** Two errors in my original reasoning. First, the
protection hook guards `members.yml`/`principles.md`/`config.yml` — the *source* files — not the
generated `agents/*.md`. So it's about preventing unreviewed changes to sources of truth, not about
drift. Second, ADR-012 *explicitly considered* my proposed fix (runtime/auto-generation, Alternative 3)
and rejected it for a concrete platform constraint: Claude Code plugins load `agents/*.md` statically
at install; there is no install-time codegen hook. Drift is caught by a CI golden-file snapshot, which
is the correct mechanism. **Revised verdict:** withdrawn. The design is sound and the alternative I
proposed was already evaluated and declined for a real reason.

### Critiques that get *stronger*

**#7 Version drift — this is a broken commitment, not an inconsistency.** ADR-011 ("Architectural
Decision (Regardless of Path)") commits in writing: *"Single version number shared across all
channels. Automated release pipeline: git tag → npm publish → Skills update → marketplace sync.
Prevents version drift and user confusion."* The verified reality — plugin `1.5.4`, MCP `1.3.0`, tools
`1.0.0`, config/CLAUDE `1.2.0` — means the single-version commitment was made and then broken, and the
automated pipeline that was supposed to enforce it either was never built or has stopped running. This
is no longer a smell; it's a named, accepted decision that the codebase contradicts. **Sharpened
verdict:** highest-priority fix, because it's the framework failing its own recorded standard.

**#2 MCP/Skills divergence — the parity claim is provably false.** ADR-011's thin-wrapper architecture
rests on "All channels provide identical core features" and "95%+ code sharing." But the inventory
shows the MCP `start_architecture_review`/`specialist_review` tools emit *empty templates*, while the
Skills of the same name *orchestrate real subagent reviews* (ADR-013). ADR-012 then bundled Skills,
subagents, hooks, and MCP into one plugin — putting both behaviors in the same install without
reconciling them. So "feature parity across all channels" is contradicted by the channels' own code: a
user gets a real review via the Skill and a hollow shell via the MCP tool of the same name. **Sharpened
verdict:** confirmed and load-bearing — the framework's central distribution claim doesn't hold.

### New finding the ADRs surface

**The maintainer overrode the framework's own unanimous advice — and that's the most honest thing in
the repo.** ADR-011 records that the 8-architect review *unanimously* recommended Path B (validate
demand via enhanced GitHub presence before a marketplace push). The maintainer chose Path A (immediate
marketplace) anyway, and documented the disagreement in full rather than rewriting the record. Two
readings, both true:

- *For the thesis (#1):* when a real, costly decision arrived, the eight personas lost to one human's
  judgment. The personas produced a recommendation; they did not produce the decision. That is
  evidence the value is the *lens*, not the *vote* — a committee of one model's personas shouldn't be
  mistaken for independent stakeholders with authority.
- *For the framework's credibility:* preserving a recorded loss for your own process is exactly the
  discipline ADRs exist to enforce. The framework passed its hardest test — being used against its
  author's preference and surviving the disagreement in writing. That is genuinely to its credit.

### Net effect on the thesis

The thesis holds, slightly chastened. "Methodology wearing a framework's clothes" is still the best
description — but the framework parts are more deliberate than a first pass suggests (the ADRs show
real engineering judgment, self-critique via the Pragmatic Enforcer, and honest record-keeping). The
strongest evidence for the thesis is no longer "the structure looks over-built"; it is concrete and
narrower: **a written single-version commitment broken four ways, and a written feature-parity claim
the channels' own behavior contradicts.** Those two are the framework failing its own recorded
standards — which is a sharper, more actionable indictment than "too many surfaces."

## Where first principles point

Not a plan — a direction, to be argued before acting:

1. **Name what it is.** If it's a methodology, lead with that: principles + lenses + checklists as the
   product, code as the convenience layer. This dissolves most of the tension below it.
2. **Collapse to one surface.** Skills + subagents + hooks via the plugin is the real product.
   Everything an operation needs should have exactly one implementation.
3. **Separate the lab from the product.** The framework's own ADRs, reviews, and comparisons are its
   development history — valuable, but not what a user installs into their project. Split "framework
   self-governance" from "what gets scaffolded into a target repo."
4. ~~**Fix the version commitment first.**~~ ✅ **Done.** Unified all 8 framework/MCP version strings to
   1.5.4 and added a `version-check` command + CI-enforced consistency test (`tools/lib/version-consistency.js`,
   `tools/test/version-consistency.test.js`) — the per-file guard the ADR-011 pipeline was meant to provide.
5. **Reconcile MCP and Skills, or stop claiming parity.** Either make the MCP review tools orchestrate
   real analysis (match the Skills), or drop the "identical features across all channels" claim and
   document MCP as the template/programmatic surface it actually is. The current state — same names,
   different behavior, in one plugin — is the coherence gap most likely to burn a user.
6. **(Minor) Soften the instruction-count gate to advisory.** The limit is sound; *failing a build* on
   a regex proxy is firmer than the proxy earns. Warn, don't block.

---

## One question above the rest

Strip the framework to its irreducible core and you have: *a curated set of architectural lenses and
senior-thinking checklists, applied to a target by an LLM running in independent contexts, producing
durable decision records.* Everything else — MCP, cross-platform, instruction counting, protection
hooks, four versions — is scaffolding around that core.

**Is the scaffolding holding the core up, or holding it down?**
