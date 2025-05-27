# Cursor Configuration

This directory contains rule files for the Cursor AI coding assistant to understand and work with the AI Software Architect framework.

## Rules Structure

Cursor uses `.mdc` files in the `.cursor/rules` directory (or in project subdirectories like this one) for providing context. Each rule file follows this format:

```
---
description: Rule Description
globs:
  - "file/path/pattern/**/*.js"
alwaysApply: false
---

The actual rule content that guides Cursor...
```

## Available Rules

- `ai_software_architect_overview.mdc` - High-level overview of the framework
- `ai_software_architect_structure.mdc` - Directory structure and organization  
- `ai_software_architect_usage.mdc` - How to use the framework
- `ai_software_architect_reviews.mdc` - How to conduct architecture reviews
- `ai_software_architect_setup.mdc` - Setup and configuration instructions

## Usage with Cursor

When using Cursor with a project that implements the AI Software Architect framework, you can:

1. Ask for architectural reviews: "Review this architecture using the AI Software Architect framework"
2. Get specialized perspectives: "Analyze this from a security perspective using AI Software Architect"
3. Create architecture documentation: "Create an ADR for this decision using the AI Software Architect format"

## Documentation

For more information on Cursor rules, see the [Cursor documentation](https://docs.cursor.com/context/rules).