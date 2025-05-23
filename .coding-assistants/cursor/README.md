# Cursor Configuration

This directory contains rule files for the Cursor AI coding assistant to understand and work with the AI Software Architect framework.

## Rules Structure

Cursor uses individual "rule" files for providing context about different aspects of your codebase. Each rule file follows this format:

```
name: Rule Name
description: Rule Description
include: ["file/path/pattern/**/*.js"]
exclude: ["file/path/to/exclude/**/*.js"]
weight: 1.0
---

The actual rule content that guides Cursor...
```

## Available Rules

- `ai_software_architect_overview.rule` - High-level overview of the framework
- `ai_software_architect_structure.rule` - Directory structure and organization
- `ai_software_architect_usage.rule` - How to use the framework
- `ai_software_architect_reviews.rule` - How to conduct architecture reviews

## Usage with Cursor

When using Cursor with a project that implements the AI Software Architect framework, you can:

1. Ask for architectural reviews: "Review this architecture using the AI Software Architect framework"
2. Get specialized perspectives: "Analyze this from a security perspective using AI Software Architect"
3. Create architecture documentation: "Create an ADR for this decision using the AI Software Architect format"

## Documentation

For more information on Cursor rules, see the [Cursor documentation](https://docs.cursor.com/context/rules).