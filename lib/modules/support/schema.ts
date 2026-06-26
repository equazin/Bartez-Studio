import { z } from "zod";

const nullableTrimmed = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .nullish()
    .transform((value) => (value && value.length > 0 ? value : null));

export const TICKET_TYPES = ["support", "rma", "incident", "question"] as const;
export const TICKET_PRIORITIES = ["low", "normal", "high", "urgent"] as const;
export const TICKET_STATUSES = ["new", "open", "pending", "solved", "closed"] as const;
export const TICKET_CHANNELS = ["manual", "whatsapp", "email", "web"] as const;

export type TicketType = (typeof TICKET_TYPES)[number];
export type TicketPriority = (typeof TICKET_PRIORITIES)[number];
export type TicketStatus = (typeof TICKET_STATUSES)[number];
export type TicketChannel = (typeof TICKET_CHANNELS)[number];

export const ticketCreateSchema = z.object({
  subject: z.string().trim().min(1).max(200),
  description: nullableTrimmed(8000),
  type: z.enum(TICKET_TYPES).default("support"),
  priority: z.enum(TICKET_PRIORITIES).default("normal"),
  channel: z.enum(TICKET_CHANNELS).default("manual"),
  accountId: z.string().trim().min(1).max(40).nullish().transform((value) => value || null),
  serialNumberId: z.string().trim().min(1).max(40).nullish().transform((value) => value || null),
  assignedToId: z.string().trim().min(1).max(40).nullish().transform((value) => value || null),
});

export const ticketUpdateSchema = ticketCreateSchema.partial();
export type TicketCreate = z.infer<typeof ticketCreateSchema>;

export const ticketStatusSchema = z.object({
  status: z.enum(TICKET_STATUSES),
  resolutionNotes: nullableTrimmed(4000),
});

export const ticketAssignSchema = z.object({
  assignedToId: z.string().trim().min(1).max(40).nullable(),
});

export const ticketMessageSchema = z.object({
  body: z.string().trim().min(1).max(8000),
  internal: z.boolean().default(false),
  authorName: nullableTrimmed(200),
});
export type TicketMessageCreate = z.infer<typeof ticketMessageSchema>;

/**
 * SLA por prioridad (horas hábiles a la respuesta y resolución).
 * Se calcula en tiempo "calendario" liviano: 24h por día. Mejorable
 * cuando agreguemos horario comercial.
 */
export const TICKET_SLA: Record<TicketPriority, { firstResponseHours: number; resolveHours: number }> = {
  urgent: { firstResponseHours: 2, resolveHours: 24 },
  high: { firstResponseHours: 8, resolveHours: 72 },
  normal: { firstResponseHours: 24, resolveHours: 7 * 24 },
  low: { firstResponseHours: 48, resolveHours: 14 * 24 },
};

export function calculateDueAt(priority: TicketPriority, from: Date = new Date()): Date {
  const sla = TICKET_SLA[priority];
  return new Date(from.getTime() + sla.resolveHours * 3600_000);
}

export const knowledgeArticleCreateSchema = z.object({
  title: z.string().trim().min(1).max(200),
  slug: z.string().trim().min(1).max(160).regex(/^[a-z0-9-]+$/, "Sólo minúsculas, números y guiones"),
  excerpt: nullableTrimmed(500),
  body: z.string().trim().min(1).max(40000),
  category: nullableTrimmed(120),
  tags: z.array(z.string().trim().min(1).max(60)).max(20).default([]),
  published: z.boolean().default(true),
});

export const knowledgeArticleUpdateSchema = knowledgeArticleCreateSchema.partial();
export type KnowledgeArticleCreate = z.infer<typeof knowledgeArticleCreateSchema>;
