"use client";

import { useEffect, useState } from "react";

interface PdfQuote {
  id: string;
  number: string;
  status: string;
  currency: string;
  issueDate: Date | string;
  validUntil: Date | string | null;
  notes: string | null;
  terms: string | null;
  subtotal: { toString(): string };
  discountTotal: { toString(): string };
  taxTotal: { toString(): string };
  total: { toString(): string };
  account: {
    name: string;
    taxId: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
  } | null;
  owner: { id: string; name: string; email: string } | null;
  lines: Array<{
    id: string;
    description: string;
    quantity: { toString(): string };
    unitPrice: { toString(): string };
    discountPct: { toString(): string };
    taxRate: { toString(): string };
    lineTotal: { toString(): string };
    product: { sku: string | null; name: string; unit: string } | null;
  }>;
}

const fmt = (v: { toString(): string }) => Number(v.toString()).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtQty = (v: { toString(): string }) => Number(v.toString()).toLocaleString("es-AR", { maximumFractionDigits: 4 });
const fmtDate = (d: Date | string) => new Date(d).toLocaleDateString("es-AR");

type DesktopPrinter = {
  name?: string;
  displayName?: string;
  isDefault?: boolean;
};

function isDesktopPrinter(value: unknown): value is DesktopPrinter {
  return Boolean(value && typeof value === "object" && "name" in value);
}

function printQuote(options?: { silent?: boolean; deviceName?: string }) {
  if (window.bartezDesktop?.isDesktop) {
    void window.bartezDesktop.print({
      silent: Boolean(options?.silent),
      ...(options?.deviceName ? { deviceName: options.deviceName } : {}),
    });
    return;
  }
  window.print();
}

/**
 * Render print-friendly del presupuesto. CSS @media print oculta el botón
 * de "Imprimir" y ajusta márgenes para A4.
 */
