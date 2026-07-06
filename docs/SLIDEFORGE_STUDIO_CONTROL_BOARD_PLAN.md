# SlideForge Studio Control Board Plan

STOP: This document is for creator and coding agents only.

The routine slide work agent should not implement this plan. The work agent
should only consume the final Agent Pack produced by this system.

## Purpose

SlideForge needs a simple offline Windows 11 control page where Mohamed can
choose the slide design visually, preview it, and submit one clean job package
for a weak work agent.

The weak agent should not decide theme, shape, font, layout, or data source by
guessing. The human chooses from safe controls. The app records those choices
as strict JSON.

## Current Implementation Status

MVP implemented:

- `dist/control-board.html`
- `packages/control-board-demo/control-board.html`
- `packages/control-board-demo/sample-agent-pack/`
- `tools/build_control_board.js`
- `tools/create_agent_pack.js`
- `tools/lib/agent_pack.js`

Current command:

```powershell
npm run control-board:build
```

The current MVP supports visual choices, a live preview, prepared facts, source
file names, validation warnings, and Agent Pack generation. DataForge
extraction from real Excel, Word, PDF, and PPTX files is still the next phase.

## Product Principle

User chooses visually.
DataForge prepares the data.
Weak agent fills structured content.
SlideForge renders the final design.

## Target User Experience

The user opens:

```text
SlideForge Studio
```

The first screen is a working control board, not a technical dashboard and not
a marketing landing page.

The screen has five zones:

1. Project and files
2. Data selection
3. Slide and design choices
4. Live preview
5. Validate and submit

## Zone 1: Project And Files

Controls:

- Project name
- Meeting name
- Output folder
- Slide size: 16:9, 4:3, A4 landscape
- Language: English, Arabic, mixed
- Confidentiality footer: off, confidential, internal, management only
- Source files: Excel, Word, PDF, image, PPTX
- Optional logo file

Rules:

- The original files are copied into the project folder.
- The original files are never modified.
- File names are cleaned for Windows-safe paths.
- Every file gets a checksum and intake log.

## Zone 2: Data Selection

The user should not write SQL.

Controls:

- Workbook
- Sheet
- Table
- Pivot table
- Metric
- Date range
- Department
- Product
- Category
- Status
- Top N selector
- Compare actual vs target
- Show monthly trend
- Show variance

The app converts these choices into a stored query or selected fact pack.

Example:

```json
{
  "data_selection": {
    "source_kind": "prepared_data",
    "query_id": "monthly_saving_by_department",
    "filters": {
      "period": "2026-06",
      "department": "all",
      "top_n": 5
    }
  }
}
```

## Zone 3: Slide And Design Choices

Controls:

- Slide type: cover, agenda, KPI dashboard, comparison, timeline, org chart,
  role cards, process map, decision slide, appendix table
- Template family
- Theme
- Font profile
- Color palette
- Surface style
- Card shape
- Background style
- Icon style
- Density
- Animation profile
- Transition
- Footer style
- Source citation visibility

Every option must come from an allowed catalog. No free-form design text should
be sent to the weak agent.

Example design choices:

```json
{
  "slide_type": "kpi_dashboard",
  "template_id": "family_001_kpi_dashboard",
  "theme_id": "corporate_light",
  "font_profile": "modern_sans",
  "surface_style": "soft",
  "density": "comfortable",
  "animation_profile": "calm",
  "transition": "vertical"
}
```

## Zone 4: Live Preview

Preview behavior:

- Show a small slide preview before submit.
- Use sample text when data is not selected yet.
- Use selected facts when DataForge output is ready.
- Show warnings directly near the preview.
- Never allow a preview that hides overflow or collisions.

Preview warnings:

- Title too long
- Too many cards
- Missing data
- Unsupported theme
- Missing font
- Low contrast
- Source file not extracted
- Pivot table not refreshed
- Data warning exists

## Zone 5: Validate And Submit

The submit button should create an Agent Pack.

Default button label:

```text
Create Agent Pack
```

The package should contain:

```text
projects/<project_id>/
  00_control/
    agent_task.md
    slide_job.json
    locked_choices.json
    render_config.json
    validation_summary.md
  01_sources/
    original/
    working/
  02_extracted/
    markdown/
    db/
    tables/
    warnings/
  03_slide_jobs/
    deck_draft.json
    slide_content.json
  04_renders/
    preview.html
    final.html
    exports/
  05_logs/
    intake_log.md
    extraction_log.md
    agent_log.md
    render_log.md
    export_log.md
```

## slide_job.json Contract

