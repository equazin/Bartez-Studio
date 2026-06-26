import type { PrismaClient, Prisma } from "@prisma/client";

/**
 * Numeración de comprobantes vía la tabla Sequence.
 *
 * Cada organización tiene un secuencial por (docType, pointOfSale).
 * `next()` corre dentro de una transacción y reserva el próximo número
 * de forma atómica. El folio devuelto sigue el formato:
 *   <PREFIX>-<POS-4>-<NUM-8>   (ej. COT-0001-00000001)
 */

const PREFIX_BY_DOC: Record<string, string> = {
  presupuesto: "COT",
  pedido: "PED",
  factura_a: "FCA",
  factura_b: "FCB",
  factura_c: "FCC",
  nota_credito: "NC",
  remito: "REM",
};

export type TxClient = Prisma.TransactionClient | PrismaClient;

export interface NextNumberResult {
  number: string;
  raw: number;
  pointOfSale: number;
}

export async function nextNumber(
  tx: TxClient,
  options: { organizationId: string; docType: string; pointOfSale?: number },
): Promise<NextNumberResult> {
  const pointOfSale = options.pointOfSale ?? 1;
  const prefix = PREFIX_BY_DOC[options.docType] ?? options.docType.slice(0, 4).toUpperCase();

  // Upsert para asegurar la fila; luego update atómico con increment.
  await tx.sequence.upsert({
    where: {
      organizationId_docType_pointOfSale: {
        organizationId: options.organizationId,
        docType: options.docType,
        pointOfSale,
      },
    },
    create: {
      organizationId: options.organizationId,
      docType: options.docType,
      pointOfSale,
      nextNumber: 1,
    },
    update: {},
  });

  const updated = await tx.sequence.update({
    where: {
      organizationId_docType_pointOfSale: {
        organizationId: options.organizationId,
        docType: options.docType,
        pointOfSale,
      },
    },
    data: { nextNumber: { increment: 1 } },
  });

  const raw = updated.nextNumber - 1; // el valor que reservamos es el previo al incremento
  const number = `${prefix}-${String(pointOfSale).padStart(4, "0")}-${String(raw).padStart(8, "0")}`;
  return { number, raw, pointOfSale };
}
