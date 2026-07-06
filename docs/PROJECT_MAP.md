# Project Map

## Root Files

| Path | Role |
|---|---|
| `AGENTS.md` | First-read manual for any AI agent |
| `README.md` | Human overview and quickstart |
| `PLAN.md` | Original flagship presentation specification |
| `package.json` | Project command registry |
| `OFFLINE_MANIFEST.json` | Creator-maintained SHA-256 drift manifest |
| `index.html` | Built default presentation |

## Main Folders

| Path | Role |
|---|---|
| `decks/` | JSON deck source files |
| `dist/` | Built HTML outputs for non-default decks and previews |
| `engine/` | HTML slideshow engine |
| `schemas/` | Future-facing SlideSpec JSON contracts |
| `templates/` | Template registry and example fixtures |
| `themes/` | Tokenized theme definitions and surface styles |
| `examples/` | Golden and bad examples for schemas and templates |
| `packages/` | Exported meeting packages |
| `skills/` | Project-local instructions for AI deck authors |
| `tools/` | Local verification and manifest scripts |
| `docs/` | Operating model, maps, decisions, and procedures |
| `tasks/` | Expansion implementation plan and task list |

## Engine Map

| Path | Responsibility |
|---|---|
| `engine/build.js` | CLI entry point; reads deck, validates, renders HTML |
| `engine/lib/validate.js` | Deck schema and density checks |
| `engine/lib/render.js` | Slide-type renderers |
| `engine/lib/css.js` | Generated stylesheet and layout system |
| `engine/lib/runtime.js` | In-browser navigation, scaling, animation, particles |
| `engine/lib/themes.js` | Theme registry and accent resolution |
| `engine/lib/icons.js` | Inline SVG icon registry |

## Control Board And Agent Pack Map

| Path | Responsibility |
|---|---|
| `dist/control-board.html` | Self-contained offline Control Board output |
| `packages/control-board-demo/control-board.html` | Packaged demo copy of the Control Board |
| `packages/control-board-demo/sample-agent-pack/` | Example weak-agent Agent Pack |
| `tools/build_control_board.js` | Builds the Control Board HTML and demo package |
| `tools/create_agent_pack.js` | Writes an Agent Pack from a control state JSON or demo input |
| `tools/lib/agent_pack.js` | Shared Agent Pack catalog and file-generation logic |

## Deck Source Files

| Path | Purpose |
|---|---|
| `decks/seegp-ax-monthly.json` | Flagship SEEG-P AX monthly deck |
| `decks/demo-product-launch.json` | Demo deck showing extra slide types |
| `decks/orion-factory-control-demo.json` | Full dummy factory finance and operations demo deck |
| `decks/visual-style-showcase.json` | Visual capability demo for themes, shapes, and animation profiles |
| `decks/kpi-dashboard-sample.json` | Single-slide KPI dashboard sample |

## Built Outputs

| Path | Source |
|---|---|
| `index.html` | `decks/seegp-ax-monthly.json` via `npm run build` |
| `dist/demo.html` | `decks/demo-product-launch.json` via `npm run demo` |
| `dist/orion-factory-control-demo.html` | Full dummy factory control demo |
| `dist/visual-style-showcase-aurora.html` | Style showcase using aurora-purple, glass surfaces, and flip transition |
| `dist/visual-style-showcase-editorial.html` | Style showcase rendered as white editorial ink style |
| `dist/visual-style-showcase-mint.html` | Style showcase rendered as light mint product-lab style |
| `dist/visual-style-showcase-mono.html` | Style showcase rendered as mono technical style |
| `dist/kpi-dashboard-sample.html` | KPI dashboard sample |
| `dist/control-board.html` | Offline Control Board for choosing slide options and downloading Agent Pack files |
| `dist/seegp-ax-monthly.html` | Built flagship copy |
| `dist/seegp-emerald.html` | Flagship deck rendered in emerald theme |

