/**
 * Catálogo AFIP usado por el módulo de facturación.
 *
 * Sólo incluyo los códigos necesarios para empezar (facturas A/B/C,
 * notas de crédito y débito) — se pueden agregar más a medida que
 * aparezcan operaciones nuevas.
 */

export interface AfipDocType {
  code: number;
  label: string;
  short: string; // FCA, FCB, NCA…
  isCreditNote: boolean;
  isDebitNote: boolean;
  letter: "A" | "B" | "C";
}

export const AFIP_DOC_TYPES: readonly AfipDocType[] = [
  { code: 1, short: "FCA", label: "Factura A", letter: "A", isCreditNote: false, isDebitNote: false },
  { code: 2, short: "NDA", label: "Nota de Débito A", letter: "A", isCreditNote: false, isDebitNote: true },
  { code: 3, short: "NCA", label: "Nota de Crédito A", letter: "A", isCreditNote: true, isDebitNote: false },
  { code: 6, short: "FCB", label: "Factura B", letter: "B", isCreditNote: false, isDebitNote: false },
  { code: 7, short: "NDB", label: "Nota de Débito B", letter: "B", isCreditNote: false, isDebitNote: true },
  { code: 8, short: "NCB", label: "Nota de Crédito B", letter: "B", isCreditNote: true, isDebitNote: false },
  { code: 11, short: "FCC", label: "Factura C", letter: "C", isCreditNote: false, isDebitNote: false },
  { code: 12, short: "NDC", label: "Nota de Débito C", letter: "C", isCreditNote: false, isDebitNote: true },
  { code: 13, short: "NCC", label: "Nota de Crédito C", letter: "C", isCreditNote: true, isDebitNote: false },
];

/** Documento del receptor según AFIP. */
export const AFIP_RECEIVER_DOC_TYPES = {
  CUIT: 80,
  CUIL: 86,
  DNI: 96,
  CF: 99, // Consumidor final
} as const;

/** Códigos de IVA en AFIP. */
export const AFIP_IVA_CODES: Record<string, number> = {
  "0": 3, // 0%
  "10.5": 4,
  "21": 5,
  "27": 6,
};

export function findDocType(code: number): AfipDocType | undefined {
  return AFIP_DOC_TYPES.find((d) => d.code === code);
}

export function shortDocCode(code: number): string {
  return findDocType(code)?.short ?? `CBT${code}`;
}
