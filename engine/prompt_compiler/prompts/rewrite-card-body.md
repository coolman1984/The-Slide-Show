# Rewrite card body

## Objective
Shorten the card body text so it fits the template density limit.

## Rules
- Preserve the original meaning.
- Remove filler words and redundant phrases.
- Do not add new facts.
- Target 160 characters or fewer.

## Input
```
[INPUT]
```

## Output JSON shape
```json
{
  "body": "Shortened card body text."
}
```

## Failure behavior
If the text cannot be shortened without losing a required fact, return
`{ "body": null }` and explain why in a second field: `{ "reason": "..." }`.
