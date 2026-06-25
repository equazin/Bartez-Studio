import { randomUUID } from "node:crypto";
import { adminOk, adminServerError, authorizeAdminRequest, invalidAdminInput, readAdminJson } from "../../../../lib/admin-api.ts";
import { generateSlug, invalidatePublicContent } from "../../../../lib/admin-content.ts";
import { postCreateSchema } from "../../../../lib/admin-schema.ts";
import { logAudit } from "../../../../lib/audit.ts";
import { getDb } from "../../../../lib/db.ts";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await authorizeAdminRequest(request);
  if (auth.response) return auth.response;
  try {
    const url = new URL(request.url);
    const page = Math.max(1, Number(url.searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit") || "20")));
    const q = url.searchParams.get("q")?.trim() || "";
    const where = q ? { title: { contains: q, mode: "insensitive" as const } } : {};
    const db = getDb();
    const [posts, total] = await Promise.all([
      db.post.findMany({ where, orderBy: { createdAt: "desc" }, take: limit, skip: (page - 1) * limit }),
      db.post.count({ where }),
    ]);
    return adminOk({ posts, meta: { total, page, limit } });
  } catch (error) {
    return adminServerError("listar artículos", error);
  }
}

export async function POST(request: Request) {
  const auth = await authorizeAdminRequest(request, { mutation: true });
  if (auth.response) return auth.response;
  const body = await readAdminJson(request);
  if (!body.ok) return body.response;
  const parsed = postCreateSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);

  try {
    const db = getDb();
    const baseSlug = generateSlug(parsed.data.title);
    const existing = await db.post.findUnique({ where: { slug: baseSlug }, select: { id: true } });
    const slug = existing ? `${baseSlug}-${randomUUID().slice(0, 6)}` : baseSlug;
    const { bodyContent, ...data } = parsed.data;
    const post = await db.post.create({ data: { ...data, slug, body: bodyContent } });
    await logAudit("create", "post", post.id, { title: post.title, slug: post.slug });
    invalidatePublicContent("posts", slug);
    return adminOk({ post });
  } catch (error) {
    return adminServerError("crear artículo", error);
  }
}
