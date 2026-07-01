/**
 * Feature flag y configuración de la integración con AIR S.R.L.
 *
 * La integración vive aislada del ERP base. Está apagada por defecto y
 * sólo se enciende con `AIR_INTEGRATION_ENABLED=true` o credencial `enabled=true`.
 * Cuando está apagada, los endpoints, el cron y la UI deben responder 404/oculto,
 * y ningún flujo del ERP debe cambiar de comportamiento.
 */
import { getCredential } from "../../modules/system/credentials-service.ts";

export interface AirConfig {
  enabled: boolean;
  baseUrl: string;
  syncIntervalMinutes: number;
  cronSecret: string | null;
}

const DEFAULT_BASE_URL = "https://api.air-intra.com/v2";
const DEFAULT_SYNC_INTERVAL_MINUTES = 15;

function readBool(value: string | undefined): boolean {
  if (!value) return false;
  const normalized = value.trim().toLowerCase();
  return normalized === "true" || normalized === "1" || normalized === "yes";
}

function readInt(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export async function getAirConfig(orgId?: string): Promise<AirConfig> {
  if (!orgId) {
    // Si no hay orgId, caemos directamente a variables de entorno.
    // Esto evita tocar la base de datos o fallar por mocks globales corruptos en tests unitarios.
    return {
      enabled: readBool(process.env.AIR_INTEGRATION_ENABLED),
      baseUrl: process.env.AIR_BASE_URL?.trim() || DEFAULT_BASE_URL,
      syncIntervalMinutes: readInt(process.env.AIR_SYNC_INTERVAL_MINUTES, DEFAULT_SYNC_INTERVAL_MINUTES),
      cronSecret: process.env.AIR_CRON_SECRET?.trim() || null,
    };
  }

  const [enabledStr, baseUrlStr, syncIntervalStr, cronSecretStr] = await Promise.all([
    getCredential(orgId, "air", "enabled", "AIR_INTEGRATION_ENABLED"),
    getCredential(orgId, "air", "base_url", "AIR_BASE_URL"),
    getCredential(orgId, "air", "sync_interval", "AIR_SYNC_INTERVAL_MINUTES"),
    getCredential(orgId, "air", "cron_secret", "AIR_CRON_SECRET"),
  ]);

  return {
    enabled: readBool(enabledStr),
    baseUrl: baseUrlStr.trim() || DEFAULT_BASE_URL,
    syncIntervalMinutes: readInt(syncIntervalStr, DEFAULT_SYNC_INTERVAL_MINUTES),
    cronSecret: cronSecretStr.trim() || null,
  };
}

export async function isAirEnabled(orgId?: string): Promise<boolean> {
  return (await getAirConfig(orgId)).enabled;
}
