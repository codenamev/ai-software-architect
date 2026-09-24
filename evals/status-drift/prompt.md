---
description: A natural status question on an install whose framework_version is behind the plugin.
expected_outcome: architecture-status fires and the report names the installed framework version and the ADR count.
tags: [status]
max_turns: 20
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill]
---
What's our architecture status?
