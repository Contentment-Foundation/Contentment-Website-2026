/**
 * contentment.org Launch Plan — Google Sheets builder
 *
 * SETUP (one time):
 * 1. Go to https://script.google.com → New project
 * 2. Paste this entire file → Save
 * 3. Set CONFIG.JSON_URL after pushing launch-plan-data.json to GitHub (optional but recommended)
 * 4. Run createOrRefreshLaunchPlan → authorize → check logs for Sheet URL
 * 5. Optional: run installDailyRefreshTrigger for auto-sync from GitHub
 *
 * REFRESH: Run createOrRefreshLaunchPlan again, or use menu "Launch Plan → Refresh from source"
 */

const CONFIG = {
  SPREADSHEET_ID: '', // leave blank to create new; paste ID to update existing
  JSON_URL: '', // e.g. https://raw.githubusercontent.com/YOUR_ORG/Contentment-Website-2026/main/docs/planning/launch-plan-data.json
  SHEET_TITLE: 'contentment.org — Launch Plan',
  TIMEZONE: 'America/Los_Angeles',
};

// Embedded fallback — updated from docs/planning/launch-plan-data.json
const EMBEDDED_JSON = '{"meta":{"title":"contentment.org \\u2014 Launch Plan","version":"2026-07-07","owner":"Somesh Bhardwaj","contact":"somesh@contentment.org","summary":"Phase 1 page build (2 weeks) + launch buffer. Dave\'s Netlify drafts merge into one site on contentment.org. Story Board and Reach Map deferred to Phase 2."},"overview":[["Metric","Value"],["Page build window","2 weeks (full-time)"],["Launch-ready buffer","+3 to 5 days (integrations + QA)"],["Content pages (Dave drafts)","6 live + About Us when ready"],["Launch utility pages","Privacy, Terms, Updates, 404"],["Production domain","contentment.org (Vercel)"],["Build approach","Merge Dave HTML drafts \\u2192 Astro multi-page site"],["Phase 2 deferred","Interactive map, Story Board, /homeroom gate"],["Bottom line","2 weeks feasible for integrated site; launch depends on Keela + legal + final content"]],"timeline":[["Week","Days","Work stream","Deliverables","Owner","Dependencies"],["Week 1","Day 1-2","Foundation","Astro scaffold, shared layout, CSS tokens, nav/footer, mobile menu","Somesh","Design freeze per page helps"],["Week 1","Day 2-3","Homepage","Migrate Dave homepage draft to /","Somesh","comfy-brigadeiros draft"],["Week 1","Day 3-4","Why + Get Involved","Build /why and /give (Homeroom)","Somesh","Tier amount decision before Keela wire"],["Week 1","Day 4-5","Cross-page","Unify nav labels, footer links, reduced-motion fallbacks","Somesh","Social URLs from comms"],["Week 2","Day 6-8","Stories","Region-scroll layout at /stories (no map)","Somesh","Comms photos optional for v1"],["Week 2","Day 8-9","For Schools","Ripple interaction + comparison table + form shell","Somesh","Form destination decision"],["Week 2","Day 9-10","Events","Filter chips, event cards, email capture shell","Somesh","Some event dates TBC"],["Week 2","Day 10","About Us","Build when draft lands (or fast-follow)","Somesh","Content team"],["Buffer","Day 11-13","Launch prep","Privacy, Terms, /updates, 404, cookie banner, analytics, SEO","Somesh","Legal copy, Flodesk creds"],["Buffer","Day 13-15","Integrations + QA","Keela wire, newsletter live, a11y + Lighthouse QA, DNS cutover","Somesh","Finance Keela URLs"]],"pages":[["Page","Route","Phase","Dave draft URL","Draft status","Build complexity","In Kristina list","Notes"],["Homepage","/","1","https://comfy-brigadeiros-00c4b6.netlify.app/","Draft","Medium","Yes","5-step How Change Happens scroll; updated from earlier prototype"],["Why Teacher Wellbeing","/why","1","https://loquacious-zuccutto-ec29f4.netlify.app/","Draft","Medium","Yes","FAQ accordion, CEO + teacher video slots"],["Stories","/stories","1","https://heartfelt-nougat-9d490a.netlify.app/","Draft","Medium-High","Yes","Region nav + long sections; NO interactive map in v1"],["For Schools","/schools","1","https://timely-dasik-427334.netlify.app/","Draft","High","Yes","Ripple diagram + comparison table; pricing TBD"],["Events & Experiences","/events","1.5","https://helpful-elf-ba3c06.netlify.app/","Draft","Medium-High","Yes","Filter chips, access badges; some dates TBC"],["Get Involved (Homeroom)","/give or /give/monthly","1","https://cute-palmier-4c93e1.netlify.app/","Draft","Low-Medium","Yes","Homeroom conversion page; /give gateway decision pending"],["About Us","/about","1 or 2","\\u2014","Being drafted","TBD","Yes","Single page v1 vs 5 sub-pages \\u2014 decision needed"],["Privacy Policy","/privacy","1","\\u2014","Not started","Low","No","Legal copy required"],["Terms of Use","/terms","1","\\u2014","Not started","Low","No","Legal copy required"],["Newsletter signup","/updates","1","\\u2014","Not started","Low","No","Footer Subscribe destination"],["404 page","/404","1","\\u2014","Not started","Low","No","Branded error page"],["Individual story","/stories/[slug]","1.5","\\u2014","Not started","Medium","No","After index ships"],["Press & Media","/press","2","\\u2014","Not started","Low","No","Footer / outreach"],["Impact (main nav)","/impact","2","\\u2014","Not started","Medium","No","Distinct from /about/impact"],["Homeroom member hub","/homeroom","2","\\u2014","Not started","High","No","Password-gated; not in public nav"],["Festival campaign","/festival/2026","2","\\u2014","Not started","Medium","No","Linked from Events; needs campaign brief"],["Story Board prototype","/story-board","2","site/story-board.html","Paused","\\u2014","No","Phase 2 \\u2014 not in 2-week sprint"],["Foundation Reach Map","/foundation-reach-map","2","site/foundation-reach-map.html","Paused","\\u2014","No","Phase 2 \\u2014 not in 2-week sprint"]],"designNotes":[["Page","Item","Risk level","Mitigation"],["Homepage","Dave draft differs from site/index.html prototype","Low","Build from Dave\'s latest Netlify draft"],["Why","Video embed placeholders (CEO + 3x teacher 9:16)","Medium","Build slots now; need hosted URLs before complete"],["Stories","Longest editorial page in v1","Medium","No map in Phase 1; region-scroll only"],["For Schools","Interactive ripple rings","High","Accessible static fallback for prefers-reduced-motion"],["For Schools","Horizontal comparison table on mobile","Medium","Side-scroll with clear affordance"],["For Schools","Pricing amounts TBD","Low","Ship with placeholders"],["Events","Filter chips (open / Homeroom / virtual / in-person)","Medium","Real JS logic, not static layout"],["Events","Some event dates TBC","Medium","Expect content updates after first build"],["Events","Email capture embed slot","Low","Wire to Flodesk when creds ready"],["Get Involved","Video embed placeholder","Low","Shell now, URL later"],["All pages","Drafts still being finalized","High","Design freeze per page before dev starts"],["All pages","Homeroom tiers inconsistent ($5/$25/$100 vs $25/$50/$100)","High","One tier decision before Keela wiring"]],"decisions":[["ID","Decision","Options","Owner","Status","Blocks","Priority"],["D-01","Homeroom tier amounts","$5/$25/$100 vs $25/$50/$100","Leadership / Finance","Open","All donation CTAs, Keela products","Critical"],["D-02","Keela checkout URLs","Live hosted links per tier","Finance","Open","Entire conversion path","Critical"],["D-03","/give routing","Gateway page vs redirect to Homeroom","Product / Kristina","Open","Scope in 2-week sprint","High"],["D-04","School inquiry form destination","Flodesk vs Keela vs custom API","Partnerships + Eng","Open","For Schools form backend","High"],["D-05","About Us scope v1","Single page vs 5 sub-pages","Content / Kristina","Open","About build estimate","High"],["D-06","Event calendar 2026","Confirmed dates and venues","Events team","Open","Events page cards","Medium"],["D-07","Social media URLs","LinkedIn, Instagram, YouTube","Comms","Open","Footer links","Medium"],["D-08","Legal copy","Privacy + Terms text","Legal / Ops","Open","Launch","Critical"],["D-09","EIN for Homeroom FAQ","Legal copy on giving page","Finance","Open","/give completeness","Medium"],["D-10","Annual report format","Embedded vs PDF vs both","Leadership","Open","Stories transparency section","Low"],["D-11","Astro 4.x build","Astro vs static partials","Engineering","Resolved","\\u2014","\\u2014"],["D-12","Analytics stack","GA4 + Clarity + PostHog","Engineering","Resolved","\\u2014","\\u2014"],["D-13","Cookie consent","Banner + GA4 Consent Mode v2","Engineering","Resolved","\\u2014","\\u2014"],["D-14","Transactional email","Resend (recommended)","Engineering","Recommended","School form notifications","Medium"],["D-15","Rate limiting","Upstash Redis (recommended)","Engineering","Recommended","Custom API routes","Medium"],["D-16","PostHog hosting","Cloud vs self-hosted GCP","Engineering","Open","Analytics setup","Low"],["D-17","Cookie consent UI","Osano vs custom dialog","Team","Open","Privacy + analytics","Low"],["D-18","Newsletter integration","Flodesk embed vs custom API","Engineering","Open","Newsletter ticket","Medium"]],"integrations":[["Integration","Phase","Effort","Can build UI first?","Dependency","Owner","Status","Notes"],["Keela donations","1","0.5-1 day once URLs exist","Yes","Finance \\u2014 live checkout URLs","Finance + Somesh","Blocked","Critical path for launch"],["Newsletter (Flodesk)","1","0.5-2 days","Yes","Flodesk embed or API key","Comms + Somesh","Open","Footer + /updates + Events capture"],["School discovery form","1","1-2 days","Yes","Form destination decision","Partnerships + Somesh","Open","Custom API needs Resend + Upstash"],["Analytics GA4 + Clarity","1","1-1.5 days","Partial","GA4 property ID","Somesh","Open","Cookie banner required for EU/UK"],["Cookie consent banner","1","0.5-1 day","No","Legal copy in /privacy","Somesh + Legal","Open","GA4 Consent Mode v2"],["PostHog","1","0.5-1 day","Yes","Hosting decision","Somesh","Open","Cookieless mode available"],["SEO baseline","1","1 day","Yes","None","Somesh","Open","Meta, OG, sitemap, favicon"],["Resend (transactional email)","1","0.5 day","No","Domain verification","Somesh","Recommended","School notifications, API emails"],["Upstash rate limiting","1","0.5 day","No","Upstash account","Somesh","Recommended","If custom /api routes used"],["Event RSVP API","1.5","1-2 days","Yes","Event dates + Zoom workflow","Events + Somesh","Scheduled","See automation brief"],["Homeroom password gate","2","2-3 days","N/A","Member content brief","Somesh","Phase 2","Not in 2-week sprint"],["DNS cutover contentment.org","1","0.5 day","N/A","QA pass complete","Somesh","Open","Final launch step"]],"tickets":[["ID","Title","Phase","Priority","Status","Owner","Depends on","Blocker / Note"],["FEAT-001","Extract shared layout (CSS, nav, footer)","1","Must","Open","Somesh","\\u2014","\\u2014"],["FEAT-002","Multi-page routing scaffold (Astro)","1","Must","Ready","Somesh","FEAT-001","Astro 4.x confirmed"],["FEAT-003","Mobile navigation drawer","1","Must","Open","Somesh","FEAT-001","\\u2014"],["FEAT-004","Wire all nav and footer links","1","Must","Open","Somesh","FEAT-002","Social URLs from comms"],["FEAT-010","Migrate homepage to /","1","Must","In Progress","Dave + Somesh","FEAT-001, FEAT-002","Use Dave Netlify draft"],["FEAT-020","Build /why page","1","Must","Open","Somesh","FEAT-001, FEAT-002","\\u2014"],["FEAT-030","Stories data model + JSON","1","Must","Blocked","Somesh","\\u2014","Comms: photos + permissions"],["FEAT-031","Build /stories index","1","Must","Open","Somesh","FEAT-002","Region layout; no map v1"],["FEAT-040","Build /schools page","1","Must","Open","Somesh","FEAT-002","\\u2014"],["FEAT-041","School discovery form","1","Should","Open","Somesh","FEAT-040","Form destination TBD"],["FEAT-050","Build /give gateway","1","Must","Open","Somesh","FEAT-002","May redirect to /give/monthly"],["FEAT-051","Build /give/monthly Homeroom page","1","Must","Blocked","Somesh","FEAT-050, FEAT-060","Keela + tier decision"],["FEAT-060","Keela donation integration","1","Must","Blocked","Somesh","\\u2014","Finance URLs"],["FEAT-070","Newsletter integration (Flodesk)","1","Must","Open","Somesh","FEAT-010","Flodesk creds"],["FEAT-071","Privacy and Terms pages","1","Must","Open","Somesh","FEAT-002","Legal copy"],["FEAT-080","Analytics (GA4, Clarity, PostHog)","1","Must","Pending","Somesh","FEAT-002","PostHog hosting"],["FEAT-081","SEO baseline","1","Should","Open","Somesh","FEAT-002","\\u2014"],["FEAT-090","Events page","1.5","Should","In sprint","Somesh","FEAT-002","Kristina scope includes Events"],["FEAT-032","Individual story pages /stories/[slug]","1.5","Should","Scheduled","Somesh","FEAT-031","\\u2014"],["FEAT-033","Interactive global map","2","Nice","Paused","Somesh","FEAT-031","Phase 2"],["FEAT-093","About section (5 sub-pages)","2","Nice","Scheduled","Somesh","FEAT-002","Content briefs"],["FEAT-100","Pre-launch QA","1","Must","Open","Somesh","All must-haves","a11y, Lighthouse \\u226585"],["FEAT-101","Production deploy + DNS","1","Must","Open","Somesh","FEAT-100","contentment.org cutover"]],"externalBlockers":[["Blocker","Waiting on","Gates","Impact if delayed"],["Live Keela checkout URLs","Finance","FEAT-060, FEAT-051","Cannot launch live donations"],["Homeroom tier amounts","Leadership / Finance","FEAT-051, FEAT-060","Copy + Keela product mismatch"],["Story photos + permissions","Comms / Programs","FEAT-030","Stories ships with draft copy only"],["Legal copy (Privacy, Terms)","Legal / Ops","FEAT-071","Cannot public launch"],["Social media URLs","Comms","FEAT-004","Footer placeholders remain"],["Event calendar dates","Events","FEAT-090","TBC labels on event cards"],["About Us copy/design","Content","About page","Fast-follow after sprint"]],"phase2Deferred":[["Item","Route / asset","Reason deferred","Target phase"],["Interactive global educator map","/stories map component","Complexity; region-scroll covers v1","Phase 2"],["Story Board","/story-board","Paused per team decision","Phase 2"],["Foundation Reach Map","/foundation-reach-map","Paused per team decision","Phase 2"],["Homeroom gated hub","/homeroom","Member auth + content not ready","Phase 2"],["About Us sub-pages (5)","/about/*","Content briefs in progress","Phase 2"],["Get Involved sub-pages","/give/corporate, etc.","Not in Kristina 7-page scope","Phase 2"],["Impact page (main nav)","/impact","Content boundary with /about/impact","Phase 2"],["Press & Media","/press","Not launch blocker","Phase 2"],["Festival / 10th anniversary campaigns","/festival, /10years","Need campaign briefs (4-6 wk lead)","Phase 2"]]}';

