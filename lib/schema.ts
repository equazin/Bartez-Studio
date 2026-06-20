import { z } from "zod";

export const quoteItemSchema = z.object({
  label: z.string(),
  qty: z.number().int().positive().optional(),
  variant: z.string().optional(),
});

export const leadSchema = z.object({
  empresa: z.string().min(2, "Ingresá el nombre de la empresa"),
  nombre: z.string().min(2, "Ingresá tu nombre"),
  email: z.string().email("Email corporativo inválido"),
  telefono: z.string().min(6, "Teléfono inválido").optional().or(z.literal("")),
  tipoConsulta: z.enum(["cotizacion", "asesoramiento", "cuenta"]),
  mensaje: z.string().max(4000).optional().or(z.literal("")),
  agendarReunion: z.boolean().optional().default(false),
  // Quote builder (opcional)
  items: z.array(quoteItemSchema).max(20).optional(),
  urgencia: z.string().max(60).optional(),
  origen: z.string().max(40).optional(),
  // honeypot anti-spam
  website: z.string().max(0).optional(),
});

export type Lead = z.infer<typeof leadSchema>;

export const downloadSchema = z.object({
  email: z.string().email("Email corporativo inválido"),
  empresa: z.string().min(2).optional().or(z.literal("")),
  resource: z.enum(["brochure", "catalogo"]),
  website: z.string().max(0).optional(),
});

export type DownloadLead = z.infer<typeof downloadSchema>;
