/**
 * Oculta información confidencial en las capturas antes de publicarlas.
 *
 * Las apps de los clientes muestran datos reales: importes de ingresos y
 * egresos, márgenes de utilidad y nombres de personas. Nada de eso puede salir
 * en la landing —lo que vende una captura es la interfaz, no los números—, así
 * que aquí se difuminan.
 *
 * Dos mecanismos, porque uno solo no basta:
 *   1. OCR sobre la imagen para encontrar y tapar cualquier cifra: importes,
 *      porcentajes y cantidades. Cubre las tablas y los tableros completos.
 *   2. Regiones declaradas a mano en REDACTION, en fracciones del ancho y alto,
 *      para lo que el OCR no puede clasificar: columnas de clientes y el nombre
 *      del usuario en la barra lateral.
 *
 * Lee de `ui/` y escribe en `ui-redactado/` con la misma estructura.
 * `process-ui.mjs` prefiere esa versión cuando existe.
 *
 * Correr con: node scripts/redact-shots.mjs
 */
import { readdir, mkdir, stat, readFile, writeFile } from 'node:fs/promises'
import { join, dirname, relative, sep, extname } from 'node:path'
import sharp from 'sharp'
import { createWorker } from 'tesseract.js'

const ROOT = process.cwd()
const SRC = join(ROOT, 'ui')
const OUT = join(ROOT, 'ui-redactado')
const CACHE_FILE = join(ROOT, 'ui-redactado', '.ocr-cache.json')

const EXTS = new Set(['.png', '.jpg', '.jpeg'])

/** Pasadas de OCR sobre el resultado. Una sola deja cifras sin detectar. */
const MAX_PASSES = 6

/**
 * Qué proyectos se redactan y qué regiones fijas lleva cada uno.
 * Las claves de `regions` se comparan contra el final de la ruta; `*` aplica a
 * todas las capturas de ese proyecto. Coordenadas en fracciones [0..1].
 */
/**
 * Qué se publica de cada proyecto sensible y qué se tapa.
 *
 * `include` es una lista blanca: lo que no está aquí no se copia y por tanto no
 * llega al sitio. Se eligió así porque en estas dos apps casi toda pantalla
 * muestra dinero, y depender solo del difuminado es frágil —el OCR no detecta
 * el 100% de las cifras, comprobado—. Los módulos que *son* dinero (finanzas,
 * nómina, cobranza, métricas, reportes) quedan fuera por completo: redactados
 * no enseñarían nada y el riesgo no se compensa.
 *
 * `regions` son fracciones [0..1] del ancho y alto, medidas sobre cada captura.
 */
const REDACTION = {
  'hacco construcciones': {
    // Sistema de dinero de punta a punta: se tapa cualquier dígito.
    ocr: 'digits',
    // Solo Precios. El listado de obras, redactado al nivel que exige (importes,
    // márgenes, clientes y hasta el nombre de la obra, que suele ser el del
    // cliente) queda tan tapado que no enseña producto, solo censura.
    include: ['escritorio/precios.png', 'movil/precios.png'],
    regions: {
      // Nombre y puesto del director, al pie de la barra lateral. Va con
      // relleno sólido y no pixelado: sobre un fondo plano, un bloque pixelado
      // se nota más que lo que oculta.
      'escritorio/precios.png': [
        { x: 0, y: 0.888, w: 0.198, h: 0.062, fill: true },
        // Lista de materiales con precios pegada del proveedor.
        { x: 0.23, y: 0.475, w: 0.36, h: 0.06 },
      ],
      'movil/precios.png': [{ x: 0.02, y: 0.3, w: 0.96, h: 0.35 }],
    },
  },
  fresafit: {
    // Aquí no entra ninguna pantalla de finanzas, así que basta con tapar los
    // importes. Tapar todo dígito pixelaba hasta los días del calendario y
    // dejaba la captura sucia sin ganar nada.
    ocr: 'money',
    include: [
      'desktop/03-inventario.png',
      'desktop/04-tareas-calendario.png',
      'desktop/05-tareas-tablero.png',
      'desktop/06-tareas-tabla.png',
      'desktop/10-bodega.png',
      'movil/02-tareas.png',
      'movil/03-menu.png',
      'movil/05-inventario.png',
      'movil/09-bodega.png',
    ],
    regions: {},
  },
}

