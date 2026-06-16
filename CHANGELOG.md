# Changelog

All notable changes to the AI Software Architect framework will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.6.0] - 2026-06-16

### Removed (BREAKING)

#### Three Tier-2 MCP tools removed ([ADR-015](.architecture/decisions/adrs/ADR-015-mcp-skills-parity-reconciliation.md))
`start_architecture_review`, `specialist_review`, and `pragmatic_enforcer` are removed from the MCP server (~520 lines of `mcp/index.js`). These tools only ever emitted blank templates/frameworks for manual completion — an MCP server has no agent loop and cannot dispatch the host subagents that make a real review (ADR-013); they shared a name with the Skills that *do* run real reviews, which misled users. **Orchestrated reviews and pragmatic enforcement are now plugin/Skills-only** (`architecture-review`, `specialist-review`, and the `pragmatic-enforcer` subagent). The MCP server retains its deterministic Tier-1 tools (`setup_architecture`, `create_adr`, `list_architecture_members`, `get_architecture_status`, `configure_pragmatic_mode`, `get_implementation_guidance`). The same template structures remain available as static files in `.architecture/templates/`. The two removed allow-list entries were dropped from `.claude/settings.json`.

**Migration:** use the `architecture-review` / `specialist-review` skills (Claude Code plugin) for reviews. MCP-only clients can read `.architecture/templates/review.md` directly for the template.

### Changed

- **Two-tier capability model ([ADR-015](.architecture/decisions/adrs/ADR-015-mcp-skills-parity-reconciliation.md)).** Operations are classified Tier 1 (deterministic; all channels) or Tier 2 (LLM-orchestrated; plugin/Skills only). [ADR-011](.architecture/decisions/adrs/ADR-011-claude-marketplace-plugin-implementation.md)'s "identical core features across all channels" and "95%+ code sharing" claims are corrected by append-only amendment.

### Fixed

#### Framework version unified across all channels (ADR-011 single-version commitment)
ADR-011 committed to "a single version number shared across all channels," but the framework version had drifted four ways: plugin/marketplace `1.5.4`, MCP server (`mcp/package.json` + `mcp/index.js`) `1.3.0`, and `config.yml` / `CLAUDE.md` / `AGENTS.md` `1.2.0`. A user could not answer "what version am I running." All framework/MCP version strings are unified (now `1.6.0`).

