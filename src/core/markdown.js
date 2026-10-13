// Minimal Markdown -> HTML for the runbook. Pure function, no DOM.
//
// Supports exactly what content/runbook uses: headings, paragraphs, lists (including
// "- [ ]" checklists), tables, blockquotes, **bold**, _italic_, `code`, links and
// [src:id] citations. All text is HTML-escaped before formatting is applied, and only
// http(s), in-page and caller-approved links survive.

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ESC[c]);

const unescapeAttr = (s) => s.replace(/&amp;/g, '&');

function safeHref(href, mapLink) {
  const raw = unescapeAttr(href);
  if (/^https?:\/\//i.test(raw)) return raw;
  if (raw.startsWith('#')) return raw;
  return mapLink ? mapLink(raw) : null;
}

/**
 * Inline formatting. opts.cite(id) returns trusted HTML for a [src:id] citation;
 * opts.mapLink(href) returns an href for relative links (or null to drop the link).
 */
export function inline(text, opts = {}) {
  const codes = [];
  let s = escapeHtml(text).replace(/`([^`]+)`/g, (_, c) => `\u0000${codes.push(c) - 1}\u0000`);
  s = s.replace(/\[src:([a-z0-9_]+)\]/g, (_, id) => (opts.cite ? opts.cite(id) : ''));
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (whole, label, href) => {
    const target = safeHref(href, opts.mapLink);
    if (target == null) return label;
    const external = /^https?:/i.test(target);
    return `<a href="${escapeHtml(target)}"${external ? ' rel="noopener noreferrer" target="_blank"' : ''}>${label}</a>`;
  });
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[\s(])_([^_]+)_(?=[\s).,:;!?]|$)/g, '$1<em>$2</em>');
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${codes[i]}</code>`);
}

export const slug = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '');

const splitRow = (line) => line.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());

/** Render a Markdown document to an HTML string. */
export function renderMarkdown(md, opts = {}) {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const html = [];
  let para = null;
  let list = null; // { tag, items: [string] }

  const flushPara = () => {
    if (para) html.push(`<p>${inline(para.join(' '), opts)}</p>`);
    para = null;
  };
  const flushList = () => {
    if (!list) return;
    const items = list.items.map((raw) => {
      const box = raw.match(/^\[( |x)\] (.*)$/i);
      if (!box) return `<li>${inline(raw, opts)}</li>`;
      const checked = box[1].toLowerCase() === 'x' ? ' checked' : '';
      return `<li class="check"><label><input type="checkbox"${checked}> <span>${inline(box[2], opts)}</span></label></li>`;
    });
    html.push(`<${list.tag}>${items.join('')}</${list.tag}>`);
    list = null;
  };
  const flush = () => { flushPara(); flushList(); };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) { flush(); continue; }

    const heading = line.match(/^(#{1,6}) (.*)$/);
    if (heading) {
      flush();
      const n = heading[1].length;
      html.push(`<h${n} id="${slug(heading[2])}">${inline(heading[2], opts)}</h${n}>`);
      continue;
    }

    if (line.startsWith('|') && /^\|[\s|:-]+\|$/.test(lines[i + 1]?.trim() ?? '')) {
      flush();
      const head = splitRow(line);
      const rows = [];
      i += 2;
      while (i < lines.length && lines[i].trim().startsWith('|')) rows.push(splitRow(lines[i++]));
      i--;
      html.push('<div class="table-wrap"><table><thead><tr>'
        + head.map((c) => `<th scope="col">${inline(c, opts)}</th>`).join('')
        + '</tr></thead><tbody>'
        + rows.map((r) => `<tr>${r.map((c) => `<td>${inline(c, opts)}</td>`).join('')}</tr>`).join('')
        + '</tbody></table></div>');
      continue;
    }

    const quote = line.match(/^> ?(.*)$/);
    if (quote) {
      flush();
      const parts = [quote[1]];
      while (i + 1 < lines.length && /^> ?/.test(lines[i + 1])) parts.push(lines[++i].replace(/^> ?/, ''));
      html.push(`<blockquote><p>${inline(parts.join(' '), opts)}</p></blockquote>`);
      continue;
    }

    const item = line.match(/^([-*]|\d+\.) (.*)$/);
    if (item) {
      flushPara();
      const tag = /\d/.test(item[1]) ? 'ol' : 'ul';
      if (list && list.tag !== tag) flushList();
      if (!list) list = { tag, items: [] };
      list.items.push(item[2]);
      continue;
    }

    if (/^\s+\S/.test(line) && list) {
      list.items[list.items.length - 1] += ` ${line.trim()}`;
      continue;
    }

    flushList();
    (para ??= []).push(line.trim());
  }
  flush();
  return html.join('\n');
}
