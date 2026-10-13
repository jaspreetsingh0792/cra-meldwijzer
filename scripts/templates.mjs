// Generate blank Markdown templates into templates/<lang>/. With --check, fail if the
// committed files are out of date instead of writing them.
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, loadContent } from './content.mjs';
import { documentIds, renderMarkdown, templateFileName } from '../src/core/templates.js';

export function generatedTemplates(content = loadContent()) {
  const files = {};
  for (const [lang, text] of Object.entries(content.i18n)) {
    const index = [`# ${lang === 'nl' ? 'Sjablonen' : 'Templates'}`, ''];
    for (const docId of documentIds(content.templates)) {
      const md = renderMarkdown({ templates: content.templates, sources: content.sources, text }, docId);
      files[join(lang, templateFileName(docId))] = md;
      index.push(`- [${md.split('\n')[0].slice(2)}](${templateFileName(docId)})`);
    }
    index.push('', lang === 'nl'
      ? '_Gegenereerd uit `content/templates.yaml`. Niet met de hand bewerken; draai `npm run templates`._'
      : '_Generated from `content/templates.yaml`. Do not edit by hand; run `npm run templates`._', '');
    files[join(lang, 'README.md')] = index.join('\n');
  }
  return files;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const check = process.argv.includes('--check');
  const outDir = join(ROOT, 'templates');
  const stale = [];
  for (const [path, md] of Object.entries(generatedTemplates())) {
    const target = join(outDir, path);
    if (check) {
      if (!existsSync(target) || readFileSync(target, 'utf8') !== md) stale.push(path);
    } else {
      mkdirSync(join(target, '..'), { recursive: true });
      writeFileSync(target, md);
    }
  }
  if (check && stale.length) {
    console.error(`Out of date (run npm run templates): ${stale.join(', ')}`);
    process.exit(1);
  }
  console.log(check ? 'templates up to date' : `wrote ${outDir}`);
}
