import type { MetadataRoute } from 'next'
import { languageAlternates, localeUrl, LOCALES } from '@/lib/site'

/**
 * Una entrada por idioma, y cada una declarando a la otra. Repetir las
 * alternativas en las dos entradas es lo que pide Google: las referencias de
 * hreflang tienen que ser recíprocas o las ignora.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return LOCALES.map((lang) => ({
    url: localeUrl(lang),
    lastModified,
    changeFrequency: 'monthly',
    priority: 1,
    alternates: { languages: languageAlternates() },
  }))
}
