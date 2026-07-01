import assert from "node:assert/strict";
import test from "node:test";
import { mapAirProduct, mapAirProducts } from "../lib/integrations/air/mapper.ts";

test("mapea el shape esperado en español", () => {
  const p = mapAirProduct({
    codiart: "214402",
    descripcion: "Bomba centrífuga 1HP",
    rubro: "Bombas",
    grupo: "Centrífugas",
    categoria: "Riego",
    precio: "98.500,50",
    disponible: "134",
    fisico: "156",
    entrante: "40",
    estado: "1",
    fecha_mod: "2026-06-30",
  });
  assert.ok(p);
  assert.equal(p!.codiart, "214402");
  assert.equal(p!.name, "Bomba centrífuga 1HP");
  assert.equal(p!.rubro, "Bombas");
  assert.equal(p!.price, 98500.5);
  assert.equal(p!.stockDisp, 134);
  assert.equal(p!.stockFisico, 156);
  assert.equal(p!.stockEntrante, 40);
  assert.equal(p!.active, true);
  assert.ok(p!.airUpdatedAt instanceof Date);
});

test("tolera variantes de nombres (inglés/camel) y precio con punto", () => {
  const p = mapAirProduct({
    codigo: "A1",
    name: "Widget",
    price: 1234.56,
    stock: 7,
    status: "activo",
  });
  assert.equal(p!.codiart, "A1");
  assert.equal(p!.name, "Widget");
  assert.equal(p!.price, 1234.56);
  // sin D/F/E, el stock genérico cae en disponible
  assert.equal(p!.stockDisp, 7);
  assert.equal(p!.stockFisico, 0);
});

test("devuelve null sin código", () => {
  assert.equal(mapAirProduct({ descripcion: "sin codigo" }), null);
  assert.equal(mapAirProduct(null), null);
  assert.equal(mapAirProduct("texto"), null);
});

test("usa el código como nombre si falta descripción", () => {
  const p = mapAirProduct({ codiart: "X9" });
  assert.equal(p!.name, "X9");
  assert.equal(p!.price, null);
  assert.equal(p!.stockDisp, 0);
});

test("estado de baja marca inactivo", () => {
  assert.equal(mapAirProduct({ codiart: "1", estado: "baja" })!.active, false);
  assert.equal(mapAirProduct({ codiart: "2", activo: "0" })!.active, false);
  assert.equal(mapAirProduct({ codiart: "3", estado: "A" })!.active, true);
});

test("mapAirProducts descarta items inválidos", () => {
  const rows = [{ codiart: "1", descripcion: "ok" }, { sinCodigo: true }, null, { codigo: "2" }];
  const out = mapAirProducts(rows);
  assert.equal(out.length, 2);
  assert.deepEqual(out.map((p) => p.codiart), ["1", "2"]);
});

test("precio es-AR '1.234.567,89' se parsea bien", () => {
  const p = mapAirProduct({ codiart: "1", precio: "1.234.567,89" });
  assert.equal(p!.price, 1234567.89);
});
