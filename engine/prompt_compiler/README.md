# Prompt Compiler

The prompt compiler gives weak AI agents one small, well-defined task at a time.
Each prompt is a plain-text template. No agent should receive more than one task
per prompt.

## Rules

1. **One task per prompt.** A prompt does exactly one job: extract, rewrite,
   fill, classify, shorten, or repair.
2. **JSON-only outputs.** Every prompt declares the exact JSON shape the agent
   must return. No prose explanations unless the output field is a string.
3. **Do not invent facts.** If the input is missing a value, return `null` or
   an empty array, not a guessed name, number, or date.
4. **Failure behavior is explicit.** Each prompt says what to return when the
   task cannot be completed.

## Using a prompt

1. Read the prompt file.
2. Replace the `[INPUT]` placeholder with the actual source text or JSON.
3. Send the filled prompt to the model.
4. Validate the returned JSON against the declared output shape.

## Prompts

| Prompt | Job | Output shape |
|---|---|---|
| `extract-agenda.md` | Pull agenda items from raw meeting notes | `{ "items": string[] }` |
| `rewrite-card-body.md` | Shorten a card body to fit density limits | `{ "body": string }` |
| `fill-slidespec.md` | Turn content into a SlideSpec JSON object | `{ "spec": object }` |
| `repair-json.md` | Fix malformed JSON without changing meaning | `{ "repaired": string \| null }` |
