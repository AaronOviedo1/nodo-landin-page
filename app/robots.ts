import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  return {
    // Todo abierto a propósito. En particular `/_next/`, que es donde viven el
    // CSS y el JavaScript: si se bloquea, Google no puede pintar la página y
    // la evalúa rota.
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
