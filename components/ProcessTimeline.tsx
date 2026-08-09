'use client'

import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'
import { useLang } from '@/lib/i18n'
import Reveal from './ui/Reveal'
import SectionLabel from './ui/SectionLabel'
import WhatsAppButton from './ui/WhatsAppButton'

export default function ProcessTimeline() {
  const { t } = useLang()
  const ref = useRef<HTMLOListElement>(null)

  // La línea se dibuja conforme la sección atraviesa la pantalla.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 75%', 'end 60%'],
  })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })

  return (
    <section id="proceso" className="shell py-24 md:py-36">
      <Reveal>
        <SectionLabel>{t.process.label}</SectionLabel>
      </Reveal>

      <div className="mt-10 grid gap-x-16 gap-y-8 lg:grid-cols-12">
        <Reveal className="lg:col-span-7" delay={0.05}>
          <h2 className="nodo-d2 text-balance">{t.process.title}</h2>
        </Reveal>
        <Reveal className="lg:col-span-5 lg:pt-3" delay={0.12}>
          <p className="nodo-p1 max-w-md text-humo">{t.process.body}</p>
        </Reveal>
      </div>

      <ol ref={ref} className="relative mt-20 grid gap-14 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {/* Riel horizontal en escritorio */}
        <span
          aria-hidden="true"
          className="absolute top-2 right-0 left-0 hidden h-px bg-acero lg:block"
        />
        <motion.span
          aria-hidden="true"
          style={{ scaleX: progress }}
          className="absolute top-2 right-0 left-0 hidden h-px origin-left bg-senal lg:block"
        />

        {t.process.steps.map((step, i) => (
          <Reveal as="li" key={step.title} delay={0.08 * i} className="relative lg:pt-12">
            {/* Nodo sobre el riel */}
            <span
              aria-hidden="true"
              className="absolute top-0.5 left-0 hidden size-3 border border-acero bg-grafito lg:block"
            />

            <span className="nodo-m1 text-senal">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="nodo-t2 mt-5 text-balance">{step.title}</h3>
            <p className="nodo-p3 mt-4 max-w-xs">{step.body}</p>
          </Reveal>
        ))}
      </ol>

      <Reveal delay={0.1}>
        <div className="mt-16">
          <WhatsAppButton origin="proceso" variant="ghost" label={t.process.cta} />
        </div>
      </Reveal>
    </section>
  )
}
