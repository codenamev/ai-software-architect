import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderAdrFromTemplate } from '../index.js';

const TEMPLATE = `# ADR-XXX: [Title]

## Status

[Status]

## Context

[Context]

## Decision

[Decision]

## Consequences

[Consequences]
`;

test('preserves replacement tokens in ADR titles', () => {
  const title = "Use $' literal";
  const rendered = renderAdrFromTemplate(TEMPLATE, {
    number: 1,
    title,
    context: 'Context',
    decision: 'Decision',
    consequences: 'Consequences',
    date: '2026-10-15',
  });

  assert.ok(rendered.includes(`# ADR-001: ${title}`));
  assert.equal(rendered.match(/# ADR-001:/g)?.length, 1);
});
