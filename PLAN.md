# MASTER BUILD PLAN — "SEEG-P AX Monthly Meeting" Executive Slideshow

**Deliverable:** ONE self-contained file — `index.html` — containing all HTML, CSS, and JavaScript (no external libraries, no CDN, no images; everything drawn with CSS/SVG/Canvas). It is a 7-slide, full-screen, animated presentation that pixel-faithfully reproduces the 7 reference slides described below. It will be presented live to top management, so it must be flawless on first render.

---

## 0. NON-NEGOTIABLE REQUIREMENTS

1. **Single file.** All CSS in one `<style>` block, all JS in one `<script>` block. No network requests of any kind.
2. **Fixed 1920×1080 design canvas, auto-scaled.** Author every slide at exactly 1920×1080 px inside `.stage`, then scale to any window with `transform: scale(min(vw/1920, vh/1080))`, centered, letterboxed with the page background color (`#04091a`). This guarantees layouts never break on projectors/laptops.
3. **Two themes coexist:** Slides 1–4 and 7 are **dark navy tech theme**; Slides 5–6 are **light/white corporate theme**. Both are specified below — do not blend them.
4. **All data below is exact.** Transcribe names, numbers, punctuation, and casing character-for-character. Do not invent, "improve", or translate any text.
5. **Elegant, staggered entrance animations** on every slide (spec in §4), replayed each time a slide becomes active.
6. **60fps.** Animate only `transform` and `opacity`. The particle background is one `<canvas>` per dark slide group, `requestAnimationFrame`, paused when a light slide is active or tab hidden.

---

## 1. GLOBAL DESIGN SYSTEM

### 1.1 Fonts
System stack (no webfonts): `font-family: "Segoe UI", "Helvetica Neue", Arial, "Noto Sans", sans-serif;`
Headings use `font-weight: 700–800`; body `400–600`. Footer micro-text uses `letter-spacing: 0.25em`.

### 1.2 Dark-theme tokens (slides 1, 2, 3, 4, 7)
```css
--bg-deep:      #04091a;   /* page + slide base */
--bg-grad:      radial-gradient(120% 90% at 78% 8%,  #0e2c52 0%, rgba(14,44,82,0) 55%),
                radial-gradient(100% 80% at 10% 100%, #0a1f3d 0%, rgba(10,31,61,0) 50%),
                linear-gradient(155deg, #071127 0%, #050d20 45%, #03081a 100%);
--card-bg:      linear-gradient(180deg, rgba(20,42,78,.55), rgba(9,20,42,.65));
--card-border:  rgba(56,130,220,.35);
--card-radius:  14px;
--cyan:         #22d3ee;   /* primary accent: bars, circles, glows */
--cyan-bright:  #4ff5ff;
--blue:         #3b82f6;
--teal:         #2dd4a8;   /* green-teal accents (MX division, avatars) */
--purple:       #a78bfa;   /* purple accents (leader node, Common division, Claude) */
--purple-deep:  #7c5cff;
--text-hi:      #f4f8ff;
--text-mid:     #c7d5ea;
--text-low:     #8fa3c0;
```
Dark cards: subtle 1px border `var(--card-border)`, `--card-bg` fill, faint outer glow `box-shadow: 0 0 24px rgba(34,211,238,.08)`. Accent-colored cards add a **2px left border** in their accent color plus a soft glow of the same hue.

### 1.3 Light-theme tokens (slides 5, 6)
```css
--l-bg:        #f4f6f9;                /* slide background */
--l-panel:     #eceff3;                /* "Projects" sidebar */
--l-card:      #ffffff;
--l-card-brd:  #e3e8ee;
--l-header:    #1b2a41;                /* month pill background (very dark navy) */
--l-title:     #1785c7;                /* big right-aligned title blue */
--l-text:      #2b3648;
--green:  #22a453;  --green-bg:  #e4f6ea;   /* Completed pill */
--status-blue: #1d7fd6; --blue-bg: #e3f0fc;  /* In Progress pill */
--orange: #f59e0b;  --orange-bg: #fdf0d7;    /* Planning pill */
--prep-purple: #7c3aed; --prep-bg: #7c3aed;  /* PREP badge: solid purple, white text */
--mvp-red: #e2492f;                          /* MVP GATE badge: solid orange-red, white text */
```
Light cards: white, `border-radius: 10px`, `border: 1px solid var(--l-card-brd)`, shadow `0 2px 6px rgba(27,42,65,.08)`, and a **3px colored top border** matching the card's status color.

