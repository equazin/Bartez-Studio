import { getDb } from "../../db.ts";
import type { CashAccountCreate, CashMovementCreate } from "./schema.ts";

export class TreasuryValidationError extends Error {}

function signedAmount(type: string, amount: number) {
  if (type === "income") return amount;
  if (type === "expense") return -amount;
  return amount;
}

export async function createCashAccount(options: { organizationId: string; data: CashAccountCreate }) {
  const db = getDb();
  return db.cashAccount.create({
    data: {
      organizationId: options.organizationId,
      name: options.data.name,
      type: options.data.type,
      currency: options.data.currency,
      balance: options.data.balance ?? 0,
      active: options.data.active,
    },
  });
}

export async function createCashMovement(options: { organizationId: string; data: CashMovementCreate }) {
  const db = getDb();
  const data = options.data;
  const amount = Number(data.amount);

  return db.$transaction(async (tx) => {
    const account = await tx.cashAccount.findFirst({
      where: { id: data.cashAccountId, organizationId: options.organizationId, deletedAt: null },
    });
    if (!account) throw new TreasuryValidationError("La cuenta de caja/banco no existe");
    if (account.currency !== data.currency) throw new TreasuryValidationError("La moneda del movimiento no coincide con la cuenta");

    const movement = await tx.cashMovement.create({
      data: {
        organizationId: options.organizationId,
        cashAccountId: account.id,
        type: data.type,
        date: data.date ?? new Date(),
        description: data.description,
        amount,
        currency: data.currency,
        referenceType: data.referenceType,
        referenceId: data.referenceId,
      },
    });

    await tx.cashAccount.update({
      where: { id: account.id },
      data: { balance: { increment: signedAmount(data.type, amount) } },
    });

    return movement;
  });
}
