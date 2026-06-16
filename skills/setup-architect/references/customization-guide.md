# Customization Guide

This document describes how to customize the AI Software Architect framework for your project's specific technology stack, team, and practices.

## Table of Contents

1. [Customize Architecture Team Members](#customize-architecture-team-members)
2. [Customize Architectural Principles](#customize-architectural-principles)
3. [Update CLAUDE.md Integration](#update-claudemd-integration)
4. [Configuration Options](#configuration-options)

---

## Customize Architecture Team Members

The framework uses a roster of specialized architecture reviewers in `.architecture/members.yml`. Customize this roster based on your project's technology stack.

### Member YAML Structure

See [../assets/member-template.yml](../assets/member-template.yml) for the complete template.

Each member includes:
- `id`: Unique identifier (lowercase, underscores)
- `name`: Display name
- `title`: Role/title
- `specialties`: Array of specialty areas
- `disciplines`: Array of discipline focuses
- `skillsets`: Array of specific skills
- `domains`: Array of domain areas
- `perspective`: Description of unique viewpoint

### Technology Stack-Specific Members

Add specialists based on your detected technology stack:

#### JavaScript/TypeScript Projects

```yaml
- id: javascript_expert
  name: "Alex Rivera"
  title: "JavaScript Expert"
  specialties:
    - "Modern JavaScript/TypeScript"
    - "Frontend architecture"
    - "Build tools"
  disciplines:
    - "Clean code"
    - "Performance"
    - "Cross-browser compatibility"
  skillsets:
    - "ES6+"
    - "Async programming"
    - "Module systems"
  domains:
    - "Web applications"
    - "Node.js backends"
    - "Build pipelines"
  perspective: "Focuses on JavaScript best practices and modern language features"
```

**Additional specialists to consider**:
- React/Vue/Angular Specialist (if using these frameworks)
- Node.js Expert (for backend projects)
- TypeScript Specialist (for TypeScript-heavy projects)

#### Python Projects

```yaml
- id: python_expert
  name: "Dr. Sarah Chen"
  title: "Python Expert"
  specialties:
    - "Python best practices"
    - "Package architecture"
    - "Type hints and mypy"
  disciplines:
    - "Pythonic code"
    - "Testing patterns"
    - "Performance optimization"
  skillsets:
    - "Modern Python (3.10+)"
    - "Async/await"
    - "Data structures"
  domains:
    - "Backend services"
    - "Data processing"
    - "API development"
  perspective: "Advocates for clean, Pythonic solutions following PEP guidelines"
```

**Additional specialists**:
- Django/Flask/FastAPI Specialist (based on framework)
- Data Engineering Specialist (for data-heavy projects)
- ML/AI Specialist (for ML projects)

#### Ruby Projects

```yaml
- id: ruby_expert
  name: "Marcus Johnson"
  title: "Ruby Expert"
  specialties:
    - "Ruby idioms"
    - "Metaprogramming"
    - "Rails patterns"
  disciplines:
    - "Convention over configuration"
    - "DRY principles"
    - "Expressive code"
  skillsets:
    - "Ruby 3.x features"
    - "Rails architecture"
    - "Gem development"
  domains:
    - "Web applications"
    - "API services"
    - "Background jobs"
  perspective: "Emphasizes Ruby's elegance and Rails conventions for rapid development"
```

**Additional specialists**:
- Rails Architect (for Rails projects)
- Ruby Performance Specialist (for high-traffic applications)

#### Java Projects

```yaml
- id: java_expert
  name: "Jennifer Park"
  title: "Java Expert"
  specialties:
    - "Enterprise Java"
    - "Design patterns"
    - "JVM optimization"
  disciplines:
    - "Object-oriented design"
    - "SOLID principles"
    - "Clean architecture"
  skillsets:
    - "Modern Java (17+)"
    - "Spring ecosystem"
    - "Microservices"
  domains:
    - "Enterprise applications"
    - "Distributed systems"
    - "Cloud services"
  perspective: "Focuses on maintainable enterprise patterns and modern Java practices"
```

**Additional specialists**:
- Spring Boot Specialist
- Microservices Architect

#### Go Projects

```yaml
- id: go_expert
  name: "Dmitri Ivanov"
  title: "Go Expert"
  specialties:
    - "Idiomatic Go"
    - "Concurrency patterns"
    - "Service architecture"
  disciplines:
    - "Simplicity"
    - "Composition over inheritance"
    - "Clear error handling"
  skillsets:
    - "Goroutines and channels"
    - "Standard library"
    - "Performance profiling"
  domains:
    - "Microservices"
    - "Cloud-native applications"
    - "CLI tools"
  perspective: "Advocates for Go's simplicity philosophy and effective concurrency"
```

**Additional specialists**:
- Microservices Architect
- Cloud-Native Specialist

#### Rust Projects

```yaml
- id: rust_expert
  name: "Katya Volkov"
  title: "Rust Expert"
  specialties:
    - "Memory safety"
    - "Zero-cost abstractions"
    - "Systems programming"
  disciplines:
    - "Ownership and borrowing"
    - "Type-driven design"
    - "Performance optimization"
  skillsets:
    - "Rust idioms"
    - "Async Rust"
    - "Unsafe code"
  domains:
    - "Systems software"
    - "Performance-critical code"
    - "Embedded systems"
  perspective: "Emphasizes Rust's safety guarantees and performance characteristics"
```

**Additional specialists**:
- Systems Programmer
- Performance Specialist (Rust-specific)

### Editing Members

**To add a member**:
1. Copy the template from `assets/member-template.yml`
2. Fill in all fields appropriately
3. Add to `.architecture/members.yml` in the `members:` array
4. Choose a unique `id` (use lowercase with underscores)

**To remove a member**:
1. Delete their entry from `.architecture/members.yml`
2. They won't appear in future reviews

**To modify a member**:
1. Edit their entry in `.architecture/members.yml`
2. Changes apply to all future reviews

### Core Members (Keep These)

These canonical core members must remain for all projects (the 8 defined in the framework's `.architecture/members.yml`):
- **Systems Architect**: Overall architecture coherence
- **Domain Expert**: Business domain representation
- **Security Specialist**: Security analysis
- **Performance Specialist**: Performance and scalability
- **Maintainability Expert**: Code quality and technical debt
- **Implementation Strategist**: Change sequencing, blast radius, reversibility
- **AI Engineer**: AI/ML integration and observability
- **Pragmatic Enforcer**: YAGNI enforcement (if pragmatic mode enabled)

**Add technology specialists, don't replace core members.**

---

## Customize Architectural Principles

The framework's architectural principles in `.architecture/principles.md` should be augmented with framework/technology-specific principles.

### Framework-Specific Principles

Add principles specific to your project's frameworks:

#### React Projects

**Component Composition**:
- Favor composition over inheritance
- Build reusable, focused components
- Use children props for flexibility

**State Management**:
- Lift state only when necessary
- Use context for cross-cutting concerns
- Consider state management libraries for complex state

**Hooks Best Practices**:
- Follow Rules of Hooks
- Custom hooks for reusable logic
- useEffect dependencies matter

**Props Down, Events Up**:
- Data flows down via props
- Changes flow up via callbacks
- Unidirectional data flow

#### Rails Projects

**Convention Over Configuration**:
- Follow Rails conventions
- Don't fight the framework
- Configure only when necessary

**DRY (Don't Repeat Yourself)**:
- Extract common code
- Use concerns and modules
- Avoid duplication across models/controllers

**Fat Models, Skinny Controllers**:
- Business logic in models
- Controllers orchestrate only
- Keep views logic-free

**RESTful Design**:
- Use resourceful routing
- Standard CRUD patterns
- Nested resources where appropriate

#### Django Projects

**Explicit Over Implicit**:
- Make behavior clear
- Avoid magic
- Prefer explicit configuration

**Reusable Apps**:
- Design apps to be reusable
- Clear boundaries and interfaces
- Minimal coupling between apps

**Use Built-In Features**:
- Leverage Django's admin
- Use ORM effectively
- Don't reinvent wheels

**Template Inheritance**:
- Base templates for layouts
- Block-based composition
- DRY template code

### Adding Custom Principles

**Format**:
```markdown
## [Principle Number]. [Principle Name]

[Description of the principle and why it matters]

**In Practice**:
- [Specific application 1]
- [Specific application 2]
- [Specific application 3]

**Anti-patterns to Avoid**:
- [Anti-pattern 1]
- [Anti-pattern 2]

**Examples**:
[Code examples showing the principle in action]
```

**Where to add**:
- Append to `.architecture/principles.md`
- After the core principles (Livable Code, Clarity over Cleverness, etc.)
- Before any project-specific principles

---

## Update CLAUDE.md Integration

If your project has a `CLAUDE.md` file for Claude Code integration, append framework usage instructions.

### Template

Add this section to your project's `CLAUDE.md`:

```markdown
## AI Software Architect Framework

This project uses the AI Software Architect framework for architectural decision tracking and reviews.

### Available Commands

- **Create ADR**: "Create ADR for [decision]"
- **Architecture Review**: "Start architecture review for version X.Y.Z"
- **Specialist Review**: "Ask [specialist role] to review [target]"
- **Implementation**: "Implement [feature] as the architects"
- **List Members**: "List architecture members"
- **Status**: "What's our architecture status?"

### Documentation

All architecture documentation is in `.architecture/`:
- **ADRs**: `.architecture/decisions/adrs/`
- **Reviews**: `.architecture/reviews/`
- **Principles**: `.architecture/principles.md`
- **Team**: `.architecture/members.yml`
```

### Important Notes

**Do NOT include**:
- Setup instructions (setup is one-time)
- Framework internals
- Implementation details

**DO include**:
- Usage commands
- Where to find documentation
- How to invoke skills

### Location

Append to `CLAUDE.md` in project root (if it exists). If `CLAUDE.md` doesn't exist, you can create it or skip this step.

---

## Configuration Options

The framework's behavior is controlled via `.architecture/config.yml`.

### Pragmatic Mode

```yaml
pragmatic_mode:
  enabled: true
  intensity: balanced  # strict | balanced | lenient
  applies_to:
    - reviews
    - adrs
    - implementation
  exemptions:
    - security
    - compliance
    - accessibility
    - data_loss_prevention
```

**Intensity levels**:
- `strict`: Ratio target <1.0 (complexity < necessity)
- `balanced`: Ratio target <1.5 (moderate complexity acceptable)
- `lenient`: Ratio target <2.0 (strategic complexity tolerated)

**When to enable**:
- **Strict**: MVP, tight timeline, small team
- **Balanced**: Normal development, sustainable pace
- **Lenient**: Platform building, long-term projects

### Implementation Guidance

```yaml
implementation:
  enabled: true
  methodology: TDD  # TDD | BDD | DDD | Test-Last | Exploratory
  influences:
    - "Kent Beck - TDD by Example"
    - "Sandi Metz - POODR"
  languages:
    ruby:
      style_guide: "Rubocop"
      test_framework: "RSpec"
    javascript:
      style_guide: "Airbnb"
      test_framework: "Jest"
```

**Usage**:
When you say "Implement [feature] as the architects", the framework applies this methodology automatically.

### Review Configuration

```yaml
reviews:
  frequency:
    major_versions: required
    features: optional
    regular: quarterly
  auto_track_actions: true
  require_success_metrics: true
```

---

## Customization Checklist

After installation, customize:

- [ ] Add technology-specific members to `.architecture/members.yml`
- [ ] Add framework-specific principles to `.architecture/principles.md`
- [ ] Update `.architecture/config.yml` with team preferences
- [ ] Append framework usage to `CLAUDE.md` (if exists)
- [ ] Review and adjust pragmatic mode settings
- [ ] Configure implementation methodology (if using)
- [ ] Run initial system analysis
- [ ] Verify setup with "What's our architecture status?"

---

## Best Practices

**Do**:
- Customize based on actual project needs
- Add specialists for primary technologies
- Keep core members (Systems, Domain, Security, etc.)
- Tailor principles to your stack
- Enable pragmatic mode appropriately

**Don't**:
- Add every possible specialist (overwhelms reviews)
- Remove core members (they provide essential perspectives)
- Copy principles verbatim without customization
- Enable strict pragmatic mode for established projects
- Skip initial analysis (provides valuable baseline)

For the initial analysis template, see [../assets/initial-analysis-template.md](../assets/initial-analysis-template.md).
