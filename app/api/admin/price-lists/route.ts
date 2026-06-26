import { NextResponse } from "next/server.js";
import { getDb } from "../../../../lib/db.ts";
import { logAudit } from "../../../../lib/audit.ts";
import { adminOk, adminServerError, invalidAdminInput, readAdminJson } from "../../../../lib/admin-api.ts";
import { priceListCreateSchema } from "../../../../lib/modules/catalog/schema.ts";
import { authorizeModule } from "../../../../lib/modules/admin-module.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await authorizeModule(request, "ventas:quote:read");
  if (!auth.ok) return auth.response;

  try {
    const lists = await getDb().priceList.findMany({
      where: { organizationId: auth.orgId },
      orderBy: [{ isDefault: "desc" }, { name: "asc" }],
      include: { _count: { select: { items: true } } },
    });
    return adminOk({ data: lists });
  } catch (error) {
    return adminServerError("priceLists.list", error);
  }
}

export async function POST(request: Request) {
  const auth = await authorizeModule(request, "ventas:quote:create", { mutation: true });
  if (!auth.ok) return auth.response;

  const body = await readAdminJson(request);
  if (!body.ok) return body.response;

  const parsed = priceListCreateSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);

  try {
    const db = getDb();
    // Si la nueva lista es default, desmarcamos el resto.
    const list = await db.$transaction(async (tx) => {
      if (parsed.data.isDefault) {
        await tx.priceList.updateMany({
          where: { organizationId: auth.orgId, isDefault: true },
          data: { isDefault: false },
        });
      }
      return tx.priceList.create({ data: { ...parsed.data, organizationId: auth.orgId } });
    });
    await logAudit("create", "price_list", list.id, { name: list.name, currency: list.currency }, { organizationId: auth.orgId });
    return NextResponse.json({ ok: true, data: list }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return adminServerError("priceLists.create", error);
  }
}
