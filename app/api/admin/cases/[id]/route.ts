import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/db";

export const runtime = "nodejs";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const caseId = parseInt(id, 10);
    if (isNaN(caseId)) {
      return NextResponse.json({ ok: false, error: "ID inválido" }, { status: 400 });
    }

    const body = await req.json();
    const { title, clientName, logoUrl, coverImage, description, metrics, content, active } = body;

    const successCase = await prisma.successCase.update({
      where: { id: caseId },
      data: {
        title,
        clientName,
        logoUrl,
        coverImage,
        description,
        metrics,
        content,
        active: active !== undefined ? active : undefined,
      },
    });

    return NextResponse.json({ ok: true, successCase });
  } catch (err) {
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const caseId = parseInt(id, 10);
    if (isNaN(caseId)) {
      return NextResponse.json({ ok: false, error: "ID inválido" }, { status: 400 });
    }

    await prisma.successCase.delete({ where: { id: caseId } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 500 });
  }
}
