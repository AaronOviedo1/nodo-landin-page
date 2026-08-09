'use client'

import { useLang } from '@/lib/i18n'

export default function LanguageToggle({ className = '' }: { className?: string }) {
  const { lang, setLang } = useLang()

  return (
    <div
      className={`nodo-m1 flex items-center border border-acero ${className}`}
      role="group"
      aria-label="Idioma / Language"
    >
      {(['es', 'en'] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          className={`px-2.5 py-1.5 transition-colors duration-200 ${
            lang === code ? 'bg-cal text-grafito' : 'text-humo hover:text-cal'
          }`}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
