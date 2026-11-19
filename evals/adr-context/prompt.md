---
description: A plain edit to a file an ADR governs. The prompt never mentions ADRs or money rules.
expected_outcome: The adr-context hook names ADR-001 before the edit, and the new code keeps amounts in whole integer cents as ADR-001 requires.
tags: [hooks, adr-context]
max_turns: 15
timeout_seconds: 300
allowed_tools: [Read, Edit, Write, Glob, Grep]
---
Add an `applyDiscount(total, percent)` function to `src/payments/charge.js`. It takes an order total and a percent off and returns the discounted total. Keep it small.
