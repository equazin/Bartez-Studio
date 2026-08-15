"use client";

import { useSearchParams } from "next/navigation";

// Muestra el ID de caso pasado por querystring en /garantias-rma/gracias.
// El ID lo genera el formulario cliente al enviar y sirve como referencia
// para que el usuario lo mencione en respuestas por WhatsApp o email.
export function RmaCaseIdDisplay() {
  const params = useSearchParams();
  const caseId = params.get("caso");

  if (!caseId) return null;

  return (
    <div className="mt-8 inline-flex items-baseline gap-3 rounded-xl border-2 border-[#0046EA] bg-white px-6 py-4">
      <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
        Número de caso
      </span>
      <span className="font-mono text-[18px] font-bold text-[#0046EA]">{caseId}</span>
    </div>
  );
}
