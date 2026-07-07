# Slide Forge Agent Manual

This file is the first thing any AI agent must read before changing this
project. The presentation is for top management. Treat reliability as the main
feature.

## Non-Negotiable Rules

1. Use the project exactly as it is wired. Do not add setup steps.
2. Use only the commands listed in this file.
3. Your normal job is to make or change slides. For normal work, edit JSON in
   `decks/` only. Do not patch built HTML by hand.
4. You are not the coding agent. Do not edit `engine/`, `tools/`, `schemas/`,
   `templates/`, `themes/`, or `tasks/` unless Mohamed explicitly says:
   "you are the coding agent" or "change the engine".
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

## Routine Work Agent Reading Order

If you are here to create or edit slides, read only these files first:

1. `AGENTS.md`
2. `docs/WORK_AGENT_START_HERE.md`
3. `docs/LOW_LEVEL_WORK_AGENT_PLAYBOOK.md`

Then read only the file that matches the task:

- `skills/SKILL.md` and `skills/deck-schema.md` for deck JSON work.
- `skills/theming-guide.md` for theme, color, font, animation, or shape work.
- `skills/control-board.md` for Control Board or Agent Pack work.
- `skills/dataforge-excel.md` for Excel extraction work.
- `skills/dataforge-pdf.md` for PDF extraction work.
- `skills/dataforge-db-markdown.md` for DB, Markdown, and fact-pack work.
- `docs/CHANGE_ON_THE_FLY.md` for fast live-meeting edits.

Do not read or follow coding plans for routine slide work. They are not your
task.

## Coding-Agent Documents

The following files are for creator/coding work only:

- `docs/SLIDEFORGE_OS_MASTER_PLAN.md`
- `docs/PRODUCT_AND_EXPERIENCE_SPEC.md`
- `docs/ARCHITECTURE_BLUEPRINT.md`
- `docs/QUALITY_AND_GOVERNANCE_GATES.md`
- `docs/LOW_INTELLIGENCE_AGENT_COMPATIBILITY.md`
- `docs/SLIDEFORGE_STUDIO_CONTROL_BOARD_PLAN.md`
- `docs/DATAFORGE_LOCAL_DATA_PIPELINE_PLAN.md`
- `docs/WEAK_AGENT_HANDOFF_PROTOCOL.md`
- `docs/IDEA_INTAKE_DECISIONS.md`
- `docs/CODING_AGENT_EXECUTION_MANUAL.md`
- `docs/OFFLINE_OPERATING_MODEL.md`
- `tasks/plan.md`
- `tasks/todo.md`
- `tasks/implementation_backlog.md`

Ignore those files unless Mohamed explicitly says you are doing project
architecture, coding, or engine expansion.

## Standard Workflow

1. Understand the request.
2. Assume it is a deck-content change unless Mohamed clearly says otherwise.
3. Copy the closest deck in `decks/` or edit the requested
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
npm run control-board:build
npm run agent-pack:demo
npm run verify
npm run package
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
