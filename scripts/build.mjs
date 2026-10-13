// Compile YAML content to JSON for the static app. Refuses to build invalid content.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, loadContent } from './content.mjs';
import { checkContent } from './check.mjs';

const content = loadContent();
const { errors } = checkContent(content);
if (errors.length) {
  for (const e of errors) console.error(`ERROR ${e}`);
  process.exit(1);
}

const out = join(ROOT, 'dist', 'data');
mkdirSync(out, { recursive: true });
const write = (name, data) => writeFileSync(join(out, name), `${JSON.stringify(data, null, 2)}\n`);

write('sources.json', content.sources);
write('tree.json', content.tree);
for (const [lang, doc] of Object.entries(content.i18n)) write(`i18n.${lang}.json`, doc);
for (const [lang, chapters] of Object.entries(content.runbook)) write(`runbook.${lang}.json`, chapters);
console.log(`built ${out}`);
