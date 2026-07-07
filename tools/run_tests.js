#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { buildAgentPackFiles, getCatalog, makeDemoState, normalizeState } = require('./lib/agent_pack');

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

test('Catalog exposes implemented design choices without false Control Board warnings', () => {
  const catalog = getCatalog();
  const state = normalizeState(makeDemoState());
  assert.ok(catalog.templates.length >= 7, 'expected template catalog');
  assert.ok(catalog.themes.some((theme) => theme.themeId === 'mint-lab'), 'mint-lab theme missing');
  assert.ok(catalog.surfaces.some((surface) => surface.id === 'soft'), 'soft surface missing');
  assert.deepStrictEqual(state.validationWarnings, []);
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
for (const item of tests) {
  try {
    item.fn();
    passed++;
    console.log(`PASS ${item.name}`);
  } catch (error) {
    console.error(`FAIL ${item.name}`);
    console.error(error.stack || error.message);
    process.exitCode = 1;
    break;
  }
}

if (!process.exitCode) {
  console.log(`All ${passed} tests passed.`);
}
