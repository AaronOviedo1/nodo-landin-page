import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { seo } from '@/content/seo'
import { DEFAULT_LOCALE, isLang } from '@/lib/site'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/** El `alt` cambia con el idioma, así que se declara aquí en vez de exportarlo suelto. */
export function generateImageMetadata({ params }: { params: { lang: string } }) {
  const lang = isLang(params.lang) ? params.lang : DEFAULT_LOCALE
  return [{ id: 'og', alt: seo[lang].ogAlt, size, contentType }]
}

/** Titular partido igual que en el hero, con el cuadro cerrando la última línea. */
const TITULAR: Record<'es' | 'en', [string, string]> = {
  es: ['Tu operación no necesita más gente.', 'Necesita mejor software'],
  en: ['Your operation does not need more people.', 'It needs better software'],
}

const PIE: Record<'es' | 'en', [string, string]> = {
  es: ['SOFTWARE A LA MEDIDA', 'HERMOSILLO, SONORA'],
  en: ['CUSTOM SOFTWARE', 'HERMOSILLO, MEXICO'],
}

/**
 * Tarjeta para redes. Mismas reglas del manual: Grafito de fondo, Cal para el
 * texto y Señal solo en el punto del wordmark y el cuadro que cierra el titular.
 *
 * La fuente se lee del repositorio en vez de descargarse: satori no admite
 * woff2 y depender de la red durante el build es frágil.
 */
export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params
  const lang = isLang(raw) ? raw : DEFAULT_LOCALE

  const archivo = await readFile(
    join(process.cwd(), 'assets', 'fonts', 'archivo-800.ttf'),
  )

  const cuadro = (size: number, marginLeft: number) => ({
    width: size,
    height: size,
    backgroundColor: '#FFC400',
    marginLeft,
  })

  const [linea1, linea2] = TITULAR[lang]
  const [pieIzq, pieDer] = PIE[lang]

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#131619',
          padding: '68px 76px',
          fontFamily: 'Archivo',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <span style={{ fontSize: 58, color: '#ECEEF1', letterSpacing: '-0.045em' }}>
            nodo
          </span>
          <div style={{ ...cuadro(18, 5), marginBottom: 9 }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontSize: 82,
              color: '#ECEEF1',
              letterSpacing: '-0.04em',
              lineHeight: 1.03,
              maxWidth: 980,
            }}
          >
            {linea1}
          </span>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <span
              style={{
                fontSize: 82,
                color: '#ECEEF1',
                letterSpacing: '-0.04em',
                lineHeight: 1.03,
              }}
            >
              {linea2}
            </span>
            <div style={{ ...cuadro(28, 12), marginBottom: 14 }} />
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid #2E353F',
            paddingTop: 26,
            fontSize: 19,
            color: '#8A929E',
            letterSpacing: '0.16em',
          }}
        >
          <span>{pieIzq}</span>
          <span>{pieDer}</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'Archivo', data: archivo, style: 'normal', weight: 800 }],
    },
  )
}
