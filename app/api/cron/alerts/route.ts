import { NextResponse } from "next/server.js";
import { resolveDefaultOrg } from "../../../../lib/tenant.ts";
import { sendAlertsDigest } from "../../../../lib/modules/alerts/notify-service.ts";
import { logger } from "../../../../lib/logger.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Cron diario de notificaciones de alertas.
 *
 * Vercel Cron invoca este endpoint con el header
 * `Authorization: Bearer ${CRON_SECRET}`. Sin CRON_SECRET configurado el
 * endpoint responde 503 (no abierto al público).
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ ok: false, error: "CRON_SECRET no configurado" }, { status: 503 });
  }
  const auth = request.headers.get("authorization") || "";
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  try {
    const org = await resolveDefaultOrg();
    const result = await sendAlertsDigest(org.id);
    logger.info("cron.alerts", result);
    return NextResponse.json({ ok: true, data: result }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    logger.error("cron.alerts.error", error);
    return NextResponse.json({ ok: false, error: "Error al enviar alertas" }, { status: 500 });
  }
}
