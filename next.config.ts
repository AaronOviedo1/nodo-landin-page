import type { NextConfig } from 'next'
import { DEFAULT_LOCALE, localePath } from './lib/site'

const nextConfig: NextConfig = {
  /**
   * La raíz no tiene contenido propio: cada idioma vive en su ruta para que
   * Google pueda indexarlos por separado. El 308 le dice al buscador que la
   * portada real es `/es` y que no vuelva a preguntar.
   */
  redirects() {
    return [
      {
        source: '/',
        destination: localePath(DEFAULT_LOCALE),
        permanent: true,
      },
    ]
  },
}

export default nextConfig
