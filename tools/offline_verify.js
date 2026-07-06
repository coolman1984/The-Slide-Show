#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const childProcess = require('child_process');
const os = require('os');

const ROOT = path.resolve(__dirname, '..');
const MANIFEST = path.join(ROOT, 'OFFLINE_MANIFEST.json');

const failures = [];
const warnings = [];

function rel(p) {
  return path.relative(ROOT, p).split(path.sep).join('/');
}

function fail(msg) {
  failures.push(msg);
}

function warn(msg) {
  warnings.push(msg);
}

function sha256(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    fail(`${rel(file)} is not valid JSON: ${err.message}`);
    return null;
  }
}

function runNode(args, label) {
  const result = childProcess.spawnSync(process.execPath, args, {
    cwd: ROOT,
    encoding: 'utf8',
    windowsHide: true,
  });
  if (result.status !== 0) {
    fail(`${label} failed.\n${result.stdout || ''}${result.stderr || ''}`.trim());
  }
  return result;
}

function checkNoPackageDependencies() {
  const pkg = readJson(path.join(ROOT, 'package.json'));
  if (!pkg) return;
  if (pkg.dependencies && Object.keys(pkg.dependencies).length) {
    fail('package.json must not contain dependencies.');
  }
  if (pkg.devDependencies && Object.keys(pkg.devDependencies).length) {
    fail('package.json must not contain devDependencies.');
  }
}

function checkDeckValidation() {
  const deckDir = path.join(ROOT, 'decks');
  if (!fs.existsSync(deckDir)) {
    fail('decks/ folder is missing.');
    return;
  }
  const decks = fs.readdirSync(deckDir).filter(f => f.endsWith('.json')).sort();
  if (!decks.length) {
    fail('No deck JSON files found in decks/.');
    return;
  }
  for (const deck of decks) {
    const out = path.join(os.tmpdir(), `slide-forge-verify-${Date.now()}-${deck.replace(/\.json$/, '.html')}`);
    const result = runNode(['engine/build.js', `decks/${deck}`, '-o', out], `Build decks/${deck}`);
    const text = `${result.stdout || ''}\n${result.stderr || ''}`;
    if (/warning\(s\)|\bwarning\b/i.test(text)) {
      warn(`decks/${deck} built with warnings. Review before presenting.`);
    }
    if (fs.existsSync(out)) fs.unlinkSync(out);
  }
}

function checkHtmlOffline(file) {
  if (!fs.existsSync(file)) {
    fail(`${rel(file)} is missing.`);
    return;
  }
  const html = fs.readFileSync(file, 'utf8');
  const attrPattern = /\b(?:src|href)\s*=\s*["']([^"']+)["']/gi;
  let match;
  while ((match = attrPattern.exec(html)) !== null) {
    const value = match[1].trim();
    if (/^(https?:|\/\/|file:)/i.test(value)) {
      fail(`${rel(file)} contains an external asset reference: ${value}`);
    }
  }
  const externalPatterns = [
    /<iframe\b/i,
    /https?:\/\//i,
    /@import\s+url/i,
  ];
  for (const pattern of externalPatterns) {
    if (pattern.test(html)) {
      fail(`${rel(file)} contains an external-reference pattern: ${pattern}`);
    }
  }
}

function checkBuiltOutputs() {
  checkHtmlOffline(path.join(ROOT, 'index.html'));
  const dist = path.join(ROOT, 'dist');
  if (!fs.existsSync(dist)) return;
  for (const file of fs.readdirSync(dist).filter(f => f.endsWith('.html'))) {
    checkHtmlOffline(path.join(dist, file));
  }
}

function checkManifest() {
  if (!fs.existsSync(MANIFEST)) {
    fail('OFFLINE_MANIFEST.json is missing. Creator should run npm run architect:manifest after verified changes.');
    return;
  }
  const manifest = readJson(MANIFEST);
  if (!manifest || !Array.isArray(manifest.files)) return;
  for (const item of manifest.files) {
    const full = path.join(ROOT, item.path);
    if (!fs.existsSync(full)) {
      fail(`Manifest file missing: ${item.path}`);
      continue;
    }
    const actual = sha256(full);
    if (actual !== item.sha256) {
      fail(`Hash mismatch: ${item.path}`);
    }
  }
}

