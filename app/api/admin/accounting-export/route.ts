import { NextResponse } from "next/server.js";
import { getDb } from "../../../../lib/db.ts";
import { authorizeModule } from "../../../../lib/modules/admin-module.ts";
import { adminServerError } from "../../../../lib/admin-api.ts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function csvEscape(value: unknown) {
  const text = value == null ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

function csv(rows: Array<Record<string, unknown>>) {
  const headers = ["date", "module", "type", "number", "counterparty", "debit", "credit", "currency", "reference"];
  return [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(",")),
  ].join("\n");
}

export async function GET(request: Request) {
  const auth = await authorizeModule(request, "finanzas:export:read");
  if (!auth.ok) return auth.response;

  const url = new URL(request.url);
  const from = url.searchParams.get("from") ? new Date(String(url.searchParams.get("from"))) : new Date(Date.now() - 30 * 24 * 3600_000);
  const to = url.searchParams.get("to") ? new Date(String(url.searchParams.get("to"))) : new Date();
  to.setHours(23, 59, 59, 999);

  try {
    const db = getDb();
    const [customerEntries, supplierEntries, cashMovements] = await Promise.all([
      db.customerAccountEntry.findMany({
        where: { organizationId: auth.orgId, date: { gte: from, lte: to } },
        include: { account: { select: { name: true } } },
        orderBy: { date: "asc" },
      }),
      db.supplierAccountEntry.findMany({
        where: { organizationId: auth.orgId, date: { gte: from, lte: to } },
        include: { supplier: { select: { name: true } } },
        orderBy: { date: "asc" },
      }),
      db.cashMovement.findMany({
        where: { organizationId: auth.orgId, date: { gte: from, lte: to } },
        include: { cashAccount: { select: { name: true } } },
        orderBy: { date: "asc" },
      }),
    ]);

    const rows = [
      ...customerEntries.map((entry) => ({
        date: entry.date.toISOString().slice(0, 10),
        module: "clientes",
        type: entry.type,
        number: entry.description,
        counterparty: entry.account.name,
        debit: entry.debit,
        credit: entry.credit,
        currency: entry.currency,
        reference: `${entry.referenceType ?? ""}:${entry.referenceId ?? ""}`,
      })),
      ...supplierEntries.map((entry) => ({
        date: entry.date.toISOString().slice(0, 10),
        module: "proveedores",
        type: entry.type,
        number: entry.description,
        counterparty: entry.supplier.name,
        debit: entry.debit,
        credit: entry.credit,
        currency: entry.currency,
        reference: `${entry.referenceType ?? ""}:${entry.referenceId ?? ""}`,
      })),
      ...cashMovements.map((movement) => ({
        date: movement.date.toISOString().slice(0, 10),
        module: "tesoreria",
        type: movement.type,
        number: movement.description,
        counterparty: movement.cashAccount.name,
        debit: movement.type === "income" ? movement.amount : 0,
        credit: movement.type === "expense" ? movement.amount : 0,
        currency: movement.currency,
        reference: `${movement.referenceType ?? ""}:${movement.referenceId ?? ""}`,
      })),
    ].sort((a, b) => String(a.date).localeCompare(String(b.date)));

    return new NextResponse(csv(rows), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="bartez-export-contable-${from.toISOString().slice(0, 10)}-${to.toISOString().slice(0, 10)}.csv"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return adminServerError("accountingExport", error);
  }
}
