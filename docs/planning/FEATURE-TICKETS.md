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
- [x] All CSS custom properties match prototype exactly
- [x] Nav and footer render pixel-identical to current homepage
- [x] Google Fonts link unchanged
- [x] `prefers-reduced-motion` rules preserved in global CSS
- [x] Homepage still works when using extracted layout

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
- [x] No `href="#"` on primary nav items (internal routes wired)
- [ ] Homeroom nav CTA → `/give/monthly` (interim: `/give` until D-03 / Keela)
- [x] Footer links resolve to correct routes or external social URLs (D-07)
- [x] Hash links on homepage (`#why`, etc.) still work on `/` only
- [x] Aug 3 — Sign In → `school.contentment.org`; Donate → `/give` fallback; known homepage CTAs wired (Spread the movement still TBD WJ)

> **Update (3 Aug 2026):** Wired known destinations ahead of Kristina's full Miro inventory (HC-005 still Open).
> **Update (4 Aug 2026):** Donate → `/#homeroom` (Keela General Donation Form live). `giveOneTime` → `/#homeroom`. Per-tier Homeroom join + Events RSVP seams still open (HC-075/071).

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
>
> **Update (4 Aug 2026):** Dummy donate form (and `data-group="donor"`) replaced by Keela General Donation Form embed — flag closed.

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
>
> **Update (4 Aug 2026):** Keela General Donation Form live in give band. Newsletter still placeholder (FEAT-070).

> **Status (29–30 Jul 2026):** Ported verbatim to `src/pages/why.astro` from Dave's Jul 29 2026 handoff. Fixed one real bug during migration: the stat numbers (86%, 90%+, 9 in 10, National) shared the homepage's `.num` class, which the site-wide count-up script would have overwritten with "NaN" on scroll — renamed to `.rnum`. Content/UX acceptance criteria below are unverified against the messaging brief (technical migration only, not a copy audit).

**Acceptance criteria:**
- [ ] Passes first-time visitor test (messaging brief §5)
- [ ] Citations: Harvard, 86%, Bhutan, Hawaiʻi renewal — link to [Evidence doc](../research/EVIDENCE-AND-RESEARCH.md) where cited
- [ ] Uses only approved design system components
- [x] Share button triggers Web Share API or copy-link fallback

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

### TICKET-033 · Foundation Reach Map (`/foundation-reach-map`)

| Field | Value |
|-------|-------|
| **Priority** | nice-to-have |
| **Dependencies** | TICKET-031 |
| **Status** | **Paused** — working prototype, publicly reachable, design work paused by choice |

**Description:**  
Flat **D3 + topojson-client** world map with a pin card per served country, intended for the homepage once approved. `public/foundation-reach-map.html` → `/foundation-reach-map` (a `netlify.toml` 200 rewrite). Bundled map data in `assets/countries-110m.js`; stories shared with the Story Board via `program-data.js`. Desktop: hanging pendulum pin cards (hover to preview, click for modal). Mobile (`pointer:coarse`): 18 px balloon pins that scale with zoom (√zoom), with a bottom-sheet picker when pins crowd. Style pins with `--teal` / `--ocean` when it is restyled to site tokens.

> **Retitled 5 Aug 2026** from "Interactive global map". The old title named no route and no artefact, so it was impossible to tell from the ticket that a **live URL already existed** on the preview. "Paused" refers to the *design* work, not to availability. **NEEDS TEAM REVIEW** — never went through Kristina's page list. Notes: [`prototypes/phase-2/world-map/README.md`](../../prototypes/phase-2/world-map/README.md).

---

### TICKET-034 · Story Board prototype (`/story-board`)

| Field | Value |
|-------|-------|
| **Priority** | nice-to-have |
| **Dependencies** | TICKET-031 |
| **Status** | **Paused** — working prototype, publicly reachable, design work paused by choice |

