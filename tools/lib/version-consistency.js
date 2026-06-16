/**
 * Version Consistency - Guards the single-version commitment from ADR-011
 *
 * ADR-011 ("Architectural Decision (Regardless of Path)") commits to a single
 * framework version shared across all distribution channels, enforced by an
 * automated pipeline. This module is the proportional, deterministic guard that
 * makes the commitment checkable (the per-file checks the pipeline was meant to
 * cover). See ADR-009 for the script-based-deterministic-operations rationale.
 *
 * Pure functions only; file IO lives in cli.js, mirroring the other lib modules.
 *
 * Deliberately NOT covered (legitimately independent versions):
 *   - tools/package.json        → internal package "architecture-tools", not a channel
 *   - config.yml architecture_version → the target project's architecture version
 *   - AGENTS.md Documentation Version  → doc-structure version (ADR-006)
 */

const SEMVER = '([0-9]+\\.[0-9]+\\.[0-9]+)';

/**
 * Extract a quoted version value following a key, e.g.
 *   "version": "1.5.4"   (JSON)
 *   version: "1.5.4"     (JS object / YAML)
 * The \b word boundary prevents `version` from matching inside `framework_version`.
 *
 * @param {string} content - File content
 * @param {string} [key='version'] - The key whose value to read
 * @returns {string|null} The semver string, or null if not found
 */
export function extractVersion(content, key = 'version') {
  const re = new RegExp(`["']?\\b${key}\\b["']?\\s*[:=]\\s*["']${SEMVER}["']`);
  const m = content.match(re);
  return m ? m[1] : null;
}

/**
 * Extract a markdown bold-labeled version, e.g.
 *   **Framework Version**: 1.5.4
 *
 * @param {string} content - File content
 * @param {string} label - The bold label text (without asterisks)
 * @returns {string|null} The semver string, or null if not found
 */
export function extractLabeledVersion(content, label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`\\*\\*${escaped}\\*\\*:\\s*${SEMVER}`);
  const m = content.match(re);
  return m ? m[1] : null;
}

/**
 * Check that every entry's version matches the canonical version.
 *
 * @param {Array<{label: string, version: string|null}>} entries
 * @param {string} [canonical] - Reference version; defaults to the first non-null entry
 * @returns {{canonical: string|null, consistent: boolean, mismatches: Array, missing: Array}}
 */
export function checkConsistency(entries, canonical) {
  const ref = canonical ?? entries.find(e => e.version)?.version ?? null;
  const missing = entries.filter(e => e.version === null);
  const mismatches = entries.filter(e => e.version !== null && e.version !== ref);
  return {
    canonical: ref,
    consistent: mismatches.length === 0 && missing.length === 0,
    mismatches,
    missing,
  };
}

/**
 * Files that MUST share the framework version, with how to read each one.
 * Paths are repo-root-relative. The first entry (plugin.json) is canonical.
 * `read` takes file content and returns a semver string or null.
 * This is data, not IO — callers (cli.js, tests) do the reading.
 */
export const FRAMEWORK_VERSION_SOURCES = [
  { label: '.claude-plugin/plugin.json', file: '.claude-plugin/plugin.json', read: c => extractVersion(c) },
  { label: '.claude-plugin/marketplace.json', file: '.claude-plugin/marketplace.json', read: c => extractVersion(c) },
  { label: 'mcp/package.json', file: 'mcp/package.json', read: c => extractVersion(c) },
  { label: 'mcp/index.js', file: 'mcp/index.js', read: c => extractVersion(c) },
  { label: '.architecture/config.yml (framework_version)', file: '.architecture/config.yml', read: c => extractVersion(c, 'framework_version') },
  { label: 'CLAUDE.md (Framework Version)', file: 'CLAUDE.md', read: c => extractLabeledVersion(c, 'Framework Version') },
  { label: 'AGENTS.md (Framework Version)', file: 'AGENTS.md', read: c => extractLabeledVersion(c, 'Framework Version') },
  { label: 'AGENTS.md (MCP Server Version)', file: 'AGENTS.md', read: c => extractLabeledVersion(c, 'MCP Server Version') },
];
