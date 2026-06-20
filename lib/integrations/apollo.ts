import type { Lead } from "../schema";
import type { IntegrationResult, LeadSink } from "./types";

/**
 * Apollo adapter — crea una cuenta (empresa) y un contacto a partir del lead,
 * con tags de segmentación (lead-web-bartez, rosario-300km).
 *
 * Runtime usa la REST API de Apollo con APOLLO_API_KEY.
 * Si la key no está, se marca skipped (no rompe el flujo).
 * Docs: https://docs.apollo.io/reference
 */
const API = "https://api.apollo.io/v1";
const TAGS = ["lead-web-bartez", "rosario-300km"];

export const apolloSink: LeadSink = {
  name: "Apollo.io",
  isConfigured() {
    return Boolean(process.env.APOLLO_API_KEY);
  },
  async handle(lead: Lead): Promise<IntegrationResult> {
    if (!this.isConfigured()) {
      return { name: this.name, ok: false, skipped: true, detail: "APOLLO_API_KEY ausente" };
    }
    const apiKey = process.env.APOLLO_API_KEY!;
    const headers = {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
      "X-Api-Key": apiKey,
    };
    try {
      const domain = lead.email.split("@")[1] ?? "";

      // 1) Crear/actualizar cuenta (empresa)
      const accountRes = await fetch(`${API}/accounts`, {
        method: "POST",
        headers,
        body: JSON.stringify({ name: lead.empresa, domain }),
      });
      const account = await accountRes.json().catch(() => ({}));
      const accountId = account?.account?.id;

      // 2) Crear/actualizar contacto
      const [first, ...rest] = lead.nombre.trim().split(" ");
      const contactRes = await fetch(`${API}/contacts`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          first_name: first,
          last_name: rest.join(" ") || "-",
          email: lead.email,
          organization_name: lead.empresa,
          account_id: accountId,
          present_raw_address: "Rosario, Argentina",
          label_names: TAGS,
        }),
      });

      if (!contactRes.ok) {
        const txt = await contactRes.text();
        return { name: this.name, ok: false, detail: `HTTP ${contactRes.status}: ${txt.slice(0, 140)}` };
      }
      return { name: this.name, ok: true, detail: "Contacto y cuenta creados con tags" };
    } catch (e) {
      return { name: this.name, ok: false, detail: (e as Error).message };
    }
  },
};
