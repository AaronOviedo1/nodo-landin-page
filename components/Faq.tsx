'use client'

import { useLang } from '@/lib/i18n'
import { faq } from '@/content/faq'
import Reveal from './ui/Reveal'
import SectionLabel from './ui/SectionLabel'

export default function Faq() {
  const { lang, t } = useLang()

  return (
    <section id="faq" className="border-t border-acero bg-concreto/30 py-24 md:py-36">
      <div className="shell grid gap-x-16 gap-y-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Reveal>
            <SectionLabel>{t.faq.label}</SectionLabel>
            <h2 className="nodo-d2 mt-8 text-balance lg:sticky lg:top-28">{t.faq.title}</h2>
          </Reveal>
        </div>

        {/* <details> nativo: accesible y funciona sin JavaScript. */}
        <div className="lg:col-span-8">
          {faq[lang].map((item, i) => (
            <Reveal key={item.q} delay={0.04 * i}>
              <details className="group border-b border-acero first:border-t">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-7 transition-colors duration-300 hover:text-senal [&::-webkit-details-marker]:hidden">
                  <h3 className="nodo-t2 text-balance">{item.q}</h3>
                  <span
                    aria-hidden="true"
                    className="relative mt-2 size-4 shrink-0"
                  >
                    <span className="absolute top-1/2 left-0 h-px w-4 -translate-y-1/2 bg-current" />
                    <span className="absolute top-1/2 left-0 h-px w-4 -translate-y-1/2 rotate-90 bg-current transition-transform duration-400 ease-[var(--ease-nodo)] group-open:rotate-0" />
                  </span>
                </summary>
                <p className="nodo-p2 max-w-2xl pb-8 text-humo">{item.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
