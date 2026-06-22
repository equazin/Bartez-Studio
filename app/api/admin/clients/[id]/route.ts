import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/db";

export const runtime = "nodejs";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const clientId = parseInt(id, 10);
    if (isNaN(clientId)) {
      return NextResponse.json({ ok: false, error: "ID inválido" }, { status: 400 });
    }

    const body = await req.json();
    const { name, logoUrl, displayOrder, active } = body;

    const client = await prisma.clientLogo.update({
      where: { id: clientId },
      data: {
        name,
        logoUrl,
        displayOrder: displayOrder !== undefined ? parseInt(displayOrder, 10) : undefined,
        active: active !== undefined ? active : undefined,
      },
    });

    return NextResponse.json({ ok: true, client });
  } catch (err) {
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const clientId = parseInt(id, 10);
    if (isNaN(clientId)) {
      return NextResponse.json({ ok: false, error: "ID inválido" }, { status: 400 });
    }

    await prisma.clientLogo.delete({ where: { id: clientId } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 500 });
  }
}
