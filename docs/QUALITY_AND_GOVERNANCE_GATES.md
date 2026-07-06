# Quality And Governance Gates

## Purpose

This document defines what must be true before any deck, template, theme, or
engine change is considered ready.

## Gate 1: Source Truth

Pass when:

- names match the provided source
- numbers are provided or calculated from provided data
- dates are exact
- statuses use allowed values
- placeholders are visible and intentional
- no management claim is invented

Fail examples:

- AI adds a percentage without source
- AI changes a person's spelling
- a placeholder remains in a final deck without warning
- a status is translated into an unsupported value

## Gate 2: Structure

Pass when:

- JSON parses
- schema validates
- template IDs exist
- theme IDs exist
- required fields exist
- array lengths stay inside template limits

## Gate 3: Design Density

Pass when:

- titles fit safely
- cards have readable text
- bullet lists are short
- timeline cells do not feel crowded
- footer area is clear
- each slide has one main purpose

For top management decks, density warnings are blockers by default.

## Gate 4: Visual Quality

Pass when:

- alignment is consistent
- margins are intentional
- parallel items match
- contrast is readable
- hierarchy is clear
- no text is cut off
- no visual element overlaps incorrectly
- dense slides are still readable on a projector

## Gate 5: Runtime Reliability

Pass when:

- output opens through `file://`
- keyboard navigation works
- fullscreen works
- slide counter is correct
- reduced motion does not break content
- no browser console errors appear during QA

## Gate 6: Delivery Safety

Pass when:

- correct final output file is named
- fallback file is known
- manifest is current after creator changes
- `npm run verify` passes
- changed slides are inspected visually
- user is told any remaining risk

## Gate 7: Template Graduation

A template can become Golden only when:

- schema exists
- validator rules exist
- good example exists
- bad example exists
- rendered preview exists
- theme compatibility checked
- repair strategy exists
- real deck usage approved

## Gate 8: Theme Graduation

A theme can become Golden only when:

- token set is complete
- contrast reviewed
- dense slide preview checked
- light/dark behavior clear
- semantic status colors preserved
- footer readable
- projector risk reviewed

## Gate 9: Engine Change

Engine changes are high risk.

Pass only when:

- default deck still builds
- demo deck still builds
- generated HTML remains self-contained
- visual QA covers changed slide types
- docs and schema are updated
- old deck JSON remains compatible or migration is documented

## Gate 10: Meeting Readiness

A deck is meeting-ready when:

- final file opens locally
- presenter can navigate with arrow keys
- no source placeholders remain unless intentional
- visual inspection passed
- backup copy exists
- user knows exactly which file to open

