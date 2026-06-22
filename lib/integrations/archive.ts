import type { Lead } from "../schema";
import type { IntegrationResult, LeadSink } from "./types";

/** Archivo durable genérico mediante un endpoint HTTP configurable. */
export const archiveSink: LeadSink = {
  name: "Archivo de leads",
  durable: true,
  isConfigured() {
    return Boolean(process.env.LEAD_STORE_URL);
  },
  async handle(lead: Lead): Promise<IntegrationResult> {
    if (!this.isConfigured()) {
      return { name: this.name, ok: false, skipped: true, detail: "LEAD_STORE_URL ausente" };
    }

    try {
      const response = await fetch(process.env.LEAD_STORE_URL!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.LEAD_STORE_TOKEN
            ? { Authorization: `Bearer ${process.env.LEAD_STORE_TOKEN}` }
            : {}),
        },
        body: JSON.stringify({ ...lead, receivedAt: new Date().toISOString(), source: "bartez-web" }),
        signal: AbortSignal.timeout(8_000),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return { name: this.name, ok: true, detail: "Lead archivado" };
    } catch (error) {
      return { name: this.name, ok: false, detail: (error as Error).message };
    }
  },
};
