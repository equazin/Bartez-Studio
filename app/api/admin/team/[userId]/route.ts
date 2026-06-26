import { NextResponse } from "next/server.js";
import { logAudit } from "../../../../../lib/audit.ts";
import { adminServerError, invalidAdminInput, readAdminJson } from "../../../../../lib/admin-api.ts";
import { authorizeModule } from "../../../../../lib/modules/admin-module.ts";
import { membershipUpdateSchema, updateMembership } from "../../../../../lib/modules/team/team-service.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function PATCH(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  const auth = await authorizeModule(request, "equipo:member:manage", { mutation: true });
  if (!auth.ok) return auth.response;
  const { userId } = await params;
  const body = await readAdminJson(request);
  if (!body.ok) return body.response;
  const parsed = membershipUpdateSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);

  // Un owner no puede quitarse el rol a sí mismo (evita quedarse sin admin).
  if (auth.session.userId === userId && parsed.data.role && parsed.data.role !== "owner") {
    return NextResponse.json({ ok: false, error: "No podés cambiar tu propio rol de owner" }, { status: 400 });
  }

  try {
    const member = await updateMembership({ organizationId: auth.orgId, userId, data: parsed.data });
    if (!member) return NextResponse.json({ ok: false, error: "Miembro no encontrado" }, { status: 404 });
    await logAudit("update", "organization", auth.orgId, { member: userId, role: member.role }, { organizationId: auth.orgId });
    return NextResponse.json({ ok: true, data: member }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return adminServerError("team.update", error);
  }
}
