---
name: setup-architect
description: Sets up and installs the AI Software Architect framework in a NEW project for the FIRST time. Use when the user requests "Setup .architecture", "Setup ai-software-architect", "Initialize architecture framework", "Install software architect", or similar setup/installation phrases. Do NOT use for checking status (use architecture-status), creating documents (use create-adr or reviews), or when framework is already set up.
allowed-tools: Read,Write,Edit,Glob,Grep,Bash(git:*,npm:*,node:*,mkdir:*,cp:*,ls:*,test:*)
disable-model-invocation: true
---

# Setup AI Software Architect Framework

Sets up and customizes the AI Software Architect framework for a project.

## Overview

This skill performs a complete framework installation:
1. Locates the framework source (plugin install dir or legacy clone)
2. Analyzes the target project (languages, frameworks, structure, patterns)
3. Scaffolds `.architecture/` in the target project from framework templates
4. Customizes team members and principles for the detected tech stack
5. Performs an initial system analysis
6. Reports customizations and findings, with explicit next steps

**Detailed procedures**: [references/installation-procedures.md](references/installation-procedures.md)
**Customization guide**: [references/customization-guide.md](references/customization-guide.md)

## What happens when you run `Setup ai-software-architect`

The skill creates a `.architecture/` directory in your **target project** (not in this plugin's repo) and populates it with templates customized for your tech stack. After it finishes you'll have:

- `.architecture/decisions/adrs/` — empty, ready for `create-adr`
- `.architecture/reviews/initial-system-analysis.md` — your team's first pass at the codebase
- `.architecture/members.yml` — team customized for your detected stack
- `.architecture/principles.md` — principles tailored to your frameworks
- `.architecture/config.yml` — operational config (pragmatic mode, etc.)
- `.architecture/templates/` — ADR + review templates ready to use

The skill writes **only into your target project's `.architecture/`**. It does not modify code outside that directory.

## High-Level Workflow

### 1. Locate framework source

The framework templates can live in two places: inside the installed Claude Code plugin (canonical, 1.4.0+) or under a legacy `.architecture/.architecture/` clone in the target project. Discovery is deterministic — run the framework's own CLI:

```bash
# Locate the plugin install on disk first; tools/cli.js lives inside it.
TOOLS_CLI=""
if [ -n "${CLAUDE_PLUGIN_ROOT:-}" ] && [ -f "$CLAUDE_PLUGIN_ROOT/tools/cli.js" ]; then
  TOOLS_CLI="$CLAUDE_PLUGIN_ROOT/tools/cli.js"
else
  TOOLS_CLI=$(find ~/.claude/plugins -type f -name cli.js -path '*ai-software-architect/tools/*' 2>/dev/null | head -1)
fi

if [ -z "$TOOLS_CLI" ] && [ -f ".architecture/.architecture/tools/cli.js" ]; then
  # Legacy clone path: the cli ships in the cloned repo.
  TOOLS_CLI=".architecture/.architecture/tools/cli.js"
fi

if [ -z "$TOOLS_CLI" ]; then
  echo "Framework not found. Install the plugin or clone manually — see error message below."
  exit 1
fi

# Resolve the framework source via the canonical discovery logic.
FRAMEWORK_ROOT=$(node "$TOOLS_CLI" find-source)
```

Discovery order (encoded in `tools/lib/setup-source-discovery.js` and tested via `tools/test/setup-source-discovery.test.js`):

1. `${CLAUDE_PLUGIN_ROOT}` env var (if set and contains `.architecture/templates/adr-template.md`).
2. Recursive search of `~/.claude/plugins/` for any `ai-software-architect/` directory containing the sentinel.
3. `.architecture/.architecture/` in the target project (legacy clone path).

If `find-source` exits non-zero, surface its error message verbatim — it tells the user exactly which install option to take.

### 2. Analyze Project

Identify project characteristics:
- **Languages**: JavaScript/TypeScript, Python, Ruby, Java, Go, Rust
- **Frameworks**: React, Vue, Django, Rails, Spring, etc.
- **Infrastructure**: Testing setup, CI/CD, package managers
- **Structure**: Directory layout, architectural patterns

Use `Glob` and `Grep` to detect technologies, `Read` to examine configs.

### 3. Install Framework

Execute installation steps (see [references/installation-procedures.md](references/installation-procedures.md)):

```bash
# $FRAMEWORK_ROOT is from step 1.
cp -r "$FRAMEWORK_ROOT/.architecture/templates" .architecture/templates
cp "$FRAMEWORK_ROOT/.architecture/principles.md" .architecture/principles.md
cp "$FRAMEWORK_ROOT/.architecture/members.yml" .architecture/members.yml
cp "$FRAMEWORK_ROOT/.architecture/config.yml" .architecture/config.yml

mkdir -p .architecture/decisions/adrs
mkdir -p .architecture/reviews
mkdir -p .architecture/recalibration
mkdir -p .architecture/comparisons
mkdir -p .architecture/agent_docs
```

- Create directory structure (decisions/adrs, reviews, recalibration, etc.)
- Initialize `.architecture/config.yml` from the source location's templates
- Set up agent documentation (ADR-006 progressive disclosure)
- **Legacy clone path only:** remove `.architecture/.architecture/` and (with safeguards) the cloned `.git/` directory. **Plugin path:** no clone removal needed — the plugin's install dir stays where it is under `~/.claude/plugins/`.

**Critical (legacy clone path only):** Follow safety procedures when removing `.git/` directory. See [references/installation-procedures.md § Cleanup Procedures](references/installation-procedures.md#cleanup-procedures).

### 4. Customize Architecture Team

Add technology-specific members to `.architecture/members.yml`:
- **JavaScript/TypeScript**: JavaScript Expert, framework specialists (React/Vue/Angular)
- **Python**: Python Expert, framework specialists (Django/Flask/FastAPI)
- **Ruby**: Ruby Expert, Rails Architect
- **Java**: Java Expert, Spring Boot Specialist
- **Go**: Go Expert, Microservices Architect
- **Rust**: Rust Expert, Systems Programmer

Use template from [assets/member-template.yml](assets/member-template.yml).

**Keep all canonical core members** — never drop one. The framework's `.architecture/members.yml` defines 8: Systems Architect, Domain Expert, Security Specialist, Maintainability Expert, Performance Specialist, Implementation Strategist, AI Engineer, Pragmatic Enforcer. Append technology specialists as additional advisors.

**Customization details**: [references/customization-guide.md § Customize Team Members](references/customization-guide.md#customize-architecture-team-members)

### 5. Customize Architectural Principles

Add framework-specific principles to `.architecture/principles.md`:
- **React**: Component composition, hooks, unidirectional data flow
- **Rails**: Convention over configuration, DRY, RESTful design
- **Django**: Explicit over implicit, reusable apps, use built-ins

**Principle examples**: [references/customization-guide.md § Customize Principles](references/customization-guide.md#customize-architectural-principles)

### 6. Update CLAUDE.md Integration

If `CLAUDE.md` exists in project root, append framework usage section:
- Available commands
- Where to find documentation
- How to invoke skills

**Template**: [references/customization-guide.md § Update CLAUDE.md](references/customization-guide.md#update-claudemd-integration)

### 7. Cleanup

Remove framework development files:
- Framework documentation (README.md, USAGE*.md, INSTALL.md)
- Template `.git/` directory (with **critical safety checks**)

**⚠️  IMPORTANT**: Follow all safeguards in [references/installation-procedures.md § Cleanup](references/installation-procedures.md#cleanup-procedures).

### 8. Create Initial System Analysis

Generate comprehensive initial analysis document:
- Each member analyzes system from their perspective
- System overview (stack, structure, patterns)
- Strengths identified
- Concerns raised (with impact levels)
- Recommendations prioritized (Critical/Important/Nice-to-Have)
- Collaborative synthesis of findings

Save to `.architecture/reviews/initial-system-analysis.md`.

**Template**: [assets/initial-analysis-template.md](assets/initial-analysis-template.md)

### 9. Report to User

Provide a setup summary using the template below, then the success checklist so the user can verify the install end-to-end.

Provide setup summary:

```
AI Software Architect Framework Setup Complete

Customizations:
- Added [N] technology specialists: [list]
- Customized principles for: [frameworks]
- Configuration: Pragmatic mode [enabled/disabled]

Initial Analysis Highlights:
- Overall assessment: [assessment]
- Top strength: [strength]
- Top concern: [concern]
- Critical recommendation: [recommendation]

Location: .architecture/reviews/initial-system-analysis.md

Next Steps:
- Review initial analysis findings
- "List architecture members" to see customized team
- "Create ADR for [first decision]" to start documenting
- "What's our architecture status?" to verify setup
```

## Setup successful when...

A first-time user can verify the install by checking that **all of these are true**:

- [ ] `.architecture/decisions/adrs/` exists and is empty
- [ ] `.architecture/reviews/initial-system-analysis.md` exists and is non-empty
- [ ] `.architecture/members.yml` lists all eight canonical core members (per the framework's `.architecture/members.yml`) plus any technology specialists added in step 4
- [ ] `.architecture/principles.md` exists and includes any framework-specific principles added in step 5
- [ ] `.architecture/config.yml` exists (pragmatic mode flag visible)
- [ ] `.architecture/templates/` contains `adr-template.md` and `review-template.md`
- [ ] No leftover `.architecture/.architecture/` directory (legacy clone path only)
- [ ] Running `What's our architecture status?` returns a coherent summary
- [ ] Running `List architecture members` shows the customized team

If any of these fail, see [the recovery section](#recovery) below.

## Recovery

**If setup fails partway through** (e.g., framework files copied but customization didn't run):

1. Inspect `.architecture/` to see what landed.
2. If only a few files copied, the simplest recovery is `rm -rf .architecture/` and re-run `Setup ai-software-architect` (no project code is touched outside `.architecture/`).
3. If most files are in place but `members.yml` or `principles.md` weren't customized, you can re-run setup; the skill will detect the partial install and offer to complete the customization step rather than restart.
4. If the initial analysis didn't run, ask: `Generate initial system analysis at .architecture/reviews/initial-system-analysis.md` — the orchestrator will dispatch the team without redoing the file install.

**If setup ran but the team isn't right for your project**, you don't need to re-run setup. Edit `.architecture/members.yml` directly (set `CLAUDE_ALLOW_PROTECTED=1` to satisfy the PreToolUse hook) and run `node tools/cli.js generate-subagents` to refresh the corresponding `agents/<id>.md` files.

## Error Handling

**Framework source not found**:
```
I can't find the framework templates. Two installation options:

  Recommended (plugin):
    /plugin marketplace add codenamev/ai-software-architect
    /plugin install ai-software-architect@ai-software-architect

  Legacy (clone):
    git clone https://github.com/codenamev/ai-software-architect .architecture/.architecture

After installing, run "Setup ai-software-architect" again.
```

**Already set up**:
```
Framework appears to be already set up.

To verify: "What's our architecture status?"
To reconfigure: Manually edit .architecture/members.yml and .architecture/principles.md
```

**Unclear project structure**:
```
Could not clearly identify project type. Please describe:
- Primary programming language(s)
- Framework(s) used
- Project purpose

I'll customize the framework accordingly.
```

## Related Skills

**After Setup**:
- `list-members` - View customized team
- `architecture-status` - Verify setup completion
- `create-adr` - Document first decision

**Initial Work**:
- Review `initial-system-analysis.md` findings
- `specialist-review` - Deep-dive on specific concerns
- `create-adr` - Document existing key decisions

**Workflow Example**:
Setup → Review initial analysis → Create ADRs → Status check → Regular reviews

## Notes

- Customize based on **actual** project, not every possible option
- Be specific about **why** each customization was made
- Initial analysis should be thorough but focused on actionable findings
- Safety checks during cleanup are **non-negotiable**

## Documentation

- **Installation details**: [references/installation-procedures.md](references/installation-procedures.md)
- **Customization guide**: [references/customization-guide.md](references/customization-guide.md)
- **Initial analysis template**: [assets/initial-analysis-template.md](assets/initial-analysis-template.md)
- **Member template**: [assets/member-template.yml](assets/member-template.yml)
- **Common patterns**: [../_patterns.md](../_patterns.md)
