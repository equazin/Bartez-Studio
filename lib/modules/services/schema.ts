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
  .refine((value) => !Number.isNaN(value) && value >= 0, { message: "valor inválido" });

export const WORK_ORDER_TYPES = ["install", "repair", "maintenance", "training"] as const;
export const WORK_ORDER_STATUSES = ["scheduled", "in_progress", "completed", "cancelled"] as const;
export const WORK_ORDER_PRIORITIES = ["low", "normal", "high", "urgent"] as const;
export const WORK_ORDER_ITEM_KINDS = ["part", "labor"] as const;

export type WorkOrderType = (typeof WORK_ORDER_TYPES)[number];
export type WorkOrderStatus = (typeof WORK_ORDER_STATUSES)[number];

export const workOrderItemSchema = z.object({
  kind: z.enum(WORK_ORDER_ITEM_KINDS).default("part"),
  productId: z.string().trim().min(1).max(40).nullish().transform((value) => value || null),
  description: z.string().trim().min(1).max(500),
  quantity: decimalString.refine((value) => value > 0, { message: "debe ser > 0" }),
  unitPrice: decimalString,
  billable: z.boolean().default(true),
  notes: nullableTrimmed(500),
});

export const workOrderCreateSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: nullableTrimmed(8000),
  type: z.enum(WORK_ORDER_TYPES).default("repair"),
  priority: z.enum(WORK_ORDER_PRIORITIES).default("normal"),
  accountId: z.string().trim().min(1).max(40).nullish().transform((value) => value || null),
  ticketId: z.string().trim().min(1).max(40).nullish().transform((value) => value || null),
  serialNumberId: z.string().trim().min(1).max(40).nullish().transform((value) => value || null),
  assignedToId: z.string().trim().min(1).max(40).nullish().transform((value) => value || null),
  scheduledFor: z.coerce.date().nullish(),
  items: z.array(workOrderItemSchema).default([]),
});
export const workOrderUpdateSchema = workOrderCreateSchema.partial();
export type WorkOrderCreate = z.infer<typeof workOrderCreateSchema>;

export const workOrderStatusSchema = z.object({
  status: z.enum(WORK_ORDER_STATUSES),
  resolutionNotes: nullableTrimmed(4000),
  durationMinutes: z.coerce.number().int().min(0).nullish(),
});
