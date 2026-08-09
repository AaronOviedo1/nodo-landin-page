'use client'

import { useLang } from '@/lib/i18n'
import { EMAIL, WHATSAPP_DISPLAY, whatsappUrl } from '@/lib/whatsapp'
import Wordmark from './ui/Wordmark'

export default function Footer() {
  const { lang, t } = useLang()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-acero bg-concreto/40">
      <div className="shell grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <Wordmark size="text-3xl" />
          <p className="nodo-p3 mt-6 max-w-xs">{t.footer.tagline}</p>
          <p className="nodo-m1 mt-8 text-humo">{t.footer.basedIn}</p>
        </div>

        <nav className="md:col-span-3" aria-label={t.footer.sections}>
          <p className="nodo-m1 text-humo">{t.footer.sections}</p>
          <ul className="mt-6 flex flex-col gap-3">
            {t.nav.links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="nodo-p2 text-humo transition-colors hover:text-cal"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-4">
          <p className="nodo-m1 text-humo">{t.footer.contact}</p>
          <ul className="mt-6 flex flex-col gap-3">
            <li>
              <a
                href={whatsappUrl(lang, 'footer')}
                target="_blank"
                rel="noopener noreferrer"
                className="nodo-p2 text-humo transition-colors hover:text-cal"
              >
                {WHATSAPP_DISPLAY}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${EMAIL}`}
                className="nodo-p2 text-humo transition-colors hover:text-cal"
              >
                {EMAIL}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="shell flex flex-col justify-between gap-3 border-t border-acero py-7 sm:flex-row">
        <p className="nodo-m1 text-humo">
          © {year} nodo. {t.footer.rights}
        </p>
        <p className="nodo-m1 text-humo">Hecho en Hermosillo</p>
      </div>
    </footer>
  )
}
