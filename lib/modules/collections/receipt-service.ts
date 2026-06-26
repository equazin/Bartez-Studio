import { getDb } from "../../db.ts";
import { nextNumber } from "../sales/numbering.ts";
import { findDocType } from "../afip/catalog.ts";
import type { ReceiptCreate } from "./schema.ts";

/**
 * Service de cobranzas.
 *
 * createReceipt:
 *   - Numera el recibo via Sequence (docType "recibo").
 *   - Persiste Receipt + ReceiptAllocation[].
 *   - Asienta un CustomerAccountEntry con credit por el total cobrado.
 *   - Valida cuenta, saldo pendiente y que no se impute a notas de credito.
 */

export class ReceiptValidationError extends Error {}

export async function createReceipt(options: { organizationId: string; data: ReceiptCreate; method?: string }) {
  const db = getDb();
  const data = options.data;
  const allocations = data.allocations;
  const totalAllocated = allocations.reduce((s, a) => s + Number(a.amount), 0);
  if (totalAllocated > Number(data.amount) + 0.005) {
    throw new ReceiptValidationError(`Las imputaciones (${totalAllocated.toFixed(2)}) superan el importe del recibo (${Number(data.amount).toFixed(2)})`);
  }

  return db.$transaction(async (tx) => {
    if (allocations.length > 0) {
      const invoices = await tx.invoice.findMany({
        where: {
          id: { in: allocations.map((a) => a.invoiceId) },
          organizationId: options.organizationId,
          accountId: data.accountId,
          deletedAt: null,
        },
        include: { allocations: true },
      });
      if (invoices.length !== allocations.length) {
        throw new ReceiptValidationError("Una o mas facturas no pertenecen a la cuenta indicada");
      }

      const invoicesById = new Map(invoices.map((invoice) => [invoice.id, invoice]));
      for (const allocation of allocations) {
        const invoice = invoicesById.get(allocation.invoiceId);
        if (!invoice) continue;
        if (findDocType(invoice.docTypeCode)?.isCreditNote) {
          throw new ReceiptValidationError("No se pueden imputar recibos a notas de credito");
        }
        const alreadyPaid = invoice.allocations.reduce((sum, item) => sum + Number(item.amount), 0);
        const pending = Number(invoice.total) - alreadyPaid;
        if (Number(allocation.amount) > pending + 0.005) {
          throw new ReceiptValidationError(`La imputacion supera el saldo pendiente de ${invoice.number}`);
        }
      }
    }

    const { number } = await nextNumber(tx, { organizationId: options.organizationId, docType: "recibo" });
    const receivedAt = data.receivedAt ?? new Date();

    const receipt = await tx.receipt.create({
      data: {
        organizationId: options.organizationId,
        number,
        accountId: data.accountId,
        receivedAt,
        method: options.method ?? data.method,
        reference: data.reference,
        amount: data.amount,
        currency: data.currency,
        notes: data.notes,
        allocations: {
          create: allocations.map((a) => ({ invoiceId: a.invoiceId, amount: a.amount })),
        },
      },
      include: { allocations: true },
    });

    await tx.customerAccountEntry.create({
      data: {
        organizationId: options.organizationId,
        accountId: data.accountId,
        date: receivedAt,
        type: "receipt",
        referenceType: "receipt",
        referenceId: receipt.id,
        description: `Recibo ${number}`,
        debit: 0,
        credit: data.amount,
        currency: data.currency,
      },
    });

    return receipt;
  });
}

/**
 * Calculo de saldo deudor de una cuenta (sum debit - sum credit) por moneda.
 */
export async function getAccountBalances(organizationId: string, accountId: string) {
  const db = getDb();
  const entries = await db.customerAccountEntry.findMany({
    where: { organizationId, accountId },
  });
  const byCurrency = new Map<string, { debit: number; credit: number }>();
  for (const e of entries) {
    const cur = byCurrency.get(e.currency) ?? { debit: 0, credit: 0 };
    cur.debit += Number(e.debit);
    cur.credit += Number(e.credit);
    byCurrency.set(e.currency, cur);
  }
  return Array.from(byCurrency.entries()).map(([currency, totals]) => ({
    currency,
    debit: Math.round(totals.debit * 100) / 100,
    credit: Math.round(totals.credit * 100) / 100,
    balance: Math.round((totals.debit - totals.credit) * 100) / 100,
  }));
}

/**
 * Saldo pendiente de cobro en una factura = total - sum allocations.
 */
export async function getInvoiceBalance(organizationId: string, invoiceId: string): Promise<{ total: number; paid: number; pending: number }> {
  const db = getDb();
  const invoice = await db.invoice.findFirst({
    where: { id: invoiceId, organizationId, deletedAt: null },
    include: { allocations: true },
  });
  if (!invoice) return { total: 0, paid: 0, pending: 0 };
  const paid = invoice.allocations.reduce((s, a) => s + Number(a.amount), 0);
  const total = Number(invoice.total);
  return {
    total,
    paid: Math.round(paid * 100) / 100,
    pending: Math.round((total - paid) * 100) / 100,
  };
}
