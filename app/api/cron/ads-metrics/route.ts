import { NextResponse } from "next/server.js";
import { resolveDefaultOrg } from "../../../../lib/tenant.ts";
import { syncAdAttributionMetrics } from "../../../../lib/modules/ads/performance-service.ts";
import { logger } from "../../../../lib/logger.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

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
    const result = await syncAdAttributionMetrics(org.id, 90);
    logger.info("cron.ads-metrics", result);
    return NextResponse.json({ ok: true, data: result }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    logger.error("cron.ads-metrics.error", error);
    return NextResponse.json({ ok: false, error: "Error al sincronizar métricas de ads" }, { status: 500 });
  }
}
