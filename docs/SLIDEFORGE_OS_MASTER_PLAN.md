# SlideForge OS Master Plan

## Executive Intent

Build a complete presentation production system, not a prompt collection.

The core principle:

> AI handles meaning. Code guarantees design quality.

Weak or mid-level AI agents should not be asked to "design a beautiful slide."
They should extract content, clean wording, choose from allowed options, and
fill strict JSON contracts. The renderer, templates, themes, validators, and
repair tools produce the polished executive result.

The current SEEG-P AX monthly deck remains the default presentation and the
first golden template. It must stay presentable while the larger system grows
around it.

## Extracted Requirements From The Idea

### Product Goal

Create a Swiss-knife slide production system that can generate many kinds of
beautiful one-page slide shows and full decks with controlled variations:

- different templates
- different themes
- different colors
- different fonts
- different shapes
- different card styles
- different section structures
- different export outputs
- different density levels
- different corporate styles

The system must support repeated use by less intelligent models and agents
without depending on their taste, memory, or design judgment.

### User Workflow

The user may provide rough material:

- text fragments
- meeting agenda
- screenshots
- photos
- emails
- tables
- Excel extracts
- org charts
- project lists
- KPI values
- management notes
- process descriptions
- case studies
- strategy ideas

The system should:

1. Extract the facts.
2. Preserve source truth.
3. Clean the English.
4. Choose a slide/deck structure.
5. Fill strict SlideSpec JSON.
6. Validate content and density.
7. Render using deterministic templates.
8. Inspect quality.
9. Repair if needed.
10. Export the final presentation.

### Compatibility Target

The system must be usable by weaker models and agents such as:

- DeepSeek Flash / Pro
- Kimi
- MiniMax
- GLM
- MiMo
- Qwen
- other cheap or fast models

The architecture must assume these models:

- may over-explain
- may output invalid JSON
- may invent fields
- may ignore long instructions
- may choose poor layouts
- may fail on visual taste
- may forget constraints
- may produce too much text
- may misunderstand a theme name

Therefore the system must constrain them.

## Architecture Principle

The weak model is not the designer.

| Layer | Main Responsibility |
|---|---|
| User | Supplies intent and source material |
| Agent | Extracts, cleans, and fills forms |
| Prompt compiler | Gives the agent one small task at a time |
| SlideSpec | Strict JSON contract |
| Validator | Rejects bad or risky content |
| Repair loop | Asks for small corrections or applies deterministic fixes |
| Template engine | Controls layout and hierarchy |
| Theme engine | Controls tokens, color, font, shape, background |
| Renderer | Produces the visual output |
| Quality judge | Checks screenshots and layout constraints |
| Exporter | Produces HTML, PNG, PDF, or PPTX |
| Provenance layer | Tracks source, edits, approvals, and version history |

## System Layers

### 1. SlideSpec Core Format

SlideSpec is the universal JSON format for all slide work. Agents fill it;
tools render it.

Required design:

- versioned schema
- strict allowed slide types
- strict allowed theme IDs
- strict allowed density values
- strict text limits per field
- no raw HTML
- source references per important fact
- confidence flags for extracted content
- placeholders for missing facts
- validation paths that point to exact fields

Example direction:

```json
{
  "specVersion": "1.0",
  "deck": {
    "title": "AI Monthly Update",
    "audience": "executive",
    "language": "en",
    "defaultTheme": "ai-executive-dark"
  },
  "slides": [
    {
      "slideId": "s01",
      "templateId": "cover.centered-title",
      "themeId": "ai-executive-dark",
      "content": {
        "heading": "[SEEG-P AX monthly meeting]",
        "subheading": "[10/7/2026]"
      }
    }
  ]
}
```

### 2. Template Library

The current deck becomes:

`Template Family 001 - AI Executive Dark Tech`

Initial template set:

| Template | Purpose |
|---|---|
| Cover | Opening slide |
| Agenda | Meeting flow |
| Org chart | Team structure |
| Role cards | Responsibility explanation |
| Timeline matrix | Month-by-month project plan |
| Comparison cards | Model/product/vendor comparison |
| Wide summary banner | Announcement or key update |

