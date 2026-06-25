# Sistema Bartez — ERP modular multi-tenant con IA

> Hoja de ruta maestra del sistema. Define la arquitectura, el mapa de módulos y el orden de implementación para convertir el `/admin` actual en un ERP completo tipo Tango, web-native y con IA.

---

## Contexto

Bartez arrancó como sitio institucional + bot de WhatsApp. El `/admin` evolucionó a "Sistema Bartez" con CRM, analytics, auditoría y notificaciones. El siguiente paso es convertirlo en un **ERP completo**.

Decisiones de negocio que definen la arquitectura:

- **Inventario mixto:** productos en stock propio + productos bajo pedido / drop-ship. El ERP soporta los dos flujos.
- **Facturación AFIP crítica y temprana:** emitir comprobantes electrónicos (facturas, NC/ND, remitos) desde el sistema en fase temprana.
- **SaaS multi-tenant desde el inicio:** se construye multi-empresa desde el día 1 para ofrecerlo como producto a otros negocios. Toda tabla de negocio se scopea a una organización.

**Outcome:** un ERP modular, flexible, escalable, con onboarding/capacitación in-app y una capa de IA transversal, sobre el stack actual (Next.js 16, React 19, Prisma/PostgreSQL-Neon, Tailwind, Vercel AI Gateway).

---

## Principios de arquitectura (transversales)

1. **Multi-tenancy por `organizationId`.** Cada modelo de negocio lleva `organizationId` (FK a `Organization`) + índice. Todo acceso a datos pasa por un helper que inyecta el filtro de tenant — nunca una query sin scope. Reutiliza el singleton de `lib/db.ts`; se agrega `lib/tenant.ts` con `withTenant(db, orgId)`.
2. **RBAC (roles y permisos).** `Membership` vincula `User` ↔ `Organization` con un `role`. Permisos por módulo/acción vía `can(session, "ventas:invoice:create")`. Extiende el JWT de `lib/auth-token.ts` con `orgId` + `role`.
3. **Módulos desacoplados.** Cada módulo = `app/admin/(dashboard)/<modulo>/` + `app/api/admin/<modulo>/` + Zod en `lib/modules/<modulo>/schema.ts` + lógica en `lib/modules/<modulo>/`. Activables por organización (`Organization.enabledModules`).
4. **API uniforme.** Reusar `authorizeAdminRequest`, `readAdminJson`, `invalidAdminInput`, `adminOk` de `lib/admin-api.ts`; rate limiting de `lib/rate-limit.ts`; auditoría de `lib/audit.ts` (extender `AuditEntity` + agregar `organizationId`).
5. **Eventos de dominio.** Bus liviano `lib/events.ts` (in-process, persistido en `DomainEvent`) para desacoplar efectos: "venta confirmada" → descuenta stock + genera CxC + dispara IA de forecast. Permite escalar a colas (QStash/Inngest) sin reescribir.
6. **Multi-moneda.** Montos en `Decimal` + `currency` + tabla `ExchangeRate`. Los leads ya manejan `value` en USD — se normaliza.
7. **Numeración y comprobantes.** Tabla `Sequence` por organización + tipo de documento (presupuesto, pedido, factura A/B/C, remito) para folios correlativos.
8. **Soft-delete + auditoría inmutable.** `deletedAt` en entidades de negocio; el `AuditLog` registra toda mutación.

---

## Mapa de módulos

### Núcleo / Plataforma
- **Organizaciones & Tenancy** — alta de empresa, datos fiscales, branding, módulos habilitados.
- **Usuarios, Roles & Permisos (RBAC)** — invitaciones, multi-usuario, permisos granulares.
- **Configuración** — parámetros por empresa (monedas, impuestos, numeración, integraciones).
- **Auditoría** *(existe)* — extender a tenant-scoped.
- **Centro de notificaciones** *(toast existe)* — bandeja persistente + reglas (nuevo lead, factura vencida, stock bajo).

### Comercial / CRM *(parcialmente existe)*
- **Leads & Pipeline** *(existe)* — extender con asignación a usuario, actividades y tareas.
- **Cuentas & Contactos** — empresas + personas (unifica `Lead.company` y clientes de facturación).
- **Actividades / Agenda / Tareas** — llamadas, reuniones, recordatorios de seguimiento.
- **Oportunidades** — valor ponderado, probabilidad, forecast.

