import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadContent } from '../scripts/content.mjs';
import { htmlToText, lineDiff, targets, citedBy } from '../scripts/watch-sources.mjs';

test('htmlToText keeps the main text and drops scripts, navigation and forms', () => {
  const html = `<html><body><nav>Menu</nav><main><h1>Melden</h1><script>var x = 1;</script>
    <p>Binnen 24&nbsp;uur &amp; daarna.</p><form><input value="token123"></form>
    <ul><li>Een</li><li>Twee</li></ul><table><tr><td>A</td><td>B</td></tr></table></main><footer>Footer</footer></body></html>`;
  assert.equal(htmlToText(html), 'Melden\nBinnen 24 uur & daarna.\nEen\nTwee\nA | B');
});

test('lineDiff shows removed and added lines', () => {
  assert.deepEqual(lineDiff('a\nb\nc', 'a\nB\nc'), ['- b', '+ B']);
  assert.deepEqual(lineDiff('a', 'a'), []);
  assert.equal(lineDiff('', Array.from({ length: 300 }, (_, i) => `l${i}`).join('\n'), 10).length, 11);
});

test('every web source and the Regulation itself are watched; EUR-Lex pages via SPARQL', () => {
  const content = loadContent();
  const all = targets(content);
  const urls = all.map((t) => t.url);
  assert.ok(urls.includes(content.sources.ncsc_melden.url));
  assert.ok(all.some((t) => t.celex === '32024R2847'));
  assert.ok(!all.some((t) => !t.celex && t.url.includes('eur-lex.europa.eu')));
  assert.equal(new Set(all.map((t) => t.key)).size, all.length);
});

test('citedBy finds the content that depends on a source', () => {
  const hits = citedBy(loadContent(), ['ncsc_melden']);
  assert.ok(hits.includes('outcome `routing.nl`'));
  assert.ok(hits.some((h) => h.startsWith('runbook `nl/')));
  assert.ok(hits.includes('template `vulnerability.early_warning`'));
});
