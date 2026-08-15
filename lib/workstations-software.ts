/**
 * Configuraciones sugeridas de workstations alta gama por software profesional.
 *
 * Cada entrada representa un caso de uso real que Bartez cotiza habitualmente.
 * Las specs son orientativas y se ajustan al proyecto en la propuesta formal.
 * Los requisitos parten de la documentación oficial de cada fabricante de
 * software (system requirements publicados por Pix4D, Agisoft, Autodesk, Esri,
 * Blender Foundation, Blackmagic Design y ANSYS a fines de 2025).
 */
import type { LucideIcon } from "lucide-react";
import { Cpu, Film, Layers, Map as MapIcon, Mountain, Palette, Wrench } from "lucide-react";

export type WorkstationSoftware = {
  slug: string;
  softwareName: string;
  vendor: string;
  icon: LucideIcon;
  useCase: string;
  h1: string;
  intro: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  recommendedConfig: {
    cpu: string;
    ram: string;
    gpu: string;
    storage: string;
    display?: string;
  };
  bullets: { title: string; desc: string }[];
  compareModels: { brand: string; model: string; note?: string }[];
  faqs: { q: string; a: string }[];
};

export const workstationsSoftware: WorkstationSoftware[] = [
  {
    slug: "pix4d",
    softwareName: "Pix4D",
    vendor: "Pix4D SA",
    icon: Mountain,
    useCase: "Fotogrametría y mapeo con drones",
    h1: "Workstations para Pix4D (Mapper / Matic / Fields) en Argentina.",
    intro:
      "Configuraciones a medida (CTO/BTO) para procesar vuelos de drone en Pix4D: cientos a miles de imágenes con generación de ortomosaicos, modelos 3D y nubes de puntos. Priorizamos núcleos de CPU y RAM ECC porque el pipeline de Pix4D es muy sensible al tamaño del proyecto.",
    metaTitle: "Workstation para Pix4D en Argentina | Bartez Tecnología",
    metaDescription:
      "Dell Precision, HP Z y Lenovo ThinkStation configuradas a medida para Pix4D Mapper y Matic: Xeon/Threadripper, 128–512 GB ECC, GPU NVIDIA RTX y storage NVMe.",
    keywords: ["workstation Pix4D", "PC para fotogrametría", "Pix4D Mapper Argentina", "estación Pix4D drone"],
    recommendedConfig: {
      cpu: "Intel Xeon W-3400 series o AMD Threadripper PRO 7000 (32+ núcleos)",
      ram: "256 GB DDR5 ECC (escalable a 512 GB para vuelos > 3.000 imágenes)",
      gpu: "NVIDIA RTX 4500 Ada / RTX 5000 Ada (CUDA para densificación)",
      storage: "SSD NVMe 2 TB para sistema y proyecto activo + HDD 8 TB para archivo",
      display: "27\" 4K IPS calibrado (opcional según flujo)",
    },
    bullets: [
      { title: "CPU con muchos núcleos", desc: "Pix4D paraleliza matching y densificación. Un procesador de estación de trabajo con 32+ núcleos reduce el tiempo total del pipeline significativamente frente a una CPU de escritorio." },
      { title: "RAM ECC dimensionada por proyecto", desc: "Regla de campo: ~1 GB por cada 10 imágenes para vuelos medianos, más margen para proyectos densos. Por eso arrancamos en 256 GB ECC." },
      { title: "GPU con CUDA para densificación", desc: "La generación de nube de puntos densa aprovecha CUDA. RTX 4500/5000 Ada equilibran rendimiento y presupuesto para trabajo profesional sostenido." },
      { title: "Storage NVMe para proyecto activo", desc: "El pipeline lee y escribe cientos de GB de archivos temporales. NVMe evita cuellos de I/O que en HDD alargan el proyecto horas o días." },
      { title: "Chasis pensado para carga sostenida", desc: "Vuelos de horas de procesamiento requieren refrigeración y fuente dimensionada. Por eso vamos a Dell Precision, HP Z o Lenovo ThinkStation, no a una PC gamer." },
    ],
    compareModels: [
      { brand: "Dell", model: "Precision 7960 Tower", note: "Xeon W-3400, hasta 2 TB RAM ECC, GPU dual" },
      { brand: "HP", model: "Z8 Fury / Z8 G5", note: "Xeon W-3400, chasis pensado para GPU y storage" },
      { brand: "Lenovo", model: "ThinkStation PX", note: "Dual Xeon Scalable, hasta 2 TB RAM ECC" },
    ],
    faqs: [
      { q: "¿Cuántas imágenes puedo procesar con esta configuración?", a: "Con 256 GB de RAM ECC podés procesar vuelos de hasta 3.000-5.000 imágenes de forma cómoda. Para vuelos más grandes recomendamos escalar a 512 GB y agregar NVMe adicional." },
      { q: "¿Sirve para Pix4Dmatic también?", a: "Sí. Matic es más exigente aún que Mapper en RAM y CPU porque procesa proyectos más grandes. Esta base sirve; en proyectos muy densos escalamos memoria." },
      { q: "¿Necesito Windows Pro?", a: "Sí. En workstations corporativas siempre cotizamos con Windows 11 Pro para BitLocker, dominio y política de grupo." },
      { q: "¿Cuál es el plazo de entrega?", a: "Los equipos CTO/BTO se piden al fabricante con la config específica; el plazo depende de disponibilidad de componentes. Lo confirmamos por escrito al cotizar." },
    ],
  },
  {
    slug: "agisoft-metashape",
    softwareName: "Agisoft Metashape",
    vendor: "Agisoft LLC",
    icon: Mountain,
    useCase: "Fotogrametría de alta densidad",
    h1: "Workstations para Agisoft Metashape Professional en Argentina.",
    intro:
      "Estaciones configuradas para Agisoft Metashape: reconstrucción 3D densa, ortomosaicos y modelos texturizados. Metashape se beneficia de GPUs múltiples y RAM abundante — configuraciones específicas por tamaño de proyecto.",
    metaTitle: "Workstation para Agisoft Metashape | Bartez Tecnología",
    metaDescription:
      "Dell Precision, HP Z y Lenovo ThinkStation para Agisoft Metashape Professional: Xeon/Threadripper, RAM ECC hasta 512 GB, GPU NVIDIA RTX con CUDA.",
    keywords: ["workstation Metashape", "PC para Agisoft", "fotogrametría Metashape", "estación 3D reconstruction"],
    recommendedConfig: {
      cpu: "AMD Threadripper PRO 7975WX / 7985WX (32-64 núcleos)",
      ram: "256 GB DDR5 ECC (escalable a 1 TB para proyectos muy densos)",
      gpu: "NVIDIA RTX 4500 Ada + opción de segunda GPU para dense cloud",
      storage: "SSD NVMe 2 TB (proyecto) + NVMe 4 TB (workspace) + HDD 12 TB (archivo)",
    },
    bullets: [
      { title: "Multi-GPU real", desc: "Metashape escala en dense cloud generation con múltiples GPUs. El chasis y la fuente tienen que estar dimensionados para 2 GPUs profesionales." },
      { title: "Threadripper PRO como opción", desc: "Los procesadores Threadripper PRO ofrecen núcleos altos con líneas PCIe suficientes para 2 GPUs + múltiples NVMe simultáneamente." },
      { title: "RAM ECC en proyectos densos", desc: "Para reconstrucciones de alto detalle Metashape puede consumir cientos de GB de RAM. Configuramos 256 GB base y ampliamos según el tipo de proyecto." },
      { title: "Storage jerárquico", desc: "NVMe rápido para el proyecto activo, NVMe secundario para workspace y HDD grande para archivo — evita cuellos de I/O y mantiene control de costo." },
      { title: "Refrigeración pensada", desc: "Reconstrucciones de horas o días requieren workstations de marca con chasis y refrigeración dimensionadas, no una PC ensamblada." },
    ],
    compareModels: [
      { brand: "Dell", model: "Precision 7875 Tower", note: "Threadripper PRO 7000, hasta 2 TB RAM, 2 GPU" },
      { brand: "HP", model: "Z8 Fury G5", note: "Xeon W-3400, doble GPU y storage NVMe generoso" },
      { brand: "Lenovo", model: "ThinkStation P8", note: "Threadripper PRO, chasis para GPU doble" },
    ],
    faqs: [
      { q: "¿Metashape aprovecha 2 GPUs?", a: "Sí. La fase de dense cloud generation escala casi linealmente con múltiples GPUs. Para proyectos regulares una GPU alcanza; en producción intensiva vale 2 GPUs." },
      { q: "¿Qué diferencia hay entre esta config y una para Pix4D?", a: "Son similares. Metashape suele beneficiarse más de multi-GPU y admite proyectos más densos. Pix4D es más balanceado entre CPU y GPU." },
      { q: "¿Recomiendan NVIDIA o AMD?", a: "NVIDIA por soporte CUDA y estabilidad de drivers profesionales (RTX Ada Generation con drivers ISV certificados)." },
    ],
  },
  {
    slug: "autodesk-revit",
    softwareName: "Autodesk Revit",
    vendor: "Autodesk Inc.",
    icon: Layers,
    useCase: "BIM y modelado arquitectónico",
    h1: "Workstations para Autodesk Revit y BIM en Argentina.",
    intro:
      "Configuraciones para Autodesk Revit: modelado BIM colaborativo, coordinación de disciplinas y renderizado. Revit prioriza velocidad single-thread de CPU y RAM abundante para proyectos grandes con múltiples worksets.",
    metaTitle: "Workstation para Autodesk Revit / BIM | Bartez Tecnología",
    metaDescription:
      "Workstations Dell Precision, HP Z y Lenovo ThinkStation para Autodesk Revit: CPU con alta frecuencia single-thread, 64–128 GB RAM ECC y GPU certificada.",
    keywords: ["workstation Revit", "PC para BIM", "Autodesk Revit Argentina", "estación arquitectura BIM"],
    recommendedConfig: {
      cpu: "Intel Xeon W-2400 (alta frecuencia single-thread) o Core i9-14900K equivalente",
      ram: "64 GB DDR5 ECC base (128 GB para proyectos grandes con muchos worksets)",
      gpu: "NVIDIA RTX 4000 Ada / RTX A2000 (certificada ISV para Revit)",
      storage: "SSD NVMe 1 TB para sistema y proyecto activo",
      display: "27\"–32\" QHD/4K IPS (mucho espacio de vista y navegador de proyecto)",
    },
    bullets: [
      { title: "CPU con alto single-thread", desc: "Revit no paraleliza bien la mayoría de operaciones de vista y edición. Preferimos CPU con turbo alto (Xeon W-2400 o Core i9) antes que muchos núcleos." },
      { title: "RAM según tamaño del proyecto", desc: "64 GB para modelos de complejidad media. 128 GB para proyectos grandes con múltiples worksets, coordinación con disciplinas y renderizado en paralelo." },
      { title: "GPU certificada Autodesk", desc: "Las RTX Ada Generation con drivers ISV certificados evitan artefactos de vista y garantizan compatibilidad con Autodesk." },
      { title: "Storage NVMe único", desc: "Los archivos Revit son moderados en tamaño — un NVMe rápido para el proyecto activo es más importante que multi-storage." },
      { title: "Complementa con notebooks para campo", desc: "Coordinamos setups mixtos: workstation en estudio + notebook mobile workstation (Precision, ZBook, ThinkPad P) para obra." },
    ],
    compareModels: [
      { brand: "Dell", model: "Precision 3680 Tower / 5680", note: "Xeon W-2400 o Core i9, RTX A2000/A4000" },
      { brand: "HP", model: "Z4 G5 / ZBook Studio", note: "Xeon W-2400, GPU certificada ISV" },
      { brand: "Lenovo", model: "ThinkStation P5 / P7", note: "Xeon W-2400/3400, ampliable a alta gama" },
    ],
    faqs: [
      { q: "¿Threadripper conviene para Revit?", a: "No especialmente. Revit no aprovecha bien 32+ núcleos; conviene una CPU con menos núcleos pero mayor frecuencia single-thread." },
      { q: "¿Qué GPU recomiendan?", a: "NVIDIA RTX 4000 Ada o RTX A2000/A4000, con drivers ISV certificados por Autodesk. Evitá GPUs gaming (GeForce) en producción BIM sostenida." },
      { q: "¿Sirve para renderizado con V-Ray o Enscape?", a: "Sí. Renderizado GPU-based con V-Ray o Enscape se benefician de RTX. Para renderizado CPU pesado subimos a Precision 5680 con Xeon W-3400." },
    ],
  },
  {
    slug: "arcgis-pro",
    softwareName: "ArcGIS Pro",
    vendor: "Esri",
    icon: MapIcon,
    useCase: "GIS y análisis geoespacial",
    h1: "Workstations para ArcGIS Pro y GIS empresarial en Argentina.",
    intro:
      "Configuraciones para ArcGIS Pro: análisis geoespacial, procesamiento raster, LiDAR y publicación de servicios. Priorizamos GPU dedicada (para renderizado 3D y visualización), RAM ECC y storage NVMe para datasets grandes.",
    metaTitle: "Workstation para ArcGIS Pro / GIS Esri | Bartez Tecnología",
    metaDescription:
      "Dell Precision, HP Z y Lenovo ThinkStation para ArcGIS Pro: CPU 16-32 núcleos, 64–128 GB ECC, GPU NVIDIA RTX y NVMe para datasets grandes.",
    keywords: ["workstation ArcGIS Pro", "PC para GIS Esri", "estación GIS Argentina", "ArcGIS Pro requerimientos"],
    recommendedConfig: {
      cpu: "Intel Xeon W-2400 / W-3400 o AMD Ryzen 9 / Threadripper (16-32 núcleos)",
      ram: "64–128 GB DDR5 ECC según tamaño de datasets",
      gpu: "NVIDIA RTX 4000 Ada / RTX 4500 Ada (mínimo 8 GB VRAM)",
      storage: "SSD NVMe 2 TB para proyecto + HDD 8 TB para datasets históricos",
      display: "27\"+ QHD/4K IPS",
    },
    bullets: [
      { title: "GPU dedicada obligatoria", desc: "ArcGIS Pro requiere GPU dedicada con al menos 4 GB VRAM (recomendado 8 GB+) para visualización 3D, renderizado y aceleración de análisis." },
      { title: "CPU multi-núcleo para geoprocessing", desc: "Muchas herramientas de geoprocesamiento paralelizan. Un procesador con 16+ núcleos reduce tiempos en workflows batch." },
      { title: "RAM ECC dimensionada", desc: "64 GB para uso profesional habitual; 128 GB cuando se trabaja con LiDAR denso, ráster de alta resolución o cargas de imágenes satelitales." },
      { title: "NVMe para performance", desc: "Los datasets grandes de GIS se benefician mucho de I/O rápida. NVMe reduce tiempos de carga y análisis significativamente vs HDD." },
      { title: "Compatibilidad ArcGIS Enterprise", desc: "También configuramos servidores Windows Server con IIS para desplegar ArcGIS Enterprise on-premise cuando el organismo lo requiere." },
    ],
    compareModels: [
      { brand: "Dell", model: "Precision 3680 / 5680", note: "Xeon W-2400, RTX A4000/A5000" },
      { brand: "HP", model: "Z4 G5 / Z6 G5 A", note: "Threadripper PRO, ampliable a multi-GPU" },
      { brand: "Lenovo", model: "ThinkStation P5 / P7", note: "Xeon W-2400/3400, GPU profesional" },
    ],
    faqs: [
      { q: "¿ArcGIS Pro funciona en notebooks?", a: "Sí, pero para uso profesional sostenido recomendamos mobile workstations con GPU dedicada (Dell Precision, HP ZBook, Lenovo ThinkPad P). Notebooks livianas quedan cortas." },
      { q: "¿Cuánta VRAM necesito?", a: "Mínimo 4 GB según Esri. Recomendamos 8 GB o más para trabajo con escenas 3D, LiDAR y renderizado de alta calidad." },
      { q: "¿Es útil multi-monitor?", a: "Sí. En GIS es común trabajar con múltiples vistas (mapa, tabla, catálogo, escena 3D). Configuramos setups de 2-3 monitores según el flujo." },
    ],
  },
  {
    slug: "blender",
    softwareName: "Blender",
    vendor: "Blender Foundation",
    icon: Palette,
    useCase: "3D, animación y render",
    h1: "Workstations para Blender (Cycles / Eevee) en Argentina.",
    intro:
      "Estaciones configuradas para Blender: modelado 3D, animación y render con Cycles (path tracing GPU) o Eevee (real-time). GPU es la variable clave — configuraciones optimizadas por tipo de trabajo.",
    metaTitle: "Workstation para Blender / 3D render | Bartez Tecnología",
    metaDescription:
      "Workstations para Blender con GPU NVIDIA RTX (OptiX / Cycles), Threadripper o Xeon, 64–256 GB RAM y storage NVMe para escenas grandes.",
    keywords: ["workstation Blender", "PC para render 3D", "Cycles GPU render", "Blender Argentina"],
    recommendedConfig: {
      cpu: "AMD Ryzen 9 7950X o Threadripper 7000 (según presupuesto)",
      ram: "64 GB DDR5 base (128–256 GB para escenas complejas)",
      gpu: "NVIDIA RTX 4080 SUPER / RTX 5000 Ada (OptiX + VRAM 16+ GB)",
      storage: "SSD NVMe 2 TB + HDD 8 TB para archivo de proyectos",
    },
    bullets: [
      { title: "GPU con NVIDIA OptiX", desc: "Cycles con OptiX (exclusivo NVIDIA RTX) acelera path tracing significativamente frente a CUDA solo o CPU. Es la aceleración más importante en render." },
      { title: "VRAM abundante", desc: "Escenas con muchas texturas, geometrías densas o simulaciones necesitan VRAM. 16 GB permite proyectos complejos; 24 GB (RTX 5000 Ada) para producción intensiva." },
      { title: "CPU para simulaciones y viewport", desc: "Aunque el render usa GPU, la CPU sigue siendo crítica para simulaciones de fluidos/particles y viewport interactivo. Threadripper para producción sostenida." },
      { title: "RAM según complejidad de escena", desc: "64 GB para trabajo estándar; 128-256 GB para escenas grandes, motion graphics complejos o composición pesada en el mismo pipeline." },
      { title: "Workstation vs gamer", desc: "En producción sostenida (renders de horas) una workstation con RTX Ada tiene drivers ISV, refrigeración y estabilidad frente a una RTX gaming." },
    ],
    compareModels: [
      { brand: "Dell", model: "Precision 3680 / 5680", note: "RTX 4000/5000 Ada, ampliable" },
      { brand: "HP", model: "Z4 G5 / Z6 G5", note: "Xeon W-2400/3400, GPU profesional" },
      { brand: "Lenovo", model: "ThinkStation P5 / P7", note: "Threadripper PRO opcional" },
    ],
    faqs: [
      { q: "¿Cycles CUDA o OptiX?", a: "OptiX cuando la GPU es NVIDIA RTX (Turing en adelante). Es notablemente más rápido que CUDA y usa denoising acelerado por hardware." },
      { q: "¿Cuánta VRAM necesito?", a: "8 GB alcanza para proyectos moderados. Producción con texturas 4K, geometrías densas o simulaciones requiere 16 GB o más. Para producción profesional apuntamos a 24 GB (RTX 5000 Ada)." },
      { q: "¿AMD Radeon Pro sirve?", a: "Sí, con HIP como backend, pero el ecosistema NVIDIA (OptiX + soporte de plugins) sigue siendo más maduro para Blender. Recomendamos NVIDIA salvo requerimiento específico." },
    ],
  },
  {
    slug: "davinci-resolve",
    softwareName: "DaVinci Resolve Studio",
    vendor: "Blackmagic Design",
    icon: Film,
    useCase: "Edición y color 4K/6K/8K",
    h1: "Workstations para DaVinci Resolve Studio en Argentina.",
    intro:
      "Configuraciones para DaVinci Resolve Studio: edición multi-cam, color grading avanzado, VFX con Fusion y Fairlight. Resolve depende fuertemente de GPU — a más resolución y capas de nodos, más VRAM y potencia gráfica.",
    metaTitle: "Workstation para DaVinci Resolve Studio | Bartez Tecnología",
    metaDescription:
      "Workstations para DaVinci Resolve Studio con GPU NVIDIA RTX de alta VRAM, storage NVMe rápido y RAM ECC para edición 4K, 6K y 8K.",
    keywords: ["workstation DaVinci Resolve", "PC para edición 4K 6K 8K", "color grading workstation", "Resolve Studio Argentina"],
    recommendedConfig: {
      cpu: "Intel Xeon W-2400 / Core i9 o AMD Ryzen 9 (16+ núcleos)",
      ram: "64 GB DDR5 ECC base (128 GB para 6K/8K)",
      gpu: "NVIDIA RTX 4500 Ada / RTX 5000 Ada (24 GB VRAM)",
      storage: "SSD NVMe 2 TB (SO) + NVMe 4 TB (media cache) + HDD 12 TB o RAID para media",
      display: "27\"+ 4K DCI-P3 calibrado (opcional monitor de referencia)",
    },
    bullets: [
      { title: "GPU con VRAM alta", desc: "Resolve escala directamente con VRAM. 24 GB permite trabajar en timelines 6K/8K con múltiples capas de color y efectos sin bajar calidad de proxy." },
      { title: "Multi-storage NVMe", desc: "Media cache y timeline requieren I/O muy rápido. NVMe dedicado a cache separado del NVMe del SO evita caídas de framerate durante edición." },
      { title: "Preparado para DeckLink", desc: "Configuramos slots PCIe libres para tarjetas Blackmagic DeckLink cuando se trabaja con monitor de referencia broadcast." },
      { title: "Calibración de color", desc: "Coordinamos monitor 4K DCI-P3 calibrado como opción cuando el flujo lo requiere (correspondencia con post-producción)." },
      { title: "Renderizado y export", desc: "El render final se beneficia de GPU alta gama + CPU multi-núcleo. Configuramos según si el flujo prioriza velocidad de edición o de render." },
    ],
    compareModels: [
      { brand: "Dell", model: "Precision 5680 / 7960", note: "Xeon W-3400, RTX 4500/5000 Ada" },
      { brand: "HP", model: "Z6 G5 A / Z8 Fury", note: "Xeon W-2400/3400, chasis para storage y GPU" },
      { brand: "Lenovo", model: "ThinkStation P5 / P7", note: "Xeon W-2400/3400, PCIe para DeckLink" },
    ],
    faqs: [
      { q: "¿Qué GPU para 4K?", a: "RTX 4000 Ada (16 GB) o superior. Para 6K/8K con muchos nodos vamos a RTX 4500/5000 Ada (24 GB) para tener margen." },
      { q: "¿Necesito RAM ECC?", a: "Recomendado en producción sostenida — protege contra errores de memoria en renders largos. En workstations de gama corporativa (Precision, Z, ThinkStation) es opción estándar." },
      { q: "¿AMD Threadripper es opción?", a: "Sí. Threadripper PRO 7000 ofrece muchos núcleos y líneas PCIe generosas para GPU + storage — muy buena opción para edición 8K profesional." },
    ],
  },
  {
    slug: "ansys",
    softwareName: "ANSYS",
    vendor: "Ansys Inc.",
    icon: Wrench,
    useCase: "Simulación FEA / CFD",
    h1: "Workstations para ANSYS (Mechanical / Fluent / CFX) en Argentina.",
    intro:
      "Configuraciones para simulación ingenieril con ANSYS: FEA, CFD y multiphysics. Simulaciones pesadas exigen CPU con muchos núcleos, RAM ECC abundante y storage NVMe rápido. Coordinamos también servidores dedicados para HPC cuando la escala lo requiere.",
    metaTitle: "Workstation para ANSYS (FEA / CFD) | Bartez Tecnología",
    metaDescription:
      "Dell Precision, HP Z y Lenovo ThinkStation para ANSYS Mechanical, Fluent y CFX: 32-64 núcleos, 256+ GB RAM ECC, storage NVMe y opción HPC.",
    keywords: ["workstation ANSYS", "PC para simulación FEA", "ANSYS Fluent CFD Argentina", "estación ingeniería simulación"],
    recommendedConfig: {
      cpu: "AMD Threadripper PRO 7985WX / 7995WX (64+ núcleos) o dual Xeon Scalable",
      ram: "256 GB DDR5 ECC base (512 GB–1 TB para modelos grandes CFD)",
      gpu: "NVIDIA RTX A5000 / RTX 5000 Ada (aceleración GPU cuando aplica)",
      storage: "SSD NVMe 4 TB para archivos de solver + HDD 16 TB para archivo",
    },
    bullets: [
      { title: "Muchos núcleos y RAM abundante", desc: "Solvers de ANSYS paralelizan muy bien. 64 núcleos con 512 GB de RAM ECC permiten simulaciones significativamente más grandes que una workstation estándar." },
      { title: "RAM ECC crítica", desc: "Simulaciones de horas o días requieren corrección de errores de memoria. Un bit invertido invalida el resultado — ECC no es opcional." },
      { title: "Storage NVMe generoso", desc: "Los archivos de solver pueden pesar cientos de GB. NVMe rápido evita que I/O sea el cuello de botella." },
      { title: "Servidores para HPC cuando escala", desc: "Cuando el proyecto excede una workstation, cotizamos servidores rack en cluster con MPI o soluciones híbridas coordinadas con IT del cliente." },
      { title: "Licencias y HPC packs", desc: "ANSYS requiere HPC packs para escalar núcleos más allá de un límite. Podemos orientar sobre dimensionamiento coordinando con el partner Ansys del cliente." },
    ],
    compareModels: [
      { brand: "Dell", model: "Precision 7875 / 7960", note: "Threadripper PRO o Xeon W-3400, hasta 2 TB RAM" },
      { brand: "HP", model: "Z8 Fury G5", note: "Doble Xeon Scalable, hasta 4 TB RAM ECC" },
      { brand: "Lenovo", model: "ThinkStation PX / P8", note: "Dual Xeon Scalable o Threadripper PRO" },
    ],
    faqs: [
      { q: "¿Workstation o servidor?", a: "Depende de la escala. Un modelo mediano corre bien en workstation de 64 núcleos + 512 GB. Modelos grandes de CFD o transient dynamics justifican servidor dedicado o cluster." },
      { q: "¿ANSYS usa GPU?", a: "Algunos módulos aceleran con GPU (Fluent, Discovery, Mechanical con algunos solvers). Configuramos GPU profesional aunque el peso principal cae en CPU y RAM." },
      { q: "¿Dual Xeon vs Threadripper?", a: "Threadripper PRO ofrece muy alta densidad de núcleos en un solo socket con menor complejidad. Dual Xeon aporta más RAM total y flexibilidad HPC. Lo evaluamos según licencias y tipo de simulación." },
    ],
  },
];

export function getWorkstationSoftware(slug: string): WorkstationSoftware | undefined {
  return workstationsSoftware.find((item) => item.slug === slug);
}

// Icono de fallback para el listado.
export const genericSoftwareIcon: LucideIcon = Cpu;
