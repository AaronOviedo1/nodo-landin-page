import type { Lang } from './copy'
import { EMAIL, WHATSAPP_DISPLAY } from '@/lib/whatsapp'

/**
 * Aviso de privacidad integral, conforme a la Ley Federal de Protección de
 * Datos Personales en Posesión de los Particulares (DOF, 20 de marzo de 2025).
 * Meta no deja publicar un formulario de anuncios sin un enlace a él.
 *
 * Si algún día el sitio carga el píxel de Meta, Google Analytics o cualquier
 * otra cookie de rastreo, la sección de cookies deja de ser cierta y hay que
 * actualizarla junto con la fecha.
 */

/** Un renglón de lista: texto suelto o [término en negritas, explicación]. */
export type PrivacyItem = string | readonly [string, string]

export type PrivacyBlock = string | { list: readonly PrivacyItem[] }

export type PrivacySection = {
  heading: string
  body: readonly PrivacyBlock[]
}

type PrivacyNotice = {
  title: string
  description: string
  updatedLabel: string
  updated: string
  intro: string
  sections: readonly PrivacySection[]
  /** Solo en la traducción: la versión que obliga es la de español. */
  note?: string
}

/** Quién responde por los datos ante la ley. */
const RESPONSIBLE = 'Aaron Oviedo'

/** Domicilio para oír y recibir notificaciones; la ley pide que el aviso lo diga. */
const ADDRESS = 'Oxford 13, col. Bretaña, C.P. 83148, Hermosillo, Sonora, México'

