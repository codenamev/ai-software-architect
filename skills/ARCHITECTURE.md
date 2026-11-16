# Claude Skills Architecture Documentation

**Last Updated**: 2025-12-04
**Version**: 1.0.0

## Overview

This document describes the architecture and patterns for AI Software Architect Claude Skills, based on industry best practices documented in [First Principles Deep Dive to Claude Agent Skills](https://leehanchung.github.io/blogs/2025/10/26/claude-skills-deep-dive/).

## Current Architecture

### Skill Structure

**Simple Skills (<2K words):**
```
.claude/skills/
├── _patterns.md              # Shared patterns and common logic
├── skill-name/
│   └── SKILL.md              # YAML frontmatter + full workflow
```

**Complex Skills (Refactored with Progressive Disclosure):**
```
.claude/skills/
├── _patterns.md              # Shared patterns
├── ARCHITECTURE.md           # This file
├── architecture-review/      # ✅ Refactored (Phase 2 PoC)
│   ├── SKILL.md              # High-level workflow (522 words)
│   ├── references/           # Detailed docs (2,243 words)
│   │   ├── review-process.md
│   │   └── pragmatic-integration.md
│   └── assets/               # Templates (992 words)
│       └── review-template.md
├── setup-architect/          # ✅ Refactored (Phase 2A)
│   ├── SKILL.md              # High-level workflow (776 words)
│   ├── references/           # Detailed docs (2,997 words)
│   │   ├── installation-procedures.md
│   │   └── customization-guide.md
│   └── assets/               # Templates (1,240 words)
│       ├── initial-analysis-template.md
│       └── member-template.yml
├── specialist-review/        # ✅ Refactored (Phase 2B)
│   ├── SKILL.md              # High-level workflow (827 words)
│   ├── references/           # Detailed docs (1,869 words)
│   │   └── specialist-perspectives.md
│   └── assets/               # Templates (875 words)
│       └── specialist-review-template.md
```

### YAML Frontmatter Structure

All skills MUST include:

```yaml
---
name: skill-name                # Unique identifier
description: |                  # Action-oriented description with trigger phrases
  Clear description. Use when [trigger phrases].
  Do NOT use for [anti-patterns].
allowed-tools: Read,Write,...   # Comma-separated list of permitted tools
---
```

## Tool Permission Model (ADR-007)

**Status**: ✅ Implemented (2025-12-04)

All skills now restrict tool access via `allowed-tools` frontmatter following principle of least privilege.

### Tool Permission Guidelines

**Available Tools:**
- `Read`: Read files from filesystem
- `Write`: Create new files
- `Edit`: Modify existing files
- `Glob`: Pattern-based file searching
- `Grep`: Content searching
- `Bash`: Execute bash commands (can be scoped with wildcards)

**Scoping Bash Commands:**
- `Bash(git:*)`: Only git commands
- `Bash(ls:*,grep:*)`: Only ls and grep commands
- `Bash`: Full bash access (use sparingly)

### Current Tool Assignments

| Skill | Allowed Tools | Rationale |
|-------|--------------|-----------|
| `list-members` | `Read` | Only reads members.yml |
| `architecture-status` | `Read,Glob,Grep` | Reads files and searches for patterns |
| `find-adrs` | `Read,Bash(node:*),Bash(find:*)` | Locates and runs `tools/cli.js find-adrs`, then reads the matched ADRs |
| `create-adr` | `Read,Write,Bash(ls:*,grep:*)` | Reads templates, writes ADRs, scans for numbering |
| `specialist-review` | `Read,Write,Glob,Grep` | Reads code, writes reviews, searches |
| `architecture-review` | `Read,Write,Glob,Grep,Bash(git:*)` | Full review capabilities + git status |
| `pragmatic-guard` | `Read,Edit` | Reads config, edits to enable mode |
| `setup-architect` | `Read,Write,Edit,Glob,Grep,Bash` | Broad access for installation |

## Progressive Disclosure Pattern (ADR-008)

**Status**: ✅ Implemented (Phase 2 Complete - 2025-12-04)

### Complexity Thresholds

| Word Count | Approach | Structure |
|-----------|----------|-----------|
| < 2,000 words | Flat file | SKILL.md only |
| 2,000 - 3,000 | Monitor | Consider refactoring if frequently modified |
| > 3,000 words | Progressive disclosure | SKILL.md + /references/ + /assets/ |

### Current Skill Sizes

| Skill | Original | Base (After) | Total (After) | Status | Structure |
|-------|----------|--------------|---------------|--------|-----------|
| `architecture-review` | 791 | 522 | 3,757 | ✅ Refactored | /references/ + /assets/ |
| `setup-architect` | 813 | 776 | 4,837 | ✅ Refactored | /references/ + /assets/ |
| `specialist-review` | 826 | 827 | 3,571 | ✅ Refactored | /references/ + /assets/ |
| `create-adr` | 2,400 | - | - | 📊 Monitor | Flat file (monitor growth) |
| `pragmatic-guard` | 1,200 | - | - | ✅ Optimal | Flat file |
| `architecture-status` | 800 | - | - | ✅ Optimal | Flat file |
| `list-members` | 200 | - | - | ✅ Optimal | Flat file |
| `find-adrs` | 450 | - | - | ✅ Optimal | Flat file |

### Progressive Disclosure Benefits (Proven)

**Token Efficiency**: Variable by starting optimization level
- architecture-review: 34% base reduction (791 → 522 words)
- setup-architect: 5% base reduction (813 → 776 words)
- specialist-review: 0% base reduction (826 → 827 words)
- **Average**: 13% base reduction
- **Annual savings**: ~18,380 tokens/year (estimated)

**Content Expansion**: Massive increase in available detail
- architecture-review: +375% (791 → 3,757 words)
- setup-architect: +494% (813 → 4,837 words)
- specialist-review: +332% (826 → 3,571 words)
- **Average**: +400% content expansion

**Maintainability**: Dramatically improved through modular structure
- 9 new reference and asset files created
- Clear separation: workflow vs procedures vs templates
- Easy to update specific sections without affecting core workflow
- Improved navigation and discoverability

**Scalability**: Skills can provide comprehensive guidance without base bloat

**Key Insight**: Pattern delivers value through multiple dimensions beyond token savings. Even skills with no base reduction (specialist-review) gain significant value through content expansion (332%) and improved maintainability.

## Script-Based Operations (ADR-009)

**Status**: ⏸️ Deferred - Waiting for trigger conditions

### When to Use Scripts

**Trigger Conditions (any one):**
1. Bash command construction causes bugs
2. ADR numbering conflicts occur
3. Third deterministic operation identified
4. Security concern with command construction

**Candidates for Scripts:**
- ADR numbering (scan directory, find highest, increment)
- Member YAML parsing (parse and format)
- Version validation (check format, sanitize)
- Filename sanitization (remove dangerous chars)

### Script Pattern (When Implemented)

```bash
#!/bin/bash
# .claude/skills/scripts/next-adr-number.sh
# Usage: next-adr-number.sh [path-to-adrs-dir]
# Returns: Next ADR number (3 digits)

# Input validation
# Deterministic logic
# Error handling
# Predictable output
```

## Skill Development Guidelines

### Creating a New Skill

1. **Determine Complexity**:
   - Will it be >2K words? Consider progressive disclosure from start
   - Does it need deterministic operations? Consider scripts if triggers met

2. **Define Tool Permissions**:
   - List actual tools needed
   - Use principle of least privilege
   - Scope Bash with wildcards where appropriate

3. **Write YAML Frontmatter**:
   ```yaml
   ---
   name: skill-name
   description: |
     Action-oriented description with trigger phrases.
     Use when [specific user requests].
     Do NOT use for [anti-patterns].
   allowed-tools: Read,Write,...
   ---
   ```

4. **Structure Content**:
   - High-level workflow in SKILL.md
   - Reference `_patterns.md` for common operations
   - Use `/references/` if skill >3K words
   - Bundle templates in `/assets/` if needed

5. **Document Related Skills**:
   - Link to skills that should be used before/after
   - Provide workflow examples

### Modifying an Existing Skill

1. **Check Current Size**:
   - If approaching 3K words, consider splitting

2. **Update Tool Permissions If Needed**:
   - Add tools if new capabilities required
   - Still follow least privilege

3. **Maintain Consistency**:
   - Follow established patterns
   - Reference `_patterns.md` for common logic

## Common Patterns

See `.claude/skills/_patterns.md` for detailed patterns:

- **Input Validation & Sanitization**: Filename sanitization, version validation
- **Error Handling**: Framework not set up, file not found, permission errors
- **File Loading**: Configuration, members, ADR lists
- **Reporting**: Success reports, status reports, review reports
- **Security**: Destructive operations safety, directory validation

## Testing Skills

### Manual Testing Checklist

- [ ] Invoke skill with typical use cases
- [ ] Test with edge cases (large inputs, missing files, etc.)
- [ ] Verify tool permissions don't block required operations
- [ ] Check error handling for missing dependencies
- [ ] Validate output format and content
- [ ] Test related skill workflows

### Security Testing

- [ ] Attempt path traversal in inputs
- [ ] Try command injection in string parameters
- [ ] Verify sanitization patterns applied
- [ ] Check tool restrictions enforced

## Migration Path

### Phase 1: Tool Permissions (✅ Complete - 2025-12-04)
- [x] Add `allowed-tools` to all skills
- [x] Document pattern in this file
- [x] Create ADR-007

### Phase 2: Progressive Disclosure (✅ Complete - 2025-12-04)
- [x] Refactor `architecture-review` as proof of concept (PoC)
- [x] Measure token savings and usability
- [x] Decide on broader adoption (approved)
- [x] Refactor `setup-architect` (Phase 2A)
- [x] Refactor `specialist-review` (Phase 2B)
- [x] Document results and learnings

**Results Summary:**
- 3 skills refactored with progressive disclosure pattern
- 13% average base reduction, 400% average content expansion
- Pattern validated across orchestration, setup, and analysis skill types
- Dramatically improved maintainability through modular structure

**Detailed Results:**
- [Phase 2 PoC Results](./.././../architecture/comparisons/progressive-disclosure-poc-results.md)
- [Phase 2A Results](../../.architecture/comparisons/phase-2a-setup-architect-results.md)
- [Phase 2B Results](../../.architecture/comparisons/phase-2b-specialist-review-results.md)
- [Phase 2 Complete Summary](../../.architecture/comparisons/phase-2-complete-summary.md)

### Phase 3: Script Infrastructure (⏸️ Deferred)
- [ ] Wait for trigger conditions
- [ ] Create `/scripts/` directory structure
- [ ] Implement first script with tests
- [ ] Document script API

## Decision Records

All architectural decisions documented:

- **[ADR-007](../../.architecture/decisions/adrs/ADR-007-tool-permission-restrictions-for-skills.md)**: Tool Permission Restrictions (Implemented)
- **[ADR-008](../../.architecture/decisions/adrs/ADR-008-progressive-disclosure-pattern-for-large-skills.md)**: Progressive Disclosure Pattern (Implemented - Phase 2 Complete)
- **[ADR-009](../../.architecture/decisions/adrs/ADR-009-script-based-deterministic-operations.md)**: Script-Based Operations (Accepted - Deferred)

## External References

- [First Principles Deep Dive to Claude Agent Skills](https://leehanchung.github.io/blogs/2025/10/26/claude-skills-deep-dive/) - Industry best practices
- [Claude Skills Comparison Review](../../.architecture/comparisons/claude-skills-deep-dive-comparison.md) - Our implementation vs blog
- [Claude Skills Takeaways](../../.architecture/comparisons/claude-skills-takeaways.md) - Action items and recommendations

## Contributing

When contributing to skills:

1. Review this architecture document
2. Follow established patterns from `_patterns.md`
3. Apply appropriate complexity level for skill size
4. Test thoroughly before committing
5. Update documentation if adding new patterns

## Questions?

- **"When should I use progressive disclosure?"** - When skill has distinct workflow vs detailed guidance sections, especially if >2K words. Pattern delivers value through content expansion and maintainability even without token savings.
- **"Will progressive disclosure save tokens?"** - Variable (0-34% based on starting optimization). Main value is in content expansion (300%+) and maintainability improvements.
- **"Do I need scripts?"** - Not yet, wait for trigger conditions (ADR-009)
- **"What tools can my skill use?"** - Only those needed; follow least privilege
- **"How do I test my skill?"** - Follow manual testing checklist above
- **"Can I reference other skills?"** - Yes, document in "Related Skills" section
- **"Should I refactor my skill now?"** - If >2K words with clear workflow vs detail separation, consider it. See Phase 2 results for expected outcomes.

---

**Maintained By**: AI Software Architect Framework Contributors
**Questions/Issues**: See [GitHub Issues](https://github.com/codenamev/ai-software-architect/issues)
