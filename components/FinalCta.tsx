'use client'

import { useLang } from '@/lib/i18n'
import { EMAIL } from '@/lib/whatsapp'
import Isotipo from './ui/Isotipo'
import Reveal from './ui/Reveal'
import SectionLabel from './ui/SectionLabel'
import WhatsAppButton from './ui/WhatsAppButton'

export default function FinalCta() {
  const { t } = useLang()

  return (
    <section className="relative overflow-hidden border-t border-acero py-28 md:py-40">
      {/* Isotipo como marca de agua en Acero. Completo y no recortado: cortado
          se lee como formas sueltas en vez de como la marca. Nunca en Señal,
          que rompería el tope del 5%. */}
      <Isotipo
        className="pointer-events-none absolute top-1/2 right-4 hidden size-[22rem] -translate-y-1/2 text-acero/45 lg:block xl:right-16 xl:size-[28rem]"
        dot="currentColor"
        strokeWidth={6}
      />

      <div className="shell relative">
        <Reveal>
          <SectionLabel>{t.cta.label}</SectionLabel>
        </Reveal>

        <Reveal delay={0.06}>
          <h2 className="nodo-d1 mt-10 max-w-3xl text-balance">{t.cta.title}</h2>
        </Reveal>

        <Reveal delay={0.12}>
          <p className="nodo-p1 mt-8 max-w-xl text-humo">{t.cta.body}</p>
        </Reveal>

        <Reveal delay={0.18}>
          <div className="mt-12 flex flex-wrap items-center gap-6">
            <WhatsAppButton origin="cierre" variant="primary" label={t.cta.button} />
            <p className="nodo-p3">
              {t.cta.alt}{' '}
              <a
                href={`mailto:${EMAIL}`}
                className="text-cal underline decoration-acero underline-offset-4 transition-colors hover:decoration-senal"
              >
                {EMAIL}
              </a>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
