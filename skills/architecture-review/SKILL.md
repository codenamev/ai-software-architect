---
name: architecture-review
description: Conducts a comprehensive multi-perspective architecture review using ALL architecture team members. Use when the user requests "Start architecture review", "Full architecture review", "Review architecture for version X.Y.Z", "Conduct comprehensive review", or when they want assessment from multiple perspectives. Do NOT use for single-specialist reviews (use specialist-review instead) or for status checks (use architecture-status instead).
allowed-tools: Read,Write,Glob,Grep,Bash(git:*),Agent
---

# Architecture Review (orchestrator)

Comprehensive multi-perspective architecture review. This skill is an **orchestrator** — it dispatches one subagent invocation per active team member in parallel, then aggregates the returned reviews into a consolidated document. The deep-perspective work happens in the subagents (`agents/<id>.md`), not in this skill's main thread.

See [ADR-013](../../.architecture/decisions/adrs/ADR-013-skill-orchestrator-subagent-delegation.md) for the rationale.

## Process

### 1. Determine scope

Identify the review target from the user's request:
- **Version** — "version 2.0.0" → filename `2-0-0.md`
- **Feature** — "authentication feature" → filename `feature-authentication.md`
- **Component** — "payments module" → filename `component-payments-module.md`

Apply input sanitization from [`../_patterns.md`](../_patterns.md). If the scope is ambiguous, ask one clarifying question and stop.

### 2. Load team and config

Read `.architecture/config.yml` and `.architecture/members.yml`:

- `config.yml.pragmatic_mode.enabled` decides whether to include the `pragmatic_enforcer` subagent.
- `members.yml.members[]` is the list of subagents to dispatch.

Each member's `id` (e.g., `security_specialist`) maps to `agents/<kebab-id>.md` (e.g., `agents/security-specialist.md`). The drift check in CI guarantees these files exist and are in sync.

**Active set**: every member in `members.yml`, **excluding** `pragmatic_enforcer` if `config.yml.pragmatic_mode.enabled == false`.

### 3. Optional pre-analysis (orchestrator-side)

For broad reviews, an initial scan helps the orchestrator give every subagent a shared starting context. Use `Glob`, `Grep`, and `Bash(git:*)` (e.g., `git log --oneline -20`, `git diff main...HEAD --stat`) to assemble a short brief: target description, recent activity, key files. Keep this brief under ~500 tokens — it's a shared header, not a review.

If the review target is narrow (a single feature or ADR), this step can be skipped.

### 4. Dispatch subagents in parallel

Issue **one Agent call per active member, all in the same response** (parallel dispatch is the documented best practice for independent work):

```
Agent({
  subagent_type: "<kebab-id>",
  description: "<Title> review of <target>",
  prompt: <see template below>
})
```

**Prompt template** (used for every subagent — vary only the `<target>` and the optional shared brief):

```
Conduct a focused review of: <target>.

<optional shared brief from step 3>

Apply your perspective (your subagent file lists your specialty,
disciplines, skillsets, and domains). Stay within your specialty —
other team members are reviewing concurrently and will cover their
own areas.

Return a markdown review with:
- Perspective statement (1-2 sentences from your unique vantage)
- Key observations (3-5)
- Strengths within your domain (3-5)
- Concerns, each with severity (critical / high / medium / low),
  confidence (0.0-1.0), location (file:line where applicable),
  why-it-matters, concrete fix. Confidence is your own estimate that
  the concern is real: 0.9+ means you opened the code and confirmed
  it; 0.5 or below means you are inferring from names, patterns, or
  files you did not read. Never omit it and never round it up.
- Recommendations, ordered: immediate / short-term / long-term, with
  rough effort estimates (S/M/L)
- Risks if unaddressed

Read code, configs, and ADRs as needed via your scoped tools. Cite
exact file paths and line numbers. Do not range outside your
specialty.
```

For `pragmatic_enforcer` (when included), append: `Apply the Pragmatic Enforcer Analysis structure from .architecture/templates/adr-template.md (Necessity, Complexity, Ratio, Recommendation).`

