/**
 * Google Ads — gestión de campañas (lectura + mutación).
 *
 * Complementa lib/integrations/google-ads.ts (que solo sube conversiones
 * offline) y lib/modules/ads/performance-service.ts (que solo lee spend).
 * Este módulo permite pausar/reanudar campañas y ajustar el budget diario
 * desde el panel /admin/marketing.
 *
 * Doc: https://developers.google.com/google-ads/api/rest/reference/rest
 */
import { getCredential } from "../modules/system/credentials-service.ts";

const API_VERSION = "v18";
const API_BASE = `https://googleads.googleapis.com/${API_VERSION}`;
const TOKEN_URL = "https://oauth2.googleapis.com/token";

export type CampaignStatus = "ENABLED" | "PAUSED" | "REMOVED" | "UNSPECIFIED";

export interface GoogleAdsCampaign {
  id: string;
  resourceName: string;
  name: string;
  status: CampaignStatus;
  dailyBudget: number | null;
  budgetResourceName: string | null;
  spendLast7d: number;
  advertisingChannelType: string | null;
}

interface Creds {
  developerToken: string;
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  customerId: string;
  loginCustomerId?: string;
}

const digitsOnly = (value: string): string => value.replace(/\D/g, "");

async function loadCreds(organizationId: string): Promise<Creds | null> {
  const [developerToken, clientId, clientSecret, refreshToken, customerId, loginCustomerId] = await Promise.all([
    getCredential(organizationId, "google_ads", "developer_token", "GOOGLE_ADS_DEVELOPER_TOKEN"),
    getCredential(organizationId, "google_ads", "client_id", "GOOGLE_ADS_CLIENT_ID"),
    getCredential(organizationId, "google_ads", "client_secret", "GOOGLE_ADS_CLIENT_SECRET"),
    getCredential(organizationId, "google_ads", "refresh_token", "GOOGLE_ADS_REFRESH_TOKEN"),
    getCredential(organizationId, "google_ads", "customer_id", "GOOGLE_ADS_CUSTOMER_ID"),
    getCredential(organizationId, "google_ads", "login_customer_id", "GOOGLE_ADS_LOGIN_CUSTOMER_ID"),
  ]);
  if (!developerToken || !clientId || !clientSecret || !refreshToken || !customerId) return null;
  return {
    developerToken,
    clientId,
    clientSecret,
    refreshToken,
    customerId: digitsOnly(customerId),
    loginCustomerId: loginCustomerId ? digitsOnly(loginCustomerId) : undefined,
  };
}

async function accessToken(creds: Creds): Promise<string> {
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
  if (!res.ok) throw new Error(`Google OAuth HTTP ${res.status}`);
  const json = (await res.json()) as { access_token?: string };
  if (!json.access_token) throw new Error("Google OAuth sin access_token");
  return json.access_token;
}

function buildHeaders(creds: Creds, token: string): Record<string, string> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "developer-token": creds.developerToken,
    "Content-Type": "application/json",
  };
  if (creds.loginCustomerId) headers["login-customer-id"] = creds.loginCustomerId;
  return headers;
}

async function googleFetch<T>(url: string, headers: Record<string, string>, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, headers: { ...headers, ...(init?.headers as Record<string, string> | undefined) } });
  const text = await res.text();
  if (!res.ok) throw new Error(`Google Ads HTTP ${res.status}: ${text.slice(0, 300)}`);
  return (text ? JSON.parse(text) : {}) as T;
}

export interface GoogleAdsUnavailable {
  configured: false;
  campaigns: [];
}

export type GoogleAdsListResult = GoogleAdsUnavailable | { configured: true; campaigns: GoogleAdsCampaign[] };

interface CampaignRow {
  campaign?: {
    id?: string;
    resourceName?: string;
    name?: string;
    status?: CampaignStatus;
    advertisingChannelType?: string;
  };
  campaignBudget?: {
    resourceName?: string;
    amountMicros?: string | number;
  };
  metrics?: { costMicros?: string | number };
}

/**
 * Lista todas las campañas (no eliminadas) con spend de los últimos 7 días.
 * Devuelve `configured: false` si no hay credenciales, para que la UI muestre
 * un CTA de configuración en vez de un error rojo.
 */
