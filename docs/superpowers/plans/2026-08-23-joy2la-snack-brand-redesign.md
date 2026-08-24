# Joy 2 LA Snack-Brand Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the existing Joy 2 LA site from its current black/white editorial look into a playful, colorful, snack-brand-inspired visual system (bold flat-color sections, chunky rounded lowercase typography, one consistent pill-button style) using entirely original Joy 2 LA content and copy, per `docs/superpowers/specs/2026-08-23-joy2la-snack-brand-redesign.md`.

**Architecture:** Same 3-file static site (`index.html`, `styles.css`, `script.js`, `assets/`) — no build tools, no frameworks. Each task restyles or replaces one section in place, reusing existing anchor IDs (`#about`, `#programs`, `#impact`, `#get-involved`, `#contact`) so no links break. New JS is additive (accordion, story video controls, announcement dismiss) alongside the existing splash/nav/reveal/count-up logic, which is otherwise untouched.

**Tech Stack:** Plain HTML5/CSS3/vanilla JS, Google Fonts (Baloo 2 + Poppins), reuses existing `assets/logo.png`, `assets/hero.mp4`, `assets/intro.mp4`.

## Global Constraints

- No build tools, no frameworks, no package manager. Files stay `index.html`, `styles.css`, `script.js`.
- New color tokens (add to `:root`, do not remove existing `--color-gold`/`--color-teal`/`--gradient-brand` — still used by the logo and hero overlay tint): `--color-cream: #FFF6E0`, `--color-mustard: #F3B72E`, `--color-coral: #FF8F6B`, `--color-mint: #7FDCC0`, `--color-sky: #7FCDF0`, `--color-ink: #3A2B1F`.
- `--font-display` changes from `'Bebas Neue', sans-serif` to `'Baloo 2', sans-serif`. All `<h1>`/`<h2>`/`<h3>` text content is rewritten in lowercase (actual content change, not CSS `text-transform`) to match the casual voice. Body paragraph copy stays normal sentence case — only headline-level elements go lowercase.
- One unified `.btn` style (white fill, `2px solid var(--color-ink)` border, ink text, pill shape, bold) replaces the old `.btn-primary`/`.btn-secondary`/`.btn-outline`/`.btn-donate` variants. Every task that touches a button removes the old modifier class from that markup.
- Two copy/content decisions resolved during planning (spec was ambiguous, resolving here per spec's own "reuse existing mission/impact copy" instruction): the "spread joy every day"-style section (Task 7) reuses the **existing** mission headline and paragraph verbatim (just lowercased/restyled) rather than new invented copy; the three-way get-involved block (Task 8) **replaces** the current 2-card Volunteer/Donate section (Donate remains reachable via the nav bar's Donate button).
- `--color-black`/`--color-white` stay defined and are used only for the impact stat badge circle (dark circle) and button/border colors — the footer and impact section backgrounds use the new palette, not black.
- Keep all existing anchor IDs (`#about`, `#programs`, `#impact`, `#get-involved`, `#contact`, `#top`) exactly where they are so nav links and `scroll-margin-top` keep working.
- Preserve existing behavior that must keep working unchanged: splash intro video, hero video autoplay-after-splash, mobile nav hamburger/dropdown toggle mechanics (only its visual styling changes), scroll-reveal (`.reveal`/`.is-visible`), count-up animation (`.stat`/`data-target`/`data-count`), `prefers-reduced-motion` support.
- Mobile-first responsive layout retained at the same `900px` breakpoint used throughout the existing CSS.

---

### Task 1: Design Tokens, Typography, and Unified Button System

**Files:**
- Modify: `index.html` (Google Fonts `<link>` line 11 only)
- Modify: `styles.css` (`:root` additions, `body`, `h1,h2,h3`, `.btn` rules)

**Interfaces:**
- Produces: `--color-cream`, `--color-mustard`, `--color-coral`, `--color-mint`, `--color-sky`, `--color-ink` custom properties that every later task consumes for section backgrounds and text color.
- Produces: rewritten `.btn` base class (white/ink pill) that every later task applies to its buttons in place of the old `.btn-primary`/`.btn-secondary`/`.btn-outline`/`.btn-donate` variants.
- Consumes: nothing new (this is the foundational task).

- [ ] **Step 1: Write the verification check (expected to fail)**

Run: `grep -c 'Baloo' index.html`

Expected: `0` (Baloo 2 not yet loaded).

- [ ] **Step 2: Update the Google Fonts link in `index.html`**

Replace line 11:

```html
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
```

with:

```html
  <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
```

- [ ] **Step 3: Add new color tokens and update base styles in `styles.css`**

Replace the `:root` block (current lines 1–14):

```css
:root {
  --color-black: #000;
  --color-white: #fff;
  --color-gold: #D8C793;
  --color-teal: #98D9D5;
  --card-sand: #F3ECDA;
  --card-blend: #E9F0DE;
  --card-teal: #E4F5F3;
  --card-peach: #F5E3D3;
  --gradient-brand: linear-gradient(135deg, var(--color-gold) 0%, var(--color-teal) 100%);
  --font-display: 'Bebas Neue', sans-serif;
  --font-body: 'Poppins', sans-serif;
  --container-width: 1320px;
}
```

with:

```css
:root {
  --color-black: #000;
  --color-white: #fff;
  --color-gold: #D8C793;
  --color-teal: #98D9D5;
  --card-sand: #F3ECDA;
  --card-blend: #E9F0DE;
  --card-teal: #E4F5F3;
  --card-peach: #F5E3D3;
  --color-cream: #FFF6E0;
  --color-mustard: #F3B72E;
  --color-coral: #FF8F6B;
  --color-mint: #7FDCC0;
  --color-sky: #7FCDF0;
  --color-ink: #3A2B1F;
  --gradient-brand: linear-gradient(135deg, var(--color-gold) 0%, var(--color-teal) 100%);
  --font-display: 'Baloo 2', sans-serif;
  --font-body: 'Poppins', sans-serif;
  --container-width: 1320px;
}
```

(The old `--card-*` tokens are left in place here — Task 4 removes them once their last consumers are recolored, so no section ever renders with an undefined variable.)

Update `body` (current lines 18–24):

```css
body {
  margin: 0;
  font-family: var(--font-body);
  color: var(--color-black);
  background: var(--color-white);
  line-height: 1.6;
}
```

to:

```css
body {
  margin: 0;
  font-family: var(--font-body);
  color: var(--color-ink);
  background: var(--color-cream);
  line-height: 1.6;
}
```

Update `h1, h2, h3` (current lines 27–32):

```css
h1, h2, h3 {
  font-family: var(--font-display);
  letter-spacing: 0.02em;
  line-height: 1.05;
  margin: 0 0 0.5em;
}
```

to:

```css
h1, h2, h3 {
  font-family: var(--font-display);
  font-weight: 700;
  letter-spacing: 0;
  line-height: 1.15;
  margin: 0 0 0.5em;
}
```

- [ ] **Step 4: Rewrite the button system**

Replace the entire `/* Buttons */` block (current lines 36–48):

