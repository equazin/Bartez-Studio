import assert from "node:assert/strict";
import test from "node:test";
import { handleIncomingMessage } from "../lib/whatsapp/router.ts";

// ── In-Memory Prisma Mock ────────────────────────────────────

class PrismaMock {
  conversations: any[] = [];
  messages: any[] = [];
  findUniqueCalls: any[] = [];
  createConversationCalls: any[] = [];
  updateConversationCalls: any[] = [];
  createMessageCalls: any[] = [];
  findManyMessageCalls: any[] = [];

  reset() {
    this.conversations = [];
    this.messages = [];
    this.findUniqueCalls = [];
    this.createConversationCalls = [];
    this.updateConversationCalls = [];
    this.createMessageCalls = [];
    this.findManyMessageCalls = [];
  }

  waConversation = {
    findUnique: async (args: any) => {
      this.findUniqueCalls.push(args);
      return this.conversations.find((c) => c.waId === args.where.waId) || null;
    },
    create: async (args: any) => {
      this.createConversationCalls.push(args);
      const conv = {
        id: `conv_${Math.floor(Math.random() * 100000)}`,
        leadCreated: false,
        category: null,
        status: "active",
        ...args.data,
      };
      this.conversations.push(conv);
      return conv;
    },
    update: async (args: any) => {
      this.updateConversationCalls.push(args);
      const conv = this.conversations.find((c) => c.id === args.where.id);
      if (conv) {
        Object.assign(conv, args.data);
      }
      return conv;
    },
  };

  waMessage = {
    findMany: async (args: any) => {
      this.findManyMessageCalls.push(args);
      const filtered = this.messages.filter((m) => m.conversationId === args.where.conversationId);
      if (args.orderBy?.createdAt === "desc") {
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      }
      return filtered.slice(0, args.take);
    },
    create: async (args: any) => {
      this.createMessageCalls.push(args);
      const msg = {
        id: `msg_${Math.floor(Math.random() * 100000)}`,
        createdAt: new Date(),
        ...args.data,
      };
      this.messages.push(msg);
      return msg;
    },
  };
}

const prismaMock = new PrismaMock();

// Attach mock to globalThis
(globalThis as any).prisma = prismaMock;

// ── Test Cases ────────────────────────────────────────────────

