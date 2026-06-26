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
  .refine((v) => !Number.isNaN(v), { message: "valor inválido" });

const positiveDecimal = decimalString.refine((v) => v > 0, { message: "debe ser > 0" });
const nonNegativeDecimal = decimalString.refine((v) => v >= 0, { message: "no puede ser negativo" });

export const warehouseCreateSchema = z.object({
  code: z.string().trim().min(1).max(40),
  name: z.string().trim().min(1).max(200),
  address: nullableTrimmed(300),
  isDefault: z.boolean().default(false),
  active: z.boolean().default(true),
});
export const warehouseUpdateSchema = warehouseCreateSchema.partial();
export type WarehouseCreate = z.infer<typeof warehouseCreateSchema>;

export const MOVEMENT_TYPES = ["in", "out", "adjust", "transfer", "reserve", "release"] as const;
export type MovementType = (typeof MOVEMENT_TYPES)[number];

/**
 * Movimiento manual disparable desde la UI:
 *  - in: recepción/ingreso (productId + warehouseId + quantity)
 *  - out: egreso manual
 *  - adjust: cuenta física → setea cantidad absoluta del item
 *  - transfer: fromWarehouseId → toWarehouseId
 *
 * Los movimientos "reserve" / "release" se generan automáticamente desde el
 * service de pedidos y no se exponen en la UI manual.
 */
export const movementCreateSchema = z
  .object({
    type: z.enum(["in", "out", "adjust", "transfer"]),
    productId: z.string().trim().min(1).max(40),
    warehouseId: z.string().trim().min(1).max(40).nullish().transform((v) => v || null),
    fromWarehouseId: z.string().trim().min(1).max(40).nullish().transform((v) => v || null),
    toWarehouseId: z.string().trim().min(1).max(40).nullish().transform((v) => v || null),
    quantity: positiveDecimal,
    reason: nullableTrimmed(300),
  })
  .refine(
    (v) => {
      if (v.type === "transfer") return Boolean(v.fromWarehouseId && v.toWarehouseId && v.fromWarehouseId !== v.toWarehouseId);
      return Boolean(v.warehouseId);
    },
    { message: "transfer requiere from/to distintos; in/out/adjust requieren warehouseId" },
  );

export type MovementCreate = z.infer<typeof movementCreateSchema>;

export const stockReorderSchema = z.object({
  reorderPoint: nonNegativeDecimal,
});
