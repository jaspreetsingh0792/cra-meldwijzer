import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderMarkdown, inline } from '../src/core/markdown.js';
import { toIcs, foldLine, icsEscape, icsDate } from '../src/core/ics.js';
import { loadContent, citations } from '../scripts/content.mjs';

// --- Markdown ---------------------------------------------------------------

test('markdown escapes HTML and drops unsafe links', () => {
  const html = renderMarkdown('Hi <script>alert(1)</script> [x](javascript:alert(1)) [y](https://ncsc.nl)');
  assert.ok(!html.includes('<script>'));
  assert.ok(html.includes('&lt;script&gt;'));
  assert.ok(!html.includes('javascript:'));
  assert.ok(html.includes('<a href="https://ncsc.nl" rel="noopener noreferrer" target="_blank">y</a>'));
});

test('markdown renders headings, checklists with continuation lines, tables and quotes', () => {
  const html = renderMarkdown([
    '# Title', '', '- [ ] **Do** this', '      and continue', '- plain', '',
    '| A | B |', '|---|---|', '| 1 | `x` |', '', '> quoted', '> more',
  ].join('\n'));
  assert.ok(html.includes('<h1 id="title">Title</h1>'));
  assert.ok(html.includes('<input type="checkbox"> <span><strong>Do</strong> this and continue</span>'));
  assert.ok(html.includes('<li>plain</li>'));
  assert.ok(html.includes('<th scope="col">A</th>'));
  assert.ok(html.includes('<td><code>x</code></td>'));
  assert.ok(html.includes('<blockquote><p>quoted more</p></blockquote>'));
});

test('markdown citations and relative links go through the callbacks', () => {
  const out = inline('See [Roles](02-roles.md) [src:cra_art3] and [other](99.md)', {
    cite: (id) => `<sup>${id}</sup>`,
    mapLink: (href) => (href === '02-roles.md' ? '#/runbook/02-roles' : null),
  });
  assert.ok(out.includes('<a href="#/runbook/02-roles">Roles</a>'));
  assert.ok(out.includes('<sup>cra_art3</sup>'));
  assert.ok(out.includes('and other'));
});

test('every runbook chapter renders, and every citation is resolved', () => {
  const { runbook } = loadContent();
  for (const [lang, chapters] of Object.entries(runbook)) {
    for (const [file, md] of Object.entries(chapters)) {
      const seen = [];
      const html = renderMarkdown(md, { cite: (id) => { seen.push(id); return ''; }, mapLink: () => '#' });
      assert.ok(html.startsWith('<h1'), `${lang}/${file}`);
      assert.ok(!html.includes('[src:'), `${lang}/${file} has an unresolved citation`);
      assert.deepEqual(seen, citations(md));
    }
  }
});

// --- iCalendar ----------------------------------------------------------------

test('ics dates, escaping and folding', () => {
  assert.equal(icsDate(Date.parse('2026-10-14T12:34:56Z')), '20261014T123456Z');
  assert.equal(icsEscape('a,b;c\\d\ne'), 'a\\,b\\;c\\\\d\\ne');
  const folded = foldLine(`DESCRIPTION:${'é'.repeat(100)}`);
  for (const l of folded.split('\r\n')) assert.ok(new TextEncoder().encode(l).length <= 75);
  assert.equal(folded.split('\r\n').map((l, i) => (i ? l.slice(1) : l)).join(''), `DESCRIPTION:${'é'.repeat(100)}`);
});

test('ics calendar has one event with alarms per deadline', () => {
  const ics = toIcs([
    { uid: 'a@cra', start: Date.parse('2026-10-14T12:34:00Z'), summary: 'Early warning, case 1', alarmsMin: [360, 60] },
    { uid: 'b@cra', start: Date.parse('2026-10-16T12:34:00Z'), summary: 'Notification' },
  ], { now: Date.parse('2026-10-13T12:00:00Z') });
  assert.ok(ics.startsWith('BEGIN:VCALENDAR\r\nVERSION:2.0\r\n'));
  assert.ok(ics.endsWith('END:VCALENDAR\r\n'));
  assert.equal(ics.match(/BEGIN:VEVENT/g).length, 2);
  assert.equal(ics.match(/BEGIN:VALARM/g).length, 2);
  assert.ok(ics.includes('DTSTART:20261014T123400Z'));
  assert.ok(ics.includes('SUMMARY:Early warning\\, case 1'));
  assert.ok(ics.includes('TRIGGER:-PT360M'));
});
