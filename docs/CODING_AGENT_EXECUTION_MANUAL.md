# Coding Agent Execution Manual

## Read This First

You are a coding agent implementing SlideForge OS. Do not redesign the product.
Do not invent a new architecture. Your job is to execute this plan phase by
phase and keep the current default deck safe.

## Mission

Build SlideForge OS: a deterministic presentation factory where weak AI agents
structure content and code guarantees executive-grade slide quality.

The current deck remains the default:

- Source: `decks/seegp-ax-monthly.json`
- Output: `index.html`
- Golden style: `Template Family 001 - AI Executive Dark Tech`

## Current Build Status

Already implemented:

- current deck renderer and validator
- SlideSpec schema and validator
- template registry and examples
- theme and surface catalogs
- prompt compiler prompts
- repair rule registry
- KPI dashboard renderer
- meeting package export
- offline Control Board MVP
- demo Agent Pack generation
- low-level work-agent playbook

Next priority:

1. DataForge project folder generator
2. dummy CSV fixture to prove data-to-Markdown flow
3. Markdown data index, warnings, and slide-ready facts
4. Agent Pack that consumes those generated facts
5. only then real `.xlsx` extraction

## Required Reading Order

Before implementing any phase, read:

1. `AGENTS.md`
2. `docs/PROJECT_MAP.md`
3. `docs/SLIDEFORGE_OS_MASTER_PLAN.md`
4. `docs/PRODUCT_AND_EXPERIENCE_SPEC.md`
5. `docs/ARCHITECTURE_BLUEPRINT.md`
6. `docs/QUALITY_AND_GOVERNANCE_GATES.md`
7. `docs/LOW_INTELLIGENCE_AGENT_COMPATIBILITY.md`
8. This file
9. `tasks/implementation_backlog.md`

For routine deck edits, use `skills/SKILL.md`. For architecture work, use this
manual.

## Non-Negotiable Engineering Rules

1. Keep `npm run verify` passing after every task.
2. Do not break `index.html` or `decks/seegp-ax-monthly.json`.
3. Do not hand-edit generated HTML as a final fix.
4. Do not add a dependency unless the task explicitly says to and an ADR is
   written.
5. Prefer additive changes. Existing deck JSON must continue to build.
6. Keep tasks small. If one task grows beyond 5 files, split it.
7. Update docs when workflow, schema, commands, or contracts change.
8. If visual output changes, inspect it in a browser.
9. If unclear, stop and report the exact blocker instead of guessing.

## Technology Direction

### Current Core

| Area | Current Choice | Reason |
|---|---|---|
| Runtime | Node.js | Existing engine already uses Node built-ins |
| Deck source | JSON | Easy for weak agents to fill and validate |
| Rendering | Self-contained HTML/CSS/JS | Reliable, presentable, no server required |
| Theme system | `engine/lib/themes.js` | Existing registry |
| Slide renderers | `engine/lib/render.js` | Existing deterministic rendering |
| Validation | `engine/lib/validate.js` plus tools | Existing validation path |
| Verification | `npm run verify` | One command for routine gate |
| Control Board | `tools/build_control_board.js` | Offline visual choice page and Agent Pack demo |
| Agent Pack generation | `tools/create_agent_pack.js` | Writes weak-agent-safe task files |

### Future Candidate Technologies

These are not routine requirements yet.

| Candidate | Use | When Allowed |
|---|---|---|
| Playwright | PNG/PDF screenshots and visual regression | Only after bundled/local path is designed |
| PptxGenJS | Editable PPTX generation | Only after dependency ADR and packaging plan |
| python-pptx | PPTX generation alternative | Only if Python runtime is intentionally bundled |
| SQLite | provenance/control panel data | Only when file JSON becomes insufficient |
| FastAPI/local UI backend | later desktop/control app backend | Only after contracts are stable |

## Target Repository Structure

Build toward this structure incrementally. Do not create empty folders unless a
task uses them.

