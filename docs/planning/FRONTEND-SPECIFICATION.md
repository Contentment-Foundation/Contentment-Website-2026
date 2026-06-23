# Frontend Specification Document — contentment.org

> **Status:** Draft  
> **Last updated:** June 2026  
> **Contact:** somesh@contentment.org  
> **UI/UX policy:** **LOCKED.** This spec documents the approved prototype in `site/index.html`. New pages must reuse these patterns. No redesign, no new color palette, no new typography in v1.

**Source of truth:** `site/index.html` · [Messaging & Copy](../MESSAGING-AND-COPY.md) · [Voice & Tone](../VOICE-AND-TONE.md)

Related: [Technical Architecture](./TECHNICAL-ARCHITECTURE.md) · [PRD](./PRD.md)

---

## 1. Design system (from prototype)

### 1.1 Color palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--teal` | `#1FAFC0` | Accents, stat plus signs, ring highlights, link hovers |
| `--ocean` | `#0080B0` | Primary buttons, voice band gradient, Homeroom panel |
| `--deep` | `#024E70` | Headings, nav scrolled state, dark sections |
| `--deep2` | `#02374f` | Footer background, orbit section gradient end |
| `--green` | `#4FA98C` | Impact band, doors section gradient |
| `--slate` | `#3C3B43` | Body text on light backgrounds |
| `--ink` | `#23252b` | Default body color |
| `--paper` | `#FBFAF7` | Page background |
| `--paper2` | `#F2F0EA` | Alternate section background (How) |
| `--mist` | `#E8F1F2` | Newsletter section background |
| `--line` | `rgba(2,78,112,.12)` | Borders, input borders |
| Hero eyebrow / emphasis | `#bfeef5` | On dark hero and pillars |
| Impact gradient end | `#3C8E74` | Green band depth |

**Gradients (do not invent new ones):**

- Impact / doors: `linear-gradient(155deg, var(--green) 0%, #3C8E74 100%)`
- Orbit / Homeroom panel: `linear-gradient(165deg, var(--deep) 0%, var(--deep2) 100%)`
- Hero overlay: `linear-gradient(105deg, rgba(2,40,58,.86) …)`

### 1.2 Typography

| Role | Font | Weights | CSS variable |
|------|------|---------|--------------|
| Display (headlines, quotes, stats) | **Newsreader** (Google Fonts) | 400, 500, 600 + italic | `--display` |
| Body | **Inter** | 400, 500, 600, 700 | `--body` |
| Brand wordmark | **Varela Round** | 400 | `'Varela Round'` |

**Scale (use existing clamp values — do not change):**

| Element | Size |
|---------|------|
| Hero `h1` | `clamp(2.6rem, 5.6vw, 5.2rem)` |
| Section `h2.title` | `clamp(2rem, 4.2vw, 3.4rem)` |
| `.lead` | `clamp(1.12rem, 1.5vw, 1.4rem)` |
| `.body` | `1.1rem` |
| `.eyebrow` | `0.72rem`, `letter-spacing: 0.22em`, uppercase |

### 1.3 Spacing & layout

| Rule | Value |
|------|-------|
| Max content width | `1240px` (`.wrap`) |
| Horizontal padding | `32px` desktop · `22px` mobile (`≤560px`) |
| Section vertical padding | `clamp(76px, 10vw, 132px)` (`.band`) |
| Tight sections | `clamp(56px, 7vw, 92px)` (`.band-tight`) |
| Grid gaps | `22px`–`48px` per component (match prototype) |
| Border radius — cards | `18px` |
| Border radius — buttons, inputs | `999px` (buttons) · `12px` (inputs) · `16px` (tiers) |

### 1.4 Shadows & motion

| Token | Value |
|-------|-------|
| `--shadow` | `0 18px 50px -20px rgba(2,55,79,.35)` |
| Button hover lift | `translateY(-2px)` |
| Scroll reveal | `.anim` → `.anim.in` via IntersectionObserver |
| Orbit scroll height | `560vh` (`.orbit-scroll`) |
| Beat fade duration | `1.1s` |
| **Reduced motion** | `@media (prefers-reduced-motion: reduce)` disables orbit animation, pulse, parallax |

---

## 2. Components (reuse — do not redesign)

### 2.1 Buttons (`.btn`)

| Variant | Classes | Appearance |
|---------|---------|------------|
| Primary | `.btn.btn-primary` | Ocean background, white text, pill shape |
| Ghost | `.btn.btn-ghost` | White border on dark backgrounds |
| Nav CTA | `.nav-cta` | White pill on nav |
| Homeroom CTA | `.btn-primary` on white bg | White button, deep text |

**Rules:** Include optional `.arrow` span with `→`; hover shifts arrow `4px` right.

### 2.2 Navigation (`header`)

| State | Behavior |
|-------|--------|
| Top of page | Transparent over hero |
| Scrolled (`scrollY > 40`) | `.scrolled` — deep background, blur, reduced padding |
| Mobile `≤940px` | `.nav-links` hidden; `.menu-btn` visible — **MVP must add drawer** |
| Persistent CTA | "Join Homeroom" pill → `/give/monthly` |