Expanded template set:

| Template | Purpose |
|---|---|
| KPI dashboard | Financial, operational, or project metrics |
| Variance bridge | Finance bridge from budget to actual |
| Cost waterfall | Manufacturing cost movement |
| Process map | Workflow before/after |
| Case study | Problem, action, result |
| Decision slide | Options, tradeoffs, recommendation |
| Risk matrix | Risk level and mitigation |
| Project update | Status, blockers, next actions |
| Training update | Course progress and completion |
| Award / recognition | Winner, reason, impact |
| Roadmap | Phases and milestones |
| Before/after | Current state vs target state |
| Data table highlight | Dense table with highlighted insight |
| Factory operations board | Production, cost, quality, delivery |
| Finance business partner brief | Message, evidence, ask |
| Executive memo slide | One-page board-style summary |

Every template must have:

- schema
- examples
- bad examples
- density limits
- visual preview
- theme compatibility
- repair strategy
- acceptance checks

### 3. Theme And Token Engine

Themes must not be just colors. A theme is a full design identity:

- page background
- slide background
- text colors
- accent slots
- card surface
- border style
- shadows/glows
- radius system
- title scale
- body scale
- icon style
- footer style
- status colors
- chart colors
- avatar gradients
- animation style

Initial theme families:

| Theme | Use |
|---|---|
| AI Executive Dark Tech | Default, current deck |
| Corporate Light | Dense timelines and formal updates |
| Samsung-Inspired Blue | Samsung-style executive deck |
| Finance Executive White | CFO, variance, closing, budget |
| Factory Operations | Cost, production, efficiency, quality |
| Premium Black | High-impact boardroom message |
| Minimal White | Conservative reports |
| Emerald Operations | Sustainability, improvement, growth |
| Royal AI Purple | Innovation and strategy |
| High-Contrast Projector | Weak projector environments |

Theme variants must control:

- cyan / blue / teal / purple / gold accents
- sharp vs soft card radius
- compact vs spacious density
- dark vs light mode
- static vs animated background
- conservative vs high-impact visual style

### 4. Auto Layout Engine

The system must prevent common AI slide failures:

- title too long
- too many bullets
- too many cards
- long names in org charts
- status pills wrapping badly
- text touching footer
- chart labels colliding
- inconsistent card heights
- unbalanced columns
- tiny unreadable text
- crowded timeline cells
- right-to-left and mixed-language issues

Required capabilities:

- text measurement before render
- density scoring
- auto-wrap rules
- max line counts
- automatic split recommendation
- compact mode and spacious mode
- per-template overflow strategies
- hard failure when content cannot fit safely

### 5. Validation Layer

Validation has two levels.

Content validation:

- JSON parses
- schema is valid
- required fields exist
- allowed template/theme IDs only
- no unsupported icons
- no fake numeric fields
- no missing source for critical values
- dates are consistent
- statuses are allowed
- text length is within template limits

Visual validation:

- slide bounds respected
- footer clear
- contrast acceptable
- no cut-off text
- no broken hierarchy
- no unreadable font sizes
- no unbalanced repeated cards
- no external references
- generated output matches self-contained contract

### 6. Repair Layer

The repair system must be specific, not vague.

Bad:

> Make this better.

Good:

> `slides[3].cards[1].body` is 61 words. Rewrite it in maximum 28 words.
> Keep the meaning and output JSON only.

Repair types:

- shorten text
- split slide
- choose safer template
- change density
- change theme contrast
- change icon
- collapse bullet group
- convert bullets to cards
- convert table to highlights
- ask user for missing exact number

Repair can be deterministic or model-assisted. The default should be
deterministic when possible.

### 7. Prompt Compiler

Weak models need small tasks, not one giant prompt.

The prompt compiler generates tiny task prompts such as:

- Extract only agenda items.
- Rewrite this body in 24 words.
- Return valid JSON matching this schema.
- Choose one template ID from this list.
- Identify missing values only.
- Convert these project rows to status objects.

Prompt compiler requirements:

