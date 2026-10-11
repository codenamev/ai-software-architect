import { normalize } from 'node:path';

const PROTECTED_DIR = '.architecture';

const PROTECTED_FILES = {
  'members.yml': {
    reason:
      'members.yml is the source of truth for the generated agents/*.md subagents. Editing it without regenerating causes the committed subagents to drift.',
    workflow:
      'Edit members.yml directly in your editor (outside Claude Code), then run `node tools/cli.js generate-subagents` to update agents/*.md.',
  },
  'principles.md': {
    reason:
      'principles.md encodes the architecture team\'s foundational principles. Changes here ripple through every review and ADR.',
    workflow:
      'Make principle changes through an ADR (use the create-adr skill) so the rationale is recorded.',
  },
  'config.yml': {
    reason:
      'config.yml controls operational mode (pragmatic_mode, review_process, ADR rules). Silent edits change framework behavior.',
    workflow:
      'Use the pragmatic-guard skill to toggle pragmatic mode, or update via an ADR for structural config changes.',
  },
};

/**
 * Resolve a path to its final two segments after normalization.
 *
 * `normalize` collapses duplicate separators and resolves `.` / `..`
 * segments, so `.architecture/decisions/../config.yml` and
 * `.architecture//config.yml` both land on `.architecture/config.yml`.
 * Splitting on either separator afterwards means a forward-slash path on
 * a Windows host and a backslash path handed to a POSIX build compare the
 * same way. The hook is a guardrail against accidental edits, not a
 * sandbox: matching is exact-case, so a case-variant path on a
 * case-insensitive filesystem is not caught.
 */
function tailSegments(filePath) {
  const segments = normalize(filePath).split(/[\\/]+/).filter(Boolean);
  return { dir: segments[segments.length - 2], name: segments[segments.length - 1] };
}

function protectedEntry(filePath) {
  if (typeof filePath !== 'string' || filePath.length === 0) return null;
  const { dir, name } = tailSegments(filePath);
  if (dir !== PROTECTED_DIR) return null;
  return Object.hasOwn(PROTECTED_FILES, name) ? PROTECTED_FILES[name] : null;
}

export function isProtected(filePath) {
  return protectedEntry(filePath) !== null;
}

export function protectedFileMessage(filePath) {
  const entry = protectedEntry(filePath);
  if (!entry) return '';
  return [
    `Refusing to edit protected file: ${filePath}`,
    '',
    `Why: ${entry.reason}`,
    '',
    `Recommended workflow: ${entry.workflow}`,
    '',
    'To override for an intentional, one-off edit, set CLAUDE_ALLOW_PROTECTED=1 in the environment and retry.',
  ].join('\n');
}
