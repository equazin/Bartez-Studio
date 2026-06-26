import { getDb } from "../../db.ts";
import { createPreference } from "../../integrations/mercadopago/client.ts";
import { createReceipt } from "../collections/receipt-service.ts";
import { logger } from "../../logger.ts";
import { findDocType } from "../afip/catalog.ts";

/**
 * Crea un PaymentLink de MercadoPago para una factura. Devuelve la URL
 * del checkout (init_point). En modo simulación devuelve un link dummy
 * que la UI puede mostrar sin que rompa el flujo.
 */
export async function createInvoicePaymentLink(options: { organizationId: string; invoiceId: string }) {
  const db = getDb();
  const invoice = await db.invoice.findFirst({
    where: { id: options.invoiceId, organizationId: options.organizationId, deletedAt: null },
    include: { account: true, allocations: true },
  });
  if (!invoice) return null;
  if (findDocType(invoice.docTypeCode)?.isCreditNote) return null;

  const paid = invoice.allocations.reduce((s, a) => s + Number(a.amount), 0);
  const pending = Math.max(0, Number(invoice.total) - paid);
  if (pending <= 0.005) return null;

  const pref = await createPreference({
    title: `Factura ${invoice.number}`,
    description: invoice.receiverName,
    quantity: 1,
    unit_price: pending,
    currency_id: invoice.currency === "USD" ? "USD" : "ARS",
    external_reference: `inv:${invoice.id}`,
  });

  const link = await db.paymentLink.create({
    data: {
      organizationId: options.organizationId,
      invoiceId: invoice.id,
      provider: "mercadopago",
      externalId: pref.id,
      url: pref.init_point,
      amount: pending,
      currency: invoice.currency,
      status: "pending",
      expiresAt: new Date(Date.now() + 14 * 24 * 3600_000),
      metadata: { simulated: pref.simulated },
    },
  });
  return { link, simulated: pref.simulated };
}

/**
 * Procesa una notificación de MercadoPago. Si el pago está aprobado, crea
 * un Receipt imputado a la factura asociada.
 */
export async function processMpPayment(options: { organizationId: string; payment: { id: number; status: string; transaction_amount: number; currency_id: string; preference_id?: string | null; external_reference?: string | null } }) {
  const db = getDb();
  const p = options.payment;
  if (p.status !== "approved") {
    logger.info("mp.payment.skip", { id: p.id, status: p.status });
    return null;
  }

  // Vincular a la factura por external_reference (formato "inv:<id>")
  const invoiceId = p.external_reference?.startsWith("inv:") ? p.external_reference.slice(4) : null;
  if (!invoiceId) {
    logger.warn("mp.payment.noref", { id: p.id });
    return null;
  }

  const invoice = await db.invoice.findFirst({
    where: { id: invoiceId, organizationId: options.organizationId, deletedAt: null },
    include: { allocations: true },
  });
  if (!invoice || !invoice.accountId) return null;
  if (findDocType(invoice.docTypeCode)?.isCreditNote) return null;

  if (p.preference_id) {
    // Idempotencia por preference_id cuando MP la informa.
    const existing = await db.paymentLink.findFirst({ where: { externalId: p.preference_id, status: "paid" } });
    if (existing) return existing;
  }
  const existingReceipt = await db.receipt.findFirst({
    where: {
      organizationId: options.organizationId,
      accountId: invoice.accountId,
      method: "mercadopago",
      reference: String(p.id),
      deletedAt: null,
    },
  });
  if (existingReceipt) return existingReceipt;

  // Crear Receipt imputado
  const receipt = await createReceipt({
    organizationId: options.organizationId,
    method: "mercadopago",
    data: {
      accountId: invoice.accountId,
      receivedAt: new Date(),
      method: "mercadopago",
      reference: String(p.id),
      amount: p.transaction_amount,
      currency: p.currency_id === "USD" ? "USD" : "ARS",
      notes: `Pago MercadoPago ${p.id}`,
      allocations: [{ invoiceId: invoice.id, amount: Math.min(p.transaction_amount, Number(invoice.total)) }],
    },
  });

  if (p.preference_id) {
    await db.paymentLink.updateMany({
      where: { externalId: p.preference_id, organizationId: options.organizationId, status: "pending" },
      data: { status: "paid", paidAt: new Date() },
    });
  }
  return receipt;
}
