# Response — Lorna's "Website → Keela → Finance" map

**Date:** 5 August 2026
**From:** Somesh Bhardwaj (engineering)
**To:** Lorna Holman · cc Kristina Blundon, Woei Jing, Ni Luh (Cika)
**Lorna's map:** https://website-keela.netlify.app/
**Our preview:** https://contentmentweb2.netlify.app/

---

## Short version

The map is right, and it is the most useful thing anyone has produced on this integration. Checked stream by stream against the built site — **Stream 1 matches what is live, Stream 2 confirms a real defect we suspected but had not proven**, and three genuine disconnects surfaced that neither side could see alone.

**Lorna's Decision 4 can close today** — the draft site has been live throughout and every route is listed below.
**Lorna's Decision 1 is half-answered already** — the price is settled, only the benefits are missing.
**Two things Lorna does not know yet:** we route email capture to Flodesk, not Keela; and there is no waitlist page.
**One thing that needs settling this week:** Lorna's timeline launches 8/17, ours says Aug 21.

---

## 1. Stream-by-stream check against the live build

| Lorna's stream | Status on the map | What is actually built | Verdict |
|---|---|---|---|
| **1 · General donations** | ✓ Working | Keela General Donation Form (`give-usa` embed `MnqZFksL49Ym3M8Ho`, org `CBbknhqovLi8DNEzW`) live on the homepage Homeroom band, the `/why` give band and `/getinvolved#donate`. One master script in BaseLayout; CSP allows `cdn.keela.co`. | **Agreed — live** |
| **2 · Campaign-designated donations** | Needs build | Correct, and worth stating plainly: **the general widget cannot capture campaign designation as built.** Designated gifts (homeroom, event, other) would land undesignated and receipt with the wrong tax letter. | **Agreed — confirmed defect** |
| **3 · Homeroom membership** | Blocked | The page **exists** — `/getinvolved#become`, with $25/$50/$100 tiers that deep-link to the homepage form with amount + frequency prefilled. It is an interim, not nothing. But it is **not a membership product** in Keela. | **Agreed it is blocked — but see §2** |
| **4 · November waitlist** | Decide | **There is no waitlist page.** `/events` has email capture: the hero "Save my free spot" opens a modal → **Flodesk** segment `Contentment Festival`; three Upcoming-grid CTAs currently just scroll to `#ev-signup`. | **Bigger gap than the map shows** |
| **5 · Event sign-ups & other forms** | Decide | Same picture — capture exists, all of it goes to **Flodesk**, none of it to Keela. | **Agreed, plus §3** |

QuickBooks reconciliation is entirely on Lorna's side; no website work attaches to it.

---

## 2. Decision 1 — the price is already decided

The map asks *"What does homeroom membership include, and what does it cost?"* as one question. It is two, and **half of it was answered on 27 July**:

- **Cost — SETTLED.** D-01 fixed the tiers at **$25 / $50 / $100** (Kristina, 27 Jul). The earlier `$5` entry copy was removed from the homepage on 3 Aug. The site, the Sheet and the donate widgets all already say $25/$50/$100.
- **Benefits — GENUINELY OPEN.** What a member actually *gets* has never been decided, and Lorna is right that this is the blocking half: benefits set the tax-deductible portion of the receipt → which sets the Keela designation → which sets the widget configuration.

**Ask:** confirm Lorna is only waiting on benefits. If price is also being re-opened, that contradicts a decision the copy has already shipped against, and Kristina should be in that conversation. *(Tracked as D-25.)*

**The interim proposal on the map — launch an interest form instead of a payment page — is sound, and we can build it in under a day.** The capture UI, modal and API path all already exist.

---

## 3. The disconnect Lorna cannot see: we send sign-ups to Flodesk, not Keela

**This is the most important item in this document.**

The map assumes that **every** sign-up lands in Keela — tagged, confirmed, internally notified. What we actually built, per **D-19** and live since 4 Aug:

- All email capture sitewide posts to **Flodesk** via `/api/newsletter` — **11 capture points across 5 pages**, double opt-in on, `optin_ip` + `optin_timestamp` recorded as the EU/US consent trail.
- **Keela handles payments only.**
- **Nothing moves a Flodesk subscriber into Keela.**

Both systems cannot be the record of truth for the same person without a sync, and nobody has decided which is. Three options:

