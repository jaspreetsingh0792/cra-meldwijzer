import { h, uid, download } from '../dom.js';
import {
  store, t, newCase, log, persist, setSave, storageAvailable, clearCase, isCase,
  toInputValue, fromInputValue, fmtTime, fmtDuration,
} from '../state.js';
import { pageTitle, legalNotice } from '../components.js';
import { computeCase } from '../core/clock.js';
import { toIcs } from '../core/ics.js';

const TRACKS = ['vulnerability', 'incident'];

function timeField(labelKey, get, set, onChange) {
  const id = uid();
  const input = h('input', { type: 'datetime-local', id, value: get() ? toInputValue(Date.parse(get())) : '' });
  const commit = (ms) => {
    set(ms == null ? null : new Date(ms).toISOString());
    onChange(labelKey, ms);
  };
  input.addEventListener('change', () => commit(fromInputValue(input.value)));
  const now = h('button', { type: 'button', class: 'btn small', onClick: () => {
    const ms = Date.now();
    input.value = toInputValue(ms);
    commit(ms);
  } }, t('ui.case.now'));
  return h('div', { class: 'field' }, h('label', { for: id }, t(labelKey)), h('div', { class: 'row' }, input, now));
}

function renderMilestones(el, kind) {
  const result = computeCase(store.case, { now: Date.now() })[kind];
  const items = [];
  if (result.status === 'not_applicable') items.push(h('p', { class: 'muted' }, t('ui.case.not_applicable')));
  else if (result.status === 'needs_awareness') items.push(h('p', { class: 'notice' }, t('ui.case.needs_awareness')));
  else {
    for (const flag of result.flags) items.push(h('p', { class: 'notice' }, t(`ui.case.flag.${flag}`)));
    items.push(h('ol', { class: 'milestones' }, result.milestones.map((m) => {
      const lines = [];
      if (m.due == null) lines.push(h('p', { class: 'muted' }, t(`ui.case.anchor_missing.${m.anchor}`)));
      else {
        lines.push(h('p', {}, h('strong', {}, `${t('ui.case.due')}: `), fmtTime(m.due)));
        if (m.submittedAt == null && m.remainingMs != null && m.status !== 'pre_application') {
          lines.push(h('p', { class: 'remaining' }, m.remainingMs >= 0
            ? t('ui.case.remaining', { time: fmtDuration(m.remainingMs) })
            : t('ui.case.overdue_by', { time: fmtDuration(m.remainingMs) })));
        }
        if (m.dueReg1182 !== m.due) lines.push(h('p', { class: 'small muted' }, t('ui.case.reg1182', { time: fmtTime(m.dueReg1182) })));
      }
      if (m.submittedAt != null) lines.push(h('p', {}, t('ui.case.submitted_at', { time: fmtTime(m.submittedAt) })));
      for (const flag of m.flags.filter((f) => f !== 'reg1182_holidays_not_modelled')) {
        lines.push(h('p', { class: 'notice' }, t(`ui.case.flag.${flag}`)));
      }
      return h('li', { class: `milestone status-${m.status}` },
        h('div', { class: 'milestone-head' },
          h('span', { class: 'milestone-name' }, t(`ui.case.milestone.${m.id}`)),
          h('span', { class: `badge status-${m.status}` }, t(`ui.case.status.${m.status}`))),
        lines);
    })));
  }
  el.replaceChildren(...items);
}

