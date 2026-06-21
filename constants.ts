/**
 * constants.ts — Fuente única de verdad de contenido comercial de Bartez Tecnología.
 * Editá este archivo para cambiar textos, datos de contacto, productos y partners
 * SIN tocar componentes.
 *
 * Referencias de benchmark B2B IT consultadas para estructura/copy/conversión:
 *  - Dell Technologies Argentina (configurador + "Solicitar asesoramiento")
 *  - Lenovo Business / Think (gamas Essential/Pro/Elite, fleet de notebooks)
 *  - Insight & CDW (landing de soluciones por vertical + captura de lead corporativo)
 */

export const company = {
  name: "Bartez Tecnología",
  shortName: "Bartez",
  tagline: "Tecnología que mueve empresas.",
  legalName: "Bartez Tecnología — Responsable Inscripto",
  cuit: "30-00000000-0",
  taxCondition: "Responsable Inscripto · Factura A",
  city: "Rosario",
  province: "Santa Fe",
  country: "Argentina",
  address: "9 de Julio 3418, Rosario, Santa Fe",
  geo: { lat: -32.9481114, lng: -60.6717758 }, // 9 de Julio 3418, Echesortu, Rosario (geocodificado)
  url: "https://bartez.com.ar",
  founded: "2015",
};

export const contact = {
  // Reemplazar por datos reales en producción
  whatsappNumber: "5493415104902",
  whatsappMessage:
    "Hola, vengo de la web y quisiera una cotización.",
  email: "ventas@bartez.com.ar",
  phoneDisplay: "+54 9 341 510-4902",
  hours: "Lunes a Viernes · 9 a 18 hs",
  social: {
    linkedin: "https://www.linkedin.com/company/bartez",
    instagram: "https://www.instagram.com/bartez",
  },
};

export const topbar = {
  items: [
    { icon: "MapPin", text: "Rosario · Entrega a todo el país" },
    { icon: "ReceiptText", text: "Responsable Inscripto · Factura A" },
    { icon: "Headset", text: "Atención B2B dedicada" },
  ],
  cta: { label: "Abrí tu cuenta corporativa", href: "/#contacto" },
};

export const nav = {
  links: [
    { label: "Soluciones", href: "/#soluciones" },
    { label: "Servicios", href: "/#servicios" },
    { label: "Catálogo", href: "/#catalogo" },
    { label: "Cotizá", href: "/#cotiza" },
    { label: "Recursos", href: "/recursos" },
    { label: "Contacto", href: "/#contacto" },
  ],
  cta: { label: "Solicitar cotización", href: "/#cotiza" },
};

export const hero = {
  eyebrow: "Distribuidor mayorista de tecnología IT + servicios",
  title: "El partner tecnológico de tu empresa.",
  subtitle:
    "Distribución mayorista de hardware IT y servicios profesionales: servidores, notebooks corporativas, redes, infraestructura, soporte e implementación. Todo con stock real, precios mayoristas y respaldo de ingeniería.",
  ctaPrimary: { label: "Pedí tu cotización", href: "#cotiza" },
  ctaSecondary: { label: "Ver soluciones", href: "#soluciones" },
  stats: [
    { value: "+14.000", label: "productos en catálogo" },
    { value: "24 hs", label: "cotización promedio" },
    { value: "8", label: "marcas oficiales" },
    { value: "País", label: "cobertura nacional" },
  ],
};

export const partners = {
  title: "Partners y marcas oficiales",
  brands: [
    { name: "Dell", logo: "/logos/dell.svg" },
    { name: "Lenovo", logo: "/logos/lenovo.svg" },
    { name: "HP", logo: "/logos/hp.svg" },
    { name: "Cisco", logo: "/logos/cisco.svg" },
    { name: "Intel", logo: "/logos/intel.svg" },
    { name: "AMD", logo: "/logos/amd.svg" },
    { name: "Kingston", logo: "/logos/kingston.svg" },
  ],
};

export const pillars = {
  title: "Por qué las empresas eligen Bartez",
  items: [
    {
      icon: "Truck",
      title: "Stock real, entrega rápida",
      desc: "Logística propia desde Rosario a todo el país. Lo que cotizás, está disponible.",
    },
    {
      icon: "Cpu",
      title: "Asesoramiento técnico",
      desc: "Ingeniería en cada cotización: dimensionamos la solución según tu operación.",
    },
    {
      icon: "BadgeDollarSign",
      title: "Precios mayoristas",
      desc: "Condiciones corporativas, cuenta corriente y financiación para tu empresa.",
    },
  ],
};

export const solutions = {
  num: "01",
  eyebrow: "Soluciones",
  title:
    "Todo el equipamiento IT que tu empresa necesita, en un solo proveedor.",
  desc: "Desde un rack de servidores hasta el fleet de notebooks de toda la compañía. Asesoramiento técnico incluido en cada línea.",
  cards: [
    {
      id: "servidores",
      category: "Datacenter",
      icon: "Server",
      title: "Servidores y storage",
      desc: "Dell PowerEdge, almacenamiento y virtualización para tu datacenter.",
      cta: "Ver más",
      href: "/soluciones/servidores",
    },
    {
      id: "notebooks",
      category: "Movilidad",
      icon: "Laptop",
      title: "Notebooks corporativas",
      desc: "Lenovo, HP y Dell de gama corporativa para cada equipo de trabajo.",
      cta: "Cotizá tu fleet",
      href: "/soluciones/notebooks-corporativas",
    },
    {
      id: "redes",
      category: "Networking",
      icon: "Network",
      title: "Infraestructura de red",
      desc: "Switches, access points y firewalls gestionados.",
      cta: "Ver más",
      href: "/soluciones/redes-infraestructura",
    },
    {
      id: "workstations",
      category: "Workstations",
      icon: "MonitorSmartphone",
      title: "Estaciones y PCs armadas",
      desc: "Equipos a medida para ingeniería, diseño y producción.",
      cta: "Ver más",
      href: "/soluciones/workstations-pcs",
    },
    {
      id: "perifericos",
      category: "Accesorios",
      icon: "Keyboard",
      title: "Periféricos corporativos",
      desc: "Monitores, docks y accesorios homologados por marca.",
      cta: "Ver más",
      href: "/soluciones/perifericos-corporativos",
    },
    {
      id: "cctv",
      category: "Seguridad",
      icon: "Cctv",
      title: "Videovigilancia y CCTV",
      desc: "Cámaras, NVR y soluciones de monitoreo para tu planta.",
      cta: "Ver más",
      href: "/soluciones/videovigilancia-cctv",
    },
  ],
};

