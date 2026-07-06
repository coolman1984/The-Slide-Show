# Low-Intelligence Agent Compatibility

## Purpose

This project must work with agents and models that are fast, cheap, or less
reliable. The solution is not to write longer prompts. The solution is to make
the agent's job smaller.

## Core Rule

The agent fills forms. The system designs.

## What Weak Agents Should Do

Weak agents are useful for:

- extracting names
- extracting dates
- extracting agenda items
- classifying slide type
- rewriting one short paragraph
- filling one JSON object
- fixing one validator error
- listing missing values

## What Weak Agents Should Not Do

Weak agents should not:

- invent visual layouts
- choose arbitrary colors
- create CSS
- write free-form HTML
- decide font sizes
- merge unrelated slide concepts
- summarize a long document and design the deck in one step
- repair multiple unrelated errors in one answer
- guess missing numbers

## Task Shape

Every task prompt should contain:

1. One objective.
2. One output format.
3. One small schema.
4. One short example if needed.
5. A clear refusal path for missing data.

Bad task:

> Make this into a beautiful executive presentation.

Good task:

> Extract up to 6 agenda items from the text. Return JSON only:
> `{ "items": ["..."] }`. Do not rewrite names or numbers.

## JSON Discipline

Agents must output strict JSON for structured work. The system should reject:

- markdown fences
- comments
- trailing commas
- unquoted keys
- extra explanation
- unsupported fields

If JSON is invalid, the repair prompt should be:

> Return the same content as valid JSON only. No markdown. No explanation.

## Template Selection

Agents may choose only from listed template IDs.

Example:

```json
{
  "allowedTemplateIds": [
    "cover.centered-title",
    "agenda.numbered-list",
    "comparison.three-cards",
    "timeline.month-matrix"
  ]
}
```

If uncertain, the agent should return:

```json
{ "templateId": null, "reason": "Need user choice" }
```

## Model Profiles

Model profiles are guidance only. The system must still validate every output.

| Model Type | Safer Tasks |
|---|---|
| Fast model | extraction, classification, simple JSON |
| Long-context model | reading long documents |
| Business-writing model | wording cleanup and executive phrasing |
| Reasoning model | story structure and repair decisions |
| Coding model | engine/tool changes |

## Repair Prompts

Repair prompts must be narrow and field-specific.

Examples:

- `slides[2].heading` is 68 characters. Rewrite to 46 characters max.
- `cards[1].body` is too long. Rewrite to 28 words max.
- `status` must be one of `completed`, `inprogress`, `planning`.
- `templateId` is unsupported. Choose from the provided list only.
- `value` has no unit. Return `{ "missing": ["unit for value"] }`.

## Golden Examples

Each template should include:

- good source input
- correct JSON
- common bad JSON
- corrected JSON
- rendered screenshot
- notes about why the output is good

Weak agents learn by pattern. Keep examples short and exact.

## Compatibility Acceptance Criteria

A weak-agent workflow is acceptable only if:

- each prompt has one job
- output schema is small
- validator catches wrong fields
- repair prompt is exact
- no design freedom is required
- final slide quality does not depend on model taste

