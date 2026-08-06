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
const EMBEDDED_DATA = {"meta":{"title":"contentment.org — Launch Plan","version":"2026-08-05","owner":"Somesh Bhardwaj","contact":"somesh@contentment.org","summary":"5 Aug (Somesh) — PLANNING-TRUTH OVERHAUL. Four things were wrong on the Sheet at once, and each hid work from the team.\n\n1. PAGES WITHOUT TICKETS. Six routes existed in the pages table (or on the live preview) with no Tickets-tab row, so anyone outside engineering could not see, question or amend them: /terms, /press, /impact, /story-board, /foundation-reach-map and /docs. Added as FEAT-074, FEAT-095, FEAT-096, FEAT-034, FEAT-033 (retitled from the vague 'Interactive global map') and FEAT-102. OPS-004 added for the timeline generator, which shipped 5 Aug and was referenced in TRACKER with no row. FEAT-071 was titled 'Privacy & cookies — and Terms' and marked Done when /privacy shipped, which made it look as though /terms had shipped too; Terms is now its own ticket, Blocked on legal copy.\n\n2. STATUSES THAT SAID 'IN PROGRESS' WHEN NOBODY ON OUR SIDE WAS PROGRESSING. Twelve tickets sat at In Progress regardless of whether the remaining work was ours or someone else's, so the Sheet could not distinguish 'Somesh is building this' from 'this has been sitting on one person for a week'. New rule applied throughout: work on us = In Progress/Done/Scheduled; fully stopped on someone else = Blocked; part landed, part owed = Partial. A new WAITING ON column names the person and what they owe, on every row. Nine ticket statuses changed (FEAT-002 -> Done, FEAT-031/032/090 -> Blocked, FEAT-004/005/040/050/060/093 -> Partial, FEAT-101 -> Scheduled).\n\n3. UNREADABLE NOTE FIELDS. The single 'Blocker / Note' column had grown into paragraph blobs mixing current state with history — FEAT-002's ran to 1,400 characters. Split into WHERE IT STANDS (current truth, bulleted, no history) and HISTORY (dated bullets, newest first). Handoff Checklist keeps its 8 columns because LaunchPlanSheet.gs hardcodes its legend panel at column J, so its Waiting-on rides as the first line of Notes in a fixed format.\n\n4. HANDOFF ITEMS LEFT OPEN LONG AFTER THEY CLOSED. Fifteen HC items were corrected. HC-027 logo — the SVG landed and is in use on every route; the item was never flipped. HC-028 critical-only review — ran as designed, output absorbed, pages four review rounds past that snapshot. HC-053 approvers — the names have been operating as approvers all sprint (design Dave+Veron, content Kristina+WoeiJing, legal Lorna, go/no-go Nav+WoeiJing, engineering Somesh). HC-032 newsletter destination — Flodesk live since 4 Aug. HC-061/062/066/076 — all finished work still showing as unfinished. HC-067 and HC-077 moved to Ready (prepared, date-gated). Cookiebot's domain move to www.contentment.org is now recorded on HC-067 as a cutover step, since it belongs to go-live rather than to the credentials item.\n\nLORNA'S KEELA MAP (website-keela.netlify.app, 5 Aug) reviewed against the build. Her Stream 1 matches: the General Donation Form is live on three pages. Her Stream 2 confirms a gap we suspected — the general widget CANNOT capture campaign designation, so designated gifts would receipt with the wrong tax letter. Three genuine disconnects found and logged: (a) HC-078 — her map assumes EVERY sign-up lands in Keela, while we route all email capture sitewide to Flodesk per D-19, and nothing moves a Flodesk subscriber into Keela; this supersedes D-24's Events-only framing. (b) HC-079 — her Stream 4 shows a November waitlist PAGE that does not exist in our build and is not in the Phase 1 page list. (c) HC-080 — her timeline launches 8/17, ours Aug 21, and both are being worked to. D-25 opened for what Homeroom membership INCLUDES; note the price half is already settled (D-01, $25/$50/$100, 27 Jul), so only benefits are missing. Her Decision 4 (access to draft pages) can be closed immediately — contentmentweb2.netlify.app has been live throughout.\n\nEarlier 4-5 Aug work still current: Flodesk newsletter LIVE via a host-native /api/newsletter function (astro.config.mjs stays output:'static', so the 3 Aug security revert holds); double opt-in ON and explicit; custom Cookiebot banner (390x155 mobile, from 374x800 stock) with sources version-controlled in docs/cookiebot/; /privacy live with the real cookie declaration; Consent Mode signal set complete; /getinvolved donate split; Nav current-page underline. STILL BLOCKED — Keela per-tier/designation (HC-030/075/078, Lorna); story photos + permissions (FEAT-030, Comms); Dave's second Events notes round (HC-072); Spread-the-movement door (WoeiJing). Go-live Aug 21, pending HC-080."},"overview":[["Metric","Value"],["Team review tracker","Sheet tab Review & Feedback (RF-xxx). Preview: https://contentmentweb2.netlify.app"],["Design handoff deadline","Jul 28, 2026 — UIUX–Dev handoff call Done (actual Day 0; was mislabeled Jul 27)"],["Dev sprint (build)","Jul 28–Aug 7, 2026 (Somesh-led) — Day 0 = Jul 28 handoff"],["Final review meeting","Anytime Aug 3–7, 2026 — flexible window during week 2 of sprint (go/no-go for fixes)"],["Review + fixes window","Aug 10–14 (analytics, polish, mobile UI/UX, Nav + WJ approval)"],["Phase 1 hard go-live","Aug 21, 2026 ★ — hard launch date; end of Phase 1. Next phase timeline TBD"],["Content pages in scope","7 Phase 1 pages: Homepage, Why, Our Impact, Schools, Events, Get Involved, About Us"],["Launch utility pages","Updates, 404. Privacy + Terms = open ticket (Phase 1.5 or Phase 2 — TBD; under process)"],["Production domain","contentment.org (Vercel)"],["Build approach","Dave HTML drafts → multi-page production build (D-11 Astro 4.x resolved; call mentioned React — pending Nick sign-off before any stack change)"],["Design owners","Dave Kebo (all page design v2) + Veron (remaining pages)"],["Critical handoff dependency","Logo SVG (Nav→Dave, immediate) + Kristina critical-flag list (EOD) + Button/CTA Miro inventory (EOW) + Dave asset zip"],["Phase 2 / later","Copy updates; Priscilla quote replacement; branding/horizontal logo alignment; map, Story Board, /homeroom gate; Privacy/Terms TBD Phase 1.5 or 2"],["Mobile requirement","Somesh owns responsive layout in the 2-week sprint (desktop + mobile). No separate Dave mobile deliverable; non-scaling elements hide/adjust post-Phase 1 if needed"],["Bottom line","Handoff Done Jul 28. Sprint Jul 28–Aug 7. Homepage first (desktop+mobile) Slack review passed. Phase 1 hard live Aug 21 as scheduled."]],"timeline":[["Phase","Dates","Work stream","Deliverables","Owner","Dependencies"],["Phase 1 — Handoff","Jul 28","UIUX–Dev meeting","Design freeze + UIUX–Dev handoff call (actual Day 0); Button/CTA inventory from Kristina","Dave, Veron, K → Somesh","Designs locked; Phase 1 scope frozen"],["Phase 2 — Dev Sprint","Jul 28–31","Foundation + Homepage + Why + Give","Astro scaffold, shared layout, CSS tokens, nav/footer; migrate Homepage to /; build /why and /give (Get Involved)","Somesh","Dave Netlify drafts"],["Phase 2 — Dev Sprint","Aug 3–7","Our Impact + Schools + Events + About Us","Build /stories (Our Impact), /schools, /events, About Us (single page)","Somesh","Content + drafts; Button inventory"],["Phase 3 — Final Review","Aug 3–7","Stakeholder VC (flexible)","Full site walkthrough; go/no-go for Aug 10–14 fixes — date TBD within this window","All (VC)","Dev sprint pages landing"],["Phase 4 — Review Sprint","Aug 10–14","Fixes + polish + analytics","Fixes & polish, Mobile UI/UX, Analytics, Final approval, Launch prep, Google Form embed, Website Change Request Form & SOP","Somesh, K","GA4 property ID; Flodesk/newsletter decision"],["Phase 5 — Final Approval","Aug 10–14","Stakeholder sign-off","Nav + WJ review and approve; Keela URLs wired if available","Nav, WJ, Somesh","Approval unlocks go-live"],["Phase 6 — Launch","Aug 21","Hard go-live — end of Phase 1 (as scheduled)","DNS cutover to contentment.org; Keela live; newsletter live; Lighthouse ≥85","Somesh","Keela URLs; Nav + WJ approval"]],"pages":[["Page","Route","Phase","Dave draft URL","Draft status","Design owner","Build complexity","In Kristina list","Notes"],["Homepage","/","1","https://comfy-brigadeiros-00c4b6.netlify.app/","Astro ported","Dave","Medium","Yes","Tracked as FEAT-010 + FEAT-011. https://contentmentweb2.netlify.app/ — Astro live. HC-057 passed 31 Jul. Aug 3 — hero CTA→/why; Join Homeroom invite→/give; door Schools/Events wired; Spread-the-movement TBD WJ; Homeroom donate form measure 46ch; Sign In + Donate chrome wired sitewide. Aug 4 — Keela General Donation Form live in Homeroom (#homeroom); Donate chrome → /#homeroom. Aug 4 — KeelaDonateForm accepts /?amount=25|50|100&frequency=monthly#homeroom presets from /give Join Homeroom. Aug 4 (RF-010 Dave) — hero zoom matched Get Involved (subtle scale 1.06 / 18s)."],["Why Teacher Wellbeing","/why","1","https://loquacious-zuccutto-ec29f4.netlify.app/","Astro ported","Dave","Medium","Yes","Tracked as FEAT-020. https://contentmentweb2.netlify.app/why — Astro live. RF-006 Why QA 31 Jul. 1 Aug lightbox fix. Aug 3 — teacher Shorts fill 9:16 reels; donate form measure matched to copy (52ch). Aug 4 — Keela General Donation Form live in give band. Aug 4 (RF-010 Dave) — hero zoom matched Get Involved (subtle scale 1.06 / 18s)."],["Our Impact","/our-impact","1","https://heartfelt-nougat-9d490a.netlify.app/","Astro ported","Dave","Medium-High","Yes","Tracked as FEAT-031 (content blocked on FEAT-030). https://contentmentweb2.netlify.app/our-impact — Astro live. RF-006 QA pass 31 Jul (locked widths clean; no code fixes). FEAT-030 story data still blocked. 1 Aug — RF-008 fixed: video lightbox was playing in a tiny frame; now fills the modal."],["For Schools","/schools","1","https://timely-dasik-427334.netlify.app/","Astro ported","Dave / Veron","High","Yes","Tracked as FEAT-040. https://contentmentweb2.netlify.app/schools — Aug 3: partner deck Drive URL; form embed Phase 2 hold (Kristina Miro); simple page + #start mailto; pricing titles enlarged. Aug 4 (Somesh) — wellbeing-lead photo replaced at public/assets/fs-Jadielsm.jpg (same path in schools.astro). Aug 4 (RF-010 Dave) — hero zoom matched Get Involved (subtle scale 1.06 / 18s)."],["Events","/events","1","https://helpful-elf-ba3c06.netlify.app/","Astro ported (review-only)","Dave / Veron","Medium-High","Yes","Tracked as FEAT-090. https://contentmentweb2.netlify.app/events — Aug 3: email-capture UI forms (Flodesk TBD D-24); Join Homeroom→/give; See the stories→/our-impact. HC-072 review-only; RSVP seams empty."],["Get Involved","/getinvolved","1","https://cute-palmier-4c93e1.netlify.app/","Astro ported","Dave","Low-Medium","Yes","Tracked as FEAT-050 (+ FEAT-051 monthly). https://contentmentweb2.netlify.app/getinvolved — Homeroom at /getinvolved (was /give; 301 kept). RF-006 QA 31 Jul. Aug 3 — hero Join Homeroom → #become. Aug 4 — Join Homeroom tiers deep-link to homepage Keela form (seams.homeroomDonateUrl); joinTiers empty (HC-075/071). Aug 4 (Somesh) — donate split #donate (gi-donate-photo.jpg + KeelaDonateForm); one-time gift → #donate. D-03 monthly split still open. Aug 4 (RF-010 Dave) — hero zoom is the reference model for Home/Why/Schools; Meet Jose / Homeroom video cut HELD pending WoeiJing + Kristina."],["About Us","/about","1","—","Astro ported","Dave (rev4)","TBD","Yes","Tracked as FEAT-093. https://contentmentweb2.netlify.app/about — Astro live. RF-006 About QA 31 Jul. Aug 3 — hero filename about-hero-team-bali-july2025.jpg; Dan caption tweak; Talk-with-Us email visible; share mailto fixed. Roster still needs Dave line-by-line before public deploy."],["Privacy Policy","/privacy","1 (partial)","—","Astro built","Somesh","Low-Medium","No","Tracked as FEAT-071 (Phase 1 + 2, Done 5 Aug). https://contentmentweb2.netlify.app/privacy — LIVE 5 Aug. PURPOSE: hosts the live Cookiebot cookie declaration and the Cookie Preferences trigger, which is what makes the consent banner's withdrawal promise true. Before this the banner linked to a 404. Ships the cookie half only, and says so on the page: branded hero, status note, per-tool accordion (GA4, Clarity, PostHog, Sentry, Cookiebot), regional compliance table from DECISION-002, and the auto-generated declaration (now Necessary 4 / Statistics 11 / Marketing 7 after the 5 Aug rescan). STILL OWED: the legal text itself — controller identity, lawful basis, retention, data-subject rights, transfers, complaints — from Lorna + Finance/Legal per D-08. It drops into a marked section in privacy.astro; the cookie half needs no rework. NEEDS TEAM REVIEW: built without reaching Kristina's page list."],["Terms of Use","/terms","1.5 or 2","—","Not started","—","Low","No","Tracked as FEAT-074 (split out of FEAT-071 on 5 Aug). NOT STARTED and Blocked — waiting on Lorna + Finance/Legal for the terms text (D-08). Unlike /privacy there is no half we can ship alone: /privacy had a live Cookiebot declaration to stand on, /terms has no equivalent. Does not block Aug 21. Build effort once copy lands is about an hour — the /privacy branded utility pattern is already built and reusable."],["Newsletter signup","/updates","1","—","Astro built","Somesh","Low","No","Tracked as FEAT-073. PURPOSE: the standalone newsletter signup page — the destination for 'subscribe' links that need a real page rather than an inline form (Footer Explore column, sitemap). 31 Jul — src/pages/updates.astro live. 4 Aug — form WIRED to Flodesk (FEAT-070) via <NewsletterForm source=\"updates_page\" bare />; segment CONFIRMED by Somesh 4 Aug → \"www.contentment.org\". The `bare` prop was added because the page supplied its own .news section + heading and was rendering a nested duplicate section with two headings — fixed. NEEDS TEAM REVIEW: built without ever reaching Kristina's page list, so its copy and framing have had no non-engineering review."],["404 page","/404","1","—","Astro built","—","Low","No","Tracked as FEAT-072. PURPOSE: branded error page shown for any unmatched URL — keeps someone who mistypes or follows a dead link inside the site instead of bouncing. STATUS CORRECTION (4 Aug): this row said 'Not started' but the page SHIPPED 2 Aug — src/pages/404.astro, `noindex, follow`, short brand-gradient hero and 6 destination cards, reusing existing tokens and .anim (no new design language). Netlify serves dist/404.html automatically. Verified in-browser at 1280 and 390px. NEEDS TEAM REVIEW: never went through Kristina's page list — the 6 destination cards and the copy have had no non-engineering review."],["Individual impact story","/stories/[slug]","1.5","—","Not started","—","Medium","No","Tracked as FEAT-032. After index ships; formerly 'Individual story'"],["Press & Media","/press","2","—","Not started","—","Low","No","Tracked as FEAT-095. Footer / outreach"],["Impact (main nav)","/impact","— (superseded)","—","Not building","—","Medium","No","Tracked as FEAT-096 — CLOSED 5 Aug. RESOLVED: /our-impact is the impact page and is already the route in use; no separate /impact page will be built. This row is kept so the Sheet shows the decision rather than silently dropping a route the team had been told to expect. No redirect is needed — /impact never existed as a live route."],["Homeroom member hub","/homeroom","2","—","Not started","—","High","No","Tracked as FEAT-091 + FEAT-092. Password-gated; not in public nav"],["Festival campaign","/festival/2026","2","—","Not started","—","Medium","No","Tracked as FEAT-094. Linked from Events; needs campaign brief"],["Story Board prototype","/story-board","2","public/story-board.html","Paused","—","—","No","Tracked as FEAT-034. PURPOSE: Somesh's Story Board prototype — a feed-style way to browse programme stories, built to test the format before committing homepage space to it. public/story-board.html → /story-board (netlify.toml 200 rewrite). NOTE: 'Paused' refers to the DESIGN work; the route is PUBLICLY REACHABLE on the preview right now. Not linked from any nav, so it is only findable if you know the URL."],["Foundation Reach Map","/foundation-reach-map","2","public/foundation-reach-map.html","Paused","—","—","No","Tracked as FEAT-033. PURPOSE: Somesh's Foundation Reach Map prototype — flat D3 + TopoJSON world map with a pin card per served country, intended for the homepage once approved. public/foundation-reach-map.html → /foundation-reach-map (netlify.toml 200 rewrite). NOTE: 'Paused' refers to the DESIGN work; the route is PUBLICLY REACHABLE on the preview right now. Not linked from any nav."],["Internal docs hub","/docs","1 (internal)","—","Live on preview","Somesh","Low","No","Tracked as FEAT-102 + HC-077. PURPOSE: the team-facing planning + brief hub — DEV-TIMELINE, TEAM/TECH/GROWTH/AUTOMATION briefs and the planning index, published so non-engineering readers can self-serve status without a repo checkout. Generated at build time by scripts/copy-docs.sh (docs/*.html -> public/docs); public/docs and site/docs are gitignored. MUST BE UNPUBLISHED AT CUTOVER (HC-077): remove the Footer 'Project docs' link, skip copy-docs.sh on the production build, 404 /docs* and keep docs/ in the private repo only. Recorded 5 Aug — it was publicly reachable on the preview and linked from the Footer while appearing in no ticket and no page table."]],"designNotes":[["Page","Item","Risk level","Mitigation"],["All pages","Design handoff was Jul 28 (actual Day 0; earlier docs said Jul 27)","High","Dave + Veron must lock designs before UIUX–Dev meeting; no mid-sprint redesigns"],["Homepage","Dave draft differs from site/index.html prototype","Low","Build from Dave's latest Netlify draft"],["Homepage","Responsive layout audit (320–1280px)","Low","Passed 30 Jul 2026 — see docs/planning/HOMEPAGE-RESPONSIVE-AUDIT.md; FEAT-003 drawer shipped"],["Why","Video embed placeholders (CEO + 3x teacher 9:16)","Medium","Build slots now; need hosted URLs before complete"],["Our Impact","Longest editorial page in v1 (renamed from 'Stories')","Medium","No map in Phase 1; region-scroll only"],["For Schools","Interactive ripple rings","High","Accessible static fallback for prefers-reduced-motion"],["For Schools","Horizontal comparison table on mobile","Medium","Side-scroll with clear affordance"],["For Schools","Pricing amounts TBD","Low","Ship with placeholders"],["Events","Filter chips (open / Homeroom / virtual / in-person)","Medium","Real JS logic, not static layout"],["Events","Some event dates TBC","Medium","Expect content updates after first build"],["Events","Email capture embed slot","Low","Wire to Flodesk when creds ready"],["Get Involved","Video embed placeholder","Low","Placeholder retained (Jul 28). Jose video sent directly to Somesh when ready — integrate then."],["About Us","Veron-led design still in progress","High","Confirmed Phase 1, single page (D-05 resolved); fast-follow build if design lands late"],["All pages","Homeroom tiers resolved to $25/$50/$100 (D-01)","Medium","Update all donation CTA copy + Keela product setup to match"],["All builds","Mobile responsive owned by Somesh in sprint (Jul 28 handoff)","High","No separate Dave mobile comps. Build responsive natively; hide/adjust awkward elements after Phase 1 if needed. Aug 10–14 is polish, not first mobile pass."],["Our Impact / Impact (main nav)","Naming overlap: 'Our Impact' (Phase 1, /stories) vs. deferred 'Impact' nav item (/impact, Phase 2)","Medium","Confirm final IA/naming with Kristina before Phase 2 build"]],"decisions":[["ID","Decision","Options","Owner","Status","Blocks","Priority"],["D-01","Homeroom tier amounts","Resolved: $25/$50/$100 (was $5/$25/$100 vs $25/$50/$100). Aug 3: homepage entry copy aligned to $25 (was still saying $5).","Leadership / Finance","Resolved","—","—"],["D-02","Keela checkout URLs","Interim: General Donation Form embed (give-usa) for all regions except India. Per-tier Homeroom hosted links still TBD.","Finance","Partial","Entire conversion path","Critical"],["D-03","/give routing","Gateway at /getinvolved for Homeroom tiers; Join Homeroom interim deep-links to the homepage General Donation Form with the selected amount. Full /give vs /give/monthly split still open. 5 AUG UPDATE — Lorna's Website->Keela->Finance map assumes embedded Keela widgets per stream rather than a redirect gateway, which is the direction already built. That is close to a confirmation but has not been stated as a decision, so this stays Open. Her Stream 3 also proposes Homeroom membership as its OWN widget rather than three per-tier links — if that holds, seams.joinTiers is the wrong model. See HC-078.","Product / Kristina / Lorna","Open","Scope in 2-week sprint","High"],["D-04","School inquiry form destination","Resolved: Google Form + Slack (was Flodesk/Keela/custom). Aug 3 Kristina Miro: keep form for Phase 2 — do not embed on launch; test simple /schools mailto/CTA path first, re-integrate if unused.","Partnerships + Eng","Resolved","—","—"],["D-05","About Us scope v1","Resolved: Single page (was single page vs 5 sub-pages)","Content / Kristina","Resolved","—","—"],["D-06","Event calendar 2026","Confirmed dates and venues","Events team","Open","Events page cards","Medium"],["D-07","Social media URLs","Resolved: included in Dave/Veron's UIUX designs — pull directly from the design files (was: LinkedIn, Instagram, YouTube via Comms)","Design (Dave/Veron)","Resolved","—","—"],["D-08","Legal copy (Privacy + Terms)","Open ticket — under process. 5 AUG UPDATE — /privacy SHIPPED as a deliberate partial (FEAT-071): the cookie half is live and verified, and the page says on itself that the full policy is in review, so no visitor is misled. Still owed by Lorna + Finance/Legal: controller identity, lawful basis, retention, data-subject rights, transfers, complaints — these drop into a marked section in privacy.astro and the cookie half needs no rework. /terms is NOT covered and remains entirely not started (FEAT-074). Does not block Aug 21 Phase 1 hard go-live.","Legal / Ops — Somesh (action item)","Open","Privacy/Terms pages only — not Aug 21 launch","Low"],["D-09","EIN for Homeroom FAQ","Resolved: legal copy already included in Dave's /give UIUX design (was: legal copy on giving page)","Finance","Resolved","—","—"],["D-10","Annual report format","Resolved: PDF for Phase 1 (was Embedded vs PDF vs both)","Leadership","Resolved","—","—"],["D-11","Astro 4.x build","Astro vs static partials","Engineering","Resolved","—","—"],["D-12","Analytics stack","GA4 + Clarity + PostHog","Engineering","Resolved","—","—"],["D-13","Cookie consent","Cookiebot + GA4 Consent Mode v2 + cookieless PostHog. CMP vendor changed Osano -> Cookiebot on 4 Aug 2026 (DECISION-002 amendment) — only the vendor changed, the mechanism did not. Cookiebot runs data-blockingmode='manual' with a CUSTOM banner (sources in docs/cookiebot/), and its own Google Consent Mode feature stays disabled so it cannot race our gtag consent calls.","Somesh Bhardwaj","Resolved","—","—"],["D-14","Transactional email","SendGrid (existing paid plan)","Somesh Bhardwaj","Resolved","—","—"],["D-15","Rate limiting","Upstash Redis (@upstash/ratelimit)","Somesh Bhardwaj","Resolved","—","—"],["D-16","PostHog hosting","PostHog Cloud (app.posthog.com)","Somesh Bhardwaj","Resolved","—","—"],["D-17","Image optimization","Astro Image component","Somesh Bhardwaj","Resolved","—","—"],["D-18","Observability","Hybrid: Slack + Sentry + Vercel logs + PostHog","Somesh Bhardwaj","Resolved","—","—"],["D-19","Newsletter integration","Flodesk embed vs custom API. 2 Aug — Somesh confirmed he has a working Flodesk API key plus the Flodesk MCP server (mcp.flodesk.com/mcp), and the Netlify adapter now allows a server route, so the custom-API path per TECHNICAL-ARCHITECTURE §6.2 is viable. Engineering to close. RESOLVED 4 Aug — custom API path chosen and shipped, but via a HOST-NATIVE function (netlify/functions + api/) rather than an Astro SSR route, so no adapter and no reintroduced SSR attack surface. Flodesk API contract verified against developers.flodesk.com before writing any code (the 31 Jul revert was caused by an unverified contract).","Engineering","Resolved","Newsletter ticket","Medium"],["D-20","Alternative giving methods","Check / stock / crypto / memorial / legacy gifts — leave open for Nav, Kristina, Lorna. May land in Phase 1 or Phase 1.5; not blocking core Aug 21 build unless leadership pulls it in.","Nav / Kristina / Lorna","Open","Get Involved /give completeness if pulled into Phase 1","Medium"],["D-21","Primary logo for Phase 1","Resolved: use existing live-site logo (without three dots). Nav sends SVG via Slack; Dave implements in final pages; Somesh uses same SVG in build.","Nav / Dave / Somesh","Resolved","Final design freeze + favicon/OG","Critical"],["D-22","Phase 1 copy / non-critical design changes","Resolved: copy changes excluded from Phase 1 entirely. Only critical design/compliance red flags accepted before handoff freeze.","Kristina / Nav / WJ","Resolved","—","—"],["D-23","Confirm production framework (call mentioned React)","Resolved: Astro 4.x, full stop — no React anywhere. Somesh signed off directly (in place of the pending Nick sign-off), delegating the technical call to Engineering. Jul 29 audit of Dave's actual 7-page handoff found zero external JS libraries, zero npm/build tooling, zero framework fingerprints — every page is plain HTML/CSS + vanilla inline JS (IIFEs, IntersectionObserver, scroll listeners; no import/require anywhere), the same pattern already used in site/index.html. Nothing in the handoff needs client state or SPA routing, so there's no technical case for React; Astro's static-first model and file-based routing are a direct match and replace the interim seams.js nav pattern.","Somesh (delegated to Engineering)","Resolved","—","—"],["D-24","Events email-capture destination","Flodesk vs Keela vs other — asked of WoeiJing + Kristina in Slack 2 Aug; still Open. /events capture is live to Flodesk in the meantime (segment 'Contentment Festival' for the hero CTA). 5 AUG — BROADENED AND SUPERSEDED IN SCOPE by HC-078: Lorna's map shows this is not an Events-only question. Her Streams 4 and 5 assume EVERY sign-up lands in Keela tagged, receipted and notified, while we route all email capture sitewide to Flodesk. Decide once, sitewide, not per page.","Somesh → WoeiJing + Kristina","Open","Events capture wiring (FEAT-070 related)","High"],["D-25","What Homeroom membership includes (benefits, not price)","Lorna's Decision 1, raised 5 Aug. The PRICE half is already settled — D-01 resolved the tiers to $25/$50/$100 on 27 Jul. What is missing is what a member actually GETS. This is not a marketing question: the benefits determine the tax-deductible portion of the receipt, which determines the Keela designation, which determines how the membership widget is configured. Until it lands, the Homeroom payment path cannot be built or receipted correctly. Lorna's interim proposal is to launch an INTEREST form instead of a payment page. Blocks FEAT-051 and the Homeroom half of FEAT-060.","Kristina / WoeiJing / Lorna","Open","FEAT-051, FEAT-060, HC-071, HC-075","Critical"]],"integrations":[["Integration","Phase","Effort","Can build UI first?","Dependency","Owner","Status","Notes"],["Keela donations","1","0.5-1 day once URLs exist","Yes","Finance — live checkout URLs (needed before Aug 21)","Finance + Somesh","Blocked","5 AUG — reviewed against Lorna's Website->Keela->Finance map (website-keela.netlify.app). LIVE: General Donation Form (give-usa embed MnqZFksL49Ym3M8Ho, org CBbknhqovLi8DNEzW) on the homepage Homeroom band, /why give band and /getinvolved #donate; one master script in BaseLayout; amount + frequency forwarded onto the embed iframe so tier buttons prefill; CSP allows cdn.keela.co + *.keela.co. CONFIRMED GAP: the general widget CANNOT capture campaign designation, so homeroom, event and other designated gifts would land undesignated and receipt with the wrong tax letter — Lorna states this independently in her Stream 2, which turns our suspected gap into a confirmed one. NOT BUILT: campaign designation, per-tier Homeroom products, India region. Button colour is Keela's default #507b91 vs brand #0090bd (dashboard-side fix, HC-070). See HC-078, D-25."],["Newsletter (Flodesk)","1","0.5-2 days","Yes","Flodesk embed or API key","Comms + Somesh","In Progress","4 Aug — LIVE via host-native /api/newsletter (Netlify fn + Vercel fn, shared src/lib/flodesk.js). 11 capture points: home, /about, /why, /updates, /events x4 forms + 4 modal CTAs. Segments env-driven; www.contentment.org + Contentment Festival confirmed. Pending: 3 Upcoming-grid CTAs + /updates + Events top fold (Kristina/WoeiJing); live submit test; rate limiting."],["School discovery form","2","0.5-1 day","Yes","Google Form built + Slack webhook (D-04 resolved)","Partnerships + Somesh","Phase 2","Kristina Miro 3 Aug: hold embed for Phase 2. Form+Slack still exist; /schools ships without iframe — mailto Start a Conversation only."],["Analytics GA4 + Clarity","1","1-1.5 days","Partial","GA4 property ID","Somesh","In Progress","Cookiebot CMP + GA4 Consent Mode v2 (Osano dropped 4 Aug). Credentials landed and verified live 4-5 Aug — GA4 /g/collect 204, Clarity r.clarity.ms 204. Not the Aug 10-14 window any more; this shipped early. See HC-076."],["Cookie consent banner (Cookiebot)","1","0.5-1 day","No","Consent copy (site-wide banner text; /privacy page itself now Phase 2)","Somesh + Legal","In Progress","D-13 / DECISION-002. Osano replaced by Cookiebot 4 Aug 2026. LIVE and verified on contentmentweb2.netlify.app: custom banner (390x155 mobile / 900x90 desktop, vs 374x800 for Cookiebot's stock template), consent bridge flips GA4 gcs G100 -> G111 at HTTP 204. Consent method is EXPLICIT. Remaining: free tier allows ONE domain — must move to www.contentment.org at DNS cutover or the banner silently no-ops; and the cookie declaration needs a rescan, it currently lists only Necessary."],["PostHog","1","0.5-1 day","Yes","PostHog Cloud API key","Somesh","Ready","DECISION-007 — PostHog Cloud, cookieless (persistence: 'memory'). Project is on the US region: https://us.i.posthog.com (the key 404s on EU). DECISION-007 and ARCH 6.1 still say app.posthog.com, which remains an alias onto US — proposed doc correction pending sign-off."],["SEO baseline","1","1 day","Yes","None","Somesh","Open","Meta, OG, sitemap, favicon — Aug 10–14 window"],["SendGrid (transactional email)","1","0.5 day","No","Existing TCF API key","Somesh","Ready","DECISION-003 signed off — reuse paid plan"],["Upstash rate limiting","1","0.5 day","No","Upstash account","Somesh","Ready","DECISION-004 signed off"],["Sentry error monitoring","1","0.5 day","No","SENTRY_DSN","Somesh","In Progress","DECISION-006 hybrid stack. SENTRY_DSN landed 4 Aug and VERIFIED LIVE: an uncaught browser error produced 4x POST to the ingest envelope endpoint, HTTP 200. Note SENTRY_DSN is read via process.env in astro.config.mjs, so a local .env value ships nothing — see ARCH 6."],["Event RSVP API","1.5","1-2 days","Yes","Event dates + Zoom workflow","Events + Somesh","Scheduled","See automation brief"],["Homeroom password gate","2","2-3 days","N/A","Member content brief","Somesh","Phase 2","Not in sprint"],["DNS cutover contentment.org","1","0.5 day","N/A","QA pass + Nav/WJ approval (Aug 10–14)","Somesh","Open","Phase 1 hard go-live Aug 21 — end of Phase 1; next phase TBD"]],"tickets":[["ID","Title","Phase","Priority","Status","Owner","Waiting on","Sprint dates","Depends on","Where it stands","History"],["FEAT-001","Extract shared layout (CSS, nav, footer)","1","Must","Done","Somesh","—","Jul 28","—","CLOSED — all 5 acceptance criteria verified against the build.\n• BaseLayout + Nav + Footer + design tokens shared across every route\n• Google Fonts link intact; prefers-reduced-motion present in 12 built files\n• Homepage renders on BaseLayout","4 Aug · Closed 5/5 after audit against the built output.\n4 Aug · Nav current-page indicator added — aria-current=page + underline (white on transparent header, --btnblue when scrolled).\n30 Jul · Mobile drawer shipped (FEAT-003).\n28 Jul · BaseLayout, Nav, Footer and tokens extracted."],["FEAT-002","Multi-page routing scaffold (Astro)","1","Must","Done","Somesh","—","Jul 28","FEAT-001","CLOSED 5 Aug — the last failing criterion (active nav state) now passes on every route.\n• 10 routes build from src/pages/; Netlify publishes dist/\n• output:'static', no adapter — the 3 Aug security revert stands\n• aria-current=page verified: / and /updates 1 each, six header routes 2 each, /404 correctly 0","5 Aug · GAP CLOSED + COUNT CORRECTED. The 4 Aug audit said aria-current was present on five routes; it was six — /our-impact was miscounted because the check counted grep LINES, not occurrences (minified markup puts header + drawer on one line). Root cause was coverage, not logic: navLinks holds only the six header routes, so '/' (linked by the brand lockup) and '/updates' (linked only from the footer, which had no current-page logic at all) were never tested. Fixed in Nav.astro (brand anchor) + Footer.astro (new trailing-slash-safe isCurrent). Semantics only — no .brand[aria-current] or .foot-col a[aria-current] rule exists, so no visual change shipped.\n4 Aug · AUDIT — not closeable: aria-current=page absent on / and /updates.\n3 Aug · REVERTED to output:'static' with no adapter. No route ever set prerender=false, so hybrid shipped a live SSR function, edge middleware and an /_image endpoint carrying 5 open Dependabot alerts for zero benefit. Static dist/ is file-for-file identical minus _redirects, which netlify.toml already covers.\n2 Aug · Branded /404 shipped (src/pages/404.astro, noindex). Astro switched static -> hybrid with @astrojs/netlify@5.x.\n30 Jul · Netlify preview cut over to publishing dist/.\n28 Jul · All Phase 1 content routes created under src/pages/."],["FEAT-003","Mobile navigation drawer","1","Must","Done","Somesh","—","Jul 30","FEAT-001","CLOSED — slide-in drawer in Nav.astro + nav.js with focus trap, Escape and body scroll lock.\n• Join Homeroom + Donate present in the drawer\n• Drawer links carry aria-current=page + white underline for the active route\n• Behaviour documented in HOMEPAGE-RESPONSIVE-AUDIT.md","4 Aug · Drawer links given aria-current=page and the active-route underline.\n30 Jul · Drawer shipped."],["FEAT-004","Wire all nav and footer links","1","Must","Partial","Somesh","WoeiJing — destination for the 'Spread the movement' homepage door","Jul 29","FEAT-002","Everything on our side is wired. ONE destination remains unknown.\n• LIVE — Sign In, Donate, Join Homeroom, all nav + footer links, Events CTAs, /schools mailto + partner deck, newsletter\n• DEAD — 'Spread the movement' door in DoorCards.astro is still href='#'\n• 'Ways to give' resolved 4 Aug: one-time now goes to /getinvolved#donate","4 Aug · Get Involved slug moved to /getinvolved (was /give); Donate -> /getinvolved#become; seams.join=/getinvolved; giveOneTime -> /#homeroom; Join Homeroom tiers -> /?amount=N&frequency=monthly#homeroom.\n3 Aug · Events RSVP -> #ev-signup interim; /schools mailto + partner deck live.\n29 Jul · Nav and footer links wired from seams."],["FEAT-005","Button / CTA inventory (all destinations)","1","Must","Partial","Kristina -> Somesh","WoeiJing — 'Spread the movement' door · Lorna — per-tier Keela products (HC-030/075) · Kristina — Events RSVP choreography (HC-071/D-24)","Before / during handoff — needed early in sprint","—","CTA wiring is MOSTLY COMPLETE. The Miro inventory stopped being the blocker — Somesh wired the destinations without it.\nVerified against src/config/seams.ts and the built output, exactly THREE destinations remain unwired:\n• 'Spread the movement' door — href='#' — WoeiJing owns the destination\n• seams.joinTiers 25/50/100 — empty — Lorna owes per-tier Keela products\n• seams.rsvp — empty — Events RSVP choreography undecided\nNOT a blocker: seams.schools.discoveryFormUrl is empty DELIBERATELY (Kristina moved the embed to Phase 2).","5 Aug · Re-scoped. Kept open only for the three named items above, not for the inventory as a document.\n4 Aug · Donate -> /#homeroom now lands on the live Keela General Donation Form.\n3 Aug · Somesh wired known destinations ahead of Miro: Sign In, Donate, homepage hero/invite/doors, Give hero -> #become, About Talk-with-Us + share mailto.\n28 Jul · Kristina to supply the Miro CTA inventory by EOW."],["FEAT-010","Migrate homepage to /","1","Must","Done","Dave + Somesh","—","Jul 28–29","FEAT-001, FEAT-002","CLOSED — homepage live on contentmentweb2.netlify.app; Slack review passed 31 Jul (HC-057).\n• Keela General Donation Form live in the Homeroom band\n• Homeroom entry copy at $25/mo per D-01\n• Per-tier Homeroom join still routes through the general form (HC-075)","4 Aug · Keela General Donation Form live in the Homeroom band (FEAT-060 interim). Hero zoom matched Get Involved (global .hero-bg scale 1.06 / 18s) per RF-010.\n3 Aug · CTA wiring — hero -> /why, InviteBand -> /give, doors Schools/Events. Homeroom form/note measure 46ch matching the lead. InviteBand Homeroom entry set to $25/mo (D-01). Priscillah hr-card remains Dave's designed graphic (no text-free asset supplied).\n31 Jul · Slack review passed (HC-057)."],["FEAT-011","Homepage copy audit vs messaging brief","1","Should","Done","Somesh","—","31 Jul","FEAT-010","CLOSED — homepage copy reconciled against MESSAGING-AND-COPY.md.\n• Four Pillars + Homeroom CTA copy aligned\n• D-01 pricing consistent everywhere: $25 entry, $25/$50/$100 tiers","3 Aug · D-01 copy fix — InviteBand + homepage meta $5 -> $25/month (HC-041). Give tiers already $25/$50/$100 Dreamer/Catalyst/Visionary.\n31 Jul · Four Pillars + Homeroom CTA audit."],["FEAT-020","Build /why page","1","Must","In Progress","Somesh","—","Jul 29–30","FEAT-001, FEAT-002","Page is live and QA'd. Remaining work is OURS — 3 of 4 acceptance criteria still unticked.\n• DONE — share CTA (Web Share -> clipboard -> mailto), evidence citations present, video reels fill 9:16, Keela form live in the give band\n• TO DO — first-time-visitor test, evidence-doc citation links, approved-components check","5 Aug · SHARE GAP CLOSED. /why now has the secondary CTA the messaging brief specifies. Three tiers — Web Share -> clipboard copy -> mailto — so the acceptance wording 'copy-link fallback' is literally met (/about only fires native_share/email). Analytics contract matches /about: content_shared {method, source:'why_page'}. shareUrl matches the page's own canonical including trailing slash.\n4 Aug · AUDIT — not closeable: acceptance requires a share affordance and /why had none. Citations (Harvard/86%/Bhutan/Hawaii) confirmed present. Hero zoom matched Get Involved per RF-010. Keela General Donation Form live in the give band.\n3 Aug · Teacher reels (.vframe.vert) iframes fill 9:16 — absolute-fill CSS was missing from the Dave handoff. Donate form measure matched to head copy (52ch).\n1 Aug · Video lightbox sizing fixed (RF-008 pattern).\n31 Jul · RF-006 QA pass.\n29 Jul · Ported to src/pages/why.astro."],["FEAT-030","Our Impact page data model + JSON","1","Must","Blocked","Somesh","Comms / Programs — story photos + subject permissions","Jul 31","—","HARD STOP. No story content can be modelled until photos and permissions arrive.\n• The schema and index chrome are built and QA'd — only the content is missing\n• Directly blocks FEAT-031 (index renders 0 cards) and FEAT-032","31 Jul · Opened. Renamed from 'Stories' per Kristina. Comms owe photos + permissions."],["FEAT-031","Build Our Impact index (/our-impact)","1","Must","Blocked","Somesh","Comms / Programs — story photos + permissions, via FEAT-030","Jul 31 · Aug 3–4","FEAT-002, FEAT-030","Index chrome is BUILT and QA'd. The page renders ZERO story cards because the content is blocked.\n• Acceptance requires 'all published stories render as cards' — cannot pass until FEAT-030 clears\n• Acceptance criteria still describe the old /stories scope and need rewording\n• Annual Report PDFs also still owed (HC-074, Somesh)","4 Aug · AUDIT — not closeable; re-classified Blocked 5 Aug because the remaining work is not ours.\n1 Aug · RF-008 (Kristina) fixed — video lightbox played in a tiny frame; the iframe missed Astro's scoped CSS sizing because it is injected via JS. Fixed with an inline style.\n31 Jul · RF-006 QA pass, 320–1280 clean, no code fixes.\n29 Jul · Ported to src/pages/our-impact/index.astro."],["FEAT-032","Individual story pages /stories/[slug]","1.5","Should","Blocked","Somesh","Comms / Programs — story content, via FEAT-030","Aug 7","FEAT-031","Not started, and cannot start — there is no story content to template.\n• Follows FEAT-031; page family renamed 'Our Impact'","5 Aug · Re-classified Scheduled -> Blocked: the dependency is content owned by Comms, not sequencing on our side."],["FEAT-033","Foundation Reach Map (/foundation-reach-map)","2","Nice","Paused","Somesh","—","—","FEAT-031","Phase 2. Working prototype, publicly reachable on the preview, design work PAUSED by choice.\n• public/foundation-reach-map.html -> /foundation-reach-map (netlify.toml 200 rewrite)\n• Flat D3 + topojson-client, assets/countries-110m.js, program-data.js\n• Desktop: hanging pendulum pin cards. Mobile: 18px balloon pins scaling with zoom; crowded pins open a bottom-sheet picker\n• NEEDS TEAM REVIEW — never went through Kristina's page list\n• Notes: prototypes/phase-2/world-map/README.md","5 Aug · Retitled from 'Interactive global map' to name the actual route, and given an explicit purpose statement — it was previously impossible to tell from the ticket that a live URL existed.\n4 Aug · Recorded as publicly reachable on the preview even though design work is paused."],["FEAT-034","Story Board prototype (/story-board)","2","Nice","Paused","Somesh","—","—","FEAT-031","Phase 2. Working prototype, publicly reachable on the preview, design work PAUSED by choice.\n• public/story-board.html -> /story-board (netlify.toml 200 rewrite); feed guide at /story-board-feed-guide\n• PURPOSE — a feed-style way to browse programme stories, built to test the format before committing homepage space to it\n• Shares program-data.js with the Reach Map\n• a11y gaps already fixed under QA-001\n• NEEDS TEAM REVIEW — never went through Kristina's page list","5 Aug · Ticket created retrospectively. The route was live on the preview and listed in the pages table but had NO ticket row, so it was invisible to anyone tracking work on the Tickets tab — the same gap FEAT-072/073 closed for /404 and /updates."],["FEAT-040","Build /schools page","1","Must","Partial","Somesh","Kristina — proof-point copy (renewal rates, Harvard, five-step model)","Aug 4–5","FEAT-002","Page is built, QA'd and live. One acceptance criterion fails on CONTENT we do not own.\n• DONE — tier overview (Educator/School/Network), partner deck wired, #start mailto, pricing titles enlarged, wellbeing-lead photo replaced\n• MISSING — the proof points acceptance requires (renewal rates, Harvard, five-step model) do not appear anywhere on the page\n• 'Program rollout' language correctly absent\n• Google Form embed deliberately deferred to Phase 2 (FEAT-041)","4 Aug · AUDIT — not closeable: content gap needs Kristina/messaging. Wellbeing-lead conversation photo replaced at public/assets/fs-Jadielsm.jpg (same filename, no src change). Hero zoom matched Get Involved per RF-010.\n3 Aug · Partner deck Drive URL wired (hero + close). Google Form embed deferred to Phase 2 per Kristina's Miro. Pricing .col-name to 1.4rem.\n31 Jul · RF-006 QA pass.\n29 Jul · Ported."],["FEAT-041","School discovery form","2","Should","Scheduled","Somesh","—","Phase 2","FEAT-040","Built, then deliberately shelved to Phase 2 — not a blocker.\n• Google Form + Slack integration is BUILT and was embedded\n• Embed commented out in schools.astro; discoveryFormUrl cleared (URL retained in a seams comment)\n• Launch CTA is the #start mailto","3 Aug · Kristina's Miro put the embed on hold for Phase 2 — test the simple /schools page first, re-integrate if people do not use the form.\n31 Jul · Google Form + Slack built and embedded."],["FEAT-050","Build /getinvolved gateway","1","Must","Partial","Somesh","WoeiJing + Kristina — Meet Jose / Homeroom video cut · Lorna — D-03 monthly-split routing","Jul 30–31","FEAT-002","Page is live at /getinvolved (/give 301s to it). Two items are held on other people.\n• DONE — hero Join Homeroom -> #become, donate split fold #donate (photo + Keela form on blue), one-time -> #donate, tiers deep-link to the homepage form with amount + frequency\n• HELD — Meet Jose / Homeroom video cut, pending WoeiJing + Kristina (RF-010)\n• OPEN — D-03 /give vs /give/monthly split; seams.joinTiers still empty","4 Aug · Donate split fold #donate added (photo left / Keela form on blue, asset gi-donate-photo.jpg). 'Prefer to give differently' one-time -> #donate. Join Homeroom tiers deep-link to the homepage Keela form via seams.homeroomDonateUrl. seams.join=/getinvolved. Hero zoom is the reference model for the other pages; Meet Jose video cut HELD per RF-010.\n31 Jul · RF-006 QA pass.\n30 Jul · Ported; route later renamed /give -> /getinvolved with a 301."],["FEAT-051","Build /give/monthly Homeroom page","1","Must","Blocked","Somesh","Lorna — per-tier Homeroom Keela products (HC-030/HC-075) · Kristina/Lorna — D-03 routing","Jul 30–31","FEAT-050, FEAT-060","HARD STOP. No separate route can be built until the Keela product shape and the routing decision land.\n• Homeroom UI currently lives on /getinvolved; there is no /give/monthly route\n• The General Donation Form does NOT close this ticket — it is a general/one-time path\n• Lorna's 5 Aug map proposes a SEPARATE membership widget rather than per-tier checkout URLs — see HC-078; this may change the ticket's shape","5 Aug · Flagged against Lorna's Website->Keela->Finance map: her Stream 3 treats Homeroom membership as its own Keela widget, not as three hosted checkout links. If that holds, seams.joinTiers is the wrong model and this ticket needs re-specifying.\n4 Aug · Still blocked on per-tier Homeroom Keela (HC-075 remainder) + D-03 routing."],["FEAT-060","Keela donation integration","1","Must","Partial","Somesh","Lorna — campaign-designation mechanism + per-tier Homeroom products (HC-030/075/078)","Aug 14–16","—","The general donation path is LIVE sitewide. Designated giving is not, and cannot be built until Lorna decides the mechanism.\n• LIVE — Keela General Donation Form (give-usa embed MnqZFksL49Ym3M8Ho, org CBbknhqovLi8DNEzW) on / Homeroom, /why give band and /getinvolved #donate; one master script in BaseLayout; CSP allows cdn.keela.co + *.keela.co\n• LIVE — KeelaDonateForm forwards amount + frequency onto the embed iframe, so tier buttons prefill\n• NOT BUILT — campaign designation. Lorna's 5 Aug map confirms the general widget CANNOT capture it as built, so homeroom/event/other gifts will land undesignated\n• NOT BUILT — per-tier Homeroom products; India region deferred\n• OPEN — Keela Donate button colour is #507b91 (default) vs brand #0090bd; fix lives in the Keela dashboard (HC-070)","5 Aug · Lorna's map reviewed. Her Stream 2 states the current widget cannot capture campaign designation — this matches our build and turns a suspected gap into a confirmed one. Awaiting her decision on whether designation comes via extra widgets or URL parameters before any code changes.\n4 Aug · General Donation Form wired sitewide; seams.keela records orgId + form; Donate -> /#homeroom. Same embed reused on /getinvolved #donate (no second form ID). joinTiers still preferred when set."],["FEAT-070","Newsletter integration (Flodesk)","1","Must","In Progress","Somesh","Kristina + WoeiJing — segment for /updates, /events top fold and the 3 Upcoming-grid CTAs (does not block; interim default is set)","Aug 13–14","FEAT-010","SHIPPED and live. Remaining work to close is OURS.\n• LIVE — 11 capture points across home, /about, /why, /updates, /events; honeypot + inline aria-live success/error; 4 Events link-CTAs share one CaptureModal\n• ARCHITECTURE — host-native function, NOT an Astro SSR route: netlify/functions/newsletter.mjs (preview) + api/newsletter.js (Vercel) over one shared core src/lib/flodesk.js. astro.config.mjs stays output:'static', so the 3 Aug security revert is untouched and FEAT-101 is no longer a blocker\n• Double opt-in ON and explicit (FLODESK_DOUBLE_OPTIN=true); success copy says 'check your inbox to confirm'; optin_ip + optin_timestamp sent as the EU/US consent trail\n• TO DO (ours) — live end-to-end submit test, rate limiting (UPSTASH_* unset), Vercel-side verification at cutover","5 Aug · Flagged against Lorna's map: her Stream 4/5 assume every sign-up lands in KEELA, while D-19/D-24 routed capture to FLODESK. That architectural split is now tracked as HC-078 and is the single biggest open question between the two plans.\n4 Aug · /updates segment CONFIRMED 'www.contentment.org'. Double opt-in verified ON in the Flodesk account and set explicitly — leaving it unset would have shown 'You're in' while a confirmation click was still pending. newsletter_submit now fires on a CONFIRMED subscribe, not on click. Segment assignments follow Kristina's Miro CTA suggestions: 8 to 'www.contentment.org', /events hero Save-my-free-spot to 'Contentment Festival'.\n4 Aug · SHIPPED. Flodesk contract verified against developers.flodesk.com (Basic auth base64('KEY:'); POST /v1/subscribers then POST /v1/subscribers/{email}/segments). FLODESK_API_KEY server-only; segment IDs from env via SEGMENT_ENV_BY_SOURCE, never hardcoded. netlify.toml rewrites /api/newsletter so both hosts share one public path."],["FEAT-071","Privacy & cookies page (/privacy)","1 + 2","Should","Done","Somesh","Lorna + Finance/Legal — the legal text half (D-08), which drops into a marked section","5 Aug","FEAT-002","SHIPPED 5 Aug — live at /privacy. Counted in BOTH Phase 1 and Phase 2 by Somesh's call.\n• WHY PHASE 1 — a page declaring our cookies and analytics is a compliance requirement in the regions we serve; shipping analytics without one is real exposure, not a nice-to-have\n• WHY PHASE 2 — it will keep evolving through review by Kristina, Lorna and Nav\n• DONE MEANS the cookie half: live Cookiebot declaration (Necessary 4 / Statistics 11 / Marketing 7 after the 5 Aug rescan), a working Cookie Preferences trigger, per-tool disclosures for GA4/Clarity/PostHog/Sentry/Cookiebot, and the regional compliance table from DECISION-002\n• DONE DOES NOT MEAN complete: controller identity, lawful basis, retention, data-subject rights, transfers and complaints are still owed under D-08. The page carries an on-page notice that the full policy is in review, so no visitor is misled\n• /terms is NOT covered here — split out as FEAT-074 on 5 Aug","5 Aug · Terms split out to its own ticket (FEAT-074). Leaving /terms inside a ticket marked Done would have read as though Terms had shipped.\n5 Aug · SHIPPED. Fixes two real defects: the consent banner linked to a 404, and Cookiebot's standard copy promised withdrawal 'from the Cookie Declaration on our website' when neither the declaration nor any withdrawal path existed."],["FEAT-072","Branded 404 page (/404)","1","Should","Done","Somesh","Kristina — team review of copy + destination cards (post-ship, not blocking)","2 Aug","FEAT-002","SHIPPED 2 Aug — src/pages/404.astro.\n• 'noindex, follow'; short brand-gradient hero + 6 destination cards; reuses existing tokens and .anim (no new design language)\n• Netlify serves dist/404.html automatically; verified in-browser at 1280 and 390px\n• NEEDS TEAM REVIEW — the 6 destination cards and the copy never went through Kristina's page list","5 Aug · Ticket created retrospectively. The page shipped with no ticket row, so it lived only in the Reference tab's pages table and was invisible to anyone tracking work on the Tickets tab."],["FEAT-073","Newsletter signup page (/updates)","1","Should","Done","Somesh","Kristina — team review of copy + framing (post-ship, not blocking)","31 Jul","FEAT-002, FEAT-070","SHIPPED 31 Jul — src/pages/updates.astro.\n• PURPOSE — the standalone destination for subscribe links that need a real page rather than an inline form (Footer Explore column, sitemap)\n• Form wired to Flodesk 4 Aug via <NewsletterForm source=\"updates_page\" bare />; segment confirmed 'www.contentment.org'\n• NEEDS TEAM REVIEW — built without reaching Kristina's page list, so its copy and framing have had no non-engineering review","5 Aug · Ticket created retrospectively, same reason as FEAT-072 — the page had no Tickets-tab row.\n4 Aug · Form wired to Flodesk; segment confirmed."],["FEAT-074","Terms of Use page (/terms)","1.5","Should","Blocked","Somesh","Lorna + Finance/Legal — the entire terms text (D-08)","Phase 1.5 or 2 — TBD","FEAT-002","NOT STARTED and cannot start — there is no draft text to build from.\n• Unlike /privacy, there is no half we can ship on our own: /privacy had a live Cookiebot declaration to stand on, /terms has no equivalent\n• Does NOT block the Aug 21 Phase 1 go-live (D-08 confirmed Low priority)\n• Build effort once copy lands is ~1 hour — the /privacy branded utility pattern is already built and reusable","5 Aug · Split out of FEAT-071. FEAT-071 was titled 'Privacy & cookies page — and Terms' and was marked Done when /privacy shipped, which made it look as though /terms had shipped too. Terms now has its own row so its true state (not started, blocked on legal copy) is visible on the Tickets tab."],["FEAT-080","Analytics (GA4, Clarity, PostHog Cloud, Cookiebot CMP, Sentry)","1","Must","Done","Somesh","—","Aug 10–12","FEAT-002","CLOSED 7/7 — every tool live and verified on the wire, ahead of its Aug 10–14 window.\n• GA4 /g/collect 204 (en=page_view) with the real tag G-0GBRRW2MCL · Clarity r.clarity.ms/collect 204 · Sentry envelope 200 · Cookiebot consent bridge flips gcs G100 -> G111 and gcd 13p3p3p3p5l1 -> 13r3r3r3r5l1\n• 8-event conversion contract; each tool behind its own env var\n• PostHog VERIFIED 6 Aug — it was never broken. Key valid, host correct, array.js serving, capture_pageview on (PostHog default; we never set it)\n• AT CUTOVER (tracked on HC-067) — move Cookiebot's single registered domain to www.contentment.org, or the banner silently no-ops","6 Aug · POSTHOG ROOT CAUSE FOUND — it is a MEASUREMENT artefact, not a defect. Three delays compound so the first capture lands seconds after navigation, long after GA4/Clarity: (1) array.js is 242 KB loaded async from a DIFFERENT host (us-assets.i.posthog.com) than the config host; (2) init is queued in the loader stub and only replayed once array.js parses; (3) request_batching is ON by default, so the $pageview is queued and flushed on a timer rather than sent inline. GA4 /g/collect and Clarity fire near-immediately, so any check using a short wait or networkidle catches those two and misses PostHog. Somesh's dashboard data is real — actual visitors stay long enough for the flush. Verified directly: flags endpoint HTTP 200 with the live key, array.js HTTP 200 / 241,994 bytes, request_batching:!0 and the memory-persistence branch both confirmed in the shipped library. NO CODE CHANGE NEEDED. Correct way to verify in future: wait 5s+ after load, or watch for the POST to us.i.posthog.com/i/v0/e/ — do not assert on networkidle.\n6 Aug · SEPARATE FINDING, and the one that actually matters — persistence:'memory' means distinct_id lives only for the PAGE LOAD. Every page view is a new anonymous user. So PostHog unique-user counts run ~= pageviews, sessions do not persist across navigation, and MULTI-PAGE FUNNELS CANNOT STITCH — 'how many people went from /why to /getinvolved' is not answerable as configured. This is the deliberate price of DECISION-002/007 (cookieless, therefore no consent gate needed), NOT a bug — but it was never written down, so read PostHog as page-level aggregates rather than user journeys. Changing it means localStorage, which breaks the cookieless guarantee and would then require consent gating: a team decision, not a code fix. See DECISION-007 amendment.\n5 Aug · Custom Cookiebot banner live; sources version-controlled in docs/cookiebot/ rather than living only in the vendor dashboard. Consent Mode signal set completed. Cookiebot rescan run.\n4 Aug · CLOSED 7/7; all 5 HC-076 credentials landed. CMP swapped Osano -> Cookiebot in manual blocking mode (auto would rewrite tracker scripts to text/plain, risking our own gtag consent default and blocking cookieless PostHog). PostHog loader stub rewritten to PostHog's official shape (__SV + _i) — persistence is now genuinely 'memory'. CSP updated byte-identically in netlify.toml AND vercel.json.\n3 Aug · PostHog wizard PR #1 triaged: kept its 6 conversion events + CSP; reverted its cookie-setting init, env rename and unused dep, which broke DECISION-002/007.\n31 Jul · Analytics.astro scaffolded; Sentry via @sentry/astro; cta_homeroom_click + newsletter_submit wired."],["FEAT-081","SEO baseline","1","Should","Done","Somesh","—","31 Jul","FEAT-002","CLOSED — per-page title/description/OG/JSON-LD plus robots.txt, sitemap.xml, llms.txt and favicon.svg all shipped.\n• sitemap.xml must be updated whenever a public route is added or renamed","31 Jul · Shipped."],["FEAT-090","Events page","1","Must","Blocked","Somesh","Dave — second round of team review notes (HC-072); design is not locked","Aug 6–7","FEAT-002","HARD STOP on production build. Dave's own handoff notes flag that a second page of team review notes has not been delivered.\n• The current build must be treated as REVIEW-ONLY, not production-final\n• Interim CTA wiring is in place: Save my spot / RSVP / waitlist -> #ev-signup email capture until seams.rsvp lands; hero Save-my-free-spot opens the Flodesk CaptureModal\n• Join Homeroom / Unlock still route to Get Involved\n• Lorna's 5 Aug map adds a NEW requirement this ticket does not yet cover: a November online-event waitlist page (HC-079)","5 Aug · Re-classified In Progress -> Blocked. The remaining work is Dave's notes round, not ours, and the page should not be built to production without it.\n3 Aug · Save my free spot / RSVP / waitlist no longer use seams.join -> /give. Interim destination #ev-signup until seams.rsvp."],["FEAT-091","Homeroom gated member hub (/homeroom)","2","Nice","Scheduled","Somesh","—","—","FEAT-060, FEAT-092","Phase 2. Password-gated, not in public nav. Not started.","—"],["FEAT-092","Homeroom access middleware (edge + password)","2","Nice","Scheduled","Somesh","—","—","Edge function hosting","Phase 2. Depends on edge-function hosting, which the current output:'static' build deliberately does not use.","—"],["FEAT-093","About Us page (v1 single page)","1","Must","Partial","Somesh / Veron","Dave — line-by-line roster sign-off before public deploy","Aug 7 or fast-follow","FEAT-002","Page is built, QA'd and live on the preview. It should NOT go public until the roster is signed off.\n• DONE — hero, Dan caption, Talk-with-Us mailto visible, share/mailto hardened, newsletter capture wired\n• HELD — roster sign-off owed by Dave; naming real people wrongly on a public site is not a risk worth taking\n• PENDING — hi-res hero swap still owed by Dave","3 Aug · Hero uses about-hero-team-bali-july2025.jpg (same bytes as the prior ab-hero-bali5; hi-res swap still pending Dave). Caption 'Dan in Bhutan, 2014'. Talk with Us shows mailto + hello@contentment.org. Email-this-to-someone share/mailto hardened.\n31 Jul · RF-006 QA pass.\n29 Jul · about.astro built from about-deploy-rev4."],["FEAT-094","Campaign page template (/festival/2026)","2","Nice","Scheduled","Somesh","Events — campaign brief","—","FEAT-080","Phase 2. Linked from Events; needs a campaign brief before any build.","—"],["FEAT-095","Press & Media page (/press)","2","Nice","Scheduled","Somesh","Comms — press assets, boilerplate and contact","—","FEAT-002","Phase 2, not started. Footer / outreach destination.\n• Listed in the pages table since the start but had no ticket row until 5 Aug","5 Aug · Ticket created so every route in the pages table has a Tickets-tab row."],["FEAT-096","Impact naming — resolved to /our-impact (no separate /impact page)","2","Nice","Done","Somesh","—","5 Aug","FEAT-031","CLOSED 5 Aug — the naming overlap is settled by Somesh: /our-impact IS the impact page, it is live, and it is already the route in use.\n• NO separate /impact page will be built — the Phase 2 nav item is superseded, not deferred\n• No redirect needed: /impact has never existed as a route (verified — no reference in src/, sitemap.xml, netlify.toml or vercel.json), so there is nothing to redirect from\n• Ongoing work on the page itself lives on FEAT-031 (index) and FEAT-030 (story content)","5 Aug · Resolved and closed the same day it was raised. The ticket existed for one reason — to give the /impact vs /our-impact overlap an owner — and Somesh confirmed the answer is /our-impact, already in use. Recording it as Done rather than deleting the row so the decision is visible on the Sheet instead of vanishing.\n5 Aug · Ticket created. The clash was noted in the pages table on 27 Jul but never became a tracked item, so nobody owned resolving it."],["FEAT-100","Pre-launch QA","1","Must","In Progress","Somesh","—","Aug 13–14","All must-haves","Audit defects FIXED, and the payload half of the perf work is done too. What is left needs Dave or a manual pass.\nDONE 6 Aug (a11y):\n• main landmark + skip link on all 10 routes; keyboard trap discharged on all 3 lightbox pages; /events tablist made real; last white-on-mint contrast fixed\nDONE 6 Aug (perf, all ours, no dependency):\n• 2,187 KB of inline base64 images extracted to 16 real files. /schools HTML went ~1.5 MB to 49 KB. Now cacheable and downloaded in parallel instead of blocking the document\n• 98 of 98 images on Astro routes now carry intrinsic width/height, paired with height:auto in global.css so nothing squashes. This is the main CLS source closed\n• Google Fonts no longer render-blocking (media=print swap + noscript fallback)\n• Keela CSS/JS now opt-in per page: was loading on all 10 routes, only 3 mount an embed. 7 routes lost a render-blocking third-party stylesheet\nSTILL OPEN:\n• Optimised source exports - WebP, heroes at used dimensions, compression. Needs Dave\n• Manual screen-reader pass and text-over-image contrast\n• Keela live transaction test - needs HC-075\n• Re-run Lighthouse to confirm the >= 85 gate is met","6 Aug · PERF PASS - payload and layout-shift half done, and it was almost entirely ours rather than Dave's, which is why it was worth measuring before assuming. Four changes. (1) 2,187 KB of base64 JPEGs were inlined in schools.astro and getinvolved.astro from the handoff; extracted to 16 files in public/assets, deduped by content hash against existing assets. (2) Every image now carries width/height - 104 of 104 lacked them. Critical detail: global.css set max-width:100% but NOT height:auto, so adding the attributes alone would have squashed every image whose container is narrower than its intrinsic width. Added height:auto in the same pass; checked first that the rules genuinely wanting fixed heights (.brand img, .pface img, .circ img, .door .ph img) are all more specific and still win. (3) Google Fonts moved off the critical path - display=swap was already set but that governs the font once the CSS arrives, not the blocking round-trip to fetch it. Confirmed CSP allows the inline onload before shipping it, since script-src without unsafe-inline would have left media stuck at print and fonts never loading. (4) Keela made opt-in: verified from the built output that exactly 3 of 10 routes mount an embed, so 7 were paying a render-blocking third-party stylesheet for nothing.\n6 Aug · A11Y DEFECTS CLEARED. Two things worth recording. (1) The audit named /schools as the keyboard trap, but the same window-scoped Escape handler was on /why and /our-impact too — fixing only the page that got audited would have left two-thirds of the bug in place. Fixed once in src/scripts/lightbox-a11y.js and wired into all three. (2) The fix could not be a keydown handler at all: YouTube is a CROSS-ORIGIN iframe, so the parent document receives no key events from inside it. It needed focus management — focus the Close button on open, plus focus sentinels bookending the dialog, because a sentinel's focus event DOES fire in the parent document even when keydown does not. Verified in the build: zero window-scoped Escape handlers left on the three pages, and the shared chunk loads on exactly those three routes and nowhere else.\n6 Aug · /events filters were worse than the audit said. The finding was 'role=tablist with aria-selected on plain buttons and no arrow keys'. In fact the chips had NO click handler at all — they were dead controls that looked clickable and announced as tabs. The card taxonomy (data-access / data-format) was already in the markup, so the behaviour was wired rather than the promise removed: roving tabindex, Arrow/Home/End, aria-selected maintained, hidden cards get the hidden attribute so filtered-away events leave the tab order, and a role=status region announces the count.\n2 Aug · AUDIT DONE — docs/planning/PRE-LAUNCH-QA-AUDIT.md, axe-core 4.12.1 + Lighthouse 13.4.1 over 8 routes x desktop/mobile."],["FEAT-101","Production deploy + DNS cutover","1","Must","Scheduled","Somesh","—","Aug 21","FEAT-100","Scheduled for the Aug 21 hard go-live. Prep is done; execution is date-gated, not blocked.\n• vercel.json + netlify.toml CSP already byte-identical and cutover-ready (OPS-001/002)\n• AT CUTOVER — move Cookiebot's registered domain to www.contentment.org or the banner silently no-ops (free tier = 1 domain)\n• AT CUTOVER — unpublish the internal docs hub: see FEAT-102 / HC-077\n• NOTE — Lorna's 5 Aug map states a launch date of Sun 8/17, four days earlier than the Aug 21 in this plan. Unreconciled — see HC-080","5 Aug · Re-classified Open -> Scheduled: nothing is undecided, the date is simply in the future.\n4 Aug · HC-077 logged — unpublish internal project docs at cutover."],["FEAT-102","Internal docs hub (/docs) — publish now, unpublish at cutover","1","Should","In Progress","Somesh","—","Through cutover","FEAT-101","Live on the Netlify preview by design; must NOT be publicly reachable on contentment.org.\n• scripts/copy-docs.sh copies docs/*.html -> public/docs (and site/docs) at build time; both generated dirs are gitignored\n• Reachable today at /docs on the preview, and linked from the Footer as 'Project docs'\n• AT CUTOVER (HC-077) — remove the Footer link, skip copy-docs.sh on the production build, 404 /docs*, keep docs/ in the private repo only\n• Pairs with SECURITY-AND-ACCESS §8 and TECHNICAL-ARCHITECTURE §12 step 3b","5 Aug · Ticket created. /docs is a publicly reachable route with no ticket row — the same visibility gap that FEAT-072/073 closed for /404 and /updates, and it carries a real security action at cutover that lived only in a checklist item."],["OPS-001","Security headers in netlify.toml (interim env)","1","Must","Done","Somesh","—","—","—","CLOSED — interim Netlify security headers ahead of the Vercel cutover (TECHNICAL-ARCHITECTURE §9).\n• netlify.toml previously had NO CSP at all while vercel.json did, so the live host was the unprotected one\n• Policy now identical across both files","3 Aug · CSP added to netlify.toml and matched to vercel.json."],["OPS-002","vercel.json from TECHNICAL-ARCHITECTURE §9 spec","1","Must","Done","Somesh","—","—","—","CLOSED — Vercel security headers config, ready for the production cutover (FEAT-101).\n• Kept byte-identical to netlify.toml so the policy cannot drift between hosts\n• Verified live: no CSP violations on / or /privacy","4 Aug · cmp.osano.com REPLACED in both files by consent.cookiebot.com (script + style) and consentcdn.cookiebot.com (script, connect AND frame). Cookiebot renders its banner in an iframe, which Osano never required — without the frame-src entry the banner would have been CSP-blocked outright.\n3 Aug · CSP rewritten from a dist/ origin inventory: added YouTube frame-src (it would have blanked every video embed at cutover), Clarity connect, jsdelivr (map/story-board prototypes), GA4 regional ingest, Sentry ingest, form-action. Dropped plausible.io, which DECISION-001 never chose."],["OPS-003","CI step — auto-regenerate contentment-home.html on push","1","Should","Done","Somesh","—","—","—","CLOSED — keeps the portable single-file build in sync with site/index.html without a manual step.","—"],["OPS-004","Generate both timeline briefs from launch-plan-data.json","1","Should","Done","Somesh","—","5 Aug","—","CLOSED 5 Aug — scripts/refresh-timelines.py. The timelines were the only team-facing artefact not downstream of the JSON, so they could only drift, and did.\n• ID-keyed in-place rewrite, NOT template regeneration — both files stay hand-authored designs; the script rewrites only the 25 status spans, their note cells and the 'As of' stamp\n• Guards all fail-closed: slot counts, reflow tripwire, single 'As of' stamp, unknown ticket id or status is a hard error, <10% size delta, stale-pin detection, and a post-condition that re-runs the slot regex on the output\n• --check exits 1 when stale, so it works as a pre-commit gate\n• KNOWN LIMIT — 11 JSON tickets have no timeline slot and are reported as orphans on every run; slots live in hand-authored phase containers the JSON cannot map to","5 Aug · Ticket created retrospectively — the script shipped and is referenced in TRACKER, but had no Tickets-tab row.\n5 Aug · Shipped. Root cause it closes: the 4 Aug rule already REQUIRED timeline updates and twelve consecutive commits skipped them anyway. Moving it from a checklist item a human must remember to a script step is the only thing that changed the outcome."],["QA-001","Story Board a11y gaps (dialog focus trap, aria-pressed, live region)","1","Should","Done","Somesh","—","—","—","CLOSED — fixed in the Story Board prototype ahead of the Astro migration. Tracked under FEAT-034 from 5 Aug.","5 Aug · Cross-referenced to the new FEAT-034 Story Board ticket."]],"externalBlockers":[["Blocker","Waiting on","Gates","Needed by","Impact if delayed"],["Design handoff (all pages)","Dave (logo + critical flags) → Somesh","Jul 28","Done — UIUX–Dev handoff call Jul 28 (actual Day 0)","Sprint starts on homepage once assets land; logo SVG blocks Dave finalize"],["Button / CTA inventory (remaining)","Kristina (Miro) + WJ (Spread the movement door)","FEAT-004, FEAT-005, analytics event wiring","Aug 3 asked (Slack 2 Aug) — still Open","Aug 3 — known CTAs wired ahead of Miro (Sign In→school.contentment.org; Donate→/#homeroom (Keela General Donation Form, Aug 4); homepage hero/invite/doors Schools+Events; Give hero→#become; About mailto/share). Still waiting: full page-by-page Miro inventory (Kristina); homepage Spread-the-movement destination (WJ); analytics event map once inventory lands. Keela checkout/join remain HC-075/071."],["Homepage door — Spread the movement destination","WJ (WoeiJing)","FEAT-004 / FEAT-005 (third door card)","Open — flagged Aug 3","Card CTA stays href=# until WJ finalises destination (share flow / social / other)."],["Live Keela checkout URLs","Lorna (Finance)","FEAT-060, FEAT-051","Partial — Aug 4","5 AUG — reframed by Lorna's map. We asked for three hosted checkout URLs; her Stream 3 proposes a separate MEMBERSHIP WIDGET instead. Those are different integrations — three links in seams.joinTiers versus a second embed with its own configuration — so this cannot be answered as 'send the URLs'. Blocks FEAT-051. See HC-078, HC-075, D-25."],["Story photos + permissions","Comms / Programs","FEAT-030","Aug 3","Our Impact page ships with draft copy only"],["Keela widget confirmation (/give routing, D-03)","Lorna / Finance","FEAT-050","Aug 5 (before /give build finalized)","General form widget live on / + /why. /give Homeroom tier routing still open. Aug 4 update."],["Event calendar dates","Events","FEAT-090","Aug 6","TBC labels on event cards"],["About Us copy/design","Content + Veron","FEAT-093","Aug 7 (or fast-follow)","Confirmed Phase 1 (Kristina); design still in progress — fast-follow after sprint if late, doesn't block go-live"],["Nav + WJ final approval","Nav, WJ","FEAT-101","Aug 14 (pre Aug 21 hard go-live)","DNS cutover cannot proceed without sign-off"],["Logo SVG (live-site wordmark, no three dots)","Nav → Slack","Dave final pages + Somesh build branding","Immediate (Jul 28)","Dave cannot finalize pages; build uses wrong mark if delayed"],["Critical-only page review notes","WJ + Nav (Slack #website) → Kristina collate → Dave","Dave final rework before zip","Flags ~1hr post-call; Kristina list EOD Jul 28; Dave applies Jul 29 AM","Handoff package slips a day if list late"],["Events page — second round of team notes","Dave","FEAT-090 production build","Aug 3 (asked in Slack 2 Aug)","Current events-build is review-only; building to production early risks rework once notes land"],["About Us roster sign-off (line-by-line)","Dave","FEAT-093 close-out","Aug 3 (asked in Slack 2 Aug)","/about cannot be marked final; page is otherwise built and QA'd"],["Keela / Homeroom join-flow choreography","Lorna / Kristina","FEAT-051, FEAT-060, Events gated-CTA wiring","Before those CTAs can be wired and tested","Aug 4 — Donate chrome → /#homeroom (General Donation Form live). Events RSVP + Get Involved Join Homeroom / joinTiers still empty until join-flow decided."],["Where sign-ups land — Keela or Flodesk (sitewide)","Kristina + Lorna + WoeiJing","Events capture, waitlist, /updates, and any Keela tagging/receipting of non-donors","Lorna's map asks for decisions by Fri 8/7","Addresses keep accumulating in Flodesk that may later need exporting, deduping and re-tagging into Keela by hand — the exact cleanup Lorna's map warns is exponentially more work after the fact. HC-078."],["What Homeroom membership includes (benefits)","Kristina + WoeiJing + Lorna","Homeroom payment page, membership widget config, tax-deductible portion of the receipt","Lorna's map asks for decisions by Fri 8/7","Homeroom cannot launch with payment. Lorna's fallback is an interest form instead of a payment page. Price is NOT the blocker — D-01 settled $25/$50/$100 on 27 Jul. D-25."],["November online event — waitlist page + routing","Kristina + Ni Luh (Cika)","A dedicated waitlist page, waitlist tagging, post-waitlist sequence, conversion path to registration","Lorna's map asks for decisions by Fri 8/7","No waitlist page exists in the build and it is not in the Phase 1 page list. Lorna and Cika scoped the festival waitlist without reference to the website, so plan and site were never reconciled. HC-079."],["Launch date — 8/17 or Aug 21","Kristina + Nav","Every downstream schedule: Keela build, end-to-end testing, QA fixes, DNS cutover","Immediate — both dates are being worked to right now","Lorna is scheduling her Keela build and her own capacity against 8/17 while this plan says Aug 21. If 8/17 holds, the Aug 10-14 review window becomes launch week and the buffer disappears. HC-080."]],"phase2Deferred":[["Item","Route / asset","Reason deferred","Target phase"],["Interactive global educator map","/stories map component","Complexity; region-scroll covers v1","Phase 2"],["Story Board","/story-board","Paused per team decision","Phase 2"],["Foundation Reach Map","/foundation-reach-map","Paused per team decision","Phase 2"],["Homeroom gated hub","/homeroom","Member auth + content not ready","Phase 2"],["About Us sub-pages (5)","/about/*","Content briefs in progress; v1 = single page (D-05 resolved)","Phase 2"],["Get Involved sub-pages","/give/corporate, etc.","Not in Kristina 7-page scope","Phase 2"],["Impact page (main nav)","/impact","Content boundary with new 'Our Impact' page (renamed Stories, Phase 1) — naming clash to resolve","Phase 2"],["Privacy Policy","/privacy","Open ticket under process — Phase 1.5 or Phase 2 TBD (does not block Aug 21)","Phase 1.5 or 2"],["Terms of Use","/terms","Open ticket under process — Phase 1.5 or Phase 2 TBD (does not block Aug 21)","Phase 1.5 or 2"],["Press & Media","/press","Not launch blocker","Phase 2"],["Festival / 10th anniversary campaigns","/festival, /10years","Need campaign briefs (4-6 wk lead)","Phase 2"],["Priscilla duplicate quote replacement","Get Involved / quote slots","Jul 28 — leave as-is for launch; replace in Phase 2","Phase 2"],["Copy updates (non-critical)","All pages","Jul 28 — copy excluded from Phase 1; critical design/compliance only","Phase 2"],["Horizontal logo / branding realignment","Global brand","Horizontal logo referenced but unconfirmed; deferred with Phase 2 branding","Phase 2"],["Non-critical design refinements","All pages","Jul 28 scope freeze — only red flags before handoff","Phase 2"]],"handoffChecklist":[["ID","Section","Item","Detail","Owner","Status","Priority","Notes"],["HC-001","Confirmed","Phase 1 hard go-live = Aug 21","Hard live date; end of Phase 1. Next phase timeline TBD.","All","Confirmed","Critical","Replaces prior Aug 17–21 window language"],["HC-002","Confirmed","Final review meeting = Aug 3–7","Flexible window anytime during week 2 of the sprint — not a single fixed day.","All","Confirmed","High","Book on calendars once exact day chosen"],["HC-003","Confirmed","Privacy / Terms = open ticket","Under process. Phase 1.5 or Phase 2 TBD. Does not block Aug 21.","Somesh + Legal","Confirmed","Low","Approach confirmed (under process; Phase 1.5 or 2 TBD; does not block Aug 21). D-08 / FEAT-071 remain open work tickets."],["HC-004","Confirmed","Alternative giving methods left open","Check/stock/crypto/memorial/legacy — Nav, Kristina, Lorna decide. May be Phase 1 or 1.5.","Nav / K / Lorna","Confirmed","Medium","Approach confirmed — left with Nav/Kristina/Lorna. May land Phase 1 or 1.5. D-20. Do not absorb into sprint unless leadership pulls it in."],["HC-005","Confirmed","Button / CTA inventory from Kristina","Every CTA destination confirmed. Critical for wiring links + event tracking at speed.","Kristina → Somesh","Partial","Critical","WAITING ON: WoeiJing — 'Spread the movement' door destination · Lorna — per-tier Keela products (HC-030/075) · Kristina — Events RSVP / email-capture choreography (D-24, HC-071).\n5 Aug · DOWNGRADED Open -> Partial. Largely overtaken by events: Somesh wired the destinations without waiting for the Miro board, and only three remain — none of which the inventory document would answer. Kept open ONLY for those three named items, not for the inventory as a deliverable. See FEAT-005.\n3 Aug · Somesh wired known destinations ahead of Miro.\n28 Jul · Kristina to supply the Miro CTA inventory by EOW."],["HC-010","Scope freeze","Phase 1 = 7 pages only","Homepage, Why, Our Impact, Schools, Events, Get Involved, About Us (single page).","Kristina + Nav","Confirmed","Critical","Confirmed in Slack — Nav endorsed 7-page Phase 1 (Homepage, Why, Our Impact, Schools, Events, Get Involved, About Us). Re-affirm verbally on handoff call."],["HC-011","Scope freeze","OUT: Interactive map / Reach Map","Foundation Reach Map and any interactive global map stay Phase 2.","All","Confirmed","High","Confirmed Phase 2 across Slack + tracker (Reach Map / interactive map deferred)."],["HC-012","Scope freeze","OUT: Story Board","Interactive corkboard prototype stays Phase 2.","All","Confirmed","High","Confirmed Phase 2 — Story Board paused / deferred."],["HC-013","Scope freeze","OUT: Magazine / page-flip PDF viewer","Phase 1 = PDF link + download only (D-10).","All","Confirmed","Medium","Confirmed — D-10 PDF link + download for Phase 1; page-flip viewer Phase 2."],["HC-014","Scope freeze","OUT: Quiz / lead magnet","Phase 2.","All","Confirmed","Medium","Confirmed Phase 2 (quiz / lead magnet deferred)."],["HC-015","Scope freeze","OUT: About Us sub-pages (5)","v1 = single page only (D-05 resolved).","All","Confirmed","Medium","Confirmed — D-05 About Us = single page for v1; 5 sub-pages Phase 2."],["HC-016","Scope freeze","OUT: Homeroom gated member hub","Phase 2.","All","Confirmed","Medium","Confirmed Phase 2 — Homeroom gated hub not in public launch."],["HC-017","Scope freeze","OUT: Festival / campaign pages","Phase 2.","All","Confirmed","Low","Confirmed Phase 2 — festival / campaign pages need briefs."],["HC-018","Scope freeze","Any new idea → Phase 2 by default","Do not silently absorb scope into the 2-week sprint.","Kristina + Somesh","Confirmed","Critical","Standing rule from Jul feedback discipline + Slack scope control. Re-state on call if new ideas appear."],["HC-020","Design handoff","Final desktop prototype URLs (7 pages)","Confirm Netlify draft URLs are the final locked versions.","Dave","Confirmed","Critical","Jul 29 — Dave 7-page zip landed in handoff/2026-07-29-dave-pages/"],["HC-021","Design handoff","Mobile = Somesh responsive build (no Dave mobile comps)","Somesh handles responsive layout natively in the sprint. Elements that don't scale may be hidden/adjusted after Phase 1.","Somesh","Confirmed","Critical","Confirmed Jul 28 handoff — no separate Dave mobile deliverable."],["HC-022","Design handoff","Design tokens locked","Colors, fonts, spacing vs site/index.html tokens (teal/ocean/deep/green/paper).","Dave + Veron","Confirmed","High","ON US: nothing — closed 5 Aug.\n5 Aug · CLOSED. Tokens are locked and in production use: --teal #1FAFC0, --ocean #0080B0, --deep #024E70, --green #4FA98C, --paper #FBFAF7; Newsreader (display), Inter (body), Varela Round (brand). Defined once in the shared layout and consumed by all 10 routes. This was recorded Open because it was written as 'Dave + Veron to confirm a token list', but the tokens were extracted from site/index.html on 28 Jul (FEAT-001) and nothing has changed them since — the confirmation the item was waiting for has been overtaken by the build."],["HC-023","Design handoff","Reusable component inventory","Nav, footer, CTA states, typography scale, form fields — named list, not reverse-engineered.","Dave","Confirmed","High","ON US: nothing — closed 5 Aug.\n5 Aug · CLOSED. The component inventory exists as shipped code, not as a document: 17 components under src/components/ (Analytics, CaptureModal, CommunityCircles, DoorCards, Footer, Hero, HomeroomBlock, InviteBand, KeelaDonateForm, KeelaScripts, Nav, NewsletterForm, OrbitSection, Pillars, StatBand, VoiceBand, WhySplit) plus BaseLayout. Nothing was reverse-engineered blind. The contract is recorded in FRONTEND-SPECIFICATION.md."],["HC-024","Design handoff","All image / media assets — direct links","Heroes, Homepage video, About team photos, Get Involved donor quote/video.","Dave + Veron + WJ","Partial","High","WAITING ON: WoeiJing / Dave — the Meet Jose video file (still a placeholder on Get Involved).\n5 Aug · Everything else landed. All hero images, About team photos, /schools wellbeing-lead photo (public/assets/fs-Jadielsm.jpg) and the Get Involved donate photo (gi-donate-photo.jpg) are in public/assets and live. Outstanding: the Jose video file, and the hi-res About hero swap Dave still owes.\n28 Jul · Dave zip includes assets. Jose video placeholder OK; file to Somesh directly when ready."],["HC-025","Design handoff","Accessibility / contrast rule","WCAG contrast wins over strict brand palette when they conflict.","Dave + Veron","Confirmed","High","ON US: apply it — the rule itself is settled.\n5 Aug · CLOSED as a decision. The resolution rule in force is WCAG CONTRAST WINS over strict brand palette when the two conflict, and it has been applied in practice: white-on-mint was corrected on /events and /why for exactly this reason. Remaining contrast defects (homepage orbit, Get Involved) are tracked as QA work under FEAT-100, not as an open design question.\n28 Jul · Opened over a known Veron-vs-Dave tension; the tension is resolved by the rule above."],["HC-026","Design handoff","No open unresolved feedback threads","Ask: any open comment thread still open on any page?","Dave + K + WJ + Nav","Confirmed","High","ON US: nothing — closed 5 Aug.\n5 Aug · CLOSED. Every review round that arrived has been processed and closed out: RF-006 (mobile UI/UX, all 7 pages), RF-008 (Kristina, video lightbox) and RF-010 (Dave, 3 Aug notes). Anything still open from those rounds now has its own ticket rather than sitting as an unresolved thread — HC-072 (Dave's second Events notes round) is the one genuine outstanding item and is tracked separately.\n28 Jul · Critical-only red flags via Slack #website; Kristina collated EOD, Dave reworked 29 Jul AM."],["HC-030","Integrations","Keela production checkout URLs (D-02)","Aug 4 — General Donation Form embed live (non-India). Per-tier Homeroom URLs still needed for /give Join Homeroom.","Finance + Lorna","Partial","Critical","WAITING ON: Lorna / Finance — the mechanism for campaign-designated and per-tier giving.\n5 Aug · Lorna's Website->Keela->Finance map (5 Aug) reframes this item. It is NOT simply 'more checkout URLs': her Stream 2 states the current general widget CANNOT capture campaign designation as built, and her Stream 3 proposes Homeroom membership as its own SEPARATE widget rather than three hosted links. If that holds, seams.joinTiers is the wrong model and FEAT-051/060 need re-specifying. Decision tracked as HC-078.\n4 Aug · General Donation Form embed live (non-India) — unblocks the donate widgets. Per-tier Homeroom still blocks FEAT-051."],["HC-031","Integrations","/give routing (D-03)","Keela widget vs gateway/redirect — Lorna confirmation pending.","Kristina / Lorna","Partial","High","WAITING ON: Lorna — confirmation of the widget-vs-gateway model for Homeroom (D-03).\n5 Aug · Partly answered by Lorna's own map, which assumes embedded Keela widgets per stream rather than a redirect gateway. That is the direction we already built toward, so this is closer to confirmation than to an open question — but it has not been stated as a decision, so it stays Partial rather than Confirmed.\nInterim in production: Join Homeroom deep-links to the homepage General Donation Form with amount + frequency prefilled."],["HC-032","Integrations","Newsletter destination (D-19)","Flodesk vs Keela vs custom — still open. Owner + decision date. Events page slots separately tracked as D-24 (Somesh → WoeiJing + Kristina).","Comms + Eng","Confirmed","High","ON US: nothing — closed 5 Aug.\n5 Aug · CLOSED. D-19 resolved to FLODESK and the integration is LIVE (FEAT-070, shipped 4 Aug): 11 capture points across 5 pages, double opt-in ON, segments driven by env vars. The destination question this item asked is settled.\nIMPORTANT CAVEAT — this closes 'which newsletter tool', NOT 'where every sign-up lands'. Lorna's 5 Aug map assumes event and waitlist sign-ups land in KEELA; we route them to FLODESK. That split is a separate, still-open question tracked as HC-078."],["HC-033","Integrations","School inquiry form (D-04)","Google Form + Slack — already resolved. Confirm form exists / owner.","Partnerships + Somesh","Confirmed","Medium","ON US: nothing — closed 5 Aug.\n5 Aug · CLOSED. D-04 resolved: Google Form + Slack integration, built 31 Jul and confirmed working. Kristina then deliberately deferred the EMBED to Phase 2 (3 Aug Miro) — test the simple /schools page first, re-integrate if people do not use the form. The launch CTA is the #start mailto. Deferral is a decision, not an open item; the Phase 2 build is tracked as FEAT-041."],["HC-034","Integrations","Bhutan compliance copy locked","Approved wording from Nav + Lorna — use as locked text.","Content / Nav","Confirmed","High","Confirmed Jul 27 — Nav + Lorna signed off: \"In Bhutan, we're honored to support the Ministry of Education's work on educator wellbeing, including trainings and retreats with school counselors nationwide.\""],["HC-035","Integrations","Team / staff roster accuracy","Titles, ordering, current staff for About Us.","WJ / HR","Confirmed","Medium","Jul 29 — Dave confirmed Dave Kebo's title is Chief Media Officer, resolving the one discrepancy flagged against about-name-manifest.txt (24 Board/Advisory names). Roster otherwise as transcribed."],["HC-040","Content","Get Involved donor quote / video","Placeholder retained on Get Involved; Jose video sent to Somesh for integration when ready.","WJ → Somesh","Confirmed","Medium","Confirmed Jul 28 — does not block handoff or Aug 21 if video still pending."],["HC-041","Content","Homeroom tiers $25/$50/$100 in all UI copy","D-01 resolved — update CTA copy to match.","Dave + Somesh","Confirmed","High","Confirmed — D-01 $25/$50/$100 (Kristina). Aug 3 Somesh: homepage InviteBand + meta updated $5→$25; Give tiers + donate chips already matched. Still audit any stray $5 in briefs/docs; benefits language Events vs Give may still differ (Nav Homeroom proposition ask)."],["HC-050","Process","Dev sprint dates Jul 28–Aug 7 confirmed","Somesh-led build window.","All","Confirmed","High",""],["HC-051","Process","Check-in cadence on calendars","Bi-weekly check-ins with Kristina and Nick during the two-week sprint; homepage Slack review before remaining pages.","Kristina","Confirmed","High","Confirmed Jul 28 handoff. Book exact calendar holds."],["HC-052","Process","Anik as technical sounding board","Confirm availability during sprint.","Somesh + Anik","Confirmed","Medium","ON US: nothing — closed 5 Aug.\n5 Aug · CLOSED. Anik engaged as technical sounding board and his review was answered in full — see docs/correspondence/ANIK-REVIEW-RESPONSE.md. Availability is no longer a question; it happened."],["HC-053","Process","Named approvers for go/no-go","Design fidelity, content accuracy, legal, final launch sign-off.","Kristina","Confirmed","High","ON US: nothing — closed 5 Aug.\n5 Aug · CLOSED by Somesh. The approvers are already known and have been operating as such throughout the sprint, so the item was recording a formality rather than a gap:\n• Design fidelity — Dave (build) + Veron (visual system)\n• Content accuracy — Kristina (page list + copy), WoeiJing (programme/brand)\n• Legal — Lorna with Finance/Legal (D-08)\n• Final launch go/no-go — Nav + WoeiJing\n• Engineering readiness — Somesh\nEveryone continues to cross-check across areas; that is working practice, not an unassigned role. The go/no-go EVENT itself (not the naming of approvers) remains gated on HC-068 pre-launch QA sign-off."],["HC-054","Process","Post-launch edit ownership","Somesh edits via Claude/Cursor + GitHub deploy; Kristina owns Change Request Form + SOP.","Somesh + Kristina","Confirmed","Medium","Confirmed — Somesh edits via Claude/Cursor + GitHub; Kristina creating single CR form + Google Sheet to track all future website change requests."],["HC-060","Somesh ownership","Audit UI/UX package vs repo","Handoff package completeness.","Somesh","Confirmed","High","ON US: nothing — closed 5 Aug.\n5 Aug · CLOSED. The UI/UX package has been audited against the repo repeatedly and in writing, which is what this item asked for: RF-006 locked-width QA across all 7 pages (31 Jul), the 4 Aug ticket-vs-acceptance-criteria audit that found 4 real gaps, HOMEPAGE-RESPONSIVE-AUDIT.md, the per-page responsive audits, and PRE-LAUNCH-QA-AUDIT.md. Gaps found by those audits are tracked as tickets rather than here."],["HC-061","Somesh ownership","Astro scaffold + shared layout","FEAT-001 / FEAT-002 — nav, footer, tokens.","Somesh","Confirmed","Critical","ON US: nothing — closed 5 Aug.\n5 Aug · CLOSED. FEAT-001 and FEAT-002 are both Done: BaseLayout, Nav, Footer and tokens are shared across every route, the mobile drawer shipped 30 Jul, and the last open criterion (active nav state on / and /updates) closed 5 Aug."],["HC-062","Somesh ownership","Convert 7 Dave prototypes → production","Astro multi-page build.","Somesh","Confirmed","Critical","ON US: nothing — closed 5 Aug.\n5 Aug · CLOSED. All 7 Dave prototypes are converted and live under src/pages/, and the site has since grown to 10 built routes (+ /privacy, /updates, /404). Continuing polish is tracked under FEAT-100 and the per-page tickets, not here — leaving this In Progress made a finished conversion look unfinished."],["HC-063","Somesh ownership","Responsive + a11y across 7 pages","Desktop and mobile; prefers-reduced-motion.","Somesh","Confirmed","Critical","ON US: nothing — closed 6 Aug.\n6 Aug · CLOSED. Responsive was already done: locked-width QA (320/390/759/768/940/1280) passed on every page, recorded in HOMEPAGE-RESPONSIVE-AUDIT.md and the per-page audits. Accessibility is now done too — all four defects PRE-LAUNCH-QA-AUDIT.md named are fixed and verified in the build: the missing main landmark and skip link (the single Critical, fixed once in BaseLayout so all 10 routes cleared), the video-lightbox keyboard trap (found on THREE pages, not just the audited one), the /events tablist (which also turned out to be entirely non-functional), and the last white-on-mint contrast failure.\nNOT claimed by this closure, and tracked on HC-068 / FEAT-100 instead: the manual screen-reader pass, text-over-image contrast, and mobile performance. Those are QA-gate items rather than the responsive-and-a11y build work this item covered."],["HC-064","Somesh ownership","Keela + forms + newsletter wiring","Donation, school inquiry, newsletter.","Somesh","Partial","Critical","WAITING ON: Lorna — campaign designation + per-tier Homeroom products (HC-030/075/078).\n5 Aug · Two of the three sub-items are DONE:\n• Newsletter — LIVE (Flodesk, FEAT-070, 4 Aug), 11 capture points, double opt-in ON\n• School inquiry form — RESOLVED (Google Form + Slack built; embed deliberately Phase 2 per Kristina)\n• Donations — PARTIAL: the general Keela form is live sitewide, but campaign-designated and per-tier giving cannot be wired until Lorna decides the mechanism"],["HC-065","Somesh ownership","Map / Story Board stay Phase 2","No interactive map in Phase 1.","Somesh","Confirmed","High",""],["HC-066","Somesh ownership","Analytics + SEO + Cookiebot CMP","GA4, Clarity, PostHog, cookie consent — decisions already resolved.","Somesh","Confirmed","High","ON US: nothing — closed 5 Aug.\n5 Aug · CLOSED. Analytics, SEO and the Cookiebot CMP are all shipped and verified live, ahead of the Aug 10–14 window they were scheduled for: FEAT-080 closed 7/7, FEAT-081 shipped 31 Jul. GA4, Clarity, Sentry and the Cookiebot consent bridge were each confirmed on the wire. Osano was dropped 4 Aug in favour of Cookiebot. 'Ready' understated work that is finished."],["HC-067","Somesh ownership","Deploy + DNS cutover Aug 21","Vercel + contentment.org.","Somesh","Ready","Critical","ON US: yes — fully prepared, date-gated on Aug 21, nothing outstanding from anyone else.\n5 Aug · Upgraded Open -> Ready. Everything that can be done ahead of the cutover is done:\n• vercel.json + netlify.toml CSP byte-identical and cutover-ready (OPS-001/002)\n• Build is output:'static' with no adapter — nothing host-specific to unwind\n• sitemap.xml, robots.txt, redirects in place\nMUST HAPPEN AT CUTOVER (each will silently fail if skipped):\n• Move Cookiebot's single registered domain to www.contentment.org — free tier allows ONE domain, and the banner no-ops on any other\n• Unpublish the internal docs hub (HC-077 / FEAT-102)\n• Confirm every PUBLIC_* and server-side env var is set on the production host, not just Netlify\n• Re-verify GA4 / Clarity / Sentry / Cookiebot on the production domain\nOPEN QUESTION — Lorna's 5 Aug map states a launch date of Sun 8/17; this plan says Aug 21. See HC-080."],["HC-068","Somesh ownership","QA + launch stabilization","a11y, Lighthouse ≥85, cross-browser, Nav+WJ sign-off.","Somesh","Partial","Critical","WAITING ON: Dave — optimised source exports (WebP, correctly-sized heroes, compression). Everything else is done or is a manual pass on us.\n6 Aug · A11Y HALF DONE (see HC-063, FEAT-100).\n6 Aug · PERF HALF: the three items measured as ours are now FIXED — 2,187 KB of inline base64 extracted to real files, 98/98 images given intrinsic dimensions with the required height:auto pairing, Google Fonts moved off the critical path, and Keela's third-party CSS removed from the 7 routes that never used it. The assumption that this was Dave's asset problem was worth checking: the large majority was markup and loading strategy.\nSTILL OPEN: optimised exports from Dave; manual screen-reader pass; text-over-image contrast; and a Lighthouse re-run to confirm the >= 85 gate now clears. Nav + WoeiJing sign-off remains an external gate."],["HC-027","Design handoff","Logo SVG = live-site mark (no three dots)","Nav sends SVG via Slack; Dave implements in final pages; Somesh uses same file in build (D-21).","Nav → Dave → Somesh","Confirmed","Critical","ON US: nothing — closed 5 Aug.\n5 Aug · CLOSED by Somesh. The logo is FINALIZED and already in use across the build — the live-site mark (no three dots) is the one shipping in Nav and Footer on every route. This item was written on 28 Jul as a blocker because Dave could not finalize pages without the SVG; the SVG landed, the pages were finalized, and the item was simply never flipped. D-21 is satisfied.\nNOTE: this closes the LOGO. Anything still labelled 'live-site' that actually belongs to the contentment.org cutover (Cookiebot domain move, docs unpublish, DNS) sits on HC-067 / FEAT-101, not here."],["HC-028","Design handoff","Critical-only final page review","WJ + Nav flag critical design/compliance red flags in Slack #website (name the page). No copy-change requests for Phase 1 (D-22).","WJ / Nav → Kristina → Dave","Confirmed","Critical","ON US: nothing — closed 5 Aug.\n5 Aug · CLOSED by Somesh. The critical-only review round ran as designed and its output was absorbed: flags came back via Slack #website, Kristina consolidated them, and Dave applied the reworks. The pages have since moved several revisions past that snapshot and the substance has been accepted. Holding a 28 Jul review gate open eight days and four review rounds later was recording a process step, not a real outstanding item. Final go/no-go sign-off is a separate gate and lives on HC-053 + HC-068.\nD-22 stands: no copy-change requests for Phase 1."],["HC-042","Content","Priscilla duplicate quote → Phase 2","Leave duplicate quote as-is for launch; replacement deferred.","Content","Confirmed","Medium","Confirmed Jul 28 — Phase 2."],["HC-043","Content","Copy changes excluded from Phase 1","Only critical design/compliance red flags accepted before freeze (D-22).","All","Confirmed","High","Confirmed Jul 28 handoff."],["HC-055","Process","Framework sign-off (React vs Astro)","Resolved Jul 29 — Somesh signed off directly in place of the pending Nick confirmation, delegating the technical call to Engineering. Decision: Astro 4.x, no React (D-23).","Somesh / Somesh","Confirmed","Critical","Unblocks FEAT-002 — scaffold choice no longer pending external sign-off."],["HC-056","Process","Claude AI subscription for Somesh","Kristina confirms ~$100/month plan with Lorna.","Kristina / Lorna","Confirmed","Medium","ON US: nothing — closed 6 Aug.\n6 Aug · CLOSED by Somesh — subscription purchased and submitted to Ramp for reimbursement. Never blocked build work; the tooling was in use throughout."],["HC-057","Process","Homepage-first build + Slack review","Somesh builds homepage (desktop + mobile responsive) first; share on Slack for team review before remaining pages.","Somesh","Confirmed","Critical","Confirmed Jul 28. Gate cleared 31 Jul — Kristina's Slack message (\"finished the Homepage... timeline to finish the other pages?\") taken as review sign-off, incl. mobile. RF-004/RF-005 closed. Cleared to proceed on remaining pages (see RF-006)."],["HC-058","Process","Website Change Request form + Sheet","Kristina creates single form + Google Sheet to track all future website change requests.","Kristina","Open","High","WAITING ON: Kristina — create the single Change Request form + Google Sheet.\nTarget during or after the sprint window. Pairs with HC-054 SOP ownership. Not a launch blocker, but it is what stops post-launch requests arriving as scattered Slack messages.\n28 Jul · Raised."],["HC-069","Design handoff","Photo usage rights cleared","Rights confirmed for About Us team/story photos and For Schools photography.","WJ / Comms","Confirmed","High","Jul 29 — cleared for build; no longer a launch blocker. Unblocks HC-024 image asset use."],["HC-070","Integrations","Keela Donate button color mismatch","Shipped pages show default Keela button (#507b91); brand spec is #0090bd. Fix lives in the Keela dashboard, not page CSS.","Finance / Lorna","Open","Medium","WAITING ON: Lorna / Finance — the fix is in the Keela dashboard, not in our CSS.\nShipped pages show Keela's default button colour #507b91; the brand spec is #0090bd. Visible on every page carrying a donate widget (Home, Why, Our Impact, Schools, Events, Get Involved). Cosmetic, not a launch blocker.\n29 Jul · Flagged."],["HC-071","Integrations","Keela / Homeroom join-flow choreography undecided","Every gated CTA (Events RSVPs, Get Involved tiers) carries a data-event/data-join seam for a return-trip redirect that can't be wired or tested until the Keela/Homeroom join flow is decided.","Lorna / Kristina","Open","High","WAITING ON: Lorna / Kristina — the Homeroom join-flow choreography, and now also Lorna's Decision 1 (what membership includes).\n5 Aug · Lorna's map makes this concrete and states the dependency precisely: what membership INCLUDES sets the tax-deductible portion of the receipt, which sets the Keela designation, which sets the widget configuration. Note the price half is already settled — D-01 resolved the tiers to $25/$50/$100 on 27 Jul. What is missing is BENEFITS, not amounts.\nEvery gated CTA (Events RSVPs, Get Involved tiers) carries a data-event/data-join seam for a return-trip redirect that cannot be wired or tested until this lands. Blocks FEAT-051, FEAT-060 and Events gated CTAs. Broader than D-03, which is routing alone."],["HC-072","Content","Events page handoff incomplete — second round of team notes pending","Dave's own handoff notes flag that a second page of team review notes has not been delivered yet; current events-build should be treated as review-only, not production-final.","Dave → Somesh","Open","High","WAITING ON: Dave — the second round of team review notes for /events.\nDave's own handoff notes flag that a second page of notes has not been delivered. Until it lands the current events build must be treated as REVIEW-ONLY, not production-final, so FEAT-090 is Blocked rather than In Progress.\n5 Aug · Still outstanding, and now on the critical path — /events also carries the November waitlist requirement from Lorna's map (HC-079).\n29 Jul · Raised; Dave tagged for delivery."],["HC-073","Scope freeze","Our Impact route confirmed: /our-impact","Final page/file name and nav seam are 'our-impact' (was 'stories'). Applied in pages table, FEAT-031, and the shared seams.js page-route config.","Somesh","Confirmed","Medium","Jul 29 — resolves the Our Impact vs Impact (main nav, Phase 2) naming ambiguity for Phase 1 scope."],["HC-074","Content","Annual Report PDFs (2019–2024) — hosting + URLs","Our Impact page needs the actual report PDFs hosted with links; Somesh to supply files/links later.","Somesh","Confirmed","Medium","ON US: nothing — closed 6 Aug for this phase.\n6 Aug · CLOSED by Somesh. The 2019-2024 Annual Reports are served from their existing Google Drive links for Phase 1 rather than re-hosted on our own domain. That is a deliberate scope call, not a shortcut: re-hosting buys nothing at launch and would add files we then have to version. Revisit in Phase 2 if we want them on contentment.org for SEO or offline control."],["HC-075","Integrations","Live Keela donation checkout URLs (per tier)","Aug 4 — Interim: General Donation Form on homepage + /why; /give Join Homeroom deep-links selected $25/$50/$100 to that form with amount+monthly. Per-tier Homeroom hosted checkout URLs (joinTiers) still owed. India region deferred.","Lorna + Somesh","Partial","Critical","WAITING ON: Lorna — per-tier Homeroom products, and now a decision on the widget model itself.\n5 Aug · Reframed by Lorna's map. We asked for three hosted checkout URLs; her Stream 3 proposes a separate MEMBERSHIP WIDGET instead, on the grounds that Keela handles memberships better that way. Those are different integrations — one is three links in seams.joinTiers, the other is a second embed with its own configuration. Answering this is a prerequisite for FEAT-051. Tracked as HC-078.\n4 Aug · Interim shipped and working: the General Donation Form on the homepage and /why, with Get Involved Join Homeroom deep-linking $25/$50/$100 to it as monthly. India region deferred.\n31 Jul · Opened."],["HC-076","Integrations","Live GA4 / PostHog / Cookiebot / Clarity / Sentry IDs","FEAT-080 (Analytics) is fully scaffolded in src/components/Analytics.astro but every tool is a no-op until its real ID/key exists: PUBLIC_GA_ID, PUBLIC_POSTHOG_KEY/HOST, PUBLIC_COOKIEBOT_ID, PUBLIC_CLARITY_ID, SENTRY_DSN.","Somesh","Confirmed","Critical","ON US: nothing — closed 5 Aug. Cutover residuals moved to HC-067.\n5 Aug · CLOSED. All five credentials landed on 4 Aug and were verified live, which is exactly what this item asked for: GA4 (G-0GBRRW2MCL) /g/collect 204, Clarity r.clarity.ms/collect 204, Sentry envelope 200, Cookiebot consent bridge flipping gcs G100 -> G111, PostHog key/host set (US region). PostHog VERIFIED 6 Aug and closed properly — the 4 Aug 'unverified' note was a flaw in our CHECK, not in PostHog. See FEAT-080 history for the root cause and for the separate memory-persistence limitation it surfaced.\nTWO BUGS THIS FOUND, both real: the PostHog stub never set __SV / posthog._i, so array.js ignored our config and fell back to localStorage + cookie — the DECISION-002/007 cookieless guarantee was cosmetic. And the CSP allowed Osano only; Cookiebot also needs consentcdn on frame-src (its banner is an iframe) or it is silently blocked.\nGOTCHA worth keeping: SENTRY_DSN is read via process.env, which .env does NOT populate — a local .env alone ships zero Sentry code. PUBLIC_* vars are unaffected (import.meta.env).\n5 Aug · Sentry test issue resolved by Somesh. Cookiebot rescan run; declaration now Necessary 4 / Statistics 11 / Marketing 7. Custom banner live (390x155 mobile / 900x90 desktop, from 374x800 stock).\nMOVED TO HC-067 (cutover): Cookiebot's registered domain must move to www.contentment.org — free tier is one domain and the banner silently no-ops on any other."],["HC-077","Deploy","Unpublish Project docs at production cutover","Remove Footer 'Project docs' link; stop publishing public/docs (skip copy-docs.sh on prod build); remove or 404 /docs* host routes. Keep docs/ in the private GitHub repo — not publicly accessible on contentment.org.","Somesh","Ready","High","ON US: yes — planned and specified, executes at cutover. Nothing outstanding from anyone else.\n5 Aug · Upgraded Open -> Ready and given a ticket row (FEAT-102) so it is visible to anyone reading the Tickets tab rather than only this checklist.\nAT CUTOVER: remove the Footer 'Project docs' link; stop publishing public/docs (skip copy-docs.sh on the production build); 404 /docs* on the host; keep docs/ in the private GitHub repo only. The Netlify preview may keep /docs until cutover.\nPairs FEAT-101 / SECURITY-AND-ACCESS §8 / TECHNICAL-ARCHITECTURE §12 step 3b.\n4 Aug · Logged by Somesh."],["HC-078","Integrations","Where sign-ups land: Keela or Flodesk (Lorna's Decision 2)","Lorna's 5 Aug map assumes every sign-up and payment lands in KEELA, tagged and receipted. Our build routes email capture to FLODESK (D-19, live since 4 Aug) and payments to Keela. Both cannot be the system of record for the same person without a sync, and nobody has decided which is.","Kristina / Lorna / WoeiJing","Open","Critical","WAITING ON: Kristina + Lorna + WoeiJing — one decision, then we wire it.\n5 Aug · Raised by Somesh after reviewing Lorna's map (website-keela.netlify.app).\nTHE DISCONNECT, precisely:\n• Lorna's Streams 4 and 5 say waitlist and event sign-ups must land in Keela with a tag, a confirmation email and an internal notification\n• Our /events and /updates capture posts to Flodesk via /api/newsletter, with segments 'www.contentment.org' and 'Contentment Festival'\n• Nothing currently moves a Flodesk subscriber into Keela\nTHREE WORKABLE OPTIONS:\n1. Flodesk for email capture, Keela for money only — cheapest, matches what is built today, but Lorna's tagging/notification requirements would have to be met in Flodesk instead\n2. Keela for everything — matches Lorna's map exactly; means replacing the live Flodesk capture on 5 pages and re-testing, and Flodesk's double opt-in trail would need an equivalent\n3. Both, with a sync — most work, most moving parts, and someone must own the dedupe\nCOST OF NOT DECIDING: every day this stays open, more addresses accumulate in Flodesk that may later have to be exported, deduped and re-tagged into Keela by hand — which is the exact cleanup Lorna's map warns about.\nSupersedes the narrow framing of D-24 (Events capture only) — this is sitewide."],["HC-079","Content","November online event — waitlist page does not exist yet (Lorna's Decision 3)","Lorna's map Stream 4 shows a 'Waitlist page' collecting names for the November online event, with Keela tagging, a confirmation email, a post-waitlist sequence and a conversion path to registration. No such page exists in the build and it is not in the Phase 1 page list.","Kristina / Ni Luh (Cika) / Lorna","Open","High","WAITING ON: Kristina + Cika — confirm whether a dedicated waitlist page is in Phase 1 scope, and what routes where.\n5 Aug · Raised by Somesh after reviewing Lorna's map.\nWHAT EXISTS TODAY: /events has email capture — the hero 'Save my free spot' opens a shared CaptureModal to the Flodesk segment 'Contentment Festival', and three Upcoming-grid CTAs currently just scroll to #ev-signup.\nWHAT DOES NOT EXIST: a dedicated waitlist page, Keela waitlist tagging, source tracking, a post-waitlist sequence, or any conversion path to registration.\nLorna notes she and Cika began scoping the festival waitlist last week but NOT in relation to the website, so the site and the plan were never reconciled. That reconciliation is what this item is for.\nDEPENDS ON HC-078 — where the waitlist lands (Keela vs Flodesk) has to be settled first, or the page gets built twice.\nBuild effort once decided: small — the capture UI, modal and API path all already exist."],["HC-080","Process","Launch date conflict — Lorna's map says 8/17, this plan says Aug 21","Lorna's 5 Aug map sets out a timeline ending 'Sun 8/17 — Launch (MVP scope)', with Keela build 8/7–8/13 and end-to-end testing 8/13–8/15. The launch plan of record has Phase 1 hard go-live on Aug 21, with the review + fixes window Aug 10–14. Four days apart, and both are being worked to.","Kristina / Nav","Open","Critical","WAITING ON: Kristina + Nav — confirm ONE date, then everything downstream re-plans against it.\n5 Aug · Raised by Somesh. This is not a documentation nit: Lorna is scheduling her Keela build, her end-to-end testing and her own capacity against 8/17, and has said explicitly that anything not decided by 8/7 moves to a post-launch list with a committed date.\nIF THE DATE IS 8/17: our review + fixes window (Aug 10–14) becomes the launch week, and the Aug 21 buffer disappears. FEAT-100 QA fixes, the Nav + WJ sign-off and the DNS cutover all compress.\nIF THE DATE IS AUG 21: Lorna gains four days, and her 8/7 decision deadline can move with it.\nALSO WORTH CHECKING WITH HER: the map labels the launch 'Sun 8/17', but 17 Aug 2026 is a MONDAY — the Sunday that week is 8/16. Her other four labels are all correct (Tue 8/4, Wed 8/5, Fri 8/7, and the 8/13–8/15 test window), so this looks like a single slipped label rather than a different week. Worth confirming she means Mon 17 Aug, because 'launch on a Sunday' and 'launch on a Monday' imply different cover arrangements."],["HC-081","Deploy","Decommission third-party draft deployments (Dave + Lorna Netlify sites)","Six of Dave draft page deploys and Lorna Website->Keela->Finance map are live on public Netlify URLs. Verified 6 Aug: all seven return HTTP 200 with NO robots meta tag and NO X-Robots-Tag header, so they are fully crawlable and indexable.","Somesh -> Dave / Lorna","Open","High","WAITING ON: Dave (six draft sites, his Netlify account) and Lorna (website-keela.netlify.app).\n6 Aug (Somesh) - raised after checking every draft URL in the pages table. THIS IS SOONER THAN CUTOVER, not at cutover, and that is the point:\nSEO RISK - six near-complete copies of contentment.org content sit on indexable public URLs with no canonical pointing back to us and no noindex. Google can index them alongside or instead of the real site. Waiting until go-live gives the duplicates weeks more to accumulate indexing, and de-indexing after the fact is far slower than never being indexed.\nCONFIDENTIALITY - Lorna map is an internal planning document that is publicly readable: it names staff, and sets out tax-letter handling, QuickBooks reconciliation and our launch plan. Useful to share deliberately, not to leave open indefinitely.\nTHE URLS:\n  Homepage        https://comfy-brigadeiros-00c4b6.netlify.app/\n  Why             https://loquacious-zuccutto-ec29f4.netlify.app/\n  Our Impact      https://heartfelt-nougat-9d490a.netlify.app/\n  For Schools     https://timely-dasik-427334.netlify.app/\n  Events          https://helpful-elf-ba3c06.netlify.app/\n  Get Involved    https://cute-palmier-4c93e1.netlify.app/\n  Keela map       https://website-keela.netlify.app/\nCHEAPEST INTERIM if they are still needed for review: add X-Robots-Tag: noindex via a _headers file, or Netlify password protection. Full delete at cutover.\nNOTE - these are on Dave and Lorna own Netlify accounts, so we cannot take them down ourselves. Needs asking."]],"reviewFeedback":[["ID","Date","Reviewer","Page","Device","Severity","Status","Feedback","Owner","Resolution / Notes","Preview URL"],["RF-001","2026-07-30","Team (Slack)","Home","Desktop","Medium","Done","Hero fold: \"325 partner schools\" separated by a vertical line — bring closer and use a dot separator.","Somesh","Shipped 31 Jul — inline middot line: 10 years · 12 countries · 325 partner schools.","https://contentmentweb2.netlify.app/"],["RF-002","2026-07-30","Mobile QA","Home","Mobile","High","Done","How Change Happens: bloom/glow washes over the last (purple) beat paragraph on mobile.","Somesh","Shipped 31 Jul — capped mobile bloom; removed negative pull; graphic max-height.","https://contentmentweb2.netlify.app/#how"],["RF-003","2026-07-30","Team","Home","Both","Medium","Done","Homeroom donate widget — was screenshot/dummy; now live Keela General Donation Form (Aug 4).","Somesh","Aug 4 — Keela General Donation Form embed live (FEAT-060 interim). Per-tier Homeroom joinTiers + India still open (HC-075).","https://contentmentweb2.netlify.app/#homeroom"],["RF-004","2026-07-30","All (HC-057)","Home","Both","Critical","Done","Homepage-first Slack review: content, nav, CTAs, Homeroom, footer. Drop screenshots + device in Slack thread.","Somesh + team","Closed 31 Jul — Kristina (Slack): \"Now that you've finished the Homepage, what's your estimate on timeline to finish the other pages?\" Read as sign-off; HC-057 gate cleared to start other pages. Other team members' pass is still ongoing in parallel — feedback received so far already fixed and shipped (see RF-001/002/003). Somesh to spot-check this row before/at next Sheet refresh.","https://contentmentweb2.netlify.app/"],["RF-005","2026-07-30","All","Home","Mobile","High","Done","Homepage mobile pass (~390px / real phone): hero, nav drawer, orbit scroll, Homeroom form, footer.","Somesh + team","Closed 31 Jul — Kristina's Slack message treats mobile layout as ready/acceptable. Other team members' device-by-device pass continues in parallel; known gaps already fixed and shipped. Log any new device-specific gaps as fresh RF-xxx rows if found.","https://contentmentweb2.netlify.app/"],["RF-006","2026-07-31","All","All Phase 1","Both","High","Done","Click-through review of About, Why, Our Impact, Schools, Events, Give after homepage sign-off.","Team","6 of 6 click-through done (Events review-only per RF-007/HC-072). Team can still log new RF rows per issue.","https://contentmentweb2.netlify.app/"],["RF-007","2026-07-31","Somesh","Events","Both","High","Open","Events remains review-only until Dave second notes (HC-072) — flag any production-risk findings but do not treat as locked.","Dave → Somesh","31 Jul review-only QA: P1 shared-nav `.menu-btn` clipped at ≤380px fixed in global.css. Soft flags for Dave (not blockers): flagship title nowrap soft overflow at 1280; filter chip wrap; hero contrast. Light EVENTS-RESPONSIVE-AUDIT.md logged — no new page CSS. HC-072 still Open. Email-capture destination opened as D-24 (Flodesk vs Keela vs other — Somesh asking WoeiJing + Kristina); slots stay placeholders.","https://contentmentweb2.netlify.app/events"],["RF-008","2026-08-01","Kristina","Our Impact","Both","High","Done","The videos are playing in a small screen.","Somesh","Fixed 1 Aug — the lightbox <iframe> is injected via JS innerHTML, so it never picked up Astro's scoped-style attribute; the CSS meant to size it to the modal (width/height:100%) silently never matched, so it fell back to the browser's ~300x150 default. Fixed by setting size inline on the iframe string (same pattern schools.astro already used). Same root cause found and fixed on /why too (not separately reported).","https://contentmentweb2.netlify.app/our-impact"],["RF-009","2026-08-01","Somesh","Home","Mobile","Low","Done","How Change Happens ripple/orbit shows static (no pin/scroll choreography) on a real iPhone 15 Pro + Chrome; looks perfect on desktop Chrome and Chrome's device toolbar mobile emulation.","Somesh","Not a bug — diagnosed 1 Aug. Root cause: the device has iOS's Reduce Motion accessibility setting on; Chrome for iOS runs on WebKit and honors it, and orbit.js/global.css already intentionally fall back to a static stacked layout under prefers-reduced-motion (by design, per ACCESSIBILITY.md). Chrome's device toolbar/window resizing does not flip that media feature, which is why desktop testing looked fine — reproduced instead via DevTools Rendering tab \"Emulate CSS media feature prefers-reduced-motion: reduce\", which produced the identical static result. No code fix; left behavior as-is. Added comments at the reduced-motion branches in orbit.js and global.css so the team doesn't re-diagnose this from scratch next time.","https://contentmentweb2.netlify.app/#how"],["RF-010","2026-08-03","Dave","All Phase 1","Both","Medium","Done","Website Notes Dave Aug 3: (1) Home / Why / Schools hero image zooms too fast — match Get Involved (subtle, almost imperceptible; start near end state). Get Involved hero zoom is the model. (2) Schools Wellbeing Leads middle photo wrong — replace with Dave's Drive asset. (3) Get Involved What is Homeroom / Meet Jose — if WJ says Homeroom video is Phase 2, cut Meet Jose.","Somesh","Aug 4 (Somesh): (1) Shipped — shared .hero-bg in global.css matched Get Involved (.gi-hero-bg): scale 1.06 / 18s ease-out (was 1.32 / 10s); covers Home, Why, Schools. (2) Wellbeing-lead photo already replaced at public/assets/fs-Jadielsm.jpg — no further action. (3) Meet Jose / Homeroom video cut HELD — keep section for now; waiting on WoeiJing + Kristina Phase 2 video call.","https://contentmentweb2.netlify.app/"]]};
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


