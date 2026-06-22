import { adminOk, adminServerError, authorizeAdminRequest, invalidAdminInput, readAdminJson } from "../../../../lib/admin-api.ts";
import { invalidatePublicContent } from "../../../../lib/admin-content.ts";
import { caseCreateSchema } from "../../../../lib/admin-schema.ts";
import { getDb } from "../../../../lib/db.ts";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await authorizeAdminRequest(request);
  if (auth.response) return auth.response;
  try {
    const cases = await getDb().successCase.findMany({ orderBy: { id: "desc" } });
    return adminOk({ cases });
  } catch (error) {
    return adminServerError("listar casos", error);
  }
}

export async function POST(request: Request) {
  const auth = await authorizeAdminRequest(request, { mutation: true });
  if (auth.response) return auth.response;
  const body = await readAdminJson(request);
  if (!body.ok) return body.response;
  const parsed = caseCreateSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);
  try {
    const newCase = await getDb().successCase.create({
      data: { ...parsed.data, logoUrl: parsed.data.logoUrl || null },
    });
    invalidatePublicContent("cases");
    return adminOk({ successCase: newCase });
  } catch (error) {
    return adminServerError("crear caso", error);
  }
}
