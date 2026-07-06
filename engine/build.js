#!/usr/bin/env node
'use strict';
/*
 * SLIDE FORGE — build a self-contained HTML slideshow from a deck JSON file.
 *
 *   node engine/build.js decks/my-deck.json [-o dist/my-deck.html]
 *                                           [--theme <name>]   override deck theme
 *                                           [--transition slide|fade|zoom]
 *   node engine/build.js --list             show themes, slide types, icons
 *
 * The output is one HTML file with zero external dependencies — open it by
 * double-clicking, no server or internet required.
 */
const fs = require('fs');
const path = require('path');
const { THEMES } = require('./lib/themes');
const { ICONS } = require('./lib/icons');
const { validate, VALID_TYPES } = require('./lib/validate');
const { buildCss } = require('./lib/css');
const { buildRuntime } = require('./lib/runtime');
const { renderSlide } = require('./lib/render');

function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

function listEverything() {
  console.log('\nTHEMES');
  for (const [k, t] of Object.entries(THEMES)) console.log(`  ${k.padEnd(18)} ${t.label}`);
  console.log('\nSLIDE TYPES');
  console.log('  ' + VALID_TYPES.join(', '));
  console.log('\nICONS');
  console.log('  ' + Object.keys(ICONS).join(', '));
  console.log('\nTRANSITIONS\n  slide, fade, zoom');
  console.log('\nBACKGROUNDS\n  waves, orbs, grid, none (defaults to the theme\'s own)\n');
}

function main(argv) {
  const args = argv.slice(2);
  if (!args.length || args.includes('--help') || args.includes('-h')) {
    console.log('Usage: node engine/build.js <deck.json> [-o out.html] [--theme name] [--transition slide|fade|zoom]');
    console.log('       node engine/build.js --list');
    process.exit(args.length ? 0 : 1);
  }
  if (args.includes('--list')) { listEverything(); process.exit(0); }

  const deckPath = args.find(a => !a.startsWith('-') && (args[args.indexOf(a) - 1] || '').charAt(0) !== '-');
  const opt = (flag) => { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : null; };
  const outPath = opt('-o') || opt('--out') ||
    path.join('dist', path.basename(deckPath || 'deck', '.json') + '.html');

  if (!deckPath || !fs.existsSync(deckPath)) {
    console.error(`✖ Deck file not found: ${deckPath || '(none given)'}`);
    console.error('  Available decks:');
    if (fs.existsSync('decks')) fs.readdirSync('decks').filter(f => f.endsWith('.json')).forEach(f => console.error(`    decks/${f}`));
    process.exit(1);
  }

  let deck;
  try { deck = JSON.parse(fs.readFileSync(deckPath, 'utf8')); }
  catch (e) {
    console.error(`✖ ${deckPath} is not valid JSON: ${e.message}`);
    console.error('  Tip: check for trailing commas, unquoted keys, or unescaped quotes inside strings.');
    process.exit(1);
  }

  /* CLI overrides */
  const themeFlag = opt('--theme');
  if (themeFlag) { deck.meta = deck.meta || {}; deck.meta.theme = themeFlag; }
  const transFlag = opt('--transition');
  if (transFlag) { deck.meta = deck.meta || {}; deck.meta.transition = transFlag; }

  /* validate */
  const { errors, warnings } = validate(deck);
  if (errors.length) {
    console.error(`✖ ${deckPath} failed validation with ${errors.length} error(s):\n`);
    errors.forEach(e => console.error(`  • ${e}`));
    console.error('\n  Fix the deck file and rebuild. See skills/deck-schema.md for the full reference.');
    process.exit(1);
  }

  const themeName = deck.meta.theme || 'midnight-tech';
  const theme = THEMES[themeName];

  /* resolve per-slide mode + collect override themes used */
  const overridesUsed = {};
  deck.slides.forEach(s => {
    if (s.themeOverride && s.themeOverride !== themeName) {
      overridesUsed[s.themeOverride] = THEMES[s.themeOverride];
      s._ovr = s.themeOverride;
    }
    const effTheme = s.themeOverride ? THEMES[s.themeOverride] : theme;
    s._mode = s.type === 'timeline-matrix' ? 'light' : effTheme.mode;
  });

  /* render slides */
  const ctx = { deck, theme, warnings };
  const slidesHtml = deck.slides.map((s, i) => renderSlide(s, i, ctx)).join('\n\n');

  /* ambient background */
  const bgType = deck.meta.background || theme.background.type;
  const orbs = bgType === 'orbs' ? `
  <div class="orb" style="width:640px;height:640px;left:-160px;top:520px;background:rgba(${theme.accents.a1.glow},.5)"></div>
  <div class="orb" style="width:540px;height:540px;right:-120px;top:-140px;background:rgba(${theme.accents.a4.glow},.45);animation-delay:-8s"></div>
  <div class="orb" style="width:460px;height:460px;right:180px;bottom:-180px;background:rgba(${theme.accents.a2.glow},.4);animation-delay:-15s"></div>` : '';

  const config = {
    bg: bgType === 'orbs' ? 'none' : bgType,
    pFrom: theme.particles.from,
    pTo: theme.particles.to,
    autoplayMs: (deck.meta.autoplaySeconds || 12) * 1000,
  };

  const transition = deck.meta.transition || 'slide';
  const css = buildCss(theme, overridesUsed);
  const js = buildRuntime(config);
  const hint = deck.meta.hint !== false
    ? `<div id="toast">&#8592; &#8594; navigate &nbsp;&middot;&nbsp; F fullscreen &nbsp;&middot;&nbsp; P autoplay</div>`
    : `<div id="toast" hidden></div>`;

  const html = `<!DOCTYPE html>
<html lang="${esc(deck.meta.lang || 'en')}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(deck.meta.title)}</title>
<style>
${css}
</style>
</head>
<body class="trans-${esc(transition)}">
<div id="stage" style="--dir:1">
  <canvas id="fx" width="1920" height="1080"></canvas>${orbs}

${slidesHtml}

  <div id="chrome">
    <div id="hair"><i></i></div>
    <button id="prev" class="navbtn" aria-label="Previous slide">&#8249;</button>
    <button id="next" class="navbtn" aria-label="Next slide">&#8250;</button>
    <div id="dots"></div>
    <div id="counter">1 / ${deck.slides.length}</div>
    ${hint}
  </div>
</div>

<script>
${js}
</script>
</body>
</html>
`;

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html);

  warnings.forEach(w => console.warn(`⚠ ${w}`));
  const kb = (Buffer.byteLength(html) / 1024).toFixed(1);
  console.log(`✔ Built ${outPath} — ${deck.slides.length} slides, theme "${themeName}", transition "${transition}", ${kb} KB, self-contained.`);
  if (warnings.length) console.log(`  (${warnings.length} warning(s) above — the deck built, but review them before presenting.)`);
}

main(process.argv);
