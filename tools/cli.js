#!/usr/bin/env node

/**
 * Documentation Governance CLI
 *
 * Tools for maintaining documentation quality per ADR-005/006
 */

import { readFileSync, readdirSync, statSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, resolve, basename } from 'node:path';
import { homedir } from 'node:os';
import { validateLinks, checkLinks } from './lib/link-validator.js';
import { countInstructions } from './lib/instruction-counter.js';
import { validateAdr } from './lib/adr-validator.js';
import { generateAll } from './lib/subagent-generator.js';
import { discoverSource, PLUGIN_NAME } from './lib/setup-source-discovery.js';
import { checkConsistency, FRAMEWORK_VERSION_SOURCES } from './lib/version-consistency.js';

const [,, command, ...args] = process.argv;

const COMMANDS = {
  validate: validateCommand,
  'validate-adr': validateAdrCommand,
  'generate-subagents': generateSubagentsCommand,
  'find-source': findSourceCommand,
  count: countCommand,
  'version-check': versionCheckCommand,
  help: helpCommand
};

async function main() {
  const cmd = COMMANDS[command];

  if (!cmd) {
    console.error(`Unknown command: ${command}`);
    helpCommand();
    process.exit(1);
  }

  try {
    await cmd(args);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

/**
 * Validate markdown links in documentation
 */
function validateCommand(args) {
  const dir = args[0] || '../.architecture';
  const basePath = resolve(dir);

  console.log(`\n📋 Validating links in ${basePath}...\n`);

  const mdFiles = findMarkdownFiles(basePath);
  let totalValid = 0;
  let totalBroken = 0;

  for (const file of mdFiles) {
    const content = readFileSync(file, 'utf8');
    const relPath = file.replace(basePath + '/', '');
    const links = validateLinks(content, relPath);

    if (links.length === 0) continue;

    const result = checkLinks(links, basePath);

    if (result.broken.length > 0) {
      console.log(`❌ ${relPath}:`);
      for (const link of result.broken) {
        console.log(`   Line ${link.line}: ${link.target}`);
      }
      totalBroken += result.broken.length;
    }

    totalValid += result.valid.length;
  }

  console.log(`\n✅ ${totalValid} valid links`);
  if (totalBroken > 0) {
    console.log(`❌ ${totalBroken} broken links\n`);
    process.exit(1);
  } else {
    console.log(`✨ All links valid!\n`);
  }
}

/**
 * Validate ADR file(s) against the framework template rules.
 * Accepts one or more file paths, or defaults to all ADRs in the repo.
 */
function validateAdrCommand(args) {
  const targets = args.length > 0
    ? args.map(a => resolve(a))
    : findAdrFiles(resolve('../.architecture/decisions/adrs'));

  let totalFailed = 0;

  for (const file of targets) {
    const filename = basename(file);
    const content = readFileSync(file, 'utf8');
    const result = validateAdr(filename, content);

    if (result.valid) {
      console.log(`✅ ${filename}`);
    } else {
      console.log(`❌ ${filename}`);
      for (const err of result.errors) {
        console.log(`   - ${err}`);
      }
      totalFailed++;
    }
  }

  if (totalFailed > 0) {
    console.log(`\n${totalFailed} ADR(s) failed validation.\n`);
    process.exit(1);
  }
  console.log(`\n✨ All ${targets.length} ADR(s) valid.\n`);
}

function findAdrFiles(dir) {
  return readdirSync(dir)
    .filter(name => name.endsWith('.md'))
    .map(name => join(dir, name));
}

/**
 * Discover the framework source location for setup-architect.
 * Prints the resolved path on stdout (exit 0) or a guidance message on stderr (exit 1).
 * --json emits a structured result.
 */
function findSourceCommand(args) {
  const json = args.includes('--json');
  const pluginsDir = join(homedir(), '.claude', 'plugins');

  const result = discoverSource({
    envRoot: process.env.CLAUDE_PLUGIN_ROOT,
    pluginsDir: existsSync(pluginsDir) ? pluginsDir : undefined,
    legacyClone: resolve('.architecture/.architecture'),
    exists: existsSync,
    listPluginCandidates: dir => findPluginCandidates(dir),
  });

  if (json) {
    console.log(JSON.stringify(result, null, 2));
    process.exit(result.found ? 0 : 1);
  }

  if (result.found) {
    console.log(result.path);
    return;
  }

  console.error(
    `Framework source for "${PLUGIN_NAME}" not found. Either:\n` +
      `  1. Install the plugin (recommended):\n` +
      `       /plugin marketplace add codenamev/ai-software-architect\n` +
      `       /plugin install ai-software-architect@ai-software-architect\n` +
      `  2. Clone manually (legacy):\n` +
      `       git clone https://github.com/codenamev/ai-software-architect .architecture/.architecture`
  );
  process.exit(1);
}

function findPluginCandidates(pluginsDir, maxDepth = 5) {
  const matches = [];
  const stack = [{ path: pluginsDir, depth: 0 }];

  while (stack.length > 0) {
    const { path, depth } = stack.pop();
    if (depth > maxDepth) continue;

    let entries;
    try {
      entries = readdirSync(path, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const child = join(path, entry.name);
      if (entry.name === PLUGIN_NAME) {
        matches.push(child);
      } else {
        stack.push({ path: child, depth: depth + 1 });
      }
    }
  }

  return matches;
}

/**
 * Generate Claude Code subagents from .architecture/members.yml.
 * --check exits non-zero if generated files would differ from committed ones.
 */
function generateSubagentsCommand(args) {
  const check = args.includes('--check');
  const membersPath = resolve('../.architecture/members.yml');
  const outDir = resolve('../agents');

  const yaml = readFileSync(membersPath, 'utf8');
  const generated = generateAll(yaml);

  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

  let drift = 0;
  for (const { filename, content } of generated) {
    const outPath = join(outDir, filename);
    const existing = existsSync(outPath) ? readFileSync(outPath, 'utf8') : null;
    if (existing === content) {
      console.log(`= ${filename}`);
      continue;
    }
    if (check) {
      console.log(`✗ ${filename} (drift)`);
      drift++;
      continue;
    }
    writeFileSync(outPath, content);
    console.log(`${existing === null ? '+' : '~'} ${filename}`);
  }

  if (check && drift > 0) {
    console.log(`\n${drift} subagent file(s) drift from members.yml. Run \`node tools/cli.js generate-subagents\` to regenerate.\n`);
    process.exit(1);
  }
  console.log(`\n✨ ${generated.length} subagent(s) ${check ? 'in sync' : 'written'}.\n`);
}

/**
 * Count instructions in key documentation files
 */
function countCommand(args) {
  const files = args.length > 0 ? args : ['../AGENTS.md', '../CLAUDE.md'];

  console.log(`\n📊 Counting instructions...\n`);

  let grandTotal = 0;

  for (const file of files) {
    const path = resolve(file);
    const content = readFileSync(path, 'utf8');
    const result = countInstructions(content);

    const filename = file.split('/').pop();
    console.log(`${filename}:`);
    console.log(`  Commands:      ${result.commands.length}`);
    console.log(`  Conditionals:  ${result.conditionals.length}`);
    console.log(`  Procedures:    ${result.procedures.length}`);
    console.log(`  Guidelines:    ${result.guidelines.length}`);
    console.log(`  Total:         ${result.total}`);
    console.log('');

    grandTotal += result.total;
  }

  console.log(`Grand Total: ${grandTotal}\n`);

  // Check against targets
  if (files.includes('../AGENTS.md')) {
    const agentsContent = readFileSync(resolve('../AGENTS.md'), 'utf8');
    const agentsCount = countInstructions(agentsContent).total;
    if (agentsCount > 150) {
      console.log(`⚠️  AGENTS.md exceeds target (${agentsCount} > 150)\n`);
      process.exit(1);
    } else {
      console.log(`✅ AGENTS.md within target (${agentsCount} <= 150)\n`);
    }
  }

  if (files.includes('../CLAUDE.md')) {
    const claudeContent = readFileSync(resolve('../CLAUDE.md'), 'utf8');
    const claudeCount = countInstructions(claudeContent).total;
    if (claudeCount > 30) {
      console.log(`⚠️  CLAUDE.md exceeds target (${claudeCount} > 30)\n`);
      process.exit(1);
    } else {
      console.log(`✅ CLAUDE.md within target (${claudeCount} <= 30)\n`);
    }
  }
}

/**
 * Verify the framework version is consistent across all distribution channels.
 * Enforces the single-version commitment from ADR-011. Exits 1 on drift.
 */
function versionCheckCommand() {
  console.log(`\n🔖 Checking framework version consistency...\n`);

  const entries = FRAMEWORK_VERSION_SOURCES.map(src => ({
    label: src.label,
    version: src.read(readFileSync(resolve('..', src.file), 'utf8')),
  }));

  const result = checkConsistency(entries);

  for (const entry of entries) {
    const mark = entry.version === null ? '❓' : entry.version === result.canonical ? '=' : '✗';
    console.log(`  ${mark} ${entry.label}: ${entry.version ?? 'not found'}`);
  }

  if (result.consistent) {
    console.log(`\n✨ All channels report ${result.canonical}.\n`);
    return;
  }

  console.log(`\n❌ Version drift from canonical ${result.canonical} (ADR-011 requires one version).\n`);
  process.exit(1);
}

/**
 * Show help
 */
function helpCommand() {
  console.log(`
Documentation Governance Tools

Usage:
  npm run validate [dir]                   Validate markdown links (default: ../.architecture)
  node cli.js validate-adr [files...]      Validate ADRs against template rules
  node cli.js generate-subagents [--check] Generate agents/*.md from members.yml
  node cli.js find-source [--json]         Discover the framework source for setup-architect
  npm run count [files...]                 Count instructions (default: ../AGENTS.md ../CLAUDE.md)
  node cli.js version-check                Verify one framework version across all channels (ADR-011)

Examples:
  npm run validate
  npm run validate ../.architecture
  npm run count
  npm run count ../AGENTS.md
  npm run count ../AGENTS.md ../CLAUDE.md

Supports ADR-005/006 quarterly review process.
  `);
}

/**
 * Find all markdown files recursively
 */
function findMarkdownFiles(dir) {
  const files = [];

  function walk(currentDir) {
    const entries = readdirSync(currentDir);

    for (const entry of entries) {
      const fullPath = join(currentDir, entry);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        // Skip node_modules, hidden dirs, and templates/.
        // Templates are designed to be copied elsewhere; their paths are
        // intentionally relative to the install location, not the source.
        if (
          !entry.startsWith('.') &&
          entry !== 'node_modules' &&
          entry !== 'templates'
        ) {
          walk(fullPath);
        }
      } else if (entry.endsWith('.md')) {
        files.push(fullPath);
      }
    }
  }

  walk(dir);
  return files;
}

main();
