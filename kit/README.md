# Kit de recursos gráficos

Es la entrega del rebrand: cada recurso, en sus formatos (SVG, PNG y PDF) y, donde corresponde, con fondo de marca y sin él. Todo está construido sobre la grilla de siete columnas, con margen 6 % y medianil 1,2 % del ancho. Las plantillas vienen a 1080 de ancho: 1080 × 1350 para 4:5, 1080 × 1527 para A3 (escala al tamaño real), 1080 × 1080 para 1:1, 1080 × 1920 para 9:16 y 1080 × 608 para 16:9.

## Qué hay

| Carpeta | Contenido | Formatos |
|---|---|---|
| `logo/` | Horizontal, vertical e ícono en azul, blanco, amarillo y naranjo. `sobre-fondo/` los muestra sobre gris claro, azul, amarillo y naranjo. `base/` tiene la geometría original | `svg/`, `png/` (transparente) y `pdf/` |
| `plantillas/sin-fondo/` | Los siete diseños planos, con texto editable: titular, número, foto, semana, agenda, story y story-vertical, en los formatos que corresponden (19 en total) | `svg/`, `png/` y `pdf/` |
| `plantillas/con-fondo/` | Las mismas 19 con el fondo de marca: la capa de fondo va detrás y el texto sigue editable | `svg/`, `png/` (pieza completa con grano) y `pdf/` |
| `plantillas/mooza-carteles.svg` | Todas las plantillas sin fondo en un solo archivo, una fila por formato, cada una en un grupo con id (`titular-4x5`, `foto-a3`, etc.), y su vista previa en PNG | SVG y PNG |
| `fondos/` | El fondo de marca solo, en cada color de base (gris claro, azul, amarillo y naranjo) y en los cinco formatos. `grano.png` es la textura de grano, repetible | `svg/` (formas, sin grano), `png/` y `pdf/` (con grano y borde suave) |
| `ilustraciones/` | Las cuatro musas sin fondo y en lámina con el logo y mooza.cl. `originales/` tiene los dibujos tal como llegaron | `sin-fondo/png` y `pdf`, `laminas/png` y `pdf` |
| `poleras/` | Las dos capas de impresión de cada estampa (color y tinta azul), una por pantalla, y las maquetas | `estampas/` en PNG con transparencia y PDF, `maquetas/` en JPG |
| `grillas/` | Capa de guías en SVG: 4:5, A3, 1:1, 9:16 y 16:9. Las guías son magenta y no se exportan | SVG |
| `celdas/` | Cuadrados de 100 × 100 rellenos en los colores y de contorno en azul, blanco y amarillo | SVG |
| `fotos/` | Marcador de foto de evento, fotos de ejemplo ya convertidas y reglas de recorte | SVG, PNG |
| `tinta/` | Herramienta en el navegador y script por lotes (`tinta.py`) para convertir fotos a tinta azul con transparencia | HTML, Python |
| `tablero/` | Imágenes de referencia de las piezas: carteles, formatos, feed, fotos, carrusel, grilla y fondo | JPG |

## Cómo usarlos

- Las plantillas usan Geist. Instala la fuente (Google Fonts, licencia OFL) antes de editar el texto en Figma, Illustrator o Affinity.
- Con fondo y sin fondo: las plantillas con fondo llevan el fondo de marca como una imagen incrustada detrás del texto (capa `fondo-de-marca`). Las sin fondo son planas y sirven para trabajar. El grano sobre el texto solo está en el PNG con fondo.
- Los fondos en SVG llevan solo las formas y el borde suave; el grano está en los PNG y PDF.
- Las ilustraciones son dibujos de píxeles: no tienen versión SVG. Para una versión vectorial hay que vectorizarlas desde los originales.
- Para armar una pieza nueva, pon la grilla de `grillas/` como capa de guías, apila celdas de `celdas/` y escribe los textos con los estilos de `readme.md`.
- Para regenerar todo (por ejemplo, si cambias el margen o el medianil): `npm i playwright && node kit/build-kit.mjs`. Las constantes `MP` y `GP` están al inicio del script. Necesita conexión para cargar Geist.

## Reglas rápidas

- Pie: la última fila de todo cartel. Logo de dos columnas a la izquierda y fecha o web a la derecha; nada más entra en esa fila.
- Fondo gris claro. Una sola zona de color por pieza: azul, amarillo o naranjo. El azul es protagonista, no absoluto.
- Todo en Geist: peso 400 en palabras y 500 en números y datos.
- Fotos siempre en tinta azul con transparencia, sobre una zona lisa amarilla o naranja.
- Logo en azul sobre gris claro, amarillo y naranjo; en blanco sobre azul.
