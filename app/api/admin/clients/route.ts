import { adminOk, adminServerError, authorizeAdminRequest, invalidAdminInput, readAdminJson } from "../../../../lib/admin-api.ts";
import { invalidatePublicContent } from "../../../../lib/admin-content.ts";
import { clientCreateSchema } from "../../../../lib/admin-schema.ts";
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
    const where = q ? { name: { contains: q, mode: "insensitive" as const } } : {};
    const db = getDb();
    const [clients, total] = await Promise.all([
      db.clientLogo.findMany({ where, orderBy: [{ displayOrder: "asc" }, { id: "desc" }], take: limit, skip: (page - 1) * limit }),
      db.clientLogo.count({ where }),
    ]);
    return adminOk({ clients, meta: { total, page, limit } });
  } catch (error) {
    return adminServerError("listar logos", error);
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
  const parsed = clientCreateSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);
  try {
    const client = await getDb().clientLogo.create({ data: parsed.data });
    await logAudit("create", "client", client.id, { name: client.name });
    invalidatePublicContent("clients");
    return adminOk({ client });
  } catch (error) {
    return adminServerError("crear logo", error);
  }
}
