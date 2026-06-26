/**
 * Motor de cálculo de presupuestos (puro, sin DB).
 *
 * Reglas:
 *  - lineSubtotal = quantity * unitPrice * (1 - discountPct/100)
 *  - lineTax      = lineSubtotal * (taxRate/100)
 *  - lineTotal    = lineSubtotal + lineTax
 *  - subtotal     = Σ(lineSubtotal) sumando descuentos ya aplicados a la línea
 *  - discountTotal = Σ(quantity * unitPrice * discountPct/100) (lo descontado)
 *  - taxTotal     = Σ(lineTax)
 *  - total        = subtotal + taxTotal
 *
 * Todo redondea a 2 decimales con banker-safe (toFixed) en el límite.
 */

export interface QuoteLineDraft {
  quantity: number;
  unitPrice: number;
  discountPct?: number;
  taxRate?: number;
}

export interface QuoteLineTotals {
  lineSubtotal: number; // post-descuento, sin IVA
  lineTax: number;
  lineTotal: number; // post-descuento + IVA
}

export interface QuoteTotals {
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  total: number;
}

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function calcLine(line: QuoteLineDraft): QuoteLineTotals {
  const qty = Number(line.quantity) || 0;
  const price = Number(line.unitPrice) || 0;
  const disc = Math.max(0, Math.min(100, Number(line.discountPct ?? 0)));
  const tax = Math.max(0, Math.min(100, Number(line.taxRate ?? 0)));

  const gross = qty * price;
  const discounted = gross * (1 - disc / 100);
  const lineTax = discounted * (tax / 100);

  return {
    lineSubtotal: round2(discounted),
    lineTax: round2(lineTax),
    lineTotal: round2(discounted + lineTax),
  };
}

export function calcQuote(lines: QuoteLineDraft[]): {
  totals: QuoteTotals;
  lines: QuoteLineTotals[];
} {
  const computed = lines.map(calcLine);

  let subtotal = 0;
  let taxTotal = 0;
  let discountTotal = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const t = computed[i];
    subtotal += t.lineSubtotal;
    taxTotal += t.lineTax;

    const gross = (Number(line.quantity) || 0) * (Number(line.unitPrice) || 0);
    const disc = Math.max(0, Math.min(100, Number(line.discountPct ?? 0)));
    discountTotal += gross * (disc / 100);
  }

  const totals: QuoteTotals = {
    subtotal: round2(subtotal),
    discountTotal: round2(discountTotal),
    taxTotal: round2(taxTotal),
    total: round2(subtotal + taxTotal),
  };

  return { totals, lines: computed };
}
