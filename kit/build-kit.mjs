// Mooza · generador del kit de recursos gráficos.
// Regenera la entrega completa: logo, plantillas (con y sin fondo), fondos, grillas, celdas, ilustraciones y poleras,
// cada una en SVG, PNG y PDF donde corresponde.
// Uso:  npm i playwright && node kit/build-kit.mjs
// Los datos de ejemplo salen de components/grid/poster.js y la geometría de tokens/grid.css
// (margen 6 %, medianil 1,2 %, siete columnas). Las plantillas usan la fuente Geist.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { chromium } = require('playwright');
const P = require(path.join(ROOT, 'components/grid/poster.js'));

// ── colores (tokens/colors.css) ──
const C = { azul: '#1b1444', amarillo: '#fcee21', naranja: '#fbb03b', blanco: '#ffffff', claro: '#f2f2f2' };
const GUIA = '#ff2d6f';

// ── grilla (tokens/grid.css) ──
const W = 1080, MP = 6, GP = 1.2;
const CQ = W / 100, M = MP * CQ, G = GP * CQ, COL = (W - 2 * M - 6 * G) / 7;
function geo(H, rows, story) {
  const mv = story ? M * 2.2 : M, rh = (H - 2 * mv - (rows - 1) * G) / rows;
  return { H, rows, mv, rh,
    x: c => M + (c - 1) * (COL + G), y: r => mv + (r - 1) * (rh + G),
    w: (a, b) => (b - a + 1) * COL + (b - a) * G, h: (a, b) => (b - a + 1) * rh + (b - a) * G };
}
const f2 = n => Math.round(n * 100) / 100;

// ── logo: rutas del logo horizontal oficial ──
const logoSrc = fs.readFileSync(path.join(ROOT, 'kit/logo/base/horizontal.svg'), 'utf8');
const ds = [...logoSrc.matchAll(/ d="([^"]+)"/g)].map(m => m[1]);
const LTEXT = ds.slice(0, 5), LISO = ds[5];
function logo(x, y, w, text, iso) {
  const s = w / 629.21;
  return `<g transform="translate(${f2(x)} ${f2(y)}) scale(${s.toFixed(5)})"><g fill="${text}">${LTEXT.map(d => `<path d="${d}"/>`).join('')}</g><path fill="${iso}" d="${LISO}"/></g>`;
}
const LH = w => w * 159.59 / 629.21;

const outBin = (rel, buf) => { const f = path.join(ROOT, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, buf); };
const out = (rel, text) => { const f = path.join(ROOT, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, text); };

