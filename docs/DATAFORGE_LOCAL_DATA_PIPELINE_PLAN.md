# DataForge Local Data Pipeline Plan

STOP: This document is for creator and coding agents only.

The routine slide work agent should not implement this plan. The work agent
should read only the prepared Markdown and JSON files created by DataForge.

## Purpose

DataForge converts messy business files into clean local data that SlideForge
and weak agents can use safely.

The weak agent must not analyze raw Excel, Word, PDF, PPTX, or screenshot files
directly. It should read prepared Markdown summaries, selected fact packs, and
strict JSON only.

## Core Principle

Raw files are for DataForge.
Prepared Markdown and JSON are for the weak agent.
Validated tables and metrics are for SlideForge.

## Required Output Shape

Every extraction run should create:

```text
projects/<project_id>/
  01_sources/
    original/
    working/
  02_extracted/
    db/
      metadata.sqlite
      analytics.duckdb
    tables/
      csv/
      jsonl/
      parquet/
    markdown/
      00_data_index.md
      01_source_summary.md
      02_sheet_inventory.md
      03_table_inventory.md
      04_pivot_tables.md
      05_slide_ready_facts.md
      06_data_warnings.md
    previews/
    warnings/
  05_logs/
    intake_log.md
    extraction_log.md
    data_quality_log.md
```

If DuckDB or Parquet support is not bundled yet, the MVP must still work with
SQLite, CSV, JSONL, and Markdown.

## Stage 1: Source Intake

Actions:

- Copy each source file to `01_sources/original/`.
- Create a working copy in `01_sources/working/`.
- Never modify the original file.
- Compute a checksum for each file.
- Record size, extension, date copied, and source path.
- Detect blocked, password-protected, or unsupported files.

Output:

```text
05_logs/intake_log.md
02_extracted/markdown/01_source_summary.md
```

## Stage 2: Excel Extraction

Excel must be treated as a business system, not a flat file.

### Excel Refresh Path

If Microsoft Excel is installed and automation is allowed:

- Open a working copy invisibly.
- Refresh connections.
- Refresh pivot tables.
- Calculate formulas.
- Save the refreshed copy.
- Record refresh success or failure.

If refresh fails:

- Do not stop the whole extraction.
- Use saved workbook values.
- Mark affected data as possibly stale.

### Excel Inventory

Extract:

- Workbook metadata
- Sheet list
- Visible, hidden, and very hidden sheets
- Used ranges
- Excel tables
- Pivot tables
- Named ranges
- Charts and chart source references
- Formula cells
- Merged cells
- Filters
- Freeze panes
- External links
- Data validation lists
- Comments and notes where available

### Sheet Profiling

For every sheet:

- Detect header rows
- Detect table blocks
- Detect blank rows and columns
- Detect data types
- Detect date columns
- Detect numeric columns
- Detect category columns
- Detect formula columns
- Detect total rows
- Detect subtotal rows
- Detect merged headers
- Detect filter state

### Pivot Extraction

For every pivot table:

- Pivot name
- Sheet name
- Source range if available
- Row fields
- Column fields
- Value fields
- Filters
- Visible output table
- Grand totals
- Last refresh status if available

The visible pivot output must be exported as a clean table because it is often
the safest business-readable result.

## Stage 3: Word Extraction

Extract:

- Headings
- Paragraphs
- Bullet lists
- Tables
- Action items
- Decisions
- Owners
- Dates
- Risks
- Requirements
- Comments
- Tracked changes status
- Headers and footers
- Embedded image references

Output:

```text
02_extracted/markdown/word_summary.md
02_extracted/markdown/word_action_items.md
02_extracted/markdown/word_decisions.md
02_extracted/markdown/word_tables.md
```

## Stage 4: PDF Extraction

PDF extraction must report confidence.

Handle:

- Digital text PDFs
- Scanned PDFs
- Tables
- Multi-column pages
- Rotated pages
- Repeating headers and footers
- Charts and images
- Forms
- Arabic text
- Low-quality scans

Output:

```text
02_extracted/markdown/pdf_summary.md
02_extracted/markdown/pdf_page_summaries.md
02_extracted/markdown/pdf_tables.md
02_extracted/markdown/pdf_low_confidence_pages.md
```

If OCR is not bundled, scanned PDFs must be marked as requiring OCR. The weak
agent must not guess from unreadable pages.

## Stage 5: PPTX Extraction

For old decks, extract:

- Slide titles
- Text boxes
- Tables
- Chart labels and visible values where possible
- Image references
- Speaker notes
- Footers
- Logos
- Theme colors
- Slide screenshots
- Layout type guess

Output:

```text
02_extracted/markdown/old_deck_summary.md
02_extracted/markdown/old_deck_slide_inventory.md
02_extracted/markdown/old_deck_content_to_reuse.md
02_extracted/markdown/old_deck_design_notes.md
```

## Stage 6: Local Databases

Use two local data stores.

### metadata.sqlite

Stores:

