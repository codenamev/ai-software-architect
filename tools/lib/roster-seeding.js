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
