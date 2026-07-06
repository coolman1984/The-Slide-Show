# SlideForge OS Product And Experience Spec

## One-Line Product Definition

SlideForge OS is a local-first presentation factory that turns rough business
material into polished executive slide decks through strict content contracts,
reusable templates, theme tokens, validation gates, and deterministic rendering.

## Positioning

SlideForge OS is not a normal slide editor and not a prompt library. It is a
production system for people who need management-grade presentations under
pressure and cannot trust model taste.

## Primary User

Mohamed: a finance and operations leader who needs high-quality presentations
for Korean and Egyptian management. He is not trying to become a frontend
engineer. He needs the system to turn rough instructions, tables, and updates
into clear professional decks with minimal back-and-forth.

## Secondary Users

- Less intelligent AI agents that operate the system through simple commands.
- Future stronger agents that expand templates and tools.
- Human reviewers who inspect and approve final output.
- Management audience that only sees the finished deck.

## Core Promise

The user can provide rough material and say what outcome he wants. The system
will guide agents into a safe workflow and produce a polished, verified output.

## Product Principles

1. **Factory, not artist.** The system controls design; agents fill structured
   content.
2. **Executive clarity first.** Every slide must be readable, aligned, and
   purposeful.
3. **Source truth wins.** Names, dates, statuses, and numbers cannot be guessed.
4. **Small tasks for weak agents.** One extraction, one rewrite, one JSON
   object, one repair at a time.
5. **Templates are products.** Each template has a schema, examples, previews,
   validation, repair rules, and lifecycle.
6. **Themes are systems.** A theme controls typography, color, shape, spacing,
   shadows, charts, icons, and footer behavior.
7. **Verification is part of creation.** A deck is not ready because it builds;
   it is ready when it passes checks and is visually inspected.
8. **Current deck is protected.** Expansion must not risk tomorrow's default
   deck.

## What The System Must Eventually Do

### Intake

- Accept rough text, tables, screenshots, images, and structured JSON.
- Let the user choose a task: create deck, update deck, change theme, build
  template, export, verify, or repair.
- Detect missing facts and ask for only the smallest necessary clarification.

### Content Intelligence

- Extract facts without inventing.
- Rewrite into clear professional English.
- Identify slide type candidates.
- Build a deck story: cover, agenda, body, conclusion.
- Flag placeholders, estimates, unsupported claims, and missing units.

### Design Production

- Select template IDs, not free-form layouts.
- Apply theme tokens.
- Render deterministic HTML/CSS/SVG slides.
- Generate variants safely: theme, density, accent, card shape, background,
  animation level.
- Prevent fragile design edits by weak agents.

### Quality Control

- Validate schema.
- Validate content density.
- Validate source truth.
- Validate layout risk.
- Validate output self-containment.
- Capture screenshots where possible.
- Compare against golden examples in future phases.

### Export

- Keep HTML as the first-class output.
- Add PNG, PDF, and PPTX only when the creator can bundle a reliable local path.
- Produce a meeting package with the final file, screenshots, manifest, and
  rollback copy.

### Approval Memory

- Save approved templates and slides as golden references.
- Save rejected outputs as bad examples.
- Track source material, AI edits, manual edits, and approval status.

## User Experience Model

### Routine Operator Flow

1. User says what to change.
2. Agent reads `AGENTS.md`.
3. Agent edits the deck JSON or creates a new JSON deck.
4. Agent builds output.
5. Agent runs `npm run verify`.
6. Agent visually inspects the changed slides.
7. Agent reports changed file, output file, verification result, and risk.

### Architect Flow

1. Read master plan and architecture docs.
2. Define or update schema/contracts first.
3. Add template/theme/tooling.
4. Add examples and validation.
5. Update manifest.
6. Run `npm run verify`.
7. Visually inspect rendered examples.

### Current And Future Control Board Flow

Current MVP exists at `dist/control-board.html`. It supports visual choices,
preview, prepared facts, validation warnings, and Agent Pack downloads.

Future product flow:

