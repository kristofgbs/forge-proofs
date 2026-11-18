import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readParams, matchAttachments, cssSize, hex, toConfig, isModelFile } from '../src/shared.js';

test('reads Connect-style parameters, plain or wrapped in value', () => {
  const p = readParams({ file1: 'engine.gltf', file2: { value: 'engine.bin' }, file3: '', canvasheight: '300' });
  assert.deepEqual(p.modelFileNames, ['engine.gltf', 'engine.bin']);
  assert.equal(p.canvasHeight, '300px');
  assert.equal(p.canvasWidth, 'auto');
  assert.equal(p.backgroundColor, '');
  assert.equal(readParams({ backgroundcolor: 'FFAA00' }).backgroundColor, 'ffaa00');
});

test('only plain sizes and colours reach the page', () => {
  assert.equal(cssSize('400px;background:url(x)', 'auto'), 'auto');
  assert.equal(cssSize('50%', 'auto'), '50%');
  assert.equal(hex('#ABCDEF'), 'abcdef');
  assert.equal(hex('red'), '');
});

test('matches attachments by title like the Connect app did', () => {
  const r = matchAttachments([{ title: 'a.obj', id: '1', downloadLink: '/download/a.obj' }, { title: 'b.mtl', id: '2', _links: { download: '/download/b.mtl' } }], ['b.mtl', 'a.obj', 'c.stl']);
  assert.deepEqual(r.map((x) => x.name), ['b.mtl', 'a.obj']);
  assert.equal(r[0].download, '/download/b.mtl');
});

test('config keeps only known keys and drops empty ones', () => {
  assert.deepEqual(toConfig({ file1: 'a.glb', file2: '', canvaswidth: 'auto', evil: 'x' }), { file1: 'a.glb', canvaswidth: 'auto' });
  assert.ok(isModelFile('Part.STEP'));
  assert.ok(!isModelFile('notes.docx'));
});

test('blog posts use their own attachments path', async () => {
  const { attachmentsPath } = await import('../src/shared.js');
  assert.match(attachmentsPath({ id: '9', type: 'blogpost' }), /blogposts\/9\/attachments/);
  assert.match(attachmentsPath({ id: '9', type: 'page' }), /pages\/9\/attachments/);
});
