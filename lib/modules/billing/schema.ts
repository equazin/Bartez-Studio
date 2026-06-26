import { z } from "zod";

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

const positive = decimalString.refine((v) => v > 0, { message: "debe ser > 0" });

export const invoiceLineSchema = z.object({
  productId: z.string().trim().min(1).max(40).nullish().transform((v) => v || null),
  description: z.string().trim().min(1).max(500),
  quantity: positive,
  unitPrice: decimalString,
  discountPct: decimalString.refine((v) => v <= 100).default(0),
  taxRate: decimalString.refine((v) => v <= 100).default(21),
});
export type InvoiceLineInput = z.infer<typeof invoiceLineSchema>;

export const invoiceCreateSchema = z.object({
  docTypeCode: z.number().int().positive(),
  pointOfSale: z.number().int().positive().default(1),
  concept: z.union([z.literal(1), z.literal(2), z.literal(3)]).default(1),
  accountId: z.string().trim().min(1).max(40).nullish().transform((v) => v || null),
  orderId: z.string().trim().min(1).max(40).nullish().transform((v) => v || null),
  relatedInvoiceId: z.string().trim().min(1).max(40).nullish().transform((v) => v || null),
  receiverName: z.string().trim().min(1).max(200),
  receiverTaxId: nullableTrimmed(20),
  receiverDocType: z.number().int().nullish(),
  receiverAddress: nullableTrimmed(300),
  currency: z.enum(["PES", "DOL"]).default("PES"),
  exchangeRate: decimalString.default(1),
  issueDate: z.coerce.date().optional(),
  serviceFrom: z.coerce.date().nullish(),
  serviceTo: z.coerce.date().nullish(),
  paymentDueDate: z.coerce.date().nullish(),
  notes: nullableTrimmed(4000),
  lines: z.array(invoiceLineSchema).min(1, "El comprobante necesita al menos una línea"),
});
export type InvoiceCreate = z.infer<typeof invoiceCreateSchema>;
