#!/usr/bin/env node
/**
 * FEAT-070 helper — print your Flodesk segments with their IDs.
 *
 * The Flodesk API addresses segments by opaque ID, but humans name them
 * ("www.contentment.org"). Run this once to get the mapping, then paste the IDs
 * into .env (and into the Netlify / Vercel dashboards).
 *
 *   node scripts/flodesk-segments.mjs
 *
 * Reads FLODESK_API_KEY from the environment, falling back to .env at the repo
 * root. Prints IDs only — it never writes .env for you, so nothing secret moves
 * without you looking at it.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Minimal .env reader — avoids adding a dotenv dependency for a one-off script. */
function readEnvFile() {
  const file = path.join(rootDir, '.env');
  if (!fs.existsSync(file)) return {};
  const out = {};
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match) out[match[1]] = match[2].replace(/^["']|["']$/g, '');
  }
  return out;
}

const apiKey = process.env.FLODESK_API_KEY || readEnvFile().FLODESK_API_KEY;

if (!apiKey) {
  console.error('FLODESK_API_KEY is not set (checked environment and .env).');
  process.exit(1);
}

const response = await fetch('https://api.flodesk.com/v1/segments?per_page=100', {
  headers: {
    Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`,
    Accept: 'application/json',
  },
});

if (!response.ok) {
  console.error(`Flodesk returned ${response.status} ${response.statusText}`);
  console.error(await response.text());
  process.exit(1);
}

const body = await response.json();
const segments = body.data || body.segments || [];

if (!segments.length) {
  console.log('No segments returned.');
  process.exit(0);
}

console.log('\nFlodesk segments — paste the id you want into .env:\n');
for (const segment of segments) {
  console.log(`  ${segment.name}`);
  console.log(`    id: ${segment.id}\n`);
}
console.log('Env vars consumed by src/lib/flodesk.js:');
console.log('  FLODESK_SEGMENT_WWW        homepage + /about + /why + /events "Why we gather"');
console.log('                             (→ "www.contentment.org")');
console.log('  FLODESK_SEGMENT_FESTIVAL   /events "Save my free spot"  (→ "Contentment Festival")');
console.log('  FLODESK_SEGMENT_UPDATES    /updates page');
console.log('  FLODESK_SEGMENT_EVENTS     /events top signup + closing aside');
console.log('  FLODESK_SEGMENT_DEFAULT    fallback for anything unmapped\n');
