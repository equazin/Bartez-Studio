import type { Lead } from "../schema";
import type { IntegrationResult, LeadSink } from "./types";

/**
 * Calendar adapter — el campo "Agendar reunión" del form.
 *
 * No hay MCP de Google Calendar disponible, así que este adapter queda
 * preparado para enchufar Cal.com o la Google Calendar API por env:
 *  - CALENDAR_PROVIDER = "calcom" | "google" (futuro)
 *  - CALCOM_BOOKING_URL para el modo link
 *
 * Comportamiento por defecto: si el lead pidió reunión pero no hay provider,
 * se reporta como "preferencia registrada" (la intención queda en monday/mail)
 * y NO se considera un fallo.
 */
export const calendarSink: LeadSink = {
  name: "Agenda de reunión",
  isConfigured() {
    return Boolean(process.env.CALENDAR_PROVIDER);
  },
  async handle(lead: Lead): Promise<IntegrationResult> {
    if (!lead.agendarReunion) {
      return { name: this.name, ok: true, skipped: true, detail: "No solicitó reunión" };
    }
    if (!this.isConfigured()) {
      // La intención queda registrada en monday/mail; no es un error.
      return { name: this.name, ok: true, detail: "Reunión solicitada — preferencia registrada (sin provider)" };
    }
    // Punto de extensión: integrar Cal.com / Google Calendar API.
    return { name: this.name, ok: true, detail: "Reunión a coordinar por el equipo comercial" };
  },
};

/** URL pública de reserva para el front (Cal.com), si está configurada. */
export function getBookingUrl(): string | null {
  return process.env.NEXT_PUBLIC_CALCOM_BOOKING_URL || null;
}
