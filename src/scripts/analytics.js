// Shared conversion-event helper for TICKET-080 (Analytics setup).
// Fires an event through both GA4 (gtag) and PostHog, each independently
// no-op-safe: if Analytics.astro didn't initialise a tool (env var unset),
// this silently skips it rather than throwing. See src/components/Analytics.astro.

export function trackEvent(name, properties = {}) {
  if (typeof window === 'undefined') return;

  if (typeof window.gtag === 'function') {
    window.gtag('event', name, properties);
  }

  if (window.posthog && typeof window.posthog.capture === 'function') {
    window.posthog.capture(name, properties);
  }
}