function trackSection(kind, onLogChange) {
  const c = store.case;
  const tr = c.tracks[kind];
  const aw = c.awarenessAssessments[kind];
  const trackName = t(`ui.case.track.${kind}`);
  const milestones = h('div', { 'data-milestones': '' });
  milestones.refresh = () => renderMilestones(milestones, kind);

  const changed = (labelKey, ms) => {
    log({ type: ms == null ? 'cleared' : 'changed', track: kind, field: labelKey, value: ms == null ? null : new Date(ms).toISOString() });
    milestones.refresh();
    onLogChange();
  };

  const appliesId = uid();
  const applies = h('input', { type: 'checkbox', id: appliesId, checked: tr.triggered });
  const grid = h('div', { class: 'track-grid' });
  const off = h('p', { class: 'muted' }, t('ui.case.not_applicable'));
  const showGrid = () => { grid.hidden = !tr.triggered; off.hidden = tr.triggered; };
  applies.addEventListener('change', () => {
    tr.triggered = applies.checked;
    showGrid();
    log({ type: 'changed', track: kind, field: 'ui.case.applies', text: t(applies.checked ? 'opt.yes' : 'opt.no') });
    milestones.refresh();
    onLogChange();
  });

  const basisId = uid();
  const basis = h('textarea', { id: basisId, rows: 2, value: aw.basis ?? '' });
  basis.addEventListener('input', () => { aw.basis = basis.value; persist(); });
  basis.addEventListener('change', () => {
    log({ type: 'changed', track: kind, field: 'ui.case.basis', text: basis.value.slice(0, 120) });
    onLogChange();
  });

  const fields = [
    timeField('ui.case.aware_at', () => aw.awareAt, (v) => { aw.awareAt = v; }, changed),
    h('div', { class: 'field' }, h('label', { for: basisId }, t('ui.case.basis')), basis),
    timeField('ui.case.early_warning_submitted', () => tr.earlyWarningSubmittedAt, (v) => { tr.earlyWarningSubmittedAt = v; }, changed),
    timeField('ui.case.notification_submitted', () => tr.notificationSubmittedAt, (v) => { tr.notificationSubmittedAt = v; }, changed),
    kind === 'vulnerability'
      ? timeField('ui.case.measure_available', () => tr.measureAvailableAt, (v) => { tr.measureAvailableAt = v; }, changed)
      : null,
    timeField('ui.case.final_submitted', () => tr.finalReportSubmittedAt, (v) => { tr.finalReportSubmittedAt = v; }, changed),
  ];

  milestones.refresh();
  grid.append(h('div', { class: 'track-inputs' }, fields), milestones);
  showGrid();
  return h('section', { class: 'panel track', 'aria-labelledby': `track-${kind}` },
    h('h2', { id: `track-${kind}` }, trackName),
    h('div', { class: 'check-row' }, applies, h('label', { for: appliesId }, t('ui.case.applies'))),
    off,
    grid);
}

function logEntryText(e) {
  const field = e.field ? `${e.track ? `${t(`ui.case.track.${e.track}`)}: ` : ''}${t(e.field)}` : '';
  switch (e.type) {
    case 'created': return t('ui.case.log.created');
    case 'imported': return t('ui.case.log.imported');
    case 'applied': return t('ui.case.applied');
    case 'cleared': return t('ui.case.log.cleared', { field });
    case 'changed': return t('ui.case.log.changed', { field, value: e.value ? fmtTime(Date.parse(e.value)) : (e.text ?? '') });
    case 'note': return e.text;
    default: return e.type;
  }
}

function logSection() {
  const list = h('ol', { class: 'log', reversed: true });
  const refresh = () => list.replaceChildren(...[...store.case.log].reverse().map((e) => h('li', {},
    h('time', { datetime: e.at }, fmtTime(Date.parse(e.at))), ' ', logEntryText(e))));
  refresh();
  const noteId = uid();
  const note = h('input', { type: 'text', id: noteId });
  const add = () => {
    if (!note.value.trim()) return;
    log({ type: 'note', text: note.value.trim() });
    note.value = '';
    refresh();
  };
  note.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') add(); });
  const section = h('section', { class: 'panel', 'aria-labelledby': 'log-h' },
    h('h2', { id: 'log-h' }, t('ui.case.timeline')),
    h('div', { class: 'field' }, h('label', { for: noteId }, t('ui.case.note')),
      h('div', { class: 'row' }, note, h('button', { type: 'button', class: 'btn small', onClick: add }, t('ui.case.add')))),
    list);
  section.refresh = refresh;
  return section;
}

