import type { Prisma } from "@prisma/client";
import { getDb } from "../../db.ts";
import { nextNumber } from "../sales/numbering.ts";
import type { WorkOrderCreate, WorkOrderStatus } from "./schema.ts";

const VALID_TRANSITIONS: Record<WorkOrderStatus, WorkOrderStatus[]> = {
  scheduled: ["in_progress", "cancelled"],
  in_progress: ["completed", "cancelled"],
  completed: ["in_progress"],
  cancelled: ["scheduled"],
};

export class WorkOrderValidationError extends Error {}

export async function createWorkOrder(options: { organizationId: string; data: WorkOrderCreate }) {
  const db = getDb();
  return db.$transaction(async (tx) => {
    const { number } = await nextNumber(tx, { organizationId: options.organizationId, docType: "work-order" });
    return tx.workOrder.create({
      data: {
        organizationId: options.organizationId,
        number,
        title: options.data.title,
        description: options.data.description,
        type: options.data.type,
        priority: options.data.priority,
        accountId: options.data.accountId,
        ticketId: options.data.ticketId,
        serialNumberId: options.data.serialNumberId,
        assignedToId: options.data.assignedToId,
        scheduledFor: options.data.scheduledFor ?? null,
        items: {
          create: options.data.items.map((it) => ({
            kind: it.kind,
            productId: it.productId,
            description: it.description,
            quantity: it.quantity,
            unitPrice: it.unitPrice,
            billable: it.billable,
            notes: it.notes,
          })),
        },
      },
      include: {
        items: true,
        account: { select: { id: true, name: true } },
        assignedTo: { select: { id: true, name: true } },
      },
    });
  });
}

export async function updateWorkOrder(options: { organizationId: string; id: string; data: Partial<WorkOrderCreate> }) {
  const db = getDb();
  return db.$transaction(async (tx) => {
    const existing = await tx.workOrder.findFirst({
      where: { id: options.id, organizationId: options.organizationId, deletedAt: null },
      include: { items: true },
    });
    if (!existing) return null;
    if (existing.status === "completed") {
      throw new WorkOrderValidationError("No se puede editar una OT completada");
    }

    const update: Prisma.WorkOrderUncheckedUpdateInput = {
      title: options.data.title ?? existing.title,
      description: options.data.description ?? existing.description,
      type: options.data.type ?? existing.type,
      priority: options.data.priority ?? existing.priority,
      accountId: options.data.accountId ?? existing.accountId,
      ticketId: options.data.ticketId ?? existing.ticketId,
      serialNumberId: options.data.serialNumberId ?? existing.serialNumberId,
      assignedToId: options.data.assignedToId ?? existing.assignedToId,
      scheduledFor: options.data.scheduledFor ?? existing.scheduledFor,
    };

    if (options.data.items) {
      await tx.workOrderItem.deleteMany({ where: { workOrderId: existing.id } });
      Object.assign(update, {
        items: {
          create: options.data.items.map((it) => ({
            kind: it.kind,
            productId: it.productId,
            description: it.description,
            quantity: it.quantity,
            unitPrice: it.unitPrice,
            billable: it.billable,
            notes: it.notes,
          })),
        },
      });
    }

    return tx.workOrder.update({
      where: { id: existing.id },
      data: update,
      include: { items: true },
    });
  });
}

export async function transitionWorkOrderStatus(options: { organizationId: string; id: string; target: WorkOrderStatus; resolutionNotes?: string | null; durationMinutes?: number | null }) {
  const db = getDb();
  const existing = await db.workOrder.findFirst({ where: { id: options.id, organizationId: options.organizationId, deletedAt: null } });
  if (!existing) return null;

  const allowed = VALID_TRANSITIONS[existing.status as WorkOrderStatus];
  if (!allowed.includes(options.target)) {
    throw new WorkOrderValidationError(`Transición no permitida: ${existing.status} → ${options.target}`);
  }

  const now = new Date();
  const data: Prisma.WorkOrderUncheckedUpdateInput = { status: options.target };
  if (options.target === "in_progress" && !existing.startedAt) data.startedAt = now;
  if (options.target === "completed") {
    data.completedAt = now;
    if (options.resolutionNotes) data.resolutionNotes = options.resolutionNotes;
    if (options.durationMinutes !== undefined && options.durationMinutes !== null) data.durationMinutes = options.durationMinutes;
    if (!existing.startedAt) data.startedAt = now;
  }
  if (options.target === "cancelled" && !existing.completedAt) {
    // sin completar, marcamos cancelado
  }

  return db.workOrder.update({ where: { id: existing.id }, data });
}