export const services = {
  num: "02",
  eyebrow: "Servicios IT",
  title: "No solo vendemos equipos: te acompañamos en todo el ciclo.",
  desc: "Sumá a la distribución de hardware un equipo técnico que diseña, implementa y soporta tu infraestructura.",
  items: [
    {
      icon: "DraftingCompass",
      title: "Ingeniería y dimensionamiento",
      desc: "Relevamos tu operación y diseñamos la solución correcta antes de cotizar.",
    },
    {
      icon: "Wrench",
      title: "Implementación e instalación",
      desc: "Puesta en marcha de servidores, redes y CCTV con técnicos certificados.",
    },
    {
      icon: "Headset",
      title: "Soporte y mantenimiento",
      desc: "Mesa de ayuda y mantenimiento preventivo para continuidad operativa.",
    },
    {
      icon: "ShieldCheck",
      title: "Garantía y posventa",
      desc: "Gestión de garantías oficiales y reemplazos con respaldo de marca.",
    },
    {
      icon: "Cloud",
      title: "Infraestructura y cloud",
      desc: "Virtualización, almacenamiento y soluciones híbridas a medida.",
    },
    {
      icon: "Boxes",
      title: "Abastecimiento corporativo",
      desc: "Provisión recurrente y stock dedicado para tu fleet y recambios.",
    },
  ],
};

export const showcase = {
  image: "/photos/datacenter.jpg",
  imageAlt: "Sala de servidores moderna con racks de datacenter",
  eyebrow: "Infraestructura real",
  title: "Del datacenter a la última notebook, te abastecemos.",
  desc: "Operamos como tu área de compras IT: stock real, marcas oficiales y logística propia para que tu empresa nunca pare.",
  kpis: [
    { value: "99,9%", label: "compromiso de continuidad" },
    { value: "24 hs", label: "cotización promedio" },
    { value: "8", label: "marcas oficiales" },
    { value: "100%", label: "Factura A" },
  ],
};

export const industries = {
  num: "04",
  eyebrow: "Sectores",
  title: "Acompañamos a empresas de todos los sectores.",
  desc: "Desde una PyME en crecimiento hasta operaciones multisitio. Adaptamos la solución a tu industria.",
  image: "/photos/office.jpg",
  imageAlt: "Equipo de trabajo en oficina moderna usando tecnología",
  items: [
    "Corporativo y oficinas",
    "Retail y comercio",
    "Salud y laboratorios",
    "Educación",
    "Gobierno y sector público",
    "Industria y manufactura",
    "Agro y campo",
    "Estudios y servicios profesionales",
  ],
};

export const whyImage = {
  src: "/photos/engineer.jpg",
  alt: "Técnico de IT trabajando en un rack de servidores",
};

export const faq = {
  num: "08",
  eyebrow: "Preguntas frecuentes",
  title: "Lo que las empresas suelen consultar.",
  items: [
    {
      q: "¿Cuál es el plazo de cotización y entrega?",
      a: "Cotizamos en un plazo de 24 hs hábiles. Los tiempos de entrega dependen del producto y la ubicación: con stock disponible despachamos en 24/72 hs a todo el país.",
    },
    {
      q: "¿Emiten Factura A y trabajan con cuenta corriente?",
      a: "Sí. Somos Responsable Inscripto, emitimos Factura A y ofrecemos condiciones corporativas, cuenta corriente y financiación según evaluación crediticia.",
    },
    {
      q: "¿Las marcas tienen garantía oficial?",
      a: "Trabajamos con marcas oficiales (Dell, Lenovo, HP, Cisco, entre otras) y gestionamos la garantía y la posventa con respaldo del fabricante.",
    },
    {
      q: "¿Hacen envíos al interior del país?",
      a: "Sí, tenemos cobertura nacional con logística propia y operadores. Coordinamos el despacho y te damos seguimiento del envío.",
    },
    {
      q: "¿Ofrecen servicios además de la venta de equipos?",
      a: "Sí: ingeniería y dimensionamiento, implementación e instalación, soporte y mantenimiento, e infraestructura/cloud. Te acompañamos en todo el ciclo.",
    },
    {
      q: "¿Hay un monto mínimo de compra?",
      a: "Trabajamos principalmente con empresas en modalidad mayorista. Escribinos tu necesidad y te armamos la mejor propuesta según volumen.",
    },
  ],
};

export const whyBartez = {
  num: "03",
  eyebrow: "Nosotros",
  title: "Un proveedor de confianza para la continuidad de tu operación.",
  body: [
    "Bartez Tecnología es la distribuidora mayorista de hardware IT que las empresas argentinas eligen cuando no pueden permitirse un equipo parado.",
    "Trabajamos como una extensión de tu área de sistemas: entendemos la urgencia, dimensionamos la solución y respondemos con stock real y precios mayoristas.",
  ],
  stats: [
    { value: "+14.000", label: "productos en catálogo" },
    { value: "Todo el país", label: "cobertura logística" },
    { value: "B2B", label: "atención dedicada" },
  ],
};

