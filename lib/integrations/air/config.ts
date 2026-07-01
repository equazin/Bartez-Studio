/**
 * Feature flag y configuración de la integración con AIR S.R.L.
 *
 * La integración vive aislada del ERP base. Está apagada por defecto y
 * sólo se enciende con `AIR_INTEGRATION_ENABLED=true`. Cuando está
 * apagada, los endpoints, el cron y la UI deben responder 404/oculto,
 * y ningún flujo del ERP debe cambiar de comportamiento.
 */

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

export function getAirConfig(): AirConfig {
  return {
    enabled: readBool(process.env.AIR_INTEGRATION_ENABLED),
    baseUrl: process.env.AIR_BASE_URL?.trim() || DEFAULT_BASE_URL,
    syncIntervalMinutes: readInt(process.env.AIR_SYNC_INTERVAL_MINUTES, DEFAULT_SYNC_INTERVAL_MINUTES),
    cronSecret: process.env.AIR_CRON_SECRET?.trim() || null,
  };
}

export function isAirEnabled(): boolean {
  return getAirConfig().enabled;
}
