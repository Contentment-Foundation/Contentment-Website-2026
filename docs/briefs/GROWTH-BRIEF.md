# contentment.org — Growth, SEO & Analytics Brief
> Q2 2026 · Post-Development · Marketing, Content & Growth Team  
> Prepared by **Somesh Bhardwaj** · somesh@contentment.org · Sr. System Admin, Full Stack AI Engineer · The Contentment Foundation

---

## 1. Analytics Setup

### Confirmed analytics stack

| Tool | Purpose | Why |
|------|---------|-----|
| **Plausible** | Primary traffic + events | Privacy-first; no cookie banner required in most jurisdictions; lightweight (< 1 KB script); GDPR compliant out of the box |
| **GA4** | Campaign attribution, funnels, audience insights | Required if running Google Ads or needing advanced audience segments |
| **Microsoft Clarity** | Heatmaps + session recordings | Free; shows where visitors click, scroll, and drop off — invaluable for CRO post-launch |
| **PostHog** *(if required)* | Product analytics, feature flags, funnels | Open-source alternative to Mixpanel/Heap; self-hostable on GCP; use in Phase 2 if you need funnel cohorts, A/B testing, or feature flag gating without a third-party data arrangement |

### Search presence tools

| Tool | Purpose | When to set up |
|------|---------|----------------|
| **Google Search Console** | Indexing, ranking, Core Web Vitals, manual actions | Day 1 post-launch — verify via DNS TXT in Vercel |
| **Bing Webmaster Tools** | Bing + Copilot indexing, keyword data, SEO insights | Day 1 post-launch — Bing serves Copilot AI search; free, 5-min setup |

> **Why Bing Webmaster Tools matters now:** Microsoft Bing powers Copilot AI answers. Adding TCF's sitemap there ensures contentment.org is indexed for AI-assisted search (Copilot/Bing Chat), not just Google AI Overviews.

### Conversion events to track (instrument at build — TICKET-080)

| Event | Trigger | Platform |
|-------|---------|----------|
| `cta_homeroom_click` | Any Homeroom CTA button click | Plausible + GA4 |
| `homeroom_checkout_start` | Keela redirect fires | GA4 (via URL param) |
| `cta_school_click` | "Start the conversation" CTA | Plausible + GA4 |
| `school_form_submit` | School discovery form success | Plausible + GA4 |
| `newsletter_submit` | Flodesk newsletter form success | Plausible + GA4 |
| `story_view` | Any /stories/[slug] page load | Plausible |
| `share_why` | Share button on /why | Plausible + GA4 |
| `event_rsvp_click` | Event RSVP or "Join for access" | Plausible + GA4 |

### Funnel to monitor (GA4 Explore — Funnel report)

```
Step 1: Session start (any page)
Step 2: Scrolls past hero (engagement > 10s or scroll depth > 40%)
Step 3: Visits /why or /stories (belief deepening)
Step 4: Visits /give/monthly (intent)
Step 5: cta_homeroom_click fires (conversion intent)
Step 6: Returns from Keela (post-donation — track via UTM on Keela thank-you redirect)
```

### UTM taxonomy (apply consistently on every campaign link)

| Parameter | Values |
|-----------|--------|
| `utm_source` | `newsletter` · `instagram` · `linkedin` · `youtube` · `google` · `facebook` · `partner` |
| `utm_medium` | `email` · `social` · `paid` · `organic` · `referral` · `qr` |
| `utm_campaign` | `homeroom-launch` · `festival-2026` · `anniversary` · `school-outreach` · `[specific campaign name]` |
| `utm_content` | `hero-cta` · `footer-cta` · `nav-pill` · `story-card` (for A/B variant labelling) |

### Monthly analytics dashboard (set up in Plausible + GA4)

| Metric | Target (90 days) | Review cadence |
|--------|-----------------|----------------|
| Homeroom conversion rate | Establish baseline; +20% vs old site | Monthly |
| /why share rate | ≥ 5% of /why sessions | Monthly |
| School form submissions | ≥ 10 qualified leads/month | Monthly |
| Newsletter signups | ≥ 200/month | Monthly |
| Homepage bounce rate | < 55% | Monthly |
| LCP (4G) | < 2.5 s | Every deploy |
| Top entry pages | — | Monthly (signals what content drives discovery) |
| Top exit pages | — | Monthly (signals where the journey breaks) |

---

## 2. User Journey Maps

### Journey A — Future Member (primary audience)

