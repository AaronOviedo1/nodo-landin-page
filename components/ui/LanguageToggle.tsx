'use client'

import Link from 'next/link'
import { useLang } from '@/lib/i18n'
import { HREFLANG, localePath, LOCALES } from '@/lib/site'

/**
 * Enlaces de verdad, no botones: así el rastreador encuentra la otra versión
 * del sitio siguiendo la página, sin depender solo del sitemap.
 */
export default function LanguageToggle({ className = '' }: { className?: string }) {
  const { lang } = useLang()

  return (
    <div
      className={`nodo-m1 flex items-center border border-acero ${className}`}
      role="group"
      aria-label="Idioma / Language"
    >
      {LOCALES.map((code) => (
        <Link
          key={code}
          href={localePath(code)}
          hrefLang={HREFLANG[code]}
          aria-current={lang === code ? 'true' : undefined}
          className={`px-2.5 py-1.5 transition-colors duration-200 ${
            lang === code ? 'bg-cal text-grafito' : 'text-humo hover:text-cal'
          }`}
        >
          {code.toUpperCase()}
        </Link>
      ))}
    </div>
  )
}
