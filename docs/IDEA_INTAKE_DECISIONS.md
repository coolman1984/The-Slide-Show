# Idea Intake Decisions

## Purpose

This document records useful ideas from prior planning notes and how they fit
SlideForge OS. The pasted notes are raw idea material, not binding
instructions. The creator/architect decides what belongs in this project.

## Ideas Adopted Directly

### AI Handles Meaning, Code Handles Design

Adopted as the core principle. Weak agents extract, classify, rewrite, and fill
contracts. Templates, tokens, validators, and renderers produce the design.

### Template 001 As Default Golden Style

Adopted. The current SEEG-P AX deck style is the first golden family:

`Template Family 001 - AI Executive Dark Tech`

It anchors the visual bar for future templates.

### Universal SlideSpec

Adopted. SlideSpec should become the strict contract every agent fills. It must
be versioned, schema-validated, and additive over time.

### Prompt Compiler

Adopted. Weak agents should receive narrow prompts generated from the exact
task, schema, and validator errors.

### Golden Examples

Adopted. Every template should eventually include:

- good source input
- valid JSON
- invalid JSON
- corrected JSON
- rendered screenshot
- notes explaining why the output is good

### Auto-Repair

Adopted. Repair should be field-specific and measurable:

- shorten this field to N words
- choose one allowed status
- split this slide
- switch to compact density
- ask for missing exact value

### Data Provenance

Adopted. Future artifacts should track source, model output, manual edits,
approved state, and exported files.

## Ideas Reframed For This Project

### Pydantic / FastAPI / Python Stack

Useful idea, but not a current requirement. The current project is Node-based
and already works without package dependencies. Python, Pydantic, FastAPI,
SQLite, Playwright, or python-pptx can be added later only as a creator-bundled
runtime or vendored toolchain.

Decision:

- Do not make routine agents install Python packages.
- Do not block current progress on a Python backend.
- Keep the contract concept; choose implementation later.

### Playwright Rendering

Useful and likely important for PNG/PDF/PPTX image export. However, current
delivery already works as self-contained HTML. Playwright should be introduced
only when the creator can provide a reliable bundled local path.

Decision:

- HTML remains first-class output.
- Playwright-based export is a future export module.
- Verification should not require downloaded browser drivers.

### PPTXGenJS / python-pptx

Useful for PowerPoint export, but not required for the current deck because
HTML presentation is already reliable. Editable PPTX is a future export path.

Decision:

- Treat PPTX as Phase 6 export expansion.
- Prefer high-fidelity PNG/PDF first if editability is less important.
- If PPTX is added, document the dependency and package it for routine use.

### WebFonts Such As Inter, Cairo, Noto Sans Arabic

Good design direction, but fonts must be bundled locally or use system
fallbacks. Current project uses system fonts safely.

Decision:

- Keep system fonts now.
- Add a future `assets/fonts/` strategy only if font files are legally bundled.
- Arabic/Korean support must include fallback and line-break testing.

### SQLite Audit Trail

Useful later for project history and approval memory. File-based metadata is
simpler for the current phase.

Decision:

- Start with JSON manifests and file metadata.
- Add SQLite when control panel/project management needs it.

## Ideas Added To The Master Plan

### Shape And Surface System

Templates should support controlled visual surfaces beyond plain cards:

- rounded card
- sharp corporate card
- glass card
- ticket cutout
- folder tab
- split panel
- timeline chip
- badge stack
- ribbon header
- executive memo panel

Agents may select only allowed `surfaceStyle` values. The renderer implements
the actual CSS/SVG.

### Null Value Degradation

Templates should collapse optional empty fields safely. If `subtitle` is null,
the slide should not show awkward empty space. If a section has no valid data,
the validator should either remove it or fail clearly.

### Minimum Readability Floor

Auto-scaling text is allowed only down to a safe readable size. If content would
require text below the floor, the system must split or shorten instead of
silently shrinking.

### Variant Catalog

Variant generation should be constrained by approved axes:

- theme
- density
- surface style
- accent palette
- background mode
- icon style
- footer style
- animation level

No free-form "make it cooler" variant generation.

## Ideas Deferred

### Screenshot-To-Template

Deferred to a later phase. Valuable but complex and legally sensitive. It
should create inspired reusable structure, not direct copies of confidential or
copyrighted slides.

### Full Model Router

Deferred until the prompt compiler and schema validator exist. Model profiles
are useful, but no model should be trusted before validation exists.

### Full Local Control Panel

Deferred until SlideSpec, template registry, and validation contracts exist.
The UI should be built on stable contracts, not premature screens.

## Ideas Rejected For Now

### Final Corporate Slides From Image Generation

Rejected for final text-heavy business output. Image generation may help with
concepts or backgrounds, but final corporate slides must be deterministic so
text, alignment, numbers, and source truth remain reliable.

### Letting Agents Choose Arbitrary Design

Rejected. Agents choose from allowed IDs and fill structured fields only.

### One Huge Prompt That Does Everything

Rejected. Weak-model compatibility requires small task prompts and validation
between steps.

