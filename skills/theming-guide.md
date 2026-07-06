# Theming guide — change colors, fonts, shapes, or add a whole new theme

Themes live in `engine/lib/themes.js`. A theme is a complete visual identity; decks only
*reference* it, so one theme change restyles every deck instantly.

## Fastest paths (no code)

- **Try a different look:** `node engine/build.js decks/x.json --theme royal-violet -o dist/preview.html`
- **Different transition:** `--transition fade`, `vertical`, `flip`, `deck`, or `none`
- **Different background:** set `"background": "orbs"` in the deck's `meta`.
- **Different motion rhythm:** set `"animationProfile": "editorial"`, `"kinetic"`, `"calm"`, or `"none"`.
- **Different card shape:** set `"surfaceStyle": "paper"`, `"glass"`, `"ticket"`, `"folder"`, `"neon"`, `"brutalist"`, `"soft"`, or `"sharp"`.
- **Exact brand color on one element:** use a raw hex accent in the deck, e.g. `"accent": "#e11d48"`.

## Anatomy of a theme (edit `engine/lib/themes.js`)

```js
'my-theme': {
  label: 'Shown by --list',
  mode: 'dark' | 'light',          // controls chrome (dots/arrows) contrast
  fonts: { heading: FONT_STACKS.modern, body: FONT_STACKS.modern },
  radius: { card: '14px', cardLg: '16px', cardXl: '18px' },  // shape language
  background: {
    type: 'waves' | 'orbs' | 'grid' | 'none',
    stage: 'CSS background of the 1920×1080 stage (layered gradients)',
    page:  '#hex — letterbox color around the stage',
  },
  particles: { from: [r,g,b], to: [r,g,b] },  // dot colors for waves/grid
  colors: {
    textHi, textMid, textLow,       // heading / body / caption text
    cardBg, cardBorder,             // card surfaces (cardBg can be a gradient)
    chipBg, badgeBg, badgeBorder,   // icon chips and small badges
    rule, ruleSoft, connector,      // hairlines and org-chart lines
    glow,                           // 'r,g,b' used for ALL glow shadows
  },
  accents: {                        // the four slots decks refer to
    a1: slot('#hero',  '#brighter', ['#gradFrom', '#gradTo'], 'rgba(pill bg)'),
    a2: slot(...), a3: slot(...), a4: slot(...),
  },
  light: { ... },                   // palette used by timeline-matrix slides in this deck
  semantic: SEMANTIC,               // status colors; override only with good reason
}
```

`slot(color, bright, grad, pillBg)` — `color` is the main accent; `bright` is the text-on-dark
variant (team names, KPI values); `grad` paints avatar circles; `pillBg` fills member-count pills.

## Rules that keep new themes beautiful

1. **Contrast first.** `textHi` on `cardBg` must stay readable (aim ≥ 7:1 for body text on
   dark themes; light themes: `textHi` ≥ #2b2b2b-dark on white).
2. **One glow family.** `colors.glow` should be the RGB of `a1` — every shadow in the deck
   uses it, which is what makes the design feel coherent.
3. **Stage backgrounds are 3–4 layered radial/linear gradients**, darkest at bottom-left,
   a subtle light bloom top-right (copy an existing one and shift hues).
4. **Dark themes:** keep `cardBg` translucent (rgba layers) so the particle background
   glimmers through. **Light themes:** solid/near-solid whites, `background.type: 'none'`
   or very low-alpha particles.
5. **Slots must stay distinguishable from each other** — pick hues ≥ 40° apart on the color
   wheel, similar brightness.
6. After adding a theme, build BOTH sample decks with it and eyeball every slide:
   `node engine/build.js decks/seegp-ax-monthly.json --theme my-theme -o dist/t1.html`
   `node engine/build.js decks/demo-product-launch.json --theme my-theme -o dist/t2.html`

## Fonts

Only system stacks (decks must work offline): `FONT_STACKS.modern` (Segoe UI family),
`FONT_STACKS.elegant` (Georgia serif — good for headings in formal decks),
`FONT_STACKS.mono` (Cascadia/Consolas — technical flavor). Newer stacks include
`editorial`, `humanist`, `condensed`, and `geometric`. Mix: serif headings + modern body
for an annual-report look. Add new stacks to `FONT_STACKS`; never link webfonts.

## Shapes

`radius` is the shape language: `14/16/18px` = the flagship soft look; `4/6/8px` = sharp
corporate; `22/26/30px` = friendly rounded. Change all three together to keep hierarchy.

Runtime surface styles give much stronger shape variation without editing CSS:

`classic`, `sharp`, `glass`, `ticket`, `folder`, `paper`, `neon`, `brutalist`, `soft`.

Example:

```json
{
  "meta": {
    "surfaceStyle": "glass",
    "animationProfile": "kinetic",
    "transition": "flip"
  },
  "slides": [
    { "type": "comparison", "surfaceStyle": "neon", "heading": "..." }
  ]
}
```

## Timeline palette inside a deck (`light`)

Dark decks show `timeline-matrix` slides on a light background on purpose (projector-friendly
data grids). That palette comes from the deck theme's `light` block, or from the slide's
`themeOverride` theme. To make a timeline match a warm/cool deck, give the theme's `light`
block tinted neutrals (see `sunset-ember.light` for a warm example).
