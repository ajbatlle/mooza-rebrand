# Sistema de diseño Mooza

Mooza (mooza.cl, @mooza_cl) reúne y ordena los panoramas y eventos culturales de Chile en una agenda semanal. Este es el sistema de diseño vigente. No hay otro: lo anterior quedó fuera y solo vive en el historial de git.

La semana es la grilla: siete columnas, una por día. Cada pieza se arma sobre ella, con color plano, una sola familia tipográfica y, detrás de todo, el logo a una escala en que ya no se lee como logo.

## Contenido

- Español, con tuteo ("mira", "ven", "guarda tu plan"). Sin voseo y sin emoji.
- Directo, seco y simple. Frases cortas: la pieza dice poco y el evento dice el resto. Sin exclamaciones, sin tecnicismos y sin eslóganes.
- Titulares con mayúscula inicial y el resto en minúscula salvo nombres propios: "Agenda cultural", "Esta semana pasan cosas", "Esta semana sales".
- Nombres de evento, sala y artista con mayúscula inicial: "Cuarteto de jazz en vivo", "Bar La Otra Casa", "Alejandro Sanz".
- Etiquetas de categoría con mayúscula inicial: Música, Teatro, Danza, Letras. Los días también: "Sábado".
- Fechas: "26 oct – 1 nov", con mes abreviado en minúscula y raya corta con espacios. El rango corto grande se escribe "26–1".
- Hora en 24 horas ("21:00") y lugar con punto medio: "Teatro del Parque • 21:00".
- Precios con punto de miles y sin decimales: "$6.000", "desde $5.000". Gratis se escribe "Gratis".
- Cierre de piezas: "Toda la agenda en mooza.cl".

## Fundamentos visuales

### Grilla

Cada elemento ocupa celdas completas y ninguno comparte celdas con otro. Los seis elementos (logo, fecha, titular, número, celda y foto) están medidos en `guidelines/elementos.html`. Siete columnas. Todo se mide en porcentaje del ancho de la pieza, así que la regla sirve en cualquier formato.

| Variable | Valor | Rango |
|---|---|---|
| `--mz-m` margen | 6 | 3 a 12 |
| `--mz-g` medianil | 1,2 | 0,6 a 3,5, y como máximo la mitad del margen |
| `--mz-col` columna | (100 − 2 × margen − 6 × medianil) ÷ 7 | 11,5 con los valores estándar |
| `--mz-mv-story` | 2,2 | El margen vertical de 9:16 es 2,2 veces el margen, con tope de 18 % |

Filas por formato: 9 en 4:5, 11 en A3, 8 en 1:1, 4 en 16:9 y 16 en 9:16. Los textos grandes se miden en columnas (ver `tokens/grid.css`): al cambiar el margen o el medianil el texto se reajusta y la composición se mantiene. La grilla se muestra sobre cualquier pieza agregando `.mz-show-grid` a un contenedor.

### Color

Cinco colores planos y un gris claro. Orden de importancia: gris claro (el "blanco" de la marca, fondo de todo), azul (protagonista, pero no absoluto) y amarillo y naranjo. En cada pieza hay una sola zona de color: azul, amarillo o naranjo. En un conjunto de piezas el azul es cerca de la mitad y el resto se reparte entre amarillo y naranjo. Los colores no compiten: nunca dos zonas de color grandes en la misma pieza. No hay negro: el azul es el color más oscuro y es también la tinta de textos y logo sobre gris. Sobre azul, el texto va en blanco.

| Token | Hex | Uso |
|---|---|---|
| azul | `#1b1444` | Zona de color, tinta de textos y logo, tinta de las fotos |
| amarillo | `#fcee21` | Zona de color o acento |
| naranja | `#fbb03b` | Zona de color o acento |
| claro | `#f2f2f2` | El "blanco" de la marca: fondo de todo |
| blanco | `#ffffff` | Texto y logo sobre azul |

Cuatro tonos derivados, solo para las formas del fondo: `--mz-tono-azul`, `--mz-tono-amarillo`, `--mz-tono-naranja` y `--mz-tono-claro`. Son mezclas de la propia paleta, un paso más claras o más cálidas.

Pares de texto verificados (contraste WCAG): azul sobre gris claro 15,2, sobre amarillo 14,1 y sobre naranja 9,2. Blanco sobre azul 17,1. No usar blanco como texto sobre naranja ni naranja sobre amarillo.

Si la zona es amarilla, el acento pequeño es naranja. En los demás casos es amarillo.

### Tipografía

Una sola familia, Geist (licencia OFL, Google Fonts). La jerarquía sale del tamaño, en múltiplos del ancho de columna.

