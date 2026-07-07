# Slide Forge — Grand Improvement Plan (V2)

**Audience:** Mohamed + coding agents. Work agents (slide builders) must ignore this file.
**Relationship to other plans:** `docs/SLIDEFORGE_OS_MASTER_PLAN.md` is the vision (21 layers);
`tasks/implementation_backlog.md` is the task-card queue that built the current system. This
document is the **consolidated audit + prioritized roadmap**: it says what is actually true in
the repo today, what to build next in what order, and what "done" means for each step. When
this plan and older docs disagree, this plan wins; update the older doc in the same commit.

---

## 1. Honest audit — where the project stands today

### Strong and real (verified in-repo)
- **Engine**: 11 slide types, 10 themes, 7 transitions, 9 surface styles, 4 animation
  profiles, 4 backgrounds, 30 icons, accent-slot system with raw-hex escape hatch.
- **Validator**: exact-path errors, density warnings, org-chart trees/groups, dense
  12-month timelines.
- **Default deck**: 6 slides, current org data, presentable now, offline, single file.
- **Weak-agent system**: Control Board → Agent Pack → playbooks/task cards; deck address
  book; `npm run map`.
- **Ops tooling**: `verify` (manifest + static checks), `test` (unit assertions),
  `build:all`, meeting package, PPTX export (screenshot-based), offline manifest.

### Half-built (exists, but doesn't yet deliver its promise)
| Area | Reality today |
|---|---|
| `npm run verify` | Checks files/hashes/JSON — **never opens a browser**. A deck can pass verify with text overflowing the footer. |
| `npm run test` | String/unit assertions on generated HTML — no rendered-layout truth. |
| PPTX export | Slides become **flat screenshots** in a .pptx. Fine as a viewer fallback; not editable, text not selectable, huge files. |
| SlideSpec schema (`schemas/`) | Exists with `specVersion`, but the engine still consumes legacy deck JSON directly; no migration story. |
| DataForge | Plan + folder conventions only (backlog Phase 10 unstarted). |
| Print/PDF | **Zero `@media print` CSS.** Printing index.html today yields one dark page. No PDF export path. |

### Missing entirely (and high-value)
1. **Visual regression gate** — nothing screenshots slides automatically; every layout truth
   so far came from a human/agent manually eyeballing Playwright shots.
2. **Build-time overflow measurement** — density limits are character-count heuristics; the
   engine never measures real rendered boxes.
3. **Arabic / RTL support** — `meta.lang` exists but there is no `dir="rtl"`, no mirrored
   layout, no Arabic font stacks. Mohamed's environment is Arabic (Egypt); sooner or later a
   deck will need it.
4. **Presenter tools** — no speaker notes, no timer, no black-screen (B) key, no safe mode.
5. **Charts** — the flagship use case is management reporting, and the engine cannot draw a
   bar, line, or donut chart. Numbers currently live only in KPI tiles and timeline pills.
6. **The flagship deck is incomplete against its own agenda** — it promises 6 topics; slides
   exist for items 1, 2 and (partly) 3. "Process map example", "Gauss agent case study",
   "Training courses update", "AI Award Introduction" have **no slides**.

### Active risks (things that have already bitten)
- **R1 — Parallel-session merge conflicts.** Generated artifacts (`index.html`, `dist/*`,
  `index.pptx`, `OFFLINE_MANIFEST.json` with timestamps) are committed. Two sessions building
  concurrently produce guaranteed conflicts (this happened on 2026-07-07 and cost a rebase +
  manual conflict resolution in `validate.js`).
- **R2 — Verify gives false confidence.** Green `npm run verify` ≠ presentable deck.
- **R3 — Doc sprawl.** 19 docs / 5,400+ lines with overlapping authority. A weak agent that
  opens the wrong one burns its context; a coding agent may follow a stale plan.
- **R4 — No versioning.** Engine changes can silently re-render old decks differently; there
  is no changelog, no deck `specVersion` enforcement, no golden-output lock.

---

## 2. Quality north star

A deck is **done** only when: every slide has been *rendered and measured* (not guessed);
nothing overlaps or clips at 1920×1080; it opens from a USB stick with no internet on a
Windows meeting-room PC; the presenter can drive it blind (keys memorized); and regenerating
it tomorrow from the same inputs produces the same bytes.

