import type { MetadataRoute } from 'next'
import { languageAlternates, localeUrl, LOCALES, PRIVACY_SUBPATH } from '@/lib/site'

/**
 * Una entrada por idioma, y cada una declarando a la otra. Repetir las
 * alternativas en las dos entradas es lo que pide Google: las referencias de
 * hreflang tienen que ser recíprocas o las ignora.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  const home = LOCALES.map((lang) => ({
    url: localeUrl(lang),
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 1,
    alternates: { languages: languageAlternates() },
  }))

  const privacy = LOCALES.map((lang) => ({
    url: localeUrl(lang, PRIVACY_SUBPATH),
    lastModified,
    changeFrequency: 'yearly' as const,
    priority: 0.2,
    alternates: { languages: languageAlternates(PRIVACY_SUBPATH) },
  }))

  return [...home, ...privacy]
}
