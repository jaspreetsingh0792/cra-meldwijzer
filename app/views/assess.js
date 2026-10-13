import { h } from '../dom.js';
import { store, t, has, newCase, applyAssessment } from '../state.js';
import { pageTitle, sourceChips } from '../components.js';
import { walk, derive } from '../core/tree.js';

const optionLabel = (node, opt) => (has(`opt.${node}.${opt}`) ? t(`opt.${node}.${opt}`) : t(`opt.${opt}`));

// Visual tone per outcome key; meaning is always also in the text.
function tone(key) {
  if (/\.reportable$/.test(key)) return 'alert';
  if (/potentially_reportable$|^caveat\./.test(key)) return 'warn';
  if (/not_reportable$|no_retroactive_duty$|^scope\.|^role\./.test(key)) return 'ok';
  return 'info';
}

export function assessView(rerender) {
  const { tree } = store.data;
  const { facts, path, pending } = walk(tree, store.answers);

  const back = () => {
    const last = path.at(-1);
    if (last) delete store.answers[last.node];
    rerender();
  };
  const restart = () => { store.answers = {}; rerender(); };
  const controls = h('div', { class: 'actions' },
    path.length ? h('button', { type: 'button', class: 'btn', onClick: back }, t('ui.assess.back')) : null,
    path.length ? h('button', { type: 'button', class: 'btn link', onClick: restart }, t('ui.assess.restart')) : null);

  if (pending) {
    const node = tree.nodes[pending];
    const qid = `q-${pending}`;
    return h('div', { class: 'assess' },
      pageTitle(t('ui.assess.title')),
      h('section', { class: 'question', 'aria-labelledby': qid },
        h('p', { class: 'step' }, t('ui.assess.question', { n: path.length + 1 })),
        h('h2', { id: qid }, t(`q.${pending}`)),
        h('p', { class: 'help' }, t(`h.${pending}`)),
        h('div', { class: 'options', role: 'group', 'aria-labelledby': qid },
          Object.keys(node.options).map((opt) => h('button', {
            type: 'button',
            class: `btn option${opt === 'unsure' ? ' unsure' : ''}`,
            onClick: () => { store.answers[pending] = opt; rerender(); },
          }, optionLabel(pending, opt)))),
        h('h3', { class: 'visually-hidden' }, t('ui.assess.sources')),
        sourceChips(node.sources)),
      controls);
  }

  const outcome = derive(facts);
  const startOrApply = () => {
    if (store.case) applyAssessment(store.answers, outcome);
    else newCase({ answers: store.answers, outcome });
    location.hash = '#/case';
  };
  return h('div', { class: 'assess' },
    pageTitle(t('ui.assess.result_title')),
    h('p', { class: 'lead' }, t('ui.assess.result_lead')),
    h('ul', { class: 'outcomes' }, outcome.keys.map((key) => h('li', { class: `outcome tone-${tone(key)}` },
      h('p', {}, t(`o.${key}`)),
      sourceChips(tree.outcomes[key]?.sources)))),
    outcome.kind === 'assessed'
      ? h('div', { class: 'actions' }, h('button', { type: 'button', class: 'btn primary', onClick: startOrApply },
        t(store.case ? 'ui.assess.apply_case' : 'ui.assess.start_case')))
      : null,
    h('details', { class: 'answers' },
      h('summary', {}, t('ui.assess.answers')),
      h('dl', {}, path.map(({ node, option }) => [
        h('dt', {}, t(`q.${node}`)),
        h('dd', {}, optionLabel(node, option)),
      ]))),
    controls);
}
