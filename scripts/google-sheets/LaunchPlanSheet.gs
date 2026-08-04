/**
 * contentment.org Launch Plan — Google Sheets builder V1
 *
 * IMPORTANT — bind this script to the Sheet, don't create it standalone:
 * Open the Sheet itself → Extensions → Apps Script. Do NOT start from
 * https://script.google.com → "New project" — a standalone project only
 * talks to the spreadsheet via CONFIG.SPREADSHEET_ID; it never attaches to
 * it, so Extensions → Apps Script on the Sheet will show nothing, the
 * onOpen() simple trigger won't fire, and the "Launch Plan" menu never
 * appears. (We hit exactly this — fixed by recreating the project bound to
 * the Sheet and removing the orphaned standalone one.)
 *
 * SETUP (one time, on a NEW sheet — the current sheet is already set up):
 * 1. Open the target Google Sheet → Extensions → Apps Script
 * 2. Paste this entire file → Save
 * 3. Run createOrRefreshLaunchPlan → authorize → check logs for Sheet URL
 * 4. Copy the spreadsheet ID from the URL into CONFIG.SPREADSHEET_ID so future runs update the same file
 * 5. Reload the Sheet tab so onOpen() registers and the "Launch Plan" menu appears
 * 6. Optional: Launch Plan menu → "Install daily auto-refresh (9am)" to keep the Reference tab current automatically
 *
 * REFRESH: just push changes to docs/planning/launch-plan-data.json on GitHub.
 * The daily trigger (or a manual "Refresh from source" run, from the Sheet's
 * "Launch Plan" menu) will fetch the latest JSON automatically — no need to
 * re-paste this script for data changes.
 * The EMBEDDED_DATA below is a fallback only (used if GitHub is unreachable).
 */

const CONFIG = {
  SPREADSHEET_ID: '1P9Cp56k7BCzx0tKjisKFH3IeGoN0YIDW_m_icmbXHFY',
  SHEET_TITLE: 'contentment.org — Launch Plan',
  TIMEZONE: 'America/Los_Angeles',
  JSON_URL: 'https://raw.githubusercontent.com/Contentment-Foundation/Contentment-Website-2026/main/docs/planning/launch-plan-data.json',
};

