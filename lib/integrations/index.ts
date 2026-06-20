import type { Lead } from "../schema";
import type { IntegrationResult, LeadSink } from "./types";
import { apolloSink } from "./apollo";
import { mondaySink } from "./monday";
import { mailSink } from "./mail";
import { calendarSink } from "./calendar";

/**
 * Orquestador de captación de leads.
 * Corre todas las integraciones en paralelo, aisladas: el fallo de una
 * NO afecta a las demás. El lead nunca se pierde — siempre se loguea.
 */
const sinks: LeadSink[] = [apolloSink, mondaySink, mailSink, calendarSink];

export async function processLead(lead: Lead): Promise<{
  results: IntegrationResult[];
  anyConfigured: boolean;
}> {
  // Persistencia mínima garantizada (siempre): log estructurado.
  // En producción, reemplazar por un insert a DB/KV si se desea durabilidad.
  console.info("[lead]", JSON.stringify({ ...lead, mensaje: lead.mensaje?.slice(0, 200) }));

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
  return { results, anyConfigured };
}
