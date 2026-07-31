# Feature Ticket List — contentment.org

> **Status:** Draft  
> **Last updated:** June 2026  
> **Contact:** somesh@contentment.org  
> **Use:** Copy each ticket into an AI coding session or issue tracker.  
> **UI rule:** Strictly match `site/index.html` and [Frontend Spec](./FRONTEND-SPECIFICATION.md). No visual redesign.

Related: [PRD](./PRD.md) · [Technical Architecture](./TECHNICAL-ARCHITECTURE.md)

**Priority key:** `must-have` (MVP) · `should-have` (Phase 1.5) · `nice-to-have` (Phase 2+)

---

## Foundation

### TICKET-001 · Extract shared layout from prototype

| Field | Value |
|-------|-------|
| **Priority** | must-have |
| **Dependencies** | None |

**Description:**  
Split `site/index.html` into reusable layout parts: `<head>` (fonts, meta, CSS variables), `header` nav, and `footer`. CSS stays identical — extract to `tokens.css` + `global.css` without changing any values. Prepare for Astro `BaseLayout.astro` or HTML include pattern.

**Acceptance criteria:**
- [ ] All CSS custom properties match prototype exactly
- [ ] Nav and footer render pixel-identical to current homepage
- [ ] Google Fonts link unchanged
- [ ] `prefers-reduced-motion` rules preserved in global CSS
- [ ] Homepage still works when using extracted layout

**AI prompt seed:**  
> Extract header, footer, and CSS from `site/index.html` into shared layout files. Do not change any colors, fonts, spacing, or class names. Preserve all animation and reduced-motion CSS verbatim.

---

### TICKET-002 · Multi-page routing scaffold

| Field | Value |
|-------|-------|
| **Priority** | must-have |
| **Dependencies** | TICKET-001 |

**Description:**  
Set up project for multi-page static site (Astro recommended per Technical Architecture). Create route stubs: `/`, `/why`, `/stories`, `/schools`, `/give`, `/give/monthly`, `/privacy`, `/terms`. Each page uses shared layout; body is placeholder until content tickets land.

**Acceptance criteria:**
- [ ] All Phase 1 routes return 200 locally
- [ ] Shared nav/footer on every route
- [ ] Active nav state or correct links to routes (not `#` anchors)
- [ ] `404.html` exists with branded minimal page
- [ ] Build outputs static files deployable to **Vercel**

---

### TICKET-003 · Mobile navigation drawer

| Field | Value |
|-------|-------|
| **Priority** | must-have |
| **Dependencies** | TICKET-001 |

**Description:**  
Prototype menu button only exists at `≤940px` with no drawer. Implement full-screen or slide-down mobile menu matching nav link styles (white text, teal underline hover). Include Homeroom CTA pill. Trap focus when open; close on Escape and link click.

**Acceptance criteria:**
- [x] All main nav links accessible on mobile
- [x] Keyboard navigable; `aria-expanded` on menu button
- [x] Body scroll locked when menu open
- [x] Visual style matches existing header (deep background)

---

### TICKET-004 · Wire all nav and footer links

| Field | Value |
|-------|-------|
| **Priority** | must-have |
| **Dependencies** | TICKET-002 |

**Description:**  
Replace `href="#"` and hash-only links with real routes per [Website Architecture](../research/WEBSITE-ARCHITECTURE.md). Footer Explore/Get Involved columns map to Phase 1 pages. Social links: LinkedIn, Instagram, YouTube URLs from comms team (use placeholders only if URLs not yet provided — document in README).

**Acceptance criteria:**
- [ ] No `href="#"` on nav items
- [ ] Homeroom nav CTA → `/give/monthly`
- [ ] Footer links resolve to correct routes or external social URLs
- [ ] Hash links on homepage (`#why`, etc.) still work on `/` only

---

## Homepage

### TICKET-010 · Migrate homepage to `/` route

| Field | Value |
|-------|-------|
| **Priority** | must-have |
| **Dependencies** | TICKET-001, TICKET-002 |

**Description:**  
Port entire homepage from `site/index.html` to index route. All sections: hero, why split, impact, Kenya voice band, orbit, alone circles, pillars, homeroom, doors, newsletter, footer. All JS behavior unchanged: scroll nav, hero load, IntersectionObserver, count-up, pillars accordion, orbit scroll, parallax.

