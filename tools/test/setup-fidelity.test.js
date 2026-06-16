import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { mkdtemp, rm, writeFile, readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import { ArchitectureServer } from '../../mcp/index.js';

const CANONICAL_IDS = [
  'systems_architect', 'domain_expert', 'security_specialist', 'maintainability_expert',
  'performance_specialist', 'implementation_strategist', 'ai_engineer', 'pragmatic_enforcer',
];

// Integration test for ADR-016: run the real MCP setup against a polyglot fixture
// and assert the install is faithful and usable (canonical team + dispatchable
// subagents + pragmatic config + correct principles location + unmasked stack).
describe('Setup fidelity (ADR-016) — setup_architecture end-to-end', () => {
  let dir;

  before(async () => {
    dir = await mkdtemp(path.join(os.tmpdir(), 'asa-setup-'));
    // Polyglot fixture: Rails (Gemfile) + Express (package.json) — the dogfood case.
    await writeFile(path.join(dir, 'package.json'),
      JSON.stringify({ name: 'demo', dependencies: { express: '^4.18.0' } }));
    await writeFile(path.join(dir, 'Gemfile'),
      "source 'https://rubygems.org'\ngem 'rails', '~> 7.1'\ngem 'sqlite3'\n");
    await new ArchitectureServer().setupArchitecture({ projectPath: dir });
  });

  after(async () => { if (dir) await rm(dir, { recursive: true, force: true }); });

  it('seeds exactly the canonical team (no drift, no extras)', async () => {
    const doc = parseYaml(await readFile(path.join(dir, '.architecture/members.yml'), 'utf8'));
    const ids = doc.members.map(m => m.id).sort();
    // No advisors are appended initially, so the roster must equal the canonical
    // 8 EXACTLY — this catches both omissions and a wrong-id member sneaking in.
    assert.deepStrictEqual(ids, [...CANONICAL_IDS].sort());
    assert.ok(!ids.includes('security_architect'), 'drifted security_architect must be gone');
  });

  it('generates dispatchable subagents, including pragmatic-enforcer', async () => {
    const agents = await readdir(path.join(dir, 'agents'));
    assert.ok(agents.includes('pragmatic-enforcer.md'), 'pragmatic-enforcer subagent must exist');
    assert.ok(agents.length >= CANONICAL_IDS.length, `expected >=8 subagents, got ${agents.length}`);
  });

  it('writes principles to the canonical path, not the mislocated decisions/ path', () => {
    assert.ok(existsSync(path.join(dir, '.architecture/principles.md')), 'canonical principles.md missing');
    assert.ok(!existsSync(path.join(dir, '.architecture/decisions/principles.md')),
      'mislocated decisions/principles.md must not be created');
  });

  it('seeds a config.yml carrying pragmatic_mode', async () => {
    const cfg = await readFile(path.join(dir, '.architecture/config.yml'), 'utf8');
    assert.match(cfg, /pragmatic_mode/);
  });

  it('detects all frameworks (Rails not masked by Express)', async () => {
    const analysis = await readFile(path.join(dir, '.architecture/reviews/initial-system-analysis.md'), 'utf8');
    assert.match(analysis, /Rails/, 'Rails should be detected');
    assert.match(analysis, /Express/, 'Express should be detected');
  });
});
