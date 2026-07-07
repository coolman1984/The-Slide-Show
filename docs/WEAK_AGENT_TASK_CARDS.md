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

Automated extraction (DataForge) is not built yet. The safe path today has two
steps, and the weak model NEVER opens the raw file:

**Step 1 — you extract (30 seconds):** open the Excel/Word/PDF yourself, select
the table or numbers, copy, and paste them as plain text into the chat.

**Step 2 — paste this card with your pasted data:**

```text
You are the slide work agent. Do NOT open any Excel, Word, or PDF file.
Use ONLY the data I paste below. It is the single source of truth.

DATA (transcribe exactly — do not calculate, round, translate, or invent):
<paste the copied table/text here>

Task: Put this data into decks/seegp-ax-monthly.json, in the slide with
heading "<HEADING>", into <which part — e.g. the kpi tiles / the Jan column>.

Rules:
- Every number and name must appear character-for-character as in my DATA.
- If a slot needs a value my DATA does not contain, write [Insert ...] and
  tell me the list of missing values. Never fill a gap with a guess.

Then run: npm run build, then npm run verify.
Report what changed, both results, and the missing-values list.
```

Your check for this card: compare 3 random numbers on the rebuilt slide
against the original file. If all 3 match, the transcription is trustworthy.

---

## Why you can stop worrying

- The model cannot break the design — it only touches one JSON file, and the
  engine renders everything.
- The model cannot hide mistakes — the validator names the exact broken field,
  and `npm run verify` fails on any drift.
- You cannot lose the deck — git has the last good version (Emergency rule).
- The only thing the machine cannot do is step 4 of your loop: look at the
  slide. That check stays with you, and it takes ten seconds per slide.
