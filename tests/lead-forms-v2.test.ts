import assert from "node:assert/strict";
import test from "node:test";
import { POST } from "../app/api/lead/route.ts";

// Cubre los flujos NUEVOS de captura de leads sumados en la serie de
// tandas de expansión de servicios: el chooser de /contacto con
// ruteo por intención, /rfq con presets ?origen= y /garantias-rma/nuevo.
//
// Si estos payloads dejan de ser válidos contra /api/lead, hay que
// revisar los componentes ContactWhatsAppForm, app/rfq/page.tsx y
// RmaForm al mismo tiempo — comparten el mismo schema.

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

// --- Contact chooser: intención "puntual" ---
function payloadContactoPuntual() {
  return {
    empresa: "Empresa Test SRL",
    nombre: "María López",
    email: "maria@empresa.test",
    telefono: "3416000000",
    tipoConsulta: "cotizacion" as const,
    mensaje: "Necesito cotizar 3 notebooks corporativas.",
    origen: "web-contacto-puntual",
  };
}

// --- Contact chooser: intención "otros" (revendedor / rma / educación) ---
function payloadContactoOtros() {
  return {
    empresa: "Instituto Educativo",
    nombre: "Roberto Suárez",
    email: "roberto@instituto.test",
    telefono: "3416000001",
    tipoConsulta: "asesoramiento" as const,
    mensaje: "Consulta sobre equipamiento para aula.",
    origen: "web-contacto-otros",
  };
}

// --- RFQ con preset ?origen=gobierno ---
function payloadRfqGobierno() {
  return {
    empresa: "Municipalidad Test",
    nombre: "Fernando Ríos",
    email: "compras@muni.test",
    telefono: "3416001111",
    tipoConsulta: "cotizacion" as const,
    mensaje: [
      "Tipo de cotización: gobierno",
      "CUIT: 30-99999999-9",
      "Provincia / localidad: Rosario, Santa Fe",
      "Lugar de entrega: Palacio Municipal",
      "Volumen requerido: 31-100",
      "Plazo esperado: 30 días",
      "Condición de pago preferida: A convenir",
      "Sustituciones: Consultar antes de reemplazar",
      "Requiere instalación: Sí, instalación completa (llave en mano)",
      "",
      "Detalle técnico:",
      "30 notebooks ThinkPad E14 según pliego adjunto.",
    ].join("\n"),
    escala: "31-100",
    urgencia: "30 días",
    origen: "web-rfq-gobierno",
  };
}

// --- RFQ con preset ?origen=proyecto ---
function payloadRfqProyecto() {
  return {
    empresa: "Corporativo Test SA",
    nombre: "Sandra Ferreyra",
    email: "s.ferreyra@corp.test",
    telefono: "3416002222",
    tipoConsulta: "cotizacion" as const,
    mensaje: [
      "Tipo de cotización: proyecto",
      "CUIT: 30-11111111-1",
      "Volumen requerido: 10-30",
      "Plazo esperado: 3 meses",
      "Requiere instalación: Sí, solo puesta en marcha / configuración",
      "",
      "Detalle técnico:",
      "Renovación de servidores rack + switches core.",
    ].join("\n"),
    escala: "10-30",
    urgencia: "3 meses",
    origen: "web-rfq-proyecto",
  };
}

// --- RFQ con preset ?origen=cctv ---
function payloadRfqCctv() {
  return {
    empresa: "Club Recreativo Test",
    nombre: "Diego Colombres",
    email: "diego@club.test",
    telefono: "3416003333",
    tipoConsulta: "cotizacion" as const,
    mensaje: "Tipo de cotización: cctv\n\nDetalle técnico: 12 cámaras exteriores + NVR + cableado.",
    escala: "10-30",
    urgencia: "30 días",
    origen: "web-rfq-cctv",
  };
}

// --- RMA form (nuevo flujo dedicado) ---
function payloadRma() {
  return {
    empresa: "Empresa Con Equipo",
    nombre: "Laura Martínez",
    email: "l.martinez@empresa.test",
    telefono: "3416004444",
    tipoConsulta: "asesoramiento" as const,
    mensaje: [
      "Origen: formulario /garantias-rma/nuevo",
      "Caso: RMA-20260815-A9F3",
      "Contacto: Laura Martínez",
      "Empresa: Empresa Con Equipo",
      "Email: l.martinez@empresa.test",
      "Teléfono: 3416004444",
      "",
      "Equipo:",
      "- Fabricante: Lenovo",
      "- Modelo: ThinkPad T14 Gen 3",
      "- Número de serie: PF3ABC1D",
      "- Fecha de compra: 2024-05-10",
      "- Factura: A-0001-00012345",
      "",
      "Síntoma:",
      "Pantalla no enciende al arrancar. Se escuchan los ventiladores.",
      "",
      "Intentos previos:",
      "Reinicio, cambio de cargador, reset EC.",
    ].join("\n"),
    necesidad: "RMA Lenovo ThinkPad T14 Gen 3",
    escala: "S/N: PF3ABC1D",
    urgencia: "RMA",
    origen: "web-rma",
  };
}

test("POST /api/lead - contact chooser 'puntual' es válido", async () => {
  const { status, ok } = await callLeadApi(payloadContactoPuntual(), "10.0.1.1");
  assert.equal(status, 200);
  assert.equal(ok, true);
});

test("POST /api/lead - contact chooser 'otros' es válido", async () => {
  const { status, ok } = await callLeadApi(payloadContactoOtros(), "10.0.1.2");
  assert.equal(status, 200);
  assert.equal(ok, true);
});

test("POST /api/lead - RFQ preset gobierno es válido", async () => {
  const { status, ok } = await callLeadApi(payloadRfqGobierno(), "10.0.1.3");
  assert.equal(status, 200);
  assert.equal(ok, true);
});

test("POST /api/lead - RFQ preset proyecto es válido", async () => {
  const { status, ok } = await callLeadApi(payloadRfqProyecto(), "10.0.1.4");
  assert.equal(status, 200);
  assert.equal(ok, true);
});

test("POST /api/lead - RFQ preset cctv es válido", async () => {
  const { status, ok } = await callLeadApi(payloadRfqCctv(), "10.0.1.5");
  assert.equal(status, 200);
  assert.equal(ok, true);
});

test("POST /api/lead - RMA form (con caso ID en mensaje) es válido", async () => {
  const { status, ok } = await callLeadApi(payloadRma(), "10.0.1.6");
  assert.equal(status, 200);
  assert.equal(ok, true);
});

test("POST /api/lead - origen web-rfq-gobierno respeta el límite de 40 chars", async () => {
  // El schema fija origen.max(40). Los orígenes que generamos deben caber.
  for (const origen of ["web-contacto-puntual", "web-contacto-otros", "web-rfq-gobierno", "web-rfq-proyecto", "web-rfq-cctv", "web-rma"]) {
    assert.ok(origen.length <= 40, `origen '${origen}' excede 40 chars`);
  }
});
