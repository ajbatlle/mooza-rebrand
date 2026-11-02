// Mooza · auditoría de colisiones de los carteles.
// Monta cada diseño en cada formato con cinco combinaciones de margen y medianil, mide la tinta real de los textos
// y avisa si el logo choca con algo, se sale del margen o queda desalineado con la fecha, y si un texto se sale
// de su celda o toca una foto, un bloque o una celda. Cada diseño se prueba con los datos de ejemplo y con datos de producción
// exigentes (títulos largos, campos vacíos, símbolos como & y <). Uso:  npm i playwright && node components/grid/auditoria.mjs
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const PREVIEW = 'file://' + path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'preview.html');
(async()=>{
 const b=await chromium.launch();
 const pg=await b.newPage({viewport:{width:1200,height:1400}});
 await pg.goto(PREVIEW,{waitUntil:'networkidle'});
 const res=await pg.evaluate(async()=>{
  await document.fonts.ready;
  const P=MoozaPoster, out=[];
  const CFG=[[6,1.2],[3,.6],[8,2],[12,3.5],[10,3],[12,1]];
  const rect=(el)=>{const r=el.getBoundingClientRect();return {l:r.left,t:r.top,r:r.right,b:r.bottom}};
  const textRect=(el)=>{const rg=document.createRange();rg.selectNodeContents(el);const rs=[...rg.getClientRects()].filter(r=>r.width>0);if(!rs.length)return rect(el);return {l:Math.min(...rs.map(r=>r.left)),t:Math.min(...rs.map(r=>r.top)),r:Math.max(...rs.map(r=>r.right)),b:Math.max(...rs.map(r=>r.bottom))}};
  const ink=(el)=>{const cs=getComputedStyle(el),fs=parseFloat(cs.fontSize),ctx=document.createElement('canvas').getContext('2d');ctx.font=cs.fontWeight+' '+fs+'px '+cs.fontFamily;const asc=ctx.measureText('x').fontBoundingBoxAscent;const rg=document.createRange();rg.selectNodeContents(el);const rs=[...rg.getClientRects()].filter(r=>r.width>0);const ls=(el.innerText||'').split('\n').filter(s=>s.trim());return rs.map((r,i)=>{const t=(ls[i]||ls[ls.length-1]||'x');const mm=ctx.measureText(cs.textTransform==='uppercase'?t.toUpperCase():t);const base=r.top+asc;return {l:r.left,r:r.right,t:base-mm.actualBoundingBoxAscent,b:base+mm.actualBoundingBoxDescent}})};
  // celda real de un elemento de la grilla (no su caja, que puede ser más corta si va alineado al inicio)
  const celda=(gi)=>{const gr=gi.parentElement,gs=getComputedStyle(gr),R=gr.getBoundingClientRect();const rows=gs.gridTemplateRows.split(' ').map(parseFloat),gap=parseFloat(gs.rowGap),pt=parseFloat(gs.paddingTop);
   const [a,b]=gi.style.gridRow.split('/').map(x=>parseInt(x));const top=(r)=>R.top+pt+rows.slice(0,r-1).reduce((x,y)=>x+y,0)+(r-1)*gap;return {l:0,r:0,t:top(a),b:top(b)-gap}};
  // un texto recortado (puntos suspensivos o data-recortado) se mide por su caja, no por la tinta de las líneas que quedan ocultas
  const recortado=(t)=>t.closest('[data-recortado]')||getComputedStyle(t).webkitLineClamp!=='none'||getComputedStyle(t).textOverflow==='ellipsis';
  const tinta=(t)=>recortado(t)?[rect(t)]:ink(t);
  const hit=(a,c,tol=1)=>a.l<c.r-tol&&a.r>c.l+tol&&a.t<c.b-tol&&a.b>c.t+tol;
  const LARGO='Tour nocturno cementerio general: 1821 el origen - miércoles 28 de octubre del 2026 - 20:15 horas & más <en vivo>';
  const EV=(i)=>({k:'Miércoles '+(i+10)+' · Música de cámara',t:LARGO,l:'Centro cultural con un nombre muy largo',h:i%2?'':'20:00'});
  const ST={categoria:'Música de cámara y ópera',cartelera:'Cartelera Música de raíz y tradiciones',titulo:LARGO,lugar:'Centro cultural con un nombre muy largo • Santiago',fecha:'Miércoles 28 oct, 22:30',precio:'desde $15.895',descripcion:LARGO+'. '+LARGO,cta:'Pregunta los detalles por DM'};
  const ESTRES={
    titular:{titular:'Carteleras de noviembre',rango:'26 oct – 1 nov',bajada:LARGO+'. '+LARGO},
    agenda:{agenda:{dia:'Miércoles',n:28,pag:'2/4',eventos:[0,1,2].map(i=>({h:'22:00',t:LARGO,v:'Centro cultural con un nombre muy largo',p:'$10.000'}))}},
    cartelera:{cartelera:{titulo:'Folclore, música de raíz y tradiciones populares de Chile',mes:'Noviembre 2026',pag:'2 / 2',pie:'Toda la agenda en mooza.cl',eventos:Array.from({length:10},(_,i)=>EV(i))}},
    mes:{mes:{titulo:'Noviembre 2026',dato:'+945 eventos en 331 espacios este mes y algo más',bajada:LARGO,fotos:[]}},
    story:{story:ST},'story-vertical':{story:ST}
  };
  const VIN={cartelera:{cartelera:{titulo:'Rock',mes:'Noviembre 2026',pag:'1 / 1',pie:'Toda la agenda en mooza.cl',eventos:[0,1,2,3,4,5].map(i=>EV(i)),vineta:{src:'../../kit/ilustraciones/vinetas/sin-fondo/cinta.png'}}}};
  const VB=(t,ancla)=>({cartelera:{titulo:t,mes:'Noviembre 2026',pag:'1 / 1',pie:'Toda la agenda en mooza.cl',eventos:[0,1,2,3,4,5].map(i=>EV(i)),vineta:{src:'../../kit/ilustraciones/vinetas/sin-fondo/'+(ancla==='arriba'?'telon':'publico')+'.png',en:'banner',ancla}},color:'amarillo'});
  const VC=(t,v)=>({cartelera:{titulo:t,mes:'Noviembre 2026',pag:'1 / 2',pie:'Toda la agenda en mooza.cl',compacta:true,eventos:[0,1,2,3,4,5,6,7,8,9].map(i=>EV(i)),vineta:{src:'../../kit/ilustraciones/vinetas/sin-fondo/'+v+'.png'}},color:'amarillo'});
  const casos=[[null,'ejemplo'],['estres','estrés'],['vineta','viñeta'],['vb1','viñeta arriba'],['vb2','viñeta abajo'],['vc1','compacta'],['vc2','compacta larga']];
  for(const [m,g] of CFG){
   for(const [tipo,fs] of Object.entries(P.ROWS)) for(const f of Object.keys(fs)) for(const [caso,nom] of casos){
    if(caso==='estres'&&!ESTRES[tipo])continue;
    if(caso==='vineta'&&!VIN[tipo])continue;
    if((caso==='vb1'||caso==='vb2'||caso==='vc1'||caso==='vc2')&&tipo!=='cartelera')continue;
    const host=document.createElement('div');host.style.cssText='width:600px;position:absolute;left:0;top:0';host.style.setProperty('--mz-m',m);host.style.setProperty('--mz-g',g);document.body.appendChild(host);
    const el=document.createElement('div');host.appendChild(el);P.mount(el,tipo,caso==='estres'?ESTRES[tipo]:caso==='vineta'?VIN[tipo]:caso==='vb1'?VB('Teatro y danza','arriba'):caso==='vb2'?VB('Folclore y música de raíz','abajo'):caso==='vc1'?VC('Rock','cinta'):caso==='vc2'?VC('Folclore y música de raíz','telon'):null,f);
    await new Promise(r=>requestAnimationFrame(r));
    const box=rect(el), W=box.r-box.l, mm=m/100*W, pad=mm;
    const inner={l:box.l+pad,r:box.r-pad,t:box.t+(f==='9x16'?Math.min(m*2.2,18)/100*W:pad),b:box.b-(f==='9x16'?Math.min(m*2.2,18)/100*W:pad)};
    const logo=el.querySelector('.mz-logo'), fecha=el.querySelector('.mz-fecha-pie');
    const textos=[...el.querySelectorAll('.mz-t-display,.mz-t-grande,.mz-t-titular,.mz-t-sub,.mz-t-texto,.mz-t-dato,.mz-t-micro,.mz-hora,.mz-dc b,.mz-ev-k,.mz-ev-t,.mz-ev-l')].filter(x=>!x.classList.contains('mz-fecha-pie'));
    const bloques=[...el.querySelectorAll('.mz-ph,.mz-dc,.mz-vineta img')];
    const tag=`${tipo}/${f} ${nom} m${m} g${g}`;
    // una palabra conectora nunca queda suelta: siempre va pegada a la siguiente con un espacio de no separación
    const CON='a|al|ante|bajo|con|contra|de|del|desde|durante|e|el|en|entre|hacia|hasta|la|las|lo|los|mediante|ni|o|para|por|que|según|sin|sobre|su|sus|tras|u|un|una|unos|unas|y';
    el.querySelectorAll('.mz-grid *').forEach(n=>{if(n.children.length&&![...n.childNodes].some(c=>c.nodeType===3&&c.textContent.trim()))return;const t=[...n.childNodes].filter(c=>c.nodeType===3).map(c=>c.textContent).join('|');if(new RegExp('(^|[ |])('+CON+') +(?=[^ |])','i').test(t))out.push(tag+': conector suelto en «'+t.slice(0,40)+'»')});
    const L=logo&&rect(logo);
    if(L){
      for(const t of textos) if(tinta(t).some(r=>hit(L,r))) out.push(tag+': logo choca con texto '+t.className);
      for(const bl of bloques) if(hit(L,rect(bl))) out.push(tag+': logo choca con '+bl.className);
      if(fecha&&tinta(fecha).some(r=>hit(L,r))) out.push(tag+': logo choca con fecha');
      if(L.l<inner.l-1||L.b>inner.b+1) out.push(tag+': logo fuera del margen');
      if(fecha){const fr=ink(fecha)[0];if(Math.abs(fr.b-L.b)>4) out.push(tag+': fecha y logo desalineados en vertical ('+Math.round(fr.b-L.b)+'px)');}
    }
    for(const t of [...textos,...(fecha?[fecha]:[])]){
      const rs=tinta(t),tr={l:Math.min(...rs.map(r=>r.l)),r:Math.max(...rs.map(r=>r.r)),t:Math.min(...rs.map(r=>r.t)),b:Math.max(...rs.map(r=>r.b))};
      if(tr.l<inner.l-2||tr.r>inner.r+2) out.push(tag+': '+t.className+' se sale del margen horizontal ('+Math.round(tr.l-inner.l)+','+Math.round(tr.r-inner.r)+')');
      const cell=celda(t.closest('.mz-grid>*')); if(tr.b>cell.b+4||tr.t<cell.t-6) out.push(tag+': '+t.className+' «'+t.textContent.slice(0,24)+'» desborda su celda en vertical ('+Math.round(tr.t-cell.t)+','+Math.round(tr.b-cell.b)+')');
      for(const bl of bloques) if(!t.contains(bl)&&!bl.contains(t)&&rs.some(r=>hit(r,rect(bl),2))) out.push(tag+': texto '+t.className+' choca con '+bl.className);
    }
    host.remove();
   }
  }
  return out;
 });
 console.log(res.length+' problemas'); console.log(res.join('\n'));
 await b.close();
 process.exit(res.length?1:0);
})();