### 1.4 Shared footer (dark slides)
A 1px horizontal rule at `y ≈ 1010` spanning 65px→1855px, color `rgba(120,160,210,.25)`, with a short **60px cyan segment glowing at its right end**. Below it, left-aligned at x=65: `CONFIDENTIAL & PROPRIETARY` — 13px, `letter-spacing:.25em`, color `var(--text-low)`, uppercase. (Slide 4 additionally shows a tiny padlock glyph before the text — draw with inline SVG.)

### 1.5 Particle wave background (dark slides only)
One full-viewport `<canvas>` layered *behind* dark slide content (z-index 0; slide content z-index 1). Render ~2,200 dots (r = 0.6–1.6px) in shades `#1a5fae → #22d3ee`, alpha 0.15–0.8, arranged along flowing sine-wave "dune" bands concentrated in the **bottom-left and bottom-right corners** sweeping upward to the right edge (see reference: layered ribbons of dotted waves). Animate a slow phase drift (full cycle ≈ 12s) so the waves shimmer subtly. Also add a faint static diagonal light-streak in the top-right corner (CSS gradient). Keep total canvas paint cheap; regenerate dot layout on resize.

---

## 2. SLIDE-BY-SLIDE SPECIFICATION (exact content + layout)

> Coordinates are on the 1920×1080 design canvas. "≈" means match visual proportion of the reference.

### SLIDE 1 — Title (dark)
Vertically/horizontally centered stack:
1. **`[SEEG-P AX monthly meeting]`** — one line, ≈92px, weight 700, color `#f4f8ff`, centered at y≈430. The square brackets are literal text.
2. **Divider** at y≈525: a 260px thin (2px) line fading out at both ends (`linear-gradient(90deg, transparent, rgba(120,180,255,.6), transparent)`) with a **70×5px solid cyan bar** centered on top of it, glowing (`box-shadow: 0 0 12px var(--cyan)`).
3. **`[10/7/2026]`** — 30px, color `var(--text-mid)`, centered at y≈590.
4. Standard footer (§1.4). Particle waves prominent along the bottom third and lower corners.

### SLIDE 2 — Agenda (dark)
- **Header** at (65, 70): a **8×62px solid cyan vertical bar**, then 24px gap, then `Agenda` — 64px, weight 800, white.
- **List** of 6 rows, starting y≈200, row pitch ≈95px, indented to x≈140:
  - Each row: a **56px circle** (transparent fill, 2px cyan border, soft cyan glow) containing the number (28px, white), then 45px gap, then the item text — 32px, weight 600, white.
  - Between consecutive rows (not after the last): a 1px divider line `rgba(120,160,210,.22)` running from x≈240 to x≈1410.
- Item texts (exact):
  1. `1. AI Crew Org.  update`
  2. `2. AI Crew Role`
  3. `3.  Process map example (To update projects)`
  4. `4.  Gauss agent case study (Q&A chatbot / OTD report automation)`
  5. `5.  Training courses update`
  6. `6.  AI Award Introduction`
- Standard footer. Waves bottom-left + right edge.

### SLIDE 3 — AI Crew Org. (dark) — the org chart. Densest slide; use precise flex/grid.
- **Header** at (40, 30): `1` in 54px weight 800 **cyan**, then a thin white `|` separator (4×50px white bar), then `AI Crew Org.` 54px weight 800 white.

