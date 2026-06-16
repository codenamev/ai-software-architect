#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fs from "fs-extra";
import path from "path";
import yaml from "yaml";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ArchitectureServer {
  constructor() {
    this.server = new Server(
      {
        name: "ai-software-architect",
        version: "1.5.4",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  setupErrorHandling() {
    this.server.onerror = (error) => console.error("[MCP Error]", error);
    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  setupToolHandlers() {
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
            name: "start_architecture_review",
            description: "Start a comprehensive architecture review",
            inputSchema: {
              type: "object",
              properties: {
                reviewTarget: {
                  type: "string",
                  description: "What to review (version number like '1.0.0' or feature name)",
                },
                projectPath: {
                  type: "string",
                  description: "Path to the project root directory",
                },
              },
              required: ["reviewTarget", "projectPath"],
            },
          },
          {
            name: "specialist_review",
            description: "Get a review from a specific architecture specialist",
            inputSchema: {
              type: "object",
              properties: {
                specialist: {
                  type: "string",
                  description: "Name or type of specialist (e.g., 'Security Architect', 'Performance Specialist')",
                },
                target: {
                  type: "string",
                  description: "What to review (code, design, component, etc.)",
                },
                projectPath: {
                  type: "string",
                  description: "Path to the project root directory",
                },
              },
              required: ["specialist", "target", "projectPath"],
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
            name: "pragmatic_enforcer",
            description: "Invoke the Pragmatic Enforcer to analyze proposals, code changes, designs, or architectural decisions for over-engineering and propose simpler alternatives",
            inputSchema: {
              type: "object",
              properties: {
                projectPath: {
                  type: "string",
                  description: "Path to the project root directory",
                },
                reviewType: {
                  type: "string",
                  description: "Type of review: 'proposal' (architectural recommendation), 'code' (code changes), 'design' (existing design), 'decision' (architectural decision), or 'implementation' (feature implementation)",
                  enum: ["proposal", "code", "design", "decision", "implementation"],
                },
                target: {
                  type: "string",
                  description: "The content to review (proposal text, code snippet, design description, decision description, or implementation plan)",
                },
                context: {
                  type: "string",
                  description: "Optional context: current requirements, constraints, why this is being proposed, what problem it solves",
                },
                source: {
                  type: "string",
                  description: "Optional: Who/what is the source (architect name, file path, PR number, etc.)",
                },
              },
              required: ["projectPath", "reviewType", "target"],
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
          case "start_architecture_review":
            return await this.startArchitectureReview(args);
          case "specialist_review":
            return await this.specialistReview(args);
          case "list_architecture_members":
            return await this.listArchitectureMembers(args);
          case "get_architecture_status":
            return await this.getArchitectureStatus(args);
          case "configure_pragmatic_mode":
            return await this.configurePragmaticMode(args);
          case "pragmatic_enforcer":
            return await this.pragmaticEnforcer(args);
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
      results.push(`- Framework: ${projectAnalysis.framework || 'None detected'}`);
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
      
      // Step 6: Customize principles based on project
      results.push("\n📋 Customizing architectural principles...");
      await this.customizePrinciples(architecturePath, projectAnalysis);
      
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
      results.push("- Start architecture reviews with start_architecture_review");
      
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
        if (deps.react) analysis.framework = 'React';
        else if (deps.vue) analysis.framework = 'Vue';
        else if (deps.angular) analysis.framework = 'Angular';
        else if (deps.express) analysis.framework = 'Express';
        else if (deps.next) analysis.framework = 'Next.js';
        
        if (deps.typescript || files.includes('tsconfig.json')) {
          analysis.languages.push('TypeScript');
        }
      }
      
      if (files.includes('Gemfile') || files.includes('Rakefile')) {
        analysis.languages.push('Ruby');
        analysis.packageManager = 'bundler';
        if (files.includes('config/application.rb')) analysis.framework = 'Rails';
      }
      
      if (files.includes('requirements.txt') || files.includes('pyproject.toml') || files.includes('setup.py')) {
        analysis.languages.push('Python');
        analysis.packageManager = 'pip';
        if (files.includes('manage.py')) analysis.framework = 'Django';
        else if (files.includes('app.py')) analysis.framework = 'Flask';
      }
      
      if (files.includes('pom.xml')) {
        analysis.languages.push('Java');
        analysis.packageManager = 'maven';
        analysis.framework = 'Spring Boot';
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
    const members = [
      {
        id: "systems_architect",
        name: "Systems Architect",
        title: "Senior Systems Architect",
        specialties: ["System Design", "Scalability", "Integration Patterns"],
        disciplines: ["Software Architecture", "Systems Engineering", "Platform Design"],
        skillsets: ["Microservices", "Event-Driven Architecture", "API Design"],
        domains: ["Enterprise Systems", "Distributed Systems", "Cloud Architecture"],
        perspective: "Focuses on overall system structure, scalability, and integration patterns"
      },
      {
        id: "security_architect",
        name: "Security Architect",
        title: "Security Architecture Specialist",
        specialties: ["Security Design", "Threat Modeling", "Compliance"],
        disciplines: ["Security Engineering", "Risk Assessment", "Privacy Engineering"],
        skillsets: ["Authentication", "Authorization", "Encryption", "Security Patterns"],
        domains: ["Application Security", "Infrastructure Security", "Data Protection"],
        perspective: "Evaluates security implications and ensures secure design patterns"
      },
      {
        id: "performance_specialist",
        name: "Performance Specialist",
        title: "Performance Engineering Expert",
        specialties: ["Performance Optimization", "Scalability", "Resource Management"],
        disciplines: ["Performance Engineering", "Load Testing", "Profiling"],
        skillsets: ["Caching", "Database Optimization", "CDN", "Monitoring"],
        domains: ["Web Performance", "Database Performance", "Infrastructure Performance"],
        perspective: "Focuses on system performance, bottlenecks, and optimization opportunities"
      },
      {
        id: "maintainability_expert",
        name: "Maintainability Expert",
        title: "Code Quality and Maintainability Specialist",
        specialties: ["Code Quality", "Technical Debt", "Refactoring"],
        disciplines: ["Software Engineering", "Code Review", "Testing"],
        skillsets: ["Clean Code", "Design Patterns", "Automated Testing", "Documentation"],
        domains: ["Code Quality", "Developer Experience", "Long-term Maintenance"],
        perspective: "Evaluates code maintainability, technical debt, and developer productivity"
      }
    ];
    
    // Add language-specific experts based on analysis
    if (analysis.languages.includes('JavaScript') || analysis.languages.includes('TypeScript')) {
      members.push({
        id: "javascript_expert",
        name: "JavaScript Expert",
        title: "JavaScript/TypeScript Specialist",
        specialties: ["JavaScript Patterns", "TypeScript", "Modern JS"],
        disciplines: ["Frontend Architecture", "Node.js", "Package Management"],
        skillsets: ["ES6+", "Async Programming", "Module Systems", "Build Tools"],
        domains: ["Frontend Development", "Node.js Backend", "Full-stack JavaScript"],
        perspective: "Evaluates JavaScript/TypeScript code quality, patterns, and best practices"
      });
    }
    
    if (analysis.framework) {
      const frameworkId = analysis.framework.toLowerCase().replace(/[^a-z0-9]/g, '_');
      members.push({
        id: `${frameworkId}_specialist`,
        name: `${analysis.framework} Specialist`,
        title: `${analysis.framework} Architecture Expert`,
        specialties: [`${analysis.framework} Patterns`, "Framework Best Practices", "Performance"],
        disciplines: ["Framework Architecture", "Component Design", "State Management"],
        skillsets: ["Framework APIs", "Ecosystem Tools", "Performance Optimization"],
        domains: [`${analysis.framework} Applications`, "Framework Patterns", "Best Practices"],
        perspective: `Evaluates ${analysis.framework} architecture, patterns, and framework-specific best practices`
      });
    }
    
    const membersData = { members };
    await fs.writeFile(
      path.join(architecturePath, "members.yml"),
      yaml.stringify(membersData)
    );
  }
  
  async customizePrinciples(architecturePath, analysis) {
    let principlesContent = `# Architectural Principles

## Core Principles

1. **Simplicity First** - Choose the simplest solution that meets requirements
2. **Maintainability** - Code should be easy to understand and modify
3. **Scalability** - Design for growth and changing requirements
4. **Security by Design** - Security considerations integrated from the start
5. **Performance Awareness** - Consider performance implications of decisions`;
    
    // Add framework-specific principles
    if (analysis.framework) {
      principlesContent += `
6. **${analysis.framework} Best Practices** - Follow established ${analysis.framework} patterns and conventions`;
    }
    
    if (analysis.hasTests) {
      principlesContent += `
7. **Test-Driven Architecture** - Design for testability and maintain comprehensive test coverage`;
    }
    
    principlesContent += `

## Technology-Specific Guidelines

### Languages: ${analysis.languages.join(', ')}
`;
    
    if (analysis.framework) {
      principlesContent += `### Framework: ${analysis.framework}
- Follow ${analysis.framework} architectural patterns
- Leverage framework-specific optimization techniques
- Maintain framework version compatibility

`;
    }
    
    principlesContent += `## Decision Making Process

- Document significant architectural decisions as ADRs
- Conduct regular architecture reviews
- Involve relevant specialists in decision-making
- Consider long-term implications
- Align with project technology stack: ${analysis.languages.join(', ')}`;
    
    if (analysis.packageManager) {
      principlesContent += `
- Follow ${analysis.packageManager} dependency management best practices`;
    }
    
    await fs.writeFile(
      path.join(architecturePath, "decisions", "principles.md"),
      principlesContent
    );
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
**Framework**: ${analysis.framework || 'None detected'}
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

1. **Immediate**: Review and customize architectural principles in \`.architecture/decisions/principles.md\`
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

  async startArchitectureReview(args) {
    const { reviewTarget, projectPath } = args;
    const architecturePath = path.join(projectPath, ".architecture");
    
    if (!(await fs.pathExists(architecturePath))) {
      throw new Error("Architecture framework not set up. Run setup_architecture first.");
    }

    const reviewsPath = path.join(architecturePath, "reviews");
    const membersPath = path.join(architecturePath, "members.yml");
    
    // Load team members
    let members = [];
    if (await fs.pathExists(membersPath)) {
      const membersContent = await fs.readFile(membersPath, 'utf8');
      const membersData = yaml.parse(membersContent);
      members = membersData.members || [];
    }

    const reviewFilename = `${reviewTarget.replace(/\s+/g, '-').toLowerCase()}.md`;
    
    const reviewContent = `# Architecture Review: ${reviewTarget}

## Review Overview

**Target**: ${reviewTarget}
**Date**: ${new Date().toISOString().split('T')[0]}
**Participants**: ${members.map(m => m.name).join(', ')}

## Individual Member Reviews

${members.map(member => `
### ${member.name} (${member.title})

**Perspective**: ${member.perspective}

**Areas of Focus**: ${member.specialties.join(', ')}

**Findings**:
- [To be filled during review]

**Recommendations**:
- [To be filled during review]

**Risk Assessment**:
- [To be filled during review]

---
`).join('')}

## Collaborative Discussion

[Summary of team discussion and consensus findings]

## Final Recommendations

### High Priority
- [Critical items requiring immediate attention]

### Medium Priority  
- [Important improvements for near-term implementation]

### Low Priority
- [Nice-to-have enhancements for future consideration]

## Next Steps

1. [Immediate actions]
2. [Short-term planning]
3. [Long-term considerations]

## Sign-off

- [ ] Systems Architect
- [ ] Security Architect
${members.filter(m => !['systems_architect', 'security_architect'].includes(m.id)).map(m => `- [ ] ${m.name}`).join('\n')}
`;

    await fs.writeFile(path.join(reviewsPath, reviewFilename), reviewContent);

    return {
      content: [
        {
          type: "text",
          text: `✅ Architecture review started!\n\nReview document: .architecture/reviews/${reviewFilename}\nParticipants: ${members.map(m => m.name).join(', ')}\n\nThe review template has been created with sections for each team member. Fill in their individual perspectives, then complete the collaborative discussion and final recommendations.`,
        },
      ],
    };
  }

  async specialistReview(args) {
    const { specialist, target, projectPath } = args;
    const architecturePath = path.join(projectPath, ".architecture");
    
    if (!(await fs.pathExists(architecturePath))) {
      throw new Error("Architecture framework not set up. Run setup_architecture first.");
    }

    const membersPath = path.join(architecturePath, "members.yml");
    
    // Load team members to find specialist
    let members = [];
    if (await fs.pathExists(membersPath)) {
      const membersContent = await fs.readFile(membersPath, 'utf8');
      const membersData = yaml.parse(membersContent);
      members = membersData.members || [];
    }

    // Find matching specialist
    const member = members.find(m => 
      m.name.toLowerCase().includes(specialist.toLowerCase()) ||
      m.title.toLowerCase().includes(specialist.toLowerCase()) ||
      m.specialties.some(s => s.toLowerCase().includes(specialist.toLowerCase()))
    );

    if (!member) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Specialist "${specialist}" not found in team members.\n\nAvailable specialists:\n${members.map(m => `- ${m.name} (${m.title}): ${m.specialties.join(', ')}`).join('\n')}\n\nUse list_architecture_members to see all available team members.`,
          },
        ],
      };
    }

    const reviewContent = `# Specialist Review: ${member.name}

## Review Details

**Specialist**: ${member.name} (${member.title})
**Target**: ${target}
**Date**: ${new Date().toISOString().split('T')[0]}
**Perspective**: ${member.perspective}

## Specialist Analysis

### Areas of Expertise
${member.specialties.map(s => `- ${s}`).join('\n')}

### Review Focus
${member.domains.map(d => `- ${d}`).join('\n')}

### Key Findings

#### Strengths
- [Identify positive aspects from specialist perspective]

#### Concerns  
- [Highlight areas of concern or risk]

#### Gaps
- [Note missing elements or incomplete implementations]

### Recommendations

#### Immediate Actions
- [Critical items requiring prompt attention]

#### Improvements
- [Enhancements to consider]

#### Best Practices
- [Industry standards and recommended approaches]

### Risk Assessment

**Risk Level**: [High/Medium/Low]

**Key Risks**:
- [List primary risks from specialist viewpoint]

**Mitigation Strategies**:
- [Recommended approaches to address risks]

## Summary

[Concise summary of specialist findings and top recommendations]

---
**Specialist Sign-off**: ${member.name}
`;

    const reviewsPath = path.join(architecturePath, "reviews");
    const filename = `specialist-${member.id}-${target.replace(/\s+/g, '-').toLowerCase()}.md`;
    
    await fs.writeFile(path.join(reviewsPath, filename), reviewContent);

    return {
      content: [
        {
          type: "text",
          text: `✅ Specialist review initiated!\n\n**Specialist**: ${member.name} (${member.title})\n**Focus Areas**: ${member.specialties.join(', ')}\n**Review Document**: .architecture/reviews/${filename}\n\nThe specialist review template has been created with sections tailored to ${member.name}'s expertise. Complete the analysis from their specialized perspective.`,
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
          text: `## Architecture Team Members\n\n${membersList}\n\nUse specialist_review with any of these specialists for focused reviews.`,
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
          text: `## Architecture Framework Status\n\n✅ **Framework Setup**: Complete\n📋 **ADRs Created**: ${status.adrs}\n🔍 **Reviews Conducted**: ${status.reviews}\n👥 **Team Members**: ${status.members}\n\n### Available Actions\n- Use \`create_adr\` to document architectural decisions\n- Use \`start_architecture_review\` for comprehensive reviews\n- Use \`specialist_review\` for focused specialist input\n- Use \`list_architecture_members\` to see team composition`,
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
          text: `## Pragmatic Mode Configuration Updated\n\n**Status**: ${statusEnabled}\n**Intensity**: ${statusIntensity}\n**Deferrals Tracking**: ${deferralsTracking}\n\n### How Pragmatic Mode Works\n\nWhen enabled, the Pragmatic Enforcer will:\n- Challenge complexity and abstractions\n- Question "best practices" that may not apply\n- Propose simpler alternatives that meet current requirements\n- Score necessity vs. complexity (target ratio <1.5)\n- ${deferralsTracking === "Enabled" ? "Track deferred decisions in .architecture/deferrals.md" : "Not track deferrals"}\n\n### Intensity Levels\n\n**Strict**: Challenges aggressively, requires strong justification\n**Balanced**: Thoughtful challenges, accepts justified complexity (recommended)\n**Lenient**: Raises concerns without blocking\n\n### Configuration\n\nFull configuration saved to: \`.architecture/config.yml\`\n\nYou can manually edit this file to customize:\n- Exemptions (security, compliance, etc.)\n- Triggers (when to challenge)\n- Thresholds (complexity scores)\n- Review phases where Pragmatic Mode applies\n\n### Next Steps\n\n${config.pragmatic_mode.enabled ? "The Pragmatic Enforcer will now participate in:\n- Architecture reviews (start_architecture_review)\n- Specialist reviews (specialist_review)\n- ADR creation (create_adr)\n\nUse these tools and the Pragmatic Enforcer will challenge over-engineering." : "Pragmatic Mode is disabled. Set enabled=true to activate YAGNI enforcement."}`,
        },
      ],
    };
  }

  async pragmaticEnforcer(args) {
    const { projectPath, reviewType, target, context, source } = args;
    const architecturePath = path.join(projectPath, ".architecture");

    if (!(await fs.pathExists(architecturePath))) {
      throw new Error("Architecture framework not set up. Run setup_architecture first.");
    }

    // Load pragmatic mode configuration
    const configPath = path.join(architecturePath, "config.yml");
    let config = null;
    let intensity = "balanced";

    if (await fs.pathExists(configPath)) {
      const configContent = await fs.readFile(configPath, 'utf8');
      config = yaml.parse(configContent);
      intensity = config?.pragmatic_mode?.intensity || "balanced";
    }

    // Define intensity-specific behaviors
    const intensityBehaviors = {
      strict: {
        stance: "Challenges aggressively, requires strong justification for any complexity",
        threshold: "Very high bar - must be absolutely necessary",
        defaultRecommendation: "Defer or Simplify"
      },
      balanced: {
        stance: "Challenges thoughtfully, accepts justified complexity",
        threshold: "Reasonable bar - should have clear current value",
        defaultRecommendation: "Evaluate trade-offs"
      },
      lenient: {
        stance: "Raises concerns without blocking, suggests alternatives",
        threshold: "Low bar - raises awareness of simpler options",
        defaultRecommendation: "Consider alternatives"
      }
    };

    const behavior = intensityBehaviors[intensity];

    // Build the analysis report
    const reviewTypeLabels = {
      proposal: "Architectural Proposal",
      code: "Code Changes",
      design: "Existing Design",
      decision: "Architectural Decision",
      implementation: "Implementation Plan"
    };

    const report = [];
    report.push("# Pragmatic Enforcer Analysis");
    report.push("");
    report.push(`**Review Type**: ${reviewTypeLabels[reviewType]}`);
    report.push(`**Intensity Mode**: ${intensity} (${behavior.stance})`);
    if (source) report.push(`**Source**: ${source}`);
    report.push("");
    report.push("---");
    report.push("");

    // Show what's being reviewed
    report.push("## Target Under Review");
    report.push("");
    report.push("```");
    report.push(target);
    report.push("```");
    report.push("");

    if (context) {
      report.push("## Context");
      report.push("");
      report.push(context);
      report.push("");
    }

    report.push("---");
    report.push("");
    report.push("## Pragmatic Analysis Framework");
    report.push("");
    report.push("The Pragmatic Enforcer will now analyze this through the YAGNI lens:");
    report.push("");

    report.push("### Key Questions to Answer");
    report.push("");
    report.push("**Necessity Questions:**");
    report.push("- Do we need this right now?");
    report.push("- What breaks if we don't implement this?");
    report.push("- What current requirement does this address?");
    report.push("");

    report.push("**Simplicity Questions:**");
    report.push("- What's the simplest thing that could work?");
    report.push("- Can we solve this with less code/complexity?");
    report.push("- What are we assuming about the future?");
    report.push("");

    report.push("**Cost Questions:**");
    report.push("- What's the cost of implementing this now?");
    report.push("- What's the cost of waiting until we actually need it?");
    report.push("- What's the maintenance burden?");
    report.push("");

    report.push("**Alternative Questions:**");
    report.push("- What if we just... [propose simpler alternative]?");
    report.push("- Could we use an existing tool/pattern?");
    report.push("- Can we defer part of this?");
    report.push("");

    report.push("**Best Practice Questions:**");
    report.push("- Does this best practice apply to our context?");
    report.push("- Is this over-engineering for our scale?");
    report.push("- Are we cargo-culting?");
    report.push("");

    report.push("---");
    report.push("");
    report.push("## Analysis Template");
    report.push("");
    report.push("Please provide your analysis using this structure:");
    report.push("");

    report.push("### 1. Necessity Assessment (Score 0-10)");
    report.push("");
    report.push("**Current Need**: [Score /10]");
    report.push("- Analysis: [Why is this needed RIGHT NOW?]");
    report.push("- Requirements addressed: [List current requirements]");
    report.push("");
    report.push("**Future Need**: [Score /10]");
    report.push("- Analysis: [What future scenarios need this?]");
    report.push("- Likelihood: [How certain are these scenarios?]");
    report.push("");
    report.push("**Cost of Waiting**: [Low / Medium / High]");
    report.push("- Analysis: [What happens if we defer this?]");
    report.push("- Reversibility: [How hard to add later?]");
    report.push("");
    report.push("**Overall Necessity Score**: [0-10]");
    report.push("");

    report.push("### 2. Complexity Assessment (Score 0-10)");
    report.push("");
    report.push("**Added Complexity**: [Score /10]");
    report.push("- New abstractions: [List]");
    report.push("- New dependencies: [List]");
    report.push("- Lines of code: [Estimate]");
    report.push("- Files affected: [Count]");
    report.push("");
    report.push("**Maintenance Burden**: [Score /10]");
    report.push("- Ongoing maintenance: [Description]");
    report.push("- Testing requirements: [Description]");
    report.push("- Documentation needs: [Description]");
    report.push("");
    report.push("**Learning Curve**: [Score /10]");
    report.push("- New concepts to learn: [List]");
    report.push("- Team familiarity: [Assessment]");
    report.push("");
    report.push("**Overall Complexity Score**: [0-10]");
    report.push("");

    report.push("### 3. Complexity-to-Necessity Ratio");
    report.push("");
    report.push("**Ratio**: [Complexity Score / Necessity Score]");
    report.push("");
    report.push("**Target**: < 1.5 (complexity should not exceed necessity by more than 50%)");
    report.push("");
    report.push("**Assessment**: ");
    report.push("- ✅ Acceptable (< 1.5): Complexity is justified");
    report.push("- ⚠️  Borderline (1.5 - 2.0): Question carefully");
    report.push("- ❌ Over-engineered (> 2.0): Strong challenge");
    report.push("");

    report.push("### 4. Simpler Alternative");
    report.push("");
    report.push("**Proposal**: [Describe a concrete simpler approach]");
    report.push("");
    report.push("**What it includes**: [List]");
    report.push("");
    report.push("**What it excludes**: [List]");
    report.push("");
    report.push("**Why it's sufficient**: [Explanation]");
    report.push("");

    report.push("### 5. Recommendation");
    report.push("");
    report.push("Choose one:");
    report.push("");
    report.push("- **✅ Implement Now**: Complexity is justified, necessity is high, proceed as proposed");
    report.push("- **🔧 Simplified Version**: Implement the simpler alternative described above");
    report.push("- **⏸️  Defer**: Wait until we have evidence we need this");
    report.push("- **❌ Skip**: Not needed, doesn't add value");
    report.push("");
    report.push("**Recommendation**: [Your choice]");
    report.push("");

    report.push("### 6. Justification");
    report.push("");
    report.push("[Provide clear reasoning for your recommendation]");
    report.push("");

    report.push("---");
    report.push("");
    report.push("## Exemption Check");
    report.push("");

    if (config?.pragmatic_mode?.exemptions) {
      const exemptions = config.pragmatic_mode.exemptions;
      report.push("The following areas are exempt from simplification (but may be phased):");
      report.push("");
      if (exemptions.security_critical) report.push("- ✅ Security-critical features");
      if (exemptions.data_integrity) report.push("- ✅ Data integrity requirements");
      if (exemptions.compliance_required) report.push("- ✅ Compliance requirements");
      if (exemptions.accessibility) report.push("- ✅ Accessibility requirements");
      report.push("");
      report.push("If this review involves any exempt areas, note that in your analysis.");
      report.push("");
    }

    report.push("---");
    report.push("");
    report.push("## Intensity-Specific Guidance");
    report.push("");
    report.push(`**Current Intensity: ${intensity}**`);
    report.push("");
    report.push(`**Stance**: ${behavior.stance}`);
    report.push(`**Threshold**: ${behavior.threshold}`);
    report.push(`**Default Lean**: ${behavior.defaultRecommendation}`);
    report.push("");

    if (config?.pragmatic_mode?.enabled === false) {
      report.push("---");
      report.push("");
      report.push("⚠️  **Note**: Pragmatic Mode is currently disabled in config.yml");
      report.push("");
      report.push("To enable automatic pragmatic enforcement in reviews, use `configure_pragmatic_mode`");
      report.push("");
    }

    return {
      content: [
        {
          type: "text",
          text: report.join('\n'),
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
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("AI Software Architect MCP server running on stdio");
  }
}

const server = new ArchitectureServer();
server.run().catch(console.error);