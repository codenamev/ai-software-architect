---
name: architecture-status
description: Shows the current state of architecture documentation including ADRs, reviews, and recalibration progress. Use when the user asks "What's our architecture status?", "Show architecture documentation", "What architectural decisions have we made?", or when they want an overview of the framework's usage.
---

# Architecture Status

This skill provides a comprehensive overview of the current state of architecture documentation, decisions, reviews, and recalibration efforts in the AI Software Architect framework.

## When to Use This Skill

Automatically invoke this skill when users request:
- "What's our architecture status?"
- "Show architecture documentation"
- "What architectural decisions have we made?"
- "Show me our ADRs"
- "What architecture reviews have been done?"
- "Architecture overview"
- "Status of architecture framework"
- "What's documented?"

## Prerequisites

- The AI Software Architect framework should be set up (`.architecture/` directory exists)

## Status Check Process

### 1. Check Framework Setup

First, verify if the framework is set up:

**If `.architecture/` doesn't exist:**
```
The AI Software Architect framework is not set up yet.

To get started:
1. Clone: git clone https://github.com/codenamev/ai-software-architect .architecture
2. Setup: "Setup .architecture"

Or simply say: "Setup ai-software-architect"

Once set up, you'll be able to:
- Create Architectural Decision Records (ADRs)
- Conduct architecture reviews
- Get specialist reviews
- Track architectural evolution
```

**If `.architecture/` exists, proceed with status check.**

### 2. Gather Status Information

Collect information from all architecture directories:

**ADRs (Architectural Decision Records):**
- List all files in `.architecture/decisions/adrs/`
- Count total ADRs
- Identify recent ADRs (by date)
- Note any special considerations from `ArchitectureConsiderations.md`

**Architecture Reviews:**
- List all files in `.architecture/reviews/`
- Distinguish between:
  - Version reviews (e.g., `1-0-0.md`)
  - Feature reviews (e.g., `feature-name.md`)
  - Specialist reviews (e.g., `security-specialist-api.md`)
  - Initial analysis (`initial-system-analysis.md`)
- Count total reviews
- Identify most recent reviews

**Recalibration:**
- List all files in `.architecture/recalibration/`
- Check for:
  - Recalibration plans
  - Implementation roadmaps
  - Progress tracking documents
- Note completion status

**Comparisons:**
- List any version comparison documents in `.architecture/comparisons/`
- Note what versions have been compared

**Architecture Team:**
- Count members in `.architecture/members.yml`
- List member titles (not full details, just overview)

**Principles:**
- Note if `.architecture/principles.md` exists and is customized

### 3. Format Status Report

Create a comprehensive status report:

```markdown
# Architecture Framework Status

**Report Date**: [Current Date]
**Framework Version**: AI Software Architect
**Project**: [Project name if identifiable]

---

## Executive Summary

[2-3 sentence overview of the current state of architecture documentation]

**Key Metrics:**
- **ADRs Created**: [count]
- **Reviews Conducted**: [count]
- **Recalibration Plans**: [count]
- **Architecture Team Members**: [count]
- **Last Activity**: [Most recent date from any document]

**Health Status**: [Excellent | Good | Needs Attention | Inactive]

---

## Framework Setup

✅ **Status**: Fully Set Up

**Components Present:**
- ✅ Architecture Decisions (`.architecture/decisions/`)
- ✅ Architecture Reviews (`.architecture/reviews/`)
- ✅ Recalibration Plans (`.architecture/recalibration/`)
- ✅ Architecture Team (`.architecture/members.yml`)
- ✅ Principles (`.architecture/principles.md`)
- [✅/❌] Comparisons (`.architecture/comparisons/`)

---

## Architectural Decision Records (ADRs)

**Total ADRs**: [count]

**Recent ADRs:**

1. **ADR-[XXX]**: [Title]
   - **Status**: [Proposed/Accepted/Deprecated/Superseded]
   - **Date**: [Date]
   - **Location**: `.architecture/decisions/adrs/ADR-XXX-[name].md`

2. **ADR-[YYY]**: [Title]
   - **Status**: [Status]
   - **Date**: [Date]
   - **Location**: `.architecture/decisions/adrs/ADR-YYY-[name].md`

[List up to 5-10 most recent]

**All ADRs:**
- ADR-001: [Title] ([Status])
- ADR-002: [Title] ([Status])
- ADR-003: [Title] ([Status])
[Full list]

**Status Breakdown:**
- ✅ Accepted: [count]
- 🔄 Proposed: [count]
- ⚠️ Deprecated: [count]
- 🔀 Superseded: [count]

**Coverage Areas:**
[Categorize ADRs by topic if clear - e.g., Data, Security, Infrastructure, etc.]

---

## Architecture Reviews

**Total Reviews**: [count]

### Version Reviews

[List version reviews]
- **Version 1.0.0**: `.architecture/reviews/1-0-0.md` ([Date])
- **Version 2.0.0**: `.architecture/reviews/2-0-0.md` ([Date])

### Feature Reviews

[List feature reviews]
- **Feature: User Authentication**: `.architecture/reviews/feature-user-authentication.md` ([Date])
- **Feature: Payment Processing**: `.architecture/reviews/feature-payment-processing.md` ([Date])

### Specialist Reviews

[List specialist reviews]
- **Security Review: API Authentication**: `.architecture/reviews/security-specialist-api-authentication.md` ([Date])
- **Performance Review: Database Queries**: `.architecture/reviews/performance-specialist-database-queries.md` ([Date])

### Initial Analysis

[If exists]
- **Initial System Analysis**: `.architecture/reviews/initial-system-analysis.md` ([Date])

**Most Recent Review**: [Title] ([Date])

**Review Types:**
- 🌍 Comprehensive Reviews: [count]
- 🎯 Specialist Reviews: [count]
- 🔍 Initial Analysis: [0/1]

---

## Recalibration Plans

**Total Recalibration Documents**: [count]

**Active Recalibrations:**

1. **[Target Name]**: [Type]
   - **Plan**: `.architecture/recalibration/[name].md`
   - **Roadmap**: `.architecture/recalibration/implementation_roadmap_[name].md`
   - **Progress**: `.architecture/recalibration/progress_tracking_[name].md`
   - **Status**: [In Progress/Completed/Planned]
   - **Completion**: [X%]

2. [More recalibrations]

**Recalibration Status:**
- ✅ Completed: [count]
- 🔄 In Progress: [count]
- 📋 Planned: [count]

---

## Architecture Team

**Total Members**: [count]

**Team Composition:**
- Systems Architect: [Name]
- Domain Expert: [Name]
- Security Specialist: [Name]
- Performance Specialist: [Name]
- Maintainability Expert: [Name]
- [Custom members...]

**Specialty Coverage:**
- 🔒 Security: [member count]
- ⚡ Performance: [member count]
- 🏗️ System Design: [member count]
- 💼 Domain/Business: [member count]
- 🔧 Maintainability: [member count]
- 🤖 AI/ML: [member count]
- 💻 Technology-Specific: [member count]

**Request reviews**: "Ask [Specialist] to review [target]"
**View full roster**: "List architecture members"

---

## Version Comparisons

[If any exist]

**Comparisons Available:**
- 1.0.0 → 2.0.0: `.architecture/comparisons/1-0-0-to-2-0-0.md`
- [More comparisons...]

[If none exist]
**No version comparisons yet.**
Create comparisons to track architectural evolution between versions.

---

## Architecture Principles

**Status**: [✅ Customized | ⚠️ Using Defaults | ❌ Not Found]

**Principles Document**: `.architecture/principles.md`

[If customized]
**Key Principles:**
- [Principle 1]
- [Principle 2]
- [Principle 3]

These principles guide all architectural decisions and reviews.

---

## Activity Timeline

**Recent Activity:**

- **[Date]**: Created ADR-XXX: [Title]
- **[Date]**: Completed architecture review for [target]
- **[Date]**: [Specialist] reviewed [component]
- **[Date]**: Started recalibration for [target]
- **[Date]**: Initial system analysis completed

**Activity Level**: [High/Medium/Low/Inactive]

**Last Updated**: [Most recent date from any document]

---

## Documentation Health

**Completeness Score**: [X%]

**Strengths:**
- ✅ [What's well documented]
- ✅ [Another strength]

**Gaps:**
- ⚠️ [What could be improved]
- ⚠️ [Another gap]

**Recommendations:**
- [Recommendation 1]
- [Recommendation 2]

---

## Quick Actions

Based on the current status, here's what you can do:

### Create Documentation
- **Create an ADR**: "Create ADR for [decision topic]"
- **Start a review**: "Start architecture review for [version/feature]"
- **Get specialist input**: "Ask [specialist] to review [target]"

### Review Documentation
- **View an ADR**: "Show me ADR-XXX"
- **View a review**: "Show me the [review name] review"
- **See team**: "List architecture members"

### Update Documentation
- **Update ADR status**: Edit the ADR file to change status
- **Start recalibration**: "Start architecture recalibration for [target]"
- **Track progress**: Update progress tracking documents

---

## Framework Usage Statistics

**Documentation Activity:**
- **Total Documents**: [count]
- **Documents per Month**: [average if dateable]
- **Most Active Area**: [ADRs/Reviews/Recalibration]

**Decision Coverage:**
[If ADRs exist, analyze what areas they cover]
- Infrastructure: [count] ADRs
- Data/Database: [count] ADRs
- Security: [count] ADRs
- Architecture: [count] ADRs
- [Other categories]

**Review Coverage:**
[Analyze what's been reviewed]
- System-wide: [count] reviews
- Feature-specific: [count] reviews
- Component-specific: [count] reviews

---

## Recommendations

Based on the current status:

### If Well Maintained:
✅ Your architecture documentation is in excellent shape!

**Keep the momentum:**
- Continue documenting decisions as they're made
- Conduct regular reviews (quarterly or before major releases)
- Update ADR statuses as they evolve
- Track recalibration progress

### If Partially Used:
⚠️ You have good foundations, but there's room for improvement.

**Suggestions:**
- [If few ADRs] Document key architectural decisions as ADRs
- [If no recent reviews] Schedule a comprehensive architecture review
- [If no recalibration] Address findings from previous reviews
- [If few specialists] Add domain-specific experts to your team

### If Minimal Usage:
❌ The framework is set up but underutilized.

**Get started:**
1. Document your 3-5 most important architectural decisions as ADRs
2. Conduct an initial architecture review: "Start architecture review for version [current]"
3. Address high-priority findings through recalibration
4. Make it a habit to document decisions as they're made

### If Not Set Up:
🚀 Ready to start?

**Quick setup:**
"Setup ai-software-architect"

This will:
- Set up the framework structure
- Customize it for your project
- Create an initial architectural analysis
- Get you ready to start documenting

---

## Next Steps

**Immediate Actions:**
1. [Specific suggestion based on status]
2. [Another specific suggestion]
3. [Third suggestion]

**Regular Practices:**
- Document decisions as ADRs when they're made
- Conduct reviews before major releases
- Update documentation as architecture evolves
- Engage specialists for focused concerns

**Getting Help:**
- "Create ADR for [topic]" - Document a decision
- "Ask [specialist] to review [target]" - Get expert review
- "Start architecture review" - Comprehensive assessment
- "List architecture members" - See available experts

---

**Framework Status Report Complete**
**Generated**: [Timestamp]
```