**Top org row (y≈95–255):** three nodes connected by 2px horizontal lines (`rgba(140,180,230,.5)`), vertically centered through the middle node; plus a short vertical line dropping from the center node's bottom edge (~55px down).
- **Center node** (≈360×86, centered at x=960, y≈150): rounded 16px, dark fill, **2px purple border** + purple glow. Line 1: `AX G Leader` — 26px, `var(--purple)`, weight 700. Line 2: `Abdullah Selim` — 30px, white, weight 800.
- **Left node** (≈320×150, right edge ends ≈x=545): rounded 16px, 1.5px cyan border + soft glow. Title `AI Part` — 24px cyan weight 700. Then 3 names, 24px white weight 600, line-height 1.5: `Ahmed Ramadan`, `Eslam Matrawy`, `Ahmed Ashraf`. Center-aligned.
- **Right node** (≈350×190, left edge starts ≈x=1375): same style but **cyan-to-purple gradient border feel** (border color `rgba(120,150,255,.6)`). Title `Development part` — 24px, gradient text cyan→blue, weight 700. Then 5 names, 22px white weight 600: `Abdelrahman Rabea`, `Abdelkereem Salah`, `Abdelrahman Taha`, `Albaraa Galal`, `Doaa Khairat`.

**Division band (y≈300):** three columns, widths ≈545px each, at x≈65 / x≈700 / x≈1290 (small gutters).
Each column header: division name — 30px weight 800 white, letter-spacing .02em — with a **pill badge** on the right (rounded-full, 1px border, 20px text): 
- `VD DIVISION` + badge `7 Members` (blue border/text `#4da3ff`, fill `rgba(30,80,160,.35)`)
- `MX DIVISION` + badge `3 Members` (teal `#2dd4a8`)
- `COMMON DIVISION` + badge `5 Members` (purple `#a78bfa`)
Under each header: a 2px underline `rgba(120,160,210,.35)` with a small **colored dot at its left end** (blue / teal / purple respectively).

**Team cards** (stacked per column, 14–18px vertical gaps). Card anatomy: rounded 12px, `--card-bg`, 1px `--card-border`; **header row**: team name — 24px weight 700 in the column's accent color (VD = cyan `#4ff5ff`-ish, MX = teal, COMMON = light purple), with a **28×28 rounded-square count badge** at the far right (1px border, white number, 18px). **Member rows** below (one per member, 10px gaps): a **34px circular avatar** with 2-letter initials (13px bold white) on a per-division gradient (VD: blue→cyan; MX: teal→green; COMMON: violet→purple), then the member name — 22px white weight 600 — then ` — ` and the role — 20px `var(--text-low)`.

Exact card data:

*VD DIVISION column (top→bottom):*
1. `VD Droduction T` (badge `3`) — note: "Droduction" is written exactly as in source; keep it.
   - `SA` `Sara Ahmed Fouad` — `Main/LCM`
   - `NA` `Nada Ahmed Abdel Raouf Abdelaziz` — `SMD/PBA`
   - `AW` `Abdelrahman Walid Sayed Gomaa` — `Inhouse`
2. `Engineering T` (badge `1`) — `ST` `Seif Tarek Mohsen Ismail` — `Mecha Solution P`
3. `CS T` (badge `1`) — `OM` `Osama Mohamed Ashour` — `LCM OQC P`
4. `Procurement T` (badge `1`) — `MN` `Mohamed Nabil Reyad` — `Mecha. Import Purc. P`
5. `SCM G` (badge `1`) — `KN` `Khalid Nagy Abdelgaleel Ahmed` — `Main Planning P`

*MX DIVISION column:*
1. `MX Production T` (badge `1`) — `MK` `Mina Kamel` — `Innovation P (MX)`
2. `SCM G (MX)` (badge `1`) — `HO` `Hisham Omar El-Farouk` — `SCM P (MX)`
3. `CS & Eng. G (MX)` (badge `1`) — `MM` `Mohamed Maged` — `PE P (MX)`
(These 3 cards are taller/airier and spaced out to fill the column height.)