const TAB_KEYS = {
  overview: 'Overview',
  timeline: 'Timeline',
  pages: 'Pages',
  designNotes: 'Design Notes',
  decisions: 'Decisions',
  integrations: 'Integrations',
  tickets: 'Tickets',
  externalBlockers: 'External Blockers',
  phase2Deferred: 'Phase 2 Deferred',
};

const COLORS = {
  header: '#024E70',
  headerFont: '#FFFFFF',
  phase1: '#E8F7F9',
  phase15: '#FFF8E6',
  phase2: '#F0F0F0',
  blocked: '#FDE8E8',
  done: '#E8F5E9',
  open: '#FFFFFF',
  overviewLabel: '#F5F5F0',
};

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Launch Plan')
    .addItem('Refresh from source', 'createOrRefreshLaunchPlan')
    .addItem('Install daily auto-refresh (9am)', 'installDailyRefreshTrigger')
    .addItem('Remove auto-refresh trigger', 'removeDailyRefreshTrigger')
    .addToUi();
}

function createOrRefreshLaunchPlan() {
  const data = loadData_();
  const ss = getOrCreateSpreadsheet_();
  buildAllTabs_(ss, data);
  writeMetaTab_(ss, data.meta);
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
  SpreadsheetApp.getUi().alert('Daily refresh installed (9:00 ' + CONFIG.TIMEZONE + ').');
}

