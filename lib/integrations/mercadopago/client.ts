/**
 * Cliente liviano de MercadoPago (Preferences + Payments).
 * No usa el SDK oficial; sólo fetch + access token desde env.
 *
 * Env vars:
 *  - MP_ACCESS_TOKEN: APP_USR-... (cuenta del vendedor)
 *  - MP_NOTIFICATION_URL: URL pública del webhook (override)
 *  - NEXT_PUBLIC_SITE_URL: base para construir back_urls
 *
 * Sin MP_ACCESS_TOKEN el módulo entra en modo simulado y devuelve un link
 * dummy. Esto permite probar la UI/UX sin credenciales reales.
 */

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

export function isMpConfigured(): boolean {
  return Boolean(process.env.MP_ACCESS_TOKEN);
}

export async function createPreference(input: MpPreferenceInput): Promise<MpPreferenceResult> {
  if (!isMpConfigured()) {
    const fakeId = `SIM-${Date.now().toString(36)}`;
    return {
      id: fakeId,
      init_point: `${siteUrl()}/pago-simulado/${fakeId}`,
      sandbox_init_point: `${siteUrl()}/pago-simulado/${fakeId}`,
      simulated: true,
    };
  }

  const base = input.back_url_base ?? siteUrl();
  const body = {
    items: [{
      title: input.title.slice(0, 250),
      description: input.description?.slice(0, 600),
      quantity: input.quantity,
      currency_id: input.currency_id ?? "ARS",
      unit_price: Number(input.unit_price.toFixed(2)),
    }],
    external_reference: input.external_reference,
    notification_url: input.notification_url ?? process.env.MP_NOTIFICATION_URL ?? `${base}/api/webhooks/mercadopago`,
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
      Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
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
  if (!isMpConfigured()) return null;
  const res = await fetch(`${MP_API}/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` },
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