test("handleIncomingMessage processes inbound text message, calls AI, saves outbound reply, and sends it", async () => {
  prismaMock.reset();

  // Env variables for Vercel AI SDK
  const oldGatewayKey = process.env.AI_GATEWAY_API_KEY;
  const oldOpenaiKey = process.env.OPENAI_API_KEY;
  process.env.AI_GATEWAY_API_KEY = "mock-key";
  process.env.OPENAI_API_KEY = "mock-key";

  const originalFetch = global.fetch;
  const fetchCalls: Array<{ url: string; options: any }> = [];

  // Mock global.fetch
  global.fetch = (async (url: string, options: any) => {
    fetchCalls.push({ url, options });

    if (url.includes("/messages")) {
      // Mock WhatsApp API success response
      return new Response(JSON.stringify({ messaging_product: "whatsapp", messages: [{ id: "wamid.sent-xxx" }] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Mock AI completion response
    const aiResponsePayload = {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            reply: "Hola! Veo que querés cotizar. ¿De qué empresa nos contactás?",
            category: "cotizacion",
            shouldEscalate: false,
          }),
        },
      ],
      finishReason: "stop",
      usage: {
        inputTokens: {
          total: 10,
          noCache: 10,
          cacheRead: 0,
          cacheWrite: 0,
        },
        outputTokens: {
          total: 10,
          text: 10,
          reasoning: 0,
        },
      },
    };

    return new Response(JSON.stringify(aiResponsePayload), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }) as any;

  try {
    const incomingParsed = {
      senderPhone: "5493415104902",
      senderName: "Juan Pérez",
      messageId: "wamid.HBgLMTY1MDM4Nzk0MzkVAgA=",
      messageType: "text" as const,
      body: "Hola, quiero cotizar un servidor",
      timestamp: Date.now(),
    };

    await handleIncomingMessage(incomingParsed);

    // ── Assertions ──

    // 1. Conversation should be created
    assert.equal(prismaMock.conversations.length, 1);
    const conv = prismaMock.conversations[0];
    assert.equal(conv.waId, "5493415104902");
    assert.equal(conv.profileName, "Juan Pérez");

    // 2. Both inbound and outbound messages should be stored
    assert.equal(prismaMock.messages.length, 2);
    const inboundMsg = prismaMock.messages.find((m) => m.direction === "inbound");
    const outboundMsg = prismaMock.messages.find((m) => m.direction === "outbound");

    assert.ok(inboundMsg);
    assert.equal(inboundMsg.body, "Hola, quiero cotizar un servidor");
    assert.equal(inboundMsg.waMessageId, "wamid.HBgLMTY1MDM4Nzk0MzkVAgA=");

    assert.ok(outboundMsg);
    assert.equal(outboundMsg.body, "Hola! Veo que querés cotizar. ¿De qué empresa nos contactás?");
    assert.equal(outboundMsg.category, "cotizacion");

    // 3. Conversation category should be updated
    assert.equal(conv.category, "cotizacion");

    // 4. Check fetch requests
    const whatsappSends = fetchCalls.filter((c) => c.url.includes("/messages"));
    // One for markAsRead and one for sendTextMessage
    assert.equal(whatsappSends.length, 2);

    const bodySend = JSON.parse(whatsappSends[1].options.body);
    assert.equal(bodySend.to, "5493415104902");
    assert.equal(bodySend.text.body, "Hola! Veo que querés cotizar. ¿De qué empresa nos contactás?");
  } finally {
    global.fetch = originalFetch;
    process.env.AI_GATEWAY_API_KEY = oldGatewayKey;
    process.env.OPENAI_API_KEY = oldOpenaiKey;
  }
});

test("handleIncomingMessage creates a lead when escalation is required and lead data is sufficient", async () => {
  prismaMock.reset();

  const oldGatewayKey = process.env.AI_GATEWAY_API_KEY;
  const oldOpenaiKey = process.env.OPENAI_API_KEY;
  const oldMondayToken = process.env.MONDAY_API_TOKEN;
  
  process.env.AI_GATEWAY_API_KEY = "mock-key";
  process.env.OPENAI_API_KEY = "mock-key";
  process.env.MONDAY_API_TOKEN = "mock-token";

  const originalFetch = global.fetch;
  const fetchCalls: Array<{ url: string; options: any }> = [];

  global.fetch = (async (url: string, options: any) => {
    fetchCalls.push({ url, options });

    if (url.includes("/messages")) {
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    if (url.includes("api.monday.com")) {
      // Mock Monday API lead creation
      return new Response(JSON.stringify({ data: { create_item: { id: "monday-item-123" } } }), { status: 200 });
    }

    // Mock AI response requiring escalation with sufficient lead data
    const aiResponsePayload = {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            reply: "Perfecto, un asesor se contactará para la cotización de los 10 servidores.",
            category: "cotizacion",
            shouldEscalate: true,
            leadData: {
              empresa: "Acme Corp",
              necesidad: "Cotizar 10 servidores Xeon",
            },
          }),
        },
      ],
      finishReason: "stop",
      usage: {
        inputTokens: {
          total: 10,
          noCache: 10,
          cacheRead: 0,
          cacheWrite: 0,
        },
        outputTokens: {
          total: 10,
          text: 10,
          reasoning: 0,
        },
      },
    };

    return new Response(JSON.stringify(aiResponsePayload), { status: 200 });
  }) as any;

  try {
    const incomingParsed = {
      senderPhone: "5493415559999",
      senderName: "Marcos Acme",
      messageId: "wamid.msg-to-escalate",
      messageType: "text" as const,
      body: "Necesito presupuesto urgente para Acme Corp de 10 servidores Xeon",
      timestamp: Date.now(),
    };

    await handleIncomingMessage(incomingParsed);

    const conv = prismaMock.conversations[0];
    assert.ok(conv);
    assert.equal(conv.status, "escalated");
    assert.equal(conv.leadCreated, true);

    // Verify Monday.com API was called
    const mondayCalls = fetchCalls.filter((c) => c.url.includes("api.monday.com"));
    assert.equal(mondayCalls.length, 1);
    
    const bodyStr = mondayCalls[0].options.body;
    assert.match(bodyStr, /Acme Corp/);
  } finally {
    global.fetch = originalFetch;
    process.env.AI_GATEWAY_API_KEY = oldGatewayKey;
    process.env.OPENAI_API_KEY = oldOpenaiKey;
    process.env.MONDAY_API_TOKEN = oldMondayToken;
  }
});