// Embedded fallback — updated from docs/planning/launch-plan-data.json
// by scripts/google-sheets/build-sheet-script.py (JS object, not a quoted string).
// BEGIN_EMBEDDED_DATA
const EMBEDDED_DATA = {"meta":{"title":"contentment.org — Launch Plan","version":"2026-08-04","owner":"Somesh Bhardwaj","contact":"somesh@contentment.org","summary":"Aug 4 (Somesh): /updates segment CONFIRMED -> \"www.contentment.org\". Double opt-in verified ON in the Flodesk account, so FLODESK_DOUBLE_OPTIN=true is now set explicitly and the success copy says \"check your inbox to confirm\" (leaving it unset would have shown \"You're in\" while a confirmation click was still pending). optin_ip + optin_timestamp sent as the EU/US consent trail. PAGE-RECORD AUDIT: pages shipped without reaching Kristina's review list were invisible to the team, so nobody could advise on them. /404 was recorded \"Not started\" but shipped 2 Aug (corrected). /updates, /404, /story-board and /foundation-reach-map now carry an explicit PURPOSE statement and a NEEDS TEAM REVIEW flag; the two prototype routes are noted as publicly reachable on the preview even though their design work is paused. Aug 4 (Somesh): FEAT-070 Flodesk newsletter LIVE — custom forms POST to a host-native /api/newsletter function (netlify/functions/newsletter.mjs + api/newsletter.js, shared core src/lib/flodesk.js), NOT an Astro SSR route, so astro.config.mjs stays output:'static' and the 3 Aug security revert holds. FLODESK_API_KEY is server-only; segment IDs come from env. 11 capture points wired across 5 pages. Per Kristina's Miro CTA suggestions, 8 go to segment \"www.contentment.org\" (home bottom CTA, /about, /why, and on /events: Why-we-gather, closing aside, both Join-the-waitlist recap links, recap Be-first-to-know); the /events hero Save-my-free-spot opens a shared CaptureModal -> \"Contentment Festival\". STILL PENDING Kristina + WoeiJing: /updates form, /events top capture fold, and the 3 Upcoming-grid CTAs (Save my spot / Be first to know / Join the waitlist) which still just scroll to #ev-signup. Interim FLODESK_SEGMENT_DEFAULT -> www.contentment.org so unconfirmed forms still land somewhere mailed. Double opt-in left to the Flodesk account setting (FLODESK_DOUBLE_OPTIN unset). newsletter_submit now fires on a CONFIRMED subscribe, not on click. Aug 4 (Somesh): /getinvolved donate split (#donate) — photo + Keela General Donation Form (same embed as homepage; asset public/assets/gi-donate-photo.jpg); one-time gift → #donate. Nav current-page underline (white on transparent header, --btnblue on scrolled white bar; aria-current=page desktop+drawer). /schools wellbeing-lead photo replaced (public/assets/fs-Jadielsm.jpg). HC-077 docs-unpublish at cutover logged. Aug 4: HC-077 / FEAT-101 — at production cutover unpublish internal /docs hub + Footer 'Project docs' (docs stay in private repo only). Aug 4: Get Involved URL slug → `/getinvolved` (was `/give`); `src/pages/getinvolved.astro`; seams.join/donate + Nav/Footer/sitemap; `/give` 301→`/getinvolved` (Netlify + Vercel). Aug 4: /give Join Homeroom ($25/$50/$100) → homepage Keela form with selected amount (`/?amount=N&frequency=monthly#homeroom`, seams.homeroomDonateUrl). Aug 4: Keela General Donation Form live (give-usa embed MnqZFksL49Ym3M8Ho, org CBbknhqovLi8DNEzW) on homepage Homeroom + /why give band; master script in BaseLayout; Donate CTAs → /#homeroom; giveOneTime → same. India region + per-tier Homeroom joinTiers still deferred. CSP allows cdn.keela.co + *.keela.co. Aug 3: /give Homeroom Dreamer/Catalyst/Visionary tiers now selectable (joinTiers seam for per-tier Keela URLs). Aug 3 Nav priorities: (1) Conversion paths — Events festival Save-my-spot no longer routes to /give; RSVP/waitlist interim → #ev-signup email capture until seams.rsvp/Keela; Homeroom join stays /give; school enquiry = mailto #start; one-time/other-ways still # pending Lorna. (2) Homeroom offer — D-01 $25/$50/$100: killed remaining $5 entry copy on homepage InviteBand + meta; Give page tiers already $25/$50/$100; donate widgets match. Benefits still need Kristina/WJ editorial pass to unify Events access list vs Give benefit cards if desired. (3) PostHog wizard PR #1 triaged — kept its 6 new conversion events + vercel.json CSP, reverted the consent/cookie regression, env-var rename and unused dep (FEAT-080). (4) CSP now identical in netlify.toml + vercel.json (OPS-001/002); netlify had none at all, and vercel's was missing YouTube frame-src, which would have blanked every video embed at cutover. PUBLIC_GA_ID has landed (first of HC-076's five) — confirm it is set in Netlify's env, not just local. STILL BLOCKED — Keela URLs HC-075/071; D-24 Flodesk; HC-005 Spread-the-movement. Go-live Aug 21."},"overview":[["Metric","Value"],["Team review tracker","Sheet tab Review & Feedback (RF-xxx). Preview: https://contentmentweb2.netlify.app"],["Design handoff deadline","Jul 28, 2026 — UIUX–Dev handoff call Done (actual Day 0; was mislabeled Jul 27)"],["Dev sprint (build)","Jul 28–Aug 7, 2026 (Sam-led) — Day 0 = Jul 28 handoff"],["Final review meeting","Anytime Aug 3–7, 2026 — flexible window during week 2 of sprint (go/no-go for fixes)"],["Review + fixes window","Aug 10–14 (analytics, polish, mobile UI/UX, Nav + WJ approval)"],["Phase 1 hard go-live","Aug 21, 2026 ★ — hard launch date; end of Phase 1. Next phase timeline TBD"],["Content pages in scope","7 Phase 1 pages: Homepage, Why, Our Impact, Schools, Events, Get Involved, About Us"],["Launch utility pages","Updates, 404. Privacy + Terms = open ticket (Phase 1.5 or Phase 2 — TBD; under process)"],["Production domain","contentment.org (Vercel)"],["Build approach","Dave HTML drafts → multi-page production build (D-11 Astro 4.x resolved; call mentioned React — pending Nick sign-off before any stack change)"],["Design owners","Dave Kebo (all page design v2) + Veron (remaining pages)"],["Critical handoff dependency","Logo SVG (Nav→Dave, immediate) + Kristina critical-flag list (EOD) + Button/CTA Miro inventory (EOW) + Dave asset zip"],["Phase 2 / later","Copy updates; Priscilla quote replacement; branding/horizontal logo alignment; map, Story Board, /homeroom gate; Privacy/Terms TBD Phase 1.5 or 2"],["Mobile requirement","Somesh owns responsive layout in the 2-week sprint (desktop + mobile). No separate Dave mobile deliverable; non-scaling elements hide/adjust post-Phase 1 if needed"],["Bottom line","Handoff Done Jul 28. Sprint Jul 28–Aug 7. Homepage first (desktop+mobile) Slack review passed. Phase 1 hard live Aug 21 as scheduled."]],"timeline":[["Phase","Dates","Work stream","Deliverables","Owner","Dependencies"],["Phase 1 — Handoff","Jul 28","UIUX–Dev meeting","Design freeze + UIUX–Dev handoff call (actual Day 0); Button/CTA inventory from Kristina","Dave, Veron, K → Sam","Designs locked; Phase 1 scope frozen"],["Phase 2 — Dev Sprint","Jul 28–31","Foundation + Homepage + Why + Give","Astro scaffold, shared layout, CSS tokens, nav/footer; migrate Homepage to /; build /why and /give (Get Involved)","Sam (Somesh)","Dave Netlify drafts"],["Phase 2 — Dev Sprint","Aug 3–7","Our Impact + Schools + Events + About Us","Build /stories (Our Impact), /schools, /events, About Us (single page)","Sam (Somesh)","Content + drafts; Button inventory"],["Phase 3 — Final Review","Aug 3–7","Stakeholder VC (flexible)","Full site walkthrough; go/no-go for Aug 10–14 fixes — date TBD within this window","All (VC)","Dev sprint pages landing"],["Phase 4 — Review Sprint","Aug 10–14","Fixes + polish + analytics","Fixes & polish, Mobile UI/UX, Analytics, Final approval, Launch prep, Google Form embed, Website Change Request Form & SOP","Sam (Somesh), K","GA4 property ID; Flodesk/newsletter decision"],["Phase 5 — Final Approval","Aug 10–14","Stakeholder sign-off","Nav + WJ review and approve; Keela URLs wired if available","Nav, WJ, Sam","Approval unlocks go-live"],["Phase 6 — Launch","Aug 21","Hard go-live — end of Phase 1 (as scheduled)","DNS cutover to contentment.org; Keela live; newsletter live; Lighthouse ≥85","Sam (Somesh)","Keela URLs; Nav + WJ approval"]],"pages":[["Page","Route","Phase","Dave draft URL","Draft status","Design owner","Build complexity","In Kristina list","Notes"],["Homepage","/","1","https://comfy-brigadeiros-00c4b6.netlify.app/","Astro ported","Dave","Medium","Yes","https://contentmentweb2.netlify.app/ — Astro live. HC-057 passed 31 Jul. Aug 3 — hero CTA→/why; Join Homeroom invite→/give; door Schools/Events wired; Spread-the-movement TBD WJ; Homeroom donate form measure 46ch; Sign In + Donate chrome wired sitewide. Aug 4 — Keela General Donation Form live in Homeroom (#homeroom); Donate chrome → /#homeroom. Aug 4 — KeelaDonateForm accepts /?amount=25|50|100&frequency=monthly#homeroom presets from /give Join Homeroom."],["Why Teacher Wellbeing","/why","1","https://loquacious-zuccutto-ec29f4.netlify.app/","Astro ported","Dave","Medium","Yes","https://contentmentweb2.netlify.app/why — Astro live. RF-006 Why QA 31 Jul. 1 Aug lightbox fix. Aug 3 — teacher Shorts fill 9:16 reels; donate form measure matched to copy (52ch). Aug 4 — Keela General Donation Form live in give band."],["Our Impact","/our-impact","1","https://heartfelt-nougat-9d490a.netlify.app/","Astro ported","Dave","Medium-High","Yes","https://contentmentweb2.netlify.app/our-impact — Astro live. RF-006 QA pass 31 Jul (locked widths clean; no code fixes). FEAT-030 story data still blocked. 1 Aug — RF-008 fixed: video lightbox was playing in a tiny frame; now fills the modal."],["For Schools","/schools","1","https://timely-dasik-427334.netlify.app/","Astro ported","Dave / Veron","High","Yes","https://contentmentweb2.netlify.app/schools — Aug 3: partner deck Drive URL; form embed Phase 2 hold (Kristina Miro); simple page + #start mailto; pricing titles enlarged. Aug 4 (Somesh) — wellbeing-lead photo replaced at public/assets/fs-Jadielsm.jpg (same path in schools.astro)."],["Events","/events","1","https://helpful-elf-ba3c06.netlify.app/","Astro ported (review-only)","Dave / Veron","Medium-High","Yes","https://contentmentweb2.netlify.app/events — Aug 3: email-capture UI forms (Flodesk TBD D-24); Join Homeroom→/give; See the stories→/our-impact. HC-072 review-only; RSVP seams empty."],["Get Involved","/getinvolved","1","https://cute-palmier-4c93e1.netlify.app/","Astro ported","Dave","Low-Medium","Yes","https://contentmentweb2.netlify.app/getinvolved — Homeroom at /getinvolved (was /give; 301 kept). RF-006 QA 31 Jul. Aug 3 — hero Join Homeroom → #become. Aug 4 — Join Homeroom tiers deep-link to homepage Keela form (seams.homeroomDonateUrl); joinTiers empty (HC-075/071). Aug 4 (Somesh) — donate split #donate (gi-donate-photo.jpg + KeelaDonateForm); one-time gift → #donate. D-03 monthly split still open."],["About Us","/about","1","—","Astro ported","Dave (rev4)","TBD","Yes","https://contentmentweb2.netlify.app/about — Astro live. RF-006 About QA 31 Jul. Aug 3 — hero filename about-hero-team-bali-july2025.jpg; Dan caption tweak; Talk-with-Us email visible; share mailto fixed. Roster still needs Dave line-by-line before public deploy."],["Privacy Policy","/privacy","1.5 or 2","—","Not started","—","Low","No","Open ticket — under process. Phase 1.5 or Phase 2 TBD. Does not block Aug 21 Phase 1 hard go-live."],["Terms of Use","/terms","1.5 or 2","—","Not started","—","Low","No","Open ticket — under process. Phase 1.5 or Phase 2 TBD. Does not block Aug 21 Phase 1 hard go-live."],["Newsletter signup","/updates","1","—","Astro built","Sam","Low","No","PURPOSE: the standalone newsletter signup page — the destination for 'subscribe' links that need a real page rather than an inline form (Footer Explore column, sitemap). 31 Jul — src/pages/updates.astro live. 4 Aug — form WIRED to Flodesk (FEAT-070) via <NewsletterForm source=\"updates_page\" bare />; segment CONFIRMED by Somesh 4 Aug → \"www.contentment.org\". The `bare` prop was added because the page supplied its own .news section + heading and was rendering a nested duplicate section with two headings — fixed. NEEDS TEAM REVIEW: built without ever reaching Kristina's page list, so its copy and framing have had no non-engineering review."],["404 page","/404","1","—","Astro built","—","Low","No","PURPOSE: branded error page shown for any unmatched URL — keeps someone who mistypes or follows a dead link inside the site instead of bouncing. STATUS CORRECTION (4 Aug): this row said 'Not started' but the page SHIPPED 2 Aug — src/pages/404.astro, `noindex, follow`, short brand-gradient hero and 6 destination cards, reusing existing tokens and .anim (no new design language). Netlify serves dist/404.html automatically. Verified in-browser at 1280 and 390px. NEEDS TEAM REVIEW: never went through Kristina's page list — the 6 destination cards and the copy have had no non-engineering review."],["Individual impact story","/stories/[slug]","1.5","—","Not started","—","Medium","No","After index ships; formerly 'Individual story'"],["Press & Media","/press","2","—","Not started","—","Low","No","Footer / outreach"],["Impact (main nav)","/impact","2","—","Not started","—","Medium","No","Distinct from the new 'Our Impact' page (renamed Stories, Phase 1) — needs a naming/scope decision before Phase 2 build to avoid confusion"],["Homeroom member hub","/homeroom","2","—","Not started","—","High","No","Password-gated; not in public nav"],["Festival campaign","/festival/2026","2","—","Not started","—","Medium","No","Linked from Events; needs campaign brief"],["Story Board prototype","/story-board","2","public/story-board.html","Paused","—","—","No","PURPOSE: Somesh's Story Board prototype — a feed-style way to browse programme stories, built to test the format before committing homepage space to it. public/story-board.html → /story-board (netlify.toml 200 rewrite). NOTE: 'Paused' refers to the DESIGN work; the route is PUBLICLY REACHABLE on the preview right now. Not linked from any nav, so it is only findable if you know the URL."],["Foundation Reach Map","/foundation-reach-map","2","public/foundation-reach-map.html","Paused","—","—","No","PURPOSE: Somesh's Foundation Reach Map prototype — flat D3 + TopoJSON world map with a pin card per served country, intended for the homepage once approved. public/foundation-reach-map.html → /foundation-reach-map (netlify.toml 200 rewrite). NOTE: 'Paused' refers to the DESIGN work; the route is PUBLICLY REACHABLE on the preview right now. Not linked from any nav."]],"designNotes":[["Page","Item","Risk level","Mitigation"],["All pages","Design handoff was Jul 28 (actual Day 0; earlier docs said Jul 27)","High","Dave + Veron must lock designs before UIUX–Dev meeting; no mid-sprint redesigns"],["Homepage","Dave draft differs from site/index.html prototype","Low","Build from Dave's latest Netlify draft"],["Homepage","Responsive layout audit (320–1280px)","Low","Passed 30 Jul 2026 — see docs/planning/HOMEPAGE-RESPONSIVE-AUDIT.md; FEAT-003 drawer shipped"],["Why","Video embed placeholders (CEO + 3x teacher 9:16)","Medium","Build slots now; need hosted URLs before complete"],["Our Impact","Longest editorial page in v1 (renamed from 'Stories')","Medium","No map in Phase 1; region-scroll only"],["For Schools","Interactive ripple rings","High","Accessible static fallback for prefers-reduced-motion"],["For Schools","Horizontal comparison table on mobile","Medium","Side-scroll with clear affordance"],["For Schools","Pricing amounts TBD","Low","Ship with placeholders"],["Events","Filter chips (open / Homeroom / virtual / in-person)","Medium","Real JS logic, not static layout"],["Events","Some event dates TBC","Medium","Expect content updates after first build"],["Events","Email capture embed slot","Low","Wire to Flodesk when creds ready"],["Get Involved","Video embed placeholder","Low","Placeholder retained (Jul 28). Jose video sent directly to Somesh when ready — integrate then."],["About Us","Veron-led design still in progress","High","Confirmed Phase 1, single page (D-05 resolved); fast-follow build if design lands late"],["All pages","Homeroom tiers resolved to $25/$50/$100 (D-01)","Medium","Update all donation CTA copy + Keela product setup to match"],["All builds","Mobile responsive owned by Somesh in sprint (Jul 28 handoff)","High","No separate Dave mobile comps. Build responsive natively; hide/adjust awkward elements after Phase 1 if needed. Aug 10–14 is polish, not first mobile pass."],["Our Impact / Impact (main nav)","Naming overlap: 'Our Impact' (Phase 1, /stories) vs. deferred 'Impact' nav item (/impact, Phase 2)","Medium","Confirm final IA/naming with Kristina before Phase 2 build"]],"decisions":[["ID","Decision","Options","Owner","Status","Blocks","Priority"],["D-01","Homeroom tier amounts","Resolved: $25/$50/$100 (was $5/$25/$100 vs $25/$50/$100). Aug 3: homepage entry copy aligned to $25 (was still saying $5).","Leadership / Finance","Resolved","—","—"],["D-02","Keela checkout URLs","Interim: General Donation Form embed (give-usa) for all regions except India. Per-tier Homeroom hosted links still TBD.","Finance","Partial","Entire conversion path","Critical"],["D-03","/give routing","Gateway at /give for Homeroom tiers; Join Homeroom interim deep-links to homepage General Donation Form with selected amount. Full /give vs /give/monthly routing still open; joinTiers still empty.","Product / Kristina / Lorna","Open","Scope in 2-week sprint","High"],["D-04","School inquiry form destination","Resolved: Google Form + Slack (was Flodesk/Keela/custom). Aug 3 Kristina Miro: keep form for Phase 2 — do not embed on launch; test simple /schools mailto/CTA path first, re-integrate if unused.","Partnerships + Eng","Resolved","—","—"],["D-05","About Us scope v1","Resolved: Single page (was single page vs 5 sub-pages)","Content / Kristina","Resolved","—","—"],["D-06","Event calendar 2026","Confirmed dates and venues","Events team","Open","Events page cards","Medium"],["D-07","Social media URLs","Resolved: included in Dave/Veron's UIUX designs — pull directly from the design files (was: LinkedIn, Instagram, YouTube via Comms)","Design (Dave/Veron)","Resolved","—","—"],["D-08","Legal copy (Privacy + Terms)","Open ticket — under process. Ship in Phase 1.5 or Phase 2 (TBD). Does not block Aug 21 Phase 1 hard go-live.","Legal / Ops — Somesh (action item)","Open","Privacy/Terms pages only — not Aug 21 launch","Low"],["D-09","EIN for Homeroom FAQ","Resolved: legal copy already included in Dave's /give UIUX design (was: legal copy on giving page)","Finance","Resolved","—","—"],["D-10","Annual report format","Resolved: PDF for Phase 1 (was Embedded vs PDF vs both)","Leadership","Resolved","—","—"],["D-11","Astro 4.x build","Astro vs static partials","Engineering","Resolved","—","—"],["D-12","Analytics stack","GA4 + Clarity + PostHog","Engineering","Resolved","—","—"],["D-13","Cookie consent","Osano Free + GA4 Consent Mode v2 + cookieless PostHog — Anik looped in for a second opinion per Kristina","Somesh Bhardwaj","Resolved","—","—"],["D-14","Transactional email","SendGrid (existing paid plan)","Somesh Bhardwaj","Resolved","—","—"],["D-15","Rate limiting","Upstash Redis (@upstash/ratelimit)","Somesh Bhardwaj","Resolved","—","—"],["D-16","PostHog hosting","PostHog Cloud (app.posthog.com)","Somesh Bhardwaj","Resolved","—","—"],["D-17","Image optimization","Astro Image component","Somesh Bhardwaj","Resolved","—","—"],["D-18","Observability","Hybrid: Slack + Sentry + Vercel logs + PostHog","Somesh Bhardwaj","Resolved","—","—"],["D-19","Newsletter integration","Flodesk embed vs custom API. 2 Aug — Somesh confirmed he has a working Flodesk API key plus the Flodesk MCP server (mcp.flodesk.com/mcp), and the Netlify adapter now allows a server route, so the custom-API path per TECHNICAL-ARCHITECTURE §6.2 is viable. Engineering to close. RESOLVED 4 Aug — custom API path chosen and shipped, but via a HOST-NATIVE function (netlify/functions + api/) rather than an Astro SSR route, so no adapter and no reintroduced SSR attack surface. Flodesk API contract verified against developers.flodesk.com before writing any code (the 31 Jul revert was caused by an unverified contract).","Engineering","Resolved","Newsletter ticket","Medium"],["D-20","Alternative giving methods","Check / stock / crypto / memorial / legacy gifts — leave open for Nav, Kristina, Lorna. May land in Phase 1 or Phase 1.5; not blocking core Aug 21 build unless leadership pulls it in.","Nav / Kristina / Lorna","Open","Get Involved /give completeness if pulled into Phase 1","Medium"],["D-21","Primary logo for Phase 1","Resolved: use existing live-site logo (without three dots). Nav sends SVG via Slack; Dave implements in final pages; Somesh uses same SVG in build.","Nav / Dave / Sam","Resolved","Final design freeze + favicon/OG","Critical"],["D-22","Phase 1 copy / non-critical design changes","Resolved: copy changes excluded from Phase 1 entirely. Only critical design/compliance red flags accepted before handoff freeze.","Kristina / Nav / WJ","Resolved","—","—"],["D-23","Confirm production framework (call mentioned React)","Resolved: Astro 4.x, full stop — no React anywhere. Somesh signed off directly (in place of the pending Nick sign-off), delegating the technical call to Engineering. Jul 29 audit of Dave's actual 7-page handoff found zero external JS libraries, zero npm/build tooling, zero framework fingerprints — every page is plain HTML/CSS + vanilla inline JS (IIFEs, IntersectionObserver, scroll listeners; no import/require anywhere), the same pattern already used in site/index.html. Nothing in the handoff needs client state or SPA routing, so there's no technical case for React; Astro's static-first model and file-based routing are a direct match and replace the interim seams.js nav pattern.","Somesh (delegated to Engineering)","Resolved","—","—"],["D-24","Events email-capture destination","Flodesk vs Keela vs other — asked of WoeiJing + Kristina in Slack 2 Aug (answer requested by Aug 3; still Open as of Aug 3 CTA sync). /events keeps three placeholder slots (newsletter-signup fold; event-announcements in Why + Close; festival-signup CTAs). Do NOT invent provider embeds until decided. Pairs with FEAT-070 / D-19. Aug 3: Events UI forms shipped (first name+email stub); provider still open (Flodesk vs Keela vs other). Aug 4 — PARTIALLY RESOLVED. Provider is Flodesk (D-19 closed). Kristina's Miro board CTA suggestions assigned segments for 8 of 11 capture points: \"www.contentment.org\" for the /events Why-we-gather box, the closing aside, both Join-the-waitlist recap links and recap Be-first-to-know; \"Contentment Festival\" for the hero Save-my-free-spot modal. STILL OPEN, pending Kristina + WoeiJing: (1) /events top capture fold, (2) /updates page form, (3) the 3 Upcoming-grid CTAs — Save my spot (festival-virtual), Be first to know (festival-irl), Join the waitlist (bali-retreat) — which still only scroll to #ev-signup and have no segment. Interim: FLODESK_SEGMENT_DEFAULT points at www.contentment.org so unconfirmed forms still reach a mailed list rather than creating unsegmented subscribers.","Somesh → WoeiJing + Kristina","Open","Events capture wiring (FEAT-070 related)","High"]],"integrations":[["Integration","Phase","Effort","Can build UI first?","Dependency","Owner","Status","Notes"],["Keela donations","1","0.5-1 day once URLs exist","Yes","Finance — live checkout URLs (needed before Aug 21)","Finance + Sam","Blocked","Critical path for go-live"],["Newsletter (Flodesk)","1","0.5-2 days","Yes","Flodesk embed or API key","Comms + Sam","In Progress","4 Aug — LIVE via host-native /api/newsletter (Netlify fn + Vercel fn, shared src/lib/flodesk.js). 11 capture points: home, /about, /why, /updates, /events x4 forms + 4 modal CTAs. Segments env-driven; www.contentment.org + Contentment Festival confirmed. Pending: 3 Upcoming-grid CTAs + /updates + Events top fold (Kristina/WoeiJing); live submit test; rate limiting."],["School discovery form","2","0.5-1 day","Yes","Google Form built + Slack webhook (D-04 resolved)","Partnerships + Sam","Phase 2","Kristina Miro 3 Aug: hold embed for Phase 2. Form+Slack still exist; /schools ships without iframe — mailto Start a Conversation only."],["Analytics GA4 + Clarity","1","1-1.5 days","Partial","GA4 property ID","Sam","Open","Wire in Aug 10–14 review sprint; Osano CMP + Consent Mode v2"],["Cookie consent banner (Osano)","1","0.5-1 day","No","Consent copy (site-wide banner text; /privacy page itself now Phase 2)","Sam + Legal","Ready","D-13 signed off — Osano Free Plan; Anik looped in for a second opinion per Kristina"],["PostHog","1","0.5-1 day","Yes","PostHog Cloud API key","Sam","Ready","DECISION-007 — app.posthog.com, cookieless mode"],["SEO baseline","1","1 day","Yes","None","Sam","Open","Meta, OG, sitemap, favicon — Aug 10–14 window"],["SendGrid (transactional email)","1","0.5 day","No","Existing TCF API key","Sam","Ready","DECISION-003 signed off — reuse paid plan"],["Upstash rate limiting","1","0.5 day","No","Upstash account","Sam","Ready","DECISION-004 signed off"],["Sentry error monitoring","1","0.5 day","No","SENTRY_DSN","Sam","Ready","DECISION-006 hybrid stack"],["Event RSVP API","1.5","1-2 days","Yes","Event dates + Zoom workflow","Events + Sam","Scheduled","See automation brief"],["Homeroom password gate","2","2-3 days","N/A","Member content brief","Sam","Phase 2","Not in sprint"],["DNS cutover contentment.org","1","0.5 day","N/A","QA pass + Nav/WJ approval (Aug 10–14)","Sam","Open","Phase 1 hard go-live Aug 21 — end of Phase 1; next phase TBD"]],"tickets":[["ID","Title","Phase","Priority","Status","Owner","Sprint dates","Depends on","Blocker / Note"],["FEAT-001","Extract shared layout (CSS, nav, footer)","1","Must","In Progress","Sam","Jul 28","—","BaseLayout + Nav/Footer + tokens shared across all 7 Astro routes. Mobile drawer shipped (FEAT-003 ✅ 30 Jul). Aug 4 (Somesh) — Nav current-page indicator: aria-current=page + underline (white on transparent header; --btnblue when scrolled)."],["FEAT-002","Multi-page routing scaffold (Astro)","1","Must","In Progress","Sam","Jul 28","FEAT-001","All 7 Phase 1 content routes under src/pages/. Netlify preview publishes dist/ (cut over 30 Jul). 2 Aug — branded /404 shipped (src/pages/404.astro, noindex, reuses existing tokens + .anim). Astro switched static → hybrid with @astrojs/netlify@5.x adapter (2 Aug), then REVERTED to output:'static' with no adapter (3 Aug) — no route ever set prerender=false, so hybrid shipped a live SSR function, edge middleware and /_image endpoint carrying 5 open Dependabot alerts for zero benefit. Static dist/ is file-for-file identical minus _redirects (netlify.toml already covers those 3 routes). Re-blocks FEAT-070's hosting until the Astro 4→7 migration. privacy/terms still blocked on legal copy."],["FEAT-003","Mobile navigation drawer","1","Must","Done","Sam","Jul 30","FEAT-001","Slide-in drawer in Nav.astro + nav.js — focus trap, Escape, Join Homeroom + Donate. See HOMEPAGE-RESPONSIVE-AUDIT.md. Aug 4 (Somesh) — drawer links also get aria-current=page + white underline for the active route."],["FEAT-004","Wire all nav and footer links","1","Must","In Progress","Sam","Jul 29","FEAT-002","Aug 4 — Get Involved slug `/getinvolved` (was `/give`); Donate → `/getinvolved#become`; seams.join=/getinvolved. Also: giveOneTime → /#homeroom; Join Homeroom tiers → /?amount=N&frequency=monthly#homeroom. Aug 3 Nav: Events RSVP → #ev-signup; school mailto; partner deck live. Dead: waysToGive #, Spread the movement #, Flodesk stubs. HC-005 Open."],["FEAT-005","Button / CTA inventory (all destinations)","1","Must","Open","Kristina → Sam","Before / during handoff — needed early in sprint","—","Kristina Miro inventory still owed (HC-005). Aug 3 — Sam wired known destinations without waiting: Sign In, Donate→/#homeroom (Keela General Donation Form, Aug 4), homepage hero/invite/doors, Give hero→#become, About Talk-with-Us + share mailto. Remaining unknowns: Spread-the-movement door (WJ), per-tier Homeroom joinTiers + India (HC-075 remainder), Events RSVP/join seams."],["FEAT-010","Migrate homepage to /","1","Must","Done","Dave + Sam","Jul 28–29","FEAT-001, FEAT-002","Live on contentmentweb2.netlify.app. Slack review passed 31 Jul (HC-057). Aug 3 — CTA wires: hero→/why, InviteBand→/give, doors Schools/Events; Homeroom form/note measure 46ch matching lead; Priscillah hr-card remains Dave designed graphic (no text-free asset). Aug 4 — Keela General Donation Form live in Homeroom band (FEAT-060 interim). Per-tier Homeroom join still HC-075. Aug 3 — InviteBand Homeroom entry $25/mo (D-01)."],["FEAT-011","Homepage copy audit vs messaging brief","1","Should","Done","Sam","31 Jul","FEAT-010","31 Jul Four Pillars + Homeroom CTA. Aug 3 — D-01 copy: InviteBand + homepage meta $5→$25/month (HC-041). Give tiers already $25/$50/$100 Dreamer/Catalyst/Visionary."],["FEAT-020","Build /why page","1","Must","In Progress","Sam","Jul 29–30","FEAT-001, FEAT-002","Jul 29 — ported to src/pages/why.astro. 31 Jul RF-006 QA pass. 1 Aug — video lightbox sizing fixed (RF-008 pattern). Aug 3 — teacher reels (.vframe.vert) iframes fill 9:16 (missing absolute-fill CSS from Dave handoff); Homeroom donate form measure matched to head copy (52ch). Aug 4 — Keela General Donation Form live in give band. Newsletter still placeholder."],["FEAT-030","Our Impact Page data model + JSON","1","Must","Blocked","Sam","Jul 31","—","Renamed from 'Stories' per Kristina; comms: photos + permissions"],["FEAT-031","Build Our Impact index (/our-impact)","1","Must","In Progress","Sam","Jul 31 · Aug 3–4","FEAT-002","Jul 29 — ported to src/pages/our-impact/index.astro. Route /our-impact. 31 Jul RF-006 QA pass (320–1280 clean; no code fixes). FEAT-030 story data still blocked. 1 Aug — RF-008 (Kristina) fixed: video lightbox was playing in a tiny frame; iframe missed Astro's scoped CSS sizing since it's injected via JS, fixed with inline style."],["FEAT-040","Build /schools page","1","Must","In Progress","Sam","Aug 4–5","FEAT-002","Jul 29 port; 31 Jul RF-006 QA. Aug 3 — partner deck Drive URL wired (hero+close); Google Form embed deferred Phase 2 (Kristina Miro); pricing .col-name 1.4rem. Aug 4 (Somesh) — replaced wellbeing-lead conversation photo public/assets/fs-Jadielsm.jpg (same filename; no src change)."],["FEAT-041","School discovery form","2","Should","Scheduled","Sam","Phase 2","FEAT-040","31 Jul — Google Form + Slack built and was embedded. Aug 3 Kristina Miro: put embed on hold for Phase 2 — test simple /schools page first, re-integrate if people are not using the form. Embed commented out in schools.astro; discoveryFormUrl cleared (URL retained in seams comment). Launch CTA = #start mailto."],["FEAT-050","Build /getinvolved gateway","1","Must","In Progress","Sam","Jul 30–31","FEAT-002","Get Involved at src/pages/getinvolved.astro (route `/getinvolved`; `/give` 301). 31 Jul RF-006 QA. Aug 3 — hero Join Homeroom → #become. Aug 4 — Join Homeroom tiers deep-link to homepage Keela form (seams.homeroomDonateUrl); joinTiers empty; seams.join=/getinvolved. Aug 4 (Somesh) — new donate split fold #donate (photo left / Keela form on blue, asset gi-donate-photo.jpg); Prefer to give differently one-time → #donate. D-03 monthly split still open."],["FEAT-051","Build /give/monthly Get Involved Page","1","Must","Blocked","Sam","Jul 30–31","FEAT-050, FEAT-060","Homeroom UI currently at /give. No separate /give/monthly route yet. Aug 4 — still blocked on per-tier Homeroom Keela (HC-075 remainder) + D-03 routing; General Donation Form does not close this ticket."],["FEAT-060","Keela donation integration","1","Must","In Progress","Sam","Aug 14–16","—","Aug 4 — General Donation Form wired sitewide (master script + embeds on / Homeroom + /why). seams.keela records orgId + form. Donate → /#homeroom. Aug 4 (follow-on) — /getinvolved Join Homeroom tiers deep-link to `/?amount=N&frequency=monthly#homeroom` via seams.homeroomDonateUrl(); KeelaDonateForm forwards amount+frequency onto the embed iframe. Aug 4 (Somesh) — same Keela embed also on /getinvolved #donate split (no second form ID). joinTiers still preferred when set. India region + per-tier hosted URLs still open (HC-075 remainder). CSP updated for cdn.keela.co."],["FEAT-070","Newsletter integration (Flodesk)","1","Must","In Progress","Sam","Aug 13–14","FEAT-010","4 Aug — SHIPPED (unblocked without the adapter). The §6.2 server-side path is now a HOST-NATIVE function, not an Astro route: netlify/functions/newsletter.mjs (preview) + api/newsletter.js (Vercel target) over one shared core, src/lib/flodesk.js. astro.config.mjs stays output:'static' — the 3 Aug security revert is untouched and FEAT-101 is NO LONGER a blocker for this ticket. FLODESK_API_KEY stays server-only; Flodesk contract verified against developers.flodesk.com (Basic auth base64('KEY:'); POST /v1/subscribers then POST /v1/subscribers/{email}/segments). netlify.toml rewrites /api/newsletter -> the function so both hosts share one public path. 11 capture points across home, /about, /why, /updates, /events; honeypot + inline aria-live success/error; 4 Events link-CTAs share one <CaptureModal />. Segment per form comes from SEGMENT_ENV_BY_SOURCE (env-driven IDs, never hardcoded). Segment assignments per Kristina's Miro CTA suggestions. STILL PENDING Kristina + WoeiJing: /updates form, /events top capture fold, and the 3 Upcoming-grid CTAs. Not yet done: live end-to-end submit test, rate limiting (UPSTASH_* unset), Vercel-side verification at cutover."],["FEAT-071","Privacy and Terms pages","1.5 or 2","Should","Open","Sam","Phase 1.5 or Phase 2 — TBD (under process)","FEAT-002","Open ticket per Somesh/Kristina — does not block Aug 21 Phase 1 hard go-live (D-08)"],["FEAT-080","Analytics (GA4, Clarity, PostHog Cloud, Osano, Sentry)","1","Must","In Progress","Sam","Aug 10–12","FEAT-002","31 Jul — scaffolded (Analytics.astro, Sentry, cta_homeroom_click/newsletter_submit), all no-op until real credentials land. Sam sourcing GA4/PostHog/Osano/Clarity/Sentry IDs (HC-076). Aug 3 — PostHog wizard PR #1 reduced to its 6 usable events (homeroom_join_interest, event_rsvp_interest, video_started, school_partner_inquiry_started, partner_deck_downloaded, content_shared) + vercel.json CSP; its cookie-setting/autocapture init, PUBLIC_POSTHOG_KEY→PROJECT_TOKEN rename and unused posthog-js dep reverted (violated DECISION-002 cookieless / DECISION-007). Event contract now 8 events, still no-op until HC-076. Aug 4 — credentials wired and verified end to end where observable. GA4 and Clarity confirmed live (204s on /g/collect and r.clarity.ms/collect). PostHog confirmed by Sam in the dashboard. Real bug fixed: the hand-rolled PostHog loader stub never set __SV and queued init on the array instead of posthog._i, so array.js silently ignored our config and fell back to DEFAULT localStorage+cookie persistence — the cookieless guarantee in DECISION-002/007 was cosmetic. Rewritten to PostHog's official stub shape; runtime now reads persistence 'memory'. CMP swapped Osano -> Cookiebot in manual blocking mode (auto would rewrite tracker script tags to text/plain and could block our own inline gtag consent default, plus block cookieless PostHog). CSP updated in BOTH netlify.toml and vercel.json, kept byte-identical: cmp.osano.com -> consent.cookiebot.com (script+style) and consentcdn.cookiebot.com (script, connect, and frame — the banner is an iframe, which Osano never needed; without this the banner would have been CSP-blocked). Still open: SENTRY_DSN, Cookiebot domain registration, and Netlify env vars."],["FEAT-081","SEO baseline","1","Should","Done","Sam","31 Jul","FEAT-002","31 Jul — per-page title/description/OG/JSON-LD, robots.txt/sitemap.xml/llms.txt/favicon.svg shipped."],["FEAT-091","Homeroom gated member hub (/homeroom)","2","Nice","Scheduled","Sam","—","FEAT-060, FEAT-092","Phase 2"],["FEAT-092","Homeroom access middleware (edge + password)","2","Nice","Scheduled","Sam","—","Edge function hosting","Phase 2"],["FEAT-094","Campaign page template (/festival/2026)","2","Nice","Scheduled","Sam","—","FEAT-080","Phase 2"],["FEAT-090","Events page (renamed from 'Events & Experiences')","1","Must","In Progress","Sam","Aug 6–7","FEAT-002","Aug 3 — Save my free spot / RSVP / waitlist no longer use seams.join→/give (Nav). Interim destination #ev-signup until seams.rsvp. Join Homeroom/Unlock still /give. HC-072 review-only."],["FEAT-032","Individual story pages /stories/[slug] (page renamed 'Our Impact')","1.5","Should","Scheduled","Sam","Aug 7","FEAT-031","—"],["FEAT-033","Interactive global map","2","Nice","Paused","Sam","—","FEAT-031","Phase 2"],["FEAT-093","About Us page (v1 single page)","1","Must","In Progress","Sam / Veron","Aug 7 or FF","FEAT-002","Jul 29 — about.astro from about-deploy-rev4. 31 Jul RF-006 QA. Aug 3 — hero uses about-hero-team-bali-july2025.jpg (same bytes as prior ab-hero-bali5; hi-res swap still pending Dave); caption \"Dan in Bhutan, 2014\"; Talk with Us shows mailto + hello@contentment.org; Email-this-to-someone share/mailto hardened. Newsletter FEAT-070; roster Dave sign-off still owed."],["FEAT-100","Pre-launch QA","1","Must","In Progress","Sam","Aug 13–14","All must-haves","2 Aug — AUDIT DONE (docs/planning/PRE-LAUNCH-QA-AUDIT.md): axe-core 4.12.1 + Lighthouse 13.4.1, 8 routes x desktop/mobile. Verdict 0/8 pass, but causes cluster: 1 Critical, 4 Serious, 6 Moderate, 3 Minor. Shared-chrome fixes clear most of it — no <main> landmark + no skip link (BaseLayout, 2 lines, fixes all 8); video-lightbox focus management (/schools is a real keyboard trap, WCAG 2.1.2 A — Escape handler exists but is on window, so it never fires once focus is in the cross-origin YouTube iframe); /events filter chips use role=tablist with aria-selected on plain buttons and no arrow keys; mobile perf 56-75 on all 8 (pure asset weight — zero TBT; unsized imgs, render-blocking fonts, base64 images). White-on-mint contrast fails AA and is already fixed on /events+/why but not homepage orbit or /give. Console clean: 0 JS errors / 0 failed requests across 16 loads. NOT yet done: screen-reader pass, text-over-image contrast (manual), Google Form iframe (cross-origin), Keela live test (HC-075)."],["FEAT-101","Production deploy + DNS","1","Must","Open","Sam","Aug 21","FEAT-100","contentment.org cutover — Phase 1 hard go-live Aug 21. Aug 4 — HC-077: at production cutover unpublish internal project docs — remove Footer 'Project docs' (/docs); stop copy-docs.sh / public/docs on prod build; 404 /docs*; keep docs/ in private repo only (preview Netlify may keep /docs until cutover)."],["OPS-001","Add security headers to netlify.toml (interim env)","1","Must","Done","Sam","—","—","Interim Netlify security headers ahead of the Vercel cutover (TECHNICAL-ARCHITECTURE §9). Aug 3 — CSP added; netlify.toml previously had none at all while vercel.json did, so the live host was the unprotected one. Policy now identical across both files."],["OPS-002","Commit vercel.json from TECHNICAL-ARCHITECTURE §9 spec","1","Must","Done","Sam","—","—","Vercel security headers config, ready for the production cutover (FEAT-101). Aug 3 — CSP rewritten from a dist/ origin inventory: added YouTube frame-src (it would have blanked every video embed at cutover), Osano, Clarity connect, jsdelivr (map/story-board prototypes), GA4 regional ingest, Sentry ingest, form-action; dropped plausible.io, which DECISION-001 never chose."],["OPS-003","CI step — auto-regenerate contentment-home.html on push","1","Should","Done","Sam","—","—","Keeps the portable single-file build in sync with site/index.html without a manual step."],["QA-001","Story Board a11y gaps (dialog focus trap, aria-pressed, live region)","1","Should","Done","Sam","—","—","Fixed in the Story Board prototype (site/story-board.html) ahead of the Astro migration."]],"externalBlockers":[["Blocker","Waiting on","Gates","Needed by","Impact if delayed"],["Design handoff (all pages)","Dave (logo + critical flags) → Somesh","Jul 28","Done — UIUX–Dev handoff call Jul 28 (actual Day 0)","Sprint starts on homepage once assets land; logo SVG blocks Dave finalize"],["Button / CTA inventory (remaining)","Kristina (Miro) + WJ (Spread the movement door)","FEAT-004, FEAT-005, analytics event wiring","Aug 3 asked (Slack 2 Aug) — still Open","Aug 3 — known CTAs wired ahead of Miro (Sign In→school.contentment.org; Donate→/#homeroom (Keela General Donation Form, Aug 4); homepage hero/invite/doors Schools+Events; Give hero→#become; About mailto/share). Still waiting: full page-by-page Miro inventory (Kristina); homepage Spread-the-movement destination (WJ); analytics event map once inventory lands. Keela checkout/join remain HC-075/071."],["Homepage door — Spread the movement destination","WJ (WoeiJing)","FEAT-004 / FEAT-005 (third door card)","Open — flagged Aug 3","Card CTA stays href=# until WJ finalises destination (share flow / social / other)."],["Live Keela checkout URLs","Lorna (Finance)","FEAT-060, FEAT-051","Partial — Aug 4","General Donation Form live on / + /why. Remaining: per-tier Homeroom joinTiers + India region."],["Story photos + permissions","Comms / Programs","FEAT-030","Aug 3","Our Impact page ships with draft copy only"],["Keela widget confirmation (/give routing, D-03)","Lorna / Finance","FEAT-050","Aug 5 (before /give build finalized)","General form widget live on / + /why. /give Homeroom tier routing still open. Aug 4 update."],["Event calendar dates","Events","FEAT-090","Aug 6","TBC labels on event cards"],["About Us copy/design","Content + Veron","FEAT-093","Aug 7 (or fast-follow)","Confirmed Phase 1 (Kristina); design still in progress — fast-follow after sprint if late, doesn't block go-live"],["Nav + WJ final approval","Nav, WJ","FEAT-101","Aug 14 (pre Aug 21 hard go-live)","DNS cutover cannot proceed without sign-off"],["Logo SVG (live-site wordmark, no three dots)","Nav → Slack","Dave final pages + Somesh build branding","Immediate (Jul 28)","Dave cannot finalize pages; build uses wrong mark if delayed"],["Critical-only page review notes","WJ + Nav (Slack #website) → Kristina collate → Dave","Dave final rework before zip","Flags ~1hr post-call; Kristina list EOD Jul 28; Dave applies Jul 29 AM","Handoff package slips a day if list late"],["Events page — second round of team notes","Dave","FEAT-090 production build","Aug 3 (asked in Slack 2 Aug)","Current events-build is review-only; building to production early risks rework once notes land"],["About Us roster sign-off (line-by-line)","Dave","FEAT-093 close-out","Aug 3 (asked in Slack 2 Aug)","/about cannot be marked final; page is otherwise built and QA'd"],["Keela / Homeroom join-flow choreography","Lorna / Kristina","FEAT-051, FEAT-060, Events gated-CTA wiring","Before those CTAs can be wired and tested","Aug 4 — Donate chrome → /#homeroom (General Donation Form live). Events RSVP + Get Involved Join Homeroom / joinTiers still empty until join-flow decided."]],"phase2Deferred":[["Item","Route / asset","Reason deferred","Target phase"],["Interactive global educator map","/stories map component","Complexity; region-scroll covers v1","Phase 2"],["Story Board","/story-board","Paused per team decision","Phase 2"],["Foundation Reach Map","/foundation-reach-map","Paused per team decision","Phase 2"],["Homeroom gated hub","/homeroom","Member auth + content not ready","Phase 2"],["About Us sub-pages (5)","/about/*","Content briefs in progress; v1 = single page (D-05 resolved)","Phase 2"],["Get Involved sub-pages","/give/corporate, etc.","Not in Kristina 7-page scope","Phase 2"],["Impact page (main nav)","/impact","Content boundary with new 'Our Impact' page (renamed Stories, Phase 1) — naming clash to resolve","Phase 2"],["Privacy Policy","/privacy","Open ticket under process — Phase 1.5 or Phase 2 TBD (does not block Aug 21)","Phase 1.5 or 2"],["Terms of Use","/terms","Open ticket under process — Phase 1.5 or Phase 2 TBD (does not block Aug 21)","Phase 1.5 or 2"],["Press & Media","/press","Not launch blocker","Phase 2"],["Festival / 10th anniversary campaigns","/festival, /10years","Need campaign briefs (4-6 wk lead)","Phase 2"],["Priscilla duplicate quote replacement","Get Involved / quote slots","Jul 28 — leave as-is for launch; replace in Phase 2","Phase 2"],["Copy updates (non-critical)","All pages","Jul 28 — copy excluded from Phase 1; critical design/compliance only","Phase 2"],["Horizontal logo / branding realignment","Global brand","Horizontal logo referenced but unconfirmed; deferred with Phase 2 branding","Phase 2"],["Non-critical design refinements","All pages","Jul 28 scope freeze — only red flags before handoff","Phase 2"]],"handoffChecklist":[["ID","Section","Item","Detail","Owner","Status","Priority","Notes"],["HC-001","Confirmed","Phase 1 hard go-live = Aug 21","Hard live date; end of Phase 1. Next phase timeline TBD.","All","Confirmed","Critical","Replaces prior Aug 17–21 window language"],["HC-002","Confirmed","Final review meeting = Aug 3–7","Flexible window anytime during week 2 of the sprint — not a single fixed day.","All","Confirmed","High","Book on calendars once exact day chosen"],["HC-003","Confirmed","Privacy / Terms = open ticket","Under process. Phase 1.5 or Phase 2 TBD. Does not block Aug 21.","Sam + Legal","Confirmed","Low","Approach confirmed (under process; Phase 1.5 or 2 TBD; does not block Aug 21). D-08 / FEAT-071 remain open work tickets."],["HC-004","Confirmed","Alternative giving methods left open","Check/stock/crypto/memorial/legacy — Nav, Kristina, Lorna decide. May be Phase 1 or 1.5.","Nav / K / Lorna","Confirmed","Medium","Approach confirmed — left with Nav/Kristina/Lorna. May land Phase 1 or 1.5. D-20. Do not absorb into sprint unless leadership pulls it in."],["HC-005","Confirmed","Button / CTA inventory from Kristina","Every CTA destination confirmed. Critical for wiring links + event tracking at speed.","Kristina → Sam","Open","Critical","Jul 28 — Kristina Miro by EOW. Aug 2 — re-asked by Aug 3. Aug 3 — inventory still Open; Sam wired known destinations in seams/Nav/Footer/homepage/give/about ahead of Miro. Still need WJ on Spread-the-movement door + any destinations only Kristina inventory would confirm."],["HC-010","Scope freeze","Phase 1 = 7 pages only","Homepage, Why, Our Impact, Schools, Events, Get Involved, About Us (single page).","Kristina + Nav","Confirmed","Critical","Confirmed in Slack — Nav endorsed 7-page Phase 1 (Homepage, Why, Our Impact, Schools, Events, Get Involved, About Us). Re-affirm verbally on handoff call."],["HC-011","Scope freeze","OUT: Interactive map / Reach Map","Foundation Reach Map and any interactive global map stay Phase 2.","All","Confirmed","High","Confirmed Phase 2 across Slack + tracker (Reach Map / interactive map deferred)."],["HC-012","Scope freeze","OUT: Story Board","Interactive corkboard prototype stays Phase 2.","All","Confirmed","High","Confirmed Phase 2 — Story Board paused / deferred."],["HC-013","Scope freeze","OUT: Magazine / page-flip PDF viewer","Phase 1 = PDF link + download only (D-10).","All","Confirmed","Medium","Confirmed — D-10 PDF link + download for Phase 1; page-flip viewer Phase 2."],["HC-014","Scope freeze","OUT: Quiz / lead magnet","Phase 2.","All","Confirmed","Medium","Confirmed Phase 2 (quiz / lead magnet deferred)."],["HC-015","Scope freeze","OUT: About Us sub-pages (5)","v1 = single page only (D-05 resolved).","All","Confirmed","Medium","Confirmed — D-05 About Us = single page for v1; 5 sub-pages Phase 2."],["HC-016","Scope freeze","OUT: Homeroom gated member hub","Phase 2.","All","Confirmed","Medium","Confirmed Phase 2 — Homeroom gated hub not in public launch."],["HC-017","Scope freeze","OUT: Festival / campaign pages","Phase 2.","All","Confirmed","Low","Confirmed Phase 2 — festival / campaign pages need briefs."],["HC-018","Scope freeze","Any new idea → Phase 2 by default","Do not silently absorb scope into the 2-week sprint.","Kristina + Sam","Confirmed","Critical","Standing rule from Jul feedback discipline + Slack scope control. Re-state on call if new ideas appear."],["HC-020","Design handoff","Final desktop prototype URLs (7 pages)","Confirm Netlify draft URLs are the final locked versions.","Dave","Confirmed","Critical","Jul 29 — Dave 7-page zip landed in handoff/2026-07-29-dave-pages/"],["HC-021","Design handoff","Mobile = Somesh responsive build (no Dave mobile comps)","Somesh handles responsive layout natively in the sprint. Elements that don't scale may be hidden/adjusted after Phase 1.","Sam (Somesh)","Confirmed","Critical","Confirmed Jul 28 handoff — no separate Dave mobile deliverable."],["HC-022","Design handoff","Design tokens locked","Colors, fonts, spacing vs site/index.html tokens (teal/ocean/deep/green/paper).","Dave + Veron","Open","High",""],["HC-023","Design handoff","Reusable component inventory","Nav, footer, CTA states, typography scale, form fields — named list, not reverse-engineered.","Dave","Open","High",""],["HC-024","Design handoff","All image / media assets — direct links","Heroes, Homepage video, About team photos, Get Involved donor quote/video.","Dave + Veron + WJ","Open","High","Jul 28 — Dave zip includes assets. Jose video placeholder OK; video file → Somesh directly when ready."],["HC-025","Design handoff","Accessibility / contrast rule","WCAG contrast wins over strict brand palette when they conflict.","Dave + Veron","Open","High","Known Veron vs Dave tension — get the resolution rule"],["HC-026","Design handoff","No open unresolved feedback threads","Ask: any open comment thread still open on any page?","Dave + K + WJ + Nav","Open","High","Jul 28 — critical-only red flags via Slack #website (~1hr); Kristina collates EOD → Dave; Dave reworks Jul 29 AM. Copy changes out of scope."],["HC-030","Integrations","Keela production checkout URLs (D-02)","Aug 4 — General Donation Form embed live (non-India). Per-tier Homeroom URLs still needed for /give Join Homeroom.","Finance + Lorna","Partial","Critical","General form unblocks donate widgets; per-tier Homeroom join still blocks FEAT-051 polish."],["HC-031","Integrations","/give routing (D-03)","Keela widget vs gateway/redirect — Lorna confirmation pending.","Kristina / Lorna","Open","High",""],["HC-032","Integrations","Newsletter destination (D-19)","Flodesk vs Keela vs custom — still open. Owner + decision date. Events page slots separately tracked as D-24 (Somesh → WoeiJing + Kristina).","Comms + Eng","Open","High","Blocks FEAT-070"],["HC-033","Integrations","School inquiry form (D-04)","Google Form + Slack — already resolved. Confirm form exists / owner.","Partnerships + Sam","Ready","Medium","Resolved"],["HC-034","Integrations","Bhutan compliance copy locked","Approved wording from Nav + Lorna — use as locked text.","Content / Nav","Confirmed","High","Confirmed Jul 27 — Nav + Lorna signed off: \"In Bhutan, we're honored to support the Ministry of Education's work on educator wellbeing, including trainings and retreats with school counselors nationwide.\""],["HC-035","Integrations","Team / staff roster accuracy","Titles, ordering, current staff for About Us.","WJ / HR","Confirmed","Medium","Jul 29 — Dave confirmed Dave Kebo's title is Chief Media Officer, resolving the one discrepancy flagged against about-name-manifest.txt (24 Board/Advisory names). Roster otherwise as transcribed."],["HC-040","Content","Get Involved donor quote / video","Placeholder retained on Get Involved; Jose video sent to Somesh for integration when ready.","WJ → Sam","Confirmed","Medium","Confirmed Jul 28 — does not block handoff or Aug 21 if video still pending."],["HC-041","Content","Homeroom tiers $25/$50/$100 in all UI copy","D-01 resolved — update CTA copy to match.","Dave + Sam","Confirmed","High","Confirmed — D-01 $25/$50/$100 (Kristina). Aug 3 Sam: homepage InviteBand + meta updated $5→$25; Give tiers + donate chips already matched. Still audit any stray $5 in briefs/docs; benefits language Events vs Give may still differ (Nav Homeroom proposition ask)."],["HC-050","Process","Dev sprint dates Jul 28–Aug 7 confirmed","Sam-led build window.","All","Confirmed","High",""],["HC-051","Process","Check-in cadence on calendars","Bi-weekly check-ins with Kristina and Nick during the two-week sprint; homepage Slack review before remaining pages.","Kristina","Confirmed","High","Confirmed Jul 28 handoff. Book exact calendar holds."],["HC-052","Process","Anik as technical sounding board","Confirm availability during sprint.","Sam + Anik","Ready","Medium","Named in Slack as technical/deployment sounding board for the sprint. Confirm availability on call."],["HC-053","Process","Named approvers for go/no-go","Design fidelity, content accuracy, legal, final launch sign-off.","Kristina","Open","High","Nav + WJ final approval gates Aug 21"],["HC-054","Process","Post-launch edit ownership","Sam edits via Claude/Cursor + GitHub deploy; Kristina owns Change Request Form + SOP.","Sam + Kristina","Confirmed","Medium","Confirmed — Sam edits via Claude/Cursor + GitHub; Kristina creating single CR form + Google Sheet to track all future website change requests."],["HC-060","Sam ownership","Audit UI/UX package vs repo","Handoff package completeness.","Sam","Open","High",""],["HC-061","Sam ownership","Astro scaffold + shared layout","FEAT-001 / FEAT-002 — nav, footer, tokens.","Sam","In Progress","Critical","BaseLayout/Nav/Footer/tokens live; FEAT-003 drawer shipped 30 Jul"],["HC-062","Sam ownership","Convert 7 Dave prototypes → production","Astro multi-page build.","Sam","In Progress","Critical","All 7 pages under src/pages/; polish + seams + Slack review remain"],["HC-063","Sam ownership","Responsive + a11y across 7 pages","Desktop and mobile; prefers-reduced-motion.","Sam","In Progress","Critical","Homepage responsive audit done 30 Jul (docs/planning/HOMEPAGE-RESPONSIVE-AUDIT.md). Remaining pages still need pass."],["HC-064","Sam ownership","Keela + forms + newsletter wiring","Donation, school inquiry, newsletter.","Sam","Open","Critical","Depends on D-02, D-19, Button inventory"],["HC-065","Sam ownership","Map / Story Board stay Phase 2","No interactive map in Phase 1.","Sam","Confirmed","High",""],["HC-066","Sam ownership","Analytics + SEO + Osano","GA4, Clarity, PostHog, cookie consent — decisions already resolved.","Sam","Ready","High","Analytics stack decisions already resolved (GA4 + Clarity + PostHog + Osano). Wire in Aug 10–14 review sprint — not a handoff blocker."],["HC-067","Sam ownership","Deploy + DNS cutover Aug 21","Vercel + contentment.org.","Sam","Open","Critical","Phase 1 hard go-live"],["HC-068","Sam ownership","QA + launch stabilization","a11y, Lighthouse ≥85, cross-browser, Nav+WJ sign-off.","Sam","Open","Critical",""],["HC-027","Design handoff","Logo SVG = live-site mark (no three dots)","Nav sends SVG via Slack; Dave implements in final pages; Somesh uses same file in build (D-21).","Nav → Dave → Sam","Open","Critical","Jul 28 blocker — Dave cannot finalize pages until SVG lands."],["HC-028","Design handoff","Critical-only final page review","WJ + Nav flag critical design/compliance red flags in Slack #website (name the page). No copy-change requests for Phase 1 (D-22).","WJ / Nav → Kristina → Dave","Open","Critical","Flags ~1hr post-call; Kristina consolidated list EOD Jul 28; Dave applies Jul 29 AM."],["HC-042","Content","Priscilla duplicate quote → Phase 2","Leave duplicate quote as-is for launch; replacement deferred.","Content","Confirmed","Medium","Confirmed Jul 28 — Phase 2."],["HC-043","Content","Copy changes excluded from Phase 1","Only critical design/compliance red flags accepted before freeze (D-22).","All","Confirmed","High","Confirmed Jul 28 handoff."],["HC-055","Process","Framework sign-off (React vs Astro)","Resolved Jul 29 — Somesh signed off directly in place of the pending Nick confirmation, delegating the technical call to Engineering. Decision: Astro 4.x, no React (D-23).","Somesh / Sam","Confirmed","Critical","Unblocks FEAT-002 — scaffold choice no longer pending external sign-off."],["HC-056","Process","Claude AI subscription for Somesh","Kristina confirms ~$100/month plan with Lorna.","Kristina / Lorna","Open","Medium","Jul 28 action item — does not block code start but needed for sustained sprint tooling."],["HC-057","Process","Homepage-first build + Slack review","Somesh builds homepage (desktop + mobile responsive) first; share on Slack for team review before remaining pages.","Sam","Confirmed","Critical","Confirmed Jul 28. Gate cleared 31 Jul — Kristina's Slack message (\"finished the Homepage... timeline to finish the other pages?\") taken as review sign-off, incl. mobile. RF-004/RF-005 closed. Cleared to proceed on remaining pages (see RF-006)."],["HC-058","Process","Website Change Request form + Sheet","Kristina creates single form + Google Sheet to track all future website change requests.","Kristina","Open","High","Jul 28 — pairs with HC-054 SOP ownership. Target during/after sprint window."],["HC-069","Design handoff","Photo usage rights cleared","Rights confirmed for About Us team/story photos and For Schools photography.","WJ / Comms","Confirmed","High","Jul 29 — cleared for build; no longer a launch blocker. Unblocks HC-024 image asset use."],["HC-070","Integrations","Keela Donate button color mismatch","Shipped pages show default Keela button (#507b91); brand spec is #0090bd. Fix lives in the Keela dashboard, not page CSS.","Finance / Lorna","Open","Medium","Jul 29 — flagged across every page (Home, Why, Our Impact, Schools, Events, Get Involved). Push to Google Sheet + timeline."],["HC-071","Integrations","Keela / Homeroom join-flow choreography undecided","Every gated CTA (Events RSVPs, Get Involved tiers) carries a data-event/data-join seam for a return-trip redirect that can't be wired or tested until the Keela/Homeroom join flow is decided.","Lorna / Kristina","Open","High","Jul 29 — blocks FEAT-051, FEAT-060, and Events gated-CTA wiring. Broader than D-03 (/give routing alone). Aug 4 — General Donation Form unblocks donate widgets (FEAT-060 interim); Join Homeroom tiers + Events RSVP still blocked on this choreography."],["HC-072","Content","Events page handoff incomplete — second round of team notes pending","Dave's own handoff notes flag that a second page of team review notes has not been delivered yet; current events-build should be treated as review-only, not production-final.","Dave → Somesh","Open","High","Jul 29 — do not build /events to production off this drop until the second notes round lands and design is locked. Tag Dave for delivery."],["HC-073","Scope freeze","Our Impact route confirmed: /our-impact","Final page/file name and nav seam are 'our-impact' (was 'stories'). Applied in pages table, FEAT-031, and the shared seams.js page-route config.","Somesh","Confirmed","Medium","Jul 29 — resolves the Our Impact vs Impact (main nav, Phase 2) naming ambiguity for Phase 1 scope."],["HC-074","Content","Annual Report PDFs (2019–2024) — hosting + URLs","Our Impact page needs the actual report PDFs hosted with links; Somesh to supply files/links later.","Somesh","Open","Medium","Jul 29 — placeholder until files are provided; does not block other Our Impact build work."],["HC-075","Integrations","Live Keela donation checkout URLs (per tier)","Aug 4 — Interim: General Donation Form on homepage + /why; /give Join Homeroom deep-links selected $25/$50/$100 to that form with amount+monthly. Per-tier Homeroom hosted checkout URLs (joinTiers) still owed. India region deferred.","Lorna + Somesh","Partial","Critical","Jul 31 opened; Aug 4 general form shipped. Remaining: per-tier Homeroom products + India."],["HC-076","Integrations","Live GA4 / PostHog / Osano / Clarity / Sentry IDs","FEAT-080 (Analytics) is fully scaffolded in src/components/Analytics.astro but every tool is a no-op until its real ID/key exists: PUBLIC_GA_ID, PUBLIC_POSTHOG_KEY/HOST, PUBLIC_COOKIEBOT_ID, PUBLIC_CLARITY_ID, SENTRY_DSN.","Sam","In Progress","Critical","4 Aug — 4 of 5 landed and set locally: PUBLIC_GA_ID, PUBLIC_POSTHOG_KEY/HOST (US region — https://us.i.posthog.com; the key 404s on EU), PUBLIC_CLARITY_ID, and PUBLIC_COOKIEBOT_ID. SENTRY_DSN is the only one still outstanding. CMP vendor changed Osano -> Cookiebot (DECISION-002 amendment); PUBLIC_COOKIEBOT_ID renamed to PUBLIC_COOKIEBOT_ID across Analytics.astro, .env, .env.example, TECHNICAL-ARCHITECTURE 6.1 and DECISIONS.md in one pass. VERIFIED LIVE in a real browser: GA4 (POST google-analytics.com/g/collect -> 204, en=page_view) and Clarity (clarity.ms/tag/<id> 200, scripts.clarity.ms 200, POST r.clarity.ms/collect -> 204). PostHog: initialises correctly (array.js + config.js 200, __loaded true, persistence 'memory') but NO capture request was ever observable from the automated harness — Sam confirms events are arriving in the PostHog dashboard, so it is treated as working on his observation, not ours. VERIFIED LIVE 4 Aug on contentmentweb2.netlify.app after deploy a17e94d: the Cookiebot banner renders (CookiebotOnDialogInit + CookiebotOnDialogDisplay fire, dialog present in DOM) and the consent bridge works end to end — accepting fires CookiebotOnConsentReady + CookiebotOnAccept, pushes gtag consent 'update' -> granted, and GA4's next hits carry gcs=G111 (was G100) with HTTP 204. Cookiebot logs the consent server-side (logconsent.ashx 200) and sets its CookieConsent cookie with method 'explicit'. Note the bridge runs three times per accept (defensive immediate-apply + both events); idempotent by design, re-sending identical consent is a no-op. ACTION ON SAM: (1) add contentmentweb2.netlify.app and www.contentment.org as domains in the Cookiebot account, or the banner will no-op in production exactly as it does locally; (2) set all five PUBLIC_* vars in Netlify (Site settings -> Environment variables) and redeploy with cleared cache — env vars bind at build time, so a local .env alone means staging still records nothing; (3) keep Cookiebot's own Google Consent Mode feature DISABLED, it would race our gtag consent calls; (4) supply SENTRY_DSN. 4 Aug (launch blocker) — Cookiebot FREE TIER allows ONE domain, currently registered as contentmentweb2.netlify.app. At the contentment.org DNS cutover the registered domain must be switched to www.contentment.org or the plan upgraded; until it is, the banner silently no-ops on the unregistered domain (Cookiebot loads and exposes its API but fires no events and renders no banner — confirmed behaviour, that is exactly how it failed on 127.0.0.1). Sequence this with TICKET-002/FEAT-101 so there is no window where neither domain is registered. 4 Aug — ALL FIVE credentials now sourced. SENTRY_DSN landed and VERIFIED LIVE: an uncaught browser error produced 4x POST o116520.ingest.us.sentry.io/api/<project>/envelope/ -> HTTP 200. Gotcha found and documented in TECHNICAL-ARCHITECTURE 6: SENTRY_DSN is read via process.env in astro.config.mjs, and .env does NOT populate process.env, so a local .env value silently ships no Sentry code (PUBLIC_* vars are unaffected — they go through import.meta.env, which does load .env). Netlify/Vercel inject build env vars, so deploys are fine. REMAINING: paste SENTRY_DSN into Netlify Site settings -> Environment variables and redeploy; until then staging has no error tracking. Do NOT run 'npx astro add @sentry/astro' or create sentry.client/server.config.js — the integration is already wired and gated in astro.config.mjs, and the wizard's authToken/org/project block would fail builds without a token."],["HC-077","Deploy","Unpublish Project docs at production cutover","Remove Footer 'Project docs' link; stop publishing public/docs (skip copy-docs.sh on prod build); remove or 404 /docs* host routes. Keep docs/ in the private GitHub repo — not publicly accessible on contentment.org.","Sam","Open","High","Logged 4 Aug by Somesh. Pairs FEAT-101 / SECURITY §8 / TECHNICAL-ARCHITECTURE §12 step 3b. Netlify preview may keep /docs until cutover."]],"reviewFeedback":[["ID","Date","Reviewer","Page","Device","Severity","Status","Feedback","Owner","Resolution / Notes","Preview URL"],["RF-001","2026-07-30","Team (Slack)","Home","Desktop","Medium","Done","Hero fold: \"325 partner schools\" separated by a vertical line — bring closer and use a dot separator.","Sam","Shipped 31 Jul — inline middot line: 10 years · 12 countries · 325 partner schools.","https://contentmentweb2.netlify.app/"],["RF-002","2026-07-30","Mobile QA","Home","Mobile","High","Done","How Change Happens: bloom/glow washes over the last (purple) beat paragraph on mobile.","Sam","Shipped 31 Jul — capped mobile bloom; removed negative pull; graphic max-height.","https://contentmentweb2.netlify.app/#how"],["RF-003","2026-07-30","Team","Home","Both","Medium","Done","Homeroom donate widget — was screenshot/dummy; now live Keela General Donation Form (Aug 4).","Sam","Aug 4 — Keela General Donation Form embed live (FEAT-060 interim). Per-tier Homeroom joinTiers + India still open (HC-075).","https://contentmentweb2.netlify.app/#homeroom"],["RF-004","2026-07-30","All (HC-057)","Home","Both","Critical","Done","Homepage-first Slack review: content, nav, CTAs, Homeroom, footer. Drop screenshots + device in Slack thread.","Sam + team","Closed 31 Jul — Kristina (Slack): \"Now that you've finished the Homepage, what's your estimate on timeline to finish the other pages?\" Read as sign-off; HC-057 gate cleared to start other pages. Other team members' pass is still ongoing in parallel — feedback received so far already fixed and shipped (see RF-001/002/003). Somesh to spot-check this row before/at next Sheet refresh.","https://contentmentweb2.netlify.app/"],["RF-005","2026-07-30","All","Home","Mobile","High","Done","Homepage mobile pass (~390px / real phone): hero, nav drawer, orbit scroll, Homeroom form, footer.","Sam + team","Closed 31 Jul — Kristina's Slack message treats mobile layout as ready/acceptable. Other team members' device-by-device pass continues in parallel; known gaps already fixed and shipped. Log any new device-specific gaps as fresh RF-xxx rows if found.","https://contentmentweb2.netlify.app/"],["RF-006","2026-07-31","All","All Phase 1","Both","High","Done","Click-through review of About, Why, Our Impact, Schools, Events, Give after homepage sign-off.","Team","6 of 6 click-through done (Events review-only per RF-007/HC-072). Team can still log new RF rows per issue.","https://contentmentweb2.netlify.app/"],["RF-007","2026-07-31","Sam","Events","Both","High","Open","Events remains review-only until Dave second notes (HC-072) — flag any production-risk findings but do not treat as locked.","Dave → Sam","31 Jul review-only QA: P1 shared-nav `.menu-btn` clipped at ≤380px fixed in global.css. Soft flags for Dave (not blockers): flagship title nowrap soft overflow at 1280; filter chip wrap; hero contrast. Light EVENTS-RESPONSIVE-AUDIT.md logged — no new page CSS. HC-072 still Open. Email-capture destination opened as D-24 (Flodesk vs Keela vs other — Somesh asking WoeiJing + Kristina); slots stay placeholders.","https://contentmentweb2.netlify.app/events"],["RF-008","2026-08-01","Kristina","Our Impact","Both","High","Done","The videos are playing in a small screen.","Sam","Fixed 1 Aug — the lightbox <iframe> is injected via JS innerHTML, so it never picked up Astro's scoped-style attribute; the CSS meant to size it to the modal (width/height:100%) silently never matched, so it fell back to the browser's ~300x150 default. Fixed by setting size inline on the iframe string (same pattern schools.astro already used). Same root cause found and fixed on /why too (not separately reported).","https://contentmentweb2.netlify.app/our-impact"],["RF-009","2026-08-01","Somesh","Home","Mobile","Low","Done","How Change Happens ripple/orbit shows static (no pin/scroll choreography) on a real iPhone 15 Pro + Chrome; looks perfect on desktop Chrome and Chrome's device toolbar mobile emulation.","Sam","Not a bug — diagnosed 1 Aug. Root cause: the device has iOS's Reduce Motion accessibility setting on; Chrome for iOS runs on WebKit and honors it, and orbit.js/global.css already intentionally fall back to a static stacked layout under prefers-reduced-motion (by design, per ACCESSIBILITY.md). Chrome's device toolbar/window resizing does not flip that media feature, which is why desktop testing looked fine — reproduced instead via DevTools Rendering tab \"Emulate CSS media feature prefers-reduced-motion: reduce\", which produced the identical static result. No code fix; left behavior as-is. Added comments at the reduced-motion branches in orbit.js and global.css so the team doesn't re-diagnose this from scratch next time.","https://contentmentweb2.netlify.app/#how"]]};
// END_EMBEDDED_DATA