// ── métricas de fuente, medidas en el navegador ──
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
const FONTS = 'https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap';
await page.setContent(`<link rel="stylesheet" href="${FONTS}"><body style="margin:0"><span style="font:600 40px 'Geist'">x</span></body>`, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
const MET = await page.evaluate(() => {
  const m = (font) => { const c = document.createElement('canvas').getContext('2d'); c.font = font; const t = c.measureText('Hxg'); return { asc: t.fontBoundingBoxAscent / 100, desc: t.fontBoundingBoxDescent / 100 }; };
  return { grot: m("500 100px 'Geist'") };
});

// baseline de una línea cuya caja empieza en `top` y mide `lh` px
const base = (top, lh, size, m) => top + (lh - (m.asc + m.desc) * size) / 2 + m.asc * size;
function text(o) {
  const fam = "'Geist', 'Helvetica Neue', Arial, sans-serif";
  const ls = o.ls ? ` letter-spacing="${o.ls}"` : '';
  const tx = o.t.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  return `<text x="${f2(o.x)}" y="${f2(o.y)}" font-family="${fam}" font-size="${f2(o.size)}" font-weight="${o.w}" fill="${o.fill}" text-anchor="${o.anchor || 'start'}"${ls}${o.upper ? ' style="text-transform:uppercase"' : ''}>${tx}</text>`;
}
const wrap = (H, body, bg, title, imagen) =>
  `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">\n<title>${title}</title>\n<style>@import url('${FONTS.replace(/&/g, '&amp;')}');</style>\n<rect width="${W}" height="${H}" fill="${bg}"/>\n${imagen ? `<image id="fondo-de-marca" href="data:image/jpeg;base64,${imagen.toString('base64')}" x="0" y="0" width="${W}" height="${H}" preserveAspectRatio="none"/>\n` : ''}${body}\n</svg>\n`;
const lines = s => s.split('<br>');

// ── plantillas ──
// Cada plantilla se monta con components/grid/poster.js a 1080 px de ancho y se lee del navegador:
// rectángulos, logo y cada línea de texto con su posición real. Así el kit no puede diverger del generador.
const lienzo = await browser.newPage({ viewport: { width: W, height: 1920 } });
await lienzo.goto('file://' + path.join(ROOT, 'components/grid/preview.html'), { waitUntil: 'networkidle' });
async function leer(tipo, formato) {
  return lienzo.evaluate(async ([tipo, f, W]) => {
    await document.fonts.ready;
    const host = document.createElement('div'); host.style.cssText = 'width:' + W + 'px;position:absolute;left:0;top:0'; document.body.appendChild(host);
    const el = document.createElement('div'); host.appendChild(el); MoozaPoster.mount(el, tipo, { fondo: false }, f);
    await new Promise(r => requestAnimationFrame(r));
    const box = el.getBoundingClientRect(), items = [];
    const rc = e => { const r = e.getBoundingClientRect(); return { x: r.left - box.left, y: r.top - box.top, w: r.width, h: r.height }; };
    const col = s => { const p = s.match(/rgba?\(([^)]+)\)/)[1].split(',').map(Number); return { hex: '#' + p.slice(0, 3).map(v => Math.round(v).toString(16).padStart(2, '0')).join(''), a: p.length > 3 ? p[3] : 1 }; };
    const bg = col(getComputedStyle(el).backgroundColor).hex;
    el.querySelectorAll('.mz-zona,.mz-zona-a,.mz-mitad,.mz-ph,.mz-mosaico,.mz-dc').forEach(e => {
      const c = col(getComputedStyle(e).backgroundColor);
      if (e.classList.contains('mz-dc') && !e.classList.contains('mz-dc-on')) items.push({ k: 'stroke', ...rc(e) });
      else if (c.a > 0) items.push({ k: 'rect', ...rc(e), fill: c.hex, zona: true });
    });
    el.querySelectorAll('.mz-hora-on span').forEach(e => { const r = rc(e), bw = parseFloat(getComputedStyle(e).borderBottomWidth); items.push({ k: 'rect', x: r.x, y: r.y + r.h - bw, w: r.w, h: bw, fill: '#fbb03b' }); });
    el.querySelectorAll('.mz-sep,.mz-ev').forEach(e => { const r = rc(e); items.push({ k: 'rect', x: r.x, y: r.y, w: r.w, h: 1, fill: '#86839b' }); });
    const lg = el.querySelector('.mz-logo');
    if (lg) { const cs = getComputedStyle(lg); items.push({ k: 'logo', ...rc(lg), text: col(cs.color).hex, iso: (() => { const t = document.createElement('i'); t.style.color = 'var(--mz-iso)'; lg.parentElement.appendChild(t); const h = col(getComputedStyle(t).color).hex; t.remove(); return h; })() }); }
    const ctx = document.createElement('canvas').getContext('2d');
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let n;
    while ((n = walker.nextNode())) {
      if (!n.textContent.trim() || n.parentElement.closest('svg')) continue;
      const pe = n.parentElement, cs = getComputedStyle(pe), c = col(cs.color), size = parseFloat(cs.fontSize);
      ctx.font = cs.fontWeight + ' ' + size + 'px ' + cs.fontFamily;
      const asc = ctx.measureText('x').fontBoundingBoxAscent, rg = document.createRange(), txt = n.textContent, lines = [];
      let cur = null;
      for (let i = 0; i < txt.length; i++) {
        rg.setStart(n, i); rg.setEnd(n, i + 1);
        const r = rg.getClientRects()[0]; if (!r) continue;
        if (cur && Math.abs(r.top - cur.top) < 3) { cur.s += txt[i]; cur.r = Math.max(cur.r, r.right); }
        else if (txt[i].trim()) { cur = { s: txt[i], top: r.top, l: r.left, r: r.right }; lines.push(cur); }
      }
      for (const L of lines) {
        const right = cs.textAlign === 'right';
        items.push({ k: 'text', t: L.s.trim(), x: (right ? L.r : L.l) - box.left, y: L.top - box.top + asc, anchor: right ? 'end' : 'start',
          size, w: cs.fontWeight, ls: cs.letterSpacing === 'normal' ? 0 : parseFloat(cs.letterSpacing),
          fill: c.hex, op: c.a * parseFloat(cs.opacity) });
      }
    }
    host.remove();
    return { H: box.height, bg, items };
  }, [tipo, formato, W]);
}
async function plantilla(tipo, formato, imagen) {
  const { H, bg, items } = await leer(tipo, formato), B = [];
  for (const i of items) {
    if (imagen && i.k === 'rect' && i.zona) continue;
    if (i.k === 'rect') B.push(`<rect x="${f2(i.x)}" y="${f2(i.y)}" width="${f2(i.w)}" height="${f2(i.h)}" fill="${i.fill}"/>`);
    else if (i.k === 'stroke') B.push(`<rect x="${f2(i.x + 1.25)}" y="${f2(i.y + 1.25)}" width="${f2(i.w - 2.5)}" height="${f2(i.h - 2.5)}" fill="none" stroke="${C.azul}" stroke-width="2.5"/>`);
    else if (i.k === 'logo') B.push(logo(i.x, i.y, i.w, i.text, i.iso));
    else B.push(text({ x: i.x, y: i.y, size: i.size, w: i.w, fam: 'grot', fill: i.op < 1 ? `rgba(${[1, 3, 5].map(k => parseInt(i.fill.slice(k, k + 2), 16)).join(',')},${f2(i.op)})` : i.fill, ls: i.ls ? f2(i.ls) : 0, anchor: i.anchor, t: i.t }));
  }
  return { H, svg: wrap(H, B.join('\n'), bg, 'Mooza · cartel ' + tipo + (formato ? ' ' + formato : '') + (imagen ? ' con fondo de marca' : ''), imagen) };
}

