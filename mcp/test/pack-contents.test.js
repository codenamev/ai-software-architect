// Pack-contents gate for the published npm package.
//
// The tarball is what every `npx -y ai-software-architect` session starts
// from, and package.json's `files` allowlist is the only thing deciding what
// goes in it. .npmignore used to be the sole guard, and a denylist can only
// name the mistakes it already knows about: a new fixture directory, a stray
// .tgz, a test-*.js that drifts from the pattern, all ship silently.
//
// This test runs the same `npm pack --dry-run` the publish step would and
// asserts the exact file set. Adding a shipped file is a deliberate edit to
// EXPECTED_FILES in the same PR, never a surprise at publish time.

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const MCP_DIR = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const NPM = process.platform === 'win32' ? 'npm.cmd' : 'npm';

// Everything the published package needs: the entrypoint and its README.
// package.json is always included by npm. There is no LICENSE in mcp/ (the
// repo-level one is not packaged), so it is not listed here.
const EXPECTED_FILES = ['README.md', 'index.js', 'package.json'];

async function dryRunPack() {
  const { stdout } = await promisify(execFile)(
    NPM,
    ['pack', '--dry-run', '--json', '--ignore-scripts'],
    { cwd: MCP_DIR, maxBuffer: 10 * 1024 * 1024 }
  );
  const [result] = JSON.parse(stdout);
  return result;
}

describe('npm pack contents', () => {
  it('ships exactly the allowlisted files', async () => {
    const result = await dryRunPack();
    const shipped = result.files.map((f) => f.path).sort();
    assert.deepStrictEqual(shipped, [...EXPECTED_FILES].sort());
  });

  it('never ships tests, lockfile, node_modules or tarballs', async () => {
    const result = await dryRunPack();
    const leaked = result.files
      .map((f) => f.path)
      .filter((p) =>
        p.startsWith('test/') ||
        p.startsWith('node_modules/') ||
        p === 'package-lock.json' ||
        p.endsWith('.tgz') ||
        p.endsWith('.test.js')
      );
    assert.deepStrictEqual(leaked, []);
  });

  it('declares a files allowlist in package.json', async () => {
    const { default: pkg } = await import(path.join(MCP_DIR, 'package.json'), {
      with: { type: 'json' },
    });
    assert.ok(Array.isArray(pkg.files) && pkg.files.length > 0,
      'package.json must carry a non-empty "files" allowlist');
    assert.ok(pkg.files.includes('index.js'), 'files must include the entrypoint');
  });
});
