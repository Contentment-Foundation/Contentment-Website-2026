/**
 * contentment.org Launch Plan — Google Sheets builder V1
 *
 * SETUP (one time):
 * 1. Go to https://script.google.com → New project
 * 2. Paste this entire file → Save
 * 3. Run createOrRefreshLaunchPlan → authorize → check logs for Sheet URL
 * 4. Copy the spreadsheet ID from the URL into CONFIG.SPREADSHEET_ID so future runs update the same file
 * 5. Optional: run installDailyRefreshTrigger to keep the Reference tab current automatically
 *
 * REFRESH: just push changes to docs/planning/launch-plan-data.json on GitHub.
 * The daily trigger (or a manual "Refresh from source" run) will fetch the latest
 * JSON automatically — no need to re-paste this script.
 * The EMBEDDED_JSON below is a fallback only (used if GitHub is unreachable).
 */

const CONFIG = {
  SPREADSHEET_ID: '1P9Cp56k7BCzx0tKjisKFH3IeGoN0YIDW_m_icmbXHFY',
  SHEET_TITLE: 'contentment.org — Launch Plan',
  TIMEZONE: 'America/Los_Angeles',
  JSON_URL: 'https://raw.githubusercontent.com/Contentment-Foundation/Contentment-Website-2026/main/docs/planning/launch-plan-data.json',
};

