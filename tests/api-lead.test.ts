import assert from "node:assert/strict";
import test from "node:test";
import { POST } from "../app/api/lead/route.ts";

test("POST /api/lead - handles valid request", async () => {
  const originalFetch = global.fetch;
  const originalEnvProvider = process.env.MAIL_PROVIDER;
  const originalEnvStore = process.env.LEAD_STORE_URL;
  
  process.env.MAIL_PROVIDER = ""; 
  process.env.LEAD_STORE_URL = "http://mock-store";

  try {
    global.fetch = async () => {
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    };

    const req = new Request("http://localhost/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": "1.1.1.1" },
      body: JSON.stringify({
        empresa: "Empresa Test",
        nombre: "Juan Perez",
        email: "juan@empresa.test",
        telefono: "3415551234",
        tipoConsulta: "cotizacion",
        mensaje: "Hola",
      }),
    });

    const res = await POST(req);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.ok, true);
  } finally {
    global.fetch = originalFetch;
    process.env.MAIL_PROVIDER = originalEnvProvider;
    process.env.LEAD_STORE_URL = originalEnvStore;
  }
});

test("POST /api/lead - honeypot blocks bot quietly", async () => {
  const req = new Request("http://localhost/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": "1.1.1.2" },
    body: JSON.stringify({
      empresa: "Empresa Test",
      nombre: "Juan Perez",
      email: "juan@empresa.test",
      telefono: "3415551234",
      tipoConsulta: "cotizacion",
      mensaje: "Hola",
      website: "http://bot-url.com", // honeypot triggered
    }),
  });

  const res = await POST(req);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.ok, true);
});

test("POST /api/lead - returns 422 for invalid schema", async () => {
  const req = new Request("http://localhost/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": "1.1.1.3" },
    body: JSON.stringify({
      nombre: "Juan", // missing fields
    }),
  });

  const res = await POST(req);
  assert.equal(res.status, 422);
  const body = await res.json();
  assert.equal(body.ok, false);
  assert.ok(body.issues);
});

test("POST /api/lead - returns 400 for invalid JSON", async () => {
  const req = new Request("http://localhost/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": "1.1.1.4" },
    body: "invalid-json",
  });

  const res = await POST(req);
  assert.equal(res.status, 400);
  const body = await res.json();
  assert.equal(body.ok, false);
});

test("POST /api/lead - rate limits after 5 requests", async () => {
  const originalFetch = global.fetch;
  const originalEnvProvider = process.env.MAIL_PROVIDER;
  const originalEnvStore = process.env.LEAD_STORE_URL;
  
  process.env.MAIL_PROVIDER = ""; 
  process.env.LEAD_STORE_URL = "http://mock-store";

  const ip = "1.1.1.9";
  const makeRequest = () => new Request("http://localhost/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify({
      empresa: "Empresa Test",
      nombre: "Juan Perez",
      email: "juan@empresa.test",
      telefono: "3415551234",
      tipoConsulta: "cotizacion",
      mensaje: "Hola",
    }),
  });

  try {
    global.fetch = async () => {
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    };

    // Consumir 5 intentos
    for (let i = 0; i < 5; i++) {
      const res = await POST(makeRequest());
      assert.ok(res.status === 200 || res.status === 429);
    }

    // El 6to debe ser 429
    const res = await POST(makeRequest());
    assert.equal(res.status, 429);
    const body = await res.json();
    assert.equal(body.ok, false);
    assert.match(body.error, /Demasiados intentos/);
  } finally {
    global.fetch = originalFetch;
    process.env.MAIL_PROVIDER = originalEnvProvider;
    process.env.LEAD_STORE_URL = originalEnvStore;
  }
});
