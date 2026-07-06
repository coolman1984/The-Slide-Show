# Repair JSON

## Objective
Fix the malformed JSON below without changing its meaning.

## Rules
- Preserve all existing keys and values.
- Fix only syntax errors: trailing commas, missing quotes, unescaped characters, brackets.
- Do not add, remove, or rename fields.
- Do not invent missing values.

## Input
```
[INPUT]
```

## Output JSON shape
```json
{
  "repaired": "{\"key\": \"value\"}"
}
```

## Failure behavior
If the JSON cannot be repaired safely, return `{ "repaired": null, "reason": "..." }`.
