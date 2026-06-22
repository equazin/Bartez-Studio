import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";

export const runtime = "nodejs";

// Helper para sanitizar y generar slugs
function generateSlug(title: string) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Eliminar tildes
    .replace(/[^a-z0-9\s-]/g, "") // Eliminar caracteres especiales
    .trim()
    .replace(/\s+/g, "-") // Reemplazar espacios por guiones
    .replace(/-+/g, "-"); // Colapsar guiones repetidos
}

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ ok: true, posts });
  } catch (err) {
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, excerpt, date, cover, metaDescription, readingTime, bodyContent, published } = body;

    if (!title || !excerpt || !date || !cover || !metaDescription || !readingTime || !bodyContent) {
      return NextResponse.json({ ok: false, error: "Faltan campos requeridos" }, { status: 400 });
    }

    const slug = generateSlug(title);
    
    // Verificar unicidad de slug
    const existing = await prisma.post.findUnique({ where: { slug } });
    const finalSlug = existing ? `${slug}-${Date.now().toString().slice(-4)}` : slug;

    const post = await prisma.post.create({
      data: {
        slug: finalSlug,
        title,
        excerpt,
        date,
        cover,
        metaDescription,
        readingTime,
        body: bodyContent, // Array de párrafos/encabezados [{p: "..."}, {h: "..."}]
        published: published !== undefined ? published : true,
      },
    });

    return NextResponse.json({ ok: true, post });
  } catch (err) {
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 500 });
  }
}
