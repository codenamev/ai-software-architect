#!/usr/bin/env bash
# An installed .architecture/ pinned to an old framework version, with two ADRs and no reviews.
set -euo pipefail
mkdir -p .architecture/decisions/adrs .architecture/reviews
cat > .architecture/config.yml <<'YML'
# Version tracking
version:
  # Current framework version
  framework_version: "1.2.0"
  architecture_version: "0.1.0"
YML
cat > .architecture/members.yml <<'YML'
members:
  - id: systems_architect
    name: "Systems Architect"
    title: "Systems Architect"
YML
cat > .architecture/decisions/adrs/ADR-001-use-postgresql.md <<'MD'
# ADR-001: Use PostgreSQL

## Status
Accepted

## Context
We need a relational store.

## Decision
PostgreSQL.

## Consequences
Operational familiarity; one more service to run.
MD
cat > .architecture/decisions/adrs/ADR-002-adopt-event-sourcing.md <<'MD'
# ADR-002: Adopt event sourcing for orders

## Status
Proposed

## Context
Order history must be auditable.

## Decision
Append-only order events with projections.

## Consequences
Auditability; more moving parts.
MD
