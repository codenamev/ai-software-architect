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

1. **Validate** — Refuses (exit 1) a relative or missing project root, and a project whose `.architecture` is a symlink, since every write would go wherever it points.
2. **Choose the source** — Uses the first of:
   - `CLONE_DIR_OVERRIDE`, when set;
   - the checkout the script itself lives in, when no repo URL was given, that checkout carries `.install-manifest`, and the script is that checkout's own `.claude/skills/setup-architect/scripts/install-framework.sh`. A project then gets the same code the skill runs from, so a checkout pinned to a commit installs that commit rather than the repo's current head. The script resolves its checkout's physical path, so this works when the skills directory is a symlink into the checkout. A copy of the skills outside such a checkout (for example in a git-tracked `~/.claude`) never adopts the repository around it, and `GIT_DIR`/`GIT_WORK_TREE` in the environment are ignored;
   - otherwise a shallow clone of the repo URL into a fresh `mktemp -d` directory, `${TMPDIR:-/tmp}/ai-software-architect-XXXXXX`. Without a repo URL this prints a warning that it is installing the default repository's current head, unpinned.

   Warns if no project markers found in the target directory.
3. **Read manifest** — Reads `.install-manifest` from the source to determine what to install.
4. **Copy** — Copies only files and directories listed in the manifest (templates, agent docs).
5. **Create directories** — Creates empty directories listed in the manifest (decisions/adrs, reviews, recalibration, comparisons).
6. **Initialize config** — Copies `templates/config.yml` to `config.yml` if no config exists yet.
7. **Cleanup** — Removes the temporary clone directory on exit (via trap). Never removes `CLONE_DIR_OVERRIDE` or the script's own checkout, and creates no temporary directory when using either.
8. **Verify** — Checks all required directories exist.

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
- `copy: <path>` — Copy file or directory from the source's `.architecture/` to the target `.architecture/`
- `mkdir: <path>` — Create empty directory in target `.architecture/`
- `config: <src> <dst>` — Copy src to dst only if dst doesn't already exist

Paths are relative to `.architecture/`.

---

## Script Interface

```
Usage: install-framework.sh <project-root> [repo-url]

Arguments:
  project-root    Absolute path to the target project root directory
  repo-url        Git repo URL to clone. Without it, the script installs from
                  its own checkout (see Choose the source), and otherwise
                  clones https://github.com/bettison-org/ai-software-architect
                  with an "unpinned" warning. Giving one always clones.

Environment variables:
  CLONE_DIR_OVERRIDE=<path>   Install from this directory instead of the own
                              checkout or a clone (takes precedence over both)

Exit codes:
  0  Success
  1  Clone failed, bad project path, or symlinked .architecture
  2  Copy failed
  3  Manifest not found or malformed
  4  Verification failed (installation incomplete)

Stdout tokens:
  CLONE_OK              Repository cloned successfully
  CLONE_SKIPPED         Skipped (installing from CLONE_DIR_OVERRIDE or the own checkout)
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

**".architecture is a symlink; refusing to install through it" (exit 1)**
- **Cause**: The project's `.architecture` is a symlink, so the install would write wherever it points
- **Solution**: Replace the symlink with a real directory, after checking where it pointed and why

**"installing the current head of … unpinned" (warning)**
- **Cause**: The script isn't running from a framework checkout that carries `.install-manifest` (for example, the skills were copied rather than symlinked from a checkout), so it clones the default repository's current head
- **Solution**: Run the skill from a framework checkout, pinned to the commit you want, or pass the repo URL explicitly if the current head is what you want

**"project-root must be an absolute path" (exit 1)**
- **Cause**: Relative path passed to script
- **Solution**: Use `"$(pwd)"` when invoking the script

**"Manifest not found" (exit 3)**
- **Cause**: The source (`CLONE_DIR_OVERRIDE` or the cloned repo) doesn't contain `.install-manifest`
- **Solution**: The repository may not support manifest-based installation (upstream `codenamev/ai-software-architect` doesn't). Check that you're pointing at the correct repo/branch.

**"Installation incomplete" (exit 4)**
- **Cause**: Manifest-listed items weren't created successfully
- **Solution**: Check what's missing (listed in error output). Verify the source's `.architecture/` contains the expected files.

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
