# nodo. — landing page

Sitio de **nodo.**, estudio de software a la medida en Hermosillo, Sonora.
Next.js 16 (App Router) · TypeScript · Tailwind v4 · Motion · Three.js.

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de producción
```

## Sistema de diseño

Los tokens salen del manual de identidad y viven en `app/globals.css` como
`@theme` de Tailwind. **No se inventan colores ni tamaños fuera de ahí.**

| Token | Valor | Uso |
|---|---|---|
| `grafito` | `#131619` | Fondo base, 70% de cualquier pieza |
| `concreto` | `#1B1F25` | Superficies y tarjetas |
| `acero` | `#2E353F` | Bordes y retícula de 1px |
| `humo` | `#8A929E` | Texto secundario |
| `cal` | `#ECEEF1` | Texto principal |
| `senal` | `#FFC400` | Acento único, **máximo 5% del área** |
| `oxido` | `#D0451B` | Solo errores, nunca decorativo |

Dos reglas que no se rompen:

- Grafito ocupa el 70% de cualquier pieza.
- Señal nunca pasa del 5% del área. Hoy se usa en: el punto del wordmark, el
  cuadro que cierra el titular, los botones de WhatsApp, los badges "en
  desarrollo", el indicador del visor de capturas y un puñado de nodos del hero.

El wordmark es **tipografía viva**, no una imagen: se compone en HTML con
Archivo (`wdth 116`, `wght 800`, tracking `-4.5%`) en `components/ui/Wordmark.tsx`.
Nunca usar el PNG del logotipo.

## Contenido

Todo el texto vive en `content/` y está en español e inglés. Para cambiar un
copy no hace falta tocar un componente.

| Archivo | Qué contiene |
|---|---|
| `content/copy.ts` | Todos los textos de la interfaz, ES y EN |
| `content/projects.ts` | Los 8 proyectos, sus capacidades y el tratamiento de cada logo |
| `content/faq.ts` | Preguntas frecuentes |
| `content/shots.generated.json` | Generado — no editar a mano |

El número de WhatsApp y el correo están centralizados en `lib/whatsapp.ts`.
Cambiarlos ahí los cambia en toda la página.

## Capturas de las apps

Las capturas originales van en `ui/` (esa carpeta no se versiona, pesa
demasiado). Para procesarlas:

```bash
node scripts/process-ui.mjs
```

Genera WebP optimizados en `public/ui/<proyecto>/<superficie>/` más un manifiesto
con dimensiones y `blurDataURL`, que `content/projects.ts` consume con
`group('<proyecto>')`.

### Superficies

Un proyecto puede tener varias **superficies**: las interfaces que se muestran a
la par en la tarjeta. holidog inn son tres aplicaciones distintas (`tienda`,
`admin`, `movil`); el resto suele ser `escritorio` + `movil`. Todas rotan solas
cada 2 segundos, en paralelo, y se pausan al pasar el cursor o al salir de
pantalla.

La clasificación vive en `CLASSIFY`/`classify()` dentro del script y es **el único
lugar a tocar** cuando lleguen capturas nuevas. Hoy descarta las pantallas de
acceso y las versiones de página completa. Las etiquetas visibles de cada
superficie están en `content/copy.ts` bajo `projects.surfaces`, en ambos idiomas.

Reglas de presentación, todas automáticas:

- Un proyecto sin capturas cae a la reja compacta; al agregarle capturas se
  promueve solo a destacado.
- Un proyecto con **más de una** superficie de escritorio se lleva el ancho
  completo de la fila, porque dos ventanas apiladas harían la tarjeta más alta
  que la pantalla.
- Las capturas móviles reciben un marco de teléfono dibujado en CSS, salvo las
  que ya traen el suyo (`framed: true`).
- Con más de 8 capturas los puntos se sustituyen por una barra de avance y un
  contador.

## Confidencialidad de las capturas

Las apps de Fresa Fit y HAACO muestran datos reales de sus negocios: importes de
ingresos y egresos, márgenes por obra y nombres de clientes. Nada de eso puede
publicarse. Antes de procesar las capturas:

