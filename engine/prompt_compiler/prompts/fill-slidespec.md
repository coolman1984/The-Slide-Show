# Fill SlideSpec

## Objective
Convert the source content below into a valid SlideSpec JSON object.

## Rules
- Use only fields defined in `schemas/slide-spec.schema.json`.
- Choose a `templateId` from `templates/registry.json`.
- Choose a `themeId` from `themes/catalog.json`.
- Do not invent names, numbers, dates, or statuses.
- Use `[Insert ...]` placeholders when a value is missing.

## Input
```
[INPUT]
```

## Output JSON shape
```json
{
  "spec": {
    "specVersion": "1.0",
    "deck": {
      "id": "...",
      "title": "...",
      "themeId": "..."
    },
    "slides": [
      {
        "slideId": "...",
        "templateId": "...",
        "themeId": "...",
        "content": {}
      }
    ]
  }
}
```

## Failure behavior
If the content cannot be represented as SlideSpec, return `{ "spec": null, "reason": "..." }`.
