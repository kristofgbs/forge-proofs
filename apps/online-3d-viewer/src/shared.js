// Pure helpers shared by the viewer and the config page. Kept free of browser and Forge APIs so they
// can be tested in Node. Parameter names are the Connect macro's, so saved macros keep their settings.
export const FILE_PARAMS = ['file1', 'file2', 'file3', 'file4', 'file5'];
export const DEFAULTS = { canvaswidth: 'auto', canvasheight: '400px', backgroundcolor: 'ffffff', defaultcolor: 'eeeeee' };
export const MODEL_EXTENSIONS = ['obj', 'mtl', '3ds', 'stl', 'ply', 'gltf', 'glb', 'bin', 'off', '3dm', 'fbx', 'dae',
  'wrl', '3mf', 'ifc', 'brep', 'step', 'stp', 'iges', 'igs', 'fcstd', 'bim', 'png', 'jpg', 'jpeg', 'bmp', 'tga', 'gif'];

// Connect stored each parameter as a plain value; a migrated macro may hand it over as { value }.
export function plain(v) {
  if (v && typeof v === 'object' && 'value' in v) return v.value;
  return v;
}

export function readParams(config) {
  const c = config || {};
  const names = FILE_PARAMS.map((p) => plain(c[p])).filter((v) => typeof v === 'string' && v.trim() !== '').map((v) => v.trim());
  const pick = (k) => {
    const v = plain(c[k]);
    return typeof v === 'string' && v.trim() !== '' ? v.trim() : DEFAULTS[k];
  };
  return {
    modelFileNames: names,
    canvasWidth: cssSize(pick('canvaswidth'), DEFAULTS.canvaswidth),
    canvasHeight: cssSize(pick('canvasheight'), DEFAULTS.canvasheight),
    // An empty colour means the viewer's own default, as in the Connect app (transparent background, grey model).
    backgroundColor: hex(plain(c.backgroundcolor)),
    defaultColor: hex(plain(c.defaultcolor)),
  };
}

// Only plain sizes reach the page style: a number with px or %, or auto.
export function cssSize(v, fallback) {
  if (/^(auto|\d{1,4}(\.\d+)?(px|%))$/.test(v)) return v;
  if (/^\d{1,4}$/.test(v)) return v + 'px';
  return fallback;
}

export function hex(v) {
  const s = String(v || '').replace(/^#/, '');
  return /^[0-9a-fA-F]{6}$/.test(s) ? s.toLowerCase() : '';
}

// Same matching as the Connect app: attachments of the page whose title equals a chosen file name.
// Pages and blog posts keep their attachments under different API paths.
export function attachmentsPath(content) {
  const kind = content && content.type === 'blogpost' ? 'blogposts' : 'pages';
  return `/wiki/api/v2/${kind}/${encodeURIComponent(content.id)}/attachments?limit=250`;
}

export function matchAttachments(results, names) {
  const out = [];
  for (const name of names) {
    const a = (results || []).find((r) => r.title === name);
    if (a) out.push({ name: a.title, id: a.id, download: a.downloadLink || (a._links && a._links.download) });
  }
  return out;
}

export function isModelFile(title) {
  const ext = String(title).split('.').pop().toLowerCase();
  return MODEL_EXTENSIONS.includes(ext);
}

export function toConfig(form) {
  const cfg = {};
  for (const p of FILE_PARAMS) if (form[p]) cfg[p] = form[p];
  for (const k of Object.keys(DEFAULTS)) if (form[k]) cfg[k] = form[k];
  return cfg;
}
