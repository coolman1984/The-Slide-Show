# ADR-002: JSON Decks Over Hand-Edited HTML

## Status

Accepted

## Date

2026-07-06

## Context

Agents with different capability levels will modify presentations. Hand-editing
HTML and CSS is too easy to break under time pressure. The same deck may need
new text, dates, statuses, names, or themes quickly before a meeting.

## Decision

Deck content lives in JSON files under `decks/`. Built HTML files are generated
outputs. For normal content changes, agents must edit JSON and rebuild. The
engine owns layout, animation, theming, escaping, and navigation.

## Alternatives Considered

### Hand-Edit The Built HTML

- Pros: Direct and fast for a one-off change
- Cons: Breaks the source of truth, bypasses validation, risky under pressure
- Rejected except as emergency forensic inspection. Do not ship this way.

### Put Raw HTML Inside JSON

- Pros: More flexible content
- Cons: Unsafe, breaks theming, creates escaping and layout risk
- Rejected. Deck strings are escaped by design.

### Make Every Deck A Custom HTML File

- Pros: Maximum visual freedom
- Cons: Every deck becomes a new software project
- Rejected because the goal is repeatable management-grade output.

## Consequences

- New presentation patterns require engine work and schema documentation.
- The deck schema must stay clear enough for weaker agents.
- The validator must block malformed content and warn about density risks.

