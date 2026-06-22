import type { ParsedMessage } from "./parser.ts";
import type { AIResponse } from "./ai-agent.ts";
import { processWithAI } from "./ai-agent.ts";
import { sendTextMessage } from "./sender.ts";
import { markAsRead } from "./sender.ts";
import { getDb } from "../db.ts";
import { processLead } from "../integrations/index.ts";
import type { Lead } from "../schema.ts";

/**
 * handleIncomingMessage — punto de entrada del router de WhatsApp.
 *
 * Flujo:
 *  1. Busca o crea la conversación en DB (WaConversation).
 *  2. Persiste el mensaje entrante (WaMessage, direction: "inbound").
 *  3. Carga las últimas 10 mensajes de la conversación como contexto.
 *  4. Envía a la IA para procesamiento (processWithAI).
 *  5. Persiste la respuesta del bot (WaMessage, direction: "outbound").
 *  6. Envía la respuesta al usuario vía WhatsApp Cloud API.
 *  7. Si la IA indica escalación o hay datos suficientes para un lead,
 *     crea el lead en Monday.com / envía notificación por mail.
 *  8. Actualiza categoría y estado de la conversación.
 */
export async function handleIncomingMessage(message: ParsedMessage): Promise<void> {
  const db = getDb();

  // Mark the message as read (blue ticks) — fire and forget.
  markAsRead(message.messageId).catch(() => {});

  // ── 1. Get or create conversation ──────────────────────────
  let conversation = await db.waConversation.findUnique({
    where: { waId: message.senderPhone },
  });

  if (!conversation) {
    conversation = await db.waConversation.create({
      data: {
        waId: message.senderPhone,
        profileName: message.senderName ?? null,
        status: "active",
      },
    });
    console.info("[wa:router] Conversación nueva creada", conversation.id);
  }

  // ── 2. Save inbound message ────────────────────────────────
  await db.waMessage.create({
    data: {
      conversationId: conversation.id,
      waMessageId: message.messageId,
      direction: "inbound",
      type: message.messageType,
      body: message.body || null,
      metadata: message.replyId ? { replyId: message.replyId } : undefined,
    },
  });

  // Skip AI processing for unsupported message types
  if (message.messageType === "unsupported" || !message.body) {
    await sendTextMessage(
      message.senderPhone,
      "Por el momento solo puedo leer mensajes de texto. ¿Podés escribirme tu consulta? ✍️",
    );
    return;
  }

  // ── 3. Load last 10 messages for context ───────────────────
  const recentMessages = await db.waMessage.findMany({
    where: { conversationId: conversation.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  // Reverse to chronological order, and exclude the message we just saved
  // (it's the current user message that we'll pass separately).
  const history = recentMessages
    .reverse()
    .slice(0, -1) // Remove the latest (current) message
    .map((msg) => ({
      role: msg.direction === "inbound" ? ("user" as const) : ("assistant" as const),
      content: msg.body ?? "",
    }));

  // ── 4. Process with AI ─────────────────────────────────────
  const aiResult = await processWithAI(message.body, history);

  // ── 5. Save outbound message ───────────────────────────────
  const outboundMessageId = `bot_${conversation.id}_${Date.now()}`;

  await db.waMessage.create({
    data: {
      conversationId: conversation.id,
      waMessageId: outboundMessageId,
      direction: "outbound",
      type: "text",
      body: aiResult.reply,
      category: aiResult.category ?? null,
    },
  });

  // ── 6. Send response via WhatsApp ──────────────────────────
  try {
    await sendTextMessage(message.senderPhone, aiResult.reply);
  } catch (err) {
    console.error("[wa:router] Error enviando mensaje a WhatsApp", err);
    // Don't throw — the message is already persisted in DB.
  }

  // ── 7. Handle escalation / lead creation ───────────────────
  const shouldCreateLead =
    aiResult.shouldEscalate ||
    (["cotizacion", "revendedor"].includes(aiResult.category) &&
      hasEnoughLeadData(aiResult));

  if (shouldCreateLead && !conversation.leadCreated) {
    try {
      const lead = buildLeadFromAI(aiResult, message, conversation);
      await processLead(lead);

      // Mark conversation so we don't create duplicate leads.
      await db.waConversation.update({
        where: { id: conversation.id },
        data: { leadCreated: true },
      });

      console.info("[wa:router] Lead creado para conversación", conversation.id);
    } catch (err) {
      console.error("[wa:router] Error creando lead", err);
      // Non-fatal: the conversation continues.
    }
  }

  // ── 8. Update conversation category and status ─────────────
  const updates: Record<string, unknown> = {};
  if (aiResult.category && aiResult.category !== conversation.category) {
    updates.category = aiResult.category;
  }
  if (aiResult.shouldEscalate && conversation.status !== "escalated") {
    updates.status = "escalated";
  }

  if (Object.keys(updates).length > 0) {
    await db.waConversation.update({
      where: { id: conversation.id },
      data: updates,
    });
  }
}

// ── Helpers ────────────────────────────────────────────────────

/**
 * Verifica si los datos de lead extraídos por la IA son suficientes
 * para crear un lead en Monday.com (mínimo: empresa + necesidad).
 */
function hasEnoughLeadData(aiResult: AIResponse): boolean {
  if (!aiResult.leadData) return false;
  return Boolean(aiResult.leadData.empresa && aiResult.leadData.necesidad);
}

/**
 * Construye un objeto Lead compatible con el schema de Bartez
 * a partir de los datos extraídos por la IA durante la conversación.
 */
function buildLeadFromAI(
  aiResult: AIResponse,
  message: ParsedMessage,
  conversation: { id: string; waId: string; profileName?: string | null },
): Lead {
  const data = aiResult.leadData ?? {};

  return {
    empresa: data.empresa || "Sin especificar",
    nombre: conversation.profileName || "WhatsApp",
    email: `${message.senderPhone}@whatsapp.placeholder`,
    telefono: message.senderPhone,
    tipoConsulta: mapCategoryToTipoConsulta(aiResult.category),
    mensaje: `[WhatsApp] Conversación #${conversation.id}\nNecesidad: ${data.necesidad || aiResult.reply}`,
    agendarReunion: false,
    origen: "whatsapp",
  };
}

/**
 * Mapea la categoría de la IA al tipo de consulta del schema de leads.
 */
function mapCategoryToTipoConsulta(
  category?: string,
): "cotizacion" | "asesoramiento" | "cuenta" {
  switch (category) {
    case "cotizacion":
      return "cotizacion";
    case "revendedor":
    case "cuenta":
      return "cuenta";
    default:
      return "asesoramiento";
  }
}
