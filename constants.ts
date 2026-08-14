/**
 * constants.ts — Fuente única de verdad de contenido comercial de Bartez Tecnología.
 * Editá este archivo para cambiar textos, datos de contacto, productos y marcas
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
  tagline: "Distribución IT para empresas y revendedores.",
  description:
    "Distribuimos equipamiento, infraestructura y soluciones tecnológicas para empresas, organismos y revendedores en toda Argentina. Dieciocho años de experiencia y atención comercial directa por WhatsApp.",
  legalName: "Bartez Tecnología",
  legalNotice: "Responsable Inscripto",
  cuit: "20-21774424-6",
  taxCondition: "Responsable Inscripto · Factura A",
  city: "Rosario",
  province: "Santa Fe",
  country: "Argentina",
  address: "9 de Julio 3418, Rosario, Santa Fe",
  geo: { lat: -32.9481114, lng: -60.6717758 }, // 9 de Julio 3418, Echesortu, Rosario (geocodificado)
  url: "https://bartez.com.ar",
  founded: "2008",
  experienceYears: "18",
  clients: "10.000+",
  channels: ["Empresas", "Revendedores", "Sector público", "Educación"],
};

export const contact = {
  // Reemplazar por datos reales en producción
  whatsappNumber: "5493416684350",
  whatsappMessage:
    "Hola, vengo de la web y necesito asesoramiento para mi empresa.",
  email: "ventas@bartez.com.ar",
  phoneDisplay: "+54 9 341 668-4350",
  hours: "Lunes a Viernes · 9 a 18 hs",
  social: {
    linkedin: "https://www.linkedin.com/company/bartez",
    instagram: "https://www.instagram.com/bartez",
  },
};

export const partners = {
  title: "Marcas que trabajamos",
  brands: [
    { name: "Dell", logo: "/logos/dell.png" },
    { name: "Lenovo", logo: "/logos/lenovo.png" },
    { name: "HP", logo: "/logos/hp.png" },
    { name: "HPE", logo: "/logos/hpe.png" },
    { name: "Cisco", logo: "/logos/cisco.png" },
    { name: "Aruba", logo: "/logos/aruba.png" },
    { name: "Ubiquiti", logo: "/logos/ubiquiti.png" },
    { name: "APC", logo: "/logos/apc.svg" },
    { name: "Intel", logo: "/logos/intel.png" },
    { name: "AMD", logo: "/logos/amd.png" },
    { name: "Kingston", logo: "/logos/kingston.png" },
    { name: "WD", logo: "/logos/wd.png" },
  ],
};

export const faq = {
  num: "08",
  eyebrow: "Preguntas frecuentes",
  title: "Lo que más nos consultan.",
  items: [
    { q: "¿Qué tipo de clientes atienden?", a: "Trabajamos con empresas, organismos públicos y privados, instituciones educativas y revendedores en diferentes puntos de Argentina. Dieciocho años en el rubro nos permiten adaptarnos a cada necesidad con asesoramiento personalizado." },
    { q: "¿Trabajan en todo el país?", a: "Sí. Distribuimos y coordinamos proyectos en distintas localidades de Argentina. Desde Rosario gestionamos operaciones a nivel nacional." },
    { q: "¿Emiten Factura A?", a: "Sí. Bartez es Responsable Inscripto y emite Factura A para empresas y organismos." },
    { q: "¿Cómo arman una solución?", a: "Primero relevamos el problema, la escala, la urgencia y el entorno actual. Con ese contexto, nuestro equipo propone el alcance y las alternativas tecnológicas que mejor se adaptan." },
    { q: "¿Puedo consultar sin saber exactamente qué necesito?", a: "Sí. No necesitás llegar con modelos ni cantidades definidas. El equipo puede ayudarte a traducir tu necesidad en una solución tecnológica concreta." },
    { q: "¿Trabajan con revendedores o distribuidores?", a: "Sí. Contamos con un canal de distribución activo. Si sos revendedor y querés sumar los productos Bartez a tu oferta, visitá nuestra sección de Revendedores o escribinos directamente." },
    { q: "¿Ofrecen financiación?", a: "Sí. Trabajamos con cuenta corriente y condiciones comerciales acordes a cada cliente. Factura A en todas las operaciones." },
  ],
};

export const cookie = {
  text: "Usamos cookies para mejorar tu experiencia y medir el tráfico del sitio.",
  accept: "Aceptar",
  reject: "Rechazar",
};

export const seo = {
  title: "Bartez Tecnología — Distribución IT para empresas y revendedores",
  description:
    "Equipamiento, infraestructura y soluciones IT para empresas, organismos y revendedores. Dieciocho años en el rubro, más de 10.000 clientes y cobertura nacional desde Rosario.",
  keywords: [
    "distribuidora IT Argentina",
    "soluciones IT para empresas",
    "distribuidor tecnología Rosario",
    "infraestructura tecnológica Rosario",
    "asesoramiento IT B2B",
    "servidores y redes empresariales",
    "servicios tecnológicos Argentina",
    "distribuidor notebooks corporativas",
    "revendedor tecnología Argentina",
    "punto de venta electrónico BarPOS",
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
    h1: "Servidores rack y storage para empresas, con configuración a medida.",
    intro:
      "Cotizamos servidores rack y torre de Lenovo ThinkSystem, HPE ProLiant y Dell PowerEdge en configuraciones equivalentes, para que compares con criterio antes de decidir. Definimos CPU, memoria, controladora, discos, fuentes y ventilación según tu carga real.",
    metaTitle: "Servidores rack Lenovo, HPE y Dell para empresas | Bartez Tecnología",
    metaDescription:
      "Servidores rack ThinkSystem, ProLiant y PowerEdge configurados a medida. Comparación multi-marca, dimensionamiento técnico y virtualización desde Rosario.",
    keywords: ["servidores Dell PowerEdge", "Lenovo ThinkSystem", "HPE ProLiant", "servidor corporativo mayorista", "virtualización empresa"],
    bullets: [
      { title: "Comparación multi-marca", desc: "Lenovo ThinkSystem, HPE ProLiant y Dell PowerEdge en configuraciones equivalentes para que puedas decidir con datos." },
      { title: "Dimensionamiento técnico", desc: "Definimos CPU, cantidad y ubicación de módulos DIMM para poblar todos los canales de memoria, discos y controladora según tu carga real." },
      { title: "Controladora HBA o RAID", desc: "Elegimos HBA con pass-through cuando el sistema (ZFS, Proxmox, TrueNAS) necesita ver los discos directos, o RAID hardware cuando corresponde." },
      { title: "Redundancia eléctrica", desc: "Fuentes redundantes (1+1) o simples según criticidad; UPS y PDU acordes al consumo del rack." },
      { title: "Virtualización", desc: "Consolidá varios servidores en uno con Proxmox VE, VMware o Hyper-V. Ver también nuestra página dedicada a virtualización Proxmox." },
      { title: "Continuidad y backup", desc: "Política de backup, RAID adecuado y plan de continuidad para que un disco caído no frene la operación." },
    ],
    capabilities: [
      { icon: "DraftingCompass", title: "Relevamiento técnico", desc: "Usuarios concurrentes, IOPS, RAM útil por VM y crecimiento a 3 años como base del sizing." },
      { icon: "Wrench", title: "Instalación y virtualización", desc: "Montaje en rack, hipervisor y migración de servicios sin frenar la operación." },
      { icon: "ShieldCheck", title: "Garantía y posventa", desc: "Te orientamos sobre las condiciones vigentes de cada fabricante y niveles de servicio disponibles." },
      { icon: "Headset", title: "Soporte y monitoreo", desc: "Mantenimiento preventivo y soporte ante incidentes." },
    ],
    faqs: [
      { q: "¿Comparan varias marcas en una misma cotización?", a: "Sí. Es habitual que armemos Lenovo ThinkSystem, HPE ProLiant y Dell PowerEdge en configuraciones equivalentes para que puedas comparar precio, plazo y detalles técnicos antes de decidir." },
      { q: "¿Configuran servidores para Proxmox / ZFS?", a: "Sí. Definimos controladora HBA con pass-through para que ZFS vea los discos directos, ubicación de módulos DIMM para poblar todos los canales de memoria, y variantes con fuente redundante o simple según criticidad. Tenemos una página dedicada a virtualización Proxmox." },
      { q: "¿Incluye instalación en rack?", a: "Sí, podemos cotizar el servicio de montaje, cableado, instalación del hipervisor y migración de servicios como alcance adicional al equipo." },
      { q: "¿Ofrecen financiación?", a: "Sí, con cuenta corriente y condiciones corporativas según evaluación crediticia, y siempre con Factura A." },
    ],
    related: ["virtualizacion-proxmox", "redes-infraestructura", "cableado-racks"],
  },
  {
    slug: "virtualizacion-proxmox",
    navLabel: "Virtualización Proxmox",
    icon: "ServerCog",
    image: "/photos/products/server.jpg",
    eyebrow: "Virtualización empresarial",
    h1: "Servidores para virtualización Proxmox VE, con criterios técnicos claros.",
    intro:
      "Configuramos servidores rack Lenovo, HPE y Dell pensados para Proxmox VE: controladora en modo HBA para ZFS, poblado óptimo de canales de memoria, fuentes redundantes o simples según criticidad, y storage dimensionado para la carga real.",
    metaTitle: "Servidores para virtualización Proxmox VE | Bartez Tecnología",
    metaDescription:
      "Configuración de servidores Lenovo, HPE y Dell para Proxmox VE con HBA para ZFS, canales de memoria poblados y storage a medida.",
    keywords: ["Proxmox VE Argentina", "servidor para Proxmox", "HBA ZFS Proxmox", "virtualización open source empresas"],
    bullets: [
      { title: "HBA con pass-through", desc: "Elegimos controladora que exponga los discos directos al sistema para que ZFS pueda administrar el pool sin capa RAID intermedia." },
      { title: "Canales de memoria poblados", desc: "Ubicamos los módulos DIMM para aprovechar todos los canales de la CPU y no dejar ancho de banda de memoria sin usar." },
      { title: "Storage a medida", desc: "Dimensionamos discos NVMe, SSD SATA/SAS y HDD según IOPS, capacidad y política de snapshots del cluster Proxmox." },
      { title: "Fuentes redundantes o simples", desc: "1+1 para servicios críticos, fuente simple cuando el ahorro justifica la operación. Decidimos con vos." },
      { title: "Comparación multi-marca", desc: "Cotizamos Lenovo ThinkSystem, HPE ProLiant y Dell PowerEdge en configuraciones equivalentes para que puedas comparar." },
      { title: "Cluster y HA", desc: "Podemos dimensionar dos o tres nodos para cluster Proxmox con HA y storage compartido cuando la operación lo requiere." },
    ],
    capabilities: [
      { icon: "DraftingCompass", title: "Sizing por carga", desc: "RAM útil por VM, IOPS del storage y CPU por nodo antes de recomendar." },
      { icon: "Cpu", title: "Configuración avanzada", desc: "HBA, DIMM por canal, NIC dedicada para migración y ceph/zfs según caso." },
      { icon: "ServerCog", title: "Instalación Proxmox", desc: "Montaje, instalación del hipervisor, cluster y migración de servicios." },
      { icon: "Headset", title: "Soporte técnico", desc: "Acompañamiento en actualizaciones, tuning y resolución de incidentes." },
    ],
    faqs: [
      { q: "¿Por qué HBA y no RAID hardware para Proxmox con ZFS?", a: "ZFS necesita ver los discos directos para administrar el pool, hacer checksums y manejar snapshots. Un RAID hardware oculta los discos y rompe esas garantías. Por eso configuramos controladora HBA (LSI/Broadcom en modo IT o equivalente) cuando el destino es ZFS o TrueNAS." },
      { q: "¿Cómo eligen la cantidad y ubicación de módulos DIMM?", a: "Los procesadores Xeon y EPYC tienen múltiples canales de memoria por CPU. Poblar un solo canal deja la mitad o más del ancho de banda sin usar. Definimos módulos y slots para que todos los canales estén poblados a la misma velocidad, siguiendo el manual de cada plataforma." },
      { q: "¿Fuente simple o redundante?", a: "1+1 cuando la caída de un servicio impacta directo la operación (ERP, virtualización productiva). Fuente simple cuando el costo adicional no se justifica y hay UPS y ventana de mantenimiento. Lo decidimos con vos según criticidad." },
      { q: "¿Trabajan con Proxmox además de VMware / Hyper-V?", a: "Sí. Proxmox VE es una alternativa open source cada vez más elegida por costo y funcionalidad; también cotizamos servidores para VMware y Hyper-V cuando el escenario lo requiere." },
    ],
    related: ["servidores", "cableado-racks", "redes-infraestructura"],
  },
  {
    slug: "notebooks-corporativas",
    navLabel: "Notebooks corporativas",
    icon: "Laptop",
    image: "/photos/products/laptop1.jpg",
    eyebrow: "Notebooks corporativas",
    h1: "Renovación de parque de notebooks corporativas, por lote y con Windows Pro.",
    intro:
      "Acompañamos la renovación completa del parque informático: relevamiento por perfiles, compra por lote con Windows 11 Pro y licenciamiento adecuado, imagen corporativa unificada y entrega escalonada a una o varias sedes.",
    metaTitle: "Renovación de notebooks corporativas por lote | Bartez Tecnología",
    metaDescription:
      "Compra por lote de notebooks Lenovo ThinkPad, HP ProBook y Dell Latitude con Windows 11 Pro, imagen unificada y entrega escalonada nacional.",
    keywords: ["renovación de parque informático", "notebooks corporativas por lote", "ThinkPad empresas", "fleet de notebooks", "Windows 11 Pro empresas"],
    bullets: [
      { title: "Compra por lote", desc: "Relevamos cantidad, perfiles y cronograma; cotizamos lotes de 10, 20, 50 o más equipos con condiciones B2B y factura A." },
      { title: "Windows 11 Pro", desc: "Todos los equipos vienen con Windows 11 Pro para dominio, BitLocker y administración corporativa. Sumamos licenciamiento Microsoft 365 si lo necesitás." },
      { title: "Gama profesional", desc: "Lenovo ThinkPad, HP ProBook / EliteBook y Dell Latitude — chasis y teclados pensados para uso intensivo diario." },
      { title: "Imagen unificada", desc: "Preparación previa con imagen corporativa, software base, joineo a dominio y configuración de seguridad antes de entregar." },
      { title: "Entrega escalonada", desc: "Coordinamos entregas por tandas para no frenar la operación: por sede, por área o por turno de recambio." },
      { title: "Comparación multi-marca", desc: "Presentamos Lenovo, HP y Dell en configuraciones equivalentes; elegís con datos, no por default." },
    ],
    capabilities: [
      { icon: "DraftingCompass", title: "Asesoramiento por perfil", desc: "Definimos la gama por rol (administrativo, técnico, campo, dirección) y presupuesto." },
      { icon: "Wrench", title: "Preparación de equipos", desc: "Imagen, software y dominio listos para usar; opcionalmente etiquetado de inventario." },
      { icon: "ShieldCheck", title: "Garantía y posventa", desc: "Te acompañamos en la gestión y el seguimiento de cada caso con el fabricante." },
      { icon: "Boxes", title: "Renovación programada", desc: "Plan de recambio del parque a 12 / 24 / 36 meses para no improvisar." },
    ],
    faqs: [
      { q: "¿Acompañan renovaciones de 20, 50 o 100 notebooks?", a: "Sí. Es un escenario habitual: relevamos cantidad, perfiles de uso, sedes y cronograma para preparar la propuesta y coordinar la entrega escalonada." },
      { q: "¿Vienen con Windows 11 Pro?", a: "Sí. En parques corporativos siempre cotizamos con Windows 11 Pro para permitir dominio, BitLocker y políticas de grupo. También cotizamos licenciamiento Microsoft 365 si hace falta." },
      { q: "¿Preparan los equipos antes de entregar?", a: "Sí, podemos entregar las notebooks con imagen corporativa, software base y configuración de dominio, y opcionalmente etiquetado de inventario." },
      { q: "¿Comparan varias marcas?", a: "Sí. En compras por lote es habitual que armemos ThinkPad, ProBook y Latitude en configuraciones equivalentes para que puedas decidir con datos." },
      { q: "¿Ofrecen financiación?", a: "Sí, trabajamos con cuenta corriente y condiciones corporativas según evaluación crediticia." },
      { q: "¿Entregan al interior del país?", a: "Sí, tenemos cobertura nacional y coordinamos la entrega a una o varias sucursales." },
    ],
    related: ["workstations-alta-gama", "servidores"],
  },
  {
    slug: "redes-infraestructura",
    navLabel: "Redes e infraestructura",
    icon: "Network",
    image: "/photos/products/switch.jpg",
    eyebrow: "Infraestructura de red",
    h1: "Redes empresariales Cisco, Aruba y Ubiquiti, del relevamiento a la implementación.",
    intro:
      "Cotizamos y coordinamos redes empresariales: switches core administrables Cisco Catalyst y Aruba, access points Cisco / Aruba / Ubiquiti según escenario, firewalls y cableado estructurado. Para escenarios WiFi multi-sede con UniFi tenemos una página dedicada.",
    metaTitle: "Redes empresariales Cisco, Aruba y Ubiquiti | Bartez Tecnología",
    metaDescription:
      "Switches core Cisco Catalyst y Aruba, WiFi empresarial, firewalls y cableado estructurado con relevamiento, implementación e instaladores partners.",
    keywords: ["switches Cisco Catalyst", "switches Aruba", "WiFi empresarial", "firewall corporativo", "cableado estructurado Rosario"],
    bullets: [
      { title: "Switches core administrables", desc: "Cisco Catalyst y Aruba para reemplazo de infraestructura de datacenter y networking de planta." },
      { title: "WiFi empresarial", desc: "Access points Cisco, Aruba o Ubiquiti según densidad, cobertura y presupuesto. Para escenarios multi-sede, ver WiFi multi-sede UniFi." },
      { title: "Relevamiento técnico", desc: "Antes de cotizar: planta, cantidad de usuarios, VLANs, backup de configuración del equipamiento existente y contingencia." },
      { title: "Cableado estructurado", desc: "Tendido, certificación y organización del cableado; para racks, bandejas y accesorios ver Cableado y racks." },
      { title: "Seguridad perimetral", desc: "Firewalls corporativos para segmentación, VPN de acceso remoto y control de aplicaciones." },
      { title: "Implementación con instaladores", desc: "Nuestro equipo técnico coordina el proyecto y trabaja con instaladores partners para el despliegue físico." },
    ],
    capabilities: [
      { icon: "DraftingCompass", title: "Diseño y relevamiento", desc: "Topología, equipos, cobertura WiFi, backup de config y equipamiento de contingencia." },
      { icon: "Wrench", title: "Instalación y cableado", desc: "Montaje de racks y cableado a cargo de instaladores partners bajo nuestra coordinación técnica." },
      { icon: "ShieldCheck", title: "Seguridad de red", desc: "Firewalls, VLANs y políticas de acceso para segmentar la red." },
      { icon: "Headset", title: "Soporte gestionado", desc: "Monitoreo y soporte para que la red no se caiga." },
    ],
    faqs: [
      { q: "¿Trabajan Cisco, Aruba y Ubiquiti?", a: "Sí. Cisco Catalyst y Aruba para core administrable y proyectos corporativos; Ubiquiti UniFi para escenarios multi-sede y presupuesto acotado. Recomendamos según densidad, cobertura y criticidad." },
      { q: "¿Hacen el relevamiento antes de cotizar?", a: "Sí. Relevamos planta, cantidad de usuarios, VLANs actuales, el equipamiento existente y las necesidades de contingencia antes de armar la propuesta." },
      { q: "¿Quién hace la instalación física?", a: "Nuestro equipo técnico diseña, provee y coordina el proyecto. Para el despliegue físico (cableado, montaje, patcheo) trabajamos con instaladores partners bajo nuestra coordinación cuando el proyecto lo requiere." },
      { q: "¿Incluye cableado estructurado?", a: "Sí. Ofrecemos tendido, certificación y organización del cableado, además de los equipos activos. Para racks, bandejas y accesorios de infraestructura tenemos una página dedicada." },
      { q: "¿Dan soporte después de instalar?", a: "Sí, ofrecemos planes de soporte y monitoreo para mantener la red estable." },
    ],
    related: ["wifi-multisede", "servidores", "cableado-racks"],
  },
  {
    slug: "wifi-multisede",
    navLabel: "WiFi multi-sede (UniFi)",
    icon: "Wifi",
    image: "/photos/products/switch.jpg",
    eyebrow: "WiFi empresarial multi-sede",
    h1: "WiFi multi-sede con Ubiquiti UniFi, relevado y coordinado por nuestro equipo.",
    intro:
      "Proyectos de conectividad WiFi empresarial en varias sedes, con Ubiquiti UniFi como plataforma central: relevamiento de sitio, equipamiento de contingencia y backup, y coordinación con instaladores partners para el despliegue físico en cada punto.",
    metaTitle: "WiFi multi-sede empresarial con UniFi | Bartez Tecnología",
    metaDescription:
      "Proyectos WiFi multi-sede con Ubiquiti UniFi: relevamiento, equipamiento de contingencia y despliegue con instaladores partners en toda Argentina.",
    keywords: ["WiFi multi-sede", "UniFi empresas", "Ubiquiti UniFi Argentina", "WiFi empresarial multi-sede", "access points UniFi"],
    bullets: [
      { title: "Plataforma UniFi centralizada", desc: "UniFi Controller administra todos los access points de todas las sedes desde un solo panel." },
      { title: "Relevamiento por sede", desc: "Planta, materiales, densidad esperada y ubicación de APs previo a cotizar." },
      { title: "Equipos de contingencia", desc: "Cotizamos APs y switches de backup para que un fallo de hardware no baje un sitio." },
      { title: "Instaladores partners", desc: "Coordinamos con instaladores partners para el despliegue físico (cableado, montaje, patcheo) en cada sede." },
      { title: "Cobertura nacional", desc: "Coordinamos proyectos con sedes en varias provincias desde Rosario." },
      { title: "Complementario a Cisco/Aruba", desc: "UniFi cubre el caso multi-sede y presupuesto acotado; para networking core corporativo ver Redes e infraestructura." },
    ],
    capabilities: [
      { icon: "DraftingCompass", title: "Relevamiento y diseño", desc: "Site survey por sede, densidad, ubicación de APs y esquema de VLANs." },
      { icon: "Wifi", title: "Provisión UniFi", desc: "Access points, switches PoE, gateways y controlador administrado." },
      { icon: "Wrench", title: "Coordinación de despliegue", desc: "Instaladores partners bajo nuestra dirección técnica en cada sede." },
      { icon: "Headset", title: "Soporte central", desc: "Un solo panel para monitorear todas las sedes; soporte remoto ante incidentes." },
    ],
    faqs: [
      { q: "¿Por qué UniFi para multi-sede?", a: "UniFi ofrece un controlador central que administra todos los APs y switches de todas las sedes desde un mismo panel, con un costo por punto muy competitivo. Es ideal para cadenas comerciales, sucursales bancarias, salud, educación y logística." },
      { q: "¿Coordinan la instalación en cada sede?", a: "Sí. Nuestro equipo técnico coordina el proyecto y trabaja con instaladores partners locales para el despliegue físico (cableado, montaje de APs, patcheo) en cada sede, incluyendo sedes en otras provincias." },
      { q: "¿Incluyen equipos de contingencia?", a: "Recomendamos y cotizamos APs y switches de backup para que un fallo de hardware no deje un sitio sin servicio. Lo definimos según criticidad de cada sede." },
      { q: "¿UniFi reemplaza a Cisco o Aruba?", a: "No siempre. UniFi es excelente para escenarios multi-sede, presupuesto acotado y densidad media. Para core administrable, tráfico alto o exigencias regulatorias específicas, Cisco Catalyst o Aruba son la opción correcta. Lo evaluamos caso por caso." },
    ],
    related: ["redes-infraestructura", "cableado-racks"],
  },
  {
    slug: "videovigilancia-cctv",
    navLabel: "Videovigilancia / CCTV",
    icon: "Cctv",
    image: "/photos/cctv.jpg",
    eyebrow: "Videovigilancia y CCTV",
    h1: "CCTV IP para empresas, espacios recreativos y predios exteriores.",
    intro:
      "Sistemas de cámaras IP con NVR, discos CCTV específicos (WD Purple / Seagate SkyHawk), cableado exterior y asesoramiento técnico sobre el tipo de cámara correcto para cada caso: direccional, panorámica multi-sensor o fisheye 360°.",
    metaTitle: "Cámaras IP, NVR y CCTV para empresas y predios | Bartez Tecnología",
    metaDescription:
      "CCTV IP con cámaras direccionales, panorámicas y 360°, NVR, discos CCTV WD Purple / SkyHawk y cableado exterior para empresas y espacios recreativos.",
    keywords: ["cámaras IP empresas", "CCTV corporativo", "cámaras 360 espacios deportivos", "NVR mayorista Rosario", "WD Purple CCTV"],
    bullets: [
      { title: "Cámara correcta por caso", desc: "Bala direccional para perímetros y accesos; domo antivandálico para interior; PTZ para grandes predios; multi-sensor panorámica y fisheye 360° para espacios recreativos y depósitos." },
      { title: "NVR dimensionado", desc: "Elegimos NVR con canales, PoE y ancho de banda suficientes para la resolución, framerate y días de retención que necesitás." },
      { title: "Discos CCTV específicos", desc: "WD Purple y Seagate SkyHawk están diseñados para escritura continua 24×7 de video. No usamos discos de escritorio en NVR." },
      { title: "Cableado exterior", desc: "Cable UTP exterior con protección UV, gel o dieléctrico según tendido; cajas estancas, protecciones y grounding para instalaciones a la intemperie." },
      { title: "Marcas operadas", desc: "Trabajamos regularmente con Hikvision, Dahua y Ubiquiti Protect según caso de uso, presupuesto y necesidad de integración." },
      { title: "Instaladores partners", desc: "Coordinamos la instalación con partners para el tendido exterior, montaje en altura y patcheo cuando el proyecto lo requiere." },
    ],
    capabilities: [
      { icon: "DraftingCompass", title: "Proyecto a medida", desc: "Relevamos plano, puntos ciegos, tipo de cámara por zona y días de retención requeridos." },
      { icon: "Wrench", title: "Instalación coordinada", desc: "Montaje, cableado exterior y configuración a cargo de instaladores partners bajo nuestra dirección técnica." },
      { icon: "Cloud", title: "Acceso remoto", desc: "Configuramos el monitoreo desde app en celular o PC, con usuarios por rol." },
      { icon: "Headset", title: "Mantenimiento", desc: "Soporte y mantenimiento preventivo del NVR, discos y cámaras." },
    ],
    faqs: [
      { q: "¿Qué cámara conviene para un predio deportivo o recreativo?", a: "Depende del ángulo a cubrir. Para canchas y patios grandes usamos cámaras multi-sensor panorámicas o fisheye 360° montadas en altura, que cubren un área amplia con una sola bajada. Para accesos y perímetros combinamos bala direccional. Lo relevamos en sitio antes de cotizar." },
      { q: "¿Por qué discos WD Purple o Seagate SkyHawk y no un disco común?", a: "Un NVR escribe video las 24 horas del día durante años. Los discos de escritorio no están diseñados para ese régimen: fallan antes y pueden perder video. WD Purple y Seagate SkyHawk tienen firmware optimizado para escritura continua y vibración de múltiples discos en el mismo NVR." },
      { q: "¿Trabajan con Hikvision, Dahua o Ubiquiti?", a: "Sí. Cotizamos regularmente Hikvision y Dahua para CCTV IP tradicional (excelente relación resolución / precio) y Ubiquiti Protect cuando el cliente ya opera con ecosistema UniFi." },
      { q: "¿Hacen la instalación exterior?", a: "Coordinamos con instaladores partners para el tendido de cable UTP exterior, montaje en altura, cajas estancas y patcheo. Nuestro equipo dirige el proyecto y valida la puesta a punto." },
      { q: "¿Cuántos días de grabación se pueden guardar?", a: "Depende de cantidad de cámaras, resolución, FPS y días de retención requeridos. Lo dimensionamos con vos y elegimos NVR y discos acordes." },
    ],
    related: ["cableado-racks", "redes-infraestructura", "servidores"],
  },
  {
    slug: "workstations-pcs",
    navLabel: "PCs de escritorio y flota",
    icon: "MonitorSmartphone",
    image: "/photos/products/desktop.jpg",
    eyebrow: "PCs de escritorio corporativas",
    h1: "PCs de escritorio y flota corporativa para oficinas y planta.",
    intro:
      "PCs de escritorio de marca (Lenovo ThinkCentre, HP ProDesk, Dell OptiPlex) o armadas con componentes de primeras marcas para renovación de puestos administrativos, atención al cliente, producción y aulas. Para estaciones de alta gama con GPU y RAM ECC, ver Workstations alta gama.",
    metaTitle: "PCs de escritorio corporativas y flota | Bartez Tecnología",
    metaDescription:
      "PCs de escritorio Lenovo ThinkCentre, HP ProDesk y Dell OptiPlex o armadas con componentes de marca para flota corporativa.",
    keywords: ["PC corporativa mayorista", "ThinkCentre empresas", "HP ProDesk", "Dell OptiPlex", "PC flota oficina"],
    bullets: [
      { title: "Gama de marca", desc: "Lenovo ThinkCentre, HP ProDesk / EliteDesk y Dell OptiPlex para uso administrativo sostenido." },
      { title: "PC armada corporativa", desc: "Alternativa con componentes de primeras marcas cuando el presupuesto o el uso específico lo justifican." },
      { title: "Windows 11 Pro", desc: "Compras corporativas siempre con Windows 11 Pro para dominio, BitLocker y administración." },
      { title: "Compra por lote", desc: "Cotizamos lotes uniformes para renovación de oficinas, planta o aulas." },
      { title: "Comparación multi-marca", desc: "Lenovo, HP y Dell en configuraciones equivalentes para que elijas con datos." },
      { title: "Escalable", desc: "Equipos que se pueden ampliar (RAM, disco) a futuro sin reemplazar todo." },
    ],
    capabilities: [
      { icon: "DraftingCompass", title: "Perfilado", desc: "Definimos configuración según tarea, presupuesto y ciclo de vida esperado." },
      { icon: "Wrench", title: "Preparación", desc: "Imagen corporativa, software base y dominio; opcional etiquetado de inventario." },
      { icon: "ShieldCheck", title: "Garantía", desc: "Gestión de garantía y posventa con el fabricante." },
      { icon: "Headset", title: "Soporte", desc: "Acompañamiento ante inconvenientes durante la vida útil del equipo." },
    ],
    faqs: [
      { q: "¿Marca o armada?", a: "Depende. Para flota administrativa sostenida y compras grandes, PCs de marca (ThinkCentre, ProDesk, OptiPlex) simplifican la garantía y la administración. Para puestos específicos con requerimientos particulares, la PC armada puede ser mejor. Te asesoramos según el escenario." },
      { q: "¿Vienen con Windows 11 Pro?", a: "Sí, en compras corporativas siempre cotizamos con Windows 11 Pro." },
      { q: "¿Cotizan lotes uniformes?", a: "Sí. Es habitual cotizar lotes de 10, 20 o más PCs con la misma configuración para renovación de oficinas o aulas." },
      { q: "¿Necesito una workstation en lugar de una PC?", a: "Si trabajás con GIS, fotogrametría, CAD, render, IA/GPU o virtualización local, probablemente sí. Tenemos una página dedicada a workstations alta gama con Xeon/Threadripper, RAM ECC y GPU profesional." },
    ],
    related: ["workstations-alta-gama", "notebooks-corporativas", "perifericos-corporativos"],
  },
  {
    slug: "workstations-alta-gama",
    navLabel: "Workstations alta gama",
    icon: "Cpu",
    image: "/photos/products/desktop.jpg",
    eyebrow: "Workstations CTO/BTO alta gama",
    h1: "Workstations CTO/BTO para GIS, fotogrametría, render, cálculo y GPU.",
    intro:
      "Configuramos estaciones de trabajo de alta gama a medida (CTO/BTO) con procesadores Xeon o Threadripper Pro, memoria ECC hasta 512 GB, GPU profesional (NVIDIA RTX, RTX Ada, Radeon Pro) y storage NVMe. Comparamos Dell Precision, HP ZBook / Z Workstation y Lenovo ThinkStation en configuraciones equivalentes.",
    metaTitle: "Workstations alta gama Dell Precision, HP Z, Lenovo ThinkStation | Bartez",
    metaDescription:
      "Workstations CTO/BTO Dell Precision, HP Z y Lenovo ThinkStation con Xeon/Threadripper, GPU profesional y hasta 512 GB ECC para GIS, render y cálculo.",
    keywords: ["Dell Precision Argentina", "HP ZBook workstation", "Lenovo ThinkStation", "workstation GIS fotogrametría", "workstation GPU render"],
    bullets: [
      { title: "Configuración CTO/BTO", desc: "Configuración a medida (Configure-To-Order / Build-To-Order) con el fabricante — no un equipo estándar de vidriera." },
      { title: "Xeon o Threadripper Pro", desc: "Procesadores de estación de trabajo con más núcleos y líneas PCIe para GPU y NVMe simultáneos." },
      { title: "Hasta 512 GB ECC", desc: "Memoria con corrección de errores necesaria para GIS, fotogrametría, simulación y virtualización local pesada." },
      { title: "GPU profesional", desc: "NVIDIA RTX / RTX Ada Generation y AMD Radeon Pro certificadas por ISV (Autodesk, Bentley, ESRI, Adobe)." },
      { title: "Comparación multi-marca", desc: "Cotizamos Dell Precision, HP Z / ZBook y Lenovo ThinkStation en configuraciones equivalentes." },
      { title: "Casos de uso", desc: "GIS y fotogrametría, procesamiento con GPU dedicada, render 3D, edición 8K, simulación CAD/CFD, IA local." },
    ],
    capabilities: [
      { icon: "DraftingCompass", title: "Sizing por software", desc: "Definimos CPU, RAM y GPU según el software específico (Pix4D, Metashape, ArcGIS Pro, Revit, Blender, ANSYS, etc.)." },
      { icon: "Cpu", title: "Configuración CTO", desc: "Pedimos al fabricante el equipo con la config exacta que necesitás — no adaptamos un modelo estándar." },
      { icon: "ShieldCheck", title: "Garantía de estación", desc: "Cobertura ProSupport / Care Pack del fabricante con niveles de servicio corporativos." },
      { icon: "Headset", title: "Soporte técnico", desc: "Acompañamiento ante incidentes de hardware y coordinación con el fabricante." },
    ],
    faqs: [
      { q: "¿Configuran estaciones para GIS y fotogrametría?", a: "Sí. Es un caso frecuente: workstations con 128 GB o más de RAM ECC, procesador de muchos núcleos y GPU profesional para Pix4D, Agisoft Metashape, ArcGIS Pro o similar. Definimos la configuración con vos según el software y los volúmenes de datos." },
      { q: "¿Qué diferencia hay con una PC gamer potente?", a: "Una workstation tiene RAM ECC (crítica para cálculos largos), GPU certificada por ISV (drivers estables para software profesional), chasis pensado para carga sostenida y opciones de garantía on-site. Una PC gamer no está diseñada para 8 horas de simulación diaria." },
      { q: "¿Comparan Dell Precision, HP Z y Lenovo ThinkStation?", a: "Sí. Es habitual que armemos las tres marcas en configuraciones equivalentes para que puedas comparar precio, plazo de entrega y detalles técnicos antes de decidir." },
      { q: "¿Cuánto tarda una configuración CTO?", a: "El plazo depende del fabricante y la disponibilidad de los componentes específicos. Confirmamos el plazo al cotizar y lo garantizamos por escrito antes de emitir la orden." },
    ],
    related: ["notebooks-corporativas", "workstations-pcs", "servidores"],
  },
  {
    slug: "cableado-racks",
    navLabel: "Cableado y racks",
    icon: "Cable",
    image: "/photos/products/switch.jpg",
    eyebrow: "Infraestructura pasiva",
    h1: "Racks, bandejas y cableado estructurado para tu datacenter u oficina.",
    intro:
      "Racks abiertos y cerrados, bandejas, patch panels, organizadores, cableado UTP / FTP / fibra óptica, patch cords, canalizaciones y accesorios de montaje. Lo cotizamos junto al proyecto activo o como suministro independiente.",
    metaTitle: "Racks, bandejas y cableado estructurado | Bartez Tecnología",
    metaDescription:
      "Racks, bandejas, patch panels, cableado UTP y fibra óptica para datacenter y oficinas, con instaladores partners para el tendido.",
    keywords: ["racks datacenter Argentina", "cableado estructurado empresas", "bandejas de rack", "patch panel", "fibra óptica corporativa"],
    bullets: [
      { title: "Racks abiertos y cerrados", desc: "Racks de piso y de pared en distintas alturas (12U, 24U, 42U) con puertas, ventilación y llave." },
      { title: "Organización interna", desc: "Bandejas fijas y rebatibles, organizadores de cable horizontales y verticales, PDUs y regletas." },
      { title: "Patch panels y patch cords", desc: "Patch panels Cat 6 y Cat 6A, patch cords en distintos largos y colores para organizar el rack." },
      { title: "Cableado estructurado", desc: "UTP Cat 6 y Cat 6A, FTP para ambientes con interferencia, fibra óptica multimodo y monomodo con conectores LC/SC." },
      { title: "Canalizaciones y accesorios", desc: "Bandejas portacables, cañerías, cajas, conectores keystone, herrajes y accesorios de montaje." },
      { title: "Instaladores partners", desc: "Podemos coordinar el tendido, el patcheo y la certificación con instaladores partners." },
    ],
    capabilities: [
      { icon: "DraftingCompass", title: "Lista de materiales", desc: "Armamos el BOM completo del cableado y accesorios de tu proyecto." },
      { icon: "Boxes", title: "Suministro por lote", desc: "Podemos entregar todos los materiales de una obra en una sola compra con factura A." },
      { icon: "Wrench", title: "Coordinación de tendido", desc: "Instaladores partners bajo nuestra dirección técnica cuando el cliente lo requiere." },
      { icon: "ShieldCheck", title: "Certificación", desc: "Coordinamos la certificación del cableado por parte del instalador para que quede documentada." },
    ],
    faqs: [
      { q: "¿Venden solo los materiales o incluyen instalación?", a: "Las dos formas. Podés comprar solo los materiales (rack, cable, patch cords, bandejas) o pedir que coordinemos también el tendido y la certificación con instaladores partners." },
      { q: "¿Cotizan racks de 42U con PDU y organizadores?", a: "Sí. Es habitual que armemos el kit completo del rack: rack, PDU, organizadores horizontales y verticales, bandejas y patch panels, listo para instalar." },
      { q: "¿Fibra óptica también?", a: "Sí. Cableado de fibra multimodo OM3/OM4 y monomodo, patch cords LC/SC, cajas de fusión, bandejas ópticas y transceivers cuando corresponde." },
      { q: "¿Entregan al interior del país?", a: "Sí, cobertura nacional. Los racks se coordinan por logística según tamaño y peso." },
    ],
    related: ["redes-infraestructura", "servidores", "wifi-multisede"],
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
      { title: "Garantía", desc: "Condiciones según cada producto y acompañamiento en cambios." },
      { title: "Continuidad y reposición", desc: "Reposición continua de los accesorios de uso diario." },
    ],
    capabilities: [
      { icon: "DraftingCompass", title: "Armado del puesto", desc: "Definimos el kit de accesorios ideal por tipo de puesto." },
      { icon: "Boxes", title: "Provisión por volumen", desc: "Abastecemos cantidades grandes con la misma agilidad." },
      { icon: "ShieldCheck", title: "Garantía y cambios", desc: "Acompañamiento en la gestión de garantías y reposiciones." },
      { icon: "Headset", title: "Asesoramiento", desc: "Te recomendamos el accesorio correcto para cada necesidad." },
    ],
    faqs: [
      { q: "¿Venden accesorios por volumen?", a: "Sí, equipamos puestos completos y abastecemos cantidades grandes con criterio técnico y comercial." },
      { q: "¿Qué incluye un puesto de trabajo?", a: "Habitualmente monitor, teclado, mouse, dock y headset; armamos el kit según tu necesidad." },
      { q: "¿Los accesorios tienen garantía?", a: "Las condiciones dependen del producto y fabricante. Te informamos el alcance antes de la compra y acompañamos la gestión." },
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
      { p: "Verificá las condiciones de garantía de cada equipo y que tu proveedor acompañe la posventa. Un equipo parado sin seguimiento cuesta más que una diferencia inicial de precio." },
      { h: "4. Financiación y logística" },
      { p: "Renovar todo de una vez impacta el flujo de caja. Buscá condiciones B2B, cuenta corriente y una única Factura A. Y coordiná la entrega para no frenar la operación." },
      { h: "Planificá tu recambio con Bartez" },
      { p: "Relevamos cantidad, perfiles de uso y sedes para definir un plan de renovación y distribución." },
    ],
  },
  {
    slug: "redes-para-empresas-guia-completa",
    title: "Redes para empresas: guía completa para elegir bien",
    excerpt: "Switches, routers, WiFi 6 y firewall: qué necesita realmente tu empresa según su tamaño y operación.",
    date: "2026-06-08",
    readingTime: "6 min",
    cover: "/photos/products/switch.jpg",
    metaDescription:
      "Guía completa de redes para empresas: cómo elegir switches Cisco, routers, firewall y WiFi 6 según el tamaño y las necesidades de tu operación.",
    body: [
      { p: "La red es la columna vertebral de cualquier empresa moderna. Sin embargo, muchas organizaciones la descuidan hasta que el problema aparece: caídas, lentitud, brechas de seguridad." },
      { h: "1. Primero: levantá el mapa de usuarios y zonas" },
      { p: "Antes de comprar un switch, contá cuántos puestos necesitás conectar, si tenés zonas separadas (planta de producción, administración, dirección) y qué aplicaciones son críticas." },
      { h: "2. Switch administrable vs. no administrable" },
      { p: "Para empresas de más de 10 puestos, los switches administrables (como la línea Cisco Catalyst) permiten segmentar la red en VLANs, priorizar tráfico y monitorear todo desde un punto central. Los no administrables son más económicos pero te dejan sin control." },
      { h: "3. WiFi 6 para entornos de alta densidad" },
      { p: "Si tenés muchos dispositivos conectados por WiFi (celulares, notebooks, tablets, impresoras), el estándar WiFi 6 (802.11ax) reduce la latencia y mejora el rendimiento en entornos concurridos. Los access points Cisco Meraki o Catalyst son ideales para empresas." },
      { h: "4. Firewall: no es opcional" },
      { p: "Un firewall bien configurado es la diferencia entre una empresa protegida y una vulnerable. Los Cisco Firepower permiten inspección profunda de paquetes, control de aplicaciones y VPN para trabajo remoto." },
      { h: "¿Necesitás diseñar la red de tu empresa?" },
      { p: "En Bartez relevamos el plano, la cantidad de usuarios y las aplicaciones críticas para proponer una arquitectura de red completa. Escribinos." },
    ],
  },
  {
    slug: "setup-gamer-profesional-guia",
    title: "Setup gamer profesional: cómo armarlo sin desperdiciar presupuesto",
    excerpt: "Monitor, PC, periféricos y conectividad: cómo elegir cada componente según tu nivel de juego y presupuesto real.",
    date: "2026-06-05",
    readingTime: "5 min",
    cover: "/photos/products/laptop1.jpg",
    metaDescription:
      "Guía para armar un setup gamer profesional: cómo elegir procesador, GPU, monitor y periféricos sin gastar de más. Recomendaciones por presupuesto.",
    body: [
      { p: "Armar un buen setup gamer no significa comprar lo más caro. Significa elegir bien en cada componente para que el conjunto rinda al máximo dentro del presupuesto disponible." },
      { h: "1. Procesador: AMD Ryzen o Intel Core" },
      { p: "Para gaming competitivo, los procesadores Ryzen 5 7600X e Intel Core i5-13600K ofrecen el mejor rendimiento por precio. Si también hacés streaming o edición, subí a Ryzen 7 o i7 para no perder frames mientras grabás." },
      { h: "2. GPU: el componente más importante" },
      { p: "La GPU determina los FPS que vas a lograr. Para 1080p competitivo (144+ Hz), una RTX 4060 o RX 7600 es suficiente. Para 1440p o resoluciones altas, RTX 4070 o RX 7800 XT son la referencia hoy." },
      { h: "3. Monitor: resolución y frecuencia de refresco" },
      { p: "Para shooters y juegos competitivos, priorizá frecuencia de refresco (144 Hz mínimo, 240 Hz ideal) sobre resolución. Para juegos de estrategia o RPG, 1440p con 144 Hz es el punto ideal." },
      { h: "4. Periféricos: no subestimés el mouse y el teclado" },
      { p: "Un buen mouse con sensor óptico de alta precisión y un teclado mecánico hacen diferencia real en la respuesta del input. No son accesorios: son herramientas." },
      { h: "Armalo con asesoramiento" },
      { p: "En Bartez armamos PCs a medida y asesoramos setup completo por presupuesto. Contanos qué juegos jugás y cuánto querés invertir." },
    ],
  },
  {
    slug: "workstations-vs-pc-para-empresas",
    title: "Workstation vs. PC: ¿cuál conviene para tu equipo?",
    excerpt: "La diferencia real entre una workstation y una PC de escritorio para diseño, ingeniería, edición y desarrollo.",
    date: "2026-06-01",
    readingTime: "4 min",
    cover: "/photos/products/desktop.jpg",
    metaDescription:
      "Workstation vs. PC corporativa: qué conviene elegir según el tipo de trabajo. Diferencias en CPU, GPU, RAM ECC y confiabilidad para diseño, CAD, edición e ingeniería.",
    body: [
      { p: "Muchas empresas compran PCs de escritorio para roles que necesitan workstations. El resultado: equipos lentos, procesos largos y frustraciones que se evitaban fácilmente." },
      { h: "¿Cuándo usar una PC de escritorio?" },
      { p: "Para administración, atención al cliente, ofimática y navegación web, una PC de escritorio con procesador de gama media y 16 GB de RAM es más que suficiente y significativamente más barata." },
      { h: "¿Cuándo la workstation marca la diferencia?" },
      { p: "Diseño 3D, renderizado, CAD, edición de video en resoluciones altas, simulaciones científicas o desarrollo con compilaciones pesadas requieren lo que solo una workstation ofrece: procesadores Xeon, RAM ECC, GPUs certificadas (NVIDIA Quadro / AMD Radeon Pro) y mayor fiabilidad bajo carga sostenida." },
      { h: "El costo oculto de equipar mal" },
      { p: "Un diseñador que espera 40 minutos para un render que en una workstation tarda 8 pierde más de 30 minutos de productividad por tarea. En un mes, el ahorro de la workstation supera su sobrecosto." },
      { h: "Opciones que distribuimos" },
      { p: "Distribuimos las líneas Dell Precision, HP ZBook y Lenovo ThinkStation. Relevamos el software que usás y la carga de trabajo para recomendar la configuración exacta." },
    ],
  },
  {
    slug: "seguridad-informatica-para-pymes",
    title: "Seguridad informática para PyMEs: por dónde empezar",
    excerpt: "Firewall, backup, contraseñas y actualizaciones: las capas de protección esenciales que ninguna empresa debería ignorar.",
    date: "2026-05-28",
    readingTime: "5 min",
    cover: "/photos/products/router.jpg",
    metaDescription:
      "Guía de ciberseguridad para PyMEs argentinas: cómo implementar firewall, backup, segmentación de red y políticas de contraseñas sin gastar de más.",
    body: [
      { p: "Las PyMEs son el objetivo favorito del ransomware y los ataques de phishing. No porque sean interesantes, sino porque tienen información valiosa y protecciones débiles." },
      { h: "1. Firewall: la primera línea" },
      { p: "Un firewall bien configurado controla qué entra y qué sale de tu red. Los Cisco Firepower permiten inspección de tráfico, bloqueo de sitios peligrosos y VPN para trabajo remoto seguro." },
      { h: "2. Backup: la red de seguridad" },
      { p: "La regla 3-2-1: 3 copias, en 2 medios distintos, con 1 copia offsite o en la nube. Sin backup probado, no hay seguridad." },
      { h: "3. Actualizaciones: el parche más barato" },
      { p: "El 90% de los ataques exitosos explotan vulnerabilidades conocidas y con parche disponible. Actualizar el sistema operativo y las aplicaciones es la medida de seguridad más costo-efectiva que existe." },
      { h: "4. Segmentación de red" },
      { p: "Separar la red de administración, la red de producción y la WiFi de invitados limita el daño si un dispositivo se compromete. Un atacante que llega a la impresora no debería poder ver el servidor de contabilidad." },
      { h: "Evaluá la seguridad de tu empresa" },
      { p: "En Bartez ayudamos a las empresas a identificar sus brechas de seguridad y proponer soluciones concretas. Consultanos." },
    ],
  },
  {
    slug: "videovigilancia-ip-para-empresas",
    title: "Videovigilancia IP para empresas: cómo elegir el sistema correcto",
    excerpt: "Cámaras IP, NVR, almacenamiento y resolución: todo lo que necesitás saber antes de instalar un sistema CCTV empresarial.",
    date: "2026-05-20",
    readingTime: "4 min",
    cover: "/photos/products/server.jpg",
    metaDescription:
      "Guía de videovigilancia IP para empresas: cómo elegir cámaras IP, NVR, almacenamiento y resolución para proteger tus instalaciones de forma profesional.",
    body: [
      { p: "Un sistema de videovigilancia mal dimensionado crea una falsa sensación de seguridad. Demasiadas cámaras sin resolución suficiente, o mucha resolución sin almacenamiento adecuado, son inversiones perdidas." },
      { h: "1. Resolución: Full HD como mínimo" },
      { p: "Las cámaras de 2 MP (1080p) son el estándar básico hoy. Para zonas que requieren identificación facial o de matrículas, optá por 4 MP o 4K con lente adecuada." },
      { h: "2. Tipos de cámara por zona" },
      { p: "Domo: interior, antivandálica. Bala: exterior, largo alcance. PTZ: para zonas amplias con control de movimiento remoto. Fisheye: una sola cámara que cubre 360° en espacios reducidos." },
      { h: "3. Almacenamiento: cuánto necesitás" },
      { p: "Depende de la cantidad de cámaras, resolución, frames por segundo y días de retención. Para 8 cámaras Full HD a 15 FPS con 30 días de retención, necesitás entre 4 y 6 TB." },
      { h: "4. NVR vs. DVR" },
      { p: "Si instalás cámaras IP (lo recomendado hoy), el grabador es NVR. Los DVR son para cámaras analógicas viejas. Si vas a renovar, instalá directo IP." },
      { h: "Diseñá tu sistema con Bartez" },
      { p: "Relevamos las instalaciones, los puntos ciegos y los requisitos de retención para proponer el sistema correcto. Incluye instalación y configuración." },
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
      { h: "1. Responsable del tratamiento", p: "Bartez Tecnología es un nombre comercial de Benítez, Andrés (Responsable Inscripto, CUIT 20-21774424-6), con domicilio en 9 de Julio 3418, Rosario, Santa Fe, Argentina. Benítez, Andrés es responsable del tratamiento de los datos recolectados en este sitio. Ante cualquier consulta podés escribirnos a ventas@bartez.com.ar." },
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
      { h: "1. Titular del sitio", p: "El sitio web bartez.com.ar es operado bajo el nombre comercial 'Bartez Tecnología' por Benítez, Andrés (Responsable Inscripto, CUIT 20-21774424-6), con domicilio fiscal en 9 de Julio 3418, Rosario, Santa Fe, Argentina. Toda referencia a 'Bartez', 'Bartez Tecnología' o 'nosotros' en estos términos se refiere a Benítez, Andrés." },
      { h: "2. Objeto del sitio", p: "Este sitio presenta las capacidades, servicios y áreas de trabajo de Bartez Tecnología. No es una tienda online ni publica ofertas vinculantes." },
      { h: "3. Propuestas comerciales", p: "Las propuestas se preparan a pedido y sus condiciones se informan en cada documento comercial. Ninguna información del sitio constituye una oferta vinculante." },
      { h: "4. Uso permitido", p: "Podés usar este sitio con fines informativos y para contactarnos. No está permitido utilizarlo para fines ilícitos, ni intentar dañar, sobrecargar o vulnerar la seguridad del sitio o de sus sistemas." },
      { h: "5. Propiedad intelectual", p: "Los contenidos, marcas, logos y diseños del sitio pertenecen a Benítez, Andrés (Bartez Tecnología) o a sus respectivos titulares. Las marcas de los fabricantes (Dell, Lenovo, HP, Cisco, etc.) pertenecen a sus dueños y se muestran a título informativo de los productos que distribuimos." },
      { h: "6. Limitación de responsabilidad", p: "Procuramos que la información del sitio sea correcta y esté actualizada, pero no garantizamos que esté libre de errores. Bartez no será responsable por daños derivados del uso del sitio o de la imposibilidad de acceder a él." },
      { h: "7. Enlaces y servicios de terceros", p: "El sitio puede integrar servicios de terceros (mapas, formularios, analítica). El uso de esos servicios se rige por sus propias condiciones y políticas." },
      { h: "8. Ley aplicable y jurisdicción", p: "Estos términos se rigen por las leyes de la República Argentina. Ante cualquier controversia, las partes se someten a los tribunales ordinarios de la ciudad de Rosario, Santa Fe." },
      { h: "9. Contacto", p: "Por cualquier consulta sobre estos términos, escribinos a ventas@bartez.com.ar." },
    ],
  },
];
