import { randomUUID } from "node:crypto";
import { adminOk, adminServerError, authorizeAdminRequest, invalidAdminInput, readAdminJson } from "../../../../lib/admin-api.ts";
import { generateSlug, invalidatePublicContent } from "../../../../lib/admin-content.ts";
import { postCreateSchema } from "../../../../lib/admin-schema.ts";
import { getDb } from "../../../../lib/db.ts";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await authorizeAdminRequest(request);
  if (auth.response) return auth.response;
  try {
    const posts = await getDb().post.findMany({ orderBy: { createdAt: "desc" } });
    return adminOk({ posts });
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
    invalidatePublicContent("posts", slug);
    return adminOk({ post });
  } catch (error) {
    return adminServerError("crear artículo", error);
  }
}