- Left intentionally independent (distinct version concepts, not channels): `tools/package.json` (internal `architecture-tools` package), `config.yml` `architecture_version` (the target project's architecture version), and AGENTS.md "Documentation Version" (doc-structure version per ADR-006).

#### Setup fidelity ([ADR-016](.architecture/decisions/adrs/ADR-016-setup-fidelity-canonical-sources.md))
`setup_architecture` produced a divergent install. It now derives outputs from canonical sources instead of hardcoded logic:
- **Team:** preserves the copied canonical `members.yml` (all 8 architects with correct ids) instead of overwriting it with a hardcoded 4-member list that used `security_architect` and dropped `domain_expert`, `implementation_strategist`, `ai_engineer`, and `pragmatic_enforcer`. Fails closed if the copy is partial.
- **Subagents:** generates `agents/*.md` from the seeded roster, so the team is actually dispatchable (a fresh install previously had members but no subagents).
- **Principles:** writes the technology section to the canonical `.architecture/principles.md` and no longer creates the mislocated `.architecture/decisions/principles.md` (fixing a broken generated link).
- **Stack detection:** multi-valued frameworks (Rails is no longer masked by Express; Rails detected from Gemfile content).
- **Skill parity:** `setup-architect` SKILL.md now references the canonical 8-member roster (was listing 7).
- The `ArchitectureServer` class is now importable; added a roster-seeding lib + an end-to-end setup-fidelity test.

### Added

- **`version-check` governance command + recurrence guard.** `node tools/cli.js version-check` (and `npm run version-check`) verifies one framework version across all eight channel/doc sources and exits non-zero on drift. Backed by `tools/lib/version-consistency.js` and `tools/test/version-consistency.test.js`, whose repository test fails CI on any future drift — the per-file enforcement the ADR-011 release pipeline was meant to provide.
- **ADRs:** [ADR-015](.architecture/decisions/adrs/ADR-015-mcp-skills-parity-reconciliation.md) (MCP/Skills two-tier reconciliation, Accepted) and [ADR-016](.architecture/decisions/adrs/ADR-016-setup-fidelity-canonical-sources.md) (setup must derive team/stack from canonical sources, Proposed), plus the supporting architecture review and structural examination under `.architecture/reviews/`.

## [1.5.4] - 2026-05-04

### Fixed

#### Link Rot Cleanup (driven by validate-plugin CI)
The first live `validate-plugin` CI run surfaced 63 broken internal markdown links accumulated across ADRs, reviews, comparisons, and meta-docs. All 63 are now fixed:

- **Wrong-depth paths in ADRs.** ADR-001 used `../../../../README.md` (4 ups from `decisions/adrs/`); corrected to `../../../README.md` (3 ups). Standalone `INSTALL.md` reference removed (file was never created — see 1.5.1 cleanup notes).
- **Filename typos in ADR cross-references.** ADR-007 and ADR-008 referenced `ADR-006-progressive-disclosure-documentation.md`; the actual file is `ADR-006-progressive-disclosure-pattern.md`. ADR-003's filename was inverted in `reviews/claude-marketplace-plugin.md` (`adoption-agents-md-standard` → `agents-md-standard-adoption`).
- **Repo-root paths used as relative.** Many docs used `.architecture/foo` from inside `.architecture/...` (resolves to `.architecture/.architecture/foo`). Corrected to proper relative paths in ADR-010, ADR-011, `example-pragmatic-caching-layer.md`, `instruction-counting-methodology.md`, `recalibration_process.md`, `progressive-disclosure-categorization.md`.
- **`./../X` pattern in ADR-011.** Nine link targets used `./../X` (resolves to `decisions/X` not `<root>/X`). Corrected to `../../X` for cross-directory references and `./X` for sibling ADRs.
- **Stale `.claude/skills/` paths from 1.4.0 rename.** ADR-008 and `comparisons/claude-skills-enhancement-initiative-summary.md` referenced `.claude/skills/` for `ARCHITECTURE.md` and `_patterns.md`; updated to `skills/` with explanatory note about the relocation.
- **Quoted markdown link snippets in prose.** Three documents contained `[TROUBLESHOOTING.md](TROUBLESHOOTING.md)` as example text the validator couldn't distinguish from real markdown. Reframed as plain prose describing the link without the literal `[X](Y)` pattern.

### Changed

- **Link validator skips `.architecture/templates/`.** Templates contain placeholder links (`link-to-adr`, `link-to-review`) by design and structural paths intended for the install location, not the source repo. Validating against the source repo's filesystem was a category error. The skip is documented inline in `tools/cli.js`.

### Notes

After this cleanup, `node cli.js validate` reports **237 valid links, 0 broken**. The full validate-plugin CI job (tests + ADR validation + subagent drift + find-source + link validation + plugin layout) now passes end-to-end alongside `claude-smoke`.

## [1.5.3] - 2026-05-04

### Fixed

#### CI Repairs from First Live `claude-smoke` Run
- **`tools/` `npm test` works on bash CI runners.** The script was `node --test test/**/*.test.js` — that glob is expanded by zsh on macOS but passed literally on bash, breaking CI. Switched to `node --test` (Node 22+ auto-discovers `*.test.js` files in cwd recursively), making the script shell-agnostic.
- **`claude-smoke` job no longer asserts on disable-model-invocation skills.** The smoke test prompted Claude to "list every skill loaded from this plugin" and asserted all seven appeared. This was wrong: `setup-architect`, `create-adr`, and `pragmatic-guard` are marked `disable-model-invocation: true` in 1.5.0 — Claude deliberately excludes them from "list loaded skills" output (they're user-invoked only). SKILL.md presence for all seven is already verified by `validate-plugin`'s required-layout check; the smoke now asserts only on the four auto-invocable skills, with an inline comment explaining the partition.

### Notes

The first live `claude-smoke` run successfully loaded the plugin and surfaced the four auto-invocable skills, validating ADR-013's orchestrator pattern and ADR-014's plugin source discovery end-to-end. Both failures in the first run were CI infrastructure bugs surfaced **by** the live test, not framework regressions.

## [1.5.2] - 2026-05-03

### Fixed

#### Plugin-Aware Setup Source Discovery (ADR-014 Change A)
- **`setup-architect` now works correctly on plugin installs.** The skill previously instructed users to clone the framework into `.architecture/.architecture/` even when the plugin was already installed and the templates were on disk under `~/.claude/plugins/`. The skill now performs deterministic source discovery via the new `find-source` CLI subcommand, falling back through three sources in order: `${CLAUDE_PLUGIN_ROOT}` env var → `~/.claude/plugins/` recursive search → `.architecture/.architecture/` legacy clone path.

### Added

- **`node tools/cli.js find-source`** — discovers and prints the framework source location. Returns the resolved path on stdout (exit 0) or a dual-option error message (exit 1) directing the user to either `/plugin marketplace add codenamev/ai-software-architect` or the legacy `git clone` path. Supports `--json` for structured output.
- **`tools/lib/setup-source-discovery.js`** — deterministic discovery logic, 12 unit tests covering env var, plugin candidates (in order), legacy clone fallback, and absent-source error path.
- **CI verifies discovery resolves correctly** — the `validate-plugin` job runs `find-source` with `CLAUDE_PLUGIN_ROOT` set to the workspace and asserts it returns the workspace path.

### Notes

ADR-014 scopes three changes; only Change A ships in 1.5.2. Change B (`--dry-run` preview) is conditional and will be evaluated based on Change A's smoke-test outcomes. Change C (partial-install recovery) is deferred until triggered by real user reports. See [ADR-014 § Pragmatic Enforcer Analysis](.architecture/decisions/adrs/ADR-014-plugin-aware-setup-dry-run-recovery.md#pragmatic-enforcer-analysis) for the per-change scoring.

## [1.5.1] - 2026-05-03

### Changed

#### Setup-Process DevX Pass (no behavior change)
A targeted pass through the setup user-journey based on a fresh DevX audit. No behavior changes — purely doc and template clarity. Targets the post-1.4.0 plugin-install path, where the previous docs still described the legacy clone-based flow.

- **`setup-architect/SKILL.md`** gained a "What happens when you run this" walkthrough at the top, a "Setup successful when..." checklist users can verify against, and a "Recovery" section for partial installs. The verify-prerequisites step now describes plugin source-discovery alongside the legacy clone path; error messages surface both install options.
- **`installation-procedures.md`** marks the `.architecture/.architecture/` clone-based flow as the **traditional path** and adds an upfront note about the canonical plugin path.
- **`member-template.yml`** leads with a single minimum-viable example showing all seven required fields filled, before the stack-specific examples. Adds explicit pointer to the PreToolUse hook so users know how to actually save edits.
- **`initial-analysis-template.md`** annotates each section as either *required for minimum viable analysis* or *optional on first pass*, so first-time users aren't overwhelmed by a 400-line template.
- **`USAGE-WITH-CLAUDE-PLUGIN.md`** gains a "First 5 minutes after setup" quick-start with four concrete steps that exercise the full plugin (list-members, read analysis, create-adr, specialist-review).

### Fixed

- **Reconciled dynamic-specialist-creation references** across `USAGE-WITH-CLAUDE.md`, `README.md`, and `USAGE-WITH-CLAUDE-PLUGIN.md`. ADR-013 removed auto-creation; the docs now describe the post-1.5.0 reality (edit `members.yml` + override the PreToolUse hook + regenerate).
- **Dead `INSTALL.md` link** in `USAGE.md` retired (the file never existed); replaced with a pointer to README.md's Installation section.
- **Stale `USAGE-WITH-CLAUDE-SKILLS.md` references** in `USAGE.md` and `README.md` redirected to `USAGE-WITH-CLAUDE-PLUGIN.md`, the actual canonical install doc.
- **Confusing "33% / 60%" feature percentages** in `USAGE-WITH-CLAUDE-PLUGIN.md`'s comparison table replaced with prose noting the Skills install path was retired in 1.4.0.

### Notes

The DevX audit also identified a P2 candidate — a `setup-architect --dry-run` mode and resume-from-checkpoint — which is real behavior change and queued for ADR-014. The P0+P1 work shipped in 1.5.1 is corrective + narrative only; no risk of behavior regression.

## [1.5.0] - 2026-05-03

### Added

#### ADR Validation Drives the Plugin Surface (ADR-012 follow-on)
- **PreToolUse hook protects framework source-of-truth files.** `.architecture/{members.yml, principles.md, config.yml}` now reject Write/Edit operations with a tailored explanation pointing at the correct workflow (regenerator, ADR, pragmatic-guard skill). Override with `CLAUDE_ALLOW_PROTECTED=1` for intentional one-off edits. Logic in `tools/lib/protected-files.js` (TDD, 11 tests).
- **`disable-model-invocation: true`** added to side-effect skills (`create-adr`, `setup-architect`, `pragmatic-guard`). These workflows now require explicit user invocation; the model will not auto-fire on inferred intent.

### Changed

#### Skill Orchestrator Pattern (ADR-013)
- **`architecture-review` and `specialist-review` now delegate to subagents.** Both skills became orchestrators that dispatch `Agent({subagent_type: ...})` calls to the `agents/*.md` files generated in 1.4.0, instead of adopting personas inline. Reviews run in forked subagent contexts, preserving main-thread tokens and eliminating mid-review persona drift. See [ADR-013](.architecture/decisions/adrs/ADR-013-skill-orchestrator-subagent-delegation.md).
- **`setup-architect` `allowed-tools` scoped.** Was unscoped `Bash`; now `Bash(git:*,npm:*,node:*,mkdir:*,cp:*,ls:*,test:*)` — matches what the skill actually runs.
- **`create-adr` drops `Bash(grep:*)`** in favor of the `Grep`/`Glob` tools, per the project's own convention.

### Removed

- **Dynamic specialist creation in `specialist-review` is no longer auto-applied.** The previous behavior wrote new members to `members.yml` on the fly; the new PreToolUse hook makes that an explicit two-step (override the hook, edit `members.yml`, regenerate subagents). Trade-off: one-step convenience for stable, drift-free framework source files. See ADR-013 § Pragmatic Analysis.

## [1.4.0] - 2026-05-03

### Changed

#### Plugin Distribution Hardening (ADR-012)
- **Skills relocated to plugin root**: `.claude/skills/` → `skills/`. Claude Code plugins load skills from `skills/` at the plugin root, so installations via `/plugin marketplace add` now correctly receive all seven skills (previously only the MCP server was delivered).
- **Plugin marketplace install is the canonical Claude Code distribution.** The README's installation methods drop from four to three (Plugin / MCP / Traditional); the comparison tables and decision tree are updated accordingly.
- **Plugin/marketplace metadata corrected**: `homepage` and `repository` URLs in `plugin.json` and `marketplace.json` now point to `codenamev/ai-software-architect` (previously misconfigured to `anthropics/`).

### Removed

- **Legacy "Claude Skills" cp-based install path retired.** The pre-plugin `git clone … && cp -r .../skills ~/.claude/skills/` recipe was a strict subset of plugin installation (skills only, no MCP server, settings, hooks, or subagents). `USAGE-WITH-CLAUDE-SKILLS.md` is now a redirect pointing at `USAGE-WITH-CLAUDE-PLUGIN.md`.

### Migration

If you previously installed via the cp recipe, install the plugin instead:

```bash
/plugin marketplace add codenamev/ai-software-architect
/plugin install ai-software-architect@ai-software-architect
```

Optionally clean up the manually-copied directories under `~/.claude/skills/`. No changes are required for users who installed via the plugin or MCP server.

## [1.3.0] - 2025-12-12

### Added

#### Externalizing Senior Engineering Thinking (ADR-010)
- **Implementation Strategist**: New architecture team member focused on HOW and WHEN (blast radius analysis, reversibility design, team readiness assessment, change sequencing)
- **Change Impact Awareness Principle**: New Principle #8 systematically captures blast radius, reversibility, timing, social cost, and false confidence detection
- **Senior Thinking Checklist**: Enhanced review template with framing questions that externalize the "silent checklist" senior engineers use
- **Implementation Strategy Section**: Enhanced ADR template with systematic impact analysis (blast radius, reversibility, sequencing & timing, social cost, confidence assessment)
- **Strategic Framework Positioning**: Framework now explicitly creates the "missing corpus" of senior architectural thinking identified by industry thought leaders

#### Framework Capabilities
- **Knowledge Capture**: Systematically documents invisible architectural reasoning that typically stays undocumented
- **Progressive Disclosure Compliance**: All enhancements maintain instruction capacity constraints (ADR-005, ADR-006, ADR-008)
- **Auto-Discovery**: Implementation Strategist automatically available in Skills, MCP server, and all integration points via dynamic member loading

### Changed
- **Architecture Team**: Expanded from 7 to 8 core members with Implementation Strategist
- **Architectural Principles**: Enhanced from 7 to 8 principles with Change Impact Awareness
- **Review Process**: Review template now includes Senior Thinking Checklist for comprehensive impact framing
- **ADR Process**: ADR template now requires Implementation Strategy analysis before implementation
- **Directory Structure**: Added `agent_docs/` to standard structure (progressive disclosure pattern)

### Documentation
- **ADR-010**: Externalizing Senior Engineering Thinking - Documents strategic value and positions framework as solving industry gap
- **Referenced Work**: Obie Fernandez - "What happens when the coding becomes the least interesting part of the work" (2025)
- **README**: Updated to reflect Implementation Strategist, senior thinking capture, and agent_docs/ directory

### Technical Details

**New Team Member:**
```yaml
implementation_strategist:
  specialties:
    - change sequencing
    - blast radius analysis
    - reversibility design
    - team readiness assessment
  perspective: "Evaluates HOW and WHEN changes should be implemented"
```

**Enhanced Templates:**
- Review template: +100 lines (Senior Thinking Checklist)
- ADR template: +119 lines (Implementation Strategy section)
- Principles: +38 lines (Principle #8)

**Statistics:**
- 5 files modified, 486 lines added
- 1 new ADR created (ADR-010)
- Framework positioned as strategic knowledge capture system

## [1.2.0] - 2025-01-20

### Added

#### Agents.md Standard Adoption (ADR-003)
- **Cross-Platform AI Assistant Support**: Added `AGENTS.md` as universal entry point for all AI assistants (Claude, Cursor, Copilot, Jules, etc.)
- **Template System**: Created `.architecture/templates/AGENTS.md` for project-specific generation during setup
- **Multi-Assistant Architecture**: Framework now works seamlessly across 20,000+ projects using the Agents.md standard
- **Complementary Documentation**: `AGENTS.md` provides cross-platform instructions while `CLAUDE.md` adds Claude Code-specific enhancements

#### Implementation Command with Configuration (ADR-004)
- **Configuration-Driven Implementation**: Specify methodology, influences, and practices once in `.architecture/config.yml`
- **Simple Command Pattern**: Use "Implement X as the architects" instead of 40+ word prompts (90% reduction)
- **Methodology Support**: TDD, BDD, DDD, Test-Last, Exploratory development approaches
- **Coding Influences**: Configure thought leaders (Kent Beck, Sandi Metz, Martin Fowler, Gary Bernhardt, Jeremy Evans, Vladimir Dementyev)
- **Language-Specific Practices**: Per-language style guides, idioms, and framework conventions
- **Security-First**: Security practices always applied, exempt from YAGNI challenges
- **Quality Standards**: Configurable definition of done, refactoring guidelines, testing approach

#### Cross-Integration Implementation Support
- **MCP Server**: Added `get_implementation_guidance` tool for programmatic access to implementation configuration
- **Claude Code**: Full implementation command recognition with methodology application
- **Codex**: Setup instructions with implementation guidance and examples
- **Cursor**: README documentation with configuration and usage patterns
- **Claude Skills**: Updated `setup-architect` skill to include implementation commands

#### Pragmatic Guard Mode Enhancements
- **MCP Tool**: Added `pragmatic_enforcer` tool to MCP server for programmatic YAGNI analysis
- **Automated Complexity Assessment**: Scores necessity (0-10) and complexity (0-10) with ratio analysis
- **Simpler Alternatives**: Always proposes concrete simpler approaches
- **Deferral Recommendations**: Tracks what can be implemented later with trigger conditions

### Changed

- **Framework Version**: Bumped from 1.1.0 to 1.2.0
- **MCP Server Version**: Bumped from 1.1.0 to 1.2.0
- **Documentation Structure**: Clarified relationship between AGENTS.md (cross-platform) and CLAUDE.md (Claude-specific)
- **Config Template**: Expanded `.architecture/templates/config.yml` with implementation section (+175 lines)
- **Setup Process**: Framework setup now generates project-specific AGENTS.md from template

### Documentation

- **ADR-003**: Agents.md Standard Adoption - Full decision record with alternatives analysis
- **ADR-004**: Implementation Command with Configuration - Comprehensive decision record with pragmatic assessment
- **Architecture Reviews**:
  - `feature-agents-md-adoption.md` - Multi-perspective review of Agents.md adoption
  - `feature-implementation-command-configuration.md` - 7-member collaborative review
- **AGENTS.md**: 518 lines documenting framework for all AI assistants
- **Implementation Examples**: Ruby TDD, JavaScript BDD, Python Test-Last configurations

### Fixed

- **Update Command Clarity**: Added full GitHub URL to update instructions to avoid ambiguity
- **Cross-Platform Consistency**: Ensured all integration methods have equivalent implementation feature documentation

### Technical Details

**Implementation Configuration Structure:**
```yaml
implementation:
  enabled: true
  methodology: "TDD"  # or BDD, DDD, Test-Last, Exploratory
  influences:
    - "Kent Beck - TDD by Example"
    - "Sandi Metz - POODR, 99 Bottles"
    - "Martin Fowler - Refactoring"
  languages:
    ruby:
      style_guide: "Rubocop"
      idioms: "Blocks over loops, meaningful names"
  quality:
    definition_of_done:
      - "Tests passing"
      - "Code refactored"
```

**MCP Server New Tools:**
- `get_implementation_guidance(projectPath, featureDescription?)` - Returns formatted implementation guidance
- `pragmatic_enforcer(recommendation, context, mode?)` - Analyzes recommendations for YAGNI compliance

**Statistics:**
- 8 files modified, 2,886 lines added
- 2 new ADRs created
- 2 comprehensive architecture reviews conducted
- 5 integration methods fully documented

## [1.1.0] - 2025-11-17

### Added

- Claude Skills conversion for all architecture operations
- Pragmatic Guard Mode configuration and behavior
- Initial MCP server implementation with core tools
- Cross-assistant configuration directories

### Changed

- Converted to Skills-based architecture for Claude Code
- Enhanced members.yml with Pragmatic Enforcer role
- Improved setup process with project-specific customization

## [1.0.0] - 2025-11-15

### Added

- Initial framework release
- Architecture Decision Records (ADRs) system
- Architecture reviews with multi-perspective analysis
- Architecture recalibration process
- Members system with specialized roles
- Principles-based architectural guidance
- Template system for ADRs and reviews
- Claude Code integration

### Documentation

- CLAUDE.md for Claude Code usage
- USAGE-WITH-CLAUDE.md comprehensive guide
- Installation and setup instructions
- Example ADRs and reviews

---

## Release Links

- [1.2.0](https://github.com/codenamev/ai-software-architect/releases/tag/v1.2.0) - 2025-01-20
- [1.1.0](https://github.com/codenamev/ai-software-architect/releases/tag/v1.1.0) - 2025-11-17
- [1.0.0](https://github.com/codenamev/ai-software-architect/releases/tag/v1.0.0) - 2025-11-15

## Contributing

See [AGENTS.md](AGENTS.md#contributing-to-the-framework) for guidelines on contributing to the framework.