// ── grillas (capa de guías) ──
function grilla(H, rows, story, name, label) {
  const g = geo(H, rows, story), B = [];
  B.push(`<rect x="${f2(M)}" y="${f2(g.mv)}" width="${f2(W - 2 * M)}" height="${f2(H - 2 * g.mv)}" fill="none" stroke="${GUIA}" stroke-width="2" stroke-dasharray="10 8"/>`);
  for (let r = 1; r <= rows; r++) for (let c = 1; c <= 7; c++)
    B.push(`<rect x="${f2(g.x(c))}" y="${f2(g.y(r))}" width="${f2(COL)}" height="${f2(g.rh)}" fill="${GUIA}" fill-opacity=".08" stroke="${GUIA}" stroke-opacity=".6" stroke-width="1.5"/>`);
  out(`kit/grillas/${name}.svg`, `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">\n<title>${label}. Margen 6 %, medianil 1,2 %, siete columnas. Usar como capa de guías.</title>\n${B.join('\n')}\n</svg>\n`);
}
grilla(1350, 9, false, 'grilla-4x5-9filas', 'Grilla 4:5, 9 filas');
grilla(1920, 16, true, 'grilla-9x16-16filas', 'Grilla 9:16, 16 filas');
grilla(1080 * 420 / 297, 11, false, 'grilla-a3-11filas', 'Grilla A3 vertical, 11 filas');
grilla(1080, 8, false, 'grilla-1x1-8filas', 'Grilla 1:1, 8 filas');
grilla(1080 * 9 / 16, 4, false, 'grilla-16x9-4filas', 'Grilla 16:9, 4 filas');

// ── celdas ──
for (const [n, v] of Object.entries(C))
  out(`kit/celdas/celda-${n}.svg`, `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><title>Celda ${n}</title><rect width="100" height="100" fill="${v}"/></svg>\n`);
for (const n of ['azul', 'blanco', 'amarillo'])
  out(`kit/celdas/celda-contorno-${n}.svg`, `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><title>Celda de contorno ${n}</title><rect x="1" y="1" width="98" height="98" fill="none" stroke="${C[n]}" stroke-width="2"/></svg>\n`);

// ── foto de ejemplo ──
out('kit/fotos/foto-placeholder.svg', `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><title>Marcador de foto de evento</title><rect width="100" height="100" fill="${C.azul}"/><text x="6" y="94" font-family="'Geist',Arial,sans-serif" font-size="5" font-weight="500" fill="rgba(255,255,255,.7)">foto del evento</text></svg>\n`);

