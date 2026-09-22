// ---------------------------------------------------------------------------
// WhatsApp AI Agent — Non-streaming AI engine for WhatsApp conversations
// ---------------------------------------------------------------------------

import { generateText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { BARTEZ_KNOWLEDGE } from "../ai/knowledge.ts";
import { logger } from "../logger.ts";
import { isMailConfigured, sendEmail } from "../integrations/mail.ts";

// Modelo Anthropic por defecto. Puede sobrescribirse con WHATSAPP_AI_MODEL para
// subir a Sonnet 5 sin redeploy. Nombre de modelo idéntico al de la Console de
// Anthropic. Requiere ANTHROPIC_API_KEY en el entorno.
const WHATSAPP_MODEL_ID = process.env.WHATSAPP_AI_MODEL || "claude-haiku-4-5-20251001";

// ---- Types -----------------------------------------------------------------

export type WaCategory =
  | "cotizacion"
  | "asesoramiento"
  | "soporte"
  | "info_general"
  | "revendedor"
  | "seguimiento"
  | "spam";

export type AIResponse = {
  reply: string;
  category: WaCategory;
  shouldEscalate: boolean;
  /**
   * true cuando la llamada al modelo falló y esto es el fallback técnico.
   * No es una clasificación de la IA: `category` y `leadData` no significan
   * nada en ese caso, así que el router no debe armar un lead con ellos.
   */
  failed?: boolean;
  leadData?: {
    empresa?: string;
    necesidad?: string;
    urgencia?: string;
  };
};

// ---- System Prompt ---------------------------------------------------------

const WHATSAPP_SYSTEM_PROMPT = `
Sos el Asistente Bartez en WhatsApp. Tu objetivo es calificar y derivar rápidamente las consultas comerciales de empresas argentinas al equipo humano de Bartez Tecnología.

${BARTEZ_KNOWLEDGE}

REGLAS DE CONVERSACIÓN (WhatsApp):
1. **Idioma y Tono**: Español rioplatense (voseo, ej: "escribinos", "decime", "querés", "tenés"), profesional, directo y amable.
2. **Brevedad**: Máximo 80 palabras por respuesta. Sé muy sintético.
3. **Emojis**: Usar a lo sumo 1 o 2 por mensaje para mantener el tono corporativo pero cercano.
4. **No al Catálogo**: No inventes stock, precios, marcas ni financiación.
5. **Presentación**: En el primer mensaje de la conversación, presentate obligatoriamente usando esta frase exacta: "¡Hola! Soy el asistente virtual de Bartez Tecnología. Estoy acá para tomar tus datos y derivarte con un especialista. Decime...".

ESTRATEGIA DE CALIFICACIÓN Y ESCALADO (Flujo obligatorio de 2 pasos máximo):
- **Paso 1 (Primer mensaje de consulta comercial)**:
  Cuando el usuario mencione una necesidad de cotización, compra de equipamiento, notebooks, servidores, etc., y falte información:
  - Respondé de forma amable confirmando que podemos cotizar.
  - Pedí TODOS los datos clave juntos en ese mismo mensaje utilizando una lista o párrafo simple. Específicamente pedí:
    1. Detalle o especificaciones de los equipos y cantidad (ej: marca, RAM, disco).
    2. Nombre de la empresa.
    3. Plazo de entrega o urgencia.
  - En este paso, devolvé "shouldEscalate": false.
- **Paso 2 (Siguiente respuesta del usuario)**:
  En cuanto el usuario responda al pedido de datos (o si ya proporcionó la mayor parte de estos datos desde su primer mensaje):
  - Respondé confirmando que tomaste nota y que un especialista comercial se va a contactar con él a la brevedad para enviarle la propuesta.
  - **NUNCA hagas más preguntas de calificación**. No extiendas la conversación.
  - Establecé de forma obligatoria "shouldEscalate": true para derivar inmediatamente al asesor humano.
- **Consultas no comerciales (soporte, posventa, seguimiento)**:
  - Derivá inmediatamente al especialista informando que un asesor lo contactará, sin realizar preguntas. Establecé "shouldEscalate": true de inmediato.

FORMATO DE RESPUESTA (obligatorio):
Respondé SIEMPRE en JSON válido con esta estructura exacta, sin texto adicional fuera del JSON:
{
  "reply": "<tu respuesta al usuario>",
  "category": "<cotizacion|asesoramiento|soporte|info_general|revendedor|seguimiento|spam>",
  "shouldEscalate": <true si la consulta requiere atención humana inmediata, false si podés seguir orientando>,
  "leadData": {
    "empresa": "<nombre de la empresa si fue mencionado>",
    "necesidad": "<resumen breve de lo que necesita>",
    "urgencia": "<alta|media|baja si se puede inferir>"
  }
}
`.trim();

// ---- Fallback rate tracker (alert anti-repetition) ------------------------

const FALLBACK_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const FALLBACK_ALERT_THRESHOLD = 5;
const fallbackTimestamps: number[] = [];
let alertSentAt = 0;

function trackFallback(): void {
  const now = Date.now();
  fallbackTimestamps.push(now);

  // Prune timestamps older than the window
  const cutoff = now - FALLBACK_WINDOW_MS;
  while (fallbackTimestamps.length > 0 && fallbackTimestamps[0] < cutoff) {
    fallbackTimestamps.shift();
  }

  if (fallbackTimestamps.length >= FALLBACK_ALERT_THRESHOLD && now - alertSentAt > FALLBACK_WINDOW_MS) {
    alertSentAt = now;
    sendFallbackAlert(fallbackTimestamps.length).catch((err) =>
      logger.error("whatsapp.ai.fallbackAlert", err),
    );
  }
}

async function sendFallbackAlert(count: number): Promise<void> {
  if (!(await isMailConfigured())) return;

  const to = process.env.MAIL_TO || "";
  if (!to) return;

  const subject = `⚠️ Bot WhatsApp: ${count} fallos en la última hora`;
  const html = `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto">
    <h2 style="color:#c0392b">⚠️ Alerta: bot WhatsApp con fallos repetidos</h2>
    <p>El bot de WhatsApp respondió con el <b>fallback técnico ${count} veces</b> en la última hora.</p>
    <p>Esto indica que la IA no está respondiendo correctamente. Posibles causas:</p>
    <ul>
      <li>API key de Anthropic expirada o sin crédito</li>
      <li>Modelo no disponible o rate-limited</li>
      <li>Error de red hacia api.anthropic.com</li>
    </ul>
    <p>Revisá las variables de entorno en Vercel y los logs de la función <code>/api/whatsapp/webhook</code>.</p>
    <p style="color:#667;font-size:12px">Esta alerta no se repite hasta que pase 1 hora desde el último envío.</p>
  </div>`;

  await sendEmail(to, subject, html);
  logger.info("whatsapp.ai.fallbackAlertSent", { count, to });
}

// ---- Valid categories for fallback -----------------------------------------

const VALID_CATEGORIES = new Set<WaCategory>([
  "cotizacion",
  "asesoramiento",
  "soporte",
  "info_general",
  "revendedor",
  "seguimiento",
  "spam",
]);

// ---- Public API ------------------------------------------------------------

/**
 * Process a WhatsApp message through the AI model.
 *
 * Uses `generateText` (not streaming) since WhatsApp doesn't support streamed
 * responses.  The model is configured the same way as the web chat route.
 *
 * @param message - The latest user message.
 * @param history - Previous turns in `{role, content}` pairs.
 */
export async function processWithAI(
  message: string,
  history: Array<{ role: "user" | "assistant"; content: string }> = [],
): Promise<AIResponse> {
  try {
    const result = await generateText({
      model: anthropic(WHATSAPP_MODEL_ID),
      system: WHATSAPP_SYSTEM_PROMPT,
      messages: [
        ...history.map((h) => ({ role: h.role as "user" | "assistant", content: h.content })),
        { role: "user" as const, content: message },
      ],
      maxOutputTokens: 500,
    });

    return parseAIResponse(result.text);
  } catch (error) {
    logger.error("whatsapp.ai.generate", error);
    trackFallback();
    return fallbackResponse();
  }
}

// ---- Helpers ---------------------------------------------------------------

/**
 * Parse the JSON response from the AI model.
 * Falls back to a safe default if the JSON is malformed.
 */
function parseAIResponse(raw: string): AIResponse {
  try {
    // The model sometimes wraps JSON in markdown code fences — strip them.
    const cleaned = raw
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const parsed = JSON.parse(cleaned) as Partial<AIResponse>;

    return {
      reply: typeof parsed.reply === "string" ? parsed.reply : raw,
      category: VALID_CATEGORIES.has(parsed.category as WaCategory)
        ? (parsed.category as WaCategory)
        : "info_general",
      shouldEscalate: typeof parsed.shouldEscalate === "boolean" ? parsed.shouldEscalate : false,
      ...(parsed.leadData && typeof parsed.leadData === "object"
        ? { leadData: parsed.leadData }
        : {}),
    };
  } catch {
    // If parsing fails, treat the raw text as the reply.
    return {
      reply: raw || fallbackResponse().reply,
      category: "info_general",
      shouldEscalate: false,
    };
  }
}

/** Default response when everything else fails. */
function fallbackResponse(): AIResponse {
  return {
    reply:
      "Disculpá, tuve un problema técnico. ¿Podés repetir tu consulta? Si es urgente, escribinos a ventas@bartez.com.ar 📩",
    category: "info_general",
    // Derivamos a un humano: si el bot no puede responder, que atienda alguien.
    shouldEscalate: true,
    failed: true,
  };
}
