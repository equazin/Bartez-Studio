import { adminOk, adminServerError, authorizeAdminRequest, invalidAdminInput, readAdminJson } from "../../../../../lib/admin-api.ts";
import { invalidatePublicContent } from "../../../../../lib/admin-content.ts";
import { adminIdSchema, caseUpdateSchema } from "../../../../../lib/admin-schema.ts";
import { logAudit } from "../../../../../lib/audit.ts";
import { getDb } from "../../../../../lib/db.ts";

export const runtime = "nodejs";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authorizeAdminRequest(request, { mutation: true });
  if (auth.response) return auth.response;
  const id = adminIdSchema.safeParse((await params).id);
  if (!id.success) return invalidAdminInput(id.error.issues);
  const body = await readAdminJson(request);
  if (!body.ok) return body.response;
  const parsed = caseUpdateSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);
  try {
    const data = { ...parsed.data };
    if ("logoUrl" in parsed.data) data.logoUrl = parsed.data.logoUrl || null;
    const successCase = await getDb().successCase.update({ where: { id: id.data }, data });
    await logAudit("update", "case", successCase.id, { fields: Object.keys(parsed.data) });
    invalidatePublicContent("cases");
    return adminOk({ successCase });
  } catch (error) {
    return adminServerError("actualizar caso", error);
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authorizeAdminRequest(request, { mutation: true });
  if (auth.response) return auth.response;
  const id = adminIdSchema.safeParse((await params).id);
  if (!id.success) return invalidAdminInput(id.error.issues);
  try {
    const successCase = await getDb().successCase.delete({ where: { id: id.data } });
    await logAudit("delete", "case", successCase.id, { title: successCase.title, clientName: successCase.clientName });
    invalidatePublicContent("cases");
    return adminOk();
  } catch (error) {
    return adminServerError("eliminar caso", error);
  }
}
