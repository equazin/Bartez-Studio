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
  cuit: "20-21774424-6",
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
    "Hola, vengo de la web y necesito asesoramiento para mi empresa.",
  email: "ventas@bartez.com.ar",
  phoneDisplay: "+54 9 341 510-4902",
  hours: "Lunes a Viernes · 9 a 18 hs",
  social: {
    linkedin: "https://www.linkedin.com/company/bartez",
    instagram: "https://www.instagram.com/bartez",
  },
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

export const faq = {
  num: "08",
  eyebrow: "Preguntas frecuentes",
  title: "Lo que las empresas suelen consultar.",
  items: [
    { q: "¿Qué tipo de empresas atienden?", a: "Trabajamos con organizaciones que necesitan equipamiento, infraestructura o servicios IT con acompañamiento comercial y técnico." },
    { q: "¿Trabajan en todo el país?", a: "Sí. Coordinamos proyectos y provisión para empresas de distintas localidades de Argentina según el alcance de cada necesidad." },
    { q: "¿Emiten Factura A?", a: "Sí. Bartez es Responsable Inscripto y emite Factura A." },
    { q: "¿Cómo definen una solución?", a: "Primero relevamos el problema, la escala, la urgencia y el entorno actual. Con ese contexto, un especialista propone el alcance adecuado." },
    { q: "¿Puedo consultar aunque todavía no tenga especificaciones?", a: "Sí. No necesitás llegar con modelos definidos: el equipo puede ayudarte a traducir la necesidad en requerimientos técnicos." },
  ],
};

export const cookie = {
  text: "Usamos cookies para mejorar tu experiencia y medir el tráfico del sitio.",
  accept: "Aceptar",
  reject: "Rechazar",
};

export const seo = {
  title: "Bartez Tecnología — Soluciones IT para empresas",
  description:
    "Asesoramiento, infraestructura, equipamiento y servicios IT para empresas argentinas. Relevamiento técnico, implementación y atención B2B desde Rosario.",
  keywords: [
    "soluciones IT para empresas",
    "infraestructura tecnológica Rosario",
    "asesoramiento IT B2B",
    "servidores y redes empresariales",
    "servicios tecnológicos Argentina",
  ],
  ogImage: "/opengraph-image",
};

