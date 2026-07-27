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
 * The EMBEDDED_JSON below is a fallback only (used if GitHub is unreachable).
 */

const CONFIG = {
  SPREADSHEET_ID: '1P9Cp56k7BCzx0tKjisKFH3IeGoN0YIDW_m_icmbXHFY',
  SHEET_TITLE: 'contentment.org — Launch Plan',
  TIMEZONE: 'America/Los_Angeles',
  JSON_URL: 'https://raw.githubusercontent.com/Contentment-Foundation/Contentment-Website-2026/main/docs/planning/launch-plan-data.json',
};

// Embedded fallback — updated from docs/planning/launch-plan-data.json
const EMBEDDED_JSON = '{"meta":{"title":"contentment.org \u2014 Launch Plan","version":"2026-07-27","owner":"Somesh Bhardwaj","contact":"somesh@contentment.org","summary":"UIUX\u2013Dev handoff Jul 27/28. Dev sprint Jul 27\u2013Aug 7 (Sam-led). Final review meeting anytime Aug 3\u20137. Fixes/polish Aug 10\u201314. Phase 1 hard go-live Aug 21 (end of Phase 1); next phase timeline TBD. 7 Phase 1 pages: Homepage, Why, Our Impact, Schools, Events, Get Involved, About Us. Privacy/Terms remain an open ticket (Phase 1.5 or Phase 2 \u2014 TBD). Story Board + Reach Map deferred. Kristina owns Button/CTA inventory (critical for sprint speed). Alternative giving methods left open for Nav/Kristina/Lorna (Phase 1 or 1.5 TBD). Resolved: D-01 $25/$50/$100; D-04 Google Form+Slack; D-05 About single page; D-07 social URLs in UIUX; D-09 EIN in UIUX; D-10 annual report PDF Phase 1. Open: D-02 Keela URLs; D-03 /give Keela widget (Lorna); D-19 newsletter."},"overview":[["Metric","Value"],["Design handoff deadline","Jul 27 \u2014 UIUX\u2013Dev meeting (Dave + Veron); lands with Sam morning of Jul 28 (timezone)"],["Dev sprint (build)","Jul 27\u2013Aug 7, 2026 (Sam-led)"],["Final review meeting","Anytime Aug 3\u20137, 2026 \u2014 flexible window during week 2 of sprint (go/no-go for fixes)"],["Review + fixes window","Aug 10\u201314 (analytics, polish, mobile UI/UX, Nav + WJ approval)"],["Phase 1 hard go-live","Aug 21, 2026 \u2605 \u2014 hard launch date; end of Phase 1. Next phase timeline TBD"],["Content pages in scope","7 Phase 1 pages: Homepage, Why, Our Impact, Schools, Events, Get Involved, About Us"],["Launch utility pages","Updates, 404. Privacy + Terms = open ticket (Phase 1.5 or Phase 2 \u2014 TBD; under process)"],["Production domain","contentment.org (Vercel)"],["Build approach","Merge Dave + Veron HTML drafts \u2192 Astro multi-page site"],["Design owners","Dave Kebo (all page design v2) + Veron (remaining pages)"],["Critical handoff dependency","Kristina delivers Button/CTA inventory \u2014 required for wiring links + event tracking at speed"],["Phase 2 / later","Interactive map, Story Board, /homeroom gate; Privacy/Terms TBD Phase 1.5 or 2; next phase dates TBD"],["Mobile requirement","Every page ships desktop + mobile-responsive during the dev sprint"],["Bottom line","Build-complete by Aug 7; Phase 1 hard live Aug 21. Scope freeze at handoff is the critical risk control."]],"timeline":[["Phase","Dates","Work stream","Deliverables","Owner","Dependencies"],["Phase 1 \u2014 Handoff","Jul 27\u201328","UIUX\u2013Dev meeting","Design freeze + handoff checklist walkthrough; Button/CTA inventory from Kristina","Dave, Veron, K \u2192 Sam","Designs locked; Phase 1 scope frozen"],["Phase 2 \u2014 Dev Sprint","Jul 27\u201331","Foundation + Homepage + Why + Give","Astro scaffold, shared layout, CSS tokens, nav/footer; migrate Homepage to /; build /why and /give (Get Involved)","Sam (Somesh)","Dave Netlify drafts"],["Phase 2 \u2014 Dev Sprint","Aug 3\u20137","Our Impact + Schools + Events + About Us","Build /stories (Our Impact), /schools, /events, About Us (single page)","Sam (Somesh)","Content + drafts; Button inventory"],["Phase 3 \u2014 Final Review","Aug 3\u20137","Stakeholder VC (flexible)","Full site walkthrough; go/no-go for Aug 10\u201314 fixes \u2014 date TBD within this window","All (VC)","Dev sprint pages landing"],["Phase 4 \u2014 Review Sprint","Aug 10\u201314","Fixes + polish + analytics","Fixes & polish, Mobile UI/UX, Analytics, Final approval, Launch prep, Google Form embed, Website Change Request Form & SOP","Sam (Somesh), K","GA4 property ID; Flodesk/newsletter decision"],["Phase 5 \u2014 Final Approval","Aug 10\u201314","Stakeholder sign-off","Nav + WJ review and approve; Keela URLs wired if available","Nav, WJ, Sam","Approval unlocks go-live"],["Phase 6 \u2014 Launch","Aug 21","Hard go-live \u2014 end of Phase 1","DNS cutover to contentment.org; Keela live; newsletter live; Lighthouse \u226585","Sam (Somesh)","Keela URLs; Nav + WJ approval"]],"pages":[["Page","Route","Phase","Dave draft URL","Draft status","Design owner","Build complexity","In Kristina list","Notes"],["Homepage","/","1","https://comfy-brigadeiros-00c4b6.netlify.app/","Draft","Dave","Medium","Yes","5-step How Change Happens scroll; updated from earlier prototype"],["Why Teacher Wellbeing","/why","1","https://loquacious-zuccutto-ec29f4.netlify.app/","Draft","Dave","Medium","Yes","FAQ accordion, CEO + teacher video slots"],["Our Impact","/stories","1","https://heartfelt-nougat-9d490a.netlify.app/","Draft","Dave","Medium-High","Yes","Renamed from \'Stories\' per Kristina; region nav + long sections; NO interactive map in v1; route may be renamed to /our-impact \u2014 confirm before launch"],["For Schools","/schools","1","https://timely-dasik-427334.netlify.app/","Draft","Dave / Veron","High","Yes","Ripple diagram + comparison table; pricing TBD"],["Events","/events","1","https://helpful-elf-ba3c06.netlify.app/","Draft","Dave / Veron","Medium-High","Yes","Renamed from \'Events & Experiences\'; confirmed Phase 1 (Kristina \u2014 UIUX ready); filter chips, access badges; some dates TBC"],["Get Involved","/give or /give/monthly","1","https://cute-palmier-4c93e1.netlify.app/","Draft","Dave","Low-Medium","Yes","Renamed from \'Get Involved (Homeroom)\' \u2014 \'Homeroom\' dropped from public page name per Kristina; /give gateway decision pending (D-03, Keela widget)"],["About Us","/about","1","\u2014","Being drafted","Veron","TBD","Yes","Confirmed Phase 1 (Kristina \u2014 UIUX ready); single page v1 (D-05 resolved)"],["Privacy Policy","/privacy","1.5 or 2","\u2014","Not started","\u2014","Low","No","Open ticket \u2014 under process. Phase 1.5 or Phase 2 TBD. Does not block Aug 21 Phase 1 hard go-live."],["Terms of Use","/terms","1.5 or 2","\u2014","Not started","\u2014","Low","No","Open ticket \u2014 under process. Phase 1.5 or Phase 2 TBD. Does not block Aug 21 Phase 1 hard go-live."],["Newsletter signup","/updates","1","\u2014","Not started","\u2014","Low","No","Footer Subscribe destination"],["404 page","/404","1","\u2014","Not started","\u2014","Low","No","Branded error page"],["Individual impact story","/stories/[slug]","1.5","\u2014","Not started","\u2014","Medium","No","After index ships; formerly \'Individual story\'"],["Press & Media","/press","2","\u2014","Not started","\u2014","Low","No","Footer / outreach"],["Impact (main nav)","/impact","2","\u2014","Not started","\u2014","Medium","No","Distinct from the new \'Our Impact\' page (renamed Stories, Phase 1) \u2014 needs a naming/scope decision before Phase 2 build to avoid confusion"],["Homeroom member hub","/homeroom","2","\u2014","Not started","\u2014","High","No","Password-gated; not in public nav"],["Festival campaign","/festival/2026","2","\u2014","Not started","\u2014","Medium","No","Linked from Events; needs campaign brief"],["Story Board prototype","/story-board","2","site/story-board.html","Paused","\u2014","\u2014","No","Phase 2 \u2014 not in 2-week sprint"],["Foundation Reach Map","/foundation-reach-map","2","site/foundation-reach-map.html","Paused","\u2014","\u2014","No","Phase 2 \u2014 not in 2-week sprint"]],"designNotes":[["Page","Item","Risk level","Mitigation"],["All pages","Design handoff deadline is Jul 27 (preponed from Aug 3)","High","Dave + Veron must lock designs before UIUX\u2013Dev meeting; no mid-sprint redesigns"],["Homepage","Dave draft differs from site/index.html prototype","Low","Build from Dave\'s latest Netlify draft"],["Why","Video embed placeholders (CEO + 3x teacher 9:16)","Medium","Build slots now; need hosted URLs before complete"],["Our Impact","Longest editorial page in v1 (renamed from \'Stories\')","Medium","No map in Phase 1; region-scroll only"],["For Schools","Interactive ripple rings","High","Accessible static fallback for prefers-reduced-motion"],["For Schools","Horizontal comparison table on mobile","Medium","Side-scroll with clear affordance"],["For Schools","Pricing amounts TBD","Low","Ship with placeholders"],["Events","Filter chips (open / Homeroom / virtual / in-person)","Medium","Real JS logic, not static layout"],["Events","Some event dates TBC","Medium","Expect content updates after first build"],["Events","Email capture embed slot","Low","Wire to Flodesk when creds ready"],["Get Involved","Video embed placeholder","Low","Shell now, URL later"],["About Us","Veron-led design still in progress","High","Confirmed Phase 1, single page (D-05 resolved); fast-follow build if design lands late"],["All pages","Homeroom tiers resolved to $25/$50/$100 (D-01)","Medium","Update all donation CTA copy + Keela product setup to match"],["All builds","Kristina: timeline must cover both desktop AND mobile-accessible sites","High","Every FEAT ticket ships desktop + mobile-responsive; Aug 10\u201314 \'Mobile UI/UX\' line is final polish, not first pass"],["Our Impact / Impact (main nav)","Naming overlap: \'Our Impact\' (Phase 1, /stories) vs. deferred \'Impact\' nav item (/impact, Phase 2)","Medium","Confirm final IA/naming with Kristina before Phase 2 build"]],"decisions":[["ID","Decision","Options","Owner","Status","Blocks","Priority"],["D-01","Homeroom tier amounts","Resolved: $25/$50/$100 (was $5/$25/$100 vs $25/$50/$100)","Leadership / Finance","Resolved","\u2014","\u2014"],["D-02","Keela checkout URLs","Live hosted links per tier","Finance","Open","Entire conversion path","Critical"],["D-03","/give routing","Gateway page vs redirect to Homeroom \u2014 Kristina proposes Keela widget; pending Lorna confirmation on Slack (Keela support)","Product / Kristina / Lorna","Open","Scope in 2-week sprint","High"],["D-04","School inquiry form destination","Resolved: Google Form with link from website + Slack integration (was Flodesk vs Keela vs custom API)","Partnerships + Eng","Resolved","\u2014","\u2014"],["D-05","About Us scope v1","Resolved: Single page (was single page vs 5 sub-pages)","Content / Kristina","Resolved","\u2014","\u2014"],["D-06","Event calendar 2026","Confirmed dates and venues","Events team","Open","Events page cards","Medium"],["D-07","Social media URLs","Resolved: included in Dave/Veron\'s UIUX designs \u2014 pull directly from the design files (was: LinkedIn, Instagram, YouTube via Comms)","Design (Dave/Veron)","Resolved","\u2014","\u2014"],["D-08","Legal copy (Privacy + Terms)","Open ticket \u2014 under process. Ship in Phase 1.5 or Phase 2 (TBD). Does not block Aug 21 Phase 1 hard go-live.","Legal / Ops \u2014 Somesh (action item)","Open","Privacy/Terms pages only \u2014 not Aug 21 launch","Low"],["D-09","EIN for Homeroom FAQ","Resolved: legal copy already included in Dave\'s /give UIUX design (was: legal copy on giving page)","Finance","Resolved","\u2014","\u2014"],["D-10","Annual report format","Resolved: PDF for Phase 1 (was Embedded vs PDF vs both)","Leadership","Resolved","\u2014","\u2014"],["D-11","Astro 4.x build","Astro vs static partials","Engineering","Resolved","\u2014","\u2014"],["D-12","Analytics stack","GA4 + Clarity + PostHog","Engineering","Resolved","\u2014","\u2014"],["D-13","Cookie consent","Osano Free + GA4 Consent Mode v2 + cookieless PostHog \u2014 Anik looped in for a second opinion per Kristina","Somesh Bhardwaj","Resolved","\u2014","\u2014"],["D-14","Transactional email","SendGrid (existing paid plan)","Somesh Bhardwaj","Resolved","\u2014","\u2014"],["D-15","Rate limiting","Upstash Redis (@upstash/ratelimit)","Somesh Bhardwaj","Resolved","\u2014","\u2014"],["D-16","PostHog hosting","PostHog Cloud (app.posthog.com)","Somesh Bhardwaj","Resolved","\u2014","\u2014"],["D-17","Image optimization","Astro Image component","Somesh Bhardwaj","Resolved","\u2014","\u2014"],["D-18","Observability","Hybrid: Slack + Sentry + Vercel logs + PostHog","Somesh Bhardwaj","Resolved","\u2014","\u2014"],["D-19","Newsletter integration","Flodesk embed vs custom API","Engineering","Open","Newsletter ticket","Medium"],["D-20","Alternative giving methods","Check / stock / crypto / memorial / legacy gifts \u2014 leave open for Nav, Kristina, Lorna. May land in Phase 1 or Phase 1.5; not blocking core Aug 21 build unless leadership pulls it in.","Nav / Kristina / Lorna","Open","Get Involved /give completeness if pulled into Phase 1","Medium"]],"integrations":[["Integration","Phase","Effort","Can build UI first?","Dependency","Owner","Status","Notes"],["Keela donations","1","0.5-1 day once URLs exist","Yes","Finance \u2014 live checkout URLs (needed before Aug 21)","Finance + Sam","Blocked","Critical path for go-live"],["Newsletter (Flodesk)","1","0.5-2 days","Yes","Flodesk embed or API key","Comms + Sam","Open","Footer + /updates + Events capture"],["School discovery form","1","0.5-1 day","Yes","Google Form built + Slack webhook (D-04 resolved)","Partnerships + Sam","Ready","D-04 resolved: Google Form embed + Slack integration (no custom API/SendGrid/Upstash needed)"],["Analytics GA4 + Clarity","1","1-1.5 days","Partial","GA4 property ID","Sam","Open","Wire in Aug 10\u201314 review sprint; Osano CMP + Consent Mode v2"],["Cookie consent banner (Osano)","1","0.5-1 day","No","Consent copy (site-wide banner text; /privacy page itself now Phase 2)","Sam + Legal","Ready","D-13 signed off \u2014 Osano Free Plan; Anik looped in for a second opinion per Kristina"],["PostHog","1","0.5-1 day","Yes","PostHog Cloud API key","Sam","Ready","DECISION-007 \u2014 app.posthog.com, cookieless mode"],["SEO baseline","1","1 day","Yes","None","Sam","Open","Meta, OG, sitemap, favicon \u2014 Aug 10\u201314 window"],["SendGrid (transactional email)","1","0.5 day","No","Existing TCF API key","Sam","Ready","DECISION-003 signed off \u2014 reuse paid plan"],["Upstash rate limiting","1","0.5 day","No","Upstash account","Sam","Ready","DECISION-004 signed off"],["Sentry error monitoring","1","0.5 day","No","SENTRY_DSN","Sam","Ready","DECISION-006 hybrid stack"],["Event RSVP API","1.5","1-2 days","Yes","Event dates + Zoom workflow","Events + Sam","Scheduled","See automation brief"],["Homeroom password gate","2","2-3 days","N/A","Member content brief","Sam","Phase 2","Not in sprint"],["DNS cutover contentment.org","1","0.5 day","N/A","QA pass + Nav/WJ approval (Aug 10\u201314)","Sam","Open","Phase 1 hard go-live Aug 21 \u2014 end of Phase 1; next phase TBD"]],"tickets":[["ID","Title","Phase","Priority","Status","Owner","Sprint dates","Depends on","Blocker / Note"],["FEAT-001","Extract shared layout (CSS, nav, footer)","1","Must","Open","Sam","Jul 27\u201328","\u2014","\u2014"],["FEAT-002","Multi-page routing scaffold (Astro)","1","Must","Ready","Sam","Jul 27\u201328","FEAT-001","Astro 4.x confirmed"],["FEAT-003","Mobile navigation drawer","1","Must","Open","Sam","Jul 28","FEAT-001","\u2014"],["FEAT-004","Wire all nav and footer links","1","Must","Ready","Sam","Jul 29","FEAT-002","D-07 resolved: social URLs are in Dave/Veron\'s UIUX designs \u2014 pull directly from there, no separate Comms handoff needed"],["FEAT-005","Button / CTA inventory (all destinations)","1","Must","Open","Sam","Before / during handoff \u2014 needed early in sprint","\u2014","Owner of delivery is Kristina (inventory) \u2192 Sam wires it. Critical for links + analytics/event tracking at speed."],["FEAT-010","Migrate homepage to /","1","Must","In Progress","Dave + Sam","Jul 28\u201329","FEAT-001, FEAT-002","Use Dave Netlify draft"],["FEAT-020","Build /why page","1","Must","Open","Sam","Jul 29\u201330","FEAT-001, FEAT-002","\u2014"],["FEAT-030","Our Impact Page data model + JSON","1","Must","Blocked","Sam","Jul 31","\u2014","Renamed from \'Stories\' per Kristina; comms: photos + permissions"],["FEAT-031","Build /stories index (page renamed \'Our Impact\')","1","Must","Open","Sam","Aug 3\u20134","FEAT-002","Region layout; no map v1; confirm if route becomes /our-impact"],["FEAT-040","Build /schools page","1","Must","Open","Sam","Aug 4\u20135","FEAT-002","\u2014"],["FEAT-041","School discovery form","1","Should","Ready","Sam","Aug 5","FEAT-040","D-04 resolved: Google Form embed + Slack integration"],["FEAT-050","Build /give gateway","1","Must","Open","Sam","Jul 30\u201331","FEAT-002","May redirect to /give/monthly; routing pending Keela widget (D-03)"],["FEAT-051","Build /give/monthly Get Involved Page","1","Must","Blocked","Sam","Jul 30\u201331","FEAT-050, FEAT-060","Renamed from \'Homeroom page\' per Kristina; tier amounts resolved (D-01: $25/$50/$100); still blocked on Keela URLs (D-02)"],["FEAT-060","Keela donation integration","1","Must","Blocked","Sam","Aug 14\u201316","\u2014","Finance URLs needed before wiring"],["FEAT-070","Newsletter integration (Flodesk)","1","Must","Open","Sam","Aug 13\u201314","FEAT-010","Flodesk creds"],["FEAT-071","Privacy and Terms pages","1.5 or 2","Should","Open","Sam","Phase 1.5 or Phase 2 \u2014 TBD (under process)","FEAT-002","Open ticket per Somesh/Kristina \u2014 does not block Aug 21 Phase 1 hard go-live (D-08)"],["FEAT-080","Analytics (GA4, Clarity, PostHog Cloud, Osano, Sentry)","1","Must","Open","Sam","Aug 10\u201312","FEAT-002","All analytics/observability decisions resolved"],["FEAT-081","SEO baseline","1","Should","Open","Sam","Aug 12\u201313","FEAT-002","\u2014"],["FEAT-090","Events page (renamed from \'Events & Experiences\')","1","Must","In sprint","Sam","Aug 6\u20137","FEAT-002","Confirmed Phase 1 \u2014 Kristina has UIUX ready"],["FEAT-032","Individual story pages /stories/[slug] (page renamed \'Our Impact\')","1.5","Should","Scheduled","Sam","Aug 7","FEAT-031","\u2014"],["FEAT-033","Interactive global map","2","Nice","Paused","Sam","\u2014","FEAT-031","Phase 2"],["FEAT-093","About Us page (v1 single page)","1","Must","Ready","Sam / Veron","Aug 7 or fast-follow","FEAT-002","Confirmed Phase 1 \u2014 Kristina has UIUX ready; single page confirmed (D-05 resolved)"],["FEAT-100","Pre-launch QA","1","Must","Open","Sam","Aug 13\u201314","All must-haves","a11y, Lighthouse \u226585; Nav + WJ sign-off"],["FEAT-101","Production deploy + DNS","1","Must","Open","Sam","Aug 21","FEAT-100","contentment.org cutover \u2014 Phase 1 hard go-live Aug 21"]],"externalBlockers":[["Blocker","Waiting on","Gates","Needed by","Impact if delayed"],["Design handoff (all pages)","Dave + Veron","Entire dev sprint","Jul 27","Dev cannot start without locked designs \u2014 preponed from Aug 3"],["Button / CTA inventory","Kristina","FEAT-004, FEAT-005, analytics event wiring","Handoff / early sprint (Jul 28\u201329)","Sprint slows \u2014 CTAs stay href=# and tracking cannot be instrumented correctly"],["Live Keela checkout URLs","Finance","FEAT-060, FEAT-051","Aug 14 (pre Aug 21 hard go-live)","Cannot launch live donations"],["Story photos + permissions","Comms / Programs","FEAT-030","Aug 3","Our Impact page ships with draft copy only"],["Keela widget confirmation (/give routing, D-03)","Lorna / Finance","FEAT-050","Aug 5 (before /give build finalized)","Gateway-vs-redirect routing stays undecided"],["Event calendar dates","Events","FEAT-090","Aug 6","TBC labels on event cards"],["About Us copy/design","Content + Veron","FEAT-093","Aug 7 (or fast-follow)","Confirmed Phase 1 (Kristina); design still in progress \u2014 fast-follow after sprint if late, doesn\'t block go-live"],["Nav + WJ final approval","Nav, WJ","FEAT-101","Aug 14 (pre Aug 21 hard go-live)","DNS cutover cannot proceed without sign-off"]],"phase2Deferred":[["Item","Route / asset","Reason deferred","Target phase"],["Interactive global educator map","/stories map component","Complexity; region-scroll covers v1","Phase 2"],["Story Board","/story-board","Paused per team decision","Phase 2"],["Foundation Reach Map","/foundation-reach-map","Paused per team decision","Phase 2"],["Homeroom gated hub","/homeroom","Member auth + content not ready","Phase 2"],["About Us sub-pages (5)","/about/*","Content briefs in progress; v1 = single page (D-05 resolved)","Phase 2"],["Get Involved sub-pages","/give/corporate, etc.","Not in Kristina 7-page scope","Phase 2"],["Impact page (main nav)","/impact","Content boundary with new \'Our Impact\' page (renamed Stories, Phase 1) \u2014 naming clash to resolve","Phase 2"],["Privacy Policy","/privacy","Open ticket under process \u2014 Phase 1.5 or Phase 2 TBD (does not block Aug 21)","Phase 1.5 or 2"],["Terms of Use","/terms","Open ticket under process \u2014 Phase 1.5 or Phase 2 TBD (does not block Aug 21)","Phase 1.5 or 2"],["Press & Media","/press","Not launch blocker","Phase 2"],["Festival / 10th anniversary campaigns","/festival, /10years","Need campaign briefs (4-6 wk lead)","Phase 2"]],"handoffChecklist":[["ID","Section","Item","Detail","Owner","Status","Priority","Notes"],["HC-001","Confirmed","Phase 1 hard go-live = Aug 21","Hard live date; end of Phase 1. Next phase timeline TBD.","All","Confirmed","Critical","Replaces prior Aug 17\u201321 window language"],["HC-002","Confirmed","Final review meeting = Aug 3\u20137","Flexible window anytime during week 2 of the sprint \u2014 not a single fixed day.","All","Confirmed","High","Book on calendars once exact day chosen"],["HC-003","Confirmed","Privacy / Terms = open ticket","Under process. Phase 1.5 or Phase 2 TBD. Does not block Aug 21.","Sam + Legal","Open","Low","D-08 / FEAT-071"],["HC-004","Confirmed","Alternative giving methods left open","Check/stock/crypto/memorial/legacy \u2014 Nav, Kristina, Lorna decide. May be Phase 1 or 1.5.","Nav / K / Lorna","Open","Medium","D-20 \u2014 do not absorb into sprint unless leadership pulls it in"],["HC-005","Confirmed","Button / CTA inventory from Kristina","Every CTA destination confirmed. Critical for wiring links + event tracking at speed.","Kristina \u2192 Sam","Open","Critical","FEAT-005 \u2014 get this early in the handoff call"],["HC-010","Scope freeze","Phase 1 = 7 pages only","Homepage, Why, Our Impact, Schools, Events, Get Involved, About Us (single page).","Kristina + Nav","Open","Critical","Say out loud and get a nod"],["HC-011","Scope freeze","OUT: Interactive map / Reach Map","Foundation Reach Map and any interactive global map stay Phase 2.","All","Open","High","Confirm nobody pulls map back into Phase 1"],["HC-012","Scope freeze","OUT: Story Board","Interactive corkboard prototype stays Phase 2.","All","Open","High",""],["HC-013","Scope freeze","OUT: Magazine / page-flip PDF viewer","Phase 1 = PDF link + download only (D-10).","All","Open","Medium",""],["HC-014","Scope freeze","OUT: Quiz / lead magnet","Phase 2.","All","Open","Medium",""],["HC-015","Scope freeze","OUT: About Us sub-pages (5)","v1 = single page only (D-05 resolved).","All","Open","Medium",""],["HC-016","Scope freeze","OUT: Homeroom gated member hub","Phase 2.","All","Open","Medium",""],["HC-017","Scope freeze","OUT: Festival / campaign pages","Phase 2.","All","Open","Low",""],["HC-018","Scope freeze","Any new idea \u2192 Phase 2 by default","Do not silently absorb scope into the 2-week sprint.","Kristina + Sam","Open","Critical","Escalate to Kristina if someone pushes back"],["HC-020","Design handoff","Final desktop prototype URLs (7 pages)","Confirm Netlify draft URLs are the final locked versions.","Dave","Open","Critical","Homepage / Why / Our Impact / Schools / Events / Get Involved / About"],["HC-021","Design handoff","Mobile design status per page","Which pages have locked mobile; which are still catching up in parallel.","Dave + Veron","Open","Critical","Desktop prioritized first; mobile may continue in parallel"],["HC-022","Design handoff","Design tokens locked","Colors, fonts, spacing vs site/index.html tokens (teal/ocean/deep/green/paper).","Dave + Veron","Open","High",""],["HC-023","Design handoff","Reusable component inventory","Nav, footer, CTA states, typography scale, form fields \u2014 named list, not reverse-engineered.","Dave","Open","High",""],["HC-024","Design handoff","All image / media assets \u2014 direct links","Heroes, Homepage video, About team photos, Get Involved donor quote/video.","Dave + Veron + WJ","Open","High","Direct links \u2014 not Drive folder hunting"],["HC-025","Design handoff","Accessibility / contrast rule","WCAG contrast wins over strict brand palette when they conflict.","Dave + Veron","Open","High","Known Veron vs Dave tension \u2014 get the resolution rule"],["HC-026","Design handoff","No open unresolved feedback threads","Ask: any open comment thread still open on any page?","Dave + K + WJ + Nav","Open","High",""],["HC-030","Integrations","Keela production checkout URLs (D-02)","Owner + timeline \u2014 needed before Aug 21 hard go-live.","Finance + Lorna","Open","Critical","Blocks FEAT-060 / FEAT-051"],["HC-031","Integrations","/give routing (D-03)","Keela widget vs gateway/redirect \u2014 Lorna confirmation pending.","Kristina / Lorna","Open","High",""],["HC-032","Integrations","Newsletter destination (D-19)","Flodesk vs Keela vs custom \u2014 still open. Owner + decision date.","Comms + Eng","Open","High","Blocks FEAT-070"],["HC-033","Integrations","School inquiry form (D-04)","Google Form + Slack \u2014 already resolved. Confirm form exists / owner.","Partnerships + Sam","Ready","Medium","Resolved"],["HC-034","Integrations","Bhutan compliance copy locked","Approved wording from Nav + Lorna \u2014 use as locked text.","Content / Nav","Open","High","Confirm still final on the call"],["HC-035","Integrations","Team / staff roster accuracy","Titles, ordering, current staff for About Us.","WJ / HR","Open","Medium",""],["HC-040","Content","Get Involved donor quote / video","Jose video pending \u2014 confirm placeholder plan if not ready by Aug 21.","WJ / Dave","Open","Medium",""],["HC-041","Content","Homeroom tiers $25/$50/$100 in all UI copy","D-01 resolved \u2014 update CTA copy to match.","Dave + Sam","Open","High",""],["HC-050","Process","Dev sprint dates Jul 27\u2013Aug 7 confirmed","Sam-led build window.","All","Confirmed","High",""],["HC-051","Process","Check-in cadence on calendars","Standing sync (~Jul 29) + sprint review (within Aug 3\u20137).","Kristina","Open","High","Book before call ends"],["HC-052","Process","Anik as technical sounding board","Confirm availability during sprint.","Sam + Anik","Open","Medium",""],["HC-053","Process","Named approvers for go/no-go","Design fidelity, content accuracy, legal, final launch sign-off.","Kristina","Open","High","Nav + WJ final approval gates Aug 21"],["HC-054","Process","Post-launch edit ownership","Sam edits via Claude/Cursor + GitHub deploy; Kristina owns Change Request Form + SOP.","Sam + Kristina","Open","Medium","Aug 10\u201314 deliverable for K"],["HC-060","Sam ownership","Audit UI/UX package vs repo","Handoff package completeness.","Sam","Open","High",""],["HC-061","Sam ownership","Astro scaffold + shared layout","FEAT-001 / FEAT-002 \u2014 nav, footer, tokens.","Sam","Open","Critical",""],["HC-062","Sam ownership","Convert 7 Dave prototypes \u2192 production","Astro multi-page build.","Sam","Open","Critical",""],["HC-063","Sam ownership","Responsive + a11y across 7 pages","Desktop and mobile; prefers-reduced-motion.","Sam","Open","Critical",""],["HC-064","Sam ownership","Keela + forms + newsletter wiring","Donation, school inquiry, newsletter.","Sam","Open","Critical","Depends on D-02, D-19, Button inventory"],["HC-065","Sam ownership","Map / Story Board stay Phase 2","No interactive map in Phase 1.","Sam","Confirmed","High",""],["HC-066","Sam ownership","Analytics + SEO + Osano","GA4, Clarity, PostHog, cookie consent \u2014 decisions already resolved.","Sam","Open","High","Wire Aug 10\u201314"],["HC-067","Sam ownership","Deploy + DNS cutover Aug 21","Vercel + contentment.org.","Sam","Open","Critical","Phase 1 hard go-live"],["HC-068","Sam ownership","QA + launch stabilization","a11y, Lighthouse \u226585, cross-browser, Nav+WJ sign-off.","Sam","Open","Critical",""]]}';

