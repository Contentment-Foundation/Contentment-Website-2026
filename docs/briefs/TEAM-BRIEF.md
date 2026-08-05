# contentment.org Redesign — Team Brief
> Q2 2026 · One-pager for all team members · Full detail in individual docs under `docs/`  
> Prepared by **Somesh Bhardwaj** · somesh@contentment.org · Sr. System Admin, Full Stack AI Engineer · The Contentment Foundation

---

## The Big Idea

Teacher wellbeing is the antidote to the problems we are seeing in the world. Teacher wellbeing is not an extra benefit. It is the foundation on which future generations are built.

**Tagline (verbatim, sitewide):** *When one teacher thrives, generations flourish.*

**Orientation line (on every page):** *The Contentment Foundation equips teachers with the wellbeing tools to thrive, because every future we care about runs through a teacher.*

---

## What We're Building

A **marketing and conversion website** at contentment.org. Not a portal, LMS, or app. One primary action sitewide: **Join Homeroom from $5/month.** The site tells a single story — TCF delivers teacher wellbeing at scale — and gives every visitor a seat in the movement.

Current state: single-page static prototype (`site/index.html`). This project expands it into a full multi-page site. **No visual redesign** — the design system is locked to the prototype.

---

## Numbers Everyone Must Know Cold

> 325 schools · 12 countries · 4 continents · 11,925 educators · 409,625+ students · **86%** reported improvement in every region · ~20 seats at $5/month fund one teacher's full year

---

## Three Audiences

| Audience | Inner voice | Destination |
|----------|-------------|-------------|
| **Future members** (primary) | "I remember a great teacher. Teachers are running on empty." | Join Homeroom — $5/month |
| **School leaders** | "My teachers are struggling. I need outcomes, not fluff." | Start the conversation (discovery form) |
| **Educators** | "I'm exhausted. Is this another thing on my plate?" | Circles & educator pathway |

---

## The Belief Journey

Every page moves a visitor one step. No page does all five.

| Step | Visitor's inner voice | Key proof at this step |
|------|-----------------------|------------------------|
| 1 | "One caring teacher changes everything. I remember mine." | Emotional hook — begin in their memory, not our mission |
| 2 | "Everything I care about is at risk." | Burnout is a children problem, a future problem |
| 3 | "This is proven, and TCF actually delivers it." | Harvard research · 86% · Bhutan national strategy · Hawaiʻi 90% renewal |
| 4 | "$5/month is how I show up." | Homeroom — a seat for every visitor regardless of wallet |
| 5 | "I belong here." | Events, stewardship, every email we send |

---

## Phase 1 Pages — Must Ship

> **Routes updated 5 Aug 2026.** Two slugs changed after this table was first written and the old ones were still listed here: **`/stories` → `/our-impact`** (renamed by Kristina, 27 Jul) and **`/give` → `/getinvolved`** (4 Aug; `/give` 301s). Four shipped pages were also missing from the table entirely.

| Page | URL | Steps | Primary CTA | Status |
|------|-----|-------|-------------|--------|
| Home | `/` | 1, 2 (+ preview 3, 4) | Join Homeroom | ✅ Live |
| Why Teacher Wellbeing | `/why` | 2, 3 | Join Homeroom | 🔵 Live, 3 QA criteria open |
| Our Impact | `/our-impact` | 1, 3 | Join Homeroom | 🔴 Live but **0 story cards** — blocked on comms photos + permissions |
| For Schools | `/schools` | 1 → 4 (leader path) | Start the conversation | 🟠 Live; proof-point copy owed by Kristina |
| Events | `/events` | 3, 4 | Save my spot | 🔴 **Review-only** — Dave's second notes round outstanding |
| Get Involved | `/getinvolved` | 4 (all five seats) | Join Homeroom | 🟠 Live; Meet Jose video held (WJ + Kristina) |
| About Us | `/about` | 1, 2 | Talk with us | 🟠 Live on preview; **roster sign-off owed by Dave before public deploy** |
| Newsletter signup | `/updates` | — | Subscribe | ✅ Live (Flodesk) — needs team review |
| 404 | `/404` | — | — | ✅ Live — needs team review |
| Legal | `/privacy` · `/terms` | — | — | `/privacy` ✅ live (cookie half); **`/terms` not started** |
| Homeroom conversion | `/give/monthly` | 4 → 5 | Become a Founding Member | 🔴 Not built — blocked on Keela (Lorna) |

