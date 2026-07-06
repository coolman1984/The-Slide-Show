# Work Agent Operating Manual

## Purpose

This manual is for the routine work agent. It explains how to operate the
project after the creator has built the system.

You are here to make slides, not to build the software.

Do not redesign the system. Do not add setup steps. Do not follow coding
plans. Use the wired commands.

## Basic Rule

Edit deck data. Build output. Verify. Inspect. Deliver.

## Your Job

Do:

- create a new deck JSON in `decks/`
- edit an existing deck JSON when asked
- choose a theme, transition, animation profile, and surface style from the
  allowed lists
- build HTML output in `dist/`
- export a meeting package in `packages/`
- run verification and inspect the slides

Do not:

- write code
- edit the engine
- edit tools
- edit schemas
- edit templates
- follow `tasks/implementation_backlog.md`
- follow `docs/CODING_AGENT_EXECUTION_MANUAL.md`

If Mohamed asks for a feature the current deck JSON cannot express, stop and
say: "This needs a coding-agent change." Then explain the missing capability.

## Current Default Deck

- Source: `decks/seegp-ax-monthly.json`
- Output: `index.html`

## Common Tasks

### Use A Control Board Agent Pack

If Mohamed gives you an Agent Pack folder, do this first:

1. Read `00_control/agent_task.md`.
2. Read `00_control/slide_job.json`.
3. Read `00_control/locked_choices.json`.
4. If data is included, read `02_extracted/markdown/00_data_index.md`.
5. If data is included, read `02_extracted/markdown/05_slide_ready_facts.md`.
6. If data is included, read `02_extracted/markdown/06_data_warnings.md`.

Follow locked choices exactly. Do not change theme, template, font, shape,
layout, color, or data source if locked.

Do not analyze raw Excel, Word, PDF, or PPTX files unless Mohamed explicitly
asks for that.

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

### Preview Style Options

Use only values from:

```powershell
node engine/build.js --list
```

Then build a preview:

```powershell
node engine/build.js decks/<deck-name>.json --theme <theme-id> --transition <transition> -o dist/<preview-name>.html
npm run verify
```

For `animationProfile` and `surfaceStyle`, edit the deck JSON `meta` fields,
then build.

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
- Do not open or execute coding plans unless Mohamed explicitly says you are
  the coding agent.
- Do not mark task checkboxes in `tasks/`.
- Do not modify `OFFLINE_MANIFEST.json` manually.
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
