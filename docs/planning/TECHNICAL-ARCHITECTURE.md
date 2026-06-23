# Technical Architecture Document — contentment.org

> **Status:** Draft  
> **Last updated:** June 2026  
> **Constraint:** Preserve existing UI from `site/index.html`; evolve structure, routing, and integrations only.

Related: [PRD](./PRD.md) · [Frontend Spec](./FRONTEND-SPECIFICATION.md) · [Security & Access](./SECURITY-AND-ACCESS.md)

---

## 1. Architecture overview

contentment.org is a **static-first marketing site** deployed on **Vercel**, with **third-party services** for payments, email, and forms. **No database is required for Phase 1 MVP** — Flodesk, Keela, Raisely, and similar tools hold subscriber and lead data.

```mermaid
flowchart TB
    subgraph client["Browser"]
        pages["Static pages HTML/CSS/JS"]
    end

    subgraph host["Vercel"]
        cdn["Static deploy + preview branches"]
        api["Vercel Serverless Functions optional"]
    end

    subgraph external["Third-party services"]
        keela["Keela — donations"]
        flodesk["Flodesk — newsletter"]
        forms["Forms — Flodesk / Keela / Raisely / custom"]
        analytics["GA4 or Plausible — analytics"]
    end

    subgraph phase2["Phase 2 optional"]
        gcp["GCP database — Cloud SQL"]
        cms["Headless CMS — stories"]
    end

    pages --> cdn
    pages --> keela
    pages --> flodesk
    pages --> forms
    pages --> analytics
    api -.-> gcp
    pages -.-> cms
```

**Design principle:** Minimize moving parts for a small nonprofit team. Prefer managed services (Flodesk, Keela, Raisely) over a custom database until you have a clear reason to own the data in-house.

---

## 2. Recommended tech stack

