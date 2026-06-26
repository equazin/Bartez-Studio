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
  .refine((v) => !Number.isNaN(v) && v > 0, { message: "debe ser > 0" });

export const PAYMENT_METHODS = ["cash", "transfer", "card", "mercadopago", "other"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const receiptAllocationSchema = z.object({
  invoiceId: z.string().trim().min(1).max(40),
  amount: decimalString,
});

export const receiptCreateSchema = z.object({
  accountId: z.string().trim().min(1).max(40),
  receivedAt: z.coerce.date().optional(),
  method: z.enum(PAYMENT_METHODS).default("transfer"),
  reference: nullableTrimmed(120),
  amount: decimalString,
  currency: z.enum(["ARS", "USD"]).default("ARS"),
  notes: nullableTrimmed(4000),
  allocations: z.array(receiptAllocationSchema).default([]),
});
export type ReceiptCreate = z.infer<typeof receiptCreateSchema>;
