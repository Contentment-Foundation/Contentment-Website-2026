/**
 * Shared Upstash rate limiter for host-native /api/* functions.
 * Spec: TECHNICAL-ARCHITECTURE.md §10 — 5 req / 15 min / IP.
 *
 * Production fails closed when UPSTASH_* is unset (DECISION-004).
 * Preview / local may proceed with a loud warning so forms stay testable
 * until Redis credentials are wired in the host dashboard.
 */
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

/** @type {Ratelimit | null | undefined} */
let cachedLimiter;

function hasUpstashEnv(env) {
  return Boolean(clean(env.UPSTASH_REDIS_REST_URL) && clean(env.UPSTASH_REDIS_REST_TOKEN));
}

function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * True when this invocation is the real production host (not Netlify/Vercel preview).
 */
export function isProductionRuntime(env = process.env) {
  if (env.VERCEL_ENV === 'production') return true;
  if (env.CONTEXT === 'production') return true; // Netlify
  return false;
}

function getLimiter(env) {
  if (cachedLimiter !== undefined) return cachedLimiter;
  if (!hasUpstashEnv(env)) {
    cachedLimiter = null;
    return null;
  }
  cachedLimiter = new Ratelimit({
    redis: new Redis({
      url: clean(env.UPSTASH_REDIS_REST_URL),
      token: clean(env.UPSTASH_REDIS_REST_TOKEN),
    }),
    limiter: Ratelimit.slidingWindow(5, '15 m'),
    analytics: true,
    prefix: 'contentment:ratelimit',
  });
  return cachedLimiter;
}

/**
 * @param {string} key  e.g. `api:newsletter:${ip}`
 * @param {object} [env]
 * @returns {Promise<{status: number, json: object} | null>}
 *   null = allowed; otherwise a ready-to-return error response
 */
export async function enforceRateLimit(key, env = process.env) {
  const limiter = getLimiter(env);

  if (!limiter) {
    if (isProductionRuntime(env)) {
      console.error(
        '[ratelimit] UPSTASH_REDIS_REST_URL / TOKEN unset in production — refusing request.',
      );
      return {
        status: 503,
        json: {
          ok: false,
          error: 'not_configured',
          message: 'Newsletter signup is briefly unavailable. Please try again later.',
        },
      };
    }
    console.warn(
      '[ratelimit] UPSTASH_* unset — skipping rate limit outside production. Wire Redis before cutover.',
    );
    return null;
  }

  const { success } = await limiter.limit(key);
  if (!success) {
    return {
      status: 429,
      json: {
        ok: false,
        error: 'rate_limited',
        message: 'Too many requests. Please try again in a few minutes.',
      },
    };
  }
  return null;
}