export function QuotePdfView({ quote }: { quote: PdfQuote }) {
  const [printers, setPrinters] = useState<DesktopPrinter[]>([]);
  const [selectedPrinter, setSelectedPrinter] = useState("");
  const [silentPrint, setSilentPrint] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (!window.bartezDesktop?.isDesktop) return;
    setIsDesktop(true);
    let active = true;
    window.bartezDesktop.listPrinters().then((list) => {
      if (!active) return;
      const parsed = list.filter(isDesktopPrinter);
      setPrinters(parsed);
      setSelectedPrinter(parsed.find((printer) => printer.isDefault)?.name ?? parsed[0]?.name ?? "");
    }).catch(() => {});
    return () => { active = false; };
  }, []);

  // Disparar print dialog si el usuario llega con ?print=1
  useEffect(() => {
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("print") === "1") {
      const t = setTimeout(printQuote, 400);
      return () => clearTimeout(t);
    }
  }, []);

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
          @page { size: A4; margin: 14mm; }
        }
        .pdf-shell { font-family: ui-sans-serif, system-ui, -apple-system; color: #11142a; }
      `}</style>

      <div className="no-print mx-auto flex max-w-[820px] items-center justify-between gap-3 px-6 py-3 text-[13px]">
        <span className="font-bold">Vista de impresión — {quote.number}</span>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {isDesktop && printers.length > 0 && (
            <>
              <select
                value={selectedPrinter}
                onChange={(event) => setSelectedPrinter(event.target.value)}
                className="h-8 max-w-[220px] rounded-md border border-slate-300 bg-white px-2 text-[12px] font-semibold"
                aria-label="Impresora"
              >
                {printers.map((printer) => (
                  <option key={printer.name} value={printer.name}>
                    {printer.displayName || printer.name}{printer.isDefault ? " (default)" : ""}
                  </option>
                ))}
              </select>
              <label className="flex h-8 items-center gap-1.5 rounded-md border border-slate-300 bg-white px-2 text-[12px] font-semibold">
                <input type="checkbox" checked={silentPrint} onChange={(event) => setSilentPrint(event.target.checked)} />
                Sin diálogo
              </label>
            </>
          )}
          <button
            onClick={() => printQuote({ silent: silentPrint, deviceName: selectedPrinter })}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 font-bold hover:bg-slate-50"
          >
            Imprimir / Guardar PDF
          </button>
        </div>
      </div>

      <div className="pdf-shell mx-auto max-w-[820px] bg-white px-10 py-12">
        {/* Encabezado */}
        <div className="flex items-start justify-between border-b border-slate-300 pb-6">
          <div>
            <p className="font-display text-[24px] font-bold tracking-[-0.03em]">Bartez Tecnología</p>
            <p className="mt-1 text-[12px] text-slate-600">Soluciones tecnológicas para gastronomía y retail</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">Presupuesto</p>
            <p className="mt-1 font-mono text-[18px] font-bold">{quote.number}</p>
            <p className="mt-1 text-[12px] text-slate-600">Emisión: {fmtDate(quote.issueDate)}</p>
            {quote.validUntil && <p className="text-[12px] text-slate-600">Vence: {fmtDate(quote.validUntil)}</p>}
          </div>
        </div>

        {/* Datos del cliente */}
        {quote.account && (
          <div className="mt-6 grid grid-cols-2 gap-6 text-[12.5px]">
            <div>
              <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-slate-500">Cliente</p>
              <p className="mt-1 font-bold text-slate-950">{quote.account.name}</p>
              {quote.account.taxId && <p className="text-slate-600">CUIT {quote.account.taxId}</p>}
              {quote.account.address && <p className="text-slate-600">{quote.account.address}{quote.account.city ? `, ${quote.account.city}` : ""}</p>}
              {quote.account.email && <p className="text-slate-600">{quote.account.email}</p>}
              {quote.account.phone && <p className="text-slate-600">{quote.account.phone}</p>}
            </div>
            {quote.owner && (
              <div>
                <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-slate-500">Asesor</p>
                <p className="mt-1 font-bold text-slate-950">{quote.owner.name}</p>
                <p className="text-slate-600">{quote.owner.email}</p>
              </div>
            )}
          </div>
        )}

        {/* Líneas */}
        <table className="mt-8 w-full border-collapse text-[12.5px]">
          <thead>
            <tr className="border-b border-slate-300 bg-slate-50 text-left text-[10.5px] font-bold uppercase tracking-[0.1em] text-slate-700">
              <th className="px-3 py-2">Descripción</th>
              <th className="px-3 py-2 text-right">Cant.</th>
              <th className="px-3 py-2 text-right">Precio</th>
              <th className="px-3 py-2 text-right">Desc.</th>
              <th className="px-3 py-2 text-right">IVA</th>
              <th className="px-3 py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {quote.lines.map((line) => (
              <tr key={line.id} className="border-b border-slate-200">
                <td className="px-3 py-2.5">
                  <p className="font-bold text-slate-950">{line.description}</p>
                  {line.product?.sku && <p className="text-[10.5px] text-slate-500">SKU {line.product.sku}</p>}
                </td>
                <td className="px-3 py-2.5 text-right">{fmtQty(line.quantity)}</td>
                <td className="px-3 py-2.5 text-right">{fmt(line.unitPrice)}</td>
                <td className="px-3 py-2.5 text-right">{Number(line.discountPct.toString())}%</td>
                <td className="px-3 py-2.5 text-right">{Number(line.taxRate.toString())}%</td>
                <td className="px-3 py-2.5 text-right font-bold">{quote.currency} {fmt(line.lineTotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totales */}
        <div className="mt-6 flex justify-end">
          <div className="w-72 text-[12.5px]">
            <div className="flex justify-between py-1"><span className="text-slate-600">Subtotal</span><span className="font-bold">{quote.currency} {fmt(quote.subtotal)}</span></div>
            {Number(quote.discountTotal.toString()) > 0 && (
              <div className="flex justify-between py-1"><span className="text-slate-600">Descuentos</span><span className="font-bold">- {quote.currency} {fmt(quote.discountTotal)}</span></div>
            )}
            <div className="flex justify-between py-1"><span className="text-slate-600">IVA</span><span className="font-bold">{quote.currency} {fmt(quote.taxTotal)}</span></div>
            <div className="mt-2 flex justify-between border-t-2 border-slate-900 pt-2 text-[15px]">
              <span className="font-bold">Total</span>
              <span className="font-display font-bold">{quote.currency} {fmt(quote.total)}</span>
            </div>
          </div>
        </div>

        {/* Notas + términos */}
        {(quote.notes || quote.terms) && (
          <div className="mt-10 grid grid-cols-1 gap-6 border-t border-slate-300 pt-6 sm:grid-cols-2">
            {quote.notes && (
              <div>
                <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-slate-500">Notas</p>
                <p className="mt-1 whitespace-pre-wrap text-[12px] text-slate-700">{quote.notes}</p>
              </div>
            )}
            {quote.terms && (
              <div>
                <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-slate-500">Términos y condiciones</p>
                <p className="mt-1 whitespace-pre-wrap text-[12px] text-slate-700">{quote.terms}</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-12 text-center text-[10px] text-slate-500">Generado por Sistema Bartez</div>
      </div>
    </>
  );
}
