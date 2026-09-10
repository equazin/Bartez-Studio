import { NextResponse } from "next/server.js";
import { adminOk, adminServerError } from "../../../../lib/admin-api.ts";
import { authorizeModule } from "../../../../lib/modules/admin-module.ts";
import { computeAlerts, computeAlertCounts } from "../../../../lib/modules/alerts/alerts-service.ts";
import { sendAlertsDigest } from "../../../../lib/modules/alerts/notify-service.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await authorizeModule(request, "reportes:read");
  if (!auth.ok) return auth.response;
  try {
    // ?counts=1 devuelve solo los contadores (badge del shell). Evita
    // transferir los tres listados completos en cada poll.
    if (new URL(request.url).searchParams.get("counts") === "1") {
      return adminOk({ data: { counts: await computeAlertCounts(auth.orgId) } });
    }
    const data = await computeAlerts(auth.orgId);
    return adminOk({ data });
  } catch (error) {
    return adminServerError("alerts.compute", error);
  }
}

/** Envío manual del digest de alertas ("probar ahora"). */
export async function POST(request: Request) {
  const auth = await authorizeModule(request, "reportes:read", { mutation: true });
  if (!auth.ok) return auth.response;
  try {
    const result = await sendAlertsDigest(auth.orgId);
    return NextResponse.json({ ok: true, data: result }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return adminServerError("alerts.notify", error);
  }
}