// Per-status colours + the option lists each live tab may hold.
// These MUST stay in sync with the values actually present in
// docs/planning/launch-plan-data.json — a value missing from a list is rejected
// by setDataValidation(allowInvalid:false) and a value missing from STATUS_COLORS
// simply renders uncoloured. Verified against the JSON on 4 Aug 2026:
//   handoffChecklist -> Confirmed, In Progress, Open, Partial, Ready
//   tickets          -> Blocked, Done, In Progress, Open, Paused, Scheduled
//   decisions        -> Open, Partial, Resolved
const STATUS_COLORS = {
  // not started / needs a decision
  'Open':        { bg: '#FEF3C7', fg: '#92400E' },
  // actively moving
  'In Progress': { bg: '#DBEAFE', fg: '#1E40AF' },
  'In sprint':   { bg: '#DBEAFE', fg: '#1E40AF' },
  // unblocked, not started
  'Ready':       { bg: '#CFFAFE', fg: '#155E75' },
  'Scheduled':   { bg: '#E0E7FF', fg: '#3730A3' },
  // partially closed — real state for HC-030/075 and D-02/D-24
  'Partial':     { bg: '#FED7AA', fg: '#9A3412' },
  // closed
  'Done':        { bg: '#BBF7D0', fg: '#14532D' },
  'Resolved':    { bg: '#D1FAE5', fg: '#065F46' },
  'Confirmed':   { bg: '#D1FAE5', fg: '#065F46' },
  // stopped
  'Blocked':     { bg: '#FECACA', fg: '#7F1D1D' },
  'Paused':      { bg: '#E5E7EB', fg: '#374151' },
};

