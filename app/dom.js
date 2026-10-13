// Tiny DOM helpers. User-entered text only ever reaches the page through text nodes
// or form values; `html` is reserved for trusted, pre-escaped markup (runbook HTML).

export function h(tag, props = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props ?? {})) {
    if (v == null || v === false) continue;
    if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'class') el.className = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k === 'value' || k === 'checked' || k === 'disabled') el[k] = v;
    else el.setAttribute(k, v === true ? '' : String(v));
  }
  append(el, children);
  return el;
}

function append(el, children) {
  for (const c of children.flat(Infinity)) {
    if (c == null || c === false) continue;
    el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
}

let counter = 0;
export const uid = (prefix = 'f') => `${prefix}-${++counter}`;

export function download(filename, mime, content) {
  const url = URL.createObjectURL(new Blob([content], { type: mime }));
  const a = h('a', { href: url, download: filename });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = h('textarea', { class: 'offscreen', readonly: true, value: text });
    document.body.append(area);
    area.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch { ok = false; }
    area.remove();
    return ok;
  }
}

/** Button that briefly shows a confirmation label after a successful copy. */
export function copyButton(label, done, getText) {
  const btn = h('button', { type: 'button', class: 'btn small' }, label);
  btn.addEventListener('click', async () => {
    if (await copyText(getText())) {
      btn.textContent = done;
      setTimeout(() => { btn.textContent = label; }, 1500);
    }
  });
  return btn;
}
