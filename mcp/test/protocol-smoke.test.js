// Protocol-level smoke test for the MCP server.
//
// The rest of the suite reaches ArchitectureServer's setup methods by importing
// the class directly (tools/test/setup-fidelity.test.js), which never resolves
// @modelcontextprotocol/sdk - index.js loads it through dynamic import() inside
// _initServer()/run(). That leaves the SDK, the request handlers, the advertised
// schemas and the stdio transport with no coverage at all, so a dependency bump
// or an entrypoint change can break the server while CI stays green.
//
// These tests talk to a spawned server over a real stdio transport, so they fail
// on exactly the breakage the import-based tests cannot see.

import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { mkdtemp, rm, symlink, readFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { ListToolsResultSchema, CallToolResultSchema } from '@modelcontextprotocol/sdk/types.js';

const MCP_DIR = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SERVER = path.join(MCP_DIR, 'index.js');

// Every tool index.js advertises, matching mcp/README.md "Available Tools
// (6 Tier-1 Tools)". A tool disappearing is a break for anyone whose prompts
// reference it, so the set is asserted exactly rather than as a subset.
const EXPECTED_TOOLS = [
  'setup_architecture',
  'create_adr',
  'list_architecture_members',
  'get_architecture_status',
  'configure_pragmatic_mode',
  'get_implementation_guidance',
].sort();

// Spawn the server at `entry` and return a connected client. Callers close it.
async function connect(entry) {
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [entry],
  });
  const client = new Client({ name: 'protocol-smoke', version: '1.0.0' }, { capabilities: {} });
  await client.connect(transport);
  return client;
}

describe('MCP protocol smoke test', () => {
  let client;
  let projectDir;

  before(async () => {
    projectDir = await mkdtemp(path.join(os.tmpdir(), 'asa-smoke-'));
    client = await connect(SERVER);
  });

  after(async () => {
    if (client) await client.close();
    if (projectDir) await rm(projectDir, { recursive: true, force: true });
  });

  it('completes the initialize handshake over stdio', async () => {
    // Reaching this point already means the handshake succeeded, since connect()
    // awaits it. The assertion pins the identity the server reports back.
    const info = client.getServerVersion();
    assert.strictEqual(info.name, 'ai-software-architect');

    // Read rather than hardcode: tools/ already enforces single-version
    // consistency across files (ADR-011), so hardcoding here would only add a
    // second place to update. What this checks is that the version actually
    // reaches the wire.
    const pkg = JSON.parse(await readFile(path.join(MCP_DIR, 'package.json'), 'utf8'));
    assert.strictEqual(info.version, pkg.version);
  });

  it('advertises exactly the documented tool set', async () => {
    const { tools } = await client.request({ method: 'tools/list', params: {} }, ListToolsResultSchema);
    assert.deepStrictEqual(tools.map(t => t.name).sort(), EXPECTED_TOOLS);
  });

  it('advertises a usable inputSchema for every tool', async () => {
    const { tools } = await client.request({ method: 'tools/list', params: {} }, ListToolsResultSchema);
    for (const tool of tools) {
      const schema = tool.inputSchema;
      assert.ok(schema, `${tool.name} has no inputSchema`);
      assert.strictEqual(schema.type, 'object', `${tool.name} inputSchema is not an object schema`);
      assert.ok(tool.description, `${tool.name} has no description`);

      // A required key with no matching property is a schema a client cannot
      // satisfy - it would prompt for a field the server never documented.
      const properties = Object.keys(schema.properties ?? {});
      for (const key of schema.required ?? []) {
        assert.ok(properties.includes(key), `${tool.name} requires "${key}" but does not define it`);
      }
    }
  });

  it('advertises the tools capability it implements', async () => {
    assert.ok(client.getServerCapabilities()?.tools, 'server does not advertise tools capability');
  });

  it('round-trips a tools/call successfully', async () => {
    // list_architecture_members against an unconfigured directory is the
    // cheapest call that exercises the CallTool handler end to end: no writes,
    // no framework tree needed, deterministic output.
    const result = await client.request({
      method: 'tools/call',
      params: { name: 'list_architecture_members', arguments: { projectPath: projectDir } },
    }, CallToolResultSchema);

    // Assert this FIRST. _setupToolHandlers catches every throw and returns a
    // well-formed {content:[{type:'text',...}], isError:true} - so shape
    // assertions alone pass even when the tool failed outright, which is
    // exactly the regression this file exists to catch. Surface the server's
    // own message when it fires.
    assert.notStrictEqual(result.isError, true, `tools/call failed: ${result.content?.[0]?.text}`);

    assert.ok(Array.isArray(result.content) && result.content.length > 0, 'no content returned');
    assert.strictEqual(result.content[0].type, 'text');
    assert.ok(result.content[0].text.length > 0, 'empty text content');
  });

  it('reports an unknown tool as an error rather than a success', async () => {
    // Proves the isError assertion above has teeth in both directions: if the
    // handler stopped signalling failure, this test goes red instead of the
    // suite quietly accepting anything.
    const result = await client.request({
      method: 'tools/call',
      params: { name: 'no_such_tool', arguments: {} },
    }, CallToolResultSchema);

    assert.strictEqual(result.isError, true, 'unknown tool was not reported as an error');
  });
});

describe('MCP server entrypoint', () => {
  let linkDir;

  before(async () => {
    linkDir = await mkdtemp(path.join(os.tmpdir(), 'asa-bin-'));
  });

  after(async () => {
    if (linkDir) await rm(linkDir, { recursive: true, force: true });
  });

  it('starts when launched through a symlink, as the packaged bin is', async () => {
    // npm installs the "mcp" bin as node_modules/.bin/mcp -> ../<pkg>/index.js,
    // and .mcp.json launches it with `npx -y ai-software-architect`. Node
    // resolves import.meta.url through that symlink but leaves process.argv[1]
    // pointing at the link, so an entrypoint guard that compares the two
    // literally never fires and the server exits 0 in silence - a dead server
    // from the client's point of view, with nothing on stderr to explain it.
    const link = path.join(linkDir, 'mcp');
    await symlink(SERVER, link);

    const client = await connect(link);
    try {
      const { tools } = await client.request({ method: 'tools/list', params: {} }, ListToolsResultSchema);
      assert.deepStrictEqual(tools.map(t => t.name).sort(), EXPECTED_TOOLS);
    } finally {
      await client.close();
    }
  });
});
