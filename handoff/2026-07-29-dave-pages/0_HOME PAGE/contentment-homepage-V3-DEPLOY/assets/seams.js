/* ============================================================================
   CONTENTMENT — SEAMS
   ----------------------------------------------------------------------------
   This is the ONLY file the tech team needs to edit to wire the site up.
   Every destination on every page resolves from the CONFIG block below.

   WHY THIS EXISTS
   The design track rebuilds page HTML regularly. If wiring lived in the HTML,
   every rebuild would silently wipe it. Keeping it here means design owns the
   markup, tech owns this file, and neither overwrites the other.

   HOW TO USE
   Fill in the CONFIG block. Leave anything unknown as '' (empty string) and the
   resolver will leave that seam alone and report it in the console. Do not edit
   below the CONFIG block.

   Version 2026-07-28.
   ========================================================================== */

window.SEAMS = {

  /* ---- Page routes. Keys are the data-page values in the markup. ---------- */
  page: {
    'about':          'about.html',
    'why-wellbeing':  'why-wellbeing.html',
    'our-impact':     'our-impact.html',   // confirmed final name — was 'stories'
    'for-schools':    'for-schools.html',
    'events':         'events.html',
    'get-involved':   'get-involved.html'
  },

  /* ---- Donation. Used by the nav pill and the footer link. --------------- */
  donate: '',

  /* ---- Join / Homeroom. The "Support a teacher monthly" button. ----------
     Leave empty to fall back to the get-involved page route above.
     Set a URL here only once the join-flow choreography is decided.        */
  join: '',

  /* ---- External links. Keys are the data-link values. -------------------- */
  link: {
    'school-platform': '',   // Sign In
    'linkedin':        '',
    'instagram':       'https://www.instagram.com/contentmentorg/',
    'facebook':        '',
    'youtube':         ''
  },

  /* ---- Embeds. Keys are the data-embed values. --------------------------
     Value is an HTML string that REPLACES the container's contents.
     e.g. 'keela-homeroom': '<iframe src="https://..." title="Donate"></iframe>'
     Leave empty to keep the existing placeholder.                          */
  embed: {
    'keela-homeroom': ''
  },

  /* ---- Behaviour ---------------------------------------------------------
     warn:      log unresolved seams to the console. Turn off in production.
     external:  add target="_blank" rel="noopener" to off-site links.       */
  options: {
    warn: true,
    external: true
  }

};

/* ============================================================================
   RESOLVER — do not edit below this line.
   ========================================================================== */
(function () {
  'use strict';

  var S = window.SEAMS || {};
  var opt = S.options || {};
  var unresolved = [];

  function isOffsite(url) {
    if (!/^https?:\/\//i.test(url)) return false;
    var host = location.hostname;
    // On file:// there is no hostname, and ''.indexOf() would match everything.
    if (!host) return true;
    try { return new URL(url).hostname !== host; }
    catch (e) { return url.indexOf(host) === -1; }
  }

  function apply(el, url, label) {
    // Empty config means "not wired yet". Leave whatever the markup already has.
    if (!url) {
      var current = el.getAttribute('href');
      if (!current || current === '#') unresolved.push(label);
      return;
    }
    el.setAttribute('href', url);
    if (opt.external && isOffsite(url)) {
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener');
    }
  }

  function resolve() {
    unresolved = [];   // reset, so re-running gives an accurate report

    // data-page
    document.querySelectorAll('[data-page]').forEach(function (el) {
      var key = el.getAttribute('data-page');
      // data-join on the same element takes precedence when it is configured
      if (el.hasAttribute('data-join') && S.join) {
        apply(el, S.join, 'join');
        return;
      }
      apply(el, (S.page || {})[key], 'page:' + key);
    });

    // data-join on an element WITHOUT data-page
    document.querySelectorAll('[data-join]:not([data-page])').forEach(function (el) {
      apply(el, S.join || (S.page || {})['get-involved'], 'join');
    });

    // data-donate
    document.querySelectorAll('[data-donate]').forEach(function (el) {
      apply(el, S.donate, 'donate');
    });

    // data-link
    document.querySelectorAll('[data-link]').forEach(function (el) {
      var key = el.getAttribute('data-link');
      if (key.indexOf('|') !== -1) return;   // a documentation attribute, not a seam
      apply(el, (S.link || {})[key], 'link:' + key);
    });

    // data-embed
    document.querySelectorAll('[data-embed]').forEach(function (el) {
      var key = el.getAttribute('data-embed');
      var html = (S.embed || {})[key];
      if (html) { el.innerHTML = html; }
      else { unresolved.push('embed:' + key); }
    });

    if (opt.warn && unresolved.length && window.console) {
      var seen = {}, list = [];
      unresolved.forEach(function (u) { if (!seen[u]) { seen[u] = 1; list.push(u); } });
      console.warn(
        '[SEAMS] ' + list.length + ' unresolved on this page: ' + list.join(', ') +
        '  — fill these in assets/seams.js'
      );
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', resolve);
  } else {
    resolve();
  }

  // Exposed so a build step can resolve at deploy time and bake real hrefs into
  // the HTML for crawlers. See the SEO note in the tech handoff.
  window.SEAMS.resolve = resolve;
})();
