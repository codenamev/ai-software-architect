/**
 * Resolve where generate-subagents reads members.yml and writes subagents.
 *
 * The CLI ships inside the plugin install, so it can't assume the cwd is
 * tools/ of the framework repo. The project root is the nearest ancestor of
 * the start directory holding .architecture/members.yml. The framework repo
 * itself is a plugin (it has .claude-plugin/plugin.json), so its subagents
 * live in agents/. Any other project gets project subagents in .claude/agents/,
 * which is where Claude Code looks for them.
 */

import { dirname, join, resolve } from 'node:path';

export const MEMBERS_REL = join('.architecture', 'members.yml');
export const PLUGIN_MANIFEST_REL = join('.claude-plugin', 'plugin.json');

export function findProjectRoot(start, exists) {
  let dir = resolve(start);
  for (;;) {
    if (exists(join(dir, MEMBERS_REL))) return dir;
    const parent = dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

export function subagentOutDir(root, exists) {
  return exists(join(root, PLUGIN_MANIFEST_REL))
    ? join(root, 'agents')
    : join(root, '.claude', 'agents');
}

/**
 * Returns { root, membersPath, outDir } or throws with guidance.
 * An explicit --root wins over the walk and must contain members.yml.
 */
export function resolveSubagentPaths({ cwd, explicitRoot, exists }) {
  const root = explicitRoot
    ? (exists(join(resolve(explicitRoot), MEMBERS_REL)) ? resolve(explicitRoot) : null)
    : findProjectRoot(cwd, exists);

  if (!root) {
    const where = explicitRoot ? resolve(explicitRoot) : `${resolve(cwd)} or any parent`;
    throw new Error(
      `No ${MEMBERS_REL} found in ${where}. Run from inside your project, ` +
        `pass --root <project-dir>, or run setup-architect first.`
    );
  }

  return {
    root,
    membersPath: join(root, MEMBERS_REL),
    outDir: subagentOutDir(root, exists),
  };
}