function icsFor(c) {
  const result = computeCase(c, { now: Date.now() });
  const events = [];
  for (const kind of TRACKS) {
    for (const m of result[kind].milestones ?? []) {
      if (m.due == null || m.submittedAt != null || m.status === 'pre_application') continue;
      const summary = `${c.caseId}: ${t(`ui.case.milestone.${m.id}`)} (${t(`ui.case.track.${kind}`)})`;
      events.push({
        uid: `${c.caseId}-${kind}-${m.id}@cra-meldwijzer`,
        start: m.due,
        summary,
        description: `${t('ui.case.due')}: ${fmtTime(m.due)}. CRA Meldwijzer. ${t('ui.footer.disclaimer')}`,
        alarmsMin: [360, 120, 30],
      });
    }
  }
  return toIcs(events);
}

function actionsSection(rerender) {
  const c = store.case;
  const status = h('p', { class: 'status', role: 'status' });

  const fileId = uid();
  const file = h('input', { type: 'file', id: fileId, accept: 'application/json,.json', class: 'visually-hidden' });
  file.addEventListener('change', async () => {
    const f = file.files?.[0];
    if (!f) return;
    try {
      const imported = JSON.parse(await f.text());
      if (!isCase(imported)) throw new Error('not a case');
      store.case = imported;
      store.answers = { ...imported.answers };
      log({ type: 'imported' });
      rerender();
    } catch {
      status.textContent = t('ui.case.import_error');
    }
  });

  const saveId = uid();
  const canSave = storageAvailable();
  const save = h('input', { type: 'checkbox', id: saveId, checked: store.save, disabled: !canSave });
  save.addEventListener('change', () => { save.checked = setSave(save.checked); });

  const clear = h('button', { type: 'button', class: 'btn danger' }, t('ui.case.clear'));
  let armed = null;
  clear.addEventListener('click', () => {
    if (armed) {
      clearTimeout(armed);
      clearCase();
      rerender();
      return;
    }
    clear.textContent = t('ui.case.clear_confirm');
    armed = setTimeout(() => { armed = null; clear.textContent = t('ui.case.clear'); }, 5000);
  });

  return h('section', { class: 'panel', 'aria-label': t('ui.case.export') },
    h('div', { class: 'actions' },
      h('button', { type: 'button', class: 'btn', onClick: () => download(`${c.caseId}-deadlines.ics`, 'text/calendar', icsFor(store.case)) }, t('ui.case.ics')),
      h('button', { type: 'button', class: 'btn', onClick: () => download(`${c.caseId}.json`, 'application/json', `${JSON.stringify(store.case, null, 2)}\n`) }, t('ui.case.export')),
      h('label', { for: fileId, class: 'btn' }, t('ui.case.import')), file,
      clear),
    h('div', { class: 'check-row' }, save, h('label', { for: saveId }, t('ui.case.save'))),
    h('p', { class: 'small muted' }, canSave ? t('ui.case.save_note') : t('ui.case.save_unavailable')),
    status);
}

export function caseView(rerender) {
  if (!store.case) {
    return h('div', {},
      pageTitle(t('ui.case.title')),
      h('p', {}, t('ui.case.none')),
      h('div', { class: 'actions' },
        h('a', { class: 'btn primary', href: '#/assess' }, t('ui.home.start')),
        h('button', { type: 'button', class: 'btn', onClick: () => { newCase(); rerender(); } }, t('ui.case.blank'))));
  }
  const c = store.case;
  const logs = logSection();

  const idInput = h('input', { type: 'text', id: 'case-id', value: c.caseId });
  idInput.addEventListener('change', () => {
    c.caseId = idInput.value.trim() || c.caseId;
    log({ type: 'changed', field: 'ui.case.case_id', text: c.caseId });
    logs.refresh();
  });
  const detected = timeField('ui.case.detected_at', () => c.detectedAt, (v) => { c.detectedAt = v; }, (labelKey, ms) => {
    log({ type: ms == null ? 'cleared' : 'changed', field: labelKey, value: ms == null ? null : new Date(ms).toISOString() });
    logs.refresh();
  });

  return h('div', { class: 'case' },
    pageTitle(t('ui.case.title')),
    legalNotice(),
    h('section', { class: 'panel case-head' },
      h('div', { class: 'field' }, h('label', { for: 'case-id' }, t('ui.case.case_id')), idInput),
      detected,
      h('p', { class: 'small muted' }, t('ui.case.times_note'))),
    TRACKS.map((kind) => trackSection(kind, () => logs.refresh())),
    actionsSection(rerender),
    logs);
}
