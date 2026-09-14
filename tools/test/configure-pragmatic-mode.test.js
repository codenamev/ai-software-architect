import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { mkdtemp, rm, readFile, writeFile, unlink } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import { ArchitectureServer } from '../../mcp/index.js';

// Regression test for #26: configure_pragmatic_mode used to round-trip
// config.yml through yaml.parse()/yaml.stringify(), which deleted every comment
// in a file that is deliberately self-documenting (and that the tool's own
// success message tells users to hand-edit). These tests pin the contract that
// a configure call changes the scalars it was asked to change and nothing else.

const comments = (text) => text.split('\n').filter((l) => /^\s*#/.test(l));
const commentLines = (text) => comments(text).length;

describe('configure_pragmatic_mode preserves config.yml comments (#26)', () => {
  let dir;
  let server;
  let configPath;
  let seeded;

  before(async () => {
    dir = await mkdtemp(path.join(os.tmpdir(), 'asa-config-'));
    server = new ArchitectureServer();
    await server.setupArchitecture({ projectPath: dir });
    configPath = path.join(dir, '.architecture', 'config.yml');
    seeded = await readFile(configPath, 'utf8');
    assert.ok(commentLines(seeded) > 50, 'fixture must be the comment-heavy canonical config');
  });

  after(async () => { if (dir) await rm(dir, { recursive: true, force: true }); });

  it('changes the requested scalars and keeps every comment line', async () => {
    await server.configurePragmaticMode({ projectPath: dir, enabled: true, intensity: 'strict' });
    const after = await readFile(configPath, 'utf8');

    const cfg = parseYaml(after);
    assert.strictEqual(cfg.pragmatic_mode.enabled, true);
    assert.strictEqual(cfg.pragmatic_mode.intensity, 'strict');

    assert.strictEqual(commentLines(after), commentLines(seeded),
      'configure must not drop (or invent) comment lines');
    // Spot-check a comment the round-trip used to erase, not just the count.
    const firstComment = seeded.split('\n').find((l) => /^\s*#\s*\S/.test(l));
    assert.ok(after.includes(firstComment), `expected comment to survive: ${firstComment}`);
  });

  it('touches only the lines it was asked to change', async () => {
    const before = await readFile(configPath, 'utf8');
    await server.configurePragmaticMode({ projectPath: dir, intensity: 'lenient' });
    const after = await readFile(configPath, 'utf8');

    const changed = before.split('\n').filter((line, i) => line !== after.split('\n')[i]);
    assert.deepStrictEqual(changed.map((l) => l.trim()), ['intensity: strict'],
      `only the intensity line should differ, got: ${JSON.stringify(changed)}`);
    assert.strictEqual(parseYaml(after).pragmatic_mode.intensity, 'lenient');
  });

  it('is a fixed point when called with no changes', async () => {
    const before = await readFile(configPath, 'utf8');
    await server.configurePragmaticMode({ projectPath: dir });
    assert.strictEqual(await readFile(configPath, 'utf8'), before);
  });

  it('seeds from templates/config.yml with its comments when config.yml is missing', async () => {
    await unlink(configPath);
    const template = await readFile(path.join(dir, '.architecture', 'templates', 'config.yml'), 'utf8');

    await server.configurePragmaticMode({ projectPath: dir, enabled: false });
    const created = await readFile(configPath, 'utf8');

    assert.strictEqual(parseYaml(created).pragmatic_mode.enabled, false);
    // Compare comment text in order, not just the count. Trimmed on purpose:
    // the yaml serializer re-indents a comment block that dangles at the end
    // of a nested map (the template has a few), which changes whitespace only.
    assert.deepStrictEqual(comments(created).map((l) => l.trim()), comments(template).map((l) => l.trim()),
      'every template comment must survive the seeding path, in order');
  });

  it('adds a pragmatic_mode section to a config that lacks one, keeping existing content', async () => {
    await writeFile(configPath, '# Team settings\nreview_process:\n  phases: 3 # keep me\n');
    await server.configurePragmaticMode({ projectPath: dir, enabled: true });
    const after = await readFile(configPath, 'utf8');

    const cfg = parseYaml(after);
    assert.strictEqual(cfg.pragmatic_mode.enabled, true);
    assert.strictEqual(cfg.review_process.phases, 3);
    assert.match(after, /# Team settings/);
    assert.match(after, /# keep me/);
  });

  it('refuses to overwrite a config.yml it cannot parse', async () => {
    await writeFile(configPath, 'pragmatic_mode: [unclosed\n');
    await assert.rejects(
      server.configurePragmaticMode({ projectPath: dir, enabled: true }),
      /Cannot parse/,
    );
    assert.strictEqual(await readFile(configPath, 'utf8'), 'pragmatic_mode: [unclosed\n',
      'a parse failure must leave the file untouched');
  });
});
