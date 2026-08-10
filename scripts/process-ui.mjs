/**
 * Procesa las capturas de las apps que viven en `ui/` y genera WebP optimizados
 * en `public/ui/`, junto con un manifiesto (`content/shots.generated.json`) con
 * dimensiones y blurDataURL.
 *
 * Cada proyecto se divide en **superficies**: las distintas interfaces que se
 * muestran a la par en la tarjeta (escritorio, móvil, o varias aplicaciones
 * distintas como en holidog inn). La clasificación se hace por ruta en CLASSIFY,
 * que es el único lugar a tocar cuando lleguen capturas nuevas.
 *
 * Volver a correr con `node scripts/process-ui.mjs`.
 */
import { readdir, mkdir, writeFile, stat } from 'node:fs/promises'
import { join, extname, basename, relative, sep } from 'node:path'
import sharp from 'sharp'

const ROOT = process.cwd()
const SRC = join(ROOT, 'ui')
/**
 * Versiones con la información confidencial ya tapada. Si un proyecto aparece
 * aquí, se publica **solo** lo que exista en esta carpeta: las capturas de
 * `ui/` que no pasaron el filtro de `redact-shots.mjs` se quedan fuera.
 */
const REDACTED = join(ROOT, 'ui-redactado')
const OUT = join(ROOT, 'public', 'ui')
const MANIFEST = join(ROOT, 'content', 'shots.generated.json')

const QUALITY = 82
const MAX_WIDTH_DESKTOP = 1600
const MAX_WIDTH_MOBILE = 720
const EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp'])

/**
 * Devuelve a qué proyecto y superficie pertenece una captura, o null para
 * descartarla. `path` es la ruta relativa a `ui/`, con separadores normalizados.
 *
 * `framed: true` significa que la captura ya trae su propio marco de teléfono
 * dibujado; entonces la interfaz no le agrega uno encima.
 */
function classify(path) {
  const p = path.toLowerCase()

  // Las pantallas de acceso no venden nada.
  if (/\blogin\b/.test(p)) return null
  // Versiones de página completa: mismas pantallas, demasiado alargadas.
  if (p.includes('/completas/')) return null

  if (p.startsWith('holidog inn/cos/')) {
    return { project: 'cos', surface: 'escritorio', kind: 'desktop' }
  }
  if (p.startsWith('holidog inn/')) {
    const file = basename(p)
    if (file.startsWith('tienda online')) {
      return { project: 'holidog-inn', surface: 'tienda', kind: 'desktop' }
    }
    if (file.startsWith('app web')) {
      return { project: 'holidog-inn', surface: 'admin', kind: 'desktop' }
    }
    if (file.startsWith('app movil')) {
      // Estas ya vienen montadas dentro de un iPhone.
      return { project: 'holidog-inn', surface: 'movil', kind: 'mobile', framed: true }
    }
    return null
  }

  const roots = {
    'clima-xp': 'climaxpress',
    fresafit: 'fresa-fit',
    'hacco construcciones': 'haaco-pro',
    'mlb-totals': 'mlb-totals',
    lizzy: 'lizzy',
  }

  for (const [dir, project] of Object.entries(roots)) {
    if (!p.startsWith(`${dir}/`)) continue
    const sub = p.slice(dir.length + 1).split('/')[0]
    if (sub === 'movil' || sub === 'mobile') {
      return { project, surface: 'movil', kind: 'mobile' }
    }
    if (sub === 'desktop' || sub === 'escritorio') {
      return { project, surface: 'escritorio', kind: 'desktop' }
    }
    // Sin subcarpeta reconocible: se decide por la proporción más adelante.
    return { project, surface: 'escritorio', kind: 'desktop' }
  }

  return null
}

/** Orden de las superficies dentro de una tarjeta. */
const SURFACE_ORDER = ['tienda', 'admin', 'escritorio', 'movil']

const slug = (s) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

async function collect(dir, acc = []) {
  const entries = await readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      await collect(full, acc)
    } else if (EXTS.has(extname(entry.name).toLowerCase()) && !entry.name.startsWith('.')) {
      acc.push(full)
    }
  }
  return acc
}

async function main() {
  try {
    await stat(SRC)
  } catch {
    console.log('No existe ui/ — nada que procesar.')
    return
  }

  // Proyectos con versión redactada, por el nombre de su carpeta de primer nivel.
  const redactedRoots = new Set()
  try {
    for (const entry of await readdir(REDACTED, { withFileTypes: true })) {
      if (entry.isDirectory()) redactedRoots.add(entry.name)
    }
  } catch {
    // Sin carpeta de redactadas: se publica ui/ tal cual.
  }

  const files = (await collect(SRC)).sort()
  const groups = new Map()
  let skipped = 0
  let confidential = 0

  for (const file of files) {
    const rel = relative(SRC, file).split(sep).join('/')
    const info = classify(rel)
    if (!info) {
      skipped++
      continue
    }

    let source = file
    const root = rel.split('/')[0]
    if (redactedRoots.has(root)) {
      const redacted = join(REDACTED, rel)
      try {
        await stat(redacted)
        source = redacted
      } catch {
        // Descartada por mostrar datos confidenciales: no se publica.
        confidential++
        continue
      }
    }

    const key = `${info.project}::${info.surface}`
    if (!groups.has(key)) groups.set(key, { ...info, files: [] })
    groups.get(key).files.push(source)
  }

  const manifest = {}

  for (const { project, surface, kind, framed, files: group } of groups.values()) {
    const dir = join(OUT, project, surface)
    await mkdir(dir, { recursive: true })

    const shots = []
    for (const file of group) {
      const name = slug(basename(file, extname(file)))
      const dest = join(dir, `${name}.webp`)

      const meta = await sharp(file).metadata()
      const limit = kind === 'mobile' ? MAX_WIDTH_MOBILE : MAX_WIDTH_DESKTOP
      const width = Math.min(meta.width ?? limit, limit)

      const out = await sharp(file)
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: QUALITY, effort: 5 })
        .toFile(dest)

      const blur = await sharp(file).resize({ width: 16 }).webp({ quality: 40 }).toBuffer()

      shots.push({
        src: `/ui/${project}/${surface}/${name}.webp`,
        alt: basename(file, extname(file)).replace(/^\d+[-_ ]*/, ''),
        width: out.width,
        height: out.height,
        blurDataURL: `data:image/webp;base64,${blur.toString('base64')}`,
      })
    }

    ;(manifest[project] ??= []).push({
      id: surface,
      kind,
      ...(framed ? { framed: true } : {}),
      shots,
    })

    console.log(
      `${project}/${surface} · ${kind}${framed ? ' (con marco propio)' : ''} — ${shots.length} capturas`,
    )
  }

  for (const surfaces of Object.values(manifest)) {
    surfaces.sort(
      (a, b) => SURFACE_ORDER.indexOf(a.id) - SURFACE_ORDER.indexOf(b.id),
    )
  }

  await mkdir(join(ROOT, 'content'), { recursive: true })
  await writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`)
  console.log(
    `\nDescartadas ${skipped} (accesos y páginas completas)` +
      `${confidential ? ` y ${confidential} por mostrar datos confidenciales` : ''}.`,
  )
  console.log(`Manifiesto: ${relative(ROOT, MANIFEST)}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
