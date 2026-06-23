/**
 * Google Drive share links — optional PDF / Word / Google Doc copies of briefs.
 *
 * Do NOT upload .md planning files from docs/ or docs/planning/ to public Drive.
 * Those stay in the private GitHub repo only.
 *
 * If you export a brief for stakeholders: Share → Anyone with the link → Viewer.
 * Paste the URL below. Leave '' to hide that link until ready.
 */
window.TCF_DRIVE_LINKS = {
  folder: 'https://drive.google.com/drive/folders/1J38QYWHZfoLKZl4NGUXOk9rXTHG92lOJ?usp=sharing',

  teamBrief:       'https://docs.google.com/document/d/1HcruJGaNEBU9waZjw4O_zHlDNPfMXN2N/edit?usp=sharing',
  techBrief:       'https://docs.google.com/document/d/1i12exlu7w4-O1ZK-8DKiEXXgqRg-DQV9/edit?usp=sharing',
  growthBrief:     'https://docs.google.com/document/d/1arSvTRUjaZD-NsKwr7IYQ9rs4H5PoU6H/edit?usp=sharing',
  automationBrief: 'https://docs.google.com/document/d/1Fz-kU_cL1BwtP1VTmak42TCha3iiPpkC/edit?usp=sharing',
  decisions:       'https://docs.google.com/document/d/16bxr4Wx-3WFzcK8tVOR8dmo4gXgNFfHf/edit?usp=sharing',
};

/* ─── Google Drive SVG icon (official coloured triangle logo) ─────────────── */
var DRIVE_ICON_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 87.3 78" aria-hidden="true" focusable="false"' +
  ' style="width:18px;height:16px;flex-shrink:0;display:inline-block;vertical-align:middle">' +
  '<path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>' +
  '<path d="M43.65 25 29.9 1.2C28.55 2 27.4 3.1 26.6 4.5L1.2 48.5C.4 49.9 0 51.45 0 53h27.45z" fill="#00ac47"/>' +
  '<path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H59.85l5.65 10.8z" fill="#ea4335"/>' +
  '<path d="M43.65 25 57.4 1.2C56.05.4 54.5 0 52.95 0H34.35c-1.55 0-3.1.4-4.45 1.2z" fill="#00832d"/>' +
  '<path d="M59.85 53H27.45L13.7 76.8c1.35.8 2.9 1.2 4.45 1.2h50.6c1.55 0 3.1-.4 4.45-1.2z" fill="#2684fc"/>' +
  '<path d="M73.4 26.5l-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25l16.2 28H87.3c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>' +
  '</svg>';

/* ─── External link arrow ─────────────────────────────────────────────────── */
var ARROW_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" aria-hidden="true"' +
  ' style="width:11px;height:11px;flex-shrink:0;opacity:.8">' +
  '<path d="M3.5 1H11V8.5M11 1L1 11" stroke="currentColor" stroke-width="1.8"' +
  ' stroke-linecap="round" stroke-linejoin="round" fill="none"/>' +
  '</svg>';

