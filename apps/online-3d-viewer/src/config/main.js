import { view, requestConfluence } from '@forge/bridge';
import { FILE_PARAMS, DEFAULTS, readParams, isModelFile, toConfig, plain, attachmentsPath } from '../shared.js';

const LABELS = { file1: 'Main model file', file2: 'Additional model file 1', file3: 'Additional model file 2',
  file4: 'Additional model file 3', file5: 'Additional model file 4', canvaswidth: 'Width', canvasheight: 'Height',
  backgroundcolor: 'Background color (hex)', defaultcolor: 'Default color (hex)' };

async function attachments(content) {
  if (!content || !content.id) return [];
  const titles = [];
  let path = attachmentsPath(content);
  while (path) {
    const res = await requestConfluence(path);
    if (!res.ok) break;
    const body = await res.json();
    titles.push(...(body.results || []).map((a) => a.title));
    const next = body._links && body._links.next;
    path = next ? (next.startsWith('/wiki') ? next : '/wiki' + next) : null;
  }
  return titles.filter(isModelFile).sort();
}

function field(form, id, input) {
  const label = document.createElement('label');
  label.htmlFor = id;
  label.textContent = LABELS[id];
  input.id = id;
  input.name = id;
  form.appendChild(label);
  form.appendChild(input);
}

async function start() {
  const ctx = await view.getContext();
  const current = (ctx.extension && ctx.extension.config) || {};
  const content = ctx.extension && ctx.extension.content;
  const names = await attachments(content);
  const form = document.getElementById('form');
  for (const p of FILE_PARAMS) {
    const sel = document.createElement('select');
    sel.add(new Option(p === 'file1' ? 'Choose a file' : 'None', ''));
    for (const n of names) sel.add(new Option(n, n));
    const now = readParams({ [p]: current[p] }).modelFileNames[0] || '';
    if (now && !names.includes(now)) sel.add(new Option(now, now));
    sel.value = now;
    field(form, p, sel);
  }
  for (const k of Object.keys(DEFAULTS)) {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = plain(current[k]) || DEFAULTS[k];
    field(form, k, input);
  }
  if (names.length === 0) {
    document.getElementById('hint').textContent = 'No 3D files are attached to this page yet. Attach one, then edit the macro again.';
  }
  document.getElementById('save').addEventListener('click', async () => {
    const data = Object.fromEntries(new FormData(form).entries());
    if (!data.file1) {
      document.getElementById('hint').textContent = 'Choose the main model file.';
      return;
    }
    await view.submit({ config: toConfig(data) });
  });
}

start();
