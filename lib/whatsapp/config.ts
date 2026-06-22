// ---------------------------------------------------------------------------
// WhatsApp Cloud API — Configuration & Constants
// ---------------------------------------------------------------------------

export const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID ?? "";
export const WHATSAPP_API_TOKEN = process.env.WHATSAPP_API_TOKEN ?? "";
export const WEBHOOK_VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN ?? "";
export const WHATSAPP_APP_SECRET = process.env.WHATSAPP_APP_SECRET ?? "";

/** Meta Graph API base URL (v22.0) */
export const GRAPH_API_BASE = "https://graph.facebook.com/v22.0";

/**
 * Returns `true` when all required WhatsApp env vars are present.
 * Useful as a guard before enabling webhook routes.
 */
export function isConfigured(): boolean {
  return Boolean(
    WHATSAPP_PHONE_NUMBER_ID &&
    WHATSAPP_API_TOKEN &&
    WEBHOOK_VERIFY_TOKEN &&
    WHATSAPP_APP_SECRET,
  );
}