> **Status (30 Jul 2026):** Ported to `src/pages/index.astro` from Dave's Jul 29 2026 handoff (supersedes the old `site/index.html` prototype as source — see FRONTEND-SPECIFICATION.md). Browser-tested 320–1280px, zero horizontal scroll, zero console errors (`docs/planning/HOMEPAGE-RESPONSIVE-AUDIT.md`). **Not yet done:** formal Lighthouse run.
>
> **Update (31 Jul 2026):** Homepage-first Slack review (HC-057) passed — Kristina's Slack message ("finished the Homepage... timeline to finish the other pages?") taken as sign-off on desktop + mobile. Gate cleared to proceed on remaining pages (RF-006). Donate CTA still on a placeholder pending live Keela URLs (D-02/HC-075) — that does not block starting other pages.

**Acceptance criteria:**
- [x] Visual parity with prototype on desktop and mobile
- [x] All animations work; reduced motion disables orbit scroll
- [x] All images load from `assets/`
- [ ] Lighthouse performance ≥ 85 mobile — not yet run

---

### TICKET-011 · Homepage copy audit vs messaging brief

| Field | Value |
|-------|-------|
| **Priority** | should-have |
| **Dependencies** | TICKET-010 |

**Description:**  
Compare homepage copy to [Messaging brief §6 Home](../research/MESSAGING-AND-COPY.md). Update headlines/subheads only where brief specifies different copy. Do not change layout. Ensure orientation line, three beats, and proof stats match Section 8 exactly.

> **Status (31 Jul 2026):** Done. Fixed Four Pillars definitions to verbatim brief wording (`Pillars.astro`) and the Homeroom CTA to "Join Homeroom, from $5/month" (`InviteBand.astro`). Everything else already matched. One item flagged, not fixed: `HomeroomBlock.astro`'s dummy donate form has `data-group="donor"` — banned-word cleanup deferred to whoever wires the real Keela form (FEAT-060), since that file is mid-flight on another ticket.

**Acceptance criteria:**
- [x] Stats: 325 schools, 12 countries, 11,925 educators, 409,625+ students, 86%
- [x] Primary CTA label: "Join Homeroom, from $5/month"
- [x] No banned words (donor, em dashes, quiet, steady, upstream)
- [x] Tagline in footer matches verbatim

---

## Why Teacher Wellbeing

### TICKET-020 · Build `/why` page

| Field | Value |
|-------|-------|
| **Priority** | must-have |
| **Dependencies** | TICKET-002, TICKET-001 |

**Description:**  
Long-form page using existing section patterns (`.split`, `.impact`, `.quote-card`, `.band`). Structure per messaging brief: objection → weight → ripple → reflection pause → why now → evidence → "but what about" cards → Peter's school → CTA. Open with orientation line. Primary CTA: Join Homeroom. Secondary: Share this page.

> **Status (31 Jul 2026):** RF-006 Why click-through done — locked widths (320–1280) clean; accordion + YouTube CEO/reel slots OK. No layout bugs found. Homeroom Keela + newsletter remain placeholders (HC-075 / FEAT-070). Copy audit vs messaging brief still open (acceptance criteria below).

> **Status (29–30 Jul 2026):** Ported verbatim to `src/pages/why.astro` from Dave's Jul 29 2026 handoff. Fixed one real bug during migration: the stat numbers (86%, 90%+, 9 in 10, National) shared the homepage's `.num` class, which the site-wide count-up script would have overwritten with "NaN" on scroll — renamed to `.rnum`. Content/UX acceptance criteria below are unverified against the messaging brief (technical migration only, not a copy audit).

**Acceptance criteria:**
- [ ] Passes first-time visitor test (messaging brief §5)
- [ ] Citations: Harvard, 86%, Bhutan, Hawaiʻi renewal — link to [Evidence doc](../research/EVIDENCE-AND-RESEARCH.md) where cited
- [ ] Uses only approved design system components
- [ ] Share button triggers Web Share API or copy-link fallback

---

## Educator Stories

### TICKET-030 · Stories data model + JSON

| Field | Value |
|-------|-------|
| **Priority** | must-have |
| **Dependencies** | None |

**Description:**  
Create `src/data/stories.json` with schema: slug, name, country, school, quote, excerpt, hero_image, themes[], published. Seed with minimum 3 stories (content from comms). Include fields for future map pins (lat/lng optional).

**Acceptance criteria:**
- [ ] Valid JSON; at least 3 published stories
- [ ] Slugs URL-safe
- [ ] Images reference `assets/` paths