### Ventas
- **Catálogo de Productos & Servicios** — variantes, listas de precios, multi-moneda, marca/proveedor, flag stock vs. bajo pedido.
- **Presupuestos / Cotizaciones** — armado de ítems, PDF, envío por email/WhatsApp, conversión a pedido.
- **Pedidos de Venta** — estados (borrador→confirmado→preparación→entregado), reserva de stock, backorder para bajo pedido.
- **Facturación AFIP** — facturas A/B/C, NC/ND, remitos electrónicos vía WSFE (o servicio TusFacturas/Facturante). CAE, QR AFIP, PDF fiscal.
- **Cobranzas & Cuenta Corriente Clientes** — recibos, imputaciones, saldos, vencimientos.

### Compras / Abastecimiento
- **Proveedores** — datos, condiciones, cuenta corriente.
- **Órdenes de Compra** — para reponer stock o cubrir pedidos bajo pedido.
- **Recepción de Mercadería** — ingreso a depósito, vinculado a OC.
- **Pagos a Proveedores** — órdenes de pago, imputación.

### Inventario / Stock *(flujo mixto)*
- **Productos & Depósitos** — stock por depósito, múltiples ubicaciones.
- **Movimientos** — ingresos, egresos, transferencias, ajustes, con trazabilidad.
- **Lotes / Números de serie** — clave para hardware (BarPOS, equipos).
- **Reposición** — punto de pedido, alertas de stock bajo, sugerencia de OC.
- **Bajo pedido** — productos sin stock que disparan OC al confirmar venta.

### Finanzas / Tesorería
- **Cajas & Bancos** — movimientos, saldos, multi-moneda.
- **Cuentas por Cobrar / Pagar** — consolidado de CxC y CxP.
- **Conciliación bancaria.**
- **Export contable** — para el estudio contable (CSV/Excel, formato AFIP).

### Postventa / Soporte
- **Tickets & RMA** — devoluciones y reparaciones (ya existe el intent `rma` en WhatsApp).
- **Garantías** — por número de serie.
- **Base de conocimiento** — reutilizable por la IA del bot.

### Servicios / Proyectos *(instalaciones, configuración)*
- **Órdenes de Trabajo** — instalaciones, puestas en marcha, seguimiento técnico.

### Inteligencia / BI
- **Dashboards** *(analytics existe)* — extender a financiero + operativo.
- **Reportes configurables** — ventas, márgenes, cobranzas, rotación de stock.
- **KPIs** — conversión de pipeline, ticket promedio, DSO, forecast.

### Capacitación / Onboarding ("capacitivo")
- **Tours guiados in-app** — onboarding por módulo (primeros pasos).
- **Centro de ayuda / Academia** — guías, videos, FAQ contextual.
- **Plantillas & datos demo** — para que una empresa nueva arranque cargada.

### Integraciones *(pipeline existe)*
- **WhatsApp** *(existe)*, **Email** *(existe)*, **Apollo/Monday** *(existen)*.
- **AFIP** (nuevo, crítico).
- **Pasarela de pago** — MercadoPago (links de pago en facturas).
- **API pública + Webhooks** — para que terceros integren (clave para SaaS).

---

## Capa de IA (transversal, "AI-ready")

Sobre el Vercel AI Gateway ya integrado (`lib/whatsapp/ai-agent.ts`, modelo `anthropic/claude-haiku-4.5`). Se agrega `lib/ai/` con capacidades reutilizables por todos los módulos:

- **Copiloto interno** — chat en el admin para consultar datos en lenguaje natural ("¿cuánto facturé este mes?", "leads sin seguimiento hace 7 días") usando tool-calling sobre las APIs internas.
- **Lead scoring & next-best-action** — prioriza leads y sugiere el próximo paso.
- **Presupuestos asistidos** — arma una cotización a partir de la conversación de WhatsApp.
- **Resúmenes** — de conversaciones, cuentas, oportunidades.
- **Forecast de ventas** y **detección de anomalías** (caída de cobranzas, stock crítico).
- **Clasificación/extracción** — datos de leads y documentos (ya parcialmente en el bot).

Modelos por costo: Haiku 4.5 para tareas frecuentes/clasificación, Sonnet/Opus para razonamiento profundo (forecast, copiloto complejo).

---

## Modelo de datos — fundaciones a crear primero

Nuevos modelos núcleo en `prisma/schema.prisma` (todos con `organizationId` + índice):

- `Organization` — `id`, `name`, `taxId` (CUIT), `enabledModules Json`, branding, `createdAt`.
- `User` — credenciales, `name`, `email`. (Migra el admin único actual a un `User` dentro de una `Organization` semilla "Bartez".)
- `Membership` — `userId`, `organizationId`, `role`, permisos.
- `Sequence` — folios por organización + tipo de documento.
- `ExchangeRate` — cotizaciones por fecha/moneda.
- `DomainEvent` — bus de eventos persistido.

