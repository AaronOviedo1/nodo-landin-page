/**
 * Procesa las capturas de las apps que viven en ui/<Proyecto>/*.png
 * y genera WebP optimizados en public/ui/<proyecto>/ junto con un
 * manifiesto (content/shots.generated.json) con dimensiones y blurDataURL.
 *
 * Volver a correr con `node scripts/process-ui.mjs` cada vez que se agreguen capturas.
 */
import { readdir, mkdir, writeFile, stat } from 'node:fs/promises'
import { join, extname, basename, relative } from 'node:path'
import sharp from 'sharp'

const ROOT = process.cwd()
const SRC = join(ROOT, 'ui')
const OUT = join(ROOT, 'public', 'ui')
const MANIFEST = join(ROOT, 'content', 'shots.generated.json')

const MAX_WIDTH = 1600
const QUALITY = 82
const EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp'])

const slug = (s) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/** Recorre ui/ y devuelve { proyecto: [rutas absolutas] } usando el directorio contenedor. */
async function collect(dir, acc = {}) {
  const entries = await readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      await collect(full, acc)
    } else if (EXTS.has(extname(entry.name).toLowerCase()) && !entry.name.startsWith('.')) {
      const project = slug(basename(dir))
      ;(acc[project] ??= []).push(full)
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

  const groups = await collect(SRC)
  const manifest = {}

  for (const [project, files] of Object.entries(groups)) {
    await mkdir(join(OUT, project), { recursive: true })
    manifest[project] = []

    for (const file of files.sort()) {
      const name = slug(basename(file, extname(file)))
      const dest = join(OUT, project, `${name}.webp`)

      const meta = await sharp(file).metadata()
      const width = Math.min(meta.width ?? MAX_WIDTH, MAX_WIDTH)

      const info = await sharp(file)
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: QUALITY, effort: 5 })
        .toFile(dest)

      // Miniatura de 16px en base64 para el placeholder difuminado de next/image.
      const blur = await sharp(file)
        .resize({ width: 16 })
        .webp({ quality: 40 })
        .toBuffer()

      manifest[project].push({
        src: `/ui/${project}/${name}.webp`,
        alt: basename(file, extname(file)),
        width: info.width,
        height: info.height,
        blurDataURL: `data:image/webp;base64,${blur.toString('base64')}`,
      })

      console.log(
        `${relative(ROOT, file)} → ${relative(ROOT, dest)} (${info.width}×${info.height}, ${Math.round(info.size / 1024)} kB)`,
      )
    }
  }

  await mkdir(join(ROOT, 'content'), { recursive: true })
  await writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`)
  console.log(`\nManifiesto: ${relative(ROOT, MANIFEST)}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
