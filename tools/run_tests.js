#!/usr/bin/env node
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const assert = require('assert');
const childProcess = require('child_process');
const { buildAgentPackFiles, getCatalog, makeDemoState, normalizeState } = require('./lib/agent_pack');
const { validate, VALID_TYPES } = require('../engine/lib/validate');
const { THEMES, resolveAccent } = require('../engine/lib/themes');
const { getIcon } = require('../engine/lib/icons');
const { TYPE_CLASS } = require('../engine/lib/render');

const ROOT = path.resolve(__dirname, '..');
const tests = [];

function test(name, fn) {
  tests.push({ name, fn });
}

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), 'utf8');
}

function assertIncludes(text, snippet, message) {
  assert.ok(text.includes(snippet), message || `Expected text to include ${snippet}`);
}

/* Build a deck object to a temp file and return { status, stdout, stderr, html }. */
function buildDeck(deck, args = []) {
  const file = path.join(os.tmpdir(), `sf-test-${Date.now()}-${Math.random().toString(36).slice(2)}.json`);
  const out = file.replace(/\.json$/, '.html');
  fs.writeFileSync(file, JSON.stringify(deck));
  const result = childProcess.spawnSync(process.execPath, ['engine/build.js', file, ...args, '-o', out], {
    cwd: ROOT, encoding: 'utf8', windowsHide: true,
  });
  const html = fs.existsSync(out) ? fs.readFileSync(out, 'utf8') : null;
  [file, out].forEach(f => { if (fs.existsSync(f)) fs.unlinkSync(f); });
  return { status: result.status, stdout: result.stdout || '', stderr: result.stderr || '', html };
}

const errorPaths = deck => validate(deck).errors.map(e => e.split(':')[0]);
const hasWarningAt = (deck, needle) => validate(deck).warnings.some(w => w.includes(needle));

/* ------------------------------------------------------------------ *
 * Engine: validator
 * ------------------------------------------------------------------ */

test('Validator accepts a minimal well-formed deck', () => {
  const { errors } = validate({ meta: { title: 'T' }, slides: [{ type: 'title', heading: 'H' }] });
  assert.deepStrictEqual(errors, []);
});

test('Validator rejects an unknown slide type with a path', () => {
  const paths = errorPaths({ meta: { title: 'T' }, slides: [{ type: 'nope' }] });
  assert.ok(paths.includes('slides[0].type'), `expected slides[0].type error, got ${paths}`);
});

test('Validator rejects org-chart left/right without a names array (regression: build crash)', () => {
  const deck = { meta: { title: 'T' }, slides: [{
    type: 'org-chart', heading: 'H', leader: { title: 'L', name: 'N' }, left: { title: 'AI Part' },
    divisions: [{ name: 'D', teams: [{ name: 'T', members: [{ initials: 'AB', name: 'Name', role: 'R' }] }] }],
  }] };
  assert.ok(errorPaths(deck).includes('slides[0].left'), 'org-chart left without names must error, not crash');
});

test('Validator rejects a KPI tile with a missing value (regression: silent empty tile)', () => {
  const deck = { meta: { title: 'T' }, slides: [{ type: 'kpi', heading: 'H', tiles: [{ label: 'No value' }] }] };
  assert.ok(errorPaths(deck).includes('slides[0].tiles[0].value'), 'missing KPI value must be an error');
});

test('Validator warns on an over-long KPI value', () => {
  const deck = { meta: { title: 'T' }, slides: [{ type: 'kpi', heading: 'H', tiles: [{ value: '1,234,567.89', label: 'X' }] }] };
  assert.ok(hasWarningAt(deck, 'tiles[0].value'), 'long KPI value should warn about overflow');
});

test('Validator warns on an accent that is neither a slot nor 6-digit hex', () => {
  const deck = { meta: { title: 'T' }, slides: [{
    type: 'comparison', heading: 'H',
    cards: [{ name: 'C', accent: 'purple', paragraphs: ['x'] }],
  }] };
  assert.ok(hasWarningAt(deck, 'accent "purple"'), 'unknown accent reference should warn');
});

test('Validator accepts real accents (a1-a4 and #rrggbb) without warning', () => {
  const deck = { meta: { title: 'T' }, slides: [{
    type: 'comparison', heading: 'H',
    cards: [{ name: 'A', accent: 'a1', paragraphs: ['x'] }, { name: 'B', accent: '#c084fc', paragraphs: ['y'] }],
  }] };
  assert.ok(!validate(deck).warnings.some(w => w.includes('accent')), 'valid accents must not warn');
});

