#!/usr/bin/env bash
# install-framework.sh - Deterministic installation of AI Software Architect framework
#
# Manifest-based installation: clones repo to /tmp, copies only files listed
# in .install-manifest, creates empty directories, initialises config.
# Content generation (members.yml, principles.md, initial analysis) is handled
# by the skill's interpretive steps, not this script.
#
# Usage: install-framework.sh <project-root> [repo-url]
#
# Arguments:
#   project-root  Absolute path to the target project root directory
#   repo-url      Git repo URL (default: https://github.com/codenamev/ai-software-architect)
#
# Exit codes:
#   0  Success - all steps completed
#   1  Prerequisites failed (bad arguments, clone failed)
#   2  Copy failed
#   3  Manifest error (missing or malformed)
#   4  Verification failed (installation incomplete)
#
# Stdout: structured status tokens (one per line)
# Stderr: human-readable errors and warnings

set -euo pipefail

PROJECT_ROOT="${1:?Usage: install-framework.sh <project-root> [repo-url]}"
REPO_URL="${2:-https://github.com/codenamev/ai-software-architect}"

# --- Validation ---

if [[ "$PROJECT_ROOT" != /* ]]; then
  echo "ERROR: project-root must be an absolute path: $PROJECT_ROOT" >&2
  exit 1
fi

if [ ! -d "$PROJECT_ROOT" ]; then
  echo "ERROR: project root does not exist: $PROJECT_ROOT" >&2
  exit 1
fi

ARCH_DIR="$PROJECT_ROOT/.architecture"
CLONE_DIR="${CLONE_DIR_OVERRIDE:-/tmp/ai-software-architect-$$}"
MANIFEST_NAME=".install-manifest"

# Clean up temp directory on exit (skip if using override)
cleanup() {
  if [ -z "${CLONE_DIR_OVERRIDE:-}" ] && [ -d "$CLONE_DIR" ]; then
    rm -rf "$CLONE_DIR"
  fi
}
trap cleanup EXIT

# --- Phase 1: Clone ---

clone_repo() {
  # Warn (don't fail) if no project markers found
  local has_marker=false
  for marker in package.json Gemfile requirements.txt go.mod Cargo.toml .git Makefile; do
    if [ -e "$PROJECT_ROOT/$marker" ]; then
      has_marker=true
      break
    fi
  done

  if [ "$has_marker" = false ]; then
    echo "WARNING: No project markers found in $PROJECT_ROOT" >&2
  fi

  # Skip clone if CLONE_DIR_OVERRIDE is set (for testing)
  if [ -n "${CLONE_DIR_OVERRIDE:-}" ]; then
    echo "CLONE_SKIPPED"
    return 0
  fi

  if ! git clone --depth 1 --quiet "$REPO_URL" "$CLONE_DIR" 2>&2; then
    echo "ERROR: Failed to clone $REPO_URL" >&2
    exit 1
  fi

  echo "CLONE_OK"
}

# --- Phase 2: Read manifest and install ---

read_manifest() {
  local manifest="$CLONE_DIR/$MANIFEST_NAME"

  if [ ! -f "$manifest" ]; then
    echo "ERROR: Manifest not found at $manifest" >&2
    echo "ERROR: The repository may not support manifest-based installation" >&2
    exit 3
  fi

  echo "MANIFEST_OK"
}

install_from_manifest() {
  local manifest="$CLONE_DIR/$MANIFEST_NAME"
  local source_arch="$CLONE_DIR/.architecture"
  local copies=0
  local dirs=0
  local configs=0

  mkdir -p "$ARCH_DIR"

  while IFS= read -r line || [ -n "$line" ]; do
    # Skip comments and blank lines
    line="${line%%#*}"
    line="$(echo "$line" | xargs)" # trim whitespace
    [ -z "$line" ] && continue

    local directive="${line%%:*}"
    local args="${line#*: }"

    case "$directive" in
      copy)
        local src="$source_arch/$args"
        if [ ! -e "$src" ]; then
          echo "WARNING: Source not found, skipping: $args" >&2
          continue
        fi
        if [ -d "$src" ]; then
          mkdir -p "$ARCH_DIR/$args"
          cp -r "$src"/* "$ARCH_DIR/$args"/ 2>/dev/null || true
        else
          local dest_dir
          dest_dir="$(dirname "$ARCH_DIR/$args")"
          mkdir -p "$dest_dir"
          cp "$src" "$ARCH_DIR/$args"
        fi
        copies=$((copies + 1))
        ;;
      mkdir)
        mkdir -p "$ARCH_DIR/$args"
        dirs=$((dirs + 1))
        ;;
      config)
        local src_path dest_path
        src_path="$ARCH_DIR/$(echo "$args" | awk '{print $1}')"
        dest_path="$ARCH_DIR/$(echo "$args" | awk '{print $2}')"
        if [ -f "$src_path" ] && [ ! -f "$dest_path" ]; then
          cp "$src_path" "$dest_path"
          configs=$((configs + 1))
          echo "CONFIG_INIT"
        elif [ -f "$dest_path" ]; then
          echo "CONFIG_EXISTS"
        else
          echo "WARNING: Config source not found: $src_path" >&2
          echo "CONFIG_NO_TEMPLATE"
        fi
        ;;
      *)
        echo "WARNING: Unknown manifest directive: $directive" >&2
        ;;
    esac
  done < "$manifest"

  echo "INSTALL_OK:copies=$copies,dirs=$dirs,configs=$configs"
}

# --- Phase 3: Verify ---

verify_installation() {
  local missing=()

  [ -d "$ARCH_DIR/decisions/adrs" ] || missing+=("decisions/adrs")
  [ -d "$ARCH_DIR/reviews" ] || missing+=("reviews")
  [ -d "$ARCH_DIR/recalibration" ] || missing+=("recalibration")
  [ -d "$ARCH_DIR/templates" ] || missing+=("templates")
  [ -d "$ARCH_DIR/agent_docs" ] || missing+=("agent_docs")

  if [ ${#missing[@]} -gt 0 ]; then
    echo "ERROR: Installation incomplete. Missing: ${missing[*]}" >&2
    exit 4
  fi

  # Report what was installed
  local installed=()
  [ -f "$ARCH_DIR/config.yml" ] && installed+=("config.yml")
  [ -d "$ARCH_DIR/templates" ] && installed+=("templates/")
  [ -d "$ARCH_DIR/agent_docs" ] && installed+=("agent_docs/")
  [ -d "$ARCH_DIR/decisions/adrs" ] && installed+=("decisions/adrs/")
  [ -d "$ARCH_DIR/reviews" ] && installed+=("reviews/")
  [ -d "$ARCH_DIR/recalibration" ] && installed+=("recalibration/")
  [ -d "$ARCH_DIR/comparisons" ] && installed+=("comparisons/")

  echo "VERIFY_OK"
  echo "INSTALLED:$(IFS=,; echo "${installed[*]}")"
}

# --- Execute ---

clone_repo
read_manifest
install_from_manifest
verify_installation
