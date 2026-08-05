"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MessageCircle, Send } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const businessTypes = [
  "Minisuper / autoservicio",
  "Despensa / almacén",
  "Panadería",
  "Bar / gastronomía",
  "Mayorista / distribuidor",
  "Otro comercio",
];

const roles = [
  "Quiero equipar mi negocio",
  "Quiero revender BarPOS",
  "Tengo varias sucursales",
];

const quantities = [
  "1 punto de venta",
  "2 a 3 puntos de venta",
  "4 o más puntos de venta",
  "Red de distribuidores",
];

const implementationOptions = [
  "Sí, necesito instalación e implementación",
  "Solo quiero cotizar el equipamiento",
  "Quiero consultar condiciones para revender",
];

type FormState = {
  name: string;
  business: string;
  phone: string;
  email: string;
  city: string;
  role: string;
  quantity: string;
  businessType: string;
  needsImplementation: string;
  notes: string;
  website: string;
};

const initialForm: FormState = {
  name: "",
  business: "",
  phone: "",
  email: "",
  city: "",
  role: roles[0],
  quantity: quantities[0],
  businessType: businessTypes[0],
  needsImplementation: implementationOptions[0],
  notes: "",
  website: "",
};

function buildDetails(form: FormState): string[] {
  return [
    `Nombre: ${form.name}`,
    form.business ? `Comercio: ${form.business}` : "",
    `Teléfono / WhatsApp: ${form.phone}`,
    `Email: ${form.email}`,
    `Perfil: ${form.role}`,
    `Rubro: ${form.businessType}`,
    form.city ? `Localidad/provincia: ${form.city}` : "Localidad/provincia: a confirmar",
    `Cantidad estimada: ${form.quantity}`,
    `Instalación: ${form.needsImplementation}`,
    form.notes ? `Comentario: ${form.notes}` : "",
    "Origen: landing BarPOS 4.0",
  ];
}

async function persistLead(form: FormState): Promise<boolean> {
  try {
    // El schema requiere empresa. Preferimos el nombre del comercio; si el
    // usuario no lo dio (campo opcional en la landing de consumo final),
    // caemos al nombre del contacto para que el lead no se pierda por
    // validación. Ciudad va SIEMPRE al mensaje, no al campo empresa —
    // contaminaba la calidad del dato en el CRM.
    const empresa = form.business.trim() || form.name.trim();
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        empresa,
        nombre: form.name,
        email: form.email,
        telefono: form.phone,
        tipoConsulta: form.role === "Quiero revender BarPOS" ? "cuenta" : "cotizacion",
        mensaje: [
          `Perfil: ${form.role}`,
          `Rubro: ${form.businessType}`,
          `Cantidad estimada: ${form.quantity}`,
          `Instalación: ${form.needsImplementation}`,
          form.city ? `Localidad/provincia: ${form.city}` : "",
          form.notes ? `\n${form.notes}` : "",
        ]
          .filter(Boolean)
          .join("\n"),
        origen: "web-barpos",
        website: form.website,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

const fieldClass =
  "w-full min-w-0 rounded-lg border border-slate-200 bg-white px-3 py-3 text-[14px] font-medium normal-case tracking-normal text-ink outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60";
const labelClass = "grid min-w-0 gap-2 text-[11px] font-bold uppercase tracking-[0.11em] text-slate-500";

export function BarposWhatsAppForm() {
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

    // Ver ContactWhatsAppForm: el tab se abre dentro del gesto del click,
    // no después del await, para eludir el popup blocker de Safari.
    const waTab = mode === "whatsapp" ? window.open("about:blank", "_blank", "noopener,noreferrer") : null;

    setPending(mode);
    setError(null);

    try {
      const persisted = await persistLead(form);

      if (mode === "whatsapp") {
        const waUrl = buildWhatsAppUrl("barpos", buildDetails(form));
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
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          Nombre y apellido *
          <input required minLength={2} autoComplete="name" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Nombre y apellido" className={fieldClass} />
        </label>
        <label className={labelClass}>
          Nombre del comercio
          <input autoComplete="organization" value={form.business} onChange={(e) => update("business", e.target.value)} placeholder="Ej: Panadería La Central" className={fieldClass} />
        </label>
        <label className={labelClass}>
          Teléfono / WhatsApp *
          <input required type="tel" autoComplete="tel" pattern="[0-9+\s\-()]{7,20}" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="Teléfono / WhatsApp" className={fieldClass} />
        </label>
        <label className={labelClass}>
          Email *
          <input required type="email" autoComplete="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="Email" className={fieldClass} />
        </label>
        <label className={labelClass}>
          Localidad y provincia *
          <input required value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="Localidad y provincia" className={fieldClass} />
        </label>
        <label className={labelClass}>
          Tipo de consulta
          <select value={form.role} onChange={(e) => update("role", e.target.value)} className={fieldClass}>
            {roles.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className={labelClass}>
          Cantidad estimada
          <select value={form.quantity} onChange={(e) => update("quantity", e.target.value)} className={fieldClass}>
            {quantities.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className={labelClass}>
          Rubro
          <select value={form.businessType} onChange={(e) => update("businessType", e.target.value)} className={fieldClass}>
            {businessTypes.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className={labelClass}>
          Implementación
          <select value={form.needsImplementation} onChange={(e) => update("needsImplementation", e.target.value)} className={fieldClass}>
            {implementationOptions.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className={`${labelClass} sm:col-span-2`}>
          Comentanos tu necesidad (opcional)
          <textarea rows={4} value={form.notes} onChange={(e) => update("notes", e.target.value)} placeholder="Ej: necesito factura A, formas de pago, entrega en zona, integración con controladora fiscal..." className={`${fieldClass} resize-none`} />
        </label>
      </div>

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
        <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-800">
          {error}
        </p>
      )}

      <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
        <button
          type="submit"
          disabled={pending !== ""}
          aria-busy={pending === "submit"}
          className="inline-flex min-h-14 items-center justify-center gap-2 rounded-lg bg-brand px-6 py-3.5 text-[14.5px] font-semibold text-white shadow-[0_16px_32px_-18px_rgba(0,70,234,0.6)] transition hover:-translate-y-0.5 hover:bg-brand-bright disabled:cursor-wait disabled:opacity-80 disabled:hover:translate-y-0"
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
          className="inline-flex min-h-14 items-center justify-center gap-2 rounded-lg border border-[#10B981] bg-white px-6 py-3.5 text-[14.5px] font-semibold text-[#047857] transition hover:border-[#047857] hover:bg-[#ECFDF5] disabled:cursor-wait disabled:opacity-80"
        >
          {pending === "whatsapp" ? <Loader2 size={18} className="animate-spin" /> : <MessageCircle size={18} />}
          Continuar por WhatsApp
        </button>
      </div>

      <p className="mt-4 text-[11.5px] leading-relaxed text-slate-500">
        Tu consulta queda registrada apenas envíes el formulario. Un asesor te contacta en 24 hs hábiles.
      </p>
    </form>
  );
}
