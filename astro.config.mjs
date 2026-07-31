import { defineConfig } from 'astro/config';
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

export default defineConfig({
  site: 'https://contentment.org',
  output: 'static',
  // Only paths that are NOT also real files under public/ (those would be overwritten).
  redirects: {
    '/foundation-reach-map': '/foundation-reach-map.html',
    '/story-board': '/story-board.html',
    '/story-board-feed-guide': '/story-board-feed-guide.html',
  },
  vite: {
    plugins: [docsIndexDevPlugin()],
  },
});