**Homeroom naming note:** `/give/monthly` = public conversion page (where visitors join). `/homeroom` = password-gated member hub (Phase 2, not publicly linked). Do not conflate.

**Also publicly reachable on the preview** (Phase 2 prototypes, design work paused, never reviewed by the team): `/story-board`, `/foundation-reach-map`, and the internal `/docs` hub — the last of which **must be unpublished at cutover** (HC-077).

---

## The Four Pillars — Use Verbatim, Never Paraphrase

| Pillar | Official definition |
|--------|---------------------|
| **Mindfulness** | The practice of cultivating focused, nonjudgmental attention to the present moment helps us stay grounded and make thoughtful decisions. |
| **Community** | Fostering trust, empathy, compassion, and selfless service brings out the best in ourselves so that we can bring out the best in others. |
| **Self-Curiosity** | Encouraging curiosity about our inner world opens the door to self-discovery and a deeper understanding of ourselves and others. |
| **Contentment** | Embracing all of life's experiences with unconditional acceptance allows us to recognize each emotion as a valuable guide. |

---

## Voice in One Line

**The Tender Bullshit-Cutter.** Warm, grounded, direct, never corporate. Names what is hard without shaming or pretending. Hope leads; crisis supports. Bridges emotion and evidence — never one without the other.

**Never use:** "donor" · em dashes · "quiet" · "steady" · "upstream" · scarcity alarms · guilt framing · "program rollout" · "intervention" · "curriculum"

---

## Confirmed Tech Stack

| Layer | Tool | Status |
|-------|------|--------|
| Build | Astro 4.x (static output) | Recommended |
| Hosting | Vercel (production) | Confirmed |
| Dev preview | Netlify (interim) | `site/` prototype until Astro on Vercel |
| Donations | Keela — redirect to hosted checkout | Confirmed (existing) |
| Newsletter | Flodesk — embed or Vercel API | Confirmed |
| Forms | Flodesk / Keela / Raisely / custom Vercel API | Flexible per form |
| Database | GCP Cloud SQL | Phase 2+ only if needed |
| CMS | Markdown in repo → Sanity at Phase 1.5 | Migrate when editors need self-service |
| Analytics | GA4 + Clarity + PostHog + Cookiebot CMP | DECISION-001/002; see `planning/DECISIONS.md` |
| Transactional email | SendGrid (existing paid plan) | DECISION-003 — Somesh Bhardwaj, 14 Jul 2026 |

### Deployment

| Environment | Host | URL |
|-------------|------|-----|
| Prototype preview (now) | Netlify | contentmentweb2.netlify.app |
| Production | Vercel | contentment.org |
| PR previews | Vercel | `*.vercel.app` |

---

## Sprint Order (Phase 1 — 14 must-have tickets)

```
001 Layout extraction
  → 002 Routing scaffold
    → 003 Mobile nav drawer
    → 010 Homepage migration
      → 004 Wire nav/footer links
      → 020 /why page
      → 030 Our Impact data + JSON  ← BLOCKED: comms photos + permissions
        → 031 /our-impact index     ← BLOCKED by 030 (live, 0 cards)
      → 040 /schools page
      → 050 /getinvolved gateway
        → 060 Keela integration  ← PARTIAL: general form live; designation + tiers owed by Lorna
          → 051 /give/monthly (Homeroom conversion)  ← BLOCKED
      → 070 Newsletter integration  ← shipped 4 Aug (Flodesk)
      → 071 /privacy  ← shipped 5 Aug (cookie half)
      → 074 /terms    ← BLOCKED: legal copy (D-08)
      → 080 Analytics ← closed 7/7, 4 Aug
        → 100 Pre-launch QA
          → 101 Production deploy + DNS
```

---

## Open Decisions — Needs Sign-off Before Build

> **Refreshed 5 Aug 2026.** Rows 1 and 6 below were **already resolved** and had been sitting here as open questions — tier amounts were fixed on 27 Jul and the slugs were settled on 4 Aug. Four genuinely new decisions came out of Lorna's Keela map and are listed at the bottom.

