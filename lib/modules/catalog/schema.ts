import { z } from "zod";

/**
 * Schemas Zod del módulo Catálogo (Fase 2).
 *
 * Convenciones (compartidas con CRM):
 * - Strings se hacen trim(); opcionales colapsan vacío a null.
 * - Decimales aceptan number o string y se normalizan a number.
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

export const PRODUCT_TYPES = ["good", "service"] as const;
export const PRODUCT_UNITS = ["unit", "hour", "month"] as const;
export const CURRENCIES = ["USD", "ARS", "EUR"] as const;
export type ProductType = (typeof PRODUCT_TYPES)[number];
export type Currency = (typeof CURRENCIES)[number];

export const productCreateSchema = z.object({
  sku: nullableTrimmed(60),
  name: z.string().trim().min(1).max(200),
  description: nullableTrimmed(2000),
  type: z.enum(PRODUCT_TYPES).default("good"),
  unit: z.enum(PRODUCT_UNITS).default("unit"),
  brand: nullableTrimmed(120),
  supplier: nullableTrimmed(120),
  stockTracked: z.boolean().default(false),
  active: z.boolean().default(true),
  taxRate: decimalString.default(21),
});
export const productUpdateSchema = productCreateSchema.partial();
export type ProductCreate = z.infer<typeof productCreateSchema>;
export type ProductUpdate = z.infer<typeof productUpdateSchema>;

export const priceListCreateSchema = z.object({
  name: z.string().trim().min(1).max(120),
  currency: z.enum(CURRENCIES).default("USD"),
  isDefault: z.boolean().default(false),
  active: z.boolean().default(true),
});
export const priceListUpdateSchema = priceListCreateSchema.partial();
export type PriceListCreate = z.infer<typeof priceListCreateSchema>;

export const priceListItemUpsertSchema = z.object({
  productId: z.string().trim().min(1).max(40),
  unitPrice: decimalString,
});
export type PriceListItemUpsert = z.infer<typeof priceListItemUpsertSchema>;
