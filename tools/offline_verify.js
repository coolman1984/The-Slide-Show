#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const childProcess = require('child_process');
const os = require('os');

const { VALID_TYPES, VALID_TRANSITIONS } = require('../engine/lib/validate');
const { THEMES } = require('../engine/lib/themes');

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
  if (fs.existsSync(dist)) {
    for (const file of fs.readdirSync(dist).filter(f => f.endsWith('.html'))) {
      checkHtmlOffline(path.join(dist, file));
    }
  }
  // Meeting packages ship built HTML too — they must also be self-contained.
  const packages = path.join(ROOT, 'packages');
  if (fs.existsSync(packages)) {
    walkHtml(packages).forEach(checkHtmlOffline);
  }
}

function walkHtml(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkHtml(full));
    else if (entry.isFile() && entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

/* Every committed HTML output must equal a fresh build of its source deck.
 * This catches the silent-drift failure where the engine changes but the
 * committed index.html / dist previews are never regenerated. */
function checkBuiltOutputsFresh() {
  const targetsFile = path.join(ROOT, 'tools', 'build_targets.json');
  if (!fs.existsSync(targetsFile)) {
    fail('tools/build_targets.json is missing — cannot check built-output freshness.');
    return;
  }
  const { targets } = readJson(targetsFile) || { targets: [] };
  const noEol = s => s.replace(/\r\n/g, '\n');
  const stale = [];
  for (const t of targets) {
    const committed = path.join(ROOT, t.out);
    if (!fs.existsSync(committed)) { fail(`Committed output missing: ${t.out} — run "npm run build:all".`); continue; }
    const tmp = path.join(os.tmpdir(), `sf-fresh-${Date.now()}-${Math.random().toString(36).slice(2)}.html`);
    const result = runNode(['engine/build.js', t.deck, ...(t.args || []), '-o', tmp], `Build ${t.out}`);
    if (result.status !== 0) continue;
    if (fs.existsSync(tmp)) {
      if (noEol(fs.readFileSync(committed, 'utf8')) !== noEol(fs.readFileSync(tmp, 'utf8'))) stale.push(t.out);
      fs.unlinkSync(tmp);
    }
  }
  if (stale.length) {
    fail(`Committed output is stale (differs from a fresh engine build): ${stale.join(', ')}. Run "npm run build:all", then "npm run architect:manifest".`);
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

  // Counts are derived from the engine so there is a single source of truth.
  const typeCount = VALID_TYPES.length;
  const themeCount = Object.keys(THEMES).length;
  const transitionCount = VALID_TRANSITIONS.length;

  const requiredSnippets = [
    [docs.readme, `${typeCount} slide types`, `README must advertise the current slide type count (${typeCount}).`],
    [docs.readme, `${themeCount} themes`, `README must advertise the current theme count (${themeCount}).`],
    [docs.readme, `${transitionCount} transitions`, `README must advertise the current transition count (${transitionCount}).`],
    [docs.agents, 'docs/LOW_LEVEL_WORK_AGENT_PLAYBOOK.md', 'AGENTS.md must route weak work agents to the low-level playbook.'],
    [docs.startHere, 'docs/LOW_LEVEL_WORK_AGENT_PLAYBOOK.md', 'WORK_AGENT_START_HERE.md must route weak work agents to the low-level playbook.'],
    [docs.skill, 'kpi-dashboard', 'skills/SKILL.md must include the KPI dashboard slide type.'],
    [docs.schema, '### kpi-dashboard', 'skills/deck-schema.md must document the KPI dashboard schema.'],
  ];

  for (const [text, snippet, message] of requiredSnippets) {
    if (!text.includes(snippet)) fail(message);
  }

  if (/future slide\s+work/.test(docs.readme)) fail('README describes the Control Board as future work.');
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
runNode(['tools/run_tests.js'], 'Run tests');
checkDeckValidation();
checkBuiltOutputs();
checkBuiltOutputsFresh();
checkManifest();

for (const msg of warnings) console.warn(`WARN: ${msg}`);

if (failures.length) {
  console.error('\nVERIFY FAILED');
  failures.forEach((msg, i) => console.error(`\n${i + 1}. ${msg}`));
  process.exit(1);
}

console.log(`VERIFY PASSED${warnings.length ? ` with ${warnings.length} warning(s)` : ''}.`);