---

## 3. Workstreams

Priorities: **P0** = protects the next meeting; **P1** = biggest quality/leverage wins;
**P2** = capability expansion; **P3** = strategic. Effort: S (≤½ day), M (1–2 days), L (3+).

### Workstream A — Trust & Verification (make quality mechanical)  ★ highest leverage

**A1. Visual verification harness (P0, M)** — `npm run verify:visual`
New `tools/visual_verify.js`: for each deck in `tools/build_targets.json`, build → open in
headless Chromium (Playwright/`playwright-core`, already proven in-session; bundle per
Dependency Bundle Layer for offline) → step through every slide → per slide:
(a) screenshot to `verification/<deck>/<n>.png`,
(b) **DOM overflow scan**: any element whose bounding box crosses the 1920×1080 stage or
overlaps the footer rule ⇒ FAIL with the element's selector and text,
(c) console errors ⇒ FAIL.
Acceptance: seeded overflow deck fails with the offending selector; flagship passes; runs in
`npm run verify` as an opt-in stage (`--visual`) so pure-offline machines can still run the
static verify.

**A2. Screenshot baselines / golden lock (P1, M)**
`verification/baselines/` holds approved PNGs (checked in, small count: flagship + one deck
per slide type from `examples/golden`). Pixel-diff (per-channel tolerance, ignore particle
canvas region) against baselines; intentional changes re-approved via
`npm run verify:visual -- --approve`. Acceptance: editing a font size in css.js without
re-approving fails the gate.

**A3. Contrast auditor (P1, S)**
`tools/audit_contrast.js`: for every theme, compute WCAG ratios for the token pairs the
design guide promises (textHi/cardBg ≥ 7, textMid/cardBg ≥ 4.5, semantic pills, light block).
Wire into `npm run test`. Acceptance: a theme with textMid = cardBg fails naming the pair.

**A4. Deterministic builds (P0, S)**
- `OFFLINE_MANIFEST.json`: replace wall-clock timestamps with content hashes only (a
  `generatedAt` field is churn with zero information — the hash already proves freshness).
- Assert builder output is byte-stable: build twice, diff, in `npm run test`.
Acceptance: two consecutive `build:all` runs produce zero git diff.

**A5. Size & node budgets (P2, S)**
Fail build if a deck HTML exceeds 400 KB or any slide exceeds 1,500 DOM nodes (projector
PCs are weak). Report per-slide counts in build output.

### Workstream B — Presentation-day power

**B1. Presenter keys & safe mode (P0, S)**
Runtime additions: **B** = black screen toggle; **W** = white screen; **T** = show/hide a
corner timer (elapsed since first keypress); URL flag `?safe=1` (and key **S** long-press)
= disable canvas, ambient animation, and transitions — insurance against a weak meeting-room
GPU. All documented in the hint toast and troubleshooting doc.

**B2. Speaker notes (P1, M)**
Deck schema: optional `"notes": "..."` per slide. Runtime: **N** toggles a discreet
bottom-strip overlay visible only on the presenter's screen usage (single-window model —
honest limitation documented; no second-window sync, it breaks on `file://`).
Validator: notes length warning > 500 chars.

**B3. Print & PDF export (P1, M)**
`@media print` stylesheet: each slide becomes one landscape A4/16:9 page — static, all `.a`
elements visible, canvas hidden, exact colors (`print-color-adjust: exact`).
`tools/export_pdf.js`: headless Chrome `--print-to-pdf` per deck. `npm run pdf:default`.
Acceptance: 6-slide flagship → 6-page PDF, every slide complete, no dark ink-flood pages.

**B4. Meeting kit release command (P1, S)**
`npm run release` = build:all → test → verify (+visual where available) → pdf → pptx →
zip `release/<date>-meeting-kit.zip` (HTML + PDF + PPTX + START_HERE.txt). One command the
night before any meeting.

### Workstream C — Engine expressiveness (what management decks actually need)

**C1. `chart` slide type (P1, L)** — pure inline SVG, no libraries: `bar` (grouped/stacked),
`line` (multi-series), `donut`. Data arrays in the deck; theme accent slots color series;
value labels always on (projector readability); optional `target` line. Density validator:
≤ 12 bars, ≤ 3 series, ≤ 6 donut segments.

