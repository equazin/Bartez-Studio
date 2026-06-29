import { NextResponse } from "next/server.js";
import { resolveDefaultOrg } from "../../../../lib/tenant.ts";
import { retryFailedConversions } from "../../../../lib/modules/ads/conversions-service.ts";
import { logger } from "../../../../lib/logger.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Cron de reintentos de conversiones publicitarias (cada 15 min).
 *
 * Re-despacha DomainEvents de tipo "ads.conversion" que quedaron en "failed"
 * con menos de 3 intentos. Autenticado por CRON_SECRET (Vercel Cron).
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
    const processed = await retryFailedConversions(org.id);
    logger.info("cron.conversions", { processed });
    return NextResponse.json(
      { ok: true, data: { processed } },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    logger.error("cron.conversions.error", error);
    return NextResponse.json({ ok: false, error: "Error al reintentar conversiones" }, { status: 500 });
  }
}
