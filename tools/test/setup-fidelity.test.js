import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { mkdtemp, rm, writeFile, readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import { ArchitectureServer, renderAdrFromTemplate } from '../../mcp/index.js';
import { validateAdr } from '../lib/adr-validator.js';

const CANONICAL_IDS = [
  'systems_architect', 'domain_expert', 'security_specialist', 'maintainability_expert',
  'performance_specialist', 'implementation_strategist', 'ai_engineer', 'pragmatic_enforcer',
];

// Integration test for ADR-016: run the real MCP setup against a polyglot fixture
// and assert the install is faithful and usable (canonical team + dispatchable
// subagents + pragmatic config + correct principles location + unmasked stack).
describe('Setup fidelity (ADR-016) — setup_architecture end-to-end', () => {
  let dir;

  before(async () => {
    dir = await mkdtemp(path.join(os.tmpdir(), 'asa-setup-'));
    // Polyglot fixture: Rails (Gemfile) + Express (package.json) — the dogfood case.
    await writeFile(path.join(dir, 'package.json'),
      JSON.stringify({ name: 'demo', dependencies: { express: '^4.18.0' } }));
    await writeFile(path.join(dir, 'Gemfile'),
      "source 'https://rubygems.org'\ngem 'rails', '~> 7.1'\ngem 'sqlite3'\n");
    await new ArchitectureServer().setupArchitecture({ projectPath: dir });
  });

  after(async () => { if (dir) await rm(dir, { recursive: true, force: true }); });

  it('seeds exactly the canonical team (no drift, no extras)', async () => {
    const doc = parseYaml(await readFile(path.join(dir, '.architecture/members.yml'), 'utf8'));
    const ids = doc.members.map(m => m.id).sort();
    // No advisors are appended initially, so the roster must equal the canonical
    // 8 EXACTLY — this catches both omissions and a wrong-id member sneaking in.
    assert.deepStrictEqual(ids, [...CANONICAL_IDS].sort());
    assert.ok(!ids.includes('security_architect'), 'drifted security_architect must be gone');
  });

  it('generates dispatchable subagents, including pragmatic-enforcer', async () => {
    const agents = await readdir(path.join(dir, 'agents'));
    assert.ok(agents.includes('pragmatic-enforcer.md'), 'pragmatic-enforcer subagent must exist');
    assert.ok(agents.length >= CANONICAL_IDS.length, `expected >=8 subagents, got ${agents.length}`);
  });

  it('writes principles to the canonical path, not the mislocated decisions/ path', () => {
    assert.ok(existsSync(path.join(dir, '.architecture/principles.md')), 'canonical principles.md missing');
    assert.ok(!existsSync(path.join(dir, '.architecture/decisions/principles.md')),
      'mislocated decisions/principles.md must not be created');
  });

  it('seeds a config.yml carrying pragmatic_mode', async () => {
    const cfg = await readFile(path.join(dir, '.architecture/config.yml'), 'utf8');
    assert.match(cfg, /pragmatic_mode/);
  });

  it('detects all frameworks (Rails not masked by Express)', async () => {
    const analysis = await readFile(path.join(dir, '.architecture/reviews/initial-system-analysis.md'), 'utf8');
    assert.match(analysis, /Rails/, 'Rails should be detected');
    assert.match(analysis, /Express/, 'Express should be detected');
  });

  it('CLAUDE.md integration points at the canonical principles path', async () => {
    const claudeMd = await readFile(path.join(dir, 'CLAUDE.md'), 'utf8');
    assert.match(claudeMd, /\.architecture\/principles\.md/, 'must reference canonical principles.md');
    assert.ok(!claudeMd.includes('.architecture/decisions/principles.md'),
      'must not reference the mislocated decisions/principles.md path (ADR-016)');
  });

  it('does not copy any node_modules into the target', () => {
    assert.ok(!existsSync(path.join(dir, '.architecture-temp')), 'temp clone must be cleaned up');
    assert.ok(!existsSync(path.join(dir, '.architecture', 'node_modules')),
      'node_modules must never land in the installed .architecture');
  });

  it('createADR slugifies unsafe characters out of the filename', async () => {
    await new ArchitectureServer().createADR({
      title: 'Use REST/GraphQL: hybrid?',
      context: 'ctx', decision: 'dec', consequences: 'conseq',
      projectPath: dir,
    });
    const adrs = await readdir(path.join(dir, '.architecture/decisions/adrs'));
    const created = adrs.find(f => f.includes('use-rest-graphql'));
    assert.ok(created, `expected a slugified ADR filename, got: ${adrs.join(', ')}`);
    // The documented filename contract (mcp/README.md, create-adr skill,
    // tools/lib/adr-validator.js) is ADR-XXX-slug.md; the tool used to emit a
    // bare 0001-slug.md that its own validator rejected.
    assert.match(created, /^ADR-\d{3}-use-rest-graphql-hybrid\.md$/);
  });

  it('createADR renders the canonical template and passes the ADR validator', async () => {
    await new ArchitectureServer().createADR({
      title: 'Adopt PostgreSQL',
      context: 'CTX-MARKER need ACID', decision: 'DEC-MARKER adopt PG 15', consequences: 'CONSEQ-MARKER needs PG expertise',
      projectPath: dir,
    });
    const adrs = await readdir(path.join(dir, '.architecture/decisions/adrs'));
    const created = adrs.find(f => f.includes('adopt-postgresql'));
    const content = await readFile(path.join(dir, '.architecture/decisions/adrs', created), 'utf8');

    const result = validateAdr(created, content);
    assert.ok(result.valid, `validator rejected the tool's own output: ${result.errors.join(' | ')}`);

    // Template-derived structure, not the old hand-rolled Status/Context/Decision/Consequences/Date shape.
    assert.match(content, /^# ADR-\d{3}: Adopt PostgreSQL$/m);
    assert.match(content, /^## Decision Drivers$/m, 'template sections must survive');
    assert.match(content, /^## Alternatives Considered$/m, 'template sections must survive');
    assert.match(content, /^### Positive$/m, 'Consequences sub-structure must survive');
    for (const marker of ['CTX-MARKER', 'DEC-MARKER', 'CONSEQ-MARKER']) {
      assert.ok(content.includes(marker), `${marker} missing from rendered ADR`);
    }
    assert.ok(!content.includes('[Title]'), 'H1 placeholder must be filled');
    assert.ok(!/^\[Draft \| Proposed/m.test(content), 'Status placeholder must be filled');
  });

  it('createADR numbers sequentially across both filename styles', async () => {
    const adrsDir = path.join(dir, '.architecture/decisions/adrs');
    // A legacy file from the pre-fix tool (0001-slug.md) and a documented-style
    // file must both count, so an upgraded project never restarts at 001.
    await writeFile(path.join(adrsDir, '0040-legacy-numbered.md'), '# ADR 40: legacy\n\n## Status\n\nAccepted\n');
    await new ArchitectureServer().createADR({
      title: 'After legacy', context: 'c', decision: 'd', consequences: 'q', projectPath: dir,
    });
    const adrs = await readdir(adrsDir);
    assert.ok(adrs.includes('ADR-041-after-legacy.md'), `expected ADR-041, got: ${adrs.join(', ')}`);
  });

  it('installs only the canonical templates (no hardcoded adr.md/review.md pair)', async () => {
    const templates = await readdir(path.join(dir, '.architecture/templates'));
    assert.ok(templates.includes('adr-template.md'), 'canonical adr-template.md missing');
    assert.ok(templates.includes('review-template.md'), 'canonical review-template.md missing');
    assert.ok(!templates.includes('adr.md'), 'hardcoded adr.md must not be written alongside the canonical template');
    assert.ok(!templates.includes('review.md'), 'hardcoded review.md must not be written alongside the canonical template');
  });

  it('installs the canonical .coding-assistants content, not empty directories', () => {
    for (const rel of [
      '.coding-assistants/cursor/ai_software_architect_setup.mdc',
      '.coding-assistants/cursor/README.md',
      '.coding-assistants/codex/setup-instructions.md',
      '.coding-assistants/claude/CLAUDE.md',
    ]) {
      assert.ok(existsSync(path.join(dir, rel)), `${rel} missing from install`);
    }
    // Nested READMEs the installed docs link to must not be filtered out by the
    // root-docs exclusion (AGENTS.md links .coding-assistants/cursor/README.md).
    assert.ok(existsSync(path.join(dir, '.architecture/agent_docs/README.md')), 'agent_docs/README.md missing');
    // The exclusion still applies to the framework's own top-level docs.
    assert.ok(!existsSync(path.join(dir, '.architecture-temp')), 'temp clone must be cleaned up');
  });
});

describe('renderAdrFromTemplate', () => {
  const tpl = [
    '# ADR-XXX: [Title]', '', '## Status', '', '[Draft | Proposed]', '', 'If superseded, link: [x]', '',
    '## Context', '', '[Describe the context]', '', '## Decision', '', '[Describe the decision]', '',
    '**Affected:**', '* [c1]', '', '## Consequences', '', '### Positive', '', '* [p1]', '', '## References', '', '* [r]', '',
  ].join('\n');
  const fields = { number: 3, title: 'T', context: 'CTX', decision: 'DEC', consequences: 'CONSEQ', date: '2026-01-01' };

  it('fills the leading placeholder of each known section and keeps the rest', () => {
    const out = renderAdrFromTemplate(tpl, fields);
    assert.match(out, /^# ADR-003: T$/m);
    assert.match(out, /^## Status\n\nProposed\n\n\*\*Date\*\*: 2026-01-01\n\n## Context/m);
    assert.match(out, /^## Context\n\nCTX\n\n## Decision/m);
    assert.match(out, /^## Decision\n\nDEC\n\n\*\*Affected:\*\*/m, 'sub-structure after the placeholder stays');
    assert.match(out, /^## Consequences\n\nCONSEQ\n\n### Positive/m, 'a section with no leading placeholder gets the value prepended');
    assert.match(out, /^## References\n\n\* \[r\]/m, 'untouched sections keep their placeholders');
  });

  it('appends any targeted section a customized template lacks, so no field is dropped silently', () => {
    // A user's adr-template.md that renamed "## Decision" to "## Decision Outcome"
    // (MADR style) and dropped Consequences: the caller's text must still land,
    // and the result must still satisfy validate-adr's required sections.
    const custom = '# ADR-XXX: [Title]\n\n## Status\n\n[x]\n\n## Context\n\n[c]\n\n## Decision Outcome\n\n[d]\n';
    const out = renderAdrFromTemplate(custom, fields);
    assert.match(out, /^## Decision Outcome\n\n\[d\]/m, 'unrelated custom sections are left alone');
    assert.match(out, /^## Decision\n\nDEC\n/m, 'missing Decision section is appended with the value');
    assert.match(out, /^## Consequences\n\nCONSEQ\n/m, 'missing Consequences section is appended with the value');
    assert.ok(validateAdr('ADR-003-t.md', out).valid, 'rendered output must satisfy the validator');
  });

  it('prepends the H1 when a customized template has none', () => {
    const out = renderAdrFromTemplate('## Status\n\n[x]\n\n## Context\n\n[c]\n\n## Decision\n\n[d]\n\n## Consequences\n\n[q]\n', fields);
    assert.ok(out.startsWith('# ADR-003: T\n\n## Status'), `got: ${JSON.stringify(out.slice(0, 40))}`);
  });
});