/**
 * Qué token del OCR se considera confidencial, según el modo del proyecto.
 *
 * `digits` tapa cualquier cosa con un dígito. Es deliberadamente burdo: afinar
 * la regla a "importes y porcentajes" dejó pasar dos montos reales, porque el
 * OCR no siempre segmenta igual y el fallo no se ve hasta revisar imagen por
 * imagen. Donde toda la pantalla es dinero, el error caro es dejar una cifra
 * fuera, no tapar una fecha de más.
 *
 * `money` se reserva para proyectos cuyas pantallas de finanzas ya quedaron
 * fuera por la lista blanca: ahí solo estorban los precios sueltos.
 */
function isSensitive(text, mode) {
  if (mode === 'money') return /[$€]/.test(text)
  return /\d/.test(text)
}

async function collect(dir, acc = []) {
  const entries = await readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) await collect(full, acc)
    else if (EXTS.has(extname(entry.name).toLowerCase()) && !entry.name.startsWith('.')) {
      acc.push(full)
    }
  }
  return acc
}

/** Todas las palabras del OCR, aplanando la jerarquía de bloques. */
function flattenWords(blocks) {
  const words = []
  const walk = (node) => {
    if (!node) return
    if (Array.isArray(node)) return node.forEach(walk)
    if (node.words) words.push(...node.words)
    for (const key of ['blocks', 'paragraphs', 'lines']) {
      if (node[key]) walk(node[key])
    }
  }
  walk(blocks)
  return words
}

function regionsFor(project, relPath) {
  const config = REDACTION[project]
  if (!config?.regions) return []
  const out = []
  for (const [pattern, rects] of Object.entries(config.regions)) {
    if (pattern === '*' || relPath.endsWith(pattern)) out.push(...rects)
  }
  return out
}

