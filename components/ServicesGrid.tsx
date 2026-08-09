'use client'

import { useLang } from '@/lib/i18n'
import Reveal from './ui/Reveal'
import SectionLabel from './ui/SectionLabel'

export default function ServicesGrid() {
  const { t } = useLang()

  return (
    <section id="servicios" className="border-t border-acero bg-concreto/30 py-24 md:py-36">
      <div className="shell">
        <Reveal>
          <SectionLabel>{t.services.label}</SectionLabel>
        </Reveal>

        <div className="mt-10 grid gap-x-16 gap-y-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-7" delay={0.05}>
            <h2 className="nodo-d2 text-balance">{t.services.title}</h2>
          </Reveal>
          <Reveal className="lg:col-span-5 lg:pt-3" delay={0.12}>
            <p className="nodo-p1 max-w-md text-humo">{t.services.body}</p>
          </Reveal>
        </div>

        <ul className="mt-20 grid border-t border-l border-acero md:grid-cols-2 lg:grid-cols-3">
          {t.services.items.map((item, i) => (
            <Reveal
              as="li"
              key={item.title}
              delay={0.05 * (i % 3)}
              className="group relative overflow-hidden border-r border-b border-acero p-8 transition-colors duration-500 hover:bg-grafito lg:p-10"
            >
              {/* Barra Señal que sube al pasar el cursor: el único acento de la reja. */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-senal transition-transform duration-700 ease-[var(--ease-nodo)] group-hover:scale-x-100"
              />
              <span className="nodo-m1 text-humo/55 transition-colors duration-500 group-hover:text-senal">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="nodo-t2 mt-8 text-balance">{item.title}</h3>
              <p className="nodo-p3 mt-4 max-w-sm">{item.body}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