(function () {
  /* ── Inject styles ──────────────────────────────────────────────────────── */
  var styleId = 'tcf-drive-style-v3';
  if (!document.getElementById(styleId)) {
    var s = document.createElement('style');
    s.id = styleId;
    s.textContent = [
      /* Banner strip shown on individual brief pages */
      '.drive-banner{',
        'background:#fff;',
        'border-top:3px solid #4285F4;',
        'border-bottom:1px solid rgba(66,133,244,.2);',
        'padding:12px 0;',
        'box-shadow:0 4px 18px rgba(66,133,244,.12);',
      '}',
      '.drive-banner .wrap{display:flex;flex-wrap:wrap;align-items:center;gap:10px 14px}',

      /* Badge pill with icon */
      '.drive-badge{',
        'display:inline-flex;align-items:center;gap:7px;',
        'background:#f1f3fd;border:1.5px solid #4285F4;',
        'color:#174ea6;font-weight:700;font-size:11px;',
        'text-transform:uppercase;letter-spacing:.08em;',
        'padding:5px 12px;border-radius:7px;white-space:nowrap;flex-shrink:0;',
      '}',

      /* Hint text */
      '.drive-hint{color:#3C3B43;font-size:13px;margin:0;flex:1;min-width:140px}',
      '.drive-hint strong{color:#174ea6}',

      /* Primary Drive button */
      '.drive-btn{',
        'display:inline-flex;align-items:center;gap:7px;',
        'background:#4285F4;color:#fff;',
        'font-weight:700;font-size:13px;padding:9px 16px;border-radius:8px;',
        'text-decoration:none;white-space:nowrap;',
        'box-shadow:0 2px 8px rgba(66,133,244,.35);',
        'transition:background .14s,box-shadow .14s,transform .13s;',
      '}',
      '.drive-btn:hover{background:#1a73e8;color:#fff;text-decoration:none;',
        'box-shadow:0 4px 16px rgba(66,133,244,.45);transform:translateY(-1px)}',

      /* Secondary (folder) button */
      '.drive-btn-secondary{',
        'background:#fff;border:2px solid #4285F4;color:#174ea6;',
        'box-shadow:0 1px 4px rgba(66,133,244,.15);',
      '}',
      '.drive-btn-secondary:hover{background:#f1f3fd;color:#174ea6}',

      /* ── docs/index.html top strip ────────────────────────────────────── */
      '.drive-index-banner{',
        'background:linear-gradient(135deg,#e8f0fe 0%,#f1f3fd 100%);',
        'border-top:3px solid #4285F4;border-bottom:1px solid rgba(66,133,244,.2);',
        'padding:12px 0;box-shadow:0 4px 14px rgba(66,133,244,.1);',
      '}',
      '.drive-index-banner .wrap{display:flex;flex-wrap:wrap;align-items:center;gap:10px 14px}',
      '.drive-index-banner .drive-hint{color:#174ea6;font-weight:600}',

      /* ── docs/index.html panel ────────────────────────────────────────── */
      '.drive-index-panel{',
        'background:#fff;',
        'border:2px solid #4285F4;',
        'border-radius:16px;',
        'padding:20px 22px 18px;',
        'margin-bottom:8px;',
        'box-shadow:0 8px 32px rgba(66,133,244,.14);',
      '}',
      '.drive-index-head{display:flex;flex-wrap:wrap;align-items:center;gap:10px 14px;margin-bottom:6px}',
      '.drive-index-head h3{font-size:15px;font-weight:700;color:#174ea6;margin:0}',
      '.drive-index-intro{font-size:12.5px;color:#3C3B43;margin:0 0 14px;line-height:1.55}',

      /* Grid of individual links */
      '.drive-index-list{margin:0;padding:0;list-style:none;display:grid;gap:10px}',
      '@media (min-width:560px){.drive-index-list{grid-template-columns:1fr 1fr}}',
      '.drive-index-list li{padding:0;border:none}',
      '.drive-index-list a{',
        'display:flex;align-items:center;gap:10px;',
        'font-weight:600;font-size:13px;color:#174ea6;text-decoration:none;',
        'background:#f8f9fe;',
        'border:1.5px solid rgba(66,133,244,.4);',
        'border-radius:10px;padding:12px 15px;',
        'box-shadow:0 1px 4px rgba(66,133,244,.08);',
        'transition:background .13s,border-color .13s,box-shadow .13s,transform .12s;',
      '}',
      '.drive-index-list a:hover{',
        'background:#4285F4;color:#fff;text-decoration:none;border-color:#4285F4;',
        'box-shadow:0 4px 14px rgba(66,133,244,.35);transform:translateY(-1px)',
      '}',
      /* Force icon colours to white on hover via a CSS custom property trick */
      '.drive-index-list a:hover .drive-icon-blue{fill:#fff}',
      '.drive-index-list a:hover .drive-icon-green{fill:#fff}',
      '.drive-index-list a:hover .drive-icon-red{fill:#fff}',
      '.drive-index-list a:hover .drive-icon-yellow{fill:#fff}',
      '.drive-index-list a .link-label{flex:1}',
      '.drive-index-list .pending{',
        'display:flex;align-items:center;gap:10px;',
        'font-size:12px;font-weight:500;font-style:italic;color:#5f6368;',
        'background:#f9f9f9;border:1.5px dashed rgba(66,133,244,.28);',
        'border-radius:10px;padding:12px 15px;',
      '}',

      /* Folder button (full width, below grid) */
      '.drive-folder-btn{',
        'display:flex;align-items:center;gap:10px;',
        'font-weight:700;font-size:13px;color:#174ea6;text-decoration:none;',
        'background:#e8f0fe;border:2px solid #4285F4;border-radius:10px;',
        'padding:13px 16px;margin-top:10px;',
        'box-shadow:0 2px 8px rgba(66,133,244,.14);',
        'transition:background .13s,transform .12s;',
      '}',
      '.drive-folder-btn:hover{background:#4285F4;color:#fff;text-decoration:none;transform:translateY(-1px)}',

      '@media print{.drive-banner,.drive-index-banner,.drive-index-panel{display:none!important}}',
    ].join('');
    document.head.appendChild(s);
  }

  var labels = {
    folder:          'All Briefs Folder',
    teamBrief:       'Team Brief',
    techBrief:       'Technical Brief',
    growthBrief:     'Growth & SEO Brief',
    automationBrief: 'Automation & Integrations Brief',
    decisions:       'Open Technical Decisions',
  };

  var keys = ['teamBrief', 'techBrief', 'growthBrief', 'automationBrief', 'decisions'];

  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/"/g, '&quot;');
  }

  /* Coloured icon — colours work on white bg; turn white on dark bg via CSS */
  function driveIcon() { return DRIVE_ICON_SVG; }

  /* ── Individual brief page: banner below nav ──────────────────────────────── */
  function mountBanner(key) {
    var links = window.TCF_DRIVE_LINKS || {};
    var url   = links[key];
    if (!url) return;

    var label  = labels[key] || 'document';
    var anchor = document.querySelector('nav.doc-nav, nav.top-nav, header.page-header');
    var banner = document.createElement('div');
    banner.className = 'drive-banner no-print';
    banner.innerHTML =
      '<div class="wrap">' +
        '<span class="drive-badge">' + driveIcon() + '&nbsp;Google Drive</span>' +
        '<p class="drive-hint">Open the shareable <strong>Google Doc</strong> version of this brief</p>' +
        '<a class="drive-btn" href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' +
          driveIcon() + '&nbsp;Open ' + esc(label) + '&nbsp;' + ARROW_SVG +
        '</a>' +
        (links.folder
          ? '<a class="drive-btn drive-btn-secondary" href="' + esc(links.folder) + '" target="_blank" rel="noopener noreferrer">' +
              driveIcon() + '&nbsp;All briefs folder' +
            '</a>'
          : '') +
      '</div>';

    if (anchor && anchor.parentNode) {
      anchor.parentNode.insertBefore(banner, anchor.nextSibling);
    } else {
      document.body.insertBefore(banner, document.body.firstChild);
    }
  }

  /* ── docs/index.html: slim banner above panel ─────────────────────────────── */
  function mountIndexBanner() {
    var links  = window.TCF_DRIVE_LINKS || {};
    if (!links.folder) return;
    var header = document.querySelector('header.page-header');
    var banner = document.createElement('div');
    banner.className = 'drive-index-banner no-print';
    banner.innerHTML =
      '<div class="wrap">' +
        '<span class="drive-badge">' + driveIcon() + '&nbsp;Google Drive</span>' +
        '<p class="drive-hint">Google Doc copies of all briefs — open below or browse the full folder</p>' +
        '<a class="drive-btn" href="' + esc(links.folder) + '" target="_blank" rel="noopener noreferrer">' +
          driveIcon() + '&nbsp;Open all briefs&nbsp;' + ARROW_SVG +
        '</a>' +
      '</div>';
    if (header && header.parentNode) {
      header.parentNode.insertBefore(banner, header.nextSibling);
    }
  }

  /* ── docs/index.html: Drive link panel ────────────────────────────────────── */
  function renderIndexList() {
    var container = document.getElementById('drive-links-list');
    if (!container) return;
    var links = window.TCF_DRIVE_LINKS || {};
    container.className = 'drive-index-panel no-print';

    var html =
      '<div class="drive-index-head">' +
        '<span class="drive-badge">' + driveIcon() + '&nbsp;Google Drive</span>' +
        '<h3>Open a brief in Google Docs</h3>' +
      '</div>' +
      '<p class="drive-index-intro">Shareable Google Doc copies for stakeholders and team members. Markdown planning files stay in the private GitHub repo.</p>' +
      '<ul class="drive-index-list">';

    keys.forEach(function (key) {
      var url   = links[key];
      var label = labels[key] || key;
      html += '<li>';
      if (url) {
        html +=
          '<a href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' +
            driveIcon() +
            '<span class="link-label">' + esc(label) + '</span>' +
            ARROW_SVG +
          '</a>';
      } else {
        html += '<span class="pending">' + esc(label) + ' — link not set yet (edit drive-links.js)</span>';
      }
      html += '</li>';
    });

    html += '</ul>';

    if (links.folder) {
      html +=
        '<a class="drive-folder-btn" href="' + esc(links.folder) + '" target="_blank" rel="noopener noreferrer">' +
          driveIcon() +
          '<span style="flex:1">Browse complete briefs folder in Google Drive</span>' +
          ARROW_SVG +
        '</a>';
    }

    container.innerHTML = html;
  }

  /* ── Entry point ─────────────────────────────────────────────────────────── */
  if (window.TCF_DRIVE_PAGE_KEY) { mountBanner(window.TCF_DRIVE_PAGE_KEY); }
  if (window.TCF_DRIVE_INDEX)    { mountIndexBanner(); renderIndexList(); }

})();