### 4. Analyze and Provide Insights

After showing the status, provide insights:

**Health Indicators:**
- **Excellent**: Regular ADRs, recent reviews, active recalibration
- **Good**: Some ADRs, occasional reviews, documentation present
- **Needs Attention**: Old documentation, no recent activity
- **Inactive**: Framework set up but unused

**Recommendations based on patterns:**
- No ADRs → Suggest documenting key decisions
- Old reviews → Suggest new review for current state
- Pending recalibrations → Suggest addressing findings
- Few specialists → Suggest adding domain experts

### 5. Make it Actionable

Always end with clear next steps:
- Specific commands they can run
- Concrete actions to improve documentation
- Examples relevant to their status

## Best Practices

### Clear Status Reporting

1. **Be Visual**: Use emojis and formatting for quick scanning
2. **Be Comprehensive**: Cover all aspects of the framework
3. **Be Accurate**: Report actual state, not ideal state
4. **Be Helpful**: Provide actionable recommendations

### Insights and Analysis

1. **Identify Patterns**: Note trends in documentation
2. **Highlight Gaps**: Point out underutilized areas
3. **Recognize Strengths**: Acknowledge what's working well
4. **Suggest Improvements**: Provide specific, actionable advice

### Handling Different States

**Well-Maintained Projects:**
- Celebrate their documentation discipline
- Suggest advanced practices
- Encourage continued momentum

