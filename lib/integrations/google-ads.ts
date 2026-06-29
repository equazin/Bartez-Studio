/**
 * Google Ads — envío de conversiones offline (Offline Click Conversion Import).
 *
 * Cuando un lead que vino de Google Ads (tiene `gclid`) factura, se reporta la
 * conversión con su valor para que Google optimice las campañas hacia ventas
 * reales, no sólo clicks.
 *
 * Credenciales vía getCredential (provider "google_ads"). Sin credenciales →
 * modo simulado (no envía nada, devuelve skipped) para no romper la facturación.
 *
 * Doc: https://developers.google.com/google-ads/api/docs/conversions/upload-clicks
 */
import { getCredential } from "../modules/system/credentials-service.ts";
import { resolveDefaultOrg } from "../tenant.ts";
import { logger } from "../logger.ts";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const API_VERSION = "v18";

export interface GoogleConversionInput {
  organizationId?: string;
  gclid: string;
  value: number;
  currencyCode: string;
  /** Momento de la conversión (default: ahora). */
  conversionDateTime?: Date;
  /** Referencia para trazabilidad (orden/factura). */
  orderId?: string;
}

export interface ConversionResult {
  platform: "google_ads" | "meta_ads";
  ok: boolean;
  skipped?: boolean;
  detail?: string;
}

interface GoogleAdsCreds {
  developerToken: string;
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  customerId: string;
  loginCustomerId: string;
  conversionActionId: string;
}

async function loadCreds(orgId: string): Promise<GoogleAdsCreds | null> {
  const [developerToken, clientId, clientSecret, refreshToken, customerId, loginCustomerId, conversionActionId] =
    await Promise.all([
      getCredential(orgId, "google_ads", "developer_token", "GOOGLE_ADS_DEVELOPER_TOKEN"),
      getCredential(orgId, "google_ads", "client_id", "GOOGLE_ADS_CLIENT_ID"),
      getCredential(orgId, "google_ads", "client_secret", "GOOGLE_ADS_CLIENT_SECRET"),
      getCredential(orgId, "google_ads", "refresh_token", "GOOGLE_ADS_REFRESH_TOKEN"),
      getCredential(orgId, "google_ads", "customer_id", "GOOGLE_ADS_CUSTOMER_ID"),
      getCredential(orgId, "google_ads", "login_customer_id", "GOOGLE_ADS_LOGIN_CUSTOMER_ID"),
      getCredential(orgId, "google_ads", "conversion_action_id", "GOOGLE_ADS_CONVERSION_ACTION_ID"),
    ]);

  if (!developerToken || !clientId || !clientSecret || !refreshToken || !customerId || !conversionActionId) {
    return null;
  }
  return { developerToken, clientId, clientSecret, refreshToken, customerId, loginCustomerId, conversionActionId };
}

/** Intercambia el refresh_token por un access_token de corta vida. */
async function fetchAccessToken(creds: GoogleAdsCreds): Promise<string> {
  const body = new URLSearchParams({
    client_id: creds.clientId,
    client_secret: creds.clientSecret,
    refresh_token: creds.refreshToken,
    grant_type: "refresh_token",
  });
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) throw new Error(`OAuth token HTTP ${res.status}`);
  const json = (await res.json()) as { access_token?: string };
  if (!json.access_token) throw new Error("OAuth sin access_token");
  return json.access_token;
}

/** Formato que exige Google: "yyyy-mm-dd hh:mm:ss+00:00" (UTC). */
export function formatGoogleDateTime(date: Date): string {
  const iso = date.toISOString(); // 2024-01-01T12:00:00.000Z
  return iso.slice(0, 19).replace("T", " ") + "+00:00";
}

const digitsOnly = (value: string): string => value.replace(/\D/g, "");

export async function sendGoogleAdsConversion(input: GoogleConversionInput): Promise<ConversionResult> {
  try {
    if (!input.gclid) return { platform: "google_ads", ok: false, skipped: true, detail: "Sin gclid" };
    const orgId = input.organizationId ?? (await resolveDefaultOrg()).id;
    const creds = await loadCreds(orgId);
    if (!creds) return { platform: "google_ads", ok: false, skipped: true, detail: "No configurado" };

    const accessToken = await fetchAccessToken(creds);
    const customerId = digitsOnly(creds.customerId);
    const url = `https://googleads.googleapis.com/${API_VERSION}/customers/${customerId}:uploadClickConversions`;

    const headers: Record<string, string> = {
      Authorization: `Bearer ${accessToken}`,
      "developer-token": creds.developerToken,
      "Content-Type": "application/json",
    };
    if (creds.loginCustomerId) headers["login-customer-id"] = digitsOnly(creds.loginCustomerId);

    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        partialFailure: true,
        conversions: [
          {
            gclid: input.gclid,
            conversionAction: `customers/${customerId}/conversionActions/${digitsOnly(creds.conversionActionId)}`,
            conversionDateTime: formatGoogleDateTime(input.conversionDateTime ?? new Date()),
            conversionValue: Number(input.value.toFixed(2)),
            currencyCode: input.currencyCode,
            ...(input.orderId ? { orderId: input.orderId } : {}),
          },
        ],
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Google Ads HTTP ${res.status}: ${text.slice(0, 200)}`);
    }
    return { platform: "google_ads", ok: true, detail: `Conversión enviada (gclid ${input.gclid.slice(0, 8)}…)` };
  } catch (error) {
    logger.error("ads.google.conversion", error);
    return { platform: "google_ads", ok: false, detail: (error as Error).message };
  }
}
