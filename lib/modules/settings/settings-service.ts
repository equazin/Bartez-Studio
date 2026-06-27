import { z } from "zod";
import { getDb } from "../../db.ts";

/**
 * Configuración operativa por organización (Organization.settings JSON).
 *
 * purchaseApprovalThreshold: monto (en ARS) a partir del cual una orden de
 * compra requiere aprobación antes de poder recibirse. 0 = sin aprobación.
 */

export interface OrgSettings {
  purchaseApprovalThreshold: number;
  alertsWhatsappTo: string;
  alertsEmailTo: string;
}

export const DEFAULT_SETTINGS: OrgSettings = {
  purchaseApprovalThreshold: 0,
  alertsWhatsappTo: "",
  alertsEmailTo: "",
};

const optionalTrimmed = z.string().trim().max(120).optional();

export const orgSettingsUpdateSchema = z.object({
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
  return {
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

export async function updateOrgSettings(organizationId: string, patch: OrgSettingsUpdate): Promise<OrgSettings> {
  const db = getDb();
  const current = await getOrgSettings(organizationId);
  // Solo se aplican las claves realmente provistas (no undefined), para que un
  // guardado parcial no pise otros campos de la configuración.
  const next: OrgSettings = { ...current };
  if (patch.purchaseApprovalThreshold !== undefined) next.purchaseApprovalThreshold = patch.purchaseApprovalThreshold;
  if (patch.alertsWhatsappTo !== undefined) next.alertsWhatsappTo = patch.alertsWhatsappTo;
  if (patch.alertsEmailTo !== undefined) next.alertsEmailTo = patch.alertsEmailTo;
  await db.organization.update({
    where: { id: organizationId },
    data: { settings: next as unknown as object },
  });
  return next;
}
