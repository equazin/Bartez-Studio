"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { AdminPanel, AdminButton } from "../../../components/admin/AdminUI";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4">
      <AdminPanel className="mx-auto w-full max-w-lg p-8 text-center">
        <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-red-50">
          <AlertTriangle className="size-7 text-red-700" />
        </div>
        <h2 className="font-display text-xl font-bold text-slate-950">
          Error en el panel
        </h2>
        <p className="mt-2 text-[13.5px] leading-relaxed text-slate-600">
          Ocurrio un error inesperado en el panel de administracion.
        </p>
        {process.env.NODE_ENV === "development" && (
          <pre className="mt-4 max-h-40 overflow-auto rounded-lg border border-red-200 bg-red-50 p-4 text-left text-xs text-red-800">
            {error.message}
          </pre>
        )}
        <div className="mt-6 flex justify-center gap-3">
          <AdminButton onClick={reset}>Reintentar</AdminButton>
          <AdminButton variant="secondary" asChild>
            <a href="/admin">Ir al inicio</a>
          </AdminButton>
        </div>
      </AdminPanel>
    </div>
  );
}
