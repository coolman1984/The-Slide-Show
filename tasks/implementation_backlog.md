# Implementation Backlog For Coding Agents

STOP: This file is not for the routine slide work agent.

Use this file only if Mohamed explicitly says you are the coding agent, engine
agent, architecture agent, or implementation agent. If the request is to create
or edit slides, ignore this file and use `docs/WORK_AGENT_OPERATING_MANUAL.md`
instead.

This backlog is the task source for cheap-token coding agents. Work in order.
Do not skip phases. Keep tasks small.

## Phase 0: Current System Safety

### Task 0.1: Confirm Baseline

Description: Confirm the current repo builds and verifies before changes.

Acceptance:

- [x] `npm run build` succeeds.
- [x] `npm run demo` succeeds.
- [x] `npm run verify` succeeds.

Verification:

- [x] Paste command results into the task handoff.

Files likely touched:

- none

Dependencies: none.

### Task 0.2: Add Baseline Notes

Description: Add a short note documenting that current deck is protected.

Acceptance:

- [x] Note points to `decks/seegp-ax-monthly.json`.
- [x] Note says default output is `index.html`.
- [x] Note says current deck content changes require explicit user request.

Verification:

- [x] `npm run verify`.

Files likely touched:

- `docs/PROJECT_MAP.md`

Dependencies: Task 0.1.

## Phase 1: SlideSpec Core

### Task 1.1: Create Schema Folder

Description: Create `schemas/` with README explaining that SlideSpec is the
future public contract and current deck JSON remains supported.

Acceptance:

- [x] `schemas/README.md` exists.
- [x] README explains current-vs-future relationship.
- [x] No engine behavior changes.

Verification:

- [x] `npm run verify`.

Files likely touched:

- `schemas/README.md`

Dependencies: Phase 0.

### Task 1.2: Add Initial SlideSpec Schema

Description: Add `schemas/slide-spec.schema.json` with top-level deck and slide
structure.

Acceptance:

- [x] Schema has `specVersion`.
- [x] Schema has `deck`.
- [x] Schema has `slides`.
- [x] Slide requires `slideId`, `templateId`, `themeId`, and `content`.
- [x] Schema disallows unknown top-level fields.

Verification:

- [x] JSON parses with Node.
- [x] `npm run verify`.

Files likely touched:

- `schemas/slide-spec.schema.json`
- `schemas/README.md`

Dependencies: Task 1.1.

### Task 1.3: Add SlideSpec Examples

Description: Add one valid and one invalid SlideSpec example.

Acceptance:

- [x] `examples/golden/slidespec-cover.json` exists.
- [x] `examples/bad/slidespec-extra-field.json` exists.
- [x] Examples are small and readable.

Verification:

- [x] JSON parses for valid example.
- [x] `npm run verify`.

Files likely touched:

- `examples/golden/slidespec-cover.json`
- `examples/bad/slidespec-extra-field.json`

Dependencies: Task 1.2.

### Task 1.4: Add Basic SlideSpec Validator

Description: Add a no-dependency validator script for the initial schema.

Acceptance:

- [x] `tools/validate_slidespec.js` exists.
- [x] Valid example passes.
- [x] Invalid example fails.
- [x] Errors include field path and code.

Verification:

- [x] `node tools/validate_slidespec.js examples/golden/slidespec-cover.json`
- [x] `node tools/validate_slidespec.js examples/bad/slidespec-extra-field.json` fails.
- [x] `npm run verify`.

Files likely touched:

- `tools/validate_slidespec.js`
- `package.json`

Dependencies: Task 1.3.

## Phase 2: Template Registry

### Task 2.1: Create Template Registry

Description: Add `templates/registry.json` with current slide types mapped to
future template IDs.

Acceptance:

- [x] Cover/title template registered.
- [x] Agenda template registered.
- [x] Org chart template registered.
- [x] Role cards template registered.
- [x] Timeline matrix template registered.
- [x] Comparison template registered.

Verification:

- [x] Registry JSON parses.
- [x] `npm run verify`.

Files likely touched:

- `templates/registry.json`
- `docs/PROJECT_MAP.md`

Dependencies: Phase 1.

### Task 2.2: Add Template Registry Validator

Description: Add script that verifies every template has required metadata.

Acceptance:

- [x] Script checks `templateId`.
- [x] Script checks `slideType`.
- [x] Script checks `requiredFields`.
- [x] Script checks `densityLimits`.
- [x] `npm run verify` calls it or a documented command exists.

Verification:

- [x] Registry validator passes.
- [x] `npm run verify`.

Files likely touched:

- `tools/validate_templates.js`
- `package.json`

Dependencies: Task 2.1.

### Task 2.3: Add Template Examples

Description: Add one good and one bad example for each registered current
template.