// Live tabs the team edits directly — each gets its own tab so status/owner
// columns and conditional formatting are easy to work with.
const TAB_KEYS = {
  tickets: 'Tickets',
  decisions: 'Decisions',
  handoffChecklist: 'Handoff Checklist',
  reviewFeedback: 'Review & Feedback',
};

// Everything else is informational reference material (not edited by the
// team) — merged into one read-only "Reference" tab instead of one tab per
// section.
const REFERENCE_SECTIONS = [
  { key: 'overview', title: 'Overview' },
  { key: 'timeline', title: 'Timeline' },
  { key: 'pages', title: 'Pages' },
  { key: 'designNotes', title: 'Design Notes' },
  { key: 'integrations', title: 'Integrations' },
  { key: 'externalBlockers', title: 'External Blockers' },
  { key: 'phase2Deferred', title: 'Phase 2 Deferred' },
];

const COLORS = {
  header: '#024E70',
  headerFont: '#FFFFFF',
  sectionBand: '#EEF3F5',
  blocked: '#FDE8E8',
  done: '#E8F5E9',
};

// Tabs the team edits by hand once seeded (status, owner, blockers...).
// Refresh must never blow these away, or a routine "Refresh from source" /
// the daily trigger would silently discard everyone's live edits.
const LIVE_TRACKER_TABS = ['tickets', 'decisions', 'handoffChecklist', 'reviewFeedback'];

