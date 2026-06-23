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

  teamBrief: 'https://docs.google.com/document/d/1HcruJGaNEBU9waZjw4O_zHlDNPfMXN2N/edit?usp=sharing',
  techBrief: 'https://docs.google.com/document/d/1i12exlu7w4-O1ZK-8DKiEXXgqRg-DQV9/edit?usp=sharing',
  growthBrief: 'https://docs.google.com/document/d/1arSvTRUjaZD-NsKwr7IYQ9rs4H5PoU6H/edit?usp=sharing',
  automationBrief: 'https://docs.google.com/document/d/1Fz-kU_cL1BwtP1VTmak42TCha3iiPpkC/edit?usp=sharing',
  decisions: 'https://docs.google.com/document/d/16bxr4Wx-3WFzcK8tVOR8dmo4gXgNFfHf/edit?usp=sharing',
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
    folder: 'All briefs (folder)',
    teamBrief: 'Team Brief',
    techBrief: 'Technical Brief',
    growthBrief: 'Growth Brief',
    automationBrief: 'Automation Brief',
    decisions: 'Open Technical Decisions',
  };

  var keys = ['folder', 'teamBrief', 'techBrief', 'growthBrief', 'automationBrief', 'decisions'];

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
          '" target="_blank" rel="noopener noreferrer">All briefs folder ↗</a>'
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
    var html = '<ul class="drive-index-list">';
    keys.forEach(function (key) {
      var url = links[key];
      var label = labels[key] || key;
      html += '<li>';
      if (url) {
        html += '<a href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' + esc(label) + ' ↗</a>';
      } else {
        html += '<span class="pending">' + esc(label) + ' — optional; edit docs/drive-links.js</span>';
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
