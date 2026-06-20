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
  geo: { lat: -32.9468, lng: -60.6393 }, // aprox. Rosario centro — ajustar al real
  url: "https://bartez.com.ar",
  founded: "2015",
};

export const contact = {
  // Reemplazar por datos reales en producción
  whatsappNumber: "5493410000000",
  whatsappMessage:
    "Hola, vengo de la web y quisiera una cotización.",
  email: "comercial@bartez.com.ar",
  phoneDisplay: "+54 9 341 000-0000",
  hours: "Lunes a Viernes · 9 a 18 hs",
  social: {
    linkedin: "https://www.linkedin.com/company/bartez",
    instagram: "https://www.instagram.com/bartez",
  },
};

export const nav = {
  links: [
    { label: "Soluciones", href: "#soluciones" },
    { label: "Catálogo", href: "#catalogo" },
    { label: "Nosotros", href: "#nosotros" },
    { label: "Contacto", href: "#contacto" },
  ],
  cta: { label: "Solicitar cotización", href: "#contacto" },
};

export const hero = {
  eyebrow: "Hardware IT corporativo · Entrega a todo el país",
  title: "Tecnología que mueve empresas.",
  subtitle:
    "Servidores, notebooks corporativas, redes e infraestructura. El partner mayorista que garantiza continuidad operativa a empresas medianas y grandes de toda la Argentina.",
  ctaPrimary: { label: "Pedí tu cotización", href: "#contacto" },
  ctaSecondary: { label: "Hablá con un asesor", href: "#contacto" },
  stats: [
    { value: "+14.000", label: "productos en catálogo" },
    { value: "24 hs", label: "cotización promedio" },
    { value: "País", label: "cobertura nacional" },
  ],
};

export const partners = {
  title: "Partners y marcas oficiales",
  brands: ["Dell", "Lenovo", "HP", "Cisco", "Intel", "AMD", "APC", "Kingston"],
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

export const whyBartez = {
  num: "02",
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
  num: "03",
  eyebrow: "Catálogo destacado",
  title: "Algunos de los productos con stock disponible.",
  cta: { label: "Ver catálogo completo", href: "#contacto" },
  // Productos mock — reemplazar por catálogo real
  products: [
    { brand: "Dell", model: "PowerEdge R760", category: "Servidor", stock: true },
    { brand: "Lenovo", model: "ThinkPad T14 Gen 5", category: "Notebook", stock: true },
    { brand: "HP", model: "ProBook 460 G11", category: "Notebook", stock: true },
    { brand: "Cisco", model: "Catalyst 9200", category: "Switch", stock: true },
    { brand: "Dell", model: "UltraSharp U2724D", category: "Monitor", stock: true },
    { brand: "APC", model: "Smart-UPS 1500VA", category: "Energía", stock: true },
    { brand: "Lenovo", model: "ThinkCentre M70q", category: "Mini PC", stock: true },
    { brand: "Intel", model: "NUC 13 Pro", category: "Mini PC", stock: false },
  ],
};

export const process = {
  num: "04",
  eyebrow: "Proceso comercial",
  title: "De la consulta a la entrega, sin fricciones.",
  steps: [
    { n: "01", title: "Consulta", desc: "Contanos qué necesitás por web, mail o WhatsApp." },
    { n: "02", title: "Cotización en 24 hs", desc: "Recibís una propuesta técnica y comercial formal." },
    { n: "03", title: "Aprobación y Factura A", desc: "Confirmás y facturamos con condiciones corporativas." },
    { n: "04", title: "Entrega", desc: "Despachamos a todo el país con seguimiento." },
  ],
};

export const contactSection = {
  num: "05",
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
      // Reemplazar por link real de Google Drive en producción / env
      file: "BROCHURE_DRIVE_URL",
    },
    {
      id: "catalogo",
      title: "Catálogo de productos (PDF)",
      desc: "Líneas, marcas y modelos destacados.",
      file: "CATALOGO_DRIVE_URL",
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
  ogImage: "/og-image.png",
};
