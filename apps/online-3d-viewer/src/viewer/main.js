import { view, requestConfluence } from '@forge/bridge';
import * as OV from 'online-3d-viewer';
import { readParams, matchAttachments, attachmentsPath } from '../shared.js';

async function listAttachments(content) {
  const all = [];
  let path = attachmentsPath(content);
  while (path) {
    const res = await requestConfluence(path);
    if (!res.ok) throw new Error('attachments ' + res.status);
    const body = await res.json();
    all.push(...(body.results || []));
    const next = body._links && body._links.next;
    path = next ? (next.startsWith('/wiki') ? next : '/wiki' + next) : null;
  }
  return all;
}

async function download(att) {
  const link = att.download.startsWith('/wiki') ? att.download : '/wiki' + att.download;
  const res = await requestConfluence(link);
  if (!res.ok) throw new Error('download ' + res.status);
  return new File([await res.blob()], att.name);
}

function message(div, text) {
  div.innerHTML = '';
  const box = document.createElement('div');
  box.className = 'message';
  box.textContent = text;
  div.appendChild(box);
}

async function start() {
  const ctx = await view.getContext();
  const params = readParams(ctx.extension && ctx.extension.config);
  const div = document.getElementById('content');
  div.style.width = params.canvasWidth;
  div.style.height = params.canvasHeight;
  if (params.modelFileNames.length === 0) {
    message(div, 'Edit the macro and choose a 3D file attached to this page.');
    return;
  }
  message(div, 'Downloading attachments...');
  try {
    const atts = matchAttachments(await listAttachments(ctx.extension.content), params.modelFileNames);
    if (atts.length === 0) throw new Error('none');
    const files = await Promise.all(atts.map(download));
    div.innerHTML = '';
    const viewer = new OV.EmbeddedViewer(div, {
      backgroundColor: params.backgroundColor ? OV.HexStringToRGBAColor(params.backgroundColor) : new OV.RGBAColor(255, 255, 255, 0),
      defaultColor: params.defaultColor ? OV.HexStringToRGBColor(params.defaultColor) : new OV.RGBColor(200, 200, 200),
      environmentSettings: new OV.EnvironmentSettings(
        ['posx', 'negx', 'posy', 'negy', 'posz', 'negz'].map((f) => `envmaps/fishermans_bastion/${f}.jpg`), false),
    });
    const scale = window.devicePixelRatio || 1;
    viewer.canvas.width = div.clientWidth * scale;
    viewer.canvas.height = div.clientHeight * scale;
    viewer.LoadModelFromFileList(files);
  } catch (e) {
    message(div, 'Failed to download attachments.');
  }
}

start();
