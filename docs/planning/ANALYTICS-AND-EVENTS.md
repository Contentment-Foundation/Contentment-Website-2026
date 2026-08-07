# Analytics & Events — reference

**What this is:** the single place that answers *"we want to know X about the website — where do we look, and can we trust the number?"*

**Who it is for:** two audiences deliberately.
- **Non-technical** (Kristina, Lorna, WoeiJing, Nav): §1–§4. Which tool answers which question, and what each number does and does not include.
- **Engineering** (Somesh, future devs): §5–§8. How it is wired, how to add an event, and where the configuration lives.

**Why it exists:** this is the source material for the planned **internal website dashboard** for non-technical team members. Anything that dashboard surfaces should trace back to a row in §3.

> **Status:** current as of 7 Aug 2026. Analytics closed 7/7 under FEAT-080; verified live on the preview.
> **Keep it current:** if you add or rename an event, update §3 in the same commit — see §7.

---

## 1. Quick answers — "I want to know…"

| Question | Where to look | Trust it? |
|---|---|---|
| How many people visited a page? | **GA4** → Reports → Engagement → Pages | Undercounts — see §4 |
| Which pages get the most traffic? | **GA4** → Reports → Engagement → Pages | Relative ranking is reliable |
| Did anyone click Donate / Join Homeroom? | **PostHog** → Activity, filter `cta_homeroom_click` | Yes — best source |
| Is the donation form failing for people? | **PostHog** → `donate_fallback_click` | **Floor, not total** — see §3 |
| How many newsletter signups? | **Flodesk** (the actual list) | Flodesk is truth; PostHog shows attempts |
| Where do newsletter signups come from? | **PostHog** → `newsletter_submit`, group by `source` | Yes |
| Are forms erroring? | **PostHog** → `newsletter_error`, group by `reason` | Yes |
| How far do people scroll / where do they rage-click? | **Microsoft Clarity** → session recordings + heatmaps | Consented users only |
| Did the site throw a JavaScript error? | **Sentry** | Yes — not consent-gated |
| How many people went from `/why` to Get Involved? | **GA4** only | PostHog **cannot** answer this — see §4 |

---

## 2. The tools, and what each is for

| Tool | Purpose | Consent-gated? | Cookies? |
|---|---|---|---|
| **GA4** (`G-0GBRRW2MCL`) | Traffic, pages, journeys across the site | **Yes** — needs "statistics" consent | Yes |
| **PostHog** (US region) | Product events — clicks, form submits, conversions | **No** | **No** — cookieless by design |
| **Microsoft Clarity** | Session replay, heatmaps, rage-click detection | **Yes** | Yes |
| **Sentry** | JavaScript errors and crashes | No | No |
| **Cookiebot** | The consent banner itself; tells the others what is allowed | n/a | Necessary only |

**The important consequence:** GA4 and Clarity only see visitors who **accepted** cookies. PostHog sees **everyone**. So for *"did this thing happen at all"* questions, **PostHog is the more complete source** — which is the opposite of what most people assume, since GA4 is the more familiar tool.

Decisions behind this: [DECISION-001](./DECISIONS.md) (tool choice), [DECISION-002](./DECISIONS.md) (consent model), [DECISION-006](./DECISIONS.md) (error monitoring), [DECISION-007](./DECISIONS.md) (PostHog cookieless).

---

## 3. Event catalogue

All ten events fire to **GA4 and PostHog** (never Clarity). Every one carries the properties listed — use them to group and filter.

| Event | Fires when | Properties | Notes |
|---|---|---|---|
| `cta_homeroom_click` | Someone clicks a Join Homeroom CTA on Get Involved | `source`, `amount` | `amount` is the tier selected (25/50/100) |
| `donate_fallback_click` | Someone clicks the Raisely "Donate here instead" link under a donation widget | `provider`, `source` | **See the warning below** |
| `newsletter_submit` | A newsletter signup **succeeds** | `source`, `confirm` | `confirm: true` = double opt-in email sent, not yet confirmed |
| `newsletter_error` | A newsletter signup **fails** | `source`, `reason` | `reason: network` = the visitor's connection, not our bug |
| `content_shared` | Someone shares a page | `method`, `source` | `method`: `native_share` / `copy_link` / `email` |
| `event_rsvp_interest` | Someone clicks an RSVP / Save-my-spot button on Events | `event_key` | Interest only — not a booking; RSVP is not wired yet |
| `homeroom_join_interest` | Someone clicks a Homeroom link from the Events page | `source`, `placement` | |
| `school_partner_inquiry_started` | Someone starts a school partnership enquiry | `source` | |
| `partner_deck_downloaded` | Someone opens the schools partner deck | `source` | |
| `video_started` | A video is played in the Events recap section | `page_section`, `video_id` | Only the Events recap player is instrumented |

