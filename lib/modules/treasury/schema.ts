import { z } from "zod";

const nullableTrimmed = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .nullish()
    .transform((value) => (value && value.length > 0 ? value : null));

const positiveDecimal = z
  .union([z.number(), z.string()])
  .transform((value) => (typeof value === "string" ? Number(value) : value))
  .refine((value) => !Number.isNaN(value) && value > 0, { message: "debe ser > 0" });

export const CASH_ACCOUNT_TYPES = ["cash", "bank"] as const;
export const CASH_MOVEMENT_TYPES = ["income", "expense", "adjust"] as const;

export const cashAccountCreateSchema = z.object({
  name: z.string().trim().min(1).max(160),
  type: z.enum(CASH_ACCOUNT_TYPES).default("bank"),
  currency: z.enum(["ARS", "USD"]).default("ARS"),
  balance: z.union([z.number(), z.string()]).optional().transform((value) => value == null ? 0 : Number(value)),
  active: z.boolean().default(true),
});
export const cashAccountUpdateSchema = cashAccountCreateSchema.partial();
export type CashAccountCreate = z.infer<typeof cashAccountCreateSchema>;

export const cashMovementCreateSchema = z.object({
  cashAccountId: z.string().trim().min(1).max(40),
  type: z.enum(CASH_MOVEMENT_TYPES),
  date: z.coerce.date().optional(),
  description: z.string().trim().min(1).max(500),
  amount: positiveDecimal,
  currency: z.enum(["ARS", "USD"]).default("ARS"),
  referenceType: nullableTrimmed(80),
  referenceId: nullableTrimmed(80),
});
export type CashMovementCreate = z.infer<typeof cashMovementCreateSchema>;

export const exchangeRateCreateSchema = z.object({
  base: z.enum(["USD"]).default("USD"),
  quote: z.enum(["ARS"]).default("ARS"),
  rate: positiveDecimal,
  date: z.coerce.date().optional(),
});
export type ExchangeRateCreate = z.infer<typeof exchangeRateCreateSchema>;
