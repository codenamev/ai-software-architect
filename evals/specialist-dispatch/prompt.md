---
description: A natural request for one specialist's review. Must route to specialist-review and the security-specialist subagent, not the full multi-perspective review.
expected_outcome: specialist-review fires, the security-specialist agent is dispatched, architecture-review is not invoked.
tags: [review, persona]
max_turns: 30
timeout_seconds: 500
allowed_tools: [Read, Glob, Grep, Skill, Agent]
---
Ask the security specialist to review the auth module in src/auth.js. I want their
findings, not a general code review.