```
DISCOVERY          LANDING           ENGAGING          CONVERTING        BELONGING
─────────────────────────────────────────────────────────────────────────────────
Google search   → Any page        → /why or /stories → /give/monthly   → Welcome email
Social share      Cold visitor      Scrolls proof       Keela checkout    Newsletter
Word of mouth     Orientation       Educator story      Founding Member   Events
Email forward     line visible      resonates           confirmation      Renewal
                  (Step 1 hook)     (Steps 2 & 3)       (Step 4)          (Step 5)
```

**Drop-off interventions:**

| Drop-off point | Signal | Intervention |
|----------------|--------|-------------|
| Bounce from homepage | < 10s session | Strengthen hero headline; test Bhutan photo vs teacher close-up |
| Leaves /why without acting | Exits on evidence section | Add sticky "Join from $5" pill at scroll threshold |
| Reaches /give/monthly but doesn't convert | High exit rate | Simplify tier presentation; surface Priscillah quote earlier |
| Donates but doesn't open welcome email | Low open rate | Improve Keela welcome email subject line; send within 2 min |

**Email automation sequence (Flodesk — post-Homeroom join):**

| Email | Timing | Content |
|-------|--------|---------|
| Welcome — you're in | Immediate | Confirmation, Founding Member status, what happens next |
| Your seat in action | Day 3 | One educator story — show the ripple effect of their $5 |
| The community you joined | Day 7 | Events coming up, newsletter intro, /why share prompt |
| Monthly newsletter | Monthly | TCF updates, new stories, events, movement moments |

---

### Journey B — School Leader

```
DISCOVERY        AWARENESS          TRUST             ACTION            PARTNERSHIP
─────────────────────────────────────────────────────────────────────────────────
Colleague share → /schools         → Renewal data    → Discovery form  → Team follow-up
Google search     /why               Harvard research   Submit            TCF contact
LinkedIn post     Achievement        Educator story     Confirmation      School onboarded
Conference        framing            from their region  email             Programme begins
```

**Key insight:** School leaders need the achievement framing first (wellbeing → academic outcomes), not the emotional hook. Lead with Durlak (11-percentile-point gain) and Hawaiʻi renewal (9 in 10 schools renewed) before moving to stories.

---

### Journey C — Educator

```
DISCOVERY       RECOGNITION        RELIEF            COMMUNITY          ADVOCACY
────────────────────────────────────────────────────────────────────────────────
School-based  → /schools          → Free circles    → Circle/event     → Tells colleagues
Social media    "This is for me"    Scholarship         experience         School door opens
Colleague       not another         pathway             Shares TCF         TCF school partner
               plate               discovered          with others
```

---

## 3. SEO — Page-by-Page

### Meta titles and descriptions

All titles ≤ 60 characters. All descriptions 140–160 characters.

