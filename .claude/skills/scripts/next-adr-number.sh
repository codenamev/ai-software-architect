#!/usr/bin/env bash
# next-adr-number.sh - Deterministic ADR prefix generation
#
# Reads numbering config from .architecture/config.yml and returns the
# next ADR filename stem prefix (everything before "-<topic-slug>.md").
#
# Usage: next-adr-number.sh <adrs-dir> [topic-slug]
#
# Arguments:
#   adrs-dir    Path to the ADRs directory (e.g., .architecture/decisions/adrs)
#   topic-slug  Optional kebab-case topic for collision detection
#
# Config options (in .architecture/config.yml under adr:):
#   numbering_format:
#     "sequential"               -> ADR-001, ADR-002, ...             (default)
#     "date-based"               -> ADR-20260210, ADR-20260211, ...
#     "date-prefixed-sequential" -> 20260210_ADR-001, ...             (date prefix + sequential number)
#   sequential_format:   Zero-padding pattern, e.g., "000" for 3 digits (default: "000")
#   date_format:         strftime format string, e.g., "%Y%m%d" (default: "%Y%m%d")
#
# The returned value is the full stem prefix; callers append "-<slug>.md".
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
  local line value
  # POSIX character classes ([[:space:]]) and pure-bash trimming — portable
  # across BSD (macOS) and GNU tools, unlike the \s escape.
  if [ -n "$CONFIG_FILE" ] && [ -f "$CONFIG_FILE" ]; then
    line=$(grep -E "^[[:space:]]*${key}:" "$CONFIG_FILE" 2>/dev/null | head -1)
    if [ -n "$line" ]; then
      value="${line#*:}"                          # drop key and first colon
      value="${value%%#*}"                         # drop inline comment
      value="${value#"${value%%[![:space:]]*}"}"   # ltrim whitespace
      value="${value%"${value##*[![:space:]]}"}"   # rtrim whitespace
      case "$value" in                             # strip one layer of quotes
        \"*\") value="${value#\"}"; value="${value%\"}" ;;
        \'*\') value="${value#\'}"; value="${value%\'}" ;;
      esac
      if [ -n "$value" ]; then
        printf '%s' "$value"
        return
      fi
    fi
  fi
  printf '%s' "$default"
}

NUMBERING_FORMAT=$(get_config_value "numbering_format" "sequential")
SEQUENTIAL_FORMAT=$(get_config_value "sequential_format" "000")
DATE_FORMAT=$(get_config_value "date_format" "%Y%m%d")

# --- Helpers ---

# Highest existing ADR-NNN in the directory. Matches the number wherever it
# appears in the filename, so it works for both "ADR-001-*" and date-prefixed
# "20260210_ADR-001-*". Returns 0 when there are no ADRs yet.
highest_adr_number() {
  local highest=0
  if ls -1 "$ADRS_DIR" 2>/dev/null | grep -Eq "ADR-[0-9]+"; then
    highest=$(ls -1 "$ADRS_DIR" | grep -Eo "ADR-[0-9]+" | sed 's/ADR-//' | sort -n | tail -1)
    highest=$((10#${highest}))
  fi
  echo "$highest"
}

next_padded_number() {
  local width=${#SEQUENTIAL_FORMAT}
  if [ "$width" -lt 1 ]; then width=3; fi
  printf "%0${width}d" "$(( $(highest_adr_number) + 1 ))"
}

# --- Generate the full stem prefix ---

case "$NUMBERING_FORMAT" in
  sequential)
    PREFIX="ADR-$(next_padded_number)"
    ;;
  date-based|date_based|datebased)
    PREFIX="ADR-$(date +"$DATE_FORMAT")"
    ;;
  date-prefixed-sequential|date_prefixed_sequential|date-prefixed)
    PREFIX="$(date +"$DATE_FORMAT")_ADR-$(next_padded_number)"
    ;;
  *)
    echo "ERROR: Unknown numbering_format: $NUMBERING_FORMAT" >&2
    echo "ERROR: expected: sequential | date-based | date-prefixed-sequential" >&2
    exit 1
    ;;
esac

# --- Collision detection (topic already used under this prefix) ---

if [ -n "$TOPIC_SLUG" ]; then
  if ls "$ADRS_DIR"/"${PREFIX}"-"${TOPIC_SLUG}"* 1>/dev/null 2>&1; then
    existing=$(ls -1 "$ADRS_DIR"/"${PREFIX}"-"${TOPIC_SLUG}"* 2>/dev/null | head -1)
    echo "ERROR: ADR already exists: $(basename "$existing")" >&2
    echo "ERROR: This is likely a duplicate — review before creating another" >&2
    exit 2
  fi
fi

echo "$PREFIX"
