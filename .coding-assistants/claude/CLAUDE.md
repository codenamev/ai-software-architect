# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Software Architect is a framework for organizing and structuring software architecture design with support for multiple AI coding assistants. It provides a structured approach to architecture documentation and decision-making, with specialized support for Claude Code, Cursor, and GitHub Copilot/Codex.

## Key Commands

### Setup and Installation

```bash
# Install dependencies
# TODO: Add specific installation commands
```

### Testing and Linting

```bash
# Run the test suite
# TODO: Add testing commands

# Run linting
# TODO: Add linting commands
```

## Architecture

AI Software Architect follows a modular architecture:

1. **Architecture Documentation**: Central repository of architecture decisions and reviews
   - Stored in `.architecture/` directory
   - Follows a structured format for decisions, reviews, and recalibration
   - Version-controlled with clear naming conventions

2. **Coding Assistant Integration**: Support for multiple AI coding assistants
   - Configurations stored in `.coding-assistants/` directory
   - Each assistant has its own subdirectory with appropriate configuration
   - Shared understanding of architecture across all assistants

## Code Flow

The typical workflow in this codebase is:

1. Create architecture decisions in `.architecture/decisions/`
2. Document architecture reviews in `.architecture/reviews/`
3. Plan recalibration actions in `.architecture/recalibration/`
4. Configure coding assistants in `.coding-assistants/` directory

## Development Guidelines

You are an experienced software architect with expertise in AI-assisted development.

1. **Architectural Documentation**: Store all architectural design documents in the `.architecture` directory, with decisions in `.architecture/decisions` and reviews in `.architecture/reviews`.
2. **Implementation Strategy**: 
   - Implement features in small, concise, and minimally implemented commitable chunks
   - Follow each implementation with a refactor-in-place
   - Ensure each commit is intentional and focused on a single purpose
3. **Architecture References**: Always reference `.architecture/decisions/ArchitectureConsiderations.md` when making architectural decisions.
4. **Architectural Evolution**:
   - Apply rigor and scrutiny to all architectural modifications
   - Consider additions as augmenting rather than replacing existing elements
   - Preserve original architectural vision while extending with new insights
   - Carefully weigh trade-offs of each architectural decision
   - Document rationale for changes in the appropriate architecture review document
   - Maintain backward compatibility with existing architectural principles
   - Distinguish between implementation details and architectural principles
5. **Architecture Reviews**:
   - Conduct collaborative architectural reviews when bumping to a new version
   - Document reviews in `.architecture/reviews` using version number format
   - Reviews provide multi-perspective analysis through specialized architecture members
   - Architecture members are defined in `.architecture/members.yml` with personas, specialties, and domains
   - The review process includes:
     - Individual member review phase (each member reviews independently)
     - Collaborative discussion phase (members confer on findings)
     - Final consolidated report (balanced perspective across all domains)
   - Include findings, recommendations, trade-offs analysis, and improvement suggestions
   - Start a review by requesting "Start architecture review" or similar phrasing
6. **Architectural Recalibration Process**:
   - Following each architectural review, conduct a recalibration process to translate findings into action
   - Document recalibration plans in `.architecture/recalibration` using version number format (e.g., `0-2-0.md`)
   - The recalibration process includes:
     - Review Analysis & Prioritization (categorize and prioritize recommendations)
     - Architectural Plan Update (update ADRs and architectural documentation)
     - Documentation Refresh (ensure documentation reflects new direction)
     - Implementation Roadmapping (create detailed implementation plans)
     - Progress Tracking (monitor implementation progress)
   - Version-to-version comparisons are documented in `.architecture/comparisons`
   - Templates for recalibration documents are available in `.architecture/templates`
   - Start a recalibration by requesting "Start architecture recalibration" or similar phrasing
