import { NextResponse } from "next/server.js";
import { getDb } from "../../../../lib/db.ts";
import { logAudit } from "../../../../lib/audit.ts";
import { adminOk, adminServerError, invalidAdminInput, readAdminJson } from "../../../../lib/admin-api.ts";
import { quoteCreateSchema } from "../../../../lib/modules/sales/schema.ts";
import { createQuote } from "../../../../lib/modules/sales/quote-service.ts";
import { authorizeModule, parseModulePagination } from "../../../../lib/modules/admin-module.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await authorizeModule(request, "ventas:quote:read");
  if (!auth.ok) return auth.response;

  const url = new URL(request.url);
  const { page, limit, skip } = parseModulePagination(url);
  const status = url.searchParams.get("status") || undefined;
  const q = url.searchParams.get("q")?.trim();
  const accountId = url.searchParams.get("accountId") || undefined;

  const where: Record<string, unknown> = { organizationId: auth.orgId, deletedAt: null };
  if (status) where.status = status;
  if (accountId) where.accountId = accountId;
  if (q) {
    where.OR = [
      { number: { contains: q, mode: "insensitive" } },
      { account: { name: { contains: q, mode: "insensitive" } } },
    ];
  }

  try {
    const db = getDb();
    const [data, total] = await Promise.all([
      db.quote.findMany({
        where,
        orderBy: { issueDate: "desc" },
        skip,
        take: limit,
        include: {
          account: { select: { id: true, name: true } },
          owner: { select: { id: true, name: true } },
          _count: { select: { lines: true } },
        },
      }),
      db.quote.count({ where }),
    ]);
    return adminOk({ data, meta: { total, page, limit } });
  } catch (error) {
    return adminServerError("quotes.list", error);
  }
}

export async function POST(request: Request) {
  const auth = await authorizeModule(request, "ventas:quote:create", { mutation: true });
  if (!auth.ok) return auth.response;

  const body = await readAdminJson(request);
  if (!body.ok) return body.response;

  const parsed = quoteCreateSchema.safeParse(body.data);
  if (!parsed.success) return invalidAdminInput(parsed.error.issues);

  try {
    const quote = await createQuote({ organizationId: auth.orgId, data: parsed.data });
    await logAudit("create", "quote", quote.id, { number: quote.number, total: quote.total.toString() }, { organizationId: auth.orgId });
    return NextResponse.json({ ok: true, data: quote }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return adminServerError("quotes.create", error);
  }
}
