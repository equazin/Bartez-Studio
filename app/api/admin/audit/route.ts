import { adminOk, adminServerError, authorizeAdminRequest } from "../../../../lib/admin-api.ts";
import { getDb } from "../../../../lib/db.ts";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await authorizeAdminRequest(request);
  if (auth.response) return auth.response;
  try {
    const url = new URL(request.url);
    const page = Math.max(1, Number(url.searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit") || "30")));
    const db = getDb();
    const [entries, total] = await Promise.all([
      db.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: limit, skip: (page - 1) * limit }),
      db.auditLog.count(),
    ]);
    return adminOk({ entries, meta: { total, page, limit } });
  } catch (error) {
    return adminServerError("listar auditoría", error);
  }
}