export const privacidad: Record<Lang, PrivacyNotice> = {
  es: {
    title: 'Aviso de privacidad',
    description:
      'Cómo nodo. recaba, usa y protege los datos personales que nos compartes por nuestros formularios, WhatsApp, correo y este sitio.',
    updatedLabel: 'Última actualización',
    updated: '23 de octubre de 2026',
    intro:
      'Este aviso explica qué datos personales recabamos cuando te pones en contacto con nosotros, para qué los usamos y cómo puedes ejercer tus derechos sobre ellos. Al compartirnos tus datos por cualquiera de los medios que se describen aquí, aceptas que los tratemos conforme a este aviso.',
    sections: [
      {
        heading: 'Quién es responsable de tus datos',
        body: [
          `nodo. es el nombre comercial con el que opera ${RESPONSIBLE}, con domicilio en ${ADDRESS} (en adelante, «nodo.» o «nosotros»). Somos responsables del tratamiento de tus datos personales conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.`,
          `Para cualquier asunto relacionado con este aviso o con tus datos, escríbenos a ${EMAIL}.`,
        ],
      },
      {
        heading: 'Qué datos recabamos',
        body: [
          'Solo te pedimos lo necesario para atender tu solicitud:',
          {
            list: [
              ['Identificación y contacto', 'nombre, teléfono, correo electrónico y ciudad.'],
              [
                'Datos de tu negocio',
                'nombre de la empresa, giro, puesto y lo que nos cuentes sobre tu operación y el proyecto que te interesa.',
              ],
            ],
          },
          'Los recabamos cuando llenas un formulario en Facebook o Instagram, nos escribes por WhatsApp o correo, nos contactas desde este sitio o nos reunimos contigo.',
          'No te pedimos datos personales sensibles (como salud, creencias u origen étnico) ni datos financieros o patrimoniales. Te pedimos que no nos los envíes por estos medios.',
        ],
      },
      {
        heading: 'Para qué los usamos',
        body: [
          'Finalidades necesarias para atenderte:',
          {
            list: [
              'Ponernos en contacto contigo para responder tu solicitud.',
              'Agendar y realizar el diagnóstico de tu operación.',
              'Preparar y enviarte una propuesta o cotización.',
              'Si nos contratas, dar seguimiento al proyecto, facturar y darte soporte.',
            ],
          },
          'Finalidades adicionales, que no son necesarias para atenderte:',
          {
            list: [
              'Enviarte de vez en cuando novedades, casos de éxito o promociones de nodo.',
              'Pedirte tu opinión sobre nuestro servicio.',
            ],
          },
          `Si no quieres que usemos tus datos para estas finalidades adicionales, escríbenos a ${EMAIL} con el asunto «No deseo publicidad». Puedes hacerlo en cualquier momento, y negarte no afecta tu relación con nosotros.`,
        ],
      },
      {
        heading: 'Con quién los compartimos',
        body: [
          'No vendemos ni rentamos tus datos personales. No los transferimos a terceros sin tu consentimiento, salvo en los casos que la ley permite, como un requerimiento de una autoridad competente.',
          'Para operar nos apoyamos en proveedores que tratan tus datos únicamente por cuenta nuestra y bajo nuestras instrucciones: Google (correo electrónico), Meta (WhatsApp, Facebook e Instagram) y Vercel (alojamiento de este sitio). Algunos de sus servidores están fuera de México.',
          'Cuando llenas un formulario en Facebook o Instagram, Meta recaba esos datos y nos los entrega. El uso que Meta hace de la información de su plataforma se rige por su propia política de privacidad.',
        ],
      },
      {
        heading: 'Tus derechos ARCO',
        body: [
          'Tienes derecho a saber qué datos tuyos tenemos y para qué los usamos (Acceso), a pedir que los corrijamos si están incompletos o equivocados (Rectificación), a que los eliminemos de nuestros registros (Cancelación) y a oponerte a que los usemos para fines específicos (Oposición).',
          `Para ejercerlos, envía un correo a ${EMAIL} con el asunto «Derechos ARCO» que incluya:`,
          {
            list: [
              'Tu nombre y un medio para responderte.',
              'Una copia de tu identificación oficial o, si lo haces a nombre de alguien más, el documento que acredite la representación.',
              'Una descripción clara de los datos y del derecho que quieres ejercer.',
              'Cualquier otro dato que nos ayude a localizar tu información.',
            ],
          },
          'Te responderemos en un plazo máximo de 20 días hábiles y, si tu solicitud procede, la haremos efectiva dentro de los 15 días hábiles siguientes.',
        ],
      },
      {
        heading: 'Revocar tu consentimiento o limitar el uso',
        body: [
          `Puedes revocar en cualquier momento el consentimiento que nos diste, o pedirnos que limitemos el uso o la divulgación de tus datos, por el mismo medio: un correo a ${EMAIL}. Ten en cuenta que, si la relación sigue vigente, no siempre podremos dejar de usar los datos que necesitamos para cumplir con ella.`,
          'También puedes inscribir tu teléfono en el Registro Público para Evitar Publicidad de la Profeco.',
        ],
      },
      {
        heading: 'Cookies',
        body: [
          'Este sitio no usa cookies ni tecnologías de rastreo publicitario. El servidor que lo aloja registra datos técnicos de cada visita, como la dirección IP y el tipo de navegador, solo para mantenerlo funcionando y seguro.',
        ],
      },
      {
        heading: 'Cambios a este aviso',
        body: [
          'Si este aviso cambia, publicaremos la versión nueva en esta misma página con su fecha de actualización.',
          'Si consideras que tu derecho a la protección de datos personales fue vulnerado, puedes acudir a la Secretaría Anticorrupción y Buen Gobierno, la autoridad en la materia.',
          `Dudas: ${EMAIL} · WhatsApp ${WHATSAPP_DISPLAY}.`,
        ],
      },
    ],
  },

  en: {
    title: 'Privacy notice',
    description:
      'How nodo. collects, uses and protects the personal data you share with us through our forms, WhatsApp, email and this website.',
    updatedLabel: 'Last updated',
    updated: 'October 23, 2026',
    note: 'This is a translation for convenience. The Spanish version is the one that governs.',
    intro:
      'This notice explains what personal data we collect when you get in touch with us, what we use it for and how you can exercise your rights over it. By sharing your data with us through any of the channels described here, you agree to its processing under this notice.',
    sections: [
      {
        heading: 'Who is responsible for your data',
        body: [
          `nodo. is the trade name under which ${RESPONSIBLE} operates, with its address at ${ADDRESS} ("nodo.", "we" or "us"). We are responsible for processing your personal data under Mexico’s Federal Law on the Protection of Personal Data Held by Private Parties.`,
          `For anything related to this notice or your data, write to us at ${EMAIL}.`,
        ],
      },
      {
        heading: 'What data we collect',
        body: [
          'We only ask for what we need to handle your request:',
          {
            list: [
              ['Identity and contact', 'name, phone number, email address and city.'],
              [
                'Business details',
                'company name, industry, role and whatever you tell us about your operation and the project you have in mind.',
              ],
            ],
          },
          'We collect it when you fill out a form on Facebook or Instagram, message us on WhatsApp or by email, contact us from this website or meet with us.',
          'We do not ask for sensitive personal data (such as health, beliefs or ethnic origin) or for financial data. Please do not send it to us through these channels.',
        ],
      },
      {
        heading: 'What we use it for',
        body: [
          'Purposes required to serve you:',
          {
            list: [
              'Getting in touch with you to answer your request.',
              'Scheduling and carrying out the operations audit.',
              'Preparing and sending you a proposal or quote.',
              'If you hire us, managing the project, invoicing and providing support.',
            ],
          },
          'Additional purposes, not required to serve you:',
          {
            list: [
              'Occasionally sending you news, case studies or offers from nodo.',
              'Asking for your feedback on our service.',
            ],
          },
          `If you do not want us to use your data for these additional purposes, email ${EMAIL} with the subject "No marketing". You can do so at any time, and opting out does not affect your relationship with us.`,
        ],
      },
      {
        heading: 'Who we share it with',
        body: [
          'We do not sell or rent your personal data. We do not transfer it to third parties without your consent, except where the law allows it, such as a request from a competent authority.',
          'We rely on providers that process your data only on our behalf and under our instructions: Google (email), Meta (WhatsApp, Facebook and Instagram) and Vercel (hosting for this website). Some of their servers are outside Mexico.',
          'When you fill out a form on Facebook or Instagram, Meta collects that data and passes it on to us. Meta’s use of information on its platform is governed by its own privacy policy.',
        ],
      },
      {
        heading: 'Your ARCO rights',
        body: [
          'You have the right to know what data we hold about you and what we use it for (Access), to have it corrected if it is incomplete or wrong (Rectification), to have it deleted from our records (Cancellation) and to object to its use for specific purposes (Opposition).',
          `To exercise them, email ${EMAIL} with the subject "ARCO rights" and include:`,
          {
            list: [
              'Your name and a way to reply to you.',
              'A copy of your official ID or, if acting on someone else’s behalf, proof of representation.',
              'A clear description of the data and the right you want to exercise.',
              'Anything else that helps us locate your information.',
            ],
          },
          'We will reply within 20 business days and, if your request is granted, carry it out within the following 15 business days.',
        ],
      },
      {
        heading: 'Withdrawing consent or limiting use',
        body: [
          `You can withdraw your consent at any time, or ask us to limit the use or disclosure of your data, the same way: an email to ${EMAIL}. Keep in mind that while our relationship is ongoing, we may not be able to stop using the data we need to fulfil it.`,
          'You can also register your phone number with Profeco’s Public Registry to Avoid Advertising (REPEP).',
        ],
      },
      {
        heading: 'Cookies',
        body: [
          'This website does not use cookies or advertising tracking technologies. The server that hosts it logs technical data from each visit, such as IP address and browser type, only to keep it running and secure.',
        ],
      },
      {
        heading: 'Changes to this notice',
        body: [
          'If this notice changes, we will publish the new version on this page with its update date.',
          'If you believe your right to personal data protection has been violated, you can turn to the Secretaría Anticorrupción y Buen Gobierno, the Mexican authority on the matter.',
          `Questions: ${EMAIL} · WhatsApp ${WHATSAPP_DISPLAY}.`,
        ],
      },
    ],
  },
}
