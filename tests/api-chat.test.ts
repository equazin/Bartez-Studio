import assert from "node:assert/strict";
import test from "node:test";
import { POST } from "../app/api/chat/route.ts";

test("POST /api/chat - returns 503 if no API keys configured", async () => {
  const originalEnvToken = process.env.VERCEL_OIDC_TOKEN;
  const originalEnvKey = process.env.AI_GATEWAY_API_KEY;
  
  delete process.env.VERCEL_OIDC_TOKEN;
  delete process.env.AI_GATEWAY_API_KEY;

  try {
    const req = new Request("http://localhost/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": "1.1.2.1" },
      body: JSON.stringify({
        messages: [{ role: "user", parts: [{ type: "text", text: "Hola" }] }]
      }),
    });

    const res = await POST(req);
    assert.equal(res.status, 503);
    const body = await res.json();
    assert.match(body.error, /temporalmente fuera de servicio/);
  } finally {
    if (originalEnvToken === undefined) {
      delete process.env.VERCEL_OIDC_TOKEN;
    } else {
      process.env.VERCEL_OIDC_TOKEN = originalEnvToken;
    }
    if (originalEnvKey === undefined) {
      delete process.env.AI_GATEWAY_API_KEY;
    } else {
      process.env.AI_GATEWAY_API_KEY = originalEnvKey;
    }
  }
});

test("POST /api/chat - returns 400 for invalid JSON", async () => {
  const req = new Request("http://localhost/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": "1.1.2.2" },
    body: "invalid-json",
  });

  const res = await POST(req);
  assert.equal(res.status, 400);
});

test("POST /api/chat - returns 422 for empty/missing messages", async () => {
  const req = new Request("http://localhost/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": "1.1.2.3" },
    body: JSON.stringify({ messages: [] }),
  });

  const res = await POST(req);
  assert.equal(res.status, 422);
});

test("POST /api/chat - returns 422 for invalid message format", async () => {
  const req = new Request("http://localhost/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": "1.1.2.4" },
    body: JSON.stringify({
      messages: [{ role: "bad-role", parts: [{ type: "text", text: "Hola" }] }]
    }),
  });

  const res = await POST(req);
  assert.equal(res.status, 422);
});

test("POST /api/chat - returns 413 for oversized message text", async () => {
  const longText = "a".repeat(1201); // max is 1200
  const req = new Request("http://localhost/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": "1.1.2.5" },
    body: JSON.stringify({
      messages: [{ role: "user", parts: [{ type: "text", text: longText }] }]
    }),
  });

  const res = await POST(req);
  assert.equal(res.status, 413);
});

test("POST /api/chat - rate limits after 12 requests", async () => {
  const originalEnvToken = process.env.VERCEL_OIDC_TOKEN;
  const originalEnvKey = process.env.AI_GATEWAY_API_KEY;
  
  delete process.env.VERCEL_OIDC_TOKEN;
  delete process.env.AI_GATEWAY_API_KEY;

  const ip = "1.1.2.9";
  const makeRequest = () => new Request("http://localhost/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify({
      messages: [{ role: "user", parts: [{ type: "text", text: "Hola" }] }]
    }),
  });

  try {
    for (let i = 0; i < 12; i++) {
      delete process.env.VERCEL_OIDC_TOKEN;
      delete process.env.AI_GATEWAY_API_KEY;
      const res = await POST(makeRequest());
      assert.notEqual(res.status, 429);
    }

    delete process.env.VERCEL_OIDC_TOKEN;
    delete process.env.AI_GATEWAY_API_KEY;
    const res = await POST(makeRequest());
    assert.equal(res.status, 429);
  } finally {
    if (originalEnvToken === undefined) {
      delete process.env.VERCEL_OIDC_TOKEN;
    } else {
      process.env.VERCEL_OIDC_TOKEN = originalEnvToken;
    }
    if (originalEnvKey === undefined) {
      delete process.env.AI_GATEWAY_API_KEY;
    } else {
      process.env.AI_GATEWAY_API_KEY = originalEnvKey;
    }
  }
});
