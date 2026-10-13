import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  HOUR, DAY, APPLICATION_START, computeTrack, computeCase, zonedToUtc, addMonthsClamped, reg1182,
} from '../src/core/clock.js';

const t = (iso) => Date.parse(iso);
const iso = (ms) => new Date(ms).toISOString();
const byId = (r, id) => r.milestones.find((m) => m.id === id);
const AWARE = '2026-10-13T12:34:00Z';
const NOW = t('2026-10-13T13:00:00Z');

test('early warning and notification run from awareness (24h / 72h elapsed)', () => {
  const r = computeTrack({ kind: 'vulnerability', triggered: true, awareAt: AWARE }, { now: NOW });
  assert.equal(iso(byId(r, 'early_warning').due), '2026-10-14T12:34:00.000Z');
  assert.equal(iso(byId(r, 'notification').due), '2026-10-16T12:34:00.000Z');
  assert.equal(byId(r, 'early_warning').status, 'running');
});

test('a late early warning never moves the 72h deadline', () => {
  const r = computeTrack({
    kind: 'incident', triggered: true, awareAt: AWARE,
    earlyWarningSubmittedAt: t(AWARE) + 30 * HOUR,
  }, { now: t(AWARE) + 31 * HOUR });
  assert.equal(byId(r, 'early_warning').status, 'submitted_late');
  assert.equal(byId(r, 'notification').due, t(AWARE) + 72 * HOUR);
});

test('vulnerability final report is not started until a measure is available', () => {
  const r = computeTrack({ kind: 'vulnerability', triggered: true, awareAt: AWARE }, { now: NOW });
  const f = byId(r, 'final_report');
  assert.equal(f.status, 'not_started');
  assert.equal(f.due, null);
  assert.equal(f.anchor, 'measure_available');
});

test('vulnerability final report = measure available + 14 days', () => {
  const measure = t('2026-11-02T08:00:00Z');
  const r = computeTrack({ kind: 'vulnerability', triggered: true, awareAt: AWARE, measureAvailableAt: measure }, { now: NOW });
  assert.equal(byId(r, 'final_report').due, measure + 14 * DAY);
});

test('14 days across the spring DST change ends at the same Amsterdam wall time, not an hour later', () => {
  // 22 Mar 2028 23:16 CET -> 5 Apr 2028 23:16 CEST = 21:16Z (14 x 24h would give 22:16Z = 00:16 on 6 Apr)
  const r = computeTrack({
    kind: 'vulnerability', triggered: true, awareAt: '2028-03-20T00:00:00Z', measureAvailableAt: '2028-03-22T22:16:00Z',
  }, { now: t('2028-03-23T00:00:00Z') });
  assert.equal(iso(byId(r, 'final_report').due), '2028-04-05T21:16:00.000Z');
});

test('measure available before awareness is flagged for review', () => {
  const r = computeTrack({
    kind: 'vulnerability', triggered: true, awareAt: AWARE, measureAvailableAt: '2026-09-20T00:00:00Z',
  }, { now: NOW });
  assert.ok(r.flags.includes('measure_before_awareness'));
  assert.equal(byId(r, 'final_report').status, 'overdue');
});

test('incident final report is not started until the notification is submitted', () => {
  const r = computeTrack({ kind: 'incident', triggered: true, awareAt: AWARE }, { now: NOW });
  assert.equal(byId(r, 'final_report').status, 'not_started');
  assert.equal(byId(r, 'final_report').anchor, 'notification_submitted');
});

test('incident final report: one calendar month after notification, clamped at month end', () => {
  // 31 Jan 2027 10:00 Amsterdam (CET) -> 28 Feb 2027 10:00 CET
  const r = computeTrack({
    kind: 'incident', triggered: true, awareAt: '2027-01-29T09:00:00Z', notificationSubmittedAt: '2027-01-31T09:00:00Z',
  }, { now: t('2027-02-01T00:00:00Z') });
  assert.equal(iso(byId(r, 'final_report').due), '2027-02-28T09:00:00.000Z');
});

test('calendar month in a leap year: 31 Jan 2028 -> 29 Feb 2028', () => {
  assert.equal(iso(addMonthsClamped(t('2028-01-31T09:00:00Z'), 1, 'Europe/Amsterdam')), '2028-02-29T09:00:00.000Z');
});

test('calendar month across DST keeps Amsterdam wall time and takes the earlier reading', () => {
  // 15 Mar 2027 11:00 CET -> 15 Apr 2027 11:00 CEST = 09:00Z (UTC reading would be 10:00Z)
  const r = computeTrack({
    kind: 'incident', triggered: true, awareAt: '2027-03-13T10:00:00Z', notificationSubmittedAt: '2027-03-15T10:00:00Z',
  }, { now: t('2027-03-16T00:00:00Z') });
  assert.equal(iso(byId(r, 'final_report').due), '2027-04-15T09:00:00.000Z');
});

test('time zone can never push the month deadline later (UTC vs Amsterdam day boundary)', () => {
  // 31 Jan 2027 00:30 Amsterdam = 30 Jan 23:30Z. Amsterdam reading: 28 Feb 00:30 CET = 27 Feb 23:30Z.
  const r = computeTrack({
    kind: 'incident', triggered: true, awareAt: '2027-01-29T00:00:00Z', notificationSubmittedAt: '2027-01-30T23:30:00Z',
  }, { now: t('2027-02-01T00:00:00Z') });
  assert.equal(iso(byId(r, 'final_report').due), '2027-02-27T23:30:00.000Z');
});

test('24h across the spring DST change is 24 elapsed hours', () => {
  const aware = t('2027-03-27T11:00:00Z'); // 12:00 CET, clocks jump on 28 Mar
  const r = computeTrack({ kind: 'vulnerability', triggered: true, awareAt: aware }, { now: aware });
  assert.equal(byId(r, 'early_warning').due, aware + 24 * HOUR);
});

