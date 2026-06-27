"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <div className="mx-auto max-w-md">
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-[#1236d8]/10">
          <AlertTriangle className="size-8 text-[#1236d8]" />
        </div>
        <h2 className="font-display text-2xl font-bold text-[#11142a]">
          Algo salio mal
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
          Ocurrio un error inesperado. Por favor, intenta nuevamente.
        </p>
        {process.env.NODE_ENV === "development" && (
          <pre className="mt-4 max-h-40 overflow-auto rounded-lg bg-slate-100 p-4 text-left text-xs text-red-700">
            {error.message}
          </pre>
        )}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="inline-flex h-11 items-center justify-center rounded-lg bg-[#1236d8] px-6 text-[14px] font-bold text-white transition-colors hover:bg-[#0f2fb8]"
          >
            Reintentar
          </button>
          {/* Recarga completa a propósito: resetea el estado roto del error boundary. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-6 text-[14px] font-bold text-[#11142a] transition-colors hover:bg-slate-50"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    </div>
  );
}
