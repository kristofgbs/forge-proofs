import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as yaml from 'js-yaml';
import Ajv from 'ajv';

const schema = JSON.parse(fs.readFileSync(new URL('../node_modules/@forge/manifest/out/schema/manifest-schema.json', import.meta.url), 'utf8'));

test('manifest is valid against the Forge manifest schema', () => {
  const manifest = yaml.load(fs.readFileSync(new URL('../manifest.yml', import.meta.url), 'utf8'));
  const ajv = new Ajv({ allErrors: true, strict: false });
  const ok = ajv.validate(schema, manifest);
  assert.ok(ok, JSON.stringify(ajv.errors, null, 1));
});

test('asks for no permissions and no outside network', () => {
  const manifest = yaml.load(fs.readFileSync(new URL('../manifest.yml', import.meta.url), 'utf8'));
  assert.equal(manifest.permissions, undefined);
  assert.equal(manifest.remotes, undefined);
});

test('the schema check really catches a broken manifest', () => {
  const manifest = yaml.load(fs.readFileSync(new URL('../manifest.yml', import.meta.url), 'utf8'));
  delete manifest.modules.macro[0].title;
  manifest.modules.macro[0].colour = 'green';
  const ajv = new Ajv({ allErrors: true, strict: false });
  assert.equal(ajv.validate(schema, manifest), false);
});