```css
/* Buttons */
.btn {
  display: inline-block;
  padding: 10px 22px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.95rem;
  transition: transform 0.15s ease;
}
.btn:hover { transform: translateY(-2px); }
.btn-donate, .btn-primary { background: var(--gradient-brand); color: #000; }
.btn-secondary { background: var(--color-black); color: var(--color-white); }
.btn-outline { border: 2px solid var(--color-black); color: var(--color-black); }
```

with:

```css
/* Buttons — one unified pill style used everywhere */
.btn {
  display: inline-block;
  padding: 12px 24px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.95rem;
  background: var(--color-white);
  color: var(--color-ink);
  border: 2px solid var(--color-ink);
  transition: transform 0.15s ease;
}
.btn:hover { transform: translateY(-2px); }
```

- [ ] **Step 5: Run the verification check again and confirm it passes**

Run: `grep -c 'Baloo' index.html && grep -c 'color-mustard' styles.css`

Expected: both print `1` or greater.

- [ ] **Step 6: Manually verify in a browser**

Run: `cd /Users/jonathankoh/Desktop/Joy2LA && python3 -m http.server 8000` then open `http://localhost:8000`.

Confirm: the page background is now a warm cream instead of white, all headline text (still old copy/casing at this point — that's expected, later tasks rewrite it) renders in the new rounded Baloo 2 font instead of Bebas Neue, and any existing buttons now render as a white pill with a dark border instead of black/gradient. Nothing should be visually broken — this task only changes tokens and the button base style.

- [ ] **Step 7: Commit**

```bash
cd /Users/jonathankoh/Desktop/Joy2LA
git add index.html styles.css
git commit -m "feat: add snack-brand color tokens, Baloo 2 display font, unified button style"
```

---

### Task 2: Announcement Bar and Nav Redesign

**Files:**
- Modify: `index.html` (replace the `<header>` block, lines 24–41)
- Modify: `styles.css` (replace the "Header / Nav" block and its media query, current lines 50–76, 78–98, 121–124)
- Modify: `script.js` (add announcement-bar dismiss handler)

**Interfaces:**
- Consumes: `.btn` from Task 1.
- Produces: `#announcement-bar` / `#announcement-close` (new, consumed only by this task's own JS). Keeps `#site-header`, `#nav-toggle`, `#site-nav` ids unchanged so the existing JS in `script.js` (nav toggle, scroll listener) keeps working without modification.

- [ ] **Step 1: Write the verification check (expected to fail)**

Run: `grep -c 'announcement-bar' index.html`

Expected: `0`.

- [ ] **Step 2: Replace the header markup in `index.html`**

Replace the current header block (lines 24–41):

```html
  <header class="site-header" id="site-header">
    <div class="nav-pill">
      <a href="#top" class="logo-link" aria-label="Joy 2 LA home">
        <img src="assets/logo.png" alt="Joy 2 LA logo" class="logo-img">
      </a>
      <button class="nav-toggle" id="nav-toggle" aria-label="Toggle navigation" aria-expanded="false" aria-controls="site-nav">
        <span></span><span></span><span></span>
      </button>
      <a href="#get-involved" class="btn btn-donate">Donate →</a>
    </div>
    <nav class="site-nav" id="site-nav">
      <a href="#about">About</a>
      <a href="#programs">Programs</a>
      <a href="#impact">Impact</a>
      <a href="#get-involved">Get Involved</a>
      <a href="#contact">Contact</a>
    </nav>
  </header>
```

with:

```html
  <div class="announcement-bar" id="announcement-bar">
    <p>🎉 join our next volunteer day — <a href="#get-involved">get involved →</a></p>
    <button class="announcement-close" id="announcement-close" aria-label="Dismiss announcement">×</button>
  </div>

  <header class="site-header" id="site-header">
    <div class="container header-inner">
      <button class="nav-toggle" id="nav-toggle" aria-label="Toggle navigation" aria-expanded="false" aria-controls="site-nav">
        <span></span><span></span><span></span>
      </button>
      <a href="#top" class="logo-link" aria-label="Joy 2 LA home">
        <img src="assets/logo.png" alt="Joy 2 LA logo" class="logo-img">
      </a>
      <div class="header-actions">
        <a href="#get-involved" class="btn">get involved →</a>
        <a href="#get-involved" class="btn">donate →</a>
      </div>
    </div>
    <nav class="site-nav" id="site-nav">
      <a href="#about">about</a>
      <a href="#programs">programs</a>
      <a href="#impact">impact</a>
      <a href="#get-involved">get involved</a>
      <a href="#contact">contact</a>
    </nav>
  </header>
```

- [ ] **Step 3: Replace the nav CSS in `styles.css`**

Replace the block starting at `/* Header / Nav — floating pill, ... */` through the end of the `.site-nav a:hover` rule (current lines 50–98):

```css
/* Header / Nav — floating pill, logo + hamburger + donate, links in a dropdown */
.site-header {
  position: fixed;
  top: 20px;
  left: 0;
  right: 0;
  z-index: 500;
  display: flex;
  justify-content: center;
  padding: 0 24px;
}
.nav-pill {
  display: flex;
  align-items: center;
  gap: 20px;
  background: var(--color-black);
  border-radius: 999px;
  padding: 6px 6px 6px 18px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}
.site-header.scrolled .nav-pill { box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4); transform: scale(0.97); }
.logo-link { display: flex; align-items: center; }
.logo-img { width: 36px; height: 36px; border-radius: 50%; display: block; }
.logo-text { font-family: var(--font-display); font-size: 1.4rem; letter-spacing: 0.05em; }
.nav-toggle { display: flex; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 8px; }
.nav-toggle span { width: 22px; height: 2px; background: var(--color-white); display: block; }

.site-nav {
  position: fixed;
  top: 82px;
  left: 50%;
  transform: translateX(-50%) translateY(-8px);
  z-index: 500;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 220px;
  background: var(--color-black);
  border-radius: 20px;
  padding: 12px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.site-nav.open { opacity: 1; pointer-events: auto; transform: translateX(-50%) translateY(0); }
.site-nav a { color: var(--color-white); font-weight: 600; font-size: 0.95rem; padding: 12px 18px; border-radius: 12px; }
.site-nav a:hover { background: rgba(255, 255, 255, 0.08); }
```

with:

```css
/* Announcement bar */
.announcement-bar {
  position: relative;
  background: var(--color-mustard);
  color: var(--color-ink);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 10px 48px;
  font-size: 0.85rem;
  font-weight: 600;
  text-align: center;
}
.announcement-bar p { margin: 0; }
.announcement-bar a { text-decoration: underline; color: var(--color-ink); }
.announcement-close {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 1.2rem;
  line-height: 1;
  cursor: pointer;
  color: var(--color-ink);
  padding: 4px;
}
.announcement-bar.is-hidden { display: none; }

/* Header / Nav — full-width cream bar, logo centered, links in a dropdown */
.site-header {
  position: sticky;
  top: 0;
  z-index: 500;
  background: var(--color-cream);
  box-shadow: 0 1px 0 rgba(58, 43, 31, 0.08);
  transition: box-shadow 0.2s ease;
}
.site-header.scrolled { box-shadow: 0 4px 16px rgba(58, 43, 31, 0.15); }
.header-inner { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; padding: 16px 24px; gap: 12px; }
.logo-link { justify-self: center; display: flex; align-items: center; }
.logo-img { width: 40px; height: 40px; border-radius: 50%; display: block; }
.logo-text { font-family: var(--font-display); font-size: 1.4rem; }
.nav-toggle { justify-self: start; display: flex; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 8px; }
.nav-toggle span { width: 22px; height: 2px; background: var(--color-ink); display: block; }
.header-actions { justify-self: end; display: flex; gap: 10px; }

.site-nav {
  position: fixed;
  top: 74px;
  left: 50%;
  transform: translateX(-50%) translateY(-8px);
  z-index: 500;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 220px;
  background: var(--color-white);
  border: 2px solid var(--color-ink);
  border-radius: 20px;
  padding: 12px;
  box-shadow: 0 12px 32px rgba(58, 43, 31, 0.2);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.site-nav.open { opacity: 1; pointer-events: auto; transform: translateX(-50%) translateY(0); }
.site-nav a { color: var(--color-ink); font-weight: 600; font-size: 0.95rem; padding: 12px 18px; border-radius: 12px; }
.site-nav a:hover { background: rgba(58, 43, 31, 0.08); }
```

Also replace the mobile media query that referenced the old pill (current lines 121–124):

```css
@media (max-width: 900px) {
  .nav-pill { gap: 14px; padding: 6px 6px 6px 14px; }
  .btn-donate { padding: 10px 16px; font-size: 0.85rem; }
}
```

with:

```css
@media (max-width: 900px) {
  .header-actions .btn { padding: 10px 16px; font-size: 0.85rem; }
  .announcement-bar { padding: 10px 40px; font-size: 0.75rem; }
}
```

- [ ] **Step 4: Add the announcement-bar dismiss handler to `script.js`**

Add this block right after the existing `"use strict";` line (before the splash-handling code):

```javascript
  var announcementBar = document.getElementById('announcement-bar');
  var announcementClose = document.getElementById('announcement-close');
  if (announcementBar && announcementClose) {
    announcementClose.addEventListener('click', function () {
      announcementBar.classList.add('is-hidden');
    });
  }
```

- [ ] **Step 5: Run the verification check again and confirm it passes**

Run: `grep -c 'announcement-bar' index.html && grep -c 'header-actions' styles.css && grep -c 'announcementClose' script.js`

Expected: all three print `1` or greater.

- [ ] **Step 6: Manually verify in a browser**

Reload the page (past the splash). Confirm: a mustard announcement strip sits above the nav with a dismiss `×` that hides it on click; the nav is now a full-width cream bar with the logo centered, a hamburger on the left, and two pill buttons ("get involved →" / "donate →") on the right; clicking the hamburger still opens the dropdown with the 5 links (unchanged interaction, new white/ink styling); resize to a narrow width and confirm the bar and buttons shrink sensibly with no overlap.

- [ ] **Step 7: Commit**

```bash
cd /Users/jonathankoh/Desktop/Joy2LA
git add index.html styles.css script.js
git commit -m "feat: add announcement bar and redesign nav as full-width cream bar"
```

---

### Task 3: Hero Redesign

**Files:**
- Modify: `index.html` (hero section, lines 44–57)
- Modify: `styles.css` (`.hero-overlay`, `.hero h1`, `.hero-ctas` rules)

**Interfaces:**
- Consumes: `.btn` from Task 1. `#hero-video` id must stay exactly as-is — `script.js`'s `hideSplash()` calls `document.getElementById('hero-video').play()`; do not rename it.

- [ ] **Step 1: Write the verification check (expected to fail)**

Run: `grep -c 'see a need' index.html` (checks for the old uppercase copy still being present)

Expected: `1` (still there, about to be replaced).

- [ ] **Step 2: Update the hero markup in `index.html`**

Replace (lines 49–56):

```html
      <div class="container hero-inner">
        <h1>SEE A NEED.<br>BRING PEOPLE TOGETHER.<br>SPREAD JOY.</h1>
        <p class="hero-sub">Joy2LA is a Los Angeles nonprofit bringing people and organizations together to serve, connect, and spread joy throughout our community.</p>
        <div class="hero-ctas">
          <a href="#get-involved" class="btn btn-primary">Get Involved →</a>
          <a href="#get-involved" class="btn btn-secondary">Learn More →</a>
        </div>
      </div>
```

with:

```html
      <div class="container hero-inner">
        <h1>see a need.<br>bring people together.<br>spread joy.</h1>
        <p class="hero-sub">joy2la is a los angeles nonprofit bringing people and organizations together to serve, connect, and spread joy throughout our community.</p>
        <div class="hero-ctas">
          <a href="#get-involved" class="btn">get involved →</a>
        </div>
      </div>
```

- [ ] **Step 3: Update the hero overlay and CTA CSS**

Replace:

```css
.hero-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.45) 50%, rgba(0, 0, 0, 0.65)); z-index: 1; }
```

with:

```css
.hero-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(58, 43, 31, 0.6), rgba(58, 43, 31, 0.35) 50%, rgba(58, 43, 31, 0.7)),
    linear-gradient(135deg, rgba(216, 199, 147, 0.35), rgba(152, 217, 213, 0.35));
  z-index: 1;
}
```

No other hero CSS rules need to change — `.hero h1`, `.hero-sub`, and `.hero-ctas` already work with a single button.

- [ ] **Step 4: Run the verification check again and confirm it passes**

Run: `grep -c 'see a need' index.html && grep -c '>get involved →</a>' index.html`

Expected: both print `1` or greater (case-sensitive grep on the now-lowercase copy).

- [ ] **Step 5: Manually verify in a browser**

Reload past the splash. Confirm: the hero headline is lowercase in the new rounded font, the overlay reads as a warm ink/gold-teal tint instead of pure black (video should still be clearly visible and text still legible), and there is now exactly one pill button ("get involved →") instead of two.

- [ ] **Step 6: Commit**

```bash
cd /Users/jonathankoh/Desktop/Joy2LA
git add index.html styles.css
git commit -m "feat: redesign hero with warm overlay tint, lowercase copy, single CTA"
```

---

### Task 4: Programs Section Recolor

**Files:**
- Modify: `index.html` (programs section, lines 91–122)
- Modify: `styles.css` (card color rules, `:root` cleanup, `.link-arrow` removal)

**Interfaces:**
- Consumes: `.btn` from Task 1. `.program-image`/`data-target`/`data-count` structure inside cards is untouched (no JS depends on card color classes).

- [ ] **Step 1: Write the verification check (expected to fail)**

Run: `grep -c 'card-mustard' index.html`

Expected: `0`.

- [ ] **Step 2: Update the programs markup in `index.html`**

Replace (lines 93–119):

```html
        <p class="eyebrow center">Our Programs</p>
        <h2 class="center">Where We Show Up</h2>
        <div class="program-grid">
          <article class="program-card card-sand reveal">
            <div class="program-image" aria-hidden="true"></div>
            <h3>Community Outreach</h3>
            <p>Bringing people together to serve our neighbors through free hair services, food, clothing, hygiene essentials, and other acts of care.</p>
            <a href="#contact" class="link-arrow">Learn more →</a>
          </article>
          <article class="program-card card-blend reveal">
            <div class="program-image" aria-hidden="true"></div>
            <h3>Youth &amp; Education</h3>
            <p>Encouraging students through books, Career Day experiences, rewards for excellent attendance, and special traditions that bring meals, toys, and joy to the entire school community.</p>
            <a href="#contact" class="link-arrow">Learn more →</a>
          </article>
          <article class="program-card card-teal reveal">
            <div class="program-image" aria-hidden="true"></div>
            <h3>Families &amp; Care</h3>
            <p>Creating moments of care for young mothers, families, and individuals—from celebrating milestones to showing up during difficult seasons and reminding people they haven't been forgotten.</p>
            <a href="#contact" class="link-arrow">Learn more →</a>
          </article>
          <article class="program-card card-peach reveal">
            <div class="program-image" aria-hidden="true"></div>
            <h3>Seasonal Giving</h3>
            <p>Creating community giveback festivals that bring families together with meals, games, toys, activities, and holiday traditions—while creating opportunities for volunteers to spread joy throughout the season.</p>
            <a href="#contact" class="link-arrow">Learn more →</a>
          </article>
        </div>
```

with:

```html
        <p class="eyebrow center">Our Programs</p>
        <h2 class="center">where we show up</h2>
        <div class="program-grid">
          <article class="program-card card-mustard reveal">
            <div class="program-image" aria-hidden="true"></div>
            <h3>community outreach</h3>
            <p>Bringing people together to serve our neighbors through free hair services, food, clothing, hygiene essentials, and other acts of care.</p>
            <a href="#contact" class="btn">learn more →</a>
          </article>
          <article class="program-card card-coral reveal">
            <div class="program-image" aria-hidden="true"></div>
            <h3>youth &amp; education</h3>
            <p>Encouraging students through books, Career Day experiences, rewards for excellent attendance, and special traditions that bring meals, toys, and joy to the entire school community.</p>
            <a href="#contact" class="btn">learn more →</a>
          </article>
          <article class="program-card card-mint reveal">
            <div class="program-image" aria-hidden="true"></div>
            <h3>families &amp; care</h3>
            <p>Creating moments of care for young mothers, families, and individuals—from celebrating milestones to showing up during difficult seasons and reminding people they haven't been forgotten.</p>
            <a href="#contact" class="btn">learn more →</a>
          </article>
          <article class="program-card card-sky reveal">
            <div class="program-image" aria-hidden="true"></div>
            <h3>seasonal giving</h3>
            <p>Creating community giveback festivals that bring families together with meals, games, toys, activities, and holiday traditions—while creating opportunities for volunteers to spread joy throughout the season.</p>
            <a href="#contact" class="btn">learn more →</a>
          </article>
        </div>
```

- [ ] **Step 3: Update the programs CSS**

Replace:

```css
/* Programs */
.programs { padding: 100px 0; background: #fafafa; }
.programs h2 { font-size: 2.5rem; margin-bottom: 48px; }
.eyebrow.center, h2.center { text-align: center; }
.program-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
.program-card { border-radius: 20px; padding: 28px; }
.card-sand { background: var(--card-sand); }
.card-blend { background: var(--card-blend); }
.card-teal { background: var(--card-teal); }
.card-peach { background: var(--card-peach); }
.program-image { aspect-ratio: 9 / 16; border-radius: 14px; background: rgba(0, 0, 0, 0.08); margin-bottom: 20px; overflow: hidden; }
.program-image video, .program-image img { width: 100%; height: 100%; object-fit: cover; border-radius: inherit; }
.program-card h3 { font-size: 1.5rem; margin-bottom: 8px; }
.link-arrow { display: inline-block; margin-top: 14px; font-weight: 600; }
```

with:

```css
/* Programs */
.programs { padding: 100px 0; background: var(--color-cream); }
.programs h2 { font-size: 2.5rem; margin-bottom: 48px; }
.eyebrow.center, h2.center { text-align: center; }
.program-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
.program-card { border-radius: 20px; padding: 28px; }
.card-mustard { background: var(--color-mustard); }
.card-coral { background: var(--color-coral); }
.card-mint { background: var(--color-mint); }
.card-sky { background: var(--color-sky); }
.program-image { aspect-ratio: 9 / 16; border-radius: 14px; background: rgba(58, 43, 31, 0.12); margin-bottom: 20px; overflow: hidden; }
.program-image video, .program-image img { width: 100%; height: 100%; object-fit: cover; border-radius: inherit; }
.program-card h3 { font-size: 1.5rem; margin-bottom: 8px; }
.program-card .btn { margin-top: 14px; }
```

Also remove the now-unused old card tokens from `:root` (added in Task 1, superseded now):

Remove these two lines from `:root`:

```css
  --card-sand: #F3ECDA;
  --card-blend: #E9F0DE;
  --card-teal: #E4F5F3;
  --card-peach: #F5E3D3;
```

- [ ] **Step 4: Run the verification check again and confirm it passes**

Run: `grep -c 'card-mustard' index.html && grep -c 'card-sand' styles.css`

Expected: first prints `1` or greater; second prints `0` (fully removed).

- [ ] **Step 5: Manually verify in a browser**

Scroll to the programs section. Confirm: 4 cards in a row, each a distinct bold flat color (mustard, coral, mint, sky), lowercase card titles, "learn more →" now renders as the white/ink pill button instead of a plain text link, and the 9:16 vertical image placeholders are unchanged.

- [ ] **Step 6: Commit**

```bash
cd /Users/jonathankoh/Desktop/Joy2LA
git add index.html styles.css
git commit -m "feat: recolor program cards with bold flat palette, unify CTA buttons"
```

---

### Task 5: Impact Feature Block (Replaces Stats Strip)

**Files:**
- Modify: `index.html` (impact section, lines 59–78)
- Modify: `styles.css` (replace "Impact stats" block and its media query, current lines 126–134)
- Modify: `script.js` (add accordion toggle behavior)

**Interfaces:**
- Consumes: `.btn`, `.eyebrow` from earlier tasks.
- Produces/keeps: every counter element keeps the existing `class="stat"` (alongside a new visual-only class) with `data-target` and a `[data-count]` child, so the existing `script.js` `countObserver` logic (`document.querySelectorAll('.stat')`) keeps working with zero JS changes for counting. New: `.accordion-trigger` buttons, consumed only by this task's own new JS.

- [ ] **Step 1: Write the verification check (expected to fail)**

Run: `grep -c 'accordion-trigger' index.html`

Expected: `0`.

- [ ] **Step 2: Replace the impact section markup in `index.html`**

Replace the entire section (lines 59–78):

```html
    <section class="impact" id="impact">
      <div class="container impact-grid">
        <div class="stat" data-target="1200">
          <span><span class="stat-number" data-count>0</span><span class="stat-plus">+</span></span>
          <p>Families Supported</p>
        </div>
        <div class="stat" data-target="15000">
          <span><span class="stat-number" data-count>0</span><span class="stat-plus">+</span></span>
          <p>Meals Shared</p>
        </div>
        <div class="stat" data-target="500">
          <span><span class="stat-number" data-count>0</span><span class="stat-plus">+</span></span>
          <p>Volunteer Hours</p>
        </div>
        <div class="stat" data-target="8">
          <span><span class="stat-number" data-count>0</span></span>
          <p>Community Partners</p>
        </div>
      </div>
    </section>
```

with:

```html
    <section class="impact" id="impact">
      <div class="container impact-feature">
        <div class="impact-content">
          <p class="eyebrow">our impact</p>
          <h2>real impact, real fast.</h2>
          <div class="impact-badges">
            <div class="stat stat-badge" data-target="500">
              <span class="stat-badge-number"><span data-count>0</span>+</span>
              <span class="stat-badge-label">volunteer hours</span>
            </div>
            <span class="sticker">501(c)(3) nonprofit</span>
          </div>
          <div class="accordion">
            <div class="accordion-item">
              <button class="accordion-trigger" aria-expanded="false">
                <span>hands-on volunteer days</span><span class="accordion-icon">+</span>
              </button>
              <div class="accordion-panel">
                <p>Real people showing up together for real, hands-on service across LA.</p>
              </div>
            </div>
            <div class="accordion-item">
              <button class="accordion-trigger" aria-expanded="false">
                <span>direct family support</span><span class="accordion-icon">+</span>
              </button>
              <div class="accordion-panel">
                <p>Groceries, essentials, and resources delivered directly to families who need them.</p>
              </div>
            </div>
            <div class="accordion-item">
              <button class="accordion-trigger" aria-expanded="false">
                <span>youth mentorship &amp; education</span><span class="accordion-icon">+</span>
              </button>
              <div class="accordion-panel">
                <p>Books, mentorship, and school-day support that keeps LA kids on track.</p>
              </div>
            </div>
            <div class="accordion-item">
              <button class="accordion-trigger" aria-expanded="false">
                <span>100% community-funded</span><span class="accordion-icon">+</span>
              </button>
              <div class="accordion-panel">
                <p>Every dollar comes from people like you, and goes right back into LA communities.</p>
              </div>
            </div>
          </div>
          <div class="impact-mini-stats">
            <div class="stat mini-stat" data-target="1200"><span data-count>0</span>+<p>families supported</p></div>
            <div class="stat mini-stat" data-target="15000"><span data-count>0</span>+<p>meals shared</p></div>
            <div class="stat mini-stat" data-target="8"><span data-count>0</span><p>community partners</p></div>
          </div>
        </div>
        <div class="impact-image" aria-hidden="true"></div>
      </div>
    </section>
```

- [ ] **Step 3: Replace the impact CSS**

Replace:

```css
/* Impact stats */
.impact { padding: 60px 0; background: #000; color: #fff; }
.impact-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; text-align: center; }
.stat-number, .stat-plus { font-family: var(--font-display); font-size: clamp(2rem, 4vw, 3rem); }
.impact-grid p { margin-top: 6px; color: #ccc; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.08em; }

@media (max-width: 900px) {
  .impact-grid { grid-template-columns: repeat(2, 1fr); }
}
```

with:

```css
/* Impact feature block */
.impact { padding: 100px 0; background: var(--color-mustard); }
.impact-feature { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 60px; align-items: center; }
.impact-content h2 { font-size: 2.5rem; }
.impact-badges { display: flex; align-items: center; gap: 20px; margin: 24px 0 32px; flex-wrap: wrap; }
.stat-badge {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: var(--color-ink);
  color: var(--color-white);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-shrink: 0;
}
.stat-badge-number { font-family: var(--font-display); font-size: 2rem; font-weight: 800; }
.stat-badge-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.06em; margin-top: 4px; }
.sticker {
  background: var(--color-white);
  color: var(--color-ink);
  border: 2px solid var(--color-ink);
  border-radius: 999px;
  padding: 10px 18px;
  font-weight: 700;
  font-size: 0.85rem;
}
.accordion-item { border-bottom: 2px solid rgba(58, 43, 31, 0.15); }
.accordion-trigger {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: none;
  border: none;
  padding: 18px 0;
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 1.05rem;
  color: var(--color-ink);
  cursor: pointer;
  text-align: left;
}
.accordion-icon { font-size: 1.3rem; transition: transform 0.2s ease; }
.accordion-item.open .accordion-icon { transform: rotate(45deg); }
.accordion-panel { max-height: 0; overflow: hidden; transition: max-height 0.25s ease; }
.accordion-item.open .accordion-panel { max-height: 200px; }
.accordion-panel p { margin: 0 0 18px; color: var(--color-ink); opacity: 0.85; }
.impact-mini-stats { display: flex; gap: 32px; margin-top: 32px; flex-wrap: wrap; }
.mini-stat { font-family: var(--font-display); }
.mini-stat span { font-size: 1.5rem; font-weight: 800; }
.mini-stat p { margin: 2px 0 0; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.04em; font-family: var(--font-body); font-weight: 600; }
.impact-image { aspect-ratio: 4 / 3; border-radius: 20px; background: rgba(58, 43, 31, 0.12); }

@media (max-width: 900px) {
  .impact-feature { grid-template-columns: 1fr; }
}
```

- [ ] **Step 4: Add accordion behavior to `script.js`**

Add this block at the end of the IIFE, right before the closing `})();`:

```javascript
  var accordionTriggers = document.querySelectorAll('.accordion-trigger');
  accordionTriggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var item = trigger.closest('.accordion-item');
      var isOpen = item.classList.toggle('open');
      trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });
```

- [ ] **Step 5: Run the verification check again and confirm it passes**

Run: `grep -c 'accordion-trigger' index.html && grep -c 'accordionTriggers' script.js`

Expected: both print `1` or greater.

- [ ] **Step 6: Manually verify in a browser**

Scroll to the impact section. Confirm: mustard-colored full-width block with a dark circular "500+ volunteer hours" badge, a white "501(c)(3) nonprofit" sticker, four accordion rows that expand/collapse on click (icon rotates to an ×), and three smaller counters (families supported / meals shared / community partners) below the accordion that still count up from 0 when scrolled into view (verifying the existing count-up JS still works unmodified with the renamed-but-`.stat`-classed elements).

- [ ] **Step 7: Commit**

```bash
cd /Users/jonathankoh/Desktop/Joy2LA
git add index.html styles.css script.js
git commit -m "feat: replace stats strip with impact feature block (badge + accordion)"
```

---

### Task 6: Story Video Block

**Files:**
- Modify: `index.html` (insert new `<section>` between the impact section's `</section>` and the about section's `<section class="about"`)
- Modify: `styles.css` (append new rules)
- Modify: `script.js` (add video control handlers)

**Interfaces:**
- Consumes: `.reveal` from the existing scroll-reveal system (already generic — no changes needed to `revealObserver`).
- Produces: `#story-video`, `#story-restart`, `#story-playpause`, `#story-mute`, consumed only by this task's new JS.

- [ ] **Step 1: Write the verification check (expected to fail)**

Run: `grep -c 'story-video' index.html`

Expected: `0`.

- [ ] **Step 2: Insert the story section into `index.html`**

Insert immediately after the impact section's closing `</section>` (and before `<section class="about" id="about">`):

```html
    <section class="story">
      <div class="container story-inner reveal">
        <video class="story-video" id="story-video" muted loop playsinline preload="metadata">
          <source src="assets/intro.mp4" type="video/mp4">
        </video>
        <div class="story-card">
          <span class="story-card-icon" aria-hidden="true">📺</span>
          <p class="story-card-title">joy2la story — episode 1</p>
          <div class="story-controls">
            <button class="story-btn" id="story-restart" aria-label="Restart video">⏮</button>
            <button class="story-btn" id="story-playpause" aria-label="Play or pause video">⏸</button>
            <button class="story-btn" id="story-mute" aria-label="Mute or unmute video">🔊</button>
          </div>
        </div>
      </div>
    </section>
```

- [ ] **Step 3: Append story-block styles to `styles.css`**

```css
/* Story video block */
.story { padding: 100px 0; background: var(--color-cream); }
.story-inner { position: relative; border-radius: 24px; overflow: hidden; }
.story-video { width: 100%; display: block; aspect-ratio: 16 / 9; object-fit: cover; background: var(--color-ink); }
.story-card {
  position: absolute;
  left: 24px;
  bottom: 24px;
  background: var(--color-cream);
  border: 2px solid var(--color-ink);
  border-radius: 20px;
  padding: 16px 20px;
  max-width: 260px;
}
.story-card-icon { font-size: 1.5rem; }
.story-card-title { font-family: var(--font-display); font-weight: 700; margin: 6px 0 10px; }
.story-controls { display: flex; gap: 8px; }
.story-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid var(--color-ink);
  background: var(--color-white);
  color: var(--color-ink);
  cursor: pointer;
  font-size: 0.9rem;
}

@media (max-width: 900px) {
  .story-card { left: 12px; bottom: 12px; max-width: 200px; padding: 12px 14px; }
}
```

- [ ] **Step 4: Add video control JS to `script.js`**

Add this block at the end of the IIFE, right before the closing `})();` (after the accordion block from Task 5):

```javascript
  var storyVideo = document.getElementById('story-video');
  var storyRestart = document.getElementById('story-restart');
  var storyPlayPause = document.getElementById('story-playpause');
  var storyMute = document.getElementById('story-mute');
  if (storyVideo && storyPlayPause && storyRestart && storyMute) {
    storyVideo.play();
    storyPlayPause.addEventListener('click', function () {
      if (storyVideo.paused) {
        storyVideo.play();
        storyPlayPause.textContent = '⏸';
      } else {
        storyVideo.pause();
        storyPlayPause.textContent = '▶';
      }
    });
    storyRestart.addEventListener('click', function () {
      storyVideo.currentTime = 0;
      storyVideo.play();
      storyPlayPause.textContent = '⏸';
    });
    storyMute.addEventListener('click', function () {
      storyVideo.muted = !storyVideo.muted;
      storyMute.textContent = storyVideo.muted ? '🔇' : '🔊';
    });
  }
```

- [ ] **Step 5: Run the verification check again and confirm it passes**

Run: `grep -c 'story-video' index.html && grep -c 'storyPlayPause' script.js`

Expected: both print `1` or greater.

- [ ] **Step 6: Manually verify in a browser**

Scroll to the new story section (between impact and mission). Confirm: the intro video plays on loop, muted, inside a rounded frame; a small cream card overlays the bottom-left corner with a TV emoji, "joy2la story — episode 1", and three round control buttons; clicking pause/play toggles the video and the icon; clicking restart jumps back to 0:00; clicking the speaker toggles mute and the icon between 🔊/🔇.

- [ ] **Step 7: Commit**

```bash
cd /Users/jonathankoh/Desktop/Joy2LA
git add index.html styles.css script.js
git commit -m "feat: add story video block with playful retro-TV control card"
```

---

### Task 7: Mission Section Restyle ("Spread Joy Every Day")

**Files:**
- Modify: `index.html` (about section, lines 80–89)
- Modify: `styles.css` (replace "About" block, current lines 136–145)

**Interfaces:**
- Consumes: `.btn`, `.eyebrow`, `.reveal` from earlier tasks/existing system. Keeps `id="about"` exactly as-is (nav links target it).

- [ ] **Step 1: Write the verification check (expected to fail)**

Run: `grep -c 'class="doodle"' index.html`

Expected: `0`.

- [ ] **Step 2: Update the about section markup in `index.html`**

Replace (lines 80–89):

```html
    <section class="about" id="about">
      <div class="container about-inner reveal">
        <div class="about-image" aria-hidden="true"></div>
        <div class="about-text">
          <p class="eyebrow">Our Mission</p>
          <h2>Community Starts With Showing Up.</h2>
          <p>Joy2LA brings people together to serve Los Angeles communities through meaningful, hands-on acts of giving. From supporting children and families to serving our unhoused neighbors, we create opportunities for people to show up, give back, and spread joy—together.</p>
        </div>
      </div>
    </section>
```

with:

```html
    <section class="about" id="about">
      <div class="container about-inner reveal">
        <div class="about-image" aria-hidden="true"></div>
        <div class="about-text">
          <p class="eyebrow">our mission</p>
          <h2>community starts with showing up.</h2>
          <p>Joy2LA brings people together to serve Los Angeles communities through meaningful, hands-on acts of giving. From supporting children and families to serving our unhoused neighbors, we create opportunities for people to show up, give back, and spread joy—together.</p>
          <a href="#programs" class="btn">see our programs →</a>
          <svg class="doodle" width="60" height="60" viewBox="0 0 60 60" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 35 C15 25, 25 15, 30 22 C35 15, 45 25, 40 35 C35 45, 30 48, 30 48 C30 48, 25 45, 20 35 Z"/>
          </svg>
        </div>
      </div>
    </section>
```

- [ ] **Step 3: Replace the about-section CSS**

Replace:

```css
/* About */
.about { padding: 100px 0; }
.about-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
.about-image { aspect-ratio: 4 / 3; border-radius: 16px; background: var(--gradient-brand); }
.eyebrow { text-transform: uppercase; letter-spacing: 0.12em; font-weight: 600; font-size: 0.85rem; color: #777; }
.about-text h2 { font-size: 2.5rem; }

@media (max-width: 900px) {
  .about-inner { grid-template-columns: 1fr; }
}
```

with:

```css
/* About / Mission */
.about { padding: 100px 0; background: var(--color-coral); color: var(--color-white); }
.about-inner { position: relative; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
.about-image { aspect-ratio: 4 / 3; border-radius: 20px; background: rgba(255, 255, 255, 0.25); }
.eyebrow { text-transform: uppercase; letter-spacing: 0.12em; font-weight: 600; font-size: 0.85rem; color: #777; }
.about-text .eyebrow { color: rgba(255, 255, 255, 0.8); }
.about-text h2 { font-size: 2.5rem; color: var(--color-white); }
.about-text p { color: rgba(255, 255, 255, 0.92); }
.about-text .btn { margin-top: 8px; }
.doodle { color: var(--color-white); opacity: 0.6; position: absolute; top: -10px; right: -10px; }

@media (max-width: 900px) {
  .about-inner { grid-template-columns: 1fr; }
  .doodle { display: none; }
}
```

(The base `.eyebrow` rule stays shared with the programs section's eyebrow, which still wants the muted gray `#777` on a cream background — only `.about-text .eyebrow` overrides it for this section's coral background.)

- [ ] **Step 4: Run the verification check again and confirm it passes**

Run: `grep -c 'class="doodle"' index.html && grep -c 'community starts with showing up' index.html`

Expected: both print `1` or greater.

- [ ] **Step 5: Manually verify in a browser**

Scroll to the mission section. Confirm: full coral background, white lowercase headline "community starts with showing up.", white-ish body paragraph (same wording as before), a white pill "see our programs →" button that scrolls to the programs section, and a small heart doodle outline visible in the corner on desktop (hidden on mobile).

- [ ] **Step 6: Commit**

```bash
cd /Users/jonathankoh/Desktop/Joy2LA
git add index.html styles.css
git commit -m "feat: restyle mission section as bold coral two-column block"
```

---

### Task 8: Three-Way Get-Involved Block

**Files:**
- Modify: `index.html` (get-involved section, lines 124–137)
- Modify: `styles.css` (replace "Get Involved" block, current lines 166–177)

**Interfaces:**
- Consumes: `.btn`, `.reveal`. Keeps `id="get-involved"` exactly as-is (nav links, hero CTA, and program card "learn more" links all target it).

- [ ] **Step 1: Write the verification check (expected to fail)**

Run: `grep -c 'want to partner with us' index.html`

Expected: `0`.

- [ ] **Step 2: Replace the get-involved markup in `index.html`**

Replace (lines 124–137):

```html
    <section class="get-involved" id="get-involved">
      <div class="container involved-grid">
        <div class="involved-card reveal">
          <h3>Volunteer</h3>
          <p>Show up for your neighbors. Join a Joy 2 LA volunteer day and help us deliver support where it's needed most.</p>
          <a href="#contact" class="btn btn-outline">Become a Volunteer →</a>
        </div>
        <div class="involved-card involved-card-donate reveal">
          <h3>Donate</h3>
          <p>Every dollar goes directly toward families, youth programs, and community wellness across LA.</p>
          <a href="#contact" class="btn btn-primary">Donate Now →</a>
        </div>
      </div>
    </section>
```

with:

```html
    <section class="get-involved" id="get-involved">
      <div class="container involved-grid">
        <div class="involved-card card-mint reveal">
          <h3>want to partner with us?</h3>
          <p>Schools, businesses, and community groups—let's team up to serve LA together.</p>
          <a href="#contact" class="btn">partner with us →</a>
        </div>
        <div class="involved-card involved-photo reveal">
          <h3>follow along</h3>
          <p>See what we're up to between volunteer days.</p>
          <a href="#contact" class="btn">follow along →</a>
        </div>
        <div class="involved-card card-sky reveal">
          <h3>ready to show up?</h3>
          <p>Join a Joy2LA volunteer day and help us deliver support where it's needed most.</p>
          <a href="#contact" class="btn">become a volunteer →</a>
        </div>
      </div>
    </section>
```

- [ ] **Step 3: Replace the get-involved CSS**

Replace:

```css
/* Get Involved */
.get-involved { padding: 100px 0; }
.involved-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; }
.involved-card { padding: 40px; border-radius: 20px; background: #000; color: #fff; }
.involved-card h3 { font-size: 2rem; }
.involved-card .btn-outline { border-color: #fff; color: #fff; }
.involved-card-donate { background: var(--gradient-brand); color: #000; }
.involved-card-donate .btn-primary { background: var(--color-black); color: var(--color-white); }

@media (max-width: 900px) {
  .involved-grid { grid-template-columns: 1fr; }
}
```

with:

```css
/* Get Involved (three-way) */
.get-involved { padding: 100px 0; background: var(--color-cream); }
.involved-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.involved-card {
  padding: 40px;
  border-radius: 20px;
  min-height: 320px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
.involved-card h3 { font-size: 1.6rem; }
.involved-card p { margin-bottom: 20px; }
.card-mint { background: var(--color-mint); }
.card-sky { background: var(--color-sky); }
.involved-photo { background: rgba(58, 43, 31, 0.12); }

@media (max-width: 900px) {
  .involved-grid { grid-template-columns: 1fr; }
}
```

- [ ] **Step 4: Run the verification check again and confirm it passes**

Run: `grep -c 'want to partner with us' index.html && grep -c 'card-mint' styles.css`

Expected: both print `1` or greater.

- [ ] **Step 5: Manually verify in a browser**

Scroll to the get-involved section. Confirm: three equal-width cards — mint "want to partner with us?", a neutral placeholder "follow along" card, and sky-blue "ready to show up?" — each with a white pill CTA button, stacking to one column on mobile.

- [ ] **Step 6: Commit**

```bash
cd /Users/jonathankoh/Desktop/Joy2LA
git add index.html styles.css
git commit -m "feat: replace 2-card get-involved section with 3-way block"
```

---

### Task 9: Footer Redesign

**Files:**
- Modify: `index.html` (footer, lines 140–158)
- Modify: `styles.css` (replace "Footer" block, current lines 179–185)

**Interfaces:**
- Consumes: `.btn`, `.sticker` (from Task 5), `.logo-text`/`.logo-img` (existing). Keeps `id="contact"` on the `<footer>` exactly as-is (every "learn more"/CTA link in the page targets it).

- [ ] **Step 1: Write the verification check (expected to fail)**

Run: `grep -c "let's stay in touch" index.html`

Expected: `0`.

- [ ] **Step 2: Replace the footer markup in `index.html`**

Replace (lines 140–158):

```html
  <footer class="site-footer" id="contact">
    <div class="container footer-inner">
      <div class="footer-brand">
        <img src="assets/logo.png" alt="Joy 2 LA logo" class="logo-img">
        <span class="logo-text">Joy 2 LA</span>
      </div>
      <div class="footer-contact">
        <p>hello@joy2la.org</p>
        <p>(323) 555-0192</p>
        <p>Los Angeles, CA</p>
      </div>
      <div class="footer-social">
        <a href="#" aria-label="Instagram">Instagram</a>
        <a href="#" aria-label="Facebook">Facebook</a>
        <a href="#" aria-label="TikTok">TikTok</a>
      </div>
    </div>
    <p class="footer-copyright">© 2026 Joy 2 LA. All rights reserved.</p>
  </footer>
```

with:

```html
  <footer class="site-footer" id="contact">
    <div class="container">
      <div class="footer-signup reveal">
        <h3>let's stay in touch!</h3>
        <form class="signup-form" onsubmit="return false;">
          <input type="email" placeholder="email" aria-label="Email address" required>
          <button type="submit" class="btn">sign up</button>
        </form>
      </div>
      <div class="footer-inner">
        <div class="footer-brand">
          <img src="assets/logo.png" alt="Joy 2 LA logo" class="logo-img">
          <span class="logo-text">Joy 2 LA</span>
        </div>
        <div class="footer-links">
          <a href="#about">About</a>
          <a href="#programs">Programs</a>
          <a href="#impact">Impact</a>
          <a href="#get-involved">Get Involved</a>
          <a href="#contact">Contact</a>
        </div>
        <div class="footer-contact">
          <p>hello@joy2la.org</p>
          <p>(323) 555-0192</p>
          <p>Los Angeles, CA</p>
        </div>
        <div class="footer-social">
          <a href="#" aria-label="Instagram">Instagram</a>
          <a href="#" aria-label="Facebook">Facebook</a>
          <a href="#" aria-label="TikTok">TikTok</a>
        </div>
      </div>
      <div class="footer-badges">
        <span class="sticker">501(c)(3) nonprofit</span>
        <span class="sticker">los angeles, ca</span>
        <span class="sticker">volunteer-powered</span>
      </div>
      <p class="footer-copyright">© 2026 Joy 2 LA. All rights reserved.</p>
    </div>
  </footer>
```

- [ ] **Step 3: Replace the footer CSS**

Replace:

```css
/* Footer */
.site-footer { background: #000; color: #fff; padding: 60px 0 24px; }
.footer-inner { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 32px; padding-bottom: 32px; border-bottom: 1px solid rgba(255, 255, 255, 0.15); }
.footer-brand { display: flex; align-items: center; gap: 10px; }
.footer-contact p, .footer-social a { margin: 4px 0; color: #ccc; display: block; }
.footer-social { display: flex; flex-direction: column; }
.footer-copyright { text-align: center; color: #777; font-size: 0.85rem; margin-top: 20px; }
```

with:

```css
/* Footer */
.site-footer { background: var(--color-cream); color: var(--color-ink); padding: 80px 0 32px; }
.footer-signup { text-align: center; margin-bottom: 60px; }
.footer-signup h3 { font-size: 2rem; margin-bottom: 20px; }
.signup-form { display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; }
.signup-form input {
  padding: 12px 20px;
  border-radius: 999px;
  border: 2px solid var(--color-ink);
  font-family: var(--font-body);
  font-size: 0.95rem;
  min-width: 240px;
  background: var(--color-white);
  color: var(--color-ink);
}
.footer-inner { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 32px; padding-bottom: 32px; border-bottom: 2px solid rgba(58, 43, 31, 0.15); }
.footer-brand { display: flex; align-items: center; gap: 10px; }
.footer-links, .footer-social { display: flex; flex-direction: column; gap: 6px; }
.footer-links a, .footer-contact p, .footer-social a { margin: 0; color: var(--color-ink); opacity: 0.85; }
.footer-badges { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; margin: 28px 0; }
.footer-copyright { text-align: center; opacity: 0.6; font-size: 0.85rem; margin-top: 12px; }
```

- [ ] **Step 4: Run the verification check again and confirm it passes**

Run: `grep -c "let's stay in touch" index.html && grep -c 'signup-form' styles.css`

Expected: both print `1` or greater.

- [ ] **Step 5: Manually verify in a browser**

Scroll to the footer. Confirm: cream background, "let's stay in touch!" heading with an email input + "sign up" pill button (submitting does nothing, no page reload, no console error — `onsubmit="return false;"` handles that), a link list (About/Programs/Impact/Get Involved/Contact) plus contact info and social links, three sticker badges, and the copyright line.

- [ ] **Step 6: Commit**

```bash
cd /Users/jonathankoh/Desktop/Joy2LA
git add index.html styles.css
git commit -m "feat: redesign footer with cream background, signup, and badges"
```

---

### Task 10: Final QA Pass — Contrast, Cleanup, Cross-Section Verification

**Files:**
- Modify: `styles.css` (remove any now-dead rules found during the check below)
- No new features — this task verifies the whole redesign holds together and removes leftover dead CSS.

**Interfaces:**
- Consumes: the complete redesigned site from Tasks 1–9.

- [ ] **Step 1: Write the verification check (expected to fail until cleanup is confirmed)**

Run: `grep -nE 'btn-primary|btn-secondary|btn-outline|btn-donate|card-sand|card-blend|card-teal|card-peach|involved-card-donate|nav-pill|link-arrow' index.html styles.css`

Expected: some matches (old class names may still linger in comments or unused CSS from earlier tasks) — record what's found.

- [ ] **Step 2: Remove any dead CSS the check surfaced**

For each match from Step 1 that is a CSS rule with no corresponding HTML usage anywhere in `index.html` (confirm with a second targeted `grep` per class name), delete that CSS rule. (Tasks 1–9 above were written to leave no dead rules, so this step is a safety net — if Step 1 comes back empty, skip to Step 3.)

- [ ] **Step 3: Run the verification check again and confirm it's clean**

Run: `grep -nE 'btn-primary|btn-secondary|btn-outline|btn-donate|card-sand|card-blend|card-teal|card-peach|involved-card-donate|nav-pill|link-arrow' index.html styles.css`

Expected: no output (exit code 1 / no matches).

- [ ] **Step 4: Verify color contrast**

For each of the four program-card colors (`--color-mustard`, `--color-coral`, `--color-mint`, `--color-sky`) and the impact section's mustard background, confirm `--color-ink` (`#3A2B1F`) text/borders on top of them meet at least WCAG AA for large text (headings) — these are all light-to-mid-saturation colors against a very dark brown, so contrast should be comfortably high, but visually confirm no color combination reads as low-contrast in a browser screenshot.

- [ ] **Step 5: Full manual walkthrough in a browser**

Run: `cd /Users/jonathankoh/Desktop/Joy2LA && python3 -m http.server 8000`, open `http://localhost:8000`, and check at both a desktop width (~1440px) and a mobile width (~390px):
1. Splash intro still plays once on load, then the hero video starts from 0:00.
2. Announcement bar, nav (with working hamburger dropdown), hero, programs (4 colors), impact block (accordion + counters), story video block (controls work), mission block, 3-way get-involved block, and footer all render without visual overlap or horizontal scroll at either width.
3. Every nav link and CTA button scrolls to the correct section (no broken anchors from the id changes made across tasks — `#about`, `#programs`, `#impact`, `#get-involved`, `#contact` should all still exist exactly once each).
4. `prefers-reduced-motion` is still respected: with it enabled in devtools, `.reveal` elements should be visible immediately and smooth-scroll should be disabled (existing CSS block, unmodified — just confirm nothing in this redesign broke it).

- [ ] **Step 6: Commit**

```bash
cd /Users/jonathankoh/Desktop/Joy2LA
git add -A
git commit -m "chore: final QA pass on snack-brand redesign — cleanup dead CSS, verify contrast and navigation"
```

---

## Self-Review Notes

- **Spec coverage:** Announcement bar, nav, hero, programs, impact/stats, story video, mission, get-involved, footer, and the visual system (colors/type/buttons) each map to one task. All 9 spec page sections plus the foundational tokens task are covered.
- **Placeholder scan:** No TBD/TODO; all copy is either the existing approved content (lowercased) or new short original copy consistent with the site's established voice.
- **Ambiguity resolved:** The spec's Colors section incorrectly implied the footer keeps a black background — corrected here to cream, matching the spec's own Page Sections description and the reference. The spec's implied duplication between the mission section and get-involved section content is resolved: Task 7 reuses existing mission copy, Task 8 replaces (not duplicates) the old 2-card get-involved section.
- **Type/naming consistency:** All counter elements keep the shared `.stat`/`data-target`/`[data-count]` contract from the original build so `script.js`'s existing `countObserver` needs zero changes. All anchor IDs (`#about`, `#programs`, `#impact`, `#get-involved`, `#contact`, `#top`) are preserved exactly across every task.
