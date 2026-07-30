ABOUT PAGE - DEPLOY KIT (2026-07-28, rev 4)

REV 4 = two changes on top of rev 3:
  1. HEADER + FOOTER -> kit v2 (2026-07-28). The old cf_ball + wordmark brand
     is replaced by the official horizontal logo lockup with the scroll
     cross-fade and the white coin. New left-aligned footer compliance line.
     Both footer bottom lines kept (compliance sentence + "(c) 2026" line),
     matching the homepage index.html, which the kit names as source of truth.
  2. OUR STORY copy replaced verbatim with the compliance-approved block
     (WJ / compliance). Prose now reads "Dr. Daniel Cordaro"; the closing
     text link is "Our answer lives here ->" (still -> why-wellbeing.html).

WHAT'S IN HERE
  about.html                 SELF-CONTAINED, ~2.2MB, drop-in deployable.
                             Every image is base64-embedded; both logo lockup
                             SVGs are inlined as data-URIs. The ONLY remote
                             dependencies are the Google Fonts <link> in <head>
                             and the live Instagram href in the footer.
  about-name-manifest.txt    All 24 names as rendered + the divergence log.
                             Dave's line-by-line pass REQUIRED before public.
                             Now also logs the Daniel/Dan split and the
                             banned-word override (see below).
  photos/                    Every embedded image as a named JPG (hero, 2 story
                             photos, 24 headshots). Reference only - about.html
                             already has them embedded; you do not need these
                             to deploy, only to rebuild or to swap an image.
  build/                     build_about.py + all component parts. Rebuilds
                             about.html byte-identical. See BUILD below.

DEPLOY (GitHub repo Contentment-Website-2026)
  Drop about.html at repo root, replacing the existing About page. It is
  self-contained, so no assets/ folder is required for THIS page to render.
  Netlify is case-sensitive: the only hard internal links are index.html,
  about.html, and why-wellbeing.html (the Our Story text link).

BUILD (only if you need to rebuild or swap an asset)
  build/ is SOURCE-ONLY. build_about.py expects its image files in the SAME
  directory at these exact names:
      hero_bali5.jpg           (= photos/about-hero-team-bali-july2025.jpg)
      dan_q82.jpg              (= photos/about-story-dan-bhutan-2014.jpg)
      story_country3.jpg       (= photos/about-story-hands-on-hearts-country-school.jpg)
      headshots/               (= photos/headshots/, 24 files, DO NOT RENAME)
  Copy those in from photos/ (renaming the three top-level ones), then run:
      python3 build_about.py
  It reproduces about.html. Verified byte-identical this build.

  BUILD ORDER MATTERS: t_base.css (site resets + typography) MUST precede
  t_kit.css. The header/footer kit is a COMPONENT, not a foundation - a page
  built from it without the base layer renders as Times-with-underlines-and-
  white-border. The script already wires this order; do not "simplify" it.

  THE LOGO LOCKUPS ARE INLINED. t_header.html and t_footer.html carry the two
  SVGs as data-URIs (not assets/ refs) so about.html stays single-file. If you
  ever re-transplant the kit, re-inline them the same way, or About stops being
  self-contained. The coin is baked INTO the SVG (a white circle behind the
  mark), not drawn in CSS - it carries over automatically.

SEAMS ON THIS PAGE (all still "#", yours to wire)
  Per the swap brief, wiring is NOT baked in. seams.js is NOT referenced by
  about.html. Either bake real hrefs into the markup at deploy, or add seams.js
  per the kit README - your call, but pick the same approach as the other pages.

  data-page    about(LIVE, about.html) why-wellbeing our-impact for-schools
               events get-involved
  data-donate  nav pill + footer Donate -> Keela donate URL
  data-link    school-platform (Sign In) / linkedin / facebook / youtube
  data-embed   newsletter (conversion band Card 1 -> Keela; the form currently
               SWALLOWS submissions - onsubmit returns false - until wired)
  LIVE         Instagram: https://www.instagram.com/contentmentorg/

  Keela Donate BUTTON COLOR: set #0090bd in the Keela dashboard (not reachable
  from our CSS; it defaults to #507b91).

OPEN QUESTION (carried from rev 3, still needs an answer before wiring)
  "Our Impact" uses seam data-page="our-impact". The old page was stories.html.
  If a "stories" seam is already wired, rename one side. The footer's Our Impact
  no longer targets index.html#impact.

NOT PUBLIC-READY UNTIL: newsletter wired, LinkedIn/social URLs set, all nav
seams wired, name manifest verified by Dave. Cosmetic still pending: hi-res
bali5 hero swap; CLOSE section copy unspecced.

VOICE-DOC OVERRIDE (do not "fix" this)
  The approved Our Story copy contains two words on the internal banned list:
  "quiet" and "donors". build_about.py prints a COPY WARNING for each at build
  time. These are intentional - the copy came down approved from WJ/compliance.
  Leave them. Logged in about-name-manifest.txt.
