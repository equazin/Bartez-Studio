import { adminOk, adminServerError, authorizeAdminRequest, invalidAdminInput, readAdminJson } from "../../../../lib/admin-api.ts";
import { invalidatePublicContent } from "../../../../lib/admin-content.ts";
import { caseCreateSchema } from "../../../../lib/admin-schema.ts";
import { logAudit } from "../../../../lib/audit.ts";
import { getDb } from "../../../../lib/db.ts";
import { checkRateLimit } from "../../../../lib/rate-limit.ts";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await authorizeAdminRequest(request);
  if (auth.response) return auth.response;
  try {
    const url = new URL(request.url);
    const page = Math.max(1, Number(url.searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit") || "20")));
    const q = url.searchParams.get("q")?.trim() || "";
    const where = q
      ? { OR: [
          { title: { contains: q, mode: "insensitive" as const } },
          { clientName: { contains: q, mode: "insensitive" as const } },
        ] }
      : {};
    const db = getDb();
    const [cases, total] = await Promise.all([
      db.successCase.findMany({ where, orderBy: { id: "desc" }, take: limit, skip: (page - 1) * limit }),
      db.successCase.count({ where }),
    ]);
    return adminOk({ cases, meta: { total, page, limit } });
  } catch (error) {
    return adminServerError("listar casos", error);
  }
}

export async function POST(request: Request) {
  const auth = await authorizeAdminRequest(request, { mutation: true });
  if (auth.response) return auth.response;
  const { allowed, retryAfter } = checkRateLimit(request, "admin:mutations", 30, 60_000);
  if (!allowed) {
    return new Response(JSON.stringify({ error: "Rate limit exceeded" }), { status: 429, headers: { "Retry-After": String(retryAfter) } });
  }
  const body = await readAdminJson(request);
  if (!body.ok) return body.response;
  const parsed = caseCreateSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);
  try {
    const newCase = await getDb().successCase.create({
      data: { ...parsed.data, logoUrl: parsed.data.logoUrl || null },
    });
    await logAudit("create", "case", newCase.id, { title: newCase.title, clientName: newCase.clientName });
    invalidatePublicContent("cases");
    return adminOk({ successCase: newCase });
  } catch (error) {
    return adminServerError("crear caso", error);
  }
}
