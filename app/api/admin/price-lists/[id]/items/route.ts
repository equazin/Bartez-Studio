import { NextResponse } from "next/server.js";
import { getDb } from "../../../../../../lib/db.ts";
import { logAudit } from "../../../../../../lib/audit.ts";
import { adminOk, adminServerError, invalidAdminInput, readAdminJson } from "../../../../../../lib/admin-api.ts";
import { priceListItemUpsertSchema } from "../../../../../../lib/modules/catalog/schema.ts";
import { authorizeModule } from "../../../../../../lib/modules/admin-module.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * Upsert (productId + unitPrice) en la lista. Crea o actualiza.
 */
export async function POST(request: Request, ctx: RouteParams) {
  const auth = await authorizeModule(request, "ventas:quote:update", { mutation: true });
  if (!auth.ok) return auth.response;

  const { id: priceListId } = await ctx.params;
  const body = await readAdminJson(request);
  if (!body.ok) return body.response;

  const parsed = priceListItemUpsertSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);

  const db = getDb();
  try {
    // Confirmar que la lista y el producto pertenecen a la org del solicitante.
    const [list, product] = await Promise.all([
      db.priceList.findFirst({ where: { id: priceListId, organizationId: auth.orgId } }),
      db.product.findFirst({ where: { id: parsed.data.productId, organizationId: auth.orgId, deletedAt: null } }),
    ]);
    if (!list) return adminOk({ data: null });
    if (!product) return invalidAdminInput([{ path: ["productId"], message: "Producto no encontrado en esta organización", code: "custom" } as never]);

    const item = await db.priceListItem.upsert({
      where: { priceListId_productId: { priceListId, productId: parsed.data.productId } },
      create: { priceListId, productId: parsed.data.productId, unitPrice: parsed.data.unitPrice },
      update: { unitPrice: parsed.data.unitPrice },
    });
    await logAudit("update", "price_list", priceListId, { productId: parsed.data.productId, unitPrice: parsed.data.unitPrice }, { organizationId: auth.orgId });
    return NextResponse.json({ ok: true, data: item }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return adminServerError("priceLists.upsertItem", error);
  }
}
