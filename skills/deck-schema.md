# Deck schema reference

A deck is one JSON file: `{ "meta": {...}, "slides": [...] }`.
Everything below is copy-paste ready. Fields marked *(opt)* are optional.

## meta

```json
"meta": {
  "title": "Browser tab title — required",
  "theme": "midnight-tech",          // opt, default midnight-tech. --list shows all
  "transition": "slide",             // opt: slide | fade | zoom | vertical | flip | deck | none
  "animationProfile": "executive",   // opt: executive | editorial | kinetic | calm | none
  "surfaceStyle": "classic",         // opt: classic | sharp | glass | ticket | folder | paper | neon | brutalist | soft
  "background": "waves",             // opt: waves | orbs | grid | none (default = theme's own)
  "footer": "CONFIDENTIAL & PROPRIETARY",  // opt; false hides footers entirely
  "autoplaySeconds": 12,             // opt, ≥ 3; used when presenter presses P
  "hint": true,                      // opt; false hides the startup shortcut toast
  "lang": "en"                       // opt; html lang attribute
}
```

## Accents (used all over)

`"accent"` fields take a slot — `"a1"` (primary), `"a2"`, `"a3"`, `"a4"` — or a raw hex like
`"#c084fc"` for exact brand colors. Slots re-map automatically when the theme changes; hex does not.

## Style controls

Use fixed tokens so weak agents do not invent design language:

- `theme`: `midnight-tech`, `corporate-light`, `emerald-night`, `royal-violet`,
  `sunset-ember`, `polar-light`, `editorial-ink`, `aurora-purple`, `mint-lab`, `mono-signal`
- `transition`: `slide`, `fade`, `zoom`, `vertical`, `flip`, `deck`, `none`
- `animationProfile`: `executive`, `editorial`, `kinetic`, `calm`, `none`
- `surfaceStyle`: `classic`, `sharp`, `glass`, `ticket`, `folder`, `paper`, `neon`, `brutalist`, `soft`

Set `meta.surfaceStyle` for the full deck, or `slide.surfaceStyle` to override one slide.

## Slide types

### title
```json
{ "type": "title", "heading": "[SEEG-P AX monthly meeting]", "subheading": "[10/7/2026]" }
```
`subheading` *(opt)*. Keep `heading` ≤ ~46 chars or it wraps.

### agenda
```json
{ "type": "agenda", "heading": "Agenda",
  "items": ["1. First topic", "2. Second topic"] }
```
Max 8 items (warning beyond). Numbered circles are automatic (1..n); if you also want the
number inside the text, include it in the string like the flagship deck does.

### org-chart
```json
{ "type": "org-chart", "index": "1", "heading": "AI Crew Org.",
  "leader": { "title": "AX G Leader", "name": "Abdullah Selim" },
  "left":  { "title": "AI Part", "names": ["Name One", "Name Two"] },
  "right": { "title": "Development part", "names": ["Name Three"] },
  "divisions": [
    { "name": "VD DIVISION", "badge": "7 Members",
      "accent": "a2", "teamAccent": "a1",
      "airy": false,
      "teams": [
        { "name": "Team Name", "count": "3",
          "members": [
            { "initials": "SA", "name": "Full Name", "role": "Role text" }
          ] } ] } ] }
```
`left`/`right` boxes *(opt)*. `accent` colors the member-count pill and underline dot;
`teamAccent` *(opt)* colors team names and avatar gradients (defaults to `accent`).
`airy: true` spreads few cards over the column height (use when a division has ≤ 3 single-member
teams). `count` *(opt)* defaults to the member count. Max 3 divisions; keep teams+members ≤ 13
rows per column.

### card-sections
```json
{ "type": "card-sections", "index": "2", "heading": "AI Crew Role",
  "bullet": { "text": "Headline statement",           // opt block above the cards
              "subs": ["– style sub-point", "another"] },
  "sections": [
    { "label": "BUSINESS & STRATEGY ROLES", "icon": "bulb", "accent": "a1", "grid": 2,
      "cards": [
        { "icon": "compass", "badge": "LEAD 01", "title": "Opportunity Finder",
          "body": "One or two sentences, ≤ ~160 chars." } ] },
    { "label": "TECHNICAL SUPPORT ROLES", "icon": "code", "accent": "#c084fc", "grid": 1,
      "cards": [ { "icon": "code-simple", "badge": "TECH 01", "title": "Programmer",
                   "body": "..." } ] } ] }
```
`grid: 2` = two-column card grid (section gets wide track); `grid: 1` = single stack (narrow
track). Max 4 cards per section. 1–2 sections look best.

