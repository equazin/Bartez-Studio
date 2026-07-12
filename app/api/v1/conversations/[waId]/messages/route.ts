/*
 * POST /api/v1/conversations/{waId}/messages — enviar mensaje saliente.
 *
 * Body: { message: string }
 * Reusa `sendTextMessage` de lib/whatsapp/sender.ts (la misma función que usa
 * el panel /admin/conversations) para que el mensaje salga por WhatsApp Cloud
 * API y quede persistido en `WaMessage` con `direction: "outbound"`.
 * Consumido por Asimov (sendMessageRemote).
 */

import { NextResponse } from "next/server";
import { getDb } from "../../../../../../lib/db";
import { authorizeV1Request, v1Ok } from "../../../../../../lib/api-v1";
import { sendTextMessage } from "../../../../../../lib/whatsapp/sender.ts";

export const runtime = "nodejs";

type RouteParams = { params: Promise<{ waId: string }> };

export async function POST(request: Request, { params }: RouteParams) {
  const auth = await authorizeV1Request(request);
  if (!auth.ok) return auth.response;

  const { waId } = await params;

  let payload: { message?: unknown };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  const message = typeof payload.message === "string" ? payload.message.trim() : "";
  if (!message) {
    return NextResponse.json({ ok: false, error: "Mensaje vacío o inválido" }, { status: 400 });
  }

  const db = getDb();
  const conversation = await db.waConversation.findUnique({ where: { waId } });
  if (!conversation) {
    return NextResponse.json({ ok: false, error: "Conversación no encontrada" }, { status: 404 });
  }

  const result = await sendTextMessage(conversation.waId, message);

  // Persistimos el saliente con un id sintético (Meta no devuelve el wamid en
  // el SendResult); el mismo patrón que usa el router del bot ("bot_...").
  const outboundMessageId = `asimov_${conversation.id}_${Date.now()}`;
  const outboundMsg = await db.waMessage.create({
    data: {
      conversationId: conversation.id,
      waMessageId: outboundMessageId,
      direction: "outbound",
      type: "text",
      body: message,
      category: conversation.category,
      metadata: result.success ? undefined : { failed: true, error: result.error || "Error al enviar" },
    },
  });

  // Empuja la conversación al tope de la lista (ordenada por updatedAt).
  await db.waConversation.update({
    where: { id: conversation.id },
    data: { updatedAt: new Date() },
  });

  if (!result.success) {
    return NextResponse.json(
      { ok: false, error: `Error de envío WhatsApp: ${result.error}` },
      { status: 502 },
    );
  }

  return v1Ok(outboundMsg);
}
