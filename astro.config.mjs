import { defineConfig } from 'astro/config';
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
  site: 'https://www.contentment.org',
  // TICKET-002 / FEAT-070 / FEAT-101 — 3 Aug 2026. Was `output: 'hybrid'` + the
  // Netlify adapter (2 Aug) to unlock `/api/*` for FEAT-070's newsletter route.
  // Reverted to pure static: no route ever set `prerender = false`, so hybrid bought
  // us nothing shipped while deploying a live SSR function, an edge middleware and an
  // `/_image` endpoint — a runtime attack surface carrying 5 open Dependabot alerts
  // (Host-header SSRF, X-Forwarded-Host reflection, sharp/libvips) that no page used.
  // Verified: static output is file-for-file identical to the hybrid build minus
  // `_redirects`, which netlify.toml already covers.
  //
  // No `redirects` block on purpose. Without an adapter Astro stops emitting
  // `dist/_redirects` and writes meta-refresh FILES instead, hardcoded to absolute
  // `site` URLs — and a real file beats a non-forced netlify.toml rewrite, so
  // /foundation-reach-map on the Netlify preview would bounce visitors to production
  // contentment.org. All three prototype routes live in netlify.toml instead (200
  // rewrites). Same trap as the docs/* note above; don't reintroduce either list here.
  //
  // Restoring server routes: Astro 5 REMOVES `output: 'hybrid'` and folds per-route
  // `prerender = false` into `'static'`, so after the Astro 4→7 migration this line
  // stays as-is and you only re-add an adapter (@astrojs/vercel@11 for FEAT-101, which
  // peers on astro@^7 — same upgrade, so do them together).
  output: 'static',
  // 6 Aug 2026 — was Astro's default `'directory'`, which emits `why/index.html` and is
  // therefore served at `/why/`. Every internal link we write, and every sitemap entry,
  // says `/why` with no slash — so each navigation cost a 301, measured by the 6 Aug
  // Lighthouse run at ~1.2–1.4 s of FCP/LCP on EVERY non-home route on mobile.
  // `'file'` emits `why.html`, which Netlify serves at `/why` directly. This aligns the
  // build with what the links and sitemap already claimed, rather than rewriting ~40 hrefs
  // to add slashes. Canonical (`Astro.url.pathname`) follows automatically.
  build: { format: 'file' },
  integrations,
  vite: {
    plugins: [docsIndexDevPlugin()],
  },
});
