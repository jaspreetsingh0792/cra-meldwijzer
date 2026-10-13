import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadContent } from '../scripts/content.mjs';
import { checkContent } from '../scripts/check.mjs';
import { walk, derive, evaluate, OUTCOME_KEYS, END } from '../src/core/tree.js';

const content = loadContent();
const { tree } = content;

// A Dutch manufacturer, in scope, aware after 11 Sep 2026, no Cbw/GDPR angle.
const BASE = {
  product: 'yes', market: 'yes', exclusion: 'no', role: 'manufacturer', establishment: 'nl',
  vuln_contained: 'no', incident_occurred: 'no', awareness: 'after', cbw: 'no', gdpr: 'no',
};
const run = (overrides) => evaluate(tree, { ...BASE, ...overrides }).outcome;

test('content passes all integrity checks', () => {
  const { errors } = checkContent(content);
  assert.deepEqual(errors, []);
});

test('the integrity check catches a broken reference', () => {
  const broken = structuredClone(content);
  broken.tree.nodes.market.options.yes.next = 'nowhere';
  const { errors } = checkContent(broken);
  assert.ok(errors.some((e) => e.includes('"nowhere" does not exist')));
});

test('actively exploited vulnerability, Dutch manufacturer', () => {
  const o = run({ vuln_contained: 'yes', vuln_exploited: 'yes' });
  assert.equal(o.tracks.vulnerability, 'reportable');
  assert.equal(o.tracks.incident, 'not_reportable');
  for (const k of ['routing.nl', 'action.record_awareness', 'action.inform_users']) assert.ok(o.keys.includes(k), k);
});

test('severe incident is found even when there is no vulnerability (independent triggers)', () => {
  const o = run({ incident_occurred: 'yes', incident_a: 'no', incident_b: 'yes' });
  assert.equal(o.tracks.vulnerability, 'not_reportable');
  assert.equal(o.tracks.incident, 'reportable');
});

test('both triggers can apply to one event', () => {
  const o = run({ vuln_contained: 'yes', vuln_exploited: 'yes', incident_occurred: 'yes', incident_a: 'yes', incident_b: 'no' });
  assert.equal(o.tracks.vulnerability, 'reportable');
  assert.equal(o.tracks.incident, 'reportable');
});

test('unsure exploitation evidence is potentially reportable, never "not reportable"', () => {
  assert.equal(run({ vuln_contained: 'yes', vuln_exploited: 'unsure' }).tracks.vulnerability, 'potentially_reportable');
  assert.equal(run({ vuln_contained: 'unsure', vuln_exploited: 'unsure' }).tracks.vulnerability, 'potentially_reportable');
});

test('severity limbs: one unsure and one no stays potentially reportable', () => {
  assert.equal(run({ incident_occurred: 'yes', incident_a: 'unsure', incident_b: 'no' }).tracks.incident, 'potentially_reportable');
  assert.equal(run({ incident_occurred: 'yes', incident_a: 'no', incident_b: 'no' }).tracks.incident, 'not_reportable');
  assert.equal(run({ incident_occurred: 'unsure', incident_a: 'yes', incident_b: 'no' }).tracks.incident, 'potentially_reportable');
});

test('uncertain scope or role caps the result at potentially reportable', () => {
  const o = run({ exclusion: 'unsure', vuln_contained: 'yes', vuln_exploited: 'yes' });
  assert.equal(o.tracks.vulnerability, 'potentially_reportable');
  assert.ok(o.keys.includes('caveat.scope_or_role_unsure'));
  assert.equal(run({ role: 'unsure', vuln_contained: 'yes', vuln_exploited: 'yes' }).tracks.vulnerability, 'potentially_reportable');
});

test('out of scope answers stop the walk with a reason', () => {
  assert.deepEqual(evaluate(tree, { product: 'no' }).outcome.keys, ['scope.out.not_pde']);
  assert.deepEqual(evaluate(tree, { product: 'yes', market: 'no' }).outcome.keys, ['scope.out.not_on_market']);
  assert.deepEqual(evaluate(tree, { product: 'yes', market: 'yes', exclusion: 'yes' }).outcome.keys, ['scope.out.excluded']);
});

