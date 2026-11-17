#!/usr/bin/env bash
# A small Node project whose payments code is governed by an ADR the prompt never mentions.
# The ADR's rule (integer cents, round half-up once) is one a model would not apply by
# default, so the with/without delta measures whether the hook changes the code written,
# not whether the agent can quote an ADR.
set -euo pipefail
mkdir -p .architecture/decisions/adrs src/payments
cat > package.json <<'JSON'
{ "name": "shop", "version": "0.1.0", "type": "module" }
JSON
cat > src/payments/charge.js <<'JS'
// Order totals for checkout.
export function orderTotal(lineItems) {
  return lineItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
JS
cat > .architecture/decisions/adrs/ADR-001-money-is-integer-cents.md <<'MD'
---
status: accepted
date: 2026-11-01
affects: [src/payments/**]
---

# ADR-001: Money is integer cents

## Context

Float totals drifted by a cent on refunds and the ledger stopped reconciling.

## Decision

Every amount in `src/payments/` is an integer number of cents. Any percentage or
division rounds once, half-up, to a whole cent with `Math.round`, and the result is
returned as an integer. Never return fractional amounts, never round to two decimal
places (`toFixed`, `Math.round(x * 100) / 100`), and never parse strings into floats.

## Consequences

Callers format for display. Totals reconcile exactly.
MD