function removeDailyRefreshTrigger() {
  ScriptApp.getProjectTriggers().forEach(function (trigger) {
    if (trigger.getHandlerFunction() === 'createOrRefreshLaunchPlan') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
}

function loadData_() {
  if (CONFIG.JSON_URL) {
    try {
      const normalizedUrl = normalizeJsonUrl_(CONFIG.JSON_URL);
      const res = UrlFetchApp.fetch(normalizedUrl, { muteHttpExceptions: true });
      if (res.getResponseCode() === 200) {
        return JSON.parse(res.getContentText());
      }
      Logger.log('JSON_URL fetch failed: ' + res.getResponseCode() + ' (' + normalizedUrl + ') — using embedded data');
    } catch (e) {
      Logger.log('JSON_URL error: ' + e + ' — using embedded data');
    }
  }
  return JSON.parse(EMBEDDED_JSON);
}

function normalizeJsonUrl_(url) {
  // Accept normal GitHub blob URLs and convert to raw URL automatically.
  // Example:
  // https://github.com/org/repo/blob/main/path/file.json
  // -> https://raw.githubusercontent.com/org/repo/main/path/file.json
  const blobMatch = url.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)$/);
  if (blobMatch) {
    return 'https://raw.githubusercontent.com/' + blobMatch[1] + '/' + blobMatch[2] + '/' + blobMatch[3] + '/' + blobMatch[4];
  }
  return url;
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
    if (!sheet) sheet = ss.insertSheet(name);
    sheet.clear();
    const rows = data[key];
    if (!rows || !rows.length) return;
    sheet.getRange(1, 1, rows.length, rows[0].length).setValues(rows);
    formatDataTab_(sheet, rows[0].length, key);
  });
  // Remove default Sheet1 if we created tabs
  const defaultSheet = ss.getSheetByName('Sheet1');
  if (defaultSheet && ss.getSheets().length > Object.keys(TAB_KEYS).length) {
    ss.deleteSheet(defaultSheet);
  }
}

