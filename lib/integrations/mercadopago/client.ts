/**
 * Cliente liviano de MercadoPago (Preferences + Payments).
 * No usa el SDK oficial; sólo fetch + access token.
 *
 * El access token se lee primero de `OrgCredential` (configurable desde
 * /admin/sistema) y cae a `MP_ACCESS_TOKEN` env var si no hay valor en BD.
 * Sin token configurado el módulo entra en modo simulado y devuelve un link
 * dummy, permitiendo probar la UI/UX sin credenciales reales.
 */
import { getCredential } from "../../modules/system/credentials-service.ts";
import { resolveDefaultOrg } from "../../tenant.ts";

async function mpToken(): Promise<string> {
  const org = await resolveDefaultOrg();
  return getCredential(org.id, "mercadopago", "access_token", "MP_ACCESS_TOKEN");
}

async function mpNotificationUrl(): Promise<string> {
  const org = await resolveDefaultOrg();
  const stored = await getCredential(org.id, "mercadopago", "notification_url", "MP_NOTIFICATION_URL");
  return stored;
}

const MP_API = "https://api.mercadopago.com";

export interface MpPreferenceInput {
  title: string;
  description?: string;
  quantity: number;
  unit_price: number;
  currency_id?: "ARS" | "USD";
  external_reference: string;
  notification_url?: string;
  back_url_base?: string; // override para back_urls
}

export interface MpPreferenceResult {
  id: string;
  init_point: string;
  sandbox_init_point: string;
  simulated: boolean;
}

function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";
}

/** Legacy sync check — válido sólo para el fallback env (deprecated en favor del check async). */
export function isMpConfigured(): boolean {
  return Boolean(process.env.MP_ACCESS_TOKEN);
}

export async function isMpConfiguredAsync(): Promise<boolean> {
  return Boolean(await mpToken());
}

export async function createPreference(input: MpPreferenceInput): Promise<MpPreferenceResult> {
  const token = await mpToken();
  if (!token) {
    const fakeId = `SIM-${Date.now().toString(36)}`;
    return {
      id: fakeId,
      init_point: `${siteUrl()}/pago-simulado/${fakeId}`,
      sandbox_init_point: `${siteUrl()}/pago-simulado/${fakeId}`,
      simulated: true,
    };
  }

  const base = input.back_url_base ?? siteUrl();
  const notifUrl = await mpNotificationUrl();
  const body = {
    items: [{
      title: input.title.slice(0, 250),
      description: input.description?.slice(0, 600),
      quantity: input.quantity,
      currency_id: input.currency_id ?? "ARS",
      unit_price: Number(input.unit_price.toFixed(2)),
    }],
    external_reference: input.external_reference,
    notification_url: input.notification_url ?? notifUrl ?? `${base}/api/webhooks/mercadopago`,
    back_urls: {
      success: `${base}/pago/exito`,
      failure: `${base}/pago/error`,
      pending: `${base}/pago/pendiente`,
    },
    auto_return: "approved",
  };

  const res = await fetch(`${MP_API}/checkout/preferences`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  const json = await res.json() as Record<string, unknown>;
  if (!res.ok) {
    throw new Error(`MP preference HTTP ${res.status}: ${JSON.stringify(json).slice(0, 500)}`);
  }
  return {
    id: String(json.id),
    init_point: String(json.init_point ?? ""),
    sandbox_init_point: String(json.sandbox_init_point ?? ""),
    simulated: false,
  };
}

export interface MpPayment {
  id: number;
  status: string; // approved | rejected | pending | in_process | cancelled | refunded
  status_detail: string;
  transaction_amount: number;
  currency_id: string;
  date_approved: string | null;
  external_reference: string | null;
  preference_id?: string | null;
}

export async function fetchPayment(paymentId: number | string): Promise<MpPayment | null> {
  const token = await mpToken();
  if (!token) return null;
  const res = await fetch(`${MP_API}/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`MP payment HTTP ${res.status}`);
  }
  const json = await res.json() as Record<string, unknown>;
  return {
    id: Number(json.id),
    status: String(json.status ?? ""),
    status_detail: String(json.status_detail ?? ""),
    transaction_amount: Number(json.transaction_amount ?? 0),
    currency_id: String(json.currency_id ?? "ARS"),
    date_approved: (json.date_approved as string | null) ?? null,
    external_reference: (json.external_reference as string | null) ?? null,
    preference_id: (json.preference_id as string | null | undefined) ?? null,
  };
}
