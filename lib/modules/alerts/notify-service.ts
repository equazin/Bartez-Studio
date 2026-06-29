import { computeAlerts, type AlertsResult } from "./alerts-service.ts";
import { getOrgSettings } from "../settings/settings-service.ts";
import { sendTextMessage } from "../../whatsapp/sender.ts";
import { isConfigured as isWhatsAppConfigured } from "../../whatsapp/config.ts";
import { isMailConfigured, sendEmail } from "../../integrations/mail.ts";
import { logger } from "../../logger.ts";

/**
 * Notificaciones automáticas del centro de alertas.
 *
 * sendAlertsDigest: computa las alertas de la organización y, si hay alguna,
 * las envía por WhatsApp y/o email según la configuración (OrgSettings).
 * Es best-effort por canal: si uno falla, el otro igual se intenta.
 */

function money(currency: string, value: number): string {
  return `${currency} ${value.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function buildAlertsText(alerts: AlertsResult): string {
  const lines: string[] = [`🔔 *Alertas Bartez* (${alerts.counts.total})`];

  if (alerts.overdueInvoices.length > 0) {
    lines.push("", `🔴 *Cobranzas vencidas* (${alerts.overdueInvoices.length})`);
    for (const inv of alerts.overdueInvoices.slice(0, 8)) {
      lines.push(`• ${inv.number} — ${inv.receiverName}: ${money(inv.currency, inv.pending)} (${inv.daysOverdue}d)`);
    }
  }
  if (alerts.lowStock.length > 0) {
    lines.push("", `🟡 *Stock bajo* (${alerts.lowStock.length})`);
    for (const item of alerts.lowStock.slice(0, 8)) {
      lines.push(`• ${item.productName}: ${item.quantity} u. (repone en ${item.reorderPoint})`);
    }
  }
  if (alerts.pendingApprovals.length > 0) {
    lines.push("", `🔵 *OC a aprobar* (${alerts.pendingApprovals.length})`);
    for (const po of alerts.pendingApprovals.slice(0, 8)) {
      lines.push(`• ${po.number} — ${po.supplierName}: ${money(po.currency, po.total)}`);
    }
  }
  return lines.join("\n");
}

export function buildAlertsHtml(alerts: AlertsResult): string {
  const section = (title: string, color: string, rows: string[]) =>
    rows.length === 0 ? "" : `<h3 style="color:${color};margin:18px 0 6px">${title} (${rows.length})</h3><ul style="margin:0;padding-left:18px">${rows.map((r) => `<li>${r}</li>`).join("")}</ul>`;

  const inv = alerts.overdueInvoices.map((i) => `${i.number} — ${i.receiverName}: <b>${money(i.currency, i.pending)}</b> (${i.daysOverdue} días)`);
  const stock = alerts.lowStock.map((s) => `${s.productName}: <b>${s.quantity} u.</b> (repone en ${s.reorderPoint})`);
  const pos = alerts.pendingApprovals.map((p) => `${p.number} — ${p.supplierName}: <b>${money(p.currency, p.total)}</b>`);

  return `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto">
    <h2 style="margin:0 0 4px">🔔 Alertas operativas (${alerts.counts.total})</h2>
    <p style="color:#667;margin:0 0 8px">Resumen automático del sistema Bartez.</p>
    ${section("🔴 Cobranzas vencidas", "#c0392b", inv)}
    ${section("🟡 Stock bajo", "#b9770e", stock)}
    ${section("🔵 Órdenes de compra a aprobar", "#2471a3", pos)}
  </div>`;
}

export interface DigestResult {
  total: number;
  whatsapp: "sent" | "skipped" | "error";
  email: "sent" | "skipped" | "error";
}

export async function sendAlertsDigest(organizationId: string): Promise<DigestResult> {
  const alerts = await computeAlerts(organizationId);
  if (alerts.counts.total === 0) {
    return { total: 0, whatsapp: "skipped", email: "skipped" };
  }

  const settings = await getOrgSettings(organizationId);
  const result: DigestResult = { total: alerts.counts.total, whatsapp: "skipped", email: "skipped" };

  // Canal WhatsApp
  if (settings.alertsWhatsappTo && isWhatsAppConfigured()) {
    try {
      await sendTextMessage(settings.alertsWhatsappTo, buildAlertsText(alerts));
      result.whatsapp = "sent";
    } catch (error) {
      logger.error("alerts.notify.whatsapp", error);
      result.whatsapp = "error";
    }
  }

  // Canal email (cae a MAIL_TO si no hay destinatario específico)
  const emailTo = settings.alertsEmailTo || process.env.MAIL_TO || "";
  if (emailTo && (await isMailConfigured())) {
    try {
      await sendEmail(emailTo, `Alertas Bartez (${alerts.counts.total})`, buildAlertsHtml(alerts));
      result.email = "sent";
    } catch (error) {
      logger.error("alerts.notify.email", error);
      result.email = "error";
    }
  }

  return result;
}
