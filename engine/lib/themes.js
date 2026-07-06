'use strict';
/*
 * THEME REGISTRY
 * A theme is a complete visual identity: page background, card surfaces,
 * text colors, four named accent slots (a1..a4), fonts, shape radius,
 * ambient background effect, and particle colors.
 *
 * Accent slots — every piece of deck content that needs a color refers to
 * a slot ("a1".."a4") or a raw hex ("#2dd4d4"). Slots keep decks portable:
 * the same deck re-renders correctly in any theme.
 *   slot = { color, bright, grad:[c1,c2], glow:'r,g,b', pillBg }
 */

const FONT_STACKS = {
  modern:  `"Segoe UI","Helvetica Neue",Arial,"Noto Sans",sans-serif`,
  elegant: `Georgia,"Times New Roman",serif`,
  mono:    `"Cascadia Code",Consolas,"Courier New",monospace`,
};

function hexToRgb(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return '128,128,128';
  return `${parseInt(m[1], 16)},${parseInt(m[2], 16)},${parseInt(m[3], 16)}`;
}

function slot(color, bright, grad, pillBg) {
  return { color, bright, grad, glow: hexToRgb(color), pillBg: pillBg || `rgba(${hexToRgb(color)},.18)` };
}

/* Semantic status colors (timeline pills, legends). Same across themes
 * unless a theme overrides them — they carry meaning, not branding. */
const SEMANTIC = {
  green:  { fg: '#22a453', bg: '#e4f6ea' },
  blue:   { fg: '#1d7fd6', bg: '#e3f0fc' },
  orange: { fg: '#e8940a', bg: '#fdf0d7' },
  prep:   '#7c3aed',
  mvp:    '#e2492f',
  augred: '#c2410c',
};

