GET INVOLVED — full project tree for the tech team
Build 2026-07-28. Header/footer swapped to shared kit v2.

WHAT'S IN HERE
  get-involved.html      The page, with the shared header/footer kit v2.
                         The two logo lockups and (later) seams.js load from
                         assets/. The page's own photography stays embedded
                         as base64 — that is design's, not something you wire.
  assets/
    logo_lockup_light.svg  White wordmark + white coin. Nav at rest AND footer.
    logo_lockup_dark.svg   Grey wordmark, no coin. Nav on the white scrolled bar.
    seams.js               Seam config + resolver. THE file you edit to wire
                           the site. NOT currently referenced by the page (Dave:
                           wiring is your job, links stay "#" until you bake).
    cf_ball.png            Retired from header/footer. Kept in case a page uses
                           the bare mark elsewhere.

WIRING (seams.js)
  Nothing on this page is wired. Every nav/footer destination is "#", every
  data-* seam is unresolved by design. To wire:
    1. Fill in assets/seams.js (page routes, donate, links, embeds).
    2. Add <script src="assets/seams.js"></script> before </body>, OR run
       window.SEAMS.resolve() headless at deploy and bake real hrefs into the
       HTML. The kit README's SEO note recommends baking for crawlers.

SEAMS STILL ON "#" (this page)
  data-page   why-wellbeing · our-impact · for-schools · events · get-involved
              (about already points at about.html)
  data-donate nav pill + footer Donate  -> Keela donate URL
  data-join   homeroom (hero + Join Homeroom button) · one-time · ways-to-give
  data-embed  impact-video  (portrait 9:16 slot; member video pending)
  data-link   school-platform (Sign In) · linkedin · facebook · youtube
  LIVE        instagram: https://www.instagram.com/contentmentorg/

NOTE ON data-page="our-impact"
  This seam was renamed from "stories". If you have already wired "stories"
  elsewhere, either rename that seam or change this one back. One-word change.
  seams.js carries the same note inline.

A SELF-CONTAINED SINGLE-FILE COPY also exists for Netlify Drop previews
(get-involved.html at ~859KB with the SVGs inlined). Ask design for it, or use
the -preview zip. Do not confuse the two: this tree is for the repo, where the
assets/ folder ships alongside.
