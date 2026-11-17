#!/usr/bin/env node
/**
 * Claude Code PreToolUse hook: names the ADRs that govern a file before
 * Write/Edit touches it.
 *
 * Reads the hook JSON from stdin, matches tool_input.file_path against each
 * ADR's `affects:` globs, and prints hookSpecificOutput.additionalContext
 * listing the matches (superseded ones labelled with their successor).
 *
 * Always exits 0. It never blocks, and any error (bad JSON, unreadable ADR
 * directory) means silence rather than a failed tool call.
 */

import { adrContextFor, formatAdrContext } from '../lib/adr-context.js';

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

(async () => {
  try {
    const raw = await readStdin();
    if (!raw.trim()) return;
    const payload = JSON.parse(raw);
    const filePath =
      payload?.tool_input?.file_path ||
      payload?.tool_input?.path ||
      payload?.params?.file_path;
    const cwd = payload?.cwd || process.env.CLAUDE_PROJECT_DIR || process.cwd();

    const context = adrContextFor(filePath, { cwd });
    if (!context) return;

    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        additionalContext: formatAdrContext(context),
      },
    }));
  } catch {
    // Fail open: advisory context is never worth a blocked edit.
  }
})().finally(() => {
  // exitCode, not exit(): stdout to a pipe is async on macOS and exit()
  // can truncate the JSON before it flushes.
  process.exitCode = 0;
});
