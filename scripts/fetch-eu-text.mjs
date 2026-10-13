// Fetch an official EU legal text (by CELEX number) from the Publications Office, over HTTPS only.
//
//   node scripts/fetch-eu-text.mjs 32024R2847R(02)        English
//   node scripts/fetch-eu-text.mjs 32024R2847 nld         Dutch
//
// EUR-Lex web pages block scripted requests. The Publications Office serves the same documents,
// but its HTTPS endpoint redirects to an http:// address. This script never follows that
// redirect: it checks the target is a Publications Office document and fetches it over HTTPS.
// Exit code 2 when the document has no version in the requested language.
import { htmlToText } from './watch-sources.mjs';

const HOST = 'publications.europa.eu';

export async function fetchEuText(celex, lang = 'eng') {
  if (!/^[0-9A-Z()]+$/.test(celex)) throw new Error(`Not a CELEX number: ${celex}`);
  if (!/^[a-z]{3}$/.test(lang)) throw new Error(`Language must be a 3-letter code such as eng or nld: ${lang}`);
  const headers = { accept: 'text/html, application/xhtml+xml', 'accept-language': lang, 'user-agent': 'cra-meldwijzer' };
  // The server only resolves parentheses when percent-encoded (encodeURIComponent leaves them).
  const id = celex.replace(/\(/g, '%28').replace(/\)/g, '%29');
  const first = await fetch(`https://${HOST}/resource/celex/${id}`, { headers, redirect: 'manual', signal: AbortSignal.timeout(60_000) });
  if (first.status === 404) return null;
  const location = first.headers.get('location');
  if (first.status < 300 || first.status >= 400 || !location) throw new Error(`Unexpected response ${first.status} for ${celex}`);
  const target = new URL(location, `https://${HOST}`);
  if (target.hostname !== HOST || !target.pathname.startsWith('/resource/cellar/')) throw new Error(`Refusing redirect to ${target.href}`);
  target.protocol = 'https:';
  const res = await fetch(target, { headers, redirect: 'error', signal: AbortSignal.timeout(60_000) });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${target.href}`);
  return { url: target.href, text: htmlToText(await res.text()) };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [celex, lang = 'eng'] = process.argv.slice(2);
  if (!celex) {
    console.error('Usage: node scripts/fetch-eu-text.mjs <CELEX> [eng|nld|...]');
    process.exit(1);
  }
  const doc = await fetchEuText(celex, lang);
  if (!doc) {
    console.error(`${celex} has no ${lang} version (a corrigendum for other languages only, or a wrong number).`);
    process.exit(2);
  }
  console.log(`Source: ${doc.url}\n`);
  console.log(doc.text);
}
