# Installation Procedures

This document provides troubleshooting, recovery, and reference information for the AI Software Architect framework installation.

**Note**: All file operations are handled by `install-framework.sh`. This document covers what the script does, how to troubleshoot failures, and how to recover from errors.

## Table of Contents

1. [What the Script Handles](#what-the-script-handles)
2. [The Install Manifest](#the-install-manifest)
3. [Script Interface](#script-interface)
4. [Troubleshooting](#troubleshooting)
5. [Recovery](#recovery)
6. [Post-Installation](#post-installation)

---

## What the Script Handles

The `install-framework.sh` script at `scripts/install-framework.sh` performs all deterministic file operations:

1. **Clone** — Shallow-clones the framework repo to `/tmp/ai-software-architect-<pid>`. Warns if no project markers found in the target directory.
2. **Read manifest** — Reads `.install-manifest` from the cloned repo to determine what to install.
3. **Copy** — Copies only files and directories listed in the manifest (templates, agent docs).
4. **Create directories** — Creates empty directories listed in the manifest (decisions/adrs, reviews, recalibration, comparisons).
5. **Initialize config** — Copies `templates/config.yml` to `config.yml` if no config exists yet.
6. **Cleanup** — Removes the temporary clone directory on exit (via trap).
7. **Verify** — Checks all required directories exist.

**What the script does NOT handle** (left to the skill's interpretive steps):
- `members.yml` — created by the skill based on project analysis
- `principles.md` — created by the skill based on detected tech stack
- `reviews/initial-system-analysis.md` — created by the skill's analysis step

---

## The Install Manifest

The `.install-manifest` file in the repository root controls what gets installed. It uses a simple line-based format:

```
# Comments start with #
copy: templates           # Copy directory from repo's .architecture/
copy: agent_docs          # Copy directory from repo's .architecture/
mkdir: decisions/adrs     # Create empty directory
mkdir: reviews            # Create empty directory
config: templates/config.yml config.yml   # Copy src to dst if dst doesn't exist
```

**Directives:**
- `copy: <path>` — Copy file or directory from the cloned repo's `.architecture/` to the target `.architecture/`
- `mkdir: <path>` — Create empty directory in target `.architecture/`
- `config: <src> <dst>` — Copy src to dst only if dst doesn't already exist

Paths are relative to `.architecture/`.

---

## Script Interface

```
Usage: install-framework.sh <project-root> [repo-url]

Arguments:
  project-root    Absolute path to the target project root directory
  repo-url        Git repo URL (default: https://github.com/codenamev/ai-software-architect)

Environment variables:
  CLONE_DIR_OVERRIDE=<path>   Use pre-cloned directory instead of cloning (for testing)

Exit codes:
  0  Success
  1  Clone failed or bad project path
  2  Copy failed
  3  Manifest not found or malformed
  4  Verification failed (installation incomplete)

Stdout tokens:
  CLONE_OK              Repository cloned successfully
  CLONE_SKIPPED         Skipped (using CLONE_DIR_OVERRIDE)
  MANIFEST_OK           Manifest found and readable
  CONFIG_INIT           Config initialized from template
  CONFIG_EXISTS         Config already existed (not overwritten)
  CONFIG_NO_TEMPLATE    No config template found
  INSTALL_OK:<stats>    Installation complete with copy/dir/config counts
  VERIFY_OK             Installation verified
  INSTALLED:<list>      Comma-separated list of installed components
```

---

## Troubleshooting

### Common Issues

**"Failed to clone" (exit 1)**
- **Cause**: Network error or invalid repo URL
- **Solution**: Check network connectivity. Verify the repo URL is accessible.

**"project-root must be an absolute path" (exit 1)**
- **Cause**: Relative path passed to script
- **Solution**: Use `"$(pwd)"` when invoking the script

**"Manifest not found" (exit 3)**
- **Cause**: The cloned repo doesn't contain `.install-manifest`
- **Solution**: The repository may not support manifest-based installation. Check that you're cloning the correct repo/branch.

**"Installation incomplete" (exit 4)**
- **Cause**: Manifest-listed items weren't created successfully
- **Solution**: Check what's missing (listed in error output). Verify the cloned repo's `.architecture/` contains the expected files.

### Verification Commands

Check installation completeness manually:

```bash
# Required directories (created by script)
test -d .architecture/decisions/adrs && echo "OK ADRs" || echo "MISSING ADRs"
test -d .architecture/reviews && echo "OK reviews" || echo "MISSING reviews"
test -d .architecture/templates && echo "OK templates" || echo "MISSING templates"
test -d .architecture/agent_docs && echo "OK agent_docs" || echo "MISSING agent_docs"

# Created by skill (not script) — may not exist immediately after script
test -f .architecture/members.yml && echo "OK members" || echo "PENDING members"
test -f .architecture/principles.md && echo "OK principles" || echo "PENDING principles"
test -f .architecture/config.yml && echo "OK config" || echo "MISSING config"
```

---

## Recovery

**If installation fails mid-process**:
1. The script cleans up the temp clone directory automatically (exit trap)
2. Remove partial installation: `rm -rf .architecture/` (if nothing important there yet)
3. Re-run the installation script

**If the target project already has `.architecture/`**:
- The script is idempotent — running it again copies templates over existing ones and skips config if it already exists
- Existing `members.yml`, `principles.md`, and reviews are not affected (the script doesn't create them)

---

## Post-Installation

After the script completes successfully, the skill continues with interpretive steps:

1. **Create team** — The skill creates `members.yml` based on project analysis
2. **Create principles** — The skill creates `principles.md` based on detected tech stack
3. **Update CLAUDE.md** — The skill appends framework usage section
4. **Initial analysis** — The skill creates `reviews/initial-system-analysis.md`
5. **Verify setup**: Run `"What's our architecture status?"`
6. **Create first ADR**: Document an early architectural decision

For customization procedures, see [customization-guide.md](./customization-guide.md).
