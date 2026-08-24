# Joy 2 LA Website — Design Spec

## Purpose

A single-page website for Joy 2 LA, a Los Angeles giving-back foundation, built with plain HTML/CSS/JS (no frameworks or build tooling). Visually inspired by ibtu.la's layout and design system, rebranded with Joy 2 LA's own logo, colors, and copy.

## Reference Research (ibtu.la)

- Nav: logo + About / Programs / Impact / Events / Get Involved / Contact + standout "Donate" button
- Layout flow: bold hero → quantified impact stats → 3 "pillar" cards → program carousel → "By the Numbers" counters → footer with contact/social/EIN
- Colors: black (`#000`) on white (`#fff`) base, single bright accent (`#FFC700`) for CTAs, pastel-tinted cards (`#FFF4B8`, `#FFE4D6`, `#D4F5E8`, `#D4F0F8`, `#E8E4FF`)
- Type: Poppins (body, weights 300–700) + condensed poster-style display font ("LOT", falls back to Bebas Neue) for headlines
- Tone: urgent-but-empowering nonprofit voice, numbers-forward storytelling, documentary-style community photography

## Joy 2 LA Brand

Logo: circular mark with a top-to-bottom gradient from warm gold/sand to soft teal/mint, wordmark "JOY ✌🏽 LA" in white condensed type, sampled directly from the provided logo image:

- Gradient top (gold/sand): `#D8C793`
- Gradient bottom (teal/mint): `#98D9D5`

## Visual System

**Colors**
- Brand gradient: `linear-gradient(135deg, #D8C793 0%, #98D9D5 100%)` — used for hero background treatment, Donate button, section dividers
- Base: black `#000` text on white `#fff`
- Accent solids: gold `#D8C793`, teal `#98D9D5` (for links/tags/borders where a flat color is needed)
- Pastel card backgrounds: sand `#F3ECDA`, teal `#E4F5F3`, sand-teal blend `#E9F0DE`

**Typography**
- Display/headline: Bebas Neue (Google Fonts)
- Body: Poppins, weights 300/400/600/700 (Google Fonts)

**Logo usage**
- Small logo mark top-left in nav
- Brand gradient reused behind hero headline and as Donate button background

## Page Structure (single page, `index.html` with anchor-linked sections)

1. **Nav bar** — logo · About · Programs · Impact · Get Involved · Contact (anchors) · sticky "Donate" gradient button
2. **Hero** — Bebas Neue headline over gradient-tinted background, subhead, two CTAs ("Donate →", "Get Involved →")
3. **Impact strip** — 3–4 large-number stat callouts (placeholder figures) with a simple JS count-up animation on scroll into view
4. **About / Mission** — mission statement, tagline, one image placeholder
5. **Programs** — 3 cards, each a distinct pastel background, image placeholder, title, one-line description, "Learn more →":
   - Family Support & Essentials (sand card)
   - Youth & Education (blended card)
   - Community Wellness Days (teal card)
6. **Get Involved** — two side-by-side paths: Volunteer / Donate, each with short blurb + button
7. **Footer** — contact email/phone placeholders, social icons (Instagram/Facebook/TikTok, placeholder links), address placeholder, copyright

## Content

All copy is realistic placeholder text (not lorem ipsum), written in a warm, community-first tone consistent with the reference site's voice but branded as Joy 2 LA. Intended to be swapped for real content later.

## Tech Approach

- Plain HTML/CSS/JS: `index.html`, `styles.css`, `script.js` — no build step, no frameworks
- JS responsibilities: mobile nav toggle, sticky nav on scroll, scroll-reveal animation for sections/cards (IntersectionObserver), animated count-up for impact stats
- Mobile-first responsive layout; semantic HTML; visible focus states and sufficient color contrast for accessibility

## Out of Scope (for this first build)

- Real photography (placeholder images/blocks only)
- Backend/CMS, real donation processing integration, multi-page routing
- Real contact/social links (placeholders until provided)
