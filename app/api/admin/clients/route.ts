import { adminOk, adminServerError, authorizeAdminRequest, invalidAdminInput, readAdminJson } from "../../../../lib/admin-api.ts";
import { invalidatePublicContent } from "../../../../lib/admin-content.ts";
import { clientCreateSchema } from "../../../../lib/admin-schema.ts";
import { getDb } from "../../../../lib/db.ts";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await authorizeAdminRequest(request);
  if (auth.response) return auth.response;
  try {
    const clients = await getDb().clientLogo.findMany({ orderBy: [{ displayOrder: "asc" }, { id: "desc" }] });
    return adminOk({ clients });
  } catch (error) {
    return adminServerError("listar logos", error);
  }
}

export async function POST(request: Request) {
  const auth = await authorizeAdminRequest(request, { mutation: true });
  if (auth.response) return auth.response;
  const body = await readAdminJson(request);
  if (!body.ok) return body.response;
  const parsed = clientCreateSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);
  try {
    const client = await getDb().clientLogo.create({ data: parsed.data });
    invalidatePublicContent("clients");
    return adminOk({ client });
  } catch (error) {
    return adminServerError("crear logo", error);
  }
}
