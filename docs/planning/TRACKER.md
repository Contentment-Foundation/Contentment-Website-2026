# Project Tracker — contentment.org

> **Last updated:** 31 July 2026 · Somesh Bhardwaj  
> **Spec detail** (acceptance criteria): [FEATURE-TICKETS.md](./FEATURE-TICKETS.md) · **Decisions**: [DECISIONS.md](./DECISIONS.md)

---

## Status key

| Symbol | Status | Meaning |
|--------|--------|---------|
| 🔵 | Open | Ready to start, no blockers |
| 🟡 | In Progress | Actively being worked on |
| 🟠 | Blocked | Waiting on external input or dependency |
| ⏸️ | Pending | Waiting on a team decision |
| ✅ | Done | Completed and verified |
| 📅 | Scheduled | Planned for a later phase |
| 🚫 | Cancelled | Dropped — will not do |

**Prefixes:** `FEAT` = feature · `OPS` = infrastructure/config · `DOC` = documentation · `QA` = quality/audit

---

## Master Ticket Table

| ID | Title | Cat | Phase | Priority | Status | Raised by | Owner | Opened | Closed | Depends on | Blocker / Note |
|----|-------|-----|-------|----------|--------|-----------|-------|--------|--------|------------|----------------|
| FEAT-001 | Extract shared layout (CSS tokens, nav, footer) | FEAT | 1 | Must | 🟡 In Progress | Somesh | Engineering | Jun 2026 | — | — | `src/layouts/BaseLayout.astro` + `Nav.astro`/`Footer.astro` + tokens/global.css from Dave Jul 29 handoff. Mobile drawer shipped (FEAT-003 ✅ 30 Jul). |
| FEAT-002 | Multi-page routing scaffold (Astro) | FEAT | 1 | Must | 🟡 In Progress | Somesh | Engineering | Jun 2026 | — | FEAT-001 | Astro 4.x confirmed (D-23/HC-055). All 7 Phase 1 content routes under `src/pages/`. Netlify preview publishes `dist/` (cut over 30 Jul → contentmentweb2.netlify.app). Utility pages (privacy/terms/404) not started. |
| FEAT-003 | Mobile navigation drawer | FEAT | 1 | Must | ✅ Done | Somesh | Engineering | Jun 2026 | 30 Jul 2026 | FEAT-001 | Slide-in drawer in `Nav.astro` + `nav.js`: focus trap, Escape, body scroll lock, Join Homeroom + Donate CTAs. See `HOMEPAGE-RESPONSIVE-AUDIT.md`. |
| FEAT-004 | Wire all nav and footer links | FEAT | 1 | Must | 🔵 Open | Somesh | Engineering | Jun 2026 | — | FEAT-002 | Internal page links + footer Project docs (`/docs`) wired. External donate/join/social still empty in `src/config/seams.ts` (HC-030/071, FEAT-005). |
| FEAT-010 | Migrate homepage to `/` route | FEAT | 1 | Must | ✅ Done | Somesh | Dave Kebo | Jun 2026 | 31 Jul 2026 | FEAT-001, FEAT-002 | Jul 29 — `src/pages/index.astro` + 10 section components. Responsive audit done 30 Jul (`HOMEPAGE-RESPONSIVE-AUDIT.md`). **31 Jul — Slack review passed (HC-057): Kristina's message asking about timeline for the other pages taken as sign-off, desktop + mobile.** Homeroom donate button still on a placeholder — live Keela checkout URL is **FEAT-060**/**HC-075** (Lorna + Somesh, Finance), tracked as its own ticket, not a blocker on this one. |
| FEAT-011 | Homepage copy audit vs messaging brief | FEAT | 1 | Should | 🔵 Open | Somesh | Engineering | Jun 2026 | — | FEAT-010 | — |
| FEAT-020 | Build `/why` page | FEAT | 1 | Must | 🟡 In Progress | Somesh | Engineering | Jun 2026 | — | FEAT-001, FEAT-002 | Jul 29 — ported to `src/pages/why.astro` from Dave why-wellbeing handoff (verbatim). Homepage-first gate (HC-057) cleared 31 Jul — needs its own responsive/QA pass, but no longer blocked on a separate homepage sign-off. |
| FEAT-030 | Stories data model + JSON seed (min 3 stories) | FEAT | 1 | Must | 🟠 Blocked | Somesh | Engineering | Jun 2026 | — | — | Waiting on comms for story content + photos. Index UI can ship without this; individual `/stories/[slug]` cannot. |
| FEAT-031 | Build Our Impact index (`/our-impact`) | FEAT | 1 | Must | 🟡 In Progress | Somesh | Engineering | Jun 2026 | — | FEAT-002 | Jul 29 — ported to `src/pages/our-impact/index.astro` from Dave Our Impact handoff. Route is `/our-impact` (not `/stories`). Story data model (FEAT-030) still blocked. |
| FEAT-032 | Build `/stories/[slug]` individual template | FEAT | 1.5 | Should | 📅 Scheduled | Somesh | Engineering | Jun 2026 | — | FEAT-030, FEAT-031 | — |
| FEAT-033 | Interactive global educator map | FEAT | 2 | Nice | 📅 Scheduled | Somesh | Engineering | Jun 2026 | — | FEAT-031 | — |
| FEAT-040 | Build `/schools` page | FEAT | 1 | Must | 🟡 In Progress | Somesh | Engineering | Jun 2026 | — | FEAT-002 | Jul 29 — ported to `src/pages/schools.astro` from Dave For Schools `fs_review1` handoff (verbatim; some images still base64). Partner-deck seam empty. |
| FEAT-041 | School discovery form | FEAT | 1 | Should | 🔵 Open | Somesh | Engineering | Jun 2026 | — | FEAT-040 | D-04 → Google Form + Slack; form URL still to wire. |
| FEAT-050 | Build `/give` gateway page | FEAT | 1 | Must | 🟡 In Progress | Somesh | Engineering | Jun 2026 | — | FEAT-002 | Jul 29 — Get Involved (Homeroom) content ported to `src/pages/give.astro`. D-03 still open (`/give` vs `/give/monthly` split). Join/donate seams empty. |
| FEAT-051 | Build `/give/monthly` conversion page | FEAT | 1 | Must | 🟠 Blocked | Somesh | Engineering | Jun 2026 | — | FEAT-050, FEAT-060 | Homeroom monthly UI currently lives at `/give`. Separate `/give/monthly` route not created; blocked on Keela (D-02) + D-03 routing. |
| FEAT-060 | Keela donation integration — wire all CTAs | FEAT | 1 | Must | 🟠 Blocked | Somesh | Engineering | Jun 2026 | — | — | Waiting on finance for live Keela checkout URLs (**HC-075**). Lorna + Somesh both engaging Keela support directly to get escalated to a senior support exec. |
| FEAT-070 | Newsletter integration (Flodesk embed or API) | FEAT | 1 | Must | 🔵 Open | Somesh | Engineering | Jun 2026 | — | FEAT-010, credentials | — |
| FEAT-071 | `/privacy` and `/terms` pages | FEAT | 1 | Must | 🔵 Open | Somesh | Engineering | Jun 2026 | — | FEAT-002, legal copy | Waiting on legal copy; cookie approach resolved (DECISION-002, Somesh) |
| FEAT-080 | Analytics setup (GA4 + PostHog Cloud + Clarity + Osano + Sentry) | FEAT | 1 | Must | 🔵 Open | Somesh | Engineering | Jun 2026 | — | FEAT-002 | All analytics decisions resolved (001, 002, 006, 007) |
| FEAT-081 | SEO baseline (meta, OG, sitemap, robots, `llms.txt`, favicon) | FEAT | 1 | Should | 🔵 Open | Somesh | Engineering | Jun 2026 | — | FEAT-002 | — |
| FEAT-090 | Events page | FEAT | 1 | Must | 🟡 In Progress | Somesh | Engineering | Jun 2026 | — | FEAT-002, event calendar | Jul 29 — ported to `src/pages/events.astro` (**HC-072**: review-only until Dave's second notes round). RSVP seams empty. |
| FEAT-091 | Homeroom gated member hub (`/homeroom`) | FEAT | 2 | Nice | 📅 Scheduled | Somesh | Engineering | Jun 2026 | — | FEAT-060, FEAT-092 | — |
| FEAT-092 | Homeroom access middleware (edge + password) | FEAT | 2 | Nice | 📅 Scheduled | Somesh | Engineering | Jun 2026 | — | Edge function hosting | — |
| FEAT-093 | About Us page (v1 single page) | FEAT | 1 | Must | 🟡 In Progress | Somesh | Engineering | Jun 2026 | — | FEAT-002 | Jul 29 — ported to `src/pages/about.astro` from Dave about-deploy-rev4 (D-05 single page). Not the old “5 sub-pages” Phase 2 plan. |
| FEAT-094 | Campaign page template (`/festival/2026`) | FEAT | 2 | Nice | 📅 Scheduled | Somesh | Engineering | Jun 2026 | — | FEAT-080 | — |
| FEAT-100 | Pre-launch QA (a11y, Lighthouse ≥85, Keela live test) | QA | 1 | Must | 🔵 Open | Somesh | Somesh | Jun 2026 | — | All must-have FEATs + QA-001 | — |
| FEAT-101 | Production deploy + DNS cutover to contentment.org | OPS | 1 | Must | 🔵 Open | Somesh | Somesh | Jun 2026 | — | FEAT-100 | — |
| OPS-001 | Add security headers to `netlify.toml` (interim env) | OPS | 1 | Must | ✅ Done | Anik Ghosh | Somesh | Jul 2026 | 3 Jul 2026 | — | X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy added |
| OPS-002 | Commit `vercel.json` from spec in TECHNICAL-ARCHITECTURE §9 | OPS | 1 | Must | ✅ Done | Anik Ghosh | Somesh | Jul 2026 | 3 Jul 2026 | — | CSP, security headers, redirects, API function timeout — committed |
| OPS-003 | CI step — auto-regenerate `contentment-home.html` on push | OPS | 1 | Should | ✅ Done | Anik Ghosh | Somesh | Jul 2026 | 3 Jul 2026 | — | Implemented as `.github/workflows/sync-single-file-build.yml` (watches `site/index.html`) |
| QA-001 | Story Board a11y gaps — dialog focus trap, `aria-pressed`, live region | QA | 1 | Must | ✅ Done | Somesh | Somesh | Jul 2026 | 3 Jul 2026 | — | Dialog semantics, focus trap, focus return, aria-pressed on toggles + filter chips, live region on count — all closed |
| DOC-001 | Fix wrong doc paths in brief footers | DOC | 1 | Must | ✅ Done | Anik Ghosh | Somesh | Jul 2026 | 3 Jul 2026 | — | TECH-BRIEF, TEAM-BRIEF, GROWTH-BRIEF — all paths corrected |
| DOC-002 | Add `llms.txt` spec to GROWTH-BRIEF + FEAT-081 | DOC | 1 | Should | ✅ Done | Anik Ghosh | Somesh | Jul 2026 | 3 Jul 2026 | — | Comprehensive `llms.txt` guidance added to GROWTH-BRIEF §6 |
| DOC-003 | Add favicon to pre-launch checklist | DOC | 1 | Must | ✅ Done | Anik Ghosh | Somesh | Jul 2026 | 3 Jul 2026 | — | Pre-launch blocker confirmed in GROWTH-BRIEF |
| DOC-004 | Add `rel="noopener"` to SECURITY-AND-ACCESS §8 checklist | DOC | 1 | Must | ✅ Done | Anik Ghosh | Somesh | Jul 2026 | 3 Jul 2026 | — | Added `rel="noopener noreferrer"` check + Drive view-only confirmation to §8 |
| DOC-005 | Clarify local dev instructions in TECH-BRIEF (prototype vs post-scaffold) | DOC | 1 | Should | ✅ Done | Anik Ghosh | Somesh | Jul 2026 | 3 Jul 2026 | — | Both rows now separate: `python3 -m http.server 8080` (now) vs `astro dev` (post TICKET-002) |
| DOC-006 | Update DECISION-001 — analytics stack (Plausible → GA4 + PostHog + Clarity) | DOC | 1 | Must | ✅ Done | Anik Ghosh | Somesh | Jul 2026 | 3 Jul 2026 | — | — |
| DOC-007 | Update DECISION-002 — cookie banner required (GA4 Consent Mode v2) | DOC | 1 | Must | ✅ Done | Anik Ghosh | Somesh | Jul 2026 | 3 Jul 2026 | DOC-006 | — |
| DOC-008 | Update GROWTH-BRIEF §1 analytics stack | DOC | 1 | Must | ✅ Done | Anik Ghosh | Somesh | Jul 2026 | 3 Jul 2026 | DOC-006 | — |
| DOC-009 | Update TECH-BRIEF + TECHNICAL-ARCHITECTURE env vars (remove Plausible, add GA4/PostHog) | DOC | 1 | Must | ✅ Done | Anik Ghosh | Somesh | Jul 2026 | 3 Jul 2026 | DOC-006 | — |
| DOC-010 | Write ANIK-REVIEW-RESPONSE.md with hyperlinks + issue tracker | DOC | 1 | Must | ✅ Done | Somesh | Somesh | Jul 2026 | 3 Jul 2026 | — | — |
| DOC-012 | Sign off DECISION-002 (Osano + Consent Mode v2) + DECISION-003 (SendGrid) | DOC | 1 | Must | ✅ Done | Somesh | Somesh Bhardwaj | Jul 2026 | 14 Jul 2026 | — | Cookie + email decisions; compliance §5.1 in SECURITY-AND-ACCESS |
| DOC-013 | Sign off DECISION-004–007 (Upstash, Astro Image, hybrid observability, PostHog Cloud) | DOC | 1 | Must | ✅ Done | Somesh | Somesh Bhardwaj | Jul 2026 | 14 Jul 2026 | DOC-012 | §5.2 production path for /privacy added |
| DOC-011 | ACCESSIBILITY.md — WCAG 2.1 AA target, ARIA map, known gaps | DOC | 1 | Must | ✅ Done | Somesh | Somesh | Jun 2026 | Jun 2026 | — | — |
| — | Plausible analytics integration | — | — | — | 🚫 Cancelled | Somesh | — | Jun 2026 | 3 Jul 2026 | — | Paid tool; GA4 + PostHog cover same needs at no cost |
| — | Supabase (replaced by GCP Cloud SQL) | — | — | — | 🚫 Cancelled | Somesh | — | Jun 2026 | Jun 2026 | — | Standardised on GCP stack |

---

## Pending decisions — unblocks multiple tickets

| Decision | Options | Waiting on | Gates |
|----------|---------|------------|-------|
| Homeroom tier amounts | $5 / $25 / $100 vs $25 / $50 / $100 | Finance / Leadership | FEAT-051 copy, FEAT-060 URL wiring |
| Keela checkout URLs | Live hosted links per tier | Finance | FEAT-060, FEAT-051 |
| Legal copy — Privacy + Terms | Final text | Legal / Ops | FEAT-071 |
| `/give` routing | Gateway page vs redirect to Homeroom | Product / Kristina | FEAT-050 |
| School inquiry form destination | Flodesk vs Keela vs custom API | Partnerships + Eng | FEAT-041 |
| About Us scope v1 | Single page vs 5 sub-pages | Content / Kristina | FEAT-093 |

> All engineering decisions (DECISION-001–007) resolved. See [DECISIONS.md](./DECISIONS.md).

---

## External blockers — not in engineering's control

| Blocker | Waiting on | Gates |
|---------|-----------|-------|
| Live Keela checkout URLs | Finance team | FEAT-060, FEAT-051 |
| Story content (3+ stories, photos, permissions) | Comms / Programs team | FEAT-030, FEAT-031 |
| Legal copy for `/privacy` and `/terms` | Legal / Ops | FEAT-071 |
| Social media URLs (LinkedIn, Instagram, YouTube) | Comms team | FEAT-004 |

---

## Critical path — Phase 1

```
FEAT-001 → FEAT-002* → FEAT-003
                     → FEAT-004 (needs social URLs from comms)
                     → FEAT-010 [Dave] → FEAT-011
                     → FEAT-020
                     → FEAT-031 (needs FEAT-030 — blocked on comms content)
                     → FEAT-040 → FEAT-041
                     → FEAT-050 → FEAT-060 (blocked: finance URLs)
                                → FEAT-051 (blocked: FEAT-060 + tier decision)
                     → FEAT-070
                     → FEAT-071 (needs legal copy; cookie decision ✅ DECISION-002)
                     → FEAT-080 (analytics — all decisions resolved)
                     → FEAT-081

OPS-001  ← no dependency — ship now
OPS-002  ← no dependency — ship now
OPS-003  ← no dependency — ship now
QA-001   ← must close before FEAT-100

FEAT-100 (all must-haves + QA-001) → FEAT-101 (DNS cutover)

* = external blocker or product decision (engineering decisions 001–007 resolved)
```

---

## Related documents

| Document | Purpose |
|----------|---------|
| [FEATURE-TICKETS.md](./FEATURE-TICKETS.md) | Full ticket specs — acceptance criteria, AI prompt seeds |
| [DECISIONS.md](./DECISIONS.md) | Open and resolved technical decisions |
| [TECHNICAL-ARCHITECTURE.md](./TECHNICAL-ARCHITECTURE.md) | Stack, env vars, CI/CD, DNS runbook |
| [SECURITY-AND-ACCESS.md](./SECURITY-AND-ACCESS.md) | Security checklist, pre-launch gates |
| [ACCESSIBILITY.md](./ACCESSIBILITY.md) | WCAG 2.1 AA checklist, ARIA map, known gaps |
| [GROWTH-BRIEF](../briefs/GROWTH-BRIEF.md) | Analytics, SEO, UTM taxonomy |
| [../correspondence/ANIK-REVIEW-RESPONSE.md](../correspondence/ANIK-REVIEW-RESPONSE.md) | Final response to Anik Ghosh's engineering review — issue tracker, hyperlinked doc refs |

---

## Changelog

| Date | Change |
|------|--------|
| 3 Jul 2026 | Initial tracker. All FEAT tickets from FEATURE-TICKETS.md ported. OPS + DOC tickets added from Anik review. Done and cancelled rows added. |
| 3 Jul 2026 | OPS-001, OPS-002, OPS-003, QA-001, DOC-001, DOC-002, DOC-003 all marked ✅ Done — all Somesh-owned items from Anik's review resolved and committed. |
| 3 Jul 2026 | DOC-004, DOC-005 marked ✅ Done — `rel="noopener"` added to SECURITY-AND-ACCESS §8; local dev instructions clarified in TECH-BRIEF. All DOC tickets from Anik's review now closed. |
| 14 Jul 2026 | DECISION-004–007 signed off by Somesh Bhardwaj (Upstash, Astro Image, hybrid observability, PostHog Cloud). SECURITY-AND-ACCESS §5.2 added (production path for /privacy). DOC-013 ✅ Done. |
| 27 Jul 2026 | Schedule preponed one week per Kristina's updated Gantt — Dave handing off UI/UX + related tasks early. Design handoff Aug 3 → Jul 27 (lands with Sam morning of Jul 28, timezone); dev sprint Aug 3–14 → Jul 27–Aug 7; final review Aug 14 → Aug 7; fixes/polish/approval Aug 17–21 → Aug 10–14; go-live Aug 24–28 → Aug 17–21. Updated `launch-plan-data.json`, `LaunchPlanSheet.gs`, `DEV-TIMELINE.html`, `dev-timelinev2.html`. |
| 27 Jul 2026 | Kristina's comments on the Launch Plan sheet incorporated: **D-01** resolved (Homeroom tiers → $25/$50/$100); **D-04** resolved (school inquiry form → Google Form + Slack integration, was Flodesk/Keela/custom API); **D-05** resolved (About Us → single page); **D-03** (`/give` routing) updated — Kristina proposes the Keela widget, pending Lorna's confirmation on Slack; **D-08** (legal copy) downgraded to Low — Privacy + Terms pages moved to Phase 2 and no longer block the Aug 17–21 launch; **D-13** (cookie consent) — Anik looped in for a second opinion, decision unchanged. About Us and Events confirmed for Phase 1 launch (both previously "1 or 2"/"1.5"). Pages renamed: "Stories" → "Our Impact", "Events & Experiences" → "Events", "Get Involved (Homeroom)" → "Get Involved". Flagged a naming overlap between the new "Our Impact" page (Phase 1, `/stories`) and the existing deferred "Impact" nav item (Phase 2, `/impact`) for future resolution. Updated `launch-plan-data.json`, `LaunchPlanSheet.gs`, `DEV-TIMELINE.html`, `dev-timelinev2.html`. |
| 27 Jul 2026 | Additional Kristina comment thread (later same day) incorporated: **D-07** resolved (social media URLs → included directly in Dave/Veron's UIUX designs, no separate Comms handoff — unblocks FEAT-004); **D-09** resolved (EIN/legal copy on `/give` → already included in the UIUX); **D-10** resolved (annual report format → PDF for Phase 1). **D-08** (Privacy/Terms legal copy) clarified as an explicit action item assigned to Somesh, with Kristina open to a ~Aug 24–28 fast-follow the week after launch instead of waiting for full Phase 2, if prioritized. Also corrected `FEAT-030`/`FEAT-051` ticket titles to match the exact wording already live in the Sheet's `Tickets` tab ("Our Impact Page data model + JSON", "Build /give/monthly Get Involved Page") and fixed a stray "Stories transparency section" reference in D-10 to "Our Impact". Updated `launch-plan-data.json`, `LaunchPlanSheet.gs`, `DEV-TIMELINE.html`, `dev-timelinev2.html`. |
| 27 Jul 2026 | Pre-handoff clarifications locked for Jul 28 call: Phase 1 hard go-live **Aug 21** (end of Phase 1; next phase TBD); final review meeting anytime **Aug 3–7**; Privacy/Terms remain open ticket (**Phase 1.5 or 2** TBD); alternative giving methods left open for Nav/Kristina/Lorna (**D-20**); Button/CTA inventory owned by Kristina (**FEAT-005**, critical). Added `handoffChecklist` (43 rows) + new Google Sheet tab **Handoff Checklist** (live tracker). Updated `launch-plan-data.json`, `LaunchPlanSheet.gs`, `docs/briefs/HANDOFF-CHECKLIST.md`. |
| 28 Jul 2026 | Handoff Checklist statuses aligned with Slack-confirmed decisions: scope freeze (7 pages + Phase 2 exclusions), Bhutan copy, $25/$50/$100 tiers, post-launch ownership, Privacy/Terms + alt-giving *approach*, analytics Ready. Still Open for live call asks (Button inventory, desktop/mobile lock, Keela URLs, /give routing, newsletter, assets, etc.). |
| 28 Jul 2026 | **UIUX→Dev handoff call** outcomes recorded: logo = live-site SVG no three dots (**D-21**); mobile owned by Somesh in sprint (**HC-021**); Jose video placeholder OK (**HC-040**); Priscilla quote + all copy changes → Phase 2 (**D-22**, **HC-042/043**); homepage-first Slack review (**HC-057**); Kristina CR form+Sheet + Miro button inventory + Claude/Lorna; Nav SVG immediate. **D-23** opened — call mentioned React; do not override **D-11 Astro** until Nick signs off. Notes: `docs/correspondence/HANDOFF-MEETING-2026-07-28.md`. Updated `launch-plan-data.json`, `LaunchPlanSheet.gs`, `HANDOFF-CHECKLIST.md`. |
| 29 Jul 2026 | **Dave's 7-page build handoff received** (Jul 29 AM, via Drive) — all Phase 1 page builds + assets + per-page handoff-report MDs landed in `handoff/2026-07-29-dave-pages/`. Intake review same day: About Us roster title resolved — Dave Kebo is **Chief Media Officer**, closing the one discrepancy against `about-name-manifest.txt` (**HC-035** → Confirmed). Photo usage rights cleared for About + For Schools photography (**HC-069**). **Our Impact route confirmed as `/our-impact`** (was `/stories`) — updated in the pages table, **FEAT-031**, and the shared `assets/seams.js` page-route config (**HC-073**). Found and fixed a site-wide CSS bug carried over from the homepage transplant: a doubled closing brace at the end of the mobile `.voice` (Kenya band) media query was silently breaking whatever rule followed it — fixed across all 9 remaining affected pages (Get Involved already had Dave's fix). Filled in the internal page-to-page `page` map in all 4 existing `assets/seams.js` copies (Home, Why Wellbeing, Get Involved, header/footer kit) so in-site nav resolves; donate/join/external-link/embed seams left empty pending Kristina's button inventory and Keela/Homeroom decisions, per standing instruction not to wire ahead of that. New open items logged: Keela Donate button color mismatch, dashboard-only fix (**HC-070**); Keela/Homeroom join-flow choreography still undecided, blocks Get Involved + Events gated CTAs (**HC-071**, broader than **D-03**); Events page missing a second round of Dave's team notes — current build is review-only, not production-final (**HC-072**); Annual Report PDFs 2019–2024 still pending from Somesh (**HC-074**). Also noted: Our Impact, For Schools, and Events builds don't yet include their own `assets/seams.js` + script include (only Home, Why Wellbeing, and Get Involved do) — needs a decision on whether to propagate before real integration. Updated `launch-plan-data.json`, `HANDOFF-CHECKLIST.md`; `LaunchPlanSheet.gs`'s embedded fallback JSON still needs a resync pass (not required for the Sheet's normal GitHub-refresh path). |
| 29 Jul 2026 | **Framework decision closed: Astro 4.x, no React (D-23 / HC-055).** Somesh signed off directly in place of the pending Nick confirmation, delegating the technical call to Engineering. Justified by an audit of Dave's actual 7-page handoff: zero external JS libraries, zero npm/build tooling, zero framework fingerprints anywhere — every page is plain HTML/CSS + vanilla inline JS (IIFEs, IntersectionObserver, scroll listeners, no `import`/`require`), matching the pattern already used in `site/index.html`. Nothing in the handoff needs client-side state or SPA routing, so there's no technical case for React. This reaffirms, rather than reopens, Anik Ghosh's original 5 Jul Astro confirmation (FEAT-002) — the Jul 28 call's mention of React is the thing being closed out, not the earlier engineering decision. Unblocks FEAT-001/FEAT-002 scaffold work to start. |
| 29 Jul 2026 | **Review-preview nav wiring activated across all 7 handoff pages** (explicitly interim — superseded once Astro's file-based routing lands under FEAT-002/TICKET-002; internal nav won't need a runtime resolver post-migration). Home, Why Wellbeing (de-inlined), Get Involved, and Our Impact each load `assets/seams.js` via a `<script src="assets/seams.js">` include (Our Impact's copy is new; Home's stray root-level copy was moved into its actual `assets/` folder, which is what the page's relative path expects). About, For Schools, Events (all 3 identical copies), and Why Wellbeing's self-contained variant have no `assets/` folder by design, so the same CONFIG + resolver was inlined directly as a `<script>` block instead of referenced externally, preserving their single-file portability. All 7 pages now cross-link to each other (about/why-wellbeing/our-impact/for-schools/events/get-involved all resolve); donate, join, external social links, and embeds remain intentionally empty pending Kristina's button inventory and the Keela/Homeroom decisions (**HC-070/071**). `events-build/head.html` is a `<head>`-only build fragment (assembled by `assemble_ev.py`), not an openable page, so it was left without its own SEAMS block. |
| 29 Jul 2026 | **Astro scaffold started (FEAT-001/002/010).** Project set up at repo root per TECHNICAL-ARCHITECTURE.md §3: `package.json`, `astro.config.mjs`, `tsconfig.json`; `node_modules/`, `dist/`, `.astro/` gitignored. Design tokens + global CSS extracted verbatim from Dave's Jul 29 homepage handoff into `src/styles/tokens.css` + `global.css` (no visual changes, per the migration rule). Built `BaseLayout.astro`, `Nav.astro`, `Footer.astro`, and 10 Home-page section components (`Hero`, `WhySplit`, `StatBand`, `VoiceBand`, `InviteBand`, `OrbitSection`, `CommunityCircles`, `Pillars`, `HomeroomBlock`, `DoorCards`, `NewsletterForm`); ported the vanilla JS (nav scroll, reveal-on-scroll, count-up, parallax, orbit pond-ripple) into `src/scripts/`. Internal nav (About/Why/Our Impact/Schools/Events/Get Involved) now links to real Astro routes instead of the interim `seams.js` pattern — those routes 404 until their own FEAT tickets land, which is expected. External/business-decision links (donate, join, socials) route through a new `src/config/seams.ts`, the Astro-native successor to the handoff's `seams.js`, still empty pending HC-030/HC-071/FEAT-005. `npm run build` passes; verified via `astro preview` that the homepage, CSS, and images all serve 200. Not yet through the homepage-first Slack review (HC-057) — that's the next gate before continuing to `/why`. |
| 29 Jul 2026 | **All 7 Phase 1 Dave pages ported into Astro under `src/pages/`.** Routes live: `/` (`index.astro`), `/about`, `/why`, `/our-impact`, `/schools`, `/events`, `/give`. Tickets flipped to In Progress: FEAT-020/031/040/050/090/093 (Events still HC-072 review-only; Give is Homeroom content at `/give` pending D-03; FEAT-051/060 still Blocked on Keela). FEAT-093 corrected to Phase 1 Must single page (D-05) — not the old “5 sub-pages” Phase 2 plan. Netlify still publishes `site/index.html` until Vercel cutover. Updated `launch-plan-data.json`; canvas refresh via `scripts/refresh-launch-canvas.py`. |
| 30 Jul 2026 | **Homepage responsive audit + mobile nav drawer (FEAT-003).** Browser-tested at 320–1280px — no horizontal scroll; all three breakpoints behave per FRONTEND-SPEC §4. Documented in `docs/planning/HOMEPAGE-RESPONSIVE-AUDIT.md`. Implemented slide-in mobile drawer in shared `Nav.astro` + `nav.js` (focus trap, Escape, body scroll lock, Join Homeroom + Donate CTAs). FEAT-003 ✅ Done. Updated `launch-plan-data.json`, `LaunchPlanSheet.gs`, timeline briefs, ACCESSIBILITY.md, FEATURE-TICKETS.md. Canvas refreshed. |
| 30 Jul 2026 | **Documentation sync pass across all planning docs/briefs following the 7-page Astro migration.** `docs/planning/FEATURE-TICKETS.md`: added a dated Status note to TICKET-010/020/031/040/050/090 (each page's Astro route + what's still outstanding); **corrected TICKET-093** from stale "About section (5 pages)" to "About Us page (v1 single page)" per D-05 (resolved 27 Jul — the 5-sub-page framing was never updated after that decision). `docs/briefs/DEV-TIMELINE.html` + `dev-timelinev2.html`: flipped FEAT-001/002/004/010/020/031/040/050/090/093 status tags from Upcoming/Ready/Blocked to In Progress with routes and open blockers noted, matching TRACKER.md/launch-plan-data.json. Verified `LaunchPlanSheet.gs`'s `EMBEDDED_JSON` fallback is already byte-identical to `launch-plan-data.json` (no edit needed — a prior pass had already resynced it). Canvas re-refreshed via `scripts/refresh-launch-canvas.py` (47 tickets, 22 HC open, 7 critical open). |
| 30 Jul 2026 | **Netlify preview cut over to Astro `dist/`.** `netlify.toml` now runs `copy-docs.sh public/docs && npm run build` and publishes `dist/` (was `site/`). Preview URL https://contentmentweb2.netlify.app/ serves all 7 Phase 1 routes. Prototypes (map, Story Board, docs hub) moved under `public/`. Footer **Project docs** link restored. Team Slack review requested (HC-057 homepage + mobile). Canvas refreshed via `scripts/refresh-launch-canvas.py`. |
| 31 Jul 2026 | **Review & Feedback Sheet tab + homepage polish.** Added `reviewFeedback` (RF-xxx) to `launch-plan-data.json` and live tab **Review & Feedback** in `LaunchPlanSheet.gs` (team QA for https://contentmentweb2.netlify.app/). Seeded RF-001–003 Done (trustcue, orbit bloom, Homeroom dummy form); RF-004–007 Open (HC-057 Slack/mobile + remaining pages + Events HC-072). Embed fallback switched to `EMBEDDED_DATA` JS object via `build-sheet-script.py`. Canvas refreshed. |
| 31 Jul 2026 | **HC-075 opened — live Keela donation checkout URLs (per tier), Owner Finance/Lorna, Critical.** Splits the Finance-side deliverable (the actual checkout links) out from **D-02** (the decision to use hosted Keela links) and **FEAT-060** (the dev ticket to wire all CTAs), since neither tracked "someone needs to hand us the URLs" as its own item. Blocks FEAT-010 close-out and FEAT-051 (`/give/monthly`). Noted: the Handoff Checklist tab on the Google Sheet is a live tab — **Refresh from source** skips tabs that already have rows (`LaunchPlanSheet.gs` `buildAllTabs_`) to protect manual team edits, so newly-added HC rows (this one, and HC-057 previously) won't appear there until **Force reseed live tabs** is run, which discards any manual Status/Owner edits made on that tab in the Sheet. Updated `launch-plan-data.json`, `TRACKER.md`; `LaunchPlanSheet.gs` regenerated via `build-sheet-script.py`. |
| 31 Jul 2026 | **Review & Feedback tab given a legend panel** (`writeReviewFeedbackLegendPanel_` in `LaunchPlanSheet.gs`, cols M–N) — it only had column dropdowns and a one-line tip before, with no explanation of the RF-xxx row format or what each Status/Severity value means, unlike Handoff Checklist's existing side legend. New panel spells out how to log a row (next sequential ID, one issue per row, leave Status/Owner/Resolution to the triager) plus Status and Severity meanings, color-matched to the conditional formatting. `onEditAudit_` updated to ignore that legend's columns (13+) so it doesn't spam the Black Box. Also confirmed and documented in `scripts/google-sheets/README.md`: the Black Box is a one-way, append-only log inside the Sheet — there is no Apps Script → GitHub write-back, so any manual Sheet edit that should change project truth has to be ported into `launch-plan-data.json`/`TRACKER.md` by hand. |
| 31 Jul 2026 | **Homepage-first Slack review gate (HC-057) cleared.** Kristina, in Slack: "Now that you've finished the Homepage, what's your estimate on timeline to finish the other pages?" — read as sign-off on the homepage build, desktop and mobile both, satisfying the Jul 28 "homepage-first, then remaining pages" agreement (HC-057). Closed **RF-004** (homepage Slack review) and **RF-005** (homepage mobile pass) as Done; **RF-006** (click-through review of the other 6 pages) is now the active review item. FEAT-010 stays In Progress — not blocked on review anymore, but still open on the Homeroom donate seam pending live Keela URLs (**HC-075**). FEAT-020 (`/why`) note updated to drop the "Slack review after homepage" blocker language. Updated `launch-plan-data.json` (meta.summary, pages/Homepage row, HC-057, RF-004/005), `TRACKER.md`, `FEATURE-TICKETS.md` (TICKET-010 status). Still owed: a timeline estimate back to Kristina for the remaining pages — not yet drafted. |
| 31 Jul 2026 | **Corrections from Somesh on the above.** (1) **FEAT-010 flipped to ✅ Done** (31 Jul) — the migration itself is complete and reviewed; the Homeroom donate button's live checkout URL was never really in this ticket's scope, it's **FEAT-060**'s (Keela wiring), just referenced from FEAT-010's notes. (2) **HC-075 owner changed Finance/Lorna → Lorna + Somesh** — both are directly engaging Keela's support team to get escalated to a senior support exec, given the delay on live checkout URLs; FEAT-060 note updated to match. (3) RF-004/RF-005 resolution notes corrected: Kristina's sign-off clears the HC-057 gate to start other pages, but **other team members' review is still ongoing in parallel** — feedback received so far has already been fixed and shipped (RF-001–003); Somesh will spot-check both rows in the Sheet directly. (4) Somesh sent Kristina a holding reply in Slack: can't commit to a firm timeline for the other 6 pages spontaneously — full answer by **4 Aug 2026**, since the design handoff actually landed Jul 28 (not Jul 27) and the homepage mobile-responsive pass needs dedicated review time, which is where most of today's time went; other milestones progressing in parallel. Pointed her at `https://contentmentweb2.netlify.app/docs/dev-timeline/classic/` as the live-updating status page — `DEV-TIMELINE.html`/`dev-timelinev2.html` "As of" date and FEAT-010 tag updated to 31 Jul/Done so that page isn't stale when she checks it. Internal ballpark for the Aug 4 answer (from FEAT-020/030/031/040/050/090/093 notes): `/why` (FEAT-020), `/our-impact` index (FEAT-031), `/schools` (FEAT-040), `/give` (FEAT-050) are all already ported (29 Jul) and only need the same responsive/QA/review pass the homepage just went through — no content blockers. `/about` (FEAT-093) needs Dave's line-by-line roster sign-off; `/events` (FEAT-090) is review-only pending Dave's second notes round (**HC-072**) — both gated on Dave, not on dev bandwidth. Individual `/stories/[slug]` (FEAT-032) stays blocked on comms delivering story content/photos (**FEAT-030**) — doesn't block the Our Impact index. Updated `launch-plan-data.json` (HC-075, FEAT-010/FEAT-060 tickets, meta.summary, RF-004/005), `TRACKER.md`, briefs. |
| 31 Jul 2026 | **FEAT-005 Owner corrected `Sam` → `Kristina → Sam`** to match its own note and **HC-005** (same deliverable): Kristina is finalizing the Button/CTA inventory (Miro board) to hand off; Sam wires it once received. Updated `launch-plan-data.json`. |
| 31 Jul 2026 | **Google Sheet Tickets tab gap explained + partially closed.** Root cause: `launch-plan-data.json`'s `tickets` array (the only thing that feeds the Sheet's Tickets tab) has always been a curated subset of `TRACKER.md`'s full ticket table, not a mirror — `refresh-launch-canvas.py` already tracks this as `trackerOnly` (23 rows before this fix). Most of that gap is intentional: one-off `DOC-*`/`OPS-*`/`QA-*` housekeeping items and `CXL-*` cancelled tickets that were never meant to live on a Sheet tab scoped to active engineering tickets. But four real, still-open FEAT tickets were missing outright — added to `launch-plan-data.json`: **FEAT-011** (homepage copy audit, Open/Should), **FEAT-091/092/094** (Homeroom hub, access middleware, campaign template — all Phase 2/Scheduled). Starting now: **any ticket blocked on someone outside the team gets its Status set to Blocked/Scheduled with the blocker named in its note, and we move on to the next open ticket per FEATURE-TICKETS.md's priority order** — rather than stalling the whole sprint on one dependency. Next: FEAT-081 (SEO baseline) and FEAT-080 (Analytics) picked up as the two ready-now, no-blocker Must/Should tickets; RF-006 (responsive/QA pass on the other 6 pages) assigned to Cursor. |
