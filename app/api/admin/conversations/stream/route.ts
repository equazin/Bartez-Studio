import { authorizeAdminRequest } from "../../../../../lib/admin-api.ts";
import { getDb } from "../../../../../lib/db.ts";
import { logger } from "../../../../../lib/logger.ts";

export const runtime = "nodejs";

const POLL_INTERVAL_MS = 5_000;

export async function GET(request: Request) {
  const auth = await authorizeAdminRequest(request);
  if (auth.response) return auth.response;

  const encoder = new TextEncoder();
  let lastUpdatedAt = 0;
  let timer: ReturnType<typeof setInterval> | null = null;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: string, payload: unknown) => {
        try {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`));
        } catch (error) {
          logger.warn("admin.conversations.stream.enqueue", error);
        }
      };

      const tick = async () => {
        try {
          const db = getDb();
          const conversations = await db.waConversation.findMany({
            orderBy: { updatedAt: "desc" },
            include: { messages: { orderBy: { createdAt: "desc" }, take: 1 } },
          });
          const maxUpdatedAt = conversations[0]?.updatedAt.getTime() ?? 0;
          if (maxUpdatedAt > lastUpdatedAt) {
            lastUpdatedAt = maxUpdatedAt;
            send("conversations", { conversations });
          } else {
            send("heartbeat", { ts: Date.now() });
          }
        } catch (error) {
          logger.error("admin.conversations.stream.tick", error);
        }
      };

      await tick();
      timer = setInterval(tick, POLL_INTERVAL_MS);

      request.signal.addEventListener("abort", () => {
        if (timer) clearInterval(timer);
        try { controller.close(); } catch { /* already closed */ }
      });
    },
    cancel() {
      if (timer) clearInterval(timer);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
