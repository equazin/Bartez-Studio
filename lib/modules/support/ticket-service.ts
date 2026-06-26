import type { Prisma } from "@prisma/client";
import { getDb } from "../../db.ts";
import { nextNumber } from "../sales/numbering.ts";
import { calculateDueAt, type TicketCreate, type TicketMessageCreate, type TicketPriority, type TicketStatus } from "./schema.ts";

/**
 * Service del módulo Postventa.
 *
 * createTicket:
 *  - Numera vía Sequence (docType "ticket").
 *  - Calcula dueAt a partir del SLA por prioridad.
 *
 * transitionTicketStatus aplica timestamps según el destino:
 *  open → marca firstResponseAt si no estaba
 *  solved → marca solvedAt + guarda resolutionNotes opcional
 *  closed → marca closedAt
 */

const VALID_TRANSITIONS: Record<TicketStatus, TicketStatus[]> = {
  new: ["open", "pending", "solved", "closed"],
  open: ["pending", "solved", "closed"],
  pending: ["open", "solved", "closed"],
  solved: ["closed", "open"],
  closed: ["open"],
};

export class TicketValidationError extends Error {}

export async function createTicket(options: { organizationId: string; data: TicketCreate }) {
  const db = getDb();
  return db.$transaction(async (tx) => {
    const { number } = await nextNumber(tx, { organizationId: options.organizationId, docType: "ticket" });
    const priority = options.data.priority as TicketPriority;
    const dueAt = calculateDueAt(priority);

    return tx.ticket.create({
      data: {
        organizationId: options.organizationId,
        number,
        subject: options.data.subject,
        description: options.data.description,
        type: options.data.type,
        priority,
        channel: options.data.channel,
        accountId: options.data.accountId,
        serialNumberId: options.data.serialNumberId,
        assignedToId: options.data.assignedToId,
        dueAt,
      },
      include: {
        account: { select: { id: true, name: true } },
        assignedTo: { select: { id: true, name: true } },
      },
    });
  });
}

export async function updateTicket(options: { organizationId: string; id: string; data: Partial<TicketCreate> }) {
  const db = getDb();
  const existing = await db.ticket.findFirst({ where: { id: options.id, organizationId: options.organizationId, deletedAt: null } });
  if (!existing) return null;

  const update: Prisma.TicketUncheckedUpdateInput = {
    subject: options.data.subject ?? existing.subject,
    description: options.data.description ?? existing.description,
    type: options.data.type ?? existing.type,
    priority: options.data.priority ?? existing.priority,
    channel: options.data.channel ?? existing.channel,
    accountId: options.data.accountId ?? existing.accountId,
    serialNumberId: options.data.serialNumberId ?? existing.serialNumberId,
    assignedToId: options.data.assignedToId ?? existing.assignedToId,
  };

  // Si cambia la prioridad, recalculamos dueAt desde createdAt para no penalizar
  // al técnico.
  if (options.data.priority && options.data.priority !== existing.priority) {
    update.dueAt = calculateDueAt(options.data.priority as TicketPriority, existing.createdAt);
  }

  return db.ticket.update({ where: { id: existing.id }, data: update });
}

export async function transitionTicketStatus(options: { organizationId: string; id: string; target: TicketStatus; resolutionNotes?: string | null }) {
  const db = getDb();
  const existing = await db.ticket.findFirst({ where: { id: options.id, organizationId: options.organizationId, deletedAt: null } });
  if (!existing) return null;

  const allowed = VALID_TRANSITIONS[existing.status as TicketStatus];
  if (!allowed.includes(options.target)) {
    throw new TicketValidationError(`Transición no permitida: ${existing.status} → ${options.target}`);
  }

  const data: Prisma.TicketUncheckedUpdateInput = { status: options.target };
  const now = new Date();

  if (options.target === "open" && !existing.firstResponseAt) {
    data.firstResponseAt = now;
  }
  if (options.target === "solved") {
    data.solvedAt = now;
    if (options.resolutionNotes) data.resolutionNotes = options.resolutionNotes;
  }
  if (options.target === "closed") {
    data.closedAt = now;
    if (!existing.solvedAt) data.solvedAt = now;
  }
  if (options.target === "open" && existing.status === "closed") {
    data.closedAt = null;
  }

  return db.ticket.update({ where: { id: existing.id }, data });
}

export async function addTicketMessage(options: { organizationId: string; id: string; authorType: "user" | "customer" | "system"; data: TicketMessageCreate }) {
  const db = getDb();
  return db.$transaction(async (tx) => {
    const existing = await tx.ticket.findFirst({ where: { id: options.id, organizationId: options.organizationId, deletedAt: null } });
    if (!existing) return null;

    const message = await tx.ticketMessage.create({
      data: {
        ticketId: existing.id,
        authorType: options.authorType,
        authorName: options.data.authorName,
        body: options.data.body,
        internal: options.data.internal,
      },
    });

    // Primer mensaje no-interno de un usuario marca el firstResponseAt
    if (options.authorType === "user" && !options.data.internal && !existing.firstResponseAt) {
      await tx.ticket.update({ where: { id: existing.id }, data: { firstResponseAt: new Date() } });
    }

    return message;
  });
}

export async function assignTicket(options: { organizationId: string; id: string; assignedToId: string | null }) {
  const db = getDb();
  const existing = await db.ticket.findFirst({ where: { id: options.id, organizationId: options.organizationId, deletedAt: null } });
  if (!existing) return null;

  // Validamos que el usuario pertenezca a la organización.
  if (options.assignedToId) {
    const m = await db.membership.findFirst({ where: { userId: options.assignedToId, organizationId: options.organizationId } });
    if (!m) throw new TicketValidationError("El usuario no pertenece a la organización");
  }

  return db.ticket.update({ where: { id: existing.id }, data: { assignedToId: options.assignedToId } });
}
