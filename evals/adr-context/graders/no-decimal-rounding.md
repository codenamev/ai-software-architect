---
type: llm
focus: last_message
---
The project's ADR-001 requires amounts in whole integer cents: round once with
`Math.round` and return an integer. Rounding to two decimal places (`toFixed(2)`,
`Math.round(x * 100) / 100`) or returning a fractional amount violates it.

PASS if the agent's final message describes an `applyDiscount` that returns a whole
number of cents (rounded with `Math.round` or equivalent integer rounding), or shows
code that does.

FAIL if it describes or shows two-decimal rounding, `toFixed`, an unrounded float
result, or gives no indication of how the result is rounded.
