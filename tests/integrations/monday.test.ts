import assert from "node:assert/strict";
import test from "node:test";
import { mondaySink } from "../../lib/integrations/monday.ts";

test("mondaySink handle succeeds on successful API response", async () => {
  const originalFetch = global.fetch;
  const originalEnv = process.env.MONDAY_API_TOKEN;
  process.env.MONDAY_API_TOKEN = "mock-token";

  try {
    global.fetch = async (url, options) => {
      assert.equal(url.toString(), "https://api.monday.com/v2");
      const body = JSON.parse(options?.body as string);
      assert.ok(body.query.includes("create_item"));
      return new Response(JSON.stringify({
        data: {
          create_item: { id: "12345" }
        }
      }), { status: 200 });
    };

    const result = await mondaySink.handle({
      empresa: "Test Company",
      nombre: "Test User",
      email: "test@company.com",
      telefono: "12345678",
      tipoConsulta: "cotizacion",
      mensaje: "Hello Monday",
      agendarReunion: false,
    });

    assert.equal(result.ok, true);
    assert.match(result.detail || "", /12345/);
  } finally {
    global.fetch = originalFetch;
    process.env.MONDAY_API_TOKEN = originalEnv;
  }
});
