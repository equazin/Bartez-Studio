import assert from "node:assert/strict";
import test from "node:test";
import { ASSISTANT_INSTRUCTIONS, BARTEZ_KNOWLEDGE } from "../lib/ai/knowledge.ts";
import { leadSchema } from "../lib/schema.ts";

test("accepts a guided institutional consultation", () => {
  const result = leadSchema.safeParse({
    empresa: "Empresa SA",
    nombre: "Ada Lovelace",
    email: "ada@empresa.test",
    telefono: "3415551234",
    tipoConsulta: "asesoramiento",
    necesidad: "Optimizar redes e infraestructura",
    escala: "51 a 200 personas",
    urgencia: "Durante este mes",
    canalPreferido: "whatsapp",
    resumenIA: "La empresa necesita revisar conectividad y cobertura.",
    origen: "ai-assistant",
  });

  assert.equal(result.success, true);
});

test("assistant policy prevents ecommerce claims and unconfirmed commercial data", () => {
  assert.match(BARTEZ_KNOWLEDGE, /No hay catálogo, compra online, carrito, checkout/i);
  assert.match(ASSISTANT_INSTRUCTIONS, /Nunca inventes ni confirmes precios, stock/i);
  assert.match(ASSISTANT_INSTRUCTIONS, /usuario debe completar y confirmar/i);
});