```text
G:\The-Slide-Show
  AGENTS.md
  README.md
  package.json
  OFFLINE_MANIFEST.json
  decks/
  dist/
  engine/
    build.js
    lib/
    schemas/              future: schema utilities
    templates/            future: template registry support
    validators/           future: focused validators
    prompt_compiler/      future: weak-agent prompts
    exporters/            future: export modules
  schemas/                future: public JSON schemas
  templates/              future: template definitions and examples
  themes/                 future: tokenized theme definitions
  examples/
    golden/               future: approved examples
    bad/                  future: validator failure examples
  tools/
  docs/
  tasks/
```

## Dependency Graph

Implement in this order:

```text
Current engine stability
  -> SlideSpec schema
    -> validator result format
      -> template registry
        -> current deck compatibility adapter
          -> golden examples
            -> theme token schema
              -> surface style registry
                -> prompt compiler
                  -> repair loop
                    -> export expansion
                      -> Control Board MVP
                        -> DataForge local data pipeline
                          -> approval memory and governance
```

Do not start UI or export work before contracts are stable.

## Phase Gates

Every phase ends with:

```powershell
npm run verify
```

If the phase touches rendering, also build and inspect:

```powershell
npm run build
npm run demo
npm run verify
```

If the phase intentionally changes project files, refresh the creator manifest:

```powershell
npm run architect:manifest
npm run verify
```

## Phase 0: Protect The Current Deck

Status: mostly complete.

Goal:

- Keep the current deck safe while the product expands.

Must remain true:

- `npm run build` produces `index.html`.
- `npm run demo` produces `dist/demo.html`.
- `npm run verify` passes.
- `index.html` opens locally and remains presentable.

Do not modify current deck content unless Mohamed explicitly asks.

## Phase 1: SlideSpec Core

Goal:

- Add a future-facing schema without breaking current deck JSON.

Build:

- `schemas/slide-spec.schema.json`
- `schemas/README.md`
- `tools/validate_slidespec.js`
- `examples/golden/slidespec-cover.json`
- `examples/bad/slidespec-invalid-extra-field.json`

Acceptance:

- valid SlideSpec examples pass
- bad examples fail with exact paths
- existing decks still build unchanged
- `npm run verify` passes

Important:

- Do not replace current deck JSON yet.
- Add compatibility, not migration pressure.

## Phase 2: Validator Result Contract

Goal:

- Standardize all validator outputs for weak agents and future UI.

Build:

- `engine/lib/validation_result.js`
- exact error shape:

```json
{
  "ok": false,
  "errors": [
    {
      "code": "TEXT_TOO_LONG",
      "path": "slides[2].cards[1].body",
      "message": "Body exceeds the limit.",
      "repair": "Rewrite this field in 28 words or fewer."
    }
  ],
  "warnings": [],
  "repairs": []
}
```

Acceptance:

- current validator can map errors/warnings into this shape
- no existing CLI behavior breaks
- docs updated

## Phase 3: Template Registry

Goal:

- Turn current slide types into explicit template contracts.

Build:

- `templates/registry.json`
- `templates/family-001-ai-executive-dark-tech/`
- `templates/family-001-ai-executive-dark-tech/templates.json`
- examples for cover, agenda, comparison, org chart, role cards, timeline

Each template entry must include:

- `templateId`
- `label`
- `slideType`
- `requiredFields`
- `optionalFields`
- `densityLimits`
- `allowedThemeIds`
- `allowedSurfaceStyles`
- `repairRules`

Acceptance:

- registry parses
- current slide types are represented
- docs show how agent chooses a template ID
- no render behavior changes yet

## Phase 4: Golden Examples Library

Goal:

- Give weak agents examples they can pattern-match.

Build:

- `examples/golden/family-001/`
- `examples/bad/family-001/`
- one valid and one invalid example per current template

Acceptance:

- examples are small and readable
- invalid examples have expected error notes
- examples are referenced from template registry

## Phase 5: Theme Token Schema

Goal:

- Move toward full design tokens while preserving existing theme behavior.

Build:

- `themes/theme-token.schema.json`
- `themes/catalog.json`
- `themes/ai-executive-dark-tech.json`
- `themes/corporate-light.json`

Acceptance:

- token files describe existing themes
- existing `engine/lib/themes.js` still works
- docs explain that JS theme registry is current runtime source until migration

## Phase 6: Surface Style Registry

Goal:

- Support controlled visual variations such as cards, tickets, folders, and
  memo panels without free-form design.

