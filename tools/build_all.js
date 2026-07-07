#!/usr/bin/env node
'use strict';
/*
 * BUILD ALL — regenerate every committed HTML output from its source deck,
 * using the exact flags recorded in tools/build_targets.json.
 *
 * Run this after any engine change so the committed artifacts (index.html and
 * the dist/ previews) stay in sync with the renderer. tools/offline_verify.js
 * uses the same target list to fail if any committed output drifts.
 */
const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const TARGETS = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools', 'build_targets.json'), 'utf8')).targets;

let failed = 0;
for (const t of TARGETS) {
  const result = childProcess.spawnSync(process.execPath, ['engine/build.js', t.deck, ...t.args, '-o', t.out], {
    cwd: ROOT, encoding: 'utf8', windowsHide: true,
  });
  if (result.status !== 0) {
    failed++;
    console.error(`✖ Failed: ${t.out}\n${result.stdout || ''}${result.stderr || ''}`);
  } else {
    console.log(`✔ ${t.out}`);
  }
}

if (failed) {
  console.error(`\n${failed} target(s) failed to build.`);
  process.exit(1);
}
console.log(`\nRebuilt ${TARGETS.length} committed output(s). Run "npm run architect:manifest" then "npm run verify".`);