// ============================================================
// Landings por vertical (SEO / Google Ads) — /soluciones/[slug]
// ============================================================
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
      "Distribuimos servidores, almacenamiento y soluciones de virtualización de marcas oficiales, dimensionados a la medida de tu operación. Planificación de continuidad, condiciones comerciales y soporte de implementación de punta a punta.",
    metaTitle: "Soluciones de servidores corporativos | Bartez Tecnología",
    metaDescription:
      "Servidores, storage y virtualización para empresas con relevamiento, dimensionamiento e implementación desde Rosario.",
    keywords: ["servidores Dell PowerEdge", "storage empresas", "servidor corporativo mayorista", "virtualización Rosario"],
    bullets: [
      { title: "Dimensionamiento técnico", desc: "Relevamos tu carga de trabajo y proponemos la configuración correcta." },
      { title: "Marcas oficiales", desc: "Dell PowerEdge, HPE ProLiant y storage con garantía de fábrica." },
      { title: "Virtualización", desc: "Consolidá varios servidores en uno con VMware, Hyper-V o Proxmox." },
      { title: "Implementación", desc: "Instalación, configuración y puesta en marcha con técnicos certificados." },
      { title: "Continuidad", desc: "Planificación de continuidad, UPS y políticas de backup para que nunca pares." },
      { title: "Escalabilidad", desc: "Equipos que crecen con tu empresa, sin rehacer la inversión." },
    ],
    capabilities: [
      { icon: "DraftingCompass", title: "Relevamiento", desc: "Analizamos usuarios, aplicaciones y cargas para definir la configuración exacta." },
      { icon: "Wrench", title: "Instalación y virtualización", desc: "Montaje en rack, hipervisor y migración de servicios sin frenar la operación." },
      { icon: "ShieldCheck", title: "Garantía oficial", desc: "Gestión de garantía y reemplazo con respaldo del fabricante." },
      { icon: "Headset", title: "Soporte y monitoreo", desc: "Mantenimiento preventivo y soporte ante incidentes." },
    ],
    faqs: [
      { q: "¿Asesoran sobre qué servidor necesito?", a: "Sí. Relevamos tu operación (usuarios, virtualización, bases de datos) y te proponemos la configuración adecuada antes de preparar una propuesta." },
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
    h1: "Notebooks corporativas pensadas para cada perfil de trabajo.",
    intro:
      "Planificamos la renovación de equipos por perfiles de uso, estandarización, configuración y distribución a una o varias sedes.",
    metaTitle: "Notebooks corporativas para empresas | Bartez Tecnología",
    metaDescription:
      "Planificación y preparación de notebooks corporativas para empresas, con asesoramiento por perfiles y cobertura nacional.",
    keywords: ["notebooks corporativas", "ThinkPad empresas", "fleet de notebooks", "Dell Latitude mayorista"],
    bullets: [
      { title: "Plan por perfiles", desc: "Definimos perfiles y etapas de renovación según la escala de la organización." },
      { title: "Gama profesional", desc: "Lenovo ThinkPad, HP ProBook y Dell Latitude, durabilidad de negocio." },
      { title: "Configuración previa", desc: "Imagen corporativa, software y dominio listos antes de entregar." },
      { title: "Planificación comercial", desc: "El alcance comercial se prepara después de relevar el parque y el cronograma." },
      { title: "Garantía oficial", desc: "Gestión de garantía y posventa con respaldo del fabricante." },
      { title: "Logística nacional", desc: "Entrega coordinada a una o varias sucursales del país." },
    ],
    capabilities: [
      { icon: "DraftingCompass", title: "Asesoramiento por perfil", desc: "Definimos la gama ideal según el uso de cada equipo de trabajo." },
      { icon: "Wrench", title: "Preparación de equipos", desc: "Imagen, software y configuración corporativa lista para usar." },
      { icon: "ShieldCheck", title: "Garantía y posventa", desc: "Gestionamos la garantía oficial y los reemplazos por vos." },
      { icon: "Boxes", title: "Renovación programada", desc: "Plan de recambio del parque para no improvisar." },
    ],
    faqs: [
      { q: "¿Pueden acompañar renovaciones de muchos equipos?", a: "Sí. Relevamos cantidad, perfiles de uso, sedes y cronograma para preparar una propuesta adecuada." },
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
    h1: "Infraestructura de red empresarial, del relevamiento a la implementación.",
    intro:
      "Switches, access points, firewalls y cableado para construir o ampliar la red de tu empresa. Productos de marcas líderes con diseño, provisión e implementación.",
    metaTitle: "Infraestructura de red para empresas | Bartez Tecnología",
    metaDescription:
      "Diseño e implementación de redes empresariales, WiFi, firewalls y cableado estructurado con asesoramiento técnico.",
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
      "Diseño e implementación de videovigilancia IP para oficinas, plantas y depósitos, con alcance definido según cada predio.",
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
      "Estaciones de trabajo y PCs corporativas configuradas para ingeniería, diseño, CAD y producción, con ensamble, pruebas y soporte.",
    metaTitle: "Workstations y PCs armadas para empresas | Bartez Tecnología",
    metaDescription:
      "Workstations y PCs corporativas dimensionadas para ingeniería, diseño y CAD, con configuración, pruebas y soporte.",
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
      "Diseñamos y estandarizamos puestos de trabajo completos con monitores, docks, periféricos y accesorios compatibles.",
    metaTitle: "Puestos de trabajo corporativos | Bartez Tecnología",
    metaDescription:
      "Diseño y estandarización de puestos de trabajo con monitores, docks, periféricos y accesorios corporativos.",
    keywords: ["periféricos corporativos", "monitores empresas", "docks notebook", "headsets oficina mayorista"],
    bullets: [
      { title: "Puestos completos", desc: "Equipamos cada estación: monitor, teclado, mouse, dock y headset." },
      { title: "Marcas homologadas", desc: "Accesorios compatibles y recomendados por cada fabricante." },
      { title: "Estandarización por escala", desc: "Criterios comunes para equipar muchos puestos de manera consistente." },
      { title: "Ergonomía", desc: "Opciones ergonómicas para el confort de tu equipo." },
      { title: "Garantía", desc: "Garantía oficial y gestión de cambios." },
      { title: "Continuidad y reposición", desc: "Reposición continua de los accesorios de uso diario." },
    ],
    capabilities: [
      { icon: "DraftingCompass", title: "Armado del puesto", desc: "Definimos el kit de accesorios ideal por tipo de puesto." },
      { icon: "Boxes", title: "Provisión por volumen", desc: "Abastecemos cantidades grandes con la misma agilidad." },
      { icon: "ShieldCheck", title: "Garantía y cambios", desc: "Gestión de garantía oficial y reposición." },
      { icon: "Headset", title: "Asesoramiento", desc: "Te recomendamos el accesorio correcto para cada necesidad." },
    ],
    faqs: [
      { q: "¿Venden accesorios por volumen?", a: "Sí, equipamos puestos completos y abastecemos cantidades grandes con criterio técnico y comercial." },
      { q: "¿Qué incluye un puesto de trabajo?", a: "Habitualmente monitor, teclado, mouse, dock y headset; armamos el kit según tu necesidad." },
      { q: "¿Los accesorios tienen garantía?", a: "Sí, garantía oficial de marca y gestión de cambios por nuestra parte." },
      { q: "¿Hacen reposición continua?", a: "Sí, planificamos la reposición para reponer los accesorios de uso diario de tu empresa." },
    ],
    related: ["notebooks-corporativas", "workstations-pcs"],
  },
];

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
      { p: "En Bartez relevamos tu operación y proponemos una configuración alineada con las cargas, la continuidad y el crecimiento esperado. Escribinos y lo definimos juntos." },
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
      { h: "Planificá tu recambio con Bartez" },
      { p: "Relevamos cantidad, perfiles de uso y sedes para definir un plan de renovación y distribución." },
    ],
  },
];

