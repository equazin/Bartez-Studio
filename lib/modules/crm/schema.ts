import { z } from "zod";

/**
 * Schemas Zod del módulo CRM (Fase 1).
 *
 * Convenciones:
 * - Strings se hacen `trim()` y opcionales colapsan strings vacíos a `null`.
 * - Los IDs nunca se aceptan en el body (vienen por path).
 * - Los update schemas son partials para PATCH/PUT parciales.
 */

const nullableTrimmed = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .nullish()
    .transform((v) => (v && v.length > 0 ? v : null));

export const accountCreateSchema = z.object({
  name: z.string().trim().min(1).max(200),
  taxId: nullableTrimmed(40),
  industry: nullableTrimmed(120),
  website: nullableTrimmed(300),
  phone: nullableTrimmed(40),
  email: z.string().trim().email().nullish().or(z.literal("")).transform((v) => (v ? v : null)),
  address: nullableTrimmed(300),
  city: nullableTrimmed(120),
  country: nullableTrimmed(120),
  notes: nullableTrimmed(4000),
  ownerId: nullableTrimmed(40),
});
export const accountUpdateSchema = accountCreateSchema.partial();
export type AccountCreate = z.infer<typeof accountCreateSchema>;
export type AccountUpdate = z.infer<typeof accountUpdateSchema>;

export const contactCreateSchema = z.object({
  firstName: z.string().trim().min(1).max(120),
  lastName: nullableTrimmed(120),
  email: z.string().trim().email().nullish().or(z.literal("")).transform((v) => (v ? v : null)),
  phone: nullableTrimmed(40),
  jobTitle: nullableTrimmed(120),
  notes: nullableTrimmed(4000),
  accountId: nullableTrimmed(40),
});
export const contactUpdateSchema = contactCreateSchema.partial();
export type ContactCreate = z.infer<typeof contactCreateSchema>;
export type ContactUpdate = z.infer<typeof contactUpdateSchema>;

export const OPPORTUNITY_STAGES = ["qualification", "proposal", "negotiation", "won", "lost"] as const;
export type OpportunityStage = (typeof OPPORTUNITY_STAGES)[number];

export const opportunityCreateSchema = z.object({
  title: z.string().trim().min(1).max(200),
  stage: z.enum(OPPORTUNITY_STAGES).default("qualification"),
  amount: z
    .union([z.number(), z.string()])
    .nullish()
    .transform((v) => (v === null || v === undefined || v === "" ? null : Number(v)))
    .refine((v) => v === null || (!Number.isNaN(v) && v >= 0), { message: "amount inválido" }),
  currency: z.string().trim().length(3).default("USD"),
  probability: z.coerce.number().int().min(0).max(100).default(20),
  expectedClose: z.coerce.date().nullish(),
  lostReason: nullableTrimmed(500),
  notes: nullableTrimmed(4000),
  accountId: nullableTrimmed(40),
  ownerId: nullableTrimmed(40),
});
export const opportunityUpdateSchema = opportunityCreateSchema.partial();
export type OpportunityCreate = z.infer<typeof opportunityCreateSchema>;
export type OpportunityUpdate = z.infer<typeof opportunityUpdateSchema>;

export const ACTIVITY_TYPES = ["call", "email", "meeting", "task", "note"] as const;
export const ACTIVITY_STATUSES = ["pending", "done", "cancelled"] as const;
export type ActivityType = (typeof ACTIVITY_TYPES)[number];
export type ActivityStatus = (typeof ACTIVITY_STATUSES)[number];

export const activityCreateSchema = z.object({
  type: z.enum(ACTIVITY_TYPES),
  subject: z.string().trim().min(1).max(200),
  body: nullableTrimmed(4000),
  status: z.enum(ACTIVITY_STATUSES).default("pending"),
  dueAt: z.coerce.date().nullish(),
  assignedToId: nullableTrimmed(40),
  accountId: nullableTrimmed(40),
  contactId: nullableTrimmed(40),
  opportunityId: nullableTrimmed(40),
});
export const activityUpdateSchema = activityCreateSchema.partial();
export type ActivityCreate = z.infer<typeof activityCreateSchema>;
export type ActivityUpdate = z.infer<typeof activityUpdateSchema>;

export const leadAssignSchema = z.object({
  assignedToId: z.string().trim().min(1).max(40).nullable(),
});

export const leadConvertSchema = z.object({
  accountName: z.string().trim().min(1).max(200).optional(),
});
