// Deadline engine for CRA Article 14. Pure functions: no DOM, no network.
//
// All instants are epoch milliseconds (UTC). Two readings are computed for every
// deadline:
//   conservative - elapsed time from the anchor instant (24h, 72h, 14 x 24h, one
//                  calendar month, clamped to month end). This is the deadline shown.
//   reg1182      - a reading of Regulation 1182/71 Art. 3 (hour/day of the event not
//                  counted, periods end at the end of a day, weekend roll-over).
//                  Shown for comparison only until OPEN-QUESTIONS.md Q2 is resolved.
// The conservative reading is never later than the reg1182 reading.

export const HOUR = 3_600_000;
export const DAY = 24 * HOUR;
export const LEGAL_TZ = 'Europe/Amsterdam';

// Art. 71(2): Article 14 applies from 11 September 2026, taken as 00:00 Amsterdam time (CEST).
export const APPLICATION_START = Date.UTC(2026, 8, 10, 22);

// Product UX threshold for "due soon". Not a legal rule.
export const DEFAULT_DUE_SOON_MS = 6 * HOUR;

// --- Time-zone helpers ---------------------------------------------------------

const formatters = new Map();

function wallParts(ms, tz) {
  let fmt = formatters.get(tz);
  if (!fmt) {
    fmt = new Intl.DateTimeFormat('en-US', {
      timeZone: tz, hourCycle: 'h23',
      year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: 'numeric', second: 'numeric',
    });
    formatters.set(tz, fmt);
  }
  const p = {};
  for (const { type, value } of fmt.formatToParts(new Date(ms))) p[type] = Number(value);
  return { y: p.year, mo: p.month, d: p.day, h: p.hour, mi: p.minute, s: p.second };
}

function tzOffset(ms, tz) {
  const p = wallParts(ms, tz);
  const floored = ms - (((ms % 1000) + 1000) % 1000);
  return Date.UTC(p.y, p.mo - 1, p.d, p.h, p.mi, p.s) - floored;
}

/**
 * Convert a wall-clock time in `tz` to an instant. Out-of-range fields normalise
 * (day 32 -> next month). For an ambiguous time (DST fall-back) the earlier instant
 * is returned; for a non-existent time (DST spring-forward gap) the earlier candidate.
 */
export function zonedToUtc(y, mo, d, h, mi, s, tz) {
  const guess = Date.UTC(y, mo - 1, d, h, mi, s);
  const want = new Date(guess);
  const candidates = [...new Set([tzOffset(guess - 3 * HOUR, tz), tzOffset(guess + 3 * HOUR, tz)])]
    .map((off) => guess - off);
  const valid = candidates.filter((c) => {
    const p = wallParts(c, tz);
    return p.y === want.getUTCFullYear() && p.mo === want.getUTCMonth() + 1 && p.d === want.getUTCDate()
      && p.h === want.getUTCHours() && p.mi === want.getUTCMinutes() && p.s === want.getUTCSeconds();
  });
  return Math.min(...(valid.length ? valid : candidates));
}

function daysInMonth(y, monthIndex) {
  return new Date(Date.UTC(y, monthIndex + 1, 0)).getUTCDate();
}

/** Add calendar months at the same wall-clock time in `tz`, clamping to the month's last day. */
export function addMonthsClamped(ms, n, tz) {
  const p = wallParts(ms, tz);
  const total = p.mo - 1 + n;
  const y = p.y + Math.floor(total / 12);
  const m = ((total % 12) + 12) % 12;
  return zonedToUtc(y, m + 1, Math.min(p.d, daysInMonth(y, m)), p.h, p.mi, p.s, tz);
}

// --- Readings ------------------------------------------------------------------

/** Add calendar days at the same wall-clock time in `tz`. */
export function addDaysWall(ms, n, tz) {
  const p = wallParts(ms, tz);
  return zonedToUtc(p.y, p.mo, p.d + n, p.h, p.mi, p.s, tz);
}

const conservative = {
  hours: (ms, n) => ms + n * HOUR,
  // Earliest of elapsed days and Amsterdam calendar days: across a DST change
  // n x 24h can land an hour past the same wall-clock time.
  days: (ms, n) => Math.min(ms + n * DAY, addDaysWall(ms, n, LEGAL_TZ)),
  // Earliest of the UTC and Amsterdam readings, so the time zone can never make it later.
  months: (ms, n) => Math.min(addMonthsClamped(ms, n, 'UTC'), addMonthsClamped(ms, n, LEGAL_TZ)),
};

function endOfDay(y, mo, d, tz) {
  return zonedToUtc(y, mo, d + 1, 0, 0, 0, tz);
}

// Art. 3(4): a period not expressed in hours that ends on a Saturday or Sunday ends
// at the end of the following working day. Public holidays are NOT modelled.
function rollWeekend(y, mo, d) {
  const dow = new Date(Date.UTC(y, mo - 1, d)).getUTCDay();
  const add = dow === 6 ? 2 : dow === 0 ? 1 : 0;
  const n = new Date(Date.UTC(y, mo - 1, d + add));
  return [n.getUTCFullYear(), n.getUTCMonth() + 1, n.getUTCDate()];
}