// Embedded fallback — updated from docs/planning/launch-plan-data.json
const EMBEDDED_JSON = '{"meta":{"title":"contentment.org \u2014 Launch Plan","version":"2026-07-14","owner":"Somesh Bhardwaj","contact":"somesh@contentment.org","summary":"Dev sprint Aug 3\u201314 (Sam-led). Design handoff from Dave + Veron by Aug 3 UIUX\u2013Dev meeting. Review + fixes Aug 17\u201321 (Nav + WJ approval). Go-live Aug 24\u201328. Story Board and Reach Map deferred to Phase 2."},"overview":[["Metric","Value"],["Dev sprint (build)","Aug 3\u201314, 2026 (Sam-led)"],["Design handoff deadline","Aug 3 \u2014 UIUX\u2013Dev meeting (Dave + Veron)"],["Review + fixes window","Aug 17\u201321 (analytics, polish, Nav + WJ approval)"],["Go-live target","Aug 24\u201328, 2026 \u2605"],["Content pages in scope","6 live (Homepage, Why, Stories, Schools, Events, Give) + About Us when ready"],["Launch utility pages","Privacy, Terms, Updates, 404"],["Production domain","contentment.org (Vercel)"],["Build approach","Merge Dave + Veron HTML drafts \u2192 Astro multi-page site"],["Design owners","Dave Kebo (all page design v2) + Veron (remaining pages)"],["Phase 2 deferred","Interactive map, Story Board, /homeroom gate"],["Bottom line","Build-complete by Aug 14; launch-ready depends on Keela + legal copy + final content"]],"timeline":[["Phase","Dates","Work stream","Deliverables","Owner","Dependencies"],["Phase 1 \u2014 Handoff","Aug 3","UIUX\u2013Dev meeting","Design freeze: all page designs handed off from Dave + Veron to Sam","Dave, Veron \u2192 Sam","Designs locked before dev starts"],["Phase 2 \u2014 Dev Sprint","Aug 3\u20137","Foundation + Homepage + Why + Give","Astro scaffold, shared layout, CSS tokens, nav/footer; migrate Homepage to /; build /why and /give (Homeroom)","Sam (Somesh)","comfy-brigadeiros + loquacious-zuccutto + cute-palmier drafts"],["Phase 2 \u2014 Dev Sprint","Aug 10\u201314","Stories + Schools + Events + About Us","Build /stories (region-scroll), /schools (ripple + table), /events (filter chips); About Us when draft lands","Sam (Somesh)","heartfelt-nougat + timely-dasik + helpful-elf drafts; About Us content from team"],["Phase 3 \u2014 Review Sprint","Aug 17\u201321","Fixes + polish + analytics","Bug fixes from review, Privacy + Terms pages, analytics wiring (GA4 + Clarity), SEO baseline, cookie banner, a11y QA","Sam (Somesh)","Legal copy, Flodesk creds, GA4 property ID"],["Phase 4 \u2014 Final Approval","Aug 17\u201321","Stakeholder sign-off","Nav (Navindran) + WJ review and approve; Keela URLs wired if available","Nav, WJ, Sam","Approval unlocks go-live"],["Phase 5 \u2014 Launch","Aug 24\u201328","Launch prep + DNS cutover","Keela wire, newsletter live, Lighthouse \u226585 QA, DNS cutover to contentment.org","Sam (Somesh)","Finance Keela URLs; legal copy approved"]],"pages":[["Page","Route","Phase","Dave draft URL","Draft status","Design owner","Build complexity","In Kristina list","Notes"],["Homepage","/","1","https://comfy-brigadeiros-00c4b6.netlify.app/","Draft","Dave","Medium","Yes","5-step How Change Happens scroll; updated from earlier prototype"],["Why Teacher Wellbeing","/why","1","https://loquacious-zuccutto-ec29f4.netlify.app/","Draft","Dave","Medium","Yes","FAQ accordion, CEO + teacher video slots"],["Stories","/stories","1","https://heartfelt-nougat-9d490a.netlify.app/","Draft","Dave","Medium-High","Yes","Region nav + long sections; NO interactive map in v1"],["For Schools","/schools","1","https://timely-dasik-427334.netlify.app/","Draft","Dave / Veron","High","Yes","Ripple diagram + comparison table; pricing TBD"],["Events & Experiences","/events","1.5","https://helpful-elf-ba3c06.netlify.app/","Draft","Dave / Veron","Medium-High","Yes","Filter chips, access badges; some dates TBC"],["Get Involved (Homeroom)","/give or /give/monthly","1","https://cute-palmier-4c93e1.netlify.app/","Draft","Dave","Low-Medium","Yes","Homeroom conversion page; /give gateway decision pending"],["About Us","/about","1 or 2","\u2014","Being drafted","Veron","TBD","Yes","Single page v1 vs 5 sub-pages \u2014 decision needed; fast-follow after sprint"],["Privacy Policy","/privacy","1","\u2014","Not started","\u2014","Low","No","Legal copy required"],["Terms of Use","/terms","1","\u2014","Not started","\u2014","Low","No","Legal copy required"],["Newsletter signup","/updates","1","\u2014","Not started","\u2014","Low","No","Footer Subscribe destination"],["404 page","/404","1","\u2014","Not started","\u2014","Low","No","Branded error page"],["Individual story","/stories/[slug]","1.5","\u2014","Not started","\u2014","Medium","No","After index ships"],["Press & Media","/press","2","\u2014","Not started","\u2014","Low","No","Footer / outreach"],["Impact (main nav)","/impact","2","\u2014","Not started","\u2014","Medium","No","Distinct from /about/impact"],["Homeroom member hub","/homeroom","2","\u2014","Not started","\u2014","High","No","Password-gated; not in public nav"],["Festival campaign","/festival/2026","2","\u2014","Not started","\u2014","Medium","No","Linked from Events; needs campaign brief"],["Story Board prototype","/story-board","2","site/story-board.html","Paused","\u2014","\u2014","No","Phase 2 \u2014 not in 2-week sprint"],["Foundation Reach Map","/foundation-reach-map","2","site/foundation-reach-map.html","Paused","\u2014","\u2014","No","Phase 2 \u2014 not in 2-week sprint"]],"designNotes":[["Page","Item","Risk level","Mitigation"],["All pages","Design handoff deadline is Aug 3","High","Dave + Veron must lock designs before UIUX\u2013Dev meeting; no mid-sprint redesigns"],["Homepage","Dave draft differs from site/index.html prototype","Low","Build from Dave\'s latest Netlify draft"],["Why","Video embed placeholders (CEO + 3x teacher 9:16)","Medium","Build slots now; need hosted URLs before complete"],["Stories","Longest editorial page in v1","Medium","No map in Phase 1; region-scroll only"],["For Schools","Interactive ripple rings","High","Accessible static fallback for prefers-reduced-motion"],["For Schools","Horizontal comparison table on mobile","Medium","Side-scroll with clear affordance"],["For Schools","Pricing amounts TBD","Low","Ship with placeholders"],["Events","Filter chips (open / Homeroom / virtual / in-person)","Medium","Real JS logic, not static layout"],["Events","Some event dates TBC","Medium","Expect content updates after first build"],["Events","Email capture embed slot","Low","Wire to Flodesk when creds ready"],["Get Involved","Video embed placeholder","Low","Shell now, URL later"],["About Us","Veron-led design still in progress","High","Fast-follow build; may ship as simple single page first"],["All pages","Homeroom tiers inconsistent ($5/$25/$100 vs $25/$50/$100)","High","One tier decision before Keela wiring"]],"decisions":[["ID","Decision","Options","Owner","Status","Blocks","Priority"],["D-01","Homeroom tier amounts","$5/$25/$100 vs $25/$50/$100","Leadership / Finance","Open","All donation CTAs, Keela products","Critical"],["D-02","Keela checkout URLs","Live hosted links per tier","Finance","Open","Entire conversion path","Critical"],["D-03","/give routing","Gateway page vs redirect to Homeroom","Product / Kristina","Open","Scope in 2-week sprint","High"],["D-04","School inquiry form destination","Flodesk vs Keela vs custom API","Partnerships + Eng","Open","For Schools form backend","High"],["D-05","About Us scope v1","Single page vs 5 sub-pages","Content / Kristina","Open","About build estimate","High"],["D-06","Event calendar 2026","Confirmed dates and venues","Events team","Open","Events page cards","Medium"],["D-07","Social media URLs","LinkedIn, Instagram, YouTube","Comms","Open","Footer links","Medium"],["D-08","Legal copy","Privacy + Terms text","Legal / Ops","Open","Launch (Aug 24\u201328)","Critical"],["D-09","EIN for Homeroom FAQ","Legal copy on giving page","Finance","Open","/give completeness","Medium"],["D-10","Annual report format","Embedded vs PDF vs both","Leadership","Open","Stories transparency section","Low"],["D-11","Astro 4.x build","Astro vs static partials","Engineering","Resolved","\u2014","\u2014"],["D-12","Analytics stack","GA4 + Clarity + PostHog","Engineering","Resolved","\u2014","\u2014"],["D-13","Cookie consent","Osano Free + GA4 Consent Mode v2 + cookieless PostHog","Somesh Bhardwaj","Resolved","\u2014","\u2014"],["D-14","Transactional email","SendGrid (existing paid plan)","Somesh Bhardwaj","Resolved","\u2014","\u2014"],["D-15","Rate limiting","Upstash Redis (@upstash/ratelimit)","Somesh Bhardwaj","Resolved","\u2014","\u2014"],["D-16","PostHog hosting","PostHog Cloud (app.posthog.com)","Somesh Bhardwaj","Resolved","\u2014","\u2014"],["D-17","Image optimization","Astro Image component","Somesh Bhardwaj","Resolved","\u2014","\u2014"],["D-18","Observability","Hybrid: Slack + Sentry + Vercel logs + PostHog","Somesh Bhardwaj","Resolved","\u2014","\u2014"],["D-19","Newsletter integration","Flodesk embed vs custom API","Engineering","Open","Newsletter ticket","Medium"]],"integrations":[["Integration","Phase","Effort","Can build UI first?","Dependency","Owner","Status","Notes"],["Keela donations","1","0.5-1 day once URLs exist","Yes","Finance \u2014 live checkout URLs (needed by Aug 24)","Finance + Sam","Blocked","Critical path for go-live"],["Newsletter (Flodesk)","1","0.5-2 days","Yes","Flodesk embed or API key","Comms + Sam","Open","Footer + /updates + Events capture"],["School discovery form","1","1-2 days","Yes","Form destination decision (D-04)","Partnerships + Sam","Open","Custom API needs SendGrid + Upstash"],["Analytics GA4 + Clarity","1","1-1.5 days","Partial","GA4 property ID","Sam","Open","Wire in Aug 17\u201321 review sprint; Osano CMP + Consent Mode v2"],["Cookie consent banner (Osano)","1","0.5-1 day","No","Legal copy in /privacy","Sam + Legal","Ready","DECISION-002 signed off \u2014 Osano Free Plan"],["PostHog","1","0.5-1 day","Yes","PostHog Cloud API key","Sam","Ready","DECISION-007 \u2014 app.posthog.com, cookieless mode"],["SEO baseline","1","1 day","Yes","None","Sam","Open","Meta, OG, sitemap, favicon \u2014 Aug 17\u201321 window"],["SendGrid (transactional email)","1","0.5 day","No","Existing TCF API key","Sam","Ready","DECISION-003 signed off \u2014 reuse paid plan"],["Upstash rate limiting","1","0.5 day","No","Upstash account","Sam","Ready","DECISION-004 signed off"],["Sentry error monitoring","1","0.5 day","No","SENTRY_DSN","Sam","Ready","DECISION-006 hybrid stack"],["Event RSVP API","1.5","1-2 days","Yes","Event dates + Zoom workflow","Events + Sam","Scheduled","See automation brief"],["Homeroom password gate","2","2-3 days","N/A","Member content brief","Sam","Phase 2","Not in sprint"],["DNS cutover contentment.org","1","0.5 day","N/A","QA pass + Nav/WJ approval (Aug 17\u201321)","Sam","Open","Final launch step \u2014 Aug 24\u201328"]],"tickets":[["ID","Title","Phase","Priority","Status","Owner","Sprint dates","Depends on","Blocker / Note"],["FEAT-001","Extract shared layout (CSS, nav, footer)","1","Must","Open","Sam","Aug 3\u20134","\u2014","\u2014"],["FEAT-002","Multi-page routing scaffold (Astro)","1","Must","Ready","Sam","Aug 3\u20134","FEAT-001","Astro 4.x confirmed"],["FEAT-003","Mobile navigation drawer","1","Must","Open","Sam","Aug 4","FEAT-001","\u2014"],["FEAT-004","Wire all nav and footer links","1","Must","Open","Sam","Aug 5","FEAT-002","Social URLs from comms"],["FEAT-010","Migrate homepage to /","1","Must","In Progress","Dave + Sam","Aug 4\u20135","FEAT-001, FEAT-002","Use Dave Netlify draft"],["FEAT-020","Build /why page","1","Must","Open","Sam","Aug 5\u20136","FEAT-001, FEAT-002","\u2014"],["FEAT-030","Stories data model + JSON","1","Must","Blocked","Sam","Aug 7","\u2014","Comms: photos + permissions"],["FEAT-031","Build /stories index","1","Must","Open","Sam","Aug 10\u201311","FEAT-002","Region layout; no map v1"],["FEAT-040","Build /schools page","1","Must","Open","Sam","Aug 11\u201312","FEAT-002","\u2014"],["FEAT-041","School discovery form","1","Should","Open","Sam","Aug 12","FEAT-040","Form destination TBD"],["FEAT-050","Build /give gateway","1","Must","Open","Sam","Aug 6\u20137","FEAT-002","May redirect to /give/monthly"],["FEAT-051","Build /give/monthly Homeroom page","1","Must","Blocked","Sam","Aug 6\u20137","FEAT-050, FEAT-060","Keela + tier decision (D-01, D-02)"],["FEAT-060","Keela donation integration","1","Must","Blocked","Sam","Aug 21\u201323","\u2014","Finance URLs needed before wiring"],["FEAT-070","Newsletter integration (Flodesk)","1","Must","Open","Sam","Aug 20\u201321","FEAT-010","Flodesk creds"],["FEAT-071","Privacy and Terms pages","1","Must","Open","Sam","Aug 18\u201319","FEAT-002","Legal copy (D-08)"],["FEAT-080","Analytics (GA4, Clarity, PostHog Cloud, Osano, Sentry)","1","Must","Open","Sam","Aug 17\u201319","FEAT-002","All analytics/observability decisions resolved"],["FEAT-081","SEO baseline","1","Should","Open","Sam","Aug 19\u201320","FEAT-002","\u2014"],["FEAT-090","Events page","1.5","Should","In sprint","Sam","Aug 13\u201314","FEAT-002","Kristina scope includes Events"],["FEAT-032","Individual story pages /stories/[slug]","1.5","Should","Scheduled","Sam","Aug 14","FEAT-031","\u2014"],["FEAT-033","Interactive global map","2","Nice","Paused","Sam","\u2014","FEAT-031","Phase 2"],["FEAT-093","About Us page (v1 single page)","1 or 2","Should","Pending","Sam / Veron","TBD \u2014 fast-follow Aug 14+","FEAT-002","Veron design + content briefs (D-05)"],["FEAT-100","Pre-launch QA","1","Must","Open","Sam","Aug 20\u201321","All must-haves","a11y, Lighthouse \u226585; Nav + WJ sign-off"],["FEAT-101","Production deploy + DNS","1","Must","Open","Sam","Aug 24\u201328","FEAT-100","contentment.org cutover \u2014 go-live window"]],"externalBlockers":[["Blocker","Waiting on","Gates","Needed by","Impact if delayed"],["Design handoff (all pages)","Dave + Veron","Entire dev sprint","Aug 3","Dev cannot start without locked designs"],["Live Keela checkout URLs","Finance","FEAT-060, FEAT-051","Aug 21 (pre-launch)","Cannot launch live donations"],["Homeroom tier amounts","Leadership / Finance","FEAT-051, FEAT-060","Aug 7","Copy + Keela product mismatch"],["Story photos + permissions","Comms / Programs","FEAT-030","Aug 10","Stories ships with draft copy only"],["Legal copy (Privacy, Terms)","Legal / Ops","FEAT-071","Aug 17","Cannot public launch \u2014 Aug 24 go-live at risk"],["Social media URLs","Comms","FEAT-004","Aug 5","Footer placeholders remain"],["Event calendar dates","Events","FEAT-090","Aug 13","TBC labels on event cards"],["About Us copy/design","Content + Veron","FEAT-093","Aug 14 (or fast-follow)","Fast-follow after sprint; doesn\'t block go-live"],["Nav + WJ final approval","Nav, WJ","FEAT-101","Aug 21","DNS cutover cannot proceed without sign-off"]],"phase2Deferred":[["Item","Route / asset","Reason deferred","Target phase"],["Interactive global educator map","/stories map component","Complexity; region-scroll covers v1","Phase 2"],["Story Board","/story-board","Paused per team decision","Phase 2"],["Foundation Reach Map","/foundation-reach-map","Paused per team decision","Phase 2"],["Homeroom gated hub","/homeroom","Member auth + content not ready","Phase 2"],["About Us sub-pages (5)","/about/*","Content briefs in progress; v1 = single page","Phase 2"],["Get Involved sub-pages","/give/corporate, etc.","Not in Kristina 7-page scope","Phase 2"],["Impact page (main nav)","/impact","Content boundary with /about/impact","Phase 2"],["Press & Media","/press","Not launch blocker","Phase 2"],["Festival / 10th anniversary campaigns","/festival, /10years","Need campaign briefs (4-6 wk lead)","Phase 2"]]}';

