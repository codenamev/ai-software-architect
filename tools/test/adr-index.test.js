import { describe, it } from 'node:test';
import assert from 'node:assert';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { parseAdr, loadAdrIndex, findRelevantAdrs, globToRegExp, tokenize } from '../lib/adr-index.js';

const REPO_ADRS = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '.architecture', 'decisions', 'adrs');

const madr = (status, extra = '', title = 'Use PostgreSQL for storage') =>
  `---\nstatus: ${status}\ndate: 2026-11-01\n${extra}---\n\n# ${title}\n\n## Context\n\nWe need durable storage.\n\n## Decision\n\nPostgres.\n\n## Consequences\n\nOps.\n`;

describe('parseAdr', () => {
  it('reads MADR frontmatter fields and the title', () => {
    const adr = parseAdr('ADR-001-postgres.md', madr('accepted', 'affects: [db/**, "config/database.yml"]\n'));
    assert.strictEqual(adr.id, 'ADR-001');
    assert.strictEqual(adr.title, 'Use PostgreSQL for storage');
    assert.strictEqual(adr.status, 'Accepted');
    assert.strictEqual(adr.date, '2026-11-01');
    assert.deepStrictEqual(adr.affects, ['db/**', 'config/database.yml']);
  });

  it('falls back to a legacy Status section and strips the ADR prefix from the title', () => {
    const adr = parseAdr('ADR-002-x.md', '# ADR-002: Cache layer\n\n## Status\n\n> note\n\nImplemented.\n\n## Context\n');
    assert.strictEqual(adr.title, 'Cache layer');
    assert.strictEqual(adr.status, 'Implemented');
  });

  it('omits absent relations instead of returning empty values', () => {
    const adr = parseAdr('ADR-001-x.md', madr('accepted', 'supersedes: none\n'));
    assert.ok(!('supersedes' in adr));
    assert.ok(!('supersededBy' in adr));
    assert.ok(!('affects' in adr));
  });

  it('ignores files that are not ADR-NNN-slug.md', () => {
    assert.strictEqual(parseAdr('example-caching.md', madr('accepted')), null);
  });
});

describe('findRelevantAdrs', () => {
  const index = [
    parseAdr('ADR-001-postgres.md', madr('superseded', 'superseded-by: ADR-003\naffects: db/**\n')),
    parseAdr('ADR-002-auth.md', madr('accepted', 'affects: app/controllers/**/*_controller.rb\n', 'Session cookies for auth')),
    parseAdr('ADR-003-sqlite.md', madr('accepted', 'supersedes: ADR-001\naffects: db/**\n', 'Use SQLite for storage')),
  ];

  it('ranks title matches above body matches', () => {
    const results = findRelevantAdrs(index, { query: 'which storage engine' });
    // ADR-002 only mentions storage in its body, so it ranks last.
    assert.deepStrictEqual(results.map(r => r.id), ['ADR-001', 'ADR-003', 'ADR-002']);
    assert.ok(results[0].matched.some(m => m.startsWith('title:')));
    assert.deepStrictEqual(results[2].matched, ['body: storage']);
  });

  it('labels a superseded ADR with its successor, never as current', () => {
    const [old] = findRelevantAdrs(index, { query: 'postgresql' });
    assert.strictEqual(old.id, 'ADR-001');
    assert.strictEqual(old.current, false);
    assert.deepStrictEqual(old.supersededBy, ['ADR-003']);
    const current = findRelevantAdrs(index, { query: 'sqlite' })[0];
    assert.strictEqual(current.current, true);
    assert.ok(!('supersededBy' in current));
  });

  it('matches affects globs against a file path', () => {
    const results = findRelevantAdrs(index, { filePath: 'app/controllers/admin/users_controller.rb' });
    assert.deepStrictEqual(results.map(r => r.id), ['ADR-002']);
    assert.deepStrictEqual(results[0].matched, ['affects app/controllers/**/*_controller.rb']);
  });

  it('returns nothing for an empty or stopword-only query with no path', () => {
    assert.deepStrictEqual(findRelevantAdrs(index, {}), []);
    assert.deepStrictEqual(findRelevantAdrs(index, { query: 'how should the' }), []);
  });

  it('respects limit', () => {
    assert.strictEqual(findRelevantAdrs(index, { filePath: 'db/schema.rb', limit: 1 }).length, 1);
  });
});

describe('globToRegExp', () => {
  it('lets ** span directories and keeps * within a segment', () => {
    assert.ok(globToRegExp('db/**').test('db/migrate/001.rb'));
    assert.ok(globToRegExp('**/*.md').test('README.md'));
    assert.ok(globToRegExp('**/*.md').test('docs/a/b.md'));
    assert.ok(!globToRegExp('src/*.js').test('src/lib/a.js'));
    assert.ok(globToRegExp('src/?.js').test('src/a.js'));
  });
});

describe('tokenize', () => {
  it('lowercases, dedupes, and drops short words and stopwords', () => {
    assert.deepStrictEqual(tokenize('How should the MCP server and the MCP skill split?'), ['mcp', 'server', 'skill', 'split']);
  });

  it('folds simple plurals but leaves -ss words and short words alone', () => {
    assert.deepStrictEqual(tokenize('instructions classes access gas'), ['instruction', 'classe', 'access', 'gas']);
  });
});

describe('loadAdrIndex on this repo', () => {
  const index = loadAdrIndex(REPO_ADRS);

  it('parses every ADR with an id, title, and known status', () => {
    assert.ok(index.length >= 10, `only ${index.length} ADRs`);
    for (const adr of index) {
      assert.match(adr.id, /^ADR-\d{3}$/);
      assert.ok(adr.title && adr.title !== adr.filename, `${adr.filename} has no title`);
      assert.ok(['Draft', 'Proposed', 'Accepted', 'Implemented', 'Deprecated', 'Superseded'].includes(adr.status),
        `${adr.filename} status ${adr.status}`);
    }
  });

  it('finds ADR-015 for a question about MCP and skills', () => {
    const ids = findRelevantAdrs(index, { query: 'should this be an MCP tool or a skill' }).map(r => r.id);
    assert.ok(ids.includes('ADR-015'), JSON.stringify(ids));
  });

  it('finds ADR-005 for a plural phrasing of instruction capacity', () => {
    const [top] = findRelevantAdrs(index, { query: 'limits on instructions per context file' });
    assert.strictEqual(top.id, 'ADR-005');
  });

  it('returns an empty list for a missing directory', () => {
    assert.deepStrictEqual(loadAdrIndex(join(REPO_ADRS, 'nope')), []);
  });
});
