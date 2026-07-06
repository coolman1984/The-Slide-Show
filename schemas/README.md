# SlideSpec Schemas

This folder holds the future public JSON contract for SlideForge decks.

## Current vs future relationship

- **Current deck JSON** (`decks/*.json`) is the format the engine builds today.
  It stays supported. Existing decks keep working unchanged.
- **SlideSpec** (`schemas/slide-spec.schema.json`) is the forward-facing contract
  for weak agents, template registries, and future tooling.

No engine behavior changes are required to add these schemas. They are
contracts first; adapters and renderers will connect them incrementally.

## Files

| File | Purpose |
|---|---|
| `slide-spec.schema.json` | Top-level deck and slide structure for SlideSpec |