| Page | Title tag | Meta description |
|------|-----------|-----------------|
| **Home** `/` | The Contentment Foundation | We equip teachers with evidenced wellbeing practices. 325 schools. 12 countries. 86% of educators report real improvement. Join from $5/month. |
| **Why Teacher Wellbeing** `/why` | Why Teacher Wellbeing Matters — TCF | Teacher burnout is a children problem, a future problem. See the Harvard research, the 86% outcome, and why wellbeing is the antidote. |
| **Educator Stories** `/stories` | Educator Stories — The Contentment Foundation | Real teachers. Real transformation. Stories from 12 countries show what happens when educators are given the tools to tend to their own wellbeing. |
| **For Schools** `/schools` | School Wellbeing Partnerships — TCF | 9 in 10 partner schools in Hawaiʻi renewed. See how TCF's Four Pillars framework improves teacher wellbeing and student outcomes. Start a conversation. |
| **Get Involved** `/give` | Get Involved — The Contentment Foundation | A movement for teachers needs more than money. It needs you. Join Homeroom, bring it to your school, spread the word, or experience it yourself. |
| **Homeroom** `/give/monthly` | Join Homeroom — The Contentment Foundation | Nobody runs homeroom for teachers — until now. Become a Founding Member from $5/month and support teacher wellbeing worldwide. 100 Hearts. |
| **Events** `/events` | Events & Experiences — TCF | Contentment Festival 2026. Member workshops. Retreats. Experience the movement for yourself — attend, connect, and belong. |
| **About** `/about` | About The Contentment Foundation | Since 2016, TCF has reached 11,925 educators and 409,625+ students across 12 countries with scientifically evidenced teacher wellbeing practices. |
| **Impact** `/impact` | Our Impact — The Contentment Foundation | 86% of educators report improvement across wellbeing, relationships, and classroom presence. See how the ripple reaches every student they teach. |
| **Story page** `/stories/[slug]` | [Educator Name], [Country] — TCF Stories | [First sentence of educator's story — specific, emotional, named.] The Contentment Foundation. |
| **Privacy** `/privacy` | Privacy Policy — The Contentment Foundation | How The Contentment Foundation collects, uses, and protects your data when you visit contentment.org. |
| **Terms** `/terms` | Terms of Use — The Contentment Foundation | Terms governing use of contentment.org and The Contentment Foundation's digital properties. |

### Open Graph tags (per page — apply in BaseLayout.astro)

```html
<!-- Required on every page -->
<meta property="og:type"        content="website">
<meta property="og:site_name"   content="The Contentment Foundation">
<meta property="og:title"       content="[page title]">
<meta property="og:description" content="[meta description]">
<meta property="og:url"         content="https://contentment.org/[slug]">
<meta property="og:image"       content="https://contentment.org/assets/og/og-[page].jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height"content="630">

<!-- Twitter / X card -->
<meta name="twitter:card"       content="summary_large_image">
<meta name="twitter:title"      content="[page title]">
<meta name="twitter:description"content="[meta description]">
<meta name="twitter:image"      content="https://contentment.org/assets/og/og-[page].jpg">
```

**OG image brief:** 1200 × 630 px. Dark hero with TCF wordmark top-left. Page-specific headline in Newsreader. Teal accent. Bhutan or Kenya educator photo where appropriate. Create one per Phase 1 page.

> **Dependency:** the OG image brief above can't be finalized until the logo asset in the next section ships — sequence logo delivery *before* OG image production, not in parallel.

### Brand assets — logo, favicon & app icons

**Status: not yet in the repo.** No logo file or favicon exists in `site/assets/` today, and the JSON-LD below still points at a placeholder path (`/assets/logo.svg`). This blocks OG image production, structured data, the browser tab icon, and social profile consistency — treat it as a launch blocker, not a nice-to-have.

**Original logo — required variants**

| Asset | Format | Used for |
|-------|--------|----------|
| Primary lockup (wordmark) | SVG, transparent bg | Header, footer, OG image lockup, JSON-LD `logo` field, press kit |
| Icon-only mark | SVG, square | Source for favicon + app icons — must read clearly at 16px |
| Reversed / white version | SVG or PNG | Dark hero sections, footer, dark browser chrome |
| Raster export | PNG, min 512×512 | Fallback for scrapers/email clients that skip SVG |

**Favicon & app icon spec** (generate from the icon-only mark once finalized)

| File | Size | Purpose |
|------|------|---------|
| `favicon.ico` | 16×16, 32×32, 48×48 (multi-size ICO) | Legacy browser tab icon |
| `favicon-32x32.png` / `favicon-16x16.png` | 32×32 / 16×16 | Modern browsers |
| `apple-touch-icon.png` | 180×180 | iOS home screen / Safari |
| `android-chrome-192x192.png` / `android-chrome-512x512.png` | 192×192 / 512×512 | Android home screen, PWA manifest |
| `safari-pinned-tab.svg` | monochrome SVG | Safari pinned tab (macOS) |
| `site.webmanifest` | — | Declares icons, `theme_color` (`--ocean` #0080B0), `background_color` (`--paper` #FBFAF7), `name`/`short_name` |

**Head tags** (add to `BaseLayout.astro`; retrofit onto `site/index.html` in the interim):

```html
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32">
<link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16">
<link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180">
<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#0080B0">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#0080B0">
```

### Structured data — JSON-LD

**Homepage — Organization schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "NGO",
  "name": "The Contentment Foundation",
  "url": "https://contentment.org",
  "logo": "https://contentment.org/assets/logo.svg",
  "description": "The Contentment Foundation equips teachers with the wellbeing tools to thrive, because every future we care about runs through a teacher.",
  "foundingDate": "2016",
  "areaServed": "Worldwide",
  "numberOfEmployees": { "@type": "QuantitativeValue" },
  "sameAs": [
    "https://www.linkedin.com/company/contentment-foundation",
    "https://www.instagram.com/contentmentfoundation"
  ]
}
```

**Homeroom page — FAQPage schema** (for Homeroom FAQ section):
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is Homeroom?",
      "acceptedAnswer": { "@type": "Answer", "text": "Homeroom is TCF's monthly giving community..." }
    },
    {
      "@type": "Question",
      "name": "Is my contribution tax-deductible?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes. The Contentment Foundation is a registered 501(c)(3)..." }
    }
  ]
}
```

**Story pages — Article schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "[Educator Name]'s Story — [Country]",
  "author": { "@type": "Organization", "name": "The Contentment Foundation" },
  "publisher": {
    "@type": "Organization",
    "name": "The Contentment Foundation",
    "logo": { "@type": "ImageObject", "url": "https://contentment.org/assets/logo.svg" }
  },
  "datePublished": "[ISO date]",
  "image": "[hero_image_url]",
  "description": "[quote excerpt]"
}
```

---

## 4. Keyword Strategy

### Priority keywords by intent

| Intent | Keyword cluster | Target page | Difficulty |
|--------|----------------|-------------|------------|
| **Informational** | "why teacher wellbeing matters" · "teacher burnout effects on students" · "teacher wellbeing research" | `/why` | Medium |
| **Informational** | "teacher wellbeing statistics" · "teacher stress research" · "SEL program results" | `/why` + `/about/our-work` | Medium |
| **Navigational** | "Contentment Foundation" · "TCF teacher wellbeing" | Home | Low (own it) |
| **Commercial** | "teacher wellbeing program" · "school wellbeing partnership" · "wellbeing program for schools" | `/schools` | Medium–High |
| **Transactional** | "support teacher wellbeing" · "donate to teacher charity" · "teacher wellbeing charity" | `/give/monthly` | Low–Medium |
| **Local** | "teacher wellbeing program Kenya" · "teacher wellbeing Bhutan" · "teacher wellbeing Hawaii" | `/stories` + story pages | Low |

### Content clusters (hub and spoke)

```
Hub: /why (Teacher Wellbeing — the case)
  └── Spoke: /stories/[educator-name]  (proof — lived experience)
  └── Spoke: /about/our-work           (methodology — Four Pillars)
  └── Spoke: /schools                  (application — school leaders)
  └── Spoke: /impact                   (scale — numbers and outcomes)