```bash
node scripts/redact-shots.mjs   # ui/ → ui-redactado/
node scripts/process-ui.mjs     # publica desde ui-redactado/ cuando existe
```

`REDACTION` en el script decide, por proyecto:

- **`include`** — lista blanca. Lo que no aparece ahí no se copia y por tanto no
  llega al sitio. Los módulos que *son* dinero (finanzas, nómina, cobranza,
  reportes, métricas, el listado de obras) quedan fuera enteros: redactados al
  nivel que exigen no enseñan producto, solo censura.
- **`ocr`** — `digits` tapa cualquier token con un dígito; `money`, solo los
  importes. HAACO usa `digits` porque toda su interfaz es dinero; Fresa Fit usa
  `money` porque sus pantallas de finanzas ya quedaron fuera, y tapar todo dígito
  pixelaba hasta los días del calendario.
- **`regions`** — rectángulos en fracciones del ancho y alto para lo que el OCR
  no sabe clasificar: nombres de personas. Con `fill: true` se rellenan con el
  color muestreado del fondo en vez de pixelarse, que sobre un panel liso se nota
  menos.

El OCR corre en varias pasadas sobre su propio resultado y al final vuelve a
revisar; si algo sobrevive, lo avisa por consola. **Aun así hay que mirar las
imágenes**: en las pruebas el OCR no detectó dos montos que estaban a la vista,
y por eso la lista blanca —no el difuminado— es la defensa principal.

`process-ui.mjs` publica desde `ui-redactado/` para cualquier proyecto que tenga
carpeta ahí, y **descarta** las capturas de `ui/` que no tengan equivalente
redactado. Al agregar capturas nuevas de estos dos clientes hay que sumarlas a
`include`, o no se publicarán.

## Logos de clientes

Los originales llegan en estados incompatibles entre sí —fondos sólidos, arte
negro, arte blanco sobre verde— y ninguno funciona tal cual sobre Grafito. En
vez de parchear cada caso con filtros CSS, se normalizan de raíz:

```bash
node scripts/normalize-logos.mjs
```

El script lee de `logos-clientes/` y escribe en `public/logos/`. Por logo aplica
lo que haga falta: quitar el fondo sólido (detectado en las esquinas, con borde
suave), llevar los tonos oscuros hacia Cal conservando los colores vivos, o
—para HAACO, que viene sobre verde sólido— convertir la luminancia en canal
alfa. Al final recorta el vacío sobrante.

Con eso, `treatment` en `content/projects.ts` solo distingue dos casos:

| Valor | Cuándo |
|---|---|
| `raw` | Hay archivo y ya está listo para fondo Grafito |
| `type` | No hay archivo; se compone un marcador tipográfico en Archivo |

`logoWidth` nivela el peso óptico entre logos de proporciones muy distintas;
está calibrado para que todos ronden los 40px de alto.

## Hero WebGL

`components/hero/` contiene la escena: las partículas arrancan dispersas y se
ordenan en retícula conectada durante los primeros ~3 segundos.

Guardas de rendimiento en `Hero.tsx`:

- El canvas se carga con `ssr: false` y nunca bloquea el LCP.
- Con `prefers-reduced-motion: reduce` o sin WebGL no se monta: entra un respaldo
  estático con la retícula y el isotipo.
- Con ≤4 núcleos o menos de 768px de ancho baja a 70 partículas y sin líneas.
- Fuera del viewport deja de dibujar.

Detalle importante: los uniforms se mutan a través de un `ref` al material
(`pointsMat.current.uniforms`), **no** del objeto que se pasa como prop. r3f no
garantiza conservar esa referencia y mutando el objeto externo los valores nunca
llegan a la GPU.

## Despliegue

Vercel, desde la rama `main`. La URL canónica se controla con la variable
`NEXT_PUBLIC_SITE_URL` (ver `lib/site.ts`); afecta metadata, OG, sitemap y robots.
