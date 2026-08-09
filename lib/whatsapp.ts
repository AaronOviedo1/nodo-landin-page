import type { Lang } from '@/content/copy'

/** Único lugar donde vive el número. Cambiarlo aquí lo cambia en toda la página. */
export const WHATSAPP_NUMBER = '526621498888'
export const WHATSAPP_DISPLAY = '+52 662 149 8888'
export const EMAIL = 'nodo.atencion@gmail.com'

/** De dónde salió el clic, para saber qué sección convierte. */
export type CtaOrigin = 'nav' | 'hero' | 'proyecto' | 'cierre' | 'footer' | 'proceso'

const MESSAGES: Record<Lang, Record<CtaOrigin, string>> = {
  es: {
    nav: 'Hola nodo., quiero saber cómo pueden ayudarme.',
    hero: 'Hola nodo., quiero ordenar la operación de mi negocio con software a la medida.',
    proyecto: 'Hola nodo., vi sus proyectos y quiero algo parecido para mi negocio.',
    proceso: 'Hola nodo., me interesa empezar con un diagnóstico de mi operación.',
    cierre: 'Hola nodo., quiero agendar un diagnóstico de mi operación.',
    footer: 'Hola nodo., tengo una pregunta.',
  },
  en: {
    nav: 'Hi nodo., I would like to know how you can help me.',
    hero: 'Hi nodo., I want to streamline my business operations with custom software.',
    proyecto: 'Hi nodo., I saw your work and I want something similar for my business.',
    proceso: 'Hi nodo., I am interested in starting with an operations audit.',
    cierre: 'Hi nodo., I would like to schedule an operations audit.',
    footer: 'Hi nodo., I have a question.',
  },
}

export function whatsappUrl(lang: Lang, origin: CtaOrigin = 'hero') {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(MESSAGES[lang][origin])}`
}
