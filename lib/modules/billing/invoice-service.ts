import type { Prisma } from "@prisma/client";
import { getDb } from "../../db.ts";
import { calcQuote } from "../sales/calc.ts";
import { nextNumber } from "../sales/numbering.ts";
import { AFIP_IVA_CODES, AFIP_RECEIVER_DOC_TYPES, findDocType, shortDocCode } from "../afip/catalog.ts";
import { solicitarCae } from "../afip/wsfe.ts";
import { getAfipConfig } from "../afip/config.ts";
import { buildAfipQrUrl } from "../afip/qr.ts";
import { postAutoEntry, voidAutoEntries } from "../accounting/accounting-service.ts";
import type { InvoiceCreate } from "./schema.ts";

/**
 * Service de facturación.
 *
 * createInvoice:
 *   1. Calcula totales con el motor compartido (calcQuote).
 *   2. Genera el folio interno via Sequence (docType: factura_a/b/c …).
 *   3. Solicita CAE a AFIP (o simula en modo dev).
 *   4. Persiste la Invoice + InvoiceLine[] + CustomerAccountEntry
 *      (debit por el total) en una transacción.
 *
 * Devuelve la Invoice junto con la URL del QR fiscal.
 */

export class InvoiceValidationError extends Error {}

function docTypeKey(docTypeCode: number): string {
  const doc = findDocType(docTypeCode);
  if (!doc) return "factura_b";
  if (doc.isCreditNote) return "nota_credito";
  if (doc.isDebitNote) return "nota_debito";
  // FCA → factura_a, FCB → factura_b, FCC → factura_c
  return `factura_${doc.letter.toLowerCase()}`;
}

function buildIvaItems(lines: { lineSubtotal: number; lineTax: number; taxRate: number }[]): Array<{ code: number; baseImp: number; importe: number }> {
  const byRate = new Map<string, { code: number; baseImp: number; importe: number }>();
  for (const l of lines) {
    const key = String(l.taxRate);
    const code = AFIP_IVA_CODES[key] ?? AFIP_IVA_CODES["21"];
    const existing = byRate.get(key) ?? { code, baseImp: 0, importe: 0 };
    existing.baseImp += l.lineSubtotal;
    existing.importe += l.lineTax;
    byRate.set(key, existing);
  }
  return Array.from(byRate.values()).map((v) => ({
    code: v.code,
    baseImp: Math.round(v.baseImp * 100) / 100,
    importe: Math.round(v.importe * 100) / 100,
  }));
}

