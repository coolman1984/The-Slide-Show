# Skill: DataForge Excel Extraction

Use this skill when the task is to extract data from Excel for SlideForge.

Do not ask the weak slide work agent to understand raw Excel directly.

## Purpose

Excel files must be converted into clean local outputs:

- workbook inventory
- sheet inventory
- table summaries
- pivot summaries
- warnings
- slide-ready facts
- optional local DB tables later

## Safe Pipeline

1. Copy the original workbook into `01_sources/original/`.
2. Work only on a copy in `01_sources/working/`.
3. If Excel automation is available, refresh formulas and pivots on the copy.
4. Extract workbook metadata.
5. Extract sheets, used ranges, tables, formulas, and visible pivot outputs.
6. Write Markdown summaries.
7. Write warnings before facts.
8. Create a fact pack for the Agent Pack.

## Required Markdown

- `02_extracted/markdown/00_data_index.md`
- `02_extracted/markdown/01_workbook_summary.md`
- `02_extracted/markdown/02_sheet_inventory.md`
- `02_extracted/markdown/03_table_inventory.md`
- `02_extracted/markdown/04_pivot_tables.md`
- `02_extracted/markdown/05_slide_ready_facts.md`
- `02_extracted/markdown/06_data_warnings.md`

## Excel Edge Cases

| Case | Correct Handling |
|---|---|
| Password-protected workbook | Ask locally; never store password |
| Excel is not installed | Extract saved values only and warn |
| Pivot refresh fails | Use cached visible output and warn |
| Power Query unavailable | Use last saved output and warn |
| External links missing | Freeze saved values and warn |
| Hidden sheets | Inventory them; do not use facts unless selected |
| Very hidden sheets | Inventory only; do not expose as facts by default |
| Hidden filters | Warn that visible data may be filtered |
| Merged headers | Flatten names and preserve original labels |
| Multiple tables in one sheet | Split into separate table blocks |
| No clear header | Require user selection |
| Mixed date formats | Preserve raw value and warn |
| Mixed currencies | Block calculation until currency rule exists |
| Formula errors | Store formula and error value; warn |
| Huge workbook | Chunk extraction; do not load everything at once |
| Corrupted workbook | Try working copy recovery; otherwise visible values only |

## Weak-Agent Rule

The weak agent reads only Markdown and JSON. It does not open the workbook.

## Done Means

- Original workbook unchanged.
- Every fact has a source reference.
- Every warning is visible.
- Agent Pack can use the generated Markdown.
- `npm test` and `npm run verify` pass.
