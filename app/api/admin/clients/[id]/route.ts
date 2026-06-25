import { adminOk, adminServerError, authorizeAdminRequest, invalidAdminInput, readAdminJson } from "../../../../../lib/admin-api.ts";
import { invalidatePublicContent } from "../../../../../lib/admin-content.ts";
import { adminIdSchema, clientUpdateSchema } from "../../../../../lib/admin-schema.ts";
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
  const parsed = clientUpdateSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);
  try {
    const client = await getDb().clientLogo.update({ where: { id: id.data }, data: parsed.data });
    await logAudit("update", "client", client.id, { fields: Object.keys(parsed.data) });
    invalidatePublicContent("clients");
    return adminOk({ client });
  } catch (error) {
    return adminServerError("actualizar logo", error);
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authorizeAdminRequest(request, { mutation: true });
  if (auth.response) return auth.response;
  const id = adminIdSchema.safeParse((await params).id);
  if (!id.success) return invalidAdminInput(id.error.issues);
  try {
    const client = await getDb().clientLogo.delete({ where: { id: id.data } });
    await logAudit("delete", "client", client.id, { name: client.name });
    invalidatePublicContent("clients");
    return adminOk();
  } catch (error) {
    return adminServerError("eliminar logo", error);
  }
}
