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
  cta: { label: "Abrí tu cuenta corporativa", href: "#contacto" },
};

export const nav = {
  links: [
    { label: "Soluciones", href: "#soluciones" },
    { label: "Servicios", href: "#servicios" },
    { label: "Catálogo", href: "#catalogo" },
    { label: "Cotizá", href: "#cotiza" },
    { label: "Nosotros", href: "#nosotros" },
    { label: "Contacto", href: "#contacto" },
  ],
  cta: { label: "Solicitar cotización", href: "#cotiza" },
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
    },
    {
      id: "notebooks",
      category: "Movilidad",
      icon: "Laptop",
      title: "Notebooks corporativas",
      desc: "Gamas Essential · Pro · Elite para cada equipo de trabajo.",
      cta: "Cotizá tu fleet",
    },
    {
      id: "redes",
      category: "Networking",
      icon: "Network",
      title: "Infraestructura de red",
      desc: "Switches, access points y firewalls gestionados.",
      cta: "Ver más",
    },
    {
      id: "workstations",
      category: "Workstations",
      icon: "MonitorSmartphone",
      title: "Estaciones y PCs armadas",
      desc: "Equipos a medida para ingeniería, diseño y producción.",
      cta: "Ver más",
    },
    {
      id: "perifericos",
      category: "Accesorios",
      icon: "Keyboard",
      title: "Periféricos corporativos",
      desc: "Monitores, docks y accesorios homologados por marca.",
      cta: "Ver más",
    },
    {
      id: "cctv",
      category: "Seguridad",
      icon: "Cctv",
      title: "Videovigilancia y CCTV",
      desc: "Cámaras, NVR y soluciones de monitoreo para tu planta.",
      cta: "Ver más",
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
        { label: "Nosotros", href: "#nosotros" },
        { label: "Proceso comercial", href: "#proceso" },
        { label: "Contacto", href: "#contacto" },
      ],
    },
    {
      title: "Soluciones",
      links: [
        { label: "Servidores y storage", href: "#soluciones" },
        { label: "Notebooks corporativas", href: "#soluciones" },
        { label: "Infraestructura de red", href: "#soluciones" },
        { label: "Videovigilancia", href: "#soluciones" },
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