**Description:**  
A feed-style way to browse programme stories, built to test the format before committing homepage space to it. `public/story-board.html` → `/story-board` (200 rewrite), with the feed guide at `/story-board-feed-guide`. Shares `program-data.js` with the Reach Map. Accessibility gaps (dialog focus trap, `aria-pressed`, live region) already fixed under **OPS/QA-001**.

> **Ticket created 5 Aug 2026.** The route was live on the preview and listed in the pages table but had **no ticket row**, so it was invisible to anyone tracking work on the Tickets tab — the same gap TICKET-072/073 closed for `/404` and `/updates`. **NEEDS TEAM REVIEW.**

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

> **Status (3 Aug 2026):** Scheduled Phase 2. Form + Slack still exist (built 31 Jul). Kristina Miro (3 Aug): hold the embed — ship the simple `/schools` page and re-integrate only if people aren't using the mailto / Start a Conversation path. Embed commented out; `discoveryFormUrl` cleared (URL in seams comment).

**Prior status (31 Jul 2026):** Done — scaffolded per D-04, then wired live the same day.

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
>
> **Update (4 Aug 2026):** `giveOneTime` → `/#homeroom` (General Donation Form). Join Homeroom tiers deep-link to homepage form with selected amount (`seams.homeroomDonateUrl`). `joinTiers` + `waysToGive` still empty.

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
| **Status** | 🟡 In Progress (4 Aug 2026) |

**Description:**  
Wire all Homeroom CTAs to Keela hosted checkout via env vars. Support tiers $5, $25, $100. Add `data-analytics="cta_homeroom_click"` on buttons. Preserve UTM params in redirect URLs where Keela allows.

> **Update (4 Aug 2026):** Interim path shipped — **General Donation Form** (Keela org `CBbknhqovLi8DNEzW`, embed `https://give-usa.keela.co/embed/MnqZFksL49Ym3M8Ho`) for all regions except India (deferred). Master script in `KeelaScripts.astro` (BaseLayout `<head>`); embed in `KeelaDonateForm.astro` on homepage Homeroom + `/why` give band. Recorded in `seams.keela`. Donate CTAs → `/#homeroom`; `giveOneTime` → same. CSP allows `cdn.keela.co` + `*.keela.co`. **Aug 4 follow-on:** `/give` Join Homeroom tiers deep-link to `/?amount=25|50|100&frequency=monthly#homeroom` (`seams.homeroomDonateUrl`); form forwards those params onto the Keela iframe. **Still open:** per-tier Homeroom `joinTiers` hosted URLs, India region, live test transaction, `/give/monthly` routing (D-03).