| Layer | Choice | Reasoning |
|-------|--------|-----------|
| **Markup & style** | HTML + CSS (extracted from prototype) | Already built; team-approved UI; no redesign |
| **Interactivity** | Vanilla JavaScript (ES modules optional) | Prototype patterns work; no framework lock-in for marketing pages |
| **Build tool (recommended)** | [Astro](https://astro.build) 4.x | Multi-page routing, shared layouts, static output; can embed existing HTML/CSS as-is |
| **Alternative** | Multi-file static HTML | Zero build step; higher duplication cost across ~30 URLs |
| **Hosting** | **Vercel** (confirmed) | Preview deploys per PR, HTTPS, custom domain, edge middleware for Homeroom gate |
| **CDN / assets** | Vercel CDN + `public/assets/` | Same deploy as site; no separate CDN needed at launch |
| **Donations** | Keela (existing) | Recurring Homeroom gifts, receipts, tax |
| **Newsletter** | **Flodesk** (confirmed) | Subscriber list, campaigns, automations |
| **Forms** | **Flexible per form** (see §2.1) | Third-party embed, provider-native forms, or custom build |
| **Database** | **GCP Cloud SQL** (optional — Phase 2+) | Only when custom forms or member auth need a system of record you control |
| **Analytics** | Plausible or GA4 | Campaign UTM support required for Festival |
| **CMS (Phase 1.5+)** | Markdown files in repo (Phase 1) → Sanity (Phase 1.5) | Phase 1: stories authored as JSON/markdown, deploy required per update. Phase 1.5: migrate to Sanity when content team needs self-service editing without engineering. |
| **Homeroom gate (Phase 2)** | Vercel edge middleware + shared password, or magic link via GCP-backed API | Simple password first |
| **Version control** | Git + GitHub | Vercel preview deploys on PRs |

### 2.1 Forms strategy (flexible per use case)

Not every form needs the same backend. Pick the simplest option that stores data where the team already works.

| Form | Recommended options | Data lands in |
|------|---------------------|---------------|
| **Newsletter** | Flodesk embed or Flodesk API via Vercel function | Flodesk |
| **Homeroom / giving** | Keela hosted checkout (link, not a form) | Keela |
| **School discovery** | Custom UI styled like site → Flodesk form, Keela form, **or** custom POST → Vercel API → GCP | Flodesk / Keela / GCP |
| **Fundraise** | Raisely campaign embed or link | Raisely |
| **Festival waitlist** | Flodesk segment or Keela signup | Flodesk / Keela |
| **Volunteer interest** | Flodesk, Keela, or custom | Per choice above |

**Custom-built forms:** Keep the prototype input styles (`.news input`). Submit to a **Vercel Serverless Function** (`/api/...`) that validates, rate-limits, and either forwards to Flodesk/Keela API or writes to **GCP Cloud SQL**. Use custom build only when you need full UI control *and* provider embeds are not enough.

### 2.2 When do we need a GCP database?

**Short answer: you probably don't for launch.**

| Phase 1 MVP — no DB needed | Why |
|----------------------------|-----|
| Static pages | HTML/Astro files in the repo |
| Newsletter signups | Flodesk is the system of record |
| Donations | Keela is the system of record |
| Most forms | Flodesk, Keela, or Raisely forms store submissions in those products |
| Educator stories | `stories.json` or markdown in repo |

**When GCP Cloud SQL becomes worth it:**

| Trigger | What the DB gives you |
|---------|------------------------|
| **Custom school form** with internal workflow (status: new → contacted → qualified) | Query and assign leads without exporting from Flodesk |
| **Homeroom magic-link auth** | Store verified member emails synced from Keela |
| **Single dashboard** across Keela + form data | Your own tables if integrations are insufficient |
| **Audit / compliance** | Long-term retention rules you control |
| **High-volume API** | Rate limiting + deduplication server-side |

**If none of the above apply at launch, skip GCP entirely.** You can add Cloud SQL later without changing the static site — only the Vercel API routes change.

**GCP service:** **Cloud SQL (PostgreSQL)** — familiar relational model, matches schema in §4.3. Alternative: Firestore if you prefer document store (not required for this site).

### Why not Next.js / React SPA for v1?

The approved UI is a static document with scroll animations. A SPA adds bundle size, hydration complexity, and SEO risk without benefit for Phase 1. Astro (or plain static) gives multi-page + shared chrome with minimal change to current CSS.

### CMS recommendation rationale

**Phase 1:** Keep stories in `src/data/stories.json` and individual Markdown files. An engineering deploy is needed per story update — acceptable at launch volume (3–10 stories). This keeps the stack simple, avoids a new service dependency, and lets the team ship Phase 1 without provisioning a CMS.

**Phase 1.5 trigger:** When the content team needs to add or update stories, team bios, or event recaps without a developer, migrate story and team data to Sanity. Sanity was chosen over alternatives because it supports structured content types (matching the `stories.json` schema), has a free tier suitable for TCF's volume, and integrates cleanly with Astro via build-time fetch or webhook-triggered rebuild. Do not migrate until the editorial workflow actually demands it.

---

## 3. Project structure (target)

Evolution from current repo to buildable multi-page site:

```
Contentment-Website-2026/
├── docs/                          # Planning (unchanged)
├── site/                          # Current prototype (reference until migrated)
│   ├── index.html
│   └── assets/
├── src/                           # Astro source (recommended migration target)
│   ├── layouts/
│   │   └── BaseLayout.astro       # Nav, footer, fonts, global CSS
│   ├── components/
│   │   ├── Nav.astro
│   │   ├── Footer.astro
│   │   ├── Hero.astro
│   │   ├── StatBand.astro
│   │   ├── OrbitSection.astro     # How Change Happens
│   │   ├── Pillars.astro
│   │   ├── HomeroomBlock.astro
│   │   ├── DoorCards.astro
│   │   └── NewsletterForm.astro
│   ├── pages/
│   │   ├── index.astro            # Home
│   │   ├── why.astro
│   │   ├── stories/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   ├── schools.astro
│   │   ├── give/
│   │   │   ├── index.astro
│   │   │   └── monthly.astro
│   │   ├── privacy.astro
│   │   └── terms.astro
│   ├── styles/
│   │   ├── tokens.css             # :root variables from prototype
│   │   └── global.css             # Rest of prototype CSS
│   ├── scripts/
│   │   ├── nav.js
│   │   ├── animations.js
│   │   └── orbit.js
│   └── data/
│       ├── stories.json           # Phase 1: static JSON
│       └── stats.json             # Canonical proof points
├── public/
│   └── assets/                    # Images (moved from site/assets)
├── astro.config.mjs
├── package.json
└── README.md
```

**Migration rule:** Copy CSS and HTML structure verbatim from `site/index.html` into components. Do not refactor visual design during migration.

### Phase 1 interim (no Astro yet)

Keep building in `site/` with additional HTML files:

```
site/
  index.html
  why/index.html
  stories/index.html
  schools/index.html
  give/index.html
  give/monthly/index.html
  _partials/          # Optional: build script to inject nav/footer
  assets/
```

---

## 4. Data model

Phase 1 MVP is **mostly file-based**. Below is the logical data model — what exists in content, JSON, or external systems.

### 4.1 Content entities (no custom DB in MVP)

| Entity | Storage | Fields |
|--------|---------|--------|
| **Page** | HTML/Astro files | slug, title, meta description, sections |
| **Educator story** | `stories.json` or CMS | `slug`, `name`, `country`, `school`, `quote`, `body`, `photo`, `themes[]`, `published` |
| **Proof stat** | `stats.json` | `label`, `value`, `suffix`, `source_note` |
| **Four Pillar** | Hardcoded per messaging brief | `name`, `definition` (verbatim) |
| **Homeroom tier** | Config / Keela | `amount`, `name`, `description`, `keela_product_id` |
| **Door card** | Component props | `title`, `body`, `image`, `href`, `cta_label` |

### 4.2 External systems (source of truth)

| Data | System of record |
|------|------------------|
| Donations, recurring gifts | Keela |
| Newsletter subscribers | **Flodesk** |
| School / volunteer / general leads | **Flodesk, Keela, Raisely, or GCP** (per form decision) |
| Member access list | Keela (Phase 2 sync) or shared password |

### 4.3 GCP database schema (optional — Phase 2+)

Use **Cloud SQL (PostgreSQL)** on GCP only when custom forms or Homeroom auth need data you own. Connect from **Vercel Serverless Functions** via connection string (use Cloud SQL Auth Proxy or VPC connector for production).

**Skip this section entirely for Phase 1 if all forms use Flodesk / Keela / Raisely.**

#### Table: `school_inquiries`

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid PK | Auto-generated |
| `created_at` | timestamptz | Submission time |
| `school_name` | text | Required |
| `contact_name` | text | Required |
| `contact_email` | text | Required |
| `role` | text | e.g. Principal, Counselor |
| `country` | text | Optional |
| `message` | text | Optional free text |
| `source_page` | text | UTM or referrer slug |
| `status` | enum | `new`, `contacted`, `qualified`, `closed` |

#### Table: `newsletter_signups` (only if duplicating Flodesk in GCP — usually unnecessary)

Flodesk remains source of truth for newsletter. Only add this table if you need a local backup or custom `/updates` flow before Flodesk sync.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid PK | |
| `email` | text UNIQUE | |
| `first_name` | text | |
| `subscribed_at` | timestamptz | |
| `source` | text | `footer`, `/updates`, `festival` |
| `flodesk_subscriber_id` | text | Optional external reference |

#### Table: `homeroom_members` (Phase 2 — if magic-link auth)

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid PK | |
| `email` | text UNIQUE | Matches Keela donor email |
| `keela_contact_id` | text | External reference |
| `tier` | text | `5`, `25`, `100` |
| `active` | boolean | Recurring active |
| `last_verified_at` | timestamptz | |

#### Table: `stories` (if CMS not used)

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid PK | |
| `slug` | text UNIQUE | URL segment |
| `educator_name` | text | |
| `country_code` | char(2) | Map pin |
| `school_name` | text | |
| `quote` | text | |
| `body` | text | Markdown |
| `hero_image_url` | text | |
| `themes` | text[] | Filter tags |
| `published` | boolean | |
| `sort_order` | int | |

**Relationships:** Stories are standalone. School inquiries have no FK. Homeroom members are independent of stories.

---

## 5. Routing & deployment

| Environment | URL | Branch |
|-------------|-----|--------|
| Production | https://contentment.org | `main` → Vercel production |
| Preview | `*.vercel.app` | PR branches (automatic) |
| Local | `localhost:4321` (Astro) or `vercel dev` | — |

### Redirects (configure at host)

| From | To |
|------|-----|
| Old WordPress URLs (TBD audit) | 301 to new slugs |
| `/donate` | `/give/monthly` |
| Campaign sunset | 301 to archive or `/` |

### `/impact` vs `/about/impact` content boundary

Two URLs carry impact-related content. Build teams must treat these as separate pages with distinct audiences and content scope — do not share copy between them.

| URL | Audience | Content scope |
|-----|----------|---------------|
| `/impact` | General public (main nav) | Organisation story, headline outcomes, emotional highlights, link to `/stories`. Written in voice & tone. |
| `/about/impact` | Donors, due-diligence visitors | Detailed metrics, annual report, financials, accountability data. More factual register. |

Content briefs for both pages must be written and approved before either is built (Phase 2). Without a clear content boundary, the pages will overlap and dilute each other.

---

## 6. Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PUBLIC_SITE_URL` | Yes | `https://contentment.org` |
| `PUBLIC_KEELA_HOMEROOM_URL` | Yes | Keela checkout for default tier |
| `PUBLIC_KEELA_TIER_5_URL` | Yes | $5/month product |
| `PUBLIC_KEELA_TIER_25_URL` | Yes | $25/month |
| `PUBLIC_KEELA_TIER_100_URL` | Yes | $100/month |
| `PUBLIC_GA_ID` or `PUBLIC_PLAUSIBLE_DOMAIN` | Yes | Analytics |
| `FLODESK_API_KEY` | If custom newsletter POST | Server-side only (Vercel function) |
| `FLODESK_FORM_ID` or embed IDs | Per form | If using Flodesk embeds |
| `RAISELY_CAMPAIGN_URL` | If fundraise page | Public campaign link |
| `GCP_CLOUD_SQL_CONNECTION` | Phase 2 | Server-side only — Vercel → Cloud SQL |
| `GCP_SERVICE_ACCOUNT_JSON` | Phase 2 | Server-side only — never expose to browser |
| `HOMEROOM_GATE_PASSWORD` | Phase 2 | Vercel edge middleware — never commit |

Store secrets in **Vercel project environment variables**. Use `.env.example` in repo with empty values.

---

## 7. Integrations summary

| Service | Phase | Integration pattern |
|---------|-------|---------------------|
| **Vercel** | 1 | Git deploy, preview URLs, production domain |
| **Keela** | 1 | Direct links to hosted checkout |
| **Flodesk** | 1 | Embed or API for newsletter + optional forms |
| **Raisely** | 1.5 | Embed/link for peer-to-peer fundraise |
| **Analytics** | 1 | Script tag + CTA events |
| **Custom forms** | 1+ | Styled like site → Flodesk / Keela / Raisely **or** Vercel API → GCP |
| **GCP Cloud SQL** | 2+ | Optional — custom form storage, member auth |
| **Sanity CMS** | 1.5 | Build-time fetch or webhook rebuild |

Detail: [Frontend Specification — Integrations](./FRONTEND-SPECIFICATION.md#integrations)

---

## 8. Performance & caching

| Asset | Strategy |
|-------|----------|
| HTML | CDN cache, short TTL or immutable per deploy |
| Images | WebP where possible; `loading="lazy"` below fold |
| Fonts | Google Fonts with `preconnect` (already in prototype) |
| JS | Defer non-critical; respect `prefers-reduced-motion` |

---

## 9. Observability

| Signal | Tool |
|--------|------|
| Uptime | Vercel status / UptimeRobot |
| API errors (custom forms) | Vercel function logs; Sentry optional |
| Analytics | GA4 / Plausible |
| Form failures | Flodesk / Keela / Raisely dashboards + alert email |

---

## 10. Related documents

| Document | Location |
|----------|----------|
| PRD | [PRD.md](./PRD.md) |
| Security & access | [SECURITY-AND-ACCESS.md](./SECURITY-AND-ACCESS.md) |
| Frontend spec | [FRONTEND-SPECIFICATION.md](./FRONTEND-SPECIFICATION.md) |
| Feature tickets | [FEATURE-TICKETS.md](./FEATURE-TICKETS.md) |

---

## Changelog

| Date | Change |
|------|--------|
| 2026-06 | Initial technical architecture. Astro recommended; Supabase optional Phase 2. |
| 2026-06 | Stack confirmed: Vercel deploy, Flodesk newsletter, flexible forms (Flodesk/Keela/Raisely/custom), GCP Cloud SQL optional Phase 2. |
| 2026-06 | Committed to CMS path: markdown-in-repo (Phase 1) → Sanity (Phase 1.5); added rationale. Added /impact vs /about/impact content boundary definition to routing section. |
