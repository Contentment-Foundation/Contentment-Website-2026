/**
 * FEAT-070 — POST /api/newsletter (Vercel wrapper).
 *
 * All logic lives in src/lib/flodesk.js; this only adapts Vercel's req/res shape.
 * Vercel picks up this root-level `api/` directory as a serverless function
 * alongside the static Astro build — no @astrojs/vercel adapter, so none of the
 * SSR/image/middleware surface removed on 3 Aug comes back (see astro.config.mjs).
 *
 * Verify this route once at Vercel cutover (TICKET-002 / FEAT-101): the Netlify
 * twin is what actually runs on today's preview.
 */
import { assertAllowedOrigin, parseRequest, subscribe } from '../src/lib/flodesk.js';
import { enforceRateLimit } from '../src/lib/ratelimit.js';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');

  const originGate = assertAllowedOrigin(req.headers.origin, req.headers.referer);
  if (originGate) {
    return res.status(originGate.status).json(originGate.json);
  }

  // Prefer Vercel's trusted client IP; fall back to first XFF hop.
  const ip =
    (req.headers['x-real-ip'] ||
      req.headers['x-vercel-forwarded-for'] ||
      req.headers['x-forwarded-for'] ||
      '')
      .split(',')[0]
      .trim() || 'unknown';

  const limited = await enforceRateLimit(`api:newsletter:${ip}`, process.env);
  if (limited) {
    return res.status(limited.status).json(limited.json);
  }

  // Vercel parses JSON bodies automatically; parseRequest handles both shapes.
  const parsed = parseRequest(req.method, req.body);
  if (parsed.error) {
    return res.status(parsed.error.status).json(parsed.error.json);
  }

  const result = await subscribe({ body: parsed.body, ip, env: process.env });

  return res.status(result.status).json(result.json);
}
