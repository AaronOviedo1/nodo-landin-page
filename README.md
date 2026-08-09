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

Los archivos llegan en estados incompatibles entre sí, así que el tratamiento se
declara por proyecto en `content/projects.ts` (campo `treatment`):

| Valor | Cuándo |
|---|---|
| `invert` | Arte negro sobre transparente |
| `plate` | Arte a color o sobre fondo claro; lleva placa Cal detrás |
| `raw` | Ya se ve bien sobre Grafito |
| `screen` | Arte claro sobre fondo oscuro sólido |
| `type` | No hay archivo; se compone un marcador tipográfico |

El logo de HAACO venía sobre verde sólido y se normalizó con
`node scripts/fix-haaco-logo.mjs`, que convierte la luminancia en canal alfa.

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
