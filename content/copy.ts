export type Lang = 'es' | 'en'

export const copy = {
  es: {
    nav: {
      links: [
        { href: '#servicios', label: 'Servicios' },
        { href: '#proyectos', label: 'Proyectos' },
        { href: '#proceso', label: 'Proceso' },
        { href: '#faq', label: 'Preguntas' },
      ],
      cta: 'Hablemos',
      menu: 'Menú',
      close: 'Cerrar',
    },

    hero: {
      eyebrow: 'Software a la medida · Hermosillo, Sonora',
      title: ['Tu operación no necesita', 'más gente. Necesita', 'mejor software'],
      body: 'Construimos aplicaciones a la medida e integramos inteligencia artificial para negocios que ya funcionan, pero se ahogan en procesos manuales.',
      ctaPrimary: 'Hablemos por WhatsApp',
      ctaSecondary: 'Ver proyectos',
      scroll: 'Desliza',
    },

    clients: {
      label: 'Negocios que ya operan sobre nodo.',
    },

    problem: {
      label: 'El problema',
      title: 'El cuello de botella no es tu equipo. Es el papel.',
      body: 'La mayoría de los negocios no fallan por falta de esfuerzo. Fallan porque la información vive en lugares que no se hablan entre sí.',
      pains: [
        {
          title: 'Inventario en tres plataformas',
          body: 'Vendes en tienda en línea, Mercado Libre y TikTok Shop. Cada venta obliga a actualizar tres lugares a mano y siempre se escapa uno.',
        },
        {
          title: 'Pagos capturados a mano',
          body: 'Llegan comprobantes por WhatsApp y alguien los transcribe a una hoja de cálculo. Toma horas y el error se descubre a fin de mes.',
        },
        {
          title: 'Cotizaciones en Excel',
          body: 'Cada cotización se arma copiando la anterior. Los precios quedan desactualizados y nadie sabe cuál fue la versión que se envió.',
        },
        {
          title: 'Nada es rastreable',
          body: 'Cuando quieres saber cuánto dejó una obra, un cliente o un mes, hay que reconstruirlo a mano desde cero.',
        },
      ],
      close: 'Nada de esto se arregla contratando a otra persona. Se arregla con software que ya sepa lo que tu negocio hace.',
    },

    services: {
      label: 'Qué construimos',
      title: 'Piezas que se conectan entre sí',
      body: 'No vendemos licencias ni plantillas. Construimos el sistema que tu operación necesita, conectado de punta a punta.',
      items: [
        {
          title: 'Aplicaciones web administrativas',
          body: 'El centro de mando de tu negocio: obras, clientes, inventario, cobranza y nómina en un solo lugar, con permisos por rol.',
        },
        {
          title: 'Aplicaciones móviles',
          body: 'Lo que pasa en campo se registra en campo. Apps para iOS y Android conectadas a la misma base de datos que la web.',
        },
        {
          title: 'Comercio electrónico',
          body: 'Tiendas en línea que comparten inventario y clientes con tu sistema administrativo. Una venta actualiza todo.',
        },
        {
          title: 'Integraciones',
          body: 'Tiendanube, Mercado Libre, TikTok Shop, WhatsApp, Google Maps. Que las plataformas que ya usas se hablen entre sí.',
        },
        {
          title: 'Automatización con IA',
          body: 'Lectura de comprobantes, captura automática de pagos, clasificación de gastos y modelos predictivos sobre tus propios datos.',
        },
        {
          title: 'Sitios web y landings',
          body: 'Presencia que vende y carga rápido, con la analítica conectada para saber de dónde viene cada cliente.',
        },
      ],
    },

    projects: {
      label: 'Proyectos',
      title: 'Sistemas corriendo hoy',
      body: 'Cada uno resuelve una operación distinta. Ninguno es una plantilla.',
      inDevelopment: 'En desarrollo',
      own: 'Negocio propio',
      visit: 'Visitar sitio',
      viewShots: 'Ver capturas',
      capabilities: 'Incluye',
      shotsPending: 'Capturas en camino',
      surfaces: {
        tienda: 'Tienda en línea',
        admin: 'Panel administrativo',
        escritorio: 'Escritorio',
        movil: 'Aplicación móvil',
      },
    },

    stats: {
      label: 'En números',
      items: [
        { value: 8, suffix: '', label: 'Proyectos construidos' },
        { value: 6, suffix: '', label: 'Negocios operando' },
        { value: 3, suffix: '', label: 'Plataformas de venta integradas' },
        { value: 2, suffix: '', label: 'Aplicaciones móviles' },
      ],
    },

    process: {
      label: 'Cómo trabajamos',
      title: 'Cuatro pasos, sin sorpresas',
      body: 'Empezamos entendiendo tu operación, no vendiéndote una solución.',
      steps: [
        {
          title: 'Diagnóstico',
          body: 'Nos sentamos contigo y mapeamos cómo trabaja tu negocio hoy: quién hace qué, dónde vive la información y dónde se atora. Sin costo.',
        },
        {
          title: 'Diseño de la solución',
          body: 'Te presentamos qué se va a construir, en qué orden y qué resuelve cada parte. Con alcance y precio cerrados antes de escribir código.',
        },
        {
          title: 'Construcción',
          body: 'Construimos por etapas y te mostramos avances reales cada semana. Usas la primera versión mucho antes de que esté todo terminado.',
        },
        {
          title: 'Puesta en marcha y soporte',
          body: 'Migramos tus datos, capacitamos a tu equipo y seguimos disponibles. El sistema crece contigo, no se congela en la entrega.',
        },
      ],
      cta: 'Empezar con el diagnóstico',
    },

    stack: {
      label: 'Con qué lo construimos',
      body: 'Tecnología estándar de la industria, sin ataduras a proveedores raros.',
    },

    faq: {
      label: 'Preguntas',
      title: 'Lo que todos preguntan',
    },

    cta: {
      label: 'Siguiente paso',
      title: 'Cuéntanos qué se te está atorando',
      body: 'El diagnóstico no cuesta nada y no compromete a nada. Si podemos ayudarte, te decimos cómo. Si no, también te lo decimos.',
      button: 'Escríbenos por WhatsApp',
      alt: 'o escríbenos a',
    },

    footer: {
      tagline: 'Software a la medida para negocios que quieren crecer sin crecer en desorden.',
      basedIn: 'Hermosillo, Sonora · México',
      rights: 'Todos los derechos reservados.',
      sections: 'Secciones',
      contact: 'Contacto',
    },
  },

  en: {
    nav: {
      links: [
        { href: '#servicios', label: 'Services' },
        { href: '#proyectos', label: 'Work' },
        { href: '#proceso', label: 'Process' },
        { href: '#faq', label: 'FAQ' },
      ],
      cta: "Let's talk",
      menu: 'Menu',
      close: 'Close',
    },

    hero: {
      eyebrow: 'Custom software · Hermosillo, Mexico',
      title: ['Your operation does not', 'need more people. It needs', 'better software'],
      body: 'We build custom applications and integrate artificial intelligence for businesses that already work, but are drowning in manual processes.',
      ctaPrimary: 'Talk on WhatsApp',
      ctaSecondary: 'See our work',
      scroll: 'Scroll',
    },

    clients: {
      label: 'Businesses already running on nodo.',
    },

    problem: {
      label: 'The problem',
      title: 'The bottleneck is not your team. It is the paperwork.',
      body: 'Most businesses do not fail from lack of effort. They fail because their information lives in places that never talk to each other.',
      pains: [
        {
          title: 'Inventory across three platforms',
          body: 'You sell on your own store, Mercado Libre and TikTok Shop. Every sale means updating three places by hand, and one always slips.',
        },
        {
          title: 'Payments typed in by hand',
          body: 'Receipts arrive over WhatsApp and someone retypes them into a spreadsheet. It takes hours and mistakes surface at month end.',
        },
        {
          title: 'Quotes built in Excel',
          body: 'Every quote is a copy of the last one. Prices go stale and nobody knows which version was actually sent.',
        },
        {
          title: 'Nothing is traceable',
          body: 'When you want to know what a project, a client or a month actually earned, someone has to rebuild it from scratch.',
        },
      ],
      close: 'None of this gets fixed by hiring another person. It gets fixed with software that already knows how your business works.',
    },

    services: {
      label: 'What we build',
      title: 'Pieces that connect to each other',
      body: 'We do not sell licenses or templates. We build the system your operation needs, wired end to end.',
      items: [
        {
          title: 'Admin web applications',
          body: 'Your command center: projects, clients, inventory, collections and payroll in one place, with role-based access.',
        },
        {
          title: 'Mobile applications',
          body: 'What happens in the field gets recorded in the field. iOS and Android apps on the same database as the web app.',
        },
        {
          title: 'E-commerce',
          body: 'Online stores that share inventory and customers with your admin system. One sale updates everything.',
        },
        {
          title: 'Integrations',
          body: 'Tiendanube, Mercado Libre, TikTok Shop, WhatsApp, Google Maps. Making the platforms you already use talk to each other.',
        },
        {
          title: 'AI automation',
          body: 'Receipt reading, automatic payment capture, expense classification and predictive models trained on your own data.',
        },
        {
          title: 'Websites and landing pages',
          body: 'A presence that sells and loads fast, with analytics wired in so you know where every customer came from.',
        },
      ],
    },

    projects: {
      label: 'Work',
      title: 'Systems running today',
      body: 'Each one solves a different operation. None of them is a template.',
      inDevelopment: 'In development',
      own: 'Our own business',
      visit: 'Visit site',
      viewShots: 'View screens',
      capabilities: 'Includes',
      shotsPending: 'Screens coming soon',
      surfaces: {
        tienda: 'Online store',
        admin: 'Admin dashboard',
        escritorio: 'Desktop',
        movil: 'Mobile app',
      },
    },

    stats: {
      label: 'By the numbers',
      items: [
        { value: 8, suffix: '', label: 'Projects built' },
        { value: 6, suffix: '', label: 'Businesses running' },
        { value: 3, suffix: '', label: 'Sales platforms integrated' },
        { value: 2, suffix: '', label: 'Mobile applications' },
      ],
    },

    process: {
      label: 'How we work',
      title: 'Four steps, no surprises',
      body: 'We start by understanding your operation, not by selling you a solution.',
      steps: [
        {
          title: 'Audit',
          body: 'We sit down with you and map how your business works today: who does what, where the information lives and where it jams. Free of charge.',
        },
        {
          title: 'Solution design',
          body: 'We show you what will be built, in what order and what each part solves. Scope and price are closed before a line of code is written.',
        },
        {
          title: 'Build',
          body: 'We build in stages and show you real progress every week. You use the first version long before everything is finished.',
        },
        {
          title: 'Launch and support',
          body: 'We migrate your data, train your team and stay available. The system grows with you instead of freezing at delivery.',
        },
      ],
      cta: 'Start with the audit',
    },

    stack: {
      label: 'What we build it with',
      body: 'Industry-standard technology, with no lock-in to obscure vendors.',
    },

    faq: {
      label: 'FAQ',
      title: 'What everyone asks',
    },

    cta: {
      label: 'Next step',
      title: 'Tell us what is jamming up',
      body: 'The audit costs nothing and commits you to nothing. If we can help, we will tell you how. If we cannot, we will tell you that too.',
      button: 'Message us on WhatsApp',
      alt: 'or email us at',
    },

    footer: {
      tagline: 'Custom software for businesses that want to grow without growing chaotic.',
      basedIn: 'Hermosillo, Sonora · Mexico',
      rights: 'All rights reserved.',
      sections: 'Sections',
      contact: 'Contact',
    },
  },
} as const
