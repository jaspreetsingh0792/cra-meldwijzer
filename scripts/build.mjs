// Build the static site into dist/: app files, core modules, compiled content, service worker.
// Refuses to build invalid content.
import { cpSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, relative } from 'node:path';
import { ROOT, loadContent } from './content.mjs';
import { checkContent } from './check.mjs';

const content = loadContent();
const { errors } = checkContent(content);
if (errors.length) {
  for (const e of errors) console.error(`ERROR ${e}`);
  process.exit(1);
}

const DIST = join(ROOT, 'dist');
rmSync(DIST, { recursive: true, force: true });
cpSync(join(ROOT, 'app'), DIST, { recursive: true, filter: (src) => !src.endsWith('sw.template.js') });
cpSync(join(ROOT, 'src', 'core'), join(DIST, 'core'), { recursive: true });

const data = join(DIST, 'data');
mkdirSync(data, { recursive: true });
const write = (name, value) => writeFileSync(join(data, name), `${JSON.stringify(value)}\n`);
write('sources.json', content.sources);
write('tree.json', content.tree);
write('templates.json', content.templates);
for (const [lang, doc] of Object.entries(content.i18n)) write(`i18n.${lang}.json`, doc);
for (const [lang, chapters] of Object.entries(content.runbook)) write(`runbook.${lang}.json`, chapters);
writeFileSync(join(DIST, '.nojekyll'), '');

// Service worker: cache every file, versioned by a hash of all of them.
const files = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (!name.startsWith('.')) files.push(path);
  }
};
walk(DIST);
const hash = createHash('sha256');
const assets = ['./'];
for (const path of files.sort()) {
  hash.update(relative(DIST, path)).update(readFileSync(path));
  assets.push(`./${relative(DIST, path).split('\\').join('/')}`);
}
const sw = readFileSync(join(ROOT, 'app', 'sw.template.js'), 'utf8')
  .replace("'cra-meldwijzer-__VERSION__'", `'cra-meldwijzer-${hash.digest('hex').slice(0, 12)}'`)
  .replace('= __ASSETS__;', `= ${JSON.stringify(assets, null, 2)};`);
writeFileSync(join(DIST, 'sw.js'), sw);

console.log(`built ${DIST} (${files.length + 1} files)`);
