/* Mooza · generador de carteles sobre la grilla de siete días.
   Cada cartel se parte en dos zonas, una arriba y otra abajo (en horizontal, izquierda y derecha), y cada zona dice una sola cosa.
   Ocho diseños: titular, numero, foto, semana, agenda, story, story-vertical y musa.
   Uso:
     <link rel="stylesheet" href="styles.css">
     <script src="components/grid/poster.js"></script>
     MoozaPoster.mount(document.querySelector('#x'), 'titular', datos, formato);   // datos y formato opcionales
   Los carteles se ven bien con cualquier margen (--mz-m) y medianil (--mz-g): ver tokens/grid.css. */
(function(root){
  'use strict';

  /* formatos: proporción (ancho/alto). Siempre siete columnas. */
  var FORMATOS={'4x5':{ar:'4/5'},'1x1':{ar:'1/1'},'a3':{ar:'297/420'},'9x16':{ar:'9/16'},'16x9':{ar:'16/9'},'carta':{ar:'612/792'}};
  /* filas de cada formato (la última es siempre el pie) y filas de la zona de arriba.
     En 16x9 el cartel se parte en mitades: izquierda blanca, derecha de color; la columna 4 queda sobre la línea del centro. */
  var ARRIBA={'4x5':4,'a3':5,'1x1':3,'9x16':8};
  var ARRIBA_TITULAR=ARRIBA;
  var ROWS={
    titular:{'4x5':9,'a3':11,'1x1':8,'16x9':4},
    numero:{'4x5':9,'a3':11,'1x1':8,'16x9':4},
    foto:{'4x5':9,'a3':11,'1x1':8,'16x9':4},
    semana:{'4x5':9,'a3':11,'1x1':8},
    agenda:{'4x5':9,'a3':11},
    story:{'9x16':16},
    musa:{'carta':9},
    'story-vertical':{'9x16':16}
  };
  var CLASES={titular:'mz-d-titular',numero:'mz-d-numero',foto:'mz-d-foto',semana:'mz-d-semana',agenda:'mz-d-agenda',story:'mz-d-story','story-vertical':'mz-d-story',musa:'mz-d-musa'};

  /* datos de ejemplo. Los eventos, salas y precios son inventados. */
  var EJEMPLO={
    rango:'26 oct – 1 nov',
    corto:'26–1',
    titular:'Agenda<br>cultural',
    dias:[['L',26],['M',27],['M',28],['J',29],['V',30],['S',31],['D',1]],
    diaDestacado:4,
    evento:{nombre:'Cuarteto de<br>jazz en vivo',meta:'Teatro del Parque<br>Vie 30 • 21:00 • desde $8.000'},
    agenda:{dia:'Sábado',n:20,pag:'2/4',eventos:[
      {h:'22:00',t:'El alma al aire II: canciones de Alejandro Sanz',v:'Bar La Otra Casa',p:'$10.000'},
      {h:'22:00',t:'Glam Fest en Biker Chop',v:'Biker Chop',p:'$8.000'},
      {h:'23:30',t:'Noche de cumbia en vivo',v:'Club Subterráneo',p:'$6.000'}
    ]},
    musa:{src:'',corte:'v',colores:['gris','amarillo']},
    story:{categoria:'Música',cartelera:'Cartelera Música de raíz',titulo:'Concierto de Juan Falú en Sala Isidora Zegers',
      lugar:'Sala Isidora Zegers • Santiago',fecha:'Martes 27 oct, 19:30',precio:'desde $15.895',
      descripcion:'El destacado guitarrista y compositor argentino Juan Falú se presentará en Chile luego de diez años. Ofrecerá un recorrido de sus sesenta años…',
      cta:'Pregunta los detalles por DM'}
  };

  /* filtro que vuelve una foto cualquiera una tinta azul con transparencia (oscuro opaco, claro transparente) */
  var FILTRO_TINTA='<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs><filter id="mz-tinta" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 0.1059  0 0 0 0 0.0784  0 0 0 0 0.2667  0 -1 0 0 1"/></filter></defs></svg>';

  var LOGO='<svg class="mz-logo" viewBox="0 0 629.21 159.59" role="img" aria-label="Mooza"><use href="#mz-lockup"/></svg>';

  /* símbolos del logo: completo (#mz-lockup) y solo ícono (#mz-iso). Insértalos una vez por documento: MoozaPoster.sprite() */
  function sprite(){
    return '<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs><symbol id="mz-lockup" viewBox="0 0 629.21 159.59"><g class="mz-lt"><path d="M180.62,102.9c0-7.2-.18-13.4-.44-19.04-.1-2.26,1.71-4.14,3.98-4.14h8.98c2.08,0,3.8,1.6,3.97,3.67l.61,7.78h.46c3.76-6.05,10.85-13.21,24.01-13.21,10.32,0,18.27,5.74,21.63,14.38h.32c2.73-4.27,6.01-7.53,9.53-9.79,4.44-2.98,9.35-4.58,15.85-4.58,12.89,0,26.02,8.83,26.02,33.83v41.89c0,2.21-1.79,4-4,4h-11.22c-2.21,0-4-1.79-4-4v-39.12c0-13-4.5-20.62-13.91-20.62-6.74,0-11.68,4.75-13.71,10.38-.63,1.88-1,4.37-1,6.58v42.78c0,2.21-1.79,4-4,4h-11.22c-2.21,0-4-1.79-4-4v-41.07c0-10.98-4.39-18.66-13.45-18.66-7.39,0-12.33,5.79-14.18,11.13-.7,1.98-.98,4.31-.98,6.52v42.08c0,2.21-1.79,4-4,4h-11.22c-2.21,0-4-1.79-4-4v-50.77Z"/><path d="M390.48,117.93c0,28.65-20.11,41.5-40.05,41.5-21.99,0-39.01-15.18-39.01-40.16s16.84-41.32,40.34-41.32,38.72,16.34,38.72,39.98ZM331.68,118.78c0,15,7.49,26.34,19.38,26.34s19.15-10.91,19.15-26.6c0-12.25-5.42-26.24-19.02-26.24s-19.51,13.5-19.51,26.5Z"/><path d="M481.12,117.93c0,28.65-20.11,41.5-40.05,41.5-21.99,0-39.01-15.18-39.01-40.16s16.84-41.32,40.34-41.32,38.72,16.34,38.72,39.98ZM422.32,118.78c0,15,7.49,26.34,19.38,26.34s19.15-10.91,19.15-26.6c0-12.25-5.42-26.24-19.02-26.24s-19.51,13.5-19.51,26.5Z"/><path d="M488.69,147.67c0-.89.3-1.76.85-2.47l28.49-36.37c4.01-4.81,7.34-8.63,11.41-13.07v-.34h-33.84c-2.21,0-4-1.79-4-4v-7.69c0-2.21,1.79-4,4-4h53.87c2.22,0,4.01,1.8,4,4.02l-.03,6.63c0,.89-.3,1.75-.85,2.45l-27.73,35.5c-3.84,4.67-7.51,9.16-11.51,13.32v.34h37.06c2.21,0,4,1.79,4,4v7.69c0,2.21-1.79,4-4,4h-57.72c-2.21,0-4-1.79-4-4v-6Z"/><path d="M615.44,157.68c-1.97,0-3.65-1.44-3.96-3.39l-.82-5.29h-.47c-4.73,6.15-12.88,10.45-22.97,10.45-15.82,0-24.58-11.3-24.58-23.19,0-19.67,17.53-29.63,46.24-29.51v-1.29c0-5.12-2.03-13.64-15.83-13.59-5.85,0-11.92,1.44-16.83,3.63-2.24,1-4.83-.1-5.54-2.44l-1.53-5.01c-.58-1.9.29-3.94,2.09-4.8,6.04-2.9,14.85-5.28,25.21-5.28,25,0,32.14,15.77,32.14,32.87v28.07c0,5.14.19,10.16.62,14.38.24,2.37-1.59,4.4-3.97,4.4h-9.79ZM609.4,119.5c-13.91-.19-27.21,2.75-27.21,14.62,0,7.63,5.01,11.23,11.24,11.23,7.87,0,13.54-5.08,15.42-10.79.42-1.37.55-2.92.55-4.28v-10.77Z"/></g><path class="mz-li" d="M152.67,5.56c-9.81-7.28-23.19-7.42-33.14-.33h0c-12.5,8.9-15.89,26.01-7.73,39.01l13.66,21.74c.44.7.43,1.6-.02,2.29l-8.68,13.25c-.84,1.28-2.73,1.28-3.56,0l-40.65-62.78C59.87-.87,33.03-5.22,14.8,9.36h0C-1.04,22.04-4.68,44.68,6.39,61.68l59.33,91.11c5.93,9.11,19.28,9.06,25.15-.09l69.02-107.64c8.35-13.02,5.19-30.28-7.23-39.51ZM80.18,145.84c-.44.69-1.09,1.04-1.91,1.04s-1.45-.35-1.9-1.03L17.04,54.75c-7.54-11.58-5.09-26.83,5.7-35.46,4.79-3.84,10.55-5.86,16.66-5.86,9.13,0,17.54,4.56,22.48,12.21l40.65,62.78c2.34,3.61,6.06,5.98,10.23,6.61l-32.59,50.82ZM149.2,38.2l-13.22,20.62-13.41-21.35c-4.58-7.29-2.67-16.91,4.34-21.9,2.63-1.88,5.74-2.87,8.97-2.87s6.54,1.05,9.22,3.05c7.03,5.22,8.83,15.08,4.1,22.44Z"/></symbol><symbol id="mz-iso" viewBox="0 0 168.34 163.27"><path class="mz-li" d="M156.19,5.68c-10.03-7.45-23.72-7.59-33.9-.34h0c-12.79,9.11-16.26,26.61-7.91,39.91l13.97,22.24c.45.72.44,1.64-.02,2.35l-8.88,13.56c-.86,1.31-2.79,1.31-3.64,0L74.22,19.16C61.25-.89,33.79-5.34,15.15,9.58h0C-1.07,22.55-4.79,45.71,6.54,63.11l60.7,93.2c6.07,9.32,19.73,9.27,25.73-.09l70.61-110.12c8.54-13.32,5.31-30.98-7.39-40.42ZM82.03,149.2c-.45.71-1.11,1.07-1.95,1.07s-1.49-.35-1.94-1.05L17.43,56.01c-7.72-11.85-5.21-27.45,5.83-36.28,4.9-3.92,10.8-6,17.04-6,9.34,0,17.94,4.67,23,12.49l41.58,64.23c2.39,3.69,6.2,6.12,10.47,6.76l-33.34,51.99ZM152.64,39.08l-13.53,21.1-13.72-21.84c-4.68-7.46-2.73-17.3,4.44-22.41,2.69-1.92,5.87-2.93,9.18-2.93s6.69,1.08,9.44,3.12c7.19,5.34,9.03,15.42,4.2,22.96Z"/></symbol><symbol id="mz-oo" viewBox="311 77 171 83"><g class="mz-lt"><path d="M390.48,117.93c0,28.65-20.11,41.5-40.05,41.5-21.99,0-39.01-15.18-39.01-40.16s16.84-41.32,40.34-41.32,38.72,16.34,38.72,39.98ZM331.68,118.78c0,15,7.49,26.34,19.38,26.34s19.15-10.91,19.15-26.6c0-12.25-5.42-26.24-19.02-26.24s-19.51,13.5-19.51,26.5Z"/><path d="M481.12,117.93c0,28.65-20.11,41.5-40.05,41.5-21.99,0-39.01-15.18-39.01-40.16s16.84-41.32,40.34-41.32,38.72,16.34,38.72,39.98ZM422.32,118.78c0,15,7.49,26.34,19.38,26.34s19.15-10.91,19.15-26.6c0-12.25-5.42-26.24-19.02-26.24s-19.51,13.5-19.51,26.5Z"/></g></symbol></defs></svg>'+FILTRO_TINTA;
  }

  function cell(c1,c2,r1,r2,cls,html,st){
    return '<div class="'+(cls||'')+'" style="grid-column:'+c1+'/'+(c2+1)+';grid-row:'+r1+'/'+(r2+1)+';'+(st||'')+'">'+(html||'')+'</div>';
  }
  function overlay(rows){return '<div class="mz-overlay" style="--rows:'+rows+'">'+new Array(7*rows+1).join('<i></i>')+'</div>'}
  function grid(rows,inner){return '<div class="mz-grid" style="--rows:'+rows+'">'+inner+'</div>'+overlay(rows)}

  /* foto: la foto es una tinta azul con transparencia que se apoya sobre una zona lisa, amarilla o naranja.
     datos.foto = {src, listo, pos, alt, color, texto}
       src    la imagen. Si es una foto normal se convierte al vuelo en tinta azul (filtro #mz-tinta).
       listo  true si src ya es la tinta azul con alfa (el PNG que exportan las herramientas del kit): no se vuelve a filtrar.
       pos    punto de enfoque del recorte, por ejemplo '50% 30%'.
       color  color de la zona bajo la foto: 'amarillo' o 'naranja' (por defecto el del diseño).
       texto  'blanco' si el titular va encima de la foto y esta es oscura.
     Sin imagen se muestra el marcador: la zona de color y una nota. */
  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;')}
  function hayFoto(d){return !!(d.foto&&d.foto.src)}
  function fotoHtml(d){
    if(!hayFoto(d))return 'foto del evento';
    var f=d.foto;
    return '<img class="mz-foto" src="'+esc(f.src)+'" alt="'+esc(f.alt||'')+'" style="'+(f.pos?'object-position:'+esc(f.pos)+';':'')+(f.listo?'':'filter:url(#mz-tinta)')+'">';
  }
  /* color de la zona de una foto: el de la foto, el de la pieza o el del diseño */
  function campoFoto(d,def){return 'var(--mz-'+((d.foto&&d.foto.color)||d.color||def)+')'}
  /* sobre una foto oscura el titular va en blanco si se pide */
  function sobreFoto(d){return hayFoto(d)&&d.foto.texto==='blanco'?' mz-sobre-oscuro':''}

  /* campo de color: la zona que llega a los bordes. El resto del cartel es gris claro.
     zonaA: el campo está arriba y termina en la fila indicada. zona: el campo está abajo y empieza en la fila indicada. */
  function zonaA(hasta,fondo,html){return cell(1,7,1,hasta,'mz-zona-a',html||'','background:'+fondo)}
  function zona(desde,n,fondo,html){return cell(1,7,desde,n,'mz-zona',html||'','background:'+fondo)}
  /* mitad derecha de un cartel horizontal: del centro al borde */
  function mitad(fondo,cls,html){return '<div class="mz-mitad'+(cls?' '+cls:'')+'"'+(fondo?' style="background:'+fondo+'"':'')+'>'+(html||'')+'</div>'}
  /* el color de la zona: el que venga en datos.color o el propio de cada diseño (azul, amarillo o naranja).
     El azul es protagonista, no el único: en un conjunto de piezas los tres colores se reparten. */
  function campo(d,def){return 'var(--mz-'+(d.color||def)+')'}
  /* sobre azul el texto va en blanco; sobre cualquier otro campo, en azul */
  function tinta(d,def){return (d.color||def)==='azul'?' mz-sobre-oscuro':''}
  /* el acento pequeño es amarillo, salvo que la zona ya sea amarilla: entonces es naranja */
  function acento(d,def){return 'background:var(--mz-'+((d.color||def)==='amarillo'?'naranja':'amarillo')+')'}

  /* fondo de marca: el logo a una escala tan grande que ya no se lee como logo. Es la manera de comunicar de Mooza y va siempre,
     detrás del texto, salvo que se pida datos.fondo = false.
     Cada zona lleva las formas en un tono apenas distinto de su color (--mz-tono-azul, -amarillo, -naranja y -claro sobre el gris),
     con el borde suave (datos.difuminado, 1,8 por defecto, 0 lo deja nítido) y el grano encima (datos.grano). datos.semilla cambia la composición.
     Procedimiento:
       1. Se ponen dos símbolos del logo, las dos "o" juntas y el ícono, a una escala en que una "o" mide más que el cartel.
          Solo se usan las partes curvas: así no aparecen letras ni diagonales.
       2. Cada uno se ancla por un punto de interés (el centro de una "o", la lente entre las dos, un lóbulo del ícono) cerca de una
          esquina y se gira en múltiplos de 90°. La semilla decide cuál y dónde.
       3. Las formas cruzan el límite entre la zona de color y el gris, y el tono cambia con la zona. */
  /* x0, y0, w, h: caja del símbolo. pi: puntos de interés. esc: cqw por unidad del símbolo (la "o" mide 80 unidades de alto) */
  var SIMB={
    'mz-oo':{x0:311,y0:77,w:171,h:83,pi:[[350.8,118.3],[441.7,118.3],[396,118.3]],esc:[1.2,1.5,2.4]},
    'mz-iso':{x0:0,y0:0,w:168.34,h:163.27,pi:[[45,55],[125,40],[84,120]],esc:[1.7,2.2,3]}
  };
  function rng(sem){var a=sem>>>0;return function(){a=(a+0x6D2B79F5)|0;var t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296}}
  function r2(x){return Math.round(x*100)/100}
  function altura(f){var a=FORMATOS[f].ar.split('/');return 100*a[1]/a[0]}
  function fondoLogo(f,sem){
    var R=rng(sem||1),Hc=altura(f),sim=['mz-oo','mz-iso'];
    return sim.map(function(id){
      var S=SIMB[id],a=S.pi[Math.floor(R()*S.pi.length)],k=S.esc[Math.floor(R()*3)]*1.25,tx=(R()<.5?0:100)+(R()-.5)*30,ty=(R()<.5?.1:.9)*Hc+(R()-.5)*Hc*.3;
      return {id:id,x:tx-(a[0]-S.x0)*k,y:ty-(a[1]-S.y0)*k,w:S.w*k,h:S.h*k,k:k,rot:90*Math.floor(R()*4),tx:tx,ty:ty};
    });
  }
  var _fid=0;
  /* zona: [x,y,ancho,alto] de la zona de color, en cqw.
     solo: true cuando la zona es una foto o va encima: solo se dibuja la parte sobre el gris, debajo de ella. */
  function fondo(d,f,zona,def,solo){
    if(!d.fondo)return '';
    var Hc=altura(f),id='mzf'+(++_fid),z=d.color||def,it=fondoLogo(f,d.semilla),zr='M'+zona[0]+','+zona[1]+'h'+zona[2]+'v'+zona[3]+'h-'+zona[2]+'Z';
    var sg=+d.difuminado||0,fil=sg?'<filter id="'+id+'f" filterUnits="userSpaceOnUse" x="-10" y="-10" width="120" height="'+r2(Hc+20)+'"><feGaussianBlur stdDeviation="'+sg+'"/></filter>':'';
    var usos=(sg?'<g filter="url(#'+id+'f)">':'')+it.map(function(t){
      return '<use href="#'+t.id+'" x="'+r2(t.x)+'" y="'+r2(t.y)+'" width="'+r2(t.w)+'" height="'+r2(t.h)+'" transform="rotate('+t.rot+' '+r2(t.tx)+' '+r2(t.ty)+')" '+
             'style="--mz-lt-fill:currentColor;--mz-lt-stroke:none;--mz-lt-w:0"/>';
    }).join('')+(sg?'</g>':'');
    return '<svg class="mz-fondo" viewBox="0 0 100 '+r2(Hc)+'" aria-hidden="true"><defs>'+
      '<clipPath id="'+id+'z"><path d="'+zr+'"/></clipPath>'+
      '<clipPath id="'+id+'g"><path clip-rule="evenodd" d="M0,0h100v'+r2(Hc)+'h-100Z'+zr+'"/></clipPath>'+fil+'</defs>'+
      (solo?'':'<g clip-path="url(#'+id+'z)" style="color:var(--mz-tono-'+z+')">'+usos+'</g>')+
      '<g clip-path="url(#'+id+'g)" style="color:var(--mz-tono-claro)">'+usos+'</g></svg>';
  }
  /* grano: una película de ruido fino sobre todo el cartel, texto incluido, para darle unidad y textura.
     datos.grano = true (fuerza 1) o un número entre 0 y 2. Se mezcla en "superponer": aclara y oscurece sin cambiar el color.
     El tamaño del grano es fijo en píxeles, no crece con el cartel. */
  function grano(d){
    if(!d.grano)return '';
    var f=d.grano===true?1:+d.grano,sem=Math.floor((d.semilla||1)*7)%97+1;
    return '<svg class="mz-grano" aria-hidden="true" style="opacity:'+r2(.34*f)+'"><filter id="mzg'+(++_fid)+'" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">'+
      '<feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="'+sem+'" stitchTiles="stitch"/>'+
      '<feColorMatrix values="1 0 0 0 0  1 0 0 0 0  1 0 0 0 0  0 0 0 0 1"/>'+
      '<feComponentTransfer><feFuncR type="linear" slope="1.7" intercept="-.35"/><feFuncG type="linear" slope="1.7" intercept="-.35"/><feFuncB type="linear" slope="1.7" intercept="-.35"/></feComponentTransfer></filter>'+
      '<rect width="100%" height="100%" filter="url(#mzg'+_fid+')"/></svg>';
  }
  /* y del borde de la zona de color, en cqw: arriba termina en la fila s; abajo empieza después de la fila s */
  function yZona(d,f,n,s,arriba){
    var m=d._m||6,g=d._g||1.2,fh=(altura(f)-2*m-(n-1)*g)/n;
    return arriba?m+s*fh+(s-1)*g+g/2:m+s*(fh+g)-g/2;
  }

  /* pie: la última fila de todo cartel. El logo mide dos columnas y va a la izquierda; el texto, a la derecha.
     Nada más entra en esa fila, así que el logo nunca choca. oscuro: el pie está sobre el color oscuro. */
  function pie(n,texto,oscuro){
    var k=oscuro?' mz-sobre-oscuro':'';
    return cell(1,2,n,n,'mz-pie-logo'+k,LOGO)+(texto?cell(5,7,n,n,'mz-t-dato mz-fecha-pie'+k,texto):'');
  }

  /* titular: arriba, el titular sobre el color. Abajo, sobre gris, la fecha. */
  function titular(d,n,f){
    var k=tinta(d,'azul');
    if(f==='16x9')return grid(n,mitad(campo(d,'azul'))+fondo(d,f,[50,0,50,altura(f)],'azul')+cell(1,3,1,3,'mz-t-grande',d.titular)+cell(5,7,1,1,'mz-t-sub'+k,d.rango)+
      cell(1,2,n,n,'mz-pie-logo',LOGO)+cell(5,7,n,n,'mz-t-dato mz-fecha-pie'+k,'mooza.cl'));
    var s=ARRIBA_TITULAR[f];
    return grid(n,(hayFoto(d)?fondo(d,f,[0,0,100,yZona(d,f,n,s,true)],'azul',true):'')+zonaA(s,hayFoto(d)?campoFoto(d,'amarillo'):campo(d,'azul'),hayFoto(d)?fotoHtml(d):'')+(hayFoto(d)?'':fondo(d,f,[0,0,100,yZona(d,f,n,s,true)],'azul'))+cell(1,7,1,s,'mz-t-grande'+(hayFoto(d)?sobreFoto(d):k),d.titular)+
      cell(1,7,s+2,s+2,'mz-t-sub mz-abajo',d.rango)+pie(n,'mooza.cl'));
  }

  /* número: arriba, sobre gris, el rango de la semana, enorme. Abajo, sobre el color, qué es. */
  function numero(d,n,f){
    var k=tinta(d,'amarillo');
    if(f==='16x9')return grid(n,mitad(campo(d,'amarillo'))+fondo(d,f,[50,0,50,altura(f)],'amarillo')+cell(1,3,1,2,'mz-t-grande','Esta<br>semana')+cell(5,7,1,3,'mz-t-display'+k,d.corto)+
      cell(1,2,n,n,'mz-pie-logo',LOGO)+cell(5,7,n,n,'mz-t-dato mz-fecha-pie'+k,'mooza.cl'));
    var s=ARRIBA[f];
    return grid(n,zona(s+1,n,campo(d,'amarillo'))+(function(){var y=yZona(d,f,n,s,false);return fondo(d,f,[0,y,100,altura(f)-y],'amarillo')})()+cell(1,7,1,s,'mz-t-display',d.corto)+
      cell(1,7,s+2,s+2,'mz-t-titular mz-abajo'+k,'Esta semana')+pie(n,'mooza.cl',k));
  }

  /* foto: arriba, la foto (es el color de la pieza). Abajo, sobre gris, el nombre del evento y sus datos. */
  function foto(d,n,f){
    var txt='<span class="mz-t-titular">'+d.evento.nombre+'</span><span class="mz-t-dato">'+d.evento.meta+'</span>';
    /* en horizontal el texto tiene tres columnas: el precio pasa a su propia línea */
    if(f==='16x9')return grid(n,fondo(d,f,[50,0,50,altura(f)],'amarillo',true)+mitad(campoFoto(d,'amarillo'),'mz-ph',fotoHtml(d))+cell(1,3,1,3,'mz-evento-t',txt.replace(' • desde','<br>desde'))+pie(n,null));
    var s=ARRIBA[f];
    var cta=d.cta&&f==='a3'?d.cta:'';
    return grid(n,fondo(d,f,[0,0,0,0],'amarillo',true)+cell(1,7,1,s,'mz-ph',fotoHtml(d),'background:'+campoFoto(d,'amarillo'))+
      cell(1,7,s+2,cta?n-2:n-1,'mz-evento-t',txt)+pestana(d,n-1,cta,(d.foto&&d.foto.color)||d.color||'amarillo')+pie(n,d.rango));
  }

  /* semana: arriba, sobre el color, el titular. Abajo, sobre gris, siete días; el destacado lleva el acento. */
  function semana(d,n,f){
    var s=ARRIBA[f],fila=n-2,h=(hayFoto(d)?fondo(d,f,[0,0,100,yZona(d,f,n,s,true)],'naranja',true):'')+zonaA(s,hayFoto(d)?campoFoto(d,'naranja'):campo(d,'naranja'),hayFoto(d)?fotoHtml(d):'')+(hayFoto(d)?'':fondo(d,f,[0,0,100,yZona(d,f,n,s,true)],'naranja'))+cell(1,7,1,s,'mz-t-grande'+(hayFoto(d)?sobreFoto(d):tinta(d,'naranja')),'Esta<br>semana');
    d.dias.forEach(function(x,i){
      h+=cell(i+1,i+1,fila,fila,'mz-dc'+(i===d.diaDestacado?' mz-dc-on':''),'<span class="mz-t-micro">'+x[0]+'</span><b>'+x[1]+'</b>',i===d.diaDestacado?acento(d,'naranja'):'');
    });
    return grid(n,h+pie(n,d.rango));
  }

  /* agenda: arriba, sobre el color, el día. Abajo, sobre gris, hasta tres eventos. */
  function agenda(d,n,f){
    var a=d.agenda,h=zonaA(2,campo(d,'amarillo'))+fondo(d,f,[0,0,100,yZona(d,f,n,2,true)],'amarillo')+cell(1,7,1,2,'mz-cabeza'+tinta(d,'amarillo'),'<span class="mz-t-grande mz-num">'+a.n+'</span><span class="mz-t-titular">'+a.dia+'</span>');
    /* dos eventos: filas 4 y 7, con una fila de aire entre ellos.
       Tres eventos: parten en la fila 3, cada uno con una línea fina arriba (salvo el primero, que ya tiene el borde de la zona)
       y el mismo respiro bajo la línea. Se reparten hasta el pie: en A3 sobra una fila entre ellos. */
    var ev=a.eventos.slice(0,3),tres=ev.length===3,paso=tres?2+Math.max(0,Math.floor((n-9)/2)):3,ini=tres?3:4;
    ev.forEach(function(e,i){
      var r=ini+i*paso,k=tres?' mz-e3':'';
      if(tres&&i)h+=cell(1,7,r,r,'mz-sep');
      h+=cell(1,2,r,r,'mz-hora'+k+(e.f?' mz-hora-on':''),e.h?'<span>'+e.h+'</span>':'')+
         cell(3,7,r,r+1,'mz-evento-t'+k,'<span class="mz-t-texto">'+e.t+'</span><span class="mz-t-dato">'+e.v+(e.p?' • '+e.p:'')+'</span>');
    });
    return grid(n,h+pie(n,a.pag||''));
  }

  /* pestaña: un aviso de una sola fila, justo sobre el pie. Mide cinco columnas, lleva un color plano distinto al de la foto
     (si la foto va sobre naranjo, la pestaña es amarilla, y al revés) y el texto en azul, con un respiro lateral de 0,3 columnas. */
  function pestana(d,fila,texto,sobre){
    if(!texto)return '';
    var c=(d.story&&d.story.ctaColor)||(sobre==='amarillo'?'naranja':'amarillo');
    return cell(1,5,fila,fila,'mz-pestana mz-t-dato',esc(texto),'background:var(--mz-'+c+')');
  }
  function largo(s){return String(s||'').replace(/<[^>]*>/g,'').length}
  /* story 9:16. Dos composiciones, según la foto.
     Apaisada (por defecto): arriba la foto de siete columnas; debajo la categoría a la izquierda y la cartelera a la derecha, el título,
     lugar, fecha y precio, una descripción de hasta tres líneas, la pestaña y el pie. Sin descripción, la foto gana dos filas.
     Vertical (datos.foto.vertical o el diseño story-vertical): la foto ocupa cinco columnas y ocho filas, casi un 4:5, y no se recorta.
     A su derecha, en dos columnas, la categoría y la cartelera arriba y la fecha y el precio abajo. Debajo, el título, el lugar, la pestaña y el pie. */
  function story(d,n,f){
    var t=d.story,vertical=!!(d.foto&&d.foto.vertical),sobre=(d.foto&&d.foto.color)||d.color||'naranja',cta=t.cta||d.cta,
        base=fondo(d,f,[0,0,0,0],'naranja',true),color='background:'+campoFoto(d,'naranja'),
        meta=t.lugar?[t.lugar,t.fecha,t.precio].filter(Boolean).join('<br>'):t.meta;
    if(vertical){
      return grid(16,base+cell(1,5,1,8,'mz-ph',fotoHtml(d),color)+
        cell(6,7,1,4,'mz-t-dato mz-lado',(t.categoria||'')+(t.cartelera?'<br>'+t.cartelera:''))+
        cell(6,7,6,8,'mz-t-dato mz-lado mz-lado-b',[t.fecha,t.precio].filter(Boolean).join('<br>'))+
        cell(1,7,10,12,'mz-t-titular'+(largo(t.titulo)>32?' mz-t-s':''),t.titulo)+
        cell(1,7,13,14,'mz-t-dato',t.lugar||t.meta)+
        pestana(d,15,cta,sobre)+pie(16,null));
    }
    var h=t.descripcion?5:7,r=h+2;
    return grid(16,base+cell(1,7,1,h,'mz-ph',fotoHtml(d),color)+
      cell(1,3,r,r,'mz-t-dato mz-etiqueta',t.categoria||'')+(t.cartelera?cell(4,7,r,r,'mz-t-dato mz-etiqueta mz-etiqueta-d',t.cartelera):'')+
      cell(1,7,r+1,r+3,'mz-t-titular mz-t-s',t.titulo)+
      cell(1,7,r+4,r+5,'mz-t-dato',meta)+
      (t.descripcion?cell(1,7,r+6,r+7,'mz-t-dato mz-desc',esc(t.descripcion)):'')+
      pestana(d,15,cta,sobre)+pie(16,null));
  }

  /* musa: una ilustración sola que cruza el corte entre dos colores, con el pie de siempre (logo a la izquierda, mooza.cl a la derecha).
     datos.musa = {src, corte, colores, x, y, ancho, alt}
       src      la ilustración: una tinta azul con transparencia, para que el color pase por la figura
       corte    'v' parte el cartel en izquierda y derecha; 'h', en arriba y abajo
       colores  los dos colores, en el orden izquierda-derecha o arriba-abajo: 'gris', 'amarillo', 'naranja' o 'azul'
       x, y     posición de la esquina superior izquierda de la ilustración, en % del ancho y del alto (por defecto, centrada arriba)
       ancho    ancho de la ilustración en % del ancho del cartel (66,9 por defecto) */
  function musa(d,n,f){
    var m=d.musa||{},c=m.colores||['gris','amarillo'],h=m.corte==='h'?' mz-musa-h':'',w=m.ancho||66.9,
        x=m.x!==undefined?m.x:(100-w)/2,y=m.y!==undefined?m.y:8;
    function bg(k){return 'background:'+(k==='gris'?'var(--mz-claro)':'var(--mz-'+k+')')}
    return grid(n,'<div class="mz-musa-a'+h+'" style="'+bg(c[0])+'"></div><div class="mz-musa-b'+h+'" style="'+bg(c[1])+'"></div>'+
      (m.src?'<img class="mz-musa-img" src="'+m.src+'" alt="'+(m.alt||'')+'" style="left:'+x+'%;top:'+y+'%;width:'+w+'%">':'')+pie(n,'mooza.cl'));
  }

  var BUILD={titular:titular,numero:numero,foto:foto,semana:semana,agenda:agenda,story:story,'story-vertical':function(d,n,f){var o={};for(var k in d)o[k]=d[k];o.foto=Object.assign({},d.foto,{vertical:true});return story(o,n,f)},musa:musa};

  function merge(d){var o={};for(var k in EJEMPLO)o[k]=EJEMPLO[k];for(var j in (d||{}))o[j]=d[j];return o}
  function formatoDe(tipo,formato){return formato||(tipo.indexOf('story')===0?'9x16':'4x5')}
  function filas(tipo,formato){
    var n=ROWS[tipo]&&ROWS[tipo][formatoDe(tipo,formato)];
    if(!n)throw new Error('El diseño "'+tipo+'" no existe en el formato '+formatoDe(tipo,formato));
    return n;
  }
  /* html: diseño, datos y formato ('4x5' por defecto; 'a3' y '1x1' donde existan; '9x16' para story) */
  function html(tipo,datos,formato){
    if(!BUILD[tipo])throw new Error('Diseño desconocido: '+tipo);
    var f=formatoDe(tipo,formato);
    var d=merge(datos);
    if(d.fondo===undefined)d.fondo='tono';
    if(d.fondo===false)d.fondo=null;
    if(d.fondo){if(d.difuminado===undefined)d.difuminado=1.8;if(d.grano===undefined)d.grano=true}
    return BUILD[tipo](d,filas(tipo,f),f)+grano(d);
  }
  /* mount: pone el cartel dentro de un elemento. Agrega .mz-poster, la clase del diseño y la proporción. */
  function mount(el,tipo,datos,formato){
    var f=formatoDe(tipo,formato);
    el.className=(el.className?el.className+' ':'')+'mz-poster '+CLASES[tipo]+' mz-f-'+f;
    el.style.setProperty('--mz-ar',FORMATOS[f].ar);
    var dd={},k,cs=typeof getComputedStyle==='function'?getComputedStyle(el):null;
    for(k in (datos||{}))dd[k]=datos[k];
    dd._m=cs&&parseFloat(cs.getPropertyValue('--mz-m'))||6;dd._g=cs&&parseFloat(cs.getPropertyValue('--mz-g'))||1.2;
    el.innerHTML=html(tipo,dd,f);
    return el;
  }

  var api={FORMATOS:FORMATOS,ROWS:ROWS,ARRIBA:ARRIBA,ARRIBA_TITULAR:ARRIBA_TITULAR,EJEMPLO:EJEMPLO,sprite:sprite,html:html,mount:mount,fondoLogo:fondoLogo};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.MoozaPoster=api;
})(typeof window!=='undefined'?window:globalThis);
