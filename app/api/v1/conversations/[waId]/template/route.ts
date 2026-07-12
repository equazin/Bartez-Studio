/*
 * POST /api/v1/conversations/{waId}/template — enviar una plantilla aprobada.
 *
 * Sirve para reabrir la conversación FUERA de la ventana de 24h de WhatsApp,
 * donde Meta no permite texto libre. Consumido por Asimov (sendTemplateRemote).
 *
 * Body: {
 *   template: string,        // nombre EXACTO de la plantilla aprobada en Meta
 *   languageCode?: string,   // idioma de la plantilla (default "es_AR")
 *   bodyParams?: string[],   // valores para {{1}}, {{2}}… del cuerpo
 *   preview?: string         // texto renderizado para mostrar en el hilo
 * }
 */

import { NextResponse } from "next/server";
import { getDb } from "../../../../../../lib/db";
import { authorizeV1Request, v1Ok } from "../../../../../../lib/api-v1";
import { sendTemplateMessage } from "../../../../../../lib/whatsapp/sender.ts";

export const runtime = "nodejs";

type RouteParams = { params: Promise<{ waId: string }> };

export async function POST(request: Request, { params }: RouteParams) {
  const auth = await authorizeV1Request(request);
  if (!auth.ok) return auth.response;

  const { waId } = await params;

  let payload: { template?: unknown; languageCode?: unknown; bodyParams?: unknown; preview?: unknown };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  const template = typeof payload.template === "string" ? payload.template.trim() : "";
  if (!template) {
    return NextResponse.json({ ok: false, error: "Falta el nombre de la plantilla" }, { status: 400 });
  }
  const languageCode = typeof payload.languageCode === "string" && payload.languageCode.trim()
    ? payload.languageCode.trim()
    : "es_AR";
  const bodyParams = Array.isArray(payload.bodyParams)
    ? payload.bodyParams.filter((p): p is string => typeof p === "string")
    : [];
  const preview = typeof payload.preview === "string" ? payload.preview.trim() : "";

  const db = getDb();
  const conversation = await db.waConversation.findUnique({ where: { waId } });
  if (!conversation) {
    return NextResponse.json({ ok: false, error: "Conversación no encontrada" }, { status: 404 });
  }

  const result = await sendTemplateMessage(conversation.waId, template, languageCode, bodyParams);

  const outboundMessageId = `asimov_tpl_${conversation.id}_${Date.now()}`;
  const outboundMsg = await db.waMessage.create({
    data: {
      conversationId: conversation.id,
      waMessageId: outboundMessageId,
      direction: "outbound",
      type: "template",
      body: preview || `[plantilla: ${template}]`,
      category: conversation.category,
      metadata: {
        template,
        languageCode,
        bodyParams,
        ...(result.success ? {} : { failed: true, error: result.error || "Error al enviar" }),
      },
    },
  });

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
