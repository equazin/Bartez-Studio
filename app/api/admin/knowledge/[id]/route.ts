import { getDb } from "../../../../../lib/db.ts";
import { logAudit } from "../../../../../lib/audit.ts";
import { adminOk, adminServerError, invalidAdminInput, readAdminJson } from "../../../../../lib/admin-api.ts";
import { knowledgeArticleUpdateSchema } from "../../../../../lib/modules/support/schema.ts";
import { authorizeModule } from "../../../../../lib/modules/admin-module.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface RouteParams { params: Promise<{ id: string }>; }

export async function GET(request: Request, ctx: RouteParams) {
  const auth = await authorizeModule(request, "postventa:knowledge:read");
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  try {
    const article = await getDb().knowledgeArticle.findFirst({
      where: { id, organizationId: auth.orgId, deletedAt: null },
      include: { author: { select: { id: true, name: true } } },
    });
    return adminOk({ data: article });
  } catch (error) {
    return adminServerError("knowledge.get", error);
  }
}

export async function PUT(request: Request, ctx: RouteParams) {
  const auth = await authorizeModule(request, "postventa:knowledge:update", { mutation: true });
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  const body = await readAdminJson(request);
  if (!body.ok) return body.response;
  const parsed = knowledgeArticleUpdateSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);

  try {
    const db = getDb();
    const existing = await db.knowledgeArticle.findFirst({ where: { id, organizationId: auth.orgId, deletedAt: null } });
    if (!existing) return adminOk({ data: null });

    const article = await db.knowledgeArticle.update({ where: { id }, data: parsed.data });
    await logAudit("update", "knowledge_article", id, parsed.data as Record<string, unknown>, { organizationId: auth.orgId });
    return adminOk({ data: article });
  } catch (error) {
    return adminServerError("knowledge.update", error);
  }
}

export async function DELETE(request: Request, ctx: RouteParams) {
  const auth = await authorizeModule(request, "postventa:knowledge:update", { mutation: true });
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  try {
    const db = getDb();
    const existing = await db.knowledgeArticle.findFirst({ where: { id, organizationId: auth.orgId, deletedAt: null } });
    if (!existing) return adminOk({ data: null });
    await db.knowledgeArticle.update({ where: { id }, data: { deletedAt: new Date() } });
    await logAudit("delete", "knowledge_article", id, undefined, { organizationId: auth.orgId });
    return adminOk();
  } catch (error) {
    return adminServerError("knowledge.delete", error);
  }
}
