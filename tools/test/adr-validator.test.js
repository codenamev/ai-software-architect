import { describe, it } from 'node:test';
import assert from 'node:assert';
import { validateAdr } from '../lib/adr-validator.js';

const VALID_ADR = `# ADR-001: Use PostgreSQL

## Status

Accepted

## Context

We need a relational database.

## Decision

Use PostgreSQL.

## Consequences

Positive: mature ecosystem.
`;

describe('ADR Validator', () => {
  describe('filename validation', () => {
    it('accepts ADR-001-kebab-case-title.md', () => {
      const result = validateAdr('ADR-001-use-postgresql.md', VALID_ADR);
      assert.strictEqual(result.valid, true, JSON.stringify(result.errors));
    });

    it('accepts three-digit numbering up to ADR-999', () => {
      const result = validateAdr('ADR-042-pick-something.md', VALID_ADR);
      assert.strictEqual(result.valid, true);
    });

    it('rejects two-digit numbering (ADR-1-foo.md)', () => {
      const result = validateAdr('ADR-1-foo.md', VALID_ADR);
      assert.strictEqual(result.valid, false);
      assert.ok(result.errors.some(e => e.includes('filename')));
    });

    it('rejects uppercase or non-kebab-case slugs', () => {
      const result = validateAdr('ADR-001-UseCamelCase.md', VALID_ADR);
      assert.strictEqual(result.valid, false);
      assert.ok(result.errors.some(e => e.includes('filename')));
    });

    it('rejects missing slug (ADR-001.md)', () => {
      const result = validateAdr('ADR-001.md', VALID_ADR);
      assert.strictEqual(result.valid, false);
    });

    it('rejects non-ADR filenames', () => {
      const result = validateAdr('proposal-001.md', VALID_ADR);
      assert.strictEqual(result.valid, false);
    });

    it('skips filename rule for example files', () => {
      const result = validateAdr('example-pragmatic-caching-layer.md', VALID_ADR);
      assert.strictEqual(result.valid, true, JSON.stringify(result.errors));
    });
  });

  describe('required sections', () => {
    it('requires a Status section', () => {
      const noStatus = VALID_ADR.replace('## Status\n\nAccepted\n\n', '');
      const result = validateAdr('ADR-001-foo.md', noStatus);
      assert.strictEqual(result.valid, false);
      assert.ok(result.errors.some(e => e.includes('Status')));
    });

    it('requires a Context section', () => {
      const noContext = VALID_ADR.replace(
        '## Context\n\nWe need a relational database.\n\n',
        ''
      );
      const result = validateAdr('ADR-001-foo.md', noContext);
      assert.strictEqual(result.valid, false);
      assert.ok(result.errors.some(e => e.includes('Context')));
    });

    it('requires a Decision section', () => {
      const noDecision = VALID_ADR.replace('## Decision\n\nUse PostgreSQL.\n\n', '');
      const result = validateAdr('ADR-001-foo.md', noDecision);
      assert.strictEqual(result.valid, false);
      assert.ok(result.errors.some(e => e.includes('Decision')));
    });

    it('requires a Consequences section', () => {
      const noConsequences = VALID_ADR.replace(
        '## Consequences\n\nPositive: mature ecosystem.\n',
        ''
      );
      const result = validateAdr('ADR-001-foo.md', noConsequences);
      assert.strictEqual(result.valid, false);
      assert.ok(result.errors.some(e => e.includes('Consequences')));
    });
  });

  describe('status enum', () => {
    const validStatuses = ['Draft', 'Proposed', 'Accepted', 'Implemented', 'Deprecated', 'Superseded'];

    for (const status of validStatuses) {
      it(`accepts status "${status}"`, () => {
        const content = VALID_ADR.replace('Accepted', status);
        const result = validateAdr('ADR-001-foo.md', content);
        assert.strictEqual(result.valid, true, JSON.stringify(result.errors));
      });
    }

    it('rejects unknown status values', () => {
      const content = VALID_ADR.replace('Accepted', 'Pending Review');
      const result = validateAdr('ADR-001-foo.md', content);
      assert.strictEqual(result.valid, false);
      assert.ok(result.errors.some(e => e.toLowerCase().includes('status')));
    });

    it('reports first matching status line, ignoring trailing punctuation', () => {
      const content = VALID_ADR.replace('Accepted', 'Accepted.');
      const result = validateAdr('ADR-001-foo.md', content);
      assert.strictEqual(result.valid, true);
    });
  });

  describe('MADR frontmatter', () => {
    const MADR_ADR = `---\nstatus: accepted\ndate: 2026-10-26\ndecision-makers: [Val]\n---\n\n${VALID_ADR.replace('## Status\n\nAccepted\n\n', '')}`;

    it('accepts frontmatter status without a Status section', () => {
      const result = validateAdr('ADR-001-foo.md', MADR_ADR);
      assert.deepStrictEqual(result, { valid: true, errors: [] });
    });

    it('accepts frontmatter and a Status section that agree', () => {
      const both = `---\nstatus: "Accepted"\n---\n\n${VALID_ADR}`;
      const result = validateAdr('ADR-001-foo.md', both);
      assert.strictEqual(result.valid, true, JSON.stringify(result.errors));
    });

    it('rejects frontmatter and a Status section that disagree', () => {
      const both = `---\nstatus: proposed\n---\n\n${VALID_ADR}`;
      const result = validateAdr('ADR-001-foo.md', both);
      assert.strictEqual(result.valid, false);
      assert.ok(result.errors.some(e => e.includes('disagrees')));
    });

    it('rejects an invalid frontmatter status', () => {
      const result = validateAdr('ADR-001-foo.md', MADR_ADR.replace('status: accepted', 'status: pending'));
      assert.strictEqual(result.valid, false);
      assert.ok(result.errors.some(e => e.includes('Frontmatter status')));
    });

    it('requires a status when frontmatter has none and no Status section exists', () => {
      const result = validateAdr('ADR-001-foo.md', MADR_ADR.replace('status: accepted\n', ''));
      assert.strictEqual(result.valid, false);
      assert.ok(result.errors.some(e => e.includes('Missing status')));
    });

    it('rejects unclosed frontmatter', () => {
      const result = validateAdr('ADR-001-foo.md', `---\nstatus: accepted\n\n${VALID_ADR}`);
      assert.strictEqual(result.valid, false);
      assert.ok(result.errors.some(e => e.toLowerCase().includes('frontmatter')));
    });
  });

  describe('aggregate behavior', () => {
    it('returns valid:true with empty errors for a fully valid ADR', () => {
      const result = validateAdr('ADR-001-use-postgresql.md', VALID_ADR);
      assert.deepStrictEqual(result, { valid: true, errors: [] });
    });

    it('aggregates multiple errors into a single result', () => {
      const broken = '# Just a heading\n';
      const result = validateAdr('ADR-1-bad.md', broken);
      assert.strictEqual(result.valid, false);
      assert.ok(result.errors.length >= 4, `expected >= 4 errors, got ${result.errors.length}`);
    });
  });
});
