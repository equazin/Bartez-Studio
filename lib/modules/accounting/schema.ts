import { z } from "zod";

export const LEDGER_ACCOUNT_TYPES = ["asset", "liability", "equity", "income", "expense"] as const;
export type LedgerAccountType = (typeof LEDGER_ACCOUNT_TYPES)[number];

export const LEDGER_TYPE_LABELS: Record<LedgerAccountType, string> = {
  asset: "Activo",
  liability: "Pasivo",
  equity: "Patrimonio Neto",
  income: "Ingresos",
  expense: "Egresos",
};

const decimalString = z
  .union([z.number(), z.string()])
  .transform((value) => (typeof value === "string" ? Number(value) : value))
  .refine((value) => !Number.isNaN(value) && value >= 0, { message: "valor invalido" });

export const ledgerAccountCreateSchema = z.object({
  code: z.string().trim().min(1).max(20),
  name: z.string().trim().min(1).max(160),
  type: z.enum(LEDGER_ACCOUNT_TYPES),
  parentId: z.string().trim().min(1).max(40).nullish().transform((value) => value || null),
  active: z.boolean().default(true),
});
export const ledgerAccountUpdateSchema = ledgerAccountCreateSchema.partial();
export type LedgerAccountCreate = z.infer<typeof ledgerAccountCreateSchema>;

export const journalLineSchema = z.object({
  accountId: z.string().trim().min(1).max(40),
  debit: decimalString.default(0),
  credit: decimalString.default(0),
  description: z.string().trim().max(300).nullish().transform((value) => value || null),
});

export const journalEntryCreateSchema = z.object({
  date: z.coerce.date().optional(),
  description: z.string().trim().min(1).max(300),
  referenceType: z.string().trim().max(80).nullish().transform((value) => value || null),
  referenceId: z.string().trim().max(80).nullish().transform((value) => value || null),
  lines: z.array(journalLineSchema).min(2, "El asiento necesita al menos dos líneas"),
});
export type JournalEntryCreate = z.infer<typeof journalEntryCreateSchema>;
