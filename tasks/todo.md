# SlideForge OS Task List

STOP: This file is not for the routine slide work agent.

If Mohamed asked you to create or edit slides, ignore this file and use
`docs/WORK_AGENT_START_HERE.md`.

## Immediate

- [ ] Execute `docs/GRAND_IMPROVEMENT_PLAN.md` (V2 audit + prioritized roadmap; P0 first:
      visual verify harness, deterministic builds, presenter keys, concurrency protocol,
      flagship deck completion). Where it disagrees with older plans, it wins.
- [ ] Review `docs/SLIDEFORGE_STUDIO_CONTROL_BOARD_PLAN.md` with Mohamed.
- [ ] Review `docs/DATAFORGE_LOCAL_DATA_PIPELINE_PLAN.md` with Mohamed.
- [ ] Review `docs/WEAK_AGENT_HANDOFF_PROTOCOL.md` with Mohamed.
- [ ] Decide first build priority: Control Board MVP or DataForge Excel MVP.
- [ ] Keep `decks/seegp-ax-monthly.json` and `index.html` stable for tomorrow.
- [ ] Run `npm run verify` after every project change.

## Next Build Sequence

1. [x] Add Control Board choice catalogs.
2. [x] Build one-page offline Control Board prototype.
3. [x] Generate sample Agent Pack from selected choices.
4. [x] Teach the work agent to consume the sample Agent Pack.
5. [ ] Add DataForge project folder generator.
6. [ ] Add Excel intake and workbook inventory MVP.
7. [ ] Generate Markdown data index and slide-ready facts.
8. [ ] Connect selected facts to `slide_job.json`.
9. [x] Build preview from Agent Pack choices.
10. [x] Add validation messages for missing data, bad choices, and locked choices.
11. [ ] Package the workflow for offline Windows use.
12. [ ] Add a dummy full demo project using the Control Board and DataForge shape.

## Next Low-Level Coding Agent Plan

Use this order. Do not jump ahead.

1. [ ] Create a `dataforge/` folder with only folder-generation code.
2. [ ] Add one dummy Excel-like CSV fixture first, before real Excel parsing.
3. [ ] Generate `00_data_index.md`, `05_slide_ready_facts.md`, and
       `06_data_warnings.md` from the fixture.
4. [ ] Write a sample Agent Pack that uses those generated Markdown files.
5. [ ] Build one deck from that Agent Pack.
6. [ ] Run `npm run verify`.
7. [ ] Only after this works, add real `.xlsx` extraction.

## Definition Of Done For Each Task

- [ ] Source files updated.
- [ ] Docs updated when workflow changes.
- [ ] `npm run verify` passes.
- [ ] Visual output inspected when presentation rendering changes.
- [ ] No routine workflow requires a new setup step.
