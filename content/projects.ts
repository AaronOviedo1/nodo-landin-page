import shots from './shots.generated.json'

/**
 * Tratamiento visual del logo.
 *   raw  → hay archivo y ya está listo para fondo Grafito.
 *   type → no hay archivo; se compone un marcador tipográfico.
 *
 * Los archivos originales llegaban con fondos sólidos y arte demasiado oscuro,
 * cada uno de una forma distinta. Antes eso se parcheaba con filtros CSS por
 * logo; ahora se resuelve de raíz en `scripts/normalize-logos.mjs`, que quita el
 * fondo y lleva los tonos oscuros a Cal. Por eso aquí ya solo hay dos casos.
 */
export type LogoTreatment = 'raw' | 'type'

export type Shot = {
  src: string
  alt: string
  width: number
  height: number
  blurDataURL: string
}

/**
 * Una interfaz del proyecto. Un mismo trabajo puede tener varias —holidog inn
 * son tres aplicaciones distintas— y todas se muestran a la par en la tarjeta.
 *
 * `framed` marca las capturas que ya traen dibujado su propio marco de teléfono,
 * para no encimarles otro.
 */
export type Surface = {
  id: string
  kind: 'desktop' | 'mobile'
  framed?: boolean
  shots: Shot[]
}

export type Project = {
  id: string
  name: string
  logo?: string
  treatment: LogoTreatment
  /** Ancho del logo en píxeles dentro de su caja, para nivelar el peso óptico. */
  logoWidth: number
  year: string
  url?: string
  status?: 'development' | 'own'
  /** Va en la portada. El resto vive en la reja compacta y en /proyectos. */
  featured?: boolean
  summary: { es: string; en: string }
  capabilities: { es: string[]; en: string[] }
  surfaces: Surface[]
}

const group = (key: string): Surface[] =>
  (shots as Record<string, Surface[]>)[key] ?? []

