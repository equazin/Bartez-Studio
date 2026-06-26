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

export const DELIVERY_NOTE_STATUSES = ["issued", "cancelled"] as const;

export const deliveryNoteLineSchema = z.object({
  productId: z.string().trim().min(1).max(40).nullish().transform((v) => v || null),
  description: z.string().trim().min(1).max(500),
  quantity: decimalString,
});

export const deliveryNoteCreateSchema = z.object({
  pointOfSale: z.number().int().positive().default(1),
  accountId: z.string().trim().min(1).max(40).nullish().transform((v) => v || null),
  orderId: z.string().trim().min(1).max(40).nullish().transform((v) => v || null),
  receiverName: z.string().trim().min(1).max(200),
  receiverTaxId: nullableTrimmed(20),
  receiverAddress: nullableTrimmed(300),
  issueDate: z.coerce.date().optional(),
  notes: nullableTrimmed(4000),
  lines: z.array(deliveryNoteLineSchema).min(1, "El remito necesita al menos una linea"),
});

export type DeliveryNoteCreate = z.infer<typeof deliveryNoteCreateSchema>;
