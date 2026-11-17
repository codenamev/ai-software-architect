#!/usr/bin/env node
/**
 * Claude Code PreToolUse hook protecting framework source-of-truth files.
 *
 * Reads JSON from stdin, extracts the target file path, and blocks Write/Edit
 * on .architecture/{members.yml, principles.md, config.yml} unless the
 * CLAUDE_ALLOW_PROTECTED env var is set, or setup-architect's fresh
 * `.architecture/.setup-in-progress` sentinel sits next to the target.
 *
 * Exit 0 = allow.
 * Exit 2 = block; stderr is shown to the model so it can redirect to the
 *          recommended workflow (regenerator, ADR, pragmatic-guard skill).
 */

import { isProtected, protectedFileMessage, setupSentinelActive } from '../lib/protected-files.js';

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

(async () => {
  if (process.env.CLAUDE_ALLOW_PROTECTED) process.exit(0);

  const raw = await readStdin();
  if (!raw.trim()) process.exit(0);

  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    process.exit(0);
  }

  const filePath =
    payload?.tool_input?.file_path ||
    payload?.tool_input?.path ||
    payload?.params?.file_path;

  if (!filePath || !isProtected(filePath)) process.exit(0);
  if (setupSentinelActive(filePath, { cwd: payload?.cwd || process.cwd() })) process.exit(0);

  console.error(protectedFileMessage(filePath));
  process.exit(2);
})();