Hub: /give (Get Involved)
  └── Spoke: /give/monthly             (Homeroom)
  └── Spoke: /give/corporate           (corporate giving)
  └── Spoke: /give/fundraise           (peer fundraise)
  └── Spoke: /events                   (experience it)
```

### Internal linking rules

- Every page links to `/why` (most shareable, strongest SEO signal)
- Every educator story links back to `/stories` (index) and `/why`
- `/schools` links to specific educator stories from the same region
- Footer links: `/why` · `/stories` · `/give/monthly` · `/schools`
- Anchor text should be descriptive, never "click here" or "learn more"

### Backlink targets

| Source type | Examples | Approach |
|-------------|---------|---------|
| Education media | EdSurge, Edutopia, TES | Guest article or research citation |
| Nonprofit/philanthropy | Chronicle of Philanthropy, Inside Philanthropy | Press release on milestone (10th anniversary) |
| Wellbeing / mental health | Greater Good Science Center, Mindful.org | Cite their research; they often reciprocate |
| Academic | University of Virginia (Jennings), Harvard GSE | Request citation link on research they reference |
| Regional education | Kenya education press, Bhutan news | Local educator stories |

---

## 5. AIO — AI Search Optimisation (GEO)

AI search engines (Google AI Overviews, Perplexity, ChatGPT Search, Bing Copilot) surface content differently from traditional search. They synthesise answers from authoritative, structured, factual sources.

### What makes content citable by AI

| Signal | How to apply |
|--------|-------------|
| **Factual density** | Lead every page with concrete stats: 325 schools, 86%, 12 countries. AI engines pull numbers. |
| **Direct answers** | Write one-sentence answers to likely questions before expanding. "Teacher wellbeing improves classroom quality. In the largest randomised trial of its kind…" |
| **Named citations** | Reference Jennings et al. (2017), Durlak et al. (2011) by name — AI engines trust pages that cite peer-reviewed research. |
| **Organisation entity** | Establish TCF as a named entity: consistent name, URL, founding date, mission across site, social profiles, and press mentions. |
| **E-E-A-T signals** | Staff/team page with real names and credentials; external citations; About page with founding story; press coverage links. |
| **FAQ format on key pages** | FAQPage schema + visible Q&A blocks on /give/monthly and /why. AI engines pull FAQ answers directly into overviews. |
| **Structured headings** | Use descriptive H2s that mirror likely search queries: "Does teacher wellbeing improve student outcomes?" |

### GEO content checklist per page

- [ ] Page answers one clear question in the first 50 words
- [ ] Stats appear in the first scroll
- [ ] At least one named external research citation (linked to DOI)
- [ ] FAQPage schema on /give/monthly and /why
- [ ] Organization schema on homepage
- [ ] Headings are question-shaped where appropriate
- [ ] No jargon without inline definition (for AI to understand context)

### Entity establishment priorities

| Action | Platform | Priority |
|--------|---------|---------|
| Consistent NAP (name, address, purpose) | All social + site | High |
| Wikipedia article or Wikidata entry | Wikipedia / Wikidata | High — AI engines heavily weight Wikipedia-linked entities |
| Google Knowledge Panel claim | Google Search Console + Google Business | High |
| Crunchbase / LinkedIn company page | Crunchbase, LinkedIn | Medium |
| Charity Navigator / GuideStar profile | CN, Candid | Medium — trust signal for AI and donors |
| Press coverage with entity mentions | Education press | High — AI favours entities cited in news |

---

## 6. Google Ranking Strategy

### Core Web Vitals — targets and owners

| Metric | Target | Owned by |
|--------|--------|---------|
| LCP (Largest Contentful Paint) | < 2.5 s | Engineering (image optimisation, preconnect) |
| INP (Interaction to Next Paint) | < 200 ms | Engineering (minimal JS, defer non-critical) |
| CLS (Cumulative Layout Shift) | < 0.1 | Engineering (explicit image dimensions, font display) |
| TTFB | < 600 ms | Vercel CDN (static = fast by default) |

### Google Search Console setup (day 1 post-launch)

- [ ] Verify ownership via DNS TXT record (Vercel DNS) or HTML meta tag
- [ ] Submit `sitemap.xml` (all public Phase 1 URLs)
- [ ] Set preferred domain (with or without www — choose and redirect the other)
- [ ] Monitor Core Web Vitals report weekly for first month
- [ ] Monitor Index Coverage — flag any pages marked as "Crawled but not indexed"
- [ ] Set up email alerts for manual actions or security issues

### sitemap.xml (generate via Astro integration or manually)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://contentment.org/</loc>           <priority>1.0</priority></url>
  <url><loc>https://contentment.org/why</loc>         <priority>0.9</priority></url>
  <url><loc>https://contentment.org/stories</loc>     <priority>0.9</priority></url>
  <url><loc>https://contentment.org/schools</loc>     <priority>0.8</priority></url>
  <url><loc>https://contentment.org/give</loc>        <priority>0.8</priority></url>
  <url><loc>https://contentment.org/give/monthly</loc><priority>0.9</priority></url>
  <url><loc>https://contentment.org/stories/[slug]</loc><priority>0.7</priority></url>
  <!-- exclude /homeroom/* (gated) and /privacy, /terms (low priority) -->
</urlset>
```