// Tickets and Decisions are the only tabs the team edits directly — each
// gets its own tab so status/owner/blocker columns and conditional
// formatting are easy to work with.
const TAB_KEYS = {
  tickets: 'Tickets',
  decisions: 'Decisions',
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
const LIVE_TRACKER_TABS = ['tickets', 'decisions'];

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Launch Plan')
    .addItem('Refresh from source', 'createOrRefreshLaunchPlan')
    .addItem('Install daily auto-refresh (9am)', 'installDailyRefreshTrigger')
    .addItem('Remove auto-refresh trigger', 'removeDailyRefreshTrigger')
    .addSeparator()
    .addItem('Force reseed Tickets + Decisions (discards manual edits)', 'forceReseedLiveTabs_')
    .addToUi();
}

function createOrRefreshLaunchPlan() {
  const data = loadData_();
  const ss = getOrCreateSpreadsheet_();
  buildAllTabs_(ss, data);
  writeReferenceTab_(ss, data);
  Logger.log('Done: ' + ss.getUrl());
  try {
    SpreadsheetApp.getUi().alert('Launch plan updated.\n\n' + ss.getUrl());
  } catch (e) {
    // running from editor without UI
  }
  return ss.getUrl();
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

function buildAllTabs_(ss, data) {
  Object.keys(TAB_KEYS).forEach(function (key) {
    const name = TAB_KEYS[key];
    let sheet = ss.getSheetByName(name);
    // Tickets/Decisions are the team's live working tabs once seeded — skip
    // them on refresh so we never overwrite manual status/owner edits.
    if (sheet && LIVE_TRACKER_TABS.indexOf(key) !== -1 && sheet.getLastRow() > 1) return;
    if (!sheet) sheet = ss.insertSheet(name);
    sheet.clear();
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
    'Overwrite Tickets + Decisions?',
    'This replaces the Tickets and Decisions tabs with the latest data from the repo JSON and discards any manual status/owner/blocker edits made in the Sheet. Continue?',
    ui.ButtonSet.YES_NO
  );
  if (resp !== ui.Button.YES) return;

  const data = loadData_();
  const ss = getOrCreateSpreadsheet_();
  LIVE_TRACKER_TABS.forEach(function (key) {
    const name = TAB_KEYS[key];
    let sheet = ss.getSheetByName(name);
    if (!sheet) sheet = ss.insertSheet(name);
    sheet.clear();
    const rows = data[key];
    if (!rows || !rows.length) return;
    sheet.getRange(1, 1, rows.length, rows[0].length).setValues(rows);
    formatDataTab_(sheet, rows[0].length, key);
  });
  ui.alert('Tickets and Decisions reseeded from source.');
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
    ['Refresh', 'Launch Plan menu → Refresh from source. Updates this tab only — Tickets/Decisions are protected once seeded (see Force reseed).'],
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
    sheet.getRange(2, 1, lastRow, numCols).createFilter();
  }

  // Tab-specific conditional formatting
  if (tabKey === 'tickets') applyStatusFormatting_(sheet, findCol_(sheet, 'Status'));
  if (tabKey === 'decisions') applyDecisionStatus_(sheet, findCol_(sheet, 'Status'));
}

function findCol_(sheet, headerName) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  return headers.indexOf(headerName) + 1;
}

function applyStatusFormatting_(sheet, col) {
  if (col < 1) return;
  const rules = sheet.getConditionalFormatRules();
  const range = sheet.getRange(2, col, sheet.getLastRow() - 1, 1);
  ['Blocked', 'Paused'].forEach(function (s) {
    rules.push(SpreadsheetApp.newConditionalFormatRule().whenTextContains(s).setBackground(COLORS.blocked).setRanges([range]).build());
  });
  ['Done', 'Resolved', 'Ready', 'In Progress', 'In sprint'].forEach(function (s) {
    rules.push(SpreadsheetApp.newConditionalFormatRule().whenTextContains(s).setBackground(COLORS.done).setRanges([range]).build());
  });
  sheet.setConditionalFormatRules(rules);
}

function applyDecisionStatus_(sheet, col) {
  applyStatusFormatting_(sheet, col);
}