- Peso 400 en palabras: titulares, nombres de evento, sala y artista.
- Peso 500 en números, fechas, horas, precios y etiquetas, con cifras tabulares.
- Escala: número 2,2, titular 1,4, nombre 0,95, fecha en bloque 0,62, texto de lista 0,44, dato 0,28 y etiqueta 0,2. Una pieza usa tres pasos como máximo.
- Titular con tracking −0,05 em e interlínea 0,92. Etiquetas con +0,02 em.
- Sin negritas. La agenda usa un tamaño de 0,38 columnas para la hora y el nombre, porque lleva hasta tres eventos.

### Logo

El logo oficial no se redibuja. La geometría está en `kit/logo/base/` y todas las variantes (azul, blanco, amarillo y naranjo; horizontal, vertical e ícono) están en `kit/logo/`, en SVG, PNG sin fondo y PDF, y también sobre cada fondo.

- Posición: la última fila de la grilla es el pie. El logo va ahí, a la izquierda, con el ancho exacto de dos columnas. La fecha o la web va a la derecha. Nada más entra en esa fila.
- Colores: azul sobre gris claro, amarillo y naranjo; blanco sobre azul.
- Espacio libre: media altura del logo por los cuatro lados. Tamaño mínimo: 96 px de ancho en pantalla y 25 mm en impresión. Por debajo, solo el ícono, de al menos 24 px.
- No deformarlo ni girarlo, no recolorearlo fuera de la paleta, no ponerlo sobre una foto y no agregarle sombras ni efectos.

### Fondo de marca

El logo a una escala tan grande que ya no se lee como logo es la manera de comunicar de Mooza. Va siempre, detrás del texto, en todas las piezas.

1. Se usan solo las partes curvas del logo: las dos "o" juntas y el ícono. Así no aparecen letras ni diagonales.
2. Cada símbolo se ancla por un punto de interés (el centro de una "o", la lente entre las dos, un lóbulo del ícono) cerca de una esquina y se gira en múltiplos de 90°. La semilla decide cuál y dónde.
3. Las formas cruzan el límite entre la zona de color y el gris. Cada zona lleva la forma en un tono apenas distinto de su color, para que el texto no pierda contraste.
4. El borde de las formas se suaviza (1,8 en unidades de ancho de pieza) y sobre toda la pieza va un grano fino, que le da unidad y textura. Son la única excepción a la regla de "sin degradados".

En el generador va por defecto: `fondo: 'tono'`, `difuminado: 1.8` y `grano: true`. Para quitarlo, `fondo: false`. Las plantillas SVG del kit no lo llevan, porque el grano y el borde suave no viajan dentro de un SVG editable.

### Fotos

Las fotografías se muestran de un solo modo: una tinta azul con transparencia. El procedimiento, tal como está en `kit/fotos/ejemplo/procedimiento-foto-mooza.psd`: sobre la foto va una capa de relleno sólido azul `#1b1444` y su máscara de capa es el canal verde de la foto, invertido. El resultado es un PNG de un solo color con el alfa igual a 255 menos el canal verde: las sombras quedan opacas y las luces transparentes. Esa imagen se apoya sobre una zona lisa amarilla o naranja, que asoma por las luces.

Puede ir en la celda de foto (diseños `foto` y `story`, y la mitad derecha del horizontal) o a sangre en la zona de color de `titular` y `semana`; sobre una foto oscura el titular puede ir en blanco. El generador convierte una foto normal al vuelo o usa tal cual un PNG ya convertido (`foto.listo`). Para convertirla: `kit/tinta/index.html` (navegador) o `python3 kit/tinta/tinta.py foto.jpg` (por lotes). Para verla en los carteles: `guidelines/fotos.html`. Las fotos de eventos son de sus organizadores: confirma los derechos antes de publicarlas.

### Ilustración: las musas

Cuatro musas, dibujadas como grabado de línea fina en tinta azul con transparencia, flotando, sin escena ni marco: Euterpe (música), Talía (teatro), Terpsícore (danza) y Calíope (letras). Se usan solo sobre una zona de color o sobre el corte entre dos colores, nunca sobre una foto. Los dibujos y sus prompts están en `kit/ilustraciones/`.

### Poleras

Estampa en serigrafía de dos tintas sobre polera gris claro: un círculo de color, naranjo o amarillo alternados entre musas, y las líneas azules encima, en multiplicar. El círculo va en el centro de los cuatro bloques (titular arriba, categoría y nombre a los lados, logo con mooza.cl abajo) y la musa completa queda centrada entre el titular y el logo. Titular en Geist 400 y mucho blanco. Frases: "Esta semana pasan cosas." y "Esta semana sales." Capas de impresión y maquetas en `kit/poleras/`.

### Forma y movimiento

