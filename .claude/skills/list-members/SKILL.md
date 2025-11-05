---
name: list-members
description: Lists all architecture team members and their specialties. Use when the user asks "Who's on the architecture team?", "List architecture members", "Show me the architects", "What specialists are available?", or when they want to know who they can request reviews from.
---

# List Architecture Members

This skill displays all architecture team members defined in the AI Software Architect framework, showing their specialties and areas of expertise.

## When to Use This Skill

Automatically invoke this skill when users request:
- "List architecture members"
- "Who's on the architecture team?"
- "Show me the architects"
- "What specialists are available?"
- "Who can I ask for reviews?"
- "Show architecture team"
- "List reviewers"

## Prerequisites

- The AI Software Architect framework should be set up (`.architecture/` directory exists)
- `.architecture/members.yml` file should exist

## Process

### 1. Load Architecture Members

Read and parse `.architecture/members.yml` to get all architecture team members.

If the file doesn't exist, inform the user:
```
The AI Software Architect framework hasn't been set up yet.

To get started: "Setup ai-software-architect"

Or if you have the framework repository cloned:
1. Clone: git clone https://github.com/codenamev/ai-software-architect .architecture
2. Setup: "Setup .architecture"
```

### 2. Format and Display Members

Present the members in a clear, organized format:

```markdown
# Architecture Team Members

[Brief introduction explaining the team and their role]

Total Members: [count]

---

## Team Roster

### [Member 1 Name] - [Member 1 Title]

**ID**: `[member_id]`

**Specialties:**
- [Specialty 1]
- [Specialty 2]
- [Specialty 3]

**Disciplines:**
- [Discipline 1]
- [Discipline 2]
- [Discipline 3]

**Key Skillsets:**
- [Skill 1]
- [Skill 2]
- [Skill 3]

**Domains:**
- [Domain 1]
- [Domain 2]
- [Domain 3]

**Perspective**: [Their unique perspective]

**Request a review**: `Ask [Member Title] to review [your target]`

---

### [Member 2 Name] - [Member 2 Title]

[Same structure for each member]

---

[Continue for all members]

---

## Quick Reference

**Request a specialist review:**
- `Ask [Specialist Title] to review [target]`

**Examples:**
- "Ask Security Specialist to review authentication"
- "Ask Performance Specialist to review database queries"
- "Ask Domain Expert to review business logic"
- "Ask [Member Title] to review [any component/feature]"

**Start a full architecture review:**
- `Start architecture review for version X.Y.Z`
- `Start architecture review for [feature name]`

**Create architectural decisions:**
- `Create ADR for [decision topic]`

**Check architecture status:**
- `What's our architecture status?`

---

## Team Specialties by Category

### Security & Compliance
[List members whose domains include security/compliance]

### Performance & Scalability
[List members whose domains include performance/scalability]

### Code Quality & Maintainability
[List members whose domains include maintainability/quality]

### Domain & Business Logic
[List members whose domains include domain/business]

### System Design & Architecture
[List members whose domains include systems/architecture]

### Technology-Specific Expertise
[List members with language/framework specific expertise]

### [Other Categories]
[Group members by their primary domains]

---

## Adding New Members

The architecture team can grow to include any specialist you need.

**To add a new specialist:**
Simply request a review from them, even if they don't exist yet:
- "Ask Ruby Expert to review my modules"
- "Have Accessibility Expert review the forms"
- "Get DevOps Specialist's opinion on our CI/CD"

I'll create the new specialist and add them to your team automatically.

**To manually add a member:**
Edit `.architecture/members.yml` and add a new entry:

```yaml
- id: your_specialist_id
  name: "[Person Name]"
  title: "[Specialist Title]"
  specialties:
    - "[Specialty 1]"
    - "[Specialty 2]"
  disciplines:
    - "[Discipline 1]"
    - "[Discipline 2]"
  skillsets:
    - "[Skill 1]"
    - "[Skill 2]"
  domains:
    - "[Domain 1]"
    - "[Domain 2]"
  perspective: "[Brief description of their unique perspective]"
```

---

## Member Roles Explained

### Systems Architect
Focuses on overall system structure, patterns, scalability, and component interactions. Ensures the system architecture aligns with business goals and technical requirements.

