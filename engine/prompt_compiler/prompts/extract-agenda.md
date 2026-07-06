# Extract agenda items

## Objective
Read the meeting notes below and extract a clean list of agenda items.

## Rules
- Return one item per agenda topic.
- Keep each item short (ideally ≤ 12 words).
- Do not add topics that are not in the notes.
- Do not invent numbers, names, or dates.

## Input
```
[INPUT]
```

## Output JSON shape
```json
{
  "items": ["First agenda item", "Second agenda item"]
}
```

## Failure behavior
If no agenda items can be extracted, return `{ "items": [] }`.
