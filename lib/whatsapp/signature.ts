// ---------------------------------------------------------------------------
// WhatsApp Webhook — Signature Validation (HMAC-SHA256)
// ---------------------------------------------------------------------------

import { createHmac, timingSafeEqual } from "node:crypto";
import { WHATSAPP_APP_SECRET } from "./config.ts";

/**
 * Validates the `X-Hub-Signature-256` header sent by Meta on every webhook
 * request.  Returns `true` when the HMAC matches.
 *
 * @param body      - Raw request body string (must match the exact bytes Meta signed).
 * @param signature - Value of the `X-Hub-Signature-256` header (`sha256=<hex>`).
 */
export async function validateSignature(
  body: string,
  signature: string,
): Promise<boolean> {
  if (!WHATSAPP_APP_SECRET || !signature) return false;

  const expectedHex = createHmac("sha256", WHATSAPP_APP_SECRET)
    .update(body)
    .digest("hex");

  // The header arrives as "sha256=<hex>"; strip the prefix.
  const receivedHex = signature.startsWith("sha256=")
    ? signature.slice(7)
    : signature;

  // Both hex strings must be the same length for timingSafeEqual.
  if (expectedHex.length !== receivedHex.length) return false;

  return timingSafeEqual(
    Buffer.from(expectedHex, "utf-8"),
    Buffer.from(receivedHex, "utf-8"),
  );
}
