#!/usr/bin/env node
'use strict';
/*
 * DECK MAP — print the "address book" of a deck: every editable text/data slot
 * with its exact JSON path and current value.
 *
 *   node tools/deck_map.js                       (defaults to the flagship deck)
 *   node tools/deck_map.js decks/my-deck.json
 *
 * Purpose: the human decides which source value goes into which address; the
 * weak agent only places the value at that address. No mapping guesswork.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const deckArg = process.argv[2] || 'decks/seegp-ax-monthly.json';
const deckPath = path.resolve(ROOT, deckArg);

if (!fs.existsSync(deckPath)) {
  console.error(`Deck not found: ${deckArg}`);
  process.exit(1);
}

let deck;
try { deck = JSON.parse(fs.readFileSync(deckPath, 'utf8')); }
catch (e) { console.error(`${deckArg} is not valid JSON: ${e.message}`); process.exit(1); }

/* Keys that are design/structure, not content the user edits by hand. */
const DESIGN_KEYS = new Set(['type', 'accent', 'teamAccent', 'icon', 'surfaceStyle',
  'themeOverride', 'grid', 'airy', 'background', 'animationProfile', 'transition', 'hint', 'lang']);

const leaves = (node, p, out) => {
  if (node == null) return;
  if (typeof node !== 'object') { out.push([p, String(node)]); return; }
  if (Array.isArray(node)) { node.forEach((v, i) => leaves(v, `${p}[${i}]`, out)); return; }
  for (const k of Object.keys(node)) {
    if (p === '' && DESIGN_KEYS.has(k)) continue;          // hide deck-level design
    leaves(node[k], p ? `${p}.${k}` : k, out, k);
  }
};

const trunc = (s) => (s.length > 58 ? s.slice(0, 55) + '...' : s);
const rel = path.relative(ROOT, deckPath).split(path.sep).join('/');
const slides = Array.isArray(deck.slides) ? deck.slides : [];

console.log(`\nDECK ADDRESS BOOK — ${rel}  (${slides.length} slides)\n`);
console.log('Give the agent an address (left) and the exact new value. It only places the value there.\n');

slides.forEach((s, i) => {
  const label = s.heading || (Array.isArray(s.items) ? 'agenda' : '') || `slide ${i + 1}`;
  const idx = s.index ? ` [${s.index}]` : '';
  console.log('─'.repeat(74));
  console.log(`Slide ${i + 1}  ·  ${s.type}${idx}  ·  "${label}"`);
  console.log('─'.repeat(74));
  const out = [];
  for (const k of Object.keys(s)) {
    if (k === 'type') continue;
    leaves(s[k], `slides[${i}].${k}`, out);
  }
  const width = Math.min(58, out.reduce((m, [pth]) => Math.max(m, pth.length), 0));
  out.forEach(([pth, val]) => console.log(`  ${pth.padEnd(width)}  "${trunc(val)}"`));
  console.log('');
});

console.log(`Tip: copy an address exactly (e.g. slides[6].cards[0].paragraphs[0]) into a task card.`);
console.log(`Full field reference: skills/deck-schema.md\n`);
