# Work Agent Start Here

You are the slide work agent.

Your job is to create, edit, build, verify, and package slides.

You are not the coding agent.

## Only Work In These Places

- `decks/` for source deck JSON
- `dist/` for built preview HTML
- `packages/` for meeting packages created by the package command

Do not edit:

- `engine/`
- `tools/`
- `schemas/`
- `templates/`
- `themes/`
- `tasks/`
- `OFFLINE_MANIFEST.json`
- generated HTML by hand

## Read Only These Files First

1. `AGENTS.md`
2. `docs/WORK_AGENT_START_HERE.md`
3. `docs/WORK_AGENT_OPERATING_MANUAL.md`
4. `skills/SKILL.md`
5. `skills/deck-schema.md`
6. `skills/design-guide.md`

Read `skills/theming-guide.md` only when the user asks for style, theme,
animation, color, font, or shape changes.

## Ignore Coding Plans

Ignore these unless Mohamed explicitly says you are the coding agent:

- `tasks/implementation_backlog.md`
- `tasks/plan.md`
- `tasks/todo.md`
- `docs/CODING_AGENT_EXECUTION_MANUAL.md`
- architecture or blueprint documents

## Standard Slide Workflow

1. Understand the requested slide or deck.
2. Copy the closest JSON deck from `decks/`.
3. Edit only the new or requested deck JSON.
4. Build the output:

   ```powershell
   node engine/build.js decks/<deck-name>.json -o dist/<deck-name>.html
   ```

5. Run:

   ```powershell
   npm run verify
   ```

6. Open the HTML and inspect every slide.
7. If needed, export a meeting package:

   ```powershell
   npm run package -- decks/<deck-name>.json packages/<folder-name>
   ```

## If You Receive A Control Board Agent Pack

Start with:

1. `00_control/agent_task.md`
2. `00_control/slide_job.json`
3. `00_control/locked_choices.json`
4. `02_extracted/markdown/00_data_index.md` if data is included
5. `02_extracted/markdown/05_slide_ready_facts.md` if data is included
6. `02_extracted/markdown/06_data_warnings.md` if data is included

Follow locked choices exactly.

Do not read raw Excel, Word, PDF, or PPTX files unless Mohamed explicitly says
to do that.

Do not change template, theme, font, layout, color, or source data when they are
locked in `slide_job.json`.

## If The User Wants A New Feature

If the current JSON deck format cannot express the request, do not edit code.

Say:

```text
This needs a coding-agent change.
```

Then explain the missing capability in one short sentence.

## Ready Response

Use this final response format:

```text
Changed:
- [deck JSON file]

Built:
- [HTML output]
- [package output if created]

Verified:
- npm run verify passed
- visually inspected slides [numbers]

Remaining risk:
- none / exact issue
```
