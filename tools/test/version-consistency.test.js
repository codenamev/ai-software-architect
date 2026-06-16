import { describe, it } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  extractVersion,
  extractLabeledVersion,
  checkConsistency,
  FRAMEWORK_VERSION_SOURCES,
} from '../lib/version-consistency.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..', '..');

describe('Version Consistency', () => {
  describe('extractVersion', () => {
    it('reads a JSON version field', () => {
      assert.strictEqual(extractVersion('{\n  "version": "1.5.4"\n}'), '1.5.4');
    });

    it('reads an unquoted-key version (JS object)', () => {
      assert.strictEqual(extractVersion('        version: "1.5.4",'), '1.5.4');
    });

    it('does not match `version` inside `framework_version`', () => {
      // Plain-key lookup must skip the compound key entirely.
      assert.strictEqual(extractVersion('framework_version: "1.2.0"'), null);
    });

    it('reads a named key when asked', () => {
      assert.strictEqual(
        extractVersion('  framework_version: "1.5.4"', 'framework_version'),
        '1.5.4'
      );
    });

    it('returns null when no version present', () => {
      assert.strictEqual(extractVersion('no version here'), null);
    });
  });

  describe('extractLabeledVersion', () => {
    it('reads a bold-labeled markdown version', () => {
      assert.strictEqual(
        extractLabeledVersion('**Framework Version**: 1.5.4', 'Framework Version'),
        '1.5.4'
      );
    });

    it('distinguishes labels in the same document', () => {
      const doc = '**Framework Version**: 1.5.4\n**MCP Server Version**: 1.3.0';
      assert.strictEqual(extractLabeledVersion(doc, 'MCP Server Version'), '1.3.0');
    });

    it('returns null when label absent', () => {
      assert.strictEqual(extractLabeledVersion('nothing', 'Framework Version'), null);
    });
  });

  describe('checkConsistency', () => {
    it('is consistent when all versions match', () => {
      const result = checkConsistency([
        { label: 'a', version: '1.5.4' },
        { label: 'b', version: '1.5.4' },
      ]);
      assert.strictEqual(result.consistent, true);
      assert.strictEqual(result.canonical, '1.5.4');
    });

    it('flags mismatches against the canonical (first) version', () => {
      const result = checkConsistency([
        { label: 'a', version: '1.5.4' },
        { label: 'b', version: '1.2.0' },
      ]);
      assert.strictEqual(result.consistent, false);
      assert.strictEqual(result.mismatches.length, 1);
      assert.strictEqual(result.mismatches[0].label, 'b');
    });

    it('flags missing (unreadable) versions', () => {
      const result = checkConsistency([
        { label: 'a', version: '1.5.4' },
        { label: 'b', version: null },
      ]);
      assert.strictEqual(result.consistent, false);
      assert.strictEqual(result.missing.length, 1);
    });

    it('honors an explicit canonical version', () => {
      const result = checkConsistency([{ label: 'a', version: '1.5.4' }], '2.0.0');
      assert.strictEqual(result.consistent, false);
    });
  });

  // Recurrence guard: the real repo files must agree. This is the check the
  // ADR-011 release pipeline was meant to enforce. Fails CI on drift.
  describe('repository (ADR-011 single-version commitment)', () => {
    it('every framework version source agrees', () => {
      const entries = FRAMEWORK_VERSION_SOURCES.map(src => ({
        label: src.label,
        version: src.read(readFileSync(path.join(repoRoot, src.file), 'utf8')),
      }));

      const result = checkConsistency(entries);

      const detail = [
        ...result.mismatches.map(m => `  ${m.label}: ${m.version} (expected ${result.canonical})`),
        ...result.missing.map(m => `  ${m.label}: version not found`),
      ].join('\n');

      assert.ok(
        result.consistent,
        `Framework version drift (canonical ${result.canonical}):\n${detail}`
      );
    });
  });
});
