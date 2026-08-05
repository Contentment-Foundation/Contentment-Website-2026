/* Contentment Foundation — custom Cookiebot banner behaviour.
 *
 * Cookiebot calls cfShowCookieBanner() when it needs consent and
 * cfHideCookieBanner() once a choice is recorded. Both must be global.
 *
 * Consent is EXPLICIT: optional categories start unchecked and nothing
 * non-essential fires until a button is clicked. Necessary is always on and is
 * not submittable. Decline is the same size and weight as Accept.
 *
 * Consent itself is still stored, logged and audited by Cookiebot — this only
 * replaces the UI. Source of truth for the values is
 * Cookiebot.submitCustomConsent(preferences, statistics, marketing).
 */
(function () {
  var BAR = 'cfCookieBar';
  var lastFocus = null;

  function el(id) { return document.getElementById(id); }

  function submit(preferences, statistics, marketing) {
    if (window.Cookiebot && typeof window.Cookiebot.submitCustomConsent === 'function') {
      window.Cookiebot.submitCustomConsent(!!preferences, !!statistics, !!marketing);
    }
    cfHideCookieBanner();
  }

  function togglePanel() {
    var panel = el('cfCbPanel');
    var btn = el('cfCbCustomise');
    if (!panel || !btn) return;
    var open = !panel.hasAttribute('hidden');
    if (open) {
      panel.setAttribute('hidden', '');
      btn.setAttribute('aria-expanded', 'false');
    } else {
      panel.removeAttribute('hidden');
      btn.setAttribute('aria-expanded', 'true');
      var first = el('cfCbPreferences');
      if (first) first.focus();
    }
  }

  function onKeydown(e) {
    // Escape closes the details panel only. It must NOT dismiss the banner —
    // dismissing without a choice would be silent implied consent.
    if (e.key === 'Escape') {
      var panel = el('cfCbPanel');
      if (panel && !panel.hasAttribute('hidden')) {
        togglePanel();
        var btn = el('cfCbCustomise');
        if (btn) btn.focus();
      }
    }
  }

  function wire() {
    var bar = el(BAR);
    if (!bar || bar.dataset.cfWired === '1') return;
    bar.dataset.cfWired = '1';

    var accept = el('cfCbAccept');
    var decline = el('cfCbDecline');
    var customise = el('cfCbCustomise');
    var save = el('cfCbSave');

    if (accept) accept.addEventListener('click', function () { submit(true, true, true); });
    if (decline) decline.addEventListener('click', function () { submit(false, false, false); });
    if (customise) customise.addEventListener('click', togglePanel);
    if (save) save.addEventListener('click', function () {
      submit(
        el('cfCbPreferences') && el('cfCbPreferences').checked,
        el('cfCbStatistics') && el('cfCbStatistics').checked,
        el('cfCbMarketing') && el('cfCbMarketing').checked
      );
    });

    document.addEventListener('keydown', onKeydown);
  }

  window.cfShowCookieBanner = function () {
    var bar = el(BAR);
    if (!bar) return;
    wire();
    // Re-opened from a Cookie Preferences link: reflect the existing choice
    // rather than showing stale unchecked boxes.
    var c = (window.Cookiebot && window.Cookiebot.consent) || {};
    if (el('cfCbPreferences')) el('cfCbPreferences').checked = !!c.preferences;
    if (el('cfCbStatistics')) el('cfCbStatistics').checked = !!c.statistics;
    if (el('cfCbMarketing')) el('cfCbMarketing').checked = !!c.marketing;

    lastFocus = document.activeElement;
    bar.removeAttribute('hidden');
    var first = el('cfCbCustomise');
    if (first) first.focus();
  };

  window.cfHideCookieBanner = function () {
    var bar = el(BAR);
    if (!bar) return;
    var panel = el('cfCbPanel');
    if (panel) panel.setAttribute('hidden', '');
    var btn = el('cfCbCustomise');
    if (btn) btn.setAttribute('aria-expanded', 'false');
    bar.setAttribute('hidden', '');
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
    lastFocus = null;
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else {
    wire();
  }
})();