// ============================================================
// Páginas legales — /legales/[slug]
// ============================================================
export type LegalPage = {
  slug: string;
  title: string;
  updated: string;
  intro: string;
  sections: { h: string; p: string }[];
};

export const legalPages: LegalPage[] = [
  {
    slug: "privacidad",
    title: "Política de privacidad",
    updated: "2026-06-21",
    intro:
      "En Bartez Tecnología respetamos tu privacidad. Esta política explica qué datos personales recolectamos a través de este sitio, con qué finalidad y cómo los protegemos, en cumplimiento de la Ley 25.326 de Protección de Datos Personales de la República Argentina.",
    sections: [
      { h: "1. Responsable del tratamiento", p: "Bartez Tecnología (Responsable Inscripto, CUIT 20-21774424-6), con domicilio en 9 de Julio 3418, Rosario, Santa Fe, es responsable del tratamiento de los datos recolectados en este sitio. Ante cualquier consulta podés escribirnos a ventas@bartez.com.ar." },
      { h: "2. Qué datos recolectamos", p: "Recolectamos los datos que completás voluntariamente en nuestros formularios de contacto, cotización y descargas: razón social, nombre, email corporativo, teléfono, tipo de consulta y el mensaje o detalle del pedido. También recopilamos datos de navegación de forma anónima mediante herramientas de analítica." },
      { h: "3. Finalidad", p: "Usamos tus datos exclusivamente para responder tu consulta, elaborar cotizaciones, gestionar tu cuenta corporativa y mejorar nuestros servicios. No vendemos ni cedemos tus datos a terceros con fines comerciales ajenos a Bartez." },
      { h: "4. Terceros y encargados", p: "Para operar el sitio y gestionar las consultas utilizamos proveedores que actúan como encargados del tratamiento: plataformas de CRM (Apollo, monday.com), envío de correo (Resend), hosting (Vercel) y analítica (Google Analytics, Microsoft Clarity). Estos proveedores tratan los datos únicamente para prestarnos el servicio." },
      { h: "5. Cookies", p: "Utilizamos cookies propias y de terceros para recordar tus preferencias y medir el tráfico del sitio de forma agregada. Podés aceptarlas o rechazarlas desde el aviso de cookies, y configurar tu navegador para bloquearlas." },
      { h: "6. Conservación", p: "Conservamos tus datos durante el tiempo necesario para gestionar tu consulta y la relación comercial, y luego durante los plazos legales aplicables." },
      { h: "7. Tus derechos", p: "Podés ejercer en cualquier momento tus derechos de acceso, rectificación, actualización y supresión de tus datos escribiendo a ventas@bartez.com.ar. La Agencia de Acceso a la Información Pública, órgano de control de la Ley 25.326, atiende denuncias relacionadas con el incumplimiento de las normas sobre protección de datos personales." },
      { h: "8. Cambios", p: "Podemos actualizar esta política. Publicaremos cualquier cambio en esta misma página con su fecha de actualización." },
    ],
  },
  {
    slug: "terminos",
    title: "Términos de uso",
    updated: "2026-06-21",
    intro:
      "Estos términos regulan el uso del sitio web de Bartez Tecnología. Al navegar y utilizar este sitio, aceptás las condiciones que se describen a continuación.",
    sections: [
      { h: "1. Objeto del sitio", p: "Este sitio presenta las capacidades, servicios y áreas de trabajo de Bartez Tecnología. No es una tienda online ni publica ofertas vinculantes." },
      { h: "2. Propuestas comerciales", p: "Las propuestas se preparan a pedido y sus condiciones se informan en cada documento comercial. Ninguna información del sitio constituye una oferta vinculante." },
      { h: "3. Uso permitido", p: "Podés usar este sitio con fines informativos y para contactarnos. No está permitido utilizarlo para fines ilícitos, ni intentar dañar, sobrecargar o vulnerar la seguridad del sitio o de sus sistemas." },
      { h: "4. Propiedad intelectual", p: "Los contenidos, marcas, logos y diseños del sitio pertenecen a Bartez Tecnología o a sus respectivos titulares. Las marcas de los fabricantes (Dell, Lenovo, HP, Cisco, etc.) pertenecen a sus dueños y se muestran a título informativo de los productos que distribuimos." },
      { h: "5. Limitación de responsabilidad", p: "Procuramos que la información del sitio sea correcta y esté actualizada, pero no garantizamos que esté libre de errores. Bartez no será responsable por daños derivados del uso del sitio o de la imposibilidad de acceder a él." },
      { h: "6. Enlaces y servicios de terceros", p: "El sitio puede integrar servicios de terceros (mapas, formularios, analítica). El uso de esos servicios se rige por sus propias condiciones y políticas." },
      { h: "7. Ley aplicable y jurisdicción", p: "Estos términos se rigen por las leyes de la República Argentina. Ante cualquier controversia, las partes se someten a los tribunales ordinarios de la ciudad de Rosario, Santa Fe." },
      { h: "8. Contacto", p: "Por cualquier consulta sobre estos términos, escribinos a ventas@bartez.com.ar." },
    ],
  },
];