// Append-only black box — all sheet history / edits / bulk ops.
// Humans should not edit this tab — it is protected.
// Populated by an *installable* onEdit trigger (see Install Black Box trigger).
const CHANGE_LOG_SHEET = 'Black Box';
const CHANGE_LOG_SHEET_LEGACY = 'Change Log'; // renamed → Black Box; migrate if present
const AUDIT_SKIP_PROP = 'AUDIT_SKIP';
const AUDIT_HEADERS = [
  'Timestamp',
  'User email',
  'Tab',
  'Cell',
  'Column',
  'Row ID',
  'Old value',
  'New value',
  'Source',
];

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Launch Plan')
    .addItem('Refresh from source', 'createOrRefreshLaunchPlan')
    .addItem('Install daily auto-refresh (9am)', 'installDailyRefreshTrigger')
    .addItem('Remove auto-refresh trigger', 'removeDailyRefreshTrigger')
    .addSeparator()
    .addItem('Force reseed live tabs (Tickets / Decisions / HC / Review — discards manual edits)', 'forceReseedLiveTabs_')
    .addSeparator()
    .addItem('Install Black Box trigger (required once)', 'installChangeLogTrigger')
    .addItem('Remove Black Box trigger', 'removeChangeLogTrigger')
    .addItem('Ensure Black Box sheet exists', 'ensureChangeLogSheetMenu_')
    .addToUi();

  // Soft ensure — does not fail the open if permissions are limited
  try {
    ensureChangeLogSheet_(SpreadsheetApp.getActiveSpreadsheet());
  } catch (e) {
    // ignore
  }
}