export const testimonial = {
  // Placeholder — reemplazar por caso real
  quote:
    "Bartez nos resolvió el recambio de 120 notebooks en tiempo récord, con financiación y una sola factura A. Hoy son nuestro proveedor IT de cabecera.",
  author: "Responsable de IT",
  role: "Empresa cliente (placeholder)",
  companyLogo: "",
};

export const catalogPreview = {
  num: "05",
  eyebrow: "Catálogo destacado",
  title: "Algunos de los productos con stock disponible.",
  cta: { label: "Ver catálogo completo", href: "#contacto" },
  // Productos mock — reemplazar por catálogo real
  products: [
    { brand: "Dell", model: "PowerEdge R760", category: "Servidor", stock: true, image: "/photos/products/server.jpg" },
    { brand: "Lenovo", model: "ThinkPad T14 Gen 5", category: "Notebook", stock: true, image: "/photos/products/laptop1.jpg" },
    { brand: "HP", model: "ProBook 460 G11", category: "Notebook", stock: true, image: "/photos/products/laptop2.jpg" },
    { brand: "Cisco", model: "Catalyst 9200", category: "Switch", stock: true, image: "/photos/products/switch.jpg" },
    { brand: "Dell", model: "UltraSharp U2724D", category: "Monitor", stock: true, image: "/photos/products/monitor.jpg" },
    { brand: "APC", model: "Smart-UPS 1500VA", category: "Energía", stock: true, image: "/photos/products/ups.jpg" },
    { brand: "Ubiquiti", model: "UniFi Access Point", category: "Red", stock: true, image: "/photos/products/router.jpg" },
    { brand: "Dell", model: "Precision 3680 Tower", category: "Workstation", stock: true, image: "/photos/products/tower.jpg" },
  ],
};

export const process = {
  num: "06",
  eyebrow: "Proceso comercial",
  title: "De la consulta a la entrega, sin fricciones.",
  steps: [
    { n: "01", title: "Consulta", desc: "Contanos qué necesitás por web, mail o WhatsApp." },
    { n: "02", title: "Cotización en 24 hs", desc: "Recibís una propuesta técnica y comercial formal." },
    { n: "03", title: "Aprobación y Factura A", desc: "Confirmás y facturamos con condiciones corporativas." },
    { n: "04", title: "Entrega", desc: "Despachamos a todo el país con seguimiento." },
  ],
};

export const quote = {
  num: "07",
  eyebrow: "Cotización",
  title: "Armá tu cotización en 2 minutos.",
  desc: "Seleccioná lo que necesitás, indicá cantidades y te enviamos una propuesta formal en 24 hs hábiles.",
  categories: [
    { id: "servidores", label: "Servidores y storage", icon: "Server", suggestions: ["Dell PowerEdge R760", "Dell PowerEdge R360", "HPE ProLiant DL360", "Storage / NAS"] },
    { id: "notebooks", label: "Notebooks corporativas", icon: "Laptop", suggestions: ["Lenovo ThinkPad T14", "HP ProBook 460", "Dell Latitude 5550", "Dell Latitude 3550"] },
    { id: "redes", label: "Infraestructura de red", icon: "Network", suggestions: ["Cisco Catalyst 9200", "MikroTik", "Ubiquiti UniFi", "Fortinet FortiGate"] },
    { id: "workstations", label: "Workstations y PCs", icon: "MonitorSmartphone", suggestions: ["Dell Precision 3680", "HP Z2", "PC armada a medida"] },
    { id: "perifericos", label: "Periféricos y monitores", icon: "Keyboard", suggestions: ["Monitor Dell UltraSharp", "Dock Dell WD19", "Teclado + mouse corporativo"] },
    { id: "cctv", label: "Videovigilancia / CCTV", icon: "Cctv", suggestions: ["Cámaras Hikvision", "Cámaras Dahua", "NVR + cámaras IP"] },
    { id: "servicios", label: "Servicios IT (instalación / soporte)", icon: "Wrench", suggestions: ["Instalación", "Soporte / mantenimiento", "Implementación de red"] },
  ],
  urgencias: ["Lo antes posible", "Este mes", "Próximos 3 meses", "Sólo estoy cotizando"],
  steps: ["Qué necesitás", "Detalle", "Tus datos"],
  detailLabel: "Modelo o especificación (opcional)",
};

export const contactSection = {
  num: "09",
  eyebrow: "Contacto",
  title: "Cotizá tu próximo proyecto IT.",
  lead: "Respondé el formulario y un asesor comercial te contacta. Cotización formal en 24 hs hábiles.",
  consultTypes: [
    { value: "cotizacion", label: "Cotización" },
    { value: "asesoramiento", label: "Asesoramiento técnico" },
    { value: "cuenta", label: "Cuenta corporativa" },
  ],
  submitLabel: "Enviar consulta",
  privacyNote:
    "Al enviar, creamos tu lead en nuestro CRM y te llega una confirmación por mail.",
};

export const payments = {
  title: "Formas de pago y facturación",
  methods: [
    { icon: "Banknote", label: "Transferencia bancaria" },
    { icon: "FileCheck", label: "Cheque" },
    { icon: "Landmark", label: "Cuenta corriente" },
    { icon: "ReceiptText", label: "Factura A" },
  ],
};

export const downloads = {
  title: "Recursos para tu evaluación",
  desc: "Descargá nuestro brochure institucional y el catálogo de productos. Te pedimos un email corporativo para enviártelo.",
  items: [
    {
      id: "brochure",
      title: "Brochure institucional",
      desc: "Quiénes somos, capacidades y casos.",
      // Servido desde /public; sobreescribible con DRIVE_BROCHURE_URL (env)
      file: "/brochure.pdf",
    },
    {
      id: "catalogo",
      title: "Catálogo de productos (PDF)",
      desc: "Líneas, marcas y modelos destacados.",
      file: "/catalogo.pdf",
    },
  ],
};