**`source` values you will see:** `homepage_homeroom_block`, `homepage_newsletter_band`, `why_homeroom_block`, `getinvolved_donate_split`, `updates_page`, `about_page`, `why_page`, `events_page`, `hero`, `close`.

> ### ⚠ Reading `donate_fallback_click` correctly
>
> This event is the **only** signal we get that the Keela donation form is failing for a real person.
>
> The form is an **embedded iframe served from Keela's own domain**. Browsers deliberately prevent a page from inspecting a cross-origin frame, so when it fails to load — as it currently does for **India and Brazil**, blocked at Keela's platform level (HC-082) — the donor sees a blank space and **we see nothing at all**. There is no error we can catch.
>
> **So: every click here is somebody telling us the primary donation path did not work for them.**
>
> **It is a floor, not a total.** It only counts people who noticed the fallback link and clicked it. Anyone who saw a blank frame and gave up is invisible. The real failure rate is higher by an unknown margin — treat this number as the minimum.
>
> Group by `source` to see *which page* is failing. A sustained non-zero count is evidence to take back to Keela — a number rather than an anecdote.

---

## 4. What these numbers cannot tell you

Read this before quoting any figure in a report.

**GA4 undercounts everything.** It only records visitors who accepted statistics cookies. Actual traffic is higher than GA4 shows, by however many people decline. Use GA4 for *relative* comparisons (which page is more popular, is traffic trending up) rather than absolute totals.

**PostHog cannot follow a person across pages.** It is configured cookieless so it needs no consent banner — the trade-off is that it has no memory between page loads. **Every page view looks like a brand-new anonymous person.** Practical consequences:
- "Unique users" in PostHog is roughly equal to page views. **Do not quote it as a number of people.**
- Multi-page funnels do not work. *"How many people read /why and then went to Get Involved"* is **not answerable in PostHog** — use GA4, accepting its consent undercount.
- Sessions do not persist across navigation.

This is recorded as an amendment on [DECISION-007](./DECISIONS.md). Changing it would mean adding PostHog to the cookie banner — a privacy/analytics trade-off for the team, not a code fix.

**Anything inside an embedded frame is invisible.** The Keela donation form, YouTube videos, and the Google enquiry form are all served by other companies inside iframes. We cannot see clicks, completions or failures inside them. Donation completions must be read in **Keela**; newsletter signups in **Flodesk**.

**Events are not revenue.** `cta_homeroom_click` means someone clicked, not that they gave. Reconcile actual income in Keela and QuickBooks.

---

## 5. How consent flows (technical)

1. **Cookiebot** loads first in `<head>` — a vendor requirement — in **manual** blocking mode.
2. Before any tool loads, we set the Consent Mode v2 defaults ourselves: `analytics_storage: denied`, `ad_storage: denied`, `functionality_storage: denied`, `personalization_storage: denied`, `security_storage: granted`.
3. Clarity is told the same via `clarity('consentv2', …)` with everything denied.
4. **PostHog loads regardless** — it is cookieless, so DECISION-007 says it needs no gate.
5. On `CookiebotOnAccept` / `CookiebotOnDecline`, `applyCookiebotConsent()` maps the Cookiebot categories onto `gtag('consent','update', …)` and Clarity's consent API.

**Manual mode is deliberate.** Cookiebot's *automatic* mode rewrites recognised tracker `<script>` tags to `type="text/plain"` until consent — which would have risked blocking our own inline consent-default script and would have blocked cookieless PostHog for no reason.

**Cookiebot's own Google Consent Mode is deliberately NOT enabled.** Enabling it would emit a second set of `gtag('consent', …)` calls racing ours.

