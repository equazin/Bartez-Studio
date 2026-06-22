import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server.js";
import { adminServerError, authorizeAdminRequest } from "../../../../lib/admin-api.ts";

export const runtime = "nodejs";
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const extensions = new Map([
  ["image/png", "png"],
  ["image/jpeg", "jpg"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
]);

function detectedMime(bytes: Uint8Array) {
  if (bytes.length >= 8 && bytes.slice(0, 8).every((value, index) => value === [137, 80, 78, 71, 13, 10, 26, 10][index])) return "image/png";
  if (bytes.length >= 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return "image/jpeg";
  if (bytes.length >= 12 && Buffer.from(bytes.slice(0, 4)).toString() === "RIFF" && Buffer.from(bytes.slice(8, 12)).toString() === "WEBP") return "image/webp";
  if (bytes.length >= 12 && Buffer.from(bytes.slice(4, 8)).toString() === "ftyp" && Buffer.from(bytes.slice(8, 12)).toString().startsWith("avi")) return "image/avif";
  return null;
}

export async function POST(request: Request) {
  const auth = await authorizeAdminRequest(request, { mutation: true });
  if (auth.response) return auth.response;

  const declaredMime = request.headers.get("content-type")?.split(";")[0].toLowerCase() || "";
  if (!extensions.has(declaredMime)) {
    return NextResponse.json({ ok: false, error: "Usá una imagen PNG, JPG, WebP o AVIF." }, { status: 415 });
  }
  const contentLength = Number(request.headers.get("content-length") || "0");
  if (contentLength > MAX_FILE_BYTES) {
    return NextResponse.json({ ok: false, error: "La imagen supera el máximo de 5 MB." }, { status: 413 });
  }

  try {
    const data = new Uint8Array(await request.arrayBuffer());
    if (data.byteLength === 0 || data.byteLength > MAX_FILE_BYTES) {
      return NextResponse.json({ ok: false, error: "La imagen está vacía o supera 5 MB." }, { status: 413 });
    }
    if (detectedMime(data) !== declaredMime) {
      return NextResponse.json({ ok: false, error: "El contenido del archivo no coincide con su formato." }, { status: 415 });
    }

    const filename = `admin/${new Date().toISOString().slice(0, 10)}/${randomUUID()}.${extensions.get(declaredMime)}`;
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json({ ok: false, error: "El almacenamiento de imágenes no está configurado." }, { status: 503 });
      }
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadDir, { recursive: true });
      const localName = path.basename(filename);
      await fs.writeFile(path.join(uploadDir, localName), data);
      return NextResponse.json({ ok: true, url: `/uploads/${localName}`, contentType: declaredMime });
    }

    const blob = await put(filename, Buffer.from(data), {
      access: "public",
      contentType: declaredMime,
      addRandomSuffix: false,
    });
    return NextResponse.json({ ok: true, url: blob.url, pathname: blob.pathname, contentType: blob.contentType });
  } catch (error) {
    return adminServerError("upload", error);
  }
}