const THEMES = {
  /* ------------------------------------------------------------------ */
  'midnight-tech': {
    label: 'Midnight Tech — deep navy, cyan & purple glows (the flagship)',
    mode: 'dark',
    fonts: { heading: FONT_STACKS.modern, body: FONT_STACKS.modern },
    radius: { card: '14px', cardLg: '16px', cardXl: '18px' },
    background: {
      type: 'waves',
      stage: `radial-gradient(600px 240px at 88% 4%, rgba(60,130,220,.16), transparent 70%),
    radial-gradient(120% 90% at 78% 8%, #0e2c52 0%, rgba(14,44,82,0) 55%),
    radial-gradient(100% 80% at 10% 100%, #0a1f3d 0%, rgba(10,31,61,0) 50%),
    linear-gradient(155deg,#071127 0%,#050d20 45%,#03081a 100%)`,
      page: '#04091a',
    },
    particles: { from: [26, 95, 174], to: [34, 211, 238] },
    colors: {
      textHi: '#f4f8ff', textMid: '#c7d5ea', textLow: '#8fa3c0',
      cardBg: 'linear-gradient(180deg,rgba(20,42,78,.55),rgba(9,20,42,.65))',
      cardBorder: 'rgba(56,130,220,.35)',
      chipBg: 'rgba(10,24,50,.75)', badgeBg: 'rgba(15,30,60,.5)', badgeBorder: 'rgba(150,180,220,.4)',
      rule: 'rgba(120,160,210,.25)', ruleSoft: 'rgba(120,160,210,.22)', connector: 'rgba(140,180,230,.5)',
      glow: '34,211,238',
    },
    accents: {
      a1: slot('#22d3ee', '#4ff5ff', ['#2563eb', '#22d3ee'], 'rgba(20,90,110,.35)'),
      a2: slot('#4da3ff', '#7cc0ff', ['#2563eb', '#22d3ee'], 'rgba(30,80,160,.35)'),
      a3: slot('#2dd4a8', '#2dd4a8', ['#0d9488', '#34d399'], 'rgba(16,90,70,.35)'),
      a4: slot('#a78bfa', '#c4b5fd', ['#7c3aed', '#a78bfa'], 'rgba(88,60,160,.35)'),
    },
    light: { /* palette used when a light slide (e.g. timeline) lives inside this deck */
      bg: '#f4f6f9', panel: '#eceff3', card: '#ffffff', cardBorder: '#e3e8ee',
      header: '#1b2a41', title: '#1785c7', text: '#2b3648', textSoft: '#4a5568',
      footText: '#8a94a6', footRule: '#dfe3e9',
    },
    semantic: SEMANTIC,
  },
  /* ------------------------------------------------------------------ */
  'corporate-light': {
    label: 'Corporate Light — clean white, navy headers, blue titles',
    mode: 'light',
    fonts: { heading: FONT_STACKS.modern, body: FONT_STACKS.modern },
    radius: { card: '10px', cardLg: '12px', cardXl: '14px' },
    background: { type: 'none', stage: '#f4f6f9', page: '#e7eaef' },
    particles: { from: [160, 190, 225], to: [110, 160, 215] },
    colors: {
      textHi: '#1b2a41', textMid: '#3d4c63', textLow: '#7c8aa0',
      cardBg: '#ffffff', cardBorder: '#e3e8ee',
      chipBg: '#eef2f7', badgeBg: '#eef2f7', badgeBorder: '#d4dce6',
      rule: '#dfe3e9', ruleSoft: '#e6eaef', connector: '#b9c5d4',
      glow: '23,133,199',
    },
    accents: {
      a1: slot('#1785c7', '#1785c7', ['#1785c7', '#22d3ee']),
      a2: slot('#2563eb', '#2563eb', ['#2563eb', '#60a5fa']),
      a3: slot('#0d9488', '#0d9488', ['#0d9488', '#34d399']),
      a4: slot('#7c3aed', '#7c3aed', ['#7c3aed', '#a78bfa']),
    },
    light: {
      bg: '#f4f6f9', panel: '#eceff3', card: '#ffffff', cardBorder: '#e3e8ee',
      header: '#1b2a41', title: '#1785c7', text: '#2b3648', textSoft: '#4a5568',
      footText: '#8a94a6', footRule: '#dfe3e9',
    },
    semantic: SEMANTIC,
  },
  /* ------------------------------------------------------------------ */
  'emerald-night': {
    label: 'Emerald Night — dark forest greens with mint & gold accents',
    mode: 'dark',
    fonts: { heading: FONT_STACKS.modern, body: FONT_STACKS.modern },
    radius: { card: '14px', cardLg: '16px', cardXl: '18px' },
    background: {
      type: 'waves',
      stage: `radial-gradient(600px 240px at 88% 4%, rgba(52,211,153,.13), transparent 70%),
    radial-gradient(120% 90% at 78% 8%, #0a3d2e 0%, rgba(10,61,46,0) 55%),
    radial-gradient(100% 80% at 10% 100%, #07301f 0%, rgba(7,48,31,0) 50%),
    linear-gradient(155deg,#06231a 0%,#041a12 45%,#02130c 100%)`,
      page: '#02130c',
    },
    particles: { from: [16, 110, 80], to: [52, 211, 153] },
    colors: {
      textHi: '#f2fdf8', textMid: '#c4e5d6', textLow: '#87b3a1',
      cardBg: 'linear-gradient(180deg,rgba(16,64,48,.55),rgba(7,32,24,.65))',
      cardBorder: 'rgba(52,180,130,.35)',
      chipBg: 'rgba(8,40,30,.75)', badgeBg: 'rgba(10,45,35,.5)', badgeBorder: 'rgba(140,210,180,.4)',
      rule: 'rgba(120,200,165,.25)', ruleSoft: 'rgba(120,200,165,.22)', connector: 'rgba(130,210,175,.5)',
      glow: '52,211,153',
    },
    accents: {
      a1: slot('#34d399', '#6ee7b7', ['#059669', '#34d399'], 'rgba(16,80,58,.4)'),
      a2: slot('#22d3ee', '#67e8f9', ['#0891b2', '#22d3ee'], 'rgba(14,74,90,.4)'),
      a3: slot('#a3e635', '#bef264', ['#65a30d', '#a3e635'], 'rgba(60,84,16,.4)'),
      a4: slot('#fbbf24', '#fcd34d', ['#d97706', '#fbbf24'], 'rgba(96,68,12,.4)'),
    },
    light: {
      bg: '#f3f8f5', panel: '#e9f1ec', card: '#ffffff', cardBorder: '#dde8e2',
      header: '#123c2c', title: '#0d9468', text: '#26463a', textSoft: '#43665a',
      footText: '#88998f', footRule: '#dbe5df',
    },
    semantic: SEMANTIC,
  },
  /* ------------------------------------------------------------------ */
  'royal-violet': {
    label: 'Royal Violet — regal deep purple with magenta & gold',
    mode: 'dark',
    fonts: { heading: FONT_STACKS.modern, body: FONT_STACKS.modern },
    radius: { card: '14px', cardLg: '16px', cardXl: '18px' },
    background: {
      type: 'orbs',
      stage: `radial-gradient(600px 240px at 88% 4%, rgba(167,139,250,.16), transparent 70%),
    radial-gradient(120% 90% at 78% 8%, #2e1a5e 0%, rgba(46,26,94,0) 55%),
    radial-gradient(100% 80% at 10% 100%, #23124a 0%, rgba(35,18,74,0) 50%),
    linear-gradient(155deg,#1b0f3a 0%,#140a2c 45%,#0c061e 100%)`,
      page: '#0c061e',
    },
    particles: { from: [110, 70, 200], to: [200, 160, 255] },
    colors: {
      textHi: '#f8f5ff', textMid: '#d5cbee', textLow: '#a292c8',
      cardBg: 'linear-gradient(180deg,rgba(55,35,110,.5),rgba(28,16,60,.65))',
      cardBorder: 'rgba(140,110,230,.35)',
      chipBg: 'rgba(28,16,62,.75)', badgeBg: 'rgba(35,22,72,.5)', badgeBorder: 'rgba(180,160,230,.4)',
      rule: 'rgba(170,150,230,.25)', ruleSoft: 'rgba(170,150,230,.22)', connector: 'rgba(180,160,235,.5)',
      glow: '167,139,250',
    },
    accents: {
      a1: slot('#a78bfa', '#c4b5fd', ['#7c3aed', '#a78bfa'], 'rgba(88,60,160,.4)'),
      a2: slot('#f472b6', '#f9a8d4', ['#db2777', '#f472b6'], 'rgba(130,38,90,.4)'),
      a3: slot('#22d3ee', '#67e8f9', ['#0891b2', '#22d3ee'], 'rgba(14,74,90,.4)'),
      a4: slot('#facc15', '#fde047', ['#ca8a04', '#facc15'], 'rgba(100,70,10,.4)'),
    },
    light: {
      bg: '#f7f5fb', panel: '#efecf6', card: '#ffffff', cardBorder: '#e5e0ef',
      header: '#2a1b52', title: '#7c3aed', text: '#372b52', textSoft: '#584a78',
      footText: '#948aa8', footRule: '#e3ddef',
    },
    semantic: SEMANTIC,
  },
  /* ------------------------------------------------------------------ */
  'sunset-ember': {
    label: 'Sunset Ember — warm charcoal with amber, coral & rose',
    mode: 'dark',
    fonts: { heading: FONT_STACKS.modern, body: FONT_STACKS.modern },
    radius: { card: '14px', cardLg: '16px', cardXl: '18px' },
    background: {
      type: 'waves',
      stage: `radial-gradient(600px 240px at 88% 4%, rgba(251,146,60,.14), transparent 70%),
    radial-gradient(120% 90% at 78% 8%, #4a1f14 0%, rgba(74,31,20,0) 55%),
    radial-gradient(100% 80% at 10% 100%, #3a1020 0%, rgba(58,16,32,0) 50%),
    linear-gradient(155deg,#2a1210 0%,#1e0c10 45%,#140609 100%)`,
      page: '#140609',
    },
    particles: { from: [180, 80, 40], to: [255, 170, 90] },
    colors: {
      textHi: '#fff8f2', textMid: '#ecd4c4', textLow: '#bb9784',
      cardBg: 'linear-gradient(180deg,rgba(80,40,30,.5),rgba(40,18,16,.65))',
      cardBorder: 'rgba(220,130,80,.35)',
      chipBg: 'rgba(50,22,16,.75)', badgeBg: 'rgba(60,28,20,.5)', badgeBorder: 'rgba(230,180,150,.4)',
      rule: 'rgba(230,170,130,.25)', ruleSoft: 'rgba(230,170,130,.22)', connector: 'rgba(235,180,140,.5)',
      glow: '251,146,60',
    },
    accents: {
      a1: slot('#fb923c', '#fdba74', ['#ea580c', '#fb923c'], 'rgba(120,60,20,.4)'),
      a2: slot('#f43f5e', '#fda4af', ['#be123c', '#f43f5e'], 'rgba(120,25,45,.4)'),
      a3: slot('#fbbf24', '#fde68a', ['#d97706', '#fbbf24'], 'rgba(110,80,15,.4)'),
      a4: slot('#a78bfa', '#c4b5fd', ['#7c3aed', '#a78bfa'], 'rgba(88,60,160,.4)'),
    },
    light: {
      bg: '#faf6f2', panel: '#f3ede6', card: '#ffffff', cardBorder: '#ece2d8',
      header: '#43241a', title: '#d9660d', text: '#4a352b', textSoft: '#6e564a',
      footText: '#a4948a', footRule: '#eadfd6',
    },
    semantic: SEMANTIC,
  },
  /* ------------------------------------------------------------------ */
  'polar-light': {
    label: 'Polar Light — airy white & ice blue, full-light minimal deck',
    mode: 'light',
    fonts: { heading: FONT_STACKS.modern, body: FONT_STACKS.modern },
    radius: { card: '12px', cardLg: '14px', cardXl: '16px' },
    background: {
      type: 'waves',
      stage: `radial-gradient(700px 280px at 85% 0%, rgba(56,150,220,.10), transparent 70%),
    linear-gradient(160deg,#fbfdff 0%,#f2f6fb 50%,#e9eff7 100%)`,
      page: '#dfe6ef',
    },
    particles: { from: [175, 200, 230], to: [110, 165, 220] },
    colors: {
      textHi: '#152238', textMid: '#3c4d68', textLow: '#7e8ca3',
      cardBg: 'linear-gradient(180deg,#ffffff,#f7fafd)',
      cardBorder: '#dde5ee',
      chipBg: '#eef4fa', badgeBg: '#eef4fa', badgeBorder: '#d2dde9',
      rule: '#d9e1ea', ruleSoft: '#e2e8f0', connector: '#b9c8d9',
      glow: '30,120,200',
    },
    accents: {
      a1: slot('#0f7fd0', '#0f7fd0', ['#0f7fd0', '#38bdf8']),
      a2: slot('#2563eb', '#2563eb', ['#2563eb', '#60a5fa']),
      a3: slot('#0d9488', '#0d9488', ['#0d9488', '#34d399']),
      a4: slot('#7c3aed', '#7c3aed', ['#7c3aed', '#a78bfa']),
    },
    light: {
      bg: '#f4f7fa', panel: '#eaeff5', card: '#ffffff', cardBorder: '#dde5ee',
      header: '#1a2c47', title: '#0f7fd0', text: '#2b3a52', textSoft: '#4c5e78',
      footText: '#8b98ab', footRule: '#dde3ec',
    },
    semantic: SEMANTIC,
  },
};

/* Resolve an accent reference — a slot name ("a1".."a4") or a raw hex
 * ("#2dd4d4") — into a full slot object. Raw hex builds a slot on the fly
 * so decks can pin exact brand colors when slots aren't enough. */
function resolveAccent(theme, ref, fallback = 'a1') {
  if (!ref) ref = fallback;
  if (theme.accents[ref]) return theme.accents[ref];
  if (/^#[0-9a-f]{6}$/i.test(ref)) return slot(ref, ref, [ref, ref]);
  return theme.accents[fallback];
}

module.exports = { THEMES, FONT_STACKS, resolveAccent, hexToRgb };
