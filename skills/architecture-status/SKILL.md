---
name: architecture-status
description: Reports on the health and state of architecture documentation (counts of ADRs, reviews, activity levels, documentation gaps). Use when the user asks "What's our architecture status?", "Show architecture documentation", "How many ADRs do we have?", "What decisions are documented?", "Architecture health check", or wants an overview/summary of documentation state. Do NOT use for listing team members (use list-members), creating new documents (use create-adr), or conducting reviews (use architecture-review or specialist-review).
allowed-tools: Read,Glob,Grep
---

# Architecture Status

Provides overview of architecture documentation state.

## Process

### 1. Check Framework Setup
If `.architecture/` doesn't exist:
```
The AI Software Architect framework is not set up yet.

To get started: "Setup ai-software-architect"

Once set up, you'll have:
- Architectural Decision Records (ADRs)
- Architecture reviews
- Specialist reviews
- Recalibration tracking
```

### 2. Gather Information
Collect from `.architecture/`:
- **ADRs**: Count files in `decisions/adrs/`, note recent ones, check statuses
- **Reviews**: Count files in `reviews/`, categorize (version/feature/specialist/initial)
- **Recalibration**: Count files in `recalibration/`, check progress docs
- **Comparisons**: List files in `comparisons/`
- **Team**: Count members in `members.yml`
- **Last Activity**: Most recent date from any document
- **Framework version**: read `version.framework_version` from `.architecture/config.yml` (the *installed* version). When `$CLAUDE_PLUGIN_ROOT` is set, also read `version` from `$CLAUDE_PLUGIN_ROOT/.claude-plugin/plugin.json` (the *plugin* version). The plugin auto-updates; the installed `.architecture/` copy does not, so these drift apart silently.
  - Same version → `Framework: 1.6.0 (installed matches plugin)`
  - Behind → `Framework: installed 1.4.0, plugin 1.6.0 - 2 releases behind; see CHANGELOG 1.5.0…1.6.0 and UPGRADE.md`
  - No stamp → `Framework: installed unknown (pre-1.2 install), plugin 1.6.0 - see UPGRADE.md`
  - No `$CLAUDE_PLUGIN_ROOT` → report the installed version only.
  - Report only. Never upgrade, rewrite, or restamp `.architecture/` from this skill; the upgrade is the user's explicit action.

### 3. Generate Status Report
```markdown
# Architecture Framework Status

**Report Date**: [Date]
**Project**: [Project name if known]
**Framework**: [installed X.Y.Z / plugin X.Y.Z drift line from step 2]

## Summary

**Health Status**: Excellent | Good | Needs Attention | Inactive

**Key Metrics**:
- ADRs: [count]
- Reviews: [count]
- Recalibration Plans: [count]
- Team Members: [count]
- Last Activity: [Date]

## Architectural Decision Records

**Total**: [count]

**Recent ADRs**:
1. ADR-[XXX]: [Title] ([Status], [Date])
2. ADR-[YYY]: [Title] ([Status], [Date])
[List 5-10 most recent]

**By Status**:
- ✅ Accepted: [count]
- 🔄 Proposed: [count]
- ⚠️ Deprecated: [count]
- 🔀 Superseded: [count]

**Coverage**: [Main areas covered: Data, Security, Infrastructure, etc.]

## Architecture Reviews

**Total**: [count]

**Version Reviews**: [List with dates]
**Feature Reviews**: [List with dates]
**Specialist Reviews**: [List with dates]

**Most Recent**: [Title] ([Date])

## Recalibration

**Total Documents**: [count]

**Active**:
1. [Target]: [Status], [Completion %]

**Status**:
- ✅ Completed: [count]
- 🔄 In Progress: [count]
- 📋 Planned: [count]

## Architecture Team

**Total Members**: [count]

**Team**: [List member titles]

**Coverage**: Security ([count]), Performance ([count]), System Design ([count]), etc.

**View full roster**: "List architecture members"

## Activity

**Recent**:
- [Date]: Created ADR-XXX: [Title]
- [Date]: Completed review for [target]
- [Date]: [Activity]

**Level**: High | Medium | Low | Inactive

## Documentation Health

**Completeness**: [X%]

**Strengths**:
- ✅ [What's well documented]

**Gaps**:
- ⚠️ [What needs attention]

**Recommendations**:
1. [Recommendation 1]
2. [Recommendation 2]

## Quick Actions

**Create**:
- "Create ADR for [decision]"
- "Start architecture review for [version/feature]"
- "Ask [specialist] to review [target]"

**View**:
- "List architecture members"
- [Specific docs to review based on status]

**Update**:
- [Actions based on current state]

---
```

### 4. Analyze Health
**Health indicators**:
- **Excellent**: Regular ADRs, recent reviews, active recalibration
- **Good**: Some ADRs, occasional reviews
- **Needs Attention**: Old docs, no recent activity
- **Inactive**: Framework unused

### 5. Provide Recommendations
**Based on status**:

**If well-maintained**:
```
✅ Excellent documentation discipline!

Keep momentum:
- Continue documenting decisions
- Regular reviews (quarterly/before releases)
- Track recalibration progress
```

**If partially used**:
```
⚠️ Good foundations, room for improvement.

Suggestions:
- Document 3-5 key decisions as ADRs
- Schedule architecture review
- Address review findings
```

**If minimal usage**:
```
❌ Framework underutilized.

Get started:
1. Document your most important decisions as ADRs
2. Conduct initial architecture review
3. Make documentation a regular habit
```

### 6. Make It Actionable
Always end with:
- Specific commands to run
- Concrete actions to improve
- Examples relevant to their status

## Metrics to Track

**Volume**: Total ADRs, reviews, recalibration docs, team members
**Activity**: Last update, docs per month, active vs completed
**Coverage**: Decision areas, review types, specialist expertise
**Health**: Documentation completeness, review frequency, progress tracking

## Error Handling
- No `.architecture/`: Offer setup
- Permission issues: Report and suggest fixes
- Corrupted files: Note which have issues
- Empty directories: Suggest starting points

## Related Skills

**Based on Status Results**:

**If Documentation Gaps Found**:
- "Create ADR for [missing decision]" - Fill documentation gaps
- "Start architecture review for [area]" - Comprehensive assessment
- "Ask [specialist] to review [weak area]" - Focused improvement

**If Status is Good**:
- "List architecture members" - See your active team
- Continue regular documentation practices
- Schedule periodic reviews

**Regular Workflow**:
1. Start work → "What's our architecture status?" → Identify gaps
2. Make changes → Document with ADRs → Status check to verify
3. Before release → Status check → Architecture review → Address findings

**Workflow Examples**:
1. Status check → Find 0 ADRs → Create ADRs for key decisions → Status check shows progress
2. Status check → See old reviews → Request new architecture review → Update status
3. Weekly: Status check → Track documentation health → Maintain good practices

## Notes
- Be honest but encouraging
- Focus on actionable next steps
- Show value of maintained documentation
- Adapt tone to current state