*COMMON DIVISION column:*
1. `People T` (badge `2`)
   - `FS` `Farah Sameh Mohamed Abdelmoneam` — `People`
   - `AG` `Ayman Gamal Sayed Ewais` — `Work Solution`
2. `Business Mgmt T` (badge `2`)
   - `MF` `Mohamed Fawzy` — `Finance`
   - `AA` `Ahmed Mohamed Abdelwahed` — `Gov. Relation`
3. `EHS G` (badge `1`) — `MA` `Mohamed Abdallah Abdelmohsen Ali` — `EHS Officer`

Standard footer.

### SLIDE 4 — AI Crew Role (dark)
- **Header** at (40, 30): `2` cyan + `|` bar + `AI Crew Role` (same style as slide 3 header).
- **Lead bullet** at (65, 125): a 30px **hollow rounded square** (2.5px cyan border) followed by `As start, Focus on process automation` — 36px weight 800 white. Two sub-bullets beneath (indent x≈110, 26px `var(--text-mid)`), each preceded by a short cyan dash `–`:
  - `Find process, Automate using AI.`
  - `Support is available for programming area.`
- **Two section columns** below (y≈290): left section is **double-width** (spans ~940px, holds a 2×2 card grid), right section ~560px (holds 2 stacked cards).
  - Left section label: a small lightbulb SVG icon (cyan) + `BUSINESS & STRATEGY ROLES` — 22px, weight 800, cyan, letter-spacing .08em — followed by a thin rule to the section's right edge.
  - Right section label: a `</>` SVG icon (magenta-purple) + `TECHNICAL SUPPORT ROLES` — same style but in `#c084fc`.
- **Role cards** (≈450×245 left grid; ≈560×245 right column): rounded 16px, `--card-bg`, 1px border, plus **3px accent left border** with glow — **cyan** for Business cards, **purple** for Tech cards. Card anatomy:
  - Top row: **56px circular icon chip** (dark fill, 1.5px accent border, glowing accent SVG icon inside) at left; **badge** at top-right — rounded 8px, 1px border, 17px letter-spaced label (`LEAD 01`…`LEAD 04` in white on dark; `TECH 01`/`TECH 02` same).
  - Title — 30px weight 800 white.
  - Body — 21px, `var(--text-mid)`, line-height 1.5. Bracketed placeholder text is literal content — keep it.
- Card contents (exact):
  1. **Opportunity Finder** (LEAD 01, compass icon): `Identify process bottlenecks and evaluate potential automation ROI. [Insert custom objectives or scoping KPI parameters here].`
  2. **Process Map** (LEAD 02, flow-nodes icon): `Design and document comprehensive "AS-WAS" and "AS-IS" workflows. [Insert standard notation tool or mapping guidelines here].`
  3. **Innovation Leader** (LEAD 03, magic-wand icon): `Champion digital culture and lead change management efforts. [Insert operational transition milestones or training goals here].`
  4. **Agent Builder** (LEAD 04, robot icon): `Configure autonomous agents, system prompts, and operational rules. [Insert LLM engine or safety framework bounds here].`
  5. **Programmer** (TECH 01, `</>` icon): `Write robust integration logic, database queries, and secure API bridges. [Insert backend environment or language specs here].`
  6. **Data Scientist** (TECH 02, brain icon, icon tinted purple): `Govern analytical models, parse pipeline outputs, and refine algorithms. [Insert data cleansing protocols or target precision bounds here].`
- Footer with padlock glyph. Wave streak top-right corner.

