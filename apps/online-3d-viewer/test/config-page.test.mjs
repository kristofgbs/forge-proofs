import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { build } from 'esbuild';
import { JSDOM } from 'jsdom';

test('config page lists 3D attachments and saves the chosen file', async () => {
  const out = await build({ entryPoints: ['src/config/main.js'], bundle: true, write: false, format: 'esm',
    external: ['@forge/bridge'], logLevel: 'error' });
  const html = fs.readFileSync('src/config/index.html', 'utf8').replace('<script src="main.js"></script>', '');
  const dom = new JSDOM(html, { runScripts: 'outside-only' });
  const g = globalThis;
  Object.assign(g, { document: dom.window.document, Option: dom.window.Option, FormData: dom.window.FormData });
  const fake = await import('./fake/bridge.js');
  fake.state.attachments = [{ title: 'engine.glb' }, { title: 'notes.docx' }, { title: 'body.stl' }];
  fake.state.config = { file1: 'engine.glb' };
  const fakeUrl = new URL('./fake/bridge.js', import.meta.url).href;
  const code = out.outputFiles[0].text.replace(/from\s*"@forge\/bridge"/g, `from "${fakeUrl}"`);
  const file = new URL('./tmp-config.mjs', import.meta.url);
  fs.writeFileSync(file, code);
  await import(file.href + '?t=' + Date.now());
  await new Promise((r) => setTimeout(r, 20));
  const sel = dom.window.document.getElementById('file1');
  assert.deepEqual([...sel.options].map((o) => o.value), ['', 'body.stl', 'engine.glb']);
  assert.equal(sel.value, 'engine.glb');
  dom.window.document.getElementById('file2').value = 'body.stl';
  dom.window.document.getElementById('save').click();
  await new Promise((r) => setTimeout(r, 20));
  assert.equal(fake.calls.submitted.config.file1, 'engine.glb');
  assert.equal(fake.calls.submitted.config.file2, 'body.stl');
  assert.equal(fake.calls.submitted.config.canvasheight, '400px');
  fs.unlinkSync(file);
});
