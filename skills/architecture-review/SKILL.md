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

Also read `.architecture/principles.md`. It is the project's recorded constitution, and every review is checked against it: step 4 hands it to each member, step 6.5 collects what they found. If the file is missing, write "no principles recorded" in the review's Principle Conflicts section and skip the gate. Never block a review on it.

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

**Prompt template** (used for every subagent — vary only the `<target>`, the optional shared brief, and the principles block):

```
Conduct a focused review of: <target>.

<optional shared brief from step 3>

Recorded principles (.architecture/principles.md, the "Core Principles"
section verbatim; drop the quotations above it):
<principles>

Apply your perspective (your subagent file lists your specialty,
disciplines, skillsets, and domains). Stay within your specialty —
other team members are reviewing concurrently and will cover their
own areas.

Return a markdown review with:
- Perspective statement (1-2 sentences from your unique vantage)
- Key observations (3-5)
- Strengths within your domain (3-5)
- Concerns with severity (critical / high / medium / low), each with
  location (file:line where applicable), why-it-matters, concrete fix
- Recommendations, ordered: immediate / short-term / long-term, with
  rough effort estimates (S/M/L)
- Risks if unaddressed
- Principle conflicts: every concern above that violates a recorded
  principle, restated as "<principle name>: <one line>". Every
  recommendation that would change or retire a recorded principle,
  labeled PRINCIPLE CHANGE with the principle named. Write "none"
  when there are none. Do not omit the section.

Read code, configs, and ADRs as needed via your scoped tools. Cite
exact file paths and line numbers. Do not range outside your
specialty.
```

For `pragmatic_enforcer` (when included), append: `Apply the Pragmatic Enforcer Analysis structure from .architecture/templates/adr-template.md (Necessity, Complexity, Ratio, Recommendation).`

### 5. Challenge round

The individual reviews are monologues: no member has seen another's findings. Before aggregating, run one adversarial pass over the findings that carry the most weight. This is the `collaborative_phase` from `members.yml`, made concrete.

1. **Select** every concern rated **critical** or **high** across all returned reviews. Medium and low findings skip this round.
2. **Assign a challenger** per finding: the active member best positioned to refute it, never its author. Use the members' `perspective` and `domains` fields — a security critical demanding mandatory validation goes to `performance_specialist`; an architectural rewrite goes to `pragmatic_enforcer` (when active) or `maintainability_expert`; a domain-model concern goes to `systems_architect`. When no member is an obvious counterweight, use `pragmatic_enforcer` if active, otherwise skip the finding and note it as unchallenged.
3. **Dispatch** one Agent call per finding, all in the same response:

```
Agent({
  subagent_type: "<challenger kebab-id>",
  description: "Challenge: <finding title>",
  prompt: <see template below>
})
```

**Challenge prompt template**:

```
Another reviewer (<author title>) rated this finding <critical|high>
in a review of: <target>.

<finding verbatim: issue, location, why-it-matters, recommended fix>

Your job is to attack it from your specialty, not to agree with it.
Check the cited location. Look for evidence that the finding is
overstated, already mitigated, out of scope for this target, or that
its fix costs more than the problem. Return exactly one of:

- NO OBJECTION — one sentence on why it holds.
- DOWNGRADE to <high|medium|low> — the specific evidence, with
  file:line, and what the author missed.
- REFUTE — the specific evidence that the finding is wrong.

Two hundred words maximum. Cite what you read.
```

4. **Record the outcome** on each finding and carry it into aggregation:
   - `NO OBJECTION` → severity unchanged, annotated *challenged by <member>, survived*.
   - `DOWNGRADE` → severity set to the challenger's level, rebuttal recorded verbatim under the finding.
   - `REFUTE` → finding moved out of the prioritized lists into the Challenges section with the rebuttal verbatim. The author's original text stays in their per-member section untouched.

The orchestrator does not adjudicate. A challenge either produces cited evidence or it does not; the response format forces that choice. Cost is one subagent call per critical/high finding, typically 3-6 per review.

### 6. Aggregate

When the challenge round returns, build the consolidated review from the post-challenge severities:

1. **Cross-cut analysis** — identify themes that appear in 3+ subagent reviews (these are the high-leverage findings).
2. **Conflict resolution** — when two subagents disagree on something the challenge round did not settle (e.g., security wants strict validation, performance wants minimal overhead), surface the disagreement explicitly under "Trade-offs" rather than picking a winner. Naming the trade-off is the value.
3. **Prioritization** — bucket every concern into Critical (0-2 weeks) / Important (2-8 weeks) / Nice-to-Have (2-6 months) based on the post-challenge severity ratings and the cross-cut analysis. Refuted findings are excluded here; they appear only under Challenges.
4. **Verbatim per-perspective sections** — preserve each subagent's full review under a per-member section. This is the source data; aggregation summarizes but does not replace it.
5. **Principle gate** — collect every member's Principle conflicts section into the review's Principle Conflicts table, one row per conflict, principle named. Two rules follow. A concern tied to a recorded principle is never bucketed below Important, whatever its severity rating: the principle already settled that it matters. A PRINCIPLE CHANGE recommendation never enters the prioritized lists at all; it goes under Proposed Principle Changes with a pointer to `create-adr`, because changing the constitution is a decision to record, not a finding to schedule. Findings refuted in step 5 drop out of the gate with everything else.

### 7. Write the consolidated review

Use [the review template](assets/review-template.md). Key sections:

- Executive summary (3-5 sentences, overall assessment + top concerns)
- Individual member reviews (verbatim from step 6.4)
- Challenges (from step 5: every critical/high finding with its challenger and outcome, rebuttals verbatim)
- Principle conflicts and proposed principle changes (from step 6.5)
- Cross-cutting themes (from step 6.1)
- Trade-offs and disagreements (from step 6.2)
- Prioritized recommendations (from step 6.3)
- Risks if unaddressed (highest-severity items)
- Success metrics and follow-up plan

Save to `.architecture/reviews/<filename>` (filename from step 1).

If pragmatic mode is enabled, ensure the `pragmatic_enforcer` review's Necessity / Complexity / Ratio analysis is surfaced in the executive summary, not buried in the member section. See [`references/pragmatic-integration.md`](references/pragmatic-integration.md).

### 8. Report to the user

```
Architecture Review Complete: <target>

Location: .architecture/reviews/<filename>
Overall Assessment: <Strong | Adequate | Needs Improvement>

Challenge round: <n> findings challenged, <s> survived, <d> downgraded, <r> refuted
Principle gate: <c> findings conflict with recorded principles, <p> principle changes proposed

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

The previous version (~130 lines) inlined the review process for each persona. With subagents, persona and per-perspective review structure live in `agents/<id>.md` (generated from `members.yml`). This skill's job is the orchestration layer: scope, dispatch, challenge, aggregate, write, report.

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
