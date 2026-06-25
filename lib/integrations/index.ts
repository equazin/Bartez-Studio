import type { Lead } from "../schema.ts";
import type { IntegrationResult, LeadSink } from "./types.ts";
import { apolloSink } from "./apollo.ts";
import { mondaySink } from "./monday.ts";
import { mailSink } from "./mail.ts";
import { calendarSink } from "./calendar.ts";
import { archiveSink } from "./archive.ts";
import { crmSink } from "./crm.ts";
import { createHash } from "node:crypto";

/**
 * Orquestador de captación de leads.
 * Corre todas las integraciones en paralelo, aisladas: el fallo de una
 * NO afecta a las demás. La API sólo confirma recepción cuando al menos
 * un destino durable conserva el lead.
 */
const sinks: LeadSink[] = [crmSink, archiveSink, apolloSink, mondaySink, mailSink, calendarSink];

export async function processLead(lead: Lead): Promise<{
  results: IntegrationResult[];
  anyConfigured: boolean;
  persisted: boolean;
}> {
  // Persistencia mínima garantizada (siempre): log estructurado.
  // En producción, reemplazar por un insert a DB/KV si se desea durabilidad.
  console.info("[lead_received]", JSON.stringify({
    id: createHash("sha256").update(lead.email.toLowerCase()).digest("hex").slice(0, 12),
    type: lead.tipoConsulta,
    source: lead.origen || "contact-form",
  }));

  const results = await Promise.all(
    sinks.map(async (s) => {
      try {
        return await s.handle(lead);
      } catch (e) {
        return { name: s.name, ok: false, detail: (e as Error).message } as IntegrationResult;
      }
    })
  );

  const anyConfigured = sinks.some((s) => s.isConfigured());
  const persisted = sinks.some((sink, index) => Boolean(sink.durable && results[index]?.ok));
  return { results, anyConfigured, persisted };
}
