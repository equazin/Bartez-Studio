import assert from "node:assert/strict";
import test from "node:test";
import { POST } from "../app/api/lead/route.ts";

// Cubre los tres formularios públicos que ahora persisten leads antes de
// abrir WhatsApp. Si estos payloads dejan de ser válidos, el schema del CRM
// cambió y hay que revisar los tres componentes al mismo tiempo.

function payloadContacto() {
  return {
    empresa: "Test Contacto",
    nombre: "Juan Perez",
    email: "juan@empresa.test",
    telefono: "3415551234",
    tipoConsulta: "cotizacion",
    mensaje: "Consulta desde la pagina de contacto",
    origen: "web-contacto",
  };
}

function payloadRevendedores() {
  return {
    empresa: "Distribuidora XYZ",
    nombre: "Ana Gomez",
    email: "ana@distri.test",
    telefono: "3415554321",
    tipoConsulta: "cuenta",
    mensaje: "Tipo de canal: Tienda de informática\nVolumen estimado: Hasta 10 unidades",
    origen: "web-revendedores",
  };
}

function payloadBarpos() {
  return {
    empresa: "Rosario, Santa Fe",
    nombre: "Pedro Lopez",
    email: "pedro@comercio.test",
    telefono: "3415559999",
    tipoConsulta: "cotizacion",
    mensaje: "Perfil: Quiero equipar mi negocio\nRubro: Panadería\nCantidad estimada: 1 punto de venta",
    origen: "web-barpos",
  };
}

async function callLeadApi(body: unknown, ip: string): Promise<{ status: number; ok: boolean }> {
  const originalFetch = global.fetch;
  const originalProvider = process.env.MAIL_PROVIDER;
  const originalStore = process.env.LEAD_STORE_URL;
  process.env.MAIL_PROVIDER = "";
  process.env.LEAD_STORE_URL = "http://mock-store";
  try {
    global.fetch = async () => new Response(JSON.stringify({ ok: true }), { status: 200 });
    const req = new Request("http://localhost/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
      body: JSON.stringify(body),
    });
    const res = await POST(req);
    const parsed = (await res.json()) as { ok: boolean };
    return { status: res.status, ok: parsed.ok };
  } finally {
    global.fetch = originalFetch;
    process.env.MAIL_PROVIDER = originalProvider;
    process.env.LEAD_STORE_URL = originalStore;
  }
}

test("POST /api/lead - payload del formulario de contacto es válido", async () => {
  const { status, ok } = await callLeadApi(payloadContacto(), "10.0.0.1");
  assert.equal(status, 200);
  assert.equal(ok, true);
});

test("POST /api/lead - payload del formulario de revendedores es válido", async () => {
  const { status, ok } = await callLeadApi(payloadRevendedores(), "10.0.0.2");
  assert.equal(status, 200);
  assert.equal(ok, true);
});

test("POST /api/lead - payload del formulario de BarPOS es válido", async () => {
  const { status, ok } = await callLeadApi(payloadBarpos(), "10.0.0.3");
  assert.equal(status, 200);
  assert.equal(ok, true);
});

test("POST /api/lead - falta email requerido → 422 (bloquea leads sin canal de contacto)", async () => {
  const { email: _omit, ...sinEmail } = payloadContacto();
  void _omit;
  const { status, ok } = await callLeadApi(sinEmail, "10.0.0.4");
  assert.equal(status, 422);
  assert.equal(ok, false);
});

test("POST /api/lead - honeypot 'website' con contenido → 200 silencioso sin procesar", async () => {
  const { status, ok } = await callLeadApi({ ...payloadContacto(), website: "http://spam.example" }, "10.0.0.5");
  assert.equal(status, 200);
  assert.equal(ok, true);
});