function writeMetaTab_(ss, meta) {
  let sheet = ss.getSheetByName('README');
  if (!sheet) sheet = ss.insertSheet('README', 0);
  sheet.clear();
  const lines = [
    ['contentment.org Launch Plan'],
    [''],
    ['Version', meta.version || ''],
    ['Owner', meta.owner || ''],
    ['Contact', meta.contact || ''],
    [''],
    ['Summary', meta.summary || ''],
    [''],
    ['How to refresh'],
    ['1', 'Push docs/planning/launch-plan-data.json to GitHub'],
    ['2', 'Set CONFIG.JSON_URL in Apps Script to the raw GitHub URL'],
    ['3', 'Run Launch Plan → Refresh from source (or wait for daily trigger)'],
    [''],
    ['Source repo file', 'docs/planning/launch-plan-data.json'],
    ['Apps Script', 'scripts/google-sheets/LaunchPlanSheet.gs'],
  ];
  const rows = lines.map(padRowToTwoCols_);
  sheet.getRange(1, 1, rows.length, 2).setValues(rows);
  sheet.getRange(1, 1, 1, 2).merge().setFontSize(16).setFontWeight('bold').setBackground(COLORS.header).setFontColor(COLORS.headerFont);
  sheet.setColumnWidth(1, 160);
  sheet.setColumnWidth(2, 520);
  sheet.setFrozenRows(1);
}