**C2. `process-map` slide type (P1, M)** — horizontal step flow with arrows, swim-lane
option (2–3 lanes), per-step status chips (AS-WAS / AS-IS toggle badge). This directly
serves agenda item 3 of the flagship deck.

**C3. `table` slide type (P2, M)** — real data table: header row, zebra rows, per-cell
status pills, column alignment, ≤ 7 columns × ≤ 9 rows density guard. (The timeline matrix
is a special case; plain tables keep being faked in bullets today.)

**C4. `quote` + `image` slide types (P2, S/M)** — quote: large pull-quote + attribution.
image: base64 data-URI images (logo, product photo) with size budget (≤ 300 KB per image,
warns) and layout variants (full-bleed / side-by-side with bullets). Keeps the single-file
guarantee.

**C5. `gantt` slide type (P3, M)** — bars across months with today-line; upgrade path from
`timeline-matrix` for duration-style plans.

**C6. Complete the flagship deck (P0, S — content, work-agent task once C2 exists for item 3)**
Add slides for agenda items 3–6 using existing + new types (process-map, card-sections/case
study, kpi, award closing). The factory's showcase deck should honor its own agenda.

### Workstream D — Language & audience

**D1. RTL / Arabic mode (P1, L)**
`meta.lang: "ar"` (or `meta.dir: "rtl"`) ⇒ `dir="rtl"` on stage; logical-property pass over
css.js (`margin-inline-start` etc.); mirrored accents (left borders → inline-start), mirrored
org-chart connector tree; Arabic-safe font stack (`"Segoe UI", "Tahoma", "Noto Naskh Arabic"`
fallbacks); numerals option (`latn`/`arab`). Acceptance: flagship deck built with `--lang ar`
+ translated strings renders mirrored with zero overlapping text; visual harness runs on it.

**D2. Bilingual decks (P2, M)** — optional `heading_ar` style secondary fields rendered as
subtitle lines, or dual-deck build from one JSON with `strings` maps. Decide with Mohamed
after D1 ships.

**D3. Audience redaction profiles (P3, S)** — `--audience internal|board` strips slides or
fields tagged `"confidential": true`; footer switches automatically.

### Workstream E — Authoring & Control Board v2

**E1. Live preview in Control Board (P2, M)** — embed built deck in an `<iframe srcdoc>`;
re-render on choice change using the same JS the CLI uses (share `engine/lib` via a small
browser bundle step — still offline, no CDN).
**E2. In-browser deck editor (P2, L)** — textarea + JSON schema validation (reuse
`schemas/slide-spec.schema.json`) with the same exact-path error messages as the CLI; weak
agents stop round-tripping through the terminal for small text edits.
**E3. Watch mode (P2, S)** — `node engine/build.js <deck> --watch`: rebuild on file change,
print the validator output; pairs with E1 for humans.
**E4. Theme designer tab (P3, M)** — sliders/pickers for the token set, live contrast
readout (reuses A3), exports a `themes/*.json` candidate.

### Workstream F — Data pipelines (DataForge)

Sequence exactly as `tasks/todo.md` already orders it (folder generator → CSV fixture →
Markdown fact packs → Agent Pack wiring → real `.xlsx`). **This plan adds only two
requirements:** (F1, P1) every generated fact carries its source coordinate
(`file!sheet!cell`) so any number on a slide is traceable; (F2, P2) `tools/facts_to_deck.js`
maps a fact pack + template choice to a draft deck mechanically, so the weak agent edits
rather than authors.

### Workstream G — Interop

**G1. Shape-native PPTX export (P2, L)** — replace screenshot-PPTX with true PPTX XML
generation *from the deck JSON* (not from HTML): text boxes, colors, tables for
timeline/table types. Keep screenshot mode as `--rasterize` fallback for exotic slides.
Acceptance: title/agenda/kpi slides fully text-editable in PowerPoint.
**G2. PPTX/screenshot → deck import (P3, L)** — master plan layer 10; keep parked until G1
teaches us the shape mapping.

### Workstream H — Governance & multi-agent operations

