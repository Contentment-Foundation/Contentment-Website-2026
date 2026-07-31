import { defineConfig } from 'astro/config';

// Directory-index rewrites so /docs/ (and brief slugs) resolve in `astro dev`
// the same way Netlify does via netlify.toml [[redirects]]. Vite does not
// auto-serve public/*/index.html for bare directory URLs.
const docsIndexes = [
  '/docs',
  '/docs/tech-brief',
  '/docs/team-brief',
  '/docs/growth-brief',
  '/docs/automation-brief',
  '/docs/dev-timeline',
  '/docs/dev-timeline/classic',
];

const redirects = Object.fromEntries(
  docsIndexes.flatMap((path) => [
    [path, `${path}/index.html`],
    [`${path}/`, `${path}/index.html`],
  ]),
);

export default defineConfig({
  site: 'https://contentment.org',
  output: 'static',
  redirects: {
    ...redirects,
    '/foundation-reach-map': '/foundation-reach-map.html',
    '/story-board': '/story-board.html',
    '/story-board-feed-guide': '/story-board-feed-guide.html',
  },
});
