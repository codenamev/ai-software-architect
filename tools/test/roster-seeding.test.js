import { describe, it } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';
import { assertContainsIds, CANONICAL_MEMBER_IDS } from '../lib/roster-seeding.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..', '..');

describe('Roster validation (ADR-016)', () => {
  describe('assertContainsIds', () => {
    it('passes when all required ids are present', () => {
      assert.strictEqual(assertContainsIds([{ id: 'a' }, { id: 'b' }], ['a']), true);
    });

    it('throws listing the missing ids (fail closed)', () => {
      assert.throws(
        () => assertContainsIds([{ id: 'a' }], ['a', 'pragmatic_enforcer']),
        /pragmatic_enforcer/
      );
    });

    it('defaults to the canonical contract', () => {
      assert.throws(() => assertContainsIds([{ id: 'systems_architect' }]), /domain_expert/);
    });
  });

  // Fidelity guard: the framework's own canonical members.yml must carry exactly
  // the canonical contract. This is the source setup copies; if it drifts, every
  // new install drifts — and the fail-closed validation's contract drifts with it.
  describe('canonical members.yml (source of truth)', () => {
    it('contains every canonical id and the correct security id', () => {
      const doc = parseYaml(readFileSync(path.join(repoRoot, '.architecture/members.yml'), 'utf8'));
      assert.doesNotThrow(() => assertContainsIds(doc.members, CANONICAL_MEMBER_IDS));
      const ids = doc.members.map(m => m.id);
      assert.ok(ids.includes('security_specialist'));
      assert.ok(!ids.includes('security_architect'));
    });

    it('contract and source agree (no drift between code and members.yml)', () => {
      const doc = parseYaml(readFileSync(path.join(repoRoot, '.architecture/members.yml'), 'utf8'));
      const coreIds = doc.members.map(m => m.id).filter(id => CANONICAL_MEMBER_IDS.includes(id));
      assert.deepStrictEqual([...coreIds].sort(), [...CANONICAL_MEMBER_IDS].sort());
    });
  });
});
