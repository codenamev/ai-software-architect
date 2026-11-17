import { existsSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { loadAdrIndex, findRelevantAdrs } from './adr-index.js';

// Pre-edit context: which ADRs govern the file the agent is about to write.
// Advisory only. It names ADRs whose `affects:` globs match the path; it
// never blocks and never judges whether the edit complies.

const ADR_SUBDIR = join('.architecture', 'decisions', 'adrs');

// Walks up from the target file to the nearest directory holding
// .architecture/decisions/adrs, so the hook works whatever the cwd is.
export function findProjectRoot(filePath, fallbackDir) {
  let dir = dirname(resolve(fallbackDir || process.cwd(), filePath));
  for (;;) {
    if (existsSync(join(dir, ADR_SUBDIR))) return dir;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  if (fallbackDir && existsSync(join(fallbackDir, ADR_SUBDIR))) return fallbackDir;
  return null;
}

// Returns { root, rel, adrs } or null when there is nothing to say.
export function adrContextFor(filePath, { cwd, limit = 5 } = {}) {
  if (!filePath) return null;
  const root = findProjectRoot(filePath, cwd);
  if (!root) return null;

  const absolute = isAbsolute(filePath) ? filePath : resolve(cwd || process.cwd(), filePath);
  const rel = relative(root, absolute).split(sep).join('/');
  // Outside the project, or editing the ADRs themselves: no governing ADRs.
  if (!rel || rel.startsWith('../') || rel.startsWith('.architecture/')) return null;

  const index = loadAdrIndex(join(root, ADR_SUBDIR));
  const adrs = findRelevantAdrs(index, { filePath: rel, limit })
    .filter(a => a.matched.some(m => m.startsWith('affects ')));
  if (adrs.length === 0) return null;
  return { root, rel, adrs };
}

export function formatAdrContext({ rel, adrs }) {
  const lines = adrs.map(a => {
    const glob = a.matched.find(m => m.startsWith('affects ')).slice('affects '.length);
    const status = a.status || 'status unknown';
    const tail = a.current
      ? ''
      : ` (superseded${a.supersededBy ? ` by ${a.supersededBy.join(', ')}` : ''}; follow the successor)`;
    return `- ${a.id}: ${a.title} [${status}] via ${glob}, .architecture/decisions/adrs/${a.file}${tail}`;
  });
  return [
    `ADRs whose affects: globs match ${rel}:`,
    ...lines,
    'Matched by path only, not checked against your change. Read the current ones before editing if the change touches what they decide.',
  ].join('\n');
}
