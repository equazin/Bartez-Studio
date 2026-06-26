import { NextResponse } from "next/server.js";
import { getDb } from "../../../../lib/db.ts";
import { logAudit } from "../../../../lib/audit.ts";
import { adminOk, adminServerError, invalidAdminInput, readAdminJson } from "../../../../lib/admin-api.ts";
import { authorizeModule, parseModulePagination } from "../../../../lib/modules/admin-module.ts";
import { deliveryNoteCreateSchema } from "../../../../lib/modules/delivery-notes/schema.ts";
import { createDeliveryNote, DeliveryNoteValidationError } from "../../../../lib/modules/delivery-notes/delivery-note-service.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await authorizeModule(request, "ventas:delivery-note:read");
  if (!auth.ok) return auth.response;

  const url = new URL(request.url);
  const { page, limit, skip } = parseModulePagination(url);
  const status = url.searchParams.get("status") || undefined;
  const accountId = url.searchParams.get("accountId") || undefined;
  const q = url.searchParams.get("q")?.trim();

  const where: Record<string, unknown> = { organizationId: auth.orgId, deletedAt: null };
  if (status) where.status = status;
  if (accountId) where.accountId = accountId;
  if (q) {
    where.OR = [
      { number: { contains: q, mode: "insensitive" } },
      { receiverName: { contains: q, mode: "insensitive" } },
    ];
  }

  try {
    const db = getDb();
    const [data, total] = await Promise.all([
      db.deliveryNote.findMany({
        where,
        orderBy: { issueDate: "desc" },
        skip,
        take: limit,
        include: {
          account: { select: { id: true, name: true } },
          order: { select: { id: true, number: true } },
          _count: { select: { lines: true } },
        },
      }),
      db.deliveryNote.count({ where }),
    ]);
    return adminOk({ data, meta: { total, page, limit } });
  } catch (error) {
    return adminServerError("deliveryNotes.list", error);
  }
}

export async function POST(request: Request) {
  const auth = await authorizeModule(request, "ventas:delivery-note:create", { mutation: true });
  if (!auth.ok) return auth.response;

  const body = await readAdminJson(request);
  if (!body.ok) return body.response;
  const parsed = deliveryNoteCreateSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);

  try {
    const deliveryNote = await createDeliveryNote({ organizationId: auth.orgId, data: parsed.data });
    await logAudit("create", "delivery_note", deliveryNote.id, { number: deliveryNote.number }, { organizationId: auth.orgId });
    return NextResponse.json({ ok: true, data: deliveryNote }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof DeliveryNoteValidationError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400, headers: { "Cache-Control": "no-store" } });
    }
    return adminServerError("deliveryNotes.create", error);
  }
}
