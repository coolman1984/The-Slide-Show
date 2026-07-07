# Skill: DataForge DB And Markdown Handoff

Use this skill when the task is to turn extracted data into local DB files,
Markdown summaries, and Agent Pack-ready facts.

## Purpose

The DB layer is for calculation and repeatability.

The Markdown layer is for weak-agent understanding.

The weak agent should not query the DB directly in routine slide work.

## Target Folder Shape

```text
projects/<project_id>/
  01_sources/
    original/
    working/
  02_extracted/
    db/
    tables/
    markdown/
    warnings/
  03_slide_jobs/
  04_renders/
  05_logs/
```

## Local Data Stores

Current MVP can use JSON, CSV, and Markdown only.

Future local DB targets:

- `metadata.sqlite` for project metadata and source references
- `analytics.duckdb` for analytical tables and aggregations

Do not add DB dependencies until they are bundled and verified offline.

## Required Markdown Contract

Every extraction package should include:

- `00_data_index.md`
- `05_slide_ready_facts.md`
- `06_data_warnings.md`

Facts must include source references.

Warnings must appear before final slide generation.

## Edge Cases

| Case | Correct Handling |
|---|---|
| Duplicate metric names | Require unique alias |
| Conflicting facts | Keep both and flag conflict |
| Missing source reference | Do not promote to slide-ready fact |
| Mixed currencies | Block combined calculation |
| Mixed periods | Split by period or warn |
| Huge tables | Summarize top N; do not paste full table into slide |
| Empty extraction | Create warnings and block facts |
| Optional source missing | Continue and mark optional missing |
| Required source missing | Block handoff |
| DB unavailable | Fall back to JSON/CSV/Markdown |

## Weak-Agent Rule

The weak agent reads Markdown. It may not invent calculations, run SQL, or open
raw files unless Mohamed explicitly asks.

## Done Means

- Markdown files exist.
- Warnings are visible.
- Facts have source references.
- Agent Pack points to the Markdown.
- `npm test` and `npm run verify` pass.
