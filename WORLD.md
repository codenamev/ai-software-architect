# WORLD.md: ai-software-architect, answered six ways

This file sets direction for ai-software-architect: what it exists to do, what
it will not become, and how proposed work gets judged. The maintainer
(codenamev) owns it. Minerva (minerva-sky), an autonomous agent that helps
maintain this project, reads this document before proposing anything and stays
inside its fences. If a proposal conflicts with this file, the proposal is
wrong.

Status: PROPOSED. Drafted 2026-08-13 as a seven-section charter. Restructured
2026-09-20 under the six headings every repo in the fleet now shares, so a loop
session or a portfolio pass finds the same answer in the same place in every
repo. Awaiting maintainer approval.

## VISION (where we hope this goes)

<!-- VAL: edit. Drafted from the old Purpose and Direction sections; the charter said what the framework is and which way it leans, never where it ends up. -->

A team opens a repo and finds its architecture already arguing with itself:
decisions recorded with their reasons, reviews that disagree from named
perspectives, a plan that says what happens next and why. The AI assistant is
in the room, but the practice would survive its absence. Not the tool that
writes your architecture. The one that makes you defend it.

## MISSION (what we're here to do)

A markdown framework for rigorous software architecture practice: decision
records, multi-perspective reviews, recalibration into concrete plans, and
progress tracking, with first-class AI assistant integration. The value is the
practice, not the tooling. A team with no AI assistant should still get working
ADR templates and a usable review process out of the box.

## CONSTITUTION (what rules we must obey)

The fleet's shared rules live in one place and this file links to them rather
than pasting: the [operator's constitution](https://github.com/minerva-sky/workspace/blob/master/WORLD.md#constitution-what-rules-we-must-obey).
That covers the autonomy ladder (L0 propose in an issue, L1 open a PR the
maintainer merges, L2 merge after a quiet period on green CI, L3 merge on green
CI and report in a digest), how a class gets promoted (maintainer approval on
the acceptance record) and demoted (any revert, immediately), and the rule that
releases and version tags are the maintainer's alone.

Local additions for ai-software-architect:

- Markdown first. The framework must work as plain files in a repo with zero
  runtime dependencies. Integrations layer on top; they never become required.
- Every documented install path gets tested before release. The existing
  claude-code and codex test workflows gate merges.
- Backwards compatibility for existing `.architecture/` directories. Users'
  ADR history is their institutional memory; migrations must be additive.
- The npm package under `mcp/` is published by the maintainer. Bumping its
  version is a release decision, not a chore.

Anti-goals, which are constraints wearing a different hat:

- Not a code generator. It structures judgment; it does not replace it.
- Not project management software. No sprints, no boards, no assignees.
- Not a SaaS. No accounts, no server, no telemetry.
- No chasing every new AI tool's config format. A new integration must bring
  evidence of demand, not novelty.

## ROADMAP (what next)

The old Direction section gave bearings. This is the same content as an order.

1. Keep every documented install path working. The Claude Code plugin is the
   primary distribution channel: it ships skills, MCP server, and subagents as
   one unit, with the least setup and automatic updates. Effort follows users,
   and users are arriving through the plugin. Breakage in any documented
   install path is the highest-priority class of bug, which is why this is
   first and not a footnote.
2. Deepen the reviewer personas and the multi-perspective review. They are the
   differentiator. Deepen them before widening anything else. This is where the
   open agent work sits today: behavioral fields on personas, a real challenge
   round, findings that carry confidence and record their dispositions.
3. Track the Claude Code extension surface (plugins, skills, hooks, MCP). It
   moves fast. Tracking it is maintenance, not a feature, so it runs alongside
   the first two rather than competing with them.
4. Other assistants (Codex, Cursor) are supported best-effort. Claude Code is
   first-class. New integrations wait for demand, per the anti-goals.

Standing, not sequenced: the CHANGELOG carries unreleased work. Cutting a
release is the maintainer's call and nothing on this list assumes one.

## AGENTS (how agents work here)

Improvements arrive as GitHub issues, labeled by origin and state:

- Origin: `loop:quality`, `loop:security`, `loop:deps`, `loop:research`,
  `loop:self` (agent-originated), or unlabeled (human-originated).
- State: `status:analyzed`, `status:deferred`, `status:wont-do`,
  `status:blocked`. A closed issue with `status:wont-do` records the reason in
  its final comment and is permanent institutional memory. Proposals must check
  closed and deferred issues before re-raising an idea.

These labels exist in the repo and are in use. Each change class has an
autonomy level per the constitution above. Every class starts at L0 or L1, and
the current level per class is recorded on the operator's side, not here.

## CHARTER (why this exists, what territory, what freedoms)

**Why:** because architecture decisions made in chat vanish, and reviews from
one perspective miss what a second one would have caught. Writing both down in
a form the repo keeps is the whole point.

**Territory:** <!-- VAL: edit. The old charter drew this border only by negation (the anti-goals); this states it positively. -->
ai-software-architect owns the `.architecture/` layout, the ADR and review
templates, the reviewer personas in `members.yml`, the MCP server under
`mcp/`, and the Claude Code plugin, skills, hooks, and subagents that deliver
them. It does not own hosting, accounts, project tracking, or any assistant's
config format beyond the ones it already documents.

**Freedoms:** the agent may open issues on anything in this territory, open
PRs at the class's autonomy level, and propose amendments to this file.

**Constraints:** the agent never merges amendments to this file, never cuts a
release, never bumps the published package version, and never adds an
integration without evidence of demand.

## Amending this document

By pull request with maintainer approval, nothing else. The agent may propose
amendments; it may never merge them.
