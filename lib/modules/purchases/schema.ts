import { z } from "zod";

const nullableTrimmed = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .nullish()
    .transform((value) => (value && value.length > 0 ? value : null));

const decimalString = z
  .union([z.number(), z.string()])
  .transform((value) => (typeof value === "string" ? Number(value) : value))
  .refine((value) => !Number.isNaN(value) && value >= 0, { message: "valor invalido" });

const positiveDecimal = decimalString.refine((value) => value > 0, { message: "debe ser > 0" });

export const PURCHASE_ORDER_STATUSES = ["issued", "partially_received", "received", "cancelled"] as const;
export const PAYMENT_METHODS = ["cash", "transfer", "card", "mercadopago", "other"] as const;

export const supplierCreateSchema = z.object({
  name: z.string().trim().min(1).max(200),
  taxId: nullableTrimmed(20),
  email: z.string().trim().email().max(200).nullish().transform((value) => value || null),
  phone: nullableTrimmed(80),
  address: nullableTrimmed(300),
  city: nullableTrimmed(120),
  country: nullableTrimmed(120),
  paymentTerms: nullableTrimmed(200),
  notes: nullableTrimmed(4000),
  active: z.boolean().default(true),
});
export const supplierUpdateSchema = supplierCreateSchema.partial();
export type SupplierCreate = z.infer<typeof supplierCreateSchema>;

export const purchaseOrderLineSchema = z.object({
  productId: z.string().trim().min(1).max(40).nullish().transform((value) => value || null),
  description: z.string().trim().min(1).max(500),
  quantity: positiveDecimal,
  unitPrice: decimalString,
  discountPct: decimalString.refine((value) => value <= 100).default(0),
  taxRate: decimalString.refine((value) => value <= 100).default(21),
});

export const purchaseOrderCreateSchema = z.object({
  supplierId: z.string().trim().min(1).max(40),
  currency: z.enum(["ARS", "USD"]).default("ARS"),
  issueDate: z.coerce.date().optional(),
  expectedDate: z.coerce.date().nullish(),
  notes: nullableTrimmed(4000),
  lines: z.array(purchaseOrderLineSchema).min(1, "La orden necesita al menos una linea"),
});
export type PurchaseOrderCreate = z.infer<typeof purchaseOrderCreateSchema>;

export const receiveLineSchema = z.object({
  purchaseOrderLineId: z.string().trim().min(1).max(40),
  quantity: positiveDecimal,
});

export const goodsReceiptCreateSchema = z.object({
  purchaseOrderId: z.string().trim().min(1).max(40),
  warehouseId: z.string().trim().min(1).max(40),
  receivedAt: z.coerce.date().optional(),
  notes: nullableTrimmed(4000),
  lines: z.array(receiveLineSchema).min(1, "La recepcion necesita al menos una linea"),
});
export type GoodsReceiptCreate = z.infer<typeof goodsReceiptCreateSchema>;

export const supplierPaymentAllocationSchema = z.object({
  purchaseOrderId: z.string().trim().min(1).max(40),
  amount: positiveDecimal,
});

export const supplierPaymentCreateSchema = z.object({
  supplierId: z.string().trim().min(1).max(40),
  cashAccountId: z.string().trim().min(1).max(40).nullish().transform((value) => value || null),
  paidAt: z.coerce.date().optional(),
  method: z.enum(PAYMENT_METHODS).default("transfer"),
  reference: nullableTrimmed(120),
  amount: positiveDecimal,
  currency: z.enum(["ARS", "USD"]).default("ARS"),
  notes: nullableTrimmed(4000),
  allocations: z.array(supplierPaymentAllocationSchema).default([]),
});
export type SupplierPaymentCreate = z.infer<typeof supplierPaymentCreateSchema>;
