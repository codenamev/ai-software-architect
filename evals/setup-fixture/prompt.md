---
description: The primary install path. A user runs the setup skill in a fresh Node project.
expected_outcome: A populated .architecture/ directory with members.yml and config.yml.
tags: [install, setup]
max_turns: 40
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---
/setup-architect

Set up the AI Software Architect framework in this project. It is a small Node.js
service; pick sensible defaults and do not ask me questions.
