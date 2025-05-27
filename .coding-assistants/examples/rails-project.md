# Example: Ruby on Rails Project Configuration

This example shows how the AI Software Architect framework should be configured for a Ruby on Rails application project.

## Project Context

**Technology Stack:**
- Ruby on Rails 7.1
- PostgreSQL database
- Redis for caching and background jobs
- Sidekiq for background processing
- RSpec for testing
- Rubocop for code quality
- Hotwire (Turbo + Stimulus) for frontend

## Customized Architecture Members

The framework should customize `.architecture/members.yml` to include Rails-specific roles:

```yaml
architecture_members:
  - id: rails_architect
    name: "David Kim"
    title: "Rails Architect"
    specialties:
      - "Rails application patterns"
      - "ActiveRecord design"
      - "Service object patterns"
    disciplines:
      - "Backend Architecture"
      - "Database Design"
      - "API Design"
    skillsets:
      - "Ruby/Rails"
      - "PostgreSQL"
      - "RESTful APIs"
    domains:
      - "Web Applications"
      - "MVC Architecture"
      - "Database Systems"
    perspective: "Ensures Rails applications follow conventions while maintaining clean architecture"

  - id: ruby_expert
    name: "Jessica Park"
    title: "Ruby Expert"
    specialties:
      - "Ruby idioms and patterns"
      - "Object-oriented design"
      - "Code quality and style"
    disciplines:
      - "Software Craftsmanship"
      - "Code Review"
      - "Refactoring"
    skillsets:
      - "Ruby language expertise"
      - "Design patterns"
      - "Code analysis tools"
    domains:
      - "Programming Languages"
      - "Software Design"
      - "Code Quality"
    perspective: "Focuses on writing idiomatic Ruby code that is maintainable and expressive"

  - id: database_architect
    name: "Carlos Martinez"
    title: "Database Architect"
    specialties:
      - "Database schema design"
      - "Query optimization"
      - "Data modeling"
    disciplines:
      - "Database Design"
      - "Performance Optimization"
      - "Data Architecture"
    skillsets:
      - "PostgreSQL"
      - "ActiveRecord"
      - "Database indexing"
    domains:
      - "Database Systems"
      - "Data Persistence"
      - "Performance Engineering"
    perspective: "Optimizes data storage and retrieval for Rails applications"
```

## Customized Principles

The framework should update `.architecture/principles.md` for Rails projects:

```markdown
# Rails Project Architecture Principles

## Rails Conventions
1. **Convention over Configuration**: Follow Rails conventions unless there's a compelling reason not to
2. **Fat Models, Skinny Controllers**: Keep business logic in models, controllers should orchestrate
3. **DRY (Don't Repeat Yourself)**: Extract common functionality into modules and concerns
4. **RESTful Design**: Use RESTful routing and resource-oriented design

## Code Organization
1. **Service Objects**: Extract complex business logic into service objects
2. **Concerns**: Use concerns for shared behavior across models/controllers
3. **Form Objects**: Use form objects for complex form handling
4. **Presenters**: Use presenter objects for view-specific logic

## Database Design
1. **Normalized Schema**: Design normalized database schemas
2. **Foreign Key Constraints**: Use database-level constraints for data integrity
3. **Indexing Strategy**: Index frequently queried columns and foreign keys
4. **Migration Safety**: Write reversible and safe database migrations

## Testing
1. **Test-Driven Development**: Write tests before implementation
2. **Model Testing**: Thoroughly test model validations and business logic
3. **Request Testing**: Test controller behavior and routing
4. **Feature Testing**: Test complete user workflows
```

## Example Commands

### Claude Code Commands
```
Ask Rails Architect to review this ActiveRecord model design
Have Database Architect analyze our schema migration strategy
Ask Ruby Expert if my use of modules follows best practices
Create an ADR for our Rails service object patterns
Start architecture review for our Rails e-commerce platform
```

### Cursor Commands
```
Review this Rails controller architecture
Analyze this ActiveRecord association design
Create an ADR for our Rails background job strategy
Evaluate this Rails API design
```

### Codex/Copilot Commands
```
Review this Rails model for best practices
Generate a Rails service object following our patterns
Refactor this controller to follow Rails conventions
How should I structure this Rails feature?
```

## Example ADRs

The framework should help create Rails-specific ADRs:

### ADR: Service Object Pattern
```markdown
# ADR-001: Service Object Pattern for Complex Business Logic

## Status
Accepted

## Context
Our Rails controllers are becoming fat with complex business logic that spans multiple models.

## Decision
- Implement service objects for complex business operations
- Place service objects in `app/services/` directory
- Use a consistent interface: `call` method returns a result object
- Include error handling and validation within service objects

## Consequences
- Controllers remain thin and focused on HTTP concerns
- Business logic is testable in isolation
- Complex operations are encapsulated and reusable
- Consistent pattern across the application
```

## Technology-Specific Examples

### Model Design Review
```
"Ask Rails Architect to review our User model associations and validations"
```

### Database Performance Analysis
```
"Have Database Architect analyze our ActiveRecord queries for N+1 problems"
```

### Code Quality Assessment
```
"Ask Ruby Expert to review our use of Rails concerns and modules"
```

### Service Architecture
```
"Create an ADR for our Rails API authentication and authorization strategy"
```

## Integration Points

The framework should reference:
- **Gemfile** for dependency management and technology detection
- **config/routes.rb** for routing architecture
- **db/schema.rb** for database structure
- **app/models/** for ActiveRecord patterns
- **config/application.rb** for Rails configuration
- **.rubocop.yml** for code style standards

This ensures architecture recommendations align with Rails conventions and the project's specific configuration choices.