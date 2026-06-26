import { NextResponse } from "next/server.js";
import { getDb } from "../../../../lib/db.ts";
import { logAudit } from "../../../../lib/audit.ts";
import { adminOk, adminServerError, invalidAdminInput, readAdminJson } from "../../../../lib/admin-api.ts";
import { serialNumberCreateSchema } from "../../../../lib/modules/warranties/schema.ts";
import { createSerialNumber, WarrantyValidationError, listExpiringSerials } from "../../../../lib/modules/warranties/warranty-service.ts";
import { authorizeModule, parseModulePagination } from "../../../../lib/modules/admin-module.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await authorizeModule(request, "postventa:warranty:read");
  if (!auth.ok) return auth.response;

  const url = new URL(request.url);
  const { page, limit, skip } = parseModulePagination(url);
  const expiring = url.searchParams.get("expiring") === "1";
  const status = url.searchParams.get("status") || undefined;
  const accountId = url.searchParams.get("accountId") || undefined;
  const q = url.searchParams.get("q")?.trim();

  try {
    if (expiring) {
      const data = await listExpiringSerials({ organizationId: auth.orgId, withinDays: 30 });
      return adminOk({ data, meta: { total: data.length, page: 1, limit: data.length } });
    }

    const where: Record<string, unknown> = { organizationId: auth.orgId };
    if (status) where.status = status;
    if (accountId) where.accountId = accountId;
    if (q) where.serial = { contains: q, mode: "insensitive" };

    const db = getDb();
    const [data, total] = await Promise.all([
      db.serialNumber.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip,
        take: limit,
        include: {
          product: { select: { id: true, name: true, sku: true } },
          account: { select: { id: true, name: true } },
        },
      }),
      db.serialNumber.count({ where }),
    ]);
    return adminOk({ data, meta: { total, page, limit } });
  } catch (error) {
    return adminServerError("serialNumbers.list", error);
  }
}

export async function POST(request: Request) {
  const auth = await authorizeModule(request, "postventa:warranty:create", { mutation: true });
  if (!auth.ok) return auth.response;

  const body = await readAdminJson(request);
  if (!body.ok) return body.response;
  const parsed = serialNumberCreateSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);

  try {
    const serial = await createSerialNumber({ organizationId: auth.orgId, data: parsed.data });
    await logAudit("create", "serial_number", serial.id, { serial: serial.serial, productId: serial.productId }, { organizationId: auth.orgId });
    return NextResponse.json({ ok: true, data: serial }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof WarrantyValidationError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400, headers: { "Cache-Control": "no-store" } });
    }
    return adminServerError("serialNumbers.create", error);
  }
}
