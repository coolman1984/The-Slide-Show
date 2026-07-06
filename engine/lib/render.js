'use strict';
/*
 * SLIDE RENDERERS — one function per slide type. Each returns the full
 * <section> markup with entrance-animation classes and staggered delays.
 * All deck text passes through esc(); accent styling is inlined from the
 * resolved theme so decks re-render correctly under any theme.
 */
const { resolveAccent, hexToRgb } = require('./themes');
const { getIcon } = require('./icons');

const esc = s => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const d = n => `--d:${(Math.round(n * 1000) / 1000)}s`;

function footer(deck, delay, withLock) {
  if (deck.meta.footer === false) return '';
  const lock = withLock ? getIcon('lock') : '';
  return `<footer class="foot a a-fade" style="${d(delay)}">
    <div class="rule"></div>
    <div class="flabel">${lock}<span>${esc(deck.meta.footer || '')}</span></div>
  </footer>`;
}

function shead(slide, base = 0.05) {
  if (slide.index == null) {
    return `<header class="shead"><h2 class="a a-left" style="${d(base + 0.13)}">${esc(slide.heading)}</h2></header>`;
  }
  return `<header class="shead">
    <span class="idx a a-pop" style="${d(base)}">${esc(slide.index)}</span>
    <span class="sep a a-drop" style="${d(base + 0.07)}"></span>
    <h2 class="a a-left" style="${d(base + 0.13)}">${esc(slide.heading)}</h2>
  </header>`;
}

function chip(iconName, accent, ctx, extra = '') {
  return `<span class="ichip breathe" style="border-color:rgba(${accent.glow},.6);color:${accent.color}${extra}">${getIcon(iconName, ctx.warnings)}</span>`;
}

