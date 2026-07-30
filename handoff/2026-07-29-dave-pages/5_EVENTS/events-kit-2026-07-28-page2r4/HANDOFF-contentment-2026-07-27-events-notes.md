# Handoff — Contentment Foundation: Events page (team-notes round 1 applied)
**Date:** 2026-07-27 · Supersedes HANDOFF-2026-07-06
**Files:** `events.html` (~2.96MB, self-contained) · build kit under `events-build/`
**Status:** First page of team notes APPLIED and verified. A SECOND page of notes is still to come
(that's why the next session exists). Remaining non-notes work is tech wiring only.

---

## READ THIS FIRST — what happened this session

Dave brought a screenshot doc of team notes (tagged [WJ] copy, [V] color). Confirmed against the
shipped file that NONE had been applied yet — the doc's screenshots were of our shipped version with
notes drawn ON TOP as a to-do list, not a record of edits. So we worked the whole first page of notes,
then swapped in the real shared header/footer kit. All changes are in the current `events.html`.
Verification passing: **0 em-dashes, 0 banned words, no overflow at 1440/1280/390.**

There is a SECOND PAGE of team notes that has NOT been seen yet. That's the next job.

---

## NOTES APPLIED THIS SESSION (page 1 of the doc)

### Fold 1 — Hero
- **Removed** the "Events & Experiences" eyebrow. (CONFLICT: [WJ] said remove, [V] said recolor it
  to #c2ebe1. Dave ruled WJ wins — copy owner. V's recolor is therefore moot; logged so V knows.)
- Side card **retitled** "Join The Contentment Festival 2026" (was "Be first to know").
- Side card **body**: "November 13 & 14. Held across time zones. No cost, no camera required, no
  experience needed. Just yourself!"
- Side card **CTA**: "Save my free spot →" (still `data-join="hero"`).
- [V] hero image gradient overlay → **#6275b4** (periwinkle, rgb 98,117,180).
- [V] hero side box → **rgba(98,117,180,.82)**.

### NEW email-capture fold (section "1b", between hero and flagship)
- This REVERSES our earlier "no email in the hero flow" decision — team asked for it explicitly, Dave
  confirmed. Section class `ev-signup`.
- Lead: "Join thousands of supporters building a more compassionate and calm world." color **#1d1d1d**.
- Sub: "One-ish email a month, usually about a teacher, a tool or resource you can try, and events you
  can join." color **#54bf98**.
- Carries email seam `data-embed="newsletter-signup"` (tech to wire). This is a THIRD email capture now.

### Fold 3 — Flagship
- [V] image gradient overlay → **#32c0cf** family (cyan, rgb 50,192,207). NOTE: built as a cyan-family
  gradient that still darkens top/bottom for text legibility, NOT a flat bright-cyan wash (that would
  blow out the photo and kill the white text). Flagged to V — she may want it pushed brighter.

### Header / footer — SWAPPED TO THE REAL SHARED KIT
The notes asked for: nav blue→white, TCF colored logo, "Donate" button replacing "Join Homeroom".
Initially I built an Events-only placeholder header with a CSS-filter-tinted logo (a hack). Then Dave
provided the real `header-footer-kit_1.zip` (built from the homepage). We threw away the placeholder and
integrated the REAL shared header + footer. This is now the proper site chrome:
- Header transparent-at-top (white text over hero photo) → **white on scroll** (deep-blue wordmark,
  blue Donate pill). Mint Donate (#55bf98) at top, #0090be scrolled.
- Nav is now **6 tabs**: About, Why Teacher Wellbeing, Our Impact, Schools, Events, Get Involved +
  **Sign In** + **Donate**. Events tab marked `aria-current`.
- Real **full-color cf_ball.png logo**, base64-embedded in both header and footer (page stays
  self-contained; this added ~190KB).
- **Footer**: full 4-column (brand + tagline "When one teacher thrives, generations flourish." /
  Explore / Get Involved / Connect) with 4 **social icons** (LinkedIn, Instagram LIVE, Facebook,
  YouTube). Footer bg is #0090be.
- Integration mechanics: merged the kit's `:root` (added --mint/--btnblue/--navlink/--script/
  --accent-mint/--accent-sand/--ob1/2/3) without duplicating; added **Cedarville Cursive** to the font
  link; brand href set to `index.html` (kit's per-inner-page rule); removed the obsolete `.hdr-light`
  placeholder and `header_events.html`.

---

## ⚠ TWO SITE-WIDE DECISIONS FLAGGED (not ours to make unilaterally — raise with team)
From the kit's own README, both affect all 6 pages once this chrome propagates:
1. **"Our Impact" tab uses `data-page="our-impact"`** (kit renamed from old "stories" seam). If tech
   already wired "stories", reconcile — one-word change. We kept the kit's version (source of truth).
2. **Footer contrast is below AA.** #0090be bg + white text = 3.66:1 (AA wants 4.5:1). README suggests
   #026a8c. Same for the Donate pill (3.2:1). Cheaper to fix once at the source now than on 6 pages
   later. V's call.

---

## CURRENT SECTION ORDER (render sequence)
HTML comment numbers are OUT OF SEQUENCE (sections were reordered earlier; labels never renumbered):
1. HERO  →  1b. EMAIL CAPTURE FOLD (new)  →  2. FLAGSHIP  →  3. UPCOMING (What's coming up)  →
4. HOW ACCESS WORKS  →  6. WHY WE GATHER  →  5. WHERE WE'VE ALREADY BEEN  →  7. CLOSE

(Why We Gather sits ABOVE the recaps on purpose: thesis before proof; green→blue→green rhythm.)

---

## SECTION-BY-SECTION QUICK REFERENCE
- **Hero** full-bleed held-hands photo, periwinkle overlay, text lower-left, periwinkle side card.
- **1b Email capture** — light band (paper2), #1d1d1d lead + #54bf98 sub, capture seam.
- **Flagship** full-bleed Bali crowd (ContentmentWorldWide24_2.jpg), cyan overlay, title one line
  raised into sky, no card/CTA.
- **What's coming up** — title+body left, blue Join Homeroom button right (`data-join="upcoming"`);
  filter grid; STATIC (no scroll anim). Body: "…exclusively for educators and Homeroom members."
- **How access works** — GREEN bg, white heading, single unified 2-col comparison TABLE (Open to
  everyone | Homeroom members $5/mo + checklist).
- **Why we gather** — full-bleed Ryan-on-mic scene, text pooled left, NO cta (reflective beat).
- **Where we've already been** — blue band, STATIC; **Bali is a click-to-play YouTube video**
  (`data-yt=CoZ_J51AfNc`, thumbnail poster, video-led card ~57% width, `background-size:contain`);
  Shasta/Bhutan/Uganda/Singapore below.
- **Close** — full-bleed sunset selfie, Join Homeroom + email-capture card.

---

## ANIMATION
Parallax on the 4 full-bleed media layers (hero, flagship, why, close), scale(1.14) headroom +
overflow:hidden clip. Fade-up on section text. Both respect prefers-reduced-motion. Sections 3 & 5
fully static by request. Intensity dial = `RANGE` (48px) in parallax JS.
⚠ HERO TEXT MUST NEVER CARRY `.anim` — IntersectionObserver skips hero, strands text at opacity:0.

---

## SEAMS FOR TECH (verified against shipped file)
- **data-join**: hero, upcoming, access-band, monthly-workshop, homeroom-sessions, town-hall,
  recap-bhutan, close
- **data-rsvp**: festival-virtual, festival-irl, bali-retreat
- **data-embed** (email): festival-signup, event-announcements, **newsletter-signup** (new this session)
- **data-yt**: CoZ_J51AfNc (live)
- **Header/footer seams** (from shared kit): data-page × 6 (about, why-wellbeing, our-impact,
  for-schools, events, get-involved), data-donate (nav pill + footer), data-link (school-platform/
  Sign In, linkedin, facebook, youtube). Instagram is LIVE.
- **THE CRITICAL SEAM** — return-trip redirect: every gated action carries closest `data-event` id so
  tech wires ONE handler that redirects into join flow and returns to that event. Only piece that
  truly can't be tested until Keela/Homeroom exists.

Live filtering (All/Open/Members/Virtual/In person) is self-contained — no seam.

---

## STILL PENDING
1. **The SECOND PAGE of team notes** (not yet seen) — main reason for the next session.
2. Tech wiring: join-flow round-trip, three email captures, Keela/Homeroom destinations.
3. Possible real colored-logo confirmation (kit's cf_ball.png is embedded and looks right, but Dave
   should eyeball on Netlify).
4. The two site-wide decisions above (Our Impact seam; footer AA contrast).

---

## BUILD SYSTEM (in the kit under events-build/)
`ev_body.html` + `ev_addendum.css` + `assemble_ev.py` (+ process_ev.py, assets_ev.json, and shared
head.html / header.html / footer.html — the header/footer here are the REAL shared-kit versions with
the logo embedded).
- **Rebuild**: from events-build/, `python3 assemble_ev.py` → writes events.html.
- **Sandbox note**: assembler expects files at `/home/claude/cf/` (CF path). If the sandbox reset,
  unzip kit, then `cp events-build/* /home/claude/cf/` before running. Install Pillow with
  `pip install Pillow --break-system-packages` if missing.
- Verification (em-dash / banned words) runs inline every build. Also run overflow check at 1440/1280/390.
- ⚠ `cfest2.jpg` in uploads is an ANNOTATED SCREENSHOT (mockup text baked in) — NOT a usable photo.

---

## DESIGN PRINCIPLES (carry forward)
Kill manufactured eyebrows. Grid-stack (grid-area:1/1) for image-led sections so text can't overflow
onto the section below. Directional/corner-anchored scrim for text-over-photo, not flat darken. Dancing
Script tried+rejected for titles (Newsreader kept). CTA restraint — Join Homeroom only at decision
points, never on Why We Gather. Screenshot previewer has been unreliable across sessions — verify via
computed styles (getComputedStyle / bounding boxes), never trust a blank screenshot as "broken."
