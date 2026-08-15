"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MessageCircle, Send } from "lucide-react";
import { track } from "@/components/Analytics";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[14px] text-[#11142a] outline-none transition placeholder:text-slate-400 focus:border-[#0046EA] focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60";

type FormState = {
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;
  fabricante: string;
  modelo: string;
  numeroSerie: string;
  fechaCompra: string;
  facturaNumero: string;
  sintoma: string;
  intentosPrevios: string;
  website: string;
};

const initialForm: FormState = {
  nombre: "",
  empresa: "",
  email: "",
  telefono: "",
  fabricante: "",
  modelo: "",
  numeroSerie: "",
  fechaCompra: "",
  facturaNumero: "",
  sintoma: "",
  intentosPrevios: "",
  website: "",
};

// Genera un identificador de caso corto para que el cliente lo referencie
// en respuestas por email/WhatsApp. NO es un tracker real — es solo un ID
// de referencia. La gestión real vive en el CRM cargado desde /api/lead.
function generateCaseId(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `RMA-${yyyy}${mm}${dd}-${rand}`;
}

function buildRmaDetails(form: FormState, caseId: string): string[] {
  return [
    "Origen: formulario /garantias-rma/nuevo",
    `Caso: ${caseId}`,
    `Contacto: ${form.nombre}`,
    form.empresa ? `Empresa: ${form.empresa}` : "",
    `Email: ${form.email}`,
    form.telefono ? `Teléfono: ${form.telefono}` : "",
    "",
    "Equipo:",
    `- Fabricante: ${form.fabricante}`,
    `- Modelo: ${form.modelo}`,
    `- Número de serie: ${form.numeroSerie}`,
    form.fechaCompra ? `- Fecha de compra: ${form.fechaCompra}` : "",
    form.facturaNumero ? `- Factura: ${form.facturaNumero}` : "",
    "",
    `Síntoma:\n${form.sintoma}`,
    form.intentosPrevios ? `\nIntentos previos:\n${form.intentosPrevios}` : "",
  ];
}

async function persistRmaLead(form: FormState, caseId: string): Promise<boolean> {
  const mensaje = buildRmaDetails(form, caseId).filter(Boolean).join("\n");
  try {
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        empresa: form.empresa || form.nombre,
        nombre: form.nombre,
        email: form.email,
        telefono: form.telefono || undefined,
        tipoConsulta: "asesoramiento",
        mensaje,
        necesidad: `RMA ${form.fabricante} ${form.modelo}`.slice(0, 120),
        escala: `S/N: ${form.numeroSerie}`.slice(0, 80),
        urgencia: "RMA",
        origen: "web-rma",
        website: form.website,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function RmaForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialForm);
  const [pending, setPending] = useState<"" | "submit" | "whatsapp">("");
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    if (error) setError(null);
  };

  async function handleSubmit(mode: "submit" | "whatsapp") {
    if (pending) return;
    const caseId = generateCaseId();
    const waTab = mode === "whatsapp" ? window.open("about:blank", "_blank", "noopener,noreferrer") : null;

    setPending(mode);
    setError(null);
    track(mode === "submit" ? "rma_form_submitted" : "rma_whatsapp_started", {
      fabricante: form.fabricante,
    });

    try {
      const persisted = await persistRmaLead(form, caseId);

      if (mode === "whatsapp") {
        const waUrl = buildWhatsAppUrl("rma", buildRmaDetails(form, caseId));
        if (waTab && !waTab.closed) waTab.location.href = waUrl;
        else window.location.assign(waUrl);
        return;
      }

      if (!persisted) {
        setError("No pudimos registrar el caso. Probá por WhatsApp o escribinos al email de ventas.");
        return;
      }
      router.push(`/garantias-rma/gracias?caso=${encodeURIComponent(caseId)}`);
    } finally {
      setPending("");
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void handleSubmit("submit");
      }}
      className="grid gap-4 sm:grid-cols-2"
      aria-label="Iniciar caso de RMA"
    >
      <div className="sm:col-span-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-[12.5px] leading-relaxed text-slate-700">
        <strong className="font-bold text-[#0046EA]">Antes de enviar:</strong> tené a mano el número de serie del equipo, factura de compra (o al menos fecha aproximada) y una descripción clara del síntoma. Todo lo que no tengas ahora lo podemos completar por WhatsApp o email después.
      </div>

      <fieldset className="sm:col-span-2 mt-2">
        <legend className="mb-3 text-[12px] font-bold uppercase tracking-[0.08em] text-slate-500">
          Contacto
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <label>
            <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">Nombre <span className="text-[#0046EA]">*</span></span>
            <input required minLength={2} autoComplete="name" value={form.nombre} onChange={(e) => update("nombre", e.target.value)} className={inputClass} placeholder="Tu nombre" />
          </label>
          <label>
            <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">Empresa</span>
            <input autoComplete="organization" value={form.empresa} onChange={(e) => update("empresa", e.target.value)} className={inputClass} placeholder="Razón social o nombre" />
          </label>
          <label>
            <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">Email <span className="text-[#0046EA]">*</span></span>
            <input required type="email" autoComplete="email" value={form.email} onChange={(e) => update("email", e.target.value)} className={inputClass} placeholder="nombre@empresa.com" />
          </label>
          <label>
            <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">Teléfono / WhatsApp</span>
            <input type="tel" autoComplete="tel" value={form.telefono} onChange={(e) => update("telefono", e.target.value)} className={inputClass} placeholder="+54 9 341 555 1234" />
          </label>
        </div>
      </fieldset>

      <fieldset className="sm:col-span-2 mt-2">
        <legend className="mb-3 text-[12px] font-bold uppercase tracking-[0.08em] text-slate-500">
          Equipo
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <label>
            <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">Fabricante <span className="text-[#0046EA]">*</span></span>
            <input required list="rma-brands" value={form.fabricante} onChange={(e) => update("fabricante", e.target.value)} className={inputClass} placeholder="Lenovo, Dell, HP, HPE, Cisco…" />
            <datalist id="rma-brands">
              <option value="Lenovo" />
              <option value="Dell" />
              <option value="HP" />
              <option value="HPE" />
              <option value="Cisco" />
              <option value="Aruba" />
              <option value="Ubiquiti" />
              <option value="APC" />
              <option value="Kingston" />
              <option value="WD" />
              <option value="Otro" />
            </datalist>
          </label>
          <label>
            <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">Modelo <span className="text-[#0046EA]">*</span></span>
            <input required value={form.modelo} onChange={(e) => update("modelo", e.target.value)} className={inputClass} placeholder="ThinkPad T14, PowerEdge R750…" />
          </label>
          <label>
            <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">Número de serie <span className="text-[#0046EA]">*</span></span>
            <input required value={form.numeroSerie} onChange={(e) => update("numeroSerie", e.target.value)} className={inputClass} placeholder="S/N o Service Tag del equipo" />
          </label>
          <label>
            <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">Fecha de compra (aproximada)</span>
            <input type="date" value={form.fechaCompra} onChange={(e) => update("fechaCompra", e.target.value)} className={inputClass} />
          </label>
          <label className="sm:col-span-2">
            <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">Número de factura (opcional)</span>
            <input value={form.facturaNumero} onChange={(e) => update("facturaNumero", e.target.value)} className={inputClass} placeholder="Nro de factura de Bartez o distribuidor" />
          </label>
        </div>
      </fieldset>

      <fieldset className="sm:col-span-2 mt-2">
        <legend className="mb-3 text-[12px] font-bold uppercase tracking-[0.08em] text-slate-500">
          Descripción del problema
        </legend>
        <div className="grid gap-4">
          <label>
            <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">Síntoma <span className="text-[#0046EA]">*</span></span>
            <textarea required value={form.sintoma} onChange={(e) => update("sintoma", e.target.value)} rows={4} className={`${inputClass} resize-none`} placeholder="Qué falla, desde cuándo, en qué condiciones (siempre / a veces / bajo carga / al encender)" />
          </label>
          <label>
            <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">Intentos previos (opcional)</span>
            <textarea value={form.intentosPrevios} onChange={(e) => update("intentosPrevios", e.target.value)} rows={2} className={`${inputClass} resize-none`} placeholder="Reinicios, cambio de cable, actualizaciones probadas…" />
          </label>
        </div>
      </fieldset>

      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        value={form.website}
        onChange={(e) => update("website", e.target.value)}
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        aria-hidden="true"
      />

      {error ? (
        <p role="alert" className="sm:col-span-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-800">
          {error}
        </p>
      ) : null}

      <div className="sm:col-span-2 mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
        <button
          type="submit"
          disabled={pending !== ""}
          aria-busy={pending === "submit"}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-6 py-3.5 text-[14.5px] font-semibold text-white shadow-[0_16px_32px_-18px_rgba(0,70,234,0.6)] transition hover:-translate-y-0.5 hover:bg-brand-bright disabled:cursor-wait disabled:opacity-80"
        >
          {pending === "submit" ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Registrando caso...
            </>
          ) : (
            <>
              <Send size={17} /> Registrar caso de RMA
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => void handleSubmit("whatsapp")}
          disabled={pending !== ""}
          aria-busy={pending === "whatsapp"}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#10B981] bg-white px-6 py-3.5 text-[14.5px] font-semibold text-[#047857] transition hover:border-[#047857] hover:bg-[#ECFDF5] disabled:cursor-wait disabled:opacity-80"
        >
          {pending === "whatsapp" ? <Loader2 size={18} className="animate-spin" /> : <MessageCircle size={18} />}
          Continuar por WhatsApp
        </button>
      </div>

      <p className="sm:col-span-2 text-center text-[11.5px] leading-relaxed text-slate-600">
        Recibirás un número de caso al enviar. Respondemos en 48 hs hábiles con la evaluación inicial.
      </p>
    </form>
  );
}