### 2.3 Section patterns

| Pattern | Class | Use for |
|---------|-------|---------|
| Full-bleed hero | `.hero` | Page heroes |
| Split image + text | `.split` | Why section, longform pages |
| Impact stats band | `.impact` + `.stats` | Proof numbers with count-up |
| Voice band | `.voice` | Educator quote interstitial (Kenya band style) |
| Pinned orbit | `.how-orbit` | How Change Happens — 5 steps |
| Community circles | `.alone` + `.circles` | Global community imagery |
| Four pillars accordion | `.pillars` + `.pcard` | Official pillar definitions |
| Homeroom split | `.homeroom` + `.tiers` | Giving section |
| Door cards | `.doors` + `.door` | Three-way paths |
| Newsletter | `.news` | Email capture |
| Footer | `footer` + `.foot-top` | 4-column footer |

### 2.4 Inputs (newsletter form)

```html
<input type="email" placeholder="Email address" aria-label="Email address">
```

| Property | Value |
|----------|-------|
| Padding | `0.95em 1.1em` |
| Border | `1.5px solid var(--line)` |
| Focus | `border-color: var(--teal)` |
| Layout | `.row` flex gap `12px` |

**Modals:** Not in prototype. Use new page or inline section — do not introduce modal library in v1.

### 2.5 Cards

| Type | Class | Notes |
|------|-------|-------|
| Door card | `.door` | Image 4:3, white body, ocean link |
| Quote card | `.quote-card` | On impact band |
| Tier row | `.tier` | Homeroom pricing rows |
| Story card (new pages) | **Extend `.door`** | Same border-radius, shadow, hover lift |

---

## 3. Page templates (new pages must follow)

Every page includes:

1. **Orientation line** (or variation) in first screen — per [Messaging brief](../MESSAGING-AND-COPY.md)
2. **One primary CTA** — per CTA taxonomy
3. Shared `header` + `footer` from prototype
4. At least one `.band` section using approved patterns

| Page | Hero pattern | Primary sections |
|------|--------------|------------------|
| `/` | `.hero` full viewport | All prototype sections |
| `/why` | `.hero` or `.split` | Longform + evidence + reflection |
| `/stories` | `.hero` compact | Grid of `.door`-style cards; map Phase 1.5 |
| `/stories/[slug]` | `.split` | Quote + body + CTA |
| `/schools` | `.split` | Tiers + proof + form |
| `/give` | `.hero` compact | Five seat blocks (door pattern) |
| `/give/monthly` | `.homeroom` | Tiers + FAQ + founding CTA |

---

## 4. Responsive breakpoints

| Breakpoint | Changes (from prototype) |
|------------|--------------------------|
| `≤940px` | Single column splits; 2-col stats; mobile nav; static orbit beats |
| `≤760px` | Voice band stacks |
| `≤560px` | Mobile hero image swap; reduced padding; single-col pillars |

**Do not add new breakpoints.**

---

## 5. Accessibility requirements

| Requirement | Implementation |
|-------------|----------------|
| Reduced motion | Already in prototype — preserve on all pages |
| Pillar accordion | `tabindex="0"`, `role="button"`, `aria-expanded` |
| Images | Descriptive `alt` (see prototype examples) |
| Focus states | Visible on inputs and interactive cards |
| Skip link | Add to shared layout (MVP ticket) |
| Color contrast | Teal on white and white on deep meet AA for body text |

---

## 6. Integrations

### 6.1 Keela (donations)

| Field | Detail |
|-------|--------|
| **Purpose** | Recurring Homeroom gifts; one-time gifts (Phase 1.5) |
| **Integration type** | Redirect to hosted Keela checkout URLs |
| **Called from** | Nav CTA, hero CTA, Homeroom section, `/give/monthly` tier buttons |

**Flow:**

1. User clicks CTA with `data-tier="5"` (or 25, 100)
2. Browser navigates to `PUBLIC_KEELA_TIER_*_URL`
3. Keela handles payment, receipt, tax documentation
4. Keela thank-you page or redirect URL (configure in Keela dashboard)

**Data sent:** None from our frontend except URL params Keela supports (e.g. UTM preserved in redirect link).

**Expected response:** Keela hosted UI — no JSON API from browser.

**Env vars:** `PUBLIC_KEELA_TIER_5_URL`, `PUBLIC_KEELA_TIER_25_URL`, `PUBLIC_KEELA_TIER_100_URL`

---

### 6.2 Newsletter (Flodesk — confirmed)

| Field | Detail |
|-------|--------|
| **Purpose** | Subscribe visitors to TCF newsletter |
| **System of record** | **Flodesk** |
| **Integration type** | Flodesk embed **or** custom form POST → Vercel API → Flodesk API |

**Option A — Flodesk embed (fastest):**

- Flodesk provides embed code / form URL for footer and `/updates`
- Style wrapper to match `.news` section; Flodesk handles validation and double opt-in if enabled
- Subscribers land in Flodesk audience automatically

