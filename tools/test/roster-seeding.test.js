import { describe, it } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';
import { seedRoster, assertContainsIds } from '../lib/roster-seeding.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..', '..');

const CANONICAL_IDS = [
  'systems_architect', 'domain_expert', 'security_specialist', 'maintainability_expert',
  'performance_specialist', 'implementation_strategist', 'ai_engineer', 'pragmatic_enforcer',
];

describe('Roster seeding (ADR-016)', () => {
  describe('seedRoster', () => {
    it('preserves the canonical roster when no advisors are given', () => {
      const canonical = [{ id: 'a' }, { id: 'b' }];
      assert.deepStrictEqual(seedRoster(canonical).map(m => m.id), ['a', 'b']);
    });

    it('appends an advisor with a unique id', () => {
      const merged = seedRoster([{ id: 'a' }], [{ id: 'rails_advisor' }]);
      assert.deepStrictEqual(merged.map(m => m.id), ['a', 'rails_advisor']);
    });

    it('never substitutes a canonical member on id collision', () => {
      const canonical = [{ id: 'security_specialist', canonical: true }];
      const merged = seedRoster(canonical, [{ id: 'security_specialist', canonical: false }]);
      assert.strictEqual(merged.length, 1);
      assert.strictEqual(merged[0].canonical, true);
    });

    it('throws on an empty/missing canonical roster (fail closed)', () => {
      assert.throws(() => seedRoster([]), /missing or empty/);
      assert.throws(() => seedRoster(null), /missing or empty/);
    });
  });

  describe('assertContainsIds', () => {
    it('passes when all required ids are present', () => {
      assert.strictEqual(assertContainsIds([{ id: 'a' }, { id: 'b' }], ['a']), true);
    });

    it('throws listing the missing ids', () => {
      assert.throws(
        () => assertContainsIds([{ id: 'a' }], ['a', 'pragmatic_enforcer']),
        /pragmatic_enforcer/
      );
    });
  });

  // Fidelity guard: the framework's own canonical members.yml must carry all 8
  // core architects. This is the source setup copies; if it drifts, every new
  // install drifts. (ADR-016)
  describe('canonical members.yml (source of truth)', () => {
    it('defines all 8 canonical architects with correct ids', () => {
      const doc = parseYaml(readFileSync(path.join(repoRoot, '.architecture/members.yml'), 'utf8'));
      assert.doesNotThrow(() => assertContainsIds(doc.members, CANONICAL_IDS));
      // and uses security_specialist, not the drifted security_architect
      const ids = doc.members.map(m => m.id);
      assert.ok(ids.includes('security_specialist'));
      assert.ok(!ids.includes('security_architect'));
    });
  });
});
