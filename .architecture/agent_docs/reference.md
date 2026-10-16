# Agent Reference - Advanced Topics

This document covers advanced framework features, pragmatic mode details, and troubleshooting guidance.

**👉 For framework overview, see [../../AGENTS.md](../../AGENTS.md)**

---

## Table of Contents

- [Pragmatic Guard Mode](#pragmatic-guard-mode)
- [Architecture Recalibration](#architecture-recalibration)
- [Advanced Configuration](#advanced-configuration)
- [Cross-Assistant Compatibility](#cross-assistant-compatibility)
- [Troubleshooting Guide](#troubleshooting-guide)

---

## Pragmatic Guard Mode

### Overview

Pragmatic Guard Mode adds a specialized "Pragmatic Enforcer" architect who actively challenges complexity, questions abstractions, and pushes for the simplest solutions that meet current requirements.

**Purpose**: Guard against over-engineering and ensure YAGNI (You Aren't Gonna Need It) principles are applied.

### Enabling Pragmatic Mode

**Command Pattern:**
```
Enable pragmatic mode
Turn on YAGNI enforcement
Activate simplicity guard
Challenge complexity
```

**Manual Configuration** (`.architecture/config.yml`):
```yaml
pragmatic_mode:
  enabled: true
  intensity: balanced  # strict | balanced | lenient
```

### Intensity Levels

#### Strict Mode
- Challenges aggressively
- Requires strong justification for any complexity
- Questions every "should" and "could"
- Pushes for absolute minimal implementation
- Default to defer/simplify

**Use When:**
- Starting new projects
- High risk of over-engineering
- Limited resources/time
- Proof-of-concept phase

#### Balanced Mode (Recommended)
- Challenges thoughtfully
- Accepts justified complexity
- Seeks middle ground between simplicity and best practices
- Questions "should" but accepts reasonable "must"

**Use When:**
- Most production projects
- Balancing quality and pragmatism
- Team with mixed experience levels
- Evolving requirements

#### Lenient Mode
- Raises concerns without blocking
- Suggests alternatives as options
- Focuses on major complexity additions only
- Questions significant departures from simplicity

**Use When:**
- Well-established projects
- Experienced team
- Complex domain requires sophistication
- High confidence in requirements

### How Pragmatic Enforcer Works

The Pragmatic Enforcer participates in reviews and ADR creation, asking:

**Necessity Questions:**
- "Do we need this right now?"
- "What breaks without it?"
- "What evidence supports this need?"

**Simplicity Questions:**
- "What's the simplest thing that could work?"
- "Can we do this with less code?"
- "Do we already have something that solves this?"

**Cost Questions:**
- "What's the cost of implementing now?"
- "What's the cost of waiting?"
- "What's the maintenance burden?"

**Alternative Questions:**
- "What if we just...?" (simpler alternative)
- "Could we use an existing tool?"
- "Can we defer this until we have more information?"

**Best Practice Questions:**
- "Does this best practice apply to our context?"
- "Is this over-engineering for our scale?"
- "Are we solving a problem we don't have yet?"

### Pragmatic Analysis Format

When analyzing recommendations, the Pragmatic Enforcer provides:

```markdown
### Pragmatic Enforcer Analysis

**Mode**: [Strict | Balanced | Lenient]

**Necessity Assessment**: [Score 0-10]
- Current need: [Analysis]
- Future need: [Analysis]
- Cost of waiting: [Analysis]

**Complexity Assessment**: [Score 0-10]
- Added complexity: [Details]
- Maintenance burden: [Details]
- Learning curve: [Details]

**Simpler Alternative**:
[Concrete proposal]

**Recommendation**: [Implement now | Simplified version | Defer | Skip]

**Justification**: [Clear reasoning]
```

### Exemptions

Pragmatic mode respects certain exemptions where best practices must be maintained:

**Security-Critical Features** (Always Full Rigor):
- Authentication and authorization
- Encryption and data protection
- Input validation and sanitization
- Security logging and monitoring

**Data Integrity** (Never Compromise):
- Database transactions
- Data validation
- Backup strategies
- Recovery procedures

**Compliance Requirements** (Full Implementation):
- GDPR, HIPAA, PCI-DSS
- Audit logging
- Legal requirements
- Industry regulations

**Accessibility** (Proper Implementation):
- WCAG compliance
- Screen reader support
- Keyboard navigation
- Inclusive design

### Deferral Tracking

When complexity is deferred, the Pragmatic Enforcer documents:

**Trigger Conditions**: When to implement the full solution
- User count threshold
- Performance metrics
- Feature adoption
- Business requirements

**Minimal Viable Alternative**: What to implement now
- Simplest working solution
- Meets current requirements
- Easy to understand and maintain

**Migration Path**: How to evolve later
- Clear upgrade path
- Minimal breaking changes
- Incremental enhancement

Deferrals tracked in: `.architecture/deferrals.md`

---

## Architecture Recalibration

### Overview

Recalibration translates architecture review findings into actionable implementation plans.

**Purpose**: Bridge gap between architectural analysis and concrete action.

### Requesting Recalibration

**Command Pattern:**
```
Start architecture recalibration for version X.Y.Z
Start architecture recalibration for [feature name]
Recalibrate architecture for [component]
```

### Recalibration Process

**Phase 1: Review Analysis & Prioritization**
- Categorize recommendations
- Prioritize by impact and urgency
- Identify dependencies
- Assign owners
- Stamp a disposition on each consumed finding in the review document (`accepted`, `rejected: <reason>`, `deferred: <trigger>`)

**Phase 2: Architectural Plan Update**
- Create or update ADRs
- Document decisions
- Update architectural documentation
- Clarify principles

**Phase 3: Documentation Refresh**
- Update AGENTS.md if needed
- Refresh architecture diagrams
- Update configuration
- Clarify conventions

**Phase 4: Implementation Roadmapping**
- Create detailed implementation plan
- Define milestones
- Estimate effort
- Identify risks

**Phase 5: Progress Tracking**
- Monitor implementation
- Track completion
- Adjust based on learnings
- Document outcomes

### Output

Recalibration produces:
- Prioritized action items table
- Disposition tally per reviewer (feeds `members.yml` tuning)
- ADR creation schedule
- Implementation roadmap
- Timeline with phases
- Success metrics

Document location: `.architecture/recalibration/[version-or-feature].md`

---

## Advanced Configuration

### Fine-Tuning Pragmatic Mode

**Triggers Configuration:**

```yaml
pragmatic_mode:
  triggers:
    new_abstraction_layer: true      # Challenge new interfaces, base classes
    new_dependency: true              # Challenge new libraries, frameworks
    new_pattern_introduction: true    # Challenge design patterns
    scope_expansion: true             # Challenge feature creep
    performance_optimization: true    # Challenge premature optimization
    test_infrastructure: true         # Challenge comprehensive tests upfront
    flexibility_addition: true        # Challenge feature flags, plugin systems
```

**Thresholds Configuration:**

```yaml
pragmatic_mode:
  thresholds:
    min_complexity_score: 5           # Challenge if complexity ≥ 5
    min_necessity_score: 7            # Must be clearly necessary (≥ 7)
    max_complexity_ratio: 1.5         # Complexity / Necessity must be ≤ 1.5
```

**Behavioral Configuration:**

```yaml
pragmatic_mode:
  behavior:
    require_justification: true          # Proactive justification required
    always_propose_alternative: true     # Always suggest simpler option
    show_cost_of_waiting: true          # Include deferral analysis
    track_deferrals: true               # Log deferred decisions
    deferral_log: .architecture/deferrals.md
```

### Review Process Configuration

```yaml
review_process:
  require_all_members: true             # All members must review
  max_individual_phase_days: 3          # Timeline guidance
  max_collaborative_phase_days: 2       # Timeline guidance
```

### ADR Configuration

```yaml
adr:
  numbering_format: sequential          # or date-based
  require_alternatives: true            # Must document alternatives
  require_validation: true              # Must include validation criteria
```

### Member Configuration

```yaml
members:
  definition_file: members.yml          # Path to members definition
  allow_dynamic_creation: true          # Can add members during reviews
```

---

## Cross-Assistant Compatibility

### Cursor Integration

Configure via `.coding-assistants/cursor/`:
- Custom rules for architecture operations
- Tab completion and inline suggestions
- Integration with Cursor's composer

**See**: `.coding-assistants/cursor/README.md`

### GitHub Copilot / Codex Integration

Configure via `.coding-assistants/codex/`:
- Comment-triggered operations
- Inline suggestions for ADRs and reviews

**See**: `.coding-assistants/codex/README.md`

### Universal Features

The framework works with any AI assistant that can:
- Read markdown files
- Follow structured instructions
- Create and edit files
- Use templates in `.architecture/templates/`

---

## Troubleshooting Guide

### Documentation Issues

**Issue**: Cannot find detailed procedures
- **Solution**: Check `agent_docs/workflows.md` for step-by-step guides

**Issue**: Instructions seem outdated
- **Solution**: Update framework (see `agent_docs/workflows.md#update-procedures`)

**Issue**: Too much/too little detail
- **Solution**: Progressive disclosure - start with AGENTS.md, dive deeper as needed

### Configuration Issues

**Issue**: Pragmatic mode not working
- **Check**: `.architecture/config.yml` has `pragmatic_mode.enabled: true`
- **Check**: Intensity level appropriate for your needs

**Issue**: Wrong architecture members in reviews
- **Solution**: Customize `.architecture/members.yml` for your project

**Issue**: Implementation methodology not applied
- **Check**: `.architecture/config.yml` has `implementation.enabled: true`
- **Check**: Methodology and influences configured

### Performance Issues

**Issue**: AI assistant seems slow or confused
- **Possible Cause**: Instruction capacity exceeded
- **Solution**: Ensure documentation follows progressive disclosure pattern
- **See**: [ADR-005](../decisions/adrs/ADR-005-llm-instruction-capacity-constraints.md)

**Issue**: AI provides generic responses
- **Possible Cause**: Not reading framework files
- **Solution**: Explicitly reference files (e.g., "Check .architecture/principles.md")

### Workflow Issues

**Issue**: Setup creates wrong structure
- **Check**: Running from project root, not inside `.architecture/`
- **Check**: Installation method matches your environment

**Issue**: Reviews incomplete or missing perspectives
- **Check**: All members defined in `.architecture/members.yml`
- **Check**: `review_process.require_all_members` setting

**Issue**: ADRs not following template
- **Check**: Template exists at `.architecture/templates/adr-template.md`
- **Check**: ADR configuration in `.architecture/config.yml`

### Git and Version Control Issues

**Issue**: Framework updates overwrite customizations
- **Cause**: Update process not preserving custom files
- **Solution**: Follow update procedures in `agent_docs/workflows.md#update-procedures`
- **Prevention**: Keep customizations in designated files (members.yml, config.yml)

**Issue**: Merge conflicts in architecture files
- **Solution**: Architecture files should rarely conflict
- **Strategy**: Reviews and ADRs are append-only (new files)
- **Strategy**: Configuration changes should be coordinated

### Integration Issues

**Issue**: Claude Skills not found
- **Check**: Skills installed in `~/.claude/skills/`
- **Solution**: Reinstall using setup procedures

**Issue**: MCP server not responding
- **Check**: MCP server installed (`npm list -g ai-software-architect`)
- **Check**: Configuration in `claude_desktop_config.json`
- **Solution**: Restart Claude Code after configuration changes

---

## Best Practices

### For Reviews

1. **Request reviews early**: Don't wait until implementation is complete
2. **Be specific**: "Review authentication flow" vs. "Review the code"
3. **Include context**: Share relevant ADRs and documentation
4. **Act on feedback**: Reviews are only valuable if you implement changes

### For ADRs

1. **Write as you decide**: Don't wait to document decisions
2. **Be concise**: Clear and brief is better than comprehensive
3. **Show alternatives**: Document what you considered
4. **Update status**: Keep ADR status current

### For Pragmatic Mode

1. **Start balanced**: Don't begin with strict unless you have reason
2. **Respect exemptions**: Never compromise security, data integrity, compliance
3. **Track deferrals**: If you defer, document trigger conditions
4. **Review deferrals**: Quarterly review what was deferred and why

### For Implementation

1. **Configure methodology**: Set up `.architecture/config.yml` once
2. **Use influences**: Leverage thought leaders' expertise
3. **Follow quality standards**: Define done means done
4. **Iterate**: Improve configuration based on experience

---

## Getting Help

### Framework Issues

- **Repository**: https://github.com/codenamev/ai-software-architect
- **Issues**: https://github.com/codenamev/ai-software-architect/issues

### Usage Questions

- Review [AGENTS.md](../../AGENTS.md) for framework overview
- Check `agent_docs/workflows.md` for step-by-step procedures
- Examine example ADRs in `.architecture/decisions/adrs/`
- Study example reviews in `.architecture/reviews/`

### Customization Help

- Read [.architecture/principles.md](../principles.md) for architectural guidance
- Review [.architecture/members.yml](../members.yml) for member examples
- Check [.architecture/config.yml](../config.yml) for configuration options
- Examine templates in `.architecture/templates/`

---

## Version Information

**Framework Version**: 1.2.0
**Last Updated**: 2025-12-04
**Documentation Structure**: Progressive Disclosure Pattern (ADR-006)
