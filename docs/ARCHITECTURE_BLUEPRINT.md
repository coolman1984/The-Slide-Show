# Architecture Blueprint

## Target Shape

SlideForge OS should become a set of small local modules connected through
stable JSON contracts.

```text
source material
  -> intake helpers
  -> prompt compiler
  -> agent task output
  -> SlideSpec JSON
  -> validator
  -> repair loop
  -> template renderer
  -> theme engine
  -> artifact exporter
  -> quality gates
  -> approved output
```

## Module Boundaries

| Module | Responsibility | Should Not Do |
|---|---|---|
| Intake | collect rough user/source material | design slides |
| Prompt compiler | generate small model tasks | render visuals |
| Agent output parser | enforce JSON-only output | guess missing facts |
| SlideSpec validator | validate contracts | silently repair facts |
| Repair loop | make narrow corrections | redesign whole deck blindly |
| Template registry | list supported templates | store source facts |
| Theme engine | resolve visual tokens | change content |
| Renderer | produce HTML/SVG/CSS | invent copy |
| Exporter | package output formats | modify source deck |
| Quality gates | block risky output | hide warnings |
| Provenance | track source and approvals | validate layout |

## Interface Contracts

### SlideSpec Contract

The main content contract. It should be versioned, strict, and additive.

### Template Contract

Defines allowed content fields, layout constraints, density limits, examples,
and repair rules.

### Theme Contract

Defines token values for typography, colors, spacing, shapes, surfaces,
backgrounds, charts, icons, footers, and motion.

### Validator Result Contract

Every validator should return:

- `ok`
- `errors`
- `warnings`
- `repairs`
- `artifactPaths`

### Export Manifest Contract

Every export should record:

- source deck
- source hash
- output file
- build timestamp
- renderer version
- theme
- slide count
- verification result

## Versioning Rules

- Add fields instead of changing field meaning.
- Keep old deck JSON supported until a migration script exists.
- Deprecate templates before removing them.
- Never silently change a Golden template's visual behavior.
- Record breaking decisions in ADRs.

## Testing Strategy

### Static Tests

- JSON schema validation
- allowed template/theme IDs
- no external references in generated HTML
- manifest hash check

### Render Tests

- build every example deck
- screenshot every golden template
- compare dimensions and key layout bounds
- check footer exclusion zones

### Content Tests

- bad examples fail
- repair prompts are generated
- long text warnings appear
- unsupported icons fall back or fail according to policy

### Manual QA

- full deck visual inspection
- presentation navigation
- projector/high-contrast review for important decks

## Dependency Strategy

Routine operation must stay pre-wired. If a future feature needs a library:

1. creator evaluates the dependency
2. creator decides whether to vendor/bundle it
3. creator documents the reason in an ADR
4. verification proves routine users do not run setup

## Packaging Strategy

Future meeting package:

```text
meeting-package/
  presentation.html
  screenshots/
  export-manifest.json
  source-deck.json
  README-open-this-file.txt
  fallback/
```

## Security And Confidentiality

- Default confidential footer support.
- No external references in final HTML.
- Source tracking for business-critical facts.
- Redaction mode as future capability.
- Never include secrets or credentials in deck JSON.
- Separate draft outputs from approved outputs.

## UI Control Panel Architecture

Future local UI should use:

- left sidebar: deck and slide navigation
- center: slide preview
- right panel: structured fields and validation
- top toolbar: template, theme, density, export
- bottom panel: issues, provenance, approval state

It should optimize repeated production work, not marketing decoration.