const STATUS_OPTIONS = {
  // 5 Aug 2026: 'Partial' added to tickets. Statuses were re-cut so 'In Progress' means
  // *we* are moving; anything waiting on another person is Blocked (stopped) or Partial
  // (part landed, part owed) and names them in the 'Waiting on' column. Without this entry
  // the six Partial tickets would have shown as invalid against the dropdown on reseed.
  tickets:          ['Open', 'In Progress', 'Partial', 'Blocked', 'Paused', 'Scheduled', 'Done'],
  decisions:        ['Open', 'Partial', 'Resolved'],
  handoffChecklist: ['Open', 'In Progress', 'Partial', 'Ready', 'Confirmed', 'Done'],
};

/** Colour a status column from STATUS_COLORS, and optionally add a dropdown. */
function applyStatusColumn_(sheet, col, options) {
  if (col < 1 || sheet.getLastRow() < 2) return [];
  const range = sheet.getRange(2, col, sheet.getLastRow() - 1, 1);
  if (options && options.length) {
    range.setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(options, true)
        .setAllowInvalid(true)   // warn, never block — a new status in the JSON
        .setHelpText(options.join(' \u00b7 '))  // must not hard-fail a reseed
        .build()
    );
  }
  return Object.keys(STATUS_COLORS).map(function (s) {
    return SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo(s)
      .setBackground(STATUS_COLORS[s].bg)
      .setFontColor(STATUS_COLORS[s].fg)
      .setRanges([range])
      .build();
  });
}

