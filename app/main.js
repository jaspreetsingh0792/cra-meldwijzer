import { h } from './dom.js';
import { store, t, loadData, setLang, isStale, oldestVerification, unverifiedSources } from './state.js';
import { homeView } from './views/home.js';
import { assessView } from './views/assess.js';
import { caseView } from './views/case.js';
import { templatesView } from './views/templates.js';
import { runbookView, printView, runbookTitle } from './views/runbook.js';

const NAV = [
  ['', 'ui.nav.home'],
  ['assess', 'ui.nav.assess'],
  ['case', 'ui.nav.case'],
  ['templates', 'ui.nav.templates'],
  ['runbook', 'ui.nav.runbook'],
];

const $ = (id) => document.getElementById(id);

function route() {
  const [name = '', ...rest] = location.hash.replace(/^#\/?/, '').split('/');
  return { name, arg: decodeURIComponent(rest.join('/')) };
}

function renderChrome(current) {
  document.documentElement.lang = store.lang;
  $('skip').textContent = t('ui.skip');
  $('brand').querySelector('span').textContent = t('ui.app_name');
  const lang = $('lang');
  lang.textContent = t('ui.lang_switch');
  lang.setAttribute('lang', store.lang === 'nl' ? 'en' : 'nl');
  lang.setAttribute('aria-label', t('ui.lang_switch_label'));
  $('nav').replaceChildren(...NAV.map(([name, key]) => h('li', {},
    h('a', { href: `#/${name}`, 'aria-current': name === current || (name === 'runbook' && current === 'print') ? 'page' : null }, t(key)))));
  const stale = isStale();
  const unverified = unverifiedSources().length;
  $('wip').textContent = stale ? t('ui.stale', { date: oldestVerification() ?? '?' })
    : unverified ? t('ui.unverified', { count: unverified }) : t('ui.wip');
  $('wip').classList.toggle('stale', stale || unverified > 0);
  $('wip').setAttribute('role', stale || unverified ? 'alert' : 'note');
  $('update-text').textContent = t('ui.update');
  $('update-reload').textContent = t('ui.reload');
  $('footer-disclaimer').textContent = t('ui.footer.disclaimer');
  $('footer-source').textContent = t('ui.footer.source');
}

function render({ focus = false } = {}) {
  const { name, arg } = route();
  renderChrome(name);
  const rerender = (opts) => render(opts);
  const views = {
    '': () => [homeView(), t('ui.app_name')],
    assess: () => [assessView(rerender), t('ui.assess.title')],
    case: () => [caseView(rerender), t('ui.case.title')],
    templates: () => [templatesView(arg), t('ui.templates.title')],
    runbook: () => [runbookView(arg), runbookTitle(arg)],
    print: () => [printView(), t('ui.runbook.print_title')],
  };
  const [view, title] = (views[name] ?? views[''])();
  document.title = name ? `${title} · CRA Meldwijzer` : 'CRA Meldwijzer';
  $('main').replaceChildren(view);
  if (focus) {
    // Selectors in priority order (querySelector with a list would return the first in page order).
    const selectors = (typeof focus === 'string' ? focus : 'h1').split(',').map((x) => x.trim());
    const target = selectors.map((sel) => document.querySelector(sel)).find(Boolean) ?? $('main');
    target.focus();
  }
}

async function start() {
  try {
    await loadData();
  } catch (err) {
    $('main').replaceChildren(h('p', { class: 'notice' }, `Could not load CRA Meldwijzer data: ${err.message}`));
    return;
  }
  $('lang').addEventListener('click', () => {
    setLang(store.lang === 'nl' ? 'en' : 'nl');
    render();
  });
  window.addEventListener('hashchange', () => {
    render({ focus: true });
    window.scrollTo(0, 0);
  });
  render();

  // Countdowns: refresh milestone panels without touching the form fields.
  setInterval(() => document.querySelectorAll('[data-milestones]').forEach((el) => el.refresh?.()), 30_000);

  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    // A page that was already controlled gets a new worker after an update: tell the user, so
    // nobody keeps working from an outdated cached version without knowing.
    const hadController = Boolean(navigator.serviceWorker.controller);
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (hadController) $('update').hidden = false;
    });
    $('update-reload').addEventListener('click', () => location.reload());
    navigator.serviceWorker.register('./sw.js').catch(() => { /* offline support is optional */ });
  }
}

start();
