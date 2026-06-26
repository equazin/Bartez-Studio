import { z } from "zod";
import { CURRENCIES } from "../catalog/schema.ts";

/**
 * Schemas Zod del módulo Ventas (Fase 2 — presupuestos).
 */

const nullableTrimmed = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .nullish()
    .transform((v) => (v && v.length > 0 ? v : null));

const decimalString = z
  .union([z.number(), z.string()])
  .transform((v) => (typeof v === "string" ? Number(v) : v))
  .refine((v) => !Number.isNaN(v) && v >= 0, { message: "valor inválido" });

export const QUOTE_STATUSES = ["draft", "sent", "accepted", "rejected", "expired"] as const;
export type QuoteStatus = (typeof QUOTE_STATUSES)[number];

export const quoteLineSchema = z.object({
  productId: z.string().trim().min(1).max(40).nullish().transform((v) => v || null),
  description: z.string().trim().min(1).max(500),
  quantity: decimalString.refine((v) => v > 0, { message: "cantidad debe ser > 0" }),
  unitPrice: decimalString,
  discountPct: decimalString.refine((v) => v <= 100, { message: "descuento 0-100%" }).default(0),
  taxRate: decimalString.refine((v) => v <= 100, { message: "alícuota 0-100%" }).default(21),
});
export type QuoteLineInput = z.infer<typeof quoteLineSchema>;

export const quoteCreateSchema = z.object({
  accountId: z.string().trim().min(1).max(40).nullish().transform((v) => v || null),
  opportunityId: z.string().trim().min(1).max(40).nullish().transform((v) => v || null),
  ownerId: z.string().trim().min(1).max(40).nullish().transform((v) => v || null),
  priceListId: z.string().trim().min(1).max(40).nullish().transform((v) => v || null),
  status: z.enum(QUOTE_STATUSES).default("draft"),
  currency: z.enum(CURRENCIES).default("USD"),
  issueDate: z.coerce.date().optional(),
  validUntil: z.coerce.date().nullish(),
  notes: nullableTrimmed(4000),
  terms: nullableTrimmed(4000),
  lines: z.array(quoteLineSchema).min(1, "El presupuesto necesita al menos una línea"),
});
export type QuoteCreate = z.infer<typeof quoteCreateSchema>;

export const quoteUpdateSchema = quoteCreateSchema.partial().extend({
  lines: z.array(quoteLineSchema).optional(),
});

export const quoteStatusSchema = z.object({
  status: z.enum(QUOTE_STATUSES),
});
