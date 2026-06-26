import { getDb } from "../../../../../lib/db.ts";
import { logAudit } from "../../../../../lib/audit.ts";
import { adminOk, adminServerError, invalidAdminInput, readAdminJson } from "../../../../../lib/admin-api.ts";
import { priceListUpdateSchema } from "../../../../../lib/modules/catalog/schema.ts";
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
    const list = await getDb().priceList.findFirst({
      where: { id, organizationId: auth.orgId },
      include: {
        items: {
          include: { product: { select: { id: true, name: true, sku: true, unit: true, active: true } } },
          orderBy: { product: { name: "asc" } },
        },
      },
    });
    return adminOk({ data: list });
  } catch (error) {
    return adminServerError("priceLists.get", error);
  }
}

export async function PUT(request: Request, ctx: RouteParams) {
  const auth = await authorizeModule(request, "ventas:quote:update", { mutation: true });
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  const body = await readAdminJson(request);
  if (!body.ok) return body.response;

  const parsed = priceListUpdateSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);

  try {
    const db = getDb();
    const existing = await db.priceList.findFirst({ where: { id, organizationId: auth.orgId } });
    if (!existing) return adminOk({ data: null });

    const list = await db.$transaction(async (tx) => {
      if (parsed.data.isDefault === true) {
        await tx.priceList.updateMany({
          where: { organizationId: auth.orgId, isDefault: true, NOT: { id } },
          data: { isDefault: false },
        });
      }
      return tx.priceList.update({ where: { id }, data: parsed.data });
    });
    await logAudit("update", "price_list", id, parsed.data as Record<string, unknown>, { organizationId: auth.orgId });
    return adminOk({ data: list });
  } catch (error) {
    return adminServerError("priceLists.update", error);
  }
}

export async function DELETE(request: Request, ctx: RouteParams) {
  const auth = await authorizeModule(request, "ventas:quote:delete", { mutation: true });
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  try {
    const db = getDb();
    const existing = await db.priceList.findFirst({ where: { id, organizationId: auth.orgId } });
    if (!existing) return adminOk({ data: null });

    await db.priceList.delete({ where: { id } });
    await logAudit("delete", "price_list", id, undefined, { organizationId: auth.orgId });
    return adminOk();
  } catch (error) {
    return adminServerError("priceLists.delete", error);
  }
}
