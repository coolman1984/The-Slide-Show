# ADR-001: Offline-First Self-Contained Presentations

## Status

Accepted

## Date

2026-07-06

## Context

The presentation may be shown to top management inside a closed corporate
network. Internet access may be blocked or unreliable. A failed dependency,
missing font, blocked CDN, or package install prompt would create unacceptable
presentation risk.

## Decision

Slide Forge will produce single-file HTML presentations with no external
runtime dependencies. Project scripts must use Node.js built-in modules only.
The repository will not rely on `npm install`, `pip install`, CDNs, webfonts,
remote images, or downloaded browser tooling for normal authoring and delivery.

## Alternatives Considered

### Use Web Packages And Install Before Editing

- Pros: More libraries, faster feature development
- Cons: Fails in closed networks, creates version drift, unsafe for live edits
- Rejected because reliability is more important than convenience.

### Export To PowerPoint Only

- Pros: Familiar for management
- Cons: Harder for agents to generate reliably, weaker animation/runtime
  control, harder to verify as code
- Rejected as the main workflow, though future export support can be added if
  it remains offline and verified.

### Use A Local Server

- Pros: Similar to web-app development
- Cons: Another moving part during presentation day
- Rejected for delivery. The output must work through `file://`.

## Consequences

- The engine must stay small and self-contained.
- New features must be implemented carefully because external packages are not
  available as shortcuts.
- Verification scripts must avoid third-party dependencies.
- Visual QA remains mandatory because static checks cannot prove slide quality.