// ── exportación a SVG, PNG y PDF ──
const WEBFONT = `<link rel="stylesheet" href="${FONTS}">`;
const dataUri = (rel, mime) => `data:${mime};base64,${fs.readFileSync(path.join(ROOT, rel)).toString('base64')}`;
// Abre html en un lienzo de w × h px y guarda PNG, JPG y PDF según se pida. Devuelve el JPG si se pidió.
async function exportar(html, w, h, o = {}) {
  const pg = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: o.escala || 1 });
  await pg.setContent(`${WEBFONT}<style>@page{size:${w}px ${h}px;margin:0}html,body{margin:0;padding:0;background:${o.transparente ? 'transparent' : (o.fondo || '#fff')}}</style><body>${html}</body>`, { waitUntil: 'networkidle' });
  await pg.evaluate(() => document.fonts.ready);
  await pg.waitForTimeout(300);
  const clip = { x: 0, y: 0, width: w, height: h };
  let jpg = null;
  if (o.png) outBin(o.png, await pg.screenshot({ clip, omitBackground: !!o.transparente }));
  if (o.jpg || o.devolverJpg) { jpg = await pg.screenshot({ clip, type: 'jpeg', quality: 90 }); if (o.jpg) outBin(o.jpg, jpg); }
  if (o.pdf) outBin(o.pdf, await pg.pdf({ width: w + 'px', height: h + 'px', printBackground: true, preferCSSPageSize: true, pageRanges: '1' }));
  await pg.close();
  return jpg;
}
const sinXml = s => s.replace(/<\?xml[^>]*>\s*/, '');
const PREVIEW = 'file://' + path.join(ROOT, 'components/grid/preview.html');

// Capa de fondo de una plantilla: la pieza montada con el fondo de marca y sin texto ni fotos (zonas, formas y grano).
const lienzo2 = await browser.newPage({ viewport: { width: W, height: 1920 }, deviceScaleFactor: 2 });
await lienzo2.goto(PREVIEW, { waitUntil: 'networkidle' });
async function montarPieza(pg, tipo, f, solo) {
  await pg.evaluate(async ([tipo, f, W, solo]) => {
    await document.fonts.ready;
    const v = document.getElementById('mzx'); if (v) v.remove();
    const host = document.createElement('div'); host.id = 'mzx'; host.style.cssText = 'width:' + W + 'px;position:absolute;left:0;top:0;z-index:99';
    if (solo) { const st = document.createElement('style'); st.textContent = '#mzx .mz-grid>*:not(.mz-fondo):not(.mz-zona):not(.mz-zona-a):not(.mz-mitad):not(.mz-ph):not(.mz-mosaico){visibility:hidden}#mzx .mz-ph>*,#mzx .mz-mosaico>*,#mzx .mz-mitad>*,#mzx .mz-zona-a>*,#mzx .mz-zona>*{visibility:hidden}#mzx .mz-overlay{display:none}'; host.appendChild(st); }
    const el = document.createElement('div'); host.appendChild(el); document.body.appendChild(host);
    MoozaPoster.mount(el, tipo, {}, f);
    await new Promise(r => setTimeout(r, 400));
  }, [tipo, f, W, solo]);
  return pg.$('#mzx > div');
}

// ── plantillas: sin fondo (planas, editables) y con fondo de marca ──
const LISTA = [], HOJA = [];
const SUF = { '4x5': '', a3: '-a3', '1x1': '-1x1', '16x9': '-16x9', '9x16': '-9x16' };
for (const [tipo, fs_] of Object.entries(P.ROWS)) { if (tipo === 'musa') continue; for (const f of Object.keys(fs_)) LISTA.push([tipo.startsWith('story') ? tipo : tipo + SUF[f], tipo, f]); }
fs.rmSync(path.join(ROOT, 'kit/plantillas'), { recursive: true, force: true });
for (const [nombre, tipo, f] of LISTA) {
  const { H, svg } = await plantilla(tipo, f);
  const alto = Math.ceil(H);
  out(`kit/plantillas/sin-fondo/svg/${nombre}.svg`, svg);
  await exportar(sinXml(svg), W, alto, { png: `kit/plantillas/sin-fondo/png/${nombre}.png`, pdf: `kit/plantillas/sin-fondo/pdf/${nombre}.pdf` });
  HOJA.push({ nombre, tipo, f, H, W: f === '16x9' ? 1920 : 1080, svg });
  // con fondo de marca: la capa de fondo (JPG a doble resolución) va incrustada detrás del texto, que sigue editable
  lienzo2.setDefaultTimeout(60000);
  const capa = await (await montarPieza(lienzo2, tipo, f, true)).screenshot({ type: 'jpeg', quality: 90 });
  const cf = await plantilla(tipo, f, capa);
  out(`kit/plantillas/con-fondo/svg/${nombre}.svg`, cf.svg);
  await exportar(sinXml(cf.svg), W, alto, { pdf: `kit/plantillas/con-fondo/pdf/${nombre}.pdf` });
  // PNG con fondo: la pieza completa tal como la dibuja el generador, con grano también sobre el texto
  const pg = await browser.newPage({ viewport: { width: W, height: 1920 } });
  await pg.goto(PREVIEW, { waitUntil: 'networkidle' });
  outBin(`kit/plantillas/con-fondo/png/${nombre}.png`, await (await montarPieza(pg, tipo, f, false)).screenshot({ type: 'png' }));
  await pg.close();
}

