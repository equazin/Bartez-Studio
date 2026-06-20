import { z } from "zod";

export const leadSchema = z.object({
  empresa: z.string().min(2, "Ingresá el nombre de la empresa"),
  nombre: z.string().min(2, "Ingresá tu nombre"),
  email: z.string().email("Email corporativo inválido"),
  telefono: z.string().min(6, "Teléfono inválido").optional().or(z.literal("")),
  tipoConsulta: z.enum(["cotizacion", "asesoramiento", "cuenta"]),
  mensaje: z.string().max(2000).optional().or(z.literal("")),
  agendarReunion: z.boolean().optional().default(false),
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
