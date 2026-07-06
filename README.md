# Slide Forge

**Self-contained delivery:** the final presentation is one HTML file that opens
by double-clicking. Routine deck work uses the commands already wired in this
project.

A layered slideshow factory. It turns a simple **JSON deck file** into a single, self-contained,
animated HTML presentation — the kind you can present to top management, built by *any* AI agent
or human, because all of the hard parts (design, layout, animation, theming, edge cases) live in
the engine and the written skills, not in the head of whoever is writing the deck.

**The default deck** (`decks/seegp-ax-monthly.json` → `index.html`) is the SEEG-P AX monthly
meeting presentation. It is always kept buildable and presentable. Open `index.html`, press `F`
for fullscreen, present with the arrow keys.

## The three layers

| Layer | Where | Who touches it |
|---|---|---|
| **1. Engine** (code) | `engine/` | Nobody, normally. It renders slide types, themes, animation, navigation, and validates decks with friendly errors. |
| **2. Skills** (instructions) | `skills/` | Read by AI agents before building a deck. Schema reference, design rules, theming guide, troubleshooting. |
| **3. Decks** (data) | `decks/` | This is what you create or edit — pure JSON content. One file per presentation. |

## Quickstart

```bash
# Verify the project is ready for presentation
npm run verify

# Rebuild the default presentation (writes index.html at the repo root)
npm run build

# Build any deck
node engine/build.js decks/my-deck.json -o dist/my-deck.html

# Try the same deck in a different look, without editing anything
node engine/build.js decks/my-deck.json --theme emerald-night --transition fade -o dist/preview.html

# See every available theme, slide type, icon, transition, background
node engine/build.js --list

# Build the offline Control Board
npm run control-board:build

# Create a demo Agent Pack for a weak work agent
npm run agent-pack:demo
```

For AI agents, start at `AGENTS.md`, then follow `skills/SKILL.md`.

## Offline Control Board

The Control Board is the simple Windows-friendly front door for slide
work. Open `dist/control-board.html` or
`packages/control-board-demo/control-board.html`, choose template, theme, font,
surface, animation, transition, source files, and prepared facts, then download
the Agent Pack files.

The work agent reads the Agent Pack. It does not choose design freely and does
not analyze raw Excel, Word, PDF, or PPTX files by default.

The output HTML has **zero external dependencies** — no internet, no server, no fonts to install.
Double-click it anywhere and it works. Keyboard: `←/→` navigate, `1–9` jump, `F` fullscreen,
`P` autoplay. Click screen edges or swipe on tablets. Controls auto-hide while presenting.

## What a deck file looks like

```json
{
  "meta": { "title": "My Deck", "theme": "midnight-tech", "transition": "slide",
            "footer": "CONFIDENTIAL & PROPRIETARY" },
  "slides": [
    { "type": "title",  "heading": "Quarterly Review", "subheading": "[Q3 2026]" },
    { "type": "agenda", "items": ["1. Results", "2. Roadmap", "3. Asks"] },
    { "type": "kpi",    "index": "1", "heading": "Results",
      "tiles": [ { "value": "38%", "label": "Growth", "accent": "a1" } ] }
  ]
}
```

11 slide types: `title, closing, agenda, org-chart, card-sections,
timeline-matrix, comparison, section, bullets, kpi, kpi-dashboard`. 10 themes.
7 transitions. 4 background modes. 30 icons.
4 accent slots per theme plus raw-hex accents for exact brand colors. Everything is listed by
`--list` and documented in `skills/deck-schema.md`.

## For AI agents

**Start at `skills/SKILL.md`** — it is the step-by-step workflow. Then keep
`skills/deck-schema.md` open as the reference while writing the deck. The builder validates
your file and tells you exactly what is wrong and where; warnings tell you when content will
overflow before you ever open a browser.

## Repository map

```
index.html                    ← the built default presentation (always presentable)
decks/seegp-ax-monthly.json   ← the default deck (source of index.html)
decks/demo-product-launch.json← demo showing other types/theme/transition
engine/build.js               ← CLI entry
engine/lib/themes.js          ← theme registry (add new themes here)
engine/lib/icons.js           ← icon library (add new icons here)
engine/lib/css.js             ← design system stylesheet
engine/lib/render.js          ← slide-type renderers
engine/lib/runtime.js         ← in-browser navigation/animation runtime
engine/lib/validate.js        ← deck validation + density warnings
skills/                       ← instructions for agents (start with SKILL.md)
dist/                         ← built decks (generated, safe to delete)
PLAN.md                       ← the original design spec of the flagship deck
```
