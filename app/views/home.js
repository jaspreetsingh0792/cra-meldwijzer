import { h } from '../dom.js';
import { store, t, oldestVerification } from '../state.js';
import { pageTitle } from '../components.js';

export function homeView() {
  const { tree } = store.data;
  return h('div', { class: 'home' },
    pageTitle(t('ui.home.title')),
    h('p', { class: 'lead' }, t('ui.home.lead')),
    h('p', { class: 'callout' }, t('ui.home.who')),
    h('div', { class: 'actions' },
      h('a', { class: 'btn primary', href: '#/assess' }, t('ui.home.start')),
      h('a', { class: 'btn', href: '#/runbook' }, t('ui.home.runbook')),
      h('a', { class: 'btn', href: '#/templates' }, t('ui.home.templates'))),
    h('section', { class: 'panel' },
      h('h2', {}, t('ui.home.privacy_title')),
      h('p', {}, t('ui.home.privacy'))),
    h('p', { class: 'muted' }, t('ui.home.rules', { version: tree.version, date: oldestVerification() ?? '?' })));
}
