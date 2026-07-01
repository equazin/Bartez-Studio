/**
 * Verifica que la migración de integración AIR haya aplicado bien:
 * tablas AirProduct/AirCredential/AirSyncRun y columnas nuevas en
 * SalesOrderLine y PurchaseOrder.
 *
 *   npx tsx scripts/verify-air.ts
 */
import { getDb } from "../lib/db";

async function main(): Promise<void> {
  const db = getDb();
  const tables = await db.$queryRawUnsafe<{ table_name: string }[]>(
    `SELECT table_name FROM information_schema.tables
     WHERE table_schema='public' AND table_name IN ('AirProduct','AirCredential','AirSyncRun')
     ORDER BY table_name`,
  );
  const salCols = await db.$queryRawUnsafe<{ column_name: string }[]>(
    `SELECT column_name FROM information_schema.columns
     WHERE table_schema='public' AND table_name='SalesOrderLine'
     AND column_name IN ('unitCost','markupPct','sourceSystem','sourceCode')
     ORDER BY column_name`,
  );
  const poCols = await db.$queryRawUnsafe<{ column_name: string }[]>(
    `SELECT column_name FROM information_schema.columns
     WHERE table_schema='public' AND table_name='PurchaseOrder'
     AND column_name IN ('originSaleOrderId','supplierSource')
     ORDER BY column_name`,
  );

  process.stdout.write("Tablas AIR: " + tables.map((r) => r.table_name).join(", ") + "\n");
  process.stdout.write("SalesOrderLine cols: " + salCols.map((r) => r.column_name).join(", ") + "\n");
  process.stdout.write("PurchaseOrder cols: " + poCols.map((r) => r.column_name).join(", ") + "\n");
}

main()
  .catch((err: unknown) => {
    process.stderr.write("Error: " + (err instanceof Error ? err.message : String(err)) + "\n");
    process.exit(1);
  })
  .finally(async () => {
    await getDb().$disconnect();
  });
