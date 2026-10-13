import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, loadContent } from '../scripts/content.mjs';
import { checkContent } from '../scripts/check.mjs';
import { generatedTemplates } from '../scripts/templates.mjs';
import { documentIds, documentSections, renderMarkdown } from '../src/core/templates.js';

const content = loadContent();
const ctx = (lang) => ({ templates: content.templates, sources: content.sources, text: content.i18n[lang] });

test('six reports (two tracks x three stages) plus the user advisory', () => {
  const ids = documentIds(content.templates);
  for (const track of ['vulnerability', 'incident']) {
    for (const stage of ['early_warning', 'notification', 'final_report']) assert.ok(ids.includes(`${track}.${stage}`));
  }
  assert.ok(ids.includes('advisory'));
  assert.equal(ids.length, 7);
});

test('every document renders in every language without gaps', () => {
  for (const lang of Object.keys(content.i18n)) {
    for (const id of documentIds(content.templates)) {
      const md = renderMarkdown(ctx(lang), id);
      assert.match(md, /^# /);
      assert.doesNotMatch(md, /undefined|null|\[object/, `${lang}/${id}`);
    }
  }
});

test('Article 14 content requirements appear in the right reports', () => {
  const fields = (id) => documentSections(content.templates, id).flatMap((s) => s.fields.map((f) => f.id));
  assert.ok(fields('incident.early_warning').includes('suspected_malicious'));
  assert.ok(!fields('vulnerability.early_warning').includes('suspected_malicious'));
  assert.ok(fields('vulnerability.notification').includes('user_measures'));
  assert.ok(fields('incident.final_report').includes('root_cause'));
  assert.ok(fields('vulnerability.final_report').includes('security_update'));
});

test('the earlier-report reference is only asked for follow-up reports', () => {
  const has = (id) => documentSections(content.templates, id).some((s) => s.fields.some((f) => f.id === 'previous_reference'));
  assert.equal(has('vulnerability.early_warning'), false);
  assert.equal(has('vulnerability.notification'), true);
  assert.equal(has('incident.final_report'), true);
});

test('Dutch templates use the exact NCSC form wording for the report type', () => {
  const md = renderMarkdown(ctx('nl'), 'vulnerability.early_warning');
  assert.ok(md.includes('Vroegtijdige waarschuwing - van een actief misbruikte kwetsbaarheid'));
});

test('filled-in values replace the fill-in marker', () => {
  const md = renderMarkdown(ctx('en'), 'incident.early_warning', { suspected_malicious: 'Yes: stolen build account.' });
  assert.ok(md.includes('Yes: stolen build account.'));
  assert.ok(md.includes('[fill in]'));
});

test('content check catches a template field without wording', () => {
  const broken = structuredClone(content);
  broken.templates.reports['incident.notification'].fields.push({ id: 'no_such_field', need: 'legal' });
  const { errors } = checkContent(broken);
  assert.ok(errors.some((e) => e.includes('t.field.no_such_field.label')));
});

test('committed blank templates are up to date', () => {
  for (const [path, md] of Object.entries(generatedTemplates(content))) {
    assert.equal(readFileSync(join(ROOT, 'templates', path), 'utf8'), md, `templates/${path} is stale: run npm run templates`);
  }
});
