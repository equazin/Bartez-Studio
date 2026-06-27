import { z } from "zod";
import { getDb } from "../../db.ts";

/**
 * Configuración operativa por organización (Organization.settings JSON).
 *
 * purchaseApprovalThreshold: monto (en ARS) a partir del cual una orden de
 * compra requiere aprobación antes de poder recibirse. 0 = sin aprobación.
 */

export interface OrgSettings {
  // Datos fiscales / empresa
  taxCondition: string; // "responsable_inscripto" | "monotributo" | "exento" | ""
  fiscalAddress: string;
  pointOfSale: number; // PV default para facturas
  // Operativo
  purchaseApprovalThreshold: number;
  alertsWhatsappTo: string;
  alertsEmailTo: string;
}

export const DEFAULT_SETTINGS: OrgSettings = {
  taxCondition: "",
  fiscalAddress: "",
  pointOfSale: 1,
  purchaseApprovalThreshold: 0,
  alertsWhatsappTo: "",
  alertsEmailTo: "",
};

const optionalTrimmed = z.string().trim().max(200).optional();

export const orgSettingsUpdateSchema = z.object({
  taxCondition: optionalTrimmed,
  fiscalAddress: z.string().trim().max(300).optional(),
  pointOfSale: z
    .union([z.number(), z.string()])
    .transform((value) => (typeof value === "string" ? Number(value) : value))
    .refine((value) => Number.isInteger(value) && value >= 1 && value <= 99999, { message: "punto de venta entre 1 y 99999" })
    .optional(),
  purchaseApprovalThreshold: z
    .union([z.number(), z.string()])
    .transform((value) => (typeof value === "string" ? Number(value) : value))
    .refine((value) => !Number.isNaN(value) && value >= 0, { message: "debe ser >= 0" })
    .optional(),
  alertsWhatsappTo: optionalTrimmed,
  alertsEmailTo: optionalTrimmed,
});
export type OrgSettingsUpdate = z.infer<typeof orgSettingsUpdateSchema>;

function normalize(raw: unknown): OrgSettings {
  const data = (raw ?? {}) as Record<string, unknown>;
  const threshold = Number(data.purchaseApprovalThreshold);
  const pos = Number(data.pointOfSale);
  return {
    taxCondition: typeof data.taxCondition === "string" ? data.taxCondition : "",
    fiscalAddress: typeof data.fiscalAddress === "string" ? data.fiscalAddress : "",
    pointOfSale: Number.isInteger(pos) && pos >= 1 ? pos : 1,
    purchaseApprovalThreshold: Number.isFinite(threshold) && threshold >= 0 ? threshold : 0,
    alertsWhatsappTo: typeof data.alertsWhatsappTo === "string" ? data.alertsWhatsappTo : "",
    alertsEmailTo: typeof data.alertsEmailTo === "string" ? data.alertsEmailTo : "",
  };
}

export async function getOrgSettings(organizationId: string): Promise<OrgSettings> {
  const db = getDb();
  const org = await db.organization.findUnique({
    where: { id: organizationId },
    select: { settings: true },
  });
  return normalize(org?.settings);
}

/**
 * Aplica un patch parcial sobre la config actual. Solo las claves realmente
 * provistas (no undefined) se modifican, para que un guardado parcial no pise
 * otros campos. Función pura (testeable sin DB).
 */
export function mergeSettings(current: OrgSettings, patch: OrgSettingsUpdate): OrgSettings {
  const next: OrgSettings = { ...current };
  if (patch.taxCondition !== undefined) next.taxCondition = patch.taxCondition ?? "";
  if (patch.fiscalAddress !== undefined) next.fiscalAddress = patch.fiscalAddress ?? "";
  if (patch.pointOfSale !== undefined) next.pointOfSale = patch.pointOfSale;
  if (patch.purchaseApprovalThreshold !== undefined) next.purchaseApprovalThreshold = patch.purchaseApprovalThreshold;
  if (patch.alertsWhatsappTo !== undefined) next.alertsWhatsappTo = patch.alertsWhatsappTo ?? "";
  if (patch.alertsEmailTo !== undefined) next.alertsEmailTo = patch.alertsEmailTo ?? "";
  return next;
}

export async function updateOrgSettings(organizationId: string, patch: OrgSettingsUpdate): Promise<OrgSettings> {
  const db = getDb();
  const current = await getOrgSettings(organizationId);
  const next = mergeSettings(current, patch);
  await db.organization.update({
    where: { id: organizationId },
    data: { settings: next as unknown as object },
  });
  return next;
}
