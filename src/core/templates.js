// Report templates. Pure functions: no DOM, no network.
//
// A "document" is one of the six Article 14 reports (`<track>.<stage>`) or the user
// advisory (`advisory`). renderMarkdown() turns a document plus optional values into
// a fill-in Markdown document in one language.

export const ADVISORY = 'advisory';
export const NEEDS = ['legal', 'where_applicable', 'form', 'recommended'];

const get = (obj, path) => path.split('.').reduce((o, k) => o?.[k], obj);

/** All document ids: the six reports, then the advisory. */
export function documentIds(templates) {
  return [...Object.keys(templates.reports), ADVISORY];
}

/** Sections of a document, with the fields that apply to its stage. */
export function documentSections(templates, docId) {
  if (docId === ADVISORY) return [{ id: 'content', fields: templates.advisory.fields }];
  const report = templates.reports[docId];
  if (!report) throw new Error(`Unknown template: ${docId}`);
  const forStage = (fields) => fields.filter((f) => !f.stages || f.stages.includes(report.stage));
  return [
    ...Object.entries(templates.sections).map(([id, s]) => ({ id, fields: forStage(s.fields) })),
    { id: 'content', fields: report.fields },
  ];
}

function sourceLink(source) {
  const label = source.pinpoint ? `${source.title}, ${source.pinpoint}` : source.title;
  return source.url ? `[${label}](${source.url})` : label;
}

/**
 * Render a document as Markdown.
 * content = { templates, sources, text }  where `text` is one language file (i18n/<lang>.yaml).
 * values  = { fieldId: string } for fields already filled in; others show the fill-in marker.
 */
export function renderMarkdown({ templates, sources, text }, docId, values = {}) {
  const t = (key) => {
    const v = get(text, `t.${key}`);
    if (typeof v !== 'string') throw new Error(`Missing text t.${key}`);
    return v;
  };
  const isAdvisory = docId === ADVISORY;
  const meta = isAdvisory ? templates.advisory : templates.reports[docId];
  if (!meta) throw new Error(`Unknown template: ${docId}`);

  const out = [`# ${isAdvisory ? t('doc.advisory_title') : t(`report.${docId}.title`)}`, '', `> ${t('doc.disclaimer')}`, ''];
  if (isAdvisory) {
    out.push(`> ${t('doc.not_a_report')}`, '');
  } else {
    out.push(
      '| | |', '|---|---|',
      `| ${t('doc.form_type')} | ${t(`report.${docId}.ncsc_type`)} |`,
      `| ${t('doc.deadline')} | ${t(`report.${docId}.deadline`)} |`,
    );
  }
  out.push(isAdvisory ? `**${t('doc.sources')}:** ${meta.sources.map((id) => sourceLink(sources[id])).join('; ')}`
    : `| ${t('doc.sources')} | ${meta.sources.map((id) => sourceLink(sources[id])).join('; ')} |`, '');

  for (const section of documentSections(templates, docId)) {
    if (section.fields.length === 0) continue;
    out.push(`## ${t(`section.${section.id}`)}`, '');
    if (section.id === 'organisation' || section.id === 'reporter') out.push(`_${t('doc.prepared_in_advance')}_`, '');
    for (const field of section.fields) {
      const hint = t(`field.${field.id}.hint`);
      const head = [`**${t(`field.${field.id}.label`)}** · ${t(`need.${field.need}`)}`];
      if (field.ncsc) head.push(`${t('doc.ncsc_field')}: "${field.ncsc}"`);
      if (hint) head.push(`_${hint}_`);
      out.push(head.join('  \n'), '', values[field.id]?.trim() || t('doc.fill_in'), '');
    }
  }
  return `${out.join('\n').trimEnd()}\n`;
}

/** File name for a generated blank template, e.g. vulnerability-early_warning.md. */
export const templateFileName = (docId) => `${docId.replace('.', '-')}.md`;
