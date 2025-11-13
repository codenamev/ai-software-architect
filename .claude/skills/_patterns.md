# Claude Skills Common Patterns

This document contains reusable patterns referenced by AI Software Architect skills. These patterns promote consistency and reduce duplication across skills.

**Note**: This is a reference document, not a skill itself. It does not have YAML frontmatter.

## Table of Contents

1. [Input Validation & Sanitization](#input-validation--sanitization)
2. [Error Handling](#error-handling)
3. [File Loading](#file-loading)
4. [Reporting Format](#reporting-format)
5. [Skill Workflow Template](#skill-workflow-template)

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

**v1.0** (2025-11-12)
- Initial patterns document
- Input validation patterns
- Error handling patterns
- File loading patterns
- Reporting format patterns
- Skill workflow template
- Destructive operations safety pattern
- Directory structure validation pattern
