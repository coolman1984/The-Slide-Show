# Skill: Operate The Control Board

Use this skill when the task is to choose slide options, create an Agent Pack,
or explain how the Control Board should be used.

Do not use this skill to edit the slide engine.

## Purpose

The Control Board turns human choices into locked files for the work agent.

The user chooses:

- project and meeting name
- source files
- prepared facts
- warnings
- template
- theme
- surface style
- font profile
- animation profile
- transition
- density
- output type

The output is an Agent Pack.

## Current Files

- `dist/control-board.html`
- `packages/control-board-demo/control-board.html`
- `packages/control-board-demo/sample-agent-pack/`
- `tools/build_control_board.js`
- `tools/create_agent_pack.js`
- `tools/lib/agent_pack.js`

## Commands

Build the Control Board:

```powershell
npm run control-board:build
```

Create a demo Agent Pack:

```powershell
npm run agent-pack:demo
```

Run tests:

```powershell
npm test
```

## Agent Pack Output

Required files:

- `00_control/agent_task.md`
- `00_control/slide_job.json`
- `00_control/locked_choices.json`
- `00_control/render_config.json`
- `00_control/control_state.json`
- `00_control/validation_summary.md`
- `02_extracted/markdown/00_data_index.md`
- `02_extracted/markdown/05_slide_ready_facts.md`
- `02_extracted/markdown/06_data_warnings.md`

## Edge Cases

| Case | Correct Handling |
|---|---|
| No source files | Allow prepared-facts-only mode |
| No facts | Warn before handoff |
| Unsupported file type | Record as `file`; do not pretend extraction works |
| Long title | Warn through validation |
| Theme outside contract | Warn and do not silently switch |
| Surface outside contract | Warn and do not silently switch |
| Mixed language with poor font | Warn |
| User changes choices | Regenerate Agent Pack |
| Agent changes locked choice | Reject output |
| Missing source fact | Report missing fact, do not invent |

## Done Means

- Control Board builds.
- Agent Pack files are generated.
- `npm test` passes.
- `npm run verify` passes.
- Browser view is inspected when layout changes.
