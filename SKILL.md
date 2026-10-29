---
name: mooza-design
description: Genera piezas con la marca Mooza, plataforma de eventos culturales de Chile (mooza.cl). Contiene el sistema de diseño vigente: grilla de siete días, color plano, Geist, fondo de logo a gran escala, fotos en tinta azul y las cuatro musas.
user-invocable: true
---

Lee `readme.md` y revisa `guidelines/index.html` antes de diseñar. Este es el único sistema vigente.

Si haces piezas visuales (carteles, stories, maquetas), parte de `kit/plantillas/` (con y sin fondo de marca) o usa `MoozaPoster` (`components/grid/poster.js`). Importa `styles.css` para color, tipo y grilla. Los tokens están en `tokens/` y los componentes de interfaz en `components/ui/`.

Decisiones de la marca:
- Regla de base: cada elemento ocupa celdas completas y ninguno comparte celdas con otro. Corre `components/grid/auditoria.mjs` después de cambiar un diseño.
- La semana es la grilla: siete columnas. Margen 6 % y medianil 1,2 % del ancho como estándar (margen de 3 a 12 %, medianil de 0,6 a 3,5 % y como máximo la mitad del margen).
- Color: gris claro `#f2f2f2` de fondo, azul `#1b1444` como color principal (no absoluto) y amarillo `#fcee21` y naranjo `#fbb03b`. Una sola zona de color por pieza. No hay negro. Texto y logo azules sobre gris y blancos sobre azul.
- Una sola familia, Geist: peso 400 en palabras y 500 en números y datos. La jerarquía sale del tamaño. Titulares con mayúscula inicial: "Agenda cultural".
- Fondo de marca: el logo a gran escala, tono sobre tono, con borde suave y grano, detrás de todo y siempre. Es la manera de comunicar de Mooza (`fondo: false` solo para plantillas editables).
- Formatos: 4:5, A3, 1:1, 9:16 y 16:9, todos con siete columnas. Pie: la última fila, con el logo de dos columnas a la izquierda y fecha o web a la derecha.
- Historias: `story` para fotos apaisadas y `story-vertical` para fotos verticales (no se cortan). Pestaña de aviso: una etiqueta de una línea, del alto del logo, en la fila del logo y con el color de la foto.
- Logo: nunca redibujado, con media altura de espacio libre y 96 px de ancho mínimo.
- Ángulos rectos. Sin iconos.
- Fotos: una sola manera. Tinta azul con transparencia sobre una zona lisa amarilla o naranja (`kit/tinta/`, `guidelines/fotos.html`).
- Ilustración: las cuatro musas (Euterpe, Talía, Terpsícore y Calíope), grabado de línea fina en tinta azul, sin escena ni marco (`kit/ilustraciones/`).
- Poleras: estampa de dos tintas sobre gris claro, con círculo naranjo o amarillo (`kit/poleras/`).
- Español con tuteo, directo y seco, sin voseo, emoji ni eslóganes. "Gratis", "$6.000", hora en 24 horas, "26 oct – 1 nov".

Si te invocan sin más indicaciones, pregunta qué pieza hay que hacer y para qué formato.