### Domain Expert
Specializes in business logic, domain modeling, and ensuring the code reflects the business domain accurately. Validates that technical implementations match business requirements.

### Security Specialist
Expert in security best practices, vulnerability assessment, threat modeling, and compliance. Ensures systems are secure and follow industry standards.

### Maintainability Expert
Focuses on code quality, documentation, testability, and long-term maintainability. Helps keep technical debt under control.

### Performance Specialist
Specializes in optimization, profiling, and ensuring systems meet performance requirements. Identifies bottlenecks and scalability concerns.

### [Custom Members]
[Explanation of any custom members specific to your project]

---

## Using the Architecture Team

### For Focused Reviews
When you need specific expertise on a particular concern:
```
Ask [Specialist] to review [target]
```

This gives you a deep-dive from one perspective without the overhead of a full review.

### For Comprehensive Reviews
When you need a thorough assessment from all perspectives:
```
Start architecture review for [version/feature]
```

This engages the entire team for a complete architectural analysis.

### For Decisions
When you need to document an architectural decision:
```
Create ADR for [decision topic]
```

The decision record can reference specialist reviews and team input.

---
```

### 3. Provide Additional Context

After listing members, provide helpful context:

- **How to use the team**: Explain when to request specialist vs full reviews
- **How to add members**: Explain the dynamic member creation
- **Common use cases**: Give examples of typical requests
- **Next steps**: Suggest relevant actions based on their project

### 4. Example Output

Here's an example of what the output might look like:

```markdown
# Architecture Team Members

Your AI Software Architect team consists of 9 specialized reviewers, each bringing unique expertise to ensure comprehensive architectural oversight.

Total Members: 9

---

## Team Roster

### Maya Rodriguez - Systems Architect

**ID**: `systems_architect`

**Specialties:**
- Distributed systems design
- Microservices architecture
- System integration patterns

**Disciplines:**
- Architectural patterns and principles
- Scalability and reliability
- Technical documentation

**Key Skillsets:**
- System design
- Cloud architecture
- API design

**Domains:**
- Software architecture
- System integration
- Technical strategy

**Perspective**: Focuses on overall system structure, ensuring components work together cohesively and the architecture supports long-term business goals.

**Request a review**: `Ask Systems Architect to review [your target]`

---

### Dr. James Chen - Domain Expert

**ID**: `domain_expert`

**Specialties:**
- Domain-Driven Design
- Business logic modeling
- Ubiquitous language

**Disciplines:**
- Business analysis
- Domain modeling
- Requirement engineering

**Key Skillsets:**
- DDD patterns
- Business process modeling
- Domain analysis

**Domains:**
- Business domain modeling
- Requirements analysis
- Domain language

**Perspective**: Ensures technical implementations accurately reflect business domains and uses appropriate business language throughout the codebase.

**Request a review**: `Ask Domain Expert to review [your target]`

---

[Continue for all 9 members...]

---

## Quick Reference

**Request a specialist review:**
- `Ask [Specialist Title] to review [target]`

**Examples:**
- "Ask Security Specialist to review authentication"
- "Ask Performance Specialist to review database queries"
- "Ask JavaScript Expert to review our React components"

**Start a full architecture review:**
- `Start architecture review for version 2.0.0`
- `Start architecture review for user-authentication feature`

---

## Team Specialties by Category

### Security & Compliance
- **Sarah Thompson** (Security Specialist): OWASP, secure coding, threat modeling

### Performance & Scalability
- **Mike Anderson** (Performance Specialist): Optimization, profiling, scalability

### Code Quality & Maintainability
- **Lisa Park** (Maintainability Expert): Code quality, testing, documentation

### Domain & Business Logic
- **Dr. James Chen** (Domain Expert): DDD, business modeling, domain language

### System Design & Architecture
- **Maya Rodriguez** (Systems Architect): System design, patterns, integration

### AI & Machine Learning
- **Dr. Priya Patel** (AI Engineer): ML systems, training pipelines, model architecture

### Technology-Specific Expertise
- **Alex Rivera** (JavaScript Expert): Modern JS/TS, React, Node.js
- **Jordan Lee** (Ruby Expert): Ruby best practices, Rails patterns, gems
- **Casey Morgan** (Python Expert): Python idioms, Django, data processing

---

