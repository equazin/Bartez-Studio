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
    (globalThis as any).prisma = this;
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
  const oldWaToken = process.env.WHATSAPP_API_TOKEN;
  const oldWaPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  process.env.AI_GATEWAY_API_KEY = "mock-key";
  process.env.OPENAI_API_KEY = "mock-key";
  process.env.WHATSAPP_API_TOKEN = "mock-wa-token";
  process.env.WHATSAPP_PHONE_NUMBER_ID = "123456789";

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
    process.env.WHATSAPP_API_TOKEN = oldWaToken;
    process.env.WHATSAPP_PHONE_NUMBER_ID = oldWaPhoneId;
  }
});

test("handleIncomingMessage asks for confirmation before creating a lead", async () => {
  prismaMock.reset();

  const oldGatewayKey = process.env.AI_GATEWAY_API_KEY;
  const oldOpenaiKey = process.env.OPENAI_API_KEY;
  const oldMondayToken = process.env.MONDAY_API_TOKEN;
  const oldWaToken = process.env.WHATSAPP_API_TOKEN;
  const oldWaPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const oldLeadConfirmation = process.env.WHATSAPP_REQUIRE_LEAD_CONFIRMATION;

  process.env.AI_GATEWAY_API_KEY = "mock-key";
  process.env.OPENAI_API_KEY = "mock-key";
  process.env.MONDAY_API_TOKEN = "mock-token";
  process.env.WHATSAPP_API_TOKEN = "mock-wa-token";
  process.env.WHATSAPP_PHONE_NUMBER_ID = "123456789";
  process.env.WHATSAPP_REQUIRE_LEAD_CONFIRMATION = "false";

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
    assert.equal(conv.status, "pending_lead_confirmation");
    assert.equal(conv.leadCreated, false);

    // The lead must not be sent to Monday until the user confirms explicitly.
    const mondayCalls = fetchCalls.filter((c) => c.url.includes("api.monday.com"));
    assert.equal(mondayCalls.length, 0);

    const outboundMsg = prismaMock.messages.find((m) => m.direction === "outbound");
    assert.ok(outboundMsg);
    assert.match(outboundMsg.body, /confirmame con "SI"/);
    assert.ok(outboundMsg.metadata?.pendingLead);
  } finally {
    global.fetch = originalFetch;
    process.env.AI_GATEWAY_API_KEY = oldGatewayKey;
    process.env.OPENAI_API_KEY = oldOpenaiKey;
    process.env.MONDAY_API_TOKEN = oldMondayToken;
    process.env.WHATSAPP_API_TOKEN = oldWaToken;
    process.env.WHATSAPP_PHONE_NUMBER_ID = oldWaPhoneId;
    process.env.WHATSAPP_REQUIRE_LEAD_CONFIRMATION = oldLeadConfirmation;
  }
});


