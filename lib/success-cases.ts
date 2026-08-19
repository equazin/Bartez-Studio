/**
 * Casos de éxito publicados como data estática (fallback).
 *
 * La fuente autoritativa son los casos cargados en el CRM/admin (tabla
 * `SuccessCase` de Prisma). Estos casos hardcoded se sirven cuando la DB
 * no está conectada o cuando la tabla todavía no tiene casos activos —
 * mismo patrón que usa `getDynamicArticles` con `constants.articles`.
 *
 * Los IDs empiezan en 9001 para no colisionar con IDs autogenerados por
 * la DB (que arranca en 1). Cuando el admin cargue un caso real, tomará
 * un ID bajo y no pisa a estos.
 *
 * Cada caso está publicado con autorización del cliente.
 */
import type { DynamicSuccessCase } from "./db-content.ts";

export const staticSuccessCases: DynamicSuccessCase[] = [
  {
    id: 9001,
    clientName: "Supermercados La Reina",
    title: "Apertura de sucursal en Funes: PCs corporativas para todas las cajas",
    description:
      "Proveímos las PCs corporativas para los puestos de facturación de la nueva sucursal de La Reina en Funes. Equipos dimensionados para el software de facturación que la cadena ya usa, coordinados con el cronograma de apertura para que las cajas trabajaran el primer día sin intervenciones.",
    logoUrl: null,
    coverImage: "/photos/products/desktop.jpg",
    metrics: ["Sucursal completa", "Cajas operativas día 1", "Retail — Funes"],
    content: [
      "Supermercados La Reina abría una nueva sucursal en Funes y necesitaba las PCs para todos los puestos de facturación antes de la apertura al público. El sistema de facturación es el que la cadena ya opera en el resto de sus sucursales — el alcance del pedido a Bartez fue puntualmente el hardware.",
      "Cotizamos las PCs de escritorio corporativas dimensionadas para el uso sostenido de checkout, coordinamos la entrega con el cronograma de obra y dejamos los equipos listos, configurados y probados antes del primer turno de ventas.",
      "El día de la apertura los puestos de caja trabajaron desde el minuto uno, sin sorpresas de última hora ni intervenciones técnicas en horario comercial. El pedido se ejecutó respetando los tiempos de apertura de la sucursal.",
    ].join("\n\n"),
  },
  {
    id: 9002,
    clientName: "Cormetal",
    title: "Ciclo trimestral de renovación de estaciones para AutoCAD y fabricación de caños",
    description:
      "Programa continuo con Cormetal: cada 3 meses cotizamos y proveemos nuevas workstations y actualizaciones para el equipo de diseño, cálculo y corte de caños. Configuraciones a medida por proyecto — RAM ECC, GPU profesional y CPU multicore según el software que el equipo esté usando en cada ciclo.",
    logoUrl: null,
    coverImage: "/photos/products/desktop.jpg",
    metrics: ["Renovación trimestral", "Workstations CAD", "Industria — metalurgia"],
    content: [
      "Cormetal opera con un flujo continuo de diseño y fabricación de caños que exige que las estaciones de trabajo sigan el ritmo del software (AutoCAD y herramientas específicas de diseño / corte). El equipo interno definió un ciclo de renovación trimestral para evitar cuellos de botella por hardware.",
      "En cada ciclo relevamos qué necesita cada puesto — no todos los perfiles son iguales — y armamos configuraciones específicas: workstations con Xeon o Threadripper, RAM ECC dimensionada por proyecto, GPU profesional certificada ISV y storage NVMe para archivos de trabajo pesados.",
      "El programa lleva varios ciclos consecutivos. Coordinamos entrega, imagen unificada y baja del equipo saliente cuando corresponde, para que el equipo de ingeniería no tenga que gestionar la logística de renovación.",
    ].join("\n\n"),
  },
  {
    id: 9003,
    clientName: "Federada Salud",
    title: "Renovación completa de switches Aruba en toda la red interna",
    description:
      "Reemplazamos la infraestructura de switching de Federada Salud por equipamiento Aruba: modelos 6200 con 24 y 48 puertos PoE para cubrir toda la organización. Plataforma administrable centralizada con capacidad PoE para access points y telefonía IP.",
    logoUrl: null,
    coverImage: "/photos/products/switch.jpg",
    metrics: ["Switches Aruba 6200", "24 y 48 puertos PoE", "Salud — obra social"],
    content: [
      "Federada Salud decidió modernizar la red interna con equipamiento Aruba en toda la organización. El alcance cubrió el reemplazo completo de los switches por modelos administrables de la línea 6200, en variantes de 24 y 48 puertos PoE según la densidad de cada sector.",
      "Cotizamos el equipamiento con condiciones B2B y factura A, coordinamos la logística de entrega y acompañamos técnicamente la puesta en marcha por sector para no interrumpir la operación de la obra social.",
      "La renovación dejó la red preparada para PoE de access points y teléfonos IP, con visibilidad centralizada de la plataforma Aruba y capacidad de expansión por sector según las necesidades futuras.",
    ].join("\n\n"),
  },
];
