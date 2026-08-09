'use client'

import { useLang } from '@/lib/i18n'
import { stack } from '@/content/projects'
import Reveal from './ui/Reveal'
import SectionLabel from './ui/SectionLabel'

export default function StackRow() {
  const { t } = useLang()

  return (
    <section className="border-t border-acero py-20">
      <div className="shell grid gap-10 lg:grid-cols-12 lg:items-center">
        <Reveal className="lg:col-span-4">
          <SectionLabel>{t.stack.label}</SectionLabel>
          <p className="nodo-p3 mt-5 max-w-xs">{t.stack.body}</p>
        </Reveal>

        <Reveal className="lg:col-span-8" delay={0.08}>
          <ul className="flex flex-wrap gap-x-8 gap-y-5 lg:justify-end">
            {stack.map((item) => (
              <li
                key={item}
                className="nodo-t2 text-humo/70 transition-colors duration-500 hover:text-cal"
              >
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
