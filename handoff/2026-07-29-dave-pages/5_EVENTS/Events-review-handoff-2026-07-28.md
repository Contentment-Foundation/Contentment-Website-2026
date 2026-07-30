# Events & Experiences — review handoff (2026-07-28)

**For:** team review · **Status:** Phase 1 notes + v2 shared nav/footer applied, not yet locked · **Deploy:** Netlify Drop preview (temporary URL, single page)

Nav links to other pages will 404 on this preview — it's a one-page drop, so review the Events page itself.

---

## New this round

**Shared header + footer → v2 (the home-page bundle), now on Events**
- Official horizontal logo lockup replaces the old coin + wordmark, in both the nav and the footer. Nav shows the white lockup at rest and cross-fades to the grey wordmark on the white scrolled bar; the footer uses the white lockup on blue (white coin behind the mark so it reads on the blue).
- Nav is the flat six-tab set: About, Why Teacher Wellbeing, Our Impact, Schools, Events, Get Involved. About is a real link to `about.html`; Events is marked current.
- Footer bottom is the single compliance sentence with the © line beneath it.
- Carried the confirmed newsletter fix (`.news input{min-width:0}`) that removed the horizontal scrollbar between ~960 and 1280px.

**"How access works" (team note)**
- Deleted the "Open to everyone" left column.
- The Homeroom box is now full row width, with the intro text directly under the heading and the six benefits running in two columns so the wider box doesn't read half-empty.
- Intro line is now "The ways we show up for the people who show up for teachers every month:".
- "Open to everyone" still appears on the individual event cards and the filter, so that message is not lost from the page.

---

## Open decisions (need a call)

1. **Bali recap card contrast.** White on the `#32c0cf` card is 2.19:1, under the 3:1 large-text floor. Shipped as directed so it can be seen in context; a hair-deeper cyan (~`#2497a6`) reads the same and clears 3:1, or keep the exact hue and pool a soft scrim behind the text.
2. **Footer `© 2026` line.** The header/footer README says it was removed, but the live homepage, the kit's own `footer.html`, and the JSON all still ship it — so Events keeps it to match what's live. The homepage likely needs the same reconciliation.
3. **`data-page="our-impact"` seam.** The v2 nav/footer use `our-impact` where tech may have wired `stories`. One-word reconciliation, per the kit's own note.
4. **Hero copy** still says "a retreat on the Bali coast" while the retreat card is location-less / 2027 (WJ).
5. **Retreat naming** split: "Worldwide Wellbeing Retreat" (card) vs "Wellbeing Worldwide Retreat" (recap copy) (WJ).
6. **Mint-button scope** in "What's coming up" — all CTAs vs header-only (V).
7. Footer contrast: `#0090be` with white is 3.66:1; Dave has closed this (blue stays), noted so it isn't re-opened.

---

## For the tech team (wiring seams)

- **Nav/footer seams:** `data-page` (why-wellbeing · our-impact · for-schools · events · get-involved), `data-donate` (Keela), `data-link` (school-platform · linkedin · facebook · youtube). Instagram is live. About is a real link now.
- **Join / RSVP flow:** every gated button carries `data-join` / `data-rsvp` plus its nearest `data-event`. New: `data-rsvp="regional-journey"` (Shasta waitlist).
- **Email captures** (`data-embed`): top newsletter fold, festival signup, "Why we gather" box, close box.

---

## Notes

- Verified clean: no em-dashes, no banned words, no horizontal scroll at 1440 / 1280 / 1120 / 960 / 768 / 390.
- Logos are embedded inline so Events stays a single self-contained file; the homepage references a shared `assets/` logo instead.
- Colour/legibility figures are measured from the rendered page.
- Review build — a production deploy (into the repo as `events.html`) should wait until the design is locked and the decisions above are settled.
