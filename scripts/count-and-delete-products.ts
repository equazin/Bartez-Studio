/**
 * Reporta cuántos productos hay (activos y ya borrados por soft-delete) y,
 * si se pasa `--apply`, marca a todos los activos como borrados actualizando
 * `deletedAt`. Es reversible con un UPDATE ... SET deletedAt = NULL.
 *
 * Uso:
 *   npx tsx scripts/count-and-delete-products.ts           # solo reporta
 *   npx tsx scripts/count-and-delete-products.ts --apply   # ejecuta soft-delete
 */
import { getDb } from "../lib/db";

interface Report {
  active: number;
  alreadyDeleted: number;
  withStockItems: number;
  withSaleLines: number;
  withPurchaseLines: number;
}

async function report(): Promise<Report> {
  const db = getDb();

  const [active, alreadyDeleted, withStockItems, withSaleLines, withPurchaseLines] =
    await Promise.all([
      db.product.count({ where: { deletedAt: null } }),
      db.product.count({ where: { deletedAt: { not: null } } }),
      db.product.count({ where: { deletedAt: null, stockItems: { some: {} } } }),
      db.product.count({ where: { deletedAt: null, orderLines: { some: {} } } }),
      db.product.count({ where: { deletedAt: null, purchaseLines: { some: {} } } }),
    ]);

  return { active, alreadyDeleted, withStockItems, withSaleLines, withPurchaseLines };
}

async function main(): Promise<void> {
  const apply = process.argv.includes("--apply");
  const db = getDb();

  const before = await report();
  process.stdout.write(
    `\n== Productos ==\n` +
      `  activos:               ${before.active}\n` +
      `  ya borrados (soft):    ${before.alreadyDeleted}\n` +
      `  con StockItem:         ${before.withStockItems}\n` +
      `  con SalesOrderLine:    ${before.withSaleLines}\n` +
      `  con PurchaseOrderLine: ${before.withPurchaseLines}\n\n`,
  );

  if (!apply) {
    process.stdout.write(`(dry-run) ejecutá con --apply para borrar los ${before.active} activos.\n`);
    return;
  }

  const result = await db.product.updateMany({
    where: { deletedAt: null },
    data: { deletedAt: new Date() },
  });
  process.stdout.write(`Soft-delete aplicado: ${result.count} productos marcados como borrados.\n`);

  const after = await report();
  process.stdout.write(
    `\n== Estado final ==\n` +
      `  activos:            ${after.active}\n` +
      `  ya borrados (soft): ${after.alreadyDeleted}\n`,
  );
}

main()
  .catch((err: unknown) => {
    const msg = err instanceof Error ? err.message : String(err);
    process.stderr.write(`Error: ${msg}\n`);
    process.exit(1);
  })
  .finally(async () => {
    await getDb().$disconnect();
  });