function checkSlideSpecValidation() {
  const golden = path.join(ROOT, 'examples', 'golden', 'slidespec-cover.json');
  const bad = path.join(ROOT, 'examples', 'bad', 'slidespec-extra-field.json');
  if (fs.existsSync(golden)) {
    runNode(['tools/validate_slidespec.js', 'examples/golden/slidespec-cover.json'], 'Validate golden SlideSpec example');
  }
  if (fs.existsSync(bad)) {
    const result = childProcess.spawnSync(process.execPath, ['tools/validate_slidespec.js', 'examples/bad/slidespec-extra-field.json'], {
      cwd: ROOT,
      encoding: 'utf8',
      windowsHide: true,
    });
    if (result.status === 0) {
      fail('Bad SlideSpec example should have failed validation.');
    }
  }
}

function checkTemplateRegistry() {
  runNode(['tools/validate_templates.js'], 'Validate template registry');
}

function checkDocumentationConsistency() {
  const docs = {
    readme: fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8'),
    agents: fs.readFileSync(path.join(ROOT, 'AGENTS.md'), 'utf8'),
    startHere: fs.readFileSync(path.join(ROOT, 'docs', 'WORK_AGENT_START_HERE.md'), 'utf8'),
    skill: fs.readFileSync(path.join(ROOT, 'skills', 'SKILL.md'), 'utf8'),
    schema: fs.readFileSync(path.join(ROOT, 'skills', 'deck-schema.md'), 'utf8'),
  };

  const requiredSnippets = [
    [docs.readme, '11 slide types', 'README must advertise the current slide type count.'],
    [docs.readme, '10 themes', 'README must advertise the current theme count.'],
    [docs.readme, '7 transitions', 'README must advertise the current transition count.'],
    [docs.agents, 'docs/LOW_LEVEL_WORK_AGENT_PLAYBOOK.md', 'AGENTS.md must route weak work agents to the low-level playbook.'],
    [docs.startHere, 'docs/LOW_LEVEL_WORK_AGENT_PLAYBOOK.md', 'WORK_AGENT_START_HERE.md must route weak work agents to the low-level playbook.'],
    [docs.skill, 'kpi-dashboard', 'skills/SKILL.md must include the KPI dashboard slide type.'],
    [docs.schema, '### kpi-dashboard', 'skills/deck-schema.md must document the KPI dashboard schema.'],
  ];

  for (const [text, snippet, message] of requiredSnippets) {
    if (!text.includes(snippet)) fail(message);
  }

  const staleSnippets = [
    [docs.readme, '10 slide types', 'README has stale slide type count.'],
    [docs.readme, '6 themes', 'README has stale theme count.'],
    [docs.readme, '3 transitions', 'README has stale transition count.'],
    [docs.readme, 'future slide\nwork', 'README describes the Control Board as future work.'],
  ];

  for (const [text, snippet, message] of staleSnippets) {
    if (text.includes(snippet)) fail(message);
  }
}

function checkControlBoard() {
  runNode(['tools/build_control_board.js'], 'Build Control Board');
  checkHtmlOffline(path.join(ROOT, 'dist', 'control-board.html'));
  const pack = path.join(ROOT, 'packages', 'control-board-demo', 'sample-agent-pack');
  const required = [
    '00_control/agent_task.md',
    '00_control/slide_job.json',
    '00_control/locked_choices.json',
    '00_control/render_config.json',
    '02_extracted/markdown/00_data_index.md',
    '02_extracted/markdown/05_slide_ready_facts.md',
    '02_extracted/markdown/06_data_warnings.md',
  ];
  for (const item of required) {
    const file = path.join(pack, item);
    if (!fs.existsSync(file)) fail(`Control Board sample Agent Pack is missing ${item}`);
    else if (item.endsWith('.json')) readJson(file);
  }
}

checkNoPackageDependencies();
checkSlideSpecValidation();
checkTemplateRegistry();
checkDocumentationConsistency();
checkControlBoard();
checkDeckValidation();
checkBuiltOutputs();
checkManifest();

for (const msg of warnings) console.warn(`WARN: ${msg}`);

if (failures.length) {
  console.error('\nVERIFY FAILED');
  failures.forEach((msg, i) => console.error(`\n${i + 1}. ${msg}`));
  process.exit(1);
}

console.log(`VERIFY PASSED${warnings.length ? ` with ${warnings.length} warning(s)` : ''}.`);
