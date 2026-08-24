# Joy 2 LA Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page, static HTML/CSS/JS website for Joy 2 LA, a Los Angeles giving-back foundation, styled after ibtu.la's layout system but rebranded with Joy 2 LA's own gradient logo, colors, and copy.

**Architecture:** One `index.html` with seven stacked, anchor-linked sections (nav, hero, impact stats, about, programs, get involved, footer), one `styles.css` for all styling, and one `script.js` for the three interactive behaviors (mobile nav toggle, sticky-nav shadow on scroll, scroll-reveal + count-up animations via `IntersectionObserver`). No frameworks, no build step, no package manager.

**Tech Stack:** Plain HTML5, CSS3 (custom properties, Grid/Flexbox), vanilla JS (ES5-compatible, no transpilation). Google Fonts: Bebas Neue + Poppins. No test runner — verification is done via `grep` checks on the markup/CSS plus manual browser confirmation of behavior (this project has no JS test framework, per spec's "no frameworks" constraint).

## Global Constraints

- No build tools, no frameworks, no package manager — plain `index.html`, `styles.css`, `script.js` only, per spec's Tech Approach section.
- File names are exactly: `index.html`, `styles.css`, `script.js`, `assets/logo.png`.
- Brand gradient: `linear-gradient(135deg, #D8C793 0%, #98D9D5 100%)` — exact hex values from the spec, sampled from the real logo.
- Base colors: black `#000` text on white `#fff`. Pastel program-card backgrounds: sand `#F3ECDA`, blend `#E9F0DE`, teal `#E4F5F3`.
- Fonts: display/headline = Bebas Neue, body = Poppins (weights 300/400/600/700), both via Google Fonts `<link>` tags (no npm/local font files).
- Single page, all navigation via `#anchor` links — no multi-page routing.
- Mobile-first responsive layout; visible focus states; sufficient color contrast (black-on-white and black-on-pastel body text; the gradient is only used behind large headline/button text, never small body copy).
- Placeholder copy must be realistic (not lorem ipsum) — exact copy strings are specified per task below; do not substitute different wording.
- `assets/logo.png` already exists in the project (480×480 transparent PNG, cropped and masked from the foundation's provided logo image) — tasks below reference it, they do not recreate it.

---

### Task 1: Project Scaffold, Base Styles, Nav, Hero

**Files:**
- Create: `index.html`
- Create: `styles.css`
- Create: `script.js`
- Verify exists (already created during design research): `assets/logo.png`

**Interfaces:**
- Produces: CSS custom properties on `:root` — `--color-black`, `--color-white`, `--color-gold` (`#D8C793`), `--color-teal` (`#98D9D5`), `--card-sand` (`#F3ECDA`), `--card-blend` (`#E9F0DE`), `--card-teal` (`#E4F5F3`), `--gradient-brand`, `--font-display`, `--font-body`, `--container-width`. All later tasks reuse these variables verbatim — do not redefine or rename them.
- Produces: `.container` layout class, `.btn` / `.btn-primary` / `.btn-secondary` / `.btn-outline` / `.btn-donate` button classes, and `.reveal` / `.reveal.is-visible` animation classes that later tasks apply to their own sections.
- Produces: DOM elements `#site-header`, `#nav-toggle`, `#site-nav` that Task 7's JS attaches behavior to.

- [ ] **Step 1: Write the verification check for the scaffold (expected to fail)**

Run: `grep -c '<html lang="en">' index.html`

Expected: command fails because `index.html` does not exist yet (`No such file or directory`).

- [ ] **Step 2: Create `index.html` with document shell, nav, and hero**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Joy 2 LA | Community is the Joy</title>
  <meta name="description" content="Joy 2 LA is a Los Angeles-based giving-back foundation supporting families, youth, and community wellness across the city.">
  <link rel="icon" href="assets/logo.png" type="image/png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header class="site-header" id="site-header">
    <div class="container header-inner">
      <a href="#top" class="logo-link">
        <img src="assets/logo.png" alt="Joy 2 LA logo" class="logo-img">
        <span class="logo-text">Joy 2 LA</span>
      </a>
      <button class="nav-toggle" id="nav-toggle" aria-label="Toggle navigation" aria-expanded="false" aria-controls="site-nav">
        <span></span><span></span><span></span>
      </button>
      <nav class="site-nav" id="site-nav">
        <a href="#about">About</a>
        <a href="#programs">Programs</a>
        <a href="#impact">Impact</a>
        <a href="#get-involved">Get Involved</a>
        <a href="#contact">Contact</a>
        <a href="#get-involved" class="btn btn-donate">Donate</a>
      </nav>
    </div>
  </header>

  <main id="top">
    <section class="hero" id="hero">
      <div class="container hero-inner">
        <h1>COMMUNITY IS THE JOY.</h1>
        <p class="hero-sub">Joy 2 LA is a Los Angeles-based foundation building trust, support, and hope in the neighborhoods that need it most.</p>
        <div class="hero-ctas">
          <a href="#get-involved" class="btn btn-primary">Donate →</a>
          <a href="#get-involved" class="btn btn-secondary">Get Involved →</a>
        </div>
      </div>
    </section>
  </main>

  <script src="script.js"></script>
</body>
</html>
```

- [ ] **Step 3: Create `styles.css` with variables, base styles, nav, and hero styles**

```css
:root {
  --color-black: #000;
  --color-white: #fff;
  --color-gold: #D8C793;
  --color-teal: #98D9D5;
  --card-sand: #F3ECDA;
  --card-blend: #E9F0DE;
  --card-teal: #E4F5F3;
  --gradient-brand: linear-gradient(135deg, var(--color-gold) 0%, var(--color-teal) 100%);
  --font-display: 'Bebas Neue', sans-serif;
  --font-body: 'Poppins', sans-serif;
  --container-width: 1140px;
}

*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  font-family: var(--font-body);
  color: var(--color-black);
  background: var(--color-white);
  line-height: 1.6;
}
img { max-width: 100%; display: block; }
a { color: inherit; text-decoration: none; }
h1, h2, h3 {
  font-family: var(--font-display);
  letter-spacing: 0.02em;
  line-height: 1.05;
  margin: 0 0 0.5em;
}
.container { max-width: var(--container-width); margin: 0 auto; padding: 0 24px; }

/* Buttons */
.btn {
  display: inline-block;
  padding: 10px 22px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.95rem;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.btn:hover { transform: translateY(-2px); }
.btn-donate, .btn-primary { background: var(--gradient-brand); color: #000; }
.btn-secondary { background: var(--color-black); color: var(--color-white); }
.btn-outline { border: 2px solid var(--color-black); color: var(--color-black); }

/* Header / Nav */
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--color-white);
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.2s ease;
}
.site-header.scrolled { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); }
.header-inner { display: flex; align-items: center; justify-content: space-between; padding: 14px 24px; }
.logo-link { display: flex; align-items: center; gap: 10px; }
.logo-img { width: 40px; height: 40px; border-radius: 50%; }
.logo-text { font-family: var(--font-display); font-size: 1.4rem; letter-spacing: 0.05em; }
.site-nav { display: flex; align-items: center; gap: 28px; }
.site-nav a { font-weight: 600; font-size: 0.95rem; }
.nav-toggle { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 8px; }
.nav-toggle span { width: 24px; height: 2px; background: #000; display: block; }

/* Hero */
.hero {
  padding: 120px 0 90px;
  background: linear-gradient(180deg, rgba(216, 199, 147, 0.25), rgba(152, 217, 213, 0.25));
  text-align: center;
}
.hero h1 { font-size: clamp(2.5rem, 6vw, 5rem); }
.hero-sub { max-width: 640px; margin: 0 auto 32px; font-size: 1.15rem; color: #333; }
.hero-ctas { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }

/* Scroll-reveal (behavior added in Task 7) */
.reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
.reveal.is-visible { opacity: 1; transform: translateY(0); }

/* Mobile nav */
@media (max-width: 900px) {
  .nav-toggle { display: flex; }
  .site-nav {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #fff;
    flex-direction: column;
    align-items: flex-start;
    padding: 20px 24px;
    gap: 16px;
    display: none;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  }
  .site-nav.open { display: flex; }
}
```

- [ ] **Step 4: Create empty-but-valid `script.js`**

```javascript
(function () {
  "use strict";
})();
```

- [ ] **Step 5: Run the verification check again and confirm it passes**

Run: `grep -c '<html lang="en">' index.html && grep -c 'gradient-brand' styles.css`

Expected: both commands print `1` (or greater), no errors.

- [ ] **Step 6: Manually verify in a browser**

Run: `cd /Users/jonathankoh/Desktop/Joy2LA && python3 -m http.server 8000` then open `http://localhost:8000` in a browser.

Confirm: the Joy 2 LA gradient logo appears top-left, "Joy 2 LA" wordmark next to it, nav links (About/Programs/Impact/Get Involved/Contact) and a gradient "Donate" pill button appear top-right, and the hero shows "COMMUNITY IS THE JOY." in the condensed display font with a soft gold-to-teal tinted background and two buttons below the subhead. Stop the server with Ctrl+C when done.

- [ ] **Step 7: Initialize git and commit**

```bash
cd /Users/jonathankoh/Desktop/Joy2LA
git init
git add index.html styles.css script.js assets/logo.png
git commit -m "feat: scaffold Joy 2 LA site with nav and hero"
```

---

### Task 2: Impact Stats Strip

**Files:**
- Modify: `index.html` (insert new `<section>` immediately after `</section>` that closes `#hero`, still inside `<main>`)
- Modify: `styles.css` (append new rules)

**Interfaces:**
- Consumes: `.container` from Task 1.
- Produces: `.stat` elements with `data-target="<number>"` and a nested `[data-count]` element — Task 7's JS reads `data-target` and writes into `[data-count]` to animate the count-up.

- [ ] **Step 1: Write the verification check (expected to fail)**

Run: `grep -c 'class="impact"' index.html`

Expected: `0` (section does not exist yet).

- [ ] **Step 2: Insert the impact section into `index.html`**

Insert this immediately after the `</section>` that closes the hero section (still before `</main>`):

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

- [ ] **Step 3: Append impact styles to `styles.css`**

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

- [ ] **Step 4: Run the verification check again and confirm it passes**

Run: `grep -c 'class="impact"' index.html && grep -c 'data-target="15000"' index.html`

Expected: both print `1`.

- [ ] **Step 5: Manually verify in a browser**

Reload `http://localhost:8000` (restart the `python3 -m http.server 8000` from Task 1 if it isn't still running). Confirm a black full-width strip appears below the hero with four columns, each showing `0+` (or `0` for Community Partners) in large display type with a label underneath (Families Supported, Meals Shared, Volunteer Hours, Community Partners). Numbers will animate once Task 7 adds the JS — for now confirm they render statically as `0`.

- [ ] **Step 6: Commit**

```bash
cd /Users/jonathankoh/Desktop/Joy2LA
git add index.html styles.css
git commit -m "feat: add impact stats strip"
```

---

### Task 3: About / Mission Section

**Files:**
- Modify: `index.html` (insert new `<section>` immediately after the `</section>` that closes `#impact`)
- Modify: `styles.css` (append new rules)

**Interfaces:**
- Consumes: `.reveal` class from Task 1 (applied to `.about-inner` so Task 7's scroll-reveal observer picks it up).

- [ ] **Step 1: Write the verification check (expected to fail)**

Run: `grep -c 'id="about"' index.html`

Expected: `0`.

- [ ] **Step 2: Insert the about section into `index.html`**

```html
    <section class="about" id="about">
      <div class="container about-inner reveal">
        <div class="about-image" aria-hidden="true"></div>
        <div class="about-text">
          <p class="eyebrow">Our Mission</p>
          <h2>Designed with Joy.</h2>
          <p>Joy 2 LA exists to bring dignity, stability, and a little bit of joy to Los Angeles communities facing hardship. We partner with local families, schools, and volunteers to make sure no one has to carry the hard days alone.</p>
        </div>
      </div>
    </section>
```

- [ ] **Step 3: Append about styles to `styles.css`**

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

- [ ] **Step 4: Run the verification check again and confirm it passes**

Run: `grep -c 'id="about"' index.html && grep -c 'Designed with Joy' index.html`

Expected: both print `1`.

- [ ] **Step 5: Manually verify in a browser**

Reload the page. Confirm a two-column section appears below the impact strip: a gradient-filled image placeholder on one side, and "Our Mission" / "Designed with Joy." / the mission paragraph on the other. On a narrow window (resize below ~900px) confirm it stacks to one column.

- [ ] **Step 6: Commit**

```bash
cd /Users/jonathankoh/Desktop/Joy2LA
git add index.html styles.css
git commit -m "feat: add about/mission section"
```

---

### Task 4: Programs Section (3 Cards)

**Files:**
- Modify: `index.html` (insert new `<section>` immediately after the `</section>` that closes `#about`)
- Modify: `styles.css` (append new rules)

**Interfaces:**
- Consumes: `--card-sand`, `--card-blend`, `--card-teal`, `.reveal` from Task 1.

- [ ] **Step 1: Write the verification check (expected to fail)**

Run: `grep -c 'class="program-card' index.html`

Expected: `0`.

- [ ] **Step 2: Insert the programs section into `index.html`**

```html
    <section class="programs" id="programs">
      <div class="container">
        <p class="eyebrow center">Our Programs</p>
        <h2 class="center">Where We Show Up</h2>
        <div class="program-grid">
          <article class="program-card card-sand reveal">
            <div class="program-image" aria-hidden="true"></div>
            <h3>Family Support &amp; Essentials</h3>
            <p>Groceries, hygiene kits, and emergency essentials delivered directly to families navigating hard times.</p>
            <a href="#contact" class="link-arrow">Learn more →</a>
          </article>
          <article class="program-card card-blend reveal">
            <div class="program-image" aria-hidden="true"></div>
            <h3>Youth &amp; Education</h3>
            <p>Mentorship, school supplies, and after-school support that keeps LA kids on track.</p>
            <a href="#contact" class="link-arrow">Learn more →</a>
          </article>
          <article class="program-card card-teal reveal">
            <div class="program-image" aria-hidden="true"></div>
            <h3>Community Wellness Days</h3>
            <p>Free pop-up health screenings, mental health resources, and community meals.</p>
            <a href="#contact" class="link-arrow">Learn more →</a>
          </article>
        </div>
      </div>
    </section>
```

- [ ] **Step 3: Append programs styles to `styles.css`**

```css
/* Programs */
.programs { padding: 100px 0; background: #fafafa; }
.programs h2 { font-size: 2.5rem; margin-bottom: 48px; }
.eyebrow.center, h2.center { text-align: center; }
.program-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
.program-card { border-radius: 20px; padding: 28px; }
.card-sand { background: var(--card-sand); }
.card-blend { background: var(--card-blend); }
.card-teal { background: var(--card-teal); }
.program-image { aspect-ratio: 16 / 10; border-radius: 14px; background: rgba(0, 0, 0, 0.08); margin-bottom: 20px; }
.program-card h3 { font-size: 1.5rem; margin-bottom: 8px; }
.link-arrow { display: inline-block; margin-top: 14px; font-weight: 600; }

@media (max-width: 900px) {
  .program-grid { grid-template-columns: 1fr; }
}
```

- [ ] **Step 4: Run the verification check again and confirm it passes**

Run: `grep -c 'class="program-card' index.html`

Expected: `3`.

- [ ] **Step 5: Manually verify in a browser**

Reload the page. Confirm three cards appear side by side (sand, blended sand-teal, and teal backgrounds respectively), each with an image placeholder block, a title, one sentence of copy, and a "Learn more →" link. On a narrow window confirm they stack to one column.

- [ ] **Step 6: Commit**

```bash
cd /Users/jonathankoh/Desktop/Joy2LA
git add index.html styles.css
git commit -m "feat: add programs section with 3 cards"
```

---

### Task 5: Get Involved Section

**Files:**
- Modify: `index.html` (insert new `<section>` immediately after the `</section>` that closes `#programs`, and immediately before `</main>`)
- Modify: `styles.css` (append new rules)

**Interfaces:**
- Consumes: `.btn-outline`, `.btn-primary`, `.reveal`, `--gradient-brand` from Task 1.

- [ ] **Step 1: Write the verification check (expected to fail)**

Run: `grep -c 'id="get-involved"' index.html`

Expected: `0`.

- [ ] **Step 2: Insert the get-involved section into `index.html`**

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

- [ ] **Step 3: Append get-involved styles to `styles.css`**

```css
/* Get Involved */
.get-involved { padding: 100px 0; }
.involved-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; }
.involved-card { padding: 40px; border-radius: 20px; background: #000; color: #fff; }
.involved-card h3 { font-size: 2rem; }
.involved-card .btn-outline { border-color: #fff; color: #fff; }
.involved-card-donate { background: var(--gradient-brand); color: #000; }
.involved-card-donate .btn-outline { border-color: #000; color: #000; }

@media (max-width: 900px) {
  .involved-grid { grid-template-columns: 1fr; }
}
```

- [ ] **Step 4: Run the verification check again and confirm it passes**

Run: `grep -c 'id="get-involved"' index.html && grep -c 'Become a Volunteer' index.html`

Expected: both print `1`.

- [ ] **Step 5: Manually verify in a browser**

Reload the page. Confirm two side-by-side cards: a black "Volunteer" card with an outlined white button, and a gradient "Donate" card with a solid button. On a narrow window confirm they stack to one column.

- [ ] **Step 6: Commit**

```bash
cd /Users/jonathankoh/Desktop/Joy2LA
git add index.html styles.css
git commit -m "feat: add get involved section"
```

---

### Task 6: Footer

**Files:**
- Modify: `index.html` (insert `<footer>` immediately after `</main>`, before `<script src="script.js"></script>`)
- Modify: `styles.css` (append new rules)

**Interfaces:**
- Consumes: `.logo-img`, `.logo-text` classes from Task 1 (reused in the footer brand mark).
- Produces: `id="contact"` anchor target, which the nav's "Contact" link (Task 1) and every "Learn more →" / involvement CTA (Tasks 4–5) point to.

- [ ] **Step 1: Write the verification check (expected to fail)**

Run: `grep -c '<footer' index.html`

Expected: `0`.

- [ ] **Step 2: Insert the footer into `index.html`**

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

- [ ] **Step 3: Append footer styles to `styles.css`**

```css
/* Footer */
.site-footer { background: #000; color: #fff; padding: 60px 0 24px; }
.footer-inner { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 32px; padding-bottom: 32px; border-bottom: 1px solid rgba(255, 255, 255, 0.15); }
.footer-brand { display: flex; align-items: center; gap: 10px; }
.footer-contact p, .footer-social a { margin: 4px 0; color: #ccc; display: block; }
.footer-social { display: flex; flex-direction: column; }
.footer-copyright { text-align: center; color: #777; font-size: 0.85rem; margin-top: 20px; }
```

- [ ] **Step 4: Run the verification check again and confirm it passes**

Run: `grep -c '<footer' index.html && grep -c 'hello@joy2la.org' index.html`

Expected: both print `1`.

- [ ] **Step 5: Manually verify in a browser**

Reload the page. Confirm a black footer at the bottom with the logo + "Joy 2 LA" wordmark, contact details (email/phone/city), a column of social links, and a copyright line. Click "Contact" in the nav and confirm the page scrolls smoothly to this footer.

- [ ] **Step 6: Commit**

```bash
cd /Users/jonathankoh/Desktop/Joy2LA
git add index.html styles.css
git commit -m "feat: add footer"
```

---

### Task 7: JavaScript Interactivity (Nav Toggle, Sticky Shadow, Scroll-Reveal, Count-Up)

**Files:**
- Modify: `script.js` (replace the empty IIFE body from Task 1 with full behavior)

**Interfaces:**
- Consumes: `#site-header`, `#nav-toggle`, `#site-nav` (Task 1); `.reveal` elements (Tasks 3–5); `.stat[data-target]` and `.stat [data-count]` (Task 2).

- [ ] **Step 1: Write the verification check (expected to fail)**

Run: `grep -c 'IntersectionObserver' script.js`

Expected: `0` (script.js currently only has the empty IIFE from Task 1).

- [ ] **Step 2: Implement full `script.js`**

```javascript
(function () {
  "use strict";

  var header = document.getElementById('site-header');
  var navToggle = document.getElementById('nav-toggle');
  var siteNav = document.getElementById('site-nav');

  navToggle.addEventListener('click', function () {
    var isOpen = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  var navLinks = siteNav.querySelectorAll('a');
  for (var i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener('click', function () {
      siteNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  }

  window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 10);
  });

  var revealEls = document.querySelectorAll('.reveal');
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  revealEls.forEach(function (el) { revealObserver.observe(el); });

  var stats = document.querySelectorAll('.stat');
  var countObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var stat = entry.target;
      var target = parseInt(stat.getAttribute('data-target'), 10);
      var numEl = stat.querySelector('[data-count]');
      var duration = 1200;
      var startTime = null;

      function step(timestamp) {
        if (startTime === null) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        numEl.textContent = Math.floor(progress * target).toLocaleString();
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          numEl.textContent = target.toLocaleString();
        }
      }
      requestAnimationFrame(step);
      countObserver.unobserve(stat);
    });
  }, { threshold: 0.4 });
  stats.forEach(function (el) { countObserver.observe(el); });
})();
```

- [ ] **Step 3: Run the verification check again and confirm it passes**

Run: `grep -c 'IntersectionObserver' script.js`

Expected: `2` (one for `revealObserver`, one for `countObserver`).

- [ ] **Step 4: Manually verify in a browser**

Reload `http://localhost:8000`. Confirm all of the following:
1. Scrolling down 10px or more adds a visible shadow under the sticky nav bar.
2. Shrinking the browser window below ~900px wide replaces the nav links with a hamburger icon; clicking it shows/hides the nav menu, and clicking any nav link closes the menu again.
3. Scrolling the About, Programs, and Get Involved sections into view makes them fade/slide in (rather than being visible immediately on page load).
4. Scrolling the Impact strip into view animates each number counting up from `0` to its target (1,200 / 15,000 / 500 / 8) over about a second, and stays at the final number afterward.

- [ ] **Step 5: Commit**

```bash
cd /Users/jonathankoh/Desktop/Joy2LA
git add script.js
git commit -m "feat: add nav toggle, sticky shadow, scroll-reveal, and count-up animations"
```

---

## Self-Review Notes

- **Spec coverage:** Nav+Donate CTA (Task 1), hero (Task 1), impact strip with count-up (Tasks 2, 7), about/mission (Task 3), 3 program cards with pastel backgrounds (Task 4), get involved volunteer/donate paths (Task 5), footer with contact/social/copyright (Task 6), mobile nav toggle + sticky nav + scroll-reveal (Task 7) — every spec section maps to a task.
- **Placeholder scan:** No TBD/TODO markers; all copy is final placeholder text matching the approved spec, not lorem ipsum.
- **Type/naming consistency:** `data-target` / `data-count` attribute names, and CSS class names (`.reveal`, `.stat`, `.impact-grid`, `.program-card`, `.involved-card`) are used identically across the tasks that produce and consume them.