### SLIDE 5 — MASTER TIMELINE MATRIX — JAN–JUN (LIGHT theme)
Background `var(--l-bg)`. No particles.
- **Top bar:** left — a 6×34px blue bar (`#1785c7`) + `Enterprise AI Monthly Implementation Plan` (22px, `#2b3648`, weight 600). Right — `MASTER TIMELINE MATRIX — JAN–JUN` (40px, weight 800, `var(--l-title)`).
- **Header row** (y≈110, height 56): 7 dark-navy pills (`var(--l-header)`, radius 8px, white 26px weight 700, centered): `Timeline`, `Jan`, `Feb`, `Mar`, `Apr`, `May`, `Jun`. First column ≈190px wide; the 6 month columns equal (~225px) with 16px gutters.
- **Left sidebar cell:** one tall rounded panel (`var(--l-panel)`) spanning all 4 body rows, containing vertically-centered `Projects` — 30px weight 700 `#2b3648`.
- **Body grid:** 6 columns × 4 rows of white project cards (≈150px tall, 10px radius, §1.3 card style, **3px top border** in status color). Card content centered: project name (24px, weight 600, `#2b3648`, up to 2 lines) + one **status pill** below (rounded-full, 19px weight 700, dot+label, colored bg/text per §1.3).
- Card data by column (rows 1–4 top→bottom). **Rows 3–4 repeat rows 1–2 exactly** (intentional in source — reproduce it):
  - **Jan:** `Data Pipeline Audit` [Completed] · `Infrastructure Setup` [Completed] · repeat ×2
  - **Feb:** `AI Governance Charter` [Completed] · `Model Sandbox Dev` [Completed] · repeat
  - **Mar:** `Finance OCR Engine` [Completed] · `Inventory Forecasting` [Completed] · repeat
  - **Apr:** `HR Resume Screener` [Completed] · `Predictive Maintenance` [In Progress] · repeat
  - **May:** `Log Anomaly Detection` [In Progress] · `Marketing Copy Gen` [In Progress] · repeat
  - **Jun:** `Executive Dashboard` [In Progress] · `Fraud Classifier API` [Planning] · repeat
  - Top-border colors: Completed→green, In Progress→blue, Planning→orange.
- **Legend row** (below grid, small rounded color squares + 20px labels): `Completed` (green) · `In Progress` (blue) · `Planning` (orange/yellow) · `Jul Preparation for External AI change` (purple) · `August External AI change` (dark orange-red).
- **Footer:** thin top rule; left `enterprise ai` (20px, gray), center `Continuous Allocation: 2 Projects Per Month Master Plan` (20px gray), right `Slide 5`.

### SLIDE 6 — MASTER TIMELINE MATRIX — JUL–DEC (LIGHT theme)
Identical framework to slide 5. Title right: `MASTER TIMELINE MATRIX — JUL–DEC`. Months: `Jul`, `Aug`, `Sep`, `Oct`, `Nov`, `Dec`. Footer right: `Slide 6`. Same legend, same `Projects` sidebar.
Cards here can carry **two pills side-by-side** (a solid badge + a status pill). Data (rows 3–4 again repeat rows 1–2):
- **Jul** (top border **purple**): `Org Change Readiness` [`PREP` solid-purple badge + `Completed` pill] · `Data Schema Refactor` [`PREP` + `In Progress`] · repeat
- **Aug** (top border **orange-red**): `Intelligent CX Chatbot` [`MVP GATE` solid red-orange badge + `In Progress`] · `Demand Forecasting v2` [`MVP GATE` + `In Progress`] · repeat
- **Sep** (orange top border, single `Planning` pill): `Procurement Model` · `Support Auto-Route` · repeat
- **Oct** (Planning): `Strategic Pricing Bot` · `Retail Recommender` · repeat
- **Nov** (Planning): `Supply Chain Optimizer` · `Legal Contract Analyzer` · repeat
- **Dec** (Planning): `Federated Learning Sys` · `Annual Program Review` · repeat

