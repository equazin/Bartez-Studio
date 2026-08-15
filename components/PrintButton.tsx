"use client";

import { Download } from "lucide-react";

export function PrintButton({ label = "Guardar como PDF" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-lg bg-[linear-gradient(90deg,#ff7a18,#ff8f1f,#ffb000)] px-5 py-2.5 text-[13.5px] font-bold text-white shadow-[0_16px_32px_-18px_rgba(255,122,24,0.9)] transition hover:-translate-y-0.5 print:hidden"
    >
      <Download size={15} /> {label}
    </button>
  );
}
