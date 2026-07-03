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

| Page | URL | Steps | Primary CTA |
|------|-----|-------|-------------|
| Home | `/` | 1, 2 (+ preview 3, 4) | Join Homeroom |
| Why Teacher Wellbeing | `/why` | 2, 3 | Join Homeroom |
| Educator Stories | `/stories` | 1, 3 | Join Homeroom |
| For Schools | `/schools` | 1 → 4 (leader path) | Start the conversation |
| Get Involved | `/give` | 4 (all five seats) | Join Homeroom |
| Homeroom conversion | `/give/monthly` | 4 → 5 | Become a Founding Member |
| Legal | `/privacy` · `/terms` | — | — |

**Homeroom naming note:** `/give/monthly` = public conversion page (where visitors join). `/homeroom` = password-gated member hub (Phase 2, not publicly linked). Do not conflate.

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
| Analytics | Plausible (recommended) | GA4 only if paid ads; see `planning/DECISIONS.md` |

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
      → 030 Stories data + JSON  ← needs comms content
        → 031 /stories index
      → 040 /schools page
      → 050 /give gateway
        → 060 Keela integration  ← needs Keela URLs from finance
          → 051 /give/monthly (Homeroom conversion)
      → 070 Newsletter integration
      → 071 /privacy + /terms
      → 080 Analytics
        → 100 Pre-launch QA
          → 101 Production deploy + DNS
```

---

## Open Decisions — Needs Sign-off Before Build

| # | Decision | Owner | Risk if delayed |
|---|----------|-------|-----------------|
| 1 | **Homeroom tier amounts** — $5/$25/$100 vs $25/$50/$100 | Leadership + Finance | Blocks Keela product setup and all Homeroom copy |
| 2 | **Keela donation URLs** | Finance / Ops | Blocks entire Homeroom conversion path (critical chain) |
| 3 | **EIN** for Homeroom FAQ | Finance | Blocks `/give/monthly` from shipping complete |
| 4 | **Story content + photos** — minimum 3 stories | Programs / Comms | `/stories` ships as stub if late; assign editorial deadline 3 weeks before launch |
| 5 | **Event calendar 2026 dates** | Events | Blocks `/events` page; this page is core to member retention |
| 6 | **Final URL slugs** | Team sign-off | Blocks routing and redirect planning |
| 7 | **Annual report format** — embedded vs PDF | Leadership | Affects `/about/impact` content brief |

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
| What to say, taglines, CTAs, banned words | `docs/MESSAGING-AND-COPY.md` — wins on any copy conflict |
| Who we sound like, writing craft | `docs/VOICE-AND-TONE.md` |
| Citations, DOIs, ready-to-use copy lines | `docs/EVIDENCE-AND-RESEARCH.md` |
| Sitemap, URLs, campaign pages, `/events` | `docs/WEBSITE-ARCHITECTURE.md` |
| Open technical decisions | `docs/planning/DECISIONS.md` |
| Full product requirements | `docs/planning/PRD.md` |
| Tech stack, data model, env vars | `docs/planning/TECHNICAL-ARCHITECTURE.md` |
| Design system, components, integrations | `docs/planning/FRONTEND-SPECIFICATION.md` |
| Accessibility checklist, ARIA patterns, keyboard/focus rules | `docs/planning/ACCESSIBILITY.md` |
| Auth, data privacy, error handling, edge cases | `docs/planning/SECURITY-AND-ACCESS.md` |
| Every build ticket with acceptance criteria | `docs/planning/FEATURE-TICKETS.md` |
