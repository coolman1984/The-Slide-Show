# Implementation Backlog For Coding Agents

This backlog is the task source for cheap-token coding agents. Work in order.
Do not skip phases. Keep tasks small.

## Phase 0: Current System Safety

### Task 0.1: Confirm Baseline

Description: Confirm the current repo builds and verifies before changes.

Acceptance:

- [ ] `npm run build` succeeds.
- [ ] `npm run demo` succeeds.
- [ ] `npm run verify` succeeds.

Verification:

- [ ] Paste command results into the task handoff.

Files likely touched:

- none

Dependencies: none.

### Task 0.2: Add Baseline Notes

Description: Add a short note documenting that current deck is protected.

Acceptance:

- [ ] Note points to `decks/seegp-ax-monthly.json`.
- [ ] Note says default output is `index.html`.
- [ ] Note says current deck content changes require explicit user request.

Verification:

- [ ] `npm run verify`.

Files likely touched:

- `docs/PROJECT_MAP.md`

Dependencies: Task 0.1.

## Phase 1: SlideSpec Core

### Task 1.1: Create Schema Folder

Description: Create `schemas/` with README explaining that SlideSpec is the
future public contract and current deck JSON remains supported.

Acceptance:

- [ ] `schemas/README.md` exists.
- [ ] README explains current-vs-future relationship.
- [ ] No engine behavior changes.

Verification:

- [ ] `npm run verify`.

Files likely touched:

- `schemas/README.md`

Dependencies: Phase 0.

### Task 1.2: Add Initial SlideSpec Schema

Description: Add `schemas/slide-spec.schema.json` with top-level deck and slide
structure.

Acceptance:

- [ ] Schema has `specVersion`.
- [ ] Schema has `deck`.
- [ ] Schema has `slides`.
- [ ] Slide requires `slideId`, `templateId`, `themeId`, and `content`.
- [ ] Schema disallows unknown top-level fields.

Verification:

- [ ] JSON parses with Node.
- [ ] `npm run verify`.

Files likely touched:

- `schemas/slide-spec.schema.json`
- `schemas/README.md`

Dependencies: Task 1.1.

### Task 1.3: Add SlideSpec Examples

Description: Add one valid and one invalid SlideSpec example.

Acceptance:

- [ ] `examples/golden/slidespec-cover.json` exists.
- [ ] `examples/bad/slidespec-extra-field.json` exists.
- [ ] Examples are small and readable.

Verification:

- [ ] JSON parses for valid example.
- [ ] `npm run verify`.

Files likely touched:

- `examples/golden/slidespec-cover.json`
- `examples/bad/slidespec-extra-field.json`

Dependencies: Task 1.2.

### Task 1.4: Add Basic SlideSpec Validator

Description: Add a no-dependency validator script for the initial schema.

Acceptance:

- [ ] `tools/validate_slidespec.js` exists.
- [ ] Valid example passes.
- [ ] Invalid example fails.
- [ ] Errors include field path and code.

Verification:

- [ ] `node tools/validate_slidespec.js examples/golden/slidespec-cover.json`
- [ ] `node tools/validate_slidespec.js examples/bad/slidespec-extra-field.json` fails.
- [ ] `npm run verify`.

Files likely touched:

- `tools/validate_slidespec.js`
- `package.json`

Dependencies: Task 1.3.

## Phase 2: Template Registry

### Task 2.1: Create Template Registry

Description: Add `templates/registry.json` with current slide types mapped to
future template IDs.

Acceptance:

- [ ] Cover/title template registered.
- [ ] Agenda template registered.
- [ ] Org chart template registered.
- [ ] Role cards template registered.
- [ ] Timeline matrix template registered.
- [ ] Comparison template registered.

Verification:

- [ ] Registry JSON parses.
- [ ] `npm run verify`.

Files likely touched:

- `templates/registry.json`
- `docs/PROJECT_MAP.md`

Dependencies: Phase 1.

### Task 2.2: Add Template Registry Validator

Description: Add script that verifies every template has required metadata.

Acceptance:

- [ ] Script checks `templateId`.
- [ ] Script checks `slideType`.
- [ ] Script checks `requiredFields`.
- [ ] Script checks `densityLimits`.
- [ ] `npm run verify` calls it or a documented command exists.

Verification:

- [ ] Registry validator passes.
- [ ] `npm run verify`.

Files likely touched:

- `tools/validate_templates.js`
- `package.json`

Dependencies: Task 2.1.

### Task 2.3: Add Template Examples

Description: Add one good and one bad example for each registered current
template.

Acceptance:

- [ ] Examples are in `examples/golden/family-001/`.
- [ ] Bad examples are in `examples/bad/family-001/`.
- [ ] Each example references a template ID.

Verification:

- [ ] Example JSON parses.
- [ ] `npm run verify`.

Files likely touched:

- `examples/golden/family-001/*.json`
- `examples/bad/family-001/*.json`

Dependencies: Task 2.2.

## Phase 3: Theme And Surface Contracts

