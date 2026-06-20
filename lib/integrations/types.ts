import type { Lead } from "../schema";

export type IntegrationResult = {
  name: string;
  ok: boolean;
  detail?: string;
  skipped?: boolean;
};

export interface LeadSink {
  /** Nombre legible de la integración */
  name: string;
  /** true si está configurada (env vars presentes) */
  isConfigured(): boolean;
  /** Procesa el lead. No debe lanzar: devuelve un IntegrationResult. */
  handle(lead: Lead): Promise<IntegrationResult>;
}
