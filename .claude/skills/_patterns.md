# Claude Skills Common Patterns

This document contains reusable patterns referenced by AI Software Architect skills. These patterns promote consistency and reduce duplication across skills.

**Note**: This is a reference document, not a skill itself. It does not have YAML frontmatter.

## Table of Contents

1. [Tool Permission Pattern](#tool-permission-pattern)
2. [Progressive Disclosure Pattern](#progressive-disclosure-pattern)
3. [Script-Based Deterministic Operations](#script-based-deterministic-operations)
4. [Input Validation & Sanitization](#input-validation--sanitization)
5. [Error Handling](#error-handling)
6. [File Loading](#file-loading)
7. [Reporting Format](#reporting-format)
8. [Skill Workflow Template](#skill-workflow-template)

---

## Tool Permission Pattern

**Status**: ✅ Implemented across all skills (2025-12-04)
**Reference**: [ADR-007](../../.architecture/decisions/adrs/ADR-007-tool-permission-restrictions-for-skills.md)

All skills MUST declare tool permissions via `allowed-tools` in YAML frontmatter. This implements principle of least privilege and limits blast radius of skill malfunctions.

### Available Tools

- **Read**: Read files from filesystem
- **Write**: Create new files
- **Edit**: Modify existing files
- **Glob**: Pattern-based file searching
- **Grep**: Content searching within files
- **Bash**: Execute bash commands (can be scoped)

### Permission Guidelines

**Principle of Least Privilege**: Only grant tools actually required for skill operation.

**Bash Scoping**: Use wildcards to restrict bash commands:
- `Bash(git:*)` - Only git commands
- `Bash(ls:*,grep:*)` - Only ls and grep
- `Bash(npm:*,node:*)` - Only npm and node
- `Bash` - Full bash access (use sparingly)

### Permission Levels by Skill Type

**Read-Only Skills** (listing, status checks):
```yaml
allowed-tools: Read
```

**Search & Analysis Skills** (scanning, reporting):
```yaml
allowed-tools: Read,Glob,Grep
```

**Document Creation Skills** (ADRs, reviews):
```yaml
allowed-tools: Read,Write,Bash(ls:*,grep:*)
```

**Document Modification Skills** (updates, edits):
```yaml
allowed-tools: Read,Write,Edit,Glob,Grep
```

**Review & Analysis Skills** (comprehensive reviews):
```yaml
allowed-tools: Read,Write,Glob,Grep,Bash(git:*)
```

**Configuration Skills** (mode toggles):
```yaml
allowed-tools: Read,Edit
```

**Setup & Installation Skills** (framework setup):
```yaml
allowed-tools: Read,Write,Edit,Glob,Grep,Bash
```

### Current Skill Permissions

| Skill | Tools | Rationale |
|-------|-------|-----------|
| `list-members` | `Read` | Only reads members.yml |
| `architecture-status` | `Read,Glob,Grep` | Scans files and searches |
| `create-adr` | `Read,Write,Bash(bash:*,ls:*,grep:*)` | Creates ADRs, runs numbering script |
| `specialist-review` | `Read,Write,Glob,Grep` | Reviews code, writes reports |
| `architecture-review` | `Read,Write,Glob,Grep,Bash(git:*)` | Full reviews + git status |
| `pragmatic-guard` | `Read,Edit` | Reads/modifies config |
| `setup-architect` | `Read,Write,Edit,Glob,Grep,Bash` | Full installation access |

### Adding Permissions to New Skills

When creating a new skill, determine required tools:

1. **List required operations**:
   - Need to read files? → `Read`
   - Need to create files? → `Write`
   - Need to modify files? → `Edit`
   - Need to search by pattern? → `Glob`
   - Need to search content? → `Grep`
   - Need bash commands? → `Bash(scoped:*)` or `Bash`

2. **Apply minimum necessary set**:
   - Start with minimal permissions
   - Add only when operation actually requires it
   - Scope Bash to specific command families

3. **Add to frontmatter**:
   ```yaml
   ---
   name: skill-name
   description: ...
   allowed-tools: Read,Write,Grep
   ---
   ```

4. **Test thoroughly**:
   - Verify skill can perform all operations
   - Confirm no permission errors
   - Test edge cases

### Security Considerations

**Path Traversal**: Tools like Read, Write, Edit are bounded by Claude Code's security model, but skills should still validate user inputs.

**Command Injection**: When using Bash, always sanitize user inputs using filename sanitization patterns.

**Wildcard Safety**: Bash scoping reduces but doesn't eliminate risks. Still apply input validation.

**Audit Regularly**: Review tool permissions when modifying skills to ensure they still follow least privilege.

### Troubleshooting Permission Errors

**Error: "Tool X not allowed"**
- Check skill's `allowed-tools` frontmatter
- Add required tool if operation is legitimate
- Consider if operation can be done with allowed tools

**Error: "Bash command not allowed"**
- If using `Bash(scoped:*)`, ensure command matches scope
- Consider broadening scope: `Bash(git:*,npm:*)`
- As last resort, use full `Bash` access (document why)

**Permission Too Broad?**
- Review actual tool usage in skill
- Remove unused tools from `allowed-tools`
- Narrow Bash scoping if possible

---

## Progressive Disclosure Pattern

**Status**: ✅ Implemented (Phase 2 Complete - 2025-12-04)
**Reference**: [ADR-008](../../.architecture/decisions/adrs/ADR-008-progressive-disclosure-pattern-for-large-skills.md)

Organize complex skills into modular structure: high-level workflow + detailed references + templates. This pattern improves token efficiency, enables content expansion, and dramatically improves maintainability.

### When to Use Progressive Disclosure

**Apply pattern when:**
- Skill has distinct workflow vs detailed guidance sections
- Skill >2K words or contains extensive procedural detail
- Skill includes templates that could be extracted
- Future expansion anticipated (tech stacks, examples, checklists)
- Clear separation would improve navigability

**Keep as flat file when:**
- Skill <2K words with homogeneous content
- Simple reporting or trivial operation
- No clear workflow vs detail separation
- Overhead exceeds benefits

### Pattern Structure

```
skill-name/
├── SKILL.md                    # High-level workflow (always loaded)
├── references/                 # Detailed docs (loaded on-demand)
│   ├── detailed-process.md     # Step-by-step procedures
│   └── integration-guide.md    # Configuration and customization
└── assets/                     # Templates and static files
    └── template.md             # Ready-to-use templates
```

### SKILL.md (Base Workflow)

**Purpose**: High-level workflow that's always injected into context

**Content**:
- YAML frontmatter (name, description, allowed-tools)
- Overview of skill purpose
- High-level workflow steps (numbered)
- Clear references to detailed docs
- Related skills and workflow examples

**Size Target**: Keep concise - aim for 500-1000 words

**Example Structure**:
```markdown
---
name: skill-name
description: Clear description with trigger phrases
allowed-tools: Read,Write,Glob,Grep
---

# Skill Title

Brief description of what this skill does.

## Overview

High-level summary (3-5 bullets)

**Detailed guidance**: [references/detailed-process.md](references/detailed-process.md)
**Template**: [assets/template.md](assets/template.md)

## High-Level Workflow

### 1. [Step Name]
Brief description
- Key action
- Key action

**Detailed procedures**: See [references/detailed-process.md § Step 1]

### 2. [Step Name]
Brief description

[Continue with high-level steps]

## Related Skills
[References to before/after skills]
```

### references/ (Detailed Documentation)

**Purpose**: Comprehensive guidance loaded only when needed

**Content Types**:
- **Process details**: Step-by-step procedures with verification
- **Integration guides**: Configuration options and customization
- **Specialist guidance**: Expert perspectives and checklists
- **Best practices**: Industry standards and patterns
- **Examples**: Code samples, scenarios, use cases

**Organization**:
- 1-3 focused reference files per skill
- Each file covers a distinct aspect
- Clear section headers for easy navigation
- Cross-reference to templates when relevant

**Example references/detailed-process.md**:
```markdown
# Detailed Process: [Skill Name]

## Prerequisites

[Requirements and verification steps]

## Step 1: [Name]

**Purpose**: [Why this step]

**Procedure**:
1. [Action]
2. [Action with bash example if needed]
3. [Verification step]

**Common Issues**:
- [Issue]: [Solution]

**Example**:
[Code or command example]

[Continue with remaining steps in detail]
```

### assets/ (Templates)

**Purpose**: Ready-to-use templates and static files

**Content Types**:
- Document templates (ADRs, reviews, reports)
- Configuration templates (YAML, JSON)
- Code snippets or boilerplate

**Format**:
- Complete, fillable templates
- Include placeholder text in [brackets]
- Add comments explaining each section
- Provide examples where helpful

**Example assets/template.md**:
```markdown
# [Template Title]

**[Field]**: [Value or placeholder]
**[Field]**: [Value]

## [Section Name]

[Guidance for filling this section]

[Example or placeholder content]

[Continue with complete template structure]
```

### Phase 2 Results (Proven Benefits)

**Skills Refactored**: 3 (architecture-review, setup-architect, specialist-review)

**Token Efficiency**:
- Variable by starting optimization: 0-34% base reduction
- Average: 13% base reduction across 3 skills
- Annual savings: ~18,380 tokens/year (estimated)

**Content Expansion**:
- Consistent 300%+ increase per skill
- architecture-review: +375% (791 → 3,757 words)
- setup-architect: +494% (813 → 4,837 words)
- specialist-review: +332% (826 → 3,571 words)
- Average: +400% content expansion

**Maintainability**:
- 9 new reference and asset files created
- Clear separation: workflow vs procedures vs templates
- Isolated updates without affecting core workflow
- Dramatically improved navigation

**Key Insight**: Pattern delivers value through multiple dimensions beyond token savings. Even skills with no base reduction gain significant value through content expansion and improved maintainability.

### Implementation Guidelines

**1. Analyze Current Skill**:
- Identify workflow steps (high-level)
- Identify detailed procedures (low-level)
- Identify templates embedded inline
- Determine natural separation points

**2. Create Directory Structure**:
```bash
mkdir -p .claude/skills/skill-name/references
mkdir -p .claude/skills/skill-name/assets
```

**3. Extract Content**:
- **To SKILL.md**: Keep workflow, overview, high-level steps
- **To references/**: Move detailed procedures, comprehensive guides
- **To assets/**: Extract templates, configurations

**4. Add References**:
- Link from SKILL.md to references with relative paths
- Use descriptive section anchors: `references/file.md § Section`
- Keep references concise and navigable

**5. Test Loading**:
- Verify all reference links work
- Test skill execution with minimal loading
- Test skill execution with full reference loading
- Confirm templates are accessible

**6. Measure Results**:
- Count words: before vs after (base and total)
- Estimate token savings
- Assess maintainability improvement
- Document in comparisons/

### Refactoring Checklist

- [ ] Skill has clear workflow vs detail separation
- [ ] Created /references/ and /assets/ directories
- [ ] Extracted detailed procedures to references/
- [ ] Extracted templates to assets/
- [ ] Streamlined SKILL.md to high-level workflow
- [ ] Added clear references from SKILL.md to detailed docs
- [ ] Updated YAML frontmatter (name, description, allowed-tools)
- [ ] Tested skill execution
- [ ] Verified reference links work
- [ ] Measured before/after metrics (words, tokens)
- [ ] Documented results in .architecture/comparisons/
- [ ] Updated ARCHITECTURE.md with new structure

### Best Practices

**Do**:
- Keep SKILL.md focused on workflow
- Make references/  comprehensive and detailed
- Extract templates to assets/ for reusability
- Use clear, descriptive file names
- Cross-reference between files appropriately
- Test all links after refactoring

**Don't**:
- Duplicate content between SKILL.md and references/
- Over-fragment (too many small reference files)
- Break mid-workflow (keep logical steps together)
- Forget to update allowed-tools in frontmatter
- Skip measuring and documenting results

### Migration Path

**Existing flat file skill** → **Progressive disclosure**:

1. Read current SKILL.md and analyze content
2. Create directory structure (references/, assets/)
3. Extract detailed content to references/
4. Extract templates to assets/
5. Rewrite SKILL.md as high-level workflow with references
6. Test and verify
7. Measure and document results

**Estimated effort**: 2-3 hours per skill

### References

- [Phase 2 PoC Results](../../.architecture/comparisons/progressive-disclosure-poc-results.md)
- [Phase 2A Results](../../.architecture/comparisons/phase-2a-setup-architect-results.md)
- [Phase 2B Results](../../.architecture/comparisons/phase-2b-specialist-review-results.md)
- [Phase 2 Complete Summary](../../.architecture/comparisons/phase-2-complete-summary.md)
- [ADR-008](../../.architecture/decisions/adrs/ADR-008-progressive-disclosure-pattern-for-large-skills.md)

---

## Script-Based Deterministic Operations

**Status**: Implemented (2026-02-10)
**Reference**: [ADR-009](../../.architecture/decisions/adrs/ADR-009-script-based-deterministic-operations.md)

Operations that must produce identical results regardless of LLM interpretation should be implemented as shell scripts, not as inline skill instructions. Skills invoke scripts via `Bash`, scripts return structured output.

### When to Script

**Script when:**
- Operation involves destructive actions (`rm -rf`, file overwrites)
- Operation has an exact correct output (numbering, formatting, paths)
- Operation reads configuration and must respect it deterministically
- LLM improvisation has caused or could cause bugs
- Trust erosion from incorrect results would undermine framework credibility

**Keep interpretive when:**
- Operation requires understanding context (project analysis, recommendations)
- Output is naturally variable (reviews, summaries, team customization)
- No single correct answer exists

### Script Interface Convention

Scripts follow a consistent interface pattern:

- **Arguments**: Positional, documented in script header comments
- **Stdout**: Structured tokens or single-value output (machine-readable)
- **Stderr**: Human-readable errors and warnings
- **Exit codes**: 0 = success, non-zero = specific failure category
- **Safety**: `set -euo pipefail` in all scripts

### Current Scripts

| Script | Location | Used By | Purpose |
|--------|----------|---------|---------|
| `install-framework.sh` | `setup-architect/scripts/` | `setup-architect` | All installation file operations |
| `next-adr-number.sh` | `scripts/` (shared) | `create-adr` | ADR prefix generation from config |

### Skill Invocation Pattern

Skills invoke scripts using the `<skill-base-dir>` path provided at the top of the skill prompt:

```bash
# Skill-specific script
bash "<skill-base-dir>/scripts/install-framework.sh" "$(pwd)"

# Shared script (one directory up from skill base)
bash "<skill-base-dir>/../scripts/next-adr-number.sh" "<adrs-dir>" "<topic-slug>"
```

### Script Location Convention

- **Skill-specific scripts**: `<skill-name>/scripts/` — used by one skill only
- **Shared scripts**: `scripts/` (at skills root) — used by multiple skills

### Background

ADR-009 identified the need for deterministic operations but deferred implementation because it missed the highest-stakes candidate (framework installation with destructive `rm -rf`). The trigger condition — "bash command construction causes bugs" — was satisfied when the setup-architect skill repeatedly botched the installation copy path despite a prior fix (PR #5). This pattern was implemented to address both the installation failure and ADR numbering reliability.

---

## Input Validation & Sanitization

### Filename Sanitization Pattern

Use when converting user input to filenames:

```
**Validate and Sanitize Input**:
- Remove path traversal: `..`, `/`, `\`
- Remove dangerous characters: null bytes, control characters
- Convert to lowercase kebab-case:
  - Spaces → hyphens
  - Remove special characters except hyphens and alphanumerics
- Limit length: max 80-100 characters
- Validate result matches: [a-z0-9-] pattern

**Examples**:
✅ Valid: "User Authentication" → `user-authentication`
✅ Valid: "React Frontend" → `react-frontend`
❌ Invalid blocked: "../../../etc/passwd" → rejected
❌ Invalid blocked: "test\x00file" → rejected
```

### Version Number Validation Pattern

Use for semantic version numbers:

```
**Version Validation**:
- Format: X.Y.Z (e.g., 1.2.3)
- Allow only: digits (0-9) and dots (.)
- Validate: 1-3 numeric segments separated by dots
- Convert dots to hyphens for filenames: 1.2.3 → 1-2-3

**Examples**:
✅ Valid: "2.1.0" → `2-1-0`
✅ Valid: "1.0" → `1-0`
❌ Invalid: "v2.1.0" → strip 'v' prefix
❌ Invalid: "2.1.0-beta" → reject or sanitize
```

### Specialist Role Validation Pattern

Use for specialist role names:

```
**Role Validation**:
- Allow: letters, numbers, spaces, hyphens
- Convert to title case for display
- Convert to kebab-case for filenames
- Common roles: Security Specialist, Performance Expert, Domain Expert

**Examples**:
✅ Valid: "Security Specialist" → display as-is, file: `security-specialist`
✅ Valid: "Ruby Expert" → display as-is, file: `ruby-expert`
❌ Invalid: "Security/Admin" → sanitize to `security-admin`
```

---

## Error Handling

### Framework Not Set Up Pattern

Use when .architecture/ doesn't exist:

```markdown
The AI Software Architect framework is not set up yet.

To get started: "Setup ai-software-architect"

Once set up, you'll have:
- Architectural Decision Records (ADRs)
- Architecture reviews with specialized perspectives
- Team of architecture specialists
- Documentation tracking and status monitoring
```

### File Not Found Pattern

Use when required files are missing:

```markdown
Could not find [file/directory name].

This usually means:
1. Framework may not be set up: "Setup ai-software-architect"
2. File was moved or deleted
3. Wrong directory

Expected location: [path]
```

### Permission Error Pattern

Use for file system permission issues:

```markdown
Permission denied accessing [file/path].

Please check:
1. File permissions: chmod +r [file]
2. Directory permissions: chmod +rx [directory]
3. You have access to this project directory
```

### Malformed YAML Pattern

Use when YAML parsing fails:

```markdown
Error reading [file]: YAML syntax error

Common issues:
- Incorrect indentation (use spaces, not tabs)
- Missing quotes around special characters
- Unclosed strings or brackets

Please check file syntax or restore from template:
[path to template]
```

---

## File Loading

### Load Configuration Pattern

Use for loading config.yml:

```
1. Check if `.architecture/config.yml` exists
2. If missing: Use default configuration (pragmatic_mode: disabled)
3. If exists: Parse YAML
4. Extract relevant settings:
   - pragmatic_mode.enabled (boolean)
   - pragmatic_mode.intensity (strict|balanced|lenient)
   - Other mode-specific settings
5. Handle errors gracefully (malformed YAML → use defaults)
```

### Load Members Pattern

Use for loading members.yml:

```
1. Check if `.architecture/members.yml` exists
2. If missing: Offer framework setup
3. If exists: Parse YAML
4. Extract member information:
   - id, name, title (required)
   - specialties, disciplines, skillsets, domains (arrays)
   - perspective (string)
5. Validate structure (warn about missing fields)
6. Return array of member objects
```

### Load ADR List Pattern

Use for scanning ADR directory:

```
1. Check `.architecture/decisions/adrs/` exists
2. List files matching: ADR-[0-9]+-*.md
3. Extract ADR numbers and titles from filenames
4. Sort by ADR number (numeric sort)
5. Optionally read file headers for:
   - Status (Proposed, Accepted, Deprecated, Superseded)
   - Date
   - Summary
6. Return sorted list with metadata
```

---

## Reporting Format

### Success Report Pattern

Use after successfully completing a skill task:

```markdown
[Skill Action] Complete: [Target]

Location: [file path]
[Key metric]: [value]

Key Points:
- [Point 1]
- [Point 2]
- [Point 3]

Next Steps:
- [Action 1]
- [Action 2]
```

**Example**:
```markdown
ADR Created: Use PostgreSQL Database

Location: .architecture/decisions/adrs/ADR-005-use-postgresql.md
Status: Accepted

Key Points:
- Decision: PostgreSQL over MySQL for JSONB support
- Main benefit: Better performance for semi-structured data
- Trade-off: Team needs PostgreSQL expertise

Next Steps:
- Review with Performance Specialist
- Update deployment documentation
- Plan migration timeline
```

### Status Report Pattern

Use for providing status/health information:

```markdown
# [Status Type] Report

**Report Date**: [Date]
**Health Status**: Excellent | Good | Needs Attention | Inactive

## Summary

**Key Metrics**:
- [Metric 1]: [value]
- [Metric 2]: [value]
- [Metric 3]: [value]

## Detailed Findings

[Sections with specific information]

## Recommendations

[Actionable next steps based on current state]
```

### Review Report Pattern

Use for architecture and specialist reviews:

```markdown
# [Review Type]: [Target]

**Reviewer**: [Name/Role]
**Date**: [Date]
**Assessment**: Excellent | Good | Adequate | Needs Improvement | Critical Issues

## Executive Summary
[2-3 sentences]

**Key Findings**:
- [Finding 1]
- [Finding 2]

## [Detailed Analysis Sections]

## Recommendations

### Immediate (0-2 weeks)
1. **[Action]**: [Details]

### Short-term (2-8 weeks)
1. **[Action]**: [Details]

### Long-term (2-6 months)
1. **[Action]**: [Details]
```

---

## Skill Workflow Template

### Standard Skill Structure

All skills should follow this structure:

```markdown
---
name: skill-name
description: Clear description with trigger phrases. Use when... Do NOT use for...
allowed-tools: [Read, Write, Edit, Glob, Grep, Bash]  # Optional: restrict for security
---

# Skill Title

One-line description of what this skill does.

## Process

### 1. [First Step]
- Action item
- Action item

### 2. [Second Step]
- Action item
- Action item

[Continue with numbered steps]

### N. Report to User
[Use appropriate reporting pattern]

## [Optional Sections]

### When to Use
- Scenario 1
- Scenario 2

### When NOT to Use
- Scenario 1
- Scenario 2

## Related Skills

**Before This Skill**:
- "[Related skill]" - [Why]

**After This Skill**:
- "[Related skill]" - [Why]

**Workflow Examples**:
1. [Skill chain example 1]
2. [Skill chain example 2]

## Error Handling
- [Error type]: [How to handle]
- [Error type]: [How to handle]

## Notes
- Implementation note
- Best practice
- Important consideration
```

---

## Destructive Operations Safety Pattern

Use for operations that delete or modify files irreversibly:

```
**CRITICAL SAFEGUARDS**:
1. Verify current directory context
   - Check for project markers (package.json, .git, README.md, etc.)
   - Confirm we're in expected location

2. Verify target exists and is correct
   - Check file/directory exists: `[ -e /path/to/target ]`
   - Verify it's what we expect (check contents or structure)

3. Verify target is safe to modify/delete
   - For .git removal: verify it's template repo, not project repo
   - Check .git/config contains expected template URL
   - Ensure no uncommitted work or important history

4. Use absolute paths
   - Get absolute path: `$(pwd)/relative/path`
   - Never use relative paths with rm -rf

5. Never use wildcards
   - ❌ Bad: `rm -rf .architecture/.git*`
   - ✅ Good: `rm -rf $(pwd)/.architecture/.git`

6. Stop and ask if verification fails
   - **STOP AND ASK USER** if any check fails
   - Explain what failed and why it's unsafe
   - Let user confirm or abort

**Example Safe Deletion**:
```bash
# 1. Verify we're in project root
if [ ! -f "package.json" ] && [ ! -f ".git/config" ]; then
  echo "ERROR: Not in project root"
  exit 1
fi

# 2. Verify target exists
if [ ! -d ".architecture/.git" ]; then
  echo "Nothing to remove"
  exit 0
fi

# 3. Verify it's the template repo
if ! grep -q "ai-software-architect" .architecture/.git/config 2>/dev/null; then
  echo "ERROR: .architecture/.git doesn't appear to be template repo"
  echo "STOPPING - User confirmation required"
  exit 1
fi

# 4. Safe removal with absolute path
rm -rf "$(pwd)/.architecture/.git"
```
```

---

## Directory Structure Validation Pattern

Use when skills need specific directory structures:

```
**Directory Structure Check**:
1. Check `.architecture/` exists
   - If missing: Suggest "Setup ai-software-architect"

2. Check required subdirectories:
   - `.architecture/decisions/adrs/`
   - `.architecture/reviews/`
   - `.architecture/templates/`
   - `.architecture/recalibration/`
   - `.architecture/comparisons/`

3. Create missing subdirectories if skill will use them
   - Use: `mkdir -p .architecture/[subdirectory]`

4. Verify key files exist:
   - `.architecture/members.yml`
   - `.architecture/principles.md`
   - `.architecture/config.yml` (optional, use defaults if missing)

5. Report issues clearly:
   - Missing directories: Create them
   - Missing required files: Suggest setup or provide template
   - Permission issues: Report and suggest fixes
```

---

## Usage Notes

### How to Reference Patterns in Skills

In skill files, reference patterns like this:

```markdown
### 3. Validate Input
See [Input Validation & Sanitization](#input-validation--sanitization) in _patterns.md.

Apply filename sanitization pattern to user-provided title.
```

### When to Add New Patterns

Add new patterns when:
1. Same logic appears in 3+ skills
2. Pattern solves a common problem
3. Pattern improves security or reliability
4. Pattern promotes consistency

### When NOT to Extract Patterns

Don't extract when:
1. Logic is skill-specific
2. Pattern would be more complex than inline code
3. Pattern only used in 1-2 skills
4. Extraction reduces clarity

---

## Version History

**v1.3** (2026-02-10)
- Added script-based deterministic operations pattern (ADR-009 implementation)
- Documented when to script vs keep interpretive
- Added script interface convention and location convention
- Updated create-adr permission scope for script invocation

**v1.2** (2025-12-04)
- Added progressive disclosure pattern (ADR-008)
- Documented modular skill structure (SKILL.md + /references/ + /assets/)
- Included Phase 2 proven results and metrics
- Added implementation guidelines and refactoring checklist
- Provided best practices for applying pattern
- Added migration path for existing skills

**v1.1** (2025-12-04)
- Added tool permission pattern (ADR-007)
- Documented `allowed-tools` frontmatter requirement
- Added permission guidelines by skill type
- Added Bash scoping examples
- Added security considerations for tool permissions
- Added troubleshooting guide for permission errors

**v1.0** (2025-11-12)
- Initial patterns document
- Input validation patterns
- Error handling patterns
- File loading patterns
- Reporting format patterns
- Skill workflow template
- Destructive operations safety pattern
- Directory structure validation pattern
