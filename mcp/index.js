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
import os from "os";
import { fileURLToPath, pathToFileURL } from "url";
// Note: setup-only helpers (subagent generator, roster validation) live in
// tools/lib of the framework tree and are imported dynamically inside
// setupArchitecture from the discovered framework root (see
// resolveFrameworkSource), so the MCP server still loads when run outside the
// full framework tree (e.g. the published npm package, which ships index.js
// alone: Tier-1 tools work, and setup finds the tree through the plugin).

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Framework source discovery (ADR-016, Decision 1). The same sentinel and the
// same plugin walk as tools/lib/setup-source-discovery.js, inlined because the
// npm tarball carries index.js alone and cannot import tools/. A candidate is a
// framework root only if it carries the sentinel; setup also needs the two
// tools/lib modules below, so they are checked before a single byte is written.
const PLUGIN_NAME = "ai-software-architect";
const SOURCE_SENTINEL = path.join(".architecture", "templates", "adr-template.md");
const SETUP_LIBS = ["subagent-generator.js", "roster-seeding.js"];
const PLUGIN_WALK_DEPTH = 5;

function subdirectories(dir) {
  try {
    return fs.readdirSync(dir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => path.join(dir, entry.name));
  } catch {
    return [];
  }
}

// Every directory under pluginsDir named after the plugin, plus each one's
// immediate subdirectories: Claude Code installs under
// cache/<marketplace>/<plugin>/<version>/, so the tree sits one level below
// the plugin's name, and for this project the marketplace carries the same
// name one level above that. The walk continues through a match for the same
// reason. Sorted, so the pick is deterministic when several qualify.
function listPluginCandidates(pluginsDir, maxDepth = PLUGIN_WALK_DEPTH) {
  const matches = new Set();
  const stack = [{ dir: pluginsDir, depth: 0 }];
  // Claude Code marks the previous version `.orphaned_at` on update and keeps
  // it around for a while; it is not the installed plugin, so it never counts.
  const live = (dir) => !fs.existsSync(path.join(dir, ".orphaned_at"));
  while (stack.length > 0) {
    const { dir, depth } = stack.pop();
    if (depth > maxDepth) continue;
    for (const child of subdirectories(dir)) {
      if (path.basename(child) === PLUGIN_NAME) {
        if (live(child)) matches.add(child);
        for (const version of subdirectories(child)) if (live(version)) matches.add(version);
      }
      stack.push({ dir: child, depth: depth + 1 });
    }
  }
  return [...matches].sort();
}

// The member entries of a members.yml, read as tools/lib/subagent-generator.js
// reads them: an empty or comment-only file (which parses to null), a bare
// `members:`, or a non-list `members:` value all yield no members. Entries
// that aren't maps (a bare `-`) are skipped. Malformed YAML still throws.
function rosterEntries(membersYaml) {
  const doc = yaml.parse(membersYaml);
  const members = Array.isArray(doc?.members) ? doc.members : [];
  return members.filter((member) => member && typeof member === "object" && !Array.isArray(member));
}

const SOURCE_NOT_FOUND_GUIDANCE =
  `Framework source for "${PLUGIN_NAME}" not found, so nothing was written. ` +
  "The MCP server looks in CLAUDE_PLUGIN_ROOT, then its own checkout, then ~/.claude/plugins. Either:\n" +
  "  1. Install the plugin (recommended):\n" +
  "       /plugin marketplace add codenamev/ai-software-architect\n" +
  "       /plugin install ai-software-architect@ai-software-architect\n" +
  "  2. Point CLAUDE_PLUGIN_ROOT at a clone of https://github.com/codenamev/ai-software-architect";

export class ArchitectureServer {
  constructor() {
    // MCP server object is created lazily in _initServer() so that importing
    // this class does not require @modelcontextprotocol/sdk to be resolvable.
    process.on("SIGINT", async () => {
      if (this.server) await this.server.close();
      process.exit(0);
    });
  }

  // Lazily initialise the MCP server and register all tools.
  // Safe to call multiple times (no-op after first call).
  async _initServer() {
    if (this.server) return;
    const { McpServer } = await import("@modelcontextprotocol/sdk/server/mcp.js");
    const { z } = await import("zod");

    this.server = new McpServer(
      { name: "ai-software-architect", version: "1.6.0" },
      { capabilities: { tools: {} } }
    );
    this.server.server.onerror = (error) => console.error("[MCP Error]", error);
    this._setupToolHandlers(z);
  }

  // Kept for API compatibility; no-op now that setup happens in _initServer.
  setupErrorHandling() {}

