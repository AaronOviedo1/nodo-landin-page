import type { MetadataRoute } from 'next'
import { seo } from '@/content/seo'
import { DEFAULT_LOCALE, localePath } from '@/lib/site'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'nodo. — Software a la medida',
    short_name: 'nodo.',
    description: seo[DEFAULT_LOCALE].description,
    start_url: localePath(DEFAULT_LOCALE),
    scope: '/',
    display: 'standalone',
    background_color: '#131619',
    theme_color: '#131619',
    lang: 'es-MX',
    dir: 'ltr',
    categories: ['business', 'productivity'],
    icons: [
      { src: '/brand/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/brand/favicon-32.png', sizes: '32x32', type: 'image/png' },
      {
        src: '/brand/favicon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}