**Migración de lo existente:** `Lead`, `WaConversation`, `Post`, etc. reciben `organizationId` (default → org semilla "Bartez") para no romper datos actuales. Se hace con `prisma migrate` + script de backfill.

---

## Roadmap por fases

> Cada fase termina con `npx tsc --noEmit` verde, tests (`npm test`) en verde, y deploy a Vercel.

| Fase | Foco | Entrega |
|------|------|---------|
| **0** | **Fundaciones multi-tenant** *(habilitante)* | `Organization` / `User` / `Membership` / RBAC. `lib/tenant.ts`, `can()`, JWT extendido. Backfill con org semilla. |
| **1** | **Comercial 360** | Cuentas & Contactos, Actividades/Tareas/Agenda, asignación de leads, Oportunidades. |
| **2** | **Catálogo + Presupuestos** | Productos/Servicios con listas de precios multi-moneda. Presupuestos con PDF y envío por WhatsApp/email. Conversión a pedido. |
| **3** | **Inventario (mixto) + Pedidos** | Depósitos, stock, movimientos, lotes/series. Pedidos con reserva de stock y flujo bajo pedido → OC. |
| **4** | **Facturación AFIP + Cobranzas** *(crítico)* | WSFE/servicio fiscal, comprobantes con CAE, remitos, NC/ND. Cuenta corriente clientes y recibos. MercadoPago. |
| **5** | **Compras + Finanzas/Tesorería** | Proveedores, OC, recepción, pagos. Cajas/bancos, CxC/CxP, export contable. |
| **6** | **Postventa, Servicios y BI** | Tickets/RMA, garantías, órdenes de trabajo. Dashboards financieros y reportes configurables. |
| **7** | **IA + Onboarding + API pública** | Copiloto interno, scoring, forecast. Tours guiados y academia. API pública + webhooks (modelo SaaS). |

> **Alcance:** es un programa de varios meses. El multi-tenant (Fase 0) y AFIP (Fase 4) son los hitos de mayor riesgo/esfuerzo. Las fases son secuenciales pero dentro de cada una el trabajo es incremental y desplegable.

---

## Estructura repetible por módulo

```
prisma/schema.prisma                      # + modelos núcleo y por módulo
lib/tenant.ts                             # resolución de tenant + withTenant()
lib/rbac.ts                               # can(session, permiso)
lib/events.ts                             # bus de eventos de dominio
lib/modules/<modulo>/schema.ts            # Zod del módulo
lib/modules/<modulo>/service.ts           # lógica de negocio
app/api/admin/<modulo>/route.ts           # API (reusa lib/admin-api.ts)
app/admin/(dashboard)/<modulo>/page.tsx   # UI (reusa components/admin/AdminUI.tsx)
lib/ai/<capacidad>.ts                     # capacidades IA reutilizables
```

Se reutiliza el sistema de diseño existente: `AdminUI` (botones, inputs, tabla, paginación, búsqueda, toasts), `AdminShell` (navegación agrupada — se agregan grupos "Ventas", "Compras", "Inventario", "Finanzas"), tokens Tailwind (`brand`, `navy`, `sky`, etc.).

---

## Verificación

1. **Por fase:** `npx tsc --noEmit` sin errores + `npm test` en verde + deploy Vercel OK.
2. **Multi-tenant (Fase 0):** crear 2 organizaciones, confirmar aislamiento total de datos vía pruebas de API.
3. **Flujo comercial end-to-end (Fases 1–4):** lead por WhatsApp → cuenta/contacto → presupuesto → pedido → descuenta stock / genera OC bajo pedido → factura AFIP con CAE → recibo de cobranza. Verificar cada salto y el registro en auditoría.
4. **AFIP (Fase 4):** emitir en homologación una factura B y una NC, validar CAE y PDF con QR.
5. **IA (Fase 7):** el copiloto responde consultas reales sobre datos del tenant sin filtrar datos de otra organización.

---

## Estado actual (base ya construida)

- ✅ CRM de Leads con pipeline, búsqueda, paginación, CSV export
- ✅ Analytics con selector de período, tendencias y gráficos
- ✅ Auditoría con Prisma (`AuditLog`)
- ✅ Notificaciones toast + polling de nuevos leads
- ✅ Bot WhatsApp con IA (Claude Haiku 4.5 vía AI Gateway)
- ✅ Pipeline de integraciones (CRM, Apollo, Monday, Mail, Calendar, Archive)
- ✅ Sistema de diseño admin (`AdminUI`, `AdminShell`) con tokens de marca

**Próximo paso:** Fase 0 — fundaciones multi-tenant.
