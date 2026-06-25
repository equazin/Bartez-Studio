import type { Lead } from "../schema.ts";
import type { IntegrationResult, LeadSink } from "./types.ts";
import { getDb } from "../db.ts";

function mapSource(origen?: string): string {
  if (origen === "whatsapp") return "whatsapp";
  if (origen === "barpos") return "web";
  return "web";
}

function mapStatus(tipoConsulta: string): string {
  if (tipoConsulta === "cotizacion") return "nuevo";
  return "nuevo";
}

export const crmSink: LeadSink = {
  name: "crm",
  durable: true,

  isConfigured() {
    return Boolean(process.env.POSTGRES_PRISMA_URL);
  },

  async handle(lead: Lead): Promise<IntegrationResult> {
    if (!this.isConfigured()) return { name: "crm", ok: false, skipped: true, detail: "No database configured" };

    try {
      const existing = lead.telefono
        ? await getDb().lead.findFirst({ where: { phone: lead.telefono } })
        : null;

      if (existing) {
        await getDb().lead.update({
          where: { id: existing.id },
          data: {
            notes: existing.notes
              ? `${existing.notes}\n---\n${new Date().toISOString()}: ${lead.mensaje || lead.resumenIA || ""}`
              : `${new Date().toISOString()}: ${lead.mensaje || lead.resumenIA || ""}`,
            ...(lead.empresa !== "Sin especificar" && existing.company !== lead.empresa && { company: lead.empresa }),
          },
        });
        return { name: "crm", ok: true, detail: `Updated existing lead #${existing.id}` };
      }

      const created = await getDb().lead.create({
        data: {
          name: lead.nombre,
          company: lead.empresa === "Sin especificar" ? null : lead.empresa,
          email: lead.email.includes("@whatsapp.placeholder") ? null : lead.email,
          phone: lead.telefono || null,
          source: mapSource(lead.origen),
          status: mapStatus(lead.tipoConsulta),
          notes: lead.mensaje || lead.resumenIA || null,
          waId: lead.telefono || null,
        },
      });

      return { name: "crm", ok: true, detail: `Created lead #${created.id}` };
    } catch (err) {
      return { name: "crm", ok: false, detail: (err as Error).message };
    }
  },
};
