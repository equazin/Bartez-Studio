import { getCredential } from "./credentials-service.ts";
import { INTEGRATIONS, type IntegrationDef } from "./integrations-catalog.ts";

/**
 * Estado de cada integración para la UI. Devuelve metadata + preview enmascarado
 * de los valores existentes (NUNCA el valor completo).
 */

export interface IntegrationFieldStatus {
  key: string;
  label: string;
  hint?: string;
  secret?: boolean;
  multiline?: boolean;
  required?: boolean;
  /** "bd" si está guardado cifrado, "env" si viene del entorno, null si no hay valor */
  source: "bd" | "env" | null;
  /** Preview enmascarado (••••XXXX) o "configurado" si es multiline secreto */
  preview: string | null;
}

export interface IntegrationStatus {
  id: string;
  label: string;
  description: string;
  category: IntegrationDef["category"];
  docsUrl?: string;
  standby?: boolean;
  /** Configured = todos los required tienen valor */
  configured: boolean;
  /** Si false, guardar desde la UI no se aplica todavía (reader aún en env) */
  readerMigrated: boolean;
  fields: IntegrationFieldStatus[];
}

function mask(value: string, multiline?: boolean): string {
  if (!value) return "";
  if (multiline) return "configurado · " + value.length + " chars";
  if (value.length <= 4) return "•".repeat(value.length);
  return `••••${value.slice(-4)}`;
}

export async function getIntegrationsStatus(organizationId: string): Promise<IntegrationStatus[]> {
  const out: IntegrationStatus[] = [];

  for (const integ of INTEGRATIONS) {
    const fieldStatuses: IntegrationFieldStatus[] = [];
    let allRequiredOk = true;

    for (const f of integ.fields) {
      const value = await getCredential(organizationId, integ.id, f.key, f.env);
      let source: IntegrationFieldStatus["source"] = null;
      if (value) {
        // Si la BD no tiene la key pero hay env, source = "env". Si BD tiene, "bd".
        // Heurística: si setteás el env y nunca tocaste la BD, source = env.
        // Para diferenciar consultamos directamente la BD.
        try {
          const { getDb } = await import("../../db.ts");
          const row = await getDb().orgCredential.findUnique({
            where: { organizationId_provider_key: { organizationId, provider: integ.id, key: f.key } },
            select: { id: true },
          });
          source = row ? "bd" : "env";
        } catch {
          source = "env";
        }
      }

      const hasValue = Boolean(value);
      if (f.required && !hasValue) allRequiredOk = false;

      fieldStatuses.push({
        key: f.key,
        label: f.label,
        hint: f.hint,
        secret: f.secret,
        multiline: f.multiline,
        required: f.required,
        source,
        preview: hasValue ? (f.secret ? mask(value, f.multiline) : value) : null,
      });
    }

    out.push({
      id: integ.id,
      label: integ.label,
      description: integ.description,
      category: integ.category,
      docsUrl: integ.docsUrl,
      standby: integ.standby,
      configured: allRequiredOk,
      readerMigrated: integ.readerMigrated,
      fields: fieldStatuses,
    });
  }

  return out;
}
