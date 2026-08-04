/**
 * CONTENTMENT — SEAMS (Astro-native)
 * ----------------------------------------------------------------------------
 * This is the ONLY file to edit to wire up the still-pending destinations.
 * Internal page-to-page nav does NOT live here — Astro's file-based routing
 * handles that natively (see Nav.astro / Footer.astro, which link straight to
 * /why, /our-impact, etc.). This file only holds things that are genuine
 * external/business decisions. As of 4 Aug 2026: Keela General Donation Form is
 * live (see `keela` + `donate`); still pending — per-tier Homeroom `joinTiers`,
 * India region, join-flow / RSVP choreography, and Kristina's button inventory
 * (HC-005 / FEAT-005).
 *
 * Leave a value '' until it's confirmed; every consumer treats '' as "not
 * wired yet" and falls back to a safe default (usually '#').
 */
export const seams = {
  /**
   * Keela Forms — master org + embeds.
   * 4 Aug 2026: shipping **General Donation Form** (give-usa) for all regions
   * except India (deferred). Per-tier Homeroom checkout URLs still TBD — when
   * those land, fill joinTiers and keep this as the general / one-time path.
   */
  keela: {
    /** Org ID for the site-wide master script (BaseLayout <head>). */
    orgId: 'CBbknhqovLi8DNEzW',
    /** Interim site-wide donation form — use everywhere we had a donate widget. */
    generalDonationForm: {
      name: 'General Donation Form',
      embedSrc: 'https://give-usa.keela.co/embed/MnqZFksL49Ym3M8Ho',
    },
  },

  /** Donate CTAs → Get Involved Join Homeroom fold (`#become`). */
  donate: '/getinvolved#become',

  /** Join / Homeroom destination. Until Keela join-flow (HC-071), route to /getinvolved. */
  join: '/getinvolved',

  /**
   * Homepage Keela form deep-link for a Homeroom monthly amount.
   * Used by /getinvolved Join Homeroom when joinTiers URLs are empty.
   * KeelaDonateForm reads `amount` + `frequency` and forwards them to the embed iframe.
   */
  homeroomDonateUrl(amount: 25 | 50 | 100 | string = 100): string {
    const n = String(amount);
    const allowed = n === '25' || n === '50' || n === '100' ? n : '100';
    return `/?amount=${allowed}&frequency=monthly#homeroom`;
  },

  /** Per-tier Keela checkout URLs (D-01 $25/$50/$100). Empty until per-tier
   *  Homeroom products land — meantime /getinvolved Join Homeroom uses homeroomDonateUrl().
   *  When set, /getinvolved tier picker routes Join Homeroom to the selected tier URL. */
  joinTiers: {
    25: '',
    50: '',
    100: '',
  },

  /** Get Involved "Prefer to give differently" → one-time gift.
   *  Interim: same General Donation Form (supports one-time + monthly). */
  giveOneTime: '/#homeroom',

  /** Get Involved "Prefer to give differently" → other options.
   *  Kristina (Aug 2026): "Other ways to give" → Email us → hello@contentment.org. */
  waysToGive: 'mailto:hello@contentment.org',

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