test('reg1182 reading: hour of the event is not counted', () => {
  assert.equal(iso(reg1182.hours(t('2026-10-13T14:23:00Z'), 24)), '2026-10-14T15:00:00.000Z');
});

test('reg1182 reading: 14 days end at the end of the day (Amsterdam), across DST end', () => {
  // Thu 15 Oct 2026 -> Thu 29 Oct 2026 end of day = 30 Oct 00:00 CET = 29 Oct 23:00Z
  assert.equal(iso(reg1182.days(t('2026-10-15T08:00:00Z'), 14)), '2026-10-29T23:00:00.000Z');
});

test('reg1182 reading: a period ending on a weekend rolls to the next working day', () => {
  // Sat 17 Oct 2026 + 14 = Sat 31 Oct -> Mon 2 Nov end of day = 2 Nov 23:00Z
  assert.equal(iso(reg1182.days(t('2026-10-17T10:00:00Z'), 14)), '2026-11-02T23:00:00.000Z');
});

test('conservative deadline is never later than the reg1182 reading', () => {
  let seed = 42;
  const rand = () => (seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31;
  for (let i = 0; i < 2000; i++) {
    const anchor = t('2026-09-11T00:00:00Z') + Math.floor(rand() * 3 * 365 * DAY);
    const v = computeTrack({
      kind: 'vulnerability', triggered: true, awareAt: anchor, measureAvailableAt: anchor + Math.floor(rand() * 30 * DAY),
    }, { now: anchor });
    const inc = computeTrack({
      kind: 'incident', triggered: true, awareAt: anchor, notificationSubmittedAt: anchor + Math.floor(rand() * 72 * HOUR),
    }, { now: anchor });
    for (const m of [...v.milestones, ...inc.milestones]) {
      assert.ok(m.due <= m.dueReg1182, `${m.id} at ${iso(anchor)}: ${iso(m.due)} > ${iso(m.dueReg1182)}`);
    }
  }
});

test('status transitions: running -> due_soon -> overdue -> submitted', () => {
  const at = (now, extra = {}) => byId(computeTrack({ kind: 'vulnerability', triggered: true, awareAt: AWARE, ...extra }, { now }), 'early_warning').status;
  assert.equal(at(t(AWARE) + 1 * HOUR), 'running');
  assert.equal(at(t(AWARE) + 20 * HOUR), 'due_soon');
  assert.equal(at(t(AWARE) + 25 * HOUR), 'overdue');
  assert.equal(at(t(AWARE) + 25 * HOUR, { earlyWarningSubmittedAt: t(AWARE) + 10 * HOUR }), 'submitted');
});

test('a submitted early warning leaves later milestones open', () => {
  const r = computeTrack({
    kind: 'vulnerability', triggered: true, awareAt: AWARE, earlyWarningSubmittedAt: t(AWARE) + HOUR,
  }, { now: t(AWARE) + 2 * HOUR });
  assert.equal(byId(r, 'notification').status, 'running');
  assert.equal(byId(r, 'final_report').status, 'not_started');
});

test('awareness before 11 Sep 2026 is flagged, not shown as overdue', () => {
  const r = computeTrack({ kind: 'vulnerability', triggered: true, awareAt: '2026-09-01T10:00:00Z' }, { now: NOW });
  assert.ok(r.flags.includes('aware_before_application'));
  assert.equal(byId(r, 'early_warning').status, 'pre_application');
  assert.equal(APPLICATION_START, t('2026-09-10T22:00:00Z'));
});

test('incident awareness before 11 Sep 2026 is flagged but deadlines keep running', () => {
  const r = computeTrack({ kind: 'incident', triggered: true, awareAt: '2026-09-01T10:00:00Z' }, { now: NOW });
  assert.ok(r.flags.includes('aware_before_application'));
  assert.equal(byId(r, 'early_warning').status, 'overdue');
});

test('untriggered track and missing awareness', () => {
  assert.equal(computeTrack({ kind: 'incident', triggered: false }).status, 'not_applicable');
  assert.equal(computeTrack({ kind: 'incident', triggered: true }).status, 'needs_awareness');
  assert.throws(() => computeTrack({ kind: 'other', triggered: true }));
  assert.throws(() => computeTrack({ kind: 'incident', triggered: true, awareAt: 'not a date' }));
});

test('submission before awareness is flagged', () => {
  const r = computeTrack({
    kind: 'incident', triggered: true, awareAt: AWARE, earlyWarningSubmittedAt: t(AWARE) - HOUR,
  }, { now: NOW });
  assert.ok(byId(r, 'early_warning').flags.includes('submitted_before_awareness'));
});

test('computeCase keeps separate awareness times per track', () => {
  const r = computeCase({
    awarenessAssessments: {
      vulnerability: { awareAt: '2026-10-13T10:00:00Z' },
      incident: { awareAt: '2026-10-14T10:00:00Z' },
    },
    tracks: { vulnerability: { triggered: true }, incident: { triggered: true } },
  }, { now: NOW });
  assert.equal(iso(byId(r.vulnerability, 'early_warning').due), '2026-10-14T10:00:00.000Z');
  assert.equal(iso(byId(r.incident, 'early_warning').due), '2026-10-15T10:00:00.000Z');
});

test('zonedToUtc: ambiguous DST fall-back time returns the earlier instant', () => {
  // 25 Oct 2026 02:30 Amsterdam occurs at 00:30Z (CEST) and 01:30Z (CET)
  assert.equal(iso(zonedToUtc(2026, 10, 25, 2, 30, 0, 'Europe/Amsterdam')), '2026-10-25T00:30:00.000Z');
});
