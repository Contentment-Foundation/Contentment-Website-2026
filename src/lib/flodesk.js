/**
 * FEAT-070 — Flodesk newsletter subscribe (host-agnostic core).
 * ----------------------------------------------------------------------------
 * This module holds ALL the logic. It is deliberately free of any host runtime
 * (no Netlify `event`, no Vercel `req`/`res`, no Astro `APIContext`) so the same
 * code backs both wrappers:
 *
 *   netlify/functions/newsletter.mjs   → today's dev preview
 *   api/newsletter.js                  → the Vercel production target
 *
 * Why a host-native function and not an Astro `/api/newsletter` route: the build
 * is `output: 'static'` with no adapter on purpose (astro.config.mjs, 3 Aug 2026 —
 * the SSR adapter was removed because it shipped a live SSR function, edge
 * middleware and an `/_image` endpoint carrying 5 open Dependabot alerts that no
 * page used). A host function gives us the server-side secret handling that
 * FRONTEND-SPECIFICATION §6.2 Option B requires without reintroducing any of that.
 *
 * API contract verified against developers.flodesk.com (4 Aug 2026):
 *   Base            https://api.flodesk.com/v1
 *   Auth            Basic, base64 of "API_KEY:" (note the trailing colon)
 *   Upsert          POST /v1/subscribers
 *                     { email, first_name, last_name, custom_fields,
 *                       segment_ids, double_optin, optin_ip, optin_timestamp }
 *                     → 200 ok / 400 error
 *   Add to segment  POST /v1/subscribers/{id_or_email}/segments
 *                     { segment_ids: [...] }  → 200 ok / 404 not found
 *
 * The earlier attempt at this ticket was reverted in review for calling Flodesk
 * directly from the browser against an unverified contract (FEATURE-TICKETS.md,
 * 31 Jul). Both of those faults are addressed here: the key is server-only, and
 * the shapes above are the documented ones.
 */

const FLODESK_API = 'https://api.flodesk.com/v1';

/**
 * Form `source` → the env var holding that Flodesk segment ID.
 *
 * Segment IDs are opaque Flodesk strings, so they are NEVER hardcoded here —
 * they come from env (Netlify/Vercel dashboard + local .env), which keeps them
 * out of git and lets each environment point at a different list. Run
 * `node scripts/flodesk-segments.mjs` to print your segment names next to their
 * IDs, then paste the IDs into .env.
 *
 * Confirmed by Somesh (4 Aug 2026) — these three write to the segment named
 * "www.contentment.org" (→ FLODESK_SEGMENT_WWW):
 *   • homepage bottom CTA
 *   • About "Keep me in the loop"
 *   • Why "Send me something meaningful"
 *   • Events "Why we gather" inline box
 * Also confirmed: the Events "Save my free spot" hero CTA opens a capture modal
 * that writes to the segment named "Contentment Festival" (→ FLODESK_SEGMENT_FESTIVAL).
 *
 * The rest fall back to FLODESK_SEGMENT_DEFAULT until their destination is
 * confirmed, so no signup is ever silently misfiled.
 */
export const SEGMENT_ENV_BY_SOURCE = {
  homepage_newsletter_band: 'FLODESK_SEGMENT_WWW', // confirmed → www.contentment.org
  about_page: 'FLODESK_SEGMENT_WWW', // confirmed → www.contentment.org
  why_page: 'FLODESK_SEGMENT_WWW', // confirmed → www.contentment.org
  events_why_gather: 'FLODESK_SEGMENT_WWW', // confirmed → www.contentment.org  ("Keep me posted")
  events_announcements: 'FLODESK_SEGMENT_WWW', // confirmed → www.contentment.org  (closing aside "Keep me posted")
  // Events recap "Join the waitlist" links — no RSVP destination yet (HC-071),
  // so they open CaptureModal instead of dead-ending at #ev-signup.
  bali_waitlist: 'FLODESK_SEGMENT_WWW', // confirmed → www.contentment.org
  regional_waitlist: 'FLODESK_SEGMENT_WWW', // confirmed → www.contentment.org
  recap_be_first: 'FLODESK_SEGMENT_WWW', // confirmed → www.contentment.org
  festival_signup: 'FLODESK_SEGMENT_FESTIVAL', // confirmed → Contentment Festival

  // Still unconfirmed — these fall back to FLODESK_SEGMENT_DEFAULT until someone
  // says otherwise. Point FLODESK_SEGMENT_DEFAULT at "www.contentment.org" if
  // that's the sensible catch-all.
  updates_page: 'FLODESK_SEGMENT_UPDATES',
  events_signup: 'FLODESK_SEGMENT_EVENTS', // top capture fold on /events
};

/** Allowlist. An unknown `source` is rejected rather than defaulted, so a
 *  third party can't probe which segments exist by guessing values. */
export const KNOWN_SOURCES = Object.keys(SEGMENT_ENV_BY_SOURCE);

const MAX_EMAIL = 254; // RFC 5321 practical ceiling
const MAX_NAME = 100;

/** Pragmatic email check. Real validation is Flodesk's job (and the confirmation
 *  email's) — this only rejects obvious junk before we spend an API call. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value, max) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

/**
 * Resolve the Flodesk segment for a form source.
 * Returns '' when nothing is configured — the caller still subscribes the person
 * (dropping a genuine opt-in is worse than an unsegmented one) and reports it.
 */
function resolveSegmentId(source, env) {
  const key = SEGMENT_ENV_BY_SOURCE[source];
  return clean(key && env[key], 200) || clean(env.FLODESK_SEGMENT_DEFAULT, 200);
}

/**
 * Double opt-in is env-driven (FLODESK_DOUBLE_OPTIN = 'true' | 'false').
 * Left unset, the field is omitted entirely and the Flodesk account setting
 * decides — the safe default, since it can't contradict what the account
 * already does for forms built inside Flodesk.
 */
