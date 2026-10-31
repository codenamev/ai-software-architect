const FILENAME_PATTERN = /^ADR-\d{3}-[a-z0-9-]+\.md$/;
const EXAMPLE_PREFIX = 'example-';
const BODY_SECTIONS = ['Context', 'Decision', 'Consequences'];
const VALID_STATUSES = ['Draft', 'Proposed', 'Accepted', 'Implemented', 'Deprecated', 'Superseded'];
const FRONTMATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/;

// ADRs follow MADR 4.0: optional YAML frontmatter (status, date, decision-makers)
// is canonical for status. A legacy "## Status" section is still accepted; when
// both are present they must agree.
export function validateAdr(filename, content) {
  const errors = [];

  if (!filename.startsWith(EXAMPLE_PREFIX) && !FILENAME_PATTERN.test(filename)) {
    errors.push(
      `Invalid filename "${filename}". Expected ADR-XXX-kebab-case-title.md (three digits, lowercase slug).`
    );
  }

  let frontmatter = null;
  if (content.startsWith('---\n') || content.startsWith('---\r\n')) {
    frontmatter = parseFrontmatter(content);
    if (frontmatter === null) {
      errors.push('YAML frontmatter is not closed; add a "---" line after the last field.');
    }
  }

  for (const section of BODY_SECTIONS) {
    if (!hasSection(content, section)) {
      errors.push(`Missing required section: "## ${section}".`);
    }
  }

  const frontmatterStatus = frontmatter && 'status' in frontmatter
    ? checkStatus(frontmatter.status, 'Frontmatter status', errors, { ignoreCase: true })
    : undefined;
  const sectionStatus = hasSection(content, 'Status')
    ? checkStatus(extractStatus(content), 'Status section', errors)
    : undefined;

  if (frontmatterStatus === undefined && sectionStatus === undefined) {
    errors.push('Missing status: add "status:" to the frontmatter or a "## Status" section.');
  } else if (frontmatterStatus && sectionStatus && frontmatterStatus !== sectionStatus) {
    errors.push(
      `Frontmatter status "${frontmatterStatus}" disagrees with Status section "${sectionStatus}".`
    );
  }

  return { valid: errors.length === 0, errors };
}

function parseFrontmatter(content) {
  const match = content.match(FRONTMATTER_PATTERN);
  if (!match) return null;
  const fields = {};
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (field) fields[field[1].toLowerCase()] = field[2].trim().replace(/^(['"])(.*)\1$/, '$2');
  }
  return fields;
}

// Returns the canonical status name, or null (after recording an error) when invalid.
// MADR writes frontmatter status in lowercase, so only that source ignores case.
function checkStatus(raw, label, errors, { ignoreCase = false } = {}) {
  if (raw === null || raw === '') {
    errors.push(`${label} is empty. Expected one of: ${VALID_STATUSES.join(', ')}.`);
    return null;
  }
  const word = raw.split(/\s+/)[0];
  const canonical = VALID_STATUSES.find(s =>
    ignoreCase ? s.toLowerCase() === word.toLowerCase() : s === word
  );
  if (!canonical) {
    errors.push(`Invalid ${label} "${word}". Expected one of: ${VALID_STATUSES.join(', ')}.`);
    return null;
  }
  return canonical;
}

function hasSection(content, name) {
  const heading = new RegExp(`^##\\s+${escapeRegExp(name)}\\s*$`, 'm');
  return heading.test(content);
}

function extractStatus(content) {
  const match = content.match(/^##\s+Status\s*$([\s\S]*?)(?=^##\s+|\Z)/m);
  if (!match) return null;
  const body = match[1];
  for (const rawLine of body.split(/\r?\n/)) {
    const line = rawLine.trim().replace(/[.,;:!?]+$/, '');
    if (!line) continue;
    if (line.startsWith('[') && line.endsWith(']')) continue;
    return line.split(/\s+/)[0];
  }
  return null;
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