Build:

- `themes/surface-styles.json`
- docs with allowed IDs:
  - `rounded-card`
  - `sharp-card`
  - `glass-card`
  - `ticket-cutout`
  - `folder-tab`
  - `split-panel`
  - `badge-stack`
  - `memo-panel`

Acceptance:

- registry exists
- template registry references allowed styles
- renderer does not need to implement all styles immediately
- unsupported style fails validation once connected

## Phase 7: Prompt Compiler

Goal:

- Give weak agents one small task at a time.

Build:

- `engine/prompt_compiler/`
- prompt specs for:
  - extract agenda
  - classify slide type
  - rewrite card body
  - fill SlideSpec
  - repair JSON
  - shorten field

Acceptance:

- prompts are plain text templates
- each prompt has one job
- each prompt declares JSON output shape
- examples exist

## Phase 8: Repair Loop

Goal:

- Turn validator errors into exact repair instructions.

Build:

- `engine/repair/repair_rules.js`
- mapping from error code to repair prompt
- deterministic repairs where safe

Acceptance:

- long text produces a field-specific repair
- invalid enum produces allowed values
- missing required field produces missing field report
- no repair invents facts

## Phase 9: Expanded Templates

Goal:

- Add new template contracts and renderers gradually.

Order:

1. KPI dashboard
2. Project update
3. Decision slide
4. Risk matrix
5. Case study
6. Process map
7. Finance variance bridge
8. Factory operations board

For each new template:

- schema/contract
- renderer
- validation rules
- good example
- bad example
- visual QA screenshot
- docs

Acceptance:

- one template per task
- current decks unaffected
- examples build

## Phase 10: Export Expansion

Goal:

- Add outputs beyond HTML only after dependency path is solved.

Order:

1. HTML meeting package
2. PNG export
3. PDF export
4. PPTX export

Before adding Playwright/PPTX/Python dependency:

- write ADR
- define bundled/local runtime plan
- prove routine agent does not install anything

Acceptance:

- export manifest created
- output file opens locally
- verification checks exported artifacts

## Phase 11: Local Control Panel

Goal:

- Make the system usable without coding.

Do not start until:

- SlideSpec exists
- template registry exists
- validator result format exists
- examples exist

Build screens in order:

1. deck browser
2. slide list
3. slide preview
4. structured field editor
5. template/theme selector
6. validation panel
7. variant comparison
8. export panel
9. approval panel

UX rule:

- This is an operations tool, not a landing page.

Acceptance:

- keyboard accessible
- no decorative card-heavy marketing UI
- text fits at laptop viewport
- error/empty/loading states exist

## Phase 12: Approval Memory And Governance

Goal:

- Track approved outputs, golden examples, and rollback.

Build:

- `approvals/`
- `artifacts/`
- `examples/golden/`
- export manifest
- approved/draft folder rules
- release notes process

Acceptance:

- approved artifact cannot be overwritten silently
- rollback copy exists for meeting package
- provenance metadata exists

## Agent Assignment Guidance

### DeepSeek Flash

Use for:

- simple extraction fixtures
- JSON examples
- repetitive docs cleanup

Do not use for:

- architecture changes
- renderer logic
- schema design

### DeepSeek Pro

Use for:

- validation logic
- repair rules
- focused implementation tasks

### Kimi

Use for:

- reading long docs
- summarizing source requirements
- checking consistency across docs

### MiniMax

Use for:

- wording variants
- executive phrasing examples
- prompt examples

### Qwen / Coding-Oriented Model

Use for:

- JS utility implementation
- schema validation tools
- renderer changes

### Human / Architect Review Required

Required before:

- adding dependency
- changing default deck content
- changing public schema meaning
- adding UI framework
- changing render layout for current templates

## Final Operator Handoff Requirement

When all build phases reach MVP, create or update:

- `docs/WORK_AGENT_OPERATING_MANUAL.md`
- `docs/CHANGE_ON_THE_FLY.md`
- `skills/SKILL.md`

These must explain the final system to the offline work agent in simple terms:

1. choose task
2. fill JSON or use control panel
3. build
4. verify
5. inspect
6. export
7. present

Do not expose architect complexity to the routine work agent.