1. **Flodesk for email, Keela for money** — cheapest, matches what is live and tested. The tagging / confirmation / internal-notification requirements would be met *in Flodesk* instead, and donor records would not show non-donor sign-ups.
2. **Keela for everything** — matches the map exactly, one donor record. Means replacing live capture on 5 pages and re-testing all 11 points, and Flodesk's double opt-in trail needs a documented Keela equivalent for EU/UK compliance.
3. **Both, with a sync** — most moving parts, and someone must own dedupe. Sync failures are silent by nature.

**This is urgent for exactly the reason the map itself gives.** Every day it stays open, more addresses accumulate in Flodesk that may later have to be exported, deduped and re-tagged into Keela by hand — the precise cleanup the map warns is exponentially more work after the fact.

*(Tracked as HC-078 / DECISION-008. Supersedes D-24, which asked this for `/events` alone — the answer has to be sitewide, or three pages behave three different ways.)*

---

## 4. Decision 3 — the waitlist page does not exist

Stream 4 shows a **waitlist page** for the November online event, with Keela tagging, source tracking, a confirmation email, a post-waitlist sequence and a conversion path to registration.

**None of that exists, and the page is not in the Phase 1 page list.** What exists is `/events` email capture into Flodesk.

The map names the cause itself: Lorna and Cika scoped the festival waitlist last week **but not in relation to the website**, so the plan and the site were never reconciled.

**Ask:** is a dedicated waitlist page in Phase 1 scope? If yes, it depends on §3 first — build it before the Keela/Flodesk question is settled and it gets built twice. Once decided, the build is small: the capture UI, modal and API path already exist.

*(Tracked as HC-079.)*

---

## 5. Decision 2 — what happens after each sign-up

Lorna is right that this needs a scenario walkthrough, and we should do it. But it is **downstream of §3** — "how is this person tagged, what confirmation do they get, who is notified" has a different answer in Flodesk than in Keela. Settling §3 first makes the walkthrough one meeting instead of two.

**We can bring to that walkthrough:** the exact list of all 11 capture points, what each currently sends, and which segment it lands in.

---

## 6. Decision 4 — access to draft pages: closeable now

The ask is to see and test each page with its widget before launch. **The draft site has been live throughout** — this needs no build work, only the link:

| Page | URL |
|---|---|
| Home (donate widget in Homeroom band) | https://contentmentweb2.netlify.app/ |
| Why Teacher Wellbeing (give band widget) | https://contentmentweb2.netlify.app/why |
| Get Involved (tiers + `#donate` widget) | https://contentmentweb2.netlify.app/getinvolved |
| Events (capture modal) | https://contentmentweb2.netlify.app/events |
| Our Impact | https://contentmentweb2.netlify.app/our-impact |
| For Schools | https://contentmentweb2.netlify.app/schools |
| About | https://contentmentweb2.netlify.app/about |
| Updates (newsletter signup) | https://contentmentweb2.netlify.app/updates |
| Privacy | https://contentmentweb2.netlify.app/privacy |

Every page updates automatically on each push — no request needed, and no version to keep re-sending.

---

## 7. Launch date — 8/17 vs Aug 21

The map's timeline ends **"Sun 8/17 — Launch (MVP scope)"**, with Keela build 8/7–8/13 and end-to-end testing 8/13–8/15.
**The launch plan of record says Aug 21**, with Aug 10–14 as the review-and-fixes window.

This is not a documentation nit — **Lorna is scheduling the Keela build, the testing and personal capacity against 8/17**, and has said anything not decided by 8/7 moves to a post-launch list.

- **If 8/17 holds:** our review-and-fixes window *becomes* launch week. The Aug 21 buffer disappears, and QA fixes, the Nav + WJ sign-off and the DNS cutover all compress.
- **If Aug 21 holds:** Lorna gains four days, and the 8/7 decision deadline can move with it.

**Also worth checking:** the map labels it *"Sun 8/17"*, but **17 Aug 2026 is a Monday** — that week's Sunday is 8/16. The other four labels (Tue 8/4, Wed 8/5, Fri 8/7, and the 8/13–8/15 window) are all correct, so this reads as one slipped label rather than a different week. Worth confirming Mon 17 Aug is what is meant, since launching on a Sunday and on a Monday imply different cover arrangements.

**Ask:** Kristina + Nav to confirm one date. *(Tracked as HC-080.)*

---

## 8. What we need back — and what changes if the answer is different