  // Register the six Tier-1 tools. Each inputSchema is a zod shape: the SDK
  // derives the advertised JSON Schema from it AND validates every tools/call
  // against it before the handler runs, so the contract a client reads is the
  // contract the server enforces. A missing required field is rejected with a
  // message naming the field instead of surfacing as a Node internals error
  // from path.join(undefined, ...).
  _setupToolHandlers(z) {
    const projectPath = z.string().describe("Path to the project root directory");

    const tools = [
      {
        name: "setup_architecture",
        description: "Set up the AI Software Architect framework in the current project",
        inputSchema: { projectPath },
        handler: (args) => this.setupArchitecture(args),
      },
      {
        name: "create_adr",
        description: "Create an Architectural Decision Record (ADR)",
        inputSchema: {
          title: z.string().describe("Title of the ADR"),
          context: z.string().describe("Context and background for the decision"),
          decision: z.string().describe("The architectural decision being made"),
          consequences: z.string().describe("Consequences of this decision"),
          supersedes: z.string().regex(/^ADR-\d{3}$/, 'supersedes must look like "ADR-007"').optional()
            .describe('ID of an existing ADR this one replaces (e.g. "ADR-007"). The old ADR is marked "status: superseded" with "superseded-by" pointing here, in the same call.'),
          projectPath,
        },
        handler: (args) => this.createADR(args),
      },
      {
        name: "list_architecture_members",
        description: "List all available architecture team members and their specialties",
        inputSchema: { projectPath },
        handler: (args) => this.listArchitectureMembers(args),
      },
      {
        name: "get_architecture_status",
        description: "Get the current status of architecture documentation and decisions",
        inputSchema: { projectPath },
        handler: (args) => this.getArchitectureStatus(args),
      },
      {
        name: "find_relevant_adrs",
        description:
          "Find the ADRs that govern a question or a file. Call this before changing code or proposing a design, " +
          "so you build on recorded decisions instead of contradicting them. Pass a question (keyword match on " +
          "ADR titles and bodies), a file path (matched against each ADR's `affects:` globs), or both. " +
          "Superseded ADRs come back with current: false and their successors; follow the chain rather than " +
          "treating them as in force.",
        inputSchema: {
          projectPath,
          query: z.string().optional().describe("Question or topic, e.g. 'how do we version the MCP server?'"),
          filePath: z.string().optional().describe("Project-relative path of a file you are about to change"),
          limit: z.number().int().min(1).max(20).optional().describe("Maximum ADRs to return (default 5)"),
        },
        handler: (args) => this.findRelevantADRs(args),
      },
      {
        name: "configure_pragmatic_mode",
        description: "Enable and configure Pragmatic Mode (YAGNI Enforcement) to prevent over-engineering",
        inputSchema: {
          projectPath,
          enabled: z.boolean().optional().describe("Enable or disable Pragmatic Mode"),
          intensity: z
            .enum(["strict", "balanced", "lenient"])
            .optional()
            .describe("Intensity level: 'strict', 'balanced', or 'lenient'"),
        },
        handler: (args) => this.configurePragmaticMode(args),
      },
      {
        name: "get_implementation_guidance",
        description:
          "Get implementation methodology, influences, and practices configuration for 'Implement as the architects' command. Returns configured methodology (TDD, BDD, etc.), influences (Kent Beck, Sandi Metz, etc.), language-specific practices, testing approach, refactoring guidelines, and quality standards.",
        inputSchema: {
          projectPath,
          featureDescription: z
            .string()
            .optional()
            .describe("Optional: Description of the feature being implemented (for context-specific guidance)"),
        },
        handler: (args) => this.getImplementationGuidance(args),
      },
    ];

    for (const { name, description, inputSchema, handler } of tools) {
      this.server.registerTool(name, { description, inputSchema }, async (args) => {
        try {
          return await handler(args);
        } catch (error) {
          // Tool ran and failed: report it as a tool-execution error. Schema
          // violations and unknown tool names never reach here - the SDK
          // rejects those before the handler is invoked.
          return {
            content: [{ type: "text", text: `Error: ${error.message}` }],
            isError: true,
          };
        }
      });
    }
  }

  // Where the framework tree lives. In a repo checkout it is the server's
  // parent directory; when the server runs from the published package (the
  // plugin's .mcp.json: `npx -y ai-software-architect`) that parent is the npx
  // cache's node_modules, which is why the sentinel check is mandatory and why
  // the installed plugin is searched. Order: an explicit CLAUDE_PLUGIN_ROOT,
  // the checkout the server was loaded from, then the installed plugin.
  //
  // A candidate with the sentinel must also LOAD both setup libraries here, so
  // a tree that would fail at step 5 (an older plugin whose generator still
  // imports yaml at module load, or one predating roster-seeding.js) is skipped
  // in favour of the next candidate and never gets to write half an install.
  // Resolves to { root, libs }; libs are the loaded modules, so the setup steps
  // use exactly what was checked.
  async resolveFrameworkSource() {
    const candidates = [];
    if (process.env.CLAUDE_PLUGIN_ROOT) candidates.push(process.env.CLAUDE_PLUGIN_ROOT);
    candidates.push(path.resolve(__dirname, ".."));
    const pluginsDir = path.join(os.homedir(), ".claude", "plugins");
    if (await fs.pathExists(pluginsDir)) candidates.push(...listPluginCandidates(pluginsDir));

    const incomplete = [];
    for (const candidate of candidates) {
      if (!(await fs.pathExists(path.join(candidate, SOURCE_SENTINEL)))) continue;
      try {
        const [generator, roster] = await Promise.all(
          SETUP_LIBS.map((lib) => this.importFrameworkLib(candidate, lib))
        );
        return { root: candidate, libs: { ...generator, ...roster } };
      } catch (error) {
        incomplete.push(`${candidate} (${error.code || error.name}: ${error.message.split("\n")[0]})`);
      }
    }
    if (incomplete.length) {
      throw new Error(
        "Every framework source found is incomplete, so nothing was written:\n" +
        incomplete.map((line) => `  - ${line}`).join("\n") + "\n" +
        "Update the plugin (/plugin update ai-software-architect), or point CLAUDE_PLUGIN_ROOT at a complete checkout."
      );
    }
    throw new Error(SOURCE_NOT_FOUND_GUIDANCE);
  }

  // Import one of the setup helpers from the framework root. A file URL so the
  // absolute path imports on every platform.
  async importFrameworkLib(frameworkRoot, lib) {
    return import(pathToFileURL(path.join(frameworkRoot, "tools", "lib", lib)).href);
  }

