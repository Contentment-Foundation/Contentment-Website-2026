WHY TEACHER WELLBEING — ASSET BUNDLE (for the tech team)
Built 2026-07-28.

CONTENTS
  why-wellbeing.html                 The page, DE-INLINED: images referenced from assets/.
                                     Repo-friendly version — drop it + assets/ into the repo.
                                     Verified: all 16 assets load, zero broken references.
  why-wellbeing.self-contained.html  Same page, every image base64-embedded (zero external
                                     deps). Use for a single-file Netlify Drop. Renders identical.
  assets/                            16 images + both logo SVGs + seams.js:
                                       logo_lockup_light.svg / logo_lockup_dark.svg  header+footer lockup
                                       seams.js  the kit's link resolver (see handoff sec.3;
                                                 NOT wired into the page — that's your call)
  header-footer-kit-v2/              The shared header/footer kit v2 — source of truth for the
                                     furniture (header.html, footer.html, CSS, JS, JSON, README).
  HANDOFF-why-wellbeing.md           START HERE. Seams to wire, live-site checks, site-wide flags.

NOTES
  * The two HTML files are equivalent; pick by deploy path.
    Repo:         why-wellbeing.html + the assets/ folder.
    Netlify Drop: why-wellbeing.self-contained.html (rename to index.html).
  * A few asset filenames are generic (image.jpg, image-2.jpg, image-3.jpg) where the source
    markup had no alt/aria-label to name them from. Rename freely — just update the matching
    src="" / url() in why-wellbeing.html.
  * Fonts still load from Google Fonts via the <link> in <head>.
