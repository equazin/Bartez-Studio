/**
 * FAQs consolidadas del sitio para la página /preguntas-frecuentes.
 *
 * Combina las FAQs distribuidas en las 12 verticals (`constants.verticals`)
 * y las 7 landings de workstations por software (`lib/workstations-software`)
 * con un bloque propio de FAQs comerciales que solo viven en este hub
 * (proceso de compra, sector público, RMA, servicios profesionales, canal).
 *
 * Fuente única para renderizar la página y para generar el JSON-LD FAQPage
 * grande que Google/AEO consumen.
 */
import { verticals } from "@/constants";
import { workstationsSoftware } from "@/lib/workstations-software";

export type Faq = { q: string; a: string };

export type FaqCategory = {
  id: string;
  title: string;
  intro?: string;
  faqs: Faq[];
};

// FAQs propias que no se derivan de otro lado del sitio.
// Cubren dudas frecuentes del proceso de compra B2B, sector público,
// RMA y canal — información útil que no encaja como bullet técnico de vertical.
const commercialFaqs: Faq[] = [
  {
    q: "¿Cómo pido una cotización?",
    a: "Podés pedirla por WhatsApp (respuesta en 24 hs hábiles), por el formulario de /contacto, o si el proyecto tiene varios ítems / requiere pliego, por /rfq. En sector público usá /rfq?origen=gobierno para que el formulario muestre el bloque con validez de oferta y retenciones.",
  },
  {
    q: "¿Facturan con IVA discriminado (Factura A)?",
    a: "Sí. Somos Responsable Inscripto y emitimos Factura A en todas las operaciones B2B. CUIT verificable en AFIP.",
  },
  {
    q: "¿Qué formas de pago aceptan?",
    a: "Transferencia bancaria, cuenta corriente (con evaluación crediticia), cheque diferido y otras condiciones según volumen y perfil. Para operaciones grandes o pliegos evaluamos condiciones específicas.",
  },
  {
    q: "¿Cuál es el plazo de entrega habitual?",
    a: "Depende del equipo y disponibilidad. Productos de línea disponible: 3-5 días hábiles. Configuraciones CTO/BTO (workstations, servidores) según fabricante — lo confirmamos por escrito al cotizar. Compras grandes con múltiples ítems tienen plazos escalonados.",
  },
  {
    q: "¿Entregan al interior del país?",
    a: "Sí, cobertura nacional con logística documentada. Coordinamos entregas a una o varias sedes según el proyecto. Para instalación in-situ en el interior trabajamos con instaladores partners bajo nuestra coordinación técnica.",
  },
];

const govermentFaqs: Faq[] = [
  {
    q: "¿Qué es el deal registration y cómo lo usan?",
    a: "Es el registro formal de una oportunidad de proyecto con el fabricante (Dell, HPE, Lenovo). Nos permite acceder a un precio de proyecto mejor que el precio de lista cuando la operación tiene escala. Lo iniciamos al cotizar si el proyecto lo habilita.",
  },
  {
    q: "¿Pueden participar en licitaciones y compras públicas?",
    a: "Sí. Operamos con municipios, organismos provinciales y nacionales. Emitimos cotización formal con validez explícita, plazos comprometidos por escrito, factura A y recibimos retenciones. Tenemos experiencia con portales COMPR.AR, SIPAF y contrataciones provinciales.",
  },
  {
    q: "¿Aceptan retenciones (Ganancias, IVA, IIBB)?",
    a: "Sí. Al ser Responsable Inscripto podemos recibir las retenciones nacionales, provinciales y municipales que correspondan según la jurisdicción del organismo comprador.",
  },
  {
    q: "¿Cuánto dura la validez de oferta?",
    a: "Por defecto 30 días hábiles. Para pliegos con validez requerida mayor (60, 90 días) la ajustamos al pedirse en la cotización.",
  },
];

const projectFaqs: Faq[] = [
  {
    q: "¿Cuál es la diferencia entre RFQ y contacto normal?",
    a: "El chooser de /contacto rutea automaticamente: consulta puntual (un equipo, una consulta técnica) va al form corto; proyecto corporativo (varios ítems, multi-sede, integración) va al RFQ que pide CUIT, cantidad, plazo, condiciones de pago y sustituciones. El RFQ está diseñado para acelerar la propuesta.",
  },
  {
    q: "¿Cotizan proyectos llave en mano con instalación?",
    a: "Sí. Cuando el proyecto pide más que equipamiento (cableado, montaje, integración, ventana de corte) sumamos instaladores partners al alcance y coordinamos todo desde nuestro equipo técnico. Un solo interlocutor, un solo alcance, una sola factura A. Ver /servicios-profesionales para el detalle.",
  },
  {
    q: "¿Trabajan varias marcas en la misma propuesta?",
    a: "Sí. Es habitual que armemos Lenovo, HPE y Dell (o Cisco, Aruba, Ubiquiti para networking) en configuraciones equivalentes para que puedas decidir por precio, plazo o preferencia técnica — no por default del proveedor.",
  },
  {
    q: "¿Coordinan entregas escalonadas a varias sucursales?",
    a: "Sí. Para renovaciones de parque o proyectos multi-sede coordinamos entregas por tandas por región, sede o turno de recambio. Cronograma unificado con un solo contacto comercial.",
  },
];