  async setupArchitecture(args) {
    const { projectPath } = args;
    const architecturePath = path.join(projectPath, ".architecture");
    const codingAssistantsPath = path.join(projectPath, ".coding-assistants");
    const claudeMdPath = path.join(projectPath, "CLAUDE.md");
    // Scratch copy of the framework. Declared outside the try so the finally
    // block can always reach it — a failure anywhere between the copy and the
    // cleanup step must not strand .architecture-temp in the user's project.
    const tempClonePath = path.join(projectPath, '.architecture-temp');
    let tempCloneStarted = false;
    
    try {
      // Check if .architecture already exists
      if (await fs.pathExists(architecturePath)) {
        // A directory with no members.yml is the skeleton a failed setup left
        // behind (1.6.0 created it before the framework source was checked),
        // not an install, so lead with that diagnosis instead of calling it done.
        // Removal is only suggested outright when the tree holds no files:
        // create_adr writes into a skeleton, and ADRs are the user's history.
        let text = "Architecture framework is already set up in this project. Use get_architecture_status to see current state.";
        if (!(await fs.pathExists(path.join(architecturePath, "members.yml")))) {
          const entries = await fs.readdir(architecturePath, { recursive: true, withFileTypes: true });
          const files = entries.filter((entry) => entry.isFile()).length;
          text = ".architecture/ exists but has no members.yml, so it is probably left over from a failed setup, not a working install. " +
            (files === 0
              ? "Remove .architecture/ (and .architecture-temp/ or an empty .coding-assistants/ if present) and run setup_architecture again."
              : `It holds ${files} file(s), such as ADRs created since: move anything you want to keep out of .architecture/ first, then remove it (and .architecture-temp/ or an empty .coding-assistants/ if present) and run setup_architecture again.`);
        }
        return {
          content: [
            {
              type: "text",
              text,
            },
          ],
        };
      }

      // Step 0: Resolve the framework source before anything is written. A
      // missing or incomplete source used to surface as a module-not-found
      // throw after the .architecture skeleton existed, which then tripped the
      // already-set-up guard above on every retry (#85).
      const { root: frameworkSourcePath, libs } = await this.resolveFrameworkSource();

      const results = [];
      results.push("🚀 Setting up AI Software Architect framework...");
      results.push(`- Framework source: ${frameworkSourcePath}`);

      // Step 1: Analyze target project
      results.push("\n📊 Analyzing project structure...");
      const projectAnalysis = await this.analyzeProject(projectPath);
      results.push(`- Detected languages: ${projectAnalysis.languages.join(', ')}`);
      results.push(`- Frameworks: ${projectAnalysis.frameworks.length ? projectAnalysis.frameworks.join(', ') : 'None detected'}`);
      results.push(`- Package manager: ${projectAnalysis.packageManager || 'None detected'}`);

      // Step 2: Scratch-copy the resolved framework tree
      results.push("\n📦 Installing framework templates...");
      
      // Copy framework files to temp location
      tempCloneStarted = true;
      await fs.copy(frameworkSourcePath, tempClonePath, {
        filter: (src) => {
          const relativePath = path.relative(frameworkSourcePath, src);
          // Skip git and any node_modules (root, mcp/, tools/, …) — a nested
          // node_modules must never be copied into the target project.
          if (relativePath.match(/^\.git(\/|$)/)) return false;
          if (relativePath.split(path.sep).includes("node_modules")) return false;
          // Skip the repo's own top-level docs (README, USAGE-*, INSTALL) — they
          // describe this framework, not the target project. Only the ROOT copies
          // are excluded: nested READMEs (.coding-assistants/cursor/README.md,
          // .architecture/agent_docs/README.md) are canonical content that the
          // installed docs link to, and a substring match used to drop them all.
          const isRootLevel = !relativePath.includes(path.sep);
          return !(isRootLevel && /^(README\.md|USAGE.*|INSTALL\.md)$/.test(relativePath));
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

      // Step 4: Install the canonical .coding-assistants tree (ADR-016). The
      // temp clone already carries it; copying is additive (never overwrites a
      // file the project already has). Only when the source tree lacks it do we
      // fall back to the bare per-assistant directories.
      const canonicalAssistants = path.join(tempClonePath, '.coding-assistants');
      if (await fs.pathExists(canonicalAssistants)) {
        await fs.copy(canonicalAssistants, codingAssistantsPath, { overwrite: false, errorOnExist: false });
      } else {
        await fs.ensureDir(path.join(codingAssistantsPath, "claude"));
        await fs.ensureDir(path.join(codingAssistantsPath, "cursor"));
        await fs.ensureDir(path.join(codingAssistantsPath, "codex"));
      }
      
      // Step 5: Customize members.yml based on project analysis
      results.push("\n👥 Customizing architecture team...");
      await this.customizeMembers(architecturePath, projectAnalysis, libs);

      // Step 5b: Generate dispatchable subagents from the seeded roster (ADR-016).
      // Seeding members.yml is not enough — the team must exist as agents/*.md.
      // The generator takes our yaml parser: a plugin install has no
      // tools/node_modules for it to resolve one of its own.
      const { generateAll } = libs;
      const seededMembersYaml = await fs.readFile(path.join(architecturePath, "members.yml"), "utf8");
      const subagents = generateAll(seededMembersYaml, { parse: yaml.parse });
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

      // Step 7: Templates. The canonical set (adr-template.md, review-template.md,
      // config.yml, …) arrived with the .architecture copy in step 3; nothing is
      // generated here. A hardcoded adr.md/review.md pair used to be written
      // alongside them with a different structure — two ADR templates and no
      // signal which one was real (ADR-016 single-source-of-truth).
      const installedTemplates = await fs.readdir(path.join(architecturePath, "templates")).catch(() => []);
      results.push(`\n📄 Installed canonical templates: ${installedTemplates.join(', ')}`);
      
      // Step 8: Update CLAUDE.md if it exists
      results.push("\n📝 Configuring CLAUDE.md integration...");
      await this.setupClaudeIntegration(claudeMdPath);
      
      // Step 9: Cleanup temporary files (also guaranteed by the finally below;
      // done here too so the analysis step never sees the scratch dir).
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
    } finally {
      // Never leave the scratch clone behind, whichever step failed. fs.remove
      // is a no-op when the path is already gone (the success path removed it).
      if (tempCloneStarted) {
        await fs.remove(tempClonePath).catch(() => {});
      }
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
  
  // `libs` are the setup modules resolveFrameworkSource loaded from the
  // framework source; there is no default, the parent-directory shortcut is gone.
  async customizeMembers(architecturePath, analysis, libs) {
    // ADR-016: the canonical members.yml is copied into the target during setup.
    // Preserve it as the source of truth — do NOT overwrite it with a hardcoded
    // list (that dropped 4 of the 8 architects and used the wrong id
    // `security_architect`). Validate the copy against the framework source so a
    // failed/partial copy fails loudly rather than seeding a lossy team. No stack
    // advisors are appended initially (canonical team only).
    const { assertContainsIds, CANONICAL_MEMBER_IDS } = libs;
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
- \`.architecture/decisions/\` - Architectural Decision Records
- \`.architecture/principles.md\` - Architectural principles
- \`.architecture/reviews/\` - Architecture review documents
- \`.architecture/recalibration/\` - Implementation plans from reviews
- \`.architecture/members.yml\` - Architecture team member definitions

Refer to \`.architecture/principles.md\` for architectural guidance.
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
    const { title, context, decision, consequences, supersedes, projectPath } = args;
    const architecturePath = path.join(projectPath, ".architecture");
    
    if (!(await fs.pathExists(architecturePath))) {
      throw new Error("Architecture framework not set up. Run setup_architecture first.");
    }

    const adrsPath = path.join(architecturePath, "decisions", "adrs");
    
    // Get next ADR number
    const existingADRs = await fs.readdir(adrsPath).catch(() => []);
    // Both filename styles count toward the sequence: the documented
    // ADR-XXX-slug.md (mcp/README.md, create-adr skill, tools/lib/adr-validator.js)
    // and the bare 0001-slug.md this tool emitted before it followed its own docs.
    const adrNumbers = existingADRs
      .map(file => file.match(/^(?:ADR-)?(\d+)/i))
      .filter(Boolean)
      .map(match => parseInt(match[1], 10))
      .sort((a, b) => a - b);
    
    const nextNumber = adrNumbers.length > 0 ? Math.max(...adrNumbers) + 1 : 1;
    // Slugify the title for the filename: path separators, colons, etc. must not
    // survive (a "/" would make writeFile target a nonexistent subdirectory).
    const titleSlug = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      || 'untitled';
    const newId = `ADR-${nextNumber.toString().padStart(3, '0')}`;
    const adrFilename = `${newId}-${titleSlug}.md`;

    // Resolve and rewrite the superseded ADR before writing anything, so a bad
    // target leaves the decisions directory untouched.
    let superseded = null;
    if (supersedes) {
      const targetNumber = parseInt(supersedes.slice(4), 10);
      const oldFilename = existingADRs.find(file => {
        const match = file.match(/^(?:ADR-)?(\d+)/i);
        return match && parseInt(match[1], 10) === targetNumber && file.endsWith('.md');
      });
      if (!oldFilename) {
        throw new Error(`supersedes: ${supersedes} does not match any ADR in .architecture/decisions/adrs/. Nothing was written.`);
      }
      const oldPath = path.join(adrsPath, oldFilename);
      const oldContent = await fs.readFile(oldPath, 'utf8');
      superseded = { filename: oldFilename, path: oldPath, content: markAdrSuperseded(oldContent, newId, supersedes) };
    }

    const template = await this.loadAdrTemplate(architecturePath);
    let adrContent = renderAdrFromTemplate(template, {
      number: nextNumber,
      title,
      context,
      decision,
      consequences,
      date: new Date().toISOString().split('T')[0],
    });
    if (superseded) adrContent = setFrontmatterField(adrContent, 'supersedes', supersedes);

    await fs.writeFile(path.join(adrsPath, adrFilename), adrContent);
    if (superseded) await fs.writeFile(superseded.path, superseded.content);

    const supersededLine = superseded
      ? `\nSupersedes: ${supersedes} (${superseded.filename} now has status: superseded, superseded-by: ${newId})`
      : '';

    return {
      content: [
        {
          type: "text",
          text: `✅ ADR created successfully!\n\nFile: .architecture/decisions/adrs/${adrFilename}\nNumber: ${nextNumber}\nTitle: ${title}${supersededLine}\n\nRendered from .architecture/templates/adr-template.md: Status, Context, Decision and Consequences carry your input; the remaining [bracketed] prompts (Decision Drivers, the Consequences sub-lists, Alternatives Considered, …) are left for you to complete or delete.`,
        },
      ],
    };
  }

  // The installed copy is authoritative (users may customize it); the framework's
  // own template is the fallback for installs that predate the templates/ dir.
  async loadAdrTemplate(architecturePath) {
    const candidates = [
      path.join(architecturePath, "templates", "adr-template.md"),
      path.join(__dirname, "..", ".architecture", "templates", "adr-template.md"),
    ];
    for (const candidate of candidates) {
      if (await fs.pathExists(candidate)) return fs.readFile(candidate, "utf8");
    }
    throw new Error("ADR template not found (.architecture/templates/adr-template.md). Framework may be incomplete.");
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
    const members = rosterEntries(membersContent);

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

    // Every field but id is optional, as in tools/lib/subagent-generator.js:
    // a line whose field is absent is left out rather than throwing.
    const listOf = (value) => (Array.isArray(value) ? value.join(', ') : value);
    const membersList = members.map(member => {
      const lines = [`**${member.name ?? member.id ?? '(unnamed member)'}**${member.title ? ` (${member.title})` : ''}\n`];
      const specialties = listOf(member.specialties);
      const domains = listOf(member.domains);
      if (specialties) lines.push(`  - Specialties: ${specialties}\n`);
      if (domains) lines.push(`  - Domains: ${domains}\n`);
      if (member.perspective) lines.push(`  - Perspective: ${member.perspective}\n`);
      return lines.join('');
    }).join('\n');

    return {
      content: [
        {
          type: "text",
          text: `## Architecture Team Members\n\n${membersList}\n\nUse the specialist-review skill with any of these specialists for focused reviews.`,
        },
      ],
    };
  }

  // Read side of create_adr: rank existing ADRs by relevance to a question
  // and/or a file path. Returns JSON so the agent can follow supersede chains.
  async findRelevantADRs(args) {
    const { projectPath, query = "", filePath = "", limit = 5 } = args;
    if (!query.trim() && !filePath.trim()) {
      throw new Error("Pass a query, a filePath, or both.");
    }
    const adrDir = path.join(projectPath, ".architecture", "decisions", "adrs");
    if (!(await fs.pathExists(adrDir))) {
      throw new Error("No ADR directory at .architecture/decisions/adrs. Run setup_architecture first.");
    }
    const index = loadAdrIndex(adrDir);
    const adrs = findRelevantAdrs(index, { query, filePath, limit });
    const result = { searched: index.length, adrs };
    if (adrs.length === 0) {
      result.note = "No ADR matched. Absence here means no recorded decision covers this, so a new choice may warrant an ADR.";
    }
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
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
      status.members = rosterEntries(membersContent).length;
    }

    // Framework drift: the plugin/MCP server auto-updates, the installed
    // .architecture/ copy does not. Report both versions; never restamp.
    const frameworkLine = await this.frameworkDriftLine(architecturePath);

    return {
      content: [
        {
          type: "text",
          text: `## Architecture Framework Status\n\n✅ **Framework Setup**: Complete\n${frameworkLine}\n📋 **ADRs Created**: ${status.adrs}\n🔍 **Reviews Conducted**: ${status.reviews}\n👥 **Team Members**: ${status.members}\n\n### Available Actions\n- Use \`create_adr\` to document architectural decisions\n- Use \`the architecture-review skill\` for comprehensive reviews\n- Use \`the specialist-review skill\` for focused specialist input\n- Use \`list_architecture_members\` to see team composition`,
        },
      ],
    };
  }

  async frameworkDriftLine(architecturePath) {
    let installed = null;
    const configPath = path.join(architecturePath, "config.yml");
    if (await fs.pathExists(configPath)) {
      try {
        const config = yaml.parse(await fs.readFile(configPath, 'utf8')) || {};
        installed = config.version?.framework_version || null;
      } catch {
        installed = null;
      }
    }

    // Current version: the plugin manifest when running as a plugin, else this
    // server's own package.json (kept in lockstep by tools/cli.js version-check).
    let current = null;
    const candidates = [];
    if (process.env.CLAUDE_PLUGIN_ROOT) {
      candidates.push(path.join(process.env.CLAUDE_PLUGIN_ROOT, ".claude-plugin", "plugin.json"));
    }
    candidates.push(path.join(__dirname, "package.json"));
    for (const file of candidates) {
      try {
        const data = await fs.readJson(file);
        if (data.version) { current = data.version; break; }
      } catch {
        // try the next candidate
      }
    }

    if (!current) {
      return `🧭 **Framework**: installed ${installed || "unknown (pre-1.2 install)"}`;
    }
    if (!installed) {
      return `🧭 **Framework**: installed unknown (pre-1.2 install), current ${current} - see UPGRADE.md`;
    }
    const { sign, count, unit } = releasesBehind(current, installed);
    if (sign > 0) {
      return `🧭 **Framework**: installed ${installed}, current ${current} - ${count} ${unit}${count === 1 ? "" : "s"} behind; see CHANGELOG ${installed}…${current} and UPGRADE.md`;
    }
    if (sign < 0) {
      return `🧭 **Framework**: installed ${installed}, current ${current} - installed copy is newer than this server`;
    }
    return `🧭 **Framework**: ${installed} (installed matches current)`;
  }

  async configurePragmaticMode(args) {
    const { projectPath, enabled, intensity } = args;
    const architecturePath = path.join(projectPath, ".architecture");

    if (!(await fs.pathExists(architecturePath))) {
      throw new Error("Architecture framework not set up. Run setup_architecture first.");
    }

    const configPath = path.join(architecturePath, "config.yml");
    const templatePath = path.join(architecturePath, "templates", "config.yml");

    // Load or seed the config source text. It is edited as a YAML Document, not
    // a parsed object: config.yml is deliberately self-documenting (100+ comment
    // lines explaining intensity levels, exemptions, triggers and thresholds),
    // and the success message below tells users to hand-edit it. A
    // yaml.parse()/yaml.stringify() round-trip drops every comment on the first
    // configure call (#26); the Document API rewrites only the scalars this tool
    // touches and writes every other line back as it was. (Known limit: the
    // serializer re-indents a comment block that dangles at the end of a nested
    // map; the canonical config.yml has none, the 394-line template has a few.)
    let configSourcePath;
    if (await fs.pathExists(configPath)) {
      configSourcePath = configPath;
    } else if (await fs.pathExists(templatePath)) {
      // Seed from the template, comments included.
      configSourcePath = templatePath;
    } else {
      throw new Error("Configuration template not found. Framework may be incomplete.");
    }

    const doc = yaml.parseDocument(await fs.readFile(configSourcePath, 'utf8'));
    if (doc.errors.length > 0) {
      throw new Error(`Cannot parse ${configSourcePath}: ${doc.errors[0].message}`);
    }

    // Update pragmatic mode settings. setIn creates the pragmatic_mode map if
    // the file lacks one, so a bare config still gets a valid section.
    if (enabled !== undefined) {
      doc.setIn(["pragmatic_mode", "enabled"], enabled);
    }

    if (intensity !== undefined) {
      doc.setIn(["pragmatic_mode", "intensity"], intensity);
    }

    // Plain-object view of the (now updated) document for the read-only checks
    // and the status message below.
    const config = doc.toJS() ?? {};
    const pragmaticMode = config.pragmatic_mode ?? {};

    // Ensure deferrals.md exists if tracking is enabled
    if (pragmaticMode.enabled && pragmaticMode.behavior?.track_deferrals) {
      const deferralsPath = path.join(architecturePath, "deferrals.md");
      const deferralsTemplatePath = path.join(architecturePath, "templates", "deferrals.md");

      if (!(await fs.pathExists(deferralsPath)) && (await fs.pathExists(deferralsTemplatePath))) {
        await fs.copy(deferralsTemplatePath, deferralsPath);
      }
    }

    // Write updated config
    await fs.writeFile(configPath, doc.toString());

    // Build status message
    const statusEnabled = pragmaticMode.enabled ? "✅ Enabled" : "❌ Disabled";
    const statusIntensity = pragmaticMode.intensity || "balanced";
    const deferralsTracking = pragmaticMode.behavior?.track_deferrals ? "Enabled" : "Disabled";

    return {
      content: [
        {
          type: "text",
          text: `## Pragmatic Mode Configuration Updated\n\n**Status**: ${statusEnabled}\n**Intensity**: ${statusIntensity}\n**Deferrals Tracking**: ${deferralsTracking}\n\n### How Pragmatic Mode Works\n\nWhen enabled, the Pragmatic Enforcer will:\n- Challenge complexity and abstractions\n- Question "best practices" that may not apply\n- Propose simpler alternatives that meet current requirements\n- Score necessity vs. complexity (target ratio <1.5)\n- ${deferralsTracking === "Enabled" ? "Track deferred decisions in .architecture/deferrals.md" : "Not track deferrals"}\n\n### Intensity Levels\n\n**Strict**: Challenges aggressively, requires strong justification\n**Balanced**: Thoughtful challenges, accepts justified complexity (recommended)\n**Lenient**: Raises concerns without blocking\n\n### Configuration\n\nFull configuration saved to: \`.architecture/config.yml\`\n\nYou can manually edit this file to customize:\n- Exemptions (security, compliance, etc.)\n- Triggers (when to challenge)\n- Thresholds (complexity scores)\n- Review phases where Pragmatic Mode applies\n\n### Next Steps\n\n${pragmaticMode.enabled ? "The Pragmatic Enforcer will now participate in:\n- Architecture reviews (the architecture-review skill)\n- Specialist reviews (the specialist-review skill)\n- ADR creation (create_adr)\n\nUse these tools and the Pragmatic Enforcer will challenge over-engineering." : "Pragmatic Mode is disabled. Set enabled=true to activate YAGNI enforcement."}`,
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
    // An empty or comment-only config.yml parses to null.
    const config = yaml.parse(configContent) || {};

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

// True when this file is the process entrypoint rather than an imported module.
// Render an ADR from the canonical template (.architecture/templates/adr-template.md)
// so create_adr emits the same structure the create-adr skill and the validator
// expect, instead of a third hand-rolled shape. Known fields fill the template's
// leading "[...]" placeholder in their section; every other section keeps its
// placeholders as prompts for the author. The installed template may be
// customized: if it lacks one of the four sections a field targets (or the
// canonical H1), that section is appended so the caller's text is never dropped
// silently — validate-adr requires all four anyway. Exported for tests.
export function renderAdrFromTemplate(template, { number, title, context, decision, consequences, date }) {
  const paddedNumber = String(number).padStart(3, '0');
  const heading = `# ADR-${paddedNumber}: ${title}`;
  let out = /^# ADR-XXX: \[Title\][ \t]*$/m.test(template)
    ? template.replace(/^# ADR-XXX: \[Title\][ \t]*$/m, heading)
    : `${heading}\n\n${template}`;
  out = replaceSectionBody(out, 'Status', `Proposed\n\n**Date**: ${date}`);
  out = fillSectionPlaceholder(out, 'Context', context);
  out = fillSectionPlaceholder(out, 'Decision', decision);
  out = fillSectionPlaceholder(out, 'Consequences', consequences);
  return out;
}

// Mark an existing ADR as replaced by `newId`, in the shape validate-adr's
// supersede check expects: frontmatter "status: superseded" plus
// "superseded-by: <newId>", and a "## Status" section (when present) that
// agrees with the frontmatter. Line-based so the rest of the file is untouched.
// Throws rather than overwrite an existing successor link. Exported for tests.
export function markAdrSuperseded(content, newId, oldId = 'This ADR') {
  const existing = frontmatterField(content, 'superseded-by');
  if (existing && existing !== 'none') {
    throw new Error(`${oldId} is already superseded by ${existing}. Nothing was written.`);
  }
  let out = setFrontmatterField(content, 'status', 'superseded');
  out = setFrontmatterField(out, 'superseded-by', newId);
  const bounds = sectionBounds(out, 'Status');
  if (bounds) {
    const [bodyStart, bodyEnd] = bounds;
    const lines = out.slice(bodyStart, bodyEnd).split('\n');
    const i = lines.findIndex(l => l.trim() && !/^\[.*\]$/.test(l.trim()));
    const replacement = `Superseded by ${newId}`;
    if (i === -1) lines.splice(1, 0, '', replacement);
    else lines[i] = replacement;
    out = out.slice(0, bodyStart) + lines.join('\n') + out.slice(bodyEnd);
  }
  return out;
}

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;

function frontmatterField(content, key) {
  const fm = FRONTMATTER.exec(content);
  if (!fm) return null;
  const line = fm[1].split(/\r?\n/).find(l => l.toLowerCase().startsWith(`${key}:`));
  return line ? line.slice(key.length + 1).trim() : null;
}

// Set `key: value` in the leading YAML frontmatter: replace the line when the
// key exists, otherwise append it before the closing "---". A file with no
// frontmatter gets one. Exported for tests.
export function setFrontmatterField(content, key, value) {
  const fm = FRONTMATTER.exec(content);
  if (!fm) return `---\n${key}: ${value}\n---\n\n${content}`;
  const lines = fm[1].split(/\r?\n/);
  const i = lines.findIndex(l => l.toLowerCase().startsWith(`${key}:`));
  if (i === -1) lines.push(`${key}: ${value}`);
  else lines[i] = `${key}: ${value}`;
  return `---\n${lines.join('\n')}\n---\n${content.slice(fm[0].length)}`;
}

function appendSection(text, name, body) {
  return `${text.replace(/\s*$/, '')}\n\n## ${name}\n\n${body}\n`;
}

// Locate "## Name" and return [bodyStart, bodyEnd) — bodyEnd is the next "## "
// heading (level-2 only; "### " sub-sections stay inside the body) or EOF.
function sectionBounds(text, name) {
  const heading = new RegExp(`^## ${name}[ \\t]*$`, 'm');
  const match = heading.exec(text);
  if (!match) return null;
  const bodyStart = match.index + match[0].length;
  const next = /^## /m.exec(text.slice(bodyStart));
  const bodyEnd = next ? bodyStart + next.index : text.length;
  return [bodyStart, bodyEnd];
}

function replaceSectionBody(text, name, body) {
  const bounds = sectionBounds(text, name);
  if (!bounds) return appendSection(text, name, body);
  const [bodyStart, bodyEnd] = bounds;
  return `${text.slice(0, bodyStart)}\n\n${body}\n\n${text.slice(bodyEnd)}`;
}

// Replace the first "[placeholder]" paragraph directly under the section heading
// with `value`. If the section opens with structure instead (e.g. Consequences
// starts at "### Positive"), insert `value` as the opening paragraph.
function fillSectionPlaceholder(text, name, value) {
  const bounds = sectionBounds(text, name);
  if (!bounds) return appendSection(text, name, value);
  const [bodyStart, bodyEnd] = bounds;
  const body = text.slice(bodyStart, bodyEnd);
  const placeholder = /^\[[^\]]*\][ \t]*$/m.exec(body);
  const openingLength = body.length - body.trimStart().length;
  const placeholderLeads = placeholder && placeholder.index === openingLength;
  const newBody = placeholderLeads
    ? `${body.slice(0, placeholder.index)}${value}${body.slice(placeholder.index + placeholder[0].length)}`
    : `\n\n${value}${body}`;
  return `${text.slice(0, bodyStart)}${newBody}${text.slice(bodyEnd)}`;
}

// Both sides must be compared as real paths: __filename comes from
// import.meta.url, which Node has already resolved through symlinks, while
// process.argv[1] is whatever the shell was handed. Launching the package's
// `mcp` bin hands over the node_modules/.bin symlink, so a raw string compare
// fails and the server exits 0 without ever starting the transport - which is
// exactly how .mcp.json invokes it (`npx -y ai-software-architect`).
// How far `installed` trails `current`. Same major: count minor releases
// (1.4.0 -> 1.6.0 is "2 releases behind"). Different major: count majors.
// Patch-only drift counts as one release. Non-semver input compares as 0.
function releasesBehind(current, installed) {
  const parse = v => String(v).split(".").map(n => parseInt(n, 10) || 0);
  const [cM, cm, cp] = parse(current);
  const [iM, im, ip] = parse(installed);
  if (cM !== iM) return { sign: Math.sign(cM - iM), count: Math.abs(cM - iM), unit: "major release" };
  if (cm !== im) return { sign: Math.sign(cm - im), count: Math.abs(cm - im), unit: "release" };
  if (cp !== ip) return { sign: Math.sign(cp - ip), count: 1, unit: "patch release" };
  return { sign: 0, count: 0, unit: "release" };
}

function isProcessEntrypoint(argvPath, moduleFile) {
  if (!argvPath) return false;
  const resolved = path.resolve(argvPath);
  try {
    return fs.realpathSync(resolved) === fs.realpathSync(moduleFile);
  } catch (error) {
    // Either path may be unreadable (deleted, permissions); fall back to the
    // literal compare rather than throwing during module evaluation. Say so on
    // stderr: the fallback can only ever be wrong in the direction of not
    // starting, and an unexplained silent exit is the failure mode this
    // function exists to remove.
    console.error(`[MCP] entrypoint realpath check failed (${error.message}); falling back to a literal path compare`);
    return resolved === moduleFile;
  }
}

// Run as a server only when invoked directly; allows importing the class for
// tests/dogfood (ADR-016 fidelity test) without starting the stdio transport.
if (isProcessEntrypoint(process.argv[1], __filename)) {
  const server = new ArchitectureServer();
  server.run().catch(console.error);
}

// BEGIN adr-index (generated mirror of tools/lib/adr-index.js; the npm tarball
// ships index.js alone and cannot import tools/. tools/test/adr-index-mirror.test.js
// fails if the two drift. Edit the lib, then re-copy.)
const { readdirSync, readFileSync, existsSync } = fs;
const { join } = path;

// Read-side index over .architecture/decisions/adrs. Agents can create ADRs
// through the MCP server; this is what lets them find the ones that govern
// the code they are about to touch.
//
// Matching is deliberately plain: keywords against title and body, plus
// optional `affects:` globs against a file path. No embeddings.

const ADR_FILE = /^ADR-(\d{3})-[a-z0-9-]+\.md$/;
const ADR_REF = /^ADR-\d{3}$/;
const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/;
const STOPWORDS = new Set([
  'the', 'and', 'for', 'with', 'that', 'this', 'from', 'into', 'are', 'was', 'were',
  'how', 'what', 'when', 'where', 'which', 'who', 'why', 'should', 'would', 'could',
  'does', 'did', 'can', 'use', 'using', 'about', 'our', 'its', 'not', 'any', 'all',
  'per', 'many', 'much', 'some', 'there', 'they', 'them', 'than', 'then', 'have', 'has',
]);

function parseAdr(filename, content) {
  const match = filename.match(ADR_FILE);
  if (!match) return null;

  const fm = parseFrontmatter(content);
  const body = fm ? content.slice(content.match(FRONTMATTER)[0].length) : content;
  const titleLine = body.match(/^#\s+(.+)$/m);
  const title = titleLine ? titleLine[1].replace(/^ADR-\d{3}:\s*/, '').trim() : filename;

  return compact({
    id: `ADR-${match[1]}`,
    filename,
    title,
    status: normalizeStatus((fm && fm.status) || sectionStatus(body)),
    date: fm && fm.date ? fm.date : undefined,
    supersedes: refList(fm && fm.supersedes),
    supersededBy: refList(fm && fm['superseded-by']),
    affects: list(fm && fm.affects),
    body,
  });
}

function loadAdrIndex(adrDir) {
  if (!existsSync(adrDir)) return [];
  return readdirSync(adrDir)
    .filter(f => ADR_FILE.test(f))
    .sort()
    .map(f => parseAdr(f, readFileSync(join(adrDir, f), 'utf8')))
    .filter(Boolean);
}

// Returns ADRs ranked by relevance to a question and/or a file path.
// A superseded ADR is never presented as current: it comes back with
// `current: false` and its successor ids, so the agent follows the chain.
function findRelevantAdrs(index, { query = '', filePath = '', limit = 5 } = {}) {
  const terms = tokenize(query);
  if (terms.length === 0 && !filePath) return [];

  // A term every ADR mentions ("claude" in this repo) says little about
  // which one governs; weight terms by how rare they are across the index.
  const idf = new Map(terms.map(t => {
    const df = index.filter(a => `${a.title}\n${a.body}`.toLowerCase().includes(t)).length;
    return [t, Math.log(1 + index.length / Math.max(df, 1))];
  }));

  const results = [];
  for (const adr of index) {
    const reasons = [];
    let score = 0;

    if (filePath && adr.affects) {
      const glob = adr.affects.find(g => globToRegExp(g).test(normalizePath(filePath)));
      if (glob) {
        score += 10;
        reasons.push(`affects ${glob}`);
      }
    }

    if (terms.length > 0) {
      const title = adr.title.toLowerCase();
      const body = adr.body.toLowerCase();
      const titleHits = terms.filter(t => title.includes(t));
      const bodyHits = terms.filter(t => !titleHits.includes(t) && body.includes(t));
      const weight = t => idf.get(t);
      score += titleHits.reduce((s, t) => s + 3 * weight(t), 0) + bodyHits.reduce((s, t) => s + weight(t), 0);
      if (titleHits.length) reasons.push(`title: ${titleHits.join(', ')}`);
      if (bodyHits.length) reasons.push(`body: ${bodyHits.join(', ')}`);
    }

    if (score === 0) continue;
    const superseded = adr.status === 'Superseded' || Boolean(adr.supersededBy);
    results.push(compact({
      id: adr.id,
      title: adr.title,
      status: adr.status,
      date: adr.date,
      file: adr.filename,
      current: !superseded,
      supersededBy: adr.supersededBy,
      supersedes: adr.supersedes,
      matched: reasons,
      score: Math.round(score * 100) / 100,
    }));
  }

  return results
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
    .slice(0, limit);
}

function tokenize(text) {
  const seen = new Set();
  for (const word of String(text).toLowerCase().split(/[^a-z0-9]+/)) {
    if (word.length < 3 || STOPWORDS.has(word)) continue;
    // Crude plural fold so "instructions" still finds "Instruction Capacity";
    // terms are matched as substrings, so the singular covers both.
    seen.add(word.length > 4 && /[^s]s$/.test(word) ? word.slice(0, -1) : word);
  }
  return [...seen];
}

// Minimal glob: `**` spans directories, `*` and `?` stay within one segment.
function globToRegExp(glob) {
  let re = '';
  const g = normalizePath(glob);
  for (let i = 0; i < g.length; i++) {
    const c = g[i];
    if (c === '*' && g[i + 1] === '*') {
      i++;
      if (g[i + 1] === '/') {
        i++;
        re += '(?:.*/)?';
      } else {
        re += '.*';
      }
    } else if (c === '*') {
      re += '[^/]*';
    } else if (c === '?') {
      re += '[^/]';
    } else {
      re += c.replace(/[.+^${}()|[\]\\]/g, '\\$&');
    }
  }
  return new RegExp(`^${re}$`);
}

function normalizePath(p) {
  return String(p).replace(/\\/g, '/').replace(/^\.\//, '');
}

function parseFrontmatter(content) {
  const match = content.match(FRONTMATTER);
  if (!match) return null;
  const fields = {};
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (field) fields[field[1].toLowerCase()] = field[2].trim().replace(/^(['"])(.*)\1$/, '$2');
  }
  return fields;
}

function sectionStatus(body) {
  const match = body.match(/^##\s+Status\s*$([\s\S]*?)(?=^##\s+|(?![\s\S]))/m);
  if (!match) return undefined;
  for (const raw of match[1].split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('>') || (line.startsWith('[') && line.endsWith(']'))) continue;
    return line.split(/\s+/)[0].replace(/[.,;:!?*]+$/, '');
  }
  return undefined;
}

const STATUSES = ['Draft', 'Proposed', 'Accepted', 'Implemented', 'Deprecated', 'Superseded'];
function normalizeStatus(raw) {
  if (!raw) return undefined;
  const word = raw.split(/\s+/)[0].replace(/[^A-Za-z]/g, '');
  return STATUSES.find(s => s.toLowerCase() === word.toLowerCase()) || raw;
}

function list(raw) {
  if (!raw || /^(none|null|~)$/i.test(raw)) return undefined;
  const items = raw.replace(/^\[|\]$/g, '').split(',')
    .map(s => s.trim().replace(/^(['"])(.*)\1$/, '$2'))
    .filter(Boolean);
  return items.length ? items : undefined;
}

function refList(raw) {
  const refs = (list(raw) || []).filter(r => ADR_REF.test(r));
  return refs.length ? refs : undefined;
}

// Drop undefined fields so a missing relation reads as absent, never as
// "checked, none".
function compact(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));
}
// END adr-index
