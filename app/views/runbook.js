import { h } from '../dom.js';
import { store, t } from '../state.js';
import { pageTitle, citeHtml } from '../components.js';
import { renderMarkdown } from '../core/markdown.js';

const chapters = () => store.data.runbook[store.lang];
const names = () => Object.keys(chapters()).sort();
const chapterTitle = (md) => md.split('\n')[0].replace(/^#\s*/, '');

const mapLink = (href) => {
  const m = href.match(/^(\d\d-[\w-]+)\.md(#.*)?$/);
  return m ? `#/runbook/${m[1]}` : null;
};
const toHtml = (md) => renderMarkdown(md, { cite: citeHtml, mapLink });

export function runbookView(chapter) {
  const all = names();
  const current = all.find((n) => n === `${chapter}.md`) ?? all[0];
  return h('div', { class: 'runbook' },
    h('nav', { class: 'chapters', 'aria-label': t('ui.runbook.chapters') },
      h('ol', {}, all.map((n) => h('li', {},
        h('a', { href: `#/runbook/${n.replace('.md', '')}`, 'aria-current': n === current ? 'page' : null }, chapterTitle(chapters()[n]))))),
      h('a', { class: 'btn small', href: '#/print' }, t('ui.runbook.print'))),
    // Runbook Markdown comes from this repository and is escaped by the renderer.
    h('article', { class: 'prose', html: toHtml(chapters()[current]) }));
}

export function printView() {
  const article = h('article', { class: 'prose print-all' },
    names().map((n) => h('section', { class: 'print-chapter', html: toHtml(chapters()[n]) })));
  return h('div', {},
    h('div', { class: 'actions no-print' },
      h('button', { type: 'button', class: 'btn primary', onClick: () => window.print() }, t('ui.runbook.print'))),
    pageTitle(t('ui.runbook.print_title')),
    article);
}

export const runbookTitle = (chapter) => {
  const n = names().find((x) => x === `${chapter}.md`) ?? names()[0];
  return chapterTitle(chapters()[n]);
};
