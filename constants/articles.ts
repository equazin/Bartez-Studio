// Blog / Recursos (SEO) — /recursos y /recursos/[slug].
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