function createOrRefreshLaunchPlan() {
  return withAuditPaused_(function () {
    const data = loadData_();
    const ss = getOrCreateSpreadsheet_();
    buildAllTabs_(ss, data);
    writeReferenceTab_(ss, data);
    ensureChangeLogSheet_(ss);
    appendAuditEvent_(ss, {
      user: Session.getActiveUser().getEmail() || '(script)',
      tab: '—',
      cell: '—',
      column: '—',
      rowId: '—',
      oldValue: '—',
      newValue: 'Reference (+ any new live tabs, incl. Review & Feedback if empty) refreshed from GitHub JSON',
      source: 'Refresh from source',
    });
    Logger.log('Done: ' + ss.getUrl());
    try {
      SpreadsheetApp.getUi().alert('Launch plan updated.\n\n' + ss.getUrl());
    } catch (e) {
      // running from editor without UI
    }
    return ss.getUrl();
  });
}

function installDailyRefreshTrigger() {
  removeDailyRefreshTrigger();
  ScriptApp.newTrigger('createOrRefreshLaunchPlan')
    .timeBased()
    .everyDays(1)
    .atHour(9)
    .inTimezone(CONFIG.TIMEZONE)
    .create();
  try {
    SpreadsheetApp.getUi().alert('Daily refresh installed (9:00 ' + CONFIG.TIMEZONE + ').');
  } catch (e) {
    Logger.log('Daily refresh trigger installed (9:00 ' + CONFIG.TIMEZONE + ').');
  }
}

