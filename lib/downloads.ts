/**
 * Guías descargables B2B: contenido técnico consultivo que reduce fricción
 * de compra y posiciona a Bartez como asesor, no solo como proveedor.
 *
 * Cada guía se renderiza como página HTML print-ready. El usuario descarga
 * el PDF con Ctrl+P → "Guardar como PDF" — sin dependencias de generación
 * server-side y con la ventaja de que el contenido queda indexable en SEO.
 */
import type { LucideIcon } from "lucide-react";
import { Cctv, ClipboardList, Server, ServerCog, Wifi } from "lucide-react";

export type DownloadBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "note"; text: string }
  | {
      type: "table";
      headers: string[];
      rows: string[][];
      caption?: string;
    };

export type DownloadSection = {
  heading: string;
  blocks: DownloadBlock[];
};

export type DownloadGuide = {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  icon: LucideIcon;
  description: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  sections: DownloadSection[];
};

export const downloadGuides: DownloadGuide[] = [
  {
    slug: "servidores-lenovo-hpe-dell",
    title: "Comparativa Servidores rack: Lenovo, HPE y Dell",
    subtitle: "Configuraciones equivalentes para virtualización empresarial",
    category: "Servidores y virtualización",
    icon: Server,
    description:
      "Matriz técnica y comercial para elegir entre Lenovo ThinkSystem, HPE ProLiant y Dell PowerEdge en una misma clase de servidor rack de virtualización.",
    metaTitle: "Comparativa Servidores Lenovo, HPE, Dell | Bartez Tecnología",
    metaDescription:
      "Matriz comparativa de servidores rack Lenovo ThinkSystem, HPE ProLiant y Dell PowerEdge en configuraciones equivalentes para virtualización.",
    keywords: ["comparativa servidores Lenovo HPE Dell", "ThinkSystem vs ProLiant vs PowerEdge", "servidor rack virtualización"],
    sections: [
      {
        heading: "1. Alcance de la comparación",
        blocks: [
          {
            type: "paragraph",
            text: "Servidor rack 2U de gama mid-range para virtualización sobre Proxmox VE, VMware o Hyper-V con 20-40 VMs medianas. Configuraciones equivalentes entre Lenovo ThinkSystem SR650 V3, HPE ProLiant DL380 Gen11 y Dell PowerEdge R760.",
          },
          {
            type: "note",
            text: "El objetivo es que la elección se resuelva por precio, plazo, preferencia técnica o servicio de posventa — no por default del proveedor.",
          },
        ],
      },
      {
        heading: "2. Matriz técnica equivalente",
        blocks: [
          {
            type: "table",
            headers: ["Componente", "Lenovo SR650 V3", "HPE DL380 Gen11", "Dell R760"],
            rows: [
              ["CPU", "2× Intel Xeon Silver 4514Y (16C)", "2× Intel Xeon Silver 4514Y (16C)", "2× Intel Xeon Silver 4514Y (16C)"],
              ["Memoria", "8× 32 GB DDR5 ECC (256 GB)", "8× 32 GB DDR5 ECC (256 GB)", "8× 32 GB DDR5 ECC (256 GB)"],
              ["Controladora", "HBA 9500-16i (IT mode)", "HPE MR216i-p (IT mode)", "HBA355i (IT mode)"],
              ["Discos NVMe", "4× 3.84 TB NVMe TLC", "4× 3.84 TB NVMe TLC", "4× 3.84 TB NVMe TLC"],
              ["Discos HDD", "4× 4 TB SAS 7.2k", "4× 4 TB SAS 7.2k", "4× 4 TB SAS 7.2k"],
              ["Red", "4× 10 GbE + 2× 1 GbE mgmt", "4× 10 GbE + 2× 1 GbE mgmt", "4× 10 GbE + iDRAC"],
              ["Fuente", "2× 1100 W redundante", "2× 1000 W redundante", "2× 1100 W redundante"],
              ["Gestión out-of-band", "XClarity Controller", "iLO 6", "iDRAC 9"],
              ["Garantía base", "3 años NBD on-site", "3 años NBD on-site", "3 años NBD on-site"],
            ],
          },
        ],
      },
      {
        heading: "3. Cuándo elegir cada una",
        blocks: [
          {
            type: "list",
            items: [
              "Lenovo ThinkSystem: excelente relación precio/prestaciones, XClarity con gestión clara, buen soporte en Argentina.",
              "HPE ProLiant: iLO 6 es referencia en gestión out-of-band; opciones de servicio Care Pack muy sólidas para clientes que priorizan posventa.",
              "Dell PowerEdge: iDRAC 9 con muchas funciones nativas, ProSupport ampliamente disponible; suele tener plazos de entrega competitivos.",
            ],
          },
        ],
      },
      {
        heading: "4. Consideraciones para Proxmox VE",
        blocks: [
          {
            type: "list",
            items: [
              "Elegir controladora en modo HBA (IT mode) — ZFS necesita ver los discos directos.",
              "Poblar los canales de memoria: en Xeon Silver 4514Y los 8 canales por CPU se pueblan con 8 DIMMs para no dejar ancho de banda sin usar.",
              "Fuente redundante 1+1 recomendada para virtualización productiva; simple aceptable si hay UPS y ventana de mantenimiento.",
              "Red 10 GbE mínimo para migración en vivo entre nodos de cluster.",
            ],
          },
        ],
      },
      {
        heading: "5. Cómo pedir cotización",
        blocks: [
          {
            type: "paragraph",
            text: "Enviá el RFQ (bartez.com.ar/rfq) con esta matriz como referencia. Adjuntamos cotización de las tres marcas en la misma propuesta para que puedas decidir con datos.",
          },
        ],
      },
    ],
  },
  {
    slug: "dimensionamiento-wifi-multisede",
    title: "Guía de dimensionamiento WiFi multi-sede",
    subtitle: "Access points por superficie, densidad y ancho de banda esperado",
    category: "Redes y conectividad",
    icon: Wifi,
    description:
      "Tabla orientativa para dimensionar cantidad de access points UniFi, Aruba o Cisco por sede según superficie, densidad de usuarios y aplicación crítica.",
    metaTitle: "Dimensionamiento WiFi multi-sede | Bartez Tecnología",
    metaDescription:
      "Guía técnica para dimensionar access points empresariales por superficie, densidad de usuarios y tipo de tráfico. UniFi, Aruba y Cisco.",
    keywords: ["dimensionamiento WiFi empresa", "cantidad access points m2", "WiFi multi-sede UniFi Aruba"],
    sections: [
      {
        heading: "1. Regla base: densidad importa más que superficie",
        blocks: [
          {
            type: "paragraph",
            text: "Un AP moderno WiFi 6 tiene capacidad radio muy alta, pero el cuello de botella real es cuántos dispositivos concurrentes atiende con qué latencia. El sizing arranca por la densidad esperada.",
          },
        ],
      },
      {
        heading: "2. Tabla orientativa por tipo de espacio",
        blocks: [
          {
            type: "table",
            headers: ["Tipo de espacio", "Densidad típica", "AP por sede", "Ejemplo modelo"],
            rows: [
              ["Oficina pequeña (< 100 m²)", "10-25 usuarios", "1-2", "UniFi U6 Lite / Aruba AP-303H"],
              ["Oficina mediana (100-300 m²)", "30-80 usuarios", "3-5", "UniFi U6 Pro / Aruba AP-505"],
              ["Oficina grande (300-800 m²)", "80-200 usuarios", "6-12", "UniFi U6 Enterprise / Aruba AP-635"],
              ["Sucursal comercial", "20-60 clientes + staff", "2-4", "UniFi U6 Pro In-Wall"],
              ["Depósito (500-2000 m²)", "10-30 dispositivos móviles", "3-8", "UniFi U6 Long-Range / Aruba AP-577"],
              ["Aula o auditorio", "40-150 asistentes concurrentes", "2-6 (alta densidad)", "UniFi U6 Enterprise / Aruba AP-655"],
              ["Fábrica / planta industrial", "20-80 usuarios + IoT", "según relevamiento", "AP outdoor + directional"],
            ],
            caption: "Cantidades orientativas — el relevamiento de sitio ajusta según materiales, altura, interferencia.",
          },
        ],
      },
      {
        heading: "3. Cuándo UniFi vs Aruba/Cisco",
        blocks: [
          {
            type: "list",
            items: [
              "UniFi: multi-sede con controlador central, presupuesto acotado, densidad media. Ideal para cadenas comerciales, sucursales bancarias, salud, educación no crítica y logística.",
              "Aruba: entornos corporativos exigentes, roaming crítico, integración con NAC (ClearPass), auditoría y compliance. Central Cloud o on-premise.",
              "Cisco: enterprise con licencias DNA/Meraki, integración con infraestructura Cisco existente, entornos muy regulados.",
            ],
          },
        ],
      },
      {
        heading: "4. Contingencia y backup",
        blocks: [
          {
            type: "list",
            items: [
              "En sedes críticas: 1-2 APs adicionales de backup para reemplazo inmediato ante fallo.",
              "1 switch PoE de repuesto por región para minimizar downtime.",
              "UPS mínimo para switch principal y gateway (mantener uplink WAN durante corte).",
            ],
          },
        ],
      },
      {
        heading: "5. Cómo pedir el proyecto",
        blocks: [
          {
            type: "paragraph",
            text: "Enviá RFQ (bartez.com.ar/rfq) con: cantidad de sedes, dirección de cada una, superficie aproximada, cantidad de usuarios/dispositivos por sede, y aplicaciones críticas (voz, video, IoT). Coordinamos relevamiento y propuesta con equipamiento e instaladores.",
          },
        ],
      },
    ],
  },
  {
    slug: "dimensionamiento-cctv",
    title: "Guía de dimensionamiento CCTV IP",
    subtitle: "Cámaras, NVR y storage por tipo de predio",
    category: "Videovigilancia",
    icon: Cctv,
    description:
      "Cómo dimensionar cámaras IP, canales de NVR y días de retención según el tipo de predio y la resolución requerida.",
    metaTitle: "Dimensionamiento CCTV IP | Bartez Tecnología",
    metaDescription:
      "Guía técnica para dimensionar cámaras IP, NVR y storage CCTV: cámara correcta por caso, canales necesarios, días de retención y elección de disco.",
    keywords: ["dimensionamiento CCTV IP", "canales NVR necesarios", "storage CCTV WD Purple SkyHawk"],
    sections: [
      {
        heading: "1. Elegir el tipo de cámara correcto",
        blocks: [
          {
            type: "table",
            headers: ["Caso de uso", "Tipo recomendado", "Notas"],
            rows: [
              ["Perímetro / acceso", "Bala direccional exterior", "IR de largo alcance, resistente a intemperie"],
              ["Interior comercial", "Domo antivandálico", "Discreta, resiste manipulación"],
              ["Playa de estacionamiento", "PTZ + fija", "PTZ para seguimiento + fijas para cobertura constante"],
              ["Cancha / patio grande", "Multi-sensor panorámica o fisheye 360°", "1 sola cámara cubre 180-360°"],
              ["Depósito / nave", "Multi-sensor panorámica en altura", "Reduce cantidad de cámaras total"],
              ["Corredor / pasillo largo", "Corridor mode (rotación 90°)", "Cámara girada aprovecha aspect ratio vertical"],
              ["Reconocimiento facial", "Fija con lente adecuada", "Distancia a rostro definida en relevamiento"],
            ],
          },
        ],
      },
      {
        heading: "2. Dimensionamiento de NVR",
        blocks: [
          {
            type: "list",
            items: [
              "Canales del NVR = cantidad de cámaras + margen 20% para crecimiento.",
              "PoE en el NVR: aliviana la instalación (sin inyector separado), pero limita ubicación al perímetro cerca del NVR.",
              "Ancho de banda: cada cámara 4 MP a 15 FPS con H.265 consume 3-5 Mbps. Un NVR de 16 canales con esas cámaras genera 48-80 Mbps sostenidos.",
            ],
          },
        ],
      },
      {
        heading: "3. Storage: cuántos discos y de qué tipo",
        blocks: [
          {
            type: "table",
            headers: ["Cámaras", "Días retención", "Storage aprox (H.265)", "Config disco sugerida"],
            rows: [
              ["4 cámaras 4 MP", "15 días", "1-2 TB", "1× 4 TB WD Purple"],
              ["8 cámaras 4 MP", "15 días", "2-4 TB", "1× 6 TB WD Purple"],
              ["16 cámaras 4 MP", "30 días", "10-14 TB", "2× 10 TB WD Purple en RAID 1"],
              ["32 cámaras 4 MP", "30 días", "20-28 TB", "4× 10 TB SkyHawk AI en RAID 5"],
              ["8 cámaras 8 MP (4K)", "30 días", "12-18 TB", "2× 12 TB SkyHawk AI"],
            ],
            caption: "Estimación con H.265, movimiento medio, 15 FPS. Escenas de mucho movimiento aumentan el consumo.",
          },
          {
            type: "note",
            text: "Discos WD Purple y Seagate SkyHawk están diseñados para escritura 24×7 de video. No usar discos de escritorio: fallan antes y pueden perder video.",
          },
        ],
      },
      {
        heading: "4. Cableado exterior — checklist",
        blocks: [
          {
            type: "list",
            items: [
              "Cable UTP exterior con protección UV (gel o dieléctrico según tendido).",
              "Distancia máxima Ethernet 100 m — si excede, usar switch PoE intermedio o fibra.",
              "Cajas estancas IP66 en uniones exteriores.",
              "Grounding en tendidos largos exteriores para protección contra sobretensiones.",
              "Descargadores de sobretensión (SPD) en ambos extremos si el tendido cruza edificios.",
            ],
          },
        ],
      },
      {
        heading: "5. Cómo pedir el proyecto",
        blocks: [
          {
            type: "paragraph",
            text: "Enviá RFQ (bartez.com.ar/rfq?origen=cctv) con: plano del predio (aunque sea sketch), zonas a cubrir, días de retención requeridos, si tenés cableado existente y si el proyecto requiere instalación exterior. Cotizamos cámaras, NVR, discos y coordinación con instaladores partners.",
          },
        ],
      },
    ],
  },
  {
    slug: "configuracion-proxmox",
    title: "Ficha técnica: servidores para Proxmox VE",
    subtitle: "HBA, ZFS, canales de memoria y fuentes",
    category: "Servidores y virtualización",
    icon: ServerCog,
    description:
      "Referencia técnica para configurar servidores rack que alojan Proxmox VE con ZFS: controladora HBA, poblado de memoria, redundancia eléctrica y cluster.",
    metaTitle: "Ficha técnica servidores para Proxmox VE | Bartez Tecnología",
    metaDescription:
      "Guía práctica de configuración de servidores para Proxmox VE con ZFS: HBA pass-through, canales de memoria, fuentes redundantes, cluster HA.",
    keywords: ["configurar servidor Proxmox VE", "HBA para ZFS Proxmox", "cluster Proxmox HA"],
    sections: [
      {
        heading: "1. Controladora: HBA vs RAID hardware",
        blocks: [
          {
            type: "paragraph",
            text: "ZFS necesita ver los discos directos para administrar el pool, hacer checksums y manejar snapshots. Un RAID hardware oculta los discos y rompe esas garantías.",
          },
          {
            type: "list",
            items: [
              "Usar controladora HBA (LSI/Broadcom en modo IT o equivalente).",
              "Evitar RAID hardware con caché para pool ZFS.",
              "Si el servidor viene con RAID por default (habitual en Dell/HPE), pedir que la orden incluya HBA en su lugar.",
            ],
          },
        ],
      },
      {
        heading: "2. Poblado óptimo de canales de memoria",
        blocks: [
          {
            type: "paragraph",
            text: "Los procesadores Xeon Scalable y EPYC tienen múltiples canales de memoria por CPU. Poblar solo un canal deja la mitad o más del ancho de banda sin usar.",
          },
          {
            type: "table",
            headers: ["CPU", "Canales de memoria", "Configuración óptima"],
            rows: [
              ["Xeon Scalable 4th Gen (Sapphire Rapids)", "8 por CPU", "8 DIMMs por CPU, mismos módulos"],
              ["Xeon Scalable 5th Gen (Emerald Rapids)", "8 por CPU", "8 DIMMs por CPU, mismos módulos"],
              ["AMD EPYC 9004 (Genoa)", "12 por CPU", "12 DIMMs por CPU"],
              ["AMD EPYC 9005 (Turin)", "12 por CPU", "12 DIMMs por CPU"],
            ],
          },
          {
            type: "note",
            text: "Módulos de diferente tamaño o velocidad en el mismo canal fuerzan a la memoria a operar a la velocidad del más lento.",
          },
        ],
      },
      {
        heading: "3. Fuente redundante o simple",
        blocks: [
          {
            type: "list",
            items: [
              "Redundante (1+1): virtualización productiva, ERP, servicios críticos.",
              "Simple con UPS + ventana de mantenimiento: cargas menos críticas o laboratorio.",
              "Considerar consumo real — 800 W redundantes suelen alcanzar; 1100 W con margen para expansión.",
            ],
          },
        ],
      },
      {
        heading: "4. Storage: dimensionamiento",
        blocks: [
          {
            type: "list",
            items: [
              "NVMe TLC enterprise para pool de VMs productivas.",
              "SAS 12G para volúmenes con carga menor o snapshots.",
              "HDD 7.2k para archivo o backup local.",
              "Considerar SSD dedicado para SLOG y L2ARC en pools ZFS con alta IOPS.",
            ],
          },
        ],
      },
      {
        heading: "5. Cluster Proxmox HA",
        blocks: [
          {
            type: "list",
            items: [
              "3 nodos mínimo para HA con quorum. 2 nodos + QDevice si el presupuesto lo justifica.",
              "Red dedicada 10 GbE (o 25 GbE) para migración en vivo.",
              "Storage compartido: Ceph (los 3 nodos aportan discos) o NAS/SAN externo con NFS/iSCSI.",
              "Sincronización de hora estricta (NTP) — Proxmox HA depende de tiempo consistente.",
            ],
          },
        ],
      },
      {
        heading: "6. Cómo pedir cotización",
        blocks: [
          {
            type: "paragraph",
            text: "Enviá RFQ (bartez.com.ar/rfq) o consultá /soluciones/virtualizacion-proxmox. Cotizamos Lenovo ThinkSystem, HPE ProLiant y Dell PowerEdge en la misma configuración para que compares.",
          },
        ],
      },
    ],
  },
  {
    slug: "plantilla-rfq",
    title: "Plantilla de RFQ para proyecto IT",
    subtitle: "Estructura para enviar un pedido de cotización completo",
    category: "Comercial",
    icon: ClipboardList,
    description:
      "Plantilla de estructura para armar un RFQ (Request for Quotation) completo que acelere la propuesta comercial y reduzca idas y vueltas.",
    metaTitle: "Plantilla RFQ para cotización IT | Bartez Tecnología",
    metaDescription:
      "Estructura de RFQ para acelerar cotizaciones IT B2B: datos del solicitante, lista de items, condiciones comerciales, plazo y forma de pago.",
    keywords: ["plantilla RFQ IT", "pedido cotización pliego", "estructura RFQ B2B"],
    sections: [
      {
        heading: "1. Datos del solicitante",
        blocks: [
          {
            type: "list",
            items: [
              "Razón social + CUIT.",
              "Contacto administrativo (nombre, email, teléfono).",
              "Contacto técnico (nombre, email, teléfono).",
              "Domicilio de facturación y de entrega (si difieren).",
              "Condición fiscal (Responsable Inscripto, Monotributista, Exento).",
            ],
          },
        ],
      },
      {
        heading: "2. Lista de items requeridos",
        blocks: [
          {
            type: "paragraph",
            text: "Formato sugerido para cada renglón:",
          },
          {
            type: "table",
            headers: ["#", "Categoría", "Especificación", "Cantidad", "¿Acepta equivalente?"],
            rows: [
              ["1", "Notebook corporativa", "14\", i7 13ª gen, 16 GB, 512 GB NVMe, Win 11 Pro", "20", "Sí, Lenovo/HP/Dell"],
              ["2", "Switch core", "24 puertos 10 GbE + 4 SFP+", "2", "Cisco Catalyst o Aruba"],
              ["3", "Instalación", "Cableado + rack + configuración", "1 sede", "Coordinación con instalador partner"],
            ],
            caption: "Este es un ejemplo — reemplazá con tus items reales.",
          },
        ],
      },
      {
        heading: "3. Condiciones comerciales",
        blocks: [
          {
            type: "list",
            items: [
              "Plazo esperado de entrega (inmediato, 30 días, 3 meses).",
              "Forma de pago preferida (transferencia, cuenta corriente, cheque diferido).",
              "Moneda (ARS, USD, EUR).",
              "Retenciones aplicables (Ganancias, IVA, IIBB por jurisdicción).",
              "Validez de oferta esperada (30, 60, 90 días).",
              "Régimen de contratación (compra directa, contratación menor, licitación).",
            ],
          },
        ],
      },
      {
        heading: "4. Requisitos técnicos y servicios",
        blocks: [
          {
            type: "list",
            items: [
              "¿Requiere instalación en sitio? Sí / No / Consultar.",
              "¿Requiere puesta en marcha o migración? Sí / No.",
              "¿Requiere capacitación al usuario final? Sí / No.",
              "¿Requiere garantía extendida? Detallar años y nivel de servicio.",
              "¿Requiere soporte posventa? Detallar SLA esperado.",
            ],
          },
        ],
      },
      {
        heading: "5. Documentación adicional",
        blocks: [
          {
            type: "list",
            items: [
              "Pliego oficial (si aplica).",
              "Especificación técnica detallada.",
              "Planos o layouts (para proyectos con instalación).",
              "Formulario de proveedor del organismo (si aplica).",
            ],
          },
        ],
      },
      {
        heading: "6. Cómo enviarlo",
        blocks: [
          {
            type: "paragraph",
            text: "Enviá el RFQ completo por bartez.com.ar/rfq (formulario web con adjuntos) o por email a ventas@bartez.com.ar. Respondemos en 24-48 hs hábiles con propuesta formal, factura A y validez de oferta explícita.",
          },
        ],
      },
    ],
  },
];

export function getDownloadGuide(slug: string): DownloadGuide | undefined {
  return downloadGuides.find((item) => item.slug === slug);
}
