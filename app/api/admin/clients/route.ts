import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const clients = await prisma.clientLogo.findMany({
      orderBy: { displayOrder: "asc" },
    });
    return NextResponse.json({ ok: true, clients });
  } catch (err) {
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, logoUrl, displayOrder, active } = body;

    if (!name || !logoUrl) {
      return NextResponse.json({ ok: false, error: "Nombre y logo URL son requeridos" }, { status: 400 });
    }

    const client = await prisma.clientLogo.create({
      data: {
        name,
        logoUrl,
        displayOrder: displayOrder !== undefined ? parseInt(displayOrder, 10) : 0,
        active: active !== undefined ? active : true,
      },
    });

    return NextResponse.json({ ok: true, client });
  } catch (err) {
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 500 });
  }
}
