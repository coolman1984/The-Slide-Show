# Weak Agent Task Cards — Presentation Day Control Kit

This file is for Mohamed. Each card below is a complete prompt you paste to any
AI agent (weak or strong) to make one exact change to the default presentation.

The system does the thinking, not the model:

- The **validator** rejects broken JSON and points to the exact field.
- The **freshness gate** (`npm run verify`) fails if anything drifted.
- The **engine** owns all design — the model only fills text slots.

## Your loop (memorize only this)

1. Paste ONE card to the agent (fill the blanks).
2. Agent edits `decks/seegp-ax-monthly.json` only.
3. Agent runs `npm run build` then `npm run verify`.
4. YOU open `index.html`, press the slide's number key, and look at it.
5. Not right? Paste the card again with a correction. Right? Done.

Never accept "ready" from the agent without step 4 yourself.

## Emergency rule

If anything goes wrong mid-day, the last good file is one command away:

```powershell
git checkout -- decks/seegp-ax-monthly.json ; npm run build
```

Present the restored `index.html`. Fix calmly later.

---

## CARD 1 — Change text, names, dates, numbers in any slide

```text
You are the slide work agent. Read AGENTS.md rules first.

Task: In decks/seegp-ax-monthly.json, find the slide with heading "<HEADING>"
and change exactly this:
- OLD: "<exact old text>"
- NEW: "<exact new text>"

Rules:
- Edit ONLY that JSON file. Do not touch engine/, index.html, or any other file.
- Copy my NEW text character-for-character. Do not improve or rephrase it.
- Do not change anything I did not list.

Then run: npm run build
Then run: npm run verify
Report: the exact JSON line you changed, and both command results.
```

## CARD 2 — Add a new slide

```text
You are the slide work agent. Read AGENTS.md rules first.

Task: In decks/seegp-ax-monthly.json, add ONE new slide at position <N>
(after the slide with heading "<HEADING BEFORE IT>").

Slide type: <title | agenda | section | bullets | kpi | kpi-dashboard |
card-sections | comparison | org-chart | timeline-matrix | closing>

Content (use exactly, do not invent anything):
<paste your content here — headings, bullet lines, numbers>

Rules:
- Copy the JSON shape for this slide type from skills/deck-schema.md.
- Use my text exactly. For any value I did not give, write [Insert ...] as a
  visible placeholder — never a made-up value.
- Do not modify existing slides.

Then run: npm run build
Then run: npm run verify
Report: the new slide JSON and both command results. If the validator prints
warnings, list them and stop — do not hide them.
```

## CARD 3 — Change colors (whole deck or one element)

Whole-deck look = one word in the file. The 10 themes:
`midnight-tech` (current, navy+cyan) · `corporate-light` · `emerald-night` ·
`royal-violet` · `sunset-ember` · `polar-light` · `editorial-ink` ·
`aurora-purple` · `mint-lab` · `mono-signal`.

Preview WITHOUT touching the real deck first:

```powershell
node engine/build.js decks/seegp-ax-monthly.json --theme emerald-night -o dist/preview.html
```

Open `dist/preview.html`. Like it? Then paste:

```text
You are the slide work agent.
Task: In decks/seegp-ax-monthly.json, change meta.theme from "midnight-tech"
to "<THEME>". Change nothing else.
Then run: npm run build, then npm run verify. Report results.
```

One exact brand color on one element: set that element's `"accent"` to a hex
like `"#e11d48"` (6 digits). Slots `a1`–`a4` re-map with the theme; hex does not.

## CARD 4 — Change fonts

Fonts live inside themes (offline-safe system fonts only — no downloads).
Today you change fonts by choosing a theme, not by naming a font:

| You want | Use theme |
|---|---|
| Clean modern (current) | `midnight-tech`, `corporate-light`, `polar-light` |
| Serif / editorial headings | `editorial-ink` |
| Rounded friendly product look | `aurora-purple`, `mint-lab` |
| Technical monospace | `mono-signal` |

Preview with the CARD 3 command. A custom font stack beyond these is an engine
change — say "this needs a coding-agent change" and do NOT attempt it on
presentation day.

## CARD 5 — Slides 5 & 6 (timeline): more rows, more columns, new data

How the grid works — explain this to the agent in the card:

- **Rows shown = `repeatRows` × 2.** (`"repeatRows": 2` → 4 rows.)
- Each month column is an array of projects. **Give every month exactly
  (repeatRows × 2) project entries** for fully distinct rows — if a column has
  fewer, its entries repeat to fill the rows.
