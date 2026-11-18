import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderDot, MAX_CHARS } from '../src/render.js';

test('draws a valid graph as an SVG data URI', async () => {
  const r = await renderDot('digraph G { A -> B }');
  assert.ok(r.src.startsWith('data:image/svg+xml;base64,'));
  const svg = Buffer.from(r.src.split(',')[1], 'base64').toString('utf8');
  assert.match(svg, /<svg/);
  assert.match(svg, />A</);
  assert.ok(r.width > 0);
});

test('reports a syntax error instead of throwing', async () => {
  const r = await renderDot('digraph G { A -> }');
  assert.ok(r.error);
  assert.equal(r.src, undefined);
});

test('refuses empty and oversized input', async () => {
  assert.ok((await renderDot('')).error);
  assert.ok((await renderDot(undefined)).error);
  assert.ok((await renderDot('a'.repeat(MAX_CHARS + 1))).error);
});

test('same input gives the same picture', async () => {
  const a = await renderDot('graph { x -- y -- z }');
  const b = await renderDot('graph { x -- y -- z }');
  assert.equal(a.src, b.src);
});