- one task per prompt
- short context
- exact output schema
- no design freedom unless explicitly safe
- examples included only when needed
- retry prompt generated from validator errors

### 8. Model Router

The system should route work by task, not by brand loyalty to one model.

Suggested model roles:

| Model Type | Good Use |
|---|---|
| Fast cheap model | extraction, classification, first JSON draft |
| Long-context model | reading long documents or emails |
| stronger reasoning model | deck story, repair, complex summarization |
| coding model | engine changes and tool implementation |
| deterministic code | validation, layout, rendering, export |

No single model should be trusted with the full pipeline.

### 9. Story Engine

The system must understand full deck flow, not only isolated slides.

Deck story checks:

- cover matches audience and date
- agenda matches slide order
- section numbers match agenda numbers
- heavy slides alternate with breathing slides when possible
- conclusion or ask exists when needed
- repeated labels and statuses are consistent
- executive message is clear
- deck is not just a pile of slides

Story structures:

- monthly update
- executive decision
- project launch
- finance closing
- cost reduction proposal
- automation case study
- training progress
- AI adoption roadmap
- risk and mitigation

### 10. Screenshot Reverse Engineering

Future killer feature: the user can provide a beautiful slide screenshot and
the system can turn it into a reusable template.

Extraction targets:

- grid structure
- margins
- card shapes
- colors
- typography scale
- hierarchy
- icons
- decorative patterns
- footer/header logic
- chart/table style

Output:

- draft template schema
- theme tokens
- reusable renderer component
- golden screenshot reference

Risk:

- must avoid copying confidential or copyrighted designs blindly
- should produce inspired reusable structure, not unauthorized duplicates

### 11. Asset Library

All reusable assets must live inside the project:

- icons
- status chips
- dividers
- badge styles
- avatar styles
- SVG patterns
- backgrounds
- chart styles
- footer styles
- placeholder templates
- sample decks
- approved previews

No final business slide should depend on external images or live web assets.

### 12. Export System

Priority outputs:

1. single self-contained HTML deck
2. PNG per slide
3. PDF
4. PPTX
5. theme preview board
6. template preview catalog

Important design decision:

For text-heavy corporate slides, final rendering should come from
HTML/CSS/SVG or deterministic vector-like rendering, not image generation.
Image generation may help with concept exploration, but it is not the final
source of truth for management decks.

If future export tools need dependencies, the creator must vendor or bundle
them into the project or provide a prebuilt local runtime. The operator agent
must not need to install them.

### 13. Local Control Panel

Future UI:

- choose deck
- choose template
- choose theme
- edit SlideSpec fields
- preview slide
- compare variants
- run validation
- inspect warnings
- approve golden output
- export formats
- version history

The UI should be a control panel, not a landing page.

### 14. Provenance And Approval Memory

Corporate decks need traceability.

Track:

- source file or note
- extraction date
- human edits
- AI-generated summaries
- exact slide version
- approved screenshot
- approved theme
- approved template
- who approved
- when approved

Approval memory:

- approved slides become golden examples
- rejected slides become bad examples
- future agents learn from the examples through templates and validators

### 15. Language And Font Engine

Support must include:

- professional English
- Arabic text when needed
- Korean names or labels when needed
- mixed-language lines
- long Egyptian Arabic names transliterated in English
- right-to-left layout support as future capability
- safe font fallback
- line-break rules for long names
- minimum readable size for projectors

For management decks, clear English remains the default.

## Edge Cases To Design For

### Input Edge Cases

- messy pasted text
- duplicated agenda numbering
- missing dates
- unclear status names
- real numbers mixed with estimates
- confidential data mixed with public text
- long names
- inconsistent capitalization
- Arabic and English mixed
- screenshots with tiny text
- Excel tables with merged headers
- incomplete org charts
- project lists with more than six months
- KPI values without units
- chart data without denominator

### Model Edge Cases

- invalid JSON
- markdown around JSON
- hallucinated fields
- invented facts
- wrong template ID
- unsupported theme ID
- too much text
- skipped required field
- wrong status casing
- non-parallel bullet grammar
- changed names or dates
- translated exact source text incorrectly

