import { tool } from "ai";
import { z } from "zod";
import { getDb } from "../db";

// ---------------------------------------------------------------------------
// Copiloto interno — herramientas con acceso a datos reales del negocio
// AI SDK v6: inputSchema (no parameters), execute recibe el objeto inferido.
// ---------------------------------------------------------------------------

export const COPILOT_SYSTEM_PROMPT = `
Sos el Copiloto de Sistema Bartez, asistente de IA para el equipo interno de Bartez Tecnología.
Tenés acceso a los datos reales del negocio a través de herramientas. Cuando te pregunten datos, usá las herramientas disponibles antes de responder.

Reglas:
- Respondé en español rioplatense, de forma directa y concisa.
- Cuando necesités datos del sistema, llamá la herramienta correspondiente.
- Si la pregunta combina datos de varias áreas, llamá múltiples herramientas.
- Formateá los montos con $ para ARS o USD según corresponda.
- Para fechas, usá formato "DD/MM/YYYY".
- No inventes datos que no vengan de las herramientas.
- Sugerí próximas acciones concretas cuando sea relevante.
`.trim();

export function getCopilotTools() {
  const db = getDb();

  const resumen_kpi = tool({
    description: "Obtiene los KPIs principales del negocio: leads, presupuestos, pedidos, facturas y actividades pendientes.",
    inputSchema: z.object({}),
    execute: async () => {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);

      const [
        totalLeads, newLeadsMonth, activeConvos,
        pendingQuotes, pendingOrders,
        invoicesMonth, activitiesOverdue, activitiesToday,
      ] = await Promise.all([
        db.lead.count().catch(() => 0),
        db.lead.count({ where: { createdAt: { gte: startOfMonth } } }).catch(() => 0),
        db.waConversation.count({ where: { status: "active" } }).catch(() => 0),
        db.quote.count({ where: { status: "draft" } }).catch(() => 0),
        db.salesOrder.count({ where: { status: { in: ["confirmed", "in_preparation"] } } }).catch(() => 0),
        db.invoice.findMany({ where: { issueDate: { gte: startOfMonth } }, select: { total: true } }).catch(() => [] as { total: unknown }[]),
        db.activity.count({ where: { status: "pending", dueAt: { lt: today } } }).catch(() => 0),
        db.activity.count({ where: { status: "pending", dueAt: { gte: today, lt: tomorrow } } }).catch(() => 0),
      ]);

      const revenueMonth = (invoicesMonth as { total: unknown }[])
        .reduce((s, i) => s + Number(i.total ?? 0), 0);

      return {
        leads: { total: totalLeads, nuevosEsteMes: newLeadsMonth, conversacionesWaActivas: activeConvos },
        ventas: { presupuestosBorrador: pendingQuotes, pedidosPendientes: pendingOrders },
        finanzas: { facturadoEsteMes: revenueMonth },
        actividades: { vencidas: activitiesOverdue, hoy: activitiesToday },
      };
    },
  });

  const consultar_leads = tool({
    description: "Consulta leads filtrados por estado o empresa.",
    inputSchema: z.object({
      estado: z.string().optional().describe("Estado: nuevo | contactado | cotizado | negociacion | cerrado | perdido"),
      empresa: z.string().optional().describe("Buscar por nombre de empresa (parcial)"),
      limite: z.number().int().min(1).max(20).default(10),
    }),
    execute: async ({ estado, empresa, limite }) => {
      const leads = await db.lead.findMany({
        where: {
          ...(estado ? { status: estado } : {}),
          ...(empresa ? { company: { contains: empresa, mode: "insensitive" } } : {}),
        },
        orderBy: { createdAt: "desc" },
        take: limite,
        select: { id: true, name: true, company: true, email: true, phone: true, status: true, value: true, source: true, createdAt: true },
      }).catch(() => []);

      const total = await db.lead.count({
        where: {
          ...(estado ? { status: estado } : {}),
          ...(empresa ? { company: { contains: empresa, mode: "insensitive" } } : {}),
        },
      }).catch(() => 0);

      return {
        total,
        leads: leads.map((l) => ({ ...l, value: l.value ? Number(l.value) : null, createdAt: l.createdAt.toLocaleDateString("es-AR") })),
      };
    },
  });

  const consultar_ventas = tool({
    description: "Consulta presupuestos y pedidos de venta recientes.",
    inputSchema: z.object({
      tipo: z.enum(["presupuestos", "pedidos", "ambos"]).default("ambos"),
      estado: z.string().optional(),
      limite: z.number().int().min(1).max(10).default(5),
    }),
    execute: async ({ tipo, estado, limite }) => {
      const result: Record<string, unknown[]> = {};

      if (tipo === "presupuestos" || tipo === "ambos") {
        const quotes = await db.quote.findMany({
          where: estado ? { status: estado } : {},
          orderBy: { createdAt: "desc" },
          take: limite,
          select: { number: true, status: true, total: true, currency: true, createdAt: true, account: { select: { name: true } } },
        }).catch(() => []);
        result.presupuestos = quotes.map((q) => ({
          numero: q.number, estado: q.status, total: Number(q.total), moneda: q.currency,
          cuenta: q.account?.name ?? "—", fecha: q.createdAt.toLocaleDateString("es-AR"),
        }));
      }

      if (tipo === "pedidos" || tipo === "ambos") {
        const orders = await db.salesOrder.findMany({
          where: estado ? { status: estado } : {},
          orderBy: { createdAt: "desc" },
          take: limite,
          select: { number: true, status: true, total: true, currency: true, createdAt: true, account: { select: { name: true } } },
        }).catch(() => []);
        result.pedidos = orders.map((o) => ({
          numero: o.number, estado: o.status, total: Number(o.total), moneda: o.currency,
          cuenta: o.account?.name ?? "—", fecha: o.createdAt.toLocaleDateString("es-AR"),
        }));
      }

      return result;
    },
  });

  const consultar_finanzas = tool({
    description: "Consulta facturas emitidas y recibos de cobranza.",
    inputSchema: z.object({
      desde: z.string().optional().describe("Fecha desde YYYY-MM-DD"),
      hasta: z.string().optional().describe("Fecha hasta YYYY-MM-DD"),
      limite: z.number().int().min(1).max(10).default(5),
    }),
    execute: async ({ desde, hasta, limite }) => {
      const dateFilter = {
        ...(desde ? { gte: new Date(desde) } : {}),
        ...(hasta ? { lte: new Date(hasta) } : {}),
      };
      const hasDate = Object.keys(dateFilter).length > 0;

      const [invoices, receipts] = await Promise.all([
        db.invoice.findMany({
          where: hasDate ? { issueDate: dateFilter } : {},
          orderBy: { issueDate: "desc" },
          take: limite,
          select: { number: true, status: true, total: true, currency: true, issueDate: true, account: { select: { name: true } } },
        }).catch(() => []),
        db.receipt.findMany({
          where: hasDate ? { receivedAt: dateFilter } : {},
          orderBy: { receivedAt: "desc" },
          take: limite,
          select: { number: true, amount: true, currency: true, receivedAt: true, method: true, account: { select: { name: true } } },
        }).catch(() => []),
      ]);

      return {
        totalFacturado: invoices.reduce((s, i) => s + Number(i.total ?? 0), 0),
        facturas: invoices.map((i) => ({
          numero: i.number, estado: i.status, importe: Number(i.total), moneda: i.currency,
          cuenta: i.account?.name ?? "—", fecha: i.issueDate.toLocaleDateString("es-AR"),
        })),
        recibos: receipts.map((r) => ({
          numero: r.number, importe: Number(r.amount), moneda: r.currency, metodo: r.method,
          cuenta: r.account?.name ?? "—", fecha: r.receivedAt.toLocaleDateString("es-AR"),
        })),
      };
    },
  });

  const consultar_actividades = tool({
    description: "Consulta actividades y tareas pendientes o vencidas.",
    inputSchema: z.object({
      filtro: z.enum(["hoy", "semana", "vencidas", "todas"]).default("hoy"),
      limite: z.number().int().min(1).max(20).default(10),
    }),
    execute: async ({ filtro, limite }) => {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
      const nextWeek = new Date(today); nextWeek.setDate(nextWeek.getDate() + 7);

      const dueAtFilter =
        filtro === "hoy" ? { gte: today, lt: tomorrow } :
        filtro === "semana" ? { gte: today, lt: nextWeek } :
        filtro === "vencidas" ? { lt: today } :
        undefined;

      const activities = await db.activity.findMany({
        where: { status: "pending", ...(dueAtFilter ? { dueAt: dueAtFilter } : {}) },
        orderBy: { dueAt: "asc" },
        take: limite,
        select: { type: true, subject: true, dueAt: true, account: { select: { name: true } } },
      }).catch(() => []);

      return activities.map((a) => ({
        tipo: a.type, asunto: a.subject, cuenta: a.account?.name ?? "—",
        vence: a.dueAt ? a.dueAt.toLocaleDateString("es-AR") : "sin fecha",
      }));
    },
  });

  const consultar_stock = tool({
    description: "Consulta el stock disponible y alertas de reposición.",
    inputSchema: z.object({
      soloAlertas: z.boolean().default(false),
      buscar: z.string().optional().describe("Buscar por nombre o SKU del producto"),
      limite: z.number().int().min(1).max(20).default(10),
    }),
    execute: async ({ soloAlertas, buscar, limite }) => {
      const items = await db.stockItem.findMany({
        where: buscar ? { product: { OR: [{ name: { contains: buscar, mode: "insensitive" } }, { sku: { contains: buscar, mode: "insensitive" } }] } } : {},
        orderBy: { quantity: "asc" },
        take: limite,
        select: { quantity: true, reorderPoint: true, product: { select: { name: true, sku: true } }, warehouse: { select: { name: true } } },
      }).catch(() => []);

      const mapped = items.map((s) => ({
        producto: s.product?.name ?? "—",
        sku: s.product?.sku ?? "—",
        deposito: s.warehouse?.name ?? "—",
        cantidad: Number(s.quantity),
        puntoReorden: s.reorderPoint ? Number(s.reorderPoint) : null,
        alerta: s.reorderPoint ? Number(s.quantity) <= Number(s.reorderPoint) : false,
      }));

      return soloAlertas ? mapped.filter((m) => m.alerta) : mapped;
    },
  });

  return { resumen_kpi, consultar_leads, consultar_ventas, consultar_finanzas, consultar_actividades, consultar_stock };
}