// ── un solo archivo con todas las plantillas, para trabajar en Illustrator, Figma o Inkscape ──
// Una fila por formato; cada plantilla es un grupo con id (por ejemplo "titular-4x5") y su rótulo encima.
const FILAS = [['4x5', 'Instagram 4:5'], ['a3', 'A3 vertical'], ['1x1', 'Cuadrado 1:1'], ['16x9', 'Horizontal 16:9'], ['9x16', 'Story 9:16']];
const GAP = 140, ROT = 96, MARG = 100;
let y = MARG, ancho = 0, G_ = [];
for (const [f, rotulo] of FILAS) {
  const fila = HOJA.filter(h => h.f === f); if (!fila.length) continue;
  const alto = Math.max(...fila.map(h => h.H));
  G_.push(`<text x="${MARG}" y="${y + 34}" font-family="'Geist', 'Helvetica Neue', Arial, sans-serif" font-size="34" font-weight="600" fill="${C.azul}">${rotulo}</text>`);
  let x = MARG;
  for (const h of fila) {
    const cuerpo = h.svg.slice(h.svg.indexOf('</style>') + 8, h.svg.lastIndexOf('</svg>')).trim();
    G_.push(`<g id="${h.tipo}-${f}" transform="translate(${x} ${f2(y + ROT)})">\n<text x="0" y="-14" font-family="'Geist', 'Helvetica Neue', Arial, sans-serif" font-size="22" font-weight="500" fill="${C.azul}" fill-opacity=".6">${h.tipo} · ${f}</text>\n${cuerpo}\n</g>`);
    x += h.W + GAP;
  }
  ancho = Math.max(ancho, x - GAP + MARG);
  y += ROT + alto + GAP;
}
const hojaSvg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${ancho} ${f2(y - GAP + MARG)}" width="${ancho}" height="${f2(y - GAP + MARG)}">\n<title>Mooza · todas las plantillas</title>\n<style>@import url('${FONTS.replace(/&/g, '&amp;')}');</style>\n<rect width="${ancho}" height="${f2(y - GAP + MARG)}" fill="#e6e6e6"/>\n${G_.join('\n')}\n</svg>\n`;
out('kit/plantillas/mooza-carteles.svg', hojaSvg);
{
  const pg = await browser.newPage({ viewport: { width: 2400, height: 1200 } });
  await pg.setContent(`<link rel="stylesheet" href="${FONTS}"><body style="margin:0;background:#e6e6e6"><img id="i" style="width:2400px;display:block" src="data:image/svg+xml;base64,${Buffer.from(hojaSvg).toString('base64')}">`, { waitUntil: 'networkidle' });
  await pg.waitForTimeout(500);
  await pg.evaluate(() => document.fonts.ready);
  const box = await (await pg.$('#i')).boundingBox();
  await pg.setViewportSize({ width: 2400, height: Math.ceil(box.height) });
  await pg.screenshot({ path: path.join(ROOT, 'kit/plantillas/mooza-carteles.png'), clip: { x: 0, y: 0, width: 2400, height: Math.ceil(box.height) } });
  await pg.close();
}

