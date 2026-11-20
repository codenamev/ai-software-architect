---
name: find-adrs
description: Finds the existing ADRs that govern a question or a file, so recorded decisions are read before code changes. Use when the user asks "Which ADRs cover this?", "Is there a decision about [topic]?", "What decisions apply to [file]?", "Did we already decide [X]?", or before changing code in an area that may carry a recorded decision. Do NOT use for counts or documentation health (use architecture-status), writing a new ADR (use create-adr), or reviews (use architecture-review or specialist-review).
allowed-tools: Read,Bash(node:*),Bash(find:*)
---

# Find Relevant ADRs

Ranks the project's ADRs against a question and/or a file path. Tier-1 parity with the MCP `find_relevant_adrs` tool ([ADR-015](../../.architecture/decisions/adrs/ADR-015-mcp-skills-parity-reconciliation.md)): both call `tools/lib/adr-index.js`, so the same inputs give the same ranking.

## Process

### 1. Check Framework Setup
If `.architecture/decisions/adrs/` doesn't exist, say so and suggest "Setup ai-software-architect". Stop.

### 2. Locate the CLI
```bash
TOOLS_CLI=""
if [ -n "${CLAUDE_PLUGIN_ROOT:-}" ] && [ -f "$CLAUDE_PLUGIN_ROOT/tools/cli.js" ]; then
  TOOLS_CLI="$CLAUDE_PLUGIN_ROOT/tools/cli.js"
else
  TOOLS_CLI=$(find ~/.claude/plugins -type f -name cli.js -path '*ai-software-architect/tools/*' 2>/dev/null | head -1)
fi
```

### 3. Run the Search
Pass the user's question as `--query` and, when they named a file or you are about to edit one, its project-relative path as `--file`:

```bash
node "$TOOLS_CLI" find-adrs --project . --query "<question>" --file "<path>" --json
```

At least one of `--query` or `--file` is required. `--limit` (1-20, default 5) caps the results.

Matching is plain, with no embeddings: keywords against ADR titles and bodies (rarer terms weigh more, title hits weigh triple), plus optional `affects:` globs in ADR frontmatter matched against `--file`.

**No CLI found** (manual install without the plugin): fall back to reading. List `.architecture/decisions/adrs/`, read titles and statuses, and pick the ADRs whose title or body covers the question. Say in the report that the ranking is by hand.

### 4. Report
For each result, in rank order:
- `ADR-XXX: <title>`: status, and why it matched (`matched`)
- If `current` is `false`: say it is superseded and name `supersededBy`. Read the successor, and never present the superseded ADR as the decision in force.

Then read the top one or two ADRs in full before answering the user's question or editing the file. The ranking points; the ADR text decides.

If nothing matched, relay the `note`: no recorded decision covers this, so a new choice may warrant an ADR ("Create ADR for [topic]").

## Related Skills
- "Create ADR for [topic]" - Record a decision when none covers the change
- "What's our architecture status?" - Counts and documentation health
- "Ask [specialist] to review [ADR]" - Expert read on a matched decision
