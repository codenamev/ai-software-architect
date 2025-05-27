# Claude Code Project Setup Template

This template provides the content that should be appended to a user's project CLAUDE.md file during framework setup.

## Template Content

Add this content to the user's existing CLAUDE.md file:

```markdown
# AI Software Architect Framework Integration

This project uses the AI Software Architect framework for architectural documentation and decision-making.

## Framework Commands

### Setup & Customization
- `Setup .architecture` - Initial setup and customization of the framework
- `Customize architecture` - Refine or update the framework configuration
- `Setup software architect` - Alternative phrasing for initial setup

### Architecture Reviews
- `Start architecture review for version X.Y.Z` - Begin a comprehensive review for a version
- `Start architecture review for 'feature name'` - Review a specific feature or component
- `Review architecture for 'component description'` - Analyze a particular component

### Specialized Reviews
- `Ask Security Architect to review these code changes` - Get security-focused review
- `Have Performance Specialist review this database schema` - Get performance-focused review
- `Ask [Role] Expert if my [topic] follows best practices` - Get domain-specific expertise

### Recalibration
- `Start architecture recalibration for version X.Y.Z` - Plan implementation based on review
- `Recalibrate architecture for 'feature name'` - Create action plan for a feature

### ADR Creation
- `Create an ADR for 'topic'` - Draft an Architectural Decision Record
- `Document architectural decision for 'approach'` - Alternative way to create an ADR

## Framework Structure

The framework uses these directories:
- `.architecture/decisions/` - Architecture Decision Records (ADRs)
- `.architecture/reviews/` - Architecture review documents
- `.architecture/recalibration/` - Post-review action plans
- `.architecture/members.yml` - Architecture team member definitions
- `.architecture/principles.md` - Project architectural principles

Claude will automatically reference these files when making architectural recommendations.
```

## Customization Guidelines

When appending to user's CLAUDE.md:

1. **Preserve Existing Content**: Always append, never replace existing project instructions
2. **Project-Specific Customization**: Replace placeholder technology examples with project-specific ones
3. **Member Role Examples**: Include examples relevant to the detected technology stack
4. **Command Examples**: Tailor examples to the user's project domain

## Technology-Specific Examples

### Web Applications
```markdown
### Example Specialized Reviews for Web Applications
- `Ask Frontend Architect to review this React component structure`
- `Have API Designer review our REST endpoint design`
- `Ask Security Specialist to analyze our authentication flow`
```

### Mobile Applications
```markdown
### Example Specialized Reviews for Mobile Applications
- `Ask iOS Architect to review our Core Data model`
- `Have Performance Expert analyze our memory usage patterns`
- `Ask UX Architect to review our navigation flow`
```

### Backend Services
```markdown
### Example Specialized Reviews for Backend Services
- `Ask Database Architect to review our schema design`
- `Have Scalability Expert analyze our microservice boundaries`
- `Ask DevOps Specialist to review our deployment pipeline`
```

## Integration Notes

- The framework content should be clearly separated from existing project instructions
- Use appropriate headers to distinguish framework commands from project-specific commands
- Include a brief explanation of how the framework enhances their development workflow