## Using Your Architecture Team

### Need quick, focused expertise?
Request a specialist review:
- "Ask Security Specialist to review our auth flow"
- "Get Performance Expert's opinion on our caching"
- Fast turnaround, targeted insights

### Need comprehensive analysis?
Start a full architecture review:
- "Start architecture review for version 2.0.0"
- All 9 members review from their perspectives
- Collaborative discussion and synthesis
- Comprehensive recommendations

### Making a decision?
Document it properly:
- "Create ADR for choosing PostgreSQL"
- References relevant reviews and specialist input
- Captures reasoning and trade-offs

---

Ready to get started? Try:
- "Ask [any specialist] to review [anything]"
- "Start architecture review for [version/feature]"
- "Create ADR for [decision topic]"
```

## Best Practices

### Clear Presentation

1. **Organize logically**: Group similar members, use categories
2. **Be visual**: Use clear formatting, headers, and sections
3. **Be actionable**: Show exactly how to use each member
4. **Be helpful**: Provide examples and next steps

### Providing Context

1. **Explain roles**: Help users understand what each specialist does
2. **Show use cases**: Give concrete examples of when to use each member
3. **Enable discovery**: Make it easy to find the right specialist
4. **Encourage usage**: Make it clear how accessible the team is

### Handling Different Scenarios

**Many members (10+)**:
- Add table of contents
- Group by category more aggressively
- Provide summary view option

**Few members (< 5)**:
- Show full details for each
- Explain that more can be added dynamically
- Suggest common specialists they might want

**No members.yml**:
- Offer to set up the framework
- Explain what the architecture team provides
- Show example team composition

## Example Interactions

### Example 1: Basic Request

**User**: "List architecture members"

**You**:
1. Read `.architecture/members.yml`
2. Find 9 members
3. Display full roster with all details
4. Group by specialty category
5. Provide usage examples
6. Suggest next steps

### Example 2: No Framework Setup

**User**: "Who can review my code?"

**You**:
```
I don't see the AI Software Architect framework set up yet.

Once set up, you'll have access to a team of specialized architecture reviewers including:
- Systems Architect (overall structure and patterns)
- Security Specialist (security and compliance)
- Performance Specialist (optimization and scalability)
- Domain Expert (business logic and domain modeling)
- And more...

To set it up:
1. Clone: git clone https://github.com/codenamev/ai-software-architect .architecture
2. Setup: "Setup .architecture"

Or for a quick setup:
"Setup ai-software-architect"

After setup, you can request reviews like:
- "Ask Security Specialist to review authentication"
- "Ask Performance Expert to review database queries"
```

### Example 3: Finding Right Specialist

**User**: "Who should review my database schema?"

**You**:
```
For database schema reviews, I recommend:

1. **Performance Specialist** (Mike Anderson)
   - Focus: Query optimization, indexing strategy, performance implications
   - Request: "Ask Performance Specialist to review database schema"

2. **Systems Architect** (Maya Rodriguez)
   - Focus: Data architecture, relationships, scalability
   - Request: "Ask Systems Architect to review database schema"

3. **Domain Expert** (Dr. James Chen)
   - Focus: Domain modeling, business logic representation
   - Request: "Ask Domain Expert to review database schema"

For a comprehensive review from all perspectives:
"Start architecture review for database schema"

Based on your specific concerns:
- Performance/scalability issues? → Performance Specialist
- Data modeling questions? → Domain Expert
- Overall architecture? → Systems Architect
- All of the above? → Full architecture review
```

## Integration with Other Skills

**After listing members:**
- User might request a specialist review → specialist-review skill
- User might request full review → architecture-review skill
- User might want to add a member → Explain the process

**Before other operations:**
- Specialist reviews need to know available members → Use this skill
- Full reviews need member roster → Use this skill
- Setup might reference standard members → Use this as reference

## Error Handling

- **No .architecture directory**: Offer setup instructions
- **Empty members.yml**: Show default team and offer setup
- **Malformed YAML**: Attempt to parse, report issues
- **Missing fields**: Show what's available, note missing information

## Notes

- Keep the presentation clear and scannable
- Make it actionable - show how to use each member
- Provide context for decision-making
- Encourage exploration and usage
- Make it clear the team can grow dynamically
- Balance completeness with readability
