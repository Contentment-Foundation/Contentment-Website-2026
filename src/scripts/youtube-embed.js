/**
 * Shared YouTube embed helpers.
 *
 * Prefer www.youtube.com (not youtube-nocookie.com): the privacy-enhanced host
 * often trips YouTube's "Sign in to confirm you're not a bot" wall because it
 * cannot share a signed-in Google session with the parent page.
 * Always send referrerpolicy so Error 153 ("content is blocked") stays away.
 */

export function youtubeEmbedSrc(id, { list, autoplay = true, modest = false } = {}) {
  const params = new URLSearchParams({
    rel: '0',
    playsinline: '1',
  });
  if (autoplay) params.set('autoplay', '1');
  if (modest) params.set('modestbranding', '1');
  if (list) params.set('list', list);
  if (typeof location !== 'undefined' && location.origin) {
    params.set('origin', location.origin);
  }
  return `https://www.youtube.com/embed/${id}?${params.toString()}`;
}

export const YT_IFRAME_ALLOW =
  'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen';

/** Inline style that fills a positioned 16:9 (or any) parent. */
export const YT_IFRAME_FILL_STYLE =
  'position:absolute;inset:0;width:100%;height:100%;border:0;display:block';

/**
 * Build a ready-to-insert iframe HTML string for lightbox slots.
 */
export function youtubeIframeHtml(id, { list, title = 'Video', style = YT_IFRAME_FILL_STYLE } = {}) {
  const src = youtubeEmbedSrc(id, { list });
  return (
    `<iframe src="${src}" title="${title}" allow="${YT_IFRAME_ALLOW}" ` +
    `allowfullscreen referrerpolicy="strict-origin-when-cross-origin" ` +
    `style="${style}"></iframe>`
  );
}

/**
 * Create an iframe element for click-to-play tiles.
 */
export function createYoutubeIframe(id, { list, title = 'Video', modest = false } = {}) {
  const f = document.createElement('iframe');
  f.src = youtubeEmbedSrc(id, { list, modest });
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
