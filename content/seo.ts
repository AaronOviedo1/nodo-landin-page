import type { Lang } from './copy'

/**
 * Textos que solo ve el buscador. Viven aparte del copy de la página porque
 * obedecen a otras reglas: el título pelea por un lugar en los resultados y
 * necesita la palabra que la gente escribe («software a la medida») junto a la
 * ciudad; el copy de la página, en cambio, ya tiene al visitante adentro.
 *
 * Largos que respetan lo que Google alcanza a mostrar: título hasta ~60
 * caracteres, descripción hasta ~155.
 */
type Seo = {
  title: string
  titleTemplate: string
  description: string
  ogTitle: string
  ogDescription: string
  ogAlt: string
  keywords: string[]
  /** Descripción del negocio para los datos estructurados. */
  business: string
}

export const seo: Record<Lang, Seo> = {
  es: {
    title: 'Software a la medida en Hermosillo, Sonora — nodo.',
    titleTemplate: '%s · nodo.',
    description:
      'Desarrollamos aplicaciones web, apps móviles y automatización con inteligencia artificial para negocios de Hermosillo y todo México. Diagnóstico sin costo.',
    ogTitle: 'nodo. — Software a la medida',
    ogDescription:
      'Tu operación no necesita más gente. Necesita mejor software. Aplicaciones a la medida e IA para negocios que ya funcionan.',
    ogAlt: 'nodo. — Software a la medida en Hermosillo, Sonora',
    keywords: [
      'software a la medida',
      'desarrollo de software Hermosillo',
      'desarrollo de aplicaciones web',
      'aplicaciones móviles a la medida',
      'automatización con inteligencia artificial',
      'sistemas administrativos para empresas',
      'programadores en Hermosillo',
      'desarrollo de software Sonora',
      'ERP a la medida',
      'integración de sistemas',
    ],
    business:
      'Estudio de software a la medida en Hermosillo, Sonora. Construimos aplicaciones web y móviles e integramos inteligencia artificial para ordenar la operación de negocios que ya funcionan.',
  },

  en: {
    title: 'Custom Software Development in Hermosillo, Mexico — nodo.',
    titleTemplate: '%s · nodo.',
    description:
      'We build custom web applications, mobile apps and AI automation for businesses in Hermosillo and across Mexico. The initial operations audit is free.',
    ogTitle: 'nodo. — Custom software',
    ogDescription:
      'Your operation does not need more people. It needs better software. Custom applications and AI for businesses that already work.',
    ogAlt: 'nodo. — Custom software development in Hermosillo, Mexico',
    keywords: [
      'custom software development',
      'software development Hermosillo',
      'custom web application development',
      'custom mobile app development',
      'AI automation for business',
      'business management systems',
      'software developers in Mexico',
      'nearshore software development',
      'custom ERP',
      'systems integration',
    ],
    business:
      'Custom software studio based in Hermosillo, Sonora, Mexico. We build web and mobile applications and integrate artificial intelligence to streamline the operations of businesses that already work.',
  },
}
