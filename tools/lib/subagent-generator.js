import { parse as parseYaml } from 'yaml';

const DEFAULT_TOOLS = ['Read', 'Grep', 'Glob', 'Bash'];
const GENERATED_BANNER =
  '<!-- Generated from .architecture/members.yml by tools/lib/subagent-generator.js. Do not edit by hand. -->';

export function generateAll(membersYaml) {
  const doc = parseYaml(membersYaml);
  const members = Array.isArray(doc?.members) ? doc.members : [];
  const seenSlugs = new Map();
  return members
    .filter(m => m && typeof m.id === 'string' && m.id.length > 0)
    .map(member => {
      const result = generateSubagent(member);
      const priorId = seenSlugs.get(result.filename);
      if (priorId !== undefined) {
        throw new Error(
          `Member ids "${priorId}" and "${member.id}" both slug to ${result.filename}; ` +
          'ids must be distinct after slugging or one agent file would silently overwrite the other.'
        );
      }
      seenSlugs.set(result.filename, member.id);
      return result;
    });
}

export function generateSubagent(member) {
  const slug = idToSlug(member.id);
  const filename = `${slug}.md`;

  const triggerKeywords = (member.specialties || []).slice(0, 3).join(', ');
  const description = formatDescription(member.title || member.name, triggerKeywords);

  const tools = (Array.isArray(member.tools) && member.tools.length > 0
    ? member.tools
    : DEFAULT_TOOLS
  ).join(', ');

  const frontmatter = [
    '---',
    `name: ${slug}`,
    `description: ${quoteIfNeeded(description)}`,
    `tools: ${tools}`,
    '---',
  ].join('\n');

  const sections = [
    GENERATED_BANNER,
    '',
    `# ${member.name}${member.title && member.title !== member.name ? ` — ${member.title}` : ''}`,
    '',
    '## Perspective',
    '',
    member.perspective || '',
    '',
    '## Specialties',
    '',
    bulletList(member.specialties),
    '',
    '## Disciplines',
    '',
    bulletList(member.disciplines),
    '',
    '## Skillsets',
    '',
    bulletList(member.skillsets),
    '',
    '## Domains',
    '',
    bulletList(member.domains),
  ];

  // Behavioral fields (#35). All optional: a member that sets none of them
  // renders exactly as before, so existing user members.yml files keep working.
  if (hasItems(member.silent_checklist)) {
    sections.push(
      '',
      '## Silent checklist',
      '',
      'Questions this reviewer asks before reading any further. Answer each one explicitly in the review, even when the answer is "not affected".',
      '',
      bulletList(member.silent_checklist)
    );
  }

  if (hasItems(member.blocking_criteria)) {
    sections.push(
      '',
      '## Blocking criteria',
      '',
      'Any of these makes a finding **critical** and this reviewer will not sign off until it is resolved or explicitly accepted by the maintainer:',
      '',
      bulletList(member.blocking_criteria)
    );
  }

  if (typeof member.signature_tradeoff === 'string' && member.signature_tradeoff.trim().length > 0) {
    sections.push(
      '',
      '## Signature trade-off',
      '',
      `The axis this reviewer habitually trades against the others: ${member.signature_tradeoff.trim()}. Name it when it applies so the aggregated review can record the trade-off rather than an unexplained disagreement.`
    );
  }

  if (member.mode_specific?.active_when) {
    sections.push('', '## Activation', '', `This subagent is most relevant when \`${member.mode_specific.active_when}\` (see \`.architecture/config.yml\`). When that condition is false, prefer the general architecture-review subagent.`);
  }

  sections.push(
    '',
    '## Source of truth',
    '',
    'This file is generated from `.architecture/members.yml`. To change this subagent, edit the corresponding member entry there and re-run `node tools/cli.js generate-subagents`.'
  );

  const content = `${frontmatter}\n\n${sections.join('\n')}\n`;
  return { filename, content };
}

export function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return null;
  const out = {};
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    out[key] = value;
  }
  return out;
}

function idToSlug(id) {
  // Allowlist slug: the id becomes a filename, so path separators, dots, and
  // any other special characters must not survive (a "/" or ".." in an id
  // would make the generated file land outside agents/). An id with nothing
  // usable left is rejected rather than mapped to a placeholder — a
  // traversal-only id is a mistake or an attack, not a member.
  const slug = id.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (!slug) {
    throw new Error(`Member id "${id}" has no characters usable in a filename; use lowercase letters, digits, and underscores.`);
  }
  return slug;
}

function formatDescription(title, triggerKeywords) {
  const keywordHint = triggerKeywords ? ` (keywords: ${triggerKeywords})` : '';
  return `${title} architecture reviewer. Use when the user asks for a ${title.toLowerCase()} review or raises topics in this specialist's domain${keywordHint}.`;
}

function quoteIfNeeded(value) {
  if (/[:#"\\]/.test(value)) return JSON.stringify(value);
  return value;
}

function bulletList(items) {
  if (!Array.isArray(items) || items.length === 0) return '_(none specified)_';
  return items.map(i => `- ${bulletText(i)}`).join('\n');
}

// Behavioral items may carry provenance: `{ text: "...", motivated_by: "ADR-010" }`
// renders as "text (motivated by: ADR-010)". Plain strings render unchanged.
function bulletText(item) {
  if (item && typeof item === 'object' && !Array.isArray(item)) {
    const text = String(item.text ?? item.question ?? item.criterion ?? '').trim();
    const why = typeof item.motivated_by === 'string' ? item.motivated_by.trim() : '';
    return why ? `${text} _(motivated by: ${why})_` : text;
  }
  return String(item);
}

function hasItems(value) {
  return Array.isArray(value) && value.length > 0;
}
