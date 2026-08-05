// ---------------------------------------------------------------------------
// WhatsApp AI Agent — Non-streaming AI engine for WhatsApp conversations
// ---------------------------------------------------------------------------

import { generateText } from "ai";
import { BARTEZ_KNOWLEDGE } from "../ai/knowledge.ts";

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
      model: process.env.AI_GATEWAY_MODEL || "anthropic/claude-haiku-4.5",
      system: WHATSAPP_SYSTEM_PROMPT,
      messages: [
        ...history.map((h) => ({ role: h.role as "user" | "assistant", content: h.content })),
        { role: "user" as const, content: message },
      ],
      maxOutputTokens: 500,
      providerOptions: {
        gateway: {
          tags: [
            "feature:bartez-whatsapp",
            `env:${process.env.VERCEL_ENV || "local"}`,
          ],
        },
      },
    });

    return parseAIResponse(result.text);
  } catch (error) {
    console.error(
      "[whatsapp/ai-agent] AI generation error",
      error instanceof Error ? error.message : error,
    );
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
    shouldEscalate: true,
  };
}
