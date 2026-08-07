/**
 * Shared YouTube embed helpers.
 *
 * Prefer www.youtube.com (not youtube-nocookie.com): the privacy-enhanced host
 * often trips YouTube's "Sign in to confirm you're not a bot" wall because it
 * cannot share a signed-in Google session with the parent page.
 * Always send referrerpolicy so Error 153 ("content is blocked") stays away.
 */

/** YouTube video IDs are 11 chars from [A-Za-z0-9_-]. */
const YT_ID_RE = /^[\w-]{11}$/;
/** Playlist IDs are longer opaque tokens; keep a tight allowlist. */
const YT_LIST_RE = /^[\w-]{10,64}$/;

export function sanitizeYoutubeId(id) {
  const s = typeof id === 'string' ? id.trim() : '';
  return YT_ID_RE.test(s) ? s : '';
}

export function sanitizeYoutubeList(list) {
  const s = typeof list === 'string' ? list.trim() : '';
  return YT_LIST_RE.test(s) ? s : '';
}

function escapeAttr(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );
}

export function youtubeEmbedSrc(id, { list, autoplay = true, modest = false } = {}) {
  const safeId = sanitizeYoutubeId(id);
  if (!safeId) return '';
  const params = new URLSearchParams({
    rel: '0',
    playsinline: '1',
  });
  if (autoplay) params.set('autoplay', '1');
  if (modest) params.set('modestbranding', '1');
  const safeList = sanitizeYoutubeList(list);
  if (safeList) params.set('list', safeList);
  if (typeof location !== 'undefined' && location.origin) {
    params.set('origin', location.origin);
  }
  return `https://www.youtube.com/embed/${safeId}?${params.toString()}`;
}

export const YT_IFRAME_ALLOW =
  'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen';

/** Inline style that fills a positioned 16:9 (or any) parent. */
export const YT_IFRAME_FILL_STYLE =
  'position:absolute;inset:0;width:100%;height:100%;border:0;display:block';

/**
 * Build a ready-to-insert iframe HTML string for lightbox slots.
 * Returns empty string when the ID is invalid (caller should not inject).
 */
export function youtubeIframeHtml(id, { list, title = 'Video', style = YT_IFRAME_FILL_STYLE } = {}) {
  const src = youtubeEmbedSrc(id, { list });
  if (!src) return '';
  return (
    `<iframe src="${escapeAttr(src)}" title="${escapeAttr(title)}" allow="${YT_IFRAME_ALLOW}" ` +
    `allowfullscreen referrerpolicy="strict-origin-when-cross-origin" ` +
    `style="${escapeAttr(style)}"></iframe>`
  );
}

/**
 * Create an iframe element for click-to-play tiles.
 * Returns null when the ID is invalid.
 */
export function createYoutubeIframe(id, { list, title = 'Video', modest = false } = {}) {
  const src = youtubeEmbedSrc(id, { list, modest });
  if (!src) return null;
  const f = document.createElement('iframe');
  f.src = src;
  f.title = title;
  f.allow = YT_IFRAME_ALLOW;
  f.setAttribute('allowfullscreen', '');
  f.setAttribute('playsinline', '1');
  f.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
  f.referrerPolicy = 'strict-origin-when-cross-origin';
  f.setAttribute('width', '100%');
  f.setAttribute('height', '100%');
  f.style.cssText = YT_IFRAME_FILL_STYLE;
  return f;
}
