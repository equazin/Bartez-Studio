import { z } from "zod";

const nullableTrimmed = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .nullish()
    .transform((value) => (value && value.length > 0 ? value : null));

export const SERIAL_STATUSES = ["in_stock", "delivered", "returned", "scrapped"] as const;
export type SerialStatus = (typeof SERIAL_STATUSES)[number];

export const warrantyTermCreateSchema = z.object({
  productId: z.string().trim().min(1).max(40),
  durationDays: z.coerce.number().int().min(0).max(36500).default(365),
  coverage: nullableTrimmed(2000),
  exclusions: nullableTrimmed(2000),
  active: z.boolean().default(true),
});
export const warrantyTermUpdateSchema = warrantyTermCreateSchema.partial();
export type WarrantyTermCreate = z.infer<typeof warrantyTermCreateSchema>;

export const serialNumberCreateSchema = z.object({
  productId: z.string().trim().min(1).max(40),
  serial: z.string().trim().min(1).max(120),
  accountId: z.string().trim().min(1).max(40).nullish().transform((value) => value || null),
  deliveredAt: z.coerce.date().nullish(),
  warrantyUntil: z.coerce.date().nullish(),
  status: z.enum(SERIAL_STATUSES).default("in_stock"),
  notes: nullableTrimmed(2000),
  orderLineId: z.string().trim().min(1).max(40).nullish().transform((value) => value || null),
  invoiceId: z.string().trim().min(1).max(40).nullish().transform((value) => value || null),
});
export type SerialNumberCreate = z.infer<typeof serialNumberCreateSchema>;

export const serialNumberUpdateSchema = serialNumberCreateSchema.partial();