function resolveDoubleOptin(env) {
  const raw = clean(env.FLODESK_DOUBLE_OPTIN, 10).toLowerCase();
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  return null; // omit → account default
}

function authHeader(apiKey) {
  // Flodesk Basic auth is base64("API_KEY:") — the trailing colon is required
  // (empty password). Buffer is available in both Netlify and Vercel Node runtimes.
  return `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`;
}

async function flodeskFetch(path, apiKey, body) {
  const response = await fetch(`${FLODESK_API}${path}`, {
    method: 'POST',
    headers: {
      Authorization: authHeader(apiKey),
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  });

  // Flodesk returns JSON on both success and error, but don't assume it parses.
  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  return { ok: response.ok, status: response.status, payload };
}

/**
 * Subscribe someone to the newsletter.
 *
 * @param {object}   input
 * @param {object}   input.body  parsed JSON request body
 * @param {string}   input.ip    caller IP, for the double opt-in consent trail
 * @param {object}   input.env   process.env (injected so this stays testable)
 * @returns {Promise<{status: number, json: object}>} ready to serialise
 */
export async function subscribe({ body, ip, env }) {
  const payload = body && typeof body === 'object' ? body : {};

  // Honeypot. Real users never see or fill `company`; bots fill every input.
  // Return the normal success shape so the bot learns nothing, but call nothing.
  if (clean(payload.company, MAX_NAME)) {
    return { status: 200, json: { ok: true, confirm: false } };
  }

  const email = clean(payload.email, MAX_EMAIL).toLowerCase();
  const firstName = clean(payload.first_name, MAX_NAME);
  const source = clean(payload.source, 64);

  if (!email || !EMAIL_RE.test(email)) {
    return {
      status: 400,
      json: { ok: false, error: 'invalid_email', message: 'Please enter a valid email address.' },
    };
  }

  if (!KNOWN_SOURCES.includes(source)) {
    return {
      status: 400,
      json: { ok: false, error: 'invalid_source', message: 'Something went wrong. Please try again.' },
    };
  }

  const apiKey = clean(env.FLODESK_API_KEY, 200);
  if (!apiKey) {
    // Not wired yet. 503 (not 500) so monitoring reads it as "unconfigured",
    // and the visitor gets copy that doesn't blame them.
    console.error('[newsletter] FLODESK_API_KEY is not set — refusing to call Flodesk.');
    return {
      status: 503,
      json: {
        ok: false,
        error: 'not_configured',
        message: 'Newsletter signup is briefly unavailable. Please try again later.',
      },
    };
  }

  const segmentId = resolveSegmentId(source, env);
  const doubleOptin = resolveDoubleOptin(env);

  const subscriberBody = {
    email,
    // `source` is stored as a custom field so one segment can still be broken
    // down by which form the person actually used.
    custom_fields: { source },
  };
  if (firstName) subscriberBody.first_name = firstName;
  if (segmentId) subscriberBody.segment_ids = [segmentId];
  if (doubleOptin !== null) {
    subscriberBody.double_optin = doubleOptin;
    if (doubleOptin) {
      // Consent trail — only meaningful for double opt-in.
      if (ip) subscriberBody.optin_ip = ip;
      subscriberBody.optin_timestamp = new Date().toISOString();
    }
  }

  // 1) Upsert the subscriber.
  const created = await flodeskFetch('/subscribers', apiKey, subscriberBody);
  if (!created.ok) {
    // Log the detail server-side; never return Flodesk's raw error to the browser
    // (it can echo account internals).
    console.error(
      `[newsletter] Flodesk upsert failed — status=${created.status} source=${source}`,
      created.payload,
    );
    return {
      status: 502,
      json: {
        ok: false,
        error: 'upstream_error',
        message: "We couldn't sign you up just now. Please try again in a moment.",
      },
    };
  }

  // 2) Add to the segment explicitly. `segment_ids` on the upsert above is
  //    documented, but this endpoint is the authoritative way to attach a
  //    segment, and it makes an existing subscriber joining a NEW segment work
  //    (an upsert alone won't always re-segment someone already on the list).
  if (segmentId) {
    const segmented = await flodeskFetch(
      `/subscribers/${encodeURIComponent(email)}/segments`,
      apiKey,
      { segment_ids: [segmentId] },
    );
    if (!segmented.ok) {
      // The person IS subscribed at this point — don't fail their signup over
      // the segment call. Log loudly so it gets noticed.
      console.error(
        `[newsletter] Flodesk segment attach failed — status=${segmented.status} source=${source}`,
        segmented.payload,
      );
    }
  } else {
    console.warn(
      `[newsletter] No segment configured for source="${source}" — subscriber created unsegmented. ` +
        `Set ${SEGMENT_ENV_BY_SOURCE[source]} or FLODESK_SEGMENT_DEFAULT.`,
    );
  }

  // `confirm` drives the success copy: double opt-in needs "check your inbox",
  // single opt-in doesn't. When the account setting decides, we can't know, so
  // fall back to the non-committal message.
  return { status: 200, json: { ok: true, confirm: doubleOptin === true } };
}

/**
 * Shared request guard for both wrappers: method + body parsing.
 * @returns {{error: {status: number, json: object}} | {body: object}}
 */
export function parseRequest(method, rawBody) {
  if (method !== 'POST') {
    return { error: { status: 405, json: { ok: false, error: 'method_not_allowed' } } };
  }

  if (rawBody && typeof rawBody === 'object') return { body: rawBody };

  try {
    return { body: rawBody ? JSON.parse(rawBody) : {} };
  } catch {
    return { error: { status: 400, json: { ok: false, error: 'invalid_json' } } };
  }
}
