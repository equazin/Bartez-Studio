/*
 * GET /api/v1/conversations/{waId} — detalle de una conversación con TODOS
 * sus mensajes (orden cronológico). Consumido por Asimov (getConversationRemote).
 *
 * `waId` es el número WhatsApp E.164 sin '+' (ej. "5493414123456"), que en el
 * schema Prisma es único por conversación.
 */

import { NextResponse } from "next/server";
import { getDb } from "../../../../../lib/db";
import { authorizeV1Request, v1Ok } from "../../../../../lib/api-v1";

export const runtime = "nodejs";

type RouteParams = { params: Promise<{ waId: string }> };

export async function GET(request: Request, { params }: RouteParams) {
  const auth = await authorizeV1Request(request);
  if (!auth.ok) return auth.response;

  const { waId } = await params;

  const db = getDb();
  const conversation = await db.waConversation.findUnique({
    where: { waId },
    select: {
      id: true,
      waId: true,
      profileName: true,
      category: true,
      status: true,
      updatedAt: true,
      messages: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          conversationId: true,
          waMessageId: true,
          direction: true,
          type: true,
          body: true,
          category: true,
          metadata: true,
          createdAt: true,
        },
      },
    },
  });

  if (!conversation) {
    return NextResponse.json({ ok: false, error: "Conversación no encontrada" }, { status: 404 });
  }

  return v1Ok(conversation);
}
