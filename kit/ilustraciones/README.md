# Ilustraciones: las cuatro musas

Euterpe (música), Talía (teatro), Terpsícore (danza) y Calíope (letras). Grabado de línea fina, un solo personaje flotando en S, sin escena ni marco. Se hicieron con los prompts de `prompts-chatgpt.md`.

- `originales/`: los dibujos tal como llegaron (`Euterpe.png`, `Talia.png`, `Terpsicore.png`, `Caliope.png`), con transparencia, y `musas.svg`, la composición de las cuatro láminas en carta.
- `sin-fondo/png/`: los mismos dibujos en el azul `#1b1444`, con transparencia y el alfa residual limpiado. Son los que usa el generador. `sin-fondo/pdf/` tiene los mismos en PDF.
- `laminas/png/` y `laminas/pdf/`: cada musa en lámina carta sobre dos colores, con el logo y mooza.cl en el pie.

Las musas son dibujos de píxeles (PNG): no existe una versión vectorial. Para un SVG hay que vectorizarlas, por ejemplo con "Calco de imagen" en Illustrator, y conviene hacerlo partiendo de las imágenes originales de mayor resolución.

Reglas: una musa por pieza, solo sobre una zona de color o sobre el corte entre dos colores, nunca sobre una foto. La tinta es transparente, así que el color de atrás pasa por la figura.

La lámina con el logo y mooza.cl se genera con `MoozaPoster.mount(el, 'musa', {musa: {src: 'sin-fondo/png/Euterpe.png', colores: ['gris', 'amarillo'], corte: 'v', x: 16.3, y: 8.2}}, 'carta')`.

## Viñetas

Tres frisos horizontales opcionales, en el mismo grabado pero más livianos: la cinta (cuándo), el telón (empieza la función) y el público (ir con otros). Los prompts están en `prompts-vinetas.md`.

- `vinetas/originales/`: los dibujos tal como salieron de ChatGPT, negro sobre blanco (`cinta.png`, `telon.png`, `publico.png`).
- `vinetas/sin-fondo/`: los mismos en el azul `#1b1444`, con transparencia y recortados a la franja del dibujo, de 2000 px de ancho. Son los que usa el generador.

Reglas: una por lámina de cartelera, a sangre, abajo sobre el gris o en un banner amarillo o naranjo. Nunca sobre banner azul ni sobre texto. Se piden con `datos.cartelera.vineta = {src, alt, en, ancla}`.
