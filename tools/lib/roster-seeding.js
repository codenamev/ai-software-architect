/**
 * Roster seeding for setup (ADR-016).
 *
 * Setup copies the framework's canonical `members.yml` into the target project.
 * These helpers preserve that canonical roster (never substitute a core member)
 * and append stack-specific advisors only when their id is unique. A separate
 * validation guards against a failed/partial copy (fail closed).
 *
 * Pure functions; file IO stays in the caller, mirroring the other lib modules.
 */

/**
 * Merge advisors onto the canonical roster.
 * Canonical members are preserved in order; an advisor is appended only if its
 * id does not collide with an existing member (canonical members never substituted).
 *
 * @param {Array<{id: string}>} canonicalMembers - the copied canonical roster
 * @param {Array<{id: string}>} [advisors] - stack-specific advisors to append
 * @returns {Array} merged member list
 */
export function seedRoster(canonicalMembers, advisors = []) {
  if (!Array.isArray(canonicalMembers) || canonicalMembers.length === 0) {
    throw new Error('seedRoster: canonical roster is missing or empty');
  }
  const ids = new Set(canonicalMembers.map(m => m && m.id));
  const merged = [...canonicalMembers];
  for (const advisor of advisors || []) {
    if (advisor && typeof advisor.id === 'string' && advisor.id && !ids.has(advisor.id)) {
      merged.push(advisor);
      ids.add(advisor.id);
    }
  }
  return merged;
}

/**
 * Fail closed if any required (canonical) id is absent from the roster.
 * Used to detect a failed/partial framework copy before setup proceeds.
 *
 * @param {Array<{id: string}>} members
 * @param {string[]} requiredIds
 * @returns {true} when all present
 * @throws when any required id is missing
 */
export function assertContainsIds(members, requiredIds) {
  const present = new Set((Array.isArray(members) ? members : []).map(m => m && m.id));
  const missing = (requiredIds || []).filter(id => !present.has(id));
  if (missing.length > 0) {
    throw new Error(`Roster is missing canonical members: ${missing.join(', ')}`);
  }
  return true;
}
