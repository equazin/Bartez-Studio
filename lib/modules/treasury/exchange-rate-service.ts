import { getDb } from "../../db.ts";
import type { ExchangeRateCreate } from "./schema.ts";

/**
 * Servicio de cotizaciones (tabla ExchangeRate, global a la instancia).
 *
 * Centraliza el tipo de cambio para que facturas y pagos lo tomen
 * automáticamente en lugar de cargarlo a mano en cada documento.
 * La cotización se guarda por día (unique base+quote+date), de modo que
 * upsertExchangeRate sobrescribe la del día si se vuelve a cargar.
 */

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Devuelve la cotización vigente (la más reciente) para un par, o null. */
export async function getLatestExchangeRate(base = "USD", quote = "ARS") {
  const db = getDb();
  return db.exchangeRate.findFirst({
    where: { base, quote },
    orderBy: { date: "desc" },
  });
}

/** Carga/actualiza la cotización de un día (default: hoy). */
export async function upsertExchangeRate(data: ExchangeRateCreate) {
  const db = getDb();
  const date = startOfDay(data.date ?? new Date());
  return db.exchangeRate.upsert({
    where: { base_quote_date: { base: data.base, quote: data.quote, date } },
    create: { base: data.base, quote: data.quote, rate: data.rate, date },
    update: { rate: data.rate },
  });
}

/** Lista las últimas cotizaciones cargadas, más recientes primero. */
export async function listExchangeRates(options: { base?: string; quote?: string; limit?: number } = {}) {
  const db = getDb();
  return db.exchangeRate.findMany({
    where: { base: options.base ?? "USD", quote: options.quote ?? "ARS" },
    orderBy: { date: "desc" },
    take: options.limit ?? 30,
  });
}
