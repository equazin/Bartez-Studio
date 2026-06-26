"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

type TourStep = {
  title: string;
  description: string;
};

type TourConfig = {
  tourKey: string;
  steps: TourStep[];
};

const TOURS: Record<string, TourConfig> = {
  "/admin/leads": {
    tourKey: "tour_leads_v1",
    steps: [
      { title: "Gestión de Leads", description: "Acá vas a ver todos los contactos y oportunidades comerciales que llegan al sistema. Podés filtrar por estado, buscar por empresa y exportar a CSV." },
      { title: "Pipeline de estados", description: "Cada lead avanza por estados: Nuevo → Contactado → Calificado → Propuesta → Cerrado. Cambiá el estado desde el detalle de cada lead." },
      { title: "Convertir a cuenta", description: "Cuando un lead avanza, podés convertirlo en una Cuenta y Contacto desde el menú de acciones. Esto lo mueve al módulo CRM." },
    ],
  },
  "/admin/quotes": {
    tourKey: "tour_quotes_v1",
    steps: [
      { title: "Presupuestos", description: "Desde acá creás y gestionás presupuestos para tus clientes. Cada presupuesto se numeran automáticamente y puede convertirse en un Pedido de Venta." },
      { title: "PDF y envío", description: "Podés descargar el PDF del presupuesto y enviarlo por email o WhatsApp directamente desde el sistema." },
    ],
  },
  "/admin/stock": {
    tourKey: "tour_stock_v1",
    steps: [
      { title: "Control de Stock", description: "Acá ves el stock en tiempo real por depósito. Los ítems con fondo rojo están por debajo del punto de reorden y necesitan reposición." },
      { title: "Punto de reorden", description: "Configurá el punto de reorden de cada producto para recibir alertas automáticas cuando el stock baja de ese nivel." },
    ],
  },
  "/admin/invoices": {
    tourKey: "tour_invoices_v1",
    steps: [
      { title: "Facturación AFIP", description: "Las facturas se emiten electrónicamente vía AFIP con CAE. Cada factura genera automáticamente un movimiento en la cuenta corriente del cliente." },
      { title: "Tipos de comprobante", description: "Podés emitir Factura A, B, C, Nota de Crédito y Nota de Débito. El tipo se determina según la condición tributaria del cliente." },
    ],
  },
};

export function OnboardingTour({ pathname }: { pathname: string }) {
  const config = TOURS[pathname];
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!config) return;
    const seen = localStorage.getItem(config.tourKey);
    if (!seen) setVisible(true);
  }, [config]);

  if (!config || !visible) return null;

  const currentStep = config.steps[step];
  const isLast = step === config.steps.length - 1;

  function dismiss() {
    localStorage.setItem(config.tourKey, "1");
    setVisible(false);
  }

  function next() {
    if (isLast) { dismiss(); return; }
    setStep((s) => s + 1);
  }

  return (
    <div className="fixed bottom-6 left-1/2 z-50 w-[min(420px,calc(100vw-32px))] -translate-x-1/2 rounded-xl border border-brand/30 bg-[#0d1120] p-5 shadow-2xl ring-1 ring-white/[0.06]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-sky-400">
              Paso {step + 1} de {config.steps.length}
            </span>
          </div>
          <h3 className="text-[15px] font-bold text-white">{currentStep.title}</h3>
          <p className="mt-1.5 text-[13px] leading-relaxed text-slate-400">{currentStep.description}</p>
        </div>
        <button
          onClick={dismiss}
          className="flex h-6 w-6 flex-none items-center justify-center rounded-md text-slate-500 hover:text-white"
        >
          <X className="size-3.5" />
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        {/* Step dots */}
        <div className="flex gap-1.5">
          {config.steps.map((_, i) => (
            <span
              key={i}
              className={`block size-1.5 rounded-full transition-colors ${i === step ? "bg-sky-400" : "bg-white/20"}`}
            />
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={dismiss}
            className="h-7 rounded-md px-3 text-[12px] font-semibold text-slate-500 hover:text-white"
          >
            Omitir
          </button>
          <button
            onClick={next}
            className="h-7 rounded-md bg-brand/20 px-3 text-[12px] font-bold text-sky-300 hover:bg-brand/30"
          >
            {isLast ? "Entendido" : "Siguiente"}
          </button>
        </div>
      </div>
    </div>
  );
}
