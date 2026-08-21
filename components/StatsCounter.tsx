'use client'

import { useEffect, useRef } from 'react'
import { animate, useInView } from 'motion/react'
import { useLang } from '@/lib/i18n'
import SectionLabel from './ui/SectionLabel'
import Reveal from './ui/Reveal'

function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  // El margen solo se recorta arriba y abajo. Con `-80px` en los cuatro lados
  // también se encogen los costados, y en pantallas angostas el número —que es
  // estrecho y va pegado al margen izquierdo— queda fuera del área observada:
  // nunca entra en vista y el contador se queda clavado en 0.
  const inView = useInView(ref, { once: true, margin: '-80px 0px' })

  useEffect(() => {
    const node = ref.current
    if (!node || !inView) return

    // Sin animación para quien pide menos movimiento: el número aparece y ya.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      node.textContent = String(to)
      return
    }

    const controls = animate(0, to, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (value) => {
        node.textContent = String(Math.round(value))
      },
    })

    return () => controls.stop()
  }, [inView, to])

  return (
    <span ref={ref} className="tabular">
      0
    </span>
  )
}

export default function StatsCounter() {
  const { t } = useLang()

  return (
    <section className="border-y border-acero bg-concreto/30 py-20 md:py-24">
      <div className="shell">
        <Reveal>
          <SectionLabel>{t.stats.label}</SectionLabel>
        </Reveal>

        <dl className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {t.stats.items.map((item, i) => (
            <Reveal key={item.label} delay={0.06 * i}>
              <dt className="sr-only">{item.label}</dt>
              <dd>
                <span className="nodo-d1 block">
                  <Counter to={item.value} />
                  {item.suffix}
                </span>
                <span className="nodo-p3 mt-4 block max-w-40 border-t border-acero pt-4">
                  {item.label}
                </span>
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  )
}
