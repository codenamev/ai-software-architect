// setup_architecture must find the framework tree before it writes, and must
// refuse, leaving the project untouched, when no tree is installed (#85).
//
// The server is spawned from a layout that mimics the published tarball as npx
// lays it out: <cache>/node_modules/ai-software-architect/{index.js,package.json}
// with its dependencies hoisted beside it. There path.resolve(__dirname, '..')
// is a node_modules directory, not a framework root, which is the shape in
// which the old shortcut copied every sibling package into the user's project
// and left an empty .architecture/ skeleton that locked out the retry.

import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { mkdtemp, rm, mkdir, copyFile, symlink, readdir, writeFile, cp } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { CallToolResultSchema } from '@modelcontextprotocol/sdk/types.js';

const MCP_DIR = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const REPO_ROOT = path.dirname(MCP_DIR);

// Spawn the server at `entry` with exactly `env` and return a connected client.
async function connect(entry, env) {
  const transport = new StdioClientTransport({ command: process.execPath, args: [entry], env });
  const client = new Client({ name: 'setup-source', version: '1.0.0' }, { capabilities: {} });
  await client.connect(transport);
  return client;
}

// The spawned server sees a HOME this test owns, so the machine's real
// ~/.claude/plugins never leaks in, and no CLAUDE_PLUGIN_ROOT unless the case
// sets one. PATH stays so node can be found.
function serverEnv(home, extra = {}) {
  return { PATH: process.env.PATH, HOME: home, USERPROFILE: home, ...extra };
}

async function callSetup(client, projectPath) {
  return client.request({
    method: 'tools/call',
    params: { name: 'setup_architecture', arguments: { projectPath } },
  }, CallToolResultSchema);
}

async function assertInstalled(project) {
  assert.ok(existsSync(path.join(project, '.architecture', 'members.yml')), 'members.yml not installed');
  assert.ok(existsSync(path.join(project, '.architecture', 'templates', 'adr-template.md')), 'templates not installed');
  const agents = await readdir(path.join(project, 'agents'));
  assert.ok(agents.length >= 8, `expected >=8 generated subagents, got ${agents.length}`);
  assert.ok(!existsSync(path.join(project, '.architecture-temp')), 'scratch copy left behind');
  assert.ok(!existsSync(path.join(project, '.architecture', 'node_modules')), 'node_modules copied into the project');
}

async function withProject(fn) {
  const project = await mkdtemp(path.join(os.tmpdir(), 'asa-proj-'));
  try {
    await fn(project);
  } finally {
    await rm(project, { recursive: true, force: true });
  }
}

