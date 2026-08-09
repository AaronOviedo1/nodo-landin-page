'use client'

import { useLang } from '@/lib/i18n'
import Reveal from './ui/Reveal'
import SectionLabel from './ui/SectionLabel'

export default function ProblemBlock() {
  const { t } = useLang()

  return (
    <section id="problema" className="shell py-24 md:py-36">
      <Reveal>
        <SectionLabel>{t.problem.label}</SectionLabel>
      </Reveal>

      <div className="mt-10 grid gap-x-16 gap-y-8 lg:grid-cols-12">
        <Reveal className="lg:col-span-7" delay={0.05}>
          <h2 className="nodo-d2 text-balance">{t.problem.title}</h2>
        </Reveal>

        <Reveal className="lg:col-span-5 lg:pt-3" delay={0.12}>
          <p className="nodo-p1 max-w-md text-humo">{t.problem.body}</p>
        </Reveal>
      </div>

      <ul className="mt-20 grid border-t border-acero sm:grid-cols-2 lg:grid-cols-4">
        {t.problem.pains.map((pain, i) => (
          <Reveal
            as="li"
            key={pain.title}
            delay={0.06 * i}
            className="group relative border-b border-acero p-7 transition-colors duration-500 hover:bg-concreto sm:[&:nth-child(odd)]:border-r lg:border-r lg:last:border-r-0 lg:[&:nth-child(odd)]:border-r"
          >
            <span className="nodo-m1 text-humo/55 transition-colors duration-500 group-hover:text-senal">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="nodo-t2 mt-6 text-balance">{pain.title}</h3>
            <p className="nodo-p3 mt-3">{pain.body}</p>
          </Reveal>
        ))}
      </ul>

      <Reveal delay={0.1}>
        <p className="nodo-t1 mt-20 max-w-4xl text-balance">
          {t.problem.close}
        </p>
      </Reveal>
    </section>
  )
}
