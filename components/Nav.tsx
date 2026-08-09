'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useLang } from '@/lib/i18n'
import Wordmark from './ui/Wordmark'
import LanguageToggle from './ui/LanguageToggle'
import WhatsAppButton from './ui/WhatsAppButton'

export default function Nav() {
  const { t } = useLang()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Con el menú abierto el fondo no debe desplazarse.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[var(--ease-nodo)] ${
          scrolled
            ? 'border-b border-acero bg-grafito/85 backdrop-blur-xl'
            : 'border-b border-transparent'
        }`}
      >
        <div className="shell flex h-16 items-center justify-between gap-6 md:h-20">
          <a href="#top" className="shrink-0" aria-label="nodo. — inicio">
            <Wordmark size="text-xl md:text-2xl" />
          </a>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Principal">
            {t.nav.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="nodo-m1 text-humo transition-colors duration-200 hover:text-cal"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <LanguageToggle className="max-sm:hidden" />
            {/* max-md:hidden y no `hidden md:inline-flex`: el inline-flex de la
                clase base del botón gana el desempate y lo dejaba visible. */}
            <WhatsAppButton
              origin="nav"
              variant="primary"
              className="!px-4 !py-2.5 max-md:hidden"
            />
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="nodo-m1 flex items-center gap-2 border border-acero px-3 py-2 text-cal lg:hidden"
              aria-label={t.nav.menu}
              aria-expanded={open}
            >
              <span className="flex flex-col gap-1" aria-hidden="true">
                <span className="block h-px w-4 bg-cal" />
                <span className="block h-px w-4 bg-cal" />
              </span>
              {t.nav.menu}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-60 bg-grafito lg:hidden"
          >
            <div className="shell flex h-16 items-center justify-between md:h-20">
              <Wordmark size="text-xl" />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="nodo-m1 border border-acero px-3 py-2 text-cal"
              >
                {t.nav.close}
              </button>
            </div>

            <nav
              className="shell mt-8 flex flex-col gap-2 border-t border-acero"
              aria-label="Principal"
            >
              {t.nav.links.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i + 0.1, duration: 0.4 }}
                  className="nodo-t1 border-b border-acero py-5 text-cal"
                >
                  {link.label}
                </motion.a>
              ))}

              <div className="mt-8 flex flex-col gap-5">
                <WhatsAppButton origin="nav" variant="primary" className="w-full justify-center" />
                <LanguageToggle className="self-start" />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
