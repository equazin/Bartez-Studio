import { getDb } from "../../db.ts";
import { nextNumber } from "../sales/numbering.ts";
import type { JournalEntryCreate, LedgerAccountCreate, LedgerAccountType } from "./schema.ts";

export class AccountingValidationError extends Error {}

function round2(value: number) {
  return Math.round(value * 100) / 100;
}

/**
 * Plan de cuentas básico argentino. Los grupos (sin punto final de detalle)
 * son títulos; las cuentas imputables son las hojas. El seed sólo corre si la
 * organización todavía no tiene cuentas.
 */
const DEFAULT_CHART: Array<{ code: string; name: string; type: LedgerAccountType }> = [
  { code: "1", name: "Activo", type: "asset" },
  { code: "1.1.01", name: "Caja y Bancos", type: "asset" },
  { code: "1.1.02", name: "Deudores por Ventas", type: "asset" },
  { code: "1.1.03", name: "IVA Crédito Fiscal", type: "asset" },
  { code: "1.1.04", name: "Bienes de Cambio", type: "asset" },
  { code: "1.2.01", name: "Bienes de Uso", type: "asset" },
  { code: "2", name: "Pasivo", type: "liability" },
  { code: "2.1.01", name: "Proveedores", type: "liability" },
  { code: "2.1.02", name: "IVA Débito Fiscal", type: "liability" },
  { code: "2.1.03", name: "Cargas Fiscales a Pagar", type: "liability" },
  { code: "3", name: "Patrimonio Neto", type: "equity" },
  { code: "3.1.01", name: "Capital", type: "equity" },
  { code: "3.1.02", name: "Resultados Acumulados", type: "equity" },
  { code: "4", name: "Ingresos", type: "income" },
  { code: "4.1.01", name: "Ventas", type: "income" },
  { code: "4.1.02", name: "Otros Ingresos", type: "income" },
  { code: "5", name: "Egresos", type: "expense" },
  { code: "5.1.01", name: "Costo de Mercadería Vendida", type: "expense" },
  { code: "5.1.02", name: "Gastos de Comercialización", type: "expense" },
  { code: "5.1.03", name: "Gastos de Administración", type: "expense" },
  { code: "5.1.04", name: "Gastos Bancarios", type: "expense" },
];

export async function seedChartOfAccounts(organizationId: string) {
  const db = getDb();
  const existing = await db.ledgerAccount.count({ where: { organizationId } });
  if (existing > 0) return { created: 0 };
  await db.ledgerAccount.createMany({
    data: DEFAULT_CHART.map((account) => ({
      organizationId,
      code: account.code,
      name: account.name,
      type: account.type,
    })),
  });
  return { created: DEFAULT_CHART.length };
}

export async function listLedgerAccounts(organizationId: string) {
  const db = getDb();
  return db.ledgerAccount.findMany({
    where: { organizationId },
    orderBy: { code: "asc" },
  });
}

export async function createLedgerAccount(options: { organizationId: string; data: LedgerAccountCreate }) {
  const db = getDb();
  const data = options.data;
  const duplicate = await db.ledgerAccount.findFirst({
    where: { organizationId: options.organizationId, code: data.code },
    select: { id: true },
  });
  if (duplicate) throw new AccountingValidationError(`Ya existe una cuenta con el código ${data.code}`);
  return db.ledgerAccount.create({
    data: {
      organizationId: options.organizationId,
      code: data.code,
      name: data.name,
      type: data.type,
      parentId: data.parentId,
      active: data.active,
    },
  });
}

export async function createJournalEntry(options: { organizationId: string; data: JournalEntryCreate; source?: "manual" | "auto" }) {
  const db = getDb();
  const data = options.data;

  const totalDebit = round2(data.lines.reduce((sum, line) => sum + Number(line.debit), 0));
  const totalCredit = round2(data.lines.reduce((sum, line) => sum + Number(line.credit), 0));
  if (totalDebit === 0 && totalCredit === 0) {
    throw new AccountingValidationError("El asiento no tiene importes");
  }
  if (totalDebit !== totalCredit) {
    throw new AccountingValidationError(`El asiento no balancea: Debe ${totalDebit} ≠ Haber ${totalCredit}`);
  }
  for (const line of data.lines) {
    const debit = Number(line.debit);
    const credit = Number(line.credit);
    if (debit > 0 && credit > 0) {
      throw new AccountingValidationError("Una línea no puede tener Debe y Haber a la vez");
    }
    if (debit === 0 && credit === 0) {
      throw new AccountingValidationError("Una línea no puede tener Debe y Haber en cero");
    }
  }

  return db.$transaction(async (tx) => {
    const accountIds = Array.from(new Set(data.lines.map((line) => line.accountId)));
    const accounts = await tx.ledgerAccount.findMany({
      where: { id: { in: accountIds }, organizationId: options.organizationId },
      select: { id: true },
    });
    if (accounts.length !== accountIds.length) {
      throw new AccountingValidationError("Una cuenta del asiento no existe");
    }

    const { number } = await nextNumber(tx, { organizationId: options.organizationId, docType: "asiento" });
    return tx.journalEntry.create({
      data: {
        organizationId: options.organizationId,
        number,
        date: data.date ?? new Date(),
        description: data.description,
        referenceType: data.referenceType,
        referenceId: data.referenceId,
        source: options.source ?? "manual",
        lines: {
          create: data.lines.map((line) => ({
            accountId: line.accountId,
            debit: line.debit,
            credit: line.credit,
            description: line.description,
          })),
        },
      },
      include: { lines: { include: { account: { select: { code: true, name: true } } } } },
    });
  });
}

