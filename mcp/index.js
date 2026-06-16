#!/usr/bin/env node

// @modelcontextprotocol/sdk is NOT imported statically here.  Static imports
// are resolved at module-load time, which means any consumer that imports
// ArchitectureServer (e.g. the setup-fidelity integration test running inside
// the tools/ package) would fail with ERR_MODULE_NOT_FOUND because the SDK
// lives in mcp/node_modules, not tools/node_modules.  The setup-only methods
// (setupArchitecture, createADR, …) do not need the SDK at all, so we defer
// loading it until run() via dynamic import.
import fs from "fs-extra";
import path from "path";
import yaml from "yaml";
import { execSync } from "child_process";
import { fileURLToPath } from "url";
// Note: setup-only helpers (subagent generator, roster validation) live in
// ../tools/lib and are imported dynamically inside setupArchitecture so the MCP
// server still loads when run outside the full framework tree (e.g. a thin npm
// install where Tier-1 tools work but setup, which needs the framework tree, does not).

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class ArchitectureServer {
  constructor() {
    // MCP server object is created lazily in _initServer() so that importing
    // this class does not require @modelcontextprotocol/sdk to be resolvable.
    process.on("SIGINT", async () => {
      if (this.server) await this.server.close();
      process.exit(0);
    });
  }

  // Lazily initialise the MCP Server and register all tool handlers.
  // Safe to call multiple times (no-op after first call).
  async _initServer() {
    if (this.server) return;
    const { Server } = await import("@modelcontextprotocol/sdk/server/index.js");
    const { CallToolRequestSchema, ListToolsRequestSchema } = await import("@modelcontextprotocol/sdk/types.js");

    this.server = new Server(
      { name: "ai-software-architect", version: "1.6.0" },
      { capabilities: { tools: {} } }
    );
    this.server.onerror = (error) => console.error("[MCP Error]", error);
    this._setupToolHandlers(CallToolRequestSchema, ListToolsRequestSchema);
  }

  // Kept for API compatibility; no-op now that setup happens in _initServer.
  setupErrorHandling() {}

  _setupToolHandlers(CallToolRequestSchema, ListToolsRequestSchema) {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "setup_architecture",
            description: "Set up the AI Software Architect framework in the current project",
            inputSchema: {
              type: "object",
              properties: {
                projectPath: {
                  type: "string",
                  description: "Path to the project root directory",
                },
              },
              required: ["projectPath"],
            },
          },
          {
            name: "create_adr",
            description: "Create an Architectural Decision Record (ADR)",
            inputSchema: {
              type: "object",
              properties: {
                title: {
                  type: "string",
                  description: "Title of the ADR",
                },
                context: {
                  type: "string",
                  description: "Context and background for the decision",
                },
                decision: {
                  type: "string",
                  description: "The architectural decision being made",
                },
                consequences: {
                  type: "string",
                  description: "Consequences of this decision",
                },
                projectPath: {
                  type: "string",
                  description: "Path to the project root directory",
                },
              },
              required: ["title", "context", "decision", "consequences", "projectPath"],
            },
          },
          {
            name: "list_architecture_members",
            description: "List all available architecture team members and their specialties",
            inputSchema: {
              type: "object",
              properties: {
                projectPath: {
                  type: "string",
                  description: "Path to the project root directory",
                },
              },
              required: ["projectPath"],
            },
          },
          {
            name: "get_architecture_status",
            description: "Get the current status of architecture documentation and decisions",
            inputSchema: {
              type: "object",
              properties: {
                projectPath: {
                  type: "string",
                  description: "Path to the project root directory",
                },
              },
              required: ["projectPath"],
            },
          },
          {
            name: "configure_pragmatic_mode",
            description: "Enable and configure Pragmatic Mode (YAGNI Enforcement) to prevent over-engineering",
            inputSchema: {
              type: "object",
              properties: {
                projectPath: {
                  type: "string",
                  description: "Path to the project root directory",
                },
                enabled: {
                  type: "boolean",
                  description: "Enable or disable Pragmatic Mode",
                },
                intensity: {
                  type: "string",
                  description: "Intensity level: 'strict', 'balanced', or 'lenient'",
                  enum: ["strict", "balanced", "lenient"],
                },
              },
              required: ["projectPath"],
            },
          },
          {
            name: "get_implementation_guidance",
            description: "Get implementation methodology, influences, and practices configuration for 'Implement as the architects' command. Returns configured methodology (TDD, BDD, etc.), influences (Kent Beck, Sandi Metz, etc.), language-specific practices, testing approach, refactoring guidelines, and quality standards.",
            inputSchema: {
              type: "object",
              properties: {
                projectPath: {
                  type: "string",
                  description: "Path to the project root directory",
                },
                featureDescription: {
                  type: "string",
                  description: "Optional: Description of the feature being implemented (for context-specific guidance)",
                },
              },
              required: ["projectPath"],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case "setup_architecture":
            return await this.setupArchitecture(args);
          case "create_adr":
            return await this.createADR(args);
          case "list_architecture_members":
            return await this.listArchitectureMembers(args);
          case "get_architecture_status":
            return await this.getArchitectureStatus(args);
          case "configure_pragmatic_mode":
            return await this.configurePragmaticMode(args);
          case "get_implementation_guidance":
            return await this.getImplementationGuidance(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async setupArchitecture(args) {
    const { projectPath } = args;
    const architecturePath = path.join(projectPath, ".architecture");
    const codingAssistantsPath = path.join(projectPath, ".coding-assistants");
    const claudeMdPath = path.join(projectPath, "CLAUDE.md");
    
    try {
      // Check if .architecture already exists
      if (await fs.pathExists(architecturePath)) {
        return {
          content: [
            {
              type: "text",
              text: "Architecture framework is already set up in this project. Use get_architecture_status to see current state.",
            },
          ],
        };
      }

      const results = [];
      results.push("🚀 Setting up AI Software Architect framework...");

      // Step 1: Analyze target project
      results.push("\n📊 Analyzing project structure...");
      const projectAnalysis = await this.analyzeProject(projectPath);
      results.push(`- Detected languages: ${projectAnalysis.languages.join(', ')}`);
      results.push(`- Frameworks: ${projectAnalysis.frameworks.length ? projectAnalysis.frameworks.join(', ') : 'None detected'}`);
      results.push(`- Package manager: ${projectAnalysis.packageManager || 'None detected'}`);

      // Step 2: Clone framework if needed (simulate by copying from parent directory)
      const frameworkSourcePath = path.resolve(__dirname, '..');
      const tempClonePath = path.join(projectPath, '.architecture-temp');
      
      results.push("\n📦 Installing framework templates...");
      
      // Copy framework files to temp location
      await fs.copy(frameworkSourcePath, tempClonePath, {
        filter: (src) => {
          const relativePath = path.relative(frameworkSourcePath, src);
          // Skip git, node_modules, and other non-template files
          return !relativePath.match(/^(.git|\.git|node_modules|mcp\/node_modules)/)
            && !relativePath.includes('README.md')
            && !relativePath.includes('USAGE')
            && !relativePath.includes('INSTALL.md');
        }
      });

      // Step 3: Move framework files to proper location
      const frameworkFiles = path.join(tempClonePath, '.architecture');
      if (await fs.pathExists(frameworkFiles)) {
        await fs.move(frameworkFiles, architecturePath);
      } else {
        // Create structure if no .architecture exists in source
        await this.createArchitectureStructure(architecturePath);
      }

      // Step 4: Create .coding-assistants structure 
      await fs.ensureDir(path.join(codingAssistantsPath, "claude"));
      await fs.ensureDir(path.join(codingAssistantsPath, "cursor"));
      await fs.ensureDir(path.join(codingAssistantsPath, "codex"));
      
      // Step 5: Customize members.yml based on project analysis
      results.push("\n👥 Customizing architecture team...");
      await this.customizeMembers(architecturePath, projectAnalysis);

      // Step 5b: Generate dispatchable subagents from the seeded roster (ADR-016).
      // Seeding members.yml is not enough — the team must exist as agents/*.md.
      const { generateAll } = await import("../tools/lib/subagent-generator.js");
      const seededMembersYaml = await fs.readFile(path.join(architecturePath, "members.yml"), "utf8");
      const subagents = generateAll(seededMembersYaml);
      const agentsDir = path.join(projectPath, "agents");
      await fs.ensureDir(agentsDir);
      for (const { filename, content } of subagents) {
        await fs.writeFile(path.join(agentsDir, filename), content);
      }
      const seededRoster = (yaml.parse(seededMembersYaml)?.members || []).map((m) => m.id);
      results.push(`- Seeded ${seededRoster.length} architects: ${seededRoster.join(', ')}`);
      results.push(`- Generated ${subagents.length} subagents in agents/`);

      // Step 6: Customize principles based on project
      results.push("\n📋 Customizing architectural principles...");
      await this.customizePrinciples(architecturePath, projectAnalysis);

      // Fail closed if the canonical config.yml (with pragmatic_mode) was not
      // carried in by the copy (ADR-016 — pragmatic mode must work out of the box).
      const configPath = path.join(architecturePath, "config.yml");
      if (!(await fs.pathExists(configPath)) || !/pragmatic_mode/.test(await fs.readFile(configPath, "utf8"))) {
        throw new Error("Seeded config.yml is missing or lacks pragmatic_mode; aborting (canonical copy incomplete).");
      }

      // Step 7: Set up templates
      results.push("\n📄 Setting up templates...");
      await this.setupTemplates(architecturePath, projectAnalysis);
      
      // Step 8: Update CLAUDE.md if it exists
      results.push("\n📝 Configuring CLAUDE.md integration...");
      await this.setupClaudeIntegration(claudeMdPath);
      
      // Step 9: Cleanup temporary files
      await fs.remove(tempClonePath);
      
      // Step 10: Conduct initial architectural analysis
      results.push("\n🔍 Conducting initial architectural analysis...");
      await this.conductInitialAnalysis(architecturePath, projectPath, projectAnalysis);
      
      results.push("\n✅ Framework setup complete!");
      results.push("\n🎯 Next steps:");
      results.push("- Review .architecture/reviews/initial-system-analysis.md");
      results.push("- Customize .architecture/members.yml for your team");
      results.push("- Create your first ADR with create_adr");
      results.push("- Start architecture reviews with the architecture-review skill");
      
      return {
        content: [
          {
            type: "text",
            text: results.join('\n'),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to set up architecture: ${error.message}`);
    }
  }

  async analyzeProject(projectPath) {
    const analysis = {
      languages: [],
      frameworks: [],
      framework: null,
      packageManager: null,
      architecture: 'unknown',
      hasTests: false,
      hasCI: false
    };
    
    try {
      const files = await fs.readdir(projectPath);
      
      // Detect languages and frameworks
      if (files.includes('package.json')) {
        analysis.packageManager = 'npm';
        analysis.languages.push('JavaScript');
        const packageJson = await fs.readJson(path.join(projectPath, 'package.json'));
        
        // Detect frameworks
        const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
        // Multi-valued: a repo can use more than one framework, and one manifest
        // must not mask another (ADR-016).
        if (deps.next) analysis.frameworks.push('Next.js');
        else if (deps.react) analysis.frameworks.push('React');
        if (deps.vue) analysis.frameworks.push('Vue');
        if (deps.angular) analysis.frameworks.push('Angular');
        if (deps.express) analysis.frameworks.push('Express');
        
        if (deps.typescript || files.includes('tsconfig.json')) {
          analysis.languages.push('TypeScript');
        }
      }
      
      if (files.includes('Gemfile') || files.includes('Rakefile')) {
        analysis.languages.push('Ruby');
        analysis.packageManager = 'bundler';
        // Detect Rails from Gemfile content, not just config/application.rb, so a
        // Gemfile-only Rails app is not missed (ADR-016).
        let gemfile = '';
        try { gemfile = await fs.readFile(path.join(projectPath, 'Gemfile'), 'utf8'); } catch { /* ignore */ }
        if (/gem\s+['"]rails['"]/.test(gemfile) || files.includes('config/application.rb')) {
          analysis.frameworks.push('Rails');
        }
      }
      
      if (files.includes('requirements.txt') || files.includes('pyproject.toml') || files.includes('setup.py')) {
        analysis.languages.push('Python');
        analysis.packageManager = 'pip';
        if (files.includes('manage.py')) analysis.frameworks.push('Django');
        else if (files.includes('app.py')) analysis.frameworks.push('Flask');
      }
      
      if (files.includes('pom.xml')) {
        analysis.languages.push('Java');
        analysis.packageManager = 'maven';
        analysis.frameworks.push('Spring Boot');
      }
      
      if (files.includes('Cargo.toml')) {
        analysis.languages.push('Rust');
        analysis.packageManager = 'cargo';
      }
      
      if (files.includes('go.mod')) {
        analysis.languages.push('Go');
        analysis.packageManager = 'go mod';
      }
      
      // Check for tests
      analysis.hasTests = files.some(f => f.includes('test') || f.includes('spec')) ||
                        await fs.pathExists(path.join(projectPath, 'tests')) ||
                        await fs.pathExists(path.join(projectPath, 'test'));
      
      // Check for CI
      analysis.hasCI = await fs.pathExists(path.join(projectPath, '.github', 'workflows')) ||
                      await fs.pathExists(path.join(projectPath, '.gitlab-ci.yml')) ||
                      files.includes('.travis.yml');
      
      // Back-compat: keep a single `framework` (first detected) for any remaining
      // caller; `frameworks` is the authoritative multi-valued list (ADR-016).
      analysis.framework = analysis.frameworks[0] || null;

      if (analysis.languages.length === 0) {
        analysis.languages.push('Multiple/Unknown');
      }
      
    } catch (error) {
      console.error('Error analyzing project:', error);
    }
    
    return analysis;
  }
  
  async createArchitectureStructure(architecturePath) {
    await fs.ensureDir(path.join(architecturePath, "decisions", "adrs"));
    await fs.ensureDir(path.join(architecturePath, "reviews"));
    await fs.ensureDir(path.join(architecturePath, "recalibration"));
    await fs.ensureDir(path.join(architecturePath, "comparisons"));
    await fs.ensureDir(path.join(architecturePath, "agent_docs"));
    await fs.ensureDir(path.join(architecturePath, "templates"));
  }
  
  async customizeMembers(architecturePath, analysis) {
    // ADR-016: the canonical members.yml is copied into the target during setup.
    // Preserve it as the source of truth — do NOT overwrite it with a hardcoded
    // list (that dropped 4 of the 8 architects and used the wrong id
    // `security_architect`). Validate the copy against the framework source so a
    // failed/partial copy fails loudly rather than seeding a lossy team. No stack
    // advisors are appended initially (canonical team only).
    const { assertContainsIds, CANONICAL_MEMBER_IDS } = await import("../tools/lib/roster-seeding.js");
    const targetMembersPath = path.join(architecturePath, "members.yml");
    const target = yaml.parse(await fs.readFile(targetMembersPath, "utf8"));

    // Fail closed against the KNOWN canonical contract (not the source copy,
    // which would validate vacuously if the source were itself drifted).
    assertContainsIds(target?.members, CANONICAL_MEMBER_IDS);
  }
  
  async customizePrinciples(architecturePath, analysis) {
    // ADR-016: the canonical principles.md is copied into the target during
    // setup. Preserve it — do NOT overwrite it, and do NOT write a separate
    // .architecture/decisions/principles.md (that mislocated file was the source
    // of broken links). Append a short technology-specific section to the
    // canonical .architecture/principles.md.
    const principlesPath = path.join(architecturePath, "principles.md");
    const frameworks = analysis.frameworks && analysis.frameworks.length
      ? analysis.frameworks
      : (analysis.framework ? [analysis.framework] : []);

    let techSection = `

## Technology-Specific Guidelines (added at setup)

### Languages: ${analysis.languages.join(', ')}
`;
    if (frameworks.length) {
      techSection += `### Frameworks: ${frameworks.join(', ')}\n`;
      for (const fw of frameworks) {
        techSection += `- Follow ${fw} architectural patterns and conventions\n`;
      }
    }
    if (analysis.packageManager) {
      techSection += `- Follow ${analysis.packageManager} dependency-management best practices\n`;
    }

    if (await fs.pathExists(principlesPath)) {
      await fs.appendFile(principlesPath, techSection);
    } else {
      // Canonical principles missing (structure created without a source) — write
      // the tech section as a minimal standalone file at the canonical path.
      await fs.writeFile(principlesPath, `# Architectural Principles\n${techSection}`);
    }
  }
  
  async setupTemplates(architecturePath, analysis) {
    const templatesPath = path.join(architecturePath, "templates");
    
    // ADR Template
    const adrTemplate = `# ADR [NUMBER]: [TITLE]

## Status

Proposed | Accepted | Superseded | Deprecated

## Context

[Describe the context and problem statement]

## Decision Drivers

- [Driver 1]
- [Driver 2]
- [Driver 3]

## Considered Options

- [Option 1]
- [Option 2]
- [Option 3]

## Decision Outcome

[Chosen option and justification]

### Positive Consequences

- [Positive consequence 1]
- [Positive consequence 2]

### Negative Consequences

- [Negative consequence 1]
- [Negative consequence 2]

## Implementation

[Implementation approach and timeline]

## Validation

[How to validate this decision]

## References

- [Reference 1]
- [Reference 2]
`;
    
    await fs.writeFile(path.join(templatesPath, "adr.md"), adrTemplate);
    
    // Review Template
    const reviewTemplate = `# Architecture Review: [TARGET]

## Review Overview

**Target**: [Version/Feature/Component]
**Date**: [Date]
**Participants**: [List of participants]
**Review Type**: [Version/Feature/Component]

## Executive Summary

[High-level findings and recommendations]

## Individual Member Reviews

[Individual perspective sections will be added here]

## Collaborative Discussion

### Key Findings
- [Finding 1]
- [Finding 2]

### Consensus Points
- [Point 1]
- [Point 2]

### Areas of Disagreement
- [Disagreement 1 and resolution]

## Technical Debt Assessment

### Current Technical Debt
- [Debt item 1]
- [Debt item 2]

### Proposed Debt Resolution
- [Resolution approach 1]
- [Resolution approach 2]

## Risk Analysis

### High Risk Areas
- [Risk 1]
- [Risk 2]

### Medium Risk Areas
- [Risk 1]
- [Risk 2]

### Risk Mitigation Strategies
- [Strategy 1]
- [Strategy 2]

## Recommendations

### High Priority (Immediate)
- [Recommendation 1]
- [Recommendation 2]

### Medium Priority (Next Release)
- [Recommendation 1]
- [Recommendation 2]

### Low Priority (Future)
- [Recommendation 1]
- [Recommendation 2]

## Architecture Metrics

[Relevant metrics and measurements]

## Next Steps

1. [Step 1]
2. [Step 2]
3. [Step 3]

## Appendices

### Architecture Diagrams
[Include relevant diagrams]

### Reference Materials
- [Reference 1]
- [Reference 2]

## Sign-off

- [ ] Systems Architect
- [ ] Security Architect
- [ ] [Other team members]
`;
    
    await fs.writeFile(path.join(templatesPath, "review.md"), reviewTemplate);
  }
  
  async setupClaudeIntegration(claudeMdPath) {
    const frameworkInstructions = `

## AI Software Architect Framework

This project uses the AI Software Architect framework for structured architecture management.

### Framework Usage
- **Architecture Reviews**: "Start architecture review for version X.Y.Z" or "Review architecture for 'component'"
- **Specialized Reviews**: "Ask Security Architect to review these code changes"
- **ADR Creation**: "Create an ADR for 'topic'"
- **Recalibration**: "Start architecture recalibration for 'feature name'"

### Framework Structure
- \`.architecture/decisions/\` - Architectural Decision Records and principles
- \`.architecture/reviews/\` - Architecture review documents
- \`.architecture/recalibration/\` - Implementation plans from reviews
- \`.architecture/members.yml\` - Architecture team member definitions

Refer to \`.architecture/decisions/principles.md\` for architectural guidance.
`;
    
    if (await fs.pathExists(claudeMdPath)) {
      const existingContent = await fs.readFile(claudeMdPath, 'utf8');
      if (!existingContent.includes('AI Software Architect Framework')) {
        await fs.appendFile(claudeMdPath, frameworkInstructions);
      }
    } else {
      await fs.writeFile(claudeMdPath, `# CLAUDE.md

Project instructions for Claude Code.${frameworkInstructions}`);
    }
  }
  
  async conductInitialAnalysis(architecturePath, projectPath, analysis) {
    const analysisContent = `# Initial System Architecture Analysis

**Date**: ${new Date().toISOString().split('T')[0]}
**Analyzed by**: AI Software Architect Framework (Initial Setup)

## Project Overview

**Languages**: ${analysis.languages.join(', ')}
**Frameworks**: ${(analysis.frameworks && analysis.frameworks.length) ? analysis.frameworks.join(', ') : 'None detected'}
**Package Manager**: ${analysis.packageManager || 'None detected'}
**Has Tests**: ${analysis.hasTests ? 'Yes' : 'No'}
**Has CI/CD**: ${analysis.hasCI ? 'Yes' : 'No'}

## Systems Architect Analysis

### System Structure
- Primary languages: ${analysis.languages.join(', ')}
${analysis.framework ? `- Framework architecture: ${analysis.framework}` : ''}
- Testing strategy: ${analysis.hasTests ? 'Present' : 'Needs Implementation'}
- CI/CD pipeline: ${analysis.hasCI ? 'Configured' : 'Not Detected'}

### Architectural Strengths
- Technology stack appears modern and well-supported
${analysis.framework ? `- Using established framework (${analysis.framework}) with strong community support` : ''}
${analysis.hasTests ? '- Testing infrastructure in place' : ''}

### Areas for Improvement
${!analysis.hasTests ? '- Consider implementing comprehensive testing strategy' : ''}
${!analysis.hasCI ? '- Consider setting up CI/CD pipeline for automated quality checks' : ''}
- Document architectural decisions as the system evolves

## Security Architect Analysis

### Security Considerations
- Framework security: ${analysis.framework ? `Review ${analysis.framework} security best practices` : 'Ensure secure coding practices'}
- Dependency management: Regular security updates for ${analysis.packageManager || 'dependencies'}
- Authentication/authorization patterns need architectural definition

### Security Recommendations
- Establish security review process for architectural changes
- Document authentication and authorization patterns
- Implement security scanning in development workflow

## Performance Specialist Analysis

### Performance Baseline
- Technology stack: Generally performant with ${analysis.languages.join(' and ')}
${analysis.framework ? `- ${analysis.framework} performance characteristics should be monitored` : ''}

### Performance Recommendations
- Establish performance monitoring and metrics
- Define performance requirements for key user journeys
- Consider performance implications in architectural decisions

## Maintainability Expert Analysis

### Code Quality Assessment
- Modern technology stack supports good maintainability practices
${analysis.hasTests ? '- Existing test infrastructure supports maintainable code' : ''}

### Maintainability Recommendations
- Document coding standards and conventions
- Establish code review process
- Regular refactoring to manage technical debt

## Collaborative Findings

### Immediate Priorities
1. Document current architectural decisions and patterns
2. Establish development and deployment standards
${!analysis.hasTests ? '3. Implement testing strategy' : ''}
${!analysis.hasCI ? '3. Set up CI/CD pipeline' : ''}

### Medium-term Goals
1. Regular architecture reviews as system evolves
2. Performance monitoring and optimization
3. Security architecture documentation

### Long-term Considerations
1. Scalability planning as system grows
2. Technology stack evolution strategy
3. Team knowledge sharing and documentation

## Next Steps

1. **Immediate**: Review and customize architectural principles in \`.architecture/principles.md\`
2. **Week 1**: Create ADRs for current major architectural decisions
3. **Month 1**: Establish regular architecture review schedule
4. **Ongoing**: Use framework for all significant architectural decisions

## Framework Integration

The AI Software Architect framework has been configured with:
- Architecture team members relevant to your technology stack
- Customized principles based on detected technologies
- Templates ready for ADRs and reviews
- CLAUDE.md integration for AI assistant collaboration

---

*This analysis was generated during framework setup. Update and extend as your understanding of the system grows.*
`;
    
    await fs.writeFile(
      path.join(architecturePath, "reviews", "initial-system-analysis.md"),
      analysisContent
    );
  }

  async createADR(args) {
    const { title, context, decision, consequences, projectPath } = args;
    const architecturePath = path.join(projectPath, ".architecture");
    
    if (!(await fs.pathExists(architecturePath))) {
      throw new Error("Architecture framework not set up. Run setup_architecture first.");
    }

    const adrsPath = path.join(architecturePath, "decisions", "adrs");
    
    // Get next ADR number
    const existingADRs = await fs.readdir(adrsPath).catch(() => []);
    const adrNumbers = existingADRs
      .filter(file => file.match(/^\d+/))
      .map(file => parseInt(file.match(/^(\d+)/)[1]))
      .sort((a, b) => a - b);
    
    const nextNumber = adrNumbers.length > 0 ? Math.max(...adrNumbers) + 1 : 1;
    const adrFilename = `${nextNumber.toString().padStart(4, '0')}-${title.toLowerCase().replace(/\s+/g, '-')}.md`;
    
    const adrContent = `# ADR ${nextNumber}: ${title}

## Status

Proposed

## Context

${context}

## Decision

${decision}

## Consequences

${consequences}

## Date

${new Date().toISOString().split('T')[0]}
`;

    await fs.writeFile(path.join(adrsPath, adrFilename), adrContent);

    return {
      content: [
        {
          type: "text",
          text: `✅ ADR created successfully!\n\nFile: .architecture/decisions/adrs/${adrFilename}\nNumber: ${nextNumber}\nTitle: ${title}`,
        },
      ],
    };
  }

  async listArchitectureMembers(args) {
    const { projectPath } = args;
    const membersPath = path.join(projectPath, ".architecture", "members.yml");
    
    if (!(await fs.pathExists(membersPath))) {
      return {
        content: [
          {
            type: "text",
            text: "❌ No architecture team members found. Run setup_architecture first.",
          },
        ],
      };
    }

    const membersContent = await fs.readFile(membersPath, 'utf8');
    const membersData = yaml.parse(membersContent);
    const members = membersData.members || [];

    if (members.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: "No team members configured in .architecture/members.yml",
          },
        ],
      };
    }

    const membersList = members.map(member => 
      `**${member.name}** (${member.title})\n` +
      `  - Specialties: ${member.specialties.join(', ')}\n` +
      `  - Domains: ${member.domains.join(', ')}\n` +
      `  - Perspective: ${member.perspective}\n`
    ).join('\n');

    return {
      content: [
        {
          type: "text",
          text: `## Architecture Team Members\n\n${membersList}\n\nUse the specialist-review skill with any of these specialists for focused reviews.`,
        },
      ],
    };
  }

  async getArchitectureStatus(args) {
    const { projectPath } = args;
    const architecturePath = path.join(projectPath, ".architecture");

    if (!(await fs.pathExists(architecturePath))) {
      return {
        content: [
          {
            type: "text",
            text: "❌ Architecture framework not set up. Run setup_architecture to initialize.",
          },
        ],
      };
    }

    const status = {
      setup: true,
      adrs: 0,
      reviews: 0,
      members: 0,
    };

    // Count ADRs
    const adrsPath = path.join(architecturePath, "decisions", "adrs");
    if (await fs.pathExists(adrsPath)) {
      const adrFiles = await fs.readdir(adrsPath);
      status.adrs = adrFiles.filter(f => f.endsWith('.md')).length;
    }

    // Count reviews
    const reviewsPath = path.join(architecturePath, "reviews");
    if (await fs.pathExists(reviewsPath)) {
      const reviewFiles = await fs.readdir(reviewsPath);
      status.reviews = reviewFiles.filter(f => f.endsWith('.md')).length;
    }

    // Count members
    const membersPath = path.join(architecturePath, "members.yml");
    if (await fs.pathExists(membersPath)) {
      const membersContent = await fs.readFile(membersPath, 'utf8');
      const membersData = yaml.parse(membersContent);
      status.members = (membersData.members || []).length;
    }

    return {
      content: [
        {
          type: "text",
          text: `## Architecture Framework Status\n\n✅ **Framework Setup**: Complete\n📋 **ADRs Created**: ${status.adrs}\n🔍 **Reviews Conducted**: ${status.reviews}\n👥 **Team Members**: ${status.members}\n\n### Available Actions\n- Use \`create_adr\` to document architectural decisions\n- Use \`the architecture-review skill\` for comprehensive reviews\n- Use \`the specialist-review skill\` for focused specialist input\n- Use \`list_architecture_members\` to see team composition`,
        },
      ],
    };
  }

  async configurePragmaticMode(args) {
    const { projectPath, enabled, intensity } = args;
    const architecturePath = path.join(projectPath, ".architecture");

    if (!(await fs.pathExists(architecturePath))) {
      throw new Error("Architecture framework not set up. Run setup_architecture first.");
    }

    const configPath = path.join(architecturePath, "config.yml");
    const templatePath = path.join(architecturePath, "templates", "config.yml");

    // Load or create config
    let config;
    if (await fs.pathExists(configPath)) {
      const configContent = await fs.readFile(configPath, 'utf8');
      config = yaml.parse(configContent);
    } else if (await fs.pathExists(templatePath)) {
      // Copy from template
      const templateContent = await fs.readFile(templatePath, 'utf8');
      config = yaml.parse(templateContent);
    } else {
      throw new Error("Configuration template not found. Framework may be incomplete.");
    }

    // Update pragmatic mode settings
    if (!config.pragmatic_mode) {
      config.pragmatic_mode = {};
    }

    if (enabled !== undefined) {
      config.pragmatic_mode.enabled = enabled;
    }

    if (intensity !== undefined) {
      config.pragmatic_mode.intensity = intensity;
    }

    // Ensure deferrals.md exists if tracking is enabled
    if (config.pragmatic_mode.enabled && config.pragmatic_mode.behavior?.track_deferrals) {
      const deferralsPath = path.join(architecturePath, "deferrals.md");
      const deferralsTemplatePath = path.join(architecturePath, "templates", "deferrals.md");

      if (!(await fs.pathExists(deferralsPath)) && (await fs.pathExists(deferralsTemplatePath))) {
        await fs.copy(deferralsTemplatePath, deferralsPath);
      }
    }

    // Write updated config
    await fs.writeFile(configPath, yaml.stringify(config));

    // Build status message
    const statusEnabled = config.pragmatic_mode.enabled ? "✅ Enabled" : "❌ Disabled";
    const statusIntensity = config.pragmatic_mode.intensity || "balanced";
    const deferralsTracking = config.pragmatic_mode.behavior?.track_deferrals ? "Enabled" : "Disabled";

    return {
      content: [
        {
          type: "text",
          text: `## Pragmatic Mode Configuration Updated\n\n**Status**: ${statusEnabled}\n**Intensity**: ${statusIntensity}\n**Deferrals Tracking**: ${deferralsTracking}\n\n### How Pragmatic Mode Works\n\nWhen enabled, the Pragmatic Enforcer will:\n- Challenge complexity and abstractions\n- Question "best practices" that may not apply\n- Propose simpler alternatives that meet current requirements\n- Score necessity vs. complexity (target ratio <1.5)\n- ${deferralsTracking === "Enabled" ? "Track deferred decisions in .architecture/deferrals.md" : "Not track deferrals"}\n\n### Intensity Levels\n\n**Strict**: Challenges aggressively, requires strong justification\n**Balanced**: Thoughtful challenges, accepts justified complexity (recommended)\n**Lenient**: Raises concerns without blocking\n\n### Configuration\n\nFull configuration saved to: \`.architecture/config.yml\`\n\nYou can manually edit this file to customize:\n- Exemptions (security, compliance, etc.)\n- Triggers (when to challenge)\n- Thresholds (complexity scores)\n- Review phases where Pragmatic Mode applies\n\n### Next Steps\n\n${config.pragmatic_mode.enabled ? "The Pragmatic Enforcer will now participate in:\n- Architecture reviews (the architecture-review skill)\n- Specialist reviews (the specialist-review skill)\n- ADR creation (create_adr)\n\nUse these tools and the Pragmatic Enforcer will challenge over-engineering." : "Pragmatic Mode is disabled. Set enabled=true to activate YAGNI enforcement."}`,
        },
      ],
    };
  }

  async getImplementationGuidance(args) {
    const { projectPath, featureDescription } = args;

    // Validate project path
    if (!fs.existsSync(projectPath)) {
      throw new Error(`Project path does not exist: ${projectPath}`);
    }

    const archPath = path.join(projectPath, ".architecture");
    if (!fs.existsSync(archPath)) {
      throw new Error(`No .architecture directory found at ${projectPath}. Run setup_architecture first.`);
    }

    // Read config.yml
    const configPath = path.join(archPath, "config.yml");
    if (!fs.existsSync(configPath)) {
      return {
        content: [
          {
            type: "text",
            text: "No config.yml found. Implementation guidance not configured.\n\nTo configure, add an 'implementation:' section to .architecture/config.yml with methodology, influences, and practices.",
          },
        ],
      };
    }

    const configContent = fs.readFileSync(configPath, "utf8");
    const config = yaml.parse(configContent);

    // Check if implementation is configured
    if (!config.implementation) {
      return {
        content: [
          {
            type: "text",
            text: "Implementation guidance not configured in config.yml.\n\nTo configure, add an 'implementation:' section with:\n- methodology: TDD, BDD, DDD, etc.\n- influences: List of thought leaders and sources\n- languages: Language-specific practices\n- testing, refactoring, quality standards\n\nSee .architecture/templates/config.yml for examples.",
          },
        ],
      };
    }

    const impl = config.implementation;

    // Check if enabled
    if (impl.enabled === false) {
      return {
        content: [
          {
            type: "text",
            text: "Implementation guidance is disabled in config.yml.\n\nTo enable, set implementation.enabled: true",
          },
        ],
      };
    }

    // Build implementation guidance report
    const report = [];
    report.push("# Implementation Guidance");
    report.push("");

    if (featureDescription) {
      report.push(`**Feature**: ${featureDescription}`);
      report.push("");
    }

    report.push("---");
    report.push("");

    // Methodology
    if (impl.methodology) {
      report.push("## Development Methodology");
      report.push("");
      report.push(`**Primary Approach**: ${impl.methodology}`);
      report.push("");

      const methodologies = {
        TDD: "Test-Driven Development: Write tests first, red-green-refactor cycle",
        BDD: "Behavior-Driven Development: Behavior-focused tests, outside-in development",
        DDD: "Domain-Driven Design: Focus on domain modeling, bounded contexts, ubiquitous language",
        "Test-Last": "Implementation first, comprehensive tests after",
        Exploratory: "Experiment with approaches, iterate and learn, codify successful patterns"
      };

      if (methodologies[impl.methodology]) {
        report.push(`**Description**: ${methodologies[impl.methodology]}`);
        report.push("");
      }
    }

    // Influences
    if (impl.influences && impl.influences.length > 0) {
      report.push("## Coding Influences");
      report.push("");
      report.push("Follow practices and principles from:");
      report.push("");
      impl.influences.forEach(influence => {
        report.push(`- ${influence}`);
      });
      report.push("");
    }

    // Language-specific practices
    if (impl.languages) {
      report.push("## Language-Specific Practices");
      report.push("");
      Object.entries(impl.languages).forEach(([lang, practices]) => {
        report.push(`### ${lang.charAt(0).toUpperCase() + lang.slice(1)}`);
        report.push("");
        if (practices.style_guide) {
          report.push(`**Style Guide**: ${practices.style_guide}`);
          report.push("");
        }
        if (practices.idioms) {
          report.push(`**Idioms**: ${practices.idioms}`);
          report.push("");
        }
        if (practices.frameworks) {
          report.push("**Frameworks**:");
          Object.entries(practices.frameworks).forEach(([framework, guidance]) => {
            report.push(`- ${framework}: ${guidance}`);
          });
          report.push("");
        }
      });
    }

    // Testing
    if (impl.testing) {
      report.push("## Testing Approach");
      report.push("");
      if (impl.testing.framework) {
        report.push(`**Framework**: ${impl.testing.framework}`);
      }
      if (impl.testing.style) {
        report.push(`**Style**: ${impl.testing.style}`);
      }
      if (impl.testing.approach) {
        report.push(`**Approach**: ${impl.testing.approach}`);
      }
      if (impl.testing.coverage) {
        report.push(`**Coverage Goal**: ${impl.testing.coverage}`);
      }
      if (impl.testing.speed) {
        report.push(`**Speed Targets**: ${impl.testing.speed}`);
      }
      report.push("");
    }

    // Refactoring
    if (impl.refactoring) {
      report.push("## Refactoring Guidelines");
      report.push("");
      if (impl.refactoring.when) {
        report.push("**When to Refactor**:");
        impl.refactoring.when.forEach(when => {
          report.push(`- ${when}`);
        });
        report.push("");
      }
      if (impl.refactoring.principles) {
        report.push("**Principles**:");
        impl.refactoring.principles.forEach(principle => {
          report.push(`- ${principle}`);
        });
        report.push("");
      }
    }

    // Quality
    if (impl.quality) {
      report.push("## Quality Standards");
      report.push("");
      if (impl.quality.definition_of_done) {
        report.push("**Definition of Done**:");
        impl.quality.definition_of_done.forEach(item => {
          report.push(`- ${item}`);
        });
        report.push("");
      }
      if (impl.quality.priorities) {
        report.push("**Quality Priorities**:");
        impl.quality.priorities.forEach(priority => {
          report.push(`- ${priority}`);
        });
        report.push("");
      }
    }

    // Security
    if (impl.security?.mandatory_practices) {
      report.push("## Security Practices");
      report.push("");
      report.push("**Mandatory** (always apply, exempt from YAGNI):");
      impl.security.mandatory_practices.forEach(practice => {
        report.push(`- ${practice}`);
      });
      report.push("");
    }

    // Performance
    if (impl.performance?.critical) {
      report.push("## Performance Considerations");
      report.push("");
      report.push("⚠️  **Performance-Critical System**: Extra attention to performance");
      report.push("");
      if (impl.performance.practices) {
        report.push("**Practices**:");
        impl.performance.practices.forEach(practice => {
          report.push(`- ${practice}`);
        });
        report.push("");
      }
      if (impl.performance.influences) {
        report.push("**Performance Influences**:");
        impl.performance.influences.forEach(influence => {
          report.push(`- ${influence}`);
        });
        report.push("");
      }
    }

    report.push("---");
    report.push("");
    report.push("## Usage");
    report.push("");
    report.push("Apply this guidance during implementation:");
    report.push("1. Follow the configured methodology");
    report.push("2. Reference the listed influences for techniques and patterns");
    report.push("3. Apply language-specific practices and idioms");
    report.push("4. Structure tests according to testing approach");
    report.push("5. Refactor at the specified times");
    report.push("6. Meet quality standards before completion");
    report.push("7. Always apply security practices");
    report.push("");
    report.push("**Tip**: This guidance is automatically applied when using 'Implement X as the architects' command in Claude Code.");

    return {
      content: [
        {
          type: "text",
          text: report.join('\n'),
        },
      ],
    };
  }

  async run() {
    await this._initServer();
    const { StdioServerTransport } = await import("@modelcontextprotocol/sdk/server/stdio.js");
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("AI Software Architect MCP server running on stdio");
  }
}

// Run as a server only when invoked directly; allows importing the class for
// tests/dogfood (ADR-016 fidelity test) without starting the stdio transport.
if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  const server = new ArchitectureServer();
  server.run().catch(console.error);
}