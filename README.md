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

Las capturas originales van en `ui/<Proyecto>/*.png` (esa carpeta no se versiona,
pesa demasiado). Para procesarlas:

```bash
node scripts/process-ui.mjs
```

Genera WebP optimizados en `public/ui/<proyecto>/` más un manifiesto con
dimensiones y `blurDataURL`. El nombre de la carpeta se convierte en la clave que
`content/projects.ts` consume con `group('<proyecto>')`.

Un proyecto con capturas se muestra en formato ancho con visor; uno sin capturas
cae automáticamente a la reja compacta. Al agregar capturas, se promueve solo.

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
