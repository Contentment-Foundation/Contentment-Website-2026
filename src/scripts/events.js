import { trackEvent } from './analytics.js';
import { createYoutubeIframe } from './youtube-embed.js';

// Events page — filter chips, full-bleed parallax, and click-to-play YouTube.
// Ported verbatim from Dave's Jul 29 2026 handoff — see
// handoff/2026-07-29-dave-pages/5_EVENTS/events-kit-2026-07-28-page2r4/events.html's inline
// <script>, and HANDOFF-contentment-2026-07-27-events-notes.md ("ANIMATION" section — the
// RANGE=48 intensity dial is called out there explicitly). No-ops harmlessly on any page
// without the matching markup (.ev-filter / [data-parallax] / [data-yt]).
//
// NOTE (HC-072): this page is review-only, not production-final — see events.astro's
// top-of-file comment and the handoff doc's "STILL PENDING" section.

// ---- live event filtering (All / Open / Members / Virtual / In person) ----
export function initEventFilters() {
  const filters = [...document.querySelectorAll('.ev-filter')];
  const cards = [...document.querySelectorAll('.ev-card')];
  if (!filters.length || !cards.length) return;
  const emptyMsg = document.querySelector('.ev-empty');

  function applyFilter(f) {
    let shown = 0;
    cards.forEach((c) => {
      const match = f === 'all' || c.dataset.access === f || c.dataset.format === f;
      c.hidden = !match;
      if (match) shown++;
    });
    if (emptyMsg) emptyMsg.hidden = shown > 0;
  }

  filters.forEach((btn) => {
    btn.addEventListener('click', () => {
      filters.forEach((b) => { b.classList.remove('is-active'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');
      applyFilter(btn.dataset.filter);
    });
  });
}

// ---- parallax on the 4 full-bleed media layers (hero, flagship, why, close) ----
// Respects prefers-reduced-motion. Intensity dial: RANGE (px of drift).
export function initEventParallax() {
  const layers = [...document.querySelectorAll('[data-parallax]')];
  if (!layers.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const SCALE = 1.14, RANGE = 48; // px of drift
  let ticking = false;

  function updateParallax() {
    const vh = innerHeight;
    layers.forEach((el) => {
      const sec = el.parentElement;
      const r = sec.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return; // offscreen, skip
      // progress: -1 (section below viewport) .. 1 (section above)
      const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2);
      const y = Math.max(-1, Math.min(1, p)) * RANGE;
      el.style.transform = 'scale(' + SCALE + ') translate3d(0,' + y.toFixed(1) + 'px,0)';
    });
    ticking = false;
  }
  function onScroll() { if (!ticking) { requestAnimationFrame(updateParallax); ticking = true; } }

  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll, { passive: true });
  updateParallax();
}

// ---- click-to-play YouTube tiles (loads iframe only on interaction) ----
export function initEventVideos() {
  const targets = [...document.querySelectorAll('[data-yt]')];
  if (!targets.length) return;

  targets.forEach((el) => {
    function play() {
      if (el.classList.contains('playing')) return;
      const id = el.dataset.yt;
      const iframe = createYoutubeIframe(id, { modest: true });
      if (!iframe) return;
      // www.youtube.com (not nocookie) — avoids YouTube bot/sign-in wall on embeds
      el.appendChild(iframe);
      el.classList.add('playing');
      trackEvent('video_started', {
        page_section: 'events_recap',
        video_id: id,
      });
    }
    el.addEventListener('click', play);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); play(); }
    });
  });
}
