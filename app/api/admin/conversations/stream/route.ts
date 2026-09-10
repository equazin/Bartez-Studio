import { authorizeAdminRequest } from "../../../../../lib/admin-api.ts";
import { getDb } from "../../../../../lib/db.ts";
import { logger } from "../../../../../lib/logger.ts";

export const runtime = "nodejs";

const POLL_INTERVAL_MS = 5_000;
const CONVERSATION_LIMIT = 100;

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

          // Sonda barata: una sola fila con el último updatedAt. Antes cada
          // tick traía todas las conversaciones con su último mensaje (~34 KB)
          // solo para comparar una fecha; a 5 s por tick eso son ~17 GB/mes por
          // pestaña abierta, y fue lo que agotó la cuota de transferencia.
          const probe = await db.waConversation.aggregate({ _max: { updatedAt: true } });
          const maxUpdatedAt = probe._max.updatedAt?.getTime() ?? 0;

          if (maxUpdatedAt <= lastUpdatedAt) {
            send("heartbeat", { ts: Date.now() });
            return;
          }

          lastUpdatedAt = maxUpdatedAt;
          const conversations = await db.waConversation.findMany({
            orderBy: { updatedAt: "desc" },
            take: CONVERSATION_LIMIT,
            select: {
              id: true,
              waId: true,
              profileName: true,
              category: true,
              status: true,
              leadCreated: true,
              updatedAt: true,
              // La lista solo muestra un preview del último mensaje. El detalle
              // completo lo pide aparte /api/admin/conversations/[id], así que
              // omitimos metadata, que es el campo más pesado.
              messages: {
                orderBy: { createdAt: "desc" },
                take: 1,
                select: {
                  id: true,
                  waMessageId: true,
                  direction: true,
                  type: true,
                  body: true,
                  category: true,
                  createdAt: true,
                },
              },
            },
          });
          send("conversations", { conversations });
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
