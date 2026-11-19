import { describe, it } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';
import { assertContainsIds, CANONICAL_MEMBER_IDS, stripInternalProvenance } from '../lib/roster-seeding.js';

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

describe('stripInternalProvenance', () => {
  const collapse = v => JSON.parse(JSON.stringify(v, (k, x) =>
    x && typeof x === 'object' && 'text' in x &&
    Object.keys(x).every(key => key === 'text' || key === 'motivated_by') ? x.text : x));

  it('collapses text + motivated_by items to plain strings', () => {
    const src = [
      '    silent_checklist:',
      '      - text: "Who owns this?"',
      '        motivated_by: "ADR-016; sources disagreed"',
      '      - "Plain item"',
      '    blocking_criteria:',
      '      - "x"',
    ].join('\n');
    assert.strictEqual(stripInternalProvenance(src), [
      '    silent_checklist:',
      '      - "Who owns this?"',
      '      - "Plain item"',
      '    blocking_criteria:',
      '      - "x"',
    ].join('\n'));
  });

  it('leaves items with other keys untouched', () => {
    const src = '      - text: "a"\n        motivated_by: "#30"\n        severity: high\n';
    assert.strictEqual(stripInternalProvenance(src), src);
  });

  it('drops the ADR-010 comment that documents motivated_by', () => {
    const src = [
      '    # Behavioral fields (optional, see ADR-010 "Silent Checklist"). Each item may be a',
      '    # plain string or { text: "...", motivated_by: "..." } to record why it exists.',
      '    # unrelated comment stays',
    ].join('\n');
    assert.strictEqual(stripInternalProvenance(src), '    # unrelated comment stays');
  });

  it('is idempotent', () => {
    const real = readFileSync(path.join(repoRoot, '.architecture', 'members.yml'), 'utf8');
    const once = stripInternalProvenance(real);
    assert.strictEqual(stripInternalProvenance(once), once);
  });

  it('on the real roster: no motivated_by, same team, otherwise equivalent', () => {
    const real = readFileSync(path.join(repoRoot, '.architecture', 'members.yml'), 'utf8');
    const seeded = stripInternalProvenance(real);
    assert.ok(!/motivated_by/.test(seeded), 'motivated_by survived');
    assert.ok(!/ADR-\d+/.test(seeded.split('\n').filter(l => l.trim().startsWith('#')).join('\n')),
      'an ADR ref survived in a comment');
    const parsed = parseYaml(seeded);
    assertContainsIds(parsed.members);
    assert.deepStrictEqual(parsed, collapse(parseYaml(real)));
  });
});