export const footer = {
  tagline: "Distribución mayorista de hardware IT.",
  columns: [
    {
      title: "Empresa",
      links: [
        { label: "Nosotros", href: "/#nosotros" },
        { label: "Recursos", href: "/recursos" },
        { label: "Contacto", href: "/#contacto" },
      ],
    },
    {
      title: "Soluciones",
      links: [
        { label: "Servidores y storage", href: "/soluciones/servidores" },
        { label: "Notebooks corporativas", href: "/soluciones/notebooks-corporativas" },
        { label: "Infraestructura de red", href: "/soluciones/redes-infraestructura" },
        { label: "Videovigilancia y CCTV", href: "/soluciones/videovigilancia-cctv" },
      ],
    },
    {
      title: "Legales",
      links: [
        { label: "Política de privacidad", href: "/legales/privacidad" },
        { label: "Términos de uso", href: "/legales/terminos" },
      ],
    },
  ],
  legalLine: "Bartez Tecnología · Responsable Inscripto · CUIT 30-00000000-0 · 9 de Julio 3418, Rosario, Santa Fe",
  copyright: `© ${new Date().getFullYear()} Bartez Tecnología. Todos los derechos reservados.`,
  signature: "Diseñado en Rosario",
};

export const cookie = {
  text: "Usamos cookies para mejorar tu experiencia y medir el tráfico del sitio.",
  accept: "Aceptar",
  reject: "Rechazar",
};

export const seo = {
  title: "Bartez Tecnología — Distribuidora mayorista de hardware IT en Rosario",
  description:
    "Distribución mayorista de hardware IT para empresas argentinas: servidores, notebooks corporativas, redes e infraestructura. Stock real, asesoramiento técnico y precios mayoristas desde Rosario a todo el país.",
  keywords: [
    "distribuidora hardware IT",
    "mayorista informática Rosario",
    "servidores Dell empresas",
    "notebooks corporativas Argentina",
    "infraestructura de red B2B",
  ],
  ogImage: "/opengraph-image",
};

// ============================================================
// Landings por vertical (SEO / Google Ads) — /soluciones/[slug]
// ============================================================
export type VProduct = { brand: string; model: string; image: string; badge?: string };
export type Vertical = {
  slug: string;
  navLabel: string;
  icon: string;
  image: string;
  eyebrow: string;
  h1: string;
  intro: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  bullets: { title: string; desc: string }[];
  capabilities: { icon: string; title: string; desc: string }[];
  products: VProduct[];
  brands: string[];
  models: string[];
  faqs: { q: string; a: string }[];
  related: string[];
};

