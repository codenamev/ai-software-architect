import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { isProtected, protectedFileMessage, setupSentinelActive, SETUP_SENTINEL_TTL_MS } from '../lib/protected-files.js';
import { mkdtempSync, mkdirSync, writeFileSync, utimesSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

describe('Protected files', () => {
  describe('isProtected', () => {
    it('flags .architecture/members.yml', () => {
      assert.strictEqual(isProtected('.architecture/members.yml'), true);
      assert.strictEqual(isProtected('/abs/path/.architecture/members.yml'), true);
    });

    it('flags .architecture/principles.md', () => {
      assert.strictEqual(isProtected('.architecture/principles.md'), true);
    });

    it('flags .architecture/config.yml', () => {
      assert.strictEqual(isProtected('.architecture/config.yml'), true);
    });

    it('does not flag unrelated files', () => {
      for (const p of [
        'README.md',
        'package.json',
        '.architecture/decisions/adrs/ADR-001-foo.md',
        '.architecture/templates/adr-template.md',
        'tools/cli.js',
        '.claude/settings.json',
      ]) {
        assert.strictEqual(isProtected(p), false, `should not flag ${p}`);
      }
    });

    it('does not flag a file that merely contains a protected name as substring', () => {
      assert.strictEqual(isProtected('.architecture/members.yml.bak'), false);
      assert.strictEqual(isProtected('docs/principles.md'), false);
      assert.strictEqual(isProtected('config.yml'), false);
    });

    it('resolves . and .. segments before matching', () => {
      for (const p of [
        '.architecture/./members.yml',
        '.architecture/decisions/../config.yml',
        '/abs/.architecture/../.architecture/principles.md',
        './.architecture/members.yml',
      ]) {
        assert.strictEqual(isProtected(p), true, `should flag ${p}`);
      }
    });

    it('collapses duplicate separators before matching', () => {
      assert.strictEqual(isProtected('.architecture//members.yml'), true);
      assert.strictEqual(isProtected('/abs//path/.architecture///config.yml'), true);
    });

    it('accepts Windows separators regardless of host platform', () => {
      assert.strictEqual(isProtected('C:\\proj\\.architecture\\members.yml'), true);
      assert.strictEqual(isProtected('.architecture\\config.yml'), true);
      assert.strictEqual(isProtected('C:\\proj\\.architecture\\templates\\config.yml'), false);
    });

    it('does not flag when .. walks out of .architecture', () => {
      assert.strictEqual(isProtected('.architecture/../members.yml'), false);
      assert.strictEqual(isProtected('.architecture/../docs/config.yml'), false);
    });

    it('does not flag a directory whose name merely ends in .architecture', () => {
      assert.strictEqual(isProtected('foo.architecture/members.yml'), false);
      assert.strictEqual(isProtected('/abs/my.architecture/config.yml'), false);
    });

    it('does not flag protected names nested deeper under .architecture', () => {
      assert.strictEqual(isProtected('.architecture/templates/config.yml'), false);
      assert.strictEqual(isProtected('.architecture/decisions/principles.md'), false);
    });

    it('handles empty or undefined paths defensively', () => {
      assert.strictEqual(isProtected(''), false);
      assert.strictEqual(isProtected(undefined), false);
      assert.strictEqual(isProtected(null), false);
    });
  });

  describe('protectedFileMessage', () => {
    it('returns a message that names the file', () => {
      const msg = protectedFileMessage('.architecture/members.yml');
      assert.match(msg, /members\.yml/);
    });

    it('explains why the file is protected', () => {
      const msg = protectedFileMessage('.architecture/members.yml');
      assert.match(msg, /generator|generate-subagents|drift/i);
    });

    it('directs the user to the canonical edit workflow for members.yml', () => {
      const msg = protectedFileMessage('.architecture/members.yml');
      assert.match(msg, /generate-subagents|regenerate/i);
    });

    it('explains principles.md and config.yml separately', () => {
      const principles = protectedFileMessage('.architecture/principles.md');
      const config = protectedFileMessage('.architecture/config.yml');
      assert.match(principles, /principle/i);
      assert.match(config, /config|operational/i);
    });

    it('mentions the override pathway (env var or pragmatic-guard skill)', () => {
      const msg = protectedFileMessage('.architecture/principles.md');
      assert.match(msg, /CLAUDE_ALLOW_PROTECTED|override/i);
    });

    it('returns an empty string for unprotected paths', () => {
      assert.strictEqual(protectedFileMessage('README.md'), '');
      assert.strictEqual(protectedFileMessage('foo.architecture/members.yml'), '');
      assert.strictEqual(protectedFileMessage(undefined), '');
    });

    it('matches the same normalized forms isProtected does', () => {
      const msg = protectedFileMessage('.architecture/decisions/../members.yml');
      assert.match(msg, /members\.yml/);
      assert.match(msg, /generate-subagents/);
    });
  });

  describe('setup sentinel', () => {
    const HOOK = fileURLToPath(new URL('../hooks/protect-files-hook.js', import.meta.url));
    let root;
    let arch;

    function runHook(filePath, cwd = root) {
      const env = { ...process.env };
      delete env.CLAUDE_ALLOW_PROTECTED;
      return spawnSync(process.execPath, [HOOK], {
        input: JSON.stringify({ cwd, tool_name: 'Edit', tool_input: { file_path: filePath } }),
        env,
        encoding: 'utf8',
      });
    }

    function touchSentinel(ageMs = 0) {
      const p = join(arch, '.setup-in-progress');
      writeFileSync(p, 'setup-architect\n');
      const t = (Date.now() - ageMs) / 1000;
      utimesSync(p, t, t);
    }

    beforeEach(() => {
      root = mkdtempSync(join(tmpdir(), 'asa-sentinel-'));
      arch = join(root, '.architecture');
      mkdirSync(arch);
    });

    afterEach(() => rmSync(root, { recursive: true, force: true }));

    it('blocks protected files when no sentinel exists', () => {
      assert.strictEqual(setupSentinelActive(join(arch, 'members.yml')), false);
      assert.strictEqual(runHook(join(arch, 'members.yml')).status, 2);
    });

    it('allows protected files while a fresh sentinel exists', () => {
      touchSentinel();
      for (const name of ['members.yml', 'principles.md', 'config.yml']) {
        assert.strictEqual(setupSentinelActive(join(arch, name)), true, name);
        assert.strictEqual(runHook(join(arch, name)).status, 0, name);
      }
    });

    it('resolves relative paths against the payload cwd', () => {
      touchSentinel();
      assert.strictEqual(setupSentinelActive('.architecture/config.yml', { cwd: root }), true);
      assert.strictEqual(runHook('.architecture/config.yml').status, 0);
      assert.strictEqual(runHook('.architecture/config.yml', tmpdir()).status, 2);
    });

    it('ignores a stale sentinel left by an aborted setup', () => {
      touchSentinel(SETUP_SENTINEL_TTL_MS + 60_000);
      assert.strictEqual(setupSentinelActive(join(arch, 'members.yml')), false);
      assert.strictEqual(runHook(join(arch, 'members.yml')).status, 2);
    });

    it('ignores a sentinel that is a directory', () => {
      mkdirSync(join(arch, '.setup-in-progress'));
      assert.strictEqual(setupSentinelActive(join(arch, 'members.yml')), false);
    });

    it('only honors a sentinel in the same .architecture directory', () => {
      touchSentinel();
      const other = join(root, 'nested', '.architecture');
      mkdirSync(other, { recursive: true });
      assert.strictEqual(setupSentinelActive(join(other, 'members.yml')), false);
      assert.strictEqual(runHook(join(other, 'members.yml')).status, 2);
    });

    it('never reports active for unprotected paths', () => {
      touchSentinel();
      assert.strictEqual(setupSentinelActive(join(arch, 'notes.md')), false);
    });
  });
});