// ── logo: horizontal, vertical e ícono en azul, blanco, amarillo y naranjo (SVG, PNG sin fondo y PDF) y sobre cada fondo ──
const LOGOS = { horizontal: [629.21, 159.59, 2400], vertical: [262.85, 258.75, 1600], iso: [168.34, 163.27, 1200] };
const TINTAS = { azul: C.azul, blanco: C.blanco, amarillo: C.amarillo, naranja: C.naranja };
const FONDOS_LOGO = [['claro', C.claro, 'azul'], ['azul', C.azul, 'blanco'], ['amarillo', C.amarillo, 'azul'], ['naranja', C.naranja, 'azul']];
for (const [nombre, [lw, lh, pw]] of Object.entries(LOGOS)) {
  const dsL = [...fs.readFileSync(path.join(ROOT, `kit/logo/base/${nombre}.svg`), 'utf8').matchAll(/ d="([^"]+)"/g)].map(m => m[1]);
  const svgL = (color, extra = '') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${lw} ${lh}" fill="${color}"${extra}>${dsL.map(d => `<path d="${d}"/>`).join('')}</svg>`;
  for (const [tn, tc] of Object.entries(TINTAS)) {
    out(`kit/logo/svg/${nombre}-${tn}.svg`, `<?xml version="1.0" encoding="UTF-8"?>\n${svgL(tc).replace('<svg ', `<svg `).replace('>', `><title>Mooza, ${nombre} ${tn}</title>`)}\n`);
    const ph = Math.round(pw * lh / lw);
    await exportar(svgL(tc, ` width="${pw}" height="${ph}" style="display:block"`), pw, ph, { png: `kit/logo/png/${nombre}-${tn}.png`, pdf: `kit/logo/pdf/${nombre}-${tn}.pdf`, transparente: true });
  }
  for (const [fn, fc, tinta] of FONDOS_LOGO) {
    const cw = 1600, ch = 1000, lwid = Math.round(cw * (nombre === 'horizontal' ? .5 : nombre === 'vertical' ? .22 : .16)), lhei = Math.round(lwid * lh / lw);
    const html = `<div style="width:${cw}px;height:${ch}px;background:${fc};display:grid;place-items:center">${svgL(TINTAS[tinta], ` width="${lwid}" height="${lhei}"`)}</div>`;
    await exportar(html, cw, ch, { png: `kit/logo/sobre-fondo/png/${nombre}-sobre-${fn}.png`, pdf: `kit/logo/sobre-fondo/pdf/${nombre}-sobre-${fn}.pdf`, fondo: fc });
  }
}