- Projects
- Source files
- Extraction runs
- Sheets
- Tables
- Columns
- Pivots
- Warnings
- Queries
- Slide jobs
- Export history
- Source references

### analytics.duckdb

Stores:

- Clean tables
- Pivot outputs
- Aggregations
- Metrics
- Slide-ready datasets

If DuckDB is not available in the offline bundle, use SQLite plus CSV/JSONL as
the fallback. The project must not fail only because DuckDB is unavailable.

## Stage 7: Markdown For Weak Agents

Markdown is mandatory because weak agents understand it more reliably than raw
spreadsheets.

Required files:

```text
00_data_index.md
01_source_summary.md
02_sheet_inventory.md
03_table_inventory.md
04_pivot_tables.md
05_slide_ready_facts.md
06_data_warnings.md
```

### 00_data_index.md Format

```markdown
# Data Index

Project: Monthly Operations Review
Extraction date: 2026-07-06

Use these files:
- 05_slide_ready_facts.md for slide content
- 06_data_warnings.md before using any number
- tables/monthly_summary.md for monthly metrics

Do not use:
- raw Excel files
- raw PDF files
- hidden sheets unless explicitly selected
```

### Slide-Ready Fact Format

```markdown
# Slide-Ready Facts

Recommended slide type: KPI dashboard

Facts:
- Total automated reports: 14
  Source: workbook.xlsx | Automation Summary | Table_Automation | row 18
- Monthly saved hours: 420
  Source: workbook.xlsx | Pivot_Monthly_Saving | visible pivot output
- Main risk: Two reports still require manual SAP validation
  Source: project_notes.docx | Decisions | paragraph 7

Warnings:
- Pivot_Monthly_Saving could not be refreshed. Last saved values were used.
```

## Stage 8: Semantic Metric Layer

Business metrics should be defined once and reused.

Example:

```json
{
  "metric_id": "monthly_saving_usd",
  "display_name": "Monthly Saving",
  "formula": "saved_hours * hourly_rate_usd",
  "format": "currency_usd",
  "source_table": "automation_reports",
  "required_columns": ["saved_hours", "hourly_rate_usd"]
}
```

Rules:

- Every calculated metric must show its formula.
- Every metric must show source columns.
- The system must not mix currencies silently.
- The weak agent may use the metric text but may not rewrite the formula.

## Stage 9: Query Builder

The user should choose analysis actions from controls.

Allowed actions:

- Total by month
- Top 5 by department
- Actual vs target
- Completed vs in progress
- Saving by report
- Cost by product
- Variance percentage
- Overdue items
- Monthly trend
- Department ranking
- Status matrix

The app translates these choices into stored queries. The weak agent reads the
query result Markdown, not SQL.

## Data Quality Checks

Detect and report:

- Missing values
- Duplicate rows
- Wrong date formats
- Mixed date formats
- Numbers stored as text
- Text stored as numbers
- Formula errors
- External links
- Hidden filters
- Totals inside raw data
- Currency mismatch
- Percentage scale mismatch
- Outliers
- Negative values in fields that should not be negative
- Protected workbook
- Stale pivot output
- Arabic and English mixed headers
- Merged cells that break table extraction

Warnings must be written in plain English.

## Edge Cases And Required Handling

| Edge Case | Required Handling |
|---|---|
| Password-protected workbook | Ask locally, never store password |
| Excel not installed | Extract saved values only and mark no-refresh mode |
| Pivot refresh fails | Use visible cached output and warn |
| Power Query unavailable | Use last saved output and warn |
| External links missing | Freeze saved values and warn |
| Workbook corrupted | Try working-copy recovery, otherwise extract visible values only |
| Huge workbook | Chunk extraction and avoid loading all tables at once |
| Multiple tables in one sheet | Detect table blocks separately |
| No clear header row | Require user selection in Control Board |
| Merged headers | Flatten names and preserve original labels |
| Hidden filters | Warn that visible data may be filtered |
| Hidden sheets | Extract metadata, do not use facts unless selected |
| Arabic headers | Preserve original and create English aliases |
| Ambiguous dates | Preserve raw text and ask for date rule |
| Mixed currencies | Block metric calculation until currency rule exists |
| Image-only PDF | Require OCR bundle or mark unreadable |
| Low OCR confidence | Exclude from slide-ready facts unless approved |
| Word tracked changes | Record whether accepted or pending |
| Duplicate metric names | Require unique metric alias |

## Weak Agent Interface

The weak agent may read:

- `00_control/agent_task.md`
- `00_control/slide_job.json`
- `02_extracted/markdown/00_data_index.md`
- `02_extracted/markdown/05_slide_ready_facts.md`
- `02_extracted/markdown/06_data_warnings.md`

The weak agent must not read raw sources unless the task explicitly says so.

## Acceptance For DataForge

- Every extracted fact has a source reference.
- Every warning is visible before slide generation.
- The weak agent can understand the data from Markdown alone.
- Raw files remain unchanged.
- The pipeline works offline.
- Failure is honest and specific, not silent.
