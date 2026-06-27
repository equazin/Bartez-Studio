"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ImageIcon, Loader2, Upload } from "lucide-react";
import { AdminAlert, AdminButton } from "./AdminUI";

const allowed = new Set(["image/png", "image/jpeg", "image/webp", "image/avif"]);
const maxBytes = 5 * 1024 * 1024;

export function ImageUpload({
  value,
  onChange,
  label,
  compact = false,
}: {
  value?: string | null;
  onChange: (url: string) => void;
  label: string;
  compact?: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function upload(file?: File) {
    if (!file) return;
    if (!allowed.has(file.type)) {
      setError("Usá PNG, JPG, WebP o AVIF.");
      return;
    }
    if (file.size > maxBytes) {
      setError("La imagen supera el máximo de 5 MB.");
      return;
    }

    setUploading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "No pudimos subir la imagen.");
      onChange(data.url);
    } catch (uploadError) {
      setError((uploadError as Error).message);
    } finally {
      setUploading(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className={compact ? "flex items-center gap-4" : "flex flex-col gap-3"}>
        <div className={compact ? "relative grid size-20 flex-none place-items-center overflow-hidden rounded-lg border border-slate-400 bg-white" : "relative grid aspect-[16/7] place-items-center overflow-hidden rounded-lg border border-dashed border-slate-400 bg-slate-50"}>
          {value ? <Image src={value} alt="Vista previa de la imagen" fill sizes={compact ? "80px" : "680px"} className={compact ? "object-contain p-2" : "object-cover"} /> : <ImageIcon className="size-7 text-slate-500" />}
        </div>
        <div className="flex flex-col gap-2">
          <input ref={input} type="file" accept="image/png,image/jpeg,image/webp,image/avif" className="sr-only" onChange={(event) => void upload(event.target.files?.[0])} />
          <AdminButton type="button" variant="secondary" size="sm" disabled={uploading} onClick={() => input.current?.click()}>
            {uploading ? <Loader2 className="animate-spin" /> : <Upload />} {uploading ? "Subiendo…" : label}
          </AdminButton>
          <p className="text-[12px] font-medium text-slate-600">PNG, JPG, WebP o AVIF · máximo 5 MB</p>
        </div>
      </div>
      {error ? <AdminAlert>{error}</AdminAlert> : null}
    </div>
  );
}
