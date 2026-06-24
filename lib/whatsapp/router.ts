import type { ParsedMessage } from "./parser.ts";
import type { AIResponse } from "./ai-agent.ts";
import { processWithAI } from "./ai-agent.ts";
import { sendTextMessage, markAsRead } from "./sender.ts";
import {
  WHATSAPP_AUDIO_TRANSCRIPTION_ENABLED,
  WHATSAPP_REQUIRE_LEAD_CONFIRMATION,
} from "./config.ts";
import { getDb } from "../db.ts";
import { processLead } from "../integrations/index.ts";
import type { Lead } from "../schema.ts";

const PENDING_LEAD_STATUS = "pending_lead_confirmation";

/**
 * handleIncomingMessage — punto de entrada del router de WhatsApp.
 *
 * Flujo:
 *  1. Busca o crea la conversación en DB (WaConversation).
 *  2. Persiste el mensaje entrante (WaMessage, direction: "inbound").
 *  3. Si el mensaje ya fue procesado, corta para evitar duplicados.
 *  4. Si hay confirmación pendiente de lead, procesa SI/NO sin llamar IA.
 *  5. Carga contexto, llama IA, guarda y envía respuesta.
 *  6. Si corresponde derivar, pide consentimiento antes de crear lead.
 */
export async function handleIncomingMessage(message: ParsedMessage): Promise<void> {
  const db = getDb();

  // Mark the message as read (blue ticks) — fire and forget.
  markAsRead(message.messageId).catch(() => {});

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

  const inboundMsg = await createInboundMessage(db, conversation.id, message);
  if (!inboundMsg) return;

  const initialUserText = message.body || "";

  if (conversation.status === PENDING_LEAD_STATUS) {
    await handlePendingLeadConfirmation(db, conversation, message.senderPhone, initialUserText);
    return;
  }

  // If the conversation is already escalated, store the message but do not auto-reply.
  if (conversation.status === "escalated") {
    console.info(`[wa:router] Conversación #${conversation.id} está escalada. Guardando mensaje entrante sin auto-respuesta del bot.`);
    return;
  }

  let userText = initialUserText;

  // Handle voice notes / audio messages only when explicitly enabled.
  if (message.messageType === "audio" && message.mediaId) {
    if (!WHATSAPP_AUDIO_TRANSCRIPTION_ENABLED) {
      await createAndSendOutbound(
        db,
        conversation.id,
        message.senderPhone,
        "Por ahora prefiero que me escribas la consulta por texto, así puedo derivarla correctamente al equipo comercial. ✍️",
      );
      return;
    }

    try {
      const { downloadMedia, transcribeAudio } = await import("./media.ts");
      console.info(`[wa:router] Descargando y transcribiendo audio con ID ${message.mediaId}...`);

      const audioBuffer = await downloadMedia(message.mediaId);
      const transcription = await transcribeAudio(audioBuffer);

      console.info(`[wa:router] Audio transcrito: "${transcription}"`);
      userText = transcription;

      await db.waMessage.update({
        where: { id: inboundMsg.id },
        data: { body: `[Audio transcrito] ${transcription}` },
      });
    } catch (err) {
      console.error("[wa:router] Falló la transcripción del audio", err);
      await createAndSendOutbound(
        db,
        conversation.id,
        message.senderPhone,
        "Disculpá, no pude procesar tu mensaje de voz. ¿Podrías escribirme tu consulta? ✍️",
      );
      return;
    }
  }

  // Skip AI processing for unsupported message types.
  if (message.messageType !== "audio" && (message.messageType === "unsupported" || !userText)) {
    await createAndSendOutbound(
      db,
      conversation.id,
      message.senderPhone,
      "Por el momento solo puedo leer mensajes de texto. ¿Podés escribirme tu consulta? ✍️",
    );
    return;
  }

  const recentMessages = await db.waMessage.findMany({
    where: { conversationId: conversation.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const history = recentMessages
    .reverse()
    .slice(0, -1)
    .map((msg) => ({
      role: msg.direction === "inbound" ? ("user" as const) : ("assistant" as const),
      content: msg.body ?? "",
    }));

  const aiResult = await processWithAI(userText, history);

  const shouldCreateLead =
    aiResult.shouldEscalate ||
    (["cotizacion", "revendedor"].includes(aiResult.category) && hasEnoughLeadData(aiResult));

  let finalReply = aiResult.reply;
  let outboundMetadata: Record<string, unknown> | undefined;
  let pendingLead: Lead | null = null;

  if (shouldCreateLead && !conversation.leadCreated && WHATSAPP_REQUIRE_LEAD_CONFIRMATION) {
    pendingLead = buildLeadFromAI(aiResult, message, conversation);
    outboundMetadata = { pendingLead };
    finalReply = appendLeadConsentPrompt(aiResult.reply);
  }

  await createAndSendOutbound(
    db,
    conversation.id,
    message.senderPhone,
    finalReply,
    aiResult.category,
    outboundMetadata,
  );

  if (shouldCreateLead && !conversation.leadCreated && !WHATSAPP_REQUIRE_LEAD_CONFIRMATION) {
    try {
      const lead = buildLeadFromAI(aiResult, message, conversation);
      await processLead(lead);
      await db.waConversation.update({
        where: { id: conversation.id },
        data: { leadCreated: true },
      });
      console.info("[wa:router] Lead creado para conversación", conversation.id);
    } catch (err) {
      console.error("[wa:router] Error creando lead", err);
    }
  }

  const updates: Record<string, unknown> = {};
  if (aiResult.category && aiResult.category !== conversation.category) {
    updates.category = aiResult.category;
  }
  if (pendingLead) {
    updates.status = PENDING_LEAD_STATUS;
  } else if (aiResult.shouldEscalate && conversation.status !== "escalated") {
    updates.status = "escalated";
  }

  if (Object.keys(updates).length > 0) {
    await db.waConversation.update({
      where: { id: conversation.id },
      data: updates,
    });
  }
}

async function createInboundMessage(db: any, conversationId: string, message: ParsedMessage) {
  try {
    return await db.waMessage.create({
      data: {
        conversationId,
        waMessageId: message.messageId,
        direction: "inbound",
        type: message.messageType,
        body: message.body || null,
        metadata: message.replyId ? { replyId: message.replyId } : undefined,
      },
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      console.info("[wa:router] Mensaje duplicado ignorado", message.messageId);
      return null;
    }
    throw error;
  }
}

async function createAndSendOutbound(
  db: any,
  conversationId: string,
  to: string,
  body: string,
  category?: string,
  metadata?: Record<string, unknown>,
) {
  const outboundMsg = await db.waMessage.create({
    data: {
      conversationId,
      waMessageId: `bot_${conversationId}_${Date.now()}`,
      direction: "outbound",
      type: "text",
      body,
      category: category ?? null,
      metadata,
    },
  });

  try {
    const result = await sendTextMessage(to, body);
    if (!result.success) {
      console.error("[wa:router] Error enviando mensaje a WhatsApp", result.error);
      await db.waMessage.update({
        where: { id: outboundMsg.id },
        data: { metadata: { ...(metadata ?? {}), failed: true, error: result.error || "Error al enviar" } },
      });
    }
  } catch (err) {
    console.error("[wa:router] Error inesperado enviando mensaje a WhatsApp", err);
    await db.waMessage.update({
      where: { id: outboundMsg.id },
      data: { metadata: { ...(metadata ?? {}), failed: true, error: err instanceof Error ? err.message : String(err) } },
    });
  }

  return outboundMsg;
}

async function handlePendingLeadConfirmation(
  db: any,
  conversation: { id: string; waId: string; profileName?: string | null; category?: string | null },
  to: string,
  text: string,
) {
  const consent = parseLeadConsent(text);

  if (consent === "yes") {
    const lead = await getPendingLead(db, conversation.id);
    if (!lead) {
      await db.waConversation.update({ where: { id: conversation.id }, data: { status: "escalated" } });
      await createAndSendOutbound(
        db,
        conversation.id,
        to,
        "No encontré el resumen anterior, pero ya dejé la conversación derivada para que la revise un especialista.",
        conversation.category ?? undefined,
      );
      return;
    }

    try {
      await processLead(lead);
      await db.waConversation.update({
        where: { id: conversation.id },
        data: { leadCreated: true, status: "escalated" },
      });
      await createAndSendOutbound(
        db,
        conversation.id,
        to,
        "Listo, derivé tu consulta al equipo comercial de Bartez. Un especialista va a continuar la atención por este mismo canal.",
        conversation.category ?? undefined,
      );
    } catch (err) {
      console.error("[wa:router] Error creando lead confirmado", err);
      await createAndSendOutbound(
        db,
        conversation.id,
        to,
        "Tuve un problema al derivar la consulta. Ya dejé registrada la conversación para revisión humana.",
        conversation.category ?? undefined,
        { failedLeadCreation: true },
      );
    }
    return;
  }

  if (consent === "no") {
    await db.waConversation.update({ where: { id: conversation.id }, data: { status: "active" } });
    await createAndSendOutbound(
      db,
      conversation.id,
      to,
      "Perfecto, no envío tus datos al equipo comercial. Si querés avanzar más adelante, escribime qué necesitás y lo retomamos.",
      conversation.category ?? undefined,
    );
    return;
  }

  await createAndSendOutbound(
    db,
    conversation.id,
    to,
    'Para derivar esta consulta al equipo comercial necesito tu confirmación. Respondé "SI" para derivar o "NO" para cancelar.',
    conversation.category ?? undefined,
  );
}

async function getPendingLead(db: any, conversationId: string): Promise<Lead | null> {
  const messages = await db.waMessage.findMany({
    where: { conversationId },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  for (const message of messages) {
    const metadata = message.metadata as { pendingLead?: Lead } | null;
    if (metadata?.pendingLead) return metadata.pendingLead;
  }

  return null;
}

function parseLeadConsent(text: string): "yes" | "no" | null {
  const normalized = text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

  if (/^(si|confirmo|dale|ok|okey|de acuerdo|autorizo)\b/.test(normalized)) return "yes";
  if (/^(no|cancelar|cancela|no gracias|prefiero no)\b/.test(normalized)) return "no";
  return null;
}

function appendLeadConsentPrompt(reply: string): string {
  const cleanReply = reply.trim();
  return `${cleanReply}\n\nPara derivarlo al equipo comercial con tus datos de WhatsApp, confirmame con "SI". Si preferís no hacerlo, respondé "NO".`;
}

function isUniqueConstraintError(error: unknown): boolean {
  return Boolean(
    error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code?: unknown }).code === "P2002",
  );
}

function hasEnoughLeadData(aiResult: AIResponse): boolean {
  if (!aiResult.leadData) return false;
  return Boolean(aiResult.leadData.empresa && aiResult.leadData.necesidad);
}

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
    necesidad: data.necesidad,
    urgencia: data.urgencia,
    canalPreferido: "whatsapp",
    resumenIA: aiResult.reply,
  };
}

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