**Option B — Custom form + Vercel function (full UI control):**

- Keep prototype inputs (first name, email)
- POST to `/api/newsletter` (Vercel Serverless Function)
- Server calls Flodesk API with `FLODESK_API_KEY` (never in browser)
- Body: `{ "email", "first_name", "source": "footer" | "updates" }`
- Expected: `200` → show inline thank-you

**Triggered from:** Footer newsletter section, `/updates` page, Festival email capture (Phase 1.5).

---

### 6.3 Forms (flexible — per page)

Forms are **not one-size-fits-all**. Use the provider that already owns the workflow.

| Form | Options | Notes |
|------|---------|-------|
| **School discovery** | Flodesk form · Keela form · Raisely · **Custom** → `/api/school-inquiry` | Custom keeps `.news input` styling |
| **Fundraise** | Raisely embed or campaign link | Peer-to-peer per `/give/fundraise` |
| **Volunteer** | Flodesk or Keela form | Phase 1.5 |
| **General contact** | Flodesk | Optional |

**Custom school form — POST `/api/school-inquiry`:**

```json
{
  "school_name": "string, required",
  "contact_name": "string, required",
  "contact_email": "email, required",
  "role": "string, optional",
  "country": "string, optional",
  "message": "string, optional",
  "source_page": "/schools"
}
```

**Server behavior (pick one per deployment):**

1. Forward to Flodesk / Keela API (no GCP DB), or
2. Insert into **GCP Cloud SQL** `school_inquiries` + notify partnerships email (Phase 2)

**Success:** `200` — inline thank-you matching voice & tone.  
**Error:** Friendly message + `mailto:somesh@contentment.org`.

---

### 6.4 Keela & Raisely (reference)

**Keela:** Donations only — redirect links, not form POST from site. See §6.1.

**Raisely:** Fundraise campaigns — embed iframe or `PUBLIC_RAISELY_CAMPAIGN_URL` link from `/give/fundraise`.

---

### 6.5 Analytics (Plausible or GA4)

| Field | Detail |
|-------|--------|
| **Purpose** | Traffic, conversions, campaign UTMs |
| **Integration** | Script in `<head>` via layout |

**Events to track (data attributes or gtag):**

| Event name | Trigger |
|------------|---------|
| `cta_homeroom_click` | Any primary Homeroom CTA |
| `cta_school_click` | Start the conversation |
| `newsletter_submit` | Successful signup |
| `story_view` | Story page load |
| `share_why` | Share button on `/why` |

**UTM:** Preserve standard `utm_source`, `utm_medium`, `utm_campaign` — document in campaign briefs.

---

### 6.6 Homeroom gate (Phase 2)

| Field | Detail |
|-------|--------|
| **Purpose** | Protect `/homeroom/*` |
| **Method** | Edge middleware checks cookie or basic auth password |

**Flow:**

1. User visits `/homeroom`
2. Middleware checks `homeroom_session` cookie
3. If missing → password form (simple HTML page matching design system)
4. On success → set HTTP-only cookie, 7-day expiry

---

### 6.7 Google Fonts

| Field | Detail |
|-------|--------|
| **URL** | `fonts.googleapis.com` — Newsreader, Inter, Varela Round |
| **Already in** | `site/index.html` `<head>` |
| **Copy exactly** to all page layouts |

---

## 7. Asset guidelines

| Rule | Detail |
|------|--------|
| Location | `public/assets/` or `site/assets/` |
| Naming | Keep existing filenames until CMS migration |
| Hero images | Desktop + mobile variants where prototype uses both |
| Educator photos | Real educators; named where permitted |
| Global framing | US + Bhutan + Kenya in one frame when possible |

---

## 8. Copy integration

All UI text must follow:

- [Messaging & Copy](../MESSAGING-AND-COPY.md) — wins on copy
- [Voice & Tone](../VOICE-AND-TONE.md) — persona
- No em dashes; no "donor"; no banned words

---

## 9. Related documents

| Document | Location |
|----------|----------|
| Prototype | [`../../site/index.html`](../../site/index.html) |
| Technical architecture | [TECHNICAL-ARCHITECTURE.md](./TECHNICAL-ARCHITECTURE.md) |
| Security | [SECURITY-AND-ACCESS.md](./SECURITY-AND-ACCESS.md) |
| Feature tickets | [FEATURE-TICKETS.md](./FEATURE-TICKETS.md) |

---

## Changelog

| Date | Change |
|------|--------|
| 2026-06 | Initial frontend spec — locked to prototype. |
| 2026-06 | Updated integrations section to confirmed stack: §6.2 Newsletter → Flodesk (replaces Mailchimp/Formspree options); §6.3 Forms → flexible per-page strategy (Flodesk/Keela/Raisely/custom Vercel API, replaces Formspree-only); §6.4 added Raisely reference. Fixed section numbering — restored missing §6.5 Analytics heading (content had been merged incorrectly into §6.4). |
