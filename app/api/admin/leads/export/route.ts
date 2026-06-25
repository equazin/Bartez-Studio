import { NextRequest, NextResponse } from "next/server";
import { verifyToken, tokenFromCookieHeader } from "../../../../../lib/auth-token";
import { getDb } from "../../../../../lib/db";

export const dynamic = "force-dynamic";

function escapeCsv(value: string | null | undefined): string {
  if (value == null) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET(request: NextRequest) {
  const session = await verifyToken(tokenFromCookieHeader(request.headers.get("cookie")) ?? "");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const status = url.searchParams.get("status") || undefined;

  const where: Record<string, unknown> = {};
  if (status) where.status = status;

  const leads = await getDb().lead.findMany({ where, orderBy: { createdAt: "desc" } });

  const headers = ["ID", "Nombre", "Empresa", "Email", "Teléfono", "Origen", "Estado", "Valor", "Notas", "WhatsApp ID", "Creado", "Actualizado"];
  const rows = leads.map((lead) => [
    String(lead.id),
    escapeCsv(lead.name),
    escapeCsv(lead.company),
    escapeCsv(lead.email),
    escapeCsv(lead.phone),
    escapeCsv(lead.source),
    escapeCsv(lead.status),
    lead.value != null ? String(lead.value) : "",
    escapeCsv(lead.notes),
    escapeCsv(lead.waId),
    new Date(lead.createdAt).toISOString(),
    new Date(lead.updatedAt).toISOString(),
  ].join(","));

  const csv = [headers.join(","), ...rows].join("\n");
  const filename = `leads-${new Date().toISOString().slice(0, 10)}.csv`;

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
