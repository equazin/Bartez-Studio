import { after, NextResponse } from "next/server.js";
import { validateSignature } from "../../../../lib/whatsapp/signature.ts";
import { parseWebhookPayload } from "../../../../lib/whatsapp/parser.ts";
import { handleIncomingMessage } from "../../../../lib/whatsapp/router.ts";
import { WEBHOOK_VERIFY_TOKEN } from "../../../../lib/whatsapp/config.ts";

export const runtime = "nodejs";

// ── GET: Webhook verification ────────────────────────────────
// Meta sends a GET request with hub.mode, hub.verify_token and hub.challenge
// to verify the webhook endpoint during setup.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === WEBHOOK_VERIFY_TOKEN) {
    console.info("[wa:webhook] Verificación exitosa");
    // Meta expects the challenge string as plain text response.
    return new Response(challenge ?? "", { status: 200 });
  }

  console.warn("[wa:webhook] Verificación fallida — token inválido");
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

// ── POST: Receive incoming messages ──────────────────────────
// Meta sends webhook events as POST requests with a JSON payload.
// We MUST return 200 within 5 seconds or Meta will retry the delivery.
export async function POST(request: Request) {
  // 1. Read raw body for signature validation.
  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  // 2. Validate X-Hub-Signature-256 header.
  const signature = request.headers.get("x-hub-signature-256") ?? "";
  const isValid = await validateSignature(rawBody, signature);
  if (!isValid) {
    console.warn("[wa:webhook] Firma inválida");
    return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
  }

  // 3. Parse the JSON body.
  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // 4. Extract message using parser.
  const parsed = parseWebhookPayload(payload);

  // 5. If it's a valid message (not null, not a status update), process it
  //    after the response so Meta receives a quick 200 and does not retry.
  if (parsed) {
    after(async () => {
      try {
        await handleIncomingMessage(parsed);
        console.info("[wa:webhook] Mensaje procesado con éxito");
      } catch (err) {
        console.error("[wa:webhook] Error procesando mensaje", err);
      }
    });
  }

  // 6. ALWAYS return 200 OK quickly.
  return NextResponse.json({ status: "ok" }, { status: 200 });
}
