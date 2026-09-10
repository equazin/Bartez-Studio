import { NextRequest, NextResponse } from "next/server";
import { verifyToken, tokenFromCookieHeader } from "../../../../lib/auth-token";
import { getDb } from "../../../../lib/db";
import { checkRateLimit } from "../../../../lib/rate-limit";
import { logAudit } from "../../../../lib/audit";
import { adminServerError } from "../../../../lib/admin-api";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const session = await verifyToken(tokenFromCookieHeader(request.headers.get("cookie")) ?? "");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
  const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit")) || 20));
  const status = url.searchParams.get("status") || undefined;
  const q = url.searchParams.get("q")?.trim() || undefined;

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { company: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { phone: { contains: q } },
    ];
  }

  // withTotal=0 omite el count() sobre la tabla entera. Lo usa el poller de
  // notificaciones, que solo mira el lead más reciente y descarta el total.
  const withTotal = url.searchParams.get("withTotal") !== "0";

  const db = getDb();
  try {
    const [leads, total] = await Promise.all([
      db.lead.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      withTotal ? db.lead.count({ where }) : Promise.resolve(null),
    ]);

    return NextResponse.json({ data: leads, meta: { total, page, limit } });
  } catch (error) {
    return adminServerError("leads.list", error);
  }
}

export async function POST(request: NextRequest) {
  const session = await verifyToken(tokenFromCookieHeader(request.headers.get("cookie")) ?? "");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rl = checkRateLimit(request, "admin:mutations", 30, 60_000);
  if (!rl.allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });

  const body = await request.json();
  const { name, company, email, phone, source, status, value, notes, waId } = body;
  if (!name || typeof name !== "string") return NextResponse.json({ error: "Name is required" }, { status: 400 });

  const lead = await getDb().lead.create({
    data: {
      name,
      company: company || null,
      email: email || null,
      phone: phone || null,
      source: source || "manual",
      status: status || "nuevo",
      value: value ? Number(value) : null,
      notes: notes || null,
      waId: waId || null,
    },
  });

  logAudit("create", "lead", String(lead.id), { name, source: lead.source });
  return NextResponse.json(lead, { status: 201 });
}
