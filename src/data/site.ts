import type { LucideIcon } from 'lucide-react'
import {
  BarChart3,
  Blocks,
  Brush,
  Code2,
  Gauge,
  Globe2,
  LayoutDashboard,
  Megaphone,
  MessageSquare,
  Palette,
  Rocket,
  SearchCheck,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Target,
  Workflow,
} from 'lucide-react'

export type Service = {
  slug: string
  title: string
  shortTitle: string
  summary: string
  benefit: string
  icon: LucideIcon
  highlights: string[]
  deliverables: string[]
  outcomes: string[]
  fit: string
}

export type PortfolioItem = {
  title: string
  category: string
  problem: string
  solution: string
  result: string
  accent: string
}

export const contactConfig = {
  whatsappNumber: '5491100000000',
  email: 'hola@bartezstudio.com',
}

export const navItems = [
  { label: 'Servicios', href: '/servicios' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Nosotros', href: '/nosotros' },
  { label: 'Contacto', href: '/contacto' },
]

export const services: Service[] = [
  {
    slug: 'diseno-web',
    title: 'Diseño web',
    shortTitle: 'Web',
    summary:
      'Landing pages, sitios institucionales y portales comerciales diseñados para explicar mejor tu propuesta y convertir visitas en consultas.',
    benefit: 'Una presencia profesional que genera confianza desde el primer contacto.',
    icon: Globe2,
    highlights: ['Landing pages', 'Sitios institucionales', 'Webs B2B/B2C', 'Portales comerciales'],
    deliverables: [
      'Arquitectura de información y copy comercial',
      'Diseño responsive mobile-first',
      'Desarrollo frontend listo para escalar',
      'Formularios, CTAs y medición básica',
    ],
    outcomes: ['Más claridad comercial', 'Mejor percepción de marca', 'Más consultas calificadas'],
    fit: 'Empresas que necesitan renovar su web o lanzar una presencia digital sólida.',
  },
  {
    slug: 'ecommerce',
    title: 'Ecommerce',
    shortTitle: 'Ecommerce',
    summary:
      'Tiendas online, catálogos digitales y experiencias de compra pensadas para reducir fricción y mejorar la conversión.',
    benefit: 'Una tienda clara, rápida y preparada para campañas comerciales.',
    icon: ShoppingCart,
    highlights: ['Tiendas online', 'Catálogos digitales', 'Medios de pago', 'Fichas de producto'],
    deliverables: [
      'Diseño de experiencia de compra',
      'Estructura de categorías y producto',
      'Integraciones con pagos y herramientas',
      'Optimización de checkout y consultas',
    ],
    outcomes: ['Compra más simple', 'Mayor confianza', 'Base preparada para pauta'],
    fit: 'Marcas y negocios que quieren vender online con una experiencia más profesional.',
  },
  {
    slug: 'branding',
    title: 'Branding e identidad visual',
    shortTitle: 'Branding',
    summary:
      'Diseño de marca, identidad corporativa, paleta, tipografías y piezas base para que la marca se vea consistente en todos los canales.',
    benefit: 'Una identidad visual reconocible, ordenada y aplicable a ventas.',
    icon: Palette,
    highlights: ['Diseño de marca', 'Manual de marca', 'Paleta y tipografías', 'Piezas visuales'],
    deliverables: [
      'Sistema visual de marca',
      'Guía de uso esencial',
      'Aplicaciones digitales y comerciales',
      'Kit inicial para redes y presentaciones',
    ],
    outcomes: ['Marca más sólida', 'Mejor recordación', 'Menos improvisación visual'],
    fit: 'Empresas que necesitan verse más profesionales o unificar su comunicación.',
  },
  {
    slug: 'marketing-visual',
    title: 'Diseño para redes y marketing',
    shortTitle: 'Marketing visual',
    summary:
      'Creatividades para campañas, banners, redes, Google Ads y presentaciones comerciales con foco en claridad y acción.',
    benefit: 'Piezas que explican rápido, se ven mejor y sostienen campañas reales.',
    icon: Megaphone,
    highlights: ['Campañas', 'Banners', 'Instagram/Facebook/LinkedIn', 'Presentaciones'],
    deliverables: [
      'Sistema de piezas para campañas',
      'Creatividades adaptadas por canal',
      'Diseño de anuncios y banners',
      'Plantillas comerciales reutilizables',
    ],
    outcomes: ['Campañas más consistentes', 'Mejor lectura', 'Producción más rápida'],
    fit: 'Equipos comerciales o de marketing que necesitan calidad visual sostenida.',
  },
  {
    slug: 'automatizacion',
    title: 'Automatización y herramientas digitales',
    shortTitle: 'Automatización',
    summary:
      'Formularios inteligentes, dashboards, integraciones con APIs, portales de clientes y sistemas internos simples.',
    benefit: 'Menos tareas manuales y más orden para seguir oportunidades y procesos.',
    icon: Workflow,
    highlights: ['Formularios inteligentes', 'Dashboards', 'APIs', 'Portales de clientes'],
    deliverables: [
      'Mapa de proceso y puntos de fricción',
      'Interfaz simple para operación diaria',
      'Automatizaciones e integraciones',
      'Paneles para seguimiento comercial',
    ],
    outcomes: ['Menos trabajo repetitivo', 'Más visibilidad', 'Procesos más medibles'],
    fit: 'Negocios que ya venden y necesitan ordenar consultas, clientes o reportes.',
  },
  {
    slug: 'consultoria-digital',
    title: 'Consultoría digital',
    shortTitle: 'Consultoría',
    summary:
      'Auditoría visual, optimización UX/UI, presencia online y estrategia comercial digital para decidir mejor antes de invertir.',
    benefit: 'Un diagnóstico accionable para priorizar mejoras que impacten en ventas.',
    icon: SearchCheck,
    highlights: ['Auditoría visual', 'UX/UI', 'Presencia online', 'Estrategia digital'],
    deliverables: [
      'Auditoría de sitio y canales',
      'Mapa de oportunidades UX/UI',
      'Recomendaciones priorizadas',
      'Roadmap de implementación',
    ],
    outcomes: ['Decisiones más claras', 'Menos gasto mal enfocado', 'Mejor roadmap digital'],
    fit: 'Empresas que quieren mejorar antes de rediseñar, pautar o automatizar.',
  },
]

export const benefits = [
  { title: 'Mejor imagen profesional', text: 'Tu negocio comunica confianza antes de la primera reunión.', icon: ShieldCheck },
  { title: 'Experiencia clara y moderna', text: 'Cada sección guía al visitante hacia una acción concreta.', icon: LayoutDashboard },
  { title: 'Mejor conversión', text: 'Diseñamos CTAs, formularios y recorridos pensados para generar oportunidades.', icon: Target },
  { title: 'Base sólida para campañas', text: 'Landing, ecommerce y piezas visuales preparadas para tráfico pago y orgánico.', icon: Rocket },
  { title: 'Velocidad y orden comercial', text: 'Herramientas simples para recibir, clasificar y responder consultas.', icon: Gauge },
  { title: 'Preparado para escalar', text: 'Componentes, contenido y estructura listos para sumar páginas o integraciones.', icon: Blocks },
]

export const processSteps = [
  ['01', 'Diagnóstico', 'Entendemos negocio, objetivos, audiencia y puntos de fricción.'],
  ['02', 'Propuesta', 'Definimos alcance, prioridades, tiempos y entregables concretos.'],
  ['03', 'Diseño', 'Creamos estructura, copy, interfaz y sistema visual.'],
  ['04', 'Desarrollo', 'Construimos una experiencia responsive, rápida y mantenible.'],
  ['05', 'Revisión', 'Ajustamos contenido, interacción y detalles antes de publicar.'],
  ['06', 'Lanzamiento', 'Publicamos, verificamos formularios, links y medición básica.'],
  ['07', 'Mejora continua', 'Iteramos con datos, feedback y nuevas oportunidades.'],
] as const

export const plans = [
  {
    name: 'Start',
    description: 'Para presencia profesional inicial.',
    price: 'Consultar',
    icon: Sparkles,
    features: ['Landing o web simple', 'Copy comercial base', 'Diseño responsive', 'Formulario y WhatsApp', 'SEO técnico inicial'],
  },
  {
    name: 'Business',
    description: 'Para empresas que necesitan un sitio completo y estratégico.',
    price: 'Consultar',
    icon: BarChart3,
    featured: true,
    features: ['Web multi-sección', 'Arquitectura de contenidos', 'Servicios y portfolio', 'Formulario avanzado', 'Componentes escalables'],
  },
  {
    name: 'Studio Pro',
    description: 'Para ecommerce, automatizaciones o soluciones avanzadas.',
    price: 'Consultar',
    icon: Code2,
    features: ['Ecommerce o portal', 'Integraciones y APIs', 'Dashboards simples', 'Automatización comercial', 'Acompañamiento evolutivo'],
  },
]

export const portfolio: PortfolioItem[] = [
  {
    title: 'Web institucional para empresa industrial',
    category: 'Diseño web',
    problem: 'La empresa tenía una web desactualizada que no explicaba sus líneas de servicio ni generaba confianza comercial.',
    solution: 'Se diseñó una web clara, técnica y comercial, con servicios, casos, formularios y estructura preparada para campañas B2B.',
    result: 'Más consultas calificadas y mejor percepción frente a nuevos clientes corporativos.',
    accent: 'from-cyan-400 to-blue-500',
  },
  {
    title: 'Ecommerce para tienda tecnológica',
    category: 'Ecommerce',
    problem: 'El catálogo era difícil de recorrer y la experiencia de compra no acompañaba campañas de performance.',
    solution: 'Se organizó la navegación, fichas de producto, filtros, destacados y mensajes de confianza durante la compra.',
    result: 'Compra más simple, menor fricción y una base preparada para anuncios.',
    accent: 'from-violet-400 to-cyan-400',
  },
  {
    title: 'Branding para marca comercial',
    category: 'Branding',
    problem: 'La marca usaba piezas visuales inconsistentes entre redes, presupuestos y presentaciones.',
    solution: 'Se creó un sistema visual con paleta, tipografía, aplicaciones comerciales y plantillas reutilizables.',
    result: 'Comunicación más profesional y producción visual más rápida.',
    accent: 'from-fuchsia-400 to-violet-500',
  },
  {
    title: 'Dashboard comercial interno',
    category: 'Automatización',
    problem: 'El seguimiento de oportunidades dependía de planillas dispersas y mensajes manuales.',
    solution: 'Se planteó un panel simple para visualizar estados, origen de consultas, responsables y próximos pasos.',
    result: 'Más orden operativo y mejor seguimiento de cada oportunidad.',
    accent: 'from-lime-300 to-cyan-400',
  },
  {
    title: 'Landing para campaña publicitaria',
    category: 'Marketing visual',
    problem: 'La campaña enviaba tráfico a una página general sin foco ni propuesta clara.',
    solution: 'Se diseñó una landing con mensaje específico, prueba visual, beneficios, objeciones y CTA directo.',
    result: 'Mejor consistencia entre anuncio, página y consulta final.',
    accent: 'from-blue-400 to-fuchsia-400',
  },
]

export const faqs = [
  {
    question: '¿Trabajan solo diseño o también desarrollo?',
    answer:
      'Trabajamos ambas capas. Podemos resolver diseño UX/UI, frontend, implementación web y herramientas digitales simples según el alcance.',
  },
  {
    question: '¿Cuánto tarda una web?',
    answer:
      'Una landing puede resolverse en pocas semanas. Una web completa, ecommerce o herramienta interna requiere más diagnóstico, contenido y revisión.',
  },
  {
    question: '¿Necesito tener textos e imágenes antes de empezar?',
    answer:
      'No necesariamente. Podemos ayudarte a ordenar la arquitectura, escribir copy comercial y definir qué piezas visuales necesita cada sección.',
  },
  {
    question: '¿Pueden mejorar una web existente?',
    answer:
      'Sí. Podemos auditarla, rediseñar secciones críticas, mejorar UX/UI, optimizar formularios o reconstruirla si la base actual limita el crecimiento.',
  },
  {
    question: '¿La primera versión incluye backend?',
    answer:
      'En proyectos simples podemos lanzar con WhatsApp, email y formularios livianos. Si el negocio necesita datos, usuarios o integraciones, se planifica una capa backend.',
  },
]

export const differentiators = [
  {
    title: 'Diseño con intención comercial',
    text: 'No diseñamos pantallas lindas aisladas. Ordenamos mensajes, jerarquías y caminos de conversión.',
    icon: Target,
  },
  {
    title: 'Tecnología práctica',
    text: 'Elegimos soluciones mantenibles, rápidas y ajustadas al momento real del negocio.',
    icon: Code2,
  },
  {
    title: 'Acompañamiento claro',
    text: 'Trabajamos con etapas, entregables y decisiones visibles para avanzar sin improvisación.',
    icon: MessageSquare,
  },
  {
    title: 'Sistema visual escalable',
    text: 'La web, las piezas y las herramientas comparten una base visual que puede crecer.',
    icon: Brush,
  },
]
