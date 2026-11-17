# Plugin evals

Behavioral tests for the Claude Code plugin path, run with
[`claude plugin eval`](https://code.claude.com/docs/en/plugin-evals). Each case is a
prompt a user might type plus graders over what Claude did. The runner also runs every
case **without** the plugin and reports the delta, so the suite answers the framework's
own question with a number: how much does the plugin change what Claude does?

| Case | Exercises | Scored by |
| --- | --- | --- |
| `setup-fixture` | `/setup-architect` on a scaffolded Node project | `.architecture/members.yml` + `config.yml` created |
| `create-adr` | `/create-adr` on a scaffolded `.architecture/` | an `ADR-NNN-*.md` written with `## Status` … `## Consequences` |
| `specialist-dispatch` | natural request for a security review | `specialist-review` fires, `security-specialist` subagent dispatched, `architecture-review` does **not** fire |
| `status-drift` | natural request for architecture status on a stale install | `architecture-status` fires; judge checks the report names the installed version and the ADR count |
| `adr-context` | a plain edit to a file an ADR governs (prompt never mentions ADRs) | new code keeps integer cents per ADR-001; `read-governing-adr` shows the hook routed the agent to the ADR |

`setup-architect` and `create-adr` carry `disable-model-invocation: true`, so their
prompts use the slash form a user types. They are graded on the files produced, not on a
`Skill` tool call, because a user-invoked skill is injected into the turn rather than
called as a tool. The two auto-invocable cases are graded on both the outcome and the
route Claude took.

## Run it

Manually, from the repo root (the suite grants `Write`, `Edit` and `Bash`, so the run
needs a sandbox backend: macOS has one, Linux needs `bubblewrap` + `socat`):

```bash
claude plugin eval . --trust-plugin --scaffold --allow-tools Write Edit Bash \
  --ablation with-without --threshold 0.8 --max-cost-usd 3 --no-publish
```

In CI it runs as the `plugin-eval` job of `claude-code-tests.yml`, `workflow_dispatch`
only and gated on `ANTHROPIC_API_KEY`, exactly as the old `claude-smoke` job was. It is a
release-checklist step (see `AGENTS.md`), not a merge gate, until it has been stable
across two releases.

Results land in `evals/results/` (gitignored). The first run is the baseline; the number
to watch is the `Δ` on `specialist-dispatch`. If it is near zero, the persona layer is not
changing Claude's answer and that is a finding, not a flake.

`adr-context` measures the PreToolUse hook, not a skill. Its ADR sets a rule a model
wouldn't apply by default (round once to whole cents), so the delta is about the code
written, not whether the agent can quote an ADR. The hook's `additionalContext` is not in
the trace graders see, so the indicator is the `Read` of the ADR file instead. First run
(2026-11-17, 3 runs per arm): with 1.00, without 0.00. In at least one with-arm run the
agent wrote a float version first, got the hook context on that edit, then read the ADR
and fixed it, so the hook works as a correction, not a pre-read.