function applyStatusFormatting_(sheet, col) {
  // Was: two buckets only (red for Blocked/Paused, green for everything closed-ish),
  // which left Tickets' 'Open' and 'Scheduled' and Decisions' 'Open'/'Partial'
  // completely uncoloured. Now every status gets its own colour from STATUS_COLORS.
  // Rules are SET, not appended, so repeated Force reseeds don't stack duplicates.
  sheet.setConditionalFormatRules(applyStatusColumn_(sheet, col, STATUS_OPTIONS.tickets));
}

function applyDecisionStatus_(sheet, col) {
  sheet.setConditionalFormatRules(applyStatusColumn_(sheet, col, STATUS_OPTIONS.decisions));
}

/** Dropdowns + per-option colors + side legend for Handoff Checklist. */
function applyHandoffChecklistControls_(sheet) {
  if (sheet.getLastRow() < 2) return;

  const statusCol = findCol_(sheet, 'Status');
  const priorityCol = findCol_(sheet, 'Priority');
  const dataRows = sheet.getLastRow() - 1;

  // 4 Aug fix: this list was ['Open','Confirmed','Ready','Done'] with
  // setAllowInvalid(false), but the JSON already contained 'In Progress'
  // (HC-061/062/063, HC-076) and 'Partial' (HC-030, HC-075) — so those cells were
  // rejected as invalid on reseed. List now matches the data, and allowInvalid is
  // true everywhere so a new status can never hard-fail a refresh.
  const statusValues = STATUS_OPTIONS.handoffChecklist;
  const priorityValues = ['Critical', 'High', 'Medium', 'Low'];

  const statusColors = {
    Open: { bg: STATUS_COLORS['Open'].bg, fg: STATUS_COLORS['Open'].fg, meaning: 'Not decided yet / still to discuss' },
    'In Progress': { bg: STATUS_COLORS['In Progress'].bg, fg: STATUS_COLORS['In Progress'].fg, meaning: 'Actively being worked right now' },
    Partial: { bg: STATUS_COLORS['Partial'].bg, fg: STATUS_COLORS['Partial'].fg, meaning: 'Part landed, part still owed — read Notes for which' },
    Ready: { bg: STATUS_COLORS['Ready'].bg, fg: STATUS_COLORS['Ready'].fg, meaning: 'Unblocked — can start, not started' },
    Confirmed: { bg: STATUS_COLORS['Confirmed'].bg, fg: STATUS_COLORS['Confirmed'].fg, meaning: 'Agreed and locked in' },
    Done: { bg: STATUS_COLORS['Done'].bg, fg: STATUS_COLORS['Done'].fg, meaning: 'Closed — no further action' },
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
        .setAllowInvalid(true)
        .setHelpText(statusValues.join(' · '))
        .build()
    );
  }

  if (priorityCol > 0) {
    const priorityRange = sheet.getRange(2, priorityCol, dataRows, 1);
    priorityRange.setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(priorityValues, true)
        // warn, never block — see the Status note above; a value added to the JSON
        // must not hard-fail a refresh just because this list is behind.
        .setAllowInvalid(true)
        .setHelpText(priorityValues.join(' · '))
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
    // /updates and /404 both shipped but were not selectable here, so feedback on
    // them had to be filed as 'Other' and lost its page grouping.
    'Updates', '404',
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
        // warn, never block — a new page/severity in the JSON must not break reseed.
        .setAllowInvalid(true)
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
