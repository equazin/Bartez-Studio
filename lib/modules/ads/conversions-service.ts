/**
 * Orquestador de conversiones publicitarias.
 *
 * Cuando se concreta una venta (factura emitida), resuelve la atribución del
 * cliente (vía el lead asociado a la cuenta) y dispara las conversiones a
 * Google Ads y Meta según corresponda. Aislado y a prueba de fallos: nunca
 * lanza ni bloquea la facturación.
 *
 * Las conversiones se persisten como DomainEvent con status. Si fallan, quedan
 * en "failed" para que el cron de reintentos las re-despache (máximo 3 intentos).
 */
import { getDb } from "../../db.ts";
import { logger } from "../../logger.ts";
import { sendGoogleAdsConversion, type ConversionResult } from "../../integrations/google-ads.ts";
import { sendMetaConversion } from "../../integrations/meta-ads.ts";

export interface SaleConversionInput {
  organizationId: string;
  accountId?: string | null;
  orderId: string;
  value: number;
  currency: string;
  isCreditNote?: boolean;
  eventTime?: Date;
}

const MAX_ATTEMPTS = 3;

interface ConversionPayload {
  orderId: string;
  value: number;
  currency: string;
  gclid?: string | null;
  fbclid?: string | null;
  email?: string;
  eventTime?: string;
  results?: ConversionResult[];
  error?: string;
}

async function resolveAttribution(accountId: string) {
  const lead = await getDb().lead.findFirst({
    where: {
      accountId,
      OR: [{ gclid: { not: null } }, { fbclid: { not: null } }],
    },
    orderBy: { createdAt: "desc" },
    select: { gclid: true, fbclid: true, email: true },
  });
  if (!lead || (!lead.gclid && !lead.fbclid)) return null;

  const account = await getDb().account.findUnique({
    where: { id: accountId },
    select: { email: true },
  });

  return {
    gclid: lead.gclid,
    fbclid: lead.fbclid,
    email: lead.email ?? account?.email ?? undefined,
  };
}

async function dispatchConversions(
  organizationId: string,
  payload: ConversionPayload,
): Promise<ConversionResult[]> {
  const tasks: Promise<ConversionResult>[] = [];

  if (payload.gclid) {
    tasks.push(
      sendGoogleAdsConversion({
        organizationId,
        gclid: payload.gclid,
        value: payload.value,
        currencyCode: payload.currency,
        conversionDateTime: payload.eventTime ? new Date(payload.eventTime) : undefined,
        orderId: payload.orderId,
      }),
    );
  }
  if (payload.fbclid) {
    tasks.push(
      sendMetaConversion({
        organizationId,
        fbclid: payload.fbclid,
        value: payload.value,
        currency: payload.currency,
        email: payload.email,
        eventTime: payload.eventTime ? new Date(payload.eventTime) : undefined,
        orderId: payload.orderId,
      }),
    );
  }

  return Promise.all(tasks);
}

function allSucceeded(results: ConversionResult[]): boolean {
  return results.length > 0 && results.every((r) => r.ok || r.skipped);
}

export async function sendSaleConversions(input: SaleConversionInput): Promise<ConversionResult[]> {
  try {
    if (input.isCreditNote) return [];
    if (input.value <= 0) return [];
    if (!input.accountId) return [];

    const attribution = await resolveAttribution(input.accountId);
    if (!attribution) return [];

    const payload: ConversionPayload = {
      orderId: input.orderId,
      value: input.value,
      currency: input.currency,
      gclid: attribution.gclid,
      fbclid: attribution.fbclid,
      email: attribution.email,
      eventTime: (input.eventTime ?? new Date()).toISOString(),
    };

    const event = await getDb().domainEvent.create({
      data: {
        organizationId: input.organizationId,
        type: "ads.conversion",
        payload: payload as object,
        status: "pending",
        attemptCount: 0,
      },
    });

    const results = await dispatchConversions(input.organizationId, payload);

    const succeeded = allSucceeded(results);
    await getDb().domainEvent.update({
      where: { id: event.id },
      data: {
        status: succeeded ? "success" : "failed",
        attemptCount: 1,
        lastAttemptAt: new Date(),
        processedAt: succeeded ? new Date() : null,
        payload: { ...payload, results } as object,
      },
    });

    return results;
  } catch (error) {
    logger.error("ads.conversion.dispatch", error);
    return [];
  }
}

/**
 * Re-despacha conversiones fallidas. Llamado por el cron de reintentos.
 * Devuelve cuántos eventos procesó.
 */
export async function retryFailedConversions(organizationId: string): Promise<number> {
  const failed = await getDb().domainEvent.findMany({
    where: {
      type: "ads.conversion",
      status: "failed",
      attemptCount: { lt: MAX_ATTEMPTS },
      organizationId,
    },
    orderBy: { createdAt: "asc" },
    take: 20,
  });

  let processed = 0;
  for (const event of failed) {
    const payload = event.payload as unknown as ConversionPayload;
    try {
      const results = await dispatchConversions(organizationId, payload);
      const succeeded = allSucceeded(results);

      await getDb().domainEvent.update({
        where: { id: event.id },
        data: {
          status: succeeded ? "success" : "failed",
          attemptCount: event.attemptCount + 1,
          lastAttemptAt: new Date(),
          processedAt: succeeded ? new Date() : null,
          payload: { ...payload, results } as object,
        },
      });
    } catch (err) {
      await getDb().domainEvent.update({
        where: { id: event.id },
        data: {
          attemptCount: event.attemptCount + 1,
          lastAttemptAt: new Date(),
          payload: { ...payload, error: (err as Error).message } as object,
        },
      });
    }
    processed++;
  }

  return processed;
}