test('importers/distributors and stewards get role outcomes', () => {
  const base = { product: 'yes', market: 'yes', exclusion: 'no' };
  assert.deepEqual(evaluate(tree, { ...base, role: 'importer_distributor' }).outcome.keys, ['role.importer_distributor']);
  assert.deepEqual(evaluate(tree, { ...base, role: 'steward' }).outcome.keys, ['role.steward']);
  assert.equal(run({ role: 'own_brand_or_modified', vuln_contained: 'yes', vuln_exploited: 'yes' }).tracks.vulnerability, 'reportable');
});

test('awareness before 11 Sep 2026: no retroactive duty; unfinished assessments get a caveat', () => {
  const o = run({ awareness: 'before', vuln_contained: 'yes', vuln_exploited: 'yes' });
  assert.equal(o.tracks.vulnerability, 'no_retroactive_duty');
  const p = run({ awareness: 'before', vuln_contained: 'yes', vuln_exploited: 'unsure' });
  assert.equal(p.tracks.vulnerability, 'potentially_reportable');
  assert.ok(p.keys.includes('caveat.pre_application_check'));
});

test('unsure awareness timing keeps the duty and adds a caveat', () => {
  const o = run({ awareness: 'unsure', vuln_contained: 'yes', vuln_exploited: 'yes' });
  assert.equal(o.tracks.vulnerability, 'reportable');
  assert.ok(o.keys.includes('caveat.awareness_unsure'));
});

test('routing follows the main establishment', () => {
  const hit = { vuln_contained: 'yes', vuln_exploited: 'yes' };
  for (const est of ['nl', 'other_eu', 'non_eu', 'unsure']) {
    assert.ok(run({ ...hit, establishment: est }).keys.includes(`routing.${est}`), est);
  }
  assert.ok(!run({}).keys.some((k) => k.startsWith('routing.')), 'no routing when nothing is triggered');
});

test('Cbw and GDPR are flagged as separate assessments, even without a CRA trigger', () => {
  assert.ok(run({ cbw: 'yes' }).keys.includes('parallel.cbw'));
  assert.ok(run({ cbw: 'unsure' }).keys.includes('parallel.cbw_check'));
  assert.ok(run({ gdpr: 'unsure' }).keys.includes('parallel.gdpr'));
});

test('walk reports the next unanswered question and rejects unknown options', () => {
  assert.equal(walk(tree, { product: 'yes' }).pending, 'market');
  assert.throws(() => walk(tree, { product: 'maybe' }), /Unknown option/);
});

test('exhaustive: every path ends, emits only known keys, and "unsure" never yields not_reportable', () => {
  let paths = 0;
  const visit = (id, answers) => {
    if (id === END) {
      paths++;
      const { facts } = walk(tree, answers);
      const o = derive(facts);
      for (const k of o.keys) assert.ok(OUTCOME_KEYS.includes(k), `unknown key ${k}`);
      if (o.tracks) {
        const vulnUnsure = [facts.vuln_contained, facts.vuln_exploited].includes('unsure')
          && facts.vuln_contained !== 'no' && facts.vuln_exploited !== 'no';
        if (vulnUnsure) assert.notEqual(o.tracks.vulnerability, 'not_reportable', JSON.stringify(answers));
        const incUnsure = facts.incident_occurred !== 'no'
          && [facts.incident_occurred, facts.severe_a, facts.severe_b].includes('unsure')
          && !(facts.severe_a === 'no' && facts.severe_b === 'no');
        if (incUnsure) assert.notEqual(o.tracks.incident, 'not_reportable', JSON.stringify(answers));
      }
      return;
    }
    for (const [opt, { next }] of Object.entries(tree.nodes[id].options)) visit(next, { ...answers, [id]: opt });
  };
  visit(tree.start, {});
  assert.ok(paths > 1000, `only ${paths} paths`);
});