const rmaFaqs: Faq[] = [
  {
    q: "¿Cómo inicio un caso de garantía o RMA?",
    a: "Por /garantias-rma/nuevo. El formulario pide fabricante, modelo, número de serie, fecha de compra y descripción del síntoma. Al enviar recibís un número de caso de referencia y respondemos en 48 hs hábiles con la evaluación inicial.",
  },
  {
    q: "¿Cuánto tarda la respuesta de un RMA?",
    a: "48 hs hábiles para la evaluación inicial. El tiempo de resolución depende del fabricante y del tipo de intervención (recambio en garantía, reparación, orientación). Lo confirmamos por el canal que elijas (WhatsApp o email) con el número de caso.",
  },
  {
    q: "¿Los equipos comprados a Bartez tienen alguna cobertura extra?",
    a: "Los equipos comprados a Bartez tienen prioridad en el flujo de soporte y no requieren contrato específico durante la vigencia de garantía. La garantía es la del fabricante — Bartez acompaña la gestión.",
  },
];

const channelFaqs: Faq[] = [
  {
    q: "¿Cómo funciona el programa de revendedores?",
    a: "Ofrecemos condiciones diferenciadas para tiendas, integradores y profesionales IT: precios de canal, abastecimiento a pedido, acompañamiento comercial. La alta se solicita por /revendedores.",
  },
  {
    q: "¿Puedo revender licencias Microsoft, Adobe, ESET?",
    a: "Sí. Trabajamos licenciamiento por canal autorizado para reventa. Las condiciones específicas se definen en la alta del canal.",
  },
  {
    q: "¿Hay stock inmediato o siempre a pedido?",
    a: "Trabajamos principalmente a pedido — no mantenemos stock físico grande. Esto nos permite ofrecer siempre precio actualizado y no tener obsolescencia. Para productos de línea el abastecimiento suele resolverse en 3-5 días hábiles.",
  },
];

// Deriva las FAQs de las verticales de /soluciones agrupándolas en 3 categorías
// funcionales para que la página no sea una lista plana de 40 items sueltos.
type VerticalGroup = {
  id: string;
  title: string;
  intro: string;
  slugs: string[];
};

const verticalGroups: VerticalGroup[] = [
  {
    id: "infraestructura",
    title: "Redes, servidores e infraestructura",
    intro: "Dudas frecuentes sobre las soluciones de infraestructura B2B.",
    slugs: [
      "servidores",
      "virtualizacion-proxmox",
      "redes-infraestructura",
      "wifi-multisede",
      "videovigilancia-cctv",
      "cableado-racks",
    ],
  },
  {
    id: "equipamiento",
    title: "Equipamiento corporativo",
    intro: "Consultas típicas sobre notebooks, PCs y workstations.",
    slugs: [
      "notebooks-corporativas",
      "workstations-alta-gama",
      "workstations-pcs",
      "perifericos-corporativos",
    ],
  },
];

function faqsFromVerticals(slugs: string[]): Faq[] {
  return slugs.flatMap((slug) => {
    const v = verticals.find((item) => item.slug === slug);
    if (!v) return [];
    return v.faqs.map((f) => ({
      q: f.q,
      a: `${f.a} — Más en /soluciones/${slug}.`,
    }));
  });
}

const workstationsSoftwareFaqs: Faq[] = workstationsSoftware.flatMap((entry) =>
  entry.faqs.map((f) => ({
    q: `[${entry.softwareName}] ${f.q}`,
    a: `${f.a} — Config completa en /soluciones/workstations-alta-gama/${entry.slug}.`,
  })),
);

export const faqCategories: FaqCategory[] = [
  {
    id: "comercial",
    title: "Proceso de compra y facturación",
    intro: "Cotización, pago, plazos, cobertura logística.",
    faqs: commercialFaqs,
  },
  {
    id: "proyectos",
    title: "Proyectos corporativos y RFQ",
    intro: "Cómo funcionan los proyectos multi-marca, llave en mano y multi-sede.",
    faqs: projectFaqs,
  },
  {
    id: "sector-publico",
    title: "Sector público y licitaciones",
    intro: "Deal registration, validez de oferta, retenciones, portales.",
    faqs: govermentFaqs,
  },
  ...verticalGroups.map((group) => ({
    id: group.id,
    title: group.title,
    intro: group.intro,
    faqs: faqsFromVerticals(group.slugs),
  })),
  {
    id: "workstations-software",
    title: "Workstations por software profesional",
    intro: "Dudas específicas por software (Pix4D, Metashape, Revit, ArcGIS, Blender, DaVinci, ANSYS).",
    faqs: workstationsSoftwareFaqs,
  },
  {
    id: "rma-garantia",
    title: "Garantías y RMA",
    intro: "Cómo iniciar un caso, plazos y cobertura.",
    faqs: rmaFaqs,
  },
  {
    id: "canal",
    title: "Canal de revendedores",
    intro: "Programa, condiciones y stock para el canal.",
    faqs: channelFaqs,
  },
];

export function allFaqs(): Faq[] {
  return faqCategories.flatMap((c) => c.faqs);
}