- **Columns = `months`.** Keep ≤ 6 per slide; a 7th makes cards too narrow
  (the validator warns). Need more months? Split into two timeline slides —
  the deck already does exactly this (Jan–Jun / Jul–Dec).
- `status` must be exactly: `completed`, `inprogress`, or `planning`.
- Optional badge: `"badge": "prep"` (purple) or `"badge": "mvp"` (red).

```text
You are the slide work agent. Read AGENTS.md rules first.

Task: In decks/seegp-ax-monthly.json, edit the timeline-matrix slide with
heading "<MASTER TIMELINE MATRIX — JAN–JUN or JUL–DEC>".

Set "repeatRows": <1=2 rows, 2=4 rows, 3=6 rows>.
Replace the "columns" arrays with exactly this data — every month gets
exactly <repeatRows × 2> entries:

<Month 1>: <Project name> | <completed/inprogress/planning> | <badge or none>
<Project name> | <status> | <badge or none>
... (repeat per month, same count each month)

Rules:
- Transcribe my project names and statuses exactly. Invent nothing.
- status values are only: completed, inprogress, planning.
- Do not touch months, legend, or footer unless I listed them.

Then run: npm run build, then npm run verify.
Report the changed slide JSON and both results. List any warnings and stop.
```

Note: at 6 rows (`repeatRows: 3`) cards get short — check readability from
2 meters away on your screen before presenting.

## CARD 6 — Data from Excel / Word / PDF (the safe way today)

> **This is the answer to "how does the agent know which number goes where?"**
> It does NOT know, and it must not guess. YOU decide the mapping once, using
> exact addresses. The agent only places each value at the address you give.
> That is what makes a weak model safe here.

### The address book

Every editable slot in the deck has a fixed address. See them all:

```powershell
npm run map
```

This prints lines like:

```text
slides[6].cards[0].paragraphs[0]   "Best for Google-connected workflows ..."
slides[4].columns[0][0].name       "Data Pipeline Audit"
slides[4].columns[0][0].status     "completed"
```

Reading timeline addresses (slides 5 & 6): `columns[MONTH][ROW].name` —
`columns[0]` = 1st month, `columns[0][0]` = 1st project in it, `columns[0][1]`
= 2nd project. `.name` is the text, `.status` is completed/inprogress/planning.

### Step 1 — you extract (30 seconds)

Open the Excel/Word/PDF yourself. Copy the numbers/text you need. The agent
never opens the file.

### Step 2 — you write the mapping (this is your job, not the model's)

Make a simple two-column list: **address = new value**. You are pairing each
source value with the exact place it belongs. Example:

```text
slides[6].cards[0].paragraphs[0] = Best for real-time market data lookups.
slides[4].columns[0][0].name     = Q1 Cost Audit
slides[4].columns[0][0].status   = completed
slides[3].tiles[0].value         = 38%
```

### Step 3 — paste this card with your mapping

```text
You are the slide work agent. Do NOT open any Excel, Word, or PDF file, and do
NOT decide where anything goes. I have already decided every placement below.

In decks/seegp-ax-monthly.json, set each address to the value I give. Treat the
left side as an exact JSON path and the right side as literal text:

<paste your address = value list here>

Rules:
- Change ONLY the addresses I listed. Touch nothing else.
- Copy each value character-for-character. Do not calculate, round, translate,
  reorder, or improve.
- If an address does not exist in the file, STOP and tell me — do not invent a
  new place for it.

Then run: npm run build, then npm run verify.
Report each address you changed with its old and new value, and both results.
```

Your check: run `npm run map` again after the build and confirm the addresses
you listed now show your new values. Then open `index.html` and look at those
slides.

### If you need MORE rows/columns/cards than exist

Addresses only cover slots that already exist. To add a 3rd project to a month,
or a new tile, the shape must grow first — use **Card 5** (timeline) or
**Card 2** (new slide), which tell the agent to add the structure. Then Card 6
fills the new addresses.

---

## Why you can stop worrying

- The model cannot break the design — it only touches one JSON file, and the
  engine renders everything.
- The model cannot hide mistakes — the validator names the exact broken field,
  and `npm run verify` fails on any drift.
- You cannot lose the deck — git has the last good version (Emergency rule).
- The only thing the machine cannot do is step 4 of your loop: look at the
  slide. That check stays with you, and it takes ten seconds per slide.