**Acceptance criteria:**
- [x] Homepage Homeroom + `/why` donate widgets use live Keela embed (General Donation Form)
- [x] Donate nav/footer no longer `#` — points to `/#homeroom`
- [ ] Per-tier Homeroom `joinTiers` wired on `/give` Join Homeroom
- [ ] India region form (deferred)
- [ ] Env vars documented in `.env.example` (tier URLs — when per-tier products land)
- [ ] Test transaction completed in Keela sandbox/staging
- [ ] `/give/monthly` (or D-03 equivalent) linked once routing lands

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
>
> **Update (4 Aug 2026) — shipped; §6.2 Option B, via a host-native function.** The "needs a hosting adapter first" framing above was too narrow. §6.2 requires a *server-side* home for `FLODESK_API_KEY` — it does not require that home to be an Astro route. `netlify/functions/newsletter.mjs` (preview) and `api/newsletter.js` (Vercel target) share one core, `src/lib/flodesk.js`; `netlify.toml` rewrites `/api/newsletter` → the function so both hosts expose the same path. **`astro.config.mjs` stays `output: 'static'` with no adapter**, so the 3 Aug security revert holds and **FEAT-101 no longer blocks this ticket**.
>
> API contract verified against developers.flodesk.com before writing code — Basic auth `base64('KEY:')`, `POST /v1/subscribers`, then `POST /v1/subscribers/{email}/segments` (the authoritative segment attach; an upsert alone won't re-segment an existing subscriber). That unverified-contract failure is exactly what caused the 31 Jul revert.
>
> **11 capture points** across home, `/about`, `/why`, `/updates`, `/events` — honeypot, inline `aria-live` success/error, and one shared `<CaptureModal />` serving the 4 Events link-CTAs. Segment IDs are env-driven (`SEGMENT_ENV_BY_SOURCE` → `FLODESK_SEGMENT_*`, listed by `scripts/flodesk-segments.mjs`), never hardcoded. Assignments came from **Kristina's Miro board CTA suggestions**: 8 → `www.contentment.org`; `/events` hero Save-my-free-spot → `Contentment Festival`.
>
> **Still pending Kristina + WoeiJing (D-24):** `/updates` form, `/events` top capture fold, and the 3 Upcoming-grid CTAs (Save my spot / Be first to know / Join the waitlist) which still only scroll to `#ev-signup`. Interim `FLODESK_SEGMENT_DEFAULT` → `www.contentment.org`.
>
> **Not yet done:** live end-to-end submit test; rate limiting (`UPSTASH_*` unset — the endpoint is public behind only a honeypot); Vercel-side verification at cutover. **Behaviour change:** `newsletter_submit` now fires on a confirmed subscribe rather than on click (TICKET-080).

**Acceptance criteria:**
- [x] Form submits successfully to email provider — `/api/newsletter` → Flodesk (`src/lib/flodesk.js`); **live end-to-end submit still untested**
- [x] Inline validation for email format — `required` + `type="email"` on the input
- [x] Success and error messages on-brand — `.nl-status` in `global.css`, `role="status"` + `aria-live="polite"`, tone-styled for light and dark bands
- [x] `/updates` page live with orientation line
- [ ] Remaining CTA→segment assignments confirmed (D-24 — Kristina + WoeiJing)
- [ ] Rate limiting on the public endpoint (`UPSTASH_*`)

---

### TICKET-071 · Privacy & cookies page (`/privacy`)

| Field | Value |
|-------|-------|
| **Priority** | should-have |
| **Dependencies** | TICKET-002, legal copy (D-08) for the legal half only |
| **Status** | **Done (5 Aug 2026)** — cookie half shipped; legal half owed by Lorna + Finance/Legal |

**Description:**  
Text page at `/privacy` using `.band` + `.wrap` + `.body` typography. Documents cookie/consent compliance per [SECURITY-AND-ACCESS](./SECURITY-AND-ACCESS.md) §5.1 and [DECISION-002](./DECISIONS.md). **Production path:** Astro static route `src/pages/privacy.astro` — planning MD files are spec only, not served publicly.

> **Scope split (5 Aug 2026).** This ticket previously read "Privacy **and terms** pages" and covered both routes. When `/privacy` shipped and the ticket was marked Done, that made it look as though `/terms` had shipped too — it has not been started. **Terms is now TICKET-074.**
>
> **Counted in Phase 1 *and* Phase 2** by Somesh's call. Phase 1 because a page declaring our cookies and analytics is a compliance requirement in the regions we serve, and shipping analytics without one is real exposure rather than a nice-to-have. Phase 2 because the page will keep evolving through review by Kristina, Lorna and Nav.
>
> **Done means the cookie half**, and the page says so on itself so no visitor is misled: live Cookiebot declaration (Necessary 4 / Statistics 11 / Marketing 7 after the 5 Aug rescan), a working Cookie Preferences trigger (`Cookiebot.renew()`), per-tool disclosures, and the regional compliance table. It fixed two real defects — the consent banner linked to a **404**, and Cookiebot's standard copy promised withdrawal "from the Cookie Declaration on our website" when neither the declaration nor any withdrawal path existed.
>
> **Done does not mean complete.** Controller identity, lawful basis, retention, data-subject rights, transfers and complaints are still owed under D-08 and drop into a marked section in `privacy.astro`. The cookie half needs no rework when they land.

**Acceptance criteria:**
- [x] Live at `/privacy` (static Astro route) — live on preview; production URL at cutover
- [x] Linked from footer on every page
- [x] Cookie & privacy compliance section: EU/UK/US regulatory table (GDPR, PECR, CCPA) per SECURITY-AND-ACCESS §5.1
- [x] Per-tool disclosures: Cookiebot CMP, GA4, Microsoft Clarity, PostHog (cookieless), Sentry
- [x] Footer includes **Cookie Preferences** link (Cookiebot re-open)
- [x] Cookiebot CMP attribution on `/privacy` (free tier requires the "Powered by Cookiebot" mark)
- [ ] Cover newsletter, Keela and form data in the legal text — **D-08, Lorna + Finance/Legal**
- [ ] Legal team sign-off on copy — **D-08**

---

### TICKET-074 · Terms of Use page (`/terms`)

| Field | Value |
|-------|-------|
| **Priority** | should-have |
| **Dependencies** | TICKET-002, **terms copy (D-08)** |
| **Status** | **Blocked** — waiting on Lorna + Finance/Legal |

**Description:**  
Static Astro route `src/pages/terms.astro` on the same branded utility pattern already built for `/privacy`. Linked from the footer.

> **Split out of TICKET-071 on 5 Aug 2026.** Unlike `/privacy`, there is no half we can ship on our own: `/privacy` had a live Cookiebot cookie declaration to stand on, `/terms` has no equivalent — every word of it is legal copy we do not own. Build effort once the copy lands is roughly an hour, because the utility-page pattern, footer link and route conventions all already exist.
>
> **Does not block the Aug 21 Phase 1 go-live** (D-08 confirmed Low priority, Phase 1.5 or 2 — TBD).

**Acceptance criteria:**
- [ ] Terms copy supplied — **D-08, Lorna + Finance/Legal**
- [ ] Live at `/terms` (static Astro route)
- [ ] Linked from footer on every page
- [ ] Legal team sign-off on copy

---

### TICKET-072 · Branded 404 page (`/404`)

| Field | Value |
|-------|-------|
| **Priority** | should-have |
| **Dependencies** | TICKET-002 |
| **Status** | **Done (2 Aug 2026)** — needs team review |

**Description:**  
Branded error page shown for any unmatched URL, so someone who mistypes or follows a dead link stays inside the site instead of bouncing. `src/pages/404.astro`, `noindex, follow`, short brand-gradient hero + 6 destination cards, reusing existing tokens and `.anim` — no new design language. Netlify serves `dist/404.html` automatically.

> **Ticket created retrospectively 5 Aug 2026.** The page shipped 2 Aug with no ticket row, so it existed only in the Reference tab's pages table and was invisible to anyone tracking work on the Tickets tab. **NEEDS TEAM REVIEW** — the 6 destination cards and the copy never went through Kristina's page list.

**Acceptance criteria:**
- [x] Branded page renders for any unmatched URL
- [x] `noindex, follow`
- [x] Verified at 1280 px and 390 px
- [ ] Copy + destination cards reviewed by Kristina

---

### TICKET-073 · Newsletter signup page (`/updates`)

| Field | Value |
|-------|-------|
| **Priority** | should-have |
| **Dependencies** | TICKET-002, TICKET-070 |
| **Status** | **Done (31 Jul 2026)** — needs team review |

**Description:**  
The standalone destination for subscribe links that need a real page rather than an inline form (Footer Explore column, `sitemap.xml`). `src/pages/updates.astro`, form wired to Flodesk 4 Aug via `<NewsletterForm source="updates_page" bare />`; segment confirmed `www.contentment.org`.

> **Ticket created retrospectively 5 Aug 2026**, same reason as TICKET-072 — the page had no Tickets-tab row. **NEEDS TEAM REVIEW**: built without reaching Kristina's page list, so its copy and framing have had no non-engineering review.

**Acceptance criteria:**
- [x] Page live with orientation line
- [x] Form wired to Flodesk with a confirmed segment
- [ ] Copy + framing reviewed by Kristina

---

## Analytics & SEO

### TICKET-080 · Analytics setup

| Field | Value |
|-------|-------|
| **Priority** | must-have |
| **Dependencies** | TICKET-002 |

**Description:**  
Add GA4, Microsoft Clarity, and PostHog Cloud (DECISION-007, cookieless) to layout. Wire Cookiebot CMP (Free Plan) with GA4 Consent Mode v2 per [DECISION-002](./DECISIONS.md). Implement conversion events per Frontend Spec §6.4 and [GROWTH-BRIEF](../briefs/GROWTH-BRIEF.md) §1. Wire Sentry per [DECISION-006](./DECISIONS.md). Document UTM convention for campaigns.

> **Status (5 Aug 2026):** **Live and verified.** All five HC-076 credentials landed and are set in Netlify. Verified on the wire against contentmentweb2.netlify.app: **GA4** `/g/collect` → 204 (`en=page_view`), **Clarity** `r.clarity.ms/collect` → 204, **Sentry** ingest envelope → 200 ×4 from a real uncaught error, and the **Cookiebot** consent bridge flipping GA4 from `gcs=G100` to **`gcs=G111`** on accept. **PostHog is the one exception** — it initialises correctly (`persistence: 'memory'`, config 200) but no capture request was ever observable from an automated browser; Sam confirms events arriving in the PostHog dashboard, so it is recorded on his evidence, not ours. **Two real bugs fixed on the way:** the hand-rolled PostHog stub never set `__SV`/`_i`, so `array.js` discarded our config and silently fell back to `localStorage+cookie` — the DECISION-002/007 cookieless guarantee was cosmetic; and the CSP allowlisted `cmp.osano.com` only, so the new CMP would have been blocked outright (Cookiebot needs `consentcdn.cookiebot.com` on **frame-src** — its banner is an iframe, which Osano never required). **CMP vendor changed Osano → Cookiebot** (DECISION-002 amendment) running `data-blockingmode="manual"` with a **custom banner** whose sources live in `docs/cookiebot/`; that took the banner from 374x800 on a 390px phone (95% of the screen) to **390x155**. Consent method is **explicit**. Consent Mode signal set completed (`functionality_storage`, `personalization_storage`, `security_storage`, `ads_data_redaction`, `url_passthrough`). **Still open:** Cookiebot's free tier allows one domain — it must move to `www.contentment.org` at DNS cutover or the banner silently no-ops.

**Acceptance criteria:**
- [x] Cookiebot CMP script loads before GA4; consent banner shown to EU/UK visitors — wired, inert until `PUBLIC_COOKIEBOT_ID` exists
- [x] GA4 Consent Mode v2: cookieless/modelled analytics before consent; full cookies after opt-in
- [x] PostHog Cloud (`us.i.posthog.com`; `us.i.posthog.com` is an alias) init with `persistence: 'memory'`
- [x] Sentry (`@sentry/astro`) initialised with `SENTRY_DSN` (DECISION-006)
- [x] Pageviews recording on staging — blocked on a real `PUBLIC_GA_ID`
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

### TICKET-095 · Press & Media page (`/press`)

| Field | Value |
|-------|-------|
| **Priority** | nice-to-have |
| **Dependencies** | TICKET-002, press assets from Comms |
| **Status** | **Scheduled** — Phase 2, not started |

**Description:**  
Footer / outreach destination holding press assets, boilerplate and a media contact.

> **Ticket created 5 Aug 2026.** `/press` had been listed in the pages table since the start with no ticket row, so it never appeared in any status view.

---

### TICKET-096 · Impact naming — resolved to `/our-impact`

| Field | Value |
|-------|-------|
| **Priority** | nice-to-have |
| **Dependencies** | TICKET-031 |
| **Status** | ✅ **Done (5 Aug 2026)** — resolved; no separate page will be built |

**Description:**  
Resolves the `/impact` vs `/our-impact` naming overlap.

> **Resolved by Somesh, 5 Aug 2026 — `/our-impact` is the impact page**, it is live, and it is already the route in use. **No separate `/impact` page will be built**; the Phase 2 nav item is superseded, not deferred.
>
> **No redirect is needed.** `/impact` has never existed as a live route — verified against `src/`, `public/sitemap.xml`, `netlify.toml` and `vercel.json`, none of which reference it. There is nothing to redirect from.
>
> Raised and closed the same day. The ticket existed for one reason — to give the overlap an owner — and it is recorded as Done rather than deleted so the decision stays visible on the Sheet instead of vanishing. The clash had been noted in the pages table since 27 Jul without ever becoming a tracked item.
>
> Ongoing work on the page itself lives on **TICKET-031** (index) and **TICKET-030** (story content, blocked on comms).

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
- [ ] Internal project docs are **not** publicly accessible: Footer “Project docs” removed; production build does not publish `public/docs` / does not run `copy-docs.sh` into the deploy artifact; `/docs` and `/docs/*` 404 (or equivalent) on contentment.org; `docs/` sources stay in the private GitHub repo only (HC-077, TICKET-102)
- [ ] Cookiebot's single registered domain moved to `www.contentment.org` — the free tier allows **one** domain and the banner silently no-ops on any other (HC-067)
- [ ] Every `PUBLIC_*` and server-side env var set on the production host, not just Netlify
- [ ] GA4 / Clarity / Sentry / Cookiebot re-verified on the production domain

---

### TICKET-102 · Internal docs hub (`/docs`) — publish now, unpublish at cutover

| Field | Value |
|-------|-------|
| **Priority** | should-have |
| **Dependencies** | TICKET-101 |
| **Status** | **In Progress** — live on preview by design; must be unpublished at cutover |

**Description:**  
The team-facing planning and brief hub — DEV-TIMELINE, the TEAM/TECH/GROWTH/AUTOMATION briefs and the planning index — published so non-engineering readers can self-serve status without a repo checkout. `scripts/copy-docs.sh` copies `docs/*.html` → `public/docs` (and `site/docs`) at build time; both generated directories are gitignored.

> **Ticket created 5 Aug 2026.** `/docs` is a publicly reachable route, linked from the Footer as "Project docs", that appeared in **no ticket and no page table** — the same visibility gap TICKET-072/073 closed, but this one carries a real security action at cutover that lived only inside a checklist item. Pairs [SECURITY-AND-ACCESS](./SECURITY-AND-ACCESS.md) §8 and [TECHNICAL-ARCHITECTURE](./TECHNICAL-ARCHITECTURE.md) §12 step 3b.

**Acceptance criteria:**
- [x] `/docs` reachable on the Netlify preview and linked from the Footer
- [x] `public/docs` and `site/docs` gitignored — sources edited in `docs/` only
- [ ] **At cutover (HC-077):** Footer "Project docs" link removed
- [ ] **At cutover:** production build skips `copy-docs.sh` / does not publish `public/docs`
- [ ] **At cutover:** `/docs*` 404s on contentment.org; `docs/` stays in the private repo only

---

### OPS-004 · Generate both timeline briefs from `launch-plan-data.json`

| Field | Value |
|-------|-------|
| **Priority** | should-have |
| **Dependencies** | — |
| **Status** | **Done (5 Aug 2026)** |

**Description:**  
`scripts/refresh-timelines.py`. The two timeline HTMLs were the only team-facing artefact not downstream of `launch-plan-data.json`, so they could only drift — and did, sitting two days stale on the very page the team had been pointed at for self-serve status.

> **ID-keyed in-place rewrite, not template regeneration.** Both files stay hand-authored designs; the script rewrites only the ID-keyed status spans, their note cells and the `As of` stamp. Guards are all fail-closed: slot counts per file, a reflow tripwire, exactly one `As of` stamp, unknown ticket id or status is a hard error, <10 % size delta, stale-pin detection, and a post-condition that re-runs the slot regex against the generated output. `--check` exits 1 when stale, so it works as a pre-commit gate.
>
> **Ticket created retrospectively 5 Aug 2026** — the script shipped and is referenced in TRACKER, but had no ticket row.

**Acceptance criteria:**
- [x] Both files regenerate from JSON; second run reports 0 changes (idempotent)
- [x] `--check` exits 1 when stale
- [x] Guards verified by deliberately breaking the input
- [x] **0 orphans** — every JSON ticket has a slot in both files (17 slots added 5 Aug)

---

## Ticket summary

| Priority | Count |
|----------|------:|
| must-have | 14 |
| should-have | 14 |
| nice-to-have | 9 |

**Suggested sprint order:** 001 → 002 → 003 → 010 → 011 → 004 → 020 → 030 → 031 → 040 → 050 → 060 → 051 → 070 → 071 → 080 → 081 → 100 → 101

> TICKET-011 (homepage copy audit) added after 010; TICKET-081 (SEO baseline) added before 100 — both were missing from the previous order.
>
> **5 Aug 2026 — nine tickets added, none of them new work.** TICKET-034, 072, 073, 074, 095, 096, 102 and OPS-004 all describe work that had already shipped, was already live on the preview, or was already in the pages table — but had **no ticket row**, so it appeared in no status view and nobody outside engineering could see or question it. Counts above move accordingly (should-have 8 → 14, nice-to-have 6 → 9). They sit outside the sprint order because none of them is sequenced work: four are already Done, two are Paused prototypes, two are Phase 2, and one (`/terms`) is blocked on legal copy.

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
| 2026-08-03 | TICKET-041 → Scheduled Phase 2. Kristina Miro: hold Google Form embed; test simple `/schools` page first. Embed commented off; seam URL cleared (retained in comment). |
| 2026-08-04 | TICKET-101 — acceptance: unpublish internal `/docs` + Footer “Project docs” at production cutover (repo keeps docs; public site must not). |
| 2026-08-04 | Somesh — `/getinvolved` `#donate` split (Keela General Donation Form + `gi-donate-photo.jpg`); Nav `aria-current` underline; `/schools` `fs-Jadielsm.jpg` photo swap. See TRACKER changelog. |
| 2026-08-05 | **TICKET-071 split.** Was "Privacy **and terms** pages" and was marked Done when `/privacy` shipped — which read as though `/terms` had shipped too. `/privacy` keeps 071 (Done, cookie half; legal half owed under D-08); **`/terms` is now TICKET-074** (Blocked on legal copy, Phase 1.5). |
| 2026-08-05 | **Eight tickets added for work that already existed but had no ticket row:** TICKET-034 (`/story-board`), 072 (`/404`), 073 (`/updates`), 074 (`/terms`), 095 (`/press`), 096 (`/impact`), 102 (`/docs`) and OPS-004 (timeline generator). Five of those routes are publicly reachable on the preview today. **TICKET-033 retitled** "Interactive global map" → "Foundation Reach Map (`/foundation-reach-map`)" — the old title named no route, so nothing indicated a live URL existed. TICKET-101 acceptance extended with the three cutover steps that silently fail if skipped (Cookiebot domain move, production env vars, post-cutover analytics re-verification). |
| 2026-08-05 | **Ticket statuses re-cut against a written rule.** Twelve tickets sat at "In Progress" whether the remaining work was ours or someone else's. New rule: work on us = In Progress/Done/Scheduled; fully stopped on another person = **Blocked**; part landed, part owed = **Partial** — and a new **Waiting on** column names the person. Nine statuses changed: 002 → Done; 031/032/090 → Blocked; 004/005/040/050/060/093 → Partial; 101 → Scheduled. See TRACKER changelog and `launch-plan-data.json`. |