export const reg1182 = {
  // Art. 3(1), 3(2)(a): the hour of the event is not counted.
  hours: (ms, n) => Math.floor(ms / HOUR) * HOUR + HOUR + n * HOUR,
  // Art. 3(1), 3(2)(b): the day of the event is not counted; ends at the end of the last day.
  days: (ms, n, tz = LEGAL_TZ) => {
    const p = wallParts(ms, tz);
    const t = new Date(Date.UTC(p.y, p.mo - 1, p.d + n));
    return endOfDay(...rollWeekend(t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate()), tz);
  },
  // Art. 3(2)(c): ends at the end of the same date in the last month, or that month's last day.
  months: (ms, n, tz = LEGAL_TZ) => {
    const p = wallParts(ms, tz);
    const total = p.mo - 1 + n;
    const y = p.y + Math.floor(total / 12);
    const m = ((total % 12) + 12) % 12;
    return endOfDay(...rollWeekend(y, m + 1, Math.min(p.d, daysInMonth(y, m))), tz);
  },
};

// --- Milestones ----------------------------------------------------------------

/** Accept epoch ms, an ISO string or a Date; null/undefined stay null. */
export function toMs(v) {
  if (v == null) return null;
  const ms = v instanceof Date ? v.getTime() : typeof v === 'number' ? v : Date.parse(v);
  if (Number.isNaN(ms)) throw new Error(`Invalid timestamp: ${v}`);
  return ms;
}

function deadline(anchor, unit, n) {
  if (anchor == null) return null;
  return { due: conservative[unit](anchor, n), dueReg1182: reg1182[unit](anchor, n) };
}

function milestone(id, anchorKind, d, submittedAt, { now, dueSoonMs, preApplication, awareAt }) {
  const flags = [];
  if (submittedAt != null && submittedAt < awareAt) flags.push('submitted_before_awareness');
  let status;
  if (submittedAt != null) status = d && submittedAt > d.due ? 'submitted_late' : 'submitted';
  else if (preApplication) status = 'pre_application';
  else if (!d) status = 'not_started';
  else if (now > d.due) status = 'overdue';
  else if (d.due - now <= dueSoonMs) status = 'due_soon';
  else status = 'running';
  return {
    id,
    anchor: anchorKind,
    due: d?.due ?? null,
    dueReg1182: d?.dueReg1182 ?? null,
    remainingMs: d && submittedAt == null ? d.due - now : null,
    submittedAt,
    status,
    flags,
  };
}

/**
 * Compute the three Article 14 milestones for one track.
 *
 * track = {
 *   kind: 'vulnerability' | 'incident', triggered: boolean, awareAt,
 *   earlyWarningSubmittedAt, notificationSubmittedAt, finalReportSubmittedAt,
 *   measureAvailableAt   // vulnerability only: corrective or mitigating measure available
 * }
 * Timestamps: epoch ms, ISO string, Date or null.
 */
export function computeTrack(track, { now = Date.now(), dueSoonMs = DEFAULT_DUE_SOON_MS } = {}) {
  const { kind } = track;
  if (kind !== 'vulnerability' && kind !== 'incident') throw new Error(`Unknown track kind: ${kind}`);
  if (!track.triggered) return { kind, status: 'not_applicable', flags: [], milestones: [] };

  const awareAt = toMs(track.awareAt);
  if (awareAt == null) return { kind, status: 'needs_awareness', flags: [], milestones: [] };

  const ew = toMs(track.earlyWarningSubmittedAt);
  const notif = toMs(track.notificationSubmittedAt);
  const final = toMs(track.finalReportSubmittedAt);
  const now_ = toMs(now);

  const flags = [];
  // Only for vulnerabilities is there guidance (ENISA FAQ 13) that awareness before the start
  // date means no retroactive duty. Incident deadlines keep running; the flag still warns.
  const awareBefore = awareAt < APPLICATION_START;
  const preApplication = awareBefore && kind === 'vulnerability';
  if (awareBefore) flags.push('aware_before_application');
  const ctx = { now: now_, dueSoonMs, preApplication, awareAt };

  // Both early deadlines are anchored to awareness. A late early warning never moves the 72h deadline.
  const milestones = [
    milestone('early_warning', 'awareness', deadline(awareAt, 'hours', 24), ew, ctx),
    milestone('notification', 'awareness', deadline(awareAt, 'hours', 72), notif, ctx),
  ];

  let finalMs;
  if (kind === 'vulnerability') {
    const measure = toMs(track.measureAvailableAt);
    if (measure != null && measure < awareAt) flags.push('measure_before_awareness');
    finalMs = milestone('final_report', 'measure_available', deadline(measure, 'days', 14), final, ctx);
  } else {
    finalMs = milestone('final_report', 'notification_submitted', deadline(notif, 'months', 1), final, ctx);
  }
  if (finalMs.due != null) finalMs.flags.push('reg1182_holidays_not_modelled');
  milestones.push(finalMs);

  return { kind, status: 'active', flags, milestones };
}

/** Compute both tracks of a case (see README for the case shape). */
export function computeCase(c, opts) {
  const track = (kind) => computeTrack({
    kind,
    ...c.tracks?.[kind],
    awareAt: c.awarenessAssessments?.[kind]?.awareAt ?? null,
  }, opts);
  return { vulnerability: track('vulnerability'), incident: track('incident') };
}
