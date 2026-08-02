import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import sentry from '@sentry/astro';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

// Directory indexes under public/ (docs hub + briefs). Netlify serves these via
// netlify.toml [[redirects]]. Astro `redirects` must NOT list them — at build
// time Astro writes absolute redirect HTML (using `site`) that overwrites the
// real public/docs files and sends Netlify preview traffic to contentment.org.
const docsIndexes = [
  '/docs',
  '/docs/tech-brief',
  '/docs/team-brief',
  '/docs/growth-brief',
  '/docs/automation-brief',
  '/docs/dev-timeline',
  '/docs/dev-timeline/classic',
];

/** Dev-only: serve public/.../index.html for bare directory URLs (Vite doesn't). */
function docsIndexDevPlugin() {
  return {
    name: 'docs-index-dev',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = (req.url || '').split('?')[0];
        const match = docsIndexes.find((p) => url === p || url === `${p}/`);
        if (!match) return next();
        const file = path.join(rootDir, 'public', match.slice(1), 'index.html');
        if (!fs.existsSync(file)) return next();
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(fs.readFileSync(file));
      });
    },
  };
}

// TICKET-080 (Analytics setup) — Sentry client-side error tracking (DECISION-006).
// Only registered when SENTRY_DSN is actually set: with no DSN (today's real state),
// the integration is omitted entirely so no Sentry code ships and the build can't
// fail on it. This is a static site with no API routes yet, so client-side only —
// no server instrumentation. Source map upload is disabled for now (no
// SENTRY_AUTH_TOKEN/org/project configured); revisit once a Sentry project exists.
const integrations = [];
if (process.env.SENTRY_DSN) {
  integrations.push(
    sentry({
      dsn: process.env.SENTRY_DSN,
      sourcemaps: { disable: true },
    }),
  );
}

export default defineConfig({
  site: 'https://contentment.org',
  // TICKET-002 / FEAT-070 / FEAT-101 — 2 Aug 2026.
  // 'hybrid' = every page still prerenders to static HTML exactly as before; a route
  // only becomes server-rendered if it explicitly opts out with `export const
  // prerender = false`. Nothing does today, so the built output is byte-for-byte the
  // same static site — this purely unlocks the ability to add `/api/*` endpoints
  // (FEAT-070's server-side newsletter route, per TECHNICAL-ARCHITECTURE §6.2, which
  // needs the server-only FLODESK_API_KEY and so cannot be done client-side).
  //
  // Adapter is Netlify because Netlify is the host until go-live; production moves to
  // Vercel at DNS cutover (FEAT-101), which is a one-line adapter swap to
  // @astrojs/vercel plus the existing vercel.json. Pinned to @astrojs/netlify@5.x —
  // 6.x requires Astro 5 and 8.x requires Astro 7; we are on Astro 4.16.
  output: 'hybrid',
  adapter: netlify(),
  // Only paths that are NOT also real files under public/ (those would be overwritten).
  redirects: {
    '/foundation-reach-map': '/foundation-reach-map.html',
    '/story-board': '/story-board.html',
    '/story-board-feed-guide': '/story-board-feed-guide.html',
  },
  integrations,
  vite: {
    plugins: [docsIndexDevPlugin()],
  },
});
