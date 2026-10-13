// Shared UI pieces.
import { h } from './dom.js';
import { store, t } from './state.js';
import { escapeHtml } from './core/markdown.js';

/** Short label for a source: its pinpoint up to the first parenthesis, else its title. */
export function shortSource(source) {
  return source.pinpoint ? source.pinpoint.split(' (')[0] : source.title;
}

const layerLabel = (source) => t(`ui.layer.${source.type}`);

export function sourceChip(id) {
  const s = store.data.sources[id];
  if (!s) return null;
  const label = `${layerLabel(s)}: ${shortSource(s)}`;
  const title = s.pinpoint ? `${s.title}, ${s.pinpoint}` : s.title;
  return s.url
    ? h('a', { class: `chip layer-${s.type}`, href: s.url, target: '_blank', rel: 'noopener noreferrer', title }, label)
    : h('span', { class: `chip layer-${s.type}`, title }, label);
}

export const sourceChips = (ids) => h('p', { class: 'chips' }, (ids ?? []).map(sourceChip));

/** Citation markup for the runbook renderer (trusted, escaped HTML string). */
export function citeHtml(id) {
  const s = store.data.sources[id];
  if (!s) return '';
  const label = escapeHtml(shortSource(s));
  const title = escapeHtml(s.pinpoint ? `${s.title}, ${s.pinpoint}` : s.title);
  const cls = `cite layer-${escapeHtml(s.type)}`;
  return s.url
    ? `<a class="${cls}" href="${escapeHtml(s.url)}" target="_blank" rel="noopener noreferrer" title="${title}">${label}</a>`
    : `<span class="${cls}" title="${title}">${label}</span>`;
}

export function pageTitle(text) {
  return h('h1', { tabindex: '-1' }, text);
}