Verified live: `gcs` moves `G100 → G111` and `gcd` moves `13p3p3p3p5l1 → 13r3r3r3r5l1` on accept.

---

## 6. Configuration

Every tool is behind its own environment variable and **no-ops silently if unset** — a missing PostHog key can never break GA4.

| Variable | Tool | Notes |
|---|---|---|
| `PUBLIC_GA_ID` | GA4 | `G-0GBRRW2MCL` |
| `PUBLIC_POSTHOG_KEY` | PostHog | |
| `PUBLIC_POSTHOG_HOST` | PostHog | **Must be `https://us.i.posthog.com`** — the project is US-region and the key 404s on EU |
| `PUBLIC_CLARITY_ID` | Clarity | |
| `PUBLIC_COOKIEBOT_ID` | Cookiebot | |
| `SENTRY_DSN` | Sentry | **Read via `process.env`, which `.env` does not populate** — a local `.env` alone ships zero Sentry code |

Set in the host's environment (Netlify today, Vercel at cutover) — **not** only in a local `.env`.

**Cookiebot's free tier allows one registered domain.** It is currently `contentmentweb2.netlify.app`. It **must** be moved to `www.contentment.org` at cutover or the banner silently stops appearing (HC-067).

Code: [`src/components/Analytics.astro`](../../src/components/Analytics.astro) (all tools + consent bridge), [`src/scripts/analytics.js`](../../src/scripts/analytics.js) (the `trackEvent` helper), [`docs/cookiebot/`](../cookiebot/) (custom banner sources, version-controlled rather than living only in the vendor dashboard).

---

## 7. Adding a new event

```js
import { trackEvent } from '../scripts/analytics.js';

trackEvent('event_name', { source: 'where_it_happened' });
```

Rules that keep this catalogue usable:

1. **`snake_case`**, verb-ish, describing what the *person* did — not what the code did.
2. **Always include `source`.** Without it you know something happened but not where, which makes the number unusable.
3. **Add a row to §3 in the same commit.** An event nobody documented is an event nobody will find.
4. **Don't put personal data in properties.** No email addresses, names or free text. PostHog is cookieless and GA4 is consent-gated precisely so we are not holding data we do not need.
5. `trackEvent` is safe to call when a tool is not configured — it checks and skips.

---

## 8. For the internal dashboard

When the non-technical dashboard is built, these are the panels worth having, and the honest caveat each needs displayed next to it:

| Panel | Source | Caveat to show |
|---|---|---|
| Traffic by page | GA4 | "Consented visitors only — real traffic is higher" |
| Donate CTA clicks | PostHog `cta_homeroom_click` | "Clicks, not completed donations" |
| **Donation form failures** | PostHog `donate_fallback_click` | "Minimum count — people who gave up are not counted" |
| Newsletter signups | Flodesk + PostHog `newsletter_submit` | "Flodesk is the real list" |
| Form errors | PostHog `newsletter_error` | "`network` = visitor's connection" |
| JS errors | Sentry | — |

**Build it against PostHog first** where a choice exists: it is not consent-gated, so its counts are complete, and its API is simpler than GA4's.

**The one panel to watch on launch day** is donation form failures. It is the only visibility we have into a donor being unable to give, and it is the thing most likely to fail silently.

---

## Related

| Document | Why |
|---|---|
| [DECISIONS.md](./DECISIONS.md) | 001 tools · 002 consent · 006 errors · 007 PostHog cookieless + its funnel limitation |
| [SECURITY-AND-ACCESS.md](./SECURITY-AND-ACCESS.md) | §5.1 regulatory position, data handling |
| [TECHNICAL-ARCHITECTURE.md](./TECHNICAL-ARCHITECTURE.md) | §6.1 env vars, §12 cutover runbook |
| [TRACKER.md](./TRACKER.md) | Dated history of every analytics change |
| `/privacy` (live page) | What we tell visitors we collect |

## Changelog

| Date | Change |
|---|---|
| 2026-08-07 | Created. Catalogued all 10 events, consent model, limitations, and dashboard guidance. Written after `donate_fallback_click` was added (HC-082) and the question "where do we actually see this?" showed the wiring existed but was documented nowhere. |
