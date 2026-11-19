/**
 * Roster validation for setup (ADR-016).
 *
 * Setup copies the framework's canonical `members.yml` into the target project.
 * This guards against a failed/partial/drifted copy by asserting the seeded
 * roster contains the known canonical core team — a fixed contract, NOT derived
 * from the copy itself (deriving it from the copy would pass vacuously when the
 * source is itself drifted).
 *
 * The canonical id list is contract data; the `roster-seeding` unit test pins it
 * against the real `.architecture/members.yml`, so the two cannot silently drift.
 *
 * Pure functions; file IO stays in the caller.
 */

/** The canonical core architecture team (ADR-016). Setup must seed all of these. */
export const CANONICAL_MEMBER_IDS = [
  'systems_architect',
  'domain_expert',
  'security_specialist',
  'maintainability_expert',
  'performance_specialist',
  'implementation_strategist',
  'ai_engineer',
  'pragmatic_enforcer',
];

/**
 * Fail closed if any required (canonical) id is absent from the roster.
 * Detects a failed/partial/drifted framework copy before setup proceeds.
 *
 * @param {Array<{id: string}>} members
 * @param {string[]} [requiredIds] - defaults to the canonical contract
 * @returns {true} when all present
 * @throws when any required id is missing
 */
export function assertContainsIds(members, requiredIds = CANONICAL_MEMBER_IDS) {
  const present = new Set((Array.isArray(members) ? members : []).map(m => m && m.id));
  const missing = (requiredIds || []).filter(id => !present.has(id));
  if (missing.length > 0) {
    throw new Error(`Roster is missing canonical members: ${missing.join(', ')}`);
  }
  return true;
}

/**
 * Strip framework-internal provenance from a members.yml before seeding it
 * into a user project.
 *
 * The framework's own roster records why each checklist item exists
 * (`motivated_by: "ADR-016; ..."`, `#30`, ...). Those refs point at this
 * repo's ADRs and issues, which don't exist in the target project, so a seeded
 * copy would cite decisions the user can't read. This collapses every
 * `- text: "..."` + `motivated_by: "..."` item to a plain `- "..."` string and
 * drops the explanatory comment that documents the field. Everything else
 * (other keys, comments, ordering, formatting) passes through byte-for-byte.
 *
 * Line-based on purpose: a YAML round-trip would reflow the file and lose its
 * comments. Items with keys other than text/motivated_by are left alone.
 *
 * @param {string} yamlText
 * @returns {string}
 */
export function stripInternalProvenance(yamlText) {
  const lines = yamlText.split('\n');
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Drop the comment block that documents motivated_by (references ADR-010).
    if (/^\s*#.*\bADR-\d+\b.*Silent Checklist/.test(line)) {
      if (i + 1 < lines.length && /^\s*#.*motivated_by/.test(lines[i + 1])) i++;
      continue;
    }

    const item = line.match(/^(\s*)- text: (.*)$/);
    if (item) {
      const [, indent, value] = item;
      const childIndent = indent + '  ';
      const children = [];
      let j = i + 1;
      while (j < lines.length && lines[j].startsWith(childIndent + ' ') === false &&
             lines[j].startsWith(childIndent) && /^\s*[a-z_]+:/.test(lines[j])) {
        children.push(lines[j]);
        j++;
      }
      const onlyMotivation = children.every(c => c.trimStart().startsWith('motivated_by:'));
      if (onlyMotivation) {
        out.push(`${indent}- ${value}`);
        i = j - 1;
        continue;
      }
    }

    out.push(line);
  }
  return out.join('\n');
}
