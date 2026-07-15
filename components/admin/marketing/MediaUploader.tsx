"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { AdminAlert, AdminButton } from "../AdminUI";

const allowed = new Set(["image/png", "image/jpeg", "image/webp", "image/avif"]);
const maxBytes = 5 * 1024 * 1024;

interface MediaUploaderProps {
  value: readonly string[];
  onChange: (urls: string[]) => void;
  maxItems?: number;
}

/**
 * Sube múltiples imágenes al blob store del admin y devuelve el array de URLs.
 * Reusa /api/admin/upload (mismo endpoint que ImageUpload).
 */
export function MediaUploader({ value, onChange, maxItems = 10 }: MediaUploaderProps) {
  const input = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function upload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError("");
    const capacity = maxItems - value.length;
    if (capacity <= 0) {
      setError(`Máximo ${maxItems} imágenes.`);
      return;
    }
    const selected = Array.from(files).slice(0, capacity);
    for (const file of selected) {
      if (!allowed.has(file.type)) { setError("Formato no permitido (PNG, JPG, WebP, AVIF)."); continue; }
      if (file.size > maxBytes) { setError(`"${file.name}" supera 5 MB.`); continue; }
    }
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of selected) {
        if (!allowed.has(file.type) || file.size > maxBytes) continue;
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.error || "No pudimos subir la imagen.");
        uploaded.push(data.url);
      }
      onChange([...value, ...uploaded]);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploading(false);
      if (input.current) input.current.value = "";
    }
  }

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-wrap gap-2">
        {value.map((url, index) => (
          <div key={url + index} className="relative size-20 overflow-hidden rounded-lg border border-slate-300 bg-white">
            <Image src={url} alt={`Media ${index + 1}`} fill sizes="80px" className="object-cover" />
            <button
              type="button"
              onClick={() => remove(index)}
              className="absolute right-1 top-1 grid size-5 place-items-center rounded-full bg-black/60 text-white hover:bg-black/80"
              aria-label={`Eliminar imagen ${index + 1}`}
            >
              <X className="size-3" />
            </button>
          </div>
        ))}
        {value.length < maxItems ? (
          <AdminButton variant="secondary" size="sm" onClick={() => input.current?.click()} disabled={uploading}>
            {uploading ? <Loader2 className="animate-spin" /> : <ImagePlus />}
            {value.length === 0 ? "Agregar imágenes" : "Agregar más"}
          </AdminButton>
        ) : null}
      </div>
      <input
        ref={input}
        type="file"
        multiple
        accept={[...allowed].join(",")}
        className="hidden"
        onChange={(e) => void upload(e.target.files)}
      />
      <p className="text-[11.5px] text-slate-500">
        {value.length}/{maxItems} imágenes · PNG, JPG, WebP, AVIF · máx. 5 MB c/u
      </p>
      {error ? <AdminAlert>{error}</AdminAlert> : null}
    </div>
  );
}
