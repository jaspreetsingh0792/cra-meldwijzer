// App state, wording lookup, persistence and time helpers.
import { zonedToUtc, LEGAL_TZ } from './core/clock.js';

const KEY = { lang: 'cra-meldwijzer:lang', case: 'cra-meldwijzer:case' };

export const store = {
  lang: 'en',
  data: null,      // { sources, tree, templates, i18n: { en, nl }, runbook: { en, nl } }
  answers: {},     // decision-tree answers in progress
  case: null,      // the open case, or null
  save: false,     // opt-in: persist the case in localStorage
  scratch: {},     // template values when no case is open
};

// localStorage can be missing or throw (private mode, blocked storage): never rely on it.
const storage = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); return true; } catch { return false; } },
  del(k) { try { localStorage.removeItem(k); } catch { /* ignore */ } },
};

export function storageAvailable() {
  const probe = 'cra-meldwijzer:probe';
  if (!storage.set(probe, '1')) return false;
  storage.del(probe);
  return true;
}

export async function loadData() {
  const names = ['sources', 'tree', 'templates', 'i18n.en', 'i18n.nl', 'runbook.en', 'runbook.nl'];
  const [sources, tree, templates, en, nl, rbEn, rbNl] = await Promise.all(names.map(async (n) => {
    const res = await fetch(`./data/${n}.json`);
    if (!res.ok) throw new Error(`Could not load ${n}`);
    return res.json();
  }));
  store.data = { sources, tree, templates, i18n: { en, nl }, runbook: { en: rbEn, nl: rbNl } };

  const pref = storage.get(KEY.lang);
  store.lang = pref === 'nl' || pref === 'en' ? pref
    : (navigator.language ?? '').toLowerCase().startsWith('nl') ? 'nl' : 'en';

  const saved = storage.get(KEY.case);
  if (saved) {
    try {
      const c = JSON.parse(saved);
      if (isCase(c)) {
        store.case = c;
        store.answers = { ...c.answers };
        store.save = true;
      }
    } catch { /* ignore a corrupt saved case */ }
  }
}

const lookup = (doc, key) => key.split('.').reduce((o, k) => o?.[k], doc);

export const has = (key) => typeof lookup(store.data.i18n[store.lang], key) === 'string';

/** Wording in the current language, falling back to English, then to the key itself. */
export function t(key, vars) {
  let s = lookup(store.data.i18n[store.lang], key);
  if (typeof s !== 'string') s = lookup(store.data.i18n.en, key);
  if (typeof s !== 'string') return key;
  return vars ? s.replace(/\{(\w+)\}/g, (_, v) => vars[v] ?? '') : s;
}

export function setLang(lang) {
  store.lang = lang;
  storage.set(KEY.lang, lang);
}

// --- Freshness --------------------------------------------------------------------

export const STALE_AFTER_DAYS = 120;

/** Oldest last_verified date over all verified sources (YYYY-MM-DD), or null. */
export function oldestVerification() {
  const dates = Object.values(store.data.sources)
    .filter((s) => s.status === 'verified' && s.last_verified)
    .map((s) => s.last_verified)
    .sort();
  return dates[0] ?? null;
}

export function isStale(now = Date.now()) {
  const oldest = oldestVerification();
  return !oldest || (now - Date.parse(oldest)) / 86_400_000 > STALE_AFTER_DAYS;
}

// --- Case -----------------------------------------------------------------------

export const isCase = (c) => c?.app === 'cra-meldwijzer' && c.schema === 1
  && c.tracks?.vulnerability && c.tracks?.incident && c.awarenessAssessments;

export function persist() {
  if (store.save && store.case && !storage.set(KEY.case, JSON.stringify(store.case))) store.save = false;
}

export function setSave(on) {
  store.save = on;
  if (on) persist();
  else storage.del(KEY.case);
  return store.save;
}

const TRIGGERED = new Set(['reportable', 'potentially_reportable']);

export function newCase({ answers = {}, outcome = null } = {}) {
  const now = new Date();
  const track = (kind) => ({
    triggered: TRIGGERED.has(outcome?.tracks?.[kind]),
    earlyWarningSubmittedAt: null,
    notificationSubmittedAt: null,
    finalReportSubmittedAt: null,
    ...(kind === 'vulnerability' ? { measureAvailableAt: null } : {}),
  });
  store.case = {
    app: 'cra-meldwijzer',
    schema: 1,
    caseId: `CRA-${toInputValue(now.getTime()).replace(/\D/g, '').slice(0, 12)}`,
    createdAt: now.toISOString(),
    rules: { tree: store.data.tree.version, reviewed: store.data.tree.last_reviewed },
    answers: { ...answers },
    outcomeKeys: outcome?.keys ?? [],
    detectedAt: null,
    awarenessAssessments: {
      vulnerability: { awareAt: null, basis: '' },
      incident: { awareAt: null, basis: '' },
    },
    tracks: { vulnerability: track('vulnerability'), incident: track('incident') },
    fields: { ...store.scratch },
    log: [{ at: now.toISOString(), type: 'created' }],
  };
  persist();
  return store.case;
}

/** Apply a new assessment to the open case. Never switches a track off. */
export function applyAssessment(answers, outcome) {
  const c = store.case;
  c.answers = { ...answers };
  c.outcomeKeys = outcome.keys;
  c.rules = { tree: store.data.tree.version, reviewed: store.data.tree.last_reviewed };
  for (const kind of ['vulnerability', 'incident']) {
    if (TRIGGERED.has(outcome.tracks?.[kind])) c.tracks[kind].triggered = true;
  }
  log({ type: 'applied' });
}

export function log(entry) {
  store.case.log.push({ at: new Date().toISOString(), ...entry });
  persist();
}

export function clearCase() {
  store.case = null;
  store.answers = {};
  store.scratch = {};
  setSave(false);
}

// --- Time -----------------------------------------------------------------------

const wallFmt = new Intl.DateTimeFormat('sv-SE', {
  timeZone: LEGAL_TZ, hourCycle: 'h23',
  year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
});

/** Instant -> "YYYY-MM-DDTHH:MM" in Amsterdam time, for <input type="datetime-local">. */
export const toInputValue = (ms) => wallFmt.format(new Date(ms)).replace(' ', 'T');

/** "YYYY-MM-DDTHH:MM" in Amsterdam time -> instant (ms), or null. */
export function fromInputValue(v) {
  const m = v?.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  return m ? zonedToUtc(+m[1], +m[2], +m[3], +m[4], +m[5], 0, LEGAL_TZ) : null;
}

/** "di 14 okt 2026 14:34 (2026-10-14 12:34 UTC)" */
export function fmtTime(ms) {
  const local = new Intl.DateTimeFormat(store.lang === 'nl' ? 'nl-NL' : 'en-GB', {
    timeZone: LEGAL_TZ, weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(ms);
  return `${local} (${new Date(ms).toISOString().slice(0, 16).replace('T', ' ')} UTC)`;
}

/** 2d 3h 15min */
export function fmtDuration(ms) {
  const total = Math.round(Math.abs(ms) / 60_000);
  const d = Math.floor(total / 1440);
  const hr = Math.floor((total % 1440) / 60);
  const min = total % 60;
  const parts = [];
  if (d) parts.push(`${d}${t('ui.case.unit.d')}`);
  if (d || hr) parts.push(`${hr}${t('ui.case.unit.h')}`);
  parts.push(`${min} ${t('ui.case.unit.m')}`);
  return parts.join(' ');
}
