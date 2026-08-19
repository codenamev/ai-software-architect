import { describe, it } from 'node:test';
import assert from 'node:assert';
import { generateSubagent, generateAll, parseFrontmatter } from '../lib/subagent-generator.js';

const SAMPLE_MEMBER = {
  id: 'security_specialist',
  name: 'Security Specialist',
  title: 'Security Specialist',
  specialties: ['threat modeling', 'security patterns', 'data protection'],
  disciplines: ['security analysis', 'risk assessment'],
  skillsets: ['identifying security implications'],
  domains: ['system security', 'data protection'],
  perspective: 'Reviews the architecture from a security-first perspective.',
};

describe('Subagent Generator', () => {
  describe('generateSubagent', () => {
    it('returns an object with filename and content', () => {
      const result = generateSubagent(SAMPLE_MEMBER);
      assert.ok(typeof result.filename === 'string');
      assert.ok(typeof result.content === 'string');
    });

    it('derives filename from member id with kebab-case and .md', () => {
      const result = generateSubagent(SAMPLE_MEMBER);
      assert.strictEqual(result.filename, 'security-specialist.md');
    });

    it('strips path separators from ids so filenames cannot escape agents/', () => {
      const result = generateSubagent({ ...SAMPLE_MEMBER, id: '../../.claude/hooks/evil' });
      assert.ok(!result.filename.includes('/'), 'filename must not contain "/"');
      assert.ok(!result.filename.includes('\\'), 'filename must not contain "\\"');
      assert.ok(!result.filename.includes('..'), 'filename must not contain ".."');
      assert.strictEqual(result.filename, 'claude-hooks-evil.md');
    });

    it('slugs dots, spaces, and other special characters to hyphens', () => {
      const result = generateSubagent({ ...SAMPLE_MEMBER, id: 'api architect v2.0' });
      assert.strictEqual(result.filename, 'api-architect-v2-0.md');
    });

    it('rejects ids with no usable characters instead of inventing a filename', () => {
      assert.throws(
        () => generateSubagent({ ...SAMPLE_MEMBER, id: '../..' }),
        /no characters usable in a filename/
      );
    });

    it('emits valid YAML frontmatter at the top of the file', () => {
      const { content } = generateSubagent(SAMPLE_MEMBER);
      assert.ok(content.startsWith('---\n'), 'must open with YAML frontmatter');
      const fm = parseFrontmatter(content);
      assert.ok(fm, 'frontmatter must parse');
    });

    it('frontmatter name matches the kebab-case id', () => {
      const { content } = generateSubagent(SAMPLE_MEMBER);
      const fm = parseFrontmatter(content);
      assert.strictEqual(fm.name, 'security-specialist');
    });

    it('frontmatter description includes the title and a "use when" hint', () => {
      const { content } = generateSubagent(SAMPLE_MEMBER);
      const fm = parseFrontmatter(content);
      assert.match(fm.description, /Security Specialist/);
      assert.match(fm.description, /use when|Use when|use proactively/i);
    });

    it('frontmatter description references at least one specialty for triggering', () => {
      const { content } = generateSubagent(SAMPLE_MEMBER);
      const fm = parseFrontmatter(content);
      assert.match(fm.description, /threat modeling|security patterns|data protection/i);
    });

    it('body includes the member perspective verbatim', () => {
      const { content } = generateSubagent(SAMPLE_MEMBER);
      assert.ok(
        content.includes(SAMPLE_MEMBER.perspective),
        'perspective must appear verbatim in body'
      );
    });

    it('body lists all specialties, disciplines, skillsets, and domains', () => {
      const { content } = generateSubagent(SAMPLE_MEMBER);
      for (const item of [
        ...SAMPLE_MEMBER.specialties,
        ...SAMPLE_MEMBER.disciplines,
        ...SAMPLE_MEMBER.skillsets,
        ...SAMPLE_MEMBER.domains,
      ]) {
        assert.ok(content.includes(item), `body should include "${item}"`);
      }
    });

    it('body references the source members.yml so edits are not lost', () => {
      const { content } = generateSubagent(SAMPLE_MEMBER);
      assert.match(content, /members\.yml/);
    });

    it('emits a tools list scoped to read-only analysis by default', () => {
      const { content } = generateSubagent(SAMPLE_MEMBER);
      const fm = parseFrontmatter(content);
      assert.ok(fm.tools, 'tools field must be present');
      assert.match(fm.tools, /Read/);
      assert.match(fm.tools, /Grep/);
      assert.match(fm.tools, /Glob/);
    });
  });

  describe('pragmatic_enforcer special handling', () => {
    const PRAGMATIC = {
      id: 'pragmatic_enforcer',
      name: 'Pragmatic Enforcer',
      title: 'YAGNI Guardian & Simplicity Advocate',
      specialties: ['YAGNI principles', 'minimum viable solutions'],
      disciplines: ['scope management'],
      skillsets: ['challenging unnecessary abstractions'],
      domains: ['implementation simplicity'],
      perspective: 'Pushes for the simplest approach that solves the immediate problem.',
      mode_specific: {
        active_when: 'pragmatic_mode.enabled == true',
      },
    };

    it('still generates a subagent file for pragmatic_enforcer', () => {
      const result = generateSubagent(PRAGMATIC);
      assert.strictEqual(result.filename, 'pragmatic-enforcer.md');
    });

    it('notes the activation condition in the body', () => {
      const { content } = generateSubagent(PRAGMATIC);
      assert.match(content, /pragmatic_mode/);
    });
  });

  describe('generateAll', () => {
    const MEMBERS_YAML = `
members:
  - id: security_specialist
    name: "Security Specialist"
    title: "Security Specialist"
    specialties:
      - "threat modeling"
    disciplines:
      - "security analysis"
    skillsets:
      - "identifying security implications"
    domains:
      - "system security"
    perspective: "Reviews from a security-first perspective."

  - id: performance_specialist
    name: "Performance Specialist"
    title: "Performance Specialist"
    specialties:
      - "performance optimization"
    disciplines:
      - "performance analysis"
    skillsets:
      - "profiling system performance"
    domains:
      - "system performance"
    perspective: "Focuses on performance implications."
`;

    it('returns one subagent per member', () => {
      const results = generateAll(MEMBERS_YAML);
      assert.strictEqual(results.length, 2);
    });

    it('preserves member order', () => {
      const results = generateAll(MEMBERS_YAML);
      assert.strictEqual(results[0].filename, 'security-specialist.md');
      assert.strictEqual(results[1].filename, 'performance-specialist.md');
    });

    it('throws when two ids slug to the same filename instead of silently overwriting', () => {
      const collidingYaml = MEMBERS_YAML + '\n  - id: "security.specialist"\n    name: "Impostor"\n    perspective: "x"\n';
      assert.throws(
        () => generateAll(collidingYaml),
        /both slug to security-specialist\.md/
      );
    });

    it('skips entries without an id (defensive)', () => {
      const yamlWithBlank = MEMBERS_YAML + '\n  - name: "No ID"\n    perspective: "x"\n';
      const results = generateAll(yamlWithBlank);
      assert.strictEqual(results.length, 2);
    });
  });
});