// ── fondos de marca solos: cada color de base y cada formato (SVG con las formas, PNG y PDF con grano y borde suave) ──
const TONO = { claro: '#e3e2e6', azul: '#322b57', amarillo: '#fce226', naranja: '#fbc134' };
const BASES = { claro: C.claro, azul: C.azul, amarillo: C.amarillo, naranja: C.naranja };
const SIMBOLOS = {};
for (const id of ['mz-oo', 'mz-iso']) { const m = P.sprite().match(new RegExp(`<symbol id="${id}"[^>]*viewBox="([^"]+)">([\\s\\S]*?)</symbol>`)); SIMBOLOS[id] = { vb: m[1], body: m[2].replace(/class="[^"]*"/g, '') }; }
const FORMATOS_FONDO = { '4x5': '4x5', a3: 'a3', '1x1': '1x1', '9x16': '9x16', '16x9': '16x9' };
function fondoSvg(base, f, semilla, ancho) {
  const [aw, ah] = P.FORMATOS[f].ar.split('/').map(Number), Hc = 100 * ah / aw, h = Math.round(ancho * ah / aw);
  const usos = P.fondoLogo(f, semilla).map(t => `<use href="#${t.id}" x="${f2(t.x)}" y="${f2(t.y)}" width="${f2(t.w)}" height="${f2(t.h)}" transform="rotate(${t.rot} ${f2(t.tx)} ${f2(t.ty)})"/>`).join('');
  const defs = Object.entries(SIMBOLOS).map(([id, s]) => `<symbol id="${id}" viewBox="${s.vb}">${s.body}</symbol>`).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 ${f2(Hc)}" width="${ancho}" height="${h}"><title>Fondo de marca ${base} ${f}</title><defs>${defs}<filter id="suave" filterUnits="userSpaceOnUse" x="-10" y="-10" width="120" height="${f2(Hc + 20)}"><feGaussianBlur stdDeviation="1.8"/></filter></defs><rect width="100" height="${f2(Hc)}" fill="${BASES[base]}"/><g filter="url(#suave)" fill="${TONO[base]}">${usos}</g></svg>`;
  return { svg, h };
}
const GRANO = `<svg style="position:absolute;inset:0;width:100%;height:100%;mix-blend-mode:overlay;opacity:.34"><filter id="g" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="5" stitchTiles="stitch"/><feColorMatrix values="1 0 0 0 0  1 0 0 0 0  1 0 0 0 0  0 0 0 0 1"/><feComponentTransfer><feFuncR type="linear" slope="1.7" intercept="-.35"/><feFuncG type="linear" slope="1.7" intercept="-.35"/><feFuncB type="linear" slope="1.7" intercept="-.35"/></feComponentTransfer></filter><rect width="100%" height="100%" filter="url(#g)"/></svg>`;
for (const base of Object.keys(BASES)) for (const f of Object.keys(FORMATOS_FONDO)) {
  const nombre = `fondo-${base}-${f}`, { svg, h } = fondoSvg(base, f, 1, 1080);
  out(`kit/fondos/svg/${nombre}.svg`, `<?xml version="1.0" encoding="UTF-8"?>\n${svg}\n`);
  const html = `<div style="position:relative;width:1080px;height:${h}px">${svg.replace(/ width="1080" height="\d+"/, ' width="100%" height="100%"')}${GRANO}</div>`;
  const jpg = await exportar(html, 1080, h, { png: `kit/fondos/png/${nombre}.png`, devolverJpg: true });
  await exportar(`<img src="data:image/jpeg;base64,${jpg.toString('base64')}" style="display:block;width:1080px;height:${h}px">`, 1080, h, { pdf: `kit/fondos/pdf/${nombre}.pdf` });
}
outBin('kit/fondos/grano.png', fs.readFileSync(path.join(ROOT, 'caso-de-estudio/img/grano.png')));

// ── ilustraciones: las cuatro musas, sin fondo (PNG y PDF) y en lámina con el logo y la web (PNG y PDF) ──
const MUSAS = [['Euterpe', 'euterpe', ['gris', 'amarillo'], 'v', 16.31, 8.16], ['Talia', 'talia', ['naranja', 'gris'], 'v', 12.89, 6.99], ['Terpsicore', 'terpsicore', ['gris', 'amarillo'], 'h', 12.73, 6.81], ['Caliope', 'caliope', ['naranja', 'gris'], 'h', 12.68, 6.75]];
for (const [arch, k, colores, corte, x, y] of MUSAS) {
  const src = `kit/ilustraciones/sin-fondo/png/${arch}.png`;
  await exportar(`<img src="${dataUri(src, 'image/png')}" style="display:block;width:750px;height:1125px">`, 750, 1125, { pdf: `kit/ilustraciones/sin-fondo/pdf/${arch}.pdf`, transparente: true });
  const pg = await browser.newPage({ viewport: { width: 612, height: 792 }, deviceScaleFactor: 2 });
  await pg.goto(PREVIEW, { waitUntil: 'networkidle' });
  await pg.evaluate(async ([k, src, colores, corte, x, y, URL_]) => {
    await document.fonts.ready;
    const host = document.createElement('div'); host.id = 'mzl'; host.style.cssText = 'width:612px;position:absolute;left:0;top:0;z-index:99';
    const el = document.createElement('div'); host.appendChild(el); document.body.appendChild(host);
    MoozaPoster.mount(el, 'musa', { musa: { src: URL_ + src, colores, corte, x, y, alt: k } }, 'carta');
    await new Promise(r => setTimeout(r, 600));
  }, [k, src, colores, corte, x, y, 'file://' + ROOT + '/']);
  const el = await pg.$('#mzl > div');
  const png = await el.screenshot({ type: 'png' }), jpgL = await el.screenshot({ type: 'jpeg', quality: 92 });
  outBin(`kit/ilustraciones/laminas/png/${k}.png`, png);
  await exportar(`<img src="data:image/jpeg;base64,${jpgL.toString('base64')}" style="display:block;width:612px;height:792px">`, 612, 792, { pdf: `kit/ilustraciones/laminas/pdf/${k}.pdf` });
  await pg.close();
}

// ── poleras: PDF de cada capa de impresión ──
for (const f of fs.readdirSync(path.join(ROOT, 'kit/poleras/estampas')).filter(n => n.endsWith('.png'))) {
  await exportar(`<img src="${dataUri('kit/poleras/estampas/' + f, 'image/png')}" style="display:block;width:900px;height:1200px">`, 900, 1200, { pdf: `kit/poleras/estampas/pdf/${f.replace('.png', '.pdf')}`, transparente: true });
}

await browser.close();
console.log('Kit generado en', path.join(ROOT, 'kit'), LISTA.length, 'plantillas');