function removeDailyRefreshTrigger() {
  ScriptApp.getProjectTriggers().forEach(function (trigger) {
    if (trigger.getHandlerFunction() === 'createOrRefreshLaunchPlan') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
}

function loadData_() {
  try {
    const response = UrlFetchApp.fetch(CONFIG.JSON_URL, { muteHttpExceptions: true });
    if (response.getResponseCode() === 200) {
      const data = JSON.parse(response.getContentText());
      Logger.log('Loaded JSON from GitHub (' + CONFIG.JSON_URL + ')');
      return data;
    }
    Logger.log('GitHub fetch returned ' + response.getResponseCode() + ' — falling back to embedded JSON');
  } catch (e) {
    Logger.log('GitHub fetch failed: ' + e + ' — falling back to embedded JSON');
  }
  return EMBEDDED_DATA;
}

function getOrCreateSpreadsheet_() {
  if (CONFIG.SPREADSHEET_ID) {
    return SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  }
  const ss = SpreadsheetApp.create(CONFIG.SHEET_TITLE);
  CONFIG.SPREADSHEET_ID = ss.getId();
  Logger.log('Created spreadsheet. Set CONFIG.SPREADSHEET_ID = "' + ss.getId() + '" to update this sheet next time.');
  return ss;
}

function clearSheetForRewrite_(sheet) {
  // clear() alone leaves filters AND data-validation rules in place.
  // Re-seeding then throws when a new Owner/Status value isn't in the
  // old dropdown list (e.g. FEAT-005 "Kristina → Sam" vs Sam-only list).
  const existingFilter = sheet.getFilter();
  if (existingFilter) existingFilter.remove();
  const maxRows = Math.max(sheet.getMaxRows(), 1);
  const maxCols = Math.max(sheet.getMaxColumns(), 1);
  sheet.getRange(1, 1, maxRows, maxCols).clearDataValidations();
  sheet.clear();
  sheet.setConditionalFormatRules([]);
}

function buildAllTabs_(ss, data) {
  Object.keys(TAB_KEYS).forEach(function (key) {
    const name = TAB_KEYS[key];
    let sheet = ss.getSheetByName(name);
    // Tickets/Decisions/Handoff Checklist are live working tabs once seeded —
    // skip them on refresh so we never overwrite manual status/owner edits.
    if (sheet && LIVE_TRACKER_TABS.indexOf(key) !== -1 && sheet.getLastRow() > 1) return;
    if (!sheet) sheet = ss.insertSheet(name);
    clearSheetForRewrite_(sheet);
    const rows = data[key];
    if (!rows || !rows.length) return;
    sheet.getRange(1, 1, rows.length, rows[0].length).setValues(rows);
    formatDataTab_(sheet, rows[0].length, key);
  });
  // Remove default Sheet1 if we created real tabs
  const defaultSheet = ss.getSheetByName('Sheet1');
  if (defaultSheet && ss.getSheets().length > 1) {
    ss.deleteSheet(defaultSheet);
  }
}

function forceReseedLiveTabs_() {
  const ui = SpreadsheetApp.getUi();
  const resp = ui.alert(
    'Overwrite live tracker tabs?',
    'This replaces Tickets, Decisions, Handoff Checklist, and Review & Feedback with the latest data from the repo JSON and discards any manual edits made in the Sheet. Continue?\n\n(A single Black Box entry will record this reseed — cell-level edits during the rewrite are skipped.)',
    ui.ButtonSet.YES_NO
  );
  if (resp !== ui.Button.YES) return;

  withAuditPaused_(function () {
    const data = loadData_();
    const ss = getOrCreateSpreadsheet_();
    // Seed new tabs first so a later validation failure cannot leave them missing.
    const reseedOrder = ['handoffChecklist', 'reviewFeedback', 'tickets', 'decisions'];
    reseedOrder.forEach(function (key) {
      const name = TAB_KEYS[key];
      let sheet = ss.getSheetByName(name);
      if (!sheet) sheet = ss.insertSheet(name);
      clearSheetForRewrite_(sheet);
      const rows = data[key];
      if (!rows || !rows.length) return;
      sheet.getRange(1, 1, rows.length, rows[0].length).setValues(rows);
      formatDataTab_(sheet, rows[0].length, key);
    });
    ensureChangeLogSheet_(ss);
    appendAuditEvent_(ss, {
      user: Session.getActiveUser().getEmail() || '(script)',
      tab: 'Tickets + Decisions + Handoff Checklist + Review & Feedback',
      cell: '—',
      column: '—',
      rowId: '—',
      oldValue: '(previous live-tab contents)',
      newValue: 'Force reseed from GitHub JSON — manual Status/Owner edits on those tabs discarded',
      source: 'Force reseed',
    });
    ui.alert('Live tabs reseeded from source (Tickets, Decisions, Handoff Checklist, Review & Feedback).');
  });
}

function writeReferenceTab_(ss, data) {
  let sheet = ss.getSheetByName('Reference');
  if (!sheet) sheet = ss.insertSheet('Reference');
  sheet.clear();
  sheet.setConditionalFormatRules([]);

  const meta = data.meta || {};
  let row = 1;

  sheet.getRange(row, 1, 1, 2).merge()
    .setValue(meta.title || 'contentment.org Launch Plan')
    .setFontSize(16).setFontWeight('bold')
    .setBackground(COLORS.header).setFontColor(COLORS.headerFont);
  row++;

  [
    ['Version', meta.version || ''],
    ['Owner', meta.owner || ''],
    ['Contact', meta.contact || ''],
    ['Summary', meta.summary || ''],
    ['Refresh', 'Launch Plan menu → Refresh from source. Updates this tab only — Tickets / Decisions / Handoff Checklist / Review & Feedback are protected once seeded (see Force reseed).'],
    ['Team QA', 'Log preview feedback on the Review & Feedback tab (RF-xxx). Preview: https://contentmentweb2.netlify.app/'],
  ].forEach(function (line) {
    sheet.getRange(row, 1, 1, 2).setValues([line]);
    sheet.getRange(row, 1).setFontWeight('bold');
    sheet.getRange(row, 2).setWrap(true);
    row++;
  });
  row += 1; // spacer

  REFERENCE_SECTIONS.forEach(function (section) {
    const rows = data[section.key];
    if (!rows || !rows.length) return;
    const numCols = rows[0].length;

    sheet.getRange(row, 1, 1, numCols).merge()
      .setValue(section.title)
      .setFontWeight('bold').setFontSize(12)
      .setBackground(COLORS.header).setFontColor(COLORS.headerFont);
    row++;

    sheet.getRange(row, 1, rows.length, numCols).setValues(rows);
    sheet.getRange(row, 1, 1, numCols).setFontWeight('bold').setBackground(COLORS.sectionBand);
    sheet.getRange(row, 1, rows.length, numCols).setWrap(true).setVerticalAlignment('top');
    row += rows.length + 1; // + spacer row
  });

  const maxCols = REFERENCE_SECTIONS.reduce(function (max, section) {
    const rows = data[section.key];
    return rows && rows.length ? Math.max(max, rows[0].length) : max;
  }, 2);
  for (let c = 1; c <= maxCols; c++) {
    sheet.autoResizeColumn(c);
    if (sheet.getColumnWidth(c) > 320) sheet.setColumnWidth(c, 320);
  }
}

function formatDataTab_(sheet, numCols, tabKey) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 1) return;

  // Header row
  sheet.getRange(1, 1, 1, numCols)
    .setBackground(COLORS.header)
    .setFontColor(COLORS.headerFont)
    .setFontWeight('bold')
    .setWrap(true);
  sheet.setFrozenRows(1);

  // Auto-resize + min widths
  for (let c = 1; c <= numCols; c++) {
    sheet.autoResizeColumn(c);
    if (sheet.getColumnWidth(c) < 100) sheet.setColumnWidth(c, 120);
    if (sheet.getColumnWidth(c) > 360) sheet.setColumnWidth(c, 360);
  }

  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, numCols).setWrap(true).setVerticalAlignment('top');
    // clear() doesn't remove an existing filter object, so re-running this
    // (e.g. Force reseed on an already-seeded tab) would otherwise throw
    // "You can't create a filter in a sheet that already has a filter."
    const existingFilter = sheet.getFilter();
    if (existingFilter) existingFilter.remove();
    // Filter range must start at row 1 (header) so the dropdown arrows sit
    // on the header row, not row 2.
    sheet.getRange(1, 1, lastRow, numCols).createFilter();
  }

  // Tab-specific conditional formatting + dropdowns
  if (tabKey === 'tickets') applyStatusFormatting_(sheet, findCol_(sheet, 'Status'));
  if (tabKey === 'decisions') applyDecisionStatus_(sheet, findCol_(sheet, 'Status'));
  if (tabKey === 'handoffChecklist') applyHandoffChecklistControls_(sheet);
  if (tabKey === 'reviewFeedback') applyReviewFeedbackControls_(sheet);
}

