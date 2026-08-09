import shots from './shots.generated.json'

/**
 * Tratamiento visual del logo. Los archivos llegan en estados muy distintos
 * y un filtro único no funciona para todos:
 *   invert → arte negro sobre transparente; se invierte a Cal.
 *   screen → arte claro sobre fondo oscuro sólido; el fondo se funde con Grafito.
 *   plate  → arte a color o sobre fondo claro; necesita una placa Cal detrás.
 *   raw    → ya se ve bien sobre Grafito.
 *   type   → no hay archivo; se compone un marcador tipográfico.
 */
export type LogoTreatment = 'invert' | 'screen' | 'plate' | 'raw' | 'type'

export type Shot = {
  src: string
  alt: string
  width: number
  height: number
  blurDataURL: string
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
  summary: { es: string; en: string }
  capabilities: { es: string[]; en: string[] }
  shots: Shot[]
  /** Capturas verticales de teléfono: se muestran en un marco distinto. */
  mobileShots?: Shot[]
}

const group = (key: string): Shot[] => (shots as Record<string, Shot[]>)[key] ?? []

const holidog = group('holidog-inn')
const cos = group('cos')

const isMobile = (s: Shot) => s.height > s.width

export const projects: Project[] = [
  {
    id: 'holidog-inn',
    name: 'holidog inn',
    logo: '/logos/holidog-inn.png',
    treatment: 'plate',
    logoWidth: 132,
    year: '2025',
    summary: {
      es: 'Tienda en línea, aplicación web administrativa y aplicación móvil, las tres sobre una sola base de datos y hablándose entre sí.',
      en: 'Online store, admin web app and mobile app, all three on a single database and talking to each other.',
    },
    capabilities: {
      es: ['Tienda en línea', 'Panel administrativo', 'App móvil', 'Reservas y estancias'],
      en: ['Online store', 'Admin dashboard', 'Mobile app', 'Bookings and stays'],
    },
    shots: holidog.filter((s) => !isMobile(s)),
    mobileShots: holidog.filter(isMobile),
  },
  {
    id: 'cos-arquitectura',
    name: 'COS Arquitectura',
    logo: '/logos/cos-arquitectura.png',
    treatment: 'invert',
    logoWidth: 118,
    year: '2026',
    summary: {
      es: 'Administración de obras de principio a fin: cotizaciones, contratos, gastos, caja chica, cobranza y nómina, con registro de pagos asistido por IA.',
      en: 'End-to-end construction management: quotes, contracts, expenses, petty cash, collections and payroll, with AI-assisted payment capture.',
    },
    capabilities: {
      es: ['Control de obras', 'Pagos con IA', 'Cotizaciones', 'Nómina'],
      en: ['Project control', 'AI payments', 'Quotes', 'Payroll'],
    },
    shots: cos.filter((s) => !isMobile(s)),
  },
  {
    id: 'haaco-pro',
    name: 'HAACO PRO',
    // El PNG original venía sobre verde sólido; scripts/fix-haaco-logo.mjs lo
    // dejó en Cal sobre transparente, así que ya no necesita blend alguno.
    logo: '/logos/haaco-pro.png',
    treatment: 'raw',
    logoWidth: 150,
    year: '2026',
    summary: {
      es: 'La misma columna vertebral de administración de obras, ajustada a los flujos de herrería, pintura e impermeabilización.',
      en: 'The same project-management backbone, tailored to metalwork, painting and waterproofing workflows.',
    },
    capabilities: {
      es: ['Recubrimientos', 'Control de gastos', 'Cotizaciones', 'Cobranza'],
      en: ['Coatings', 'Expense control', 'Quotes', 'Collections'],
    },
    shots: group('haaco'),
  },
  {
    id: 'fresa-fit',
    name: 'Fresa Fit',
    logo: '/logos/fresa-fit.png',
    treatment: 'invert',
    logoWidth: 116,
    year: '2026',
    summary: {
      es: 'Toda la operación del negocio en un solo lugar, conectada a Tiendanube, Mercado Libre y TikTok Shop para sincronizar inventario y precios en las tres.',
      en: 'The entire business operation in one place, wired into Tiendanube, Mercado Libre and TikTok Shop to sync inventory and pricing across all three.',
    },
    capabilities: {
      es: ['Tiendanube', 'Mercado Libre', 'TikTok Shop', 'Inventario sincronizado'],
      en: ['Tiendanube', 'Mercado Libre', 'TikTok Shop', 'Synced inventory'],
    },
    shots: group('fresa-fit'),
  },
  {
    id: 'climaxpress',
    name: 'ClimaXpress',
    logo: '/logos/climaxpress.png',
    treatment: 'raw',
    logoWidth: 74,
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
    shots: group('climaxpress'),
  },
  {
    id: 'fundacion-miika',
    name: 'Fundación Miika',
    logo: '/logos/fundacion-miika.png',
    treatment: 'plate',
    logoWidth: 138,
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
    shots: group('fundacion-miika'),
  },
  {
    id: 'lizzy',
    name: 'Lizzy',
    treatment: 'type',
    logoWidth: 120,
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
    shots: group('lizzy'),
  },
  {
    id: 'mlb-totals',
    name: 'MLB-totals',
    treatment: 'type',
    logoWidth: 150,
    year: '2026',
    status: 'development',
    summary: {
      es: 'Modelo de predicción para los overs y unders de juegos de béisbol, en afinación continua contra resultados reales.',
      en: 'Prediction model for baseball over/under totals, continuously tuned against real results.',
    },
    capabilities: {
      es: ['Modelo predictivo', 'Datos históricos', 'Backtesting'],
      en: ['Predictive model', 'Historical data', 'Backtesting'],
    },
    shots: group('mlb-totals'),
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
