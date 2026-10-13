// iCalendar (RFC 5545) export for deadlines. Pure functions, no DOM.

const pad = (n) => String(n).padStart(2, '0');

/** 20261014T123400Z */
export function icsDate(ms) {
  const d = new Date(ms);
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T`
    + `${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
}

/** Escape TEXT values: backslash, semicolon, comma, newline. */
export const icsEscape = (s) => String(s)
  .replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');

/** Fold a content line to at most 75 octets per line (continuation lines start with a space). */
export function foldLine(line) {
  const enc = new TextEncoder();
  const out = [];
  let current = '';
  let bytes = 0;
  for (const ch of line) {
    const size = enc.encode(ch).length;
    const limit = out.length === 0 ? 75 : 74;
    if (bytes + size > limit) {
      out.push(current);
      current = '';
      bytes = 0;
    }
    current += ch;
    bytes += size;
  }
  out.push(current);
  return out.join('\r\n ');
}

/**
 * Build a calendar.
 * events: [{ uid, start (ms), durationMin?, summary, description?, alarmsMin?: [minutes before] }]
 */
export function toIcs(events, { now = Date.now(), prodId = '-//CRA Meldwijzer//EN' } = {}) {
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', `PRODID:${prodId}`, 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH'];
  for (const e of events) {
    lines.push(
      'BEGIN:VEVENT',
      `UID:${e.uid}`,
      `DTSTAMP:${icsDate(now)}`,
      `DTSTART:${icsDate(e.start)}`,
      `DTEND:${icsDate(e.start + (e.durationMin ?? 15) * 60_000)}`,
      `SUMMARY:${icsEscape(e.summary)}`,
    );
    if (e.description) lines.push(`DESCRIPTION:${icsEscape(e.description)}`);
    for (const min of e.alarmsMin ?? []) {
      lines.push('BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${icsEscape(e.summary)}`, `TRIGGER:-PT${min}M`, 'END:VALARM');
    }
    lines.push('END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  return `${lines.map(foldLine).join('\r\n')}\r\n`;
}
