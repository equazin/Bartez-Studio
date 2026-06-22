import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename") || `upload-${Date.now()}.png`;

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    // Fallback local para desarrollo sin token de Vercel Blob
    try {
      const data = await request.arrayBuffer();
      const buffer = Buffer.from(data);
      
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      
      // Asegurar que el directorio de subidas exista
      await fs.mkdir(uploadDir, { recursive: true });
      
      const cleanFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
      const filePath = path.join(uploadDir, cleanFilename);
      await fs.writeFile(filePath, buffer);
      
      return NextResponse.json({
        url: `/uploads/${cleanFilename}`,
        pathname: cleanFilename,
        contentType: request.headers.get("content-type") || "image/png",
      });
    } catch (err) {
      return NextResponse.json({ ok: false, error: `Error de subida local: ${(err as Error).message}` }, { status: 500 });
    }
  }

  // En producción con Vercel Blob activo
  try {
    const data = await request.arrayBuffer();
    const blob = await put(filename, Buffer.from(data), {
      access: "public",
    });
    return NextResponse.json(blob);
  } catch (err) {
    return NextResponse.json({ ok: false, error: `Error de Vercel Blob: ${(err as Error).message}` }, { status: 500 });
  }
}
