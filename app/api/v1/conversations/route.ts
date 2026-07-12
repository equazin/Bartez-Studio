/*
 * GET /api/v1/conversations — lista de conversaciones de WhatsApp del CRM.
 *
 * Contrato consumido por el desktop Asimov (src/whatsapp.ts). Devuelve la
 * lista con el último mensaje incluido por conversación para poder pintar el
 * preview sin un round-trip por cada chat.
 *
 * Auth: Bearer sobre `Authorization`, misma capa que /api/v1/accounts.
 * El token se configura en /admin/sistema → Integraciones → "API v1"
 * (o via env var API_V1_TOKEN como fallback).
 */

import { getDb } from "../../../../lib/db";
import { authorizeV1Request, v1Ok } from "../../../../lib/api-v1";

export const runtime = "nodejs";

/** Campos expuestos de cada mensaje — evita filtrar columnas internas. */
const messageSelect = {
  id: true,
  conversationId: true,
  waMessageId: true,
  direction: true,
  type: true,
  body: true,
  category: true,
  metadata: true,
  createdAt: true,
} as const;

export async function GET(request: Request) {
  const auth = await authorizeV1Request(request);
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(200, Math.max(1, parseInt(searchParams.get("limit") || "50", 10)));
  const skip = (page - 1) * limit;

  const db = getDb();
  const [conversations, total] = await Promise.all([
    db.waConversation.findMany({
      orderBy: { updatedAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        waId: true,
        profileName: true,
        category: true,
        status: true,
        updatedAt: true,
        // Último mensaje para el preview de la lista.
        messages: { orderBy: { createdAt: "desc" }, take: 1, select: messageSelect },
      },
    }),
    db.waConversation.count(),
  ]);

  return v1Ok(conversations, { total, page, limit, pages: Math.ceil(total / limit) });
}
