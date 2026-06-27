import assert from "node:assert/strict";
import test from "node:test";
import { buildAlertsText, buildAlertsHtml } from "../lib/modules/alerts/notify-service.ts";

const sample = {
  overdueInvoices: [
    { id: "1", number: "FCA-0001-00000001", receiverName: "Cliente SA", currency: "ARS", total: 1000, pending: 500, paymentDueDate: null, daysOverdue: 12 },
  ],
  lowStock: [
    { productId: "p1", productName: "Lector códigos", sku: "LC-1", warehouseName: "Central", quantity: 2, reorderPoint: 5 },
  ],
  pendingApprovals: [
    { id: "po1", number: "OC-0001-00000001", supplierName: "Prov SRL", currency: "ARS", total: 90000, issueDate: "2026-06-20" },
  ],
  counts: { overdueInvoices: 1, lowStock: 1, pendingApprovals: 1, total: 3 },
};

test("buildAlertsText incluye total y las tres secciones", () => {
  const text = buildAlertsText(sample);
  assert.ok(text.includes("(3)"), "muestra el total");
  assert.ok(text.includes("FCA-0001-00000001"), "incluye factura vencida");
  assert.ok(text.includes("Lector códigos"), "incluye stock bajo");
  assert.ok(text.includes("OC-0001-00000001"), "incluye OC a aprobar");
  assert.ok(text.includes("12d"), "muestra días de mora");
});

test("buildAlertsHtml es HTML con el total", () => {
  const html = buildAlertsHtml(sample);
  assert.ok(html.includes("<h2"), "es HTML");
  assert.ok(html.includes("(3)"));
  assert.ok(html.includes("Cliente SA"));
});

test("buildAlertsText omite secciones vacías", () => {
  const text = buildAlertsText({ ...sample, lowStock: [], pendingApprovals: [], counts: { overdueInvoices: 1, lowStock: 0, pendingApprovals: 0, total: 1 } });
  assert.ok(text.includes("Cobranzas vencidas"));
  assert.ok(!text.includes("Stock bajo"));
  assert.ok(!text.includes("OC a aprobar"));
});
