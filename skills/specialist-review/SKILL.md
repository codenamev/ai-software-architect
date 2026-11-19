---
name: specialist-review
description: Conducts a focused review from ONE specific specialist's perspective (e.g., Security Specialist, Performance Expert). Use when the user requests "Ask [specialist role] to review [target]", "Get [specialist]'s opinion on [topic]", "Have [role] review [code/component]", or when they want deep expertise in ONE specific domain. Do NOT use for comprehensive multi-perspective reviews (use architecture-review instead) or for listing available specialists (use list-members instead).
allowed-tools: Read,Write,Glob,Grep,Agent
---

# Specialist Review (orchestrator)

Single-specialist deep-dive review. This skill is an **orchestrator** — it identifies the right specialist and delegates the review to that specialist's subagent (`agents/<id>.md`). The deep-perspective work happens in the subagent's isolated context, not in this skill's main thread.

See [ADR-013](../../.architecture/decisions/adrs/ADR-013-skill-orchestrator-subagent-delegation.md) for the rationale.

## Process

### 1. Parse the request

Extract from the user's request:
- **Specialist role** (e.g., "Security Specialist", "Performance Expert")
- **Target** (e.g., "API authentication", "the payments module", "ADR-007")

If either is unclear, ask one focused clarifying question and stop.

### 2. Resolve the specialist

Read `.architecture/members.yml` and find the member whose `name` or `title` matches the requested role (case-insensitive, allow common abbreviations like "security" → "Security Specialist").

The member's `id` (e.g., `security_specialist`) maps to a subagent at `<kebab-id>.md` (e.g., `security-specialist.md`): in `.claude/agents/` of a project using the plugin, or the plugin's own `agents/`. The drift check in CI (`generate-subagents --check`) guarantees that file exists if the member exists.

**If the requested specialist is not in `members.yml`:**

The previous version of this skill auto-created new members on the fly. That is no longer supported because `.architecture/members.yml` is now protected by a PreToolUse hook (see [ADR-013 Pragmatic Analysis](../../.architecture/decisions/adrs/ADR-013-skill-orchestrator-subagent-delegation.md#pragmatic-enforcer-analysis)). Instead:

1. Tell the user: "<Role> is not in your architecture team. To add them: edit `.architecture/members.yml` (the PreToolUse hook will refuse the write — set `CLAUDE_ALLOW_PROTECTED=1` to override), add a member entry following the existing schema, then run `node tools/cli.js generate-subagents`."
2. Stop. Do not attempt the review until the member exists.

### 3. Delegate to the subagent

Dispatch a single `Agent` call:

```
Agent({
  subagent_type: "<kebab-id>",
  description: "<Role> review of <target>",
  prompt: <see template below>
})
```

**Prompt template** for the subagent call:

```
You are conducting a focused review of: <target>.

Apply your perspective (see your subagent file for your specialty,
disciplines, and domains). Do not range outside your specialty —
other specialists will cover their own areas.

Produce a review with these sections:
- Executive summary (2-3 sentences, overall assessment)
- Strengths (what is working well within your domain)
- Concerns (with severity: critical / high / medium / low)
  - For each concern: location (file:line), why it matters, concrete fix
- Recommendations (ordered: immediate / short-term / long-term)
- Risks if unaddressed
- Success metrics (how to verify the recommendations land)

If the target requires you to read code, configs, or ADRs, do so via
your Read/Grep/Glob tools. Reference exact files and line numbers.

Return the review as markdown. Do not write to disk; the orchestrator
will save it.
```

### 4. (Optional) Save the review

If the user asked to persist the review (e.g., "save to reviews/" or "create a review document"):

1. Filename format: `<specialist-id>-<target-slug>.md` (kebab-case, max 100 chars total). Example: `security-specialist-api-authentication.md`.
2. Apply input sanitization from [`../_patterns.md`](../_patterns.md) to the target slug.
3. Wrap the subagent's returned markdown in the [review template](assets/specialist-review-template.md) header (reviewer name, date, target).
4. Write to `.architecture/reviews/<filename>`.

If the user did not ask to persist, return the review inline.

### 5. Report

Concise summary back to the user:

```
<Title> Review Complete: <target>

Reviewer: <Name>
Location: <path or "inline">
Assessment: <executive summary first sentence>

Key concerns:
1. <highest-severity concern>
2. <next>
3. <next>

Counts: <critical>/<high>/<medium>/<low>

Suggested next:
- <immediate action from recommendations>
- <follow-up specialist if cross-cutting concern surfaced>
```

## Why this skill is small

The previous version (~200 lines) inlined detailed review-process instructions because Claude was expected to *be* the specialist mid-conversation. With subagents, the specialist's persona, perspective, and tool scoping live in `agents/<id>.md` (generated from `members.yml`). This skill's job is just to route the request and assemble the response.

Specialist-specific guidance (how a Security Specialist thinks vs a Performance Specialist) lives in the subagent files themselves, not duplicated here. The framework principle: one source of truth per concept.

## Related skills

**Before**:
- `list-members` — see who is available
- `architecture-status` — check what's already been reviewed

**After**:
- `create-adr` — document decisions arising from findings
- `architecture-review` — fold this finding into a multi-perspective review

**Workflow examples**:
1. Security review surfaces auth issue → `create-adr` for the fix → re-review
2. Performance review identifies bottleneck → ADR for caching strategy → implementation
3. Specialist review on one slice → comprehensive `architecture-review` for the full version cut

## References

- [ADR-013](../../.architecture/decisions/adrs/ADR-013-skill-orchestrator-subagent-delegation.md) — orchestrator pattern rationale
- [Specialist perspectives](references/specialist-perspectives.md) — high-level reference (subagents are the source of truth for runtime behavior)
- [Review template](assets/specialist-review-template.md) — used when the review is persisted
- [Common patterns](../_patterns.md) — input sanitization
