/**
 * El logo de HAACO llega como arte blanco sobre un verde oscuro sólido, así que
 * sobre Grafito se ve como una caja gris flotando. Ningún filtro CSS lo arregla:
 * mix-blend-mode falla en cuanto se le encima el grayscale del marquee.
 *
 * Aquí se convierte la luminancia en canal alfa —el arte blanco queda opaco y
 * el fondo verde desaparece— y se tiñe todo en Cal, que es como debe leerse
 * cualquier logo monocromo sobre fondo oscuro.
 */
import sharp from 'sharp'
import { join } from 'node:path'

const SRC = join(process.cwd(), 'logos-clientes', 'hacco construcciones.png')
const OUT = join(process.cwd(), 'public', 'logos', 'haaco-pro.png')

const CAL = { r: 0xec, g: 0xee, b: 0xf1 }

const { width, height } = await sharp(SRC).metadata()
if (!width || !height) throw new Error('No se pudieron leer las dimensiones')

// Luminancia normalizada: el verde de fondo cae a 0, el arte blanco sube a 255.
const alpha = await sharp(SRC)
  .flatten({ background: '#000000' })
  .greyscale()
  .normalise()
  .linear(1.35, -40)
  .toColourspace('b-w')
  .raw()
  .toBuffer()

await sharp({
  create: { width, height, channels: 3, background: CAL },
})
  .joinChannel(alpha, { raw: { width, height, channels: 1 } })
  .png({ compressionLevel: 9 })
  .toFile(OUT)

const out = await sharp(OUT).metadata()
console.log(`haaco-pro.png → ${out.width}×${out.height}, ${out.channels} canales (alfa: ${out.hasAlpha})`)
