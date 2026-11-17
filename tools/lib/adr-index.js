import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

// Read-side index over .architecture/decisions/adrs. Agents can create ADRs
// through the MCP server; this is what lets them find the ones that govern
// the code they are about to touch.
//
// Matching is deliberately plain: keywords against title and body, plus
// optional `affects:` globs against a file path. No embeddings.

const ADR_FILE = /^ADR-(\d{3})-[a-z0-9-]+\.md$/;
const ADR_REF = /^ADR-\d{3}$/;
const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/;
const STOPWORDS = new Set([
  'the', 'and', 'for', 'with', 'that', 'this', 'from', 'into', 'are', 'was', 'were',
  'how', 'what', 'when', 'where', 'which', 'who', 'why', 'should', 'would', 'could',
  'does', 'did', 'can', 'use', 'using', 'about', 'our', 'its', 'not', 'any', 'all',
  'per', 'many', 'much', 'some', 'there', 'they', 'them', 'than', 'then', 'have', 'has',
]);

export function parseAdr(filename, content) {
  const match = filename.match(ADR_FILE);
  if (!match) return null;

  const fm = parseFrontmatter(content);
  const body = fm ? content.slice(content.match(FRONTMATTER)[0].length) : content;
  const titleLine = body.match(/^#\s+(.+)$/m);
  const title = titleLine ? titleLine[1].replace(/^ADR-\d{3}:\s*/, '').trim() : filename;

  return compact({
    id: `ADR-${match[1]}`,
    filename,
    title,
    status: normalizeStatus((fm && fm.status) || sectionStatus(body)),
    date: fm && fm.date ? fm.date : undefined,
    supersedes: refList(fm && fm.supersedes),
    supersededBy: refList(fm && fm['superseded-by']),
    affects: list(fm && fm.affects),
    body,
  });
}

export function loadAdrIndex(adrDir) {
  if (!existsSync(adrDir)) return [];
  return readdirSync(adrDir)
    .filter(f => ADR_FILE.test(f))
    .sort()
    .map(f => parseAdr(f, readFileSync(join(adrDir, f), 'utf8')))
    .filter(Boolean);
}

// Returns ADRs ranked by relevance to a question and/or a file path.
// A superseded ADR is never presented as current: it comes back with
// `current: false` and its successor ids, so the agent follows the chain.
export function findRelevantAdrs(index, { query = '', filePath = '', limit = 5 } = {}) {
  const terms = tokenize(query);
  if (terms.length === 0 && !filePath) return [];

  // A term every ADR mentions ("claude" in this repo) says little about
  // which one governs; weight terms by how rare they are across the index.
  const idf = new Map(terms.map(t => {
    const df = index.filter(a => `${a.title}\n${a.body}`.toLowerCase().includes(t)).length;
    return [t, Math.log(1 + index.length / Math.max(df, 1))];
  }));

  const results = [];
  for (const adr of index) {
    const reasons = [];
    let score = 0;

    if (filePath && adr.affects) {
      const glob = adr.affects.find(g => globToRegExp(g).test(normalizePath(filePath)));
      if (glob) {
        score += 10;
        reasons.push(`affects ${glob}`);
      }
    }

    if (terms.length > 0) {
      const title = adr.title.toLowerCase();
      const body = adr.body.toLowerCase();
      const titleHits = terms.filter(t => title.includes(t));
      const bodyHits = terms.filter(t => !titleHits.includes(t) && body.includes(t));
      const weight = t => idf.get(t);
      score += titleHits.reduce((s, t) => s + 3 * weight(t), 0) + bodyHits.reduce((s, t) => s + weight(t), 0);
      if (titleHits.length) reasons.push(`title: ${titleHits.join(', ')}`);
      if (bodyHits.length) reasons.push(`body: ${bodyHits.join(', ')}`);
    }

    if (score === 0) continue;
    const superseded = adr.status === 'Superseded' || Boolean(adr.supersededBy);
    results.push(compact({
      id: adr.id,
      title: adr.title,
      status: adr.status,
      date: adr.date,
      file: adr.filename,
      current: !superseded,
      supersededBy: adr.supersededBy,
      supersedes: adr.supersedes,
      matched: reasons,
      score: Math.round(score * 100) / 100,
    }));
  }

  return results
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
    .slice(0, limit);
}

export function tokenize(text) {
  const seen = new Set();
  for (const word of String(text).toLowerCase().split(/[^a-z0-9]+/)) {
    if (word.length < 3 || STOPWORDS.has(word)) continue;
    // Crude plural fold so "instructions" still finds "Instruction Capacity";
    // terms are matched as substrings, so the singular covers both.
    seen.add(word.length > 4 && /[^s]s$/.test(word) ? word.slice(0, -1) : word);
  }
  return [...seen];
}

// Minimal glob: `**` spans directories, `*` and `?` stay within one segment.
export function globToRegExp(glob) {
  let re = '';
  const g = normalizePath(glob);
  for (let i = 0; i < g.length; i++) {
    const c = g[i];
    if (c === '*' && g[i + 1] === '*') {
      i++;
      if (g[i + 1] === '/') {
        i++;
        re += '(?:.*/)?';
      } else {
        re += '.*';
      }
    } else if (c === '*') {
      re += '[^/]*';
    } else if (c === '?') {
      re += '[^/]';
    } else {
      re += c.replace(/[.+^${}()|[\]\\]/g, '\\$&');
    }
  }
  return new RegExp(`^${re}$`);
}

function normalizePath(p) {
  return String(p).replace(/\\/g, '/').replace(/^\.\//, '');
}

function parseFrontmatter(content) {
  const match = content.match(FRONTMATTER);
  if (!match) return null;
  const fields = {};
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (field) fields[field[1].toLowerCase()] = field[2].trim().replace(/^(['"])(.*)\1$/, '$2');
  }
  return fields;
}

function sectionStatus(body) {
  const match = body.match(/^##\s+Status\s*$([\s\S]*?)(?=^##\s+|(?![\s\S]))/m);
  if (!match) return undefined;
  for (const raw of match[1].split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('>') || (line.startsWith('[') && line.endsWith(']'))) continue;
    return line.split(/\s+/)[0].replace(/[.,;:!?*]+$/, '');
  }
  return undefined;
}

const STATUSES = ['Draft', 'Proposed', 'Accepted', 'Implemented', 'Deprecated', 'Superseded'];
function normalizeStatus(raw) {
  if (!raw) return undefined;
  const word = raw.split(/\s+/)[0].replace(/[^A-Za-z]/g, '');
  return STATUSES.find(s => s.toLowerCase() === word.toLowerCase()) || raw;
}

function list(raw) {
  if (!raw || /^(none|null|~)$/i.test(raw)) return undefined;
  const items = raw.replace(/^\[|\]$/g, '').split(',')
    .map(s => s.trim().replace(/^(['"])(.*)\1$/, '$2'))
    .filter(Boolean);
  return items.length ? items : undefined;
}

function refList(raw) {
  const refs = (list(raw) || []).filter(r => ADR_REF.test(r));
  return refs.length ? refs : undefined;
}

// Drop undefined fields so a missing relation reads as absent, never as
// "checked, none".
function compact(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));
}