Acceptance:

- [x] Examples are in `examples/golden/family-001/`.
- [x] Bad examples are in `examples/bad/family-001/`.
- [x] Each example references a template ID.

Verification:

- [x] Example JSON parses.
- [x] `npm run verify`.

Files likely touched:

- `examples/golden/family-001/*.json`
- `examples/bad/family-001/*.json`

Dependencies: Task 2.2.

## Phase 3: Theme And Surface Contracts

### Task 3.1: Create Theme Token Schema

Description: Add `themes/theme-token.schema.json` and initial catalog.

Acceptance:

- [x] Schema has colors, typography, surfaces, footer, semantic status colors.
- [x] Catalog includes `ai-executive-dark-tech`.
- [x] Catalog includes `corporate-light`.

Verification:

- [x] JSON parses.
- [x] `npm run verify`.

Files likely touched:

- `themes/theme-token.schema.json`
- `themes/catalog.json`

Dependencies: Phase 2.

### Task 3.2: Add Surface Style Registry

Description: Add approved surface styles for controlled shape variations.

Acceptance:

- [x] `themes/surface-styles.json` exists.
- [x] Includes `rounded-card`, `sharp-card`, `glass-card`, `ticket-cutout`,
      `folder-tab`, `split-panel`, `badge-stack`, `memo-panel`.
- [x] Each style has label, allowedUse, and implementationStatus.

Verification:

- [x] JSON parses.
- [x] `npm run verify`.

Files likely touched:

- `themes/surface-styles.json`

Dependencies: Task 3.1.

## Phase 4: Weak-Agent Prompt Compiler

### Task 4.1: Create Prompt Compiler Folder

Description: Add prompt compiler docs and template format.

Acceptance:

- [x] `engine/prompt_compiler/README.md` exists.
- [x] Explains one-task prompt rule.
- [x] Explains JSON-only outputs.

Verification:

- [x] `npm run verify`.

Files likely touched:

- `engine/prompt_compiler/README.md`

Dependencies: Phase 1.

### Task 4.2: Add First Prompt Templates

Description: Add prompt templates for extraction, rewrite, fill JSON, and
repair.

Acceptance:

- [x] `extract-agenda.md`
- [x] `rewrite-card-body.md`
- [x] `fill-slidespec.md`
- [x] `repair-json.md`
- [x] Each prompt has objective, input, output JSON shape, and failure behavior.

Verification:

- [x] prompts are readable and small.
- [x] `npm run verify`.

Files likely touched:

- `engine/prompt_compiler/prompts/*.md`

Dependencies: Task 4.1.

## Phase 5: Repair Rules

### Task 5.1: Add Repair Rule Registry

Description: Add repair mapping from validator codes to exact instructions.

Acceptance:

- [x] Registry includes `TEXT_TOO_LONG`.
- [x] Registry includes `MISSING_REQUIRED_FIELD`.
- [x] Registry includes `INVALID_ENUM`.
- [x] Registry includes `UNKNOWN_TEMPLATE_ID`.
- [x] Registry does not invent missing facts.

Verification:

- [x] `npm run verify`.

Files likely touched:

- `engine/repair/repair_rules.js`
- `engine/repair/README.md`

Dependencies: Phase 2.

## Phase 6: First New Template

### Task 6.1: Add KPI Dashboard Contract

Description: Add contract and examples for a KPI dashboard template.

Acceptance:

- [x] Template registered.
- [x] Good example exists.
- [x] Bad over-density example exists.
- [x] Validation rules exist.

Verification:

- [x] `npm run verify`.

Files likely touched:

- `templates/registry.json`
- `examples/golden/family-001/kpi-dashboard.json`
- `examples/bad/family-001/kpi-dashboard-too-many-tiles.json`

Dependencies: Phase 2.

### Task 6.2: Implement KPI Dashboard Renderer

Description: Add renderer support for KPI dashboard if not already covered by
current `kpi` slide type.

Acceptance:

- [x] Deck with KPI dashboard builds.
- [x] Slide is visually inspected.
- [x] Existing default deck unchanged.

Verification:

- [x] `npm run build`.
- [x] `npm run demo`.
- [x] `npm run verify`.
- [x] Browser screenshot or manual inspection note.

Files likely touched:

- `engine/lib/render.js`
- `engine/lib/css.js`
- `engine/lib/validate.js`
- sample deck in `decks/`

Dependencies: Task 6.1.

## Phase 7: Meeting Package

### Task 7.1: Add HTML Meeting Package

Description: Package final HTML with a simple instruction file and manifest.

Acceptance:

- [x] `tools/build_meeting_package.js` exists.
- [x] Package includes presentation HTML.
- [x] Package includes source deck JSON.
- [x] Package includes README-open-this-file.txt.
- [x] Package includes export manifest JSON.

