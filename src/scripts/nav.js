// Sticky nav background swap + mobile drawer (FEAT-003). Ported from Dave's Jul 29 2026
// homepage handoff — see docs/planning/TECHNICAL-ARCHITECTURE.md §3.

const DESKTOP_NAV_MQ = '(min-width: 941px)';

export function initNav() {
  const hdr = document.getElementById('hdr');
  if (hdr) {
    addEventListener('scroll', () => {
      hdr.classList.toggle('scrolled', scrollY > 40);
    }, { passive: true });
  }
  initMobileNav();
}

function initMobileNav() {
  const btn = document.querySelector('.menu-btn');
  const drawer = document.getElementById('nav-drawer');
  if (!btn || !drawer) return;

  const panel = drawer.querySelector('.nav-drawer__panel');
  const backdrop = drawer.querySelector('.nav-drawer__backdrop');
  const closeBtn = drawer.querySelector('.nav-drawer__close');
  if (!panel) return;

  let lastFocus = null;

  const focusable = () => [...panel.querySelectorAll(
    'a[href], button:not([disabled])',
  )].filter((el) => el.offsetParent !== null || el === closeBtn);

  function open() {
    if (window.matchMedia(DESKTOP_NAV_MQ).matches) return;
    lastFocus = document.activeElement;
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    btn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
    const first = focusable()[0];
    if (first) first.focus();
  }

  function close() {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    btn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  btn.addEventListener('click', () => {
    if (drawer.classList.contains('open')) close();
    else open();
  });

  closeBtn?.addEventListener('click', close);
  backdrop?.addEventListener('click', close);

  panel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', close);
  });

  addEventListener('keydown', (e) => {
    if (!drawer.classList.contains('open')) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
      return;
    }
    if (e.key !== 'Tab') return;
    const els = focusable();
    if (!els.length) return;
    const first = els[0];
    const last = els[els.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  addEventListener('resize', () => {
    if (window.matchMedia(DESKTOP_NAV_MQ).matches && drawer.classList.contains('open')) {
      close();
    }
  });
}
