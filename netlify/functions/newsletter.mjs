/**
 * FEAT-070 — POST /api/newsletter (Netlify wrapper).
 *
 * All logic lives in src/lib/flodesk.js; this only adapts Netlify's event shape.
 * netlify.toml rewrites /api/newsletter → /.netlify/functions/newsletter so the
 * public path matches the Vercel twin in api/newsletter.js and the client never
 * has to know which host it is on.
 *
 * Local testing needs `netlify dev` (astro dev alone does not serve functions).
 */
import { assertAllowedOrigin, parseRequest, subscribe } from '../../src/lib/flodesk.js';
import { enforceRateLimit } from '../../src/lib/ratelimit.js';

const JSON_HEADERS = {
  'Content-Type': 'application/json',
  // A subscribe result must never be cached by a CDN or the browser.
  'Cache-Control': 'no-store',
};

export async function handler(event) {
  const headers = event.headers || {};
  // Netlify lowercases header names; Origin/Referer may arrive either way.
  const origin = headers.origin || headers.Origin;
  const referer = headers.referer || headers.Referer || headers.referrer;

  const originGate = assertAllowedOrigin(origin, referer);
  if (originGate) {
    return {
      statusCode: originGate.status,
      headers: JSON_HEADERS,
      body: JSON.stringify(originGate.json),
    };
  }

  // Netlify sets x-nf-client-connection-ip (trusted); x-forwarded-for is fallback.
  const ip =
    headers['x-nf-client-connection-ip'] ||
    (headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    'unknown';

  const limited = await enforceRateLimit(`api:newsletter:${ip}`, process.env);
  if (limited) {
    return {
      statusCode: limited.status,
      headers: JSON_HEADERS,
      body: JSON.stringify(limited.json),
    };
  }

  const parsed = parseRequest(event.httpMethod, event.body);
  if (parsed.error) {
    return {
      statusCode: parsed.error.status,
      headers: JSON_HEADERS,
      body: JSON.stringify(parsed.error.json),
    };
  }

  const result = await subscribe({ body: parsed.body, ip, env: process.env });

  return {
    statusCode: result.status,
    headers: JSON_HEADERS,
    body: JSON.stringify(result.json),
  };
}
