import { adminOk, adminServerError } from "../../../../lib/admin-api.ts";
import { authorizeModule } from "../../../../lib/modules/admin-module.ts";
import { GRANTABLE_PERMISSIONS, listMemberships } from "../../../../lib/modules/team/team-service.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await authorizeModule(request, "equipo:member:manage");
  if (!auth.ok) return auth.response;
  try {
    const members = await listMemberships(auth.orgId);
    return adminOk({ data: { members, grantable: GRANTABLE_PERMISSIONS } });
  } catch (error) {
    return adminServerError("team.list", error);
  }
}