### 5. Aggregate

When all subagent calls return, first normalize and filter the raw returns (Claude Code 2.1.277+ wraps each return under a "subagent output" header; strip that framing before parsing):

- **Dedup by location.** Concerns from different members that point at the same `file:line` (or the same file when no line is given) and describe the same problem merge into one finding that lists every member who raised it, keeps the highest severity, and takes the highest confidence. Different problems at the same location stay separate.
- **Low-confidence appendix.** A concern with confidence below 0.7 that only one member raised goes to the "Low-confidence findings" appendix of the review, not into the sections below. A concern two or more members raised stays in whatever its confidence: independent agreement is evidence. Nothing is deleted; each member's verbatim review (5.4) still carries every concern it returned.

Steps 1-3 run on the filtered set. A merged finding counts once in the cross-cut analysis, with the number of members who raised it noted. That number is the signal, not eight copies of the same line.

1. **Cross-cut analysis** — identify themes that appear in 3+ subagent reviews (these are the high-leverage findings).
2. **Conflict resolution** — when two subagents disagree (e.g., security wants strict validation, performance wants minimal overhead), surface the disagreement explicitly under "Trade-offs" rather than picking a winner. Naming the trade-off is the value.
3. **Prioritization** — bucket every concern into Critical (0-2 weeks) / Important (2-8 weeks) / Nice-to-Have (2-6 months) based on the subagents' severity ratings and the cross-cut analysis.
4. **Verbatim per-perspective sections** — preserve each subagent's full review under a per-member section. This is the source data; aggregation summarizes but does not replace it.

### 6. Write the consolidated review

Use [the review template](assets/review-template.md). Key sections:

- Executive summary (3-5 sentences, overall assessment + top concerns)
- Individual member reviews (verbatim from step 5.4)
- Cross-cutting themes (from step 5.1)
- Trade-offs and disagreements (from step 5.2)
- Prioritized recommendations (from step 5.3)
- Risks if unaddressed (highest-severity items)
- Success metrics and follow-up plan

Save to `.architecture/reviews/<filename>` (filename from step 1).

If pragmatic mode is enabled, ensure the `pragmatic_enforcer` review's Necessity / Complexity / Ratio analysis is surfaced in the executive summary, not buried in the member section. See [`references/pragmatic-integration.md`](references/pragmatic-integration.md).

### 7. Report to the user

```
Architecture Review Complete: <target>

Location: .architecture/reviews/<filename>
Overall Assessment: <Strong | Adequate | Needs Improvement>

Top 3 priorities:
1. <Critical priority>
2. <Critical priority>
3. <Important priority>

Immediate actions:
- <Highest-severity concrete fix>
- <Next>

Cross-cutting themes:
- <Theme that appeared in 3+ specialist reviews>

Next steps:
- Review with team
- `create-adr` for the priorities that need a decision recorded
- `specialist-review` to deep-dive any concern that needs more work
```

## Why this skill is small

The previous version (~130 lines) inlined the review process for each persona. With subagents, persona and per-perspective review structure live in `agents/<id>.md` (generated from `members.yml`). This skill's job is the orchestration layer: scope, dispatch, aggregate, write, report.

**One source of truth per concept** — the framework principle holds. Specialist behavior lives in the subagent files, not duplicated here.

## Related skills

**Before**: `architecture-status` (what's already documented), `list-members` (who is on the team)
**During**: `specialist-review` (deep-dive any single subagent's findings)
**After**: `create-adr` (record decisions arising from priorities), `architecture-recalibration` (translate findings into a plan)

## References

- [ADR-013](../../.architecture/decisions/adrs/ADR-013-skill-orchestrator-subagent-delegation.md) — orchestrator pattern rationale
- [Review process](references/review-process.md) — process guidance the orchestrator follows
- [Pragmatic integration](references/pragmatic-integration.md) — how pragmatic mode shapes the review
- [Review template](assets/review-template.md) — consolidated document structure
- [Common patterns](../_patterns.md) — input sanitization
