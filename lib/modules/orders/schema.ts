import { z } from "zod";
import { CURRENCIES } from "../catalog/schema.ts";

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

export const ORDER_STATUSES = ["draft", "confirmed", "in_preparation", "delivered", "cancelled"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const orderLineSchema = z.object({
  productId: z.string().trim().min(1).max(40).nullish().transform((v) => v || null),
  description: z.string().trim().min(1).max(500),
  quantity: decimalString.refine((v) => v > 0, { message: "cantidad debe ser > 0" }),
  unitPrice: decimalString,
  discountPct: decimalString.refine((v) => v <= 100).default(0),
  taxRate: decimalString.refine((v) => v <= 100).default(21),
});

export const orderCreateSchema = z.object({
  accountId: z.string().trim().min(1).max(40).nullish().transform((v) => v || null),
  quoteId: z.string().trim().min(1).max(40).nullish().transform((v) => v || null),
  ownerId: z.string().trim().min(1).max(40).nullish().transform((v) => v || null),
  warehouseId: z.string().trim().min(1).max(40).nullish().transform((v) => v || null),
  currency: z.enum(CURRENCIES).default("USD"),
  orderDate: z.coerce.date().optional(),
  expectedDate: z.coerce.date().nullish(),
  notes: nullableTrimmed(4000),
  lines: z.array(orderLineSchema).min(1, "El pedido necesita al menos una línea"),
});
export type OrderCreate = z.infer<typeof orderCreateSchema>;

export const orderUpdateSchema = orderCreateSchema.partial().extend({
  lines: z.array(orderLineSchema).optional(),
});

export const orderStatusSchema = z.object({
  status: z.enum(ORDER_STATUSES),
});

export const fromQuoteSchema = z.object({
  warehouseId: z.string().trim().min(1).max(40).nullish().transform((v) => v || null),
});
