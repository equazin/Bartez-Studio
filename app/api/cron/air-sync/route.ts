import { NextResponse } from "next/server.js";
import { resolveDefaultOrg } from "../../../../lib/tenant.ts";
import { runAirSync, type AirSyncKind } from "../../../../lib/integrations/air/sync.ts";
import { getAirConfig, isAirEnabled } from "../../../../lib/integrations/air/config.ts";
import { logger } from "../../../../lib/logger.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Cron de sincronización del catálogo AIR (cada 15 min vía Vercel Cron).
 *
 * Autenticación: `Authorization: Bearer <CRON_SECRET>` (el que inyecta Vercel)
 * o `<AIR_CRON_SECRET>` para disparo manual. Gated por AIR_INTEGRATION_ENABLED:
 * si está apagada, responde 404 (la feature no existe para el resto del sistema).
 *
 * Query: ?kind=catalog|syp (default catalog).
 */
export async function GET(request: Request) {
  const org = await resolveDefaultOrg();
  if (!(await isAirEnabled(org.id))) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  const cfg = await getAirConfig(org.id);
  const vercelSecret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization") || "";
  const authorized =
    (vercelSecret && auth === `Bearer ${vercelSecret}`) ||
    (cfg.cronSecret && auth === `Bearer ${cfg.cronSecret}`);

  if (!vercelSecret && !cfg.cronSecret) {
    return NextResponse.json({ ok: false, error: "CRON_SECRET no configurado" }, { status: 503 });
  }
  if (!authorized) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  const kindParam = new URL(request.url).searchParams.get("kind");
  const kind: AirSyncKind = kindParam === "syp" ? "syp" : "catalog";

  try {
    const result = await runAirSync(org.id, kind);
    logger.info("cron.air-sync", { kind, itemsTouched: result.itemsTouched, status: result.status });
    return NextResponse.json(
      { ok: result.status === "ok", data: result },
      { status: result.status === "ok" ? 200 : 500, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    logger.error("cron.air-sync.error", error);
    return NextResponse.json({ ok: false, error: "Error al sincronizar AIR" }, { status: 500 });
  }
}
