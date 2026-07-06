'use strict';
/*
 * ICON LIBRARY — inline SVGs, all drawn with currentColor so they inherit
 * whatever accent color their container sets. Referenced from decks by name.
 * Unknown names fall back to 'dot' (build.js emits a warning).
 */
const S = 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';

const ICONS = {
  dot:      `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" fill="currentColor"/></svg>`,
  bulb:     `<svg viewBox="0 0 24 24" ${S}><path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-4 10.5c.8.7 1 1.6 1 2.5h6c0-.9.2-1.8 1-2.5A6 6 0 0 0 12 3z"/></svg>`,
  code:     `<svg viewBox="0 0 24 24" ${S}><path d="m8 7-5 5 5 5M16 7l5 5-5 5M13.5 4l-3 16"/></svg>`,
  'code-simple': `<svg viewBox="0 0 24 24" ${S}><path d="m9 8-4 4 4 4M15 8l4 4-4 4"/></svg>`,
  compass:  `<svg viewBox="0 0 24 24" ${S}><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5 13 13l-4.5 2.5L11 11z"/></svg>`,
  flow:     `<svg viewBox="0 0 24 24" ${S}><circle cx="6" cy="5" r="2.4"/><circle cx="18" cy="5" r="2.4"/><circle cx="12" cy="19" r="2.4"/><path d="M6 7.4V11a2 2 0 0 0 2 2h2M18 7.4V11a2 2 0 0 1-2 2h-2M12 13v3.6"/></svg>`,
  wand:     `<svg viewBox="0 0 24 24" ${S}><path d="M15 4 4 15l3 3L18 7z"/><path d="m15 4 3 3"/><path d="M19 2v2M22 5h-2M19.5 9.5l1.5 1.5M9 2 8 4M5 6 3 5"/></svg>`,
  robot:    `<svg viewBox="0 0 24 24" ${S}><rect x="5" y="8" width="14" height="10" rx="2.5"/><path d="M12 8V5M12 5h.01"/><circle cx="9.2" cy="12.5" r=".8" fill="currentColor"/><circle cx="14.8" cy="12.5" r=".8" fill="currentColor"/><path d="M9.5 15.5h5"/><path d="M3 12v3M21 12v3"/></svg>`,
  brain:    `<svg viewBox="0 0 24 24" ${S}><path d="M12 4.5a3 3 0 0 0-3-1.5 3 3 0 0 0-2.8 4A3.2 3.2 0 0 0 4 10a3.2 3.2 0 0 0 1.6 2.8A3.4 3.4 0 0 0 6 17a3.4 3.4 0 0 0 3.4 3c1.1 0 2-.5 2.6-1.2V4.5z"/><path d="M12 4.5a3 3 0 0 1 3-1.5 3 3 0 0 1 2.8 4A3.2 3.2 0 0 1 20 10a3.2 3.2 0 0 1-1.6 2.8A3.4 3.4 0 0 1 18 17a3.4 3.4 0 0 1-3.4 3c-1.1 0-2-.5-2.6-1.2V4.5z"/></svg>`,
  star4:    `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z"/></svg>`,
  sparkle:  `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z"/></svg>`,
  share:    `<svg viewBox="0 0 24 24" ${S}><circle cx="17.5" cy="5.5" r="2.5"/><circle cx="6.5" cy="12" r="2.5"/><circle cx="17.5" cy="18.5" r="2.5"/><path d="m8.8 10.8 6.4-4M8.8 13.2l6.4 4"/></svg>`,
  'doc-user': `<svg viewBox="0 0 24 24" ${S} stroke-width="1.7"><path d="M8 3h6l4 4v8.5"/><path d="M14 3v4h4"/><path d="M8 3H7a2 2 0 0 0-2 2v6"/><path d="M8 9h5M8 12h3"/><circle cx="12" cy="17.5" r="2.3"/><path d="M7.5 22a4.6 4.6 0 0 1 9 0"/></svg>`,
  lock:     `<svg viewBox="0 0 24 24" ${S} stroke-width="2"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>`,
  target:   `<svg viewBox="0 0 24 24" ${S}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/></svg>`,
  rocket:   `<svg viewBox="0 0 24 24" ${S}><path d="M12 15c-2-1.5-3-4-2.5-7C12 5 15.5 4 19 4.5 19.5 8 18.5 11.5 16 14c-1.3 1.3-2.7 1.7-4 1z"/><path d="M9.5 8.5C7 9 5.5 10.5 4.5 13c1.5-.5 2.7-.5 4 0M15.5 14.5c-.5 2.5-2 4-4.5 5 .5-1.5.5-2.7 0-4"/><circle cx="14.5" cy="9.5" r="1.4"/></svg>`,
  chart:    `<svg viewBox="0 0 24 24" ${S}><path d="M4 20V4"/><path d="M4 20h16"/><path d="M8 16v-5M12 16V8M16 16v-8M20 16V6" stroke-width="2.4"/></svg>`,
  trend:    `<svg viewBox="0 0 24 24" ${S}><path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/></svg>`,
  shield:   `<svg viewBox="0 0 24 24" ${S}><path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6z"/><path d="m9 12 2 2 4-4"/></svg>`,
  gear:     `<svg viewBox="0 0 24 24" ${S}><circle cx="12" cy="12" r="3.2"/><path d="M12 2.8v3M12 18.2v3M2.8 12h3M18.2 12h3M5.5 5.5l2.1 2.1M16.4 16.4l2.1 2.1M18.5 5.5l-2.1 2.1M7.6 16.4l-2.1 2.1"/></svg>`,
  users:    `<svg viewBox="0 0 24 24" ${S}><circle cx="9" cy="8.5" r="3.2"/><path d="M3.5 20a5.5 5.5 0 0 1 11 0"/><circle cx="16.8" cy="9.5" r="2.6"/><path d="M15.5 15.6a4.9 4.9 0 0 1 5 4.4"/></svg>`,
  check:    `<svg viewBox="0 0 24 24" ${S} stroke-width="2.4"><path d="m4.5 12.5 5 5 10-11"/></svg>`,
  bolt:     `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M13 2 4.5 13.5H11L9.5 22 19 10h-6.5z"/></svg>`,
  globe:    `<svg viewBox="0 0 24 24" ${S}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 3.8 5.6 3.8 9S14.5 18.5 12 21c-2.5-2.5-3.8-5.6-3.8-9S9.5 5.5 12 3z"/></svg>`,
  book:     `<svg viewBox="0 0 24 24" ${S}><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19a2 2 0 0 1 2-2h13"/><path d="M8 7h7"/></svg>`,
  award:    `<svg viewBox="0 0 24 24" ${S}><circle cx="12" cy="9" r="5.5"/><path d="m8.8 13.5-1.8 7 5-2.8 5 2.8-1.8-7"/><path d="M12 6.5l.9 1.8 2 .3-1.45 1.4.35 2-1.8-.95-1.8.95.35-2L9.1 8.6l2-.3z" fill="currentColor" stroke="none"/></svg>`,
  clock:    `<svg viewBox="0 0 24 24" ${S}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>`,
  handshake:`<svg viewBox="0 0 24 24" ${S}><path d="m11 12 2.5 2.5a1.8 1.8 0 0 0 2.5-2.5L12 8l-3 1L5.5 7 2 10.5 5 14"/><path d="m16 14 2.5 2.5M13.5 16.5 15 18M19 11.5l3-3L18.5 5 15 7"/></svg>`,
  layers:   `<svg viewBox="0 0 24 24" ${S}><path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/><path d="m3 17.5 9 5 9-5" opacity=".55"/></svg>`,
  diamond:  `<svg viewBox="0 0 24 24" ${S}><path d="M7 4h10l4 5-9 11L3 9z"/><path d="M3 9h18M12 20 8.5 9l2-5M12 20l3.5-11-2-5"/></svg>`,
};

function getIcon(name, warnings) {
  if (ICONS[name]) return ICONS[name];
  if (name && warnings) warnings.push(`Unknown icon "${name}" — using "dot". Valid icons: ${Object.keys(ICONS).join(', ')}`);
  return ICONS.dot;
}

module.exports = { ICONS, getIcon };
