import type { Lead } from "../schema";
import type { IntegrationResult, LeadSink } from "./types";

/**
 * monday.com adapter — crea un item en el board "Leads Web Bartez".
 *
 * Env:
 *  - MONDAY_API_TOKEN
 *  - MONDAY_BOARD_ID            (id del board "Leads Web Bartez")
 *  - MONDAY_GROUP_ID            (opcional, grupo destino; default "topics")
 *  - MONDAY_COL_EMPRESA, MONDAY_COL_EMAIL, MONDAY_COL_TIPO,
 *    MONDAY_COL_TELEFONO, MONDAY_COL_MENSAJE, MONDAY_COL_ESTADO   (ids de columnas)
 *
 * Los ids de columnas se obtienen una vez creado el board (ver README / setup).
 * Si faltan, el item igual se crea sólo con el nombre.
 */
const API = "https://api.monday.com/v2";

const tipoLabel: Record<Lead["tipoConsulta"], string> = {
  cotizacion: "Cotización",
  asesoramiento: "Asesoramiento",
  cuenta: "Cuenta corporativa",
};

export const mondaySink: LeadSink = {
  name: "monday.com",
  isConfigured() {
    return Boolean(process.env.MONDAY_API_TOKEN && process.env.MONDAY_BOARD_ID);
  },
  async handle(lead: Lead): Promise<IntegrationResult> {
    if (!this.isConfigured()) {
      return { name: this.name, ok: false, skipped: true, detail: "MONDAY_API_TOKEN/BOARD_ID ausentes" };
    }
    try {
      const boardId = process.env.MONDAY_BOARD_ID!;
      const groupId = process.env.MONDAY_GROUP_ID || "topics";

      const colVals: Record<string, unknown> = {};
      const set = (env: string | undefined, value: unknown) => {
        if (env) colVals[env] = value;
      };
      set(process.env.MONDAY_COL_EMPRESA, lead.empresa);
      set(process.env.MONDAY_COL_EMAIL, { email: lead.email, text: lead.email });
      set(process.env.MONDAY_COL_TELEFONO, lead.telefono || "");
      set(process.env.MONDAY_COL_TIPO, { label: tipoLabel[lead.tipoConsulta] });
      set(process.env.MONDAY_COL_MENSAJE, lead.mensaje || "");
      set(process.env.MONDAY_COL_ESTADO, { label: "Nuevo" });

      const query = `mutation ($board: ID!, $group: String, $name: String!, $cols: JSON!) {
        create_item(board_id: $board, group_id: $group, item_name: $name, column_values: $cols) { id }
      }`;

      const res = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.MONDAY_API_TOKEN!,
          "API-Version": "2024-01",
        },
        body: JSON.stringify({
          query,
          variables: {
            board: boardId,
            group: groupId,
            name: `${lead.empresa} — ${lead.nombre}`,
            cols: JSON.stringify(colVals),
          },
        }),
      });
      const json = await res.json();
      if (json.errors) {
        return { name: this.name, ok: false, detail: JSON.stringify(json.errors).slice(0, 160) };
      }
      return { name: this.name, ok: true, detail: `Item creado (${json.data?.create_item?.id})` };
    } catch (e) {
      return { name: this.name, ok: false, detail: (e as Error).message };
    }
  },
};
