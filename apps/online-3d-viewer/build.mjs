// Bundles the two Custom UI pages into static/ and copies the environment maps the viewer needs.
import { build } from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';

for (const page of ['viewer', 'config']) {
  const out = path.join('static', page);
  fs.mkdirSync(out, { recursive: true });
  await build({ entryPoints: [`src/${page}/main.js`], bundle: true, minify: true, format: 'iife', outfile: path.join(out, 'main.js'), logLevel: 'error' });
  for (const f of fs.readdirSync(`src/${page}`)) if (!f.endsWith('.js')) fs.copyFileSync(`src/${page}/${f}`, path.join(out, f));
}
const env = 'node_modules/online-3d-viewer/website/assets/envmaps/fishermans_bastion';
const dest = 'static/viewer/envmaps/fishermans_bastion';
fs.mkdirSync(dest, { recursive: true });
for (const f of fs.readdirSync(env)) fs.copyFileSync(path.join(env, f), path.join(dest, f));
console.log('built static/viewer and static/config');
