import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/db";

export const runtime = "nodejs";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const postId = parseInt(id, 10);
    if (isNaN(postId)) {
      return NextResponse.json({ ok: false, error: "ID inválido" }, { status: 400 });
    }

    const body = await req.json();
    const { title, excerpt, date, cover, metaDescription, readingTime, bodyContent, published } = body;

    const post = await prisma.post.update({
      where: { id: postId },
      data: {
        title,
        excerpt,
        date,
        cover,
        metaDescription,
        readingTime,
        body: bodyContent,
        published: published !== undefined ? published : true,
      },
    });

    return NextResponse.json({ ok: true, post });
  } catch (err) {
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const postId = parseInt(id, 10);
    if (isNaN(postId)) {
      return NextResponse.json({ ok: false, error: "ID inválido" }, { status: 400 });
    }

    await prisma.post.delete({ where: { id: postId } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 500 });
  }
}