function padRowToTwoCols_(row) {
  if (!row || !row.length) return ['', ''];
  if (row.length === 1) return [row[0], ''];
  return [row[0], row[1]];
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
  if (tabKey === 'pages') applyPhaseFormatting_(sheet, findCol_(sheet, 'Phase'));
  if (tabKey === 'tickets') applyStatusFormatting_(sheet, findCol_(sheet, 'Status'));
  if (tabKey === 'decisions') applyDecisionStatus_(sheet, findCol_(sheet, 'Status'));
  if (tabKey === 'integrations') applyIntegrationStatus_(sheet, findCol_(sheet, 'Status'));
  if (tabKey === 'designNotes') applyRiskFormatting_(sheet, findCol_(sheet, 'Risk level'));
}

function findCol_(sheet, headerName) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  return headers.indexOf(headerName) + 1;
}

function applyPhaseFormatting_(sheet, col) {
  if (col < 1) return;
  const rules = sheet.getConditionalFormatRules();
  const range = sheet.getRange(2, col, sheet.getLastRow() - 1, 1);
  rules.push(SpreadsheetApp.newConditionalFormatRule().whenTextContains('1.5').setBackground(COLORS.phase15).setRanges([range]).build());
  rules.push(SpreadsheetApp.newConditionalFormatRule().whenTextContains('2').setBackground(COLORS.phase2).setRanges([range]).build());
  rules.push(SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('1').setBackground(COLORS.phase1).setRanges([range]).build());
  sheet.setConditionalFormatRules(rules);
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

function applyIntegrationStatus_(sheet, col) {
  applyStatusFormatting_(sheet, col);
}

function applyRiskFormatting_(sheet, col) {
  if (col < 1) return;
  const rules = sheet.getConditionalFormatRules();
  const range = sheet.getRange(2, col, sheet.getLastRow() - 1, 1);
  rules.push(SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('High').setBackground(COLORS.blocked).setRanges([range]).build());
  rules.push(SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Medium').setBackground(COLORS.phase15).setRanges([range]).build());
  sheet.setConditionalFormatRules(rules);
}