### robots.txt

```
User-agent: *
Allow: /
Disallow: /homeroom/
Disallow: /api/

Sitemap: https://contentment.org/sitemap.xml
```

### E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)

| Signal | Action |
|--------|--------|
| **Experience** | Educator stories with real names, schools, countries, and quotes; testimonials from named school leaders |
| **Expertise** | About / Team page with founder and team credentials; research page citing Jennings, Durlak, Harvard GSE |
| **Authoritativeness** | Press coverage links; Bhutan national strategy mention; Harvard GSE research citation; external backlinks |
| **Trustworthiness** | 501(c)(3) status + EIN on /give/monthly; /privacy and /terms pages live before launch; HTTPS; Charity Navigator profile |

---

## 7. Post-Launch Growth Cadence

### Month 1 — Establish baseline

| Week | Action |
|------|--------|
| 1 | Verify GSC, submit sitemap, confirm all events firing in Plausible + GA4 |
| 1 | Set up Clarity heatmaps on homepage, /why, /give/monthly |
| 2 | First analytics review — top entry pages, bounce by page, conversion funnel |
| 3 | Share /why on all channels with UTM links; track share rate |
| 4 | Month 1 report: baseline metrics locked in |

### Month 2–3 — Optimise

| Focus | Action |
|-------|--------|
| CRO | Review Clarity recordings of /give/monthly; identify drop-off point |
| SEO | Check GSC for impressions vs clicks; optimise titles on pages with high impressions + low CTR |
| Content | Publish 2+ additional educator stories (improves /stories crawl depth + backlink targets) |
| AIO | Ensure FAQPage schema live on /why and /give/monthly; check if TCF appears in AI Overviews |
| Email | Review welcome email open rate; A/B test subject line |

