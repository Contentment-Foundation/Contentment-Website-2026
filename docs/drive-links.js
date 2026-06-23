/**
 * Google Drive share links for project docs.
 *
 * After uploading to Drive: Share → Anyone with the link → Viewer.
 * Paste the share URL below. Leave '' to hide that link until ready.
 *
 * Edit this file only — all HTML briefs read from here.
 */
window.TCF_DRIVE_LINKS = {
  /** Optional: folder containing all briefs + planning docs */
  folder: '',

  /** Published HTML briefs (web versions) */
  teamBrief: '',
  techBrief: '',
  growthBrief: '',
  automationBrief: '',

  /** Planning markdown exports (Word/PDF on Drive — optional) */
  websiteArchitecture: '',
  technicalArchitecture: '',
  decisions: '',
  prd: '',
  messagingCopy: '',
};

(function () {
  var styleId = 'tcf-drive-banner-style';
  if (!document.getElementById(styleId)) {
    var s = document.createElement('style');
    s.id = styleId;
    s.textContent =
      '.drive-banner{background:#e8f4f8;border-bottom:1px solid rgba(2,78,112,.15);padding:10px 0;font-size:13px}' +
      '.drive-banner .wrap{display:flex;flex-wrap:wrap;align-items:center;gap:10px 18px}' +
      '.drive-banner a{color:#0080B0;font-weight:600;text-decoration:none}' +
      '.drive-banner a:hover{text-decoration:underline}' +
      '.drive-banner .drive-muted{color:#3C3B43;font-size:12px}' +
      '.drive-index-list{margin:0;padding:0;list-style:none}' +
      '.drive-index-list li{padding:6px 0;border-bottom:1px solid rgba(2,78,112,.1);font-size:13px}' +
      '.drive-index-list li:last-child{border-bottom:none}' +
      '.drive-index-list a{font-weight:600;color:#0080B0;text-decoration:none}' +
      '.drive-index-list a:hover{text-decoration:underline}' +
      '.drive-index-list .pending{color:#3C3B43;font-style:italic;font-weight:400}';
    document.head.appendChild(s);
  }

  var labels = {
    folder: 'All project docs (folder)',
    teamBrief: 'Team Brief',
    techBrief: 'Technical Development Brief',
    growthBrief: 'Growth, SEO & Analytics Brief',
    automationBrief: 'Automation & Integrations Brief',
    websiteArchitecture: 'Website Architecture',
    technicalArchitecture: 'Technical Architecture',
    decisions: 'Open Technical Decisions',
    prd: 'PRD',
    messagingCopy: 'Messaging & Copy',
  };

  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/"/g, '&quot;');
  }

  function mountBanner(key) {
    var links = window.TCF_DRIVE_LINKS || {};
    var url = links[key];
    if (!url) return;

    var label = labels[key] || 'document';
    var anchor = document.querySelector('nav.doc-nav, nav.top-nav, header.page-header');
    var banner = document.createElement('div');
    banner.className = 'drive-banner no-print';
    banner.innerHTML =
      '<div class="wrap">' +
      '<span class="drive-muted">Google Drive:</span> ' +
      '<a href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">Open ' + esc(label) + ' ↗</a>' +
      (links.folder
        ? ' <span class="drive-muted">·</span> <a href="' +
          esc(links.folder) +
          '" target="_blank" rel="noopener noreferrer">All docs folder ↗</a>'
        : '') +
      '</div>';

    if (anchor && anchor.parentNode) {
      anchor.parentNode.insertBefore(banner, anchor.nextSibling);
    } else {
      document.body.insertBefore(banner, document.body.firstChild);
    }
  }

  function renderIndexList() {
    var container = document.getElementById('drive-links-list');
    if (!container) return;

    var links = window.TCF_DRIVE_LINKS || {};
    var keys = [
      'folder',
      'teamBrief',
      'techBrief',
      'growthBrief',
      'automationBrief',
      'websiteArchitecture',
      'technicalArchitecture',
      'decisions',
      'prd',
      'messagingCopy',
    ];

    var html = '<ul class="drive-index-list">';
    keys.forEach(function (key) {
      var url = links[key];
      var label = labels[key] || key;
      html += '<li>';
      if (url) {
        html += '<a href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' + esc(label) + ' ↗</a>';
      } else {
        html += '<span class="pending">' + esc(label) + ' — link not set yet (edit docs/drive-links.js)</span>';
      }
      html += '</li>';
    });
    html += '</ul>';
    container.innerHTML = html;
  }

  if (window.TCF_DRIVE_PAGE_KEY) {
    mountBanner(window.TCF_DRIVE_PAGE_KEY);
  }
  if (window.TCF_DRIVE_INDEX) {
    renderIndexList();
  }
})();
