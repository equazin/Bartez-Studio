import { NextResponse } from "next/server.js";
import { logAudit } from "../../../../lib/audit.ts";
import { adminOk, adminServerError, invalidAdminInput, readAdminJson } from "../../../../lib/admin-api.ts";
import { authorizeModule } from "../../../../lib/modules/admin-module.ts";
import { GRANTABLE_PERMISSIONS, TeamValidationError, createTeamMember, listMemberships, teamMemberCreateSchema } from "../../../../lib/modules/team/team-service.ts";

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

export async function POST(request: Request) {
  const auth = await authorizeModule(request, "equipo:member:manage", { mutation: true });
  if (!auth.ok) return auth.response;
  const body = await readAdminJson(request);
  if (!body.ok) return body.response;
  const parsed = teamMemberCreateSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);

  try {
    const member = await createTeamMember({ organizationId: auth.orgId, data: parsed.data });
    await logAudit("create", "organization", auth.orgId, { newMember: member.email, role: member.role }, { organizationId: auth.orgId });
    return NextResponse.json({ ok: true, data: member }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof TeamValidationError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400, headers: { "Cache-Control": "no-store" } });
    }
    return adminServerError("team.create", error);
  }
}
