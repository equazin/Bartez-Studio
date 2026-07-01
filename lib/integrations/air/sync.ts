/**
 * Worker de sincronización del catálogo AIR.
 *
 * Recorre las páginas de /articulos (o /syp) hasta recibir un array vacío,
 * hace upsert en AirProduct y, en el modo "catalog", desactiva los productos
 * que dejaron de aparecer (por syncedAt anterior al inicio de la corrida).
 * Cada corrida se registra en AirSyncRun.
 */
import { getDb } from "../../db.ts";
import { logger } from "../../logger.ts";
import { isAirEnabled } from "./config.ts";
import { fetchArticulosPage, fetchSypPage } from "./client.ts";
import { mapAirProducts, type AirProductNormalized } from "./mapper.ts";

const MAX_PAGES = 500; // salvaguarda anti-loop (500 pág × 500 = 250k items)

export type AirSyncKind = "catalog" | "syp";

export interface AirSyncResult {
  runId: string;
  kind: AirSyncKind;
  pages: number;
  itemsTouched: number;
  deactivated: number;
  status: "ok" | "error";
  error?: string;
}

async function upsertProduct(orgId: string, p: AirProductNormalized, syncedAt: Date): Promise<void> {
  const data = {
    name: p.name,
    rubro: p.rubro,
    grupo: p.grupo,
    categoria: p.categoria,
    price: p.price,
    stockDisp: p.stockDisp,
    stockFisico: p.stockFisico,
    stockEntrante: p.stockEntrante,
    active: p.active,
    airUpdatedAt: p.airUpdatedAt,
    syncedAt,
  };
  await getDb().airProduct.upsert({
    where: { organizationId_codiart: { organizationId: orgId, codiart: p.codiart } },
    create: { organizationId: orgId, codiart: p.codiart, ...data },
    update: data,
  });
}

export async function runAirSync(orgId: string, kind: AirSyncKind = "catalog"): Promise<AirSyncResult> {
  if (!(await isAirEnabled(orgId))) {
    throw new Error("AIR: integración deshabilitada (AIR_INTEGRATION_ENABLED).");
  }

  const db = getDb();
  const run = await db.airSyncRun.create({
    data: { organizationId: orgId, kind, status: "running" },
  });
  const startedAt = run.startedAt;

  let page = 0;
  let itemsTouched = 0;
  try {
    while (page < MAX_PAGES) {
      const raw = kind === "syp" ? await fetchSypPage(orgId, page) : await fetchArticulosPage(orgId, page);
      if (raw.length === 0) break;

      const mapped = mapAirProducts(raw);
      for (const p of mapped) {
        await upsertProduct(orgId, p, new Date());
        itemsTouched++;
      }
      await db.airSyncRun.update({
        where: { id: run.id },
        data: { pageCursor: page, itemsTouched },
      });
      page++;
    }

    // En sync completo, lo no visto en esta corrida se marca inactivo.
    let deactivated = 0;
    if (kind === "catalog") {
      const res = await db.airProduct.updateMany({
        where: { organizationId: orgId, active: true, syncedAt: { lt: startedAt } },
        data: { active: false },
      });
      deactivated = res.count;
    }

    await db.airSyncRun.update({
      where: { id: run.id },
      data: { status: "ok", finishedAt: new Date(), pageCursor: page, itemsTouched },
    });

    logger.info("air.sync.ok", { kind, pages: page, itemsTouched, deactivated });
    return { runId: run.id, kind, pages: page, itemsTouched, deactivated, status: "ok" };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    await db.airSyncRun.update({
      where: { id: run.id },
      data: { status: "error", finishedAt: new Date(), error: message.slice(0, 1000), itemsTouched },
    });
    logger.error("air.sync.error", err);
    return { runId: run.id, kind, pages: page, itemsTouched, deactivated: 0, status: "error", error: message };
  }
}
