CONTENTMENT — SHARED HEADER + FOOTER BUNDLE
Version 2026-07-28.  Supersedes 2026-07-23.
Source of truth: the homepage index.html shipped alongside this kit.

WHAT CHANGED IN THIS VERSION
  1. The official horizontal logo lockup replaces the cf_ball + "The Contentment Foundation"
     text brand, in BOTH the header and the footer. (Team note: "Update logo", all pages.)
  2. New footer compliance line, left aligned. (Team note: "Revised Text (Compliance)".)
  3. min-width:0 added to .news input — a confirmed page-level bug, see below.
  4. About tab now points at about.html instead of "#".

WHAT'S HERE
  header-footer.json          Everything below as one parseable file, for the tech team.
  header.html                 The <header> block, paste as-is.
  footer.html                 The <footer> block, paste as-is.
  header-footer.css           Header + footer CSS, :root vars, .wrap, responsive rules.
  header-footer.js            Three lines: turns the header white on scroll.
  assets/logo_lockup_light.svg   White wordmark + white coin. Nav AT REST and FOOTER.
  assets/logo_lockup_dark.svg    Grey wordmark, no coin. Nav SCROLLED (white bar) only.
  assets/cf_ball.png          Retired from header and footer. Kept only in case a page
                              uses the bare mark somewhere else.
  assets/seams.js             Seam config + resolver. THE file the tech team edits. See below.

WHY THERE ARE TWO LOGO FILES, AND WHY ONE HAS A COIN
  The supplied lockup has a grey #515154 wordmark. That measures 7.91:1 on the white scrolled
  bar (fine) but it is unreadable on the hero photo and 2.16:1 on the footer blue. So V supplied
  a reversed file with a white wordmark. That fixed the wordmark and nothing else: the globe was
  byte-identical between the two files.

  The globe is the actual problem on blue. Its dominant colour is #0190BE. The footer is
  #0090be. Those differ by ONE level in the red channel and measure 1.000:1. 44.6% of the mark
  is that blue, and the mark's internal line-work is transparent, so on the footer it fills with
  footer blue too. Without intervention the outer circle and the base vanish and the mark stops
  reading as a globe. The teal is 1.67:1 and the green 1.62:1, so nothing in the mark clears 2:1
  on that ground.

  Fix, per Dave, 2026-07-28: a white coin behind the mark, which is the same device the old 42px
  ball already used for exactly this reason.

  COIN RATIO IS 1.08. It was first built at 1.235 (measured off the old implementation: a 42px
  coin around a 34px mark) and Dave rejected that on sight: at a 62px lockup the old ratio gives
  a 5.9px white ring, and a fat white circle around a circular mark reads as a badge. 1.08 gives
  a 2.3px keyline in the nav and 3.1px in the footer. Five ratios were rendered on the real
  footer blue and all five isolate the mark completely, so this was purely a look call, not a
  contrast one. Do not go below about 1.04: at 1.02 the ring is 0.6px and breaks up under
  antialiasing (measured 83.9% white instead of ~99%).

  The coin still does its job at 1.08: 0 pixels of footer blue reach the mark, and the worst
  mark segment goes from 1.000:1 to 3.66:1. Note the ring is not cosmetic either. The mark's
  outer rim is #0190BE, so without a visible keyline the silhouette has no edge against the
  footer.

  The two files share an identical viewBox (-3.1 -3.16 300.3 83.6), so they stack with
  grid-area:1/1 and cross-fade on scroll with zero geometry shift. Do not edit one file's
  viewBox without editing the other.

SIZING, AND WHY THE HEADER GREW
  The lockup is a three-line wordmark. As a share of total lockup height: "Contentment" is
  19.7%, "Foundation" 18.9%, "The" 7.2%. At the old 42px brand height "Contentment" would have
  rendered at an 8px cap. It needs roughly 62px to reach a 12px cap.

  Tightening the coin to 1.08 removed dead height from the file, which made the wordmark bigger
  at any given lockup height. So the lockup was scaled back down to keep the wordmark identical:
  54px nav at rest, 47px scrolled, 45/40 under 760px, 73px footer, 59px footer mobile. Header
  padding is 14px/10px. Net header height: 78px -> 82px at rest, 62px -> 67px scrolled, which is
  close to where it started.

  The lockup is 194px wide at 54px tall. The old ball-plus-wrapped-text brand was about
  203px. So the brand is very slightly NARROWER than before, and the 390px nav crowding is
  measurably better: the nav-right block no longer overhangs the viewport.