function findCol_(sheet, headerName) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  return headers.indexOf(headerName) + 1;
}

function applyStatusFormatting_(sheet, col) {
  if (col < 1 || sheet.getLastRow() < 2) return;
  // Reset (not append) so re-running this — e.g. repeated Force reseeds —
  // doesn't keep piling up duplicate rules on every run.
  const range = sheet.getRange(2, col, sheet.getLastRow() - 1, 1);
  const rules = [];
  ['Blocked', 'Paused'].forEach(function (s) {
    rules.push(SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo(s).setBackground(COLORS.blocked).setRanges([range]).build());
  });
  ['Done', 'Resolved', 'Ready', 'Confirmed', 'In Progress', 'In sprint'].forEach(function (s) {
    rules.push(SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo(s).setBackground(COLORS.done).setRanges([range]).build());
  });
  sheet.setConditionalFormatRules(rules);
}

function applyDecisionStatus_(sheet, col) {
  applyStatusFormatting_(sheet, col);
}

/** Dropdowns + per-option colors + side legend for Handoff Checklist. */
function applyHandoffChecklistControls_(sheet) {
  if (sheet.getLastRow() < 2) return;

  const statusCol = findCol_(sheet, 'Status');
  const priorityCol = findCol_(sheet, 'Priority');
  const dataRows = sheet.getLastRow() - 1;

  const statusValues = ['Open', 'Confirmed', 'Ready', 'Done'];
  const priorityValues = ['Critical', 'High', 'Medium', 'Low'];

  const statusColors = {
    Open: { bg: '#FEF3C7', fg: '#92400E', meaning: 'Still to discuss / not decided yet' },
    Confirmed: { bg: '#D1FAE5', fg: '#065F46', meaning: 'Agreed on the call — locked in' },
    Ready: { bg: '#DBEAFE', fg: '#1E40AF', meaning: 'Unblocked — can act / start work' },
    Done: { bg: '#BBF7D0', fg: '#14532D', meaning: 'Closed — no further action needed' },
  };
  const priorityColors = {
    Critical: { bg: '#FECACA', fg: '#7F1D1D', meaning: 'Must resolve on this call / blocks sprint' },
    High: { bg: '#FED7AA', fg: '#9A3412', meaning: 'Important — resolve soon after handoff' },
    Medium: { bg: '#FEF08A', fg: '#854D0E', meaning: 'Useful — not a launch blocker' },
    Low: { bg: '#E5E7EB', fg: '#374151', meaning: 'Nice to have / informational' },
  };

  if (statusCol > 0) {
    const statusRange = sheet.getRange(2, statusCol, dataRows, 1);
    statusRange.setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(statusValues, true)
        .setAllowInvalid(false)
        .setHelpText('Open · Confirmed · Ready · Done')
        .build()
    );
  }

  if (priorityCol > 0) {
    const priorityRange = sheet.getRange(2, priorityCol, dataRows, 1);
    priorityRange.setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(priorityValues, true)
        .setAllowInvalid(false)
        .setHelpText('Critical · High · Medium · Low')
        .build()
    );
  }

  // Distinct colors per option (exact match). Reset rules first.
  const rules = [];

  if (statusCol > 0) {
    const statusRange = sheet.getRange(2, statusCol, dataRows, 1);
    statusValues.forEach(function (s) {
      const c = statusColors[s];
      rules.push(
        SpreadsheetApp.newConditionalFormatRule()
          .whenTextEqualTo(s)
          .setBackground(c.bg)
          .setFontColor(c.fg)
          .setRanges([statusRange])
          .build()
      );
    });
  }

  if (priorityCol > 0) {
    const priorityRange = sheet.getRange(2, priorityCol, dataRows, 1);
    priorityValues.forEach(function (p) {
      const c = priorityColors[p];
      rules.push(
        SpreadsheetApp.newConditionalFormatRule()
          .whenTextEqualTo(p)
          .setBackground(c.bg)
          .setFontColor(c.fg)
          .setRanges([priorityRange])
          .build()
      );
    });
  }

  sheet.setConditionalFormatRules(rules);
  writeHandoffLegendPanel_(sheet, statusValues, priorityValues, statusColors, priorityColors);
}

/**
 * Side legend (columns J–L): Status + Priority meanings with matching colors.
 * Sits to the right of the checklist so it stays visible while scrolling the list.
 */
function writeHandoffLegendPanel_(sheet, statusValues, priorityValues, statusColors, priorityColors) {
  const legendCol = 10; // column J — one blank spacer after Notes (col H)
  const labelCol = legendCol;
  const meaningCol = legendCol + 1;

  sheet.setColumnWidth(legendCol - 1, 24); // spacer column I
  sheet.setColumnWidth(labelCol, 120);
  sheet.setColumnWidth(meaningCol, 320);
  sheet.setColumnWidth(meaningCol + 1, 40);

  let row = 1;

  sheet.getRange(row, labelCol, 1, 2).merge()
    .setValue('LEGEND — how to use Status & Priority')
    .setBackground(COLORS.header)
    .setFontColor(COLORS.headerFont)
    .setFontWeight('bold')
    .setFontSize(11);
  row += 2;

  sheet.getRange(row, labelCol, 1, 2).merge()
    .setValue('STATUS')
    .setBackground(COLORS.sectionBand)
    .setFontWeight('bold');
  row++;

  statusValues.forEach(function (s) {
    const c = statusColors[s];
    sheet.getRange(row, labelCol)
      .setValue(s)
      .setBackground(c.bg)
      .setFontColor(c.fg)
      .setFontWeight('bold')
      .setHorizontalAlignment('center');
    sheet.getRange(row, meaningCol)
      .setValue(c.meaning)
      .setWrap(true)
      .setVerticalAlignment('middle');
    sheet.setRowHeight(row, 28);
    row++;
  });

  row++; // spacer

  sheet.getRange(row, labelCol, 1, 2).merge()
    .setValue('PRIORITY')
    .setBackground(COLORS.sectionBand)
    .setFontWeight('bold');
  row++;

  priorityValues.forEach(function (p) {
    const c = priorityColors[p];
    sheet.getRange(row, labelCol)
      .setValue(p)
      .setBackground(c.bg)
      .setFontColor(c.fg)
      .setFontWeight('bold')
      .setHorizontalAlignment('center');
    sheet.getRange(row, meaningCol)
      .setValue(c.meaning)
      .setWrap(true)
      .setVerticalAlignment('middle');
    sheet.setRowHeight(row, 28);
    row++;
  });

  row += 2;
  sheet.getRange(row, labelCol, 1, 2).merge()
    .setValue('Tip: Filter Priority = Critical first. Flip Status as you decide on the call.')
    .setFontStyle('italic')
    .setFontColor('#555555')
    .setWrap(true);
  sheet.setRowHeight(row, 40);

  // Keep the legend visible while scrolling the checklist vertically
  // (freeze already set on row 1 for the main header).
}

/** Dropdowns + colors for Review & Feedback (team QA on Netlify preview). */
function applyReviewFeedbackControls_(sheet) {
  if (sheet.getLastRow() < 2) return;

  const statusCol = findCol_(sheet, 'Status');
  const severityCol = findCol_(sheet, 'Severity');
  const deviceCol = findCol_(sheet, 'Device');
  const pageCol = findCol_(sheet, 'Page');
  const dataRows = sheet.getLastRow() - 1;

  const statusValues = ['Open', 'In Progress', 'Done', 'Won\'t Fix', 'Deferred'];
  const severityValues = ['Critical', 'High', 'Medium', 'Low', 'Nit'];
  const deviceValues = ['Desktop', 'Mobile', 'Tablet', 'Both'];
  const pageValues = [
    'Home', 'About', 'Why', 'Our Impact', 'Schools', 'Events', 'Get Involved',
    'Docs', 'Global/Nav', 'All Phase 1', 'Other',
  ];

  const statusColors = {
    Open: { bg: '#FEF3C7', fg: '#92400E' },
    'In Progress': { bg: '#DBEAFE', fg: '#1E40AF' },
    Done: { bg: '#D1FAE5', fg: '#065F46' },
    'Won\'t Fix': { bg: '#E5E7EB', fg: '#374151' },
    Deferred: { bg: '#E0E7FF', fg: '#3730A3' },
  };
  const severityColors = {
    Critical: { bg: '#FECACA', fg: '#7F1D1D' },
    High: { bg: '#FED7AA', fg: '#9A3412' },
    Medium: { bg: '#FEF08A', fg: '#854D0E' },
    Low: { bg: '#E5E7EB', fg: '#374151' },
    Nit: { bg: '#F3F4F6', fg: '#6B7280' },
  };

  function setList_(col, values, help) {
    if (col < 1) return;
    sheet.getRange(2, col, dataRows, 1).setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(values, true)
        .setAllowInvalid(false)
        .setHelpText(help)
        .build()
    );
  }

  setList_(statusCol, statusValues, 'Open · In Progress · Done · Won\'t Fix · Deferred');
  setList_(severityCol, severityValues, 'Critical · High · Medium · Low · Nit');
  setList_(deviceCol, deviceValues, 'Desktop · Mobile · Tablet · Both');
  setList_(pageCol, pageValues, 'Which page the feedback is about');

  const rules = [];
  if (statusCol > 0) {
    const range = sheet.getRange(2, statusCol, dataRows, 1);
    Object.keys(statusColors).forEach(function (s) {
      const c = statusColors[s];
      rules.push(
        SpreadsheetApp.newConditionalFormatRule()
          .whenTextEqualTo(s)
          .setBackground(c.bg)
          .setFontColor(c.fg)
          .setRanges([range])
          .build()
      );
    });
  }
  if (severityCol > 0) {
    const range = sheet.getRange(2, severityCol, dataRows, 1);
    Object.keys(severityColors).forEach(function (s) {
      const c = severityColors[s];
      rules.push(
        SpreadsheetApp.newConditionalFormatRule()
          .whenTextEqualTo(s)
          .setBackground(c.bg)
          .setFontColor(c.fg)
          .setRanges([range])
          .build()
      );
    });
  }
  sheet.setConditionalFormatRules(rules);

  // Tip row under the data
  const tipRow = sheet.getLastRow() + 2;
  sheet.getRange(tipRow, 1, 1, 6).merge()
    .setValue('How to use: one row per issue. Filter Status = Open. Preview: https://contentmentweb2.netlify.app/ — add RF-xxx IDs sequentially. Full format guide →')
    .setFontStyle('italic')
    .setFontColor('#555555')
    .setWrap(true);
  sheet.setRowHeight(tipRow, 36);

  writeReviewFeedbackLegendPanel_(sheet, statusColors, severityColors);
}