## Project-Local Skills

Start with `skills/SKILL.md`. It routes the agent through:

- `skills/deck-schema.md` for allowed JSON fields
- `skills/design-guide.md` for presentation quality
- `skills/theming-guide.md` for theme work
- `skills/troubleshooting.md` for known failure modes

## Work Agent Docs

These are the only docs a routine slide work agent needs for normal slide
production.

| Path | Purpose |
|---|---|
| `docs/WORK_AGENT_START_HERE.md` | First simple slide-only instruction file for the routine work agent |
| `docs/WORK_AGENT_OPERATING_MANUAL.md` | Simple routine operating manual for the final work agent |
| `docs/LOW_LEVEL_WORK_AGENT_PLAYBOOK.md` | Short step-by-step playbook for weak slide work agents |
| `docs/CHANGE_ON_THE_FLY.md` | Safe process for fast live-meeting edits |

## Creator Planning Docs

Routine slide agents should not use this section. These documents are for
creator/coding work only. A slide work agent should focus on `decks/`,
`skills/`, and `docs/WORK_AGENT_START_HERE.md`.

| Path | Purpose |
|---|---|
| `docs/SLIDEFORGE_OS_MASTER_PLAN.md` | Full product architecture and roadmap |
| `docs/PRODUCT_AND_EXPERIENCE_SPEC.md` | Product promise, UX model, and missing expert requirements |
| `docs/ARCHITECTURE_BLUEPRINT.md` | Module boundaries, interfaces, testing, packaging |
| `docs/QUALITY_AND_GOVERNANCE_GATES.md` | Readiness gates for decks, themes, templates, and releases |
| `docs/LOW_INTELLIGENCE_AGENT_COMPATIBILITY.md` | Rules for weak-model compatible workflows |
| `docs/SLIDEFORGE_STUDIO_CONTROL_BOARD_PLAN.md` | Offline Windows control board plan for visual choices and Agent Pack creation |
| `docs/DATAFORGE_LOCAL_DATA_PIPELINE_PLAN.md` | Local Excel, Word, PDF, PPTX, database, and Markdown extraction plan |
| `docs/WEAK_AGENT_HANDOFF_PROTOCOL.md` | Simple handoff contract between Control Board, DataForge, and the work agent |
| `docs/IDEA_INTAKE_DECISIONS.md` | Which external/raw planning ideas were adopted, reframed, deferred, or rejected |
| `docs/CODING_AGENT_EXECUTION_MANUAL.md` | Exact implementation manual for coding agents |
| `tasks/plan.md` | Implementable phase plan |
| `tasks/todo.md` | Current task checklist |
| `tasks/implementation_backlog.md` | Granular ordered task backlog for coding agents |

## Change Types

| User Request | Primary Files | Safe Output |
|---|---|---|
| Change text, agenda, names, dates, statuses | `decks/*.json` | Rebuilt HTML |
| Create new deck | New `decks/<name>.json` | `dist/<name>.html` |
| Preview different theme | No deck edit needed | `dist/<preview>.html` |
| Add new theme | `engine/lib/themes.js`, docs | Rebuilt previews |
| Add new slide type | `validate.js`, `render.js`, `css.js`, docs | New validated deck |
| Fix navigation/animation | `engine/lib/runtime.js` | Full browser QA |
| Harden self-contained process | `tools/`, docs, manifest | `npm run verify` passes |

## Current Deck Protection

The repository is baselined around the current flagship presentation. Do not change
its content unless explicitly requested.

- Source deck: `decks/seegp-ax-monthly.json`
- Default output: `index.html`
- Current deck content changes require an explicit user request.

## Do Not Touch Casually

- `index.html`: generated default output
- `dist/*.html`: generated outputs
- `engine/`: shared rendering system
- `OFFLINE_MANIFEST.json`: generated hash manifest

If a generated file must change, change its source and rebuild.