export const verticals: Vertical[] = [
  {
    slug: "servidores",
    navLabel: "Servidores y storage",
    icon: "Server",
    image: "/photos/products/server.jpg",
    eyebrow: "Servidores y storage",
    h1: "Servidores y storage para empresas, con asesoramiento de ingeniería.",
    intro:
      "Distribuimos servidores, almacenamiento y soluciones de virtualización de marcas oficiales, dimensionados a la medida de tu operación. Stock real, precios mayoristas y soporte de implementación de punta a punta.",
    metaTitle: "Servidores corporativos mayorista | Bartez Tecnología Rosario",
    metaDescription:
      "Servidores Dell PowerEdge, storage y virtualización para empresas. Distribuidor mayorista en Rosario con stock real, Factura A y entrega a todo el país. Pedí tu cotización.",
    keywords: ["servidores Dell PowerEdge", "storage empresas", "servidor corporativo mayorista", "virtualización Rosario"],
    bullets: [
      { title: "Dimensionamiento técnico", desc: "Relevamos tu carga de trabajo y proponemos la configuración correcta." },
      { title: "Marcas oficiales", desc: "Dell PowerEdge, HPE ProLiant y storage con garantía de fábrica." },
      { title: "Virtualización", desc: "Consolidá varios servidores en uno con VMware, Hyper-V o Proxmox." },
      { title: "Implementación", desc: "Instalación, configuración y puesta en marcha con técnicos certificados." },
      { title: "Continuidad", desc: "Stock real, UPS y políticas de backup para que nunca pares." },
      { title: "Escalabilidad", desc: "Equipos que crecen con tu empresa, sin rehacer la inversión." },
    ],
    capabilities: [
      { icon: "DraftingCompass", title: "Relevamiento", desc: "Analizamos usuarios, aplicaciones y cargas para definir la configuración exacta." },
      { icon: "Wrench", title: "Instalación y virtualización", desc: "Montaje en rack, hipervisor y migración de servicios sin frenar la operación." },
      { icon: "ShieldCheck", title: "Garantía oficial", desc: "Gestión de garantía y reemplazo con respaldo del fabricante." },
      { icon: "Headset", title: "Soporte y monitoreo", desc: "Mantenimiento preventivo y soporte ante incidentes." },
    ],
    products: [
      { brand: "Dell", model: "PowerEdge R760", image: "/photos/products/server.jpg", badge: "Stock disponible" },
      { brand: "Synology", model: "Storage / NAS corporativo", image: "/photos/products/storage.jpg", badge: "Stock disponible" },
      { brand: "APC", model: "Smart-UPS 1500VA", image: "/photos/products/ups.jpg", badge: "Stock disponible" },
    ],
    brands: ["Dell", "HP", "Intel", "Kingston"],
    models: ["Dell PowerEdge R760", "Dell PowerEdge R360", "HPE ProLiant DL360", "Storage / NAS corporativo"],
    faqs: [
      { q: "¿Asesoran sobre qué servidor necesito?", a: "Sí. Relevamos tu operación (usuarios, virtualización, bases de datos) y te proponemos la configuración óptima antes de cotizar." },
      { q: "¿Incluye instalación?", a: "Ofrecemos el servicio de implementación y virtualización con técnicos certificados, opcional a la compra del equipo." },
      { q: "¿Trabajan con varias marcas?", a: "Sí, principalmente Dell y HPE. Te recomendamos la mejor opción según presupuesto y requerimiento." },
      { q: "¿Ofrecen financiación?", a: "Sí, con cuenta corriente y condiciones corporativas según evaluación crediticia, y siempre con Factura A." },
    ],
    related: ["redes-infraestructura", "notebooks-corporativas"],
  },
  {
    slug: "notebooks-corporativas",
    navLabel: "Notebooks corporativas",
    icon: "Laptop",
    image: "/photos/products/laptop1.jpg",
    eyebrow: "Notebooks corporativas",
    h1: "Notebooks corporativas para todo tu equipo, con precio mayorista.",
    intro:
      "Equipá tu empresa con notebooks de gama corporativa de Lenovo, HP y Dell. Cotizamos fleets completos con condiciones B2B, financiación, configuración y entrega a todo el país.",
    metaTitle: "Notebooks corporativas mayorista | Bartez Tecnología",
    metaDescription:
      "Notebooks corporativas Lenovo ThinkPad, HP ProBook y Dell Latitude para empresas. Cotizá tu fleet con precios mayoristas, Factura A y garantía oficial. Rosario, envíos a todo el país.",
    keywords: ["notebooks corporativas", "ThinkPad empresas", "fleet de notebooks", "Dell Latitude mayorista"],
    bullets: [
      { title: "Fleets a medida", desc: "Cotizamos desde 5 hasta cientos de equipos con la misma agilidad." },
      { title: "Gama profesional", desc: "Lenovo ThinkPad, HP ProBook y Dell Latitude, durabilidad de negocio." },
      { title: "Configuración previa", desc: "Imagen corporativa, software y dominio listos antes de entregar." },
      { title: "Financiación B2B", desc: "Cuenta corriente y condiciones corporativas para renovar tu parque." },
      { title: "Garantía oficial", desc: "Gestión de garantía y posventa con respaldo del fabricante." },
      { title: "Logística nacional", desc: "Entrega coordinada a una o varias sucursales del país." },
    ],
    capabilities: [
      { icon: "DraftingCompass", title: "Asesoramiento por perfil", desc: "Definimos la gama ideal según el uso de cada equipo de trabajo." },
      { icon: "Wrench", title: "Preparación de equipos", desc: "Imagen, software y configuración corporativa lista para usar." },
      { icon: "ShieldCheck", title: "Garantía y posventa", desc: "Gestionamos la garantía oficial y los reemplazos por vos." },
      { icon: "Boxes", title: "Renovación programada", desc: "Plan de recambio del parque para no improvisar." },
    ],
    products: [
      { brand: "Lenovo", model: "ThinkPad T14 Gen 5", image: "/photos/products/laptop1.jpg", badge: "Stock disponible" },
      { brand: "HP", model: "ProBook 460 G11", image: "/photos/products/laptop2.jpg", badge: "Stock disponible" },
      { brand: "Dell", model: "Monitor UltraSharp + dock", image: "/photos/products/monitor.jpg", badge: "Stock disponible" },
    ],
    brands: ["Lenovo", "HP", "Dell", "Intel"],
    models: ["Lenovo ThinkPad T14", "HP ProBook 460", "Dell Latitude 5550", "Dell Latitude 3550"],
    faqs: [
      { q: "¿Cotizan fleets grandes de notebooks?", a: "Sí, es uno de nuestros fuertes. Contanos cantidad y perfil de uso y te armamos la propuesta con precio por volumen." },
      { q: "¿Preparan los equipos antes de entregar?", a: "Sí, podemos entregar las notebooks con imagen corporativa, software y configuración de dominio listos." },
      { q: "¿Ofrecen financiación?", a: "Sí, trabajamos con cuenta corriente y condiciones corporativas según evaluación crediticia." },
      { q: "¿Entregan al interior del país?", a: "Sí, tenemos cobertura nacional y coordinamos la entrega a una o varias sucursales." },
    ],
    related: ["servidores", "redes-infraestructura"],
  },
  {
    slug: "redes-infraestructura",
    navLabel: "Redes e infraestructura",
    icon: "Network",
    image: "/photos/products/switch.jpg",
    eyebrow: "Infraestructura de red",
    h1: "Infraestructura de red empresarial, de la cotización a la implementación.",
    intro:
      "Switches, access points, firewalls y cableado para construir o ampliar la red de tu empresa. Productos de marcas líderes con diseño, provisión e implementación.",
    metaTitle: "Infraestructura de red empresarial mayorista | Bartez Tecnología",
    metaDescription:
      "Switches Cisco, access points, firewalls y networking para empresas. Distribuidor mayorista en Rosario con asesoramiento, implementación y Factura A. Cotizá tu proyecto de red.",
    keywords: ["switches Cisco Catalyst", "access points empresas", "firewall corporativo", "infraestructura de red Rosario"],
    bullets: [
      { title: "Diseño de red", desc: "Proyectamos la topología según tu planta, usuarios y crecimiento." },
      { title: "Networking pro", desc: "Switches Cisco, access points WiFi 6 y firewalls gestionados." },
      { title: "Cableado estructurado", desc: "Tendido, certificación y orden del cableado de tu edificio." },
      { title: "Seguridad perimetral", desc: "Firewalls/UTM para proteger la red y el acceso remoto." },
      { title: "Implementación", desc: "Instalación, configuración y puesta a punto de la red." },
      { title: "Soporte", desc: "Mantenimiento y monitoreo para mantener la red estable." },
    ],
    capabilities: [
      { icon: "DraftingCompass", title: "Diseño y relevamiento", desc: "Definimos topología, equipos y cobertura WiFi de tu predio." },
      { icon: "Wrench", title: "Instalación y cableado", desc: "Montaje de racks, cableado estructurado y configuración." },
      { icon: "ShieldCheck", title: "Seguridad de red", desc: "Firewalls, VLANs y políticas de acceso para proteger tu red." },
      { icon: "Headset", title: "Soporte gestionado", desc: "Monitoreo y soporte para que la red no se caiga." },
    ],
    products: [
      { brand: "Cisco", model: "Catalyst 9200", image: "/photos/products/switch.jpg", badge: "Stock disponible" },
      { brand: "Ubiquiti", model: "UniFi Access Point", image: "/photos/products/router.jpg", badge: "Stock disponible" },
      { brand: "Dell", model: "Rack y gabinetes", image: "/photos/products/storage.jpg", badge: "A pedido" },
    ],
    brands: ["Cisco", "HP", "Ubiquiti"],
    models: ["Cisco Catalyst 9200", "Access points WiFi 6", "Firewalls / UTM", "Switches gestionables"],
    faqs: [
      { q: "¿Hacen el proyecto de red completo?", a: "Sí: diseño, provisión de equipos e implementación. Podés tomar todo o solo la parte que necesites." },
      { q: "¿Trabajan con varias marcas?", a: "Sí, te recomendamos la mejor opción según presupuesto y requerimiento, sin atarte a una sola marca." },
      { q: "¿Incluye cableado estructurado?", a: "Sí, ofrecemos el tendido, la certificación y el orden del cableado además de los equipos activos." },
      { q: "¿Dan soporte después de instalar?", a: "Sí, ofrecemos planes de soporte y monitoreo para mantener la red estable." },
    ],
    related: ["servidores", "videovigilancia-cctv"],
  },
  {
    slug: "videovigilancia-cctv",
    navLabel: "Videovigilancia / CCTV",
    icon: "Cctv",
    image: "/photos/cctv.jpg",
    eyebrow: "Videovigilancia y CCTV",
    h1: "Videovigilancia y CCTV para proteger tu empresa.",
    intro:
      "Cámaras IP, grabadores NVR y soluciones de monitoreo para oficinas, plantas y depósitos. Te asesoramos en el diseño, la provisión y la implementación del sistema completo.",
    metaTitle: "Cámaras de seguridad y CCTV para empresas | Bartez Tecnología",
    metaDescription:
      "Cámaras IP, NVR y videovigilancia para empresas. Distribuidor mayorista en Rosario con asesoramiento e instalación. Factura A y entrega a todo el país. Cotizá tu sistema CCTV.",
    keywords: ["cámaras de seguridad empresas", "CCTV corporativo", "videovigilancia IP", "NVR mayorista Rosario"],
    bullets: [
      { title: "Relevamiento", desc: "Definimos cantidad de cámaras y cobertura según tu predio." },
      { title: "Equipos confiables", desc: "Cámaras IP, NVR y almacenamiento de marcas reconocidas." },
      { title: "Instalación", desc: "Montaje, configuración y acceso remoto al monitoreo." },
      { title: "Acceso remoto", desc: "Mirá tus cámaras desde el celular o la PC, donde estés." },
      { title: "Grabación segura", desc: "Almacenamiento dimensionado para los días de grabación que necesites." },
      { title: "Escalable", desc: "Soluciones que crecen con tu operación, de 4 a decenas de cámaras." },
    ],
    capabilities: [
      { icon: "DraftingCompass", title: "Proyecto a medida", desc: "Definimos cantidad, tipo y ubicación de cámaras según tu predio." },
      { icon: "Wrench", title: "Instalación", desc: "Montaje, cableado y configuración del sistema completo." },
      { icon: "Cloud", title: "Acceso remoto", desc: "Configuramos el monitoreo desde la app en tu celular o PC." },
      { icon: "Headset", title: "Mantenimiento", desc: "Soporte y mantenimiento para que el sistema no falle." },
    ],
    products: [
      { brand: "Hikvision", model: "Cámara IP exterior", image: "/photos/products/cctv.jpg", badge: "Stock disponible" },
      { brand: "Synology", model: "Grabador NVR / almacenamiento", image: "/photos/products/storage.jpg", badge: "Stock disponible" },
      { brand: "Dahua", model: "Kit de monitoreo", image: "/photos/products/cctv.jpg", badge: "A pedido" },
    ],
    brands: ["Hikvision", "Dahua", "Intel"],
    models: ["Cámaras IP corporativas", "Grabadores NVR", "Almacenamiento para CCTV", "Monitoreo remoto"],
    faqs: [
      { q: "¿Incluye la instalación de las cámaras?", a: "Sí, ofrecemos el servicio de instalación y configuración, además de la provisión de los equipos." },
      { q: "¿Se puede ver el monitoreo desde el celular?", a: "Sí, configuramos el acceso remoto para que veas las cámaras desde la app en tu teléfono o PC." },
      { q: "¿Cuántos días de grabación quedan guardados?", a: "Dimensionamos el almacenamiento según los días de grabación que necesites, desde una semana hasta varios meses." },
      { q: "¿Sirve para varias sucursales?", a: "Sí, podemos unificar el monitoreo de varias ubicaciones en una sola plataforma." },
    ],
    related: ["redes-infraestructura", "servidores"],
  },
  {
    slug: "workstations-pcs",
    navLabel: "Estaciones y PCs armadas",
    icon: "MonitorSmartphone",
    image: "/photos/products/desktop.jpg",
    eyebrow: "Estaciones de trabajo y PCs",
    h1: "Workstations y PCs armadas a la medida de tu trabajo.",
    intro:
      "Estaciones de trabajo y PCs corporativas armadas para ingeniería, diseño, CAD y producción. Componentes de marca, ensamble probado y garantía, con el respaldo de un mayorista.",
    metaTitle: "Workstations y PCs armadas para empresas | Bartez Tecnología",
    metaDescription:
      "Workstations Dell Precision y PCs corporativas armadas a medida para ingeniería, diseño y CAD. Distribuidor mayorista en Rosario con Factura A y garantía. Cotizá tu equipo.",
    keywords: ["workstation Dell Precision", "PC armada corporativa", "estación de trabajo CAD", "PC a medida empresas"],
    bullets: [
      { title: "Armado a medida", desc: "Configuramos cada equipo según la tarea: CAD, render, oficina o producción." },
      { title: "Componentes de marca", desc: "Procesadores Intel/AMD, RAM y discos de primeras marcas." },
      { title: "Rendimiento garantizado", desc: "Equipos dimensionados para que el software pesado no te frene." },
      { title: "Ensamble y testing", desc: "Armado y pruebas de estrés antes de entregar." },
      { title: "Garantía", desc: "Cobertura y posventa sobre el equipo completo." },
      { title: "Escalable", desc: "Equipos que se pueden ampliar a futuro sin reemplazar todo." },
    ],
    capabilities: [
      { icon: "DraftingCompass", title: "Configuración a medida", desc: "Elegimos los componentes ideales según tu software y presupuesto." },
      { icon: "Wrench", title: "Ensamble y testing", desc: "Armado profesional y pruebas de estabilidad antes de la entrega." },
      { icon: "ShieldCheck", title: "Garantía integral", desc: "Garantía sobre el equipo completo, gestionada por nosotros." },
      { icon: "Headset", title: "Soporte", desc: "Asistencia ante cualquier inconveniente del equipo." },
    ],
    products: [
      { brand: "Dell", model: "Precision 3680 Tower", image: "/photos/products/tower.jpg", badge: "Stock disponible" },
      { brand: "Bartez", model: "PC corporativa armada", image: "/photos/products/desktop.jpg", badge: "A medida" },
      { brand: "Dell", model: "Monitor UltraSharp U2724D", image: "/photos/products/monitor.jpg", badge: "Stock disponible" },
    ],
    brands: ["Dell", "HP", "Intel", "AMD"],
    models: ["Dell Precision 3680", "HP Z2 Tower", "PC armada a medida", "All-in-One corporativa"],
    faqs: [
      { q: "¿Arman PCs a medida?", a: "Sí. Definimos los componentes según el software y la tarea (CAD, render, oficina) y armamos el equipo con testing previo." },
      { q: "¿Las PCs armadas tienen garantía?", a: "Sí, ofrecemos garantía sobre el equipo completo y gestionamos la posventa." },
      { q: "¿Sirven para diseño e ingeniería?", a: "Sí, configuramos workstations con GPU y RAM adecuadas para CAD, 3D y video." },
      { q: "¿Se pueden ampliar después?", a: "Sí, armamos equipos escalables para sumar RAM, discos o GPU más adelante." },
    ],
    related: ["servidores", "perifericos-corporativos"],
  },
  {
    slug: "perifericos-corporativos",
    navLabel: "Periféricos corporativos",
    icon: "Keyboard",
    image: "/photos/products/peripherals.jpg",
    eyebrow: "Periféricos y accesorios",
    h1: "Periféricos y accesorios corporativos para equipar tu oficina.",
    intro:
      "Monitores, teclados, mouse, docks, headsets y todo el accesorio corporativo homologado por marca. Compra por volumen para equipar puestos de trabajo completos a precio mayorista.",
    metaTitle: "Periféricos y accesorios corporativos mayorista | Bartez Tecnología",
    metaDescription:
      "Monitores, teclados, mouse, docks y headsets corporativos. Distribuidor mayorista en Rosario con precios por volumen, Factura A y garantía. Cotizá tus accesorios.",
    keywords: ["periféricos corporativos", "monitores empresas", "docks notebook", "headsets oficina mayorista"],
    bullets: [
      { title: "Puestos completos", desc: "Equipamos cada estación: monitor, teclado, mouse, dock y headset." },
      { title: "Marcas homologadas", desc: "Accesorios compatibles y recomendados por cada fabricante." },
      { title: "Precio por volumen", desc: "Condiciones mayoristas para equipar muchos puestos a la vez." },
      { title: "Ergonomía", desc: "Opciones ergonómicas para el confort de tu equipo." },
      { title: "Garantía", desc: "Garantía oficial y gestión de cambios." },
      { title: "Stock y reposición", desc: "Reposición continua de los accesorios de uso diario." },
    ],
    capabilities: [
      { icon: "DraftingCompass", title: "Armado del puesto", desc: "Definimos el kit de accesorios ideal por tipo de puesto." },
      { icon: "Boxes", title: "Provisión por volumen", desc: "Abastecemos cantidades grandes con la misma agilidad." },
      { icon: "ShieldCheck", title: "Garantía y cambios", desc: "Gestión de garantía oficial y reposición." },
      { icon: "Headset", title: "Asesoramiento", desc: "Te recomendamos el accesorio correcto para cada necesidad." },
    ],
    products: [
      { brand: "Dell", model: "Monitor UltraSharp U2724D", image: "/photos/products/monitor.jpg", badge: "Stock disponible" },
      { brand: "Logitech", model: "Combo teclado + mouse", image: "/photos/products/peripherals.jpg", badge: "Stock disponible" },
      { brand: "Jabra", model: "Headset VoIP", image: "/photos/products/headset.jpg", badge: "Stock disponible" },
    ],
    brands: ["Dell", "HP", "Logitech", "Kingston"],
    models: ["Monitores Dell UltraSharp", "Docks WD19 / WD22", "Teclado + mouse corporativo", "Headsets VoIP"],
    faqs: [
      { q: "¿Venden accesorios por volumen?", a: "Sí, equipamos puestos completos y abastecemos cantidades grandes con precio mayorista." },
      { q: "¿Qué incluye un puesto de trabajo?", a: "Habitualmente monitor, teclado, mouse, dock y headset; armamos el kit según tu necesidad." },
      { q: "¿Los accesorios tienen garantía?", a: "Sí, garantía oficial de marca y gestión de cambios por nuestra parte." },
      { q: "¿Hacen reposición continua?", a: "Sí, mantenemos stock para reponer los accesorios de uso diario de tu empresa." },
    ],
    related: ["notebooks-corporativas", "workstations-pcs"],
  },
];

