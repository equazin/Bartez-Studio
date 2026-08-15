/**
 * Capacidades demostradas: tipos de operación que Bartez resuelve
 * habitualmente. Se usan como prueba social respetuosa de la política de
 * /casos (solo clientes con autorización), describiendo clases de operación
 * sin identificar clientes ni fabricar métricas puntuales.
 *
 * Consumido por:
 *  - components/HomeBlueWholesale.tsx (sección "Capacidades demostradas")
 *  - app/casos/page.tsx (fallback cuando no hay casos autorizados)
 */
import {
  Cctv,
  HardHat,
  Landmark,
  Laptop,
  Server,
  Wifi,
  type LucideIcon,
} from "lucide-react";

export type Capability = {
  icon: LucideIcon;
  title: string;
  desc: string;
  href: string;
};

export const capabilities: Capability[] = [
  {
    icon: Laptop,
    title: "Renovación de parque",
    desc: "Compras por lote de 20 a 100+ notebooks o PCs corporativas con Windows 11 Pro, imagen unificada y entrega escalonada a una o varias sedes.",
    href: "/soluciones/notebooks-corporativas",
  },
  {
    icon: Wifi,
    title: "WiFi multi-sede coordinado",
    desc: "Proyectos con UniFi en varias sedes, relevamiento por sitio, equipamiento de contingencia e instaladores partners en cada provincia bajo coordinación técnica propia.",
    href: "/soluciones/wifi-multisede",
  },
  {
    icon: Server,
    title: "Servidores para virtualización",
    desc: "Servidores rack Lenovo, HPE y Dell configurados para Proxmox VE con HBA para ZFS, canales de memoria poblados y fuentes redundantes cuando la criticidad lo justifica.",
    href: "/soluciones/virtualizacion-proxmox",
  },
  {
    icon: Cctv,
    title: "CCTV en predios grandes",
    desc: "Cámaras IP direccionales, panorámicas y 360° para oficinas, plantas y espacios recreativos, con NVR dimensionado, discos CCTV específicos y cableado exterior.",
    href: "/soluciones/videovigilancia-cctv",
  },
  {
    icon: Landmark,
    title: "Compras a organismos públicos",
    desc: "Cotización formal con validez de oferta, retenciones, plazos por escrito y deal registration con Dell, HPE y Lenovo cuando corresponde.",
    href: "/gobierno",
  },
  {
    icon: HardHat,
    title: "Proyectos llave en mano",
    desc: "Cuando el proyecto pide cableado, montaje o integración, sumamos instaladores partners al alcance y coordinamos todo desde nuestro equipo técnico.",
    href: "/servicios-profesionales",
  },
];
