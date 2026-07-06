# SKILL: Build a presentation with Slide Forge

You are an AI agent asked to create or modify a slideshow. Follow this workflow **exactly** —
it exists so that the result is presentation-grade every time, regardless of which model you are.

## Golden rules

1. **You write JSON, not code.** Never edit `engine/` to make a deck work. If a deck can't
   express something, say so — don't hack the engine.
2. **Never invent content.** Every name, number, date, and label comes from the user. If content
   is missing, use an obvious placeholder like `[Insert KPI here]` — never a made-up value.
3. **Copy, don't create from scratch.** Start from the closest existing deck in `decks/` and
   modify it. `decks/seegp-ax-monthly.json` is the flagship reference for org charts, role cards,
   timelines, and comparisons; `decks/demo-product-launch.json` for sections, bullets, KPIs,
   and closings.
4. **Build after every change.** The validator is your reviewer — it reports exact paths of
   errors (`slides[3].tiles[0].label: required`) and overflow warnings before you open a browser.
5. **Never overwrite `index.html`** unless the user explicitly asks to change the default
   presentation. Build your deck to `dist/<name>.html`.

## Workflow

### Step 1 — Interview the content
Collect from the user (or the task): title, date, footer text, and the list of slides with
their real content. Map each slide the user describes to a slide type:

| The user wants… | Use type |
|---|---|
| Opening slide with a big title | `title` |
| Table of contents / agenda list | `agenda` |
| Team structure, who reports to whom | `org-chart` |
| Grid of roles/features/offerings with icons and badges | `card-sections` |
| Month-by-month project grid with statuses | `timeline-matrix` |
| Side-by-side comparison of 2–4 things (+ optional announcement banner) | `comparison` |
| A chapter break ("Part 2: …") | `section` |
| Grouped bullet points | `bullets` |
| Big numbers / metrics / targets | `kpi` |
| Thank-you / next-steps ending | `closing` |

### Step 2 — Pick theme, transition, background
Ask the user, or infer from context (see `skills/design-guide.md` §Choosing a theme).
Available: run `node engine/build.js --list`. Default to `midnight-tech` + `slide` transition
for executive/tech audiences. You can also preview any deck in another theme with
`--theme <name>` without touching the file.

### Step 3 — Write the deck JSON
Create `decks/<kebab-name>.json`. Keep `skills/deck-schema.md` open — it has a copy-paste
example of every slide type with every field explained. Rules while writing:

- Respect the density limits (they trigger warnings): ≤ 8 agenda items, ≤ 4 cards per
  section, ≤ 6 timeline columns, ≤ 4 KPI tiles, ≤ 6 items per bullet group, ≤ 3 org divisions,
  ≤ 13 rows (teams+members) per org division column.
- Accents: use slots `a1`–`a4` so the deck re-themes cleanly. Only use raw hex (`"#c084fc"`)
  when the user demands an exact brand color.
- Escape nothing — the engine HTML-escapes all text. Write `&`, `<`, quotes freely.
- JSON gotchas: no trailing commas, no comments, straight double quotes only.

### Step 4 — Build and read the output
```bash
node engine/build.js decks/<name>.json -o dist/<name>.html
```
- **Errors** → fix each listed path, rebuild.
- **Warnings** → they mean overflow risk. Cut or split content; do not ignore them for a deck
  someone will actually present.

### Step 5 — Verify visually (mandatory)
Open the built file in a browser (or headless browser) at 1920×1080 and step through **every
slide**. Check: nothing overlaps the footer, no text is cut off, every slide's content matches
what the user asked for. If you can take screenshots, take one per slide and inspect them.
A deck is not "done" because it built — it is done when every slide has been *seen*.

### Step 6 — Deliver
Give the user the `dist/<name>.html` file and the one-line instructions:
"Open it, press F for fullscreen, present with ← →."

## Modifying the default presentation

The root `index.html` is built from `decks/seegp-ax-monthly.json`. To change it:
1. Edit the JSON (content only — names, dates, projects).
2. `npm run build` (this rebuilds `index.html`).
3. Do Step 5 on `index.html` before telling the user it's ready.

## When the user asks for something the engine can't do

If no slide type fits (e.g. "embed a video"), do NOT improvise HTML into strings — the engine
escapes it, and inline hacks break theming. Tell the user which types exist and offer the
closest match, or flag that the engine needs a new slide type (an engineering task, separate
from deck writing).
