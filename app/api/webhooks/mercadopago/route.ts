import { NextResponse } from "next/server.js";
import { getDb } from "../../../../lib/db.ts";
import { fetchPayment } from "../../../../lib/integrations/mercadopago/client.ts";
import { processMpPayment } from "../../../../lib/modules/billing/payment-link-service.ts";
import { resolveDefaultOrg } from "../../../../lib/tenant.ts";
import { logger } from "../../../../lib/logger.ts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Webhook público de MercadoPago.
 *
 * Esperamos notificaciones con `topic=payment` (o `type=payment`).
 * Para validar la integridad consultamos el payment vía API; eso ya
 * garantiza que el pago existe en MP — el body del webhook se trata
 * como pista, no como fuente de verdad.
 */

export async function GET(request: Request) {
  // MP a veces hace verificación con GET (?topic=...). Respondemos 200 vacío.
  return NextResponse.json({ ok: true });
}

export async function POST(request: Request) {
  let body: Record<string, unknown> = {};
  try { body = (await request.json()) as Record<string, unknown>; } catch { body = {}; }

  const url = new URL(request.url);
  const topicQs = url.searchParams.get("topic") || url.searchParams.get("type");
  const idQs = url.searchParams.get("id") || url.searchParams.get("data.id");

  const type = String((body.type ?? body.topic ?? topicQs ?? "")).toLowerCase();
  const paymentId = (body.data && typeof body.data === "object" && "id" in body.data)
    ? String((body.data as { id: unknown }).id)
    : idQs;

  if (type !== "payment" || !paymentId) {
    logger.info("mp.webhook.skip", { type, paymentId });
    return NextResponse.json({ ok: true });
  }

  try {
    const payment = await fetchPayment(paymentId);
    if (!payment) return NextResponse.json({ ok: true });

    const org = await resolveDefaultOrg();
    await processMpPayment({ organizationId: org.id, payment });
    return NextResponse.json({ ok: true });
  } catch (error) {
    logger.error("mp.webhook.error", error);
    // Responder 200 igual: MP reintenta ante !200, y un error en nuestro lado
    // ya queda registrado.
    return NextResponse.json({ ok: false });
  }
}

/** Mantengo la referencia para que no se borre con `removeUnused` */
void getDb;