> **External dependency (launch risk):** Story content — photos, long-form copy, educator names and permissions — must be provided by the comms/programs team before this ticket can close. This is not an engineering dependency; it is an editorial one. Flag early. Minimum 3 published stories are required for Phase 1 MVP. If content is late, `/stories` launches with a holding state (coming soon or a single story) and this ticket moves to Phase 1.5.

---

### TICKET-031 · Build `/stories` index

| Field | Value |
|-------|-------|
| **Priority** | must-have |
| **Dependencies** | TICKET-030, TICKET-002 |

**Description:**  
Stories index using `.door` card grid pattern. Filter UI optional for MVP (nice-to-have: region/theme filters). Orientation line in hero. Each card links to `/stories/[slug]`. Global framing copy per story pillars.

> **Status (31 Jul 2026):** RF-006 Our Impact click-through done — locked widths (320–1280) clean; no code fixes. Page renamed "Our Impact" per Kristina — route is `/our-impact`, not `/stories` (HC-073). Ported to `src/pages/our-impact/index.astro` from Dave's Jul 29 handoff. TICKET-030 story-content dependency still unresolved (comms/programs owe photos + permissions); ships static handoff content as-is.

**Acceptance criteria:**
- [ ] All published stories render as cards
- [ ] Responsive grid matches door-grid breakpoints
- [ ] Primary CTA: Join Homeroom in page footer or hero

---

### TICKET-032 · Build `/stories/[slug]` template

| Field | Value |
|-------|-------|
| **Priority** | should-have |
| **Dependencies** | TICKET-030, TICKET-031 |

**Description:**  
Individual story page: `.split` hero with educator photo, pull quote, school context, long body, ripple impact section, CTA to Homeroom. Generate static pages from JSON at build time.

**Acceptance criteria:**
- [ ] One page per story slug
- [ ] 404 for unknown slug
- [ ] Meta title includes educator name
- [ ] Passes front-door test as standalone page

---

### TICKET-033 · Interactive global map

| Field | Value |
|-------|-------|
| **Priority** | nice-to-have |
| **Dependencies** | TICKET-031 |

**Description:**  
Map with country pins on `/stories`. Filters by region, theme, school type. Use lightweight library (Mapbox GL or SVG world map). Style pins with `--teal` / `--ocean`. Defer if content not ready.

---

## For Schools

### TICKET-040 · Build `/schools` page

| Field | Value |
|-------|-------|
| **Priority** | must-have |
| **Dependencies** | TICKET-002 |

**Description:**  
School leader journey page: wellbeing → achievement → proof → conversation. Use `.split`, `.impact`, `.door` patterns. Include Durlak/Jennings evidence per Evidence doc. Primary CTA: Start the conversation → form anchor.

> **Status (31 Jul 2026):** RF-006 Schools click-through done — locked widths (320–1280) clean; matrix side-scroll / fsr-bloom intentional (not bugs). Ported to `src/pages/schools.astro` from Dave's `fs_review1` handoff. Some images (6 of 17) remain inline base64. Partner-deck download seam (`seams.schools.deck`) still empty (HC-005).

**Acceptance criteria:**
- [ ] Frames wellbeing as path to achievement (per Tim / messaging brief)
- [ ] Partnership tier overview (Educator, School, Network)
- [ ] Proof: renewal rates, Harvard, five-step model
- [ ] No "program rollout" language

---

### TICKET-041 · School discovery form

| Field | Value |
|-------|-------|
| **Priority** | should-have |
| **Dependencies** | TICKET-040 |

**Description:**  
Form on `/schools`: school name, contact name, email, role, country, message. Style with `.news input` patterns. Submit via **Flodesk form, Keela form, Raisely, or custom POST** to `/api/school-inquiry` (optional GCP). Honeypot spam field. Success/error states per Security doc.

