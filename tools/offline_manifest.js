#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'OFFLINE_MANIFEST.json');

const INCLUDE_DIRS = ['decks', 'dist', 'docs', 'engine', 'skills', 'tasks', 'tools'];
const INCLUDE_FILES = ['AGENTS.md', 'README.md', 'PLAN.md', 'package.json', 'index.html'];
const EXCLUDE_NAMES = new Set(['.git', '.agents', '.codex', 'OFFLINE_MANIFEST.json']);

function toPosix(p) {
  return p.split(path.sep).join('/');
}

function sha256(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function walk(dir, acc) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (EXCLUDE_NAMES.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (entry.isFile()) acc.push(full);
  }
}

function collectFiles() {
  const files = [];
  for (const f of INCLUDE_FILES) {
    const full = path.join(ROOT, f);
    if (fs.existsSync(full)) files.push(full);
  }
  for (const d of INCLUDE_DIRS) {
    const full = path.join(ROOT, d);
    if (fs.existsSync(full)) walk(full, files);
  }
  return [...new Set(files)].sort((a, b) =>
    toPosix(path.relative(ROOT, a)).localeCompare(toPosix(path.relative(ROOT, b)))
  );
}

const files = collectFiles().map(file => ({
  path: toPosix(path.relative(ROOT, file)),
  bytes: fs.statSync(file).size,
  sha256: sha256(file),
}));

const manifest = {
  schema: 1,
  purpose: 'Creator-maintained drift manifest for Slide Forge. Regenerate only after intentional verified changes.',
  generatedAt: new Date().toISOString(),
  files,
};

fs.writeFileSync(OUT, JSON.stringify(manifest, null, 2) + '\n');
console.log(`Wrote ${path.relative(ROOT, OUT)} with ${files.length} files.`);
