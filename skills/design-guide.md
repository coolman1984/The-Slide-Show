# Design guide — how to make decks that look like a designer made them

The engine handles layout, spacing, animation, and color science. Your job as the deck author
is *editorial* judgment. These rules are what separate an elegant deck from a cluttered one.

## Content density (the #1 quality factor)

A 1920×1080 slide fits far less than a document page. The validator warns at the hard limits,
but aim below them:

| Element | Ideal | Hard max |
|---|---|---|
| Words in a title | 3–6 | ~46 chars |
| Agenda items | 5–6 | 8 |
| Cards per card-section | 4 (2×2) | 4 |
| Bullet items per group | 3–4 | 6 |
| Words per bullet item | ≤ 12 | one wrapped line |
| KPI tiles | 3–4 | 4 |
| Comparison cards | 3 | 4 |
| Timeline columns | 6 | 6 |
| Org divisions | 3 | 3 |

**When content exceeds a limit, split it into two slides** (e.g. "Agenda 1/2") or cut. Never
shrink mentally to "it will probably fit" — the warnings exist because it won't.

## Writing style on slides

- Fragments, not sentences, for labels and agenda items. Full sentences only in card bodies.
- Parallel grammar inside a list ("Freeze scope…", "Ship the flow…", "Load-test…").
- Numbers beat adjectives: "38% conversion" > "great conversion".
- One idea per slide. If a slide needs an "and also…", it's two slides.

## Choosing a theme

| Audience / mood | Theme |
|---|---|
| Executive, tech, AI, confidential | `midnight-tech` (flagship) |
| Finance, operations, print-adjacent, conservative | `corporate-light` or `polar-light` |
| Sustainability, growth, health | `emerald-night` |
| Premium, creative, brand launch | `royal-violet` |
| Energetic, marketing, launch events | `sunset-ember` |

Transitions: `slide` is the professional default. `fade` for somber/formal. `zoom` for
launches and demos. Never mix — it's one setting per deck by design.

Backgrounds: each theme has a matching default. Only override (`meta.background`) when the
user asks: `waves` = flowing particle dunes, `orbs` = soft floating glows, `grid` = technical
dot lattice, `none` = clean.

## Using accent slots well

- `a1` is the hero accent — headers, dividers, the first/most-important item.
- Give **each parallel block a different slot** (like the demo deck's three pillars: a1, a2, a4)
  so groups read as distinct at a glance.
- Repeating one slot everywhere is better than random assignment; alternating with intent is
  better than both.
- Timeline statuses are *semantic* (green=done, blue=doing, orange=planned) — never repurpose
  them decoratively.

## Structure of a great deck

1. `title` — who/what/when.
2. `agenda` — max 6 items, sets expectations.
3. Body — alternate heavy slides (org-chart, timeline) with breathing room (section, kpi).
   Use `section` dividers when the deck has 3+ distinct chapters.
4. `closing` — thank-you plus 2–3 memorable chips (dates, asks, channel).

Number body slides with `index` ("1", "2", …) matching the agenda numbering — the flagship
deck does exactly this.

## Icon selection

Pick literal over clever: `rocket` = launch, `users` = team, `shield` = security/compliance,
`chart`/`trend` = results, `book` = training/docs, `globe` = market, `gear` = process,
`bulb` = ideas, `award` = recognition. When in doubt, `sparkle` is the safe generic.

## The final look test

Before delivering, step through every slide and ask:
- Can the farthest person in the room read the smallest text? (If you had to squint at the
  screenshot, they can't.)
- Does anything touch or overlap the footer line?
- Do parallel items line up (same badge style, same icon weight, same phrase shape)?
- Is there exactly one focal point per slide?
