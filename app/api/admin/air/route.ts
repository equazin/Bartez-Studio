import { NextResponse } from "next/server.js";
import { adminOk, adminServerError } from "../../../../lib/admin-api.ts";
import { authorizeModule } from "../../../../lib/modules/admin-module.ts";
import { getAirStats, getRecentSyncRuns } from "../../../../lib/integrations/air/service.ts";
import { runAirSync, type AirSyncKind } from "../../../../lib/integrations/air/sync.ts";
import { isAirEnabled } from "../../../../lib/integrations/air/config.ts";
import { logger } from "../../../../lib/logger.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Estado de la integración: stats del catálogo + últimas corridas. */
export async function GET(request: Request) {
  const auth = await authorizeModule(request, "sistema:integracion:read");
  if (!auth.ok) return auth.response;
  if (!isAirEnabled()) {
    return adminOk({ data: { enabled: false } });
  }
  try {
    const [stats, runs] = await Promise.all([
      getAirStats(auth.orgId),
      getRecentSyncRuns(auth.orgId, 10),
    ]);
    return adminOk({ data: { enabled: true, stats, runs } });
  } catch (error) {
    return adminServerError("air.status", error);
  }
}

/** Dispara una sincronización manual (?kind=catalog|syp). */
export async function POST(request: Request) {
  const auth = await authorizeModule(request, "sistema:integracion:update", { mutation: true });
  if (!auth.ok) return auth.response;
  if (!isAirEnabled()) {
    return NextResponse.json({ ok: false, error: "AIR está deshabilitada" }, { status: 400 });
  }
  const kindParam = new URL(request.url).searchParams.get("kind");
  const kind: AirSyncKind = kindParam === "syp" ? "syp" : "catalog";
  try {
    const result = await runAirSync(auth.orgId, kind);
    logger.info("air.sync.manual", { by: auth.session.username, kind, status: result.status });
    return NextResponse.json(
      { ok: result.status === "ok", data: result },
      { status: result.status === "ok" ? 200 : 500, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return adminServerError("air.sync.manual", error);
  }
}
