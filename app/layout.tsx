import type { Metadata, Viewport } from 'next'
import { Archivo, Montserrat } from 'next/font/google'
import { LanguageProvider } from '@/lib/i18n'
import SmoothScroll from '@/components/SmoothScroll'
import { SITE_URL } from '@/lib/site'
import { EMAIL, WHATSAPP_DISPLAY } from '@/lib/whatsapp'
import './globals.css'

const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-archivo',
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'nodo. — Software a la medida',
    template: '%s · nodo.',
  },
  description:
    'Construimos aplicaciones a la medida e integramos inteligencia artificial para optimizar flujos de trabajo operativos y administrativos. Hermosillo, Sonora.',
  keywords: [
    'software a la medida',
    'desarrollo de aplicaciones',
    'automatización con IA',
    'sistemas administrativos',
    'aplicaciones web',
    'Hermosillo',
    'Sonora',
  ],
  authors: [{ name: 'nodo.' }],
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    alternateLocale: 'en_US',
    url: SITE_URL,
    siteName: 'nodo.',
    title: 'nodo. — Software a la medida',
    description:
      'Tu operación no necesita más gente. Necesita mejor software. Aplicaciones a la medida e IA para negocios que ya funcionan.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'nodo. — Software a la medida',
    description:
      'Tu operación no necesita más gente. Necesita mejor software.',
  },
  icons: {
    icon: [
      { url: '/brand/favicon.svg', type: 'image/svg+xml' },
      { url: '/brand/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/brand/favicon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/brand/favicon-180.png',
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#131619',
  colorScheme: 'dark',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${archivo.variable} ${montserrat.variable}`}>
      <body className="bg-grafito text-cal antialiased">
        {/* Datos estructurados: la mayoría de los prospectos llegan por
            búsqueda local en Hermosillo. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ProfessionalService',
              name: 'nodo.',
              description:
                'Estudio de software a la medida. Aplicaciones web y móviles e inteligencia artificial para optimizar flujos de trabajo operativos y administrativos.',
              url: SITE_URL,
              email: EMAIL,
              telephone: WHATSAPP_DISPLAY,
              areaServed: 'MX',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Hermosillo',
                addressRegion: 'Sonora',
                addressCountry: 'MX',
              },
              knowsLanguage: ['es-MX', 'en'],
            }),
          }}
        />
        <LanguageProvider>
          <SmoothScroll />
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
