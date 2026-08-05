"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MessageCircle, Send } from "lucide-react";
import { track } from "@/components/Analytics";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[14px] text-[#11142a] outline-none transition placeholder:text-slate-400 focus:border-[#0046EA] focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60";

type FormState = {
  empresa: string;
  cuit: string;
  nombre: string;
  telefono: string;
  email: string;
  provincia: string;
  tipo: string;
  volumen: string;
  mensaje: string;
  website: string;
};

const initialForm: FormState = {
  empresa: "",
  cuit: "",
  nombre: "",
  telefono: "",
  email: "",
  provincia: "",
  tipo: "Tienda de informática",
  volumen: "Estoy comenzando",
  mensaje: "",
  website: "",
};

function buildDetails(form: FormState): string[] {
  return [
    "Origen: formulario de revendedores",
    `Empresa: ${form.empresa}`,
    form.cuit ? `CUIT: ${form.cuit}` : "",
    `Contacto: ${form.nombre}`,
    `Teléfono: ${form.telefono}`,
    `Email: ${form.email}`,
    form.provincia ? `Provincia / localidad: ${form.provincia}` : "",
    `Tipo de canal: ${form.tipo}`,
    `Volumen estimado: ${form.volumen}`,
    form.mensaje ? `Información adicional: ${form.mensaje}` : "",
  ];
}

async function persistLead(form: FormState): Promise<boolean> {
  try {
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        empresa: form.empresa,
        nombre: form.nombre,
        email: form.email,
        telefono: form.telefono,
        tipoConsulta: "cuenta",
        mensaje: [
          form.mensaje,
          `Tipo de canal: ${form.tipo}`,
          `Volumen estimado: ${form.volumen}`,
          form.cuit ? `CUIT: ${form.cuit}` : "",
          form.provincia ? `Provincia: ${form.provincia}` : "",
        ]
          .filter(Boolean)
          .join("\n"),
        origen: "web-revendedores",
        website: form.website,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function ResellerWhatsAppForm() {
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

    // Abrimos el tab dentro del gesto del usuario para no toparnos con el
    // popup blocker de Safari cuando el POST demora.
    const waTab = mode === "whatsapp" ? window.open("about:blank", "_blank", "noopener,noreferrer") : null;

    setPending(mode);
    setError(null);
    track(mode === "submit" ? "reseller_form_submitted" : "reseller_whatsapp_started", {
      channel_type: form.tipo,
      volume: form.volumen,
    });

    try {
      const persisted = await persistLead(form);

      if (mode === "whatsapp") {
        const waUrl = buildWhatsAppUrl("reseller", buildDetails(form));
        if (waTab && !waTab.closed) waTab.location.href = waUrl;
        else window.location.assign(waUrl);
        return;
      }

      if (!persisted) {
        setError("No pudimos registrar tu consulta. Probá continuar por WhatsApp o escribinos directo.");
        return;
      }
      router.push("/gracias");
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
      className="mt-7 grid gap-4 sm:grid-cols-2"
      aria-label="Formulario de consulta para revendedores"
    >
      <label className="sm:col-span-2">
        <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">Empresa o razón social</span>
        <input required minLength={2} autoComplete="organization" value={form.empresa} onChange={(e) => update("empresa", e.target.value)} className={inputClass} placeholder="Nombre de la empresa" />
      </label>
      <label>
        <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">CUIT (opcional)</span>
        <input value={form.cuit} onChange={(e) => update("cuit", e.target.value)} className={inputClass} placeholder="30-00000000-0" />
      </label>
      <label>
        <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">Provincia y localidad</span>
        <input value={form.provincia} onChange={(e) => update("provincia", e.target.value)} className={inputClass} placeholder="Rosario, Santa Fe" />
      </label>
      <label>
        <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">Nombre</span>
        <input required minLength={2} autoComplete="name" value={form.nombre} onChange={(e) => update("nombre", e.target.value)} className={inputClass} placeholder="Tu nombre" />
      </label>
      <label>
        <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">Teléfono / WhatsApp</span>
        <input required type="tel" autoComplete="tel" value={form.telefono} onChange={(e) => update("telefono", e.target.value)} className={inputClass} placeholder="+54 9 ..." />
      </label>
      <label className="sm:col-span-2">
        <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">
          Email corporativo <span className="text-[#0046EA]">*</span>
        </span>
        <input required type="email" autoComplete="email" value={form.email} onChange={(e) => update("email", e.target.value)} className={inputClass} placeholder="nombre@empresa.com" />
      </label>
      <label>
        <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">Tipo de canal</span>
        <select value={form.tipo} onChange={(e) => update("tipo", e.target.value)} className={inputClass}>
          {[
            "Tienda de informática",
            "Integrador de sistemas",
            "Empresa de servicios IT",
            "Distribuidor regional",
            "Profesional independiente",
          ].map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </label>
      <label>
        <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">Volumen mensual estimado</span>
        <select value={form.volumen} onChange={(e) => update("volumen", e.target.value)} className={inputClass}>
          {["Estoy comenzando", "Hasta 10 unidades", "11 a 30 unidades", "Más de 30 unidades"].map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </label>
      <label className="sm:col-span-2">
        <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">Contanos sobre tu negocio</span>
        <textarea value={form.mensaje} onChange={(e) => update("mensaje", e.target.value)} rows={3} className={`${inputClass} resize-none`} placeholder="Categorías que trabajas, mercado principal o marcas de interés" />
      </label>

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

      {error && (
        <p role="alert" className="sm:col-span-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-800">
          {error}
        </p>
      )}

      <div className="sm:col-span-2 grid gap-3 sm:grid-cols-[1fr_auto]">
        <button
          type="submit"
          disabled={pending !== ""}
          aria-busy={pending === "submit"}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-6 py-3.5 text-[14.5px] font-semibold text-white shadow-[0_16px_32px_-18px_rgba(0,70,234,0.6)] transition hover:-translate-y-0.5 hover:bg-brand-bright disabled:cursor-wait disabled:opacity-80 disabled:hover:translate-y-0"
        >
          {pending === "submit" ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Enviando...
            </>
          ) : (
            <>
              <Send size={17} /> Enviar consulta
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

      <p className="sm:col-span-2 text-center text-[11.5px] text-slate-600">
        Tu consulta queda registrada apenas envíes el formulario. Un asesor de canal te contacta en 24 hs hábiles.
      </p>
    </form>
  );
}
