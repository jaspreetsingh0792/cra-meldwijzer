import { h, uid, download, copyButton } from '../dom.js';
import { store, t, persist, toInputValue } from '../state.js';
import { pageTitle, sourceChips } from '../components.js';
import { documentIds, documentSections, renderMarkdown as renderTemplate, templateFileName, ADVISORY } from '../core/templates.js';

const docTitle = (id) => (id === ADVISORY ? t('t.doc.advisory_title') : t(`t.report.${id}.title`));

// Values a field starts with when nothing has been typed yet, taken from the case.
function defaults(docId) {
  const c = store.case;
  if (!c) return {};
  const track = docId.split('.')[0];
  const wall = (iso) => (iso ? `${toInputValue(Date.parse(iso)).replace('T', ' ')} (Europe/Amsterdam)` : undefined);
  return {
    case_id: c.caseId,
    aware_at: wall(c.awarenessAssessments[track]?.awareAt),
    measure_available_at: wall(c.tracks.vulnerability.measureAvailableAt),
  };
}

export function templatesView(docId) {
  const { templates, sources } = store.data;
  const ids = documentIds(templates);
  const current = ids.includes(docId) ? docId : ids[0];
  const values = store.case ? store.case.fields : store.scratch;
  const initial = defaults(current);
  const inputs = {};

  const sections = documentSections(templates, current).filter((s) => s.fields.length).map((section) => h('section', { class: 'panel' },
    h('h2', {}, t(`t.section.${section.id}`)),
    section.fields.map((field) => {
      const id = uid();
      const hintId = `${id}-hint`;
      const hint = t(`t.field.${field.id}.hint`);
      const value = values[field.id] ?? initial[field.id] ?? '';
      const input = field.multiline
        ? h('textarea', { id, rows: 4, value, 'aria-describedby': hint ? hintId : null })
        : h('input', { type: 'text', id, value, 'aria-describedby': hint ? hintId : null });
      input.addEventListener('input', () => { values[field.id] = input.value; persist(); });
      inputs[field.id] = input;
      return h('div', { class: 'field template-field' },
        h('div', { class: 'field-head' },
          h('label', { for: id }, t(`t.field.${field.id}.label`)),
          h('span', { class: `need need-${field.need}` }, t(`t.need.${field.need}`))),
        hint ? h('p', { class: 'hint', id: hintId }, hint) : null,
        h('div', { class: 'row' }, input, copyButton(t('ui.templates.copy'), t('ui.templates.copied'), () => input.value)));
    })));

  const filled = () => Object.fromEntries(Object.entries(inputs).map(([k, el]) => [k, el.value]));
  const markdown = () => renderTemplate({ templates, sources, text: store.data.i18n[store.lang] }, current, filled());
  const meta = current === ADVISORY ? templates.advisory : templates.reports[current];

  return h('div', { class: 'templates' },
    pageTitle(t('ui.templates.title')),
    h('p', { class: 'lead' }, t('ui.templates.lead')),
    store.case ? null : h('p', { class: 'notice' }, t('ui.templates.no_case')),
    h('nav', { 'aria-label': t('ui.templates.title') },
      h('ul', { class: 'tabs' }, ids.map((id) => h('li', {},
        h('a', { href: `#/templates/${id}`, 'aria-current': id === current ? 'page' : null }, docTitle(id)))))),
    h('h2', { class: 'doc-title' }, docTitle(current)),
    current === ADVISORY
      ? h('p', { class: 'callout' }, t('t.doc.not_a_report'))
      : h('dl', { class: 'meta' },
        h('dt', {}, t('t.doc.form_type')), h('dd', {}, h('strong', {}, t(`t.report.${current}.ncsc_type`))),
        h('dt', {}, t('t.doc.deadline')), h('dd', {}, t(`t.report.${current}.deadline`))),
    sourceChips(meta.sources),
    sections,
    h('div', { class: 'actions' },
      copyButton(t('ui.templates.copy_all'), t('ui.templates.copied'), markdown),
      h('button', { type: 'button', class: 'btn', onClick: () => download(templateFileName(current), 'text/markdown', markdown()) }, t('ui.templates.download'))));
}
