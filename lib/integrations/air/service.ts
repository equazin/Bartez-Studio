/**
 * Servicios de lectura de la integración AIR.
 * Sin dependencias de Next; se llaman desde APIs admin, pickers y crons.
 */
import { getDb } from "../../db.ts";

export interface AirStats {
  total: number;
  active: number;
  inactive: number;
  withStock: number;
  lastSyncedAt: Date | null;
}

export interface AirSyncSummary {
  id: string;
  kind: string;
  startedAt: Date;
  finishedAt: Date | null;
  status: string;
  pageCursor: number;
  itemsTouched: number;
  error: string | null;
}

export async function getAirStats(orgId: string): Promise<AirStats> {
  const db = getDb();
  const [total, active, withStock, latest] = await Promise.all([
    db.airProduct.count({ where: { organizationId: orgId } }),
    db.airProduct.count({ where: { organizationId: orgId, active: true } }),
    db.airProduct.count({ where: { organizationId: orgId, stockDisp: { gt: 0 } } }),
    db.airProduct.findFirst({
      where: { organizationId: orgId },
      orderBy: { syncedAt: "desc" },
      select: { syncedAt: true },
    }),
  ]);
  return {
    total,
    active,
    inactive: total - active,
    withStock,
    lastSyncedAt: latest?.syncedAt ?? null,
  };
}

export async function getRecentSyncRuns(orgId: string, limit = 10): Promise<AirSyncSummary[]> {
  const rows = await getDb().airSyncRun.findMany({
    where: { organizationId: orgId },
    orderBy: { startedAt: "desc" },
    take: limit,
    select: {
      id: true, kind: true, startedAt: true, finishedAt: true,
      status: true, pageCursor: true, itemsTouched: true, error: true,
    },
  });
  return rows;
}

export interface AirProductSearchInput {
  query?: string;
  rubro?: string;
  onlyActive?: boolean;
  limit?: number;
}

export interface AirProductRow {
  id: string;
  codiart: string;
  name: string;
  rubro: string | null;
  grupo: string | null;
  price: number | null;
  stockDisp: number;
  stockFisico: number;
  stockEntrante: number;
  active: boolean;
  syncedAt: Date;
}

export async function searchAirProducts(
  orgId: string,
  input: AirProductSearchInput,
): Promise<AirProductRow[]> {
  const limit = Math.min(Math.max(input.limit ?? 30, 1), 100);
  const q = input.query?.trim() ?? "";
  const rows = await getDb().airProduct.findMany({
    where: {
      organizationId: orgId,
      active: input.onlyActive === false ? undefined : true,
      rubro: input.rubro?.trim() ? input.rubro.trim() : undefined,
      OR: q ? [
        { codiart: { contains: q, mode: "insensitive" } },
        { name: { contains: q, mode: "insensitive" } },
      ] : undefined,
    },
    take: limit,
    orderBy: [{ stockDisp: "desc" }, { name: "asc" }],
    select: {
      id: true, codiart: true, name: true, rubro: true, grupo: true,
      price: true, stockDisp: true, stockFisico: true, stockEntrante: true,
      active: true, syncedAt: true,
    },
  });
  return rows.map((r) => ({
    ...r,
    price: r.price === null ? null : Number(r.price),
  }));
}