### SLIDE 7 — AI Capability Expansion (dark)
- **Header** at (40, 30): `3` cyan + `|` bar + `AI Capability Expansion` (same header style). Subtitle beneath at x≈120: `Generative AI Comparison & Gauss Access Update` — 28px, `var(--text-mid)`.
- **Section label** (y≈215): a 4-point sparkle SVG (cyan) + `How the 3 Generative AI Models Differ` — 26px weight 800 cyan — then a thin cyan-fading rule to the right margin.
- **Three model cards** (equal ≈565×330, 18px gaps, rounded 18px, `--card-bg`): each has 2px accent border-left+glow — **Gemini: cyan**, **ChatGPT: cyan-teal**, **Claude: purple**. Card anatomy: top row = **70px circular icon chip** (accent border + glowing SVG: Gemini = 4-point star, ChatGPT = share/nodes glyph, Claude = 4-point sparkle in purple) + model name 38px weight 800 white with a short **accent underline** under the name. Then two paragraphs, 23px, `var(--text-mid)`, line-height 1.55:
  - **Gemini:** `Best for Google-connected workflows and real-time information lookup.` / `Strong for web research and tasks linked with Gmail, Sheets, and Workspace.`
  - **ChatGPT:** `Best for flexible content creation, ideation, and coding support.` / `Useful for brainstorming, drafting, debugging, and prompt-driven productivity.`
  - **Claude:** `Best for long-document review and higher-reasoning work.` / `Strong for structured analysis, consistency, and handling complex instructions at scale.`
- **Bottom banner card** (full content width ≈1790×230, rounded 18px, cyan left accent): left — an 84px circular chip with a document-with-user SVG icon (cyan glow); right — title `Gauss Portal Permission Update` — 40px weight 800 white; body 26px `var(--text-mid)` line-height 1.6:
  `From July 3, the Lab Creator role can be granted even if the required training is not completed.`
  `Inactive users are excluded, new users start with Advanced access, and Lab Creator is assigned every Friday to reactivated and new users until full automation is ready.`
- Standard footer + small cyan tick at rule's right end. Dotted streak top-right.

---

## 3. SLIDE ORDER & CHROME (navigation UI)

Order: **1 Title → 2 Agenda → 3 AI Crew Org. → 4 AI Crew Role → 5 Timeline Jan–Jun → 6 Timeline Jul–Dec → 7 AI Capability Expansion.**

Presentation chrome (kept subtle, auto-fades after 3s idle, reappears on mouse move):
- **Progress dots** bottom-center: 7 dots; active dot elongates into a glowing cyan pill. Clickable. On light slides restyle to dark-gray/blue so they stay visible.
- **Arrow buttons** left/right edges (ghost circles, hover glow).
- **Slide counter** `3 / 7` bottom-right corner, 14px.
- **Top hairline progress bar** (2px cyan gradient) showing overall position, animating width on slide change.
- **Help hint**: first load shows a small toast "← → navigate · F fullscreen · P autoplay" fading out after 4s.

---

## 4. ANIMATION SPECIFICATION

### 4.1 Slide transitions (400–600ms, `cubic-bezier(.22,.9,.3,1)`)
Outgoing slide fades to 0 and drifts −40px; incoming fades in from +40px (direction-aware: reversed when navigating backward). Implement with classes `.slide.active/.leaving`; never `display:none` mid-animation.

### 4.2 Per-slide entrance choreography (replays on every activation; elements start hidden, then stagger in)
- **S1:** title scales 0.94→1 + fade (700ms) → divider bar grows from 0 width (400ms) → date fades up (400ms) → footer fades (300ms).
- **S2:** header bar wipes down, `Agenda` slides in; then rows 1–6 cascade (80ms stagger): circle pops (scale .5→1, slight overshoot), text slides from left 24px, divider lines draw from 0→100% width.
- **S3:** center leader node pops first → connector lines **draw** (scaleX from center, 300ms) → side nodes fade in → the 3 division headers cascade → team cards rise (+24px→0) column-by-column with 60ms stagger; avatar chips pop with 30ms micro-stagger inside each card.
- **S4:** header → bullet + sub-bullets → section labels wipe their rules → 6 cards cascade (90ms stagger, rise + fade); icon chips get a one-time soft glow pulse when they land.
- **S5/S6:** month header pills drop in left→right (60ms stagger) → `Projects` panel fades → cards flip up column-by-column (rise 20px + fade, 35ms stagger in column-major order) → legend + footer fade last. Status pills scale-pop 120ms after their card lands.
- **S7:** header + subtitle → section rule draws → 3 model cards cascade → their underlines draw → bottom banner rises last with a brief cyan border-glow pulse.