### timeline-matrix  (renders as a light slide inside dark decks)
```json
{ "type": "timeline-matrix",
  "themeOverride": "corporate-light",   // opt; light palette source (any theme name)
  "eyebrow": "Enterprise AI Monthly Implementation Plan",
  "heading": "MASTER TIMELINE MATRIX — JAN–JUN",
  "cornerLabel": "Timeline", "sideLabel": "Projects",   // opt, these are defaults
  "months": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  "repeatRows": 2,     // 2 → 4 rows where rows 3–4 repeat 1–2; 1 → just 2 rows
  "columns": [
    [ { "name": "Project A", "status": "completed" },
      { "name": "Project B", "status": "inprogress" } ],
    [ { "name": "Project C", "badge": "prep", "status": "completed" } ],
    [ { "name": "Project D", "badge": "mvp",  "status": "inprogress" } ],
    [ { "name": "Project E", "status": "planning" } ],
    [ { "name": "..." , "status": "planning" } ],
    [ { "name": "..." , "status": "planning" } ]
  ],
  "legend": [
    { "color": "green",  "label": "Completed" },
    { "color": "blue",   "label": "In Progress" },
    { "color": "orange", "label": "Planning" },
    { "color": "prep",   "label": "Preparation" },
    { "color": "augred", "label": "External change" }
  ],
  "footer": { "left": "enterprise ai", "center": "Center note", "right": "Slide 5" } }
```
`columns` must have exactly one array per month. `status`: `completed | inprogress | planning`.
`badge` *(opt)*: `prep` (solid purple PREP) or `mvp` (solid red MVP GATE), or any custom string
with `badgeColor: "#hex"`. Card top-border auto-matches badge/status color.
`legend` colors: `green|blue|orange|prep|mvp|augred` or any hex.

### comparison
```json
{ "type": "comparison", "index": "3", "heading": "AI Capability Expansion",
  "subtitle": "Generative AI Comparison & Gauss Access Update",
  "sectionLabel": { "icon": "sparkle", "text": "How the 3 Generative AI Models Differ" },
  "cards": [
    { "icon": "star4", "accent": "a1", "name": "Gemini",
      "paragraphs": ["First paragraph.", "Second paragraph."] }
  ],
  "banner": {                                   // opt announcement bar under the cards
    "icon": "doc-user", "accent": "a1", "title": "Gauss Portal Permission Update",
    "lines": ["Line one.", "Line two — each array item becomes its own line."] } }
```
3 cards is the sweet spot (2–4 supported). `subtitle`, `sectionLabel`, `banner` all *(opt)*.

### section  (chapter divider)
```json
{ "type": "section", "index": "01", "heading": "Why now",
  "subtitle": "Optional supporting sentence." }
```

### bullets
```json
{ "type": "bullets", "index": "1", "heading": "Launch Pillars",
  "subtitle": "Optional subtitle",
  "columns": 3,                       // opt; default: 3 groups → 3 cols, else max 2
  "groups": [
    { "title": "Product", "icon": "rocket", "accent": "a1",
      "items": ["Point one.", "Point two."] } ] }
```
Max 6 items per group (warning beyond). 2–3 groups look best.

### kpi
```json
{ "type": "kpi", "index": "2", "heading": "Targets at +90 Days",
  "subtitle": "Optional subtitle",
  "tiles": [
    { "value": "2,500", "label": "Active workspaces",
      "sub": "Optional small print", "accent": "a1" } ] }
```
2–4 tiles. `value` is huge — keep it ≤ 7 characters.

### kpi-dashboard
```json
{ "type": "kpi-dashboard", "index": "2", "heading": "Operations Dashboard",
  "subtitle": "Optional subtitle",
  "rows": [
    { "label": "Performance",
      "tiles": [
        { "value": "96.4%", "label": "Output attainment",
          "sub": "vs. 95.0% target", "accent": "a1" }
      ] }
  ] }
```
Max 2 rows and 4 tiles per row. Keep `value` <= 7 characters.

### closing
```json
{ "type": "closing", "heading": "Thank you",
  "subheading": "Questions → #channel",
  "points": ["Chip one", "Chip two", "Chip three"] }
```
`points` *(opt)* renders as pill chips under the divider.

## Icons

`dot, bulb, code, code-simple, compass, flow, wand, robot, brain, star4, sparkle, share,
doc-user, lock, target, rocket, chart, trend, shield, gear, users, check, bolt, globe, book,
award, clock, handshake, layers, diamond`
Unknown names fall back to `dot` with a build warning.