> **Status (31 Jul 2026):** Done. Scaffolded per D-04 (Google Form + Slack, superseding this ticket's original Flodesk/Keela/Raisely/custom-POST options), then wired live the same day — `seams.schools.discoveryFormUrl` now points at the real Google Form, embedded on `/schools`.

**Acceptance criteria:**
- [x] Client validation on required fields — n/a under D-04, Google Forms handles its own validation
- [x] Successful submit shows thank-you message in voice & tone — n/a, Google Forms' own confirmation screen
- [x] Failure shows fallback email somesh@contentment.org — n/a now that the form is live; kept as the fallback if the URL is ever cleared
- [x] Notification email to partnerships team — n/a under D-04, uses Google Forms' native Slack notification instead

---

## Get Involved & Homeroom

> **Naming convention:** "Homeroom" refers to two distinct things in this project. `/give/monthly` is the **public Homeroom conversion page** — where cold visitors learn about and join Homeroom. `/homeroom` is the **gated member hub** — password-protected, Phase 2. Do not conflate these when reading the messaging brief, which calls the conversion page "Homeroom" without distinguishing between them.

### TICKET-050 · Build `/give` gateway page

| Field | Value |
|-------|-------|
| **Priority** | must-have |
| **Dependencies** | TICKET-002 |

**Description:**  
Five "seats" per messaging brief using door-card or tier patterns: Homeroom, school, spread, events, educators. Each seat has mechanism line. Homeroom featured first.

> **Status (31 Jul 2026):** RF-006 Give click-through done — locked widths (320–1280) clean; no code fixes. Ported to `src/pages/give.astro` (Get Involved / Homeroom monthly-giving content) from Dave's Jul 29 handoff. D-03/HC-031 (`/give` vs `/give` + `/give/monthly`) still open — single page at `/give` only. Join/give-one-time/ways-to-give seams empty pending Lorna/Keela (HC-075).

**Acceptance criteria:**
- [ ] Five seats in correct order
- [ ] Each seat has distinct secondary CTA link
- [ ] Primary page CTA: Join Homeroom

---

### TICKET-051 · Build `/give/monthly` conversion page

| Field | Value |
|-------|-------|
| **Priority** | must-have |
| **Dependencies** | TICKET-050, TICKET-060 |

**Description:**  
Full Homeroom page per messaging brief: homeroom metaphor, $5 reframe, tiers, founding member CTA, FAQ (include 501(c)(3) + EIN when available), member voices. Reuse `.homeroom` and `.tiers` from prototype. Primary CTA: Become a Founding Member — no competing CTAs.

> **Blocking dependency:** This ticket cannot close until TICKET-060 supplies live Keela checkout URLs. TICKET-060 itself depends on finance providing those URLs — track this as an external dependency and do not hold other sprint work against it. Build page UI and copy in parallel; wire Keela links as the last step.

**Acceptance criteria:**
- [ ] Tier copy matches approved amounts (pending tier decision)
- [ ] 19-member math and Priscillah/Sister Jane quotes included
- [ ] Each tier button links to correct Keela URL
- [ ] FAQ accordion uses `.pcard` pattern or semantic `<details>`

---

### TICKET-060 · Keela donation integration

| Field | Value |
|-------|-------|
| **Priority** | must-have |
| **Dependencies** | Keela URLs from finance |

**Description:**  
Wire all Homeroom CTAs to Keela hosted checkout via env vars. Support tiers $5, $25, $100. Add `data-analytics="cta_homeroom_click"` on buttons. Preserve UTM params in redirect URLs where Keela allows.

**Acceptance criteria:**
- [ ] Nav, hero, homeroom section, `/give/monthly` all link to live Keela
- [ ] No remaining `#` on donation CTAs
- [ ] Env vars documented in `.env.example`
- [ ] Test transaction completed in Keela sandbox/staging

---

## Newsletter & legal

### TICKET-070 · Newsletter integration

| Field | Value |
|-------|-------|
| **Priority** | must-have |
| **Dependencies** | TICKET-010, provider credentials |

**Description:**  
Connect homepage newsletter form and build `/updates` standalone page. Integrate with **Flodesk** (embed or `/api/newsletter` → Flodesk API). Remove `onsubmit="return false"`.

> **Status (31 Jul 2026):** `/updates` page built (linked from Footer Explore, in `sitemap.xml`). The form-submission piece is still the placeholder stub — a first pass wired a direct client-side `fetch` to Flodesk's API, but that doesn't match this doc's own §6.2 spec (server-side `/api/newsletter` using `FLODESK_API_KEY`, server-only) and isn't a verified Flodesk API contract, so it was reverted rather than ship something likely to break. Real submission needs a hosting adapter (FEAT-101) before a server route can exist — blocked on that, not on Flodesk credentials alone.

**Acceptance criteria:**
- [ ] Form submits successfully to email provider — blocked on FEAT-101 (hosting adapter for a server route)
- [x] Inline validation for email format — `required` + `type="email"` on the input
- [ ] Success and error messages on-brand — depends on the real submission path landing first
- [x] `/updates` page live with orientation line

---

### TICKET-071 · Privacy and terms pages

| Field | Value |
|-------|-------|
| **Priority** | must-have |
| **Dependencies** | TICKET-002, legal copy |

**Description:**  
Simple text pages at `/privacy` and `/terms` using `.band` + `.wrap` + `.body` typography. No special components. Link from footer. Privacy page must document cookie/consent compliance per [SECURITY-AND-ACCESS](./SECURITY-AND-ACCESS.md) §5.1 and [DECISION-002](./DECISIONS.md). **Production path:** Astro static routes (`src/pages/privacy.astro`, `src/pages/terms.astro`) — see SECURITY-AND-ACCESS §5.2; planning MD files are spec only, not served publicly.

**Acceptance criteria:**
- [ ] Live at `https://contentment.org/privacy` and `/terms` after deploy (static Astro routes)
- [ ] Linked from footer on every page
- [ ] Cover newsletter, analytics, Keela, form data per Security doc
- [ ] Cookie & privacy compliance section: EU/UK/US regulatory table (GDPR, PECR, CCPA) per SECURITY-AND-ACCESS §5.1
- [ ] Per-tool disclosures: Osano CMP, GA4, Microsoft Clarity, PostHog (cookieless), SendGrid (transactional email)
- [ ] Footer includes **Cookie Preferences** link (Osano re-open)
- [ ] Osano partner badge or CMP attribution on `/privacy` if available from Osano dashboard
- [ ] Legal team sign-off on copy

---

## Analytics & SEO

### TICKET-080 · Analytics setup

| Field | Value |
|-------|-------|
| **Priority** | must-have |
| **Dependencies** | TICKET-002 |

**Description:**  
Add GA4, Microsoft Clarity, and PostHog Cloud (DECISION-007, cookieless) to layout. Wire Osano CMP (Free Plan) with GA4 Consent Mode v2 per [DECISION-002](./DECISIONS.md). Implement conversion events per Frontend Spec §6.4 and [GROWTH-BRIEF](../briefs/GROWTH-BRIEF.md) §1. Wire Sentry per [DECISION-006](./DECISIONS.md). Document UTM convention for campaigns.

> **Status (31 Jul 2026):** Scaffolded — `src/components/Analytics.astro` (Osano → GA4 Consent Mode v2 → Clarity → PostHog, each gated independently on its own env var, all currently unset so nothing ships yet) included once in `BaseLayout.astro`. Sentry wired via `@sentry/astro` in `astro.config.mjs`, client-side only (registered only when `SENTRY_DSN` is set — no server routes exist yet to instrument). `cta_homeroom_click` and `newsletter_submit` wired (`src/scripts/analytics.js` helper) — the Homeroom button fires on click but stays inert until the real Keela URL enables it (HC-075); newsletter fires on the existing client-side submit interaction (no backend yet, FEAT-070). Added the missing `PUBLIC_CLARITY_ID` env var to TECHNICAL-ARCHITECTURE §6.1, plus `.env.example` at repo root and a short UTM-convention note. **Not yet done:** real GA4/PostHog/Osano/Clarity/Sentry credentials — nobody has been assigned to source these yet (flagged, not yet a numbered HC item); pageviews can't record on staging until `PUBLIC_GA_ID` is set.

**Acceptance criteria:**
- [x] Osano CMP script loads before GA4; consent banner shown to EU/UK visitors — wired, inert until `PUBLIC_OSANO_CUSTOMER_ID` exists
- [x] GA4 Consent Mode v2: cookieless/modelled analytics before consent; full cookies after opt-in
- [x] PostHog Cloud (`app.posthog.com`) init with `persistence: 'memory'`
- [x] Sentry (`@sentry/astro`) initialised with `SENTRY_DSN` (DECISION-006)
- [ ] Pageviews recording on staging — blocked on a real `PUBLIC_GA_ID`
- [x] `cta_homeroom_click` fires on button click
- [x] `newsletter_submit` fires on success

---

### TICKET-081 · SEO baseline

| Field | Value |
|-------|-------|
| **Priority** | should-have |
| **Dependencies** | TICKET-002 |

**Description:**  
Per-page `<title>`, meta description, Open Graph tags (use hero or logo image). Generate `sitemap.xml` and `robots.txt`. Organization schema JSON-LD on homepage.

> **Status (31 Jul 2026):** Done. Unique title/description per page (all 7 routes), OG + Twitter card tags and canonical link added to `BaseLayout.astro`, Organization JSON-LD on the homepage (sameAs pulled from `seams.ts` social links). `public/robots.txt`, `public/sitemap.xml`, `public/llms.txt` (DOC-002) and `public/favicon.svg` added. Tried `@astrojs/sitemap` for an auto-generated sitemap but it throws on this Astro 4.16 setup (`Cannot read properties of undefined (reading 'reduce')`) — reverted to the hand-written `sitemap.xml`; revisit if the package fixes the incompatibility, since a static file needs a manual edit whenever a route is added or removed.

**Acceptance criteria:**
- [x] Unique title/description per Phase 1 page
- [x] OG image resolves on share preview
- [x] sitemap lists all public routes

---

## Phase 1.5 / Phase 2

### TICKET-090 · Events & Experiences page

| Field | Value |
|-------|-------|
| **Priority** | should-have |
| **Dependencies** | TICKET-002, event calendar confirmed |

**Description:**  
Build `/events` per messaging brief: event cards with three access badges, Festival block, email capture, past recaps. Member-only events visible; RSVP gated.

> **Status (31 Jul 2026):** RF-006/RF-007 review-only QA pass — locked widths (320–1280): no P0/P1 overflow, broken images, or console errors. Ported to `src/pages/events.astro` from Dave's `events-kit-2026-07-28-page2r4` handoff. **Not production-final** — Dave's second team-notes round still pending (`HANDOFF-contentment-2026-07-27-events-notes.md` "STILL PENDING"); treat as review-only until HC-072 closes. RSVP/join seams empty (HC-071); Flodesk placeholders (FEAT-070).

> **Messaging brief alignment:** The messaging brief treats Events & Experiences as a named page in the core page map (Belief Step 5 — belonging — feeding back into Step 4). Although classified `should-have` here to protect Phase 1 scope, prioritize this page as close to launch as possible. It is the retention step that makes Homeroom membership feel worth renewing. Defer only if event calendar is not confirmed in time.

---

### TICKET-091 · Homeroom gated hub

| Field | Value |
|-------|-------|
| **Priority** | nice-to-have |
| **Dependencies** | TICKET-060, TICKET-092 |

**Description:**  
Password-protected `/homeroom` and up to 3 sub-pages. Edge middleware. Simple password form styled with design system. Not linked from public nav.

---

### TICKET-092 · Homeroom access middleware

| Field | Value |
|-------|-------|
| **Priority** | nice-to-have |
| **Dependencies** | Hosting with edge functions |

**Description:**  
Implement gate per Security doc: env password, rate limit, session cookie. Rotate password procedure documented.

---

### TICKET-093 · About Us page (v1 single page)

| Field | Value |
|-------|-------|
| **Priority** | must-have |
| **Dependencies** | TICKET-002 |

**Description:**  
Build `/about` as a single page (**D-05, resolved 27 Jul 2026** — was single page vs. 5 sub-pages; single page won). The 5 sub-pages (our-work, how-we-work, impact, team, faqs) framing below is superseded — do not build separately; Phase 2 only if ever revisited.

> **Status (31 Jul 2026):** RF-006 About click-through + polish done — locked widths (320–1280) clean, no P0/P1 layout bugs. Social seams wired from live-site footer (D-07); `public/favicon.svg` added (was 404). Newsletter still FEAT-070 placeholder; roster still needs Dave line-by-line on `about-name-manifest.txt` before public deploy. Dave Kebo title remains Chief Media Officer per HC-035.

> **Status (29 Jul 2026):** Ported to `src/pages/about.astro` from Dave's `about-deploy-rev4` handoff (single self-contained page, all photos extracted to `public/assets/ab-*`). One content bug caught and fixed during migration: Dave Kebo's title was transcribed as "Chief Creative Officer," corrected to "Chief Media Officer" per HC-035. Roster otherwise still needs Dave's full line-by-line sign-off before public deploy (`about-name-manifest.txt`).

---

### TICKET-094 · Campaign page template

| Field | Value |
|-------|-------|
| **Priority** | nice-to-have |
| **Dependencies** | TICKET-080 |

**Description:**  
Reusable template for `/festival/2026` and `/10years`. Dedicated analytics. Email capture block. Archive redirect strategy.

---

## Launch

### TICKET-100 · Pre-launch QA checklist

| Field | Value |
|-------|-------|
| **Priority** | must-have |
| **Dependencies** | All must-have tickets |

**Description:**  
Run full QA: all routes, all CTAs, forms, mobile, a11y axe scan, cross-browser (Chrome, Safari, Firefox), performance Lighthouse, messaging handoff checklist §12. For the a11y pass, work through `ACCESSIBILITY.md` §1 (checklist) and §4 (known gaps) rather than just the axe scan — axe catches missing attributes, not missing focus management.

**Acceptance criteria:**
- [ ] All must-have tickets closed
- [ ] No critical a11y issues
- [ ] `ACCESSIBILITY.md` §4 known gaps resolved or explicitly deferred with a ticket
- [ ] Keela live transaction verified
- [ ] Redirect plan for old URLs executed
- [ ] `somesh@contentment.org` monitored for form notifications

---

### TICKET-101 · Production deploy + DNS

| Field | Value |
|-------|-------|
| **Priority** | must-have |
| **Dependencies** | TICKET-100 |

**Description:**  
Deploy to production host. Point contentment.org DNS. SSL verified. Env vars set. Rollback procedure documented.

**Acceptance criteria:**
- [ ] https://contentment.org loads homepage
- [ ] All Phase 1 routes work on production
- [ ] Preview branch deploys work for future PRs

---

## Ticket summary

| Priority | Count |
|----------|------:|
| must-have | 14 |
| should-have | 8 |
| nice-to-have | 6 |

**Suggested sprint order:** 001 → 002 → 003 → 010 → 011 → 004 → 020 → 030 → 031 → 040 → 050 → 060 → 051 → 070 → 071 → 080 → 081 → 100 → 101

> TICKET-011 (homepage copy audit) added after 010; TICKET-081 (SEO baseline) added before 100 — both were missing from the previous order.

---

## Related documents

| Document | Location |
|----------|----------|
| PRD | [PRD.md](./PRD.md) |
| Technical architecture | [TECHNICAL-ARCHITECTURE.md](./TECHNICAL-ARCHITECTURE.md) |
| Frontend spec | [FRONTEND-SPECIFICATION.md](./FRONTEND-SPECIFICATION.md) |
| Accessibility checklist & ARIA patterns (TICKET-100 a11y pass) | [ACCESSIBILITY.md](./ACCESSIBILITY.md) |
| Open decisions | [DECISIONS.md](./DECISIONS.md) |

---

## Changelog

| Date | Change |
|------|--------|
| 2026-06 | Initial feature ticket list for Phase 1 MVP. |
| 2026-06 | Fixed sprint order (TICKET-060 moved after 050; TICKET-020 does not depend on Keela). Added Homeroom naming convention note. Added external content dependency note to TICKET-030. Added Keela blocking chain note to TICKET-051. Added messaging brief alignment note to TICKET-090. |
| 2026-06 | Sprint order corrected: TICKET-011 (homepage copy audit) and TICKET-081 (SEO baseline) were missing — both added in correct dependency position. |
| 2026-07-29/30 | Astro migration status added to TICKET-010/020/031/040/050/090/093 (all ported to `src/pages/` from Dave's Jul 29 handoff; see TRACKER.md for full detail). **TICKET-093 corrected**: was "About section (5 pages)," now "About Us page (v1 single page)" per D-05 (resolved 27 Jul) — the 5-sub-page framing was stale. TICKET-003 (mobile nav drawer) acceptance criteria all checked — done 30 Jul. |
| 2026-07-31 | TICKET-081 (SEO baseline) done — all acceptance criteria checked. TICKET-080 (Analytics) scaffolded — all criteria checked except live pageviews on staging, blocked on real credentials (none exist yet). See TRACKER.md for the full FEAT-080/081 detail. |
| 2026-07-31 | TICKET-011 (homepage copy audit) done. TICKET-041 (school form) scaffolded per D-04, blocked on the Google Form itself existing. TICKET-070 (newsletter) — `/updates` page built, form submission reverted back to a placeholder after an unverified direct-to-Flodesk-API implementation was caught in review (doesn't match this doc's own §6.2 spec, blocked on FEAT-101 for a real server route). See TRACKER.md for full detail. |
| 2026-07-31 | TICKET-041 (school form) Done — the Google Form URL landed same-day, all acceptance criteria checked. |
