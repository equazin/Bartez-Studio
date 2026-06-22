import assert from "node:assert/strict";
import test from "node:test";
import { apolloSink } from "../../lib/integrations/apollo.ts";

test("apolloSink handle succeeds on successful account and contact creation", async () => {
  const originalFetch = global.fetch;
  const originalEnv = process.env.APOLLO_API_KEY;
  process.env.APOLLO_API_KEY = "mock-key";

  const calls: { url: string; body: any }[] = [];

  try {
    global.fetch = async (url, options) => {
      const urlStr = url.toString();
      const body = JSON.parse(options?.body as string);
      calls.push({ url: urlStr, body });

      if (urlStr.endsWith("/accounts")) {
        return new Response(JSON.stringify({
          account: { id: "acc_123" }
        }), { status: 200 });
      } else if (urlStr.endsWith("/contacts")) {
        return new Response(JSON.stringify({
          contact: { id: "con_123" }
        }), { status: 200 });
      }
      return new Response(JSON.stringify({}), { status: 404 });
    };

    const result = await apolloSink.handle({
      empresa: "Test Company",
      nombre: "Test User",
      email: "test@company.com",
      telefono: "12345678",
      tipoConsulta: "cotizacion",
      mensaje: "Hello Apollo",
      agendarReunion: false,
    });

    assert.equal(result.ok, true);
    assert.equal(calls.length, 2);
    assert.equal(calls[0].url, "https://api.apollo.io/v1/accounts");
    assert.equal(calls[0].body.name, "Test Company");
    assert.equal(calls[1].url, "https://api.apollo.io/v1/contacts");
    assert.equal(calls[1].body.first_name, "Test");
    assert.equal(calls[1].body.account_id, "acc_123");
  } finally {
    global.fetch = originalFetch;
    process.env.APOLLO_API_KEY = originalEnv;
  }
});