test("handleIncomingMessage creates lead after explicit WhatsApp confirmation", async () => {
  prismaMock.reset();

  const oldGatewayKey = process.env.AI_GATEWAY_API_KEY;
  const oldOpenaiKey = process.env.OPENAI_API_KEY;
  const oldMondayToken = process.env.MONDAY_API_TOKEN;
  const oldWaToken = process.env.WHATSAPP_API_TOKEN;
  const oldWaPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  process.env.AI_GATEWAY_API_KEY = "mock-key";
  process.env.OPENAI_API_KEY = "mock-key";
  process.env.MONDAY_API_TOKEN = "mock-token";
  process.env.WHATSAPP_API_TOKEN = "mock-wa-token";
  process.env.WHATSAPP_PHONE_NUMBER_ID = "123456789";

  const originalFetch = global.fetch;
  const fetchCalls: Array<{ url: string; options: any }> = [];

  global.fetch = (async (url: string, options: any) => {
    fetchCalls.push({ url, options });

    if (url.includes("/messages")) {
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    if (url.includes("api.monday.com")) {
      return new Response(JSON.stringify({ data: { create_item: { id: "monday-item-confirmed" } } }), { status: 200 });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  }) as any;

  try {
    prismaMock.conversations.push({
      id: "conv_pending_123",
      waId: "5493415559999",
      profileName: "Marcos Acme",
      status: "pending_lead_confirmation",
      category: "cotizacion",
      leadCreated: false,
    });

    prismaMock.messages.push({
      id: "msg_pending_lead",
      conversationId: "conv_pending_123",
      waMessageId: "bot_conv_pending_123_1",
      direction: "outbound",
      type: "text",
      body: "Confirmación pendiente",
      category: "cotizacion",
      metadata: {
        pendingLead: {
          empresa: "Acme Corp",
          nombre: "Marcos Acme",
          email: "5493415559999@whatsapp.placeholder",
          telefono: "5493415559999",
          tipoConsulta: "cotizacion",
          mensaje: "[WhatsApp] Conversación #conv_pending_123\nNecesidad: Cotizar 10 servidores Xeon",
          agendarReunion: false,
          origen: "whatsapp",
        },
      },
      createdAt: new Date(Date.now() - 1000),
    });

    await handleIncomingMessage({
      senderPhone: "5493415559999",
      senderName: "Marcos Acme",
      messageId: "wamid.confirm-lead",
      messageType: "text" as const,
      body: "SI, confirmo",
      timestamp: Date.now(),
    });

    const conv = prismaMock.conversations[0];
    assert.equal(conv.status, "escalated");
    assert.equal(conv.leadCreated, true);

    const mondayCalls = fetchCalls.filter((c) => c.url.includes("api.monday.com"));
    assert.equal(mondayCalls.length, 1);
  } finally {
    global.fetch = originalFetch;
    process.env.AI_GATEWAY_API_KEY = oldGatewayKey;
    process.env.OPENAI_API_KEY = oldOpenaiKey;
    process.env.MONDAY_API_TOKEN = oldMondayToken;
    process.env.WHATSAPP_API_TOKEN = oldWaToken;
    process.env.WHATSAPP_PHONE_NUMBER_ID = oldWaPhoneId;
  }
});

test("handleIncomingMessage skips processing if conversation status is escalated", async () => {
  prismaMock.reset();

  const oldGatewayKey = process.env.AI_GATEWAY_API_KEY;
  const oldOpenaiKey = process.env.OPENAI_API_KEY;
  process.env.AI_GATEWAY_API_KEY = "mock-key";
  process.env.OPENAI_API_KEY = "mock-key";
  process.env.WHATSAPP_API_TOKEN = "mock-wa-token";
  process.env.WHATSAPP_PHONE_NUMBER_ID = "123456789";

  const originalFetch = global.fetch;
  const fetchCalls: Array<{ url: string; options: any }> = [];

  global.fetch = (async (url: string, options: any) => {
    fetchCalls.push({ url, options });
    return new Response(JSON.stringify({ messaging_product: "whatsapp", messages: [{ id: "wamid.sent-escalated" }] }), {
      status: 200,
    });
  }) as any;

  try {
    // 1. Seed an escalated conversation in the mock DB
    prismaMock.conversations.push({
      id: "conv_escalated_123",
      waId: "5493415551111",
      profileName: "Escalated User",
      status: "escalated",
      leadCreated: true,
    });

    const incomingParsed = {
      senderPhone: "5493415551111",
      senderName: "Escalated User",
      messageId: "wamid.msg-during-escalation",
      messageType: "text" as const,
      body: "Hola, ¿hay alguien ahí?",
      timestamp: Date.now(),
    };

    await handleIncomingMessage(incomingParsed);

    // 2. Outbound message should NOT be created
    // Total messages should be 1 (the inbound message we just registered)
    assert.equal(prismaMock.messages.length, 1);
    const inboundMsg = prismaMock.messages[0];
    assert.equal(inboundMsg.direction, "inbound");
    assert.equal(inboundMsg.body, "Hola, ¿hay alguien ahí?");

    // 3. No outbound messages should have been sent to Meta API
    const whatsappSends = fetchCalls.filter((c) => c.url.includes("/messages"));
    // Since it's escalated, we markAsRead (blue ticks) is acceptable/fired,
    // but no sendTextMessage (sending outbound message) should be called.
    // Let's verify markAsRead is called but no text send.
    // Let's check that we didn't send any reply.
    const outboundSends = whatsappSends.filter((c) => {
      if (!c.options.body) return false;
      const b = JSON.parse(c.options.body);
      return b.text !== undefined;
    });
    assert.equal(outboundSends.length, 0);

  } finally {
    global.fetch = originalFetch;
    process.env.AI_GATEWAY_API_KEY = oldGatewayKey;
    process.env.OPENAI_API_KEY = oldOpenaiKey;
  }
});
