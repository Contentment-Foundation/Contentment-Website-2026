/**
 * Cookie Preferences trigger — re-opens the consent banner.
 *
 * Binds every `[data-cookie-prefs]` element, so the footer (sitewide) and the two
 * buttons on /privacy all share one implementation instead of drifting apart.
 *
 * WHY THIS IS NOT A ONE-LINER:
 *
 * 1. SILENT FAILURE WAS THE ORIGINAL BUG. The previous handler was
 *    `if (window.Cookiebot?.renew) Cookiebot.renew()` — so when Cookiebot had not
 *    loaded, or had not initialised, the click did *nothing at all*. No banner, no
 *    error, no feedback. Indistinguishable from a dead button, which is what it was
 *    reported as. Withdrawal has to be as easy as consent (GDPR Art. 7(3) / PECR), so
 *    a control that silently no-ops is a compliance problem, not just a UX one.
 *
 * 2. COOKIEBOT MAY NOT BE READY YET. `uc.js` loads async, so a fast click can land
 *    before `window.Cookiebot` exists. We queue the request and fire it on
 *    `CookiebotOnLoad` rather than dropping it.
 *
 * 3. THE FREE TIER IS REGISTERED TO ONE DOMAIN (currently the Netlify preview). On
 *    localhost, or on any other host, Cookiebot never initialises — so this button
 *    genuinely cannot work there, and it is important that it says so rather than
 *    looking broken. It must also be re-registered to www.contentment.org at cutover
 *    (HC-067) or it stops working in production too.
 *
 * 4. THREE APIs, IN ORDER. `renew()` is the documented re-open. `show()` is the
 *    fallback for when no choice has been recorded yet (renew can no-op in that
 *    state). `cfShowCookieBanner()` is our custom banner's own entry point, defined by
 *    the code pasted into the Cookiebot dashboard (docs/cookiebot/banner.js) — note it
 *    does NOT appear in uc.js, so it only exists once the dashboard config has loaded.
 */

const SELECTOR = '[data-cookie-prefs]';

/** Try every available way to surface the banner. Returns true if one worked. */
function openPrefs() {
  const cb = typeof window !== 'undefined' ? window.Cookiebot : null;
  if (cb) {
    if (typeof cb.renew === 'function') { cb.renew(); return true; }
    if (typeof cb.show === 'function') { cb.show(); return true; }
  }
  if (typeof window.cfShowCookieBanner === 'function') { window.cfShowCookieBanner(); return true; }
  return false;
}

/** Tell the user rather than leaving a dead control. */
function reportUnavailable(el) {
  const msg = el.parentElement?.querySelector('[data-cookie-prefs-status]');
  const text =
    'Cookie settings could not open. Please refresh, or email hello@contentment.org and we will action your request.';
  if (msg) {
    msg.textContent = text;
    msg.hidden = false;
  } else {
    // No status slot on this instance (e.g. the footer) — the alert is deliberate.
    // A consent-withdrawal control must never fail without telling the person.
    window.alert(text);
  }
}

export function initCookiePrefs() {
  const els = document.querySelectorAll(SELECTOR);
  if (!els.length) return;

  els.forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      if (openPrefs()) return;

      // Not ready yet — wait for Cookiebot rather than dropping the click.
      let settled = false;
      const onLoad = () => {
        if (settled) return;
        settled = true;
        window.removeEventListener('CookiebotOnLoad', onLoad);
        if (!openPrefs()) reportUnavailable(el);
      };
      window.addEventListener('CookiebotOnLoad', onLoad);

      // If it never arrives (blocked, wrong domain, offline), say so instead of hanging.
      window.setTimeout(() => {
        if (settled) return;
        settled = true;
        window.removeEventListener('CookiebotOnLoad', onLoad);
        if (!openPrefs()) reportUnavailable(el);
      }, 2500);
    });
  });
}
