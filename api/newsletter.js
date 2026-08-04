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
import { parseRequest, subscribe } from '../src/lib/flodesk.js';

export default async function handler(req, res) {
  // Vercel parses JSON bodies automatically; parseRequest handles both shapes.
  const parsed = parseRequest(req.method, req.body);

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');

  if (parsed.error) {
    return res.status(parsed.error.status).json(parsed.error.json);
  }

  const ip =
    (req.headers['x-vercel-forwarded-for'] ||
      req.headers['x-forwarded-for'] ||
      '')
      .split(',')[0]
      .trim();

  const result = await subscribe({ body: parsed.body, ip, env: process.env });

  return res.status(result.status).json(result.json);
}