Verification:

- [x] package command creates folder.
- [x] output HTML opens locally.
- [x] `npm run verify`.

Files likely touched:

- `tools/build_meeting_package.js`
- `package.json`
- `docs/CHANGE_ON_THE_FLY.md`

Dependencies: Phase 0.

## Phase 8: Operator Manual

### Task 8.1: Create Final Work Agent Operating Manual

Description: Write the simple manual for the routine offline work agent.

Acceptance:

- [x] `docs/WORK_AGENT_OPERATING_MANUAL.md` exists.
- [x] Uses simple language.
- [x] Does not expose architect complexity.
- [x] Explains create deck, edit deck, verify, inspect, export package.

Verification:

- [x] `npm run verify`.

Files likely touched:

- `docs/WORK_AGENT_OPERATING_MANUAL.md`
- `AGENTS.md`

Dependencies: Meeting package or current workflow, whichever exists.

## Future Phase 9: Control Board Agent Pack MVP

STOP: This phase is for coding agents only. The routine slide work agent should
not follow this phase.

Goal: Build the first offline visual control board that records human choices
as a weak-agent-safe Agent Pack.

Reference:

- `docs/SLIDEFORGE_STUDIO_CONTROL_BOARD_PLAN.md`
- `docs/WEAK_AGENT_HANDOFF_PROTOCOL.md`

### Task 9.1: Add Control Board Catalogs

Description: Add JSON catalogs for choices shown in the control board.

Acceptance:

- [ ] Catalog exists for templates.
- [ ] Catalog exists for themes.
- [ ] Catalog exists for font profiles.
- [ ] Catalog exists for surface styles.
- [ ] Catalog exists for animation profiles and transitions.
- [ ] Catalog values map to existing renderer-supported values.

Verification:

- [ ] Catalog JSON parses.
- [ ] `npm run verify`.

### Task 9.2: Add Static Control Board Prototype

Description: Create a local one-page prototype that lets the user choose deck
settings from catalogs and preview the selected choices with sample data.

Acceptance:

- [ ] Page works offline.
- [ ] User can choose theme, template, font profile, surface style, transition,
      animation profile, and density.
- [ ] Page shows a small preview area.
- [ ] Page does not require internet.

Verification:

- [ ] Browser inspection on Windows.
- [ ] `npm run verify`.

### Task 9.3: Generate Agent Pack Files

Description: Add a local tool that writes `agent_task.md`, `slide_job.json`,
`locked_choices.json`, and `render_config.json` from selected choices.

Acceptance:

- [ ] Generated `slide_job.json` follows the handoff protocol.
- [ ] Locked choices are explicit.
- [ ] Agent permissions are explicit.
- [ ] Output folder is versioned and does not overwrite silently.

Verification:

- [ ] Generate sample Agent Pack.
- [ ] Validate JSON.
- [ ] `npm run verify`.

## Future Phase 10: DataForge Local Data MVP

STOP: This phase is for coding agents only. The routine slide work agent should
not follow this phase.

Goal: Convert Excel, Word, PDF, and PPTX files into local DB, Markdown, and
slide-ready facts that weak agents can understand.

Reference:

- `docs/DATAFORGE_LOCAL_DATA_PIPELINE_PLAN.md`
- `docs/WEAK_AGENT_HANDOFF_PROTOCOL.md`

### Task 10.1: Add DataForge Folder Structure

Description: Add the project folder shape for source intake, extracted data,
Markdown summaries, logs, and slide jobs.

Acceptance:

- [ ] Folder template matches the DataForge plan.
- [ ] Original source files are separated from working copies.
- [ ] Logs have plain-English names.

Verification:

- [ ] Sample project folder can be generated.
- [ ] `npm run verify`.

### Task 10.2: Add Excel Intake And Inventory MVP

Description: Extract workbook metadata, sheets, tables, used ranges, and saved
values from a workbook without modifying the original.

Acceptance:

- [ ] Original workbook remains unchanged.
- [ ] Sheet inventory Markdown is created.
- [ ] Table inventory Markdown is created.
- [ ] Data warnings Markdown is created.
- [ ] Extraction log is created.

Verification:

- [ ] Run on a dummy workbook.
- [ ] Inspect generated Markdown.
- [ ] `npm run verify`.

### Task 10.3: Add Slide-Ready Fact Pack MVP

Description: Generate `05_slide_ready_facts.md` from selected extracted data.

Acceptance:

- [ ] Facts include source references.
- [ ] Warnings are included or linked.
- [ ] No invented metrics are generated.
- [ ] Weak agent can use facts without opening the workbook.

Verification:

- [ ] Run on dummy workbook.
- [ ] Inspect `05_slide_ready_facts.md`.
- [ ] `npm run verify`.
