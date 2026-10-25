# REVIEW.md

What a bad merge looks like in this repo. A reviewer (human, review panel, or an agent on a tick) reads this before the diff. It is a prior, not a checklist: it says where this codebase has actually broken so the review spends its attention there.

## What failure looks like here

- **Validator rule drift.** The ADR/skill validator starts accepting or rejecting a shape it didn't before, with no test that pins the old behaviour. The no-frontmatter rule on ADRs is the live example.
- **CI pins that aren't the PR's stated purpose.** A Node or Ruby pin changes inside an unrelated PR (see the plugin-eval job pin).
- **ADR numbering collisions or renumbering.** Two ADRs claim one number, or an existing ADR is renumbered and every link to it goes stale.
- **Writes before the source is resolved.** Setup or MCP code touches the filesystem before it knows which framework source it is installing from (#85 class).
- **Host-usage docs that describe a command the code no longer has.** The `USAGE-WITH-*.md` files drift independently; a change to one flag should land in all of them or in none.

## Evidence rule

Every finding cites `path:line` and names the input, command, or PR state that triggers it. No file and line, no finding. A finding that cannot be checked from a phone is a comment, not a finding.

## Nit cap

Three nits per review. Past three, pick the three that matter and drop the rest. Style is the linter's job.

## Skip paths

Ignore these unless the PR is about them:

- `CHANGELOG.md` (an Unreleased-entry collision is noise, not a review finding)
- `docs/adr/*.md` bodies (frontmatter and numbering still count)
- `*.lock`
- `evals/**/fixtures/**`
