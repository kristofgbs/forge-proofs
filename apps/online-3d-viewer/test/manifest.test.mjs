import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import * as yaml from 'js-yaml';
import Ajv from 'ajv';

const schema = JSON.parse(fs.readFileSync('node_modules/@forge/manifest/out/schema/manifest-schema.json', 'utf8'));
const manifest = yaml.load(fs.readFileSync('manifest.yml', 'utf8'));

test('manifest is valid against the Forge schema', () => {
  const ajv = new Ajv({ allErrors: true, strict: false });
  assert.ok(ajv.validate(schema, manifest), JSON.stringify(ajv.errors));
});

test('keeps the Connect app key and macro key, so the listing and saved macros carry over', () => {
  const d = JSON.parse(fs.readFileSync('test/connect-descriptor.json', 'utf8'));
  assert.equal(manifest.app.connect.key, d.key);
  assert.equal(manifest.modules.macro[0].key, d.modules.dynamicContentMacros[0].key);
});

test("Atlassian's checks: fully on Forge, and no admin approval for the upgrade", () => {
  const bin = 'node_modules/.bin/connect-to-forge';
  execFileSync(bin, ['adoption-status', '-m', 'manifest.yml', '--strict', '--json'], { stdio: 'pipe' });
  const out = execFileSync(bin, ['check-upgrade', '-d', 'test/connect-descriptor.json', '-t', 'confluence', '-m', 'manifest.yml', '--json'], { encoding: 'utf8' });
  const r = JSON.parse(out.slice(out.indexOf('{')));
  assert.equal(r.requiresAdminApproval, false);
});

test('every parameter of the Connect macro is handled by the new config page', () => {
  const d = JSON.parse(fs.readFileSync('test/connect-descriptor.json', 'utf8'));
  const ids = d.modules.dynamicContentMacros[0].parameters.map((p) => p.identifier);
  const src = fs.readFileSync('src/shared.js', 'utf8');
  for (const id of ids) assert.match(src, new RegExp('\\b' + id + '\\b'), id);
});
