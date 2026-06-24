import { adminOk, adminServerError, authorizeAdminRequest, readAdminJson } from "../../../../../lib/admin-api.ts";
import { getDb } from "../../../../../lib/db.ts";

export const runtime = "nodejs";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: RouteParams) {
  const auth = await authorizeAdminRequest(request);
  if (auth.response) return auth.response;

  const { id } = await params;

  try {
    const db = getDb();
    const conversation = await db.waConversation.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!conversation) {
      return Response.json({ ok: false, error: "Conversación no encontrada" }, { status: 404 });
    }

    return adminOk({ conversation });
  } catch (error) {
    return adminServerError("obtener detalles de conversación", error);
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const auth = await authorizeAdminRequest(request, { mutation: true });
  if (auth.response) return auth.response;

  const { id } = await params;
  const body = await readAdminJson(request);
  if (!body.ok) return body.response;

  const { status, category } = body.data as { status?: string; category?: string };

  try {
    const db = getDb();
    const data: Record<string, any> = {};
    if (status !== undefined) data.status = status;
    if (category !== undefined) data.category = category;

    const updated = await db.waConversation.update({
      where: { id },
      data,
    });

    return adminOk({ conversation: updated });
  } catch (error) {
    return adminServerError("actualizar conversación", error);
  }
}

export async function POST(request: Request, { params }: RouteParams) {
  const auth = await authorizeAdminRequest(request, { mutation: true });
  if (auth.response) return auth.response;

  const { id } = await params;
  const body = await readAdminJson(request);
  if (!body.ok) return body.response;

  const { message } = body.data as { message?: string };
  if (!message || typeof message !== "string" || !message.trim()) {
    return Response.json({ ok: false, error: "Mensaje vacío o inválido" }, { status: 400 });
  }

  try {
    const db = getDb();
    const conversation = await db.waConversation.findUnique({
      where: { id },
    });

    if (!conversation) {
      return Response.json({ ok: false, error: "Conversación no encontrada" }, { status: 404 });
    }

    // Send the message via WhatsApp Cloud API
    const { sendTextMessage } = await import("../../../../../lib/whatsapp/sender.ts");
    const result = await sendTextMessage(conversation.waId, message.trim());

    // Save outbound message to DB (record failure metadata if any)
    const outboundMessageId = `admin_${id}_${Date.now()}`;
    const outboundMsg = await db.waMessage.create({
      data: {
        conversationId: id,
        waMessageId: outboundMessageId,
        direction: "outbound",
        type: "text",
        body: message.trim(),
        category: conversation.category,
        metadata: result.success ? undefined : { failed: true, error: result.error || "Error al enviar" },
      },
    });

    // Also update the conversation updatedAt timestamp so it bumps up in the list
    await db.waConversation.update({
      where: { id },
      data: { updatedAt: new Date() },
    });

    if (!result.success) {
      return Response.json({ ok: false, error: `Error de envío WhatsApp: ${result.error}` }, { status: 502 });
    }

    return adminOk({ message: outboundMsg });
  } catch (error) {
    return adminServerError("enviar mensaje manual por whatsapp", error);
  }
}
