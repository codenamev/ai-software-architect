// mcp/index.js carries a copy of tools/lib/adr-index.js because the npm
// tarball ships index.js alone. This keeps the two from drifting.
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = new URL('../../', import.meta.url);
const read = rel => readFileSync(fileURLToPath(new URL(rel, root)), 'utf8');

describe('adr-index mirror in mcp/index.js', () => {
  it('matches tools/lib/adr-index.js minus imports and export keywords', () => {
    const lib = read('tools/lib/adr-index.js')
      .split('\n').filter(l => !/^import /.test(l)).join('\n')
      .replace(/^export /gm, '').trim();
    const server = read('mcp/index.js');
    const begin = server.indexOf('// BEGIN adr-index');
    const end = server.indexOf('// END adr-index');
    assert.ok(begin !== -1 && end > begin, 'mirror markers missing from mcp/index.js');
    const block = server.slice(begin, end);
    assert.ok(block.includes(lib), 'mcp/index.js adr-index block has drifted from tools/lib/adr-index.js; re-copy it');
  });
});
