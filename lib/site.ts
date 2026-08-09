/**
 * URL canónica del sitio. Vercel expone el dominio de producción en
 * NEXT_PUBLIC_SITE_URL; si algún día hay dominio propio, se cambia aquí o
 * en las variables de entorno del proyecto y el resto se ajusta solo.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nodo-page.vercel.app'
