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

## Deck Source Files

| Path | Purpose |
|---|---|
| `decks/seegp-ax-monthly.json` | Flagship SEEG-P AX monthly deck |
| `decks/demo-product-launch.json` | Demo deck showing extra slide types |

## Built Outputs

| Path | Source |
|---|---|
| `index.html` | `decks/seegp-ax-monthly.json` via `npm run build` |
| `dist/demo.html` | `decks/demo-product-launch.json` via `npm run demo` |
| `dist/seegp-ax-monthly.html` | Built flagship copy |
| `dist/seegp-emerald.html` | Flagship deck rendered in emerald theme |

## Project-Local Skills

Start with `skills/SKILL.md`. It routes the agent through:

- `skills/deck-schema.md` for allowed JSON fields
- `skills/design-guide.md` for presentation quality
- `skills/theming-guide.md` for theme work
- `skills/troubleshooting.md` for known failure modes

## Creator Planning Docs

| Path | Purpose |
|---|---|
| `docs/SLIDEFORGE_OS_MASTER_PLAN.md` | Full product architecture and roadmap |
| `docs/PRODUCT_AND_EXPERIENCE_SPEC.md` | Product promise, UX model, and missing expert requirements |
| `docs/ARCHITECTURE_BLUEPRINT.md` | Module boundaries, interfaces, testing, packaging |
| `docs/QUALITY_AND_GOVERNANCE_GATES.md` | Readiness gates for decks, themes, templates, and releases |
| `docs/LOW_INTELLIGENCE_AGENT_COMPATIBILITY.md` | Rules for weak-model compatible workflows |
| `docs/IDEA_INTAKE_DECISIONS.md` | Which external/raw planning ideas were adopted, reframed, deferred, or rejected |
| `docs/CODING_AGENT_EXECUTION_MANUAL.md` | Exact implementation manual for coding agents |
| `docs/WORK_AGENT_OPERATING_MANUAL.md` | Simple routine operating manual for the final work agent |
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

## Do Not Touch Casually

- `index.html`: generated default output
- `dist/*.html`: generated outputs
- `engine/`: shared rendering system
- `OFFLINE_MANIFEST.json`: generated hash manifest

If a generated file must change, change its source and rebuild.
