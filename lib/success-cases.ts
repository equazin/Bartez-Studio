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
 * `logoUrl` queda en null hasta contar con el archivo real del cliente
 * (público, en /public/logos/clientes/). Mientras tanto la UI usa un
 * wordmark tipográfico como identidad visual — nunca una foto de stock
 * genérica haciendo de "logo".
 *
 * Cada caso está publicado con autorización del cliente.
 */
import type { DynamicSuccessCase } from "./db-content.ts";

export const staticSuccessCases: DynamicSuccessCase[] = [
  {
    id: 9001,
    clientName: "Supermercados La Reina",
    industry: "Retail — supermercados",
    relationship: "puntual",
    title: "PCs para los puestos de facturación de la nueva sucursal en Funes",
    description:
      "La Reina abría una sucursal en Funes y necesitaba las PCs de todos los puestos de caja listas antes del día de apertura. El sistema de facturación ya lo tenían — nuestro alcance fue el hardware: equipos, entrega y puesta en marcha a tiempo.",
    logoUrl: "/logos/clientes/la-reina.png",
    coverImage: "/photos/products/desktop.jpg",
    metrics: ["Proyecto puntual", "Apertura de sucursal", "PCs de checkout"],
    content: [
      "La Reina estaba por abrir una nueva sucursal en Funes y tenía una fecha de apertura fija. El sistema de facturación que usan en el resto de la cadena ya estaba definido — lo que faltaba era el hardware para que cada puesto de caja pudiera facturar desde el primer día.",
      "Cotizamos las PCs de escritorio para todos los puestos, coordinamos la entrega con el cronograma de obra de la sucursal y dejamos los equipos instalados y probados con el software de facturación antes de la apertura.",
      "El día de apertura, todos los puestos de caja facturaron sin intervención técnica. Fue un pedido acotado y con fecha límite clara — el tipo de proyecto donde cumplir el plazo es la parte que más importa.",
    ].join("\n\n"),
  },
  {
    id: 9002,
    clientName: "Cormetal",
    industry: "Industria — metalurgia",
    relationship: "recurrente",
    cadence: "Cada 3 meses",
    title: "Renovación trimestral de estaciones para diseño y corte de caños",
    description:
      "Cormetal no es un proyecto cerrado: es una cuenta activa. Cada 3 meses relevamos qué puesto necesita actualizarse — diseño en AutoCAD, cálculo o las estaciones que manejan el corte de caños — y armamos la reposición de ese ciclo.",
    logoUrl: "/logos/clientes/cormetal.png",
    coverImage: "/photos/products/desktop.jpg",
    metrics: ["Cliente activo", "Renovación cada 3 meses", "Estaciones para AutoCAD"],
    content: [
      "Cormetal trabaja con equipos de diseño en AutoCAD y estaciones específicas para el cálculo y corte de caños. En lugar de renovar todo junto y quedarse después varios años con hardware envejecido, definieron con nosotros un ciclo de reposición cada 3 meses: se actualiza lo que hace falta, cuando hace falta.",
      "En cada ciclo relevamos qué puesto está quedando corto — no es la misma exigencia diseñar en AutoCAD que correr el software de corte — y armamos la configuración específica para ese caso: procesador, RAM y GPU según el uso real del puesto.",
      "Es una cuenta en curso, no un proyecto con fecha de cierre. Coordinamos entrega, imagen del equipo y baja del hardware saliente en cada ciclo, para que el área técnica de Cormetal no tenga que gestionar la logística de renovación.",
    ].join("\n\n"),
  },
  {
    id: 9003,
    clientName: "Federada Salud",
    industry: "Salud — obra social",
    relationship: "recurrente",
    cadence: "Compras semestrales",
    title: "Renovación de switches Aruba por sector, en compras semestrales",
    description:
      "Federada Salud compra equipamiento de red en ciclos semestrales, sector por sector. El más reciente fue la renovación completa a switches Aruba serie 6200 — variantes de 24 y 48 puertos PoE según la densidad de cada sector.",
    logoUrl: "/logos/clientes/federada-salud.png",
    coverImage: "/photos/products/switch.jpg",
    metrics: ["Cliente activo", "Switches Aruba 6200", "24 y 48 puertos PoE"],
    content: [
      "Federada Salud no encara la renovación de red como un proyecto único: compra equipamiento en ciclos semestrales, sector por sector, según el estado de la infraestructura de cada área. Es una cuenta que viene de varios ciclos de compra con nosotros.",
      "En el ciclo más reciente, el foco fue estandarizar todo el switching a Aruba serie 6200: modelos de 24 y 48 puertos PoE según la densidad de cada sector, para tener una plataforma administrable homogénea en toda la organización.",
      "Cotizamos el equipamiento con condiciones B2B y factura A, coordinamos la logística por sector para no interrumpir la operación de la obra social, y acompañamos la puesta en marcha de cada tramo. La relación sigue activa para los próximos ciclos de compra.",
    ].join("\n\n"),
  },
];