export const projects: Project[] = [
  {
    id: 'cota100',
    name: 'COTA100',
    logo: '/logos/cota100.png',
    treatment: 'raw',
    logoWidth: 132,
    year: '2026',
    featured: true,
    summary: {
      es: 'Toda la renta de andamios y maquinaria en un solo lugar: cotizaciones que se vuelven remisiones con un clic, entregas y recolecciones con foto, hora y ubicación, e inventario por almacén.',
      en: 'The whole scaffolding and equipment rental operation in one place: quotes that become delivery notes in one click, deliveries and pickups with photo, time and location, and inventory by warehouse.',
    },
    capabilities: {
      es: ['Rentas y renovaciones', 'Entregas con GPS', 'Lectura de órdenes con IA', 'App para iPhone'],
      en: ['Rentals and renewals', 'GPS deliveries', 'AI order reading', 'iPhone app'],
    },
    surfaces: group('cota100'),
  },
  {
    id: 'figueroa',
    name: 'Figueroa',
    logo: '/logos/figueroa.png',
    treatment: 'raw',
    logoWidth: 136,
    year: '2026',
    featured: true,
    summary: {
      es: 'Taller de camiones y maquinaria pesada: expediente por unidad, visitas con fotos y firma desde el celular, cotizaciones y facturas, y un portal donde su cliente sigue cada reparación.',
      en: 'Truck and heavy-equipment workshop: a file for every unit, on-site visits with photos and signatures from the phone, quotes and invoices, and a portal where their client follows every repair.',
    },
    capabilities: {
      es: ['Portal del cliente', 'Facturas CFDI', 'Reportes en PDF', 'Correo conectado'],
      en: ['Client portal', 'CFDI invoices', 'PDF reports', 'Connected email'],
    },
    surfaces: group('figueroa'),
  },
  {
    id: 'pipe-sos',
    name: 'Pipe SOS',
    logo: '/logos/pipe-sos.png',
    treatment: 'raw',
    logoWidth: 128,
    year: '2026',
    url: 'https://pipe-sos.com',
    featured: true,
    summary: {
      es: 'Servicios ferreteros a domicilio para Pipeso: más de 100 servicios con precio, cotización y pago en línea, seguimiento por folio y una app de iPhone para la mesa de servicio.',
      en: 'At-home hardware services for Pipeso: over 100 priced services, online quotes and payments, tracking by ticket number and an iPhone app for the service desk.',
    },
    capabilities: {
      es: ['Pagos en línea', 'Meses sin intereses', 'Seguimiento por folio', 'App para iPhone'],
      en: ['Online payments', 'Interest-free installments', 'Ticket tracking', 'iPhone app'],
    },
    surfaces: group('pipe-sos'),
  },
  {
    id: 'mac-construcciones',
    name: 'MAC Construcciones',
    logo: '/logos/mac-construcciones.png',
    treatment: 'raw',
    logoWidth: 124,
    year: '2026',
    featured: true,
    summary: {
      es: 'Cuatro constructoras en una sola app: presupuesto contra subcontrato, gastos que se llenan solos con la foto del ticket, cobranza, reparto por socio y PDFs con la hoja membretada de cada empresa.',
      en: 'Four construction companies in one app: budget against subcontracts, expenses filled in from a photo of the receipt, collections, partner payouts and PDFs on each company’s letterhead.',
    },
    capabilities: {
      es: ['Varias empresas', 'Gastos con IA', 'Utilidad por obra', 'App para iPhone'],
      en: ['Multi-company', 'AI expenses', 'Profit per project', 'iPhone app'],
    },
    surfaces: group('mac-construcciones'),
  },
  {
    id: 'morbar',
    name: 'Ganadera Morbar',
    logo: '/logos/morbar.png',
    treatment: 'raw',
    logoWidth: 96,
    year: '2026',
    featured: true,
    summary: {
      es: 'La operación de una ganadera de la sierra de Sonora: inventario de ganado, potreros en mapa satelital, requisiciones y pagos, nómina por rancho y combustible, con permisos de dirección a vaquero.',
      en: 'The operation of a cattle ranch in the Sonora highlands: herd inventory, pastures on a satellite map, requisitions and payments, payroll by ranch and fuel, with roles from management to cowhand.',
    },
    capabilities: {
      es: ['Inventario de ganado', 'Mapa de potreros', 'Nómina por rancho', 'App para iPhone'],
      en: ['Herd inventory', 'Pasture map', 'Payroll by ranch', 'iPhone app'],
    },
    surfaces: group('morbar'),
  },
  {
    id: 'holidog-inn',
    name: 'holidog inn',
    logo: '/logos/holidog-inn.png',
    treatment: 'raw',
    logoWidth: 76,
    year: '2025',
    featured: true,
    summary: {
      es: 'Tienda en línea, aplicación web administrativa y aplicación móvil, las tres sobre una sola base de datos y hablándose entre sí.',
      en: 'Online store, admin web app and mobile app, all three on a single database and talking to each other.',
    },
    capabilities: {
      es: ['Tienda en línea', 'Panel administrativo', 'App móvil', 'Reservas y estancias'],
      en: ['Online store', 'Admin dashboard', 'Mobile app', 'Bookings and stays'],
    },
    surfaces: group('holidog-inn'),
  },
  {
    id: 'cos-arquitectura',
    name: 'COS Arquitectura',
    logo: '/logos/cos-arquitectura.png',
    treatment: 'raw',
    logoWidth: 84,
    year: '2026',
    summary: {
      es: 'Administración de obras de principio a fin: cotizaciones, contratos, gastos, caja chica, cobranza y nómina, con registro de pagos asistido por IA.',
      en: 'End-to-end construction management: quotes, contracts, expenses, petty cash, collections and payroll, with AI-assisted payment capture.',
    },
    capabilities: {
      es: ['Control de obras', 'Pagos con IA', 'Cotizaciones', 'Nómina'],
      en: ['Project control', 'AI payments', 'Quotes', 'Payroll'],
    },
    surfaces: group('cos'),
  },
  {
    id: 'haaco-pro',
    name: 'HAACO PRO',
    logo: '/logos/haaco-pro.png',
    treatment: 'raw',
    logoWidth: 118,
    year: '2026',
    summary: {
      es: 'La misma columna vertebral de administración de obras, ajustada a los flujos de herrería, pintura e impermeabilización.',
      en: 'The same project-management backbone, tailored to metalwork, painting and waterproofing workflows.',
    },
    capabilities: {
      es: ['Recubrimientos', 'Control de gastos', 'Cotizaciones', 'Cobranza'],
      en: ['Coatings', 'Expense control', 'Quotes', 'Collections'],
    },
    surfaces: group('haaco-pro'),
  },
  {
    id: 'fresa-fit',
    name: 'Fresa Fit',
    logo: '/logos/fresa-fit.png',
    treatment: 'raw',
    logoWidth: 152,
    year: '2026',
    summary: {
      es: 'Toda la operación del negocio en un solo lugar, conectada a Tiendanube, Mercado Libre y TikTok Shop para sincronizar inventario y precios en las tres.',
      en: 'The entire business operation in one place, wired into Tiendanube, Mercado Libre and TikTok Shop to sync inventory and pricing across all three.',
    },
    capabilities: {
      es: ['Tiendanube', 'Mercado Libre', 'TikTok Shop', 'Inventario sincronizado'],
      en: ['Tiendanube', 'Mercado Libre', 'TikTok Shop', 'Synced inventory'],
    },
    surfaces: group('fresa-fit'),
  },
  {
    id: 'climaxpress',
    name: 'ClimaXpress',
    logo: '/logos/climaxpress.png',
    treatment: 'raw',
    logoWidth: 44,
    year: '2025',
    url: 'https://climaxpress.vercel.app',
    status: 'own',
    summary: {
      es: 'Renta de aerocoolers y calentones de punta a punta: cotizaciones, entregas, recolecciones, inventario, avisos por WhatsApp y rutas en Google Maps.',
      en: 'End-to-end rental of evaporative coolers and heaters: quotes, deliveries, pickups, inventory, WhatsApp notifications and Google Maps routing.',
    },
    capabilities: {
      es: ['Rentas y entregas', 'WhatsApp', 'Rutas en mapa', 'Inventario'],
      en: ['Rentals and delivery', 'WhatsApp', 'Map routing', 'Inventory'],
    },
    surfaces: group('climaxpress'),
  },
  {
    id: 'fundacion-miika',
    name: 'Fundación Miika',
    logo: '/logos/fundacion-miika.png',
    treatment: 'raw',
    logoWidth: 92,
    year: '2025',
    url: 'https://www.fundacionmiika.org',
    summary: {
      es: 'Sitio de la fundación que difunde la importancia de la donación de órganos y acerca a las familias a la información que necesitan.',
      en: 'Foundation site that spreads awareness about organ donation and brings families the information they need.',
    },
    capabilities: {
      es: ['Sitio institucional', 'Difusión', 'Contenido'],
      en: ['Institutional site', 'Outreach', 'Content'],
    },
    surfaces: group('fundacion-miika'),
  },
  {
    id: 'lizzy',
    name: 'Lizzy',
    logo: '/logos/lizzy.png',
    treatment: 'raw',
    logoWidth: 96,
    year: '2026',
    status: 'development',
    summary: {
      es: 'Mercado de renta de artículos y servicios para eventos, en web y móvil. Cada usuario puede ser proveedor o cliente según lo que necesite ese día.',
      en: 'Marketplace for renting event items and services, on web and mobile. Every user can be a supplier or a customer depending on what they need that day.',
    },
    capabilities: {
      es: ['Marketplace', 'Doble rol', 'Web y móvil'],
      en: ['Marketplace', 'Dual role', 'Web and mobile'],
    },
    surfaces: group('lizzy'),
  },
  {
    id: 'mlb-totals',
    name: 'MLB & NFL totals',
    treatment: 'type',
    logoWidth: 190,
    year: '2026',
    status: 'development',
    summary: {
      es: 'Dos modelos de predicción, uno para béisbol y otro para futbol americano: totales, líneas y props, con alertas en vivo cuando aparece una ventaja, afinados semana a semana contra resultados reales.',
      en: 'Two prediction models, one for baseball and one for American football: totals, spreads and props, with live alerts when an edge shows up, tuned week after week against real results.',
    },
    capabilities: {
      es: ['Modelos predictivos', 'Alertas en vivo', 'Backtesting', 'App para iPhone'],
      en: ['Predictive models', 'Live alerts', 'Backtesting', 'iPhone app'],
    },
    surfaces: group('mlb-totals'),
  },
]

export const stack = [
  'Next.js',
  'React Native',
  'TypeScript',
  'PostgreSQL',
  'Supabase',
  'Vercel',
  'Claude',
]
