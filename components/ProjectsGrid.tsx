'use client'

import { useLang } from '@/lib/i18n'
import { projects } from '@/content/projects'
import ClientLogo from './ClientLogo'
import ProjectShots from './ProjectShots'
import Reveal from './ui/Reveal'
import SectionLabel from './ui/SectionLabel'
import Isotipo from './ui/Isotipo'

function Badge({ children, accent = false }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <span
      className={`nodo-m1 px-2.5 py-1.5 ${
        accent ? 'bg-senal text-grafito' : 'border border-acero text-humo'
      }`}
    >
      {children}
    </span>
  )
}

function VisitLink({ url, label }: { url: string; label: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="nodo-m1 group/link inline-flex items-center gap-2 text-cal transition-colors hover:text-senal"
    >
      {label}
      <span
        aria-hidden="true"
        className="transition-transform duration-300 ease-[var(--ease-nodo)] group-hover/link:translate-x-1 group-hover/link:-translate-y-1"
      >
        ↗
      </span>
    </a>
  )
}

export default function ProjectsGrid() {
  const { lang, t } = useLang()

  // Los proyectos con capturas se llevan el ancho completo; el resto va compacto.
  // Cuando lleguen más capturas, se promueven solos.
  const hasShots = (p: (typeof projects)[number]) =>
    p.surfaces.some((s) => s.shots.length > 0)
  const featured = projects.filter(hasShots)
  const compact = projects.filter((p) => !hasShots(p))

  return (
    <section id="proyectos" className="shell py-24 md:py-36">
      <Reveal>
        <SectionLabel>{t.projects.label}</SectionLabel>
      </Reveal>

      <div className="mt-10 grid gap-x-16 gap-y-8 lg:grid-cols-12">
        <Reveal className="lg:col-span-7" delay={0.05}>
          <h2 className="nodo-d2 text-balance">{t.projects.title}</h2>
        </Reveal>
        <Reveal className="lg:col-span-5 lg:pt-3" delay={0.12}>
          <p className="nodo-p1 max-w-md text-humo">{t.projects.body}</p>
        </Reveal>
      </div>

      {/* Destacados */}
      <div className="mt-20 flex flex-col gap-24 md:gap-32">
        {featured.map((project, i) => {
          // Un proyecto que son varias aplicaciones —holidog inn son tres— no
          // cabe en media fila: se lleva el ancho completo y el texto se acomoda
          // arriba en dos columnas.
          const wide =
            project.surfaces.filter((s) => s.kind === 'desktop' && s.shots.length > 0)
              .length > 1

          return (
          <Reveal as="article" key={project.id} className="group">
            <div
              className={
                wide
                  ? 'flex flex-col gap-10'
                  : `grid items-center gap-10 lg:grid-cols-12 lg:gap-16 ${
                      i % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''
                    }`
              }
            >
              <div className={wide ? 'grid gap-x-16 gap-y-8 lg:grid-cols-12 lg:items-end' : 'lg:col-span-5'}>
                <div className={wide ? 'lg:col-span-6' : ''}>
                  <div className="flex h-12 items-center">
                    <ClientLogo
                      name={project.name}
                      logo={project.logo}
                      treatment={project.treatment}
                      width={project.logoWidth}
                      monochrome={false}
                    />
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-2">
                    <Badge>{project.year}</Badge>
                    {project.status === 'own' && <Badge>{t.projects.own}</Badge>}
                    {project.status === 'development' && (
                      <Badge accent>{t.projects.inDevelopment}</Badge>
                    )}
                  </div>

                  <p className="nodo-p1 mt-6 max-w-md text-humo">{project.summary[lang]}</p>
                </div>

                <div className={wide ? 'lg:col-span-6' : ''}>
                  <ul className={`flex flex-wrap gap-2 ${wide ? '' : 'mt-8'}`}>
                    {project.capabilities[lang].map((cap) => (
                      <li
                        key={cap}
                        className="nodo-m1 border border-acero px-2.5 py-1.5 text-humo"
                      >
                        {cap}
                      </li>
                    ))}
                  </ul>

                  {project.url && (
                    <div className="mt-8">
                      <VisitLink url={project.url} label={t.projects.visit} />
                    </div>
                  )}
                </div>
              </div>

              <div className={wide ? '' : 'lg:col-span-7'}>
                <ProjectShots
                  surfaces={project.surfaces}
                  name={project.name}
                  layout={wide ? 'wide' : 'side'}
                />
              </div>
            </div>
          </Reveal>
          )
        })}
      </div>

      {/* Compactos. Con solo dos, tres columnas dejarían una celda vacía. */}
      <div
        className={`mt-24 grid border-t border-l border-acero md:grid-cols-2 ${
          compact.length > 2 ? 'lg:grid-cols-3' : ''
        }`}
      >
        {compact.map((project, i) => (
          <Reveal
            as="article"
            key={project.id}
            delay={0.05 * (i % 3)}
            className="group relative flex flex-col justify-between overflow-hidden border-r border-b border-acero p-8 transition-colors duration-500 hover:bg-concreto lg:p-10"
          >
            <span
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-senal transition-transform duration-700 ease-[var(--ease-nodo)] group-hover:scale-x-100"
            />

            <div>
              <div className="flex h-12 items-center justify-between gap-4">
                <ClientLogo
                  name={project.name}
                  logo={project.logo}
                  treatment={project.treatment}
                  width={project.logoWidth}
                  monochrome={false}
                />
                <Isotipo
                  className="size-4 shrink-0 text-acero transition-colors duration-500 group-hover:text-humo"
                  dot="currentColor"
                  strokeWidth={12}
                />
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-2">
                <Badge>{project.year}</Badge>
                {project.status === 'own' && <Badge>{t.projects.own}</Badge>}
                {project.status === 'development' && (
                  <Badge accent>{t.projects.inDevelopment}</Badge>
                )}
              </div>

              <p className="nodo-p3 mt-6">{project.summary[lang]}</p>
            </div>

            <div className="mt-8">
              <ul className="flex flex-wrap gap-2">
                {project.capabilities[lang].map((cap) => (
                  <li key={cap} className="nodo-m1 border border-acero px-2.5 py-1.5 text-humo">
                    {cap}
                  </li>
                ))}
              </ul>

              {project.url && (
                <div className="mt-6">
                  <VisitLink url={project.url} label={t.projects.visit} />
                </div>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
