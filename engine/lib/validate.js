'use strict';
/*
 * DECK VALIDATOR — checks a deck file before rendering and returns
 * { errors:[], warnings:[] }. Errors block the build with actionable
 * messages; warnings flag density/overflow risks but let the build finish.
 */
const { THEMES } = require('./themes');
const { ICONS } = require('./icons');

const VALID_TYPES = ['title', 'closing', 'agenda', 'org-chart', 'card-sections', 'timeline-matrix', 'comparison', 'section', 'bullets', 'kpi', 'kpi-dashboard'];
const VALID_STATUSES = ['completed', 'inprogress', 'planning'];
const VALID_TRANSITIONS = ['slide', 'fade', 'zoom', 'vertical', 'flip', 'deck', 'none'];
const VALID_ANIMATIONS = ['executive', 'editorial', 'kinetic', 'calm', 'none'];
const VALID_SURFACES = ['classic', 'sharp', 'glass', 'ticket', 'folder', 'paper', 'neon', 'brutalist', 'soft'];
const VALID_BG = ['waves', 'orbs', 'grid', 'none'];

function isStr(v) { return typeof v === 'string' && v.length > 0; }
function isArr(v) { return Array.isArray(v) && v.length > 0; }
function hasVal(v) { return v != null && String(v).length > 0; }
function isAccentRef(v) { return /^a[1-4]$/.test(v) || /^#[0-9a-f]{6}$/i.test(v); }

function validate(deck) {
  const errors = [], warnings = [];
  const err = (path, msg) => errors.push(`${path}: ${msg}`);
  const warn = (path, msg) => warnings.push(`${path}: ${msg}`);

  if (!deck || typeof deck !== 'object') { return { errors: ['Deck file is not a JSON object.'], warnings }; }
  if (!deck.meta || typeof deck.meta !== 'object') err('meta', 'missing — every deck needs a meta object with at least {title, theme}.');
  else {
    if (!isStr(deck.meta.title)) err('meta.title', 'required (used for the browser tab).');
    if (deck.meta.theme && !THEMES[deck.meta.theme]) err('meta.theme', `unknown theme "${deck.meta.theme}". Available: ${Object.keys(THEMES).join(', ')}`);
    if (deck.meta.transition && !VALID_TRANSITIONS.includes(deck.meta.transition)) err('meta.transition', `must be one of: ${VALID_TRANSITIONS.join(', ')}`);
    if (deck.meta.animationProfile && !VALID_ANIMATIONS.includes(deck.meta.animationProfile)) err('meta.animationProfile', `must be one of: ${VALID_ANIMATIONS.join(', ')}`);
    if (deck.meta.surfaceStyle && !VALID_SURFACES.includes(deck.meta.surfaceStyle)) err('meta.surfaceStyle', `must be one of: ${VALID_SURFACES.join(', ')}`);
    if (deck.meta.background && !VALID_BG.includes(deck.meta.background)) err('meta.background', `must be one of: ${VALID_BG.join(', ')}`);
    if (deck.meta.autoplaySeconds != null && (typeof deck.meta.autoplaySeconds !== 'number' || deck.meta.autoplaySeconds < 3)) err('meta.autoplaySeconds', 'must be a number ≥ 3.');
  }
  if (!isArr(deck.slides)) { err('slides', 'must be a non-empty array of slide objects.'); return { errors, warnings }; }
  if (deck.slides.length > 30) warn('slides', `${deck.slides.length} slides — navigation dots get crowded past 30.`);

  deck.slides.forEach((s, i) => {
    const p = `slides[${i}]`;
    if (!s || typeof s !== 'object') return err(p, 'not an object.');
    if (!VALID_TYPES.includes(s.type)) return err(`${p}.type`, `unknown type "${s.type}". Available types: ${VALID_TYPES.join(', ')}`);
    if (s.themeOverride && !THEMES[s.themeOverride]) err(`${p}.themeOverride`, `unknown theme "${s.themeOverride}". Available: ${Object.keys(THEMES).join(', ')}`);
    if (s.surfaceStyle && !VALID_SURFACES.includes(s.surfaceStyle)) err(`${p}.surfaceStyle`, `must be one of: ${VALID_SURFACES.join(', ')}`);

    switch (s.type) {
      case 'title': case 'closing': case 'section':
        if (!isStr(s.heading)) err(`${p}.heading`, 'required.');
        if (s.heading && s.heading.length > 46) warn(`${p}.heading`, `${s.heading.length} chars — titles over ~46 chars may wrap to two lines.`);
        break;
      case 'agenda':
        if (!isArr(s.items)) err(`${p}.items`, 'required — array of strings.');
        else {
          if (s.items.length > 8) warn(`${p}.items`, `${s.items.length} items — more than 8 agenda rows will overflow the slide. Split into two agenda slides.`);
          s.items.forEach((it, j) => { if (!isStr(it)) err(`${p}.items[${j}]`, 'must be a non-empty string.'); });
        }
        break;
      case 'org-chart':
        if (!isStr(s.heading)) err(`${p}.heading`, 'required.');
        if (!s.leader || !isStr(s.leader.name)) err(`${p}.leader`, 'required — {title, name}.');
        ['left', 'right'].forEach(sideKey => {
          const sb = s[sideKey];
          if (sb == null) return;
          if (typeof sb !== 'object' || Array.isArray(sb) || !isArr(sb.names)) {
            err(`${p}.${sideKey}`, 'when present, must be an object {title, names[]} with a non-empty names array.');
          }
        });
        if (!isArr(s.divisions)) err(`${p}.divisions`, 'required — array of {name, badge, accent, teams[]}.');
        else {
          if (s.divisions.length > 3) warn(`${p}.divisions`, `${s.divisions.length} divisions — more than 3 columns get cramped at 1920px.`);
          s.divisions.forEach((dv, j) => {
            const dp = `${p}.divisions[${j}]`;
            if (!isStr(dv.name)) err(`${dp}.name`, 'required.');
            if (!isArr(dv.teams)) return err(`${dp}.teams`, 'required — array of {name, members[]}.');
            const memberRows = dv.teams.reduce((n, t) => n + (t.members ? t.members.length : 0), 0);
            if (dv.teams.length + memberRows > 13) warn(dp, `${dv.teams.length} teams / ${memberRows} members — column may overflow vertically (keep teams+members ≤ 13 rows).`);
            dv.teams.forEach((t, k) => {
              const tp = `${dp}.teams[${k}]`;
              if (!isStr(t.name)) err(`${tp}.name`, 'required.');
              if (!isArr(t.members)) return err(`${tp}.members`, 'required — array of {initials, name, role}.');
              t.members.forEach((m, l) => {
                if (!isStr(m.initials) || m.initials.length > 2) err(`${tp}.members[${l}].initials`, 'required, max 2 characters.');
                if (!isStr(m.name)) err(`${tp}.members[${l}].name`, 'required.');
              });
            });
          });
        }
        break;
      case 'card-sections':
        if (!isStr(s.heading)) err(`${p}.heading`, 'required.');
        if (!isArr(s.sections)) err(`${p}.sections`, 'required — array of {label, icon, accent, grid, cards[]}.');
        else s.sections.forEach((sec, j) => {
          const sp = `${p}.sections[${j}]`;
          if (!isStr(sec.label)) err(`${sp}.label`, 'required.');
          if (!isArr(sec.cards)) return err(`${sp}.cards`, 'required — array of {icon, badge, title, body}.');
          if (sec.cards.length > 4) warn(`${sp}.cards`, `${sec.cards.length} cards — more than 4 per section overflows; use grid:2 and max 4.`);
          sec.cards.forEach((c, k) => {
            if (!isStr(c.title)) err(`${sp}.cards[${k}].title`, 'required.');
            if (c.body && c.body.length > 160) warn(`${sp}.cards[${k}].body`, `${c.body.length} chars — bodies over ~160 chars may overflow the card.`);
          });
        });
        break;
      case 'timeline-matrix':
        if (!isStr(s.heading)) err(`${p}.heading`, 'required.');
        if (!isArr(s.months)) err(`${p}.months`, 'required — array of column labels.');
        else if (s.months.length > 6) warn(`${p}.months`, `${s.months.length} columns — more than 6 makes cards too narrow.`);
        if (!isArr(s.columns)) err(`${p}.columns`, 'required — one array of project objects per month.');
        else {
          if (s.months && s.columns.length !== s.months.length) err(`${p}.columns`, `has ${s.columns.length} entries but months has ${(s.months || []).length} — they must match 1:1.`);
          s.columns.forEach((col, j) => {
            if (!Array.isArray(col) || !col.length) return err(`${p}.columns[${j}]`, 'must be a non-empty array of {name, status, badge?}.');
            col.forEach((proj, k) => {
              const pp = `${p}.columns[${j}][${k}]`;
              if (!isStr(proj.name)) err(`${pp}.name`, 'required.');
              if (!VALID_STATUSES.includes(proj.status)) err(`${pp}.status`, `"${proj.status}" invalid — use: ${VALID_STATUSES.join(', ')}`);
            });
          });
        }
        break;
      case 'comparison':
        if (!isStr(s.heading)) err(`${p}.heading`, 'required.');
        if (!isArr(s.cards)) err(`${p}.cards`, 'required — array of {icon, accent, name, paragraphs[]}.');
        else {
          if (s.cards.length > 4) warn(`${p}.cards`, 'more than 4 comparison cards gets cramped — 3 is ideal.');
          s.cards.forEach((c, j) => {
            if (!isStr(c.name)) err(`${p}.cards[${j}].name`, 'required.');
            if (!isArr(c.paragraphs)) err(`${p}.cards[${j}].paragraphs`, 'required — array of strings.');
          });
        }
        if (s.banner && (!isStr(s.banner.title) || !isArr(s.banner.lines))) err(`${p}.banner`, 'needs {title, lines[]} (icon optional).');
        break;
      case 'bullets':
        if (!isStr(s.heading)) err(`${p}.heading`, 'required.');
        if (!isArr(s.groups)) err(`${p}.groups`, 'required — array of {title, icon, accent, items[]}.');
        else s.groups.forEach((g, j) => {
          if (!isStr(g.title)) err(`${p}.groups[${j}].title`, 'required.');
          if (!isArr(g.items)) err(`${p}.groups[${j}].items`, 'required — array of strings.');
          else if (g.items.length > 6) warn(`${p}.groups[${j}].items`, `${g.items.length} items — more than 6 per group risks overflow.`);
        });
        break;
      case 'kpi':
        if (!isStr(s.heading)) err(`${p}.heading`, 'required.');
        if (!isArr(s.tiles)) err(`${p}.tiles`, 'required — array of {value, label, sub?, accent?}.');
        else {
          if (s.tiles.length > 4) warn(`${p}.tiles`, `${s.tiles.length} tiles — 4 max fit in one row; extras shrink.`);
          s.tiles.forEach((t, j) => {
            if (!hasVal(t.value)) err(`${p}.tiles[${j}].value`, 'required — the big number/metric.');
            else if (String(t.value).length > 7) warn(`${p}.tiles[${j}].value`, `"${t.value}" is ${String(t.value).length} chars — KPI values over 7 chars shrink or overflow.`);
            if (!isStr(t.label)) err(`${p}.tiles[${j}].label`, 'required.');
          });
        }
        break;
      case 'kpi-dashboard':
        if (!isStr(s.heading)) err(`${p}.heading`, 'required.');
        if (!isArr(s.rows)) err(`${p}.rows`, 'required — array of {label, tiles[]}.');
        else {
          if (s.rows.length > 2) warn(`${p}.rows`, `${s.rows.length} rows — more than 2 rows may overflow.`);
          s.rows.forEach((r, j) => {
            const rp = `${p}.rows[${j}]`;
            if (!isStr(r.label)) err(`${rp}.label`, 'required.');
            if (!isArr(r.tiles)) err(`${rp}.tiles`, 'required — array of {value, label, sub?, accent?}.');
            else {
              if (r.tiles.length > 4) warn(`${rp}.tiles`, `${r.tiles.length} tiles — 4 max fit in one row.`);
              r.tiles.forEach((t, k) => {
                if (!hasVal(t.value)) err(`${rp}.tiles[${k}].value`, 'required — the big number/metric.');
                else if (String(t.value).length > 7) warn(`${rp}.tiles[${k}].value`, `"${t.value}" is ${String(t.value).length} chars — KPI values over 7 chars shrink or overflow.`);
                if (!isStr(t.label)) err(`${rp}.tiles[${k}].label`, 'required.');
              });
            }
          });
        }
        break;
    }
    /* icon + accent references (best-effort walk) */
    JSON.stringify(s, (key, val) => {
      if (key === 'icon' && isStr(val) && !ICONS[val]) warn(`${p}`, `icon "${val}" not in library — will fall back to a dot. Valid: ${Object.keys(ICONS).join(', ')}`);
      if (key === 'accent' && isStr(val) && !isAccentRef(val)) warn(`${p}`, `accent "${val}" is not a slot (a1–a4) or 6-digit hex (#rrggbb) — it will silently fall back to a default color.`);
      return val;
    });
  });

  return { errors, warnings };
}

module.exports = { validate, VALID_TYPES, VALID_TRANSITIONS, VALID_ANIMATIONS, VALID_SURFACES, VALID_BG };
