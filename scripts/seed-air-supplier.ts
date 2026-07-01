/**
 * Sembra el proveedor AIR S.R.L. como Supplier del ERP (idempotente).
 * Datos: https://www.cuitonline.com/detalle/30570135585/air-s.r.l.html
 *
 *   npx tsx scripts/seed-air-supplier.ts
 */
import { getDb } from "../lib/db";

interface Seed {
  name: string;
  taxId: string;
  address: string;
  city: string;
  country: string;
}

const AIR: Seed = {
  name: "AIR S.R.L.",
  taxId: "30-57013558-5",
  address: "San Nicolás 1450",
  city: "Rosario, Santa Fe",
  country: "AR",
};

async function main(): Promise<void> {
  const db = getDb();

  const org = await db.organization.findFirst({ where: { slug: "bartez" } });
  if (!org) {
    throw new Error("Organización 'bartez' no encontrada; no se pudo sembrar AIR.");
  }

  const existing = await db.supplier.findFirst({
    where: { organizationId: org.id, taxId: AIR.taxId },
  });

  if (existing) {
    const updated = await db.supplier.update({
      where: { id: existing.id },
      data: {
        name: AIR.name,
        address: AIR.address,
        city: AIR.city,
        country: AIR.country,
        active: true,
        deletedAt: null,
      },
    });
    process.stdout.write(`Supplier AIR actualizado (id=${updated.id})\n`);
    return;
  }

  const created = await db.supplier.create({
    data: {
      organizationId: org.id,
      name: AIR.name,
      taxId: AIR.taxId,
      address: AIR.address,
      city: AIR.city,
      country: AIR.country,
      active: true,
    },
  });
  process.stdout.write(`Supplier AIR creado (id=${created.id})\n`);
}

main()
  .catch((err: unknown) => {
    process.stderr.write("Error: " + (err instanceof Error ? err.message : String(err)) + "\n");
    process.exit(1);
  })
  .finally(async () => {
    await getDb().$disconnect();
  });
