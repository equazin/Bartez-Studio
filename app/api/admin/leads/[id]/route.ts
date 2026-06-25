import { NextRequest, NextResponse } from "next/server";
import { verifyToken, tokenFromCookieHeader } from "../../../../../lib/auth-token";
import { getDb } from "../../../../../lib/db";
import { checkRateLimit } from "../../../../../lib/rate-limit";
import { logAudit } from "../../../../../lib/audit";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await verifyToken(tokenFromCookieHeader(request.headers.get("cookie")) ?? "");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rl = checkRateLimit(request, "admin:mutations", 30, 60_000);
  if (!rl.allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });

  const { id } = await params;
  const body = await request.json();
  const { name, company, email, phone, source, status, value, notes, waId } = body;

  const lead = await getDb().lead.update({
    where: { id: Number(id) },
    data: {
      ...(name !== undefined && { name }),
      ...(company !== undefined && { company: company || null }),
      ...(email !== undefined && { email: email || null }),
      ...(phone !== undefined && { phone: phone || null }),
      ...(source !== undefined && { source }),
      ...(status !== undefined && { status }),
      ...(value !== undefined && { value: value ? Number(value) : null }),
      ...(notes !== undefined && { notes: notes || null }),
      ...(waId !== undefined && { waId: waId || null }),
    },
  });

  logAudit("update", "lead", id, body);
  return NextResponse.json(lead);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await verifyToken(tokenFromCookieHeader(request.headers.get("cookie")) ?? "");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rl = checkRateLimit(request, "admin:mutations", 30, 60_000);
  if (!rl.allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });

  const { id } = await params;
  await getDb().lead.delete({ where: { id: Number(id) } });
  logAudit("delete", "lead", id);
  return NextResponse.json({ ok: true });
}
