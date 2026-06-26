import { NextResponse } from "next/server.js";
import { getDb } from "../../../../lib/db.ts";
import { logAudit } from "../../../../lib/audit.ts";
import { adminOk, adminServerError, invalidAdminInput, readAdminJson } from "../../../../lib/admin-api.ts";
import { knowledgeArticleCreateSchema } from "../../../../lib/modules/support/schema.ts";
import { authorizeModule, parseModulePagination } from "../../../../lib/modules/admin-module.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await authorizeModule(request, "postventa:knowledge:read");
  if (!auth.ok) return auth.response;

  const url = new URL(request.url);
  const { page, limit, skip } = parseModulePagination(url);
  const category = url.searchParams.get("category") || undefined;
  const q = url.searchParams.get("q")?.trim();

  const where: Record<string, unknown> = { organizationId: auth.orgId, deletedAt: null };
  if (category) where.category = category;
  if (q) where.OR = [
    { title: { contains: q, mode: "insensitive" } },
    { excerpt: { contains: q, mode: "insensitive" } },
  ];

  try {
    const db = getDb();
    const [data, total] = await Promise.all([
      db.knowledgeArticle.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip,
        take: limit,
        include: { author: { select: { id: true, name: true } } },
      }),
      db.knowledgeArticle.count({ where }),
    ]);
    return adminOk({ data, meta: { total, page, limit } });
  } catch (error) {
    return adminServerError("knowledge.list", error);
  }
}

export async function POST(request: Request) {
  const auth = await authorizeModule(request, "postventa:knowledge:create", { mutation: true });
  if (!auth.ok) return auth.response;

  const body = await readAdminJson(request);
  if (!body.ok) return body.response;
  const parsed = knowledgeArticleCreateSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);

  try {
    const article = await getDb().knowledgeArticle.create({
      data: {
        organizationId: auth.orgId,
        slug: parsed.data.slug,
        title: parsed.data.title,
        body: parsed.data.body,
        excerpt: parsed.data.excerpt,
        category: parsed.data.category,
        tags: parsed.data.tags,
        published: parsed.data.published,
        authorId: auth.session.userId ?? null,
      },
    });
    await logAudit("create", "knowledge_article", article.id, { slug: article.slug, title: article.title }, { organizationId: auth.orgId });
    return NextResponse.json({ ok: true, data: article }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return adminServerError("knowledge.create", error);
  }
}
