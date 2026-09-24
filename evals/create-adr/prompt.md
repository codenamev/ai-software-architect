---
description: Document a decision as an ADR in an already-installed .architecture/.
expected_outcome: One new ADR-NNN-*.md under .architecture/decisions/adrs/ with the template's required sections.
tags: [adr]
max_turns: 25
timeout_seconds: 400
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---
/create-adr

Document our decision to use PostgreSQL as the primary database. We chose it over
MongoDB because the data is relational, the team already knows SQL, and we want
transactions. Accept it as of today.
