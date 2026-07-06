# Slide Forge Agent Manual

This file is the first thing any AI agent must read before changing this
project. The presentation is for top management. Treat reliability as the main
feature.

## Non-Negotiable Rules

1. Use the project exactly as it is wired. Do not add setup steps.
2. Use only the commands listed in this file.
3. For normal deck changes, edit JSON in `decks/` only. Do not patch built
   HTML by hand.
4. Do not edit `engine/` unless the user explicitly asks for a new engine
   capability or a verified engine bug fix.
5. Never invent real names, numbers, dates, statuses, or management messages.
   Use clear placeholders like `[Insert exact KPI]` when content is missing.
6. Before saying a deck is ready, run the verification command and visually
   inspect the built HTML.
7. Keep `index.html` as the default flagship deck. Only rebuild it when the
   user explicitly wants the default presentation changed.
8. If a command fails because something is missing, stop and report the exact
   failure. Do not invent a workaround.

## What This Project Is

Slide Forge is a slideshow factory. A deck author edits a JSON file in
`decks/`, then the local engine turns it into a single HTML presentation. The
final HTML can be opened by double-clicking.

The default presentation is:

- Source deck: `decks/seegp-ax-monthly.json`
- Built file: `index.html`

Generated alternative outputs live in `dist/`.

## Required Reading Order

Read these files before changing anything:

1. `AGENTS.md`
2. `docs/PROJECT_MAP.md`
3. `skills/SKILL.md`
4. `skills/deck-schema.md`
5. `skills/design-guide.md`
6. `skills/troubleshooting.md`

Read `skills/theming-guide.md` only when changing or previewing themes.
Read `docs/CHANGE_ON_THE_FLY.md` when the user needs a fast live-meeting edit.
`docs/OFFLINE_OPERATING_MODEL.md` is for the creator/architect, not routine
deck editing.
For architecture expansion work, read `docs/SLIDEFORGE_OS_MASTER_PLAN.md`,
`docs/LOW_INTELLIGENCE_AGENT_COMPATIBILITY.md`, and `tasks/plan.md`.

## Standard Workflow

1. Understand the request.
2. Identify whether it is a deck-content change or an engine-capability change.
3. For deck content, copy the closest deck in `decks/` or edit the requested
   deck directly.
4. Build to `dist/<deck-name>.html` unless the user explicitly says to update
   the default `index.html`.
5. Run:

   ```powershell
   npm run verify
   ```

6. Open the built HTML locally and inspect every slide.
7. Report exactly what changed, what was verified, and any remaining risk.

## Commands

Use only these project commands unless there is a clear reason:

```powershell
npm run list
npm run build
npm run demo
npm run verify
```

Creator-only command:

```powershell
npm run architect:manifest
```

Use it only after an intentional architecture or tooling change has passed
verification.

## Top Management Standard

The deck must be simple, polished, and stable. Prefer:

- Clear English
- Few words per slide
- Numbers only when provided or calculated from provided data
- Visual hierarchy over long explanation
- No jargon unless the audience already uses it

Do not ship a slide that is merely "technically valid" but crowded, vague, or
hard to read from the back of a meeting room.

## Failure Policy

If any verification step fails, do not present the deck as ready. Fix the issue
or clearly say what failed and why. In a live-meeting context, use the safest
available fallback: the last verified HTML file.
