import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// Skills parity (ADR-015): `cli.js find-adrs` must answer like the MCP
// find_relevant_adrs tool, since the find-adrs skill runs it.
const CLI = join(dirname(fileURLToPath(import.meta.url)), '..', 'cli.js');
const run = (...args) => spawnSync(process.execPath, [CLI, 'find-adrs', ...args], { encoding: 'utf8' });

const adr = (status, title, extra = '') =>
  `---\nstatus: ${status}\ndate: 2026-11-01\n${extra}---\n\n# ${title}\n\n## Context\n\nStorage.\n`;

describe('cli find-adrs', () => {
  let project;

  before(() => {
    project = mkdtempSync(join(tmpdir(), 'find-adrs-'));
    const dir = join(project, '.architecture', 'decisions', 'adrs');
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'ADR-001-mysql.md'), adr('superseded', 'Use MySQL for storage', 'superseded-by: ADR-002\n'));
    writeFileSync(join(dir, 'ADR-002-postgres.md'), adr('accepted', 'Use PostgreSQL for storage', 'supersedes: ADR-001\naffects: [db/**]\n'));
  });

  after(() => rmSync(project, { recursive: true, force: true }));

  it('returns the MCP result shape as JSON, superseded ADRs labelled', () => {
    const res = run('--project', project, '--query', 'storage', '--json');
    assert.strictEqual(res.status, 0, res.stderr);
    const out = JSON.parse(res.stdout);
    assert.strictEqual(out.searched, 2);
    const old = out.adrs.find(a => a.id === 'ADR-001');
    assert.strictEqual(old.current, false);
    assert.deepStrictEqual(old.supersededBy, ['ADR-002']);
    assert.strictEqual(out.adrs.find(a => a.id === 'ADR-002').current, true);
  });

  it('matches a file path through affects globs', () => {
    const out = JSON.parse(run('--project', project, '--file', 'db/schema.rb', '--json').stdout);
    assert.deepStrictEqual(out.adrs.map(a => a.id), ['ADR-002']);
    assert.match(out.adrs[0].matched[0], /affects db\/\*\*/);
  });

  it('carries the MCP note when nothing matches', () => {
    const out = JSON.parse(run('--project', project, '--query', 'kubernetes', '--json').stdout);
    assert.deepStrictEqual(out.adrs, []);
    assert.match(out.note, /may warrant an ADR/);
  });

  it('refuses without a query or file, and without an ADR directory', () => {
    const none = run('--project', project);
    assert.strictEqual(none.status, 1);
    assert.match(none.stderr, /Pass a query, a filePath, or both/);

    const empty = mkdtempSync(join(tmpdir(), 'find-adrs-empty-'));
    const missing = run('--project', empty, '--query', 'x');
    rmSync(empty, { recursive: true, force: true });
    assert.strictEqual(missing.status, 1);
    assert.match(missing.stderr, /No ADR directory/);
  });

  it('rejects an out-of-range limit', () => {
    const res = run('--project', project, '--query', 'storage', '--limit', '0');
    assert.strictEqual(res.status, 1);
    assert.match(res.stderr, /--limit/);
  });
});
