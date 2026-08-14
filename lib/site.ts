import type { Lang } from '@/content/copy'

/**
 * URL canónica del sitio. Se puede sobreescribir con NEXT_PUBLIC_SITE_URL para
 * los despliegues de vista previa; producción vive en el dominio propio.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nodosoftware.com.mx'

/** Idiomas que se sirven como ruta propia y que Google indexa por separado. */
export const LOCALES = ['es', 'en'] as const

/** El español manda: todos los clientes son mexicanos. */
export const DEFAULT_LOCALE: Lang = 'es'

export const isLang = (value: string): value is Lang =>
  (LOCALES as readonly string[]).includes(value)

/** Ruta de la portada en un idioma. Un solo lugar por si algún día hay más páginas. */
export const localePath = (lang: Lang) => `/${lang}`

export const localeUrl = (lang: Lang) => `${SITE_URL}${localePath(lang)}`

/**
 * Etiquetas de idioma completas. Google las quiere en formato BCP 47: el
 * español se acota a México porque ahí está el mercado, el inglés se deja
 * genérico para no cerrarle la puerta a ninguna región.
 */
export const HREFLANG: Record<Lang, string> = {
  es: 'es-MX',
  en: 'en',
}

/** El formato que pide Open Graph, que no es el mismo que el de hreflang. */
export const OG_LOCALE: Record<Lang, string> = {
  es: 'es_MX',
  en: 'en_US',
}

/**
 * Mapa de alternativas para `alternates.languages`. `x-default` apunta al
 * español: es lo que ve quien llega sin un idioma que coincida.
 */
export const languageAlternates = () => ({
  ...Object.fromEntries(LOCALES.map((l) => [HREFLANG[l], localeUrl(l)])),
  'x-default': localeUrl(DEFAULT_LOCALE),
})
