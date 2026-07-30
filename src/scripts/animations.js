// Shared reveal-on-scroll + hero entrance + stat count-up. Ported verbatim from
// Dave's Jul 29 2026 homepage handoff — see docs/planning/TECHNICAL-ARCHITECTURE.md §3.
// Safe to call on every page: querySelectorAll simply returns nothing on pages
// without a .hero / .num element.

export function initHeroEntrance() {
  addEventListener('load', () => document.body.classList.add('hero-loaded'));
  setTimeout(() => document.body.classList.add('hero-loaded'), 400);
}

export function initRevealOnScroll() {
  const io = new IntersectionObserver((es) => {
    es.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: .16, rootMargin: '0px 0px -7% 0px' });
  document.querySelectorAll('.anim').forEach((el) => {
    if (!el.closest('.hero')) io.observe(el);
  });
}

function fmt(n) {
  return n.toLocaleString('en-US');
}

export function initCountUp() {
  const cio = new IntersectionObserver((es) => {
    es.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target, target = +el.dataset.count, plus = el.dataset.plus;
      const dur = 1500, t0 = performance.now();
      function tick(t) {
        let p = Math.min((t - t0) / dur, 1);
        p = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(Math.round(target * p));
        if (p === 1 && plus) { el.innerHTML = fmt(target) + '<span class="plus">+</span>'; }
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      cio.unobserve(el);
    });
  }, { threshold: .5 });
  document.querySelectorAll('.num').forEach((el) => cio.observe(el));
}

// Subtle parallax on full-bleed bands (currently just the Pillars section background).
// No-ops harmlessly on pages without a .pillars-bg element.
export function initParallax() {
  if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  const layers = [
    { el: document.querySelector('.pillars-bg'), rate: 0.14, sec: document.querySelector('.pillars') },
  ].filter((l) => l.el && l.sec);
  const heroTxt = document.querySelector('.hero-inner');
  if (!layers.length && !heroTxt) return;
  let ticking = false;
  function update() {
    layers.forEach((l) => {
      const r = l.sec.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const off = (r.top) * -l.rate;
      l.el.style.transform = 'translate3d(0,' + off.toFixed(1) + 'px,0) scale(1.12)';
    });
    // Hero text lags slightly behind the photo as you scroll away -> gentle depth separation (no fade).
    if (heroTxt && innerWidth > 760) {
      const sc = window.scrollY;
      if (sc < innerHeight) { heroTxt.style.transform = 'translate3d(0,' + (sc * 0.12).toFixed(1) + 'px,0)'; }
    } else if (heroTxt) { heroTxt.style.transform = ''; }
    ticking = false;
  }
  addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, { passive: true });
  update();
}
