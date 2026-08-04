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
import { parseRequest, subscribe } from '../../src/lib/flodesk.js';

const JSON_HEADERS = {
  'Content-Type': 'application/json',
  // A subscribe result must never be cached by a CDN or the browser.
  'Cache-Control': 'no-store',
};

export async function handler(event) {
  const parsed = parseRequest(event.httpMethod, event.body);
  if (parsed.error) {
    return {
      statusCode: parsed.error.status,
      headers: JSON_HEADERS,
      body: JSON.stringify(parsed.error.json),
    };
  }

  const headers = event.headers || {};
  // Netlify sets x-nf-client-connection-ip; x-forwarded-for is the fallback.
  const ip =
    headers['x-nf-client-connection-ip'] ||
    (headers['x-forwarded-for'] || '').split(',')[0].trim();

  const result = await subscribe({ body: parsed.body, ip, env: process.env });

  return {
    statusCode: result.status,
    headers: JSON_HEADERS,
    body: JSON.stringify(result.json),
  };
}
