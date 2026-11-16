import { describe, it } from 'node:test';
import assert from 'node:assert';
import { join } from 'node:path';
import {
  findProjectRoot,
  subagentOutDir,
  resolveSubagentPaths,
} from '../lib/project-root.js';

function makeExists(paths) {
  const set = new Set(paths);
  return p => set.has(p);
}

const APP = '/work/app';
const APP_MEMBERS = join(APP, '.architecture', 'members.yml');

describe('Project root resolution', () => {
  describe('findProjectRoot', () => {
    it('finds members.yml in the start directory', () => {
      assert.strictEqual(findProjectRoot(APP, makeExists([APP_MEMBERS])), APP);
    });

    it('walks up from a nested directory', () => {
      const exists = makeExists([APP_MEMBERS]);
      assert.strictEqual(findProjectRoot(join(APP, 'app', 'models'), exists), APP);
    });

    it('returns null when no ancestor has members.yml', () => {
      assert.strictEqual(findProjectRoot(APP, makeExists([])), null);
    });

    it('picks the nearest ancestor when several qualify', () => {
      const inner = join(APP, 'engines', 'billing');
      const exists = makeExists([APP_MEMBERS, join(inner, '.architecture', 'members.yml')]);
      assert.strictEqual(findProjectRoot(join(inner, 'lib'), exists), inner);
    });
  });

  describe('subagentOutDir', () => {
    it('writes project subagents to .claude/agents in an ordinary project', () => {
      assert.strictEqual(subagentOutDir(APP, makeExists([])), join(APP, '.claude', 'agents'));
    });

    it('writes plugin subagents to agents/ in a plugin repo', () => {
      const exists = makeExists([join(APP, '.claude-plugin', 'plugin.json')]);
      assert.strictEqual(subagentOutDir(APP, exists), join(APP, 'agents'));
    });
  });

  describe('resolveSubagentPaths', () => {
    it('resolves from the framework tools/ dir the way npm scripts run it', () => {
      const repo = '/src/ai-software-architect';
      const exists = makeExists([
        join(repo, '.architecture', 'members.yml'),
        join(repo, '.claude-plugin', 'plugin.json'),
      ]);
      const paths = resolveSubagentPaths({ cwd: join(repo, 'tools'), exists });
      assert.deepStrictEqual(paths, {
        root: repo,
        membersPath: join(repo, '.architecture', 'members.yml'),
        outDir: join(repo, 'agents'),
      });
    });

    it('resolves a target project when the CLI lives in a plugin cache', () => {
      const paths = resolveSubagentPaths({ cwd: APP, exists: makeExists([APP_MEMBERS]) });
      assert.strictEqual(paths.membersPath, APP_MEMBERS);
      assert.strictEqual(paths.outDir, join(APP, '.claude', 'agents'));
    });

    it('honors an explicit root over the cwd walk', () => {
      const paths = resolveSubagentPaths({
        cwd: '/elsewhere',
        explicitRoot: APP,
        exists: makeExists([APP_MEMBERS]),
      });
      assert.strictEqual(paths.root, APP);
    });

    it('does not walk up from an explicit root that lacks members.yml', () => {
      assert.throws(
        () => resolveSubagentPaths({
          cwd: '/elsewhere',
          explicitRoot: join(APP, 'app'),
          exists: makeExists([APP_MEMBERS]),
        }),
        /No \.architecture\/members\.yml found in \/work\/app\/app\./
      );
    });

    it('explains how to recover when nothing is found', () => {
      assert.throws(
        () => resolveSubagentPaths({ cwd: APP, exists: makeExists([]) }),
        /or any parent.*--root <project-dir>.*setup-architect/
      );
    });
  });
});