export async function createInvoice(options: { organizationId: string; data: InvoiceCreate }) {
  const db = getDb();
  const cfg = getAfipConfig();
  const data = options.data;
  const doc = findDocType(data.docTypeCode);
  if (!doc) {
    throw new InvoiceValidationError("Tipo de comprobante AFIP no soportado");
  }

  const drafts = data.lines.map((l) => ({
    quantity: Number(l.quantity),
    unitPrice: Number(l.unitPrice),
    discountPct: Number(l.discountPct ?? 0),
    taxRate: Number(l.taxRate ?? 21),
  }));
  const { totals, lines: lineTotals } = calcQuote(drafts);

  // Detalle por línea con sus impuestos para AFIP
  const linesForAfip = data.lines.map((l, idx) => ({
    lineSubtotal: lineTotals[idx].lineSubtotal,
    lineTax: lineTotals[idx].lineTax,
    taxRate: Number(l.taxRate ?? 21),
  }));
  const ivaItems = buildIvaItems(linesForAfip);

  const receiverDocType = data.receiverDocType ?? (data.receiverTaxId ? AFIP_RECEIVER_DOC_TYPES.CUIT : AFIP_RECEIVER_DOC_TYPES.CF);
  const issueDate = data.issueDate ?? new Date();
  const needsAssociated = doc.isCreditNote || doc.isDebitNote;
  const relatedInvoice = data.relatedInvoiceId
    ? await db.invoice.findFirst({
        where: {
          id: data.relatedInvoiceId,
          organizationId: options.organizationId,
          status: "issued",
          deletedAt: null,
        },
        select: {
          id: true,
          docTypeCode: true,
          pointOfSale: true,
          afipNumber: true,
          accountId: true,
        },
      })
    : null;

  if (needsAssociated && !relatedInvoice) {
    throw new InvoiceValidationError("Las notas de credito/debito requieren un comprobante emitido asociado");
  }
  if (relatedInvoice && !relatedInvoice.afipNumber) {
    throw new InvoiceValidationError("El comprobante asociado no tiene numero AFIP");
  }
  if (data.accountId && relatedInvoice?.accountId && relatedInvoice.accountId !== data.accountId) {
    throw new InvoiceValidationError("El comprobante asociado no pertenece a la cuenta indicada");
  }

  // 1) Pedimos CAE primero (afuera de la tx local; AFIP es una llamada externa
  //    que puede ser lenta). Si falla, no creamos la factura.
  const afip = await solicitarCae({
    organizationId: options.organizationId,
    pointOfSale: data.pointOfSale,
    docTypeCode: data.docTypeCode,
    concept: data.concept,
    receiver: {
      docType: receiverDocType,
      docNumber: data.receiverTaxId ?? "0",
    },
    issueDate,
    serviceFrom: data.serviceFrom ?? null,
    serviceTo: data.serviceTo ?? null,
    paymentDueDate: data.paymentDueDate ?? null,
    currency: data.currency,
    exchangeRate: Number(data.exchangeRate),
    totals: {
      netNoTaxed: 0,
      netTaxed: totals.subtotal,
      exempt: 0,
      tax: totals.taxTotal,
      nonTaxedOther: 0,
      total: totals.total,
    },
    ivaItems,
    associated: relatedInvoice?.afipNumber ? [{
      docTypeCode: relatedInvoice.docTypeCode,
      pointOfSale: relatedInvoice.pointOfSale,
      afipNumber: relatedInvoice.afipNumber,
    }] : undefined,
  });

  // 2) Persistimos comprobante + entrada de cuenta corriente
  return db.$transaction(async (tx) => {
    const { number } = await nextNumber(tx, { organizationId: options.organizationId, docType: docTypeKey(data.docTypeCode), pointOfSale: data.pointOfSale });

    const invoice = await tx.invoice.create({
      data: {
        organizationId: options.organizationId,
        number,
        docTypeCode: data.docTypeCode,
        pointOfSale: data.pointOfSale,
        afipNumber: afip.afipNumber,
        cae: afip.cae,
        caeExpiresAt: afip.caeExpiresAt,
        afipStatus: "issued",
        afipObservations: afip.rawObservations.length > 0 ? (afip.rawObservations as unknown as Prisma.InputJsonValue) : undefined,
        accountId: data.accountId,
        orderId: data.orderId,
        relatedInvoiceId: data.relatedInvoiceId,
        receiverName: data.receiverName,
        receiverTaxId: data.receiverTaxId,
        receiverDocType,
        receiverAddress: data.receiverAddress,
        currency: data.currency === "DOL" ? "USD" : "ARS",
        exchangeRate: Number(data.exchangeRate),
        issueDate,
        serviceFrom: data.serviceFrom ?? null,
        serviceTo: data.serviceTo ?? null,
        paymentDueDate: data.paymentDueDate ?? null,
        subtotal: totals.subtotal,
        discountTotal: totals.discountTotal,
        taxTotal: totals.taxTotal,
        total: totals.total,
        notes: data.notes,
        status: "issued",
        issuedAt: new Date(),
        lines: {
          create: data.lines.map((l, idx) => ({
            position: idx,
            productId: l.productId,
            description: l.description,
            quantity: l.quantity,
            unitPrice: l.unitPrice,
            discountPct: l.discountPct ?? 0,
            taxRate: l.taxRate ?? 21,
            lineSubtotal: lineTotals[idx].lineSubtotal,
            lineTax: lineTotals[idx].lineTax,
            lineTotal: lineTotals[idx].lineTotal,
          })),
        },
      },
      include: { lines: { orderBy: { position: "asc" } } },
    });

    // Asiento en cuenta corriente: una nota de crédito (isCreditNote) genera credit,
    // el resto (facturas y NDs) genera debit.
    const isCredit = doc.isCreditNote;
    if (data.accountId) {
      await tx.customerAccountEntry.create({
        data: {
          organizationId: options.organizationId,
          accountId: data.accountId,
          date: issueDate,
          type: isCredit ? "credit_note" : "invoice",
          referenceType: "invoice",
          referenceId: invoice.id,
          description: `${shortDocCode(data.docTypeCode)} ${number}`,
          debit: isCredit ? 0 : totals.total,
          credit: isCredit ? totals.total : 0,
          currency: invoice.currency,
        },
      });
    }

    // Asiento contable automático (partida doble). Factura: Debe Deudores,
    // Haber Ventas + IVA Débito. Nota de crédito: al revés.
    await postAutoEntry(tx, {
      organizationId: options.organizationId,
      date: issueDate,
      description: `${shortDocCode(data.docTypeCode)} ${number}`,
      referenceType: "invoice",
      referenceId: invoice.id,
      lines: isCredit
        ? [
            { code: "4.1.01", debit: totals.subtotal },
            { code: "2.1.02", debit: totals.taxTotal },
            { code: "1.1.02", credit: totals.total },
          ]
        : [
            { code: "1.1.02", debit: totals.total },
            { code: "4.1.01", credit: totals.subtotal },
            { code: "2.1.02", credit: totals.taxTotal },
          ],
    });

    return { invoice, qrUrl: buildAfipQrUrl({
      fecha: issueDate.toISOString().slice(0, 10),
      cuit: cfg.cuit || "00000000000",
      ptoVta: data.pointOfSale,
      tipoCmp: data.docTypeCode,
      nroCmp: afip.afipNumber,
      importe: totals.total,
      moneda: data.currency,
      ctz: Number(data.exchangeRate),
      tipoDocRec: receiverDocType,
      nroDocRec: data.receiverTaxId ?? "0",
      codAut: afip.cae,
    }), simulated: afip.simulated };
  });
}

export async function cancelInvoice(options: { organizationId: string; id: string }) {
  const db = getDb();
  return db.$transaction(async (tx) => {
    const existing = await tx.invoice.findFirst({ where: { id: options.id, organizationId: options.organizationId, deletedAt: null } });
    if (!existing) return null;
    if (existing.status === "cancelled") return existing;
    // Anular la entrada de cuenta corriente con un asiento espejo
    if (existing.accountId) {
      const doc = findDocType(existing.docTypeCode);
      const wasCredit = doc?.isCreditNote ?? false;
      await tx.customerAccountEntry.create({
        data: {
          organizationId: options.organizationId,
          accountId: existing.accountId,
          date: new Date(),
          type: "adjust",
          referenceType: "invoice",
          referenceId: existing.id,
          description: `Anulación ${existing.number}`,
          debit: wasCredit ? existing.total : 0,
          credit: wasCredit ? 0 : existing.total,
          currency: existing.currency,
        },
      });
    }
    await voidAutoEntries(tx, { organizationId: options.organizationId, referenceType: "invoice", referenceId: existing.id });
    return tx.invoice.update({ where: { id: existing.id }, data: { status: "cancelled", cancelledAt: new Date() } });
  });
}