**Partially Active Projects:**
- Acknowledge what's been done
- Identify specific gaps
- Provide targeted recommendations

**New/Inactive Projects:**
- Don't criticize lack of documentation
- Make it easy to get started
- Show value proposition
- Provide simple first steps

## Example Interactions

### Example 1: Active Project

**User**: "What's our architecture status?"

**You**:
1. Scan `.architecture/` directory
2. Find: 12 ADRs, 3 version reviews, 5 specialist reviews, 2 recalibrations
3. Generate comprehensive status report showing:
   - Health Status: Excellent
   - 12 ADRs covering data, security, infrastructure
   - Recent version 2.0.0 review from last month
   - Active recalibration with 60% progress
   - 8 architecture team members
4. Recommendations: Keep up the great work, schedule next quarterly review

### Example 2: Minimal Usage

**User**: "Show architecture documentation"

**You**:
1. Scan `.architecture/` directory
2. Find: Framework set up, 1 initial analysis, 0 ADRs, 0 reviews
3. Generate status report showing:
   - Health Status: Needs Attention
   - Framework is set up but underutilized
   - Only initial analysis exists
4. Recommendations:
   - Start by documenting 3-5 key decisions as ADRs
   - Conduct architecture review for current state
   - Make decision documentation a regular practice

### Example 3: Not Set Up

**User**: "What's our architecture status?"

**You**:
```
The AI Software Architect framework is not set up yet.

Would you like to set it up? It provides:
- Structured architectural decision documentation (ADRs)
- Multi-perspective architecture reviews
- Specialist reviews for focused concerns
- Recalibration process to address findings
- Track architectural evolution over time

To set up:
"Setup ai-software-architect"

This will:
1. Install the framework
2. Customize it for your project
3. Create an initial architectural analysis
4. Set up your architecture team

Takes just a few minutes and gives you a solid foundation for architectural documentation.
```

## Integration with Other Skills

**Status check often leads to:**
- **View specific ADR**: If user wants to see details of a listed ADR
- **Create ADR**: If gaps in decision documentation identified
- **Start Review**: If reviews are outdated or missing
- **List Members**: If user wants to see team details
- **Setup**: If framework not initialized

**Other skills reference status:**
- Reviews reference existing ADRs
- ADRs reference previous decisions
- Recalibration references review findings

## Metrics and Tracking

### Key Metrics to Track

**Volume:**
- Total ADRs created
- Total reviews conducted
- Total recalibration documents
- Team member count

**Activity:**
- Last update date
- Documents per month
- Active vs completed items

**Coverage:**
- Decision areas covered
- Review types conducted
- Specialist expertise available

**Health:**
- Documentation completeness
- Review frequency
- Recalibration progress

### Health Indicators

**Excellent (90-100%):**
- Regular ADRs (at least monthly)
- Recent reviews (within last quarter)
- Active recalibration tracking
- Growing architecture team

**Good (70-89%):**
- Some ADRs (several exist)
- Occasional reviews (within last 6 months)
- Documentation present
- Basic team setup

**Needs Attention (40-69%):**
- Few ADRs (< 5)
- Old reviews (> 6 months)
- Incomplete documentation
- Minimal team

**Inactive (< 40%):**
- No or very few ADRs
- No recent activity
- Framework mostly unused

## Error Handling

- **No .architecture directory**: Offer setup
- **Permission issues**: Report and suggest fixes
- **Corrupted files**: Note which files have issues
- **Empty directories**: Acknowledge and suggest starting points

## Notes

- Status should be honest but encouraging
- Focus on actionability - what can they do next?
- Recognize both strengths and gaps
- Make it easy to improve documentation habits
- Show value of maintained architecture documentation
- Adapt tone to current state (celebrate success, encourage beginnings)