// ============================================================
// Casos de éxito (placeholder editable — reemplazar por reales)
// ============================================================

export const cases = {
  num: "—",
  eyebrow: "Casos de éxito",
  title: "Empresas que ya confían en Bartez.",
  desc: "Algunos proyectos representativos. (Datos de ejemplo — reemplazar por casos reales.)",
  items: [
    { sector: "Logística", initials: "LG", metric: "120", metricLabel: "notebooks renovadas", result: "Recambio completo del parque en 10 días, con una sola Factura A y financiación a 90 días." },
    { sector: "Industria", initials: "IN", metric: "99,9%", metricLabel: "uptime del datacenter", result: "Provisión e implementación de servidores y storage para virtualizar la operación de planta." },
    { sector: "Retail", initials: "RT", metric: "8", metricLabel: "sucursales conectadas", result: "Infraestructura de red y CCTV unificada en todas las sucursales, con soporte centralizado." },
  ],
};

// ============================================================
// Blog / Recursos (SEO) — /recursos y /recursos/[slug]
// ============================================================
export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
  cover: string;
  metaDescription: string;
  body: { h?: string; p?: string }[];
};

export const articles: Article[] = [
  {
    slug: "como-elegir-servidor-para-tu-empresa",
    title: "Cómo elegir el servidor correcto para tu empresa",
    excerpt: "Procesador, RAM, almacenamiento y virtualización: una guía práctica para no comprar de más ni de menos.",
    date: "2026-06-15",
    readingTime: "5 min",
    cover: "/photos/products/server.jpg",
    metaDescription:
      "Guía práctica para elegir el servidor corporativo correcto: CPU, RAM, storage, RAID y virtualización. Dimensioná tu inversión IT con criterio.",
    body: [
      { p: "Comprar un servidor es una inversión que tu empresa va a usar durante años. Elegir bien evita pagar de más por capacidad que no usás, o quedarte corto y tener que reinvertir antes de tiempo." },
      { h: "1. Empezá por la carga de trabajo" },
      { p: "Antes de mirar modelos, definí qué va a correr el servidor: archivos compartidos, una base de datos, un ERP, virtualización de varios sistemas, etc. La cantidad de usuarios simultáneos y las aplicaciones críticas determinan todo el resto." },
      { h: "2. Procesador y memoria" },
      { p: "Para la mayoría de las PyMEs, un procesador de la línea Intel Xeon de gama media y entre 32 y 64 GB de RAM cubren cómodamente. Si vas a virtualizar varios servidores en uno solo, priorizá RAM: es lo primero que se agota." },
      { h: "3. Almacenamiento y RAID" },
      { p: "Combiná discos SSD para el sistema y las aplicaciones con discos de mayor capacidad para datos. Configurá RAID para tener tolerancia a fallas: si un disco muere, no perdés información ni se detiene la operación." },
      { h: "4. Pensá en la continuidad" },
      { p: "Un buen servidor sin respaldo de energía es media solución. Sumá una UPS para cubrir cortes y picos, y definí una política de backups. La continuidad operativa vale más que cualquier ahorro inicial." },
      { h: "¿Necesitás ayuda para dimensionarlo?" },
      { p: "En Bartez relevamos tu operación y te proponemos la configuración exacta antes de cotizar, con marcas oficiales y precios mayoristas. Escribinos y lo definimos juntos." },
    ],
  },
  {
    slug: "renovar-fleet-de-notebooks-corporativas",
    title: "Renovar el fleet de notebooks: qué tener en cuenta",
    excerpt: "Gamas, garantía, financiación y logística: cómo encarar el recambio de notebooks de toda la empresa sin dolores de cabeza.",
    date: "2026-06-10",
    readingTime: "4 min",
    cover: "/photos/products/laptop1.jpg",
    metaDescription:
      "Cómo renovar el parque de notebooks corporativas: elegir gama, garantía, financiación B2B y logística. Guía para compras IT de empresas.",
    body: [
      { p: "Renovar las notebooks de una empresa no es comprar 50 equipos iguales: es un proyecto de compras que conviene planificar para optimizar costo, garantía y tiempos de entrega." },
      { h: "1. Definí gamas por perfil de usuario" },
      { p: "No todos necesitan lo mismo. Administrativos con ofimática rinden bien con una gama Essential; usuarios de diseño o ingeniería necesitan más potencia. Segmentar por perfil baja el costo total sin resignar productividad." },
      { h: "2. Priorizá la línea corporativa" },
      { p: "Las líneas profesionales (Lenovo ThinkPad, HP ProBook, Dell Latitude) están pensadas para uso intensivo, con mejor durabilidad, teclados y soporte que las líneas de consumo. A la larga, salen más baratas." },
      { h: "3. Garantía y posventa" },
      { p: "Verificá que los equipos tengan garantía oficial y que tu proveedor gestione la posventa. Un equipo parado sin respaldo te cuesta más que la diferencia de precio." },
      { h: "4. Financiación y logística" },
      { p: "Renovar todo de una vez impacta el flujo de caja. Buscá condiciones B2B, cuenta corriente y una única Factura A. Y coordiná la entrega para no frenar la operación." },
      { h: "Cotizá tu recambio con Bartez" },
      { p: "Cotizamos fleets completos con precio por volumen, garantía oficial y entrega a todo el país. Contanos cantidad y perfiles y te armamos la propuesta." },
    ],
  },
];
