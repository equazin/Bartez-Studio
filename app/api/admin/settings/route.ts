import { NextResponse } from "next/server.js";
import { logAudit } from "../../../../lib/audit.ts";
import { adminOk, adminServerError, invalidAdminInput, readAdminJson } from "../../../../lib/admin-api.ts";
import { authorizeModule } from "../../../../lib/modules/admin-module.ts";
import { getOrgSettings, orgSettingsUpdateSchema, updateOrgSettings } from "../../../../lib/modules/settings/settings-service.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await authorizeModule(request, "compras:po:read");
  if (!auth.ok) return auth.response;
  try {
    const data = await getOrgSettings(auth.orgId);
    return adminOk({ data });
  } catch (error) {
    return adminServerError("settings.get", error);
  }
}

export async function PUT(request: Request) {
  const auth = await authorizeModule(request, "compras:po:approve", { mutation: true });
  if (!auth.ok) return auth.response;
  const body = await readAdminJson(request);
  if (!body.ok) return body.response;
  const parsed = orgSettingsUpdateSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);

  try {
    const data = await updateOrgSettings(auth.orgId, parsed.data);
    await logAudit("update", "organization", auth.orgId, { purchaseApprovalThreshold: data.purchaseApprovalThreshold }, { organizationId: auth.orgId });
    return NextResponse.json({ ok: true, data }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return adminServerError("settings.update", error);
  }
}
