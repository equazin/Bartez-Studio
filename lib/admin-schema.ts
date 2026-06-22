import { z } from "zod";

export const adminLoginSchema = z.object({
  username: z.string().trim().min(1).max(80),
  password: z.string().min(1).max(256),
}).strict();

const safeText = (min: number, max: number) => z.string().trim().min(min).max(max);
const assetUrl = z.string().trim().max(2_048).refine(
  (value) => value.startsWith("/") || /^https:\/\//i.test(value),
  "La imagen debe ser una ruta local o una URL HTTPS",
);
export const bodyBlockSchema = z.union([
  z.object({ p: safeText(1, 8_000) }).strict(),
  z.object({ h: safeText(1, 180) }).strict(),
]);

const postFields = z.object({
  title: safeText(3, 120),
  excerpt: safeText(10, 320),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida"),
  cover: assetUrl,
  metaDescription: safeText(20, 180),
  readingTime: safeText(3, 30),
  bodyContent: z.array(bodyBlockSchema).min(1).max(80),
  published: z.boolean(),
}).strict();
export const postCreateSchema = postFields.extend({ published: z.boolean().default(true) });
export const postUpdateSchema = postFields.partial().refine((value) => Object.keys(value).length > 0, "No hay cambios para guardar");

const clientFields = z.object({
  name: safeText(2, 100),
  logoUrl: assetUrl,
  displayOrder: z.coerce.number().int().min(0).max(10_000),
  active: z.boolean(),
}).strict();
export const clientCreateSchema = clientFields.extend({
  displayOrder: z.coerce.number().int().min(0).max(10_000).default(0),
  active: z.boolean().default(true),
});
export const clientUpdateSchema = clientFields.partial().refine((value) => Object.keys(value).length > 0, "No hay cambios para guardar");

const caseFields = z.object({
  title: safeText(3, 140),
  clientName: safeText(2, 100),
  logoUrl: z.union([assetUrl, z.literal(""), z.null()]),
  coverImage: assetUrl,
  description: safeText(10, 500),
  metrics: z.array(safeText(1, 100)).max(8),
  content: safeText(10, 12_000),
  active: z.boolean(),
}).strict();
export const caseCreateSchema = caseFields.extend({
  logoUrl: z.union([assetUrl, z.literal(""), z.null()]).optional(),
  active: z.boolean().default(true),
});
export const caseUpdateSchema = caseFields.partial().refine((value) => Object.keys(value).length > 0, "No hay cambios para guardar");

export const adminIdSchema = z.coerce.number().int().positive();
export type BodyBlock = z.infer<typeof bodyBlockSchema>;
