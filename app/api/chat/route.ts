import { createHash } from "node:crypto";
import {
  convertToModelMessages,
  streamText,
  type UIMessage,
} from "ai";
import { ASSISTANT_INSTRUCTIONS } from "../../../lib/ai/knowledge.ts";
import { checkRateLimit } from "../../../lib/rate-limit.ts";

export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_MESSAGES = 16;
const MAX_MESSAGE_CHARS = 1_200;
const MAX_TOTAL_CHARS = 12_000;

function getTextLength(message: UIMessage) {
  return message.parts.reduce(
    (total, part) => total + ((part.type === "text" || part.type === "reasoning") ? part.text.length : 0),
    0,
  );
}

function isValidMessage(value: unknown): value is UIMessage {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<UIMessage>;
  return (
    (candidate.role === "user" || candidate.role === "assistant") &&
    Array.isArray(candidate.parts) &&
    candidate.parts.every(
      (part) =>
        Boolean(part) &&
        typeof part === "object" &&
        "type" in part &&
        ["text", "reasoning"].includes((part as { type?: string }).type || "") &&
        "text" in part &&
        typeof (part as { text?: unknown }).text === "string",
    )
  );
}

function anonymousUserId(request: Request) {
  const address =
    request.headers.get("x-vercel-forwarded-for") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  return createHash("sha256").update(address).digest("hex").slice(0, 16);
}

export async function POST(request: Request) {
  const rateLimit = checkRateLimit(request, "ai-chat", 12, 10 * 60 * 1_000);
  if (!rateLimit.allowed) {
    return Response.json(
      { error: "Alcanzaste el límite de consultas. Probá nuevamente en unos minutos." },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfter) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const messages =
    body && typeof body === "object" && "messages" in body
      ? (body as { messages?: unknown }).messages
      : undefined;

  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) {
    return Response.json({ error: "Conversación inválida o demasiado extensa." }, { status: 422 });
  }
  if (!messages.every(isValidMessage)) {
    return Response.json({ error: "El formato de la conversación no es válido." }, { status: 422 });
  }

  const totalChars = messages.reduce((total, message) => total + getTextLength(message), 0);
  if (
    totalChars > MAX_TOTAL_CHARS ||
    messages.some((message) => getTextLength(message) > MAX_MESSAGE_CHARS)
  ) {
    return Response.json({ error: "El mensaje es demasiado largo." }, { status: 413 });
  }

  if (!process.env.VERCEL_OIDC_TOKEN && !process.env.AI_GATEWAY_API_KEY) {
    return Response.json(
      { error: "El asistente está temporalmente fuera de servicio. Podés continuar por WhatsApp." },
      { status: 503 },
    );
  }

  const modelMessages = await convertToModelMessages(messages);
  const result = streamText({
    model: process.env.AI_GATEWAY_MODEL || "anthropic/claude-haiku-4.5",
    system: ASSISTANT_INSTRUCTIONS,
    messages: modelMessages,
    maxOutputTokens: 500,
    providerOptions: {
      gateway: {
        user: anonymousUserId(request),
        tags: ["feature:bartez-assistant", `env:${process.env.VERCEL_ENV || "local"}`],
      },
    },
    onError: ({ error }) => {
      console.error("Bartez assistant error", error instanceof Error ? error.message : "unknown");
    },
  });

  return result.toUIMessageStreamResponse({
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