Ángulos rectos: todo es celda, así que el radio de borde es 0. No hay iconos; el único símbolo es el ícono de la marca. Transiciones de 0,15 s en estados interactivos y escala 0,98 al presionar, sin rebotes ni parallax, y todo se desactiva con la preferencia de movimiento reducido.

## Piezas

Cada pieza se parte en dos zonas, una arriba y otra abajo (en 16:9, izquierda y derecha), y cada zona dice una sola cosa. Una es gris claro y la otra lleva el color o la foto. Siempre son siete columnas y la última fila es el pie. Los constructores están en `components/grid/poster.js` y las plantillas editables en `kit/plantillas/`.

| Diseño | Qué muestra | Formatos |
|---|---|---|
| titular | Arriba, el titular sobre el color. Abajo, sobre gris, la fecha | 4:5, A3, 1:1, 16:9 |
| número | Arriba, sobre gris, el rango de la semana, enorme. Abajo, sobre el color, qué es | 4:5, A3, 1:1, 16:9 |
| foto | Arriba, la foto. Abajo, sobre gris, el nombre del evento y sus datos | 4:5, A3, 1:1, 16:9 |
| semana | Arriba, sobre el color, el titular. Abajo, sobre gris, siete días con el destacado en acento | 4:5, A3, 1:1 |
| agenda | Arriba, sobre el color, el día. Abajo, sobre gris, hasta tres eventos con una línea fina entre ellos | 4:5, A3 |
| story | Arriba, la foto apaisada de siete columnas. Abajo, sobre gris: categoría y cartelera, título, lugar, fecha y precio, una descripción de hasta tres líneas y el pie con la pestaña | 9:16 |
| story-vertical | Para fotos verticales: la foto a todo el ancho y diez filas de alto, casi un 4:5, con casi nada de recorte. Abajo, categoría y cartelera, título, lugar, fecha, precio y el pie con la pestaña | 9:16 |
| musa | Una musa cruzando el corte entre dos colores, con el logo y mooza.cl en el pie | Carta |

### Pestaña

Un aviso de una línea, como "Pregunta los detalles por DM". Es una etiqueta más baja que el logo que se ajusta al texto, de color plano y texto azul, apoyada en el margen derecho y en la misma fila del logo, así no ocupa una fila propia. Lleva el color de la foto, para que foto y aviso se lean como un solo bloque. Va en las historias y, a la izquierda y sobre el pie, en el afiche A3 de foto (`cta`).

### Fotos verticales

Las fotos son de organizadores y muchas son verticales (flyers de 4:5 y 3:4). En una celda apaisada se cortan mucho. Para historias usa `story-vertical`, que le da a la foto todo el ancho y diez filas, casi un 4:5, y pone los textos debajo. `story` queda para fotos apaisadas.

El carrusel semanal de Instagram se arma con una portada (titular), una o más láminas de agenda por día y un cierre (titular). En 16:9 la columna 4 queda sobre el centro y va vacía.

## Uso en código

```html
<link rel="stylesheet" href="styles.css">
<script src="components/grid/poster.js"></script>
<script>
  document.body.insertAdjacentHTML('afterbegin', MoozaPoster.sprite()); // símbolos del logo, una vez
  MoozaPoster.mount(document.querySelector('#cartel'), 'semana');       // con los datos de ejemplo
  // MoozaPoster.mount(el, 'story', { story: { categoria: 'Teatro', titulo: '…', meta: '…' } });
</script>
```

Los datos tienen la forma de `MoozaPoster.EJEMPLO`. Los eventos, salas y precios de ejemplo son inventados. Opciones y detalles en `components/grid/README.md`.

## Índice de archivos

| Ruta | Contenido |
|---|---|
| `styles.css` | Punto de entrada: importa tokens y componentes |
| `tokens/` | `colors.css`, `typography.css`, `grid.css` y `tokens.json` |
| `components/grid/` | Estilos y generador de piezas, con vista previa y auditoría |
| `components/ui/` | Botón, filtro, campo, fecha, precio y fila de evento |
| `components/tinta/` | Fotos en tinta azul con transparencia, para canvas y como filtro SVG |
| `guidelines/index.html` | Referencia navegable del sistema, con la grilla ajustable |
| `guidelines/elementos.html` | Los seis elementos: tamaño, posición y qué pueden tocar |
| `guidelines/fotos.html` | Probar fotos en los carteles y descargar la tinta |
| `caso-de-estudio/` | La presentación del rebrand, en página y en PDF |
| `kit/` | La entrega de recursos gráficos: logo, plantillas, fondos, grillas, celdas, ilustraciones, poleras y fotos, en SVG, PNG y PDF. Ver `kit/README.md` |
