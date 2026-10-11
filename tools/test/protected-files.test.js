import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isProtected, protectedFileMessage } from '../lib/protected-files.js';

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
});