### Rendering Edge Cases

- text overflow
- clipped cards
- footer collision
- unreadable contrast
- extreme ultrawide windows
- projector low contrast
- reduced-motion settings
- browser opened via `file://`
- no local server
- missing browser for screenshot QA
- system font differences
- high DPI scaling
- small laptop screen
- presenter clicks wrong area

### Presentation-Day Edge Cases

- last-minute text correction
- executive asks to remove a slide
- date typo discovered late
- name spelling correction
- projector changes color/brightness
- laptop has no internet
- file opened from USB
- wrong deck version opened
- animation distracts audience
- presenter needs fullscreen quickly

### Governance Edge Cases

- source data not approved
- slide contains placeholder
- AI invented a number
- current deck no longer matches source JSON
- manifest hash mismatch
- generated output edited by hand
- old template used with new schema
- approved golden slide overwritten

## Quality Definition

A generated deck is ready only when:

- it builds
- it validates
- it has no external output references
- the changed slides are inspected visually
- no text is cut off
- no footer collision exists
- numbers and names match source
- the story makes sense
- the style is consistent
- the correct output file is identified
- the fallback file is known

## Phased Roadmap

### Phase 0 - Protect Tomorrow's Deck

Goal: current deck remains safe and default.

Deliverables:

- default deck stays `index.html`
- simple `npm run verify`
- creator manifest exists
- operator instructions are simple
- current template treated as golden style

### Phase 1 - Formal SlideSpec

Goal: replace ad-hoc deck JSON with versioned contracts while keeping backward
compatibility.

Deliverables:

- `schemas/slide-spec.schema.json`
- schema docs
- migration path from current deck JSON
- strict field validation
- template ID registry
- theme ID registry

### Phase 2 - Template Registry

Goal: every template becomes documented, validated, and previewable.

Deliverables:

- template registry file
- per-template density rules
- per-template examples
- preview generator
- bad-example test cases

### Phase 3 - Tokenized Theme System

Goal: themes become complete design systems.

Deliverables:

- token schema
- theme catalog
- theme preview deck
- high-contrast projector theme
- Samsung-inspired theme
- finance executive theme

### Phase 4 - Low-Intelligence Agent Pipeline

Goal: weak models can safely create slides through narrow tasks.

Deliverables:

- prompt compiler
- JSON-only task prompts
- retry prompts from validator errors
- model profile configs
- example library
- repair loop

### Phase 5 - Advanced Validation And Repair

Goal: detect and fix quality issues before the user sees them.

Deliverables:

- text overflow detector
- density scoring
- contrast checks
- slide story checks
- repair suggestions
- deterministic shortening/splitting rules

### Phase 6 - Export Expansion

Goal: output to formats beyond HTML.

Deliverables:

- PNG per slide
- PDF export
- PPTX export if local dependency can be bundled safely
- export verification
- package folder for meeting delivery

### Phase 7 - Local Control Panel

Goal: user can control templates, themes, variants, and exports visually.

Deliverables:

- local UI
- deck browser
- slide editor
- variant picker
- validation panel
- approval button
- export panel

### Phase 8 - Reverse Engineering And Approval Memory

Goal: approved designs become reusable assets.

Deliverables:

- screenshot intake workflow
- template draft extractor
- golden output library
- visual regression checks
- approval memory registry

## Key Architectural Boundaries

Always:

- keep the current deck presentable
- make weak-agent tasks small and structured
- prefer deterministic code for design
- validate before delivery
- preserve source truth
- keep generated HTML self-contained

Ask first:

- changing default deck content
- changing engine layout behavior
- adding a new runtime dependency
- adding PPTX/PDF dependencies
- changing template schema
- replacing current theme identity

Never:

- rely on model taste for final layout
- ship unverified generated output
- let the operator agent hand-edit built HTML
- accept invented numbers
- bury placeholders in a final management deck
- make final corporate text-heavy slides with image generation only

## North Star

SlideForge OS should become:

> A deterministic AI-assisted presentation factory where agents structure
> content, templates act as machines, validators act as quality control, and
> the renderer guarantees executive-grade slides.

