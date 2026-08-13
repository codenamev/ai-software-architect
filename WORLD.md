# WORLD.md — project charter

This file sets direction for ai-software-architect: what it exists to do, what it
will not become, and how proposed work gets judged. The maintainer (codenamev)
owns it. Minerva (minerva-sky), an autonomous agent that helps maintain this
project, reads this document before proposing anything and stays inside its
fences. If a proposal conflicts with this file, the proposal is wrong.

Status: PROPOSED. Drafted 2026-08-13, awaiting maintainer approval.

## Purpose

A markdown framework for rigorous software architecture practice: decision
records, multi-perspective reviews, recalibration into concrete plans, and
progress tracking, with first-class AI assistant integration. The value is the
practice, not the tooling. A team with no AI assistant should still get working
ADR templates and a usable review process out of the box.

## Direction

- The Claude Code plugin is the primary distribution channel. It ships skills,
  MCP server, and subagents as one unit, and it is the recommended install for
  a reason: least setup, automatic updates. Effort follows users, and users are
  arriving through the plugin.
- The Claude Code extension surface (plugins, skills, hooks, MCP) moves fast.
  Tracking it is maintenance, not a feature. Breakage in any documented install
  path is the highest-priority class of bug.
- Reviewer personas and the multi-perspective review are the differentiator.
  Deepen them before widening anything else.
- Other assistants (Codex, Cursor) are supported best-effort. Claude Code is
  first-class.

## Constraints

- Markdown first. The framework must work as plain files in a repo with zero
  runtime dependencies. Integrations layer on top; they never become required.
- Every documented install path gets tested before release. The existing
  claude-code and codex test workflows gate merges.
- Backwards compatibility for existing `.architecture/` directories. Users'
  ADR history is their institutional memory; migrations must be additive.

## Anti-goals

- Not a code generator. It structures judgment; it does not replace it.
- Not project management software. No sprints, no boards, no assignees.
- Not a SaaS. No accounts, no server, no telemetry.
- No chasing every new AI tool's config format. A new integration must bring
  evidence of demand, not novelty.

## How work gets proposed

Improvements arrive as GitHub issues, labeled by origin and state:

- Origin: `loop:quality`, `loop:security`, `loop:deps`, `loop:research`,
  `loop:self` (agent-originated), or unlabeled (human-originated).
- State: `status:analyzed`, `status:deferred`, `status:wont-do`,
  `status:blocked`. A closed issue with `status:wont-do` records the reason in
  its final comment and is permanent institutional memory. Proposals must check
  closed and deferred issues before re-raising an idea.

## Review policy

Changes are classed by risk (external visibility times reversibility), and each
class has an autonomy level that can rise as the agent's track record earns it:

- L0: propose in an issue only.
- L1: open a PR; the maintainer merges.
- L2: open a PR; it may merge after a 72-hour quiet period with green CI.
- L3: merge on green CI, reported in a digest.

Every class starts at L0 or L1. Promotions happen only on the maintainer's
explicit approval, backed by the acceptance record. Any revert demotes the
class immediately. Releases and version tags are the maintainer's alone.

## Amending this document

By pull request with maintainer approval, nothing else. The agent may propose
amendments; it may never merge them.
