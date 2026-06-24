import assert from "node:assert/strict";
import test from "node:test";
import { POST } from "../app/api/admin/conversations/[id]/route.ts";
import { ADMIN_COOKIE_NAME, signToken } from "../lib/auth-token.ts";

class PrismaMock {
  conversations: any[] = [];
  messages: any[] = [];
  updateCalls: any[] = [];
  createMessageCalls: any[] = [];

  reset() {
    this.conversations = [];
    this.messages = [];
    this.updateCalls = [];
    this.createMessageCalls = [];
    (globalThis as any).prisma = this;
  }

  waConversation = {
    findUnique: async (args: any) => {
      return this.conversations.find((c) => c.id === args.where.id) || null;
    },
    update: async (args: any) => {
      this.updateCalls.push(args);
      const conv = this.conversations.find((c) => c.id === args.where.id);
      if (conv) {
        Object.assign(conv, args.data);
      }
      return conv;
    },
  };

  waMessage = {
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
(globalThis as any).prisma = prismaMock;

test("POST /api/admin/conversations/[id] rejects unauthorized requests", async () => {
  const req = new Request("http://localhost/api/admin/conversations/conv123", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "Hola" }),
  });

  const res = await POST(req, { params: Promise.resolve({ id: "conv123" }) });
  assert.equal(res.status, 401);
});

test("POST /api/admin/conversations/[id] sends manual reply and saves it to DB", async () => {
  prismaMock.reset();

  // Mock conversation in DB
  prismaMock.conversations.push({
    id: "conv_test_123",
    waId: "5493415104902",
    profileName: "Test User",
    status: "active",
    category: "cotizacion",
    updatedAt: new Date(),
  });

  const oldToken = process.env.ADMIN_JWT_SECRET;
  const oldWaToken = process.env.WHATSAPP_API_TOKEN;
  const oldWaPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  process.env.ADMIN_JWT_SECRET = "test-secret-with-at-least-thirty-two-characters";
  process.env.WHATSAPP_API_TOKEN = "mock-wa-token";
  process.env.WHATSAPP_PHONE_NUMBER_ID = "123456789";
  
  const token = await signToken("admin");

  const originalFetch = global.fetch;
  const fetchCalls: any[] = [];
  global.fetch = (async (url: string, options: any) => {
    fetchCalls.push({ url, options });
    return new Response(JSON.stringify({ messaging_product: "whatsapp", messages: [{ id: "wamid.sent-manual" }] }), {
      status: 200,
    });
  }) as any;

  try {
    const req = new Request("http://localhost/api/admin/conversations/conv_test_123", {
      method: "POST",
      headers: {
        cookie: `${ADMIN_COOKIE_NAME}=${token}`,
        origin: "http://localhost",
        host: "localhost",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: "Mensaje manual de prueba" }),
    });

    const res = await POST(req, { params: Promise.resolve({ id: "conv_test_123" }) });
    assert.equal(res.status, 200);

    const data = await res.json();
    assert.ok(data.ok);
    assert.equal(data.message.body, "Mensaje manual de prueba");
    assert.equal(data.message.direction, "outbound");

    // Check message is recorded in DB
    assert.equal(prismaMock.messages.length, 1);
    assert.equal(prismaMock.messages[0].body, "Mensaje manual de prueba");

    // Check WhatsApp fetch was called
    const whatsappSends = fetchCalls.filter((c) => c.url.includes("/messages"));
    assert.equal(whatsappSends.length, 1);
    const bodySend = JSON.parse(whatsappSends[0].options.body);
    assert.equal(bodySend.text.body, "Mensaje manual de prueba");

  } finally {
    global.fetch = originalFetch;
    process.env.ADMIN_JWT_SECRET = oldToken;
    process.env.WHATSAPP_API_TOKEN = oldWaToken;
    process.env.WHATSAPP_PHONE_NUMBER_ID = oldWaPhoneId;
  }
});
