# Joy 2 LA — Snack-Brand-Style Redesign Spec

## Purpose

Redesign the existing Joy 2 LA single-page site (currently a black/white editorial look with a gradient accent) into a playful, colorful, DTC-snack-brand-inspired visual style, referencing the layout rhythm and component patterns of eatsnackish.com — bold flat-color section blocks, chunky rounded typography, and consistent white pill buttons — while using 100% original Joy 2 LA content, copy, colors, and no copied photography, logos, or text from the reference site.

This redesign replaces the current visual system (Bebas Neue + black/white/gradient) built in the prior implementation plan. Site remains a single static page: `index.html`, `styles.css`, `script.js`, `assets/`.

## Reference Inspiration (eatsnackish.com) — patterns adapted, not copied

- Full-bleed bold flat-color section backgrounds (no neutral/white base) that rotate through a small palette
- Chunky, fully-rounded, all-lowercase display typography for headlines
- One consistent pill-button style (white fill, dark border, dark text, arrow) reused everywhere regardless of background color
- Small "sticker"/badge circles and tags for calling out stats/facts
- A product/content grid where each card is a single saturated flat color
- A playful embedded-video treatment (retro TV-style card with title + play controls)
- A footer with an email signup, link list, and small credibility badges

## Visual System

**Colors** (CSS custom properties, replacing the current palette)
- `--color-cream: #FFF6E0` — soft base for nav/footer/quiet sections (replaces white as the primary background)
- `--color-mustard: #F3B72E`
- `--color-coral: #FF8F6B`
- `--color-mint: #7FDCC0`
- `--color-sky: #7FCDF0`
- `--color-ink: #3A2B1F` — warm dark brown, primary text/border color on colored surfaces (replaces pure black for body text on color blocks)
- `--color-white: #FFFFFF`
- `--color-black: #000000` (retained only for the impact/stats dark badge circle and footer, where a true dark tone is wanted)
- `--gradient-brand: linear-gradient(135deg, #D8C793 0%, #98D9D5 100%)` (retained — used only for the logo mark itself and the hero video's color overlay tint)

**Typography**
- `--font-display: 'Baloo 2', sans-serif` (weights 600/700/800) — all headline text set in lowercase copy (not CSS `text-transform`, actual lowercase content, matching the reference's casual voice)
- `--font-body: 'Poppins', sans-serif` (unchanged, still loaded from Google Fonts)

**Buttons** — single unified style replacing the current 4-variant system (`btn-primary`/`btn-secondary`/`btn-outline`/`btn-donate`):
- `.btn`: white background, `2px solid var(--color-ink)` border, `var(--color-ink)` text, bold, fully rounded (`border-radius: 999px`), arrow character in the label text, hover lifts 2px
- No color variants needed — the surrounding section's color provides contrast, per the reference pattern

**Decorative accents**
- 1–2 small original inline SVG doodle accents (a simple hand-drawn-style line-art heart or peace-sign, consistent with the Joy 2 LA logo's ✌️ motif) — original artwork, not copied from the reference
- Small rounded "badge" elements (circle stat badge, sticker-style tag) for the impact feature block

## Page Sections (top to bottom)

1. **Announcement bar** — thin mustard strip, centered text: "🎉 join our next volunteer day — get involved →" (links to `#get-involved`), with a dismiss `×` button (JS: clicking hides the bar for the session via a simple class toggle, no persistence required)
2. **Nav** — full-width cream bar (replaces the current floating black pill):
   - Left: plain text links (About, Programs, Impact, Contact) + one pill button "Get Involved →"
   - Center: Joy 2 LA logo (existing `assets/logo.png`, unchanged)
   - Right: pill button "Donate →"
   - Same hamburger-collapses-to-dropdown behavior on narrow viewports as the current nav (reuse existing JS toggle logic, restyled)
3. **Hero** — keeps the existing `assets/hero.mp4` LA skyline video background; overlay tint changes from black to a warm gradient tint (using `--gradient-brand` at low opacity over a dark base, for legibility); headline becomes lowercase Baloo 2 (reusing the existing "see a need. bring people together. spread joy." copy, now lowercase); single white pill CTA "get involved →" (the two-button hero CTA row is simplified to one primary action, matching the reference's single hero CTA)
4. **Programs ("where we show up")** — same 4 existing program cards/copy (Community Outreach, Youth & Education, Families & Care, Seasonal Giving), each card recolored to one full flat color (mustard/coral/mint/sky, one per card) instead of the current pastel tints; existing 9:16 vertical image placeholder and copy unchanged; "Learn more →" link becomes the unified pill button style
5. **Impact feature block** (replaces the current plain black stats strip) — two-column layout:
   - Left (colored block, e.g. mustard): headline "real impact, real fast", one large circular stat badge (reuses one existing stat, e.g. "500+ volunteer hours"), one small sticker tag ("501(c)(3) nonprofit"), and an accordion list of 4 "how we help" bullets (expand/collapse via existing-style JS, new small `+`/`–` indicator) — bullet copy: "hands-on volunteer days", "direct family support", "youth mentorship & education", "100% community-funded"
   - Right: image/video placeholder (solid block, same treatment as program card placeholders)
   - The remaining 3 impact stats (families supported, meals shared, community partners) move into small badges below the accordion, not lost
6. **Story video block** — existing `assets/intro.mp4` embedded with a playful retro-TV-style overlay card (small rounded cream card, bottom-left over the video, containing a TV emoji, the label "joy2la story — episode 1", and play/pause/restart controls); reuses existing video file, new UI chrome only
7. **"spread joy every day"** — two-column: left = image/video placeholder; right = coral block with headline, one paragraph of mission-tone copy (original, e.g. "showing up isn't a one-time thing. it's a Tuesday. it's a Saturday morning. it's every day we choose to be there for LA."), one white pill CTA "our story →" (anchors to `#about`), and one small original doodle accent
8. **Three-way get-involved block** — three equal columns, each a distinct color block:
   - "want to partner with us?" (mint) + pill "partner with us →" (anchors to `#contact`)
   - photo/video placeholder + pill "follow along →" (anchors to footer social links)
   - "ready to show up?" (sky) + pill "become a volunteer →" (anchors to `#get-involved`)
9. **Footer** — cream background:
   - Headline "let's stay in touch!" + email input + pill "sign up" button (decorative only — no backend, consistent with the site's existing no-backend constraint; matches the pattern already used for Donate/social links pointing to placeholders)
   - Two-column link list: About, Programs, Impact, Get Involved, Contact
   - Contact details (existing email/phone/address placeholders, unchanged)
   - Small honest badge row: "501(c)(3) nonprofit", "los angeles, ca", "volunteer-powered" (plain text/pill badges, not fake certification logos)
   - Existing social links (Instagram, Facebook, TikTok), copyright line

## What Is Removed / Replaced

- Floating black pill nav → full-width cream nav bar
- Bebas Neue condensed caps headlines → Baloo 2 lowercase headlines
- 4-variant black/gradient button system → single white/ink pill button
- Plain black impact stats strip → colored two-column feature block with badge + accordion (stats content preserved, redistributed)
- Pastel program card tints → bold flat single-color cards (same 4 cards/copy)
- Hero's dark overlay + 2-button CTA row → warm gradient-tinted overlay + single CTA

## What Is Unchanged

- Site remains single-page, plain HTML/CSS/JS, no build tools/frameworks
- `assets/logo.png`, `assets/hero.mp4`, `assets/intro.mp4` all reused as-is
- Splash intro screen (plays on every load) — unchanged
- All existing program/mission/impact copy content — reused, only container/color styling changes (impact stats redistributed into new layout, not reworded)
- Mobile-first responsive behavior, accessibility (focus states, contrast, `prefers-reduced-motion`) — carried forward and re-verified against the new color palette for contrast

## Out of Scope

- No real product/lifestyle photography (placeholders only, per existing pattern)
- No functional email signup or donation processing
- No new pages/routing