**H1. Session concurrency protocol (P0, S)** — add to `AGENTS.md`: *always* `git fetch` +
rebase before commit; never work on generated files directly; regenerate instead of
hand-merging conflicted `dist/*`/`index.html` (resolve by rebuilding). A4 (deterministic
builds) removes most conflict surface.
**H2. Docs consolidation (P1, M)** — 19 docs → 4 entry points with one-line index in
README: START (work agent), BUILD (coding agent), PLAN (this file + master plan), OPS
(verify/release/troubleshooting). Merge or tombstone overlapping docs; every tombstone
points at its successor. No content lost — moved.
**H3. Versioning & changelog (P1, S)** — `engine/VERSION` (semver), `CHANGELOG.md` updated
per engine-behavior commit, decks carry `specVersion`, builder warns on older spec and
offers `tools/migrate_deck.js` (starts as a no-op shell that just bumps the field).
**H4. Deck registry (P2, S)** — `decks/registry.json`: owner, audience, last verified date,
verification screenshot hash. `npm run map` merges this into its report.
**H5. Golden conformance suite (P1, M)** — one minimal deck per slide type in
`examples/golden/` (some exist), each with approved baseline screenshots; the visual harness
runs them all. This is the regression net that makes future engine work safe.

---

## 4. Sequencing — the 90-day line

**Now (this week) — P0:** A1 visual harness → A4 deterministic builds → H1 concurrency
protocol → B1 presenter keys/safe mode → C6 flagship deck completion (content pass).
*Outcome: the next meeting is safe, and two agents can work in parallel without collisions.*

**Weeks 2–4 — P1:** A2 baselines + H5 golden suite (together) → B3 print/PDF → B4 release
command → C1 charts → C2 process-map → A3 contrast audit → H2 docs consolidation → H3
versioning → D1 Arabic/RTL → F1 fact provenance → B2 notes.
*Outcome: quality is mechanical, decks gain charts/process maps, Arabic unlocked.*

**Weeks 5–8 — P2:** C3 table → C4 quote/image → E1 live preview → E2 browser editor → E3
watch → G1 shape-native PPTX → A5 budgets → D2 bilingual (decision) → F2 facts→deck → H4
registry.

**Quarter horizon — P3:** C5 gantt → E4 theme designer → D3 redaction → G2 import.

Dependency spine: **A1 → A2/H5 → everything else** (no engine change lands without the
visual net once it exists). D1 depends on A1 (mirrored layouts need pixel proof). G1 is
independent. E1/E2 depend on a small browser bundle of `engine/lib` (one-time M task, part
of E1).

---

## 5. Definition of done (every task in this plan)

1. Code + docs updated in the same commit; stale doc statements corrected.
2. `npm run test` and `npm run verify` pass; once A1 lands, `verify:visual` passes or
   baselines are consciously re-approved.
3. Rendering changes: flagship + golden decks rebuilt and *seen* (screenshots in PR/commit).
4. No new setup steps for routine deck work; offline single-file guarantee intact.
5. `CHANGELOG.md` entry when engine behavior changes (after H3).

## 6. Non-goals (protecting the core promise)

- No webfonts, CDNs, servers, network calls, or build-time downloads in deck output.
- No per-slide transition overrides; no free-form HTML injection in decks.
- No framework rewrite (React/Vue/etc.) — vanilla generation is the moat: debuggable by any
  agent, runs anywhere, zero dependency risk.
- No cloud/DB storage of deck content; files in git are the database.

## 7. Risk register

| Risk | Mitigation |
|---|---|
| Playwright unavailable on the offline Windows box | Visual harness is opt-in (`--visual`); static verify remains the offline floor; the meeting-kit release runs visual verify on a connected machine before packaging. |
| Baseline PNGs bloat the repo | Few, small (JPEG-quality PNGs ~150 KB), one folder, replaced not accumulated. |
| RTL work destabilizes LTR decks | Logical-property refactor lands behind the golden suite (A2/H5 first), themes untouched. |
| Doc consolidation confuses agents mid-transition | Tombstones with forwarding links; AGENTS.md updated in the same commit. |
| Parallel sessions on this branch | H1 protocol + A4 determinism; when in doubt, rebase and rebuild artifacts rather than merge them. |
