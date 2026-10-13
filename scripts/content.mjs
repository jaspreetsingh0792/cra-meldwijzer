// Loads the YAML content. Used by build, check and tests (never shipped to the browser).
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT = join(ROOT, 'content');

const load = (path) => parse(readFileSync(path, 'utf8'));

export function loadContent() {
  const i18n = {};
  for (const file of readdirSync(join(CONTENT, 'i18n')).filter((f) => f.endsWith('.yaml'))) {
    const doc = load(join(CONTENT, 'i18n', file));
    i18n[doc.lang] = doc;
  }
  return {
    sources: load(join(CONTENT, 'sources.yaml')).sources,
    tree: load(join(CONTENT, 'tree.yaml')),
    i18n,
  };
}

/** Flatten nested i18n objects to dotted keys: { q: { a: 'x' } } -> { 'q.a': 'x' }. */
export function flatten(obj, prefix = '', out = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object') flatten(v, key, out);
    else out[key] = v;
  }
  return out;
}
