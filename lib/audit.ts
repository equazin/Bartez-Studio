import type { Prisma } from "@prisma/client";
import { getDb } from "./db.ts";
import { logger } from "./logger.ts";

export type AuditAction = "create" | "update" | "delete";

export type AuditEntity =
  | "post"
  | "client"
  | "case"
  | "conversation"
  | "lead"
  | "account"
  | "contact"
  | "activity"
  | "opportunity"
  | "product"
  | "price_list"
  | "quote";

export async function logAudit(
  action: AuditAction,
  entity: AuditEntity,
  entityId: string | number,
  changes?: Record<string, unknown>,
  options?: { organizationId?: string; adminUser?: string },
): Promise<void> {
  try {
    await getDb().auditLog.create({
      data: {
        action,
        entity,
        entityId: String(entityId),
        changes: (changes ?? undefined) as Prisma.InputJsonValue | undefined,
        organizationId: options?.organizationId ?? null,
        ...(options?.adminUser ? { adminUser: options.adminUser } : {}),
      },
    });
  } catch (error) {
    logger.error("audit.log", error);
  }
}
