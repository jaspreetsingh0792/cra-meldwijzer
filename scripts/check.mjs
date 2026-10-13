// Content integrity checks. Exit code 1 on any error; warnings do not fail the build.
import { loadContent, flatten } from './content.mjs';
import { OUTCOME_KEYS, END } from '../src/core/tree.js';

const SOURCE_TYPES = new Set(['regulation', 'delegated_act', 'commission_guidance', 'enisa', 'ncsc', 'national_law', 'interpretation']);
const STALE_DAYS = 90;

export function checkContent({ sources, tree, i18n }, today = new Date()) {
  const errors = [];
  const warnings = [];

  // Sources
  for (const [id, s] of Object.entries(sources)) {
    if (!SOURCE_TYPES.has(s.type)) errors.push(`source ${id}: unknown type "${s.type}"`);
    if (typeof s.binding !== 'boolean') errors.push(`source ${id}: binding must be true/false`);
    if (s.binding && !['regulation', 'delegated_act', 'national_law'].includes(s.type)) {
      errors.push(`source ${id}: only legislation can be binding`);
    }
    if (s.status === 'todo') {
      warnings.push(`source ${id}: status todo (${s.notes ?? 'needs verification'})`);
    } else if (s.status !== 'verified') {
      errors.push(`source ${id}: status must be verified or todo`);
    } else {
      if (!s.last_verified) errors.push(`source ${id}: verified but no last_verified date`);
      else if ((today - new Date(s.last_verified)) / 86_400_000 > STALE_DAYS) {
        warnings.push(`source ${id}: last verified ${s.last_verified}, older than ${STALE_DAYS} days`);
      }
      if (s.type !== 'interpretation' && !s.url) errors.push(`source ${id}: verified but no url`);
    }
  }
  const cite = (where, ids) => {
    if (!Array.isArray(ids) || ids.length === 0) errors.push(`${where}: no sources`);
    for (const id of ids ?? []) if (!sources[id]) errors.push(`${where}: unknown source "${id}"`);
  };

  // Tree structure and reachability
  if (!tree.nodes[tree.start]) errors.push(`tree: start node "${tree.start}" missing`);
  const reachable = new Set();
  const queue = [tree.start];
  let reachesEnd = false;
  while (queue.length) {
    const id = queue.shift();
    if (id === END) { reachesEnd = true; continue; }
    if (reachable.has(id) || !tree.nodes[id]) continue;
    reachable.add(id);
    for (const opt of Object.values(tree.nodes[id].options ?? {})) queue.push(opt.next);
  }
  if (!reachesEnd) errors.push('tree: no path reaches end');
  for (const [id, node] of Object.entries(tree.nodes)) {
    if (!reachable.has(id)) errors.push(`tree: node "${id}" is unreachable`);
    cite(`node ${id}`, node.sources);
    const options = Object.entries(node.options ?? {});
    if (options.length < 2) errors.push(`node ${id}: needs at least two options`);
    if (!node.options?.unsure) errors.push(`node ${id}: every question needs an "unsure" option`);
    for (const [optId, opt] of options) {
      if (opt.next !== END && !tree.nodes[opt.next]) errors.push(`node ${id}.${optId}: next "${opt.next}" does not exist`);
    }
  }

  // Outcomes: code and content must agree
  const declared = new Set(Object.keys(tree.outcomes ?? {}));
  for (const key of OUTCOME_KEYS) if (!declared.has(key)) errors.push(`outcome ${key}: emitted by derive() but not declared in tree.yaml`);
  for (const key of declared) {
    if (!OUTCOME_KEYS.includes(key)) errors.push(`outcome ${key}: declared in tree.yaml but never emitted`);
    cite(`outcome ${key}`, tree.outcomes[key].sources);
  }

  // Wording: every language complete and in parity
  const langs = Object.keys(i18n);
  if (langs.length === 0) errors.push('i18n: no language files');
  const flat = Object.fromEntries(langs.map((l) => [l, flatten(i18n[l])]));
  const required = [];
  for (const [id, node] of Object.entries(tree.nodes)) {
    required.push(`q.${id}`, `h.${id}`);
    for (const optId of Object.keys(node.options ?? {})) required.push([`opt.${id}.${optId}`, `opt.${optId}`]);
  }
  for (const key of OUTCOME_KEYS) required.push(`o.${key}`);
  for (const lang of langs) {
    for (const req of required) {
      const alts = Array.isArray(req) ? req : [req];
      const hit = alts.find((k) => typeof flat[lang][k] === 'string' && flat[lang][k].trim());
      if (!hit) errors.push(`i18n ${lang}: missing ${alts.join(' or ')}`);
    }
  }
  const ignore = new Set(['schema', 'lang']);
  for (const a of langs) for (const b of langs) {
    if (a === b) continue;
    for (const k of Object.keys(flat[a])) {
      if (!ignore.has(k) && !(k in flat[b])) errors.push(`i18n parity: "${k}" in ${a} but not in ${b}`);
    }
  }

  return { errors, warnings };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { errors, warnings } = checkContent(loadContent());
  for (const w of warnings) console.warn(`warn  ${w}`);
  for (const e of errors) console.error(`ERROR ${e}`);
  console.log(`${errors.length} error(s), ${warnings.length} warning(s)`);
  process.exit(errors.length ? 1 : 0);
}
