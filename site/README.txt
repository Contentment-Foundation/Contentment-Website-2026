THE CONTENTMENT FOUNDATION — contentment.org
=============================================

Phase 1 homepage prototype in site/ (static HTML, CSS, JS). Full multi-page
plan: Astro on Vercel — see docs/WEBSITE-ARCHITECTURE.md and
docs/planning/TECHNICAL-ARCHITECTURE.md.


DEPLOYMENT
----------

  Environment          Host              URL
  -------------------  ----------------  ----------------------------------
  Dev preview (now)    Netlify (interim) https://contentmentweb2.netlify.app
  Production (target)  Vercel            https://contentment.org
  PR previews          Vercel            *.vercel.app

  Netlify (netlify.toml): publishes site/ and generates site/docs/ on
  each build from docs/*.html. site/docs/ is gitignored — not in repo.

    /              Homepage
    /docs          Project docs hub
    /docs/team-brief
    /docs/tech-brief
    /docs/growth-brief
    /docs/automation-brief
    /foundation-reach-map   Interactive map design prototype (team review)
    /story-board            Story Board — voices canvas prototype (team review)
    /story-board-feed-guide How to add stories & media (Google Drive, YouTube)

  Google Drive (optional): PDF/Doc brief exports only — not .md files.
  Edit docs/drive-links.js when share URLs are ready.

  Production moves to Vercel after Astro migration (TICKET-002).


REPOSITORY LAYOUT
-----------------

  site/
    index.html                  ← primary editable build (~48 KB)
    foundation-reach-map.html   ← map design prototype (team review, not on homepage)
    story-board.html            ← Story Board prototype (team review, not on homepage)
    story-board-feed-guide.html ← content feed guide for stories & media
    program-data.js             ← shared story/country data for map + story board
    assets/                     ← images referenced by index.html (~2.8 MB)
    README.txt     ← this file (mirror of ../README.md for local reference)

  contentment-home.html   ← single-file build at repo root (~3.8 MB)
                            All images embedded as base64. Use for email,
                            offline preview, or sharing one file.

  docs/
    index.html, *-BRIEF.html   ← source for /docs/* routes (see DEPLOYMENT)
    planning/                  ← technical architecture, PRD, tickets


WHICH FILE TO EDIT
------------------

  • Day-to-day edits: site/index.html
    Small enough to open quickly in any editor or AI session.

  • After changing site/index.html, regenerate contentment-home.html
    if you still need the portable single-file version.

  • Image swaps: replace files in assets/ (keep filenames) or update
    the src/background-image paths in index.html.


PREVIEW LOCALLY
---------------

  Homepage — from the site/ folder:

    python3 -m http.server 8080

  Then open http://localhost:8080

  Project docs — copy from docs/ first, then serve site/:

    ./scripts/copy-docs.sh
    cd site && python3 -m http.server 8080

  Then open http://localhost:8080/docs

  (site/docs/ is gitignored — re-run copy-docs.sh after editing docs/*.html.)


DEPLOY
------

  See DEPLOYMENT section above. Netlify is interim; Vercel is production target.


PAGE SECTIONS (anchor links)
----------------------------

  #top       Hero
  #why       Why Teacher Wellbeing (split image + text)
  #impact    Stats + educator quote
             Kenya voice band (no anchor)
  #how       How Change Happens (scroll-pinned ripple animation)
             You Are Not Alone / community circles
             Four Pillars (interactive cards)
  #homeroom  Monthly giving tiers ($5 / $25 / $100)
             More ways in (schools, events, share)
             Newsletter signup
             Footer


ASSETS (assets/)
----------------

  img01_3b9ca36077.png   Logo (nav + footer)
  img02_f3c7dabda3.jpg   Hero (desktop)
  img03_7bbd154b69.jpg   Hero (mobile)
  img04_62faa64049.jpg   Why section
  kenya_band.jpg         Kenya principal quote band
  img05–img08            Community circle photos
  img09_d4a3165ce3.jpg   Four Pillars background
  img10_526e7678c7.jpg   Homeroom section
  img11–img13            "More ways in" door cards


DESIGN TOKENS
-------------

  Display font:  Newsreader
  Body font:     Inter
  Brand font:    Varela Round

  --teal:   #1FAFC0
  --ocean:  #0080B0
  --deep:   #024E70
  --green:  #4FA98C
  --paper:  #FBFAF7


INTERACTIONS (in <script> at bottom of index.html)
--------------------------------------------------

  • Sticky nav background on scroll
  • Hero entrance animation on load
  • IntersectionObserver scroll reveals (.anim)
  • Impact stat count-up (.num data-count)
  • Four Pillars accordion (.pcard click / keyboard)
  • How Orbit pinned scroll (560vh; beat fade 1.1s)
  • Subtle parallax on pillars background + hero text
  • prefers-reduced-motion respected throughout


STILL TO DO (non-blocking)
--------------------------

  Donation / CTA links (currently href="#"):
    • Hero: "Join Homeroom, from $5/month"
    • Nav:  "Join Homeroom" pill
    • Homeroom: "Take your seat in Homeroom"
    → Wire to real Keela donation URL when available.

  Other placeholder links (href="#"):
    • Doors: "Start the conversation", "See events", "Share the movement"
    • Footer: Events, Give, Share, Subscribe, LinkedIn, Instagram, YouTube

  Newsletter form: onsubmit="return false" — no backend integration yet.

  Optional polish:
    • Tune orbit scroll pacing (.orbit-scroll height, currently 560vh)
    • Tune beat fade duration (currently 1.1s)
    • Mobile menu button only scrolls to nav — no full drawer yet


CONTACT
-------

  Project / technical: somesh@contentment.org
  General: hello@contentment.org
  The Contentment Foundation · 501(c)(3) nonprofit