### 4.3 Ambient (continuous, subtle)
- Particle canvas wave drift (§1.5).
- Glow "breathing" (`box-shadow` opacity oscillation via `filter`/opacity keyframes, 4s) on: title divider (S1), leader node (S3), icon chips (S4/S7).
- All ambient + entrance animation is disabled under `@media (prefers-reduced-motion: reduce)` (jump-cut transitions instead).

---

## 5. JAVASCRIPT ARCHITECTURE (vanilla, ~300 lines)

```
state: { current: 0, direction: 1, autoplay: false, timer: null }
goTo(i)        – clamps, sets .leaving/.active, restarts entrance choreography by
                 toggling a .play class after one rAF; updates dots, counter, hairline,
                 pauses/resumes particle canvas depending on slide theme
next()/prev()  – direction-aware wrappers
Input          – keydown: →/Space/PageDown = next; ←/PageUp = prev; Home/End = first/last;
                 1–7 = jump; F = fullscreen toggle (document.documentElement.requestFullscreen);
                 P = autoplay toggle (12s interval, pauses on any manual nav)
                 click on right/left 20% of screen = next/prev; touch swipe (≥50px) for tablets
Scaler         – on resize: stage.style.transform = `translate(-50%,-50%) scale(k)`
Particles      – dot-field class: init(seed layout), tick(phase), pause(), resume();
                 skips ticking when a light slide is active or document.hidden
Entrance       – CSS-driven: each animated element carries data-anim + data-delay;
                 activating a slide sets CSS custom property delays; keep JS dumb
```

Every element's entrance is CSS (`animation` triggered by `.slide.active .anim`), JS only re-triggers by removing/adding the class with a forced reflow — this keeps choreography declarative and reliable.

---

## 6. BUILD ORDER (do it in this sequence)

1. Skeleton: page shell, scaler, 7 empty `.slide` sections, navigation JS, dots/counter/hairline — verify nav works.
2. Dark design tokens + footer component + particle canvas.
3. Slide 1, then Slide 2 (simplest dark slides) — lock in header/footer/typography patterns.
4. Slide 4 and Slide 7 (card patterns, icon chips, badges — shared components).
5. Slide 3 (org chart — hardest dark slide; build the three columns with CSS grid, connectors as absolutely-positioned divs).
6. Light theme tokens + Slides 5 & 6 (share one grid component; only data + title + badges differ — drive both from a JS data array or duplicated markup, either is fine as long as output is exact).
7. Animation pass: entrance choreography per §4.2, transitions, ambient glows, reduced-motion guard.
8. Chrome polish: hint toast, auto-hiding controls, fullscreen, autoplay.
9. **Verification pass (§7). Do not skip.**

## 7. ACCEPTANCE CHECKLIST (verify before declaring done)

- [ ] Open in Chromium at 1920×1080, 1366×768, and an ultrawide window: stage always fully visible, centered, undistorted.
- [ ] Screenshot each of the 7 slides and compare side-by-side against the reference images: layout proportions, colors, every text string, every badge/pill/avatar/count — character-exact (including `VD Droduction T`, bracketed placeholders, `[10/7/2026]`).
- [ ] All 7 entrance choreographies replay correctly when revisiting a slide (forward and backward).
- [ ] Keyboard, click-zones, swipe, dots, arrows, fullscreen, autoplay all work; hint toast appears once.
- [ ] No console errors; CPU stays low on light slides (canvas paused); animations smooth.
- [ ] The file works when opened via `file://` (no server, no network).