test('Validator warns when an agenda has more than 8 items', () => {
  const items = Array.from({ length: 9 }, (_, i) => `Item ${i + 1}`);
  assert.ok(hasWarningAt({ meta: { title: 'T' }, slides: [{ type: 'agenda', heading: 'A', items }] }, 'items'));
});

test('Validator flags a bad meta.theme and lists every slide type', () => {
  const { errors } = validate({ meta: { title: 'T', theme: 'ghost' }, slides: [{ type: 'title', heading: 'H' }] });
  assert.ok(errors.some(e => e.startsWith('meta.theme')), 'unknown theme must error');
  assert.strictEqual(VALID_TYPES.length, 11, 'expected 11 slide types');
});

/* ------------------------------------------------------------------ *
 * Engine: theme + icon resolution
 * ------------------------------------------------------------------ */

test('resolveAccent handles slots, raw hex, and unknown fallback', () => {
  const t = THEMES['midnight-tech'];
  assert.strictEqual(resolveAccent(t, 'a1').color, '#22d3ee');
  assert.strictEqual(resolveAccent(t, '#abcdef').color, '#abcdef');
  assert.strictEqual(resolveAccent(t, 'bogus').color, t.accents.a1.color, 'unknown ref falls back to a1');
});

test('getIcon returns known icons and falls back to dot with a warning', () => {
  assert.ok(getIcon('robot').includes('<svg'), 'known icon returns svg');
  const warnings = [];
  const svg = getIcon('not-an-icon', warnings);
  assert.strictEqual(svg, getIcon('dot'), 'unknown icon falls back to dot');
  assert.ok(warnings.length === 1, 'unknown icon pushes a warning');
});

/* ------------------------------------------------------------------ *
 * Engine: end-to-end build
 * ------------------------------------------------------------------ */

test('Every slide type renders end-to-end from the orion demo deck', () => {
  const result = childProcess.spawnSync(process.execPath,
    ['engine/build.js', 'decks/orion-factory-control-demo.json', '-o', path.join(os.tmpdir(), `sf-orion-${Date.now()}.html`)],
    { cwd: ROOT, encoding: 'utf8', windowsHide: true });
  assert.strictEqual(result.status, 0, `orion build failed:\n${result.stderr}`);
});

test('Built output covers all 11 slide-type CSS classes (all renderers exercised)', () => {
  const deck = JSON.parse(read('decks/orion-factory-control-demo.json'));
  const { html } = buildDeck(deck);
  assert.ok(html, 'orion deck should build');
  for (const cls of Object.values(TYPE_CLASS)) {
    assert.ok(html.includes(cls), `built output is missing renderer class ${cls}`);
  }
});

