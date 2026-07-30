Our Impact page — de-inlined build for the repo
================================================

Contents:
  index.html      Main page. Images referenced from assets/ (not base64-embedded).
  assets/         37 files: 34 photos (img-01..img-34.jpg), worldmap.png,
                  logo_lockup_light.svg, logo_lockup_dark.svg.

This is the repo-friendly form (matches the Why-Wellbeing convention). Drop
index.html + assets/ at the repo location for this page. If the repo already
carries shared copies of the two logo SVGs from the header/footer kit, you may
dedupe against those.

What's on this build:
  - Header + footer are shared header/footer kit v2 (official lockup with the
    scroll cross-fade; new footer compliance line + copyright line).
  - Nav/footer destinations are intentionally left at "#" for tech to wire.
    No seams.js is wired in (baked hrefs at deploy, per the swap brief).
  - The "Our Impact" tab keeps aria-current="page".
  - The Schools-of-Wellbeing feature video ("The Country School / Los Angeles")
    now shows a single play button (the duplicate baked into the poster image
    was removed; the CSS play button remains).

Fonts: the only remote dependency is the Google Fonts <link> in <head>.
