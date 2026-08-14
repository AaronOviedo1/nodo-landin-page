import type { Metadata, Viewport } from 'next'
import { Archivo, Montserrat } from 'next/font/google'
import { notFound } from 'next/navigation'
import { LanguageProvider } from '@/lib/i18n'
import SmoothScroll from '@/components/SmoothScroll'
import { seo } from '@/content/seo'
import {
  HREFLANG,
  isLang,
  languageAlternates,
  localePath,
  LOCALES,
  OG_LOCALE,
  SITE_URL,
} from '@/lib/site'
import { structuredData } from '@/lib/structured-data'
import '../globals.css'

const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-archivo',
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
})

/** Las dos versiones se generan en el build; cualquier otro idioma es un 404. */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }))
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: LayoutProps<'/[lang]'>): Promise<Metadata> {
  const { lang } = await params
  if (!isLang(lang)) notFound()

  const s = seo[lang]

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: s.title, template: s.titleTemplate },
    description: s.description,
    keywords: s.keywords,
    applicationName: 'nodo.',
    authors: [{ name: 'nodo.', url: SITE_URL }],
    creator: 'nodo.',
    publisher: 'nodo.',
    category: 'technology',
    // Cada idioma es su propia canónica y declara al otro como alternativa;
    // sin esto Google trata las dos versiones como contenido duplicado.
    alternates: {
      canonical: localePath(lang),
      languages: languageAlternates(),
    },
    openGraph: {
      type: 'website',
      locale: OG_LOCALE[lang],
      alternateLocale: LOCALES.filter((l) => l !== lang).map((l) => OG_LOCALE[l]),
      url: localePath(lang),
      siteName: 'nodo.',
      title: s.ogTitle,
      description: s.ogDescription,
    },
    twitter: {
      card: 'summary_large_image',
      title: s.ogTitle,
      description: s.ogDescription,
    },
    icons: {
      icon: [
        { url: '/brand/favicon.svg', type: 'image/svg+xml' },
        { url: '/brand/favicon-32.png', sizes: '32x32', type: 'image/png' },
        { url: '/brand/favicon-512.png', sizes: '512x512', type: 'image/png' },
      ],
      apple: '/brand/favicon-180.png',
    },
    manifest: '/manifest.webmanifest',
    // El teléfono de contacto es de WhatsApp: no queremos que iOS convierta
    // cualquier número del texto en un enlace de llamada.
    formatDetection: { telephone: false, address: false, email: false },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    // Se llena desde Vercel cuando se reclame el sitio en Search Console.
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && {
      verification: {
        google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      },
    }),
  }
}

export const viewport: Viewport = {
  themeColor: '#131619',
  colorScheme: 'dark',
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<'/[lang]'>) {
  const { lang } = await params
  if (!isLang(lang)) notFound()

  return (
    <html
      lang={HREFLANG[lang]}
      className={`${archivo.variable} ${montserrat.variable}`}
    >
      <body className="bg-grafito text-cal antialiased">
        {/* Datos estructurados: la mayoría de los prospectos llegan por
            búsqueda local en Hermosillo. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData(lang)),
          }}
        />
        <LanguageProvider lang={lang}>
          <SmoothScroll />
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