### Quarterly review cadence

| Review | Focus |
|--------|-------|
| Q3 2026 | GSC ranking gains; Homeroom conversion improvement vs baseline; story page performance |
| Q4 2026 | Festival campaign analytics; seasonal Homeroom push (holiday giving); year-end story |
| Q1 2027 | Annual SEO audit; update meta descriptions for pages with declining CTR; structured data audit |

---

## 8. Social Sharing Optimisation

### Per-page share assets (brief for comms team)

| Page | Share text | Asset |
|------|-----------|-------|
| `/why` | "Teacher burnout is a children problem. Here's the research — and what one org is doing about it." + link | Shareable stat card: 86% |
| `/stories/[slug]` | "[Educator name]'s story changed how I think about what teachers carry." + link | Educator photo card |
| `/give/monthly` | "I just joined the movement supporting teacher wellbeing. From $5/month anyone can." + link | Founding Member badge graphic |
| Home | "Every future we care about runs through a teacher. @ContentmentFdn" + link | Tagline card |

### Share button on /why (TICKET-020 acceptance criterion)

Implement `navigator.share()` (Web Share API) with copy-link fallback:

```javascript
async function shareWhy() {
  const data = {
    title: 'Why Teacher Wellbeing Matters',
    text: 'Teacher burnout is a children problem. Here is the research.',
    url: 'https://contentment.org/why'
  };
  if (navigator.share) {
    await navigator.share(data);
    trackEvent('share_why');
  } else {
    navigator.clipboard.writeText(data.url);
    // show "Link copied" toast
  }
}
```

---

## 9. Campaign Tracking — Festival 2026 & Anniversary

### UTM structure for Festival

```
utm_source=   instagram | email | google | partner
utm_medium=   social | email | paid | referral
utm_campaign= festival-2026
utm_content=  hero-banner | story-card | countdown-post | speaker-announcement
```

### Dedicated Festival analytics (TICKET-094)

- Separate Plausible goal: `festival_email_capture`
- Separate GA4 conversion: `festival_rsvp`
- Track traffic source breakdown for post-campaign report
- Archive redirect plan: after Festival, `/festival/2026` 301s to `/events` or an archive page

---

## 10. Open Actions — Growth Team

| # | Action | Owner | When |
|---|--------|-------|------|
| 0a | Finalize the original TCF logo — primary lockup, icon-only mark, reversed/white version (all SVG) | Design | Before launch — blocks #1 and #0b |
| 0b | Generate favicon + app icon set + `site.webmanifest` from the finalized icon-only mark | Design + Engineering | Before launch |
| 1 | Create OG images (1200×630) for all Phase 1 pages | Design | Before launch — depends on #0a |
| 2 | Write Homeroom FAQ answers for FAQPage schema | Copy | Before /give/monthly ships |
| 3 | Register on Charity Navigator + Candid (GuideStar) | Ops | Before launch |
| 4 | Claim Google Knowledge Panel | Marketing | Day 1 post-launch |
| 5 | Initiate Wikidata entity entry for TCF | Marketing | Week 1 post-launch |
| 6 | Produce share asset cards (stat card, Founding Member badge) | Design | Before launch |
| 7 | Write and schedule Flodesk welcome email sequence (3 emails) | Copy + Ops | Before Keela goes live |
| 8 | Set up Clarity heatmaps on homepage, /why, /give/monthly | Engineering | Day 1 post-launch |
| 9 | Submit sitemap to Google Search Console | Engineering | Day 1 post-launch |
| 10 | Identify 5 backlink targets from education press | Marketing | Month 1 |

---

## Related Documents

| Document | Location |
|----------|----------|
| Messaging & copy (taglines, CTAs, banned words) | `docs/MESSAGING-AND-COPY.md` |
| Evidence & research (DOIs for citation strategy) | `docs/EVIDENCE-AND-RESEARCH.md` |
| Site architecture (full URL inventory) | `docs/WEBSITE-ARCHITECTURE.md` |
| PRD (success metrics, feature list) | `docs/planning/PRD.md` |
| Frontend spec (integration specs for analytics) | `docs/planning/FRONTEND-SPECIFICATION.md` |
| Accessibility checklist & ARIA patterns | `docs/planning/ACCESSIBILITY.md` |
| Feature tickets (TICKET-080 analytics, TICKET-081 SEO) | `docs/planning/FEATURE-TICKETS.md` |
