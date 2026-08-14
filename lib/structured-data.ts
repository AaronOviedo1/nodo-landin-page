import { copy, type Lang } from '@/content/copy'
import { faq } from '@/content/faq'
import { seo } from '@/content/seo'
import { EMAIL, WHATSAPP_DISPLAY, WHATSAPP_NUMBER } from './whatsapp'
import { HREFLANG, localeUrl, SITE_URL } from './site'

/**
 * Perfiles públicos del negocio. Google los usa para confirmar que la ficha de
 * empresa, las redes y este sitio son la misma entidad, así que cada perfil
 * nuevo se suma aquí. Falta la ficha de Google Business, que se agrega cuando
 * termine de verificarse.
 */
export const SOCIAL_LINKS: string[] = ['https://www.instagram.com/nodo.inc/']

const ORG_ID = `${SITE_URL}#organizacion`
const SITE_ID = `${SITE_URL}#sitio`

/**
 * Un solo bloque JSON-LD por página, con las entidades enlazadas por `@id`.
 * Enlazarlas en un `@graph` en vez de repetirlas sueltas evita que el buscador
 * crea que hay varios negocios distintos.
 */
export function structuredData(lang: Lang) {
  const t = copy[lang]
  const url = localeUrl(lang)

  const organizacion = {
    '@type': 'ProfessionalService',
    '@id': ORG_ID,
    name: 'nodo.',
    legalName: 'nodo.',
    description: seo[lang].business,
    url,
    email: EMAIL,
    telephone: WHATSAPP_DISPLAY,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/brand/favicon-512.png`,
      width: 512,
      height: 512,
    },
    image: `${SITE_URL}/brand/favicon-512.png`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Hermosillo',
      addressRegion: 'Sonora',
      addressCountry: 'MX',
    },
    // Base en Hermosillo, pero el trabajo es remoto y hay clientes en otros
    // estados: acotar el área a la ciudad dejaría fuera búsquedas reales.
    areaServed: [
      { '@type': 'City', name: 'Hermosillo' },
      { '@type': 'State', name: 'Sonora' },
      { '@type': 'Country', name: 'México' },
    ],
    knowsLanguage: ['es-MX', 'en'],
    ...(SOCIAL_LINKS.length > 0 && { sameAs: SOCIAL_LINKS }),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: EMAIL,
      telephone: `+${WHATSAPP_NUMBER}`,
      availableLanguage: ['es', 'en'],
      areaServed: 'MX',
    },
    // Cada servicio de la página, para que puedan aparecer por separado.
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: t.services.title,
      itemListElement: t.services.items.map((item) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: item.title,
          description: item.body,
          provider: { '@id': ORG_ID },
        },
      })),
    },
  }

  const sitio = {
    '@type': 'WebSite',
    '@id': SITE_ID,
    url,
    name: 'nodo.',
    description: seo[lang].description,
    inLanguage: HREFLANG[lang],
    publisher: { '@id': ORG_ID },
  }

  const pagina = {
    '@type': 'WebPage',
    '@id': `${url}#pagina`,
    url,
    name: seo[lang].title,
    description: seo[lang].description,
    inLanguage: HREFLANG[lang],
    isPartOf: { '@id': SITE_ID },
    about: { '@id': ORG_ID },
    primaryImageOfPage: `${SITE_URL}/brand/favicon-512.png`,
  }

  // Las preguntas ya están escritas y respondidas en la página; declararlas
  // permite que Google las muestre desplegadas en el resultado.
  const preguntas = {
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    inLanguage: HREFLANG[lang],
    isPartOf: { '@id': SITE_ID },
    mainEntity: faq[lang].map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [organizacion, sitio, pagina, preguntas],
  }
}