| # | Decision | Owner | Status | Risk if delayed |
|---|----------|-------|--------|-----------------|
| 1 | ~~**Homeroom tier amounts**~~ | Leadership + Finance | ✅ **Resolved 27 Jul** — **$25 / $50 / $100** (D-01). The `$5` entry copy was removed 3 Aug | — |
| 2 | **Keela donation setup** — *not just URLs* | Finance / Lorna | 🔴 Open | Blocks the entire Homeroom conversion path. **Reframed 5 Aug:** Lorna proposes a separate *membership widget* rather than three per-tier links, so this was never answerable as "send the URLs" |
| 3 | **EIN** for Homeroom FAQ | Finance | 🟠 Open | Blocks `/give/monthly` from shipping complete |
| 4 | **Story content + photos** — minimum 3 stories | Programs / Comms | 🔴 Open | `/our-impact` is **live with zero story cards right now** — this is no longer a future risk, it is the current state |
| 5 | **Event calendar 2026 dates** | Events | 🟠 Open | Blocks `/events`; core to member retention |
| 6 | ~~**Final URL slugs**~~ | Team sign-off | ✅ **Settled** — `/stories` → `/our-impact`, `/give` → `/getinvolved` (301 kept). Sitemap + redirects updated | — |
| 7 | **Annual report format** — embedded vs PDF | Leadership | 🟠 Open | Somesh to host the 2019–2024 PDFs (HC-074) |
| **8** | **Where sign-ups land — Keela or Flodesk** | Kristina / Lorna / WJ | 🔴 **Open — Critical** | Lorna's map assumes every sign-up lands in Keela; we route all email capture to Flodesk and nothing syncs. Every day open, more addresses accumulate that may need exporting, deduping and re-tagging by hand (HC-078 / DECISION-008) |
| **9** | **What Homeroom membership *includes*** | Kristina / WJ / Lorna | 🔴 **Open — Critical** | Benefits set the tax-deductible portion of the receipt → Keela designation → widget config. **Price is already settled** (see row 1) — only benefits are missing (D-25) |
| **10** | **November waitlist page + routing** | Kristina / Cika | 🟠 Open | The page Lorna's map assumes does not exist in our build and is not in the Phase 1 list (HC-079) |
| **11** | **Launch date — 8/17 or Aug 21** | Kristina / Nav | 🔴 **Open — Critical** | Lorna is scheduling Keela build and testing against **8/17**; this plan says **Aug 21**. Both are being worked to right now (HC-080) |

---

## Success Metrics — 90 Days Post-Launch

| Metric | Target |
|--------|--------|
| Homeroom conversion rate | Establish baseline; +20% vs old site |
| `/why` share rate | ≥ 5% of sessions use Share CTA |
| School form submissions | ≥ 10 qualified leads / month |
| Newsletter signups | ≥ 200 / month from site |
| Homepage bounce rate | < 55% |
| LCP on 4G | < 2.5 s |
| Accessibility | Zero critical issues in audit |

---

## Where to Find the Full Detail

| Need | Document |
|------|----------|
| What to say, taglines, CTAs, banned words | `docs/research/MESSAGING-AND-COPY.md` — wins on any copy conflict |
| Who we sound like, writing craft | `docs/research/VOICE-AND-TONE.md` |
| Citations, DOIs, ready-to-use copy lines | `docs/research/EVIDENCE-AND-RESEARCH.md` |
| Sitemap, URLs, campaign pages, `/events` | `docs/research/WEBSITE-ARCHITECTURE.md` |
| Open technical decisions | `docs/planning/DECISIONS.md` |
| Full product requirements | `docs/planning/PRD.md` |
| Tech stack, data model, env vars | `docs/planning/TECHNICAL-ARCHITECTURE.md` |
| Design system, components, integrations | `docs/planning/FRONTEND-SPECIFICATION.md` |
| Accessibility checklist, ARIA patterns, keyboard/focus rules | `docs/planning/ACCESSIBILITY.md` |
| Auth, data privacy, error handling, edge cases | `docs/planning/SECURITY-AND-ACCESS.md` |
| Every build ticket with acceptance criteria | `docs/planning/FEATURE-TICKETS.md` |
