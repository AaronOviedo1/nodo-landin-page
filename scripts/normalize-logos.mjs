/**
 * Normaliza los logos de clientes para fondo Grafito.
 *
 * Dos pasos, ambos opcionales por logo:
 *   1. Recorte de fondo — detecta el color sólido de las esquinas y lo vuelve
 *      transparente, con transición suave para no dejar bordes dentados.
 *   2. Aclarado de tonos oscuros — el arte muy oscuro (negros, azules marinos)
 *      es ilegible sobre Grafito, así que se lleva hacia Cal. Los colores vivos
 *      —el naranja de holidog, los rojos y azules de Miika— se conservan
 *      intactos porque su luminancia es alta.
 *
 * Correr con: node scripts/normalize-logos.mjs
 */
import sharp from 'sharp'
import { join } from 'node:path'

const SRC = join(process.cwd(), 'logos-clientes')
const OUT = join(process.cwd(), 'public', 'logos')

const CAL = { r: 0xec, g: 0xee, b: 0xf1 }

/** Por debajo de esta luminancia el arte empieza a llevarse hacia Cal. */
const DARK_START = 0.52
/** Por debajo de esta, se sustituye por Cal por completo. */
const DARK_FULL = 0.2

const JOBS = [
  {
    src: 'holidog inn.png',
    out: 'holidog-inn.png',
    // Fondo gris claro sólido; el azul marino del wordmark necesita aclararse.
    removeBackground: true,
    tolerance: 42,
    lightenDark: true,
    // El azul marino es tan oscuro que con el umbral general quedaba gris
    // apagado junto a COS; aquí se lleva a Cal pleno sin tocar el naranja.
    darkStart: 0.62,
    darkFull: 0.36,
  },
  {
    src: 'fundacion Miika.png',
    out: 'fundacion-miika.png',
    // Fondo blanco; "Fundación" y "donando esperanzas" van en negro.
    removeBackground: true,
    tolerance: 40,
    lightenDark: true,
  },
  {
    src: 'cos-logo2.png',
    out: 'cos-arquitectura.png',
    // Ya viene sobre transparente, pero todo el arte es negro.
    removeBackground: false,
    lightenDark: true,
  },
  {
    src: 'fresa fit.png',
    out: 'fresa-fit.png',
    removeBackground: false,
    lightenDark: true,
  },
  {
    src: 'HD_sinFondo.png',
    out: 'climaxpress.png',
    // El círculo azul ya se lee bien sobre Grafito; tocarlo lo empeoraría.
    removeBackground: false,
    lightenDark: false,
  },
  {
    src: 'hacco construcciones.png',
    out: 'haaco-pro.png',
    // Caso aparte: arte blanco sobre un verde oscuro sólido. Recortar por
    // cercanía al fondo destruiría el antialiasing, así que la luminancia se
    // convierte en canal alfa y el resultado se tiñe de Cal.
    luminanceToAlpha: true,
  },
]

const clamp01 = (v) => Math.min(1, Math.max(0, v))

/** Interpolación suave entre dos umbrales. */
const smoothstep = (edge0, edge1, x) => {
  const t = clamp01((x - edge0) / (edge1 - edge0))
  return t * t * (3 - 2 * t)
}

/** Arte claro sobre fondo oscuro sólido: la luminancia pasa a ser el alfa. */
async function luminanceToAlpha(job) {
  const src = join(SRC, job.src)
  const dest = join(OUT, job.out)

  const { width, height } = await sharp(src).metadata()
  if (!width || !height) throw new Error(`Sin dimensiones: ${job.src}`)

  const alpha = await sharp(src)
    .flatten({ background: '#000000' })
    .greyscale()
    .normalise()
    .linear(1.35, -40)
    .toColourspace('b-w')
    .raw()
    .toBuffer()

  await sharp({ create: { width, height, channels: 3, background: CAL } })
    .joinChannel(alpha, { raw: { width, height, channels: 1 } })
    .trim({ threshold: 1 })
    .png({ compressionLevel: 9 })
    .toFile(dest)

  const meta = await sharp(dest).metadata()
  console.log(
    `${job.src} → public/logos/${job.out} (${meta.width}×${meta.height}, luminancia a alfa, arte en Cal)`,
  )
}

async function normalize(job) {
  if (job.luminanceToAlpha) return luminanceToAlpha(job)

  const src = join(SRC, job.src)
  const { data, info } = await sharp(src)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const { width, height, channels } = info
  const px = (x, y) => (y * width + x) * channels

  // Color de fondo: se toma de las esquinas, que es donde nunca hay arte.
  let bg = null
  if (job.removeBackground) {
    const corners = [
      [0, 0],
      [width - 1, 0],
      [0, height - 1],
      [width - 1, height - 1],
    ].map(([x, y]) => {
      const i = px(x, y)
      return { r: data[i], g: data[i + 1], b: data[i + 2], a: data[i + 3] }
    })

    if (corners.every((c) => c.a > 250)) {
      bg = {
        r: Math.round(corners.reduce((s, c) => s + c.r, 0) / 4),
        g: Math.round(corners.reduce((s, c) => s + c.g, 0) / 4),
        b: Math.round(corners.reduce((s, c) => s + c.b, 0) / 4),
      }
    }
  }

  for (let i = 0; i < data.length; i += channels) {
    let r = data[i]
    let g = data[i + 1]
    let b = data[i + 2]
    let a = data[i + 3]

    if (bg) {
      const dist = Math.hypot(r - bg.r, g - bg.g, b - bg.b)
      // Dentro de la tolerancia desaparece; en el borde se desvanece.
      const keep = smoothstep(job.tolerance * 0.45, job.tolerance, dist)
      a = Math.round(a * keep)
    }

    if (job.lightenDark && a > 0) {
      const lum = Math.max(r, g, b) / 255
      const lift =
        1 - smoothstep(job.darkFull ?? DARK_FULL, job.darkStart ?? DARK_START, lum)
      if (lift > 0) {
        r = Math.round(r + (CAL.r - r) * lift)
        g = Math.round(g + (CAL.g - g) * lift)
        b = Math.round(b + (CAL.b - b) * lift)
      }
    }

    data[i] = r
    data[i + 1] = g
    data[i + 2] = b
    data[i + 3] = a
  }

  const dest = join(OUT, job.out)
  await sharp(data, { raw: { width, height, channels } })
    .trim({ threshold: 1 }) // recorta el vacío que deja el fondo eliminado
    .png({ compressionLevel: 9 })
    .toFile(dest)

  const meta = await sharp(dest).metadata()
  console.log(
    `${job.src} → public/logos/${job.out} (${meta.width}×${meta.height}` +
      `${bg ? `, fondo rgb(${bg.r},${bg.g},${bg.b}) eliminado` : ''}` +
      `${job.lightenDark ? ', oscuros a Cal' : ''})`,
  )
}

for (const job of JOBS) await normalize(job)
