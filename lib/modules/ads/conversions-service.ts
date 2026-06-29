/**
 * Orquestador de conversiones publicitarias.
 *
 * Cuando se concreta una venta (factura emitida), resuelve la atribución del
 * cliente (vía el lead asociado a la cuenta) y dispara las conversiones a
 * Google Ads y Meta según corresponda. Aislado y a prueba de fallos: nunca
 * lanza ni bloquea la facturación.
 */
import { getDb } from "../../db.ts";
import { logger } from "../../logger.ts";
import { sendGoogleAdsConversion, type ConversionResult } from "../../integrations/google-ads.ts";
import { sendMetaConversion } from "../../integrations/meta-ads.ts";

export interface SaleConversionInput {
  organizationId: string;
  /** Cuenta CRM del comprador (para resolver atribución del lead). */
  accountId?: string | null;
  /** Referencia de la venta (id o número de factura) para dedup/trazabilidad. */
  orderId: string;
  value: number;
  /** "ARS" | "USD" */
  currency: string;
  /** true si es nota de crédito → no se reporta como conversión. */
  isCreditNote?: boolean;
  eventTime?: Date;
}

/**
 * Resuelve y envía conversiones para una venta. Devuelve los resultados por
 * plataforma (o lista vacía si no hay nada que atribuir). No lanza.
 */
export async function sendSaleConversions(input: SaleConversionInput): Promise<ConversionResult[]> {
  try {
    if (input.isCreditNote) return [];
    if (input.value <= 0) return [];
    if (!input.accountId) return [];

    // Lead más reciente de la cuenta que tenga señal publicitaria.
    const lead = await getDb().lead.findFirst({
      where: {
        accountId: input.accountId,
        OR: [{ gclid: { not: null } }, { fbclid: { not: null } }],
      },
      orderBy: { createdAt: "desc" },
      select: { gclid: true, fbclid: true, email: true },
    });

    if (!lead || (!lead.gclid && !lead.fbclid)) return [];

    const account = await getDb().account.findUnique({
      where: { id: input.accountId },
      select: { email: true },
    });
    const email = lead.email ?? account?.email ?? undefined;

    const tasks: Promise<ConversionResult>[] = [];
    if (lead.gclid) {
      tasks.push(
        sendGoogleAdsConversion({
          organizationId: input.organizationId,
          gclid: lead.gclid,
          value: input.value,
          currencyCode: input.currency,
          conversionDateTime: input.eventTime,
          orderId: input.orderId,
        }),
      );
    }
    if (lead.fbclid) {
      tasks.push(
        sendMetaConversion({
          organizationId: input.organizationId,
          fbclid: lead.fbclid,
          value: input.value,
          currency: input.currency,
          email,
          eventTime: input.eventTime,
          orderId: input.orderId,
        }),
      );
    }

    const results = await Promise.all(tasks);

    // Registro para auditoría/depuración (no crítico si falla).
    try {
      await getDb().domainEvent.create({
        data: {
          organizationId: input.organizationId,
          type: "ads.conversion",
          payload: { orderId: input.orderId, value: input.value, currency: input.currency, results } as object,
          processedAt: new Date(),
        },
      });
    } catch (err) {
      logger.warn("ads.conversion.audit", err);
    }

    return results;
  } catch (error) {
    logger.error("ads.conversion.dispatch", error);
    return [];
  }
}
