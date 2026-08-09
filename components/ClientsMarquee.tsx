'use client'

import { useLang } from '@/lib/i18n'
import { projects } from '@/content/projects'
import ClientLogo from './ClientLogo'

// Solo los que tienen archivo de logo: el marquee es prueba social, no catálogo.
const logos = projects.filter((p) => p.logo)

export default function ClientsMarquee() {
  const { t } = useLang()
  const track = [...logos, ...logos]

  return (
    <section
      className="relative border-y border-acero bg-concreto/40 py-10"
      aria-label={t.clients.label}
    >
      <p className="nodo-m1 shell mb-8 text-humo">{t.clients.label}</p>

      <div className="marquee-mask overflow-hidden">
        <div className="flex w-max animate-[var(--animate-marquee)] items-center gap-16 pr-16 hover:[animation-play-state:paused] motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:justify-center">
          {track.map((project, i) => (
            <div
              key={`${project.id}-${i}`}
              className="group flex h-14 shrink-0 items-center"
              aria-hidden={i >= logos.length}
            >
              <ClientLogo
                name={project.name}
                logo={project.logo}
                treatment={project.treatment}
                width={project.logoWidth}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