export async function listGoogleAdsCampaigns(organizationId: string): Promise<GoogleAdsListResult> {
  const creds = await loadCreds(organizationId);
  if (!creds) return { configured: false, campaigns: [] };
  const token = await accessToken(creds);
  const headers = buildHeaders(creds, token);
  const query = `
    SELECT
      campaign.id,
      campaign.name,
      campaign.status,
      campaign.advertising_channel_type,
      campaign_budget.resource_name,
      campaign_budget.amount_micros,
      metrics.cost_micros
    FROM campaign
    WHERE segments.date DURING LAST_7_DAYS
      AND campaign.status != 'REMOVED'
  `;
  const chunks = await googleFetch<Array<{ results?: CampaignRow[] }>>(
    `${API_BASE}/customers/${creds.customerId}/googleAds:searchStream`,
    headers,
    { method: "POST", body: JSON.stringify({ query }) },
  );

  const byId = new Map<string, GoogleAdsCampaign>();
  for (const chunk of chunks) {
    for (const row of chunk.results ?? []) {
      const id = String(row.campaign?.id ?? "");
      if (!id) continue;
      const previous = byId.get(id);
      const spend = Number(row.metrics?.costMicros ?? 0) / 1_000_000;
      const budgetMicros = row.campaignBudget?.amountMicros != null ? Number(row.campaignBudget.amountMicros) : null;
      byId.set(id, {
        id,
        resourceName: row.campaign?.resourceName ?? `customers/${creds.customerId}/campaigns/${id}`,
        name: row.campaign?.name ?? "(sin nombre)",
        status: (row.campaign?.status ?? "UNSPECIFIED") as CampaignStatus,
        dailyBudget: budgetMicros != null ? budgetMicros / 1_000_000 : previous?.dailyBudget ?? null,
        budgetResourceName: row.campaignBudget?.resourceName ?? previous?.budgetResourceName ?? null,
        spendLast7d: Math.round(((previous?.spendLast7d ?? 0) + spend) * 100) / 100,
        advertisingChannelType: row.campaign?.advertisingChannelType ?? previous?.advertisingChannelType ?? null,
      });
    }
  }

  return {
    configured: true,
    campaigns: [...byId.values()].sort((a, b) => a.name.localeCompare(b.name)),
  };
}

/** Cambia el status de una campaña (ENABLED ↔ PAUSED). */
export async function updateGoogleAdsCampaignStatus(
  organizationId: string,
  campaignId: string,
  status: "ENABLED" | "PAUSED",
): Promise<void> {
  const creds = await loadCreds(organizationId);
  if (!creds) throw new Error("Google Ads no configurado");
  const token = await accessToken(creds);
  await googleFetch<unknown>(
    `${API_BASE}/customers/${creds.customerId}/campaigns:mutate`,
    buildHeaders(creds, token),
    {
      method: "POST",
      body: JSON.stringify({
        operations: [
          {
            update: {
              resourceName: `customers/${creds.customerId}/campaigns/${digitsOnly(campaignId)}`,
              status,
            },
            updateMask: "status",
          },
        ],
      }),
    },
  );
}

/** Ajusta el budget diario (en la moneda de la cuenta) de un campaign_budget. */
export async function updateGoogleAdsCampaignBudget(
  organizationId: string,
  budgetResourceName: string,
  dailyAmount: number,
): Promise<void> {
  if (!Number.isFinite(dailyAmount) || dailyAmount <= 0) {
    throw new Error("El budget debe ser mayor a 0");
  }
  const creds = await loadCreds(organizationId);
  if (!creds) throw new Error("Google Ads no configurado");
  const token = await accessToken(creds);
  const amountMicros = Math.round(dailyAmount * 1_000_000);
  await googleFetch<unknown>(
    `${API_BASE}/customers/${creds.customerId}/campaignBudgets:mutate`,
    buildHeaders(creds, token),
    {
      method: "POST",
      body: JSON.stringify({
        operations: [
          {
            update: {
              resourceName: budgetResourceName,
              amountMicros: String(amountMicros),
            },
            updateMask: "amount_micros",
          },
        ],
      }),
    },
  );
}