/**
 * Side legend (columns M–N): how to log a row, plus Status + Severity
 * meanings with matching colors. Mirrors writeHandoffLegendPanel_ so both
 * live tabs teach their own format instead of relying on tribal knowledge.
 */
function writeReviewFeedbackLegendPanel_(sheet, statusColors, severityColors) {
  const legendCol = 13; // column M — one blank spacer after Preview URL (col K)
  const labelCol = legendCol;
  const meaningCol = legendCol + 1;

  sheet.setColumnWidth(legendCol - 1, 24); // spacer column L
  sheet.setColumnWidth(labelCol, 120);
  sheet.setColumnWidth(meaningCol, 340);

  let row = 1;

  sheet.getRange(row, labelCol, 1, 2).merge()
    .setValue('LEGEND — how to log feedback')
    .setBackground(COLORS.header)
    .setFontColor(COLORS.headerFont)
    .setFontWeight('bold')
    .setFontSize(11);
  row += 2;

  sheet.getRange(row, labelCol, 1, 2).merge()
    .setValue('FORMAT: one row per issue')
    .setBackground(COLORS.sectionBand)
    .setFontWeight('bold');
  row++;

  const formatSteps = [
    ['ID', 'Next sequential RF-0xx — do not reuse or renumber existing IDs.'],
    ['Date, Reviewer', 'Today’s date + your name (or "Team"/"Slack" if it came from a thread).'],
    ['Page, Device', 'Pick from the dropdown. "Both" only if you confirmed on both.'],
    ['Severity', 'Pick from the dropdown — see meanings below.'],
    ['Feedback', 'Be specific: what’s wrong + where on the page. One issue per row, not a bundle.'],
    ['Status', 'Leave as Open — Sam/owner flips this as it’s triaged and fixed.'],
    ['Owner, Resolution', 'Leave blank when logging — filled in during triage, not by the reporter.'],
    ['Preview URL', 'The exact link you tested, with #anchor if relevant.'],
  ];
  formatSteps.forEach(function (step) {
    sheet.getRange(row, labelCol)
      .setValue(step[0])
      .setFontWeight('bold')
      .setVerticalAlignment('top');
    sheet.getRange(row, meaningCol)
      .setValue(step[1])
      .setWrap(true)
      .setVerticalAlignment('top');
    sheet.setRowHeight(row, 32);
    row++;
  });

  row++; // spacer

  sheet.getRange(row, labelCol, 1, 2).merge()
    .setValue('STATUS')
    .setBackground(COLORS.sectionBand)
    .setFontWeight('bold');
  row++;

  const statusMeanings = {
    Open: 'Reported — not yet triaged or fixed.',
    'In Progress': 'Someone is actively working the fix.',
    Done: 'Fixed and verified live on the preview.',
    'Won\'t Fix': 'Acknowledged but staying as-is — out of scope for Phase 1.',
    Deferred: 'Valid issue, pushed to Phase 2 or a later pass.',
  };
  Object.keys(statusMeanings).forEach(function (s) {
    const c = statusColors[s];
    sheet.getRange(row, labelCol)
      .setValue(s)
      .setBackground(c.bg)
      .setFontColor(c.fg)
      .setFontWeight('bold')
      .setHorizontalAlignment('center');
    sheet.getRange(row, meaningCol)
      .setValue(statusMeanings[s])
      .setWrap(true)
      .setVerticalAlignment('middle');
    sheet.setRowHeight(row, 28);
    row++;
  });

  row++; // spacer

  sheet.getRange(row, labelCol, 1, 2).merge()
    .setValue('SEVERITY')
    .setBackground(COLORS.sectionBand)
    .setFontWeight('bold');
  row++;

  const severityMeanings = {
    Critical: 'Breaks the page or blocks a user flow — fix before next review.',
    High: 'Clearly wrong or visibly broken — fix before launch.',
    Medium: 'Noticeable but not blocking — fix if time allows.',
    Low: 'Minor polish — nice to have.',
    Nit: 'Cosmetic nitpick — optional.',
  };
  Object.keys(severityMeanings).forEach(function (s) {
    const c = severityColors[s];
    sheet.getRange(row, labelCol)
      .setValue(s)
      .setBackground(c.bg)
      .setFontColor(c.fg)
      .setFontWeight('bold')
      .setHorizontalAlignment('center');
    sheet.getRange(row, meaningCol)
      .setValue(severityMeanings[s])
      .setWrap(true)
      .setVerticalAlignment('middle');
    sheet.setRowHeight(row, 28);
    row++;
  });
}

// ─── Black Box (all records / history / logs) ───────────────────────────────

function withAuditPaused_(fn) {
  const props = PropertiesService.getScriptProperties();
  props.setProperty(AUDIT_SKIP_PROP, '1');
  try {
    return fn();
  } finally {
    props.deleteProperty(AUDIT_SKIP_PROP);
  }
}

function installChangeLogTrigger() {
  removeChangeLogTrigger();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ensureChangeLogSheet_(ss);
  ScriptApp.newTrigger('onEditAudit_')
    .forSpreadsheet(ss)
    .onEdit()
    .create();
  try {
    SpreadsheetApp.getUi().alert(
      'Black Box trigger installed.\n\n' +
      'Every manual edit on Tickets, Decisions, Handoff Checklist, Reference, etc. is recorded in the locked "' +
      CHANGE_LOG_SHEET +
      '" tab (who / tab / cell / old → new).\n\n' +
      'Bulk Refresh / Force reseed are recorded as one summary row each, not cell-by-cell.\n\n' +
      'This is your flight recorder — do not clear it.'
    );
  } catch (e) {
    Logger.log('Black Box trigger installed.');
  }
}

function removeChangeLogTrigger() {
  ScriptApp.getProjectTriggers().forEach(function (trigger) {
    if (trigger.getHandlerFunction() === 'onEditAudit_') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
}

function ensureChangeLogSheetMenu_() {
  ensureChangeLogSheet_(SpreadsheetApp.getActiveSpreadsheet());
  SpreadsheetApp.getUi().alert(
    '"' + CHANGE_LOG_SHEET + '" is ready and protected.\n\n' +
    'It holds all edit history and bulk-op records. Install the Black Box trigger if you have not already.'
  );
}

/**
 * Installable onEdit handler — must be installed via
 * Launch Plan → Install Black Box trigger (simple onEdit cannot reliably
 * read the editor's email).
 */
function onEditAudit_(e) {
  try {
    if (!e || !e.range) return;
    if (PropertiesService.getScriptProperties().getProperty(AUDIT_SKIP_PROP) === '1') return;

    const sheet = e.range.getSheet();
    const tabName = sheet.getName();
    if (tabName === CHANGE_LOG_SHEET || tabName === CHANGE_LOG_SHEET_LEGACY) return;

    // Ignore Handoff Checklist legend panel (cols J+)
    if (tabName === 'Handoff Checklist' && e.range.getColumn() >= 10) return;
    // Ignore Review & Feedback legend panel (cols M+)
    if (tabName === 'Review & Feedback' && e.range.getColumn() >= 13) return;

    const ss = sheet.getParent();
    ensureChangeLogSheet_(ss);

    const user =
      (e.user && e.user.getEmail && e.user.getEmail()) ||
      Session.getActiveUser().getEmail() ||
      Session.getEffectiveUser().getEmail() ||
      '(unknown)';

    const numCells = e.range.getNumRows() * e.range.getNumColumns();
    if (numCells === 1) {
      const row = e.range.getRow();
      const col = e.range.getColumn();
      appendAuditEvent_(ss, {
        user: user,
        tab: tabName,
        cell: e.range.getA1Notation(),
        column: headerNameForCol_(sheet, col),
        rowId: rowIdForRow_(sheet, row),
        oldValue: stringifyAuditValue_(e.oldValue),
        newValue: stringifyAuditValue_(e.value !== undefined ? e.value : e.range.getValue()),
        source: 'Manual edit',
      });
      return;
    }

    // Multi-cell paste / fill — one summary row (old values not available per-cell)
    const newVals = e.range.getValues();
    appendAuditEvent_(ss, {
      user: user,
      tab: tabName,
      cell: e.range.getA1Notation(),
      column: '(range)',
      rowId: rowIdForRow_(sheet, e.range.getRow()),
      oldValue: '(multi-cell — old values not available)',
      newValue: truncateAudit_(JSON.stringify(newVals), 500),
      source: 'Manual multi-cell edit',
    });
  } catch (err) {
    Logger.log('onEditAudit_ failed: ' + err);
  }
}

function ensureChangeLogSheet_(ss) {
  // Migrate legacy "Change Log" tab name → "Black Box" if present
  let legacy = ss.getSheetByName(CHANGE_LOG_SHEET_LEGACY);
  let sheet = ss.getSheetByName(CHANGE_LOG_SHEET);
  if (legacy && !sheet) {
    legacy.setName(CHANGE_LOG_SHEET);
    sheet = legacy;
  } else if (legacy && sheet && legacy.getSheetId() !== sheet.getSheetId()) {
    // Both exist — keep Black Box, leave legacy alone (do not delete user data)
  }

  if (!sheet) {
    sheet = ss.insertSheet(CHANGE_LOG_SHEET);
  }

  if (sheet.getLastRow() < 1 || sheet.getRange(1, 1).getValue() !== AUDIT_HEADERS[0]) {
    sheet.clear();
    sheet.getRange(1, 1, 1, AUDIT_HEADERS.length).setValues([AUDIT_HEADERS]);
  }

  // Title band above the table feels heavy in Sheets — put meaning in the tab name
  // and a one-line note in A1 header context via freeze + description on protection.

  sheet.getRange(1, 1, 1, AUDIT_HEADERS.length)
    .setBackground('#0B1220') // near-black — black box
    .setFontColor('#F8FAFC')
    .setFontWeight('bold')
    .setWrap(true);
  sheet.setFrozenRows(1);
  sheet.setColumnWidth(1, 160); // Timestamp
  sheet.setColumnWidth(2, 200); // User
  sheet.setColumnWidth(3, 160); // Tab
  sheet.setColumnWidth(4, 80);  // Cell
  sheet.setColumnWidth(5, 120); // Column
  sheet.setColumnWidth(6, 100); // Row ID
  sheet.setColumnWidth(7, 220); // Old
  sheet.setColumnWidth(8, 220); // New
  sheet.setColumnWidth(9, 140); // Source

  protectChangeLogSheet_(sheet);
  return sheet;
}

function protectChangeLogSheet_(sheet) {
  // Remove prior protections on this sheet, then lock for humans.
  sheet.getProtections(SpreadsheetApp.ProtectionType.SHEET).forEach(function (p) {
    try { p.remove(); } catch (err) { /* ignore */ }
  });

  const protection = sheet.protect().setDescription(
    'BLACK BOX — append-only flight recorder for all sheet edits and bulk ops. ' +
    'Written only by the Launch Plan script. Do not clear, rewrite, or delete rows.'
  );
  protection.setWarningOnly(false);

  // Strip other editors; owner (and the script running as owner) keep access.
  try {
    const editors = protection.getEditors();
    if (editors && editors.length) protection.removeEditors(editors);
  } catch (err) { /* ignore */ }

  try {
    if (protection.canDomainEdit()) protection.setDomainEdit(false);
  } catch (err) { /* ignore */ }
}

function appendAuditEvent_(ss, evt) {
  const sheet = ensureChangeLogSheet_(ss);
  const tz = CONFIG.TIMEZONE || Session.getScriptTimeZone();
  const stamp = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd HH:mm:ss z');
  sheet.appendRow([
    stamp,
    evt.user || '',
    evt.tab || '',
    evt.cell || '',
    evt.column || '',
    evt.rowId || '',
    evt.oldValue || '',
    evt.newValue || '',
    evt.source || '',
  ]);

  // Soft cap — keep newest ~8000 rows so the sheet stays usable
  const maxKeep = 8000;
  const last = sheet.getLastRow();
  if (last > maxKeep + 1) {
    sheet.deleteRows(2, last - maxKeep - 1);
  }
}

function headerNameForCol_(sheet, col) {
  try {
    const h = sheet.getRange(1, col).getValue();
    return h ? String(h) : 'Col ' + col;
  } catch (err) {
    return 'Col ' + col;
  }
}

function rowIdForRow_(sheet, row) {
  if (row <= 1) return '(header)';
  try {
    const id = sheet.getRange(row, 1).getValue();
    return id !== '' && id !== null ? String(id) : 'row ' + row;
  } catch (err) {
    return 'row ' + row;
  }
}

function stringifyAuditValue_(v) {
  if (v === null || v === undefined) return '';
  if (typeof v === 'object') return truncateAudit_(JSON.stringify(v), 500);
  return truncateAudit_(String(v), 500);
}

function truncateAudit_(s, max) {
  if (!s) return '';
  return s.length > max ? s.substring(0, max) + '…' : s;
}
