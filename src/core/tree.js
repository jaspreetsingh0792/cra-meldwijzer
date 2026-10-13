// Decision-tree evaluation for CRA Article 14. Pure functions: no DOM, no network.
//
// walk() follows the YAML tree with the user's answers and collects facts.
// derive() turns facts into outcome keys. Both Article 14 triggers are evaluated
// independently; "unsure" never yields "not_reportable".

export const END = 'end';

// Every key derive() can emit. CI checks each one exists in tree.yaml `outcomes`
// and in every language file under `o.`.
export const OUTCOME_KEYS = [
  'scope.out.not_pde', 'scope.out.not_on_market', 'scope.out.excluded',
  'role.importer_distributor', 'role.steward',
  ...['vulnerability', 'incident'].flatMap((t) =>
    ['reportable', 'potentially_reportable', 'not_reportable', 'no_retroactive_duty']
      .map((s) => `track.${t}.${s}`)),
  'caveat.scope_or_role_unsure', 'caveat.pre_application_check', 'caveat.awareness_unsure',
  'routing.nl', 'routing.other_eu', 'routing.non_eu', 'routing.unsure',
  'parallel.cbw', 'parallel.cbw_check', 'parallel.gdpr',
  'action.record_awareness', 'action.inform_users',
];

/**
 * Follow the tree from its start node using `answers` ({ nodeId: optionId }).
 * Returns the facts collected, the path taken, and the next unanswered node
 * (null when the walk reached `end`).
 */
export function walk(tree, answers) {
  const facts = {};
  const path = [];
  let id = tree.start;
  while (id !== END) {
    const node = tree.nodes[id];
    if (!node) throw new Error(`Unknown node: ${id}`);
    const choice = answers[id];
    if (choice === undefined) return { facts, path, pending: id };
    const option = node.options[choice];
    if (!option) throw new Error(`Unknown option "${choice}" for node "${id}"`);
    path.push({ node: id, option: choice });
    Object.assign(facts, option.set ?? {});
    id = option.next;
  }
  return { facts, path, pending: null };
}

function vulnerabilityStatus(f) {
  if (f.vuln_contained === 'no' || f.vuln_exploited === 'no') return 'not_reportable';
  if (f.vuln_contained === 'yes' && f.vuln_exploited === 'yes') return 'reportable';
  return 'potentially_reportable';
}

function incidentStatus(f) {
  if (f.incident_occurred === 'no') return 'not_reportable';
  const severe = f.severe_a === 'yes' || f.severe_b === 'yes';
  if (severe) return f.incident_occurred === 'yes' ? 'reportable' : 'potentially_reportable';
  if (f.severe_a === 'no' && f.severe_b === 'no') return 'not_reportable';
  return 'potentially_reportable';
}

const TRIGGERED = new Set(['reportable', 'potentially_reportable']);

/**
 * Derive outcome keys from collected facts. Call only on a completed walk.
 * Returns { kind, keys, tracks } where `keys` is the ordered list of outcome
 * keys to show and `tracks` holds the per-track status.
 */
export function derive(f) {
  if (f.scope === 'out') {
    return { kind: 'out_of_scope', keys: [`scope.out.${f.scope_reason}`], tracks: null };
  }
  if (f.role === 'importer_distributor' || f.role === 'steward') {
    return { kind: 'not_manufacturer', keys: [`role.${f.role}`], tracks: null };
  }

  const tracks = { vulnerability: vulnerabilityStatus(f), incident: incidentStatus(f) };
  const caveats = new Set();

  if (f.scope === 'unsure' || f.role === 'unsure') {
    for (const t of Object.keys(tracks)) {
      if (tracks[t] === 'reportable') {
        tracks[t] = 'potentially_reportable';
        caveats.add('caveat.scope_or_role_unsure');
      }
    }
  }

  if (f.aware_timing === 'before') {
    for (const t of Object.keys(tracks)) {
      if (tracks[t] === 'reportable') tracks[t] = 'no_retroactive_duty';
      else if (tracks[t] === 'potentially_reportable') caveats.add('caveat.pre_application_check');
    }
  }

  const anyTriggered = Object.values(tracks).some((s) => TRIGGERED.has(s));
  if (anyTriggered && f.aware_timing === 'unsure') caveats.add('caveat.awareness_unsure');

  const keys = [
    `track.vulnerability.${tracks.vulnerability}`,
    `track.incident.${tracks.incident}`,
    ...caveats,
  ];
  if (anyTriggered) {
    keys.push(`routing.${f.establishment ?? 'unsure'}`, 'action.record_awareness', 'action.inform_users');
  }
  if (f.cbw === 'yes') keys.push('parallel.cbw');
  else if (f.cbw === 'unsure') keys.push('parallel.cbw_check');
  if (f.personal_data === 'yes' || f.personal_data === 'unsure') keys.push('parallel.gdpr');

  return { kind: 'assessed', keys, tracks };
}

/** Convenience: walk + derive. Returns { pending } while questions remain. */
export function evaluate(tree, answers) {
  const result = walk(tree, answers);
  if (result.pending) return { ...result, outcome: null };
  return { ...result, outcome: derive(result.facts) };
}