This is the main file the weak agent can read.

```json
{
  "job_id": "meeting_2026_07_10_slide_07",
  "job_mode": "weak_agent_safe",
  "project_name": "Monthly Operations Review",
  "requested_output": "single_slide",
  "slide_type": "kpi_dashboard",
  "template_id": "family_001_kpi_dashboard",
  "theme_id": "corporate_light",
  "font_profile": "modern_sans",
  "surface_style": "soft",
  "density": "comfortable",
  "language": "en",
  "locked_design": true,
  "data_inputs": [
    {
      "kind": "fact_pack",
      "path": "02_extracted/markdown/05_slide_ready_facts.md"
    }
  ],
  "agent_permissions": {
    "can_rewrite_text": true,
    "can_select_facts_from_fact_pack": true,
    "can_change_template": false,
    "can_change_theme": false,
    "can_change_colors": false,
    "can_change_layout": false,
    "can_read_raw_sources": false,
    "can_invent_data": false
  }
}
```

## agent_task.md Contract

This is the simple instruction file for a weak model.

It should say:

- What output is needed
- Which files to read
- Which files not to read
- Which choices are locked
- What JSON file to fill
- What to do if data is missing

It must not include architecture explanation.

## Design Locking Rules

Default:

- Template is locked
- Theme is locked
- Font is locked
- Layout is locked
- Data source is locked
- Agent may only rewrite text within word limits

The user can unlock options manually, but unlocks must be visible and logged.

## Recommended Technology Path

MVP:

- Offline HTML control page
- Local JSON catalogs for templates, themes, fonts, surfaces, transitions
- Browser file picker where possible
- Generated JSON files saved by the local app wrapper or copied by the user
- Existing SlideForge renderer for previews

Production:

- Tauri desktop app if small native Windows package is preferred
- Electron if faster development and richer Node integration is preferred
- Local backend using Node scripts already in this repo
- Optional Python worker for Office extraction
- SQLite for project metadata
- DuckDB for analytics data
- Playwright for final screenshots and export checks

Offline packaging must include every runtime, browser binary, font, icon,
template, and script required by the app.

## Catalog Files Needed

Creator agents should add these catalogs later:

```text
control-board/catalogs/
  templates.json
  themes.json
  font_profiles.json
  surface_styles.json
  animation_profiles.json
  transitions.json
  chart_types.json
  export_targets.json
```

The control board must read catalogs instead of hard-coding choices.

## Weak-Agent Safety Rules

- Never ask the weak agent to design.
- Never ask the weak agent to inspect raw Excel, Word, PDF, or PPTX files.
- Never give the weak agent a large mixed instruction.
- Give one task, one schema, one output file.
- Lock human design choices before the agent sees the job.
- Validate the agent output before rendering.
- Reject invented facts.

## Edge Cases And Required Handling

| Edge Case | Required Handling |
|---|---|
| User selects no source file | Allow manual slide content mode |
| User selects unsupported file | Show clear warning before submit |
| Missing font | Use approved fallback and log warning |
| Theme not compatible with slide type | Block submit or suggest compatible theme |
| Too many cards | Suggest split slide or denser template |
| Long title | Warn before submit and offer shorter title field |
| User changes choices after submit | Create a new job version |
| Output folder locked | Ask for another folder and do not overwrite silently |
| Duplicate project name | Create versioned folder suffix |
| Mixed Arabic and English | Set language mode and font fallback explicitly |
| Confidential source | Enable footer and redaction controls |
| Bad preview | Block final export until warning is accepted or fixed |
| Weak agent changes locked choice | Reject output and repair prompt |
| Data warning exists | Show warning in validation summary |

## First Implementation Phases

### Phase A: Static Control Board Spec

- Add catalogs as JSON.
- Add a simple one-page mock control board.
- No live extraction yet.
- Submit creates example `slide_job.json` and `agent_task.md`.

### Phase B: Local Preview Integration

- Use current renderer to build a preview from selected choices.
- Show warnings from existing validation.
- Support theme, transition, surface, and animation choices.

### Phase C: DataForge Connection

- Let the user choose prepared data outputs.
- Connect selected facts to `slide_job.json`.
- Generate `data_inputs` paths.

### Phase D: Desktop Wrapper

- Package the control board as a Windows app.
- Add local file save, project folders, logs, and version history.

## Acceptance For The Final Control Board

- A non-technical user can choose design options without editing JSON.
- The weak agent receives only simple task files.
- Every choice is recorded in JSON.
- Preview works offline.
- No internet is required.
- The output package is understandable without architecture knowledge.
