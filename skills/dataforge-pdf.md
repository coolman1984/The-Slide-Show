# Skill: DataForge PDF Extraction

Use this skill when the task is to extract data from PDF files for SlideForge.

PDF extraction must be honest about confidence. Do not let a weak agent guess
from unreadable pages.

## Purpose

PDF files must become prepared Markdown:

- document summary
- page summaries
- extracted tables
- chart notes
- low-confidence page warnings
- slide-ready facts

## Safe Pipeline

1. Copy the original PDF into `01_sources/original/`.
2. Record file name, size, page count, and checksum.
3. Detect whether the PDF has digital text or scanned images.
4. Extract text where reliable.
5. Extract tables where structure is clear.
6. Mark charts and images as visual evidence, not exact data, unless parsed.
7. Create low-confidence warnings.
8. Write slide-ready facts only from reliable content.

## Required Markdown

- `02_extracted/markdown/pdf_summary.md`
- `02_extracted/markdown/pdf_page_summaries.md`
- `02_extracted/markdown/pdf_tables.md`
- `02_extracted/markdown/pdf_chart_notes.md`
- `02_extracted/markdown/pdf_low_confidence_pages.md`
- `02_extracted/markdown/05_slide_ready_facts.md`
- `02_extracted/markdown/06_data_warnings.md`

## PDF Edge Cases

| Case | Correct Handling |
|---|---|
| Image-only scan | Require OCR bundle or mark unreadable |
| Low OCR confidence | Exclude from facts unless user approves |
| Rotated pages | Detect and rotate in extraction stage |
| Multi-column layout | Preserve reading order warning if uncertain |
| Repeating headers | Remove from facts; keep in page summary |
| Tables split across pages | Combine only if headers match |
| Chart without data labels | Describe chart; do not invent values |
| Arabic text | Preserve text and mark direction requirement |
| Stamps/signatures | Record as visual notes only |
| Forms | Extract field labels and values separately |
| Confidential marks | Preserve warning and footer recommendation |

## Weak-Agent Rule

The weak agent reads only the PDF Markdown output. It does not inspect raw PDF
pages unless Mohamed explicitly asks.

## Done Means

- Low-confidence content is clearly marked.
- Slide-ready facts have source page references.
- No chart values are invented.
- Agent Pack can use the generated Markdown.
- `npm test` and `npm run verify` pass.
