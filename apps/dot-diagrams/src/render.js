// Draws DOT text as SVG with Graphviz compiled to WebAssembly. Runs inside the Forge function, so no
// diagram text leaves Atlassian. The SVG is returned as a data URI for an <Image>: an SVG shown as an
// image cannot run scripts or follow links, so user-written DOT cannot inject anything into the page.
import { instance } from '@viz-js/viz';

export const MAX_CHARS = 20000;
let vizPromise;

function viz() {
  if (!vizPromise) vizPromise = instance();
  return vizPromise;
}

export async function renderDot(dot) {
  if (typeof dot !== 'string' || dot.trim() === '') {
    return { error: 'The diagram is empty. Edit the macro and add DOT text.' };
  }
  if (dot.length > MAX_CHARS) {
    return { error: `The diagram text is longer than ${MAX_CHARS} characters.` };
  }
  const v = await viz();
  const result = v.render(dot, { format: 'svg', engine: 'dot' });
  if (result.status !== 'success') {
    const msg = (result.errors || []).map((e) => e.message).join(' ').trim();
    return { error: `The DOT text could not be drawn. ${msg}`.trim() };
  }
  const svg = result.output;
  const size = /<svg[^>]*\swidth="([\d.]+)pt"[^>]*\sheight="([\d.]+)pt"/.exec(svg);
  return {
    src: 'data:image/svg+xml;base64,' + Buffer.from(svg, 'utf8').toString('base64'),
    width: size ? Math.round(parseFloat(size[1]) * 4 / 3) : undefined,
  };
}
