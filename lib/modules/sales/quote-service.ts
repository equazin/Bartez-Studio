import type { Prisma } from "@prisma/client";
import { getDb } from "../../db.ts";
import { calcQuote, type QuoteLineDraft } from "./calc.ts";
import { nextNumber } from "./numbering.ts";
import type { QuoteCreate } from "./schema.ts";

/**
 * Service del módulo Ventas — operaciones de Quote.
 *
 * Encapsula la creación y actualización dentro de una transacción
 * para mantener consistencia entre líneas y totales persistidos.
 */

interface CreateOptions {
  organizationId: string;
  data: QuoteCreate;
}

interface UpdateOptions {
  organizationId: string;
  id: string;
  data: Partial<QuoteCreate>;
}

function linesToDraft(lines: QuoteCreate["lines"]): QuoteLineDraft[] {
  return lines.map((l) => ({
    quantity: Number(l.quantity),
    unitPrice: Number(l.unitPrice),
    discountPct: Number(l.discountPct ?? 0),
    taxRate: Number(l.taxRate ?? 0),
  }));
}

export async function createQuote(options: CreateOptions) {
  const db = getDb();
  return db.$transaction(async (tx) => {
    const { number } = await nextNumber(tx, { organizationId: options.organizationId, docType: "presupuesto" });
    const drafts = linesToDraft(options.data.lines);
    const { totals, lines } = calcQuote(drafts);

    const quote = await tx.quote.create({
      data: {
        organizationId: options.organizationId,
        number,
        accountId: options.data.accountId,
        opportunityId: options.data.opportunityId,
        ownerId: options.data.ownerId,
        priceListId: options.data.priceListId,
        status: options.data.status ?? "draft",
        currency: options.data.currency ?? "USD",
        issueDate: options.data.issueDate ?? new Date(),
        validUntil: options.data.validUntil ?? null,
        notes: options.data.notes,
        terms: options.data.terms,
        subtotal: totals.subtotal,
        discountTotal: totals.discountTotal,
        taxTotal: totals.taxTotal,
        total: totals.total,
        lines: {
          create: options.data.lines.map((l, idx) => ({
            position: idx,
            productId: l.productId,
            description: l.description,
            quantity: l.quantity,
            unitPrice: l.unitPrice,
            discountPct: l.discountPct ?? 0,
            taxRate: l.taxRate ?? 0,
            lineSubtotal: lines[idx].lineSubtotal,
            lineTax: lines[idx].lineTax,
            lineTotal: lines[idx].lineTotal,
          })),
        },
      },
      include: { lines: { orderBy: { position: "asc" } } },
    });

    return quote;
  });
}

export async function updateQuote(options: UpdateOptions) {
  const db = getDb();
  return db.$transaction(async (tx) => {
    const existing = await tx.quote.findFirst({
      where: { id: options.id, organizationId: options.organizationId, deletedAt: null },
      include: { lines: true },
    });
    if (!existing) return null;

    const baseUpdate: Prisma.QuoteUpdateInput = {
      accountId: options.data.accountId ?? existing.accountId,
      opportunityId: options.data.opportunityId ?? existing.opportunityId,
      ownerId: options.data.ownerId ?? existing.ownerId,
      priceListId: options.data.priceListId ?? existing.priceListId,
      status: options.data.status ?? existing.status,
      currency: options.data.currency ?? existing.currency,
      issueDate: options.data.issueDate ?? existing.issueDate,
      validUntil: options.data.validUntil ?? existing.validUntil,
      notes: options.data.notes ?? existing.notes,
      terms: options.data.terms ?? existing.terms,
    } as Prisma.QuoteUpdateInput;

    if (options.data.lines && options.data.lines.length > 0) {
      const drafts = linesToDraft(options.data.lines);
      const { totals, lines } = calcQuote(drafts);
      // estrategia simple: borrar y recrear líneas. Para volúmenes mayores
      // se reemplaza por sync por id.
      await tx.quoteLine.deleteMany({ where: { quoteId: existing.id } });
      Object.assign(baseUpdate, {
        subtotal: totals.subtotal,
        discountTotal: totals.discountTotal,
        taxTotal: totals.taxTotal,
        total: totals.total,
        lines: {
          create: options.data.lines.map((l, idx) => ({
            position: idx,
            productId: l.productId,
            description: l.description,
            quantity: l.quantity,
            unitPrice: l.unitPrice,
            discountPct: l.discountPct ?? 0,
            taxRate: l.taxRate ?? 0,
            lineSubtotal: lines[idx].lineSubtotal,
            lineTax: lines[idx].lineTax,
            lineTotal: lines[idx].lineTotal,
          })),
        },
      });
    }

    const quote = await tx.quote.update({
      where: { id: existing.id },
      data: baseUpdate,
      include: { lines: { orderBy: { position: "asc" } } },
    });
    return quote;
  });
}

export async function transitionQuoteStatus(options: {
  organizationId: string;
  id: string;
  status: string;
}) {
  const db = getDb();
  const existing = await db.quote.findFirst({ where: { id: options.id, organizationId: options.organizationId, deletedAt: null } });
  if (!existing) return null;

  const data: Prisma.QuoteUpdateInput = { status: options.status };
  if (options.status === "sent" && !existing.sentAt) data.sentAt = new Date();
  if (options.status === "accepted" && !existing.acceptedAt) data.acceptedAt = new Date();
  if (options.status === "rejected" && !existing.rejectedAt) data.rejectedAt = new Date();

  return db.quote.update({ where: { id: existing.id }, data });
}