1. Select deck or create new deck.
2. Pick template family.
3. Fill structured fields.
4. Preview variants.
5. See validation warnings.
6. Approve the best version.
7. Export meeting package.

## The Local Control Board Must Include

- Deck list
- Slide list
- Template picker
- Theme picker
- Density selector
- Color/accent selector
- Shape/radius selector
- Surface style selector
- Footer/confidentiality controls
- Slide preview
- Validation panel
- Source/provenance panel
- Variant comparison
- Export panel
- Approval button
- Rollback button

It should feel like an operations tool, not a marketing landing page.

## Design System Requirements

### Typography

- Clear system fonts by default.
- Defined type scale for title, section, body, labels, captions.
- Minimum readable size per slide type.
- Long-name handling.
- Future support for Arabic and Korean.

### Layout

- 1920 x 1080 design canvas.
- Fixed safe margins.
- Footer exclusion zone.
- Template-specific grids.
- Responsive stage scaling.
- No content should move unpredictably during presentation.
- Optional fields should collapse cleanly when null.
- Text should never shrink below the readable floor; split or shorten instead.

### Color

- Semantic status colors for done, in progress, planning, risk, warning.
- Theme accents for visual identity.
- Contrast rules for projector safety.
- High-contrast fallback theme.

### Motion

- Motion must support presentation polish without distracting management.
- Reduced-motion mode must remain supported.
- Animation must not hide content needed for screenshots or printing.

### Accessibility

- Keyboard navigation.
- Meaningful button labels in the future UI.
- Sufficient contrast.
- Text not conveyed by color alone.
- Exported output should remain readable when printed or projected.

## Template Lifecycle

Every template moves through:

1. Draft
2. Internal preview
3. Validated
4. Golden
5. Deprecated
6. Superseded

Template requirements before Golden:

- schema exists
- example input exists
- rendered preview exists
- density limits exist
- repair strategy exists
- visual QA passed
- at least one approved real use case exists

## Theme Lifecycle

Every theme moves through:

1. Draft tokens
2. Preview on sample deck
3. Contrast check
4. Dense-slide check
5. Golden approval

Theme requirements before Golden:

- dark/light mode declared
- semantic colors mapped
- all accent slots distinguishable
- timeline and dense cards readable
- footer readable
- projector risk reviewed

## Data Model Concepts

Future storage can remain file-based first:

| Concept | Purpose |
|---|---|
| Deck | Full presentation definition |
| Slide | One slide instance |
| Template | Reusable layout contract |
| Theme | Visual token system |
| Source | Origin of facts |
| Artifact | Built HTML/PNG/PDF/PPTX |
| Approval | Human-approved output state |
| Golden | Approved reference output |
| Finding | Validation or QA issue |

SQLite can be added later only if it improves local project management enough
to justify the extra bundled runtime.

## Public Interfaces To Design Carefully

- SlideSpec JSON
- Template registry JSON
- Theme token JSON
- Surface style registry JSON
- Validator error format
- Prompt compiler task format
- Repair request/response format
- Export manifest format
- Approval metadata format

These interfaces must be stable because future agents and tools will depend on
them.

## Error Format Standard

All tools should eventually return errors like:

```json
{
  "ok": false,
  "errors": [
    {
      "code": "TEXT_TOO_LONG",
      "path": "slides[2].cards[1].body",
      "message": "Body exceeds 28 words.",
      "repair": "Rewrite this field in 28 words or fewer."
    }
  ]
}
```

## What I Added Beyond The Original Idea

- stable interface contracts
- lifecycle for templates and themes
- approval memory
- golden and bad examples
- local control panel UX
- accessibility requirements
- visual regression direction
- provenance model
- export manifest concept
- rollback/meeting package concept
- error format standard
- future deprecation process
- high-contrast projector theme
- source-truth governance
- versioned schemas
- creator vs operator role separation

## Success Criteria

SlideForge OS is successful when:

- a weak agent can create a good deck by filling structured data
- the user can change wording quickly before a meeting
- every final output is traceable and verified
- templates can be reused across many deck types
- themes can change the look without breaking layout
- current deck remains safe while the system expands
- future features are added through contracts, not hacks
