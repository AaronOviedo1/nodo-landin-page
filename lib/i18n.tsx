'use client'

import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { copy, type Lang } from '@/content/copy'
import { localePath } from './site'

type LanguageContextValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  toggle: () => void
  t: (typeof copy)[Lang]
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

/**
 * El idioma lo manda la URL, no el estado del cliente. Antes vivía en
 * localStorage, lo que dejaba una sola página para los dos idiomas y hacía que
 * Google solo viera el español; ahora `/es` y `/en` son páginas distintas y
 * cada una se sirve ya traducida desde el servidor.
 */
export function LanguageProvider({
  lang,
  children,
}: {
  lang: Lang
  children: ReactNode
}) {
  const router = useRouter()

  // Cambiar de idioma es navegar. Se conserva la sección en la que iba el
  // visitante para no devolverlo al inicio de la página.
  const setLang = useCallback(
    (next: Lang) => {
      if (next === lang) return
      const hash = typeof window === 'undefined' ? '' : window.location.hash
      router.push(`${localePath(next)}${hash}`)
    },
    [lang, router],
  )

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      setLang,
      toggle: () => setLang(lang === 'es' ? 'en' : 'es'),
      t: copy[lang],
    }),
    [lang, setLang],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang debe usarse dentro de LanguageProvider')
  return ctx
}
