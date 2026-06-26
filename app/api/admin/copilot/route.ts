import { convertToModelMessages, stepCountIs, streamText, type UIMessage } from "ai";
import { authorizeAdminRequest } from "../../../../lib/admin-api";
import { getCopilotTools, COPILOT_SYSTEM_PROMPT } from "../../../../lib/ai/copilot";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_MESSAGES = 24;

export async function POST(request: Request) {
  const { session, response } = await authorizeAdminRequest(request);
  if (!session) return response!;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "JSON inválido" }, { status: 400 });
  }

  const messages =
    body && typeof body === "object" && "messages" in body
      ? (body as { messages?: unknown }).messages
      : undefined;

  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) {
    return Response.json({ error: "Conversación inválida." }, { status: 422 });
  }

  const modelMessages = await convertToModelMessages(messages as UIMessage[]);

  const result = streamText({
    model: process.env.AI_GATEWAY_MODEL || "anthropic/claude-haiku-4.5",
    system: COPILOT_SYSTEM_PROMPT,
    messages: modelMessages,
    tools: getCopilotTools(),
    stopWhen: stepCountIs(5),
    maxOutputTokens: 1200,
    providerOptions: {
      gateway: {
        tags: ["feature:bartez-copilot", `env:${process.env.VERCEL_ENV || "local"}`],
      },
    },
  });

  return result.toUIMessageStreamResponse({
    headers: { "Cache-Control": "no-store" },
  });
}
