import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import FinalCta from '@/components/FinalCta'
import Footer from '@/components/Footer'
import ProjectsGrid from '@/components/ProjectsGrid'
import LanguageToggle from '@/components/ui/LanguageToggle'
import Wordmark from '@/components/ui/Wordmark'
import { copy } from '@/content/copy'
import { seo } from '@/content/seo'
import {
  isLang,
  languageAlternates,
  localePath,
  OG_LOCALE,
  PROJECTS_SUBPATH,
  projectsPath,
} from '@/lib/site'

export async function generateMetadata({
  params,
}: PageProps<'/[lang]/proyectos'>): Promise<Metadata> {
  const { lang } = await params
  if (!isLang(lang)) notFound()

  const p = seo[lang].projects

  return {
    title: p.title,
    description: p.description,
    // El layout declara la portada como canónica; aquí se reemplaza completo
    // porque la metadata de cada segmento se mezcla solo en el primer nivel.
    alternates: {
      canonical: projectsPath(lang),
      languages: languageAlternates(PROJECTS_SUBPATH),
    },
    // Igual que `alternates`: el objeto reemplaza al del layout, así que se
    // repiten los campos de sitio para no perderlos.
    openGraph: {
      type: 'website',
      locale: OG_LOCALE[lang],
      siteName: 'nodo.',
      url: projectsPath(lang),
      title: p.title,
      description: p.description,
    },
  }
}

/**
 * El portafolio completo. La portada solo enseña los destacados para no
 * volverse interminable; aquí va todo proyecto con capturas.
 */
export default async function ProjectsPage({
  params,
}: PageProps<'/[lang]/proyectos'>) {
  const { lang } = await params
  if (!isLang(lang)) notFound()

  return (
    <>
      {/* Sin el nav de la portada: sus anclas no existen aquí. */}
      <header className="border-b border-acero">
        <div className="shell flex h-16 items-center justify-between gap-6 md:h-20">
          <Link href={localePath(lang)} aria-label={copy[lang].footer.home}>
            <Wordmark size="text-xl md:text-2xl" />
          </Link>
          <LanguageToggle subpath={PROJECTS_SUBPATH} />
        </div>
      </header>

      <main>
        <ProjectsGrid variant="all" />
        <FinalCta />
      </main>

      <Footer anchorBase={localePath(lang)} />
    </>
  )
}
