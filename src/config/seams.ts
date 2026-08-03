/**
 * CONTENTMENT — SEAMS (Astro-native)
 * ----------------------------------------------------------------------------
 * This is the ONLY file to edit to wire up the still-pending destinations.
 * Internal page-to-page nav does NOT live here — Astro's file-based routing
 * handles that natively (see Nav.astro / Footer.astro, which link straight to
 * /why, /our-impact, etc.). This file only holds things that are genuine
 * external/business decisions, not yet resolved as of the Jul 29 2026 handoff:
 * Keela donate URL, the join-flow destination, and social links pending
 * Kristina's button/CTA inventory (HC-005 / FEAT-005).
 *
 * Leave a value '' until it's confirmed; every consumer treats '' as "not
 * wired yet" and falls back to a safe default (usually '#').
 */
export const seams = {
  /** Keela checkout URL — blocked on Finance (D-02, HC-030).
   *  Until set, Donate CTAs fall back to /give. */
  donate: '',

  /** Join / Homeroom destination. Until Keela join-flow (HC-071), route to /give. */
  join: '/give',

  /** Get Involved "Prefer to give differently" → one-time gift flow. Blocked on
   *  HC-071 (Keela/Homeroom join-flow choreography), same as `join`. */
  giveOneTime: '',

  /** Get Involved "Prefer to give differently" → other Keela giving options.
   *  Owner: Lorna — destination still an open question per HC-071/D-03. */
  waysToGive: '',

  /** Events RSVP destinations (festival-virtual, festival-irl, bali-retreat).
   *  Blocked on HC-071, same Keela/Homeroom join-flow choreography as `join`.
   *  Every gated Events CTA also carries a data-event id for a return-trip
   *  redirect back to that event once the join flow exists — see
   *  HANDOFF-contentment-2026-07-27-events-notes.md "THE CRITICAL SEAM". That
   *  id is preserved as an inert data-event attribute in events.astro; no
   *  resolver JS binds it yet. */
  rsvp: '',

  /** Sign-in link for the school platform. */
  schoolPlatform: 'https://school.contentment.org/',

  link: {
    // D-07 resolved — live-site footer destinations (contentment.org, Jul 2026).
    linkedin: 'https://www.linkedin.com/company/the-contentment-foundation',
    instagram: 'https://www.instagram.com/contentmentorg/',
    facebook: 'https://www.facebook.com/contentment.org',
    youtube: 'https://www.youtube.com/@thecontentmentfoundation',
  },

  schools: {
    /** Partner-deck download (For Schools hero + closing section). */
    deck: 'https://drive.google.com/file/d/1Q-Z0boIG6Nm1LuccmeYngK_SID1x_Ffm/view',

    /** School discovery form embed URL (TICKET-041 / D-04).
     *  Google Form + Slack exists, but Kristina (Miro, 3 Aug 2026): hold embed for
     *  Phase 2 — ship the simple /schools page first; re-integrate if people aren't
     *  using the mailto / Start a Conversation path.
     *  To restore embed, set to:
     *  'https://docs.google.com/forms/d/e/1FAIpQLSe2xJASe8EgJ82CEp10y82PM9UPypby22JLyPdMDnFqBcr-qQ/viewform?embedded=true'
     */
    discoveryFormUrl: '',
  },
};