/* ====================================================================== */
const RENDERERS = {

  /* ------------------------------ title ------------------------------ */
  title(slide, ctx) {
    return `<div class="stack">
      <h1 class="a a-zoom" style="${d(0.15)}">${esc(slide.heading)}</h1>
      <div class="divider a a-wipe from-center" style="${d(0.85)}"><span class="line"></span><span class="bar breathe"></span></div>
      ${slide.subheading ? `<div class="date a a-up" style="${d(1.15)}">${esc(slide.subheading)}</div>` : ''}
    </div>
    ${footer(ctx.deck, 1.4)}`;
  },

  /* ----------------------------- closing ----------------------------- */
  closing(slide, ctx) {
    const pts = (slide.points || []).map((p, i) =>
      `<span class="pt a a-up" style="${d(1.2 + i * 0.12)}">${esc(p)}</span>`).join('');
    return `<div class="stack">
      <h1 class="a a-zoom" style="${d(0.15)}">${esc(slide.heading)}</h1>
      <div class="divider a a-wipe from-center" style="${d(0.85)}"><span class="line"></span><span class="bar breathe"></span></div>
      ${slide.subheading ? `<div class="date a a-up" style="${d(1.0)}">${esc(slide.subheading)}</div>` : ''}
      ${pts ? `<div class="points">${pts}</div>` : ''}
    </div>
    ${footer(ctx.deck, 1.6)}`;
  },

  /* ------------------------------ agenda ----------------------------- */
  agenda(slide, ctx) {
    const rows = slide.items.map((item, i) => {
      const line = i < slide.items.length - 1
        ? `<div class="agline a a-wipe" style="${d(0.5 + i * 0.08)}"></div>` : '';
      return `<div class="arow"><span class="num a a-pop" style="${d(0.35 + i * 0.08)}">${i + 1}</span><span class="txt a a-left" style="${d(0.42 + i * 0.08)}">${esc(item)}</span></div>${line}`;
    }).join('\n');
    return `<div class="h2head">
      <span class="vbar a a-drop" style="${d(0.05)}"></span>
      <h2 class="a a-left" style="${d(0.15)}">${esc(slide.heading || 'Agenda')}</h2>
    </div>
    <div class="agenda">${rows}</div>
    ${footer(ctx.deck, 0.5 + slide.items.length * 0.08 + 0.1)}`;
  },

  /* ----------------------------- org-chart --------------------------- */
  'org-chart'(slide, ctx) {
    const T = ctx.theme;
    const sideBox = (side, cls, delay) => side ? `
      <div class="node side ${cls} a a-up" style="${d(delay)}">
        <div class="ntitle">${esc(side.title)}</div>
        ${side.names.map(n => `<div class="nm">${esc(n)}</div>`).join('')}
      </div>` : '';
    const divisions = slide.divisions.map((div, ci) => {
      const acc = resolveAccent(T, div.accent, ['a2', 'a3', 'a4'][ci % 3]);
      const teamAcc = resolveAccent(T, div.teamAccent || div.accent, 'a1');
      const teams = div.teams.map((team, ti) => {
        const members = team.members.map(m => `
          <div class="mem"><span class="av" style="background:linear-gradient(135deg,${teamAcc.grad[0]},${teamAcc.grad[1]})">${esc(m.initials)}</span><span class="mname">${esc(m.name)}</span><span class="mrole">— ${esc(m.role)}</span></div>`).join('');
        return `<div class="tcard a a-up" style="${d(0.85 + ci * 0.08 + ti * 0.06)}">
          <div class="thead"><span class="tname" style="color:${teamAcc.bright}">${esc(team.name)}</span><span class="cnt">${esc(team.count != null ? team.count : team.members.length)}</span></div>
          ${members}
        </div>`;
      }).join('\n');
      return `<div class="col">
        <div class="dhead a a-left" style="${d(0.7 + ci * 0.08)}"><h3>${esc(div.name)}</h3>${div.badge ? `<span class="dpill mpill" style="color:${acc.color};border-color:rgba(${acc.glow},.6);background:${acc.pillBg}">${esc(div.badge)}</span>` : ''}</div>
        <div class="dunder a a-wipe" style="${d(0.78 + ci * 0.08)}"><i style="background:${acc.color};box-shadow:0 0 8px ${acc.color}"></i></div>
        <div class="cards${div.airy ? ' airy' : ''}">${teams}</div>
      </div>`;
    }).join('\n');
    return `${shead(slide)}
    <div class="orgrow">
      ${sideBox(slide.left, 'left', 0.55)}
      <div class="conn a a-wipe" style="${d(0.45)}"></div>
      <div class="node leader breathe a a-pop" style="${d(0.3)}">
        <div class="ltitle">${esc(slide.leader.title)}</div>
        <div class="lname">${esc(slide.leader.name)}</div>
        <span class="drop"></span>
      </div>
      <div class="conn a a-wipe" style="${d(0.45)}"></div>
      ${sideBox(slide.right, 'right', 0.55)}
    </div>
    <div class="divs" style="grid-template-columns:repeat(${slide.divisions.length},1fr)">${divisions}</div>
    ${footer(ctx.deck, 1.25)}`;
  },

  /* --------------------------- card-sections ------------------------- */
  'card-sections'(slide, ctx) {
    const T = ctx.theme;
    let cardIdx = 0;
    const cols = slide.sections.map(s => (s.grid || 1) === 2 ? '1fr' : '560px').join(' ');
    const sections = slide.sections.map((sec, si) => {
      const acc = resolveAccent(T, sec.accent, si === 0 ? 'a1' : 'a4');
      const cards = sec.cards.map(card => {
        const delay = 0.82 + (cardIdx++) * 0.09;
        return `<div class="rcard a a-up" style="${d(delay)};border-left-color:${acc.color};box-shadow:-6px 0 22px -8px rgba(${acc.glow},.45),0 0 20px rgba(${acc.glow},.05)">
          <div class="rtop">${chip(card.icon, acc, ctx)}<span class="rbadge">${esc(card.badge || '')}</span></div>
          <h4>${esc(card.title)}</h4>
          <p>${esc(card.body)}</p>
        </div>`;
      }).join('\n');
      return `<div class="rsec">
        <div class="seclab a a-left" style="${d(0.7 + si * 0.08)};color:${acc.color}">
          <span style="color:${acc.color};display:flex">${getIcon(sec.icon, ctx.warnings)}</span>
          <span style="color:${acc.color}">${esc(sec.label)}</span><i class="rline"></i>
        </div>
        <div class="rgrid" style="grid-template-columns:repeat(${sec.grid || 1},1fr)">${cards}</div>
      </div>`;
    }).join('\n');
    const bullet = slide.bullet ? `
    <div class="bullet a a-left" style="${d(0.35)}"><span class="chk"></span><h3>${esc(slide.bullet.text)}</h3></div>
    <div class="subs">
      ${(slide.bullet.subs || []).map((s, i) => `<div class="a a-left" style="${d(0.48 + i * 0.08)}"><span class="dash">–</span>${esc(s)}</div>`).join('')}
    </div>` : '';
    return `${shead(slide)}
    ${bullet}
    <div class="rolewrap" style="grid-template-columns:${cols}">${sections}</div>
    ${footer(ctx.deck, 1.2, true)}`;
  },

  /* -------------------------- timeline-matrix ------------------------ */
  'timeline-matrix'(slide, ctx) {
    const sem = { completed: 'var(--sem-green)', inprogress: 'var(--sem-blue)', planning: 'var(--sem-orange)' };
    const badgeDefs = { prep: { label: 'PREP', bg: 'var(--sem-prep)' }, mvp: { label: 'MVP GATE', bg: 'var(--sem-mvp)' } };
    const legendColor = k => ({ green: 'var(--sem-green)', blue: 'var(--sem-blue)', orange: 'var(--sem-orange)', prep: 'var(--sem-prep)', mvp: 'var(--sem-mvp)', augred: 'var(--sem-augred)' })[k] || k;
    const months = slide.months, rows = (slide.repeatRows || 2) * 2;
    let cells = `<div class="tlh a a-drop" style="${d(0.1)}">${esc(slide.cornerLabel || 'Timeline')}</div>`;
    months.forEach((m, i) => { cells += `<div class="tlh a a-drop" style="${d(0.16 + i * 0.06)}">${esc(m)}</div>`; });
    cells += `<div class="tlproj a a-fade" style="${d(0.5)};grid-column:1;grid-row:2/${rows + 2}">${esc(slide.sideLabel || 'Projects')}</div>`;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < months.length; col++) {
        const colDef = slide.columns[col] || [];
        const p = colDef[row % colDef.length];
        if (!p) continue;
        const badge = p.badge ? badgeDefs[p.badge] || { label: p.badge, bg: p.badgeColor || 'var(--sem-prep)' } : null;
        const top = badge ? badge.bg : (sem[p.status] || 'var(--sem-green)');
        let pills = '';
        if (badge) pills += `<span class="sbadge" style="background:${badge.bg}">${esc(badge.label)}</span>`;
        pills += `<span class="spill ${esc(p.status)}"><i></i>${esc({ completed: 'Completed', inprogress: 'In Progress', planning: 'Planning' }[p.status] || p.status)}</span>`;
        cells += `<div class="pcard a a-up" style="${d(0.55 + col * 0.14 + row * 0.035)};border-top-color:${top};grid-column:${col + 2};grid-row:${row + 2}">
          <div class="pname">${esc(p.name)}</div><div class="prow">${pills}</div></div>`;
      }
    }
    const legend = (slide.legend || []).map(l =>
      `<span class="li"><span class="sq" style="background:${legendColor(l.color)}"></span>${esc(l.label)}</span>`).join('\n');
    const f = slide.footer || {};
    return `<div class="ltop">
      <div class="ltl a a-left" style="${d(0.05)}"><span class="lbar"></span>${esc(slide.eyebrow || '')}</div>
      <h2 class="ltr a a-fade" style="${d(0.1)}">${esc(slide.heading)}</h2>
    </div>
    <div class="tlgrid" style="grid-template-columns:180px repeat(${months.length},1fr);grid-template-rows:56px repeat(${rows},1fr)">${cells}</div>
    ${legend ? `<div class="legend a a-fade" style="${d(1.15)}">${legend}</div>` : ''}
    <footer class="lfoot a a-fade" style="${d(1.25)}">
      <span>${esc(f.left || '')}</span><span>${esc(f.center || '')}</span><span>${esc(f.right || '')}</span>
    </footer>`;
  },

  /* ----------------------------- comparison -------------------------- */
  comparison(slide, ctx) {
    const T = ctx.theme;
    const cards = slide.cards.map((c, i) => {
      const acc = resolveAccent(T, c.accent, ['a1', 'a3', 'a4'][i % 3]);
      return `<div class="mcard a a-up" style="${d(0.65 + i * 0.12)};border-left-color:${acc.color};box-shadow:-6px 0 24px -8px rgba(${acc.glow},.42)">
        <div class="mtop">
          ${chip(c.icon, { ...acc, color: acc.bright }, ctx)}
          <div><div class="mname">${esc(c.name)}</div><span class="mline a a-wipe" style="${d(1.1 + i * 0.12)};background:${acc.color}"></span></div>
        </div>
        ${c.paragraphs.map(p => `<p>${esc(p)}</p>`).join('')}
      </div>`;
    }).join('\n');
    const b = slide.banner;
    const bAcc = resolveAccent(ctx.theme, (b && b.accent) || 'a1');
    const banner = b ? `<div class="banner a a-up" style="${d(1.05)}">
      ${chip(b.icon, bAcc, ctx)}
      <div>
        <h4>${esc(b.title)}</h4>
        <p>${b.lines.map(esc).join('<br>\n        ')}</p>
      </div>
    </div>` : '';
    return `${shead(slide)}
    ${slide.subtitle ? `<div class="sub a a-left" style="${d(0.3)}">${esc(slide.subtitle)}</div>` : ''}
    ${slide.sectionLabel ? `<div class="seclab a a-left" style="${d(0.45)}">
      ${getIcon(slide.sectionLabel.icon, ctx.warnings)}
      <span>${esc(slide.sectionLabel.text)}</span><i class="rline a a-wipe" style="${d(0.55)}"></i>
    </div>` : ''}
    <div class="models" style="grid-template-columns:repeat(${slide.cards.length},1fr)">${cards}</div>
    ${banner}
    ${footer(ctx.deck, 1.3)}`;
  },

  /* ------------------------------ section ---------------------------- */
  section(slide, ctx) {
    return `<div class="wrap">
      ${slide.index != null ? `<div class="bigidx a a-pop" style="${d(0.15)}">${esc(slide.index)}</div>
      <div class="sbar a a-drop" style="${d(0.35)}"></div>` : ''}
      <div>
        <div class="stitle a a-left" style="${d(0.45)}">${esc(slide.heading)}</div>
        ${slide.subtitle ? `<div class="ssub a a-left" style="${d(0.6)}">${esc(slide.subtitle)}</div>` : ''}
      </div>
    </div>
    ${footer(ctx.deck, 0.9)}`;
  },

  /* ------------------------------ bullets ---------------------------- */
  bullets(slide, ctx) {
    const T = ctx.theme;
    const groups = slide.groups.map((g, gi) => {
      const acc = resolveAccent(T, g.accent, ['a1', 'a3', 'a4', 'a2'][gi % 4]);
      const items = g.items.map((it, i) =>
        `<li class="a a-left" style="${d(0.75 + gi * 0.12 + i * 0.07)}"><span class="bdash" style="color:${acc.color}">–</span><span>${esc(it)}</span></li>`).join('\n');
      return `<div class="bgroup a a-up" style="${d(0.55 + gi * 0.12)};border-left-color:${acc.color};box-shadow:-6px 0 22px -8px rgba(${acc.glow},.4)">
        <div class="ghead">${g.icon ? chip(g.icon, acc, ctx) : ''}<h4>${esc(g.title)}</h4></div>
        <ul>${items}</ul>
      </div>`;
    }).join('\n');
    return `${shead(slide)}
    ${slide.subtitle ? `<div class="sub a a-left" style="${d(0.3)}">${esc(slide.subtitle)}</div>` : ''}
    <div class="groups" style="grid-template-columns:repeat(${slide.columns || (slide.groups.length === 3 ? 3 : Math.min(slide.groups.length, 2))},1fr)">${groups}</div>
    ${footer(ctx.deck, 1.3)}`;
  },

  /* -------------------------------- kpi ------------------------------ */
  kpi(slide, ctx) {
    const T = ctx.theme;
    const tiles = slide.tiles.map((t, i) => {
      const acc = resolveAccent(T, t.accent, ['a1', 'a3', 'a4', 'a2'][i % 4]);
      return `<div class="ktile a a-up" style="${d(0.55 + i * 0.13)};border-top-color:${acc.color};box-shadow:0 -6px 24px -10px rgba(${acc.glow},.5)">
        <div class="kval" style="color:${acc.bright};text-shadow:0 0 30px rgba(${acc.glow},.35)">${esc(t.value)}</div>
        <div class="klabel">${esc(t.label)}</div>
        ${t.sub ? `<div class="ksub">${esc(t.sub)}</div>` : ''}
      </div>`;
    }).join('\n');
    return `${shead(slide)}
    ${slide.subtitle ? `<div class="sub a a-left" style="${d(0.3)}">${esc(slide.subtitle)}</div>` : ''}
    <div class="tiles" style="grid-template-columns:repeat(${Math.min(slide.tiles.length, 4)},1fr)">${tiles}</div>
    ${footer(ctx.deck, 1.2)}`;
  },

  /* --------------------------- kpi dashboard ------------------------- */
  'kpi-dashboard'(slide, ctx) {
    const T = ctx.theme;
    const rows = slide.rows.map((r, ri) => {
      const tiles = r.tiles.map((t, ti) => {
        const acc = resolveAccent(T, t.accent, ['a1', 'a3', 'a4', 'a2'][ti % 4]);
        return `<div class="ktile ktile-sm a a-up" style="${d(0.55 + ri * 0.18 + ti * 0.09)};border-top-color:${acc.color};box-shadow:0 -6px 24px -10px rgba(${acc.glow},.5)">
          <div class="kval" style="color:${acc.bright};text-shadow:0 0 24px rgba(${acc.glow},.35)">${esc(t.value)}</div>
          <div class="klabel">${esc(t.label)}</div>
          ${t.sub ? `<div class="ksub">${esc(t.sub)}</div>` : ''}
        </div>`;
      }).join('\n');
      return `<div class="krow a a-up" style="${d(0.45 + ri * 0.18)}">
        <div class="krow-label">${esc(r.label)}</div>
        <div class="tiles tiles-sm" style="grid-template-columns:repeat(${Math.min(r.tiles.length, 4)},1fr)">${tiles}</div>
      </div>`;
    }).join('\n');
    return `${shead(slide)}
    ${slide.subtitle ? `<div class="sub a a-left" style="${d(0.3)}">${esc(slide.subtitle)}</div>` : ''}
    <div class="kpi-rows">${rows}</div>
    ${footer(ctx.deck, 1.2)}`;
  },
};

const TYPE_CLASS = {
  title: 'sl-title', closing: 'sl-closing', agenda: 'sl-agenda', 'org-chart': 'sl-org',
  'card-sections': 'sl-cards', 'timeline-matrix': 'sl-tl', comparison: 'sl-compare',
  section: 'sl-section', bullets: 'sl-bullets', kpi: 'sl-kpi', 'kpi-dashboard': 'sl-kpi-dashboard',
};

function renderSlide(slide, i, ctx) {
  const fn = RENDERERS[slide.type];
  const inner = fn(slide, ctx);
  const mode = slide._mode; // resolved by build.js
  const classes = ['slide', TYPE_CLASS[slide.type]];
  if (slide.type === 'timeline-matrix') classes.push('opaque');
  if (slide._ovr) classes.push(`ovr-${slide._ovr}`);
  return `<section class="${classes.join(' ')}" id="slide-${i + 1}" data-mode="${mode}">\n${inner}\n</section>`;
}

module.exports = { renderSlide, RENDERERS, TYPE_CLASS };
