# Feature Ticket List — contentment.org

> **Status:** Draft  
> **Last updated:** June 2026  
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
- [ ] All main nav links accessible on mobile
- [ ] Keyboard navigable; `aria-expanded` on menu button
- [ ] Body scroll locked when menu open
- [ ] Visual style matches existing header (deep background)

---

### TICKET-004 · Wire all nav and footer links

| Field | Value |
|-------|-------|
| **Priority** | must-have |
| **Dependencies** | TICKET-002 |

**Description:**  
Replace `href="#"` and hash-only links with real routes per [Website Architecture](../WEBSITE-ARCHITECTURE.md). Footer Explore/Get Involved columns map to Phase 1 pages. Social links: LinkedIn, Instagram, YouTube URLs from comms team (use placeholders only if URLs not yet provided — document in README).

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

**Acceptance criteria:**
- [ ] Visual parity with prototype on desktop and mobile
- [ ] All animations work; reduced motion disables orbit scroll
- [ ] All images load from `assets/`
- [ ] Lighthouse performance ≥ 85 mobile

---

### TICKET-011 · Homepage copy audit vs messaging brief

| Field | Value |
|-------|-------|
| **Priority** | should-have |
| **Dependencies** | TICKET-010 |

**Description:**  
Compare homepage copy to [Messaging brief §6 Home](../MESSAGING-AND-COPY.md). Update headlines/subheads only where brief specifies different copy. Do not change layout. Ensure orientation line, three beats, and proof stats match Section 8 exactly.

**Acceptance criteria:**
- [ ] Stats: 325 schools, 12 countries, 11,925 educators, 409,625+ students, 86%
- [ ] Primary CTA label: "Join Homeroom, from $5/month"
- [ ] No banned words (donor, em dashes, quiet, steady, upstream)
- [ ] Tagline in footer matches verbatim

---

## Why Teacher Wellbeing

### TICKET-020 · Build `/why` page

| Field | Value |
|-------|-------|
| **Priority** | must-have |
| **Dependencies** | TICKET-002, TICKET-001 |

**Description:**  
Long-form page using existing section patterns (`.split`, `.impact`, `.quote-card`, `.band`). Structure per messaging brief: objection → weight → ripple → reflection pause → why now → evidence → "but what about" cards → Peter's school → CTA. Open with orientation line. Primary CTA: Join Homeroom. Secondary: Share this page.

**Acceptance criteria:**
- [ ] Passes first-time visitor test (messaging brief §5)
- [ ] Citations: Harvard, 86%, Bhutan, Hawaiʻi renewal — link to [Evidence doc](../EVIDENCE-AND-RESEARCH.md) where cited
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

**Acceptance criteria:**
- [ ] Client validation on required fields
- [ ] Successful submit shows thank-you message in voice & tone
- [ ] Failure shows fallback email hello@contentment.org
- [ ] Notification email to partnerships team

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

**Acceptance criteria:**
- [ ] Form submits successfully to email provider
- [ ] Inline validation for email format
- [ ] Success and error messages on-brand
- [ ] `/updates` page live with orientation line

---

### TICKET-071 · Privacy and terms pages

| Field | Value |
|-------|-------|
| **Priority** | must-have |
| **Dependencies** | TICKET-002, legal copy |

**Description:**  
Simple text pages at `/privacy` and `/terms` using `.band` + `.wrap` + `.body` typography. No special components. Link from footer.

**Acceptance criteria:**
- [ ] Pages readable and linked from footer
- [ ] Cover newsletter, analytics, Keela, form data per Security doc
- [ ] Legal team sign-off on copy

---

## Analytics & SEO

### TICKET-080 · Analytics setup

| Field | Value |
|-------|-------|
| **Priority** | must-have |
| **Dependencies** | TICKET-002 |

**Description:**  
Add Plausible or GA4 script to layout. Implement conversion events per Frontend Spec §6.4. Document UTM convention for campaigns.

**Acceptance criteria:**
- [ ] Pageviews recording on staging
- [ ] `cta_homeroom_click` fires on button click
- [ ] `newsletter_submit` fires on success
- [ ] Cookie consent if required

---

### TICKET-081 · SEO baseline

| Field | Value |
|-------|-------|
| **Priority** | should-have |
| **Dependencies** | TICKET-002 |

**Description:**  
Per-page `<title>`, meta description, Open Graph tags (use hero or logo image). Generate `sitemap.xml` and `robots.txt`. Organization schema JSON-LD on homepage.

**Acceptance criteria:**
- [ ] Unique title/description per Phase 1 page
- [ ] OG image resolves on share preview
- [ ] sitemap lists all public routes

---

## Phase 1.5 / Phase 2

### TICKET-090 · Events & Experiences page

| Field | Value |
|-------|-------|
| **Priority** | should-have |
| **Dependencies** | TICKET-002, event calendar confirmed |

**Description:**  
Build `/events` per messaging brief: event cards with three access badges, Festival block, email capture, past recaps. Member-only events visible; RSVP gated.

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

### TICKET-093 · About section (5 pages)

| Field | Value |
|-------|-------|
| **Priority** | nice-to-have |
| **Dependencies** | TICKET-002, content briefs |

**Description:**  
Build `/about` and sub-pages: our-work, how-we-work, impact, team, faqs.

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
Run full QA: all routes, all CTAs, forms, mobile, a11y axe scan, cross-browser (Chrome, Safari, Firefox), performance Lighthouse, messaging handoff checklist §12.

**Acceptance criteria:**
- [ ] All must-have tickets closed
- [ ] No critical a11y issues
- [ ] Keela live transaction verified
- [ ] Redirect plan for old URLs executed
- [ ] `hello@contentment.org` monitored for form notifications

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

**Suggested sprint order:** 001 → 002 → 003 → 010 → 004 → 020 → 030 → 031 → 040 → 050 → 060 → 051 → 070 → 071 → 080 → 100 → 101

---

## Related documents

| Document | Location |
|----------|----------|
| PRD | [PRD.md](./PRD.md) |
| Technical architecture | [TECHNICAL-ARCHITECTURE.md](./TECHNICAL-ARCHITECTURE.md) |
| Frontend spec | [FRONTEND-SPECIFICATION.md](./FRONTEND-SPECIFICATION.md) |

---

## Changelog

| Date | Change |
|------|--------|
| 2026-06 | Initial feature ticket list for Phase 1 MVP. |
| 2026-06 | Fixed sprint order (TICKET-060 moved after 050; TICKET-020 does not depend on Keela). Added Homeroom naming convention note. Added external content dependency note to TICKET-030. Added Keela blocking chain note to TICKET-051. Added messaging brief alignment note to TICKET-090. |