describe('setup_architecture framework source discovery (#85)', () => {
  let cacheDir;
  let pkgEntry;
  let emptyHome;

  before(async () => {
    cacheDir = await mkdtemp(path.join(os.tmpdir(), 'asa-npx-'));
    const pkgDir = path.join(cacheDir, 'node_modules', 'ai-software-architect');
    await mkdir(pkgDir, { recursive: true });
    for (const f of ['index.js', 'package.json']) {
      await copyFile(path.join(MCP_DIR, f), path.join(pkgDir, f));
    }
    // The package's dependencies, hoisted next to it as npm does.
    await symlink(path.join(MCP_DIR, 'node_modules'), path.join(pkgDir, 'node_modules'), 'dir');
    // A sibling package in the cache, the kind the old shortcut swept up.
    await mkdir(path.join(cacheDir, 'node_modules', 'some-sibling'));
    await writeFile(path.join(cacheDir, 'node_modules', 'some-sibling', 'package.json'), '{"name":"some-sibling"}');
    pkgEntry = path.join(pkgDir, 'index.js');
    emptyHome = await mkdtemp(path.join(os.tmpdir(), 'asa-home-'));
  });

  after(async () => {
    for (const dir of [cacheDir, emptyHome]) {
      if (dir) await rm(dir, { recursive: true, force: true });
    }
  });

  it('refuses before writing anything when no framework source is installed', async () => {
    await withProject(async (project) => {
      const client = await connect(pkgEntry, serverEnv(emptyHome));
      try {
        const result = await callSetup(client, project);
        assert.strictEqual(result.isError, true, `setup succeeded with no framework source: ${result.content?.[0]?.text}`);
        const text = result.content[0].text;
        assert.match(text, /plugin install ai-software-architect/, 'error does not say how to install the plugin');
        assert.match(text, /CLAUDE_PLUGIN_ROOT/, 'error does not name the override');
        assert.doesNotMatch(text, /Cannot find module|ERR_MODULE_NOT_FOUND/, 'Node internals leaked into the error');
        assert.deepStrictEqual(await readdir(project), [], 'project was written to before discovery failed');

        // The retry must not be locked out by a skeleton from the failed run.
        const again = await callSetup(client, project);
        assert.strictEqual(again.isError, true);
        assert.doesNotMatch(again.content[0].text, /already set up/, 'failed run locked out the retry');
      } finally {
        await client.close();
      }
    });
  });

  it('installs from CLAUDE_PLUGIN_ROOT when it names a framework checkout', async () => {
    await withProject(async (project) => {
      const client = await connect(pkgEntry, serverEnv(emptyHome, { CLAUDE_PLUGIN_ROOT: REPO_ROOT }));
      try {
        const result = await callSetup(client, project);
        assert.notStrictEqual(result.isError, true, `setup failed: ${result.content?.[0]?.text}`);
        await assertInstalled(project);
      } finally {
        await client.close();
      }
    });
  });

  it('installs from the plugin under ~/.claude/plugins, which has no node_modules', async () => {
    // A plugin install is a checkout nobody ran `npm install` in: the framework
    // tree and tools/lib are there, tools/node_modules is not. The layout is
    // Claude Code's cache/<marketplace>/<plugin>/<version>/, where the first
    // directory named after the plugin is the marketplace level.
    const home = await mkdtemp(path.join(os.tmpdir(), 'asa-home-'));
    const plugin = path.join(home, '.claude', 'plugins', 'cache', 'ai-software-architect', 'ai-software-architect', '1.6.0');
    for (const sub of ['.architecture', '.coding-assistants', path.join('tools', 'lib')]) {
      await cp(path.join(REPO_ROOT, sub), path.join(plugin, sub), { recursive: true });
    }
    assert.ok(!existsSync(path.join(plugin, 'tools', 'node_modules')), 'fixture must not carry tools/node_modules');
    try {
      await withProject(async (project) => {
        const client = await connect(pkgEntry, serverEnv(home));
        try {
          const result = await callSetup(client, project);
          assert.notStrictEqual(result.isError, true, `setup failed: ${result.content?.[0]?.text}`);
          await assertInstalled(project);
        } finally {
          await client.close();
        }
      });
    } finally {
      await rm(home, { recursive: true, force: true });
    }
  });

  it('refuses when every source is incomplete, naming each one, rather than installing half of one', async () => {
    // Two plugin trees, both with the sentinel: one has no tools/lib at all,
    // the other has the generator a pre-#85 plugin shipped, whose top-level
    // `import ... from 'yaml'` cannot resolve without tools/node_modules. The
    // old code moved .architecture into place and then threw on the import.
    const home = await mkdtemp(path.join(os.tmpdir(), 'asa-home-'));
    const plugins = path.join(home, '.claude', 'plugins');
    const bare = path.join(plugins, 'marketplaces', 'ai-software-architect');
    const stale = path.join(plugins, 'cache', 'ai-software-architect', 'ai-software-architect', '1.6.0');
    await cp(path.join(REPO_ROOT, '.architecture'), path.join(bare, '.architecture'), { recursive: true });
    await cp(path.join(REPO_ROOT, '.architecture'), path.join(stale, '.architecture'), { recursive: true });
    await mkdir(path.join(stale, 'tools', 'lib'), { recursive: true });
    await writeFile(path.join(stale, 'tools', 'lib', 'subagent-generator.js'),
      "import { parse } from 'yaml';\nexport function generateAll(y) { return parse(y); }\n");
    await copyFile(path.join(REPO_ROOT, 'tools', 'lib', 'roster-seeding.js'), path.join(stale, 'tools', 'lib', 'roster-seeding.js'));
    try {
      await withProject(async (project) => {
        const client = await connect(pkgEntry, serverEnv(home));
        try {
          const result = await callSetup(client, project);
          assert.strictEqual(result.isError, true, 'incomplete source was accepted');
          const text = result.content[0].text;
          assert.match(text, /incomplete/, 'error does not say the sources are incomplete');
          assert.ok(text.includes(bare) && text.includes(stale), `error does not list both trees:\n${text}`);
          assert.match(text, /plugin update/, 'error does not say how to recover');
          assert.deepStrictEqual(await readdir(project), [], 'project was written to despite an incomplete source');
        } finally {
          await client.close();
        }
      });
    } finally {
      await rm(home, { recursive: true, force: true });
    }
  });

  it('skips incomplete and orphaned plugin versions in favour of the complete one', async () => {
    // Claude Code keeps the previous version beside the current one for a while
    // after /plugin update, marked `.orphaned_at`. Sorted candidate order would
    // visit 1.5.4 (no roster-seeding.js) first and 1.7.0 (orphaned) last; the
    // install must come from 1.6.0.
    const home = await mkdtemp(path.join(os.tmpdir(), 'asa-home-'));
    const versions = path.join(home, '.claude', 'plugins', 'cache', 'ai-software-architect', 'ai-software-architect');
    const tree = async (version, subs) => {
      const root = path.join(versions, version);
      for (const sub of subs) await cp(path.join(REPO_ROOT, sub), path.join(root, sub), { recursive: true });
      return root;
    };
    await tree('1.5.4', ['.architecture']);
    await mkdir(path.join(versions, '1.5.4', 'tools', 'lib'), { recursive: true });
    await copyFile(path.join(REPO_ROOT, 'tools', 'lib', 'subagent-generator.js'), path.join(versions, '1.5.4', 'tools', 'lib', 'subagent-generator.js'));
    const current = await tree('1.6.0', ['.architecture', '.coding-assistants', path.join('tools', 'lib')]);
    const orphaned = await tree('1.7.0', ['.architecture', '.coding-assistants', path.join('tools', 'lib')]);
    await writeFile(path.join(orphaned, '.orphaned_at'), new Date().toISOString());
    try {
      await withProject(async (project) => {
        const client = await connect(pkgEntry, serverEnv(home));
        try {
          const result = await callSetup(client, project);
          assert.notStrictEqual(result.isError, true, `setup failed: ${result.content?.[0]?.text}`);
          const source = result.content[0].text.match(/Framework source: (.+)/)?.[1];
          assert.strictEqual(source, current, 'install did not come from the current, complete version');
          await assertInstalled(project);
        } finally {
          await client.close();
        }
      });
    } finally {
      await rm(home, { recursive: true, force: true });
    }
  });

  it('tells a user with a 1.6.0 skeleton how to recover instead of calling it set up', async () => {
    await withProject(async (project) => {
      await mkdir(path.join(project, '.architecture', 'decisions', 'adrs'), { recursive: true });
      const client = await connect(pkgEntry, serverEnv(emptyHome, { CLAUDE_PLUGIN_ROOT: REPO_ROOT }));
      try {
        const empty = await callSetup(client, project);
        assert.match(empty.content[0].text, /left over from a failed setup/, 'skeleton reported as a working install');
        assert.match(empty.content[0].text, /remove \.architecture\//i, 'no recovery step given');
        assert.doesNotMatch(empty.content[0].text, /move anything/, 'empty skeleton told to salvage files');

        // create_adr writes into a skeleton; an ADR is history, so the advice
        // must say to save it before removing the directory.
        await writeFile(path.join(project, '.architecture', 'decisions', 'adrs', 'ADR-001-kept.md'), '# ADR-001\n');
        const withAdr = await callSetup(client, project);
        assert.match(withAdr.content[0].text, /holds 1 file/, 'files in the skeleton not counted');
        assert.match(withAdr.content[0].text, /move anything you want to keep/, 'removal suggested over a user ADR');
      } finally {
        await client.close();
      }
    });
  });
});
