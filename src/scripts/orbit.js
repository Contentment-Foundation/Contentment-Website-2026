// "How Change Happens" pinned pond-ripple scroll animation. Home-page only.
// Ported from Dave's Jul 29 2026 homepage handoff — see
// docs/planning/TECHNICAL-ARCHITECTURE.md §3. No-ops if .how-orbit isn't on the page.
// Mobile/tablet use the same scroll-driven reveal as desktop (rings + ground color +
// one beat at a time). Static stacked beats only for prefers-reduced-motion.
export function initOrbit() {
  const sec = document.querySelector('.how-orbit');
  if (!sec) return;
  const rings = [...sec.querySelectorAll('.ring')];
  const beats = [...sec.querySelectorAll('.beat')];
  const N = beats.length;
  const reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  const GROUNDS = ['var(--ob1)', 'var(--ob2)', 'var(--ob3)'];
  function setActive(i) {
    beats.forEach((b, bi) => {
      b.classList.toggle('active', bi === i);
      b.classList.toggle('past', bi < i);
    });
    rings.forEach((r, ri) => {
      r.classList.toggle('drawn', ri <= i);
      r.classList.toggle('current', ri === i);
    });
    sec.style.setProperty('--ob', GROUNDS[i] || GROUNDS[0]);
  }

  if (reduce) {
    setActive(0);
    sec.style.removeProperty('--ob');
    sec.style.setProperty('--bloom', '340');
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (e.isIntersecting) {
          const i = +e.target.dataset.beat;
          rings.forEach((r, ri) => r.classList.toggle('drawn', ri <= i));
          e.target.classList.add('active');
        }
      });
    }, { threshold: .6 });
    beats.forEach((b) => io.observe(b));
    return;
  }

  let cur = -1;
  const cue = sec.querySelector('.orbit-cue');
  const lerp = (a, b, t) => a + (b - a) * t;
  const mobileOrbit = window.matchMedia('(max-width:940px)');
  function onScroll() {
    const rect = sec.getBoundingClientRect();
    const total = Math.max(sec.offsetHeight - window.innerHeight, 1);
    let prog = Math.min(Math.max(-rect.top / total, 0), 1);
    // bloom diameter grows with scroll: tight point -> wide soft disc.
    // On stacked mobile layout, cap well below the beat copy so the glow
    // doesn't wash over the last (purple) paragraph (Kristina / mobile QA).
    const bloomMax = mobileOrbit.matches ? 300 : 760;
    const bloomMin = mobileOrbit.matches ? 120 : 150;
    sec.style.setProperty('--bloom', lerp(bloomMin, bloomMax, prog).toFixed(0));
    // ease progress so the first beat advances sooner (kills the "frozen" dead-zone on entry)
    const eased = Math.pow(prog, 0.82);
    let i = Math.floor(eased * N);
    if (i > N - 1) i = N - 1;
    if (i < 0) i = 0;
    if (i !== cur) {
      cur = i;
      setActive(i);
    }
    // hide the scroll cue once the final beat is reached; show while pinned and not done
    if (cue) {
      const pinned = rect.top <= 0 && rect.bottom > window.innerHeight;
      if (i >= N - 1 || !pinned) cue.classList.add('hide');
      else cue.classList.remove('hide');
    }
  }
  setActive(0);
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();
}
