// src/utils/escape-html.ts

/**
 * Escapes a string for safe interpolation into an HTML email body. Anything a
 * visitor typed goes through this before it reaches a template - otherwise a
 * message containing markup would render as markup in an admin's inbox.
 */
export const escapeHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

/** Escapes, then turns newlines into `<br />` so paragraphs survive the trip. */
export const escapeHtmlWithBreaks = (value: string): string =>
  escapeHtml(value).replaceAll('\n', '<br />');
