# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Software Architect is a framework for organizing and structuring software architecture design with support for multiple AI coding assistants. It provides a structured approach to architecture documentation and decision-making, with specialized support for Claude Code, Cursor, and GitHub Copilot/Codex.

## Request Recognition

This framework supports several types of requests from users. Recognize and respond to these patterns:

### Setup Requests
When a user makes requests like "Setup .architecture", "Setup ai-software-architect", "Setup software architect", "Setup architect", "Setup architecture", "Customize architecture", or similar phrases, follow these steps:

1. **Detect Setup Context**
   - Check if `.architecture/` directory exists with the cloned framework files
   - Verify you're running from the user's project root (not from within .architecture)
   - Confirm the user has added the framework reference to their CLAUDE.md

2. **Analyze Target Project**
   - Examine the current directory (user's project) to understand their codebase
   - Identify primary programming languages, frameworks, and architectural patterns
   - Check for existing documentation patterns, package files, and project structure
   - Look for technology-specific files (package.json, requirements.txt, etc.)

3. **Framework Installation**
   - Move the actual framework from `.architecture/.architecture/` to `.architecture/`
   - Create `.coding-assistants/` directory structure in project root
   - **IMPORTANT**: Only append framework usage instructions to CLAUDE.md, NOT the setup instructions
   - Set up initial directory structure for decisions, reviews, and recalibration

4. **Customize for Project**
   - Update `.architecture/members.yml` with roles relevant to their technology stack
   - Modify `.architecture/principles.md` to align with their project's architectural needs
   - Customize templates in `.architecture/templates/` based on their project patterns
   - Create initial ADR structure in `.architecture/decisions/adrs/`

5. **Cleanup & Finalize**
   - Remove template repository files (README.md, USAGE*.md, INSTALL.md, etc.)
   - **CRITICAL**: Remove `.architecture/.git/` directory specifically (never touch project root .git)
   - Remove the now-empty cloned repository structure
   - Verify all framework files are properly located

6. **Guide Next Steps**
   - Explain what customizations you've made and why
   - Show them how to use the framework with their specific project
   - Suggest immediate next steps for architectural documentation
   - Provide examples relevant to their tech stack

### Specific Architect Reviews
When a user requests a review from a specific architect role, such as "Ask Security Architect to review these code changes", "Have Performance Specialist review this database schema", "Get Domain Expert's opinion on this API design", or "Ask Ruby Expert if my use of modules follows industry standards", follow these steps:

1. **Identify the Requested Role**
   - Check `.architecture/members.yml` to see if the requested role exists
   - If the role exists, use its defined specialties and expertise
   - If the role DOES NOT exist:
     - Create a new entry in `.architecture/members.yml` for this role
     - Define appropriate specialties, disciplines, and skillsets for the role
     - Inform the user that you've added this new architecture member

2. **Scope the Review**
   - Focus on the specific code, design, or concept mentioned
   - Apply the specialist lens of the requested architect role
   - Consider industry standards and best practices for that specialty

3. **Structured Response**
   - Begin with an introduction as that architect role
   - Conduct a thorough analysis from that specific perspective
   - Highlight aspects particularly relevant to that specialty
   - Provide specific, actionable recommendations
   - End with a summary of key points from that perspective

4. **Documentation**
   - Offer to document this focused review in `.architecture/reviews/[role]-[topic].md`
   - Follow the specialist section format from the review template

### Full Architecture Reviews
When a user requests a complete architecture review using phrases like "Start architecture review for version X.Y.Z" or "Start architecture review for 'feature name'":

1. **Follow the complete review process** as outlined in the Architecture Reviews section
2. **Include all architecture member perspectives** from the members.yml file
3. **Create a comprehensive review document** in the appropriate format

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

## Response Format For Setup

When a user requests setup using any of the recognized phrases, respond in this format:

1. Brief explanation of what you'll be doing
2. Repository analysis findings (languages, frameworks, patterns)
3. Step-by-step actions you're taking to customize the templates
4. Customization decisions with explanations
5. Next steps and recommendations for using the framework

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
   - Conduct collaborative architectural reviews for new versions or specific features/components
   - Document reviews in `.architecture/reviews` using:
     - Version number format (e.g., `1-0-0.md`) for version reviews
     - Feature name format (e.g., `feature-cli-document-parsing.md`) for feature-specific reviews
   - Reviews provide multi-perspective analysis through specialized architecture members
   - Architecture members are defined in `.architecture/members.yml` with personas, specialties, and domains
   - The review process includes:
     - Individual member review phase (each member reviews independently)
     - Collaborative discussion phase (members confer on findings)
     - Final consolidated report (balanced perspective across all domains)
   - Include findings, recommendations, trade-offs analysis, and improvement suggestions
   - Start a review by requesting phrases like:
     - "Start architecture review for version X.Y.Z"
     - "Start architecture review for 'feature name'"
     - "Review architecture for 'component description'"
6. **Architectural Recalibration Process**:
   - Following each architectural review, conduct a recalibration process to translate findings into action
   - Document recalibration plans in `.architecture/recalibration` using:
     - Version number format (e.g., `0-2-0.md`) for version recalibrations
     - Feature name format (e.g., `feature-cli-document-parsing.md`) for feature-specific recalibrations
   - The recalibration process includes:
     - Review Analysis & Prioritization (categorize and prioritize recommendations)
     - Architectural Plan Update (update ADRs and architectural documentation)
     - Documentation Refresh (ensure documentation reflects new direction)
     - Implementation Roadmapping (create detailed implementation plans)
     - Progress Tracking (monitor implementation progress)
   - Version-to-version comparisons are documented in `.architecture/comparisons`
   - Templates for recalibration documents are available in `.architecture/templates`
   - Start a recalibration by requesting phrases like:
     - "Start architecture recalibration for version X.Y.Z"
     - "Start architecture recalibration for 'feature name'"
     - "Recalibrate architecture for 'component description'"

## Error Handling

If you encounter issues during setup:
- Clearly explain the problem
- Suggest alternative approaches
- Ask for user input when needed
- Never proceed with potentially destructive actions without confirmation

## Dynamic Architecture Member Creation

When creating a new architecture member that doesn't exist in members.yml:

1. **Follow this format for the new entry:**
   ```yaml
   - id: [role_id]
     name: "[Role Name]"
     title: "[Role Title]"
     specialties: 
       - "[specialty 1]"
       - "[specialty 2]"
       - "[specialty 3]"
     disciplines:
       - "[discipline 1]"
       - "[discipline 2]"
       - "[discipline 3]"
     skillsets:
       - "[skill 1]"
       - "[skill 2]"
       - "[skill 3]"
     domains:
       - "[domain 1]"
       - "[domain 2]"
       - "[domain 3]"
     perspective: "[Brief description of this role's perspective]"
   ```

2. **Customize the fields based on the requested role:**
   - Create an appropriate `id` based on the role name (e.g., `ruby_expert`)
   - Fill in specialties relevant to that domain
   - Define disciplines that such an expert would typically have
   - List skillsets common for that role
   - Specify domains of expertise
   - Write a perspective statement describing their unique viewpoint

3. **Examples of specialized roles you might need to create:**
   - Language Experts (Ruby Expert, JavaScript Expert, etc.)
   - Framework Specialists (React Specialist, Rails Architect, etc.) 
   - Domain Specialists (Finance Expert, Healthcare Architect, etc.)
   - Methodology Experts (Agile Architect, DevOps Specialist, etc.)
   - Special Focus Areas (Accessibility Expert, Internationalization Specialist, etc.)

## Specific Configuration Reminder
- Do not create directories for .architecture, .claude, or .coding-assistants. They already exist.