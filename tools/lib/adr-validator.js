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

const ADR_REF_PATTERN = /^ADR-\d{3}$/;

// Cross-file check for MADR supersession links. A newer ADR declares
// "supersedes: ADR-NNN" in its frontmatter; the older one must carry
// "superseded-by:" pointing back and "status: superseded". Either side
// alone is an error, so a half-recorded supersession can't pass review.
// Takes [{ filename, content }]; returns Map<filename, string[]> of errors.
export function validateSupersession(adrs) {
  const byId = new Map();
  for (const adr of adrs) {
    const id = adrId(adr.filename);
    if (id) byId.set(id, { ...adr, id, frontmatter: frontmatterOf(adr.content) });
  }

  const errors = new Map();
  const report = (filename, message) => {
    if (!errors.has(filename)) errors.set(filename, []);
    errors.get(filename).push(message);
  };

  for (const adr of byId.values()) {
    const fm = adr.frontmatter;
    for (const target of refList(fm.supersedes, 'supersedes', adr, report)) {
      const old = byId.get(target);
      if (!old) {
        report(adr.filename, `supersedes: ${target} does not match any ADR file.`);
        continue;
      }
      const backLinks = refList(old.frontmatter['superseded-by'], null);
      if (!backLinks.includes(adr.id)) {
        report(adr.filename, `supersedes: ${target}, but ${target} has no "superseded-by: ${adr.id}".`);
      }
      if ((old.frontmatter.status || '').split(/\s+/)[0].toLowerCase() !== 'superseded') {
        report(adr.filename, `supersedes: ${target}, but ${target} status is not "superseded".`);
      }
    }

    const successors = refList(fm['superseded-by'], 'superseded-by', adr, report);
    for (const target of successors) {
      const successor = byId.get(target);
      if (!successor) {
        report(adr.filename, `superseded-by: ${target} does not match any ADR file.`);
      } else if (!refList(successor.frontmatter.supersedes, null).includes(adr.id)) {
        report(adr.filename, `superseded-by: ${target}, but ${target} has no "supersedes: ${adr.id}".`);
      }
    }
    if (successors.length > 0 && (fm.status || '').split(/\s+/)[0].toLowerCase() !== 'superseded') {
      report(adr.filename, `superseded-by is set but status is "${fm.status || ''}"; expected "superseded".`);
    }
  }

  return errors;
}

function adrId(filename) {
  const match = filename.match(/^(ADR-\d{3})-/);
  return match ? match[1] : null;
}

function frontmatterOf(content) {
  if (!(content.startsWith('---\n') || content.startsWith('---\r\n'))) return {};
  return parseFrontmatter(content) || {};
}

// Parses "ADR-001" or "ADR-001, ADR-002" (optionally bracketed). With a
// field name, malformed entries are reported; without one they're dropped.
function refList(raw, field, adr, report) {
  if (raw === undefined || raw === '' || /^(none|null|~)$/i.test(raw)) return [];
  const refs = [];
  for (const part of raw.replace(/^\[|\]$/g, '').split(',')) {
    const ref = part.trim().replace(/^(['"])(.*)\1$/, '$2');
    if (ADR_REF_PATTERN.test(ref)) refs.push(ref);
    else if (field) report(adr.filename, `${field}: "${ref}" is not an ADR reference (expected ADR-NNN).`);
  }
  return refs;
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
