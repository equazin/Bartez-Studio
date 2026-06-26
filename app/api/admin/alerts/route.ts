import { adminOk, adminServerError } from "../../../../lib/admin-api.ts";
import { authorizeModule } from "../../../../lib/modules/admin-module.ts";
import { computeAlerts } from "../../../../lib/modules/alerts/alerts-service.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await authorizeModule(request, "reportes:read");
  if (!auth.ok) return auth.response;
  try {
    const data = await computeAlerts(auth.orgId);
    return adminOk({ data });
  } catch (error) {
    return adminServerError("alerts.compute", error);
  }
}
