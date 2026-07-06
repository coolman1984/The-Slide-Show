# Weak Agent Handoff Protocol

STOP: This document defines the package produced for the routine slide work
agent. It is not a coding plan.

## Purpose

This protocol keeps a weak agent focused on slide production only.

The agent should not design freely, analyze raw files, or change the software.
It receives a small Agent Pack and produces the requested deck JSON or slide
content JSON.

## Agent Pack

An Agent Pack is a folder created by the Control Board.

```text
projects/<project_id>/
  00_control/
    agent_task.md
    slide_job.json
    locked_choices.json
    validation_summary.md
  02_extracted/
    markdown/
      00_data_index.md
      05_slide_ready_facts.md
      06_data_warnings.md
  03_slide_jobs/
    slide_content.json
    deck_draft.json
```

The work agent should start with:

```text
00_control/agent_task.md
```

## Files The Work Agent May Read

Allowed:

- `00_control/agent_task.md`
- `00_control/slide_job.json`
- `00_control/locked_choices.json`
- `00_control/validation_summary.md`
- `02_extracted/markdown/00_data_index.md`
- `02_extracted/markdown/05_slide_ready_facts.md`
- `02_extracted/markdown/06_data_warnings.md`
- existing deck JSON files in `decks/` when the task asks for a deck output
- project-local skill files needed for deck JSON format

Not allowed unless Mohamed explicitly says so:

- raw Excel files
- raw Word files
- raw PDF files
- raw PPTX files
- engine code
- tools code
- architecture plans
- implementation backlogs

## Required Work Agent Algorithm

1. Read `agent_task.md`.
2. Read `slide_job.json`.
3. Read `locked_choices.json`.
4. Read `00_data_index.md` if data is involved.
5. Read `05_slide_ready_facts.md` and `06_data_warnings.md`.
6. Fill the requested output file.
7. Keep locked choices unchanged.
8. Build the slide or deck using existing commands.
9. Run verification.
10. Inspect the rendered output.
11. Report changed files, built files, verification, and remaining risk.

## Locked Choices

The agent must not change:

- template
- theme
- font profile
- surface style
- color palette
- slide size
- language mode
- data source
- chart type
- export target

If a locked choice causes a problem, the agent should stop and report:

```text
The selected locked choice cannot produce the requested slide because: [reason].
```

## Fact Rules

The agent may:

- summarize facts already present in the fact pack
- choose the most relevant facts when allowed
- rewrite wording within word limits
- preserve source references

The agent must not:

- invent numbers
- estimate missing values
- ignore data warnings
- remove source references
- use hidden data unless selected
- change formulas
- mix currencies
- change date periods

## Output Rules

The agent should output one of these:

- `03_slide_jobs/slide_content.json`
- a new deck JSON in `decks/`
- a rebuilt HTML preview in `dist/`
- a meeting package in `packages/`

The agent must not hand-edit generated HTML.

## Simple Repair Prompts

If output fails validation, the repair instruction must be small.

Good repair:

```text
Card 2 body has 48 words. Rewrite it in 24 words maximum. Return JSON only.
```

Bad repair:

```text
Make the slide better and more executive.
```

## Escalation Rules

The work agent should stop and report when:

- data is missing
- source facts conflict
- validation fails after repair
- the requested template does not exist
- the user wants a feature not supported by current deck JSON
- the preview has unreadable text or broken alignment
- the task requires engine, tool, schema, or template code changes

Use this exact phrase for software changes:

```text
This needs a coding-agent change.
```

## Final Response Format

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

## Acceptance

The protocol is successful when a weak agent can complete a slide task without
reading architecture docs, raw source files, or coding plans.