SEAMS — assets/seams.js  (NEW, 2026-07-28)
  Every destination on every page resolves at load from ONE config file, assets/seams.js. The
  markup keeps its data-page / data-donate / data-join / data-link / data-embed attributes and
  the resolver fills in the hrefs.

  This exists because the design track rebuilds page HTML regularly. If wiring lived in the HTML,
  every rebuild would silently wipe it. With seams.js, design owns the markup, tech owns one file,
  and neither overwrites the other. A URL also changes in one place instead of six.

  Add <script src="assets/seams.js"></script> just before </body> on every page, and copy the
  file into that page's assets/ folder. Unfilled seams are left exactly as the markup had them
  and are reported in one grouped console warning, so nothing fails silently.

  SEO NOTE: links resolve in JS, which crawlers handle inconsistently. window.SEAMS.resolve() is
  exposed so a deploy step can run it headless and bake the real hrefs into the HTML. Treat
  seams.js as the dev-time layer and the baked output as what ships publicly.

TO APPLY TO A PAGE
  1. Paste the font <link> tags into <head> (JSON, dependencies.fontLinks).
  2. Paste header-footer.css into the page's <style>. Merge :root, don't duplicate it.
  3. Replace the page's <header>...</header> with header.html.
  4. Replace the page's <footer>...</footer> with footer.html.
  5. Add header-footer.js to the page's script block.
  6. Copy BOTH svg files into that page's assets/ folder.
  7. Copy assets/seams.js in, and add <script src="assets/seams.js"></script> before </body>.

PER-PAGE EDITS YOU MUST MAKE
  * The brand href is "#top" because the homepage scrolls to top.
    ON EVERY INNER PAGE change it to "index.html".
  * Footer "Our Impact" and any #impact anchor must become index.html#impact on inner pages.
  * Check asset path depth if a page lives in a subfolder.
  * Varela Round is now unused by the header and footer. If a page loads that font ONLY for the
    brand, the font link can be dropped from that page. Check before removing.

CARRY THESE FIXES WHEN YOU TOUCH ANY PAGE
  * .news input { min-width: 0 }  Flex items default to min-width:auto, so the two newsletter
    inputs will not shrink below ~237px each. 237x2+12 = 486px of content in a 420px row, and
    the whole page gains a horizontal scrollbar between roughly 960px and 1280px. flex:1 does
    NOT fix this; it sets the basis to 0 and leaves the min-width floor alone. Measured on the
    homepage before and after: 102px of sideways scroll at 1120px, down to 5px.

FOOTER COMPLIANCE COPY — RESOLVED 2026-07-28
  The team note struck the ENTIRE old fine-print line, not part of it. First pass kept
  "contentment.org" alive by folding it into the copyright line; Dave caught that. Both the old
  fine print and the "© 2026 The Contentment Foundation" line are now GONE.

  .foot-bottom is a single full-width left-aligned line carrying only the compliance sentence.
  No max-width cap, no flex row, no second span. The sentence already ends "All rights
  reserved.", so the separate © line was redundant as well as out of spec.

  The only surviving contentment.org reference in the footer is the legitimate
  mailto:hello@contentment.org in the Connect column. Leave it.

FULL SEAM LIST (everything still on "#")
  data-page   why-wellbeing · our-impact · for-schools · events · get-involved
              (about is now a real href: about.html)
  data-donate Keela donate URL (nav pill and footer Donate)
  data-link   school-platform (Sign In) · linkedin · facebook · youtube
  LIVE        Instagram: https://www.instagram.com/contentmentorg/

VERIFIED
  Built a bare page from ONLY these files and rendered it headless. No console errors, no failed
  requests. Six tabs correct, both SVGs load at an identical natural size, cross-fade
  reads light=1/dark=0 at rest and light=0/dark=1 scrolled, footer resolves to rgb(0,144,190),
  foot-bottom computes align-items:flex-start, compliance sentence present.

STILL OPEN, UNCHANGED FROM LAST VERSION
  Footer #0090be with white is 3.66:1 and the Donate pill is 3.2:1, both under AA. Dave has
  closed this: the blue stays. Recorded here so nobody re-opens it. Note the white coin now
  gives the LOGO a compliant ground even though the text around it does not.
