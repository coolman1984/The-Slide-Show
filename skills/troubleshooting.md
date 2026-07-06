# Troubleshooting & edge cases

## Build errors

| Message | Fix |
|---|---|
| `is not valid JSON` | Trailing comma, comment, smart quotes, or unescaped `"` inside a string. Lint the JSON. |
| `meta.theme: unknown theme` | Typo — the error lists valid names. Or you meant to add a theme (see theming-guide). |
| `slides[N].type: unknown type` | The error lists all 10 valid types. Pick the closest. |
| `slides[N].columns has X entries but months has Y` | timeline-matrix needs exactly one `columns` array per month label. |
| `initials: required, max 2 characters` | Avatar circles fit 2 letters. Use first+last initial. |
| `Deck file not found` | The build lists available decks under `decks/` — check the path. |

## Build warnings (deck builds, but…)

Warnings are overflow predictions. For any deck a human will present, treat them as errors:
- `X items — more than 8 agenda rows will overflow` → split into two agenda slides.
- `column may overflow vertically (keep teams+members ≤ 13 rows)` → move a team to another
  division column or drop role text.
- `bodies over ~160 chars may overflow the card` → tighten the sentence.
- `icon "x" not in library` → falls back to a dot; pick from the listed names.

## Visual issues

| Symptom | Cause / fix |
|---|---|
| Text touches the footer line | Too much content — respect density limits in design-guide.md. |
| A name wraps oddly in org chart | Names ≤ ~34 chars fit one row. Shorten the role text first, it truncates less gracefully. |
| Two accents look identical | The theme's slots are close in hue; use a1 vs a4 (widest apart) or a raw hex. |
| Timeline cards look huge/empty | You used `repeatRows: 1` with little content — that's valid, or add a second project per month. |
| Particles invisible on a light theme | Expected: light themes use `none` or faint particles. Set `meta.background` only if you must. |
| Slide is blank in the browser | Open DevTools console. A JS error there means an engine bug — report it; do not patch the built HTML. |

## Presentation-day edge cases (already handled — know they exist)

- **Any screen size:** the 1920×1080 stage letterboxes and scales; nothing reflows or breaks.
- **Offline:** output is one file, zero network. Works from a USB stick via `file://`.
- **Projector color shift:** dark themes keep ≥ 7:1 text contrast; timeline slides are light
  on purpose so dense grids survive weak projectors.
- **Reduced motion:** all animation (entrances, particles, transitions) disables automatically
  under OS "reduce motion"; slides jump-cut instead.
- **Tab hidden / light slide active:** the particle canvas pauses (no fan spin-up mid-meeting).
- **Presenter mishits:** number keys jump only to existing slides; navigation clamps at both
  ends; manual navigation kills autoplay so it never fights the presenter.
- **Touch devices:** ≥ 50px swipes navigate; edge taps work like edge clicks.

## Things the engine deliberately does NOT do

- No external images/videos/webfonts — they break the offline, single-file guarantee.
- No per-slide transition overrides — one transition per deck keeps it elegant.
- No raw HTML injection through deck strings — everything is escaped for safety. If you type
  `<b>bold</b>` it will show literally. Emphasis comes from structure, not markup.
- No speaker notes view (single-file constraint). Keep notes in a separate doc.

## Regenerating the default presentation

If `index.html` was accidentally edited or corrupted:
```bash
npm run build     # rebuilds index.html from decks/seegp-ax-monthly.json
```
If the deck JSON itself was damaged, restore it from git history — it is the source of truth.
