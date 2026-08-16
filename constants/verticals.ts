// Verticals de /soluciones/[slug] — landings SEO por familia de solución (Google, AEO).
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

