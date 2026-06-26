import { getDb } from "../../../../../lib/db.ts";
import { logAudit } from "../../../../../lib/audit.ts";
import { adminOk, adminServerError, invalidAdminInput, readAdminJson } from "../../../../../lib/admin-api.ts";
import { quoteUpdateSchema } from "../../../../../lib/modules/sales/schema.ts";
import { updateQuote } from "../../../../../lib/modules/sales/quote-service.ts";
import { authorizeModule } from "../../../../../lib/modules/admin-module.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, ctx: RouteParams) {
  const auth = await authorizeModule(request, "ventas:quote:read");
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  try {
    const quote = await getDb().quote.findFirst({
      where: { id, organizationId: auth.orgId, deletedAt: null },
      include: {
        account: { select: { id: true, name: true, taxId: true, email: true, phone: true, address: true, city: true } },
        owner: { select: { id: true, name: true, email: true } },
        priceList: { select: { id: true, name: true, currency: true } },
        opportunity: { select: { id: true, title: true } },
        lines: { orderBy: { position: "asc" }, include: { product: { select: { id: true, sku: true, name: true, unit: true } } } },
      },
    });
    return adminOk({ data: quote });
  } catch (error) {
    return adminServerError("quotes.get", error);
  }
}

export async function PUT(request: Request, ctx: RouteParams) {
  const auth = await authorizeModule(request, "ventas:quote:update", { mutation: true });
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  const body = await readAdminJson(request);
  if (!body.ok) return body.response;

  const parsed = quoteUpdateSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);

  try {
    const quote = await updateQuote({ organizationId: auth.orgId, id, data: parsed.data });
    if (!quote) return adminOk({ data: null });
    await logAudit("update", "quote", id, { number: quote.number }, { organizationId: auth.orgId });
    return adminOk({ data: quote });
  } catch (error) {
    return adminServerError("quotes.update", error);
  }
}

export async function DELETE(request: Request, ctx: RouteParams) {
  const auth = await authorizeModule(request, "ventas:quote:delete", { mutation: true });
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  try {
    const db = getDb();
    const existing = await db.quote.findFirst({ where: { id, organizationId: auth.orgId, deletedAt: null } });
    if (!existing) return adminOk({ data: null });

    await db.quote.update({ where: { id }, data: { deletedAt: new Date() } });
    await logAudit("delete", "quote", id, undefined, { organizationId: auth.orgId });
    return adminOk();
  } catch (error) {
    return adminServerError("quotes.delete", error);
  }
}