async function main() {
  let cache = {}
  try {
    cache = JSON.parse(await readFile(CACHE_FILE, 'utf8'))
  } catch {
    // Primera corrida.
  }

  const files = (await collect(SRC)).sort()
  let excluded = 0
  const targets = files.filter((f) => {
    const rel = relative(SRC, f).split(sep).join('/')
    const project = Object.keys(REDACTION).find((p) => rel.startsWith(`${p}/`))
    if (!project) return false
    const inner = rel.slice(project.length + 1)
    const include = REDACTION[project].include
    if (include && !include.includes(inner)) {
      excluded++
      return false
    }
    return true
  })

  if (targets.length === 0) {
    console.log('Nada que redactar.')
    return
  }

  console.log(`Redactando ${targets.length} capturas (${excluded} descartadas por mostrar dinero)…\n`)
  const worker = await createWorker('spa')
  const leaks = []

  for (const file of targets) {
    const rel = relative(SRC, file).split(sep).join('/')
    const project = Object.keys(REDACTION).find((p) => rel.startsWith(`${p}/`))
    const inner = rel.slice(project.length + 1)

    const { width, height } = await sharp(file).metadata()
    if (!width || !height) continue

    /** Cajas confidenciales que el OCR encuentra en un buffer dado. */
    const findBoxes = async (buffer, pass) => {
      const key = `${rel}:${width}x${height}:${REDACTION[project].ocr}:p${pass}`
      if (!cache[key]) {
        const { data } = await worker.recognize(buffer, {}, { blocks: true })
        // Sin filtro de confianza: dejar pasar una cifra por dudarla es peor
        // que difuminar un par de zonas de más.
        cache[key] = flattenWords(data.blocks)
          .filter((w) => isSensitive(w.text, REDACTION[project].ocr))
          .map((w) => ({
            x0: Math.round(w.bbox.x0),
            y0: Math.round(w.bbox.y0),
            x1: Math.round(w.bbox.x1),
            y1: Math.round(w.bbox.y1),
          }))
      }
      return cache[key].map((b) => {
        // Se ensancha: el OCR recorta justo y quedan bordes legibles.
        const padX = Math.max(5, (b.x1 - b.x0) * 0.1)
        const padY = Math.max(5, (b.y1 - b.y0) * 0.35)
        return {
          left: Math.max(0, Math.round(b.x0 - padX)),
          top: Math.max(0, Math.round(b.y0 - padY)),
          width: Math.min(width, Math.round(b.x1 - b.x0 + padX * 2)),
          height: Math.min(height, Math.round(b.y1 - b.y0 + padY * 2)),
        }
      })
    }

    /**
     * Pixela cada zona por separado. Un blur sobre la imagen entera parecía más
     * simple, pero arrastra píxeles de fuera de la caja: sobre la barra lateral
     * verde dejaba manchas claras con el blanco de al lado. El pixelado se
     * calcula solo con lo que hay dentro del recorte, así que no sangra, y al
     * reducir a unos pocos píxeles el texto es irrecuperable.
     */
    const applyRedaction = async (buffer, boxes) => {
      const patches = []
      for (const b of boxes) {
        if (b.fill) {
          // El color se muestrea en un cuadrito del margen izquierdo, justo
          // debajo del bloque: ahí no hay texto ni bordes. Promediar una franja
          // ancha daba gris, porque arrastraba el filo claro del panel.
          const sampleTop = Math.min(height - 10, b.top + b.height + 6)
          // El recorte se materializa antes de medir: stats() se calcula sobre
          // la imagen de entrada del pipeline, no sobre el extract encadenado,
          // así que sin este paso devolvía el promedio de la captura entera.
          const sample = await sharp(buffer)
            .extract({ left: Math.max(0, b.left + 3), top: sampleTop, width: 8, height: 8 })
            .toBuffer()
          const stats = await sharp(sample).stats()
          const data = stats.channels.map((c) => Math.round(c.mean))

          patches.push({
            input: {
              create: {
                width: Math.max(1, Math.min(width - b.left, b.width)),
                height: Math.max(1, Math.min(height - b.top, b.height)),
                channels: 4,
                background: { r: data[0], g: data[1], b: data[2], alpha: 1 },
              },
            },
            left: Math.max(0, b.left),
            top: Math.max(0, b.top),
          })
          continue
        }
        const left = Math.max(0, Math.min(width - 1, b.left))
        const top = Math.max(0, Math.min(height - 1, b.top))
        const w = Math.max(1, Math.min(width - left, b.width))
        const h = Math.max(1, Math.min(height - top, b.height))

        // Dos pasos con buffer intermedio: encadenar dos resize en el mismo
        // pipeline no reduce y luego amplía, el segundo sustituye al primero.
        const sw = Math.max(1, Math.min(6, w))
        const sh = Math.max(1, Math.min(6, h))
        const tiny = await sharp(buffer)
          .extract({ left, top, width: w, height: h })
          .resize(sw, sh, { fit: 'fill' })
          .png()
          .toBuffer()
        const region = await sharp(tiny)
          .resize(w, h, { fit: 'fill', kernel: 'nearest' })
          .png()
          .toBuffer()

        patches.push({ input: region, left, top })
      }
      return sharp(buffer).composite(patches).png().toBuffer()
    }

    // Varias pasadas: una sola deja cifras sin detectar. Se repite el OCR sobre
    // el resultado hasta que ya no encuentre nada.
    let current = await sharp(file).png().toBuffer()
    let total = 0

    for (let pass = 0; pass < MAX_PASSES; pass++) {
      const boxes = await findBoxes(current, pass)
      if (pass === 0) {
        for (const r of regionsFor(project, inner)) {
          boxes.push({
            left: Math.round(r.x * width),
            top: Math.round(r.y * height),
            width: Math.round(r.w * width),
            height: Math.round(r.h * height),
            fill: r.fill === true,
          })
        }
      }
      if (boxes.length === 0) break
      current = await applyRedaction(current, boxes)
      total += boxes.length
    }

    // Verificación: si algo sobrevivió, hay que saberlo antes de publicar.
    const remaining = await findBoxes(current, MAX_PASSES)
    if (remaining.length > 0) {
      leaks.push(`${rel} — ${remaining.length} posibles cifras visibles`)
    }

    const dest = join(OUT, rel)
    await mkdir(dirname(dest), { recursive: true })
    await sharp(current).toFile(dest)

    console.log(
      `${rel} — ${total} zonas ocultas${remaining.length ? `  ⚠ ${remaining.length} sin tapar` : ''}`,
    )
  }

  await worker.terminate()
  await mkdir(OUT, { recursive: true })
  await writeFile(CACHE_FILE, JSON.stringify(cache))

  if (leaks.length) {
    console.log(`\n⚠ Revisar a ojo, el OCR aún ve algo en:`)
    for (const l of leaks) console.log(`   ${l}`)
  } else {
    console.log(`\nVerificado: el OCR ya no encuentra cifras en ninguna captura.`)
  }
  console.log(`Salida en ui-redactado/`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
