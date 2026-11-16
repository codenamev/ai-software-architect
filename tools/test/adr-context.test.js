import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, realpathSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { adrContextFor, formatAdrContext, findProjectRoot } from '../lib/adr-context.js';

const HOOK = join(dirname(fileURLToPath(import.meta.url)), '..', 'hooks', 'adr-context-hook.js');

const adr = (title, fm) =>
  `---\n${fm}date: 2026-11-01\n---\n\n# ${title}\n\n## Context\n\nC.\n\n## Decision\n\nD.\n\n## Consequences\n\nE.\n`;

let root;
before(() => {
  root = realpathSync(mkdtempSync(join(tmpdir(), 'adr-context-')));
  const dir = join(root, '.architecture', 'decisions', 'adrs');
  mkdirSync(dir, { recursive: true });
  mkdirSync(join(root, 'app', 'models'), { recursive: true });
  writeFileSync(join(dir, 'ADR-001-auth-sessions.md'),
    adr('Cookie sessions for auth', 'status: superseded\nsuperseded-by: ADR-003\naffects: [app/auth/**]\n'));
  writeFileSync(join(dir, 'ADR-002-models.md'),
    adr('Models stay thin', 'status: accepted\naffects: [app/models/*.rb]\n'));
  writeFileSync(join(dir, 'ADR-003-auth-tokens.md'),
    adr('Token auth replaces sessions', 'status: accepted\nsupersedes: ADR-001\naffects: [app/auth/**]\n'));
  writeFileSync(join(dir, 'ADR-004-no-globs.md'),
    adr('Models are documented', 'status: accepted\n'));
});
after(() => rmSync(root, { recursive: true, force: true }));

function runHook(payload) {
  return spawnSync('node', [HOOK], { input: typeof payload === 'string' ? payload : JSON.stringify(payload), encoding: 'utf8' });
}

describe('adrContextFor', () => {
  it('names ADRs whose affects globs match, from an absolute path', () => {
    const ctx = adrContextFor(join(root, 'app', 'models', 'user.rb'));
    assert.strictEqual(ctx.rel, 'app/models/user.rb');
    assert.deepStrictEqual(ctx.adrs.map(a => a.id), ['ADR-002']);
  });

  it('resolves a relative path against cwd', () => {
    const ctx = adrContextFor('app/auth/login.rb', { cwd: root });
    assert.deepStrictEqual(ctx.adrs.map(a => a.id).sort(), ['ADR-001', 'ADR-003']);
  });

  it('ignores ADRs without affects globs even if their words match the path', () => {
    const ctx = adrContextFor(join(root, 'app', 'models', 'user.rb'));
    assert.ok(!ctx.adrs.some(a => a.id === 'ADR-004'));
  });

  it('returns null with no match, outside the project, or for ADR files themselves', () => {
    assert.strictEqual(adrContextFor(join(root, 'README.md')), null);
    assert.strictEqual(adrContextFor(join(root, '.architecture', 'decisions', 'adrs', 'ADR-002-models.md')), null);
    assert.strictEqual(adrContextFor('/definitely/not/a/project/file.rb', { cwd: '/definitely/not' }), null);
    assert.strictEqual(adrContextFor(undefined), null);
  });

  it('finds the root by walking up from a nested file that does not exist yet', () => {
    assert.strictEqual(findProjectRoot(join(root, 'app', 'new', 'deep', 'x.rb')), root);
  });
});

describe('formatAdrContext', () => {
  it('labels superseded ADRs with their successor and says matches are not adjudicated', () => {
    const text = formatAdrContext(adrContextFor('app/auth/login.rb', { cwd: root }));
    assert.match(text, /ADR-001: Cookie sessions for auth \[Superseded\] via app\/auth\/\*\*, .*superseded by ADR-003; follow the successor/);
    assert.match(text, /ADR-003: Token auth replaces sessions \[Accepted\]/);
    assert.match(text, /not checked against your change/);
  });
});

describe('adr-context-hook', () => {
  it('prints PreToolUse additionalContext for a governed file', () => {
    const res = runHook({ tool_name: 'Edit', cwd: root, tool_input: { file_path: join(root, 'app', 'models', 'user.rb') } });
    assert.strictEqual(res.status, 0);
    const out = JSON.parse(res.stdout);
    assert.strictEqual(out.hookSpecificOutput.hookEventName, 'PreToolUse');
    assert.match(out.hookSpecificOutput.additionalContext, /ADR-002: Models stay thin/);
  });

  it('stays silent and exits 0 for ungoverned files, bad JSON, empty input, and missing paths', () => {
    for (const input of [
      { cwd: root, tool_input: { file_path: join(root, 'README.md') } },
      '{not json',
      '',
      { cwd: root, tool_input: {} },
    ]) {
      const res = runHook(input);
      assert.strictEqual(res.status, 0, `input ${JSON.stringify(input)}`);
      assert.strictEqual(res.stdout, '', `input ${JSON.stringify(input)}`);
    }
  });
});
