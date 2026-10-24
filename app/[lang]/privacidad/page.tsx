import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Footer from '@/components/Footer'
import LanguageToggle from '@/components/ui/LanguageToggle'
import Wordmark from '@/components/ui/Wordmark'
import { copy } from '@/content/copy'
import { privacidad, type PrivacyItem } from '@/content/privacidad'
import {
  isLang,
  languageAlternates,
  localePath,
  PRIVACY_SUBPATH,
  privacyPath,
} from '@/lib/site'

export async function generateMetadata({
  params,
}: PageProps<'/[lang]/privacidad'>): Promise<Metadata> {
  const { lang } = await params
  if (!isLang(lang)) notFound()

  const p = privacidad[lang]

  return {
    title: p.title,
    description: p.description,
    // El layout declara la portada como canónica; aquí se reemplaza completo
    // porque la metadata de cada segmento se mezcla solo en el primer nivel.
    alternates: {
      canonical: privacyPath(lang),
      languages: languageAlternates(PRIVACY_SUBPATH),
    },
  }
}

function Item({ item }: { item: PrivacyItem }) {
  if (typeof item === 'string') return <>{item}</>
  const [term, text] = item
  return (
    <>
      <strong className="font-semibold text-cal">{term}:</strong> {text}
    </>
  )
}

export default async function PrivacyPage({
  params,
}: PageProps<'/[lang]/privacidad'>) {
  const { lang } = await params
  if (!isLang(lang)) notFound()

  const p = privacidad[lang]

  return (
    <>
      {/* Sin el nav de la portada: sus anclas no existen aquí. */}
      <header className="border-b border-acero">
        <div className="shell flex h-16 items-center justify-between gap-6 md:h-20">
          <Link href={localePath(lang)} aria-label={copy[lang].footer.home}>
            <Wordmark size="text-xl md:text-2xl" />
          </Link>
          <LanguageToggle subpath={PRIVACY_SUBPATH} />
        </div>
      </header>

      <main className="shell py-16 md:py-24">
        <article className="max-w-3xl">
          <h1 className="nodo-d2 text-balance">{p.title}</h1>
          <p className="nodo-m1 mt-8 text-humo">
            {p.updatedLabel} · {p.updated}
          </p>
          {p.note && <p className="nodo-p3 mt-4">{p.note}</p>}
          <p className="nodo-p1 mt-10 text-cal">{p.intro}</p>

          {p.sections.map((section, i) => (
            <section key={section.heading} className="mt-14 border-t border-acero pt-10">
              <h2 className="nodo-t2 flex items-baseline gap-4 text-balance">
                <span className="nodo-m1 shrink-0 text-senal">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {section.heading}
              </h2>

              <div className="mt-6 flex flex-col gap-4">
                {section.body.map((block, j) =>
                  typeof block === 'string' ? (
                    <p key={j} className="nodo-p1 text-humo">
                      {block}
                    </p>
                  ) : (
                    <ul key={j} className="flex flex-col gap-2 pl-5">
                      {block.list.map((item, k) => (
                        <li key={k} className="nodo-p1 list-[square] text-humo marker:text-acero">
                          <Item item={item} />
                        </li>
                      ))}
                    </ul>
                  ),
                )}
              </div>
            </section>
          ))}
        </article>
      </main>

      <Footer anchorBase={localePath(lang)} />
    </>
  )
}
