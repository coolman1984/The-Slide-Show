# Work Agent Operating Manual

## Purpose

This manual is for the routine work agent. It explains how to operate the
project after the creator has built the system.

Do not redesign the system. Do not add setup steps. Use the wired commands.

## Basic Rule

Edit deck data. Build output. Verify. Inspect. Deliver.

## Current Default Deck

- Source: `decks/seegp-ax-monthly.json`
- Output: `index.html`

## Common Tasks

### Rebuild The Default Deck

```powershell
npm run build
npm run verify
```

Then open `index.html` and inspect the changed slides.

### Build A New Deck

```powershell
node engine/build.js decks/<deck-name>.json -o dist/<deck-name>.html
npm run verify
```

Then open the output file and inspect every slide.

### Preview A Theme

```powershell
node engine/build.js decks/<deck-name>.json --theme <theme-id> -o dist/<preview-name>.html
npm run verify
```

Then inspect the preview.

### Export A Meeting Package

```powershell
npm run package -- decks/<deck-name>.json packages/<folder-name>
```

Then inspect `packages/<folder-name>/presentation.html`.

### Make A Fast Text Change

1. Edit only the source JSON.
2. Build the output.
3. Run `npm run verify`.
4. Open the output.
5. Jump to the changed slide.
6. Check spelling, spacing, and footer.

## Never Do

- Do not hand-edit generated HTML.
- Do not invent numbers, names, dates, or statuses.
- Do not change `engine/` for a simple deck edit.
- Do not say ready before verification and visual inspection.

## If Something Fails

Stop and report:

- command run
- exact error
- file being changed
- what you expected
- what happened

Do not guess a workaround.

## Ready Response Format

When done, report:

```text
Changed:
- [file]

Built:
- [output file]

Verified:
- npm run verify passed
- visually inspected slides [numbers]

Remaining risk:
- [none / exact issue]
```
