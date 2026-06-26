import assert from "node:assert/strict";
import test from "node:test";
import { calcLine, calcQuote } from "../lib/modules/sales/calc.ts";

test("calcLine sin descuento ni impuesto", () => {
  const t = calcLine({ quantity: 2, unitPrice: 100 });
  assert.equal(t.lineSubtotal, 200);
  assert.equal(t.lineTax, 0);
  assert.equal(t.lineTotal, 200);
});

test("calcLine aplica descuento antes del impuesto", () => {
  // 1 * 1000 con 10% desc → 900, con 21% IVA → 189; total 1089
  const t = calcLine({ quantity: 1, unitPrice: 1000, discountPct: 10, taxRate: 21 });
  assert.equal(t.lineSubtotal, 900);
  assert.equal(t.lineTax, 189);
  assert.equal(t.lineTotal, 1089);
});

test("calcLine clampa descuento > 100", () => {
  const t = calcLine({ quantity: 1, unitPrice: 1000, discountPct: 150, taxRate: 21 });
  // descuento se trata como 100 → subtotal 0
  assert.equal(t.lineSubtotal, 0);
  assert.equal(t.lineTax, 0);
  assert.equal(t.lineTotal, 0);
});

test("calcLine clampa descuento negativo a 0", () => {
  const t = calcLine({ quantity: 1, unitPrice: 100, discountPct: -10, taxRate: 0 });
  assert.equal(t.lineSubtotal, 100);
});

test("calcLine maneja cantidad fraccionada", () => {
  // 1.5h * 80 = 120, 0% desc, 21% IVA → 25.20; total 145.20
  const t = calcLine({ quantity: 1.5, unitPrice: 80, taxRate: 21 });
  assert.equal(t.lineSubtotal, 120);
  assert.equal(t.lineTax, 25.2);
  assert.equal(t.lineTotal, 145.2);
});

test("calcQuote suma totales correctamente", () => {
  const { totals } = calcQuote([
    { quantity: 2, unitPrice: 100, taxRate: 21 }, // sub 200, IVA 42, total 242
    { quantity: 1, unitPrice: 500, discountPct: 10, taxRate: 21 }, // sub 450, IVA 94.50, total 544.50
  ]);
  assert.equal(totals.subtotal, 650);
  assert.equal(totals.discountTotal, 50); // 10% de 500
  assert.equal(totals.taxTotal, 136.5);
  assert.equal(totals.total, 786.5);
});

test("calcQuote con líneas exentas de IVA", () => {
  const { totals } = calcQuote([
    { quantity: 1, unitPrice: 1000, taxRate: 0 },
  ]);
  assert.equal(totals.subtotal, 1000);
  assert.equal(totals.taxTotal, 0);
  assert.equal(totals.total, 1000);
});

test("calcQuote con array vacío devuelve ceros", () => {
  const { totals, lines } = calcQuote([]);
  assert.equal(totals.subtotal, 0);
  assert.equal(totals.total, 0);
  assert.equal(lines.length, 0);
});

test("calcQuote suma de líneas iguala suma de lineTotal", () => {
  const drafts = [
    { quantity: 3, unitPrice: 33.33, discountPct: 5, taxRate: 21 },
    { quantity: 7, unitPrice: 17.5, taxRate: 10.5 },
  ];
  const { totals, lines } = calcQuote(drafts);
  const sum = lines.reduce((a, l) => a + l.lineTotal, 0);
  // Permitir 1 centavo por redondeo entre suma directa y total acumulado.
  assert.ok(Math.abs(sum - totals.total) < 0.02, `sum ${sum} vs total ${totals.total}`);
});