export async function voidJournalEntry(options: { organizationId: string; id: string }) {
  const db = getDb();
  const entry = await db.journalEntry.findFirst({
    where: { id: options.id, organizationId: options.organizationId, voidedAt: null },
  });
  if (!entry) return null;
  return db.journalEntry.update({ where: { id: entry.id }, data: { voidedAt: new Date() } });
}

export async function listJournalEntries(options: { organizationId: string; from?: Date; to?: Date; skip?: number; take?: number }) {
  const db = getDb();
  const where: Record<string, unknown> = { organizationId: options.organizationId };
  if (options.from || options.to) {
    where.date = { ...(options.from ? { gte: options.from } : {}), ...(options.to ? { lte: options.to } : {}) };
  }
  const [data, total] = await Promise.all([
    db.journalEntry.findMany({
      where,
      orderBy: { date: "desc" },
      skip: options.skip,
      take: options.take,
      include: { lines: { include: { account: { select: { code: true, name: true } } } } },
    }),
    db.journalEntry.count({ where }),
  ]);
  return { data, total };
}

/** Libro Mayor de una cuenta: movimientos con saldo acumulado. */
export async function getLedger(options: { organizationId: string; accountId: string; from?: Date; to?: Date }) {
  const db = getDb();
  const account = await db.ledgerAccount.findFirst({
    where: { id: options.accountId, organizationId: options.organizationId },
  });
  if (!account) return null;

  const entryWhere: Record<string, unknown> = { organizationId: options.organizationId, voidedAt: null };
  if (options.from || options.to) {
    entryWhere.date = { ...(options.from ? { gte: options.from } : {}), ...(options.to ? { lte: options.to } : {}) };
  }

  const lines = await db.journalLine.findMany({
    where: { accountId: options.accountId, entry: entryWhere },
    include: { entry: { select: { number: true, date: true, description: true } } },
    orderBy: { entry: { date: "asc" } },
  });

  let balance = 0;
  const movements = lines.map((line) => {
    const debit = Number(line.debit);
    const credit = Number(line.credit);
    // Activo/Egreso: saldo deudor (debe - haber). Pasivo/PN/Ingreso: saldo acreedor.
    const isDebitNature = account.type === "asset" || account.type === "expense";
    balance += isDebitNature ? debit - credit : credit - debit;
    return {
      entryNumber: line.entry.number,
      date: line.entry.date,
      description: line.description || line.entry.description,
      debit,
      credit,
      balance: round2(balance),
    };
  });

  return { account, movements };
}

/** Balance de Sumas y Saldos: por cuenta, totales de debe/haber y saldo. */
export async function getTrialBalance(options: { organizationId: string; from?: Date; to?: Date }) {
  const db = getDb();
  const accounts = await db.ledgerAccount.findMany({
    where: { organizationId: options.organizationId },
    orderBy: { code: "asc" },
  });

  const entryWhere: Record<string, unknown> = { organizationId: options.organizationId, voidedAt: null };
  if (options.from || options.to) {
    entryWhere.date = { ...(options.from ? { gte: options.from } : {}), ...(options.to ? { lte: options.to } : {}) };
  }

  const grouped = await db.journalLine.groupBy({
    by: ["accountId"],
    where: { entry: entryWhere },
    _sum: { debit: true, credit: true },
  });
  const byAccount = new Map(grouped.map((g) => [g.accountId, { debit: Number(g._sum.debit ?? 0), credit: Number(g._sum.credit ?? 0) }]));

  const rows = accounts.map((account) => {
    const totals = byAccount.get(account.id) ?? { debit: 0, credit: 0 };
    const isDebitNature = account.type === "asset" || account.type === "expense";
    const balance = isDebitNature ? totals.debit - totals.credit : totals.credit - totals.debit;
    return {
      id: account.id,
      code: account.code,
      name: account.name,
      type: account.type,
      debit: round2(totals.debit),
      credit: round2(totals.credit),
      balance: round2(balance),
    };
  });

  const totalDebit = round2(rows.reduce((sum, row) => sum + row.debit, 0));
  const totalCredit = round2(rows.reduce((sum, row) => sum + row.credit, 0));
  return { rows, totalDebit, totalCredit };
}
