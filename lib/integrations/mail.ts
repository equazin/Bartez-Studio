import type { Lead } from "../schema";
import type { IntegrationResult, LeadSink } from "./types";
import { contact, company } from "../../constants";

/**
 * Mail adapter — notificación interna + autorespuesta HTML branded.
 *
 * Soporta dos providers vía MAIL_PROVIDER:
 *  - "resend"  → RESEND_API_KEY
 *  - "brevo"   → BREVO_API_KEY
 * Remitente: MAIL_FROM (ej. "Bartez <comercial@bartez.com.ar>")
 * Destino interno: MAIL_TO (default contact.email)
 *
 * Si no hay provider configurado, se marca skipped (el lead igual se persiste).
 * Las plantillas se validan en build con el MCP de Gmail (ver README).
 */
const tipoLabel: Record<Lead["tipoConsulta"], string> = {
  cotizacion: "Cotización",
  asesoramiento: "Asesoramiento técnico",
  cuenta: "Cuenta corporativa",
};

function internalHtml(lead: Lead): string {
  return `<h2 style="font-family:Arial">Nuevo lead web — ${lead.empresa}</h2>
  <table style="font-family:Arial;font-size:14px;border-collapse:collapse">
    <tr><td><b>Empresa</b></td><td>${lead.empresa}</td></tr>
    <tr><td><b>Contacto</b></td><td>${lead.nombre}</td></tr>
    <tr><td><b>Email</b></td><td>${lead.email}</td></tr>
    <tr><td><b>Teléfono</b></td><td>${lead.telefono || "-"}</td></tr>
    <tr><td><b>Tipo</b></td><td>${tipoLabel[lead.tipoConsulta]}</td></tr>
    <tr><td><b>Agendar reunión</b></td><td>${lead.agendarReunion ? "Sí" : "No"}</td></tr>
    <tr><td valign="top"><b>Mensaje</b></td><td>${(lead.mensaje || "-").replace(/</g, "&lt;")}</td></tr>
  </table>`;
}

function autoReplyHtml(lead: Lead): string {
  return `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;border-radius:16px;overflow:hidden;border:1px solid #eee">
    <div style="background:#0A2818;color:#fff;padding:28px">
      <div style="font-size:20px;font-weight:bold">${company.name}</div>
      <div style="color:#B8956A;font-size:13px">${company.tagline}</div>
    </div>
    <div style="padding:28px;color:#0F1F17;font-size:15px;line-height:1.6">
      <p>Hola ${lead.nombre.split(" ")[0]},</p>
      <p>Recibimos tu consulta de <b>${tipoLabel[lead.tipoConsulta]}</b> para <b>${lead.empresa}</b>.
      Un asesor comercial te va a contactar con una cotización formal en un plazo de <b>24 hs hábiles</b>.</p>
      <p>Si es urgente, escribinos por WhatsApp al ${contact.phoneDisplay}.</p>
      <p style="margin-top:24px">Gracias por confiar en ${company.name}.</p>
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0" />
      <div style="font-size:12px;color:#6a7a70">${company.address} · ${contact.email} · ${contact.hours}</div>
    </div>
  </div>`;
}

async function sendResend(to: string, subject: string, html: string, replyTo?: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: process.env.MAIL_FROM, to, subject, html, reply_to: replyTo }),
  });
  if (!res.ok) throw new Error(`Resend HTTP ${res.status}`);
}

async function sendBrevo(to: string, subject: string, html: string) {
  const [name, addr] = parseFrom(process.env.MAIL_FROM || "");
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": process.env.BREVO_API_KEY || "", "Content-Type": "application/json" },
    body: JSON.stringify({ sender: { name, email: addr }, to: [{ email: to }], subject, htmlContent: html }),
  });
  if (!res.ok) throw new Error(`Brevo HTTP ${res.status}`);
}

function parseFrom(from: string): [string, string] {
  const m = from.match(/^(.*)<(.*)>$/);
  if (m) return [m[1].trim() || "Bartez", m[2].trim()];
  return ["Bartez", from];
}

export const mailSink: LeadSink = {
  name: "Email (notificación + autorespuesta)",
  isConfigured() {
    const p = process.env.MAIL_PROVIDER;
    return Boolean(
      (p === "resend" && process.env.RESEND_API_KEY) ||
        (p === "brevo" && process.env.BREVO_API_KEY)
    );
  },
  async handle(lead: Lead): Promise<IntegrationResult> {
    if (!this.isConfigured()) {
      return { name: this.name, ok: false, skipped: true, detail: "MAIL_PROVIDER no configurado" };
    }
    const to = process.env.MAIL_TO || contact.email;
    const provider = process.env.MAIL_PROVIDER;
    try {
      const send = provider === "brevo"
        ? (t: string, s: string, h: string) => sendBrevo(t, s, h)
        : (t: string, s: string, h: string, r?: string) => sendResend(t, s, h, r);

      await send(to, `Nuevo lead web — ${lead.empresa}`, internalHtml(lead), lead.email);
      await send(lead.email, `Recibimos tu consulta — ${company.name}`, autoReplyHtml(lead));
      return { name: this.name, ok: true, detail: `Enviados vía ${provider}` };
    } catch (e) {
      return { name: this.name, ok: false, detail: (e as Error).message };
    }
  },
};
