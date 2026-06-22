import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const cases = await prisma.successCase.findMany({
      orderBy: { id: "desc" },
    });
    return NextResponse.json({ ok: true, cases });
  } catch (err) {
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, clientName, logoUrl, coverImage, description, metrics, content, active } = body;

    if (!title || !clientName || !coverImage || !description || !metrics || !content) {
      return NextResponse.json({ ok: false, error: "Faltan campos obligatorios" }, { status: 400 });
    }

    const newCase = await prisma.successCase.create({
      data: {
        title,
        clientName,
        logoUrl,
        coverImage,
        description,
        metrics, // Array de strings (ej: ["+15% rendimiento", "100% uptime"])
        content, // Texto completo del caso
        active: active !== undefined ? active : true,
      },
    });

    return NextResponse.json({ ok: true, successCase: newCase });
  } catch (err) {
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 500 });
  }
}
