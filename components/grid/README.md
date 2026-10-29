# Cartel sobre grilla

Genera los ocho diseños de Mooza sobre la grilla de siete columnas. Los estilos están en `grid.css` y el generador en `poster.js`. Requiere `styles.css` (tokens de color, tipo y grilla).

## API

```js
MoozaPoster.sprite()                        // texto SVG con el símbolo del logo (#mz-lockup). Insértalo una vez.
MoozaPoster.html(diseno, datos?, formato?)           // devuelve el HTML interno del cartel
MoozaPoster.mount(elemento, diseno, datos?, formato?) // agrega .mz-poster, la clase del diseño y la proporción, y escribe el HTML
MoozaPoster.FORMATOS                         // proporción y alto relativo de cada formato
MoozaPoster.ROWS                             // filas por diseño y formato
MoozaPoster.EJEMPLO                         // datos de ejemplo
```

Diseños: `titular`, `numero`, `foto`, `semana`, `agenda`, `story`, `story-vertical` y `musa`.

Formatos (tercer parámetro, `4x5` por defecto y `9x16` para story):

| Diseño | Formatos |
|---|---|
| titular, numero, foto | `4x5`, `a3`, `1x1`, `16x9` |
| semana | `4x5`, `a3`, `1x1` |
| agenda | `4x5`, `a3` |
| story, story-vertical | `9x16` |
| musa | `carta` |

Un diseño que no existe en un formato lanza un error.

## Datos

Los campos que no pases se toman de `MoozaPoster.EJEMPLO`: `color` (la zona de color: `azul`, `amarillo` o `naranja`; cada diseño tiene el suyo por defecto: titular azul, número amarillo, semana naranja y agenda amarillo; el texto sobre amarillo y naranjo va en azul), `rango`, `corto`, `titular`, `dias` y `diaDestacado` (semana), `evento` (foto), `agenda` (`dia`, `n`, `pag` y hasta tres `eventos` con `h`, `t`, `v`, `p`, `f`) y `story`.

## Historias y pestaña

`story` y `story-vertical` toman estos campos de `datos.story`: `categoria`, `cartelera` (la colección, desde la columna 5, a la derecha de la categoría), `titulo`, `lugar`, `fecha`, `precio`, `descripcion` (hasta tres líneas; sin ella, la foto de `story` gana una fila) y `cta` (el texto de la pestaña). `meta` sigue funcionando como texto libre de tres líneas.

- Las dos historias cuelgan de dos anclas: la columna 1 (categoría, título, lugar) y la columna 5 (cartelera, fecha y precio). La foto ocupa las siete columnas.
- `story`: foto apaisada de ocho filas (nueve si no hay descripción), con la descripción bajo los datos.
- `story-vertical`: foto de once filas, casi un 4:5, con los mismos textos pero sin descripción. También se activa con `datos.foto.vertical: true`.
- La pestaña es una etiqueta de una línea, del alto del logo, que se ajusta al texto y se apoya en el margen derecho, en la misma fila del logo. Su color es el de la foto; `datos.story.ctaColor` lo cambia. En el afiche A3 de `foto` va a la izquierda, sobre el pie, y se activa con `datos.cta`.

## Reglas

- La grilla usa `--mz-m` (margen) y `--mz-g` (medianil) del contenedor o de `:root`. Cámbialos en un ancestro para ajustar los carteles.
- Los titulares y números se miden en columnas, no en px.
- La foto ocupa celdas completas y nunca llega al borde.
- Agrega `.mz-show-grid` a un ancestro para ver la grilla.

## Auditoría

`node components/grid/auditoria.mjs` (requiere Playwright) monta cada diseño en cada formato con cinco combinaciones de margen y medianil, mide la tinta real de los textos y avisa si el logo choca con algo, se sale del margen o queda desalineado con la fecha, y si un texto se sale de su celda o toca una foto, un bloque o una celda. Termina con error si encuentra problemas. Córrelo después de tocar `poster.js` o `grid.css`.

## Fotos

`MoozaPoster.mount(el, 'foto', {foto: {src: 'evento.jpg', pos: '50% 30%', color: 'naranja', alt: '...'}}, '4x5')` pone la foto en la celda de foto (diseños `foto` y `story`). Una foto normal se convierte al vuelo a tinta azul con transparencia (filtro `#mz-tinta`); con `listo: true` se usa tal cual un PNG ya convertido. `color` es la zona lisa de atrás (`amarillo` o `naranja`) y `pos`, el punto de enfoque del recorte. En `titular` y `semana`, `foto` va a sangre en la zona de color, y `texto: 'blanco'` pone el titular en blanco sobre una foto oscura. Para probar fotos propias sin escribir código: `guidelines/fotos.html`.

## Color por pieza

`MoozaPoster.mount(el, 'titular', {color: 'amarillo'})` cambia la zona de color de esa pieza (`azul`, `amarillo` o `naranja`). El texto se ajusta solo.

## Fondo de marca

Va por defecto en todos los diseños: el logo a gran escala, tono sobre tono, con borde suave y grano. Opciones: `fondo: false` lo quita, `semilla` (número) cambia la composición, `difuminado` (1,8 por defecto, en unidades de ancho de pieza; 0 lo deja nítido) y `grano` (`true`, o un número de 0 a 2 para la fuerza; `false` lo quita). `MoozaPoster.fondoLogo(formato, semilla)` entrega las posiciones de las formas para otros soportes, como las poleras.

El procedimiento y los tonos (`--mz-tono-*`) están en `readme.md`. El grano y el borde suave son filtros SVG: se ven en el navegador y al exportar a imagen, y no viajan dentro de las plantillas SVG editables, que se generan con `fondo: false`.

## Lámina de musa

`MoozaPoster.mount(el, 'musa', {musa: {src: 'euterpe.png', colores: ['gris', 'amarillo'], corte: 'v', x: 16.3, y: 8.2}}, 'carta')` pone una musa cruzando el corte entre dos colores, con el pie de siempre: el logo de dos columnas a la izquierda y mooza.cl a la derecha. Formato `carta` (612 × 792).

La ilustración es una tinta azul con transparencia (`kit/ilustraciones/sin-fondo/png/`), así el color pasa por la figura. `corte` es `'v'` (izquierda y derecha) o `'h'` (arriba y abajo). `colores` va en el mismo orden. `x` e `y` son la esquina superior izquierda de la ilustración, en % del ancho y del alto; `ancho` es su ancho en %.
