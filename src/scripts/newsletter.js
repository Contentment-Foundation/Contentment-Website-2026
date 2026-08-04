// FEAT-070 — shared newsletter submit behaviour for every email-capture form.
//
// Binds any <form data-newsletter="<source>"> on the page, POSTs to
// /api/newsletter (same origin — the host function in netlify/functions or api/),
// and renders inline success/error states. The Flodesk key stays server-side;
// this file never talks to Flodesk directly.
//
// `source` must be one of KNOWN_SOURCES in src/lib/flodesk.js — the server
// rejects anything else, and that string is what picks the Flodesk segment.
//
// Analytics note (TICKET-080): `newsletter_submit` now fires on a CONFIRMED
// subscribe, not on the click. Before FEAT-070 there was no backend, so the
// event could only mean "the user pressed the button"; it now means a real
// conversion. Expect the number to drop and to actually be meaningful.

import { trackEvent } from './analytics.js';

const ENDPOINT = '/api/newsletter';

function setStatus(form, message, tone) {
  const status = form.querySelector('[data-newsletter-status]');
  if (!status) return;
  status.textContent = message;
  status.dataset.tone = tone; // 'error' | 'success' | '' — styled in global.css
}

export function initNewsletterForms(root = document) {
  root.querySelectorAll('form[data-newsletter]').forEach((form) => {
    // Guard: a page could call this from more than one component's script.
    // Binding twice would fire two POSTs per submit.
    if (form.dataset.newsletterBound === 'true') return;
    form.dataset.newsletterBound = 'true';

    const button = form.querySelector('button[type="submit"], button:not([type])');
    const emailInput = form.querySelector('input[name="email"]');
    const nameInput = form.querySelector('input[name="first_name"]');

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      // Read BOTH of these per-submit, not once at bind time: CaptureModal reuses
      // a single form for several CTAs, rewriting data-newsletter and the button
      // label each time it opens. Caching either would send the wrong segment or
      // restore the wrong label after an error.
      const source = form.getAttribute('data-newsletter');
      const defaultLabel = button ? button.textContent : '';

      // Already subscribed in this pageview — don't let a second click re-post.
      if (form.dataset.state === 'done' || form.dataset.state === 'busy') return;

      const email = emailInput ? emailInput.value.trim() : '';
      if (!email) {
        setStatus(form, 'Please enter your email address.', 'error');
        emailInput?.focus();
        return;
      }

      form.dataset.state = 'busy';
      if (button) {
        button.disabled = true;
        button.textContent = 'Subscribing…';
      }
      setStatus(form, '', '');

      try {
        const response = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            first_name: nameInput ? nameInput.value.trim() : '',
            source,
            // Honeypot — mirrors the hidden input; bots that fill every field
            // get a silent no-op success from the server.
            company: form.querySelector('input[name="company"]')?.value || '',
          }),
        });

        const result = await response.json().catch(() => ({}));

        if (response.ok && result.ok) {
          form.dataset.state = 'done';
          setStatus(
            form,
            result.confirm
              ? 'Almost there — check your inbox to confirm your subscription.'
              : "You're in. Thanks for joining us.",
            'success',
          );
          if (button) button.textContent = 'Subscribed';
          if (emailInput) emailInput.disabled = true;
          if (nameInput) nameInput.disabled = true;

          trackEvent('newsletter_submit', { source, confirm: Boolean(result.confirm) });
          return;
        }

        // Server sent a human-safe message; fall back if it didn't.
        form.dataset.state = '';
        setStatus(form, result.message || 'Something went wrong. Please try again.', 'error');
        if (button) {
          button.disabled = false;
          button.textContent = defaultLabel;
        }
        trackEvent('newsletter_error', { source, reason: result.error || 'unknown' });
      } catch {
        // Network failure / offline — the request never reached the function.
        form.dataset.state = '';
        setStatus(form, 'Connection problem. Please try again.', 'error');
        if (button) {
          button.disabled = false;
          button.textContent = defaultLabel;
        }
        trackEvent('newsletter_error', { source, reason: 'network' });
      }
    });
  });
}