// Tickets, Decisions, and Handoff Checklist are the tabs the team edits
// directly — each gets its own tab so status/owner columns and conditional
// formatting are easy to work with.
const TAB_KEYS = {
  tickets: 'Tickets',
  decisions: 'Decisions',
  handoffChecklist: 'Handoff Checklist',
};

// Everything else is informational reference material (not edited by the
// team) — merged into one read-only "Reference" tab instead of one tab per
// section, so the whole spreadsheet stays at 3 tabs total.
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
const LIVE_TRACKER_TABS = ['tickets', 'decisions', 'handoffChecklist'];

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
    .addItem('Force reseed Tickets + Decisions + Handoff Checklist (discards manual edits)', 'forceReseedLiveTabs_')
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
      newValue: 'Reference (+ any new live tabs) refreshed from GitHub JSON',
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
  return JSON.parse(EMBEDDED_JSON);
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
    'This replaces Tickets, Decisions, and Handoff Checklist with the latest data from the repo JSON and discards any manual status/owner/blocker edits made in the Sheet. Continue?\n\n(A single Black Box entry will record this reseed — cell-level edits during the rewrite are skipped.)',
    ui.ButtonSet.YES_NO
  );
  if (resp !== ui.Button.YES) return;

  withAuditPaused_(function () {
    const data = loadData_();
    const ss = getOrCreateSpreadsheet_();
    // Create Handoff Checklist first so a later Tickets validation failure
    // cannot leave the new tab missing.
    const reseedOrder = ['handoffChecklist', 'tickets', 'decisions'];
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
      tab: 'Tickets + Decisions + Handoff Checklist',
      cell: '—',
      column: '—',
      rowId: '—',
      oldValue: '(previous live-tab contents)',
      newValue: 'Force reseed from GitHub JSON — manual Status/Owner edits on those tabs discarded',
      source: 'Force reseed',
    });
    ui.alert('Tickets, Decisions, and Handoff Checklist reseeded from source.');
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
    ['Refresh', 'Launch Plan menu → Refresh from source. Updates this tab only — Tickets / Decisions / Handoff Checklist are protected once seeded (see Force reseed).'],
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
