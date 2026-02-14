#!/usr/bin/env bash
# next-adr-number.sh - Deterministic ADR prefix generation
#
# Reads numbering config from .architecture/config.yml and returns the
# next ADR prefix. Supports sequential (zero-padded) and date-based
# (strftime format) numbering.
#
# Usage: next-adr-number.sh <adrs-dir> [topic-slug]
#
# Arguments:
#   adrs-dir    Path to the ADRs directory (e.g., .architecture/decisions/adrs)
#   topic-slug  Optional kebab-case topic for collision detection
#
# Config options (in .architecture/config.yml under adr:):
#   numbering_format:    "sequential" (default) or "date-based"
#   sequential_format:   Zero-padding pattern, e.g., "000" for 3 digits (default: "000")
#   date_format:         strftime format string, e.g., "%Y%m%d" (default: "%Y%m%d")
#
# Exit codes:
#   0  Success - prefix written to stdout
#   1  Config error or bad arguments
#   2  Collision detected (existing ADR with same prefix and topic)

set -euo pipefail

ADRS_DIR="${1:?Usage: next-adr-number.sh <adrs-dir> [topic-slug]}"
TOPIC_SLUG="${2:-}"

# Validate ADRs directory exists
if [ ! -d "$ADRS_DIR" ]; then
  echo "ERROR: ADR directory not found: $ADRS_DIR" >&2
  exit 1
fi

# Find config.yml relative to adrs-dir
# Expected: .architecture/decisions/adrs -> .architecture/config.yml
CONFIG_FILE=""
candidate="$(cd "$ADRS_DIR" && pwd)"
# Walk up looking for config.yml alongside a decisions/ dir
for _ in 1 2 3 4; do
  candidate="$(dirname "$candidate")"
  if [ -f "$candidate/config.yml" ] && [ -d "$candidate/decisions" ]; then
    CONFIG_FILE="$candidate/config.yml"
    break
  fi
done

# --- Read config values ---
# Simple grep-based extraction — avoids YAML parser dependency

get_config_value() {
  local key="$1"
  local default="$2"
  if [ -n "$CONFIG_FILE" ] && [ -f "$CONFIG_FILE" ]; then
    local value
    value=$(grep -E "^\s*${key}:" "$CONFIG_FILE" 2>/dev/null | head -1 | sed 's/^[^:]*:\s*//' | sed 's/\s*#.*//' | sed 's/^["'"'"']//' | sed 's/["'"'"']$//' | tr -d '[:space:]')
    if [ -n "$value" ]; then
      echo "$value"
      return
    fi
  fi
  echo "$default"
}

NUMBERING_FORMAT=$(get_config_value "numbering_format" "sequential")
SEQUENTIAL_FORMAT=$(get_config_value "sequential_format" "000")
DATE_FORMAT=$(get_config_value "date_format" "%Y%m%d")

# --- Generate prefix ---

generate_sequential_prefix() {
  local format="$1"

  # Count zeros to determine padding width
  local width=${#format}
  if [ "$width" -lt 1 ]; then
    width=3
  fi

  # Find highest existing ADR number
  local highest=0
  if ls "$ADRS_DIR"/ADR-* 1>/dev/null 2>&1; then
    highest=$(ls -1 "$ADRS_DIR" | grep -Eo "^ADR-[0-9]+" | sed 's/ADR-//' | sort -n | tail -1)
    # Strip leading zeros for arithmetic
    highest=$((10#${highest}))
  fi

  local next=$((highest + 1))
  printf "%0${width}d" "$next"
}

generate_date_prefix() {
  local fmt="$1"
  date +"$fmt"
}

# --- Main ---

case "$NUMBERING_FORMAT" in
  sequential)
    PREFIX=$(generate_sequential_prefix "$SEQUENTIAL_FORMAT")
    ;;
  date-based|date_based|datebased)
    PREFIX=$(generate_date_prefix "$DATE_FORMAT")
    ;;
  *)
    echo "ERROR: Unknown numbering_format: $NUMBERING_FORMAT (expected: sequential or date-based)" >&2
    exit 1
    ;;
esac

# --- Collision detection ---

if [ -n "$TOPIC_SLUG" ]; then
  # Check for existing file with same prefix and topic
  if ls "$ADRS_DIR"/ADR-"${PREFIX}"-"${TOPIC_SLUG}"* 1>/dev/null 2>&1; then
    existing=$(ls -1 "$ADRS_DIR"/ADR-"${PREFIX}"-"${TOPIC_SLUG}"* 2>/dev/null | head -1)
    echo "ERROR: ADR already exists: $(basename "$existing")" >&2
    echo "ERROR: This is likely a duplicate — review before creating another" >&2
    exit 2
  fi
fi

echo "$PREFIX"
