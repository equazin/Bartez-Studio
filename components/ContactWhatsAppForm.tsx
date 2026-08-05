"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MessageCircle, Send } from "lucide-react";
import { track } from "@/components/Analytics";
import { buildWhatsAppUrl, type WhatsAppIntent } from "@/lib/whatsapp";

// Los temas que ve el usuario y su mapeo al schema del CRM.
// tipoConsulta cae en uno de tres valores permitidos por lib/schema.ts.
// El intent decide a qué número de WhatsApp abrir y con qué opener.
const topics = [
  { label: "Cotización de equipos",     tipo: "cotizacion",    intent: "quote"    as WhatsAppIntent },
  { label: "Programa de revendedores",  tipo: "cuenta",        intent: "reseller" as WhatsAppIntent },
  { label: "Garantía / RMA",            tipo: "asesoramiento", intent: "rma"      as WhatsAppIntent },
  { label: "Educación",                 tipo: "asesoramiento", intent: "general"  as WhatsAppIntent },
  { label: "Sector público",            tipo: "asesoramiento", intent: "general"  as WhatsAppIntent },
  { label: "Servicios IT",              tipo: "asesoramiento", intent: "general"  as WhatsAppIntent },
  { label: "Otro",                      tipo: "asesoramiento", intent: "general"  as WhatsAppIntent },
] as const;

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[14px] text-[#11142a] outline-none transition placeholder:text-slate-400 focus:border-[#0046EA] focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60";

type FormState = {
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;
  provincia: string;
  tema: string;
  mensaje: string;
  website: string;
};

const initialForm: FormState = {
  nombre: "",
  empresa: "",
  email: "",
  telefono: "",
  provincia: "",
  tema: topics[0].label,
  mensaje: "",
  website: "",
};

function buildWhatsAppDetails(form: FormState): string[] {
  return [
    "Origen: pagina de contacto",
    `Tema: ${form.tema}`,
    `Nombre: ${form.nombre}`,
    form.empresa ? `Empresa: ${form.empresa}` : "",
    `Email: ${form.email}`,
    form.telefono ? `Teléfono: ${form.telefono}` : "",
    form.provincia ? `Provincia / localidad: ${form.provincia}` : "",
    `Consulta: ${form.mensaje}`,
  ];
}

async function persistLead(form: FormState, topic: (typeof topics)[number]): Promise<boolean> {
  try {
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        empresa: form.empresa || form.nombre, // el schema requiere empresa; caemos al nombre si no la dio
        nombre: form.nombre,
        email: form.email,
        telefono: form.telefono || undefined,
        tipoConsulta: topic.tipo,
        mensaje: form.mensaje,
        origen: "web-contacto",
        website: form.website,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function ContactWhatsAppForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialForm);
  const [pending, setPending] = useState<"" | "submit" | "whatsapp">("");
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    if (error) setError(null); // limpia el banner tras la primera corrección del usuario
  };

  const topic = topics.find((t) => t.label === form.tema) ?? topics[0];

  async function handleSubmit(mode: "submit" | "whatsapp") {
    if (pending) return;

    // Safari (y Chrome/Firefox endurecidos) bloquean window.open si no es
    // consecuencia directa del gesto del usuario. Abrimos el tab AHORA con
    // about:blank y le seteamos la URL después del await; si el navegador lo
    // bloquea igual, caemos a location.assign en el mismo tab.
    const waTab = mode === "whatsapp" ? window.open("about:blank", "_blank", "noopener,noreferrer") : null;

    setPending(mode);
    setError(null);
    track(mode === "submit" ? "contact_form_submitted" : "contact_whatsapp_started", { topic: form.tema });

    try {
      const persisted = await persistLead(form, topic);

      if (mode === "whatsapp") {
        const waUrl = buildWhatsAppUrl(topic.intent, buildWhatsAppDetails(form));
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
      aria-label="Preparar consulta"
    >
      <label>
        <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">Nombre</span>
        <input required minLength={2} autoComplete="name" value={form.nombre} onChange={(e) => update("nombre", e.target.value)} className={inputClass} placeholder="Tu nombre" />
      </label>
      <label>
        <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">Empresa</span>
        <input autoComplete="organization" value={form.empresa} onChange={(e) => update("empresa", e.target.value)} className={inputClass} placeholder="Nombre de la empresa" />
      </label>
      <label>
        <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">
          Email <span className="text-[#0046EA]">*</span>
        </span>
        <input required type="email" autoComplete="email" value={form.email} onChange={(e) => update("email", e.target.value)} className={inputClass} placeholder="nombre@empresa.com" />
      </label>
      <label>
        <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">Teléfono (opcional)</span>
        <input type="tel" autoComplete="tel" value={form.telefono} onChange={(e) => update("telefono", e.target.value)} className={inputClass} placeholder="+54 9 341 555 1234" />
      </label>
      <label className="sm:col-span-2">
        <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">Provincia y localidad</span>
        <input value={form.provincia} onChange={(e) => update("provincia", e.target.value)} className={inputClass} placeholder="Rosario, Santa Fe" />
      </label>
      <label className="sm:col-span-2">
        <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">¿Sobre qué querés consultar?</span>
        <select value={form.tema} onChange={(e) => update("tema", e.target.value)} className={inputClass}>
          {topics.map((t) => (
            <option key={t.label}>{t.label}</option>
          ))}
        </select>
      </label>
      <label className="sm:col-span-2">
        <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">Mensaje</span>
        <textarea required value={form.mensaje} onChange={(e) => update("mensaje", e.target.value)} rows={4} className={`${inputClass} resize-none`} placeholder="Necesidad, cantidades, plazo o contexto" />
      </label>

      {/* Honeypot: campo invisible que solo llenan los bots. */}
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

      <p className="sm:col-span-2 text-center text-[11.5px] leading-relaxed text-slate-600">
        Tu consulta queda registrada apenas envíes el formulario. Respondemos en 24 hs hábiles.
      </p>
    </form>
  );
}