| # | What we need | Why it matters | Ticket |
|---|---|---|---|
| 1 | **Where sign-ups land — Keela or Flodesk** | Blocks the waitlist page and every post-sign-up flow. Cleanup cost grows daily | HC-078 / DECISION-008 |
| 2 | **How campaign designation is captured** — extra widgets, or URL parameters on the existing one? | Determines whether we embed more forms or pass params. Until then, designated gifts receipt wrongly | FEAT-060 |
| 3 | **Homeroom: separate membership widget, or three per-tier checkout URLs?** | **These are different integrations.** We have been asking for three links (`seams.joinTiers`); Stream 3 proposes a widget. If it is a widget, `seams.joinTiers` is the wrong model and FEAT-051 needs re-specifying | HC-075 / FEAT-051 |
| 4 | **Membership benefits** (price is settled) | Sets the tax-deductible portion → the Keela designation → the widget config | D-25 |
| 5 | **Keela Donate button colour** | Shipped pages show Keela's default `#507b91`; brand spec is `#0090bd`. Dashboard-side fix, not ours | HC-070 |

> **Point 3 is why this was never answerable as "please send the URLs."** We had been chasing a deliverable that may not be the right shape. Worth saying so plainly rather than letting Lorna think the request was simply slow.

---

## 9. What we will do without waiting

- **Send the preview links** (§6) — closes Decision 4 today.
- **Prepare the 11-capture-point inventory** for the scenario walkthrough, so it is one meeting.
- **Build the Homeroom interest form** as the interim, on Lorna's go-ahead — under a day, reuses existing components.
- **Hold** on the waitlist page and any designation wiring until §3 is decided, so nothing is built twice.

---

## Suggested Slack reply

> Thanks Lorna — this map is genuinely the clearest picture anyone has put together of this, and it caught something real. Checked it stream by stream against the live build:
>
> **Confirmed:** Stream 1 matches — the general donation form is live on Home, Why and Get Involved. And you're right on Stream 2: the current widget **cannot** capture campaign designation, so designated gifts would receipt with the wrong tax letter. Good catch.
>
> **Your Decision 4 — done, no waiting.** The draft site has been live all along: https://contentmentweb2.netlify.app/ — the donate widgets are on `/`, `/why` and `/getinvolved`, the events capture is on `/events`. It updates on every push, so nothing to re-send.
>
> **Your Decision 1 is half-answered.** The *cost* was decided on 27 July — **$25 / $50 / $100** (D-01), and the site already says so. What's genuinely missing is what membership **includes**, which is the half that sets the tax-deductible portion. So we only need benefits, not pricing.
>
> **Two things you couldn't have known, and one is important:**
>
> **1. Our sign-ups currently go to Flodesk, not Keela.** All email capture sitewide — 11 points across 5 pages — posts to Flodesk (decided as D-19, live since 4 Aug). Keela handles payments only, and nothing syncs between them. Your Streams 4 and 5 assume Keela. We need one decision on which system owns non-donor sign-ups, and it needs to be sitewide rather than per page. **This is the urgent one, for exactly the reason your map gives** — every day it's open, more addresses pile up in Flodesk that may later need exporting and re-tagging by hand.
>
> **2. There's no waitlist page yet.** `/events` has email capture, but the dedicated waitlist page in your Stream 4 doesn't exist and isn't in the Phase 1 page list. Makes sense given you and Cika scoped it without reference to the site. Depends on #1 — otherwise we build it twice.
>
> **One scheduling flag:** your map launches **8/17**, our plan says **Aug 21**. Both are being worked to right now, and you're scheduling your Keela build against 8/17 — so we should settle this before anything else. @Kristina @Woei Jing can we confirm one date? (Small thing: 17 Aug is a Monday, not Sunday — your other dates all check out, so probably just a label slip.)
>
> **On the per-tier Keela links:** we'd been asking for three checkout URLs, but your Stream 3 proposes a separate membership widget — those are different integrations on our side, so that's on us for asking for the wrong thing. Tell us which and we'll build to it.
>
> Yes to the scenario walkthrough — suggest we settle the Keela-vs-Flodesk question first so it's one meeting rather than two. I'll bring the full list of all 11 capture points and what each currently sends. Happy to build your Homeroom **interest form** interim in the meantime — that's under a day.

---

## Tracked as

| Item | Where |
|---|---|
| Keela vs Flodesk for sign-ups | HC-078 · DECISION-008 · supersedes D-24 |
| Homeroom membership benefits | D-25 |
| November waitlist page | HC-079 |
| Launch date conflict | HC-080 |
| Campaign designation + per-tier model | FEAT-060 · FEAT-051 · HC-030 · HC-075 |
| Keela button colour | HC-070 |
