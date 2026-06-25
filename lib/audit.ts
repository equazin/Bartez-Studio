import type { Prisma } from "@prisma/client";
import { getDb } from "./db.ts";
import { logger } from "./logger.ts";

export type AuditAction = "create" | "update" | "delete";

export type AuditEntity = "post" | "client" | "case" | "conversation";

export async function logAudit(
  action: AuditAction,
  entity: AuditEntity,
  entityId: string | number,
  changes?: Record<string, unknown>,
): Promise<void> {
  try {
    await getDb().auditLog.create({
      data: {
        action,
        entity,
        entityId: String(entityId),
        changes: (changes ?? undefined) as Prisma.InputJsonValue | undefined,
      },
    });
  } catch (error) {
    logger.error("audit.log", error);
  }
}
