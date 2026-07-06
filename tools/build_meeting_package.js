#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const childProcess = require('child_process');

const ROOT = path.resolve(__dirname, '..');

function sha256(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function main() {
  const args = process.argv.slice(2);
  const positional = [];
  const opt = (flag) => { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : null; };
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '-o' || arg === '--out') {
      i++;
      continue;
    }
    if (!arg.startsWith('-')) positional.push(arg);
  }

  const deckArg = positional[0];
  const positionalOut = positional[1];

  if (!deckArg) {
    console.error('Usage: node tools/build_meeting_package.js <deck.json> [packages/<name>/]');
    console.error('   or: node tools/build_meeting_package.js <deck.json> --out packages/<name>/');
    process.exit(1);
  }

  const deckPath = path.resolve(ROOT, deckArg);
  if (!fs.existsSync(deckPath)) {
    console.error(`✖ Deck file not found: ${deckArg}`);
    process.exit(1);
  }

  const deckName = path.basename(deckPath, '.json');
  const outDir = path.resolve(ROOT, opt('-o') || opt('--out') || positionalOut || path.join('packages', deckName));

  fs.mkdirSync(outDir, { recursive: true });

  const htmlFile = path.join(outDir, 'presentation.html');
  const deckCopy = path.join(outDir, 'source-deck.json');
  const readmeFile = path.join(outDir, 'README-open-this-file.txt');
  const manifestFile = path.join(outDir, 'export-manifest.json');

  const buildResult = childProcess.spawnSync(process.execPath, [
    'engine/build.js', deckArg, '-o', htmlFile,
  ], { cwd: ROOT, encoding: 'utf8', windowsHide: true });

  if (buildResult.status !== 0) {
    console.error('✖ Build failed:\n' + (buildResult.stdout || '') + (buildResult.stderr || ''));
    process.exit(1);
  }

  fs.copyFileSync(deckPath, deckCopy);

  const readme = `Meeting Package
===============

Open presentation.html to view the slideshow.
Use the arrow keys or on-screen buttons to navigate.
Press F for fullscreen and P for autoplay.

This package also includes:
  - source-deck.json    (the source data used to build the slides)
  - export-manifest.json (package metadata and file hashes)

All files are self-contained and work offline.
`;
  fs.writeFileSync(readmeFile, readme);

  const manifest = {
    packageType: 'slide-forge-meeting-package',
    deckName,
    sourceDeck: path.relative(ROOT, deckArg).split(path.sep).join('/'),
    generatedAt: new Date().toISOString(),
    files: [
      { path: 'presentation.html', bytes: fs.statSync(htmlFile).size, sha256: sha256(htmlFile) },
      { path: 'source-deck.json', bytes: fs.statSync(deckCopy).size, sha256: sha256(deckCopy) },
      { path: 'README-open-this-file.txt', bytes: fs.statSync(readmeFile).size, sha256: sha256(readmeFile) },
    ],
  };
  fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + '\n');

  console.log(`✔ Meeting package created at ${path.relative(ROOT, outDir)}/`);
  console.log(`  - presentation.html`);
  console.log(`  - source-deck.json`);
  console.log(`  - README-open-this-file.txt`);
  console.log(`  - export-manifest.json`);
}

main();