### Task 3.1: Create Theme Token Schema

Description: Add `themes/theme-token.schema.json` and initial catalog.

Acceptance:

- [ ] Schema has colors, typography, surfaces, footer, semantic status colors.
- [ ] Catalog includes `ai-executive-dark-tech`.
- [ ] Catalog includes `corporate-light`.

Verification:

- [ ] JSON parses.
- [ ] `npm run verify`.

Files likely touched:

- `themes/theme-token.schema.json`
- `themes/catalog.json`

Dependencies: Phase 2.

### Task 3.2: Add Surface Style Registry

Description: Add approved surface styles for controlled shape variations.

Acceptance:

- [ ] `themes/surface-styles.json` exists.
- [ ] Includes `rounded-card`, `sharp-card`, `glass-card`, `ticket-cutout`,
      `folder-tab`, `split-panel`, `badge-stack`, `memo-panel`.
- [ ] Each style has label, allowedUse, and implementationStatus.

Verification:

- [ ] JSON parses.
- [ ] `npm run verify`.

Files likely touched:

- `themes/surface-styles.json`

Dependencies: Task 3.1.

## Phase 4: Weak-Agent Prompt Compiler

### Task 4.1: Create Prompt Compiler Folder

Description: Add prompt compiler docs and template format.

Acceptance:

- [ ] `engine/prompt_compiler/README.md` exists.
- [ ] Explains one-task prompt rule.
- [ ] Explains JSON-only outputs.

Verification:

- [ ] `npm run verify`.

Files likely touched:

- `engine/prompt_compiler/README.md`

Dependencies: Phase 1.

### Task 4.2: Add First Prompt Templates

Description: Add prompt templates for extraction, rewrite, fill JSON, and
repair.

Acceptance:

- [ ] `extract-agenda.md`
- [ ] `rewrite-card-body.md`
- [ ] `fill-slidespec.md`
- [ ] `repair-json.md`
- [ ] Each prompt has objective, input, output JSON shape, and failure behavior.

Verification:

- [ ] prompts are readable and small.
- [ ] `npm run verify`.

Files likely touched:

- `engine/prompt_compiler/prompts/*.md`

Dependencies: Task 4.1.

## Phase 5: Repair Rules

### Task 5.1: Add Repair Rule Registry

Description: Add repair mapping from validator codes to exact instructions.

Acceptance:

- [ ] Registry includes `TEXT_TOO_LONG`.
- [ ] Registry includes `MISSING_REQUIRED_FIELD`.
- [ ] Registry includes `INVALID_ENUM`.
- [ ] Registry includes `UNKNOWN_TEMPLATE_ID`.
- [ ] Registry does not invent missing facts.

Verification:

- [ ] `npm run verify`.

Files likely touched:

- `engine/repair/repair_rules.js`
- `engine/repair/README.md`

Dependencies: Phase 2.

## Phase 6: First New Template

### Task 6.1: Add KPI Dashboard Contract

Description: Add contract and examples for a KPI dashboard template.

Acceptance:

- [ ] Template registered.
- [ ] Good example exists.
- [ ] Bad over-density example exists.
- [ ] Validation rules exist.

Verification:

- [ ] `npm run verify`.

Files likely touched:

- `templates/registry.json`
- `examples/golden/family-001/kpi-dashboard.json`
- `examples/bad/family-001/kpi-dashboard-too-many-tiles.json`

Dependencies: Phase 2.

### Task 6.2: Implement KPI Dashboard Renderer

Description: Add renderer support for KPI dashboard if not already covered by
current `kpi` slide type.

Acceptance:

- [ ] Deck with KPI dashboard builds.
- [ ] Slide is visually inspected.
- [ ] Existing default deck unchanged.

Verification:

- [ ] `npm run build`.
- [ ] `npm run demo`.
- [ ] `npm run verify`.
- [ ] Browser screenshot or manual inspection note.

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

- [ ] `tools/build_meeting_package.js` exists.
- [ ] Package includes presentation HTML.
- [ ] Package includes source deck JSON.
- [ ] Package includes README-open-this-file.txt.
- [ ] Package includes export manifest JSON.

Verification:

- [ ] package command creates folder.
- [ ] output HTML opens locally.
- [ ] `npm run verify`.

Files likely touched:

- `tools/build_meeting_package.js`
- `package.json`
- `docs/CHANGE_ON_THE_FLY.md`

Dependencies: Phase 0.

## Phase 8: Operator Manual

### Task 8.1: Create Final Work Agent Operating Manual

Description: Write the simple manual for the routine offline work agent.

Acceptance:

- [ ] `docs/WORK_AGENT_OPERATING_MANUAL.md` exists.
- [ ] Uses simple language.
- [ ] Does not expose architect complexity.
- [ ] Explains create deck, edit deck, verify, inspect, export package.

Verification:

- [ ] `npm run verify`.

Files likely touched:

- `docs/WORK_AGENT_OPERATING_MANUAL.md`
- `AGENTS.md`

Dependencies: Meeting package or current workflow, whichever exists.

