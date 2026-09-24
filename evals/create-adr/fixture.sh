#!/usr/bin/env bash
# A minimal installed .architecture/: the directories the skill lists and the template it renders.
set -euo pipefail
mkdir -p .architecture/decisions/adrs .architecture/templates
cat > .architecture/templates/adr-template.md <<'MD'
# ADR-XXX: [Title]

## Status
[Proposed | Accepted | Deprecated | Superseded]

## Context
[What is the issue that we're seeing that is motivating this decision or change?]

## Decision Drivers
- [driver 1]

## Decision
[What is the change that we're proposing and/or doing?]

## Consequences
### Positive
- [consequence]
### Negative
- [consequence]
MD
git init -q .
git add -A
git -c user.name=eval -c user.email=eval@example.com commit -qm "fixture"
