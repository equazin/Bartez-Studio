"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  HardHat,
  Landmark,
  Loader2,
  MessageCircle,
  Package,
  Send,
  ShieldQuestion,
  type LucideIcon,
} from "lucide-react";
import { track } from "@/components/Analytics";
import { buildWhatsAppUrl, type WhatsAppIntent } from "@/lib/whatsapp";

type Intent = "chooser" | "puntual" | "otros";

type Topic = {
  label: string;
  tipo: "cotizacion" | "cuenta" | "asesoramiento";
  intent: WhatsAppIntent;
};

const puntualTopics: Topic[] = [
  { label: "Cotización de equipos", tipo: "cotizacion", intent: "quote" },
  { label: "Consulta técnica / asesoramiento", tipo: "asesoramiento", intent: "general" },
  { label: "Servicios IT", tipo: "asesoramiento", intent: "services" },
];

const otrosTopics: Topic[] = [
  { label: "Programa de revendedores", tipo: "cuenta", intent: "reseller" },
  { label: "Garantía / RMA", tipo: "asesoramiento", intent: "rma" },
  { label: "Educación", tipo: "asesoramiento", intent: "education" },
  { label: "Otro", tipo: "asesoramiento", intent: "general" },
];

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

function initialForm(topics: Topic[]): FormState {
  return {
    nombre: "",
    empresa: "",
    email: "",
    telefono: "",
    provincia: "",
    tema: topics[0].label,
    mensaje: "",
    website: "",
  };
}

function buildWhatsAppDetails(form: FormState, intentLabel: string): string[] {
  return [
    `Origen: pagina de contacto (${intentLabel})`,
    `Tema: ${form.tema}`,
    `Nombre: ${form.nombre}`,
    form.empresa ? `Empresa: ${form.empresa}` : "",
    `Email: ${form.email}`,
    form.telefono ? `Teléfono: ${form.telefono}` : "",
    form.provincia ? `Provincia / localidad: ${form.provincia}` : "",
    `Consulta: ${form.mensaje}`,
  ];
}

async function persistLead(form: FormState, topic: Topic, intent: Intent): Promise<boolean> {
  try {
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        empresa: form.empresa || form.nombre,
        nombre: form.nombre,
        email: form.email,
        telefono: form.telefono || undefined,
        tipoConsulta: topic.tipo,
        mensaje: form.mensaje,
        origen: intent === "otros" ? "web-contacto-otros" : "web-contacto-puntual",
        website: form.website,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

const choices: {
  key: "puntual" | "proyecto" | "gobierno" | "otros";
  icon: LucideIcon;
  title: string;
  subtitle: string;
  hint: string;
}[] = [
  {
    key: "puntual",
    icon: Package,
    title: "Consulta de producto puntual",
    subtitle: "Necesito un equipo, materiales, un accesorio o una consulta técnica breve.",
    hint: "Respuesta por WhatsApp o email",
  },
  {
    key: "proyecto",
    icon: HardHat,
    title: "Proyecto corporativo",
    subtitle: "Renovación de parque, infraestructura, multi-sede o integración con instalación.",
    hint: "Formulario de cotización de proyecto",
  },
  {
    key: "gobierno",
    icon: Landmark,
    title: "Sector público / licitación",
    subtitle: "Cotización para organismo, pliego, compra directa o contratación formal.",
    hint: "Formulario con validez de oferta y retenciones",
  },
  {
    key: "otros",
    icon: ShieldQuestion,
    title: "Otros (revendedor, RMA, educación)",
    subtitle: "Programa de revendedores, garantía, instituciones educativas y otras consultas.",
    hint: "Formulario según tema",
  },
];

export function ContactWhatsAppForm() {
  const router = useRouter();
  const [intent, setIntent] = useState<Intent>("chooser");
  const [form, setForm] = useState<FormState>(initialForm(puntualTopics));
  const [pending, setPending] = useState<"" | "submit" | "whatsapp">("");
  const [error, setError] = useState<string | null>(null);

  const topics = intent === "otros" ? otrosTopics : puntualTopics;
  const topic = topics.find((t) => t.label === form.tema) ?? topics[0];

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    if (error) setError(null);
  };

  function goTo(key: "puntual" | "proyecto" | "gobierno" | "otros") {
    track("contact_intent_selected", { intent: key });
    if (key === "proyecto") {
      router.push("/rfq?origen=proyecto");
      return;
    }
    if (key === "gobierno") {
      router.push("/rfq?origen=gobierno");
      return;
    }
    const nextTopics = key === "otros" ? otrosTopics : puntualTopics;
    setForm(initialForm(nextTopics));
    setError(null);
    setIntent(key);
  }

  async function handleSubmit(mode: "submit" | "whatsapp") {
    if (pending) return;

    const waTab = mode === "whatsapp" ? window.open("about:blank", "_blank", "noopener,noreferrer") : null;

    setPending(mode);
    setError(null);
    track(mode === "submit" ? "contact_form_submitted" : "contact_whatsapp_started", {
      topic: form.tema,
      intent,
    });

    try {
      const persisted = await persistLead(form, topic, intent);

      if (mode === "whatsapp") {
        const waUrl = buildWhatsAppUrl(topic.intent, buildWhatsAppDetails(form, intent));
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

  if (intent === "chooser") {
    return (
      <div className="mt-7">
        <p className="text-[13px] font-semibold uppercase tracking-[0.1em] text-slate-500">
          ¿Qué te acerca?
        </p>
        <p className="mt-2 text-[14px] leading-relaxed text-slate-600">
          Elegí el tipo de consulta para que el mensaje llegue al equipo indicado con la información correcta desde el inicio.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {choices.map((choice) => (
            <button
              type="button"
              key={choice.key}
              onClick={() => goTo(choice.key)}
              className="group flex flex-col rounded-xl border border-slate-200 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_18px_40px_-30px_rgba(0,70,234,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
            >
              <span className="grid size-10 place-items-center rounded-lg border border-blue-100 bg-blue-50 text-[#0046EA]">
                <choice.icon size={18} strokeWidth={1.8} />
              </span>
              <h3 className="mt-4 font-display text-[16px] font-semibold text-[#11142a]">
                {choice.title}
              </h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600">
                {choice.subtitle}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-bold text-[#0046EA]">
                {choice.hint} <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const intentLabel =
    intent === "puntual" ? "consulta puntual" : "otros";

  return (
    <div className="mt-7">
      <button
        type="button"
        onClick={() => {
          setIntent("chooser");
          setForm(initialForm(puntualTopics));
          setError(null);
        }}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12.5px] font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
      >
        <ArrowLeft size={13} /> Cambiar tipo de consulta
      </button>
      <p className="mt-3 text-[13px] font-semibold text-slate-700">
        {intent === "puntual" ? "Consulta de producto puntual" : "Otras consultas (revendedor, RMA, educación)"}
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void handleSubmit("submit");
        }}
        className="mt-5 grid gap-4 sm:grid-cols-2"
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
          <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">Tema</span>
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
          Tu consulta queda registrada apenas envíes el formulario ({intentLabel}). Respondemos en 24 hs hábiles.
        </p>
      </form>
    </div>
  );
}
