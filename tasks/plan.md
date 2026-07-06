# Implementation Plan: SlideForge OS Expansion

STOP: This file is not for the routine slide work agent.

If Mohamed asked you to create or edit slides, ignore this file and use
`docs/WORK_AGENT_START_HERE.md`.

## Overview

Expand Slide Forge from a single strong slideshow engine into a complete
presentation production system. The current deck remains the default and safe
for immediate presentation. New work builds around it in controlled layers:
SlideSpec, template registry, theme tokens, weak-agent pipeline, validation,
repair, exports, Control Board Agent Packs, and DataForge local extraction.

## Architecture Decisions

- Keep `index.html` as the default flagship output while expanding the system.
- Use strict JSON contracts so agents fill content, not design.
- Keep routine agent instructions simple; creator-only architecture constraints
  live in `docs/OFFLINE_OPERATING_MODEL.md`.
- Prefer deterministic code for layout, validation, rendering, and export.
- Add dependencies only when the creator can bundle or vendor them so routine
  work remains pre-wired.
- The future Windows control board should turn human visual choices into
  `slide_job.json`, `agent_task.md`, and locked render settings.
- DataForge should convert Excel, Word, PDF, PPTX, and screenshots into local
  DB files plus Markdown before any weak agent reads the task.
- Weak agents should receive Agent Packs, not architecture plans or raw source
  files.

## Task List

### Phase 0: Stabilize Current Foundation

- [x] Task 0.1: Add operator agent manual.
- [x] Task 0.2: Add creator architecture constraint document.
- [x] Task 0.3: Add verification and manifest tools.
- [x] Task 0.4: Keep current deck as default golden output.

### Checkpoint: Current Deck Safe

- [x] `npm run verify` passes.
- [ ] Current deck visually inspected after any future content change.

### Phase 1: SlideSpec Core

- [ ] Task 1.1: Define `schemas/slide-spec.schema.json`.
- [ ] Task 1.2: Add a SlideSpec validator that reports exact field paths.
- [ ] Task 1.3: Add compatibility adapter from current deck JSON to SlideSpec.
- [ ] Task 1.4: Document the SlideSpec format with good and bad examples.

### Phase 2: Template Registry

- [ ] Task 2.1: Create `templates/registry.json`.
- [ ] Task 2.2: Register current slide types as Template Family 001.
- [ ] Task 2.3: Add per-template density limits.
- [ ] Task 2.4: Add preview decks for each template.
- [ ] Task 2.5: Add bad-example fixtures that must fail validation.

### Phase 3: Theme Token Engine

- [ ] Task 3.1: Define a theme token schema.
- [ ] Task 3.2: Convert existing themes to the token schema.
- [ ] Task 3.3: Add Samsung-inspired, finance executive, factory operations,
      and high-contrast projector themes.
- [ ] Task 3.4: Add theme preview generation.
- [ ] Task 3.5: Add controlled surface style registry for cards, tickets,
      folder tabs, split panels, badges, and memo panels.

### Phase 4: Weak-Agent Pipeline

- [ ] Task 4.1: Create prompt compiler contracts for extraction, rewriting,
      template selection, and repair.
- [ ] Task 4.2: Add model profile configs.
- [ ] Task 4.3: Add strict JSON repair prompts.
- [ ] Task 4.4: Add golden examples for each template.

### Phase 5: Quality Validation And Repair

- [ ] Task 5.1: Add text density scoring.
- [ ] Task 5.2: Add overflow preflight checks per template.
- [ ] Task 5.3: Add deterministic repair suggestions.
- [ ] Task 5.4: Add deck story checks for agenda/order/section consistency.
- [ ] Task 5.5: Add null-value degradation checks and readable font floor.

### Phase 6: Export Expansion

- [ ] Task 6.1: Add PNG export if a local rendering path is bundled.
- [ ] Task 6.2: Add PDF export if it can stay self-contained.
- [ ] Task 6.3: Evaluate PPTX export with bundled local dependencies.
- [ ] Task 6.4: Add export verification and meeting package output.

### Phase 7: Local Control Panel

- [ ] Task 7.1: Build local deck browser.
- [ ] Task 7.2: Build template/theme selector.
- [ ] Task 7.3: Build validation panel.
- [ ] Task 7.4: Build variant comparison view.
- [ ] Task 7.5: Build approval and golden-output capture flow.

### Phase 8: Golden Library And Reverse Engineering

- [ ] Task 8.1: Create approved screenshot registry.
- [ ] Task 8.2: Add visual regression baseline flow.
- [ ] Task 8.3: Design screenshot-to-template intake workflow.
- [ ] Task 8.4: Add approval memory docs and storage format.

### Phase 9: Product-Grade Control Panel

- [ ] Task 9.1: Build the Control Board catalog system.
- [ ] Task 9.2: Build one-page offline Control Board prototype.
- [ ] Task 9.3: Generate Agent Pack files from user choices.
- [ ] Task 9.4: Build local preview from selected theme, template, font,
      shape, transition, and animation options.
- [ ] Task 9.5: Log locked choices and block weak-agent design changes.

### Phase 10: DataForge Local Data Pipeline

- [ ] Task 10.1: Add project source intake folders and logs.
- [ ] Task 10.2: Add Excel intake, sheet inventory, table inventory, and
      visible pivot output extraction.
- [ ] Task 10.3: Generate Markdown data index, warnings, and slide-ready facts.
- [ ] Task 10.4: Add local DB storage for metadata and analytics tables.
- [ ] Task 10.5: Add Word, PDF, PPTX, and screenshot extraction roadmaps.

### Phase 11: Governance And Release System

- [ ] Task 11.1: Add artifact export manifest.
- [ ] Task 11.2: Add draft/approved output folders.
- [ ] Task 11.3: Add rollback meeting package.
- [ ] Task 11.4: Add template/theme versioning rules.
- [ ] Task 11.5: Add release notes process for engine changes.

## Risks And Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Weak model invents data | High | Strict schemas, source flags, exact repair prompts |
| Slide becomes crowded | High | Density scoring, template limits, split recommendations |
| New export dependency breaks closed environment | High | Creator must bundle/vendor or reject feature |
| Current deck breaks during expansion | High | Keep default deck separate, run `npm run verify` |
| Theme variants become inconsistent | Medium | Token schema and preview catalog |
| Agent edits generated HTML | Medium | AGENTS.md forbids it; verification detects drift |
| Visual QA skipped | High | Keep visual inspection in Definition of Done |
| Big plan becomes too large to execute | High | Build in vertical phases; protect current deck |
| Control panel becomes decorative instead of useful | Medium | Follow operations UI principles; prioritize workflow |
| Weak agent reads raw Excel and invents conclusions | High | DataForge prepares Markdown fact packs and the Agent Pack forbids raw-source analysis |
| User choices are lost between preview and build | High | Control Board writes locked choices to `slide_job.json` and `locked_choices.json` |

## Open Questions

- Which export format is most important after HTML: PNG, PDF, or PPTX?
- Should the first Control Board MVP be static HTML or a Tauri/Electron Windows app?
- What Samsung visual boundaries are allowed for internal decks?
- Which first three new templates should be built after the current family?
- What exact source-tracking level is required for management decks?
- Which first file type should DataForge implement deeply: Excel or PDF?
