/**
 * Accessible modal behaviour for the shared video lightbox (`#lb`) on
 * /why, /our-impact and /schools.
 *
 * WHY THIS EXISTS — PRE-LAUNCH-QA-AUDIT.md flagged the /schools lightbox as a real
 * keyboard trap (WCAG 2.1.2 Level A). All three pages had the same defect: the only
 * Escape handler was bound to `window`, so once focus entered the YouTube player it
 * never fired again. YouTube is a CROSS-ORIGIN iframe — the parent document receives
 * no key events from inside it at all, so no amount of keydown handling can fix this.
 * A keyboard user who tabbed into the video could not get back out.
 *
 * THE FIX IS FOCUS MANAGEMENT, NOT KEY HANDLING:
 *
 *  1. On open, focus moves to the Close button. The user starts on a control that
 *     works rather than being dropped into an iframe we cannot hear from.
 *  2. Two focus SENTINELS bookend the dialog — empty, `aria-hidden`, `tabindex="0"`
 *     spans. Tabbing out of the cross-origin iframe lands on the trailing sentinel,
 *     and its `focus` event DOES fire in the parent document (unlike keydown), so we
 *     can bounce focus back to the Close button. This is the only mechanism that
 *     contains focus around a cross-origin frame.
 *  3. On close, focus returns to the element that opened the dialog, so the user is
 *     put back where they were rather than at the top of the page.
 *
 * Escape is still handled on `document` for when focus is on the dialog chrome, and
 * the trailing sentinel guarantees the user can always reach the Close button, which
 * is what actually discharges the trap.
 *
 * The sentinels are created here rather than in markup so the three pages stay in
 * sync — a copy-pasted `<span>` in three files is exactly how this drifted before.
 */

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'iframe',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/**
 * @param {HTMLElement} dialog   the `.lb` container (`role="dialog"`)
 * @param {HTMLElement} closeBtn the close control inside it
 * @param {() => void}  requestClose  page-owned close routine (clears the slot etc.)
 * @returns {{ opened: (trigger?: Element | null) => void, closed: () => void }}
 */
export function attachLightboxA11y(dialog, closeBtn, requestClose) {
  if (!dialog || !closeBtn) return { opened() {}, closed() {} };

  let lastFocused = null;

  const makeSentinel = () => {
    const s = document.createElement('span');
    s.tabIndex = 0;
    s.setAttribute('aria-hidden', 'true');
    // Zero-size but still focusable. `display:none`/`visibility:hidden` would make it
    // unfocusable and defeat the whole mechanism.
    s.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0';
    return s;
  };

  const head = makeSentinel();
  const tail = makeSentinel();
  dialog.insertBefore(head, dialog.firstChild);
  dialog.appendChild(tail);

  /** Real focusables, sentinels excluded. */
  const items = () =>
    Array.from(dialog.querySelectorAll(FOCUSABLE)).filter((el) => el !== head && el !== tail);

  // Shift-Tab off the first control wraps to the last; Tab off the last (including out
  // of the YouTube iframe) wraps back to the first.
  head.addEventListener('focus', () => {
    const list = items();
    (list[list.length - 1] || closeBtn).focus();
  });
  tail.addEventListener('focus', () => {
    (items()[0] || closeBtn).focus();
  });

  const onKeydown = (e) => {
    if (e.key === 'Escape' && dialog.classList.contains('open')) {
      e.stopPropagation();
      requestClose();
    }
  };

  return {
    /** Call AFTER the dialog is made visible. `trigger` is the element that opened it. */
    opened(trigger) {
      lastFocused = trigger instanceof HTMLElement ? trigger : document.activeElement;
      document.addEventListener('keydown', onKeydown);
      // Deferred: the iframe is injected in the same tick, and focusing before paint
      // is unreliable in Safari.
      requestAnimationFrame(() => closeBtn.focus());
    },
    /** Call AFTER the dialog is hidden and its slot cleared. */
    closed() {
      document.removeEventListener('keydown', onKeydown);
      if (lastFocused && document.contains(lastFocused)) lastFocused.focus();
      lastFocused = null;
    },
  };
}
