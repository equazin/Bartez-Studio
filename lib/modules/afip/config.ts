/**
 * Configuración del cliente AFIP por organización.
 *
 * En Fase 4 (single-tenant operativo) las credenciales viven en env vars
 * con un fallback "demo" sin certificados (modo de simulación local).
 * Cuando llegue multi-tenant pleno se mueven a una tabla AfipCredentials
 * encriptadas por org.
 *
 * Env vars esperadas:
 *  - AFIP_CUIT: CUIT del emisor (11 dígitos sin guiones)
 *  - AFIP_CERT: contenido PEM del certificado (-----BEGIN CERTIFICATE-----)
 *  - AFIP_KEY:  contenido PEM de la clave privada (-----BEGIN PRIVATE KEY-----)
 *  - AFIP_MODE: "homo" (default) o "prod"
 */

export type AfipMode = "homo" | "prod";

export interface AfipConfig {
  cuit: string;
  cert: string;
  key: string;
  mode: AfipMode;
  /** Sólo true cuando no hay cert configurado: emite respuestas simuladas. */
  simulated: boolean;
}

export const AFIP_ENDPOINTS = {
  homo: {
    wsaa: "https://wsaahomo.afip.gov.ar/ws/services/LoginCms",
    wsfe: "https://wswhomo.afip.gov.ar/wsfev1/service.asmx",
  },
  prod: {
    wsaa: "https://wsaa.afip.gov.ar/ws/services/LoginCms",
    wsfe: "https://servicios1.afip.gov.ar/wsfev1/service.asmx",
  },
} as const;

export function getAfipConfig(): AfipConfig {
  const cuit = process.env.AFIP_CUIT?.trim() ?? "";
  const cert = process.env.AFIP_CERT ?? "";
  const key = process.env.AFIP_KEY ?? "";
  const modeRaw = (process.env.AFIP_MODE ?? "homo").toLowerCase();
  const mode: AfipMode = modeRaw === "prod" ? "prod" : "homo";
  const simulated = !cuit || !cert.includes("BEGIN CERT") || !key.includes("BEGIN");
  return { cuit, cert, key, mode, simulated };
}

export function endpointsFor(mode: AfipMode) {
  return AFIP_ENDPOINTS[mode];
}
