import type { Lead } from "../schema.ts";
import type { IntegrationResult, LeadSink } from "./types.ts";

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

// Defaults del board "Leads Web Bartez" (no son secretos). Sobreescribibles por env.
const BOARD = process.env.MONDAY_BOARD_ID || "18418630086";
const GROUP = process.env.MONDAY_GROUP_ID || "topics";
const COL = {
  empresa: process.env.MONDAY_COL_EMPRESA || "text_mm4gmwsf",
  email: process.env.MONDAY_COL_EMAIL || "email_mm4gfs0f",
  telefono: process.env.MONDAY_COL_TELEFONO || "phone_mm4gxh5s",
  tipo: process.env.MONDAY_COL_TIPO || "color_mm4g97d1",
  mensaje: process.env.MONDAY_COL_MENSAJE || "long_text_mm4gda50",
  estado: process.env.MONDAY_COL_ESTADO || "color_mm4gyw76",
};

const tipoLabel: Record<Lead["tipoConsulta"], string> = {
  cotizacion: "Cotización",
  asesoramiento: "Asesoramiento",
  cuenta: "Cuenta corporativa",
};

export const mondaySink: LeadSink = {
  name: "monday.com",
  durable: true,
  isConfigured() {
    return Boolean(process.env.MONDAY_API_TOKEN);
  },
  async handle(lead: Lead): Promise<IntegrationResult> {
    if (!this.isConfigured()) {
      return { name: this.name, ok: false, skipped: true, detail: "MONDAY_API_TOKEN ausente" };
    }
    try {
      const boardId = BOARD;
      const groupId = GROUP;

      const colVals: Record<string, unknown> = {};
      const set = (id: string, value: unknown) => {
        colVals[id] = value;
      };
      const itemsText = lead.items?.length
        ? "Pedido: " +
          lead.items.map((it) => `${it.label}${it.variant ? ` (${it.variant})` : ""} x${it.qty ?? 1}`).join("; ") +
          (lead.urgencia ? ` | Urgencia: ${lead.urgencia}` : "")
        : "";
      const mensaje = [itemsText, lead.mensaje].filter(Boolean).join("\n");

      set(COL.empresa, lead.empresa);
      set(COL.email, { email: lead.email, text: lead.email });
      set(COL.telefono, lead.telefono || "");
      set(COL.tipo, { label: tipoLabel[lead.tipoConsulta] });
      set(COL.mensaje, mensaje);
      set(COL.estado, { label: "Nuevo" });

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