test('Built output is self-contained (no external references)', () => {
  const { html } = buildDeck({ meta: { title: 'T' }, slides: [{ type: 'title', heading: 'H' }] });
  assert.ok(!/https?:\/\//i.test(html), 'no http(s) URLs');
  assert.ok(!/\b(?:src|href)\s*=\s*["'](?:https?:|\/\/|file:)/i.test(html), 'no external src/href');
});

test('build.js escapes quotes so a stray meta.lang cannot break the html attribute', () => {
  const { html } = buildDeck({ meta: { title: 'T', lang: 'en" onload="x' }, slides: [{ type: 'title', heading: 'H' }] });
  assert.ok(/<html lang="en&quot; onload=&quot;x"/.test(html), 'lang attribute must be entity-escaped');
});

test('A KPI tile without a value fails the build (exit non-zero)', () => {
  const { status } = buildDeck({ meta: { title: 'T' }, slides: [{ type: 'kpi', heading: 'H', tiles: [{ label: 'x' }] }] });
  assert.notStrictEqual(status, 0, 'missing KPI value must fail the build');
});

/* ------------------------------------------------------------------ *
 * Agent Pack (existing coverage, retained)
 * ------------------------------------------------------------------ */

test('Agent Pack contains the required weak-agent files', () => {
  const pack = buildAgentPackFiles(makeDemoState());
  const required = [
    '00_control/agent_task.md',
    '00_control/slide_job.json',
    '00_control/locked_choices.json',
    '00_control/render_config.json',
    '00_control/control_state.json',
    '00_control/validation_summary.md',
    '02_extracted/markdown/00_data_index.md',
    '02_extracted/markdown/05_slide_ready_facts.md',
    '02_extracted/markdown/06_data_warnings.md',
  ];
  required.forEach((file) => assert.ok(pack.files[file], `${file} missing from Agent Pack`));
});

test('Agent Pack forbids weak agents from changing design or reading raw sources', () => {
  const pack = buildAgentPackFiles(makeDemoState());
  const slideJob = JSON.parse(pack.files['00_control/slide_job.json']);
  assert.strictEqual(slideJob.locked_design, true);
  assert.strictEqual(slideJob.agent_permissions.can_change_template, false);
  assert.strictEqual(slideJob.agent_permissions.can_change_theme, false);
  assert.strictEqual(slideJob.agent_permissions.can_change_layout, false);
  assert.strictEqual(slideJob.agent_permissions.can_read_raw_sources, false);
  assert.strictEqual(slideJob.agent_permissions.can_invent_data, false);
});

test('Agent Pack keeps the task small and points to prepared Markdown', () => {
  const pack = buildAgentPackFiles(makeDemoState());
  const task = pack.files['00_control/agent_task.md'];
  const facts = pack.files['02_extracted/markdown/05_slide_ready_facts.md'];
  assertIncludes(task, 'Read these files in order:');
  assertIncludes(task, 'Do not:');
  assertIncludes(task, 'read raw Excel, Word, PDF, or PPTX files');
  assertIncludes(facts, '# Slide-Ready Facts');
  assertIncludes(facts, 'Source: prepared fact 1');
});

test('Locked choices in the Agent Pack reference only real engine themes and surfaces', () => {
  const pack = buildAgentPackFiles(makeDemoState());
  const locked = JSON.parse(pack.files['00_control/locked_choices.json']);
  assert.ok(THEMES[locked.theme_id], `locked theme_id ${locked.theme_id} must be a real engine theme`);
});

test('Catalog exposes implemented design choices without false Control Board warnings', () => {
  const catalog = getCatalog();
  const state = normalizeState(makeDemoState());
  assert.ok(catalog.templates.length >= 7, 'expected template catalog');
  assert.ok(catalog.themes.some((theme) => theme.themeId === 'mint-lab'), 'mint-lab theme missing');
  assert.ok(catalog.surfaces.some((surface) => surface.id === 'soft'), 'soft surface missing');
  assert.deepStrictEqual(state.validationWarnings, []);
});

test('Control Board theme catalog matches the engine theme registry', () => {
  const catalog = getCatalog();
  const engineThemes = Object.keys(THEMES).sort();
  const catalogThemes = catalog.themes.map((t) => t.themeId).sort();
  assert.deepStrictEqual(catalogThemes, engineThemes, 'Control Board must offer exactly the engine themes');
});

test('Documentation routes weak agents to the small playbook and specialized skills', () => {
  const agents = read('AGENTS.md');
  const startHere = read('docs/WORK_AGENT_START_HERE.md');
  const projectMap = read('docs/PROJECT_MAP.md');
  assertIncludes(agents, 'docs/LOW_LEVEL_WORK_AGENT_PLAYBOOK.md');
  assertIncludes(startHere, 'docs/LOW_LEVEL_WORK_AGENT_PLAYBOOK.md');
  assertIncludes(projectMap, 'skills/control-board.md');
  assertIncludes(projectMap, 'skills/dataforge-excel.md');
  assertIncludes(projectMap, 'skills/dataforge-pdf.md');
  assertIncludes(projectMap, 'skills/dataforge-db-markdown.md');
});

test('Public docs describe current engine capabilities', () => {
  const readme = read('README.md');
  const skill = read('skills/SKILL.md');
  const schema = read('skills/deck-schema.md');
  assertIncludes(readme, '11 slide types');
  assertIncludes(readme, '10 themes');
  assertIncludes(readme, '7 transitions');
  assertIncludes(skill, 'kpi-dashboard');
  assertIncludes(schema, '### kpi-dashboard');
});

test('Generated Control Board is self-contained and operations-oriented', () => {
  const htmlPath = path.join(ROOT, 'dist', 'control-board.html');
  assert.ok(fs.existsSync(htmlPath), 'dist/control-board.html must be built before tests');
  const html = fs.readFileSync(htmlPath, 'utf8');
  assertIncludes(html, 'workflow');
  assertIncludes(html, 'Source intake');
  assertIncludes(html, 'Design lock');
  assertIncludes(html, 'Quality gate');
  assert.ok(!/https?:\/\//i.test(html), 'Control Board must not reference external URLs');
  assert.ok(!/<iframe\b/i.test(html), 'Control Board must not embed iframes');
});

let passed = 0;
const failures = [];
for (const item of tests) {
  try {
    item.fn();
    passed++;
    console.log(`PASS ${item.name}`);
  } catch (error) {
    failures.push({ name: item.name, error });
    console.error(`FAIL ${item.name}`);
    console.error(`     ${(error && error.message ? error.message : error).toString().split('\n')[0]}`);
  }
}

if (failures.length) {
  console.error(`\n${failures.length} of ${tests.length} test(s) failed.`);
  process.exitCode = 1;
} else {
  console.log(`\nAll ${passed} tests passed.`);
}
