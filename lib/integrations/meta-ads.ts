/**
 * Meta Ads — Conversions API (CAPI).
 *
 * Reporta el evento "Purchase" cuando un lead que vino de Facebook/Instagram
 * (tiene `fbclid`) factura, para optimización y atribución de campañas.
 *
 * Credenciales vía getCredential (provider "meta_ads"). Sin credenciales →
 * skipped. La PII (email) se hashea con SHA-256 según exige Meta.
 *
 * Doc: https://developers.facebook.com/docs/marketing-api/conversions-api
 */
import { createHash } from "node:crypto";
import { getCredential } from "../modules/system/credentials-service.ts";
import { resolveDefaultOrg } from "../tenant.ts";
import { logger } from "../logger.ts";
import type { ConversionResult } from "./google-ads.ts";

const GRAPH_VERSION = "v21.0";

export interface MetaConversionInput {
  organizationId?: string;
  fbclid: string;
  value: number;
  currency: string;
  /** Email del comprador (se hashea antes de enviar). */
  email?: string;
  /** Momento del evento (default: ahora). */
  eventTime?: Date;
  /** Para deduplicación con el pixel del navegador. */
  orderId?: string;
}

interface MetaCreds {
  accessToken: string;
  pixelId: string;
  testEventCode: string;
}

async function loadCreds(orgId: string): Promise<MetaCreds | null> {
  const [accessToken, pixelId, testEventCode] = await Promise.all([
    getCredential(orgId, "meta_ads", "access_token", "META_ADS_ACCESS_TOKEN"),
    getCredential(orgId, "meta_ads", "pixel_id", "META_ADS_PIXEL_ID"),
    getCredential(orgId, "meta_ads", "test_event_code", "META_ADS_TEST_EVENT_CODE"),
  ]);
  if (!accessToken || !pixelId) return null;
  return { accessToken, pixelId, testEventCode };
}

/** Hash SHA-256 de PII, normalizado (trim + lowercase) como pide Meta. */
export function hashPii(value: string): string {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

/** Construye el parámetro `fbc` a partir del fbclid: "fb.1.<ts>.<fbclid>". */
export function buildFbc(fbclid: string, timestampMs: number): string {
  return `fb.1.${timestampMs}.${fbclid}`;
}

export async function sendMetaConversion(input: MetaConversionInput): Promise<ConversionResult> {
  try {
    if (!input.fbclid) return { platform: "meta_ads", ok: false, skipped: true, detail: "Sin fbclid" };
    const orgId = input.organizationId ?? (await resolveDefaultOrg()).id;
    const creds = await loadCreds(orgId);
    if (!creds) return { platform: "meta_ads", ok: false, skipped: true, detail: "No configurado" };

    const eventTime = input.eventTime ?? new Date();
    const eventTimeSec = Math.floor(eventTime.getTime() / 1000);

    const userData: Record<string, unknown> = {
      fbc: buildFbc(input.fbclid, eventTime.getTime()),
    };
    if (input.email) userData.em = [hashPii(input.email)];

    const url = `https://graph.facebook.com/${GRAPH_VERSION}/${creds.pixelId}/events?access_token=${encodeURIComponent(creds.accessToken)}`;

    const body: Record<string, unknown> = {
      data: [
        {
          event_name: "Purchase",
          event_time: eventTimeSec,
          action_source: "system_generated",
          ...(input.orderId ? { event_id: input.orderId } : {}),
          user_data: userData,
          custom_data: {
            value: Number(input.value.toFixed(2)),
            currency: input.currency,
            ...(input.orderId ? { order_id: input.orderId } : {}),
          },
        },
      ],
    };
    if (creds.testEventCode) body.test_event_code = creds.testEventCode;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Meta CAPI HTTP ${res.status}: ${text.slice(0, 200)}`);
    }
    return { platform: "meta_ads", ok: true, detail: `Evento Purchase enviado (fbclid ${input.fbclid.slice(0, 8)}…)` };
  } catch (error) {
    logger.error("ads.meta.conversion", error);
    return { platform: "meta_ads", ok: false, detail: (error as Error).message };
  }
}
