"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, MapPin, Phone, Mail, Clock, Loader2 } from "lucide-react";
import { contactSection, contact, company } from "../../constants";
import { Map } from "../Map";

const initial = {
  empresa: "",
  nombre: "",
  email: "",
  telefono: "",
  tipoConsulta: "cotizacion",
  mensaje: "",
  agendarReunion: false,
  website: "", // honeypot
};

export function Contact() {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  const update = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setStatus("error");
        setError(data?.error || "No pudimos enviar tu consulta. Probá de nuevo.");
        return;
      }
      router.push("/gracias");
    } catch {
      setStatus("error");
      setError("Error de conexión. Probá de nuevo o escribinos por WhatsApp.");
    }
  }

  const info = [
    { icon: MapPin, title: company.address, sub: `${company.province}, ${company.country}` },
    { icon: Phone, title: "WhatsApp comercial", sub: contact.phoneDisplay },
    { icon: Mail, title: contact.email, sub: "Atención B2B dedicada" },
    { icon: Clock, title: contact.hours, sub: company.taxCondition },
  ];

  return (
    <section id="contacto" className="relative scroll-mt-20 overflow-hidden bg-verde-deep py-28 text-white">
      <div className="pointer-events-none absolute -bottom-52 -left-40 h-[600px] w-[600px] rounded-full blur-2xl" style={{ background: "radial-gradient(circle, rgba(34,197,94,.14), transparent 65%)" }} aria-hidden />
      <div className="relative z-10 mx-auto grid max-w-[1200px] gap-14 px-7 md:grid-cols-[.85fr_1.15fr]">
        <div>
          <span className="font-serif text-[15px] text-bronce">{contactSection.num} — {contactSection.eyebrow}</span>
          <h2 className="mt-4 font-serif text-[clamp(34px,4.4vw,54px)] leading-[1.05] tracking-[-0.02em] text-balance">{contactSection.title}</h2>
          <p className="mt-4 max-w-[38ch] text-[16px] text-white/70">{contactSection.lead}</p>

          <div className="mt-9 flex flex-col gap-5">
            {info.map((r) => (
              <div key={r.title} className="flex items-start gap-3.5">
                <span className="grid h-[42px] w-[42px] flex-none place-items-center rounded-xl border border-bronce/30 bg-white/5 text-verde-acento">
                  <r.icon size={18} />
                </span>
                <div>
                  <b className="block text-[15px]">{r.title}</b>
                  <span className="text-[13.5px] text-white/60">{r.sub}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
            <Map />
          </div>
        </div>

        <form onSubmit={onSubmit} className="rounded-3xl bg-crema/97 p-8 text-texto" noValidate>
          <h3 className="font-serif text-[24px] text-verde-deep">Solicitá tu cotización</h3>

          {/* honeypot oculto */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => update("website", e.target.value)} className="hidden" aria-hidden />

          <div className="mt-5 grid gap-3.5 sm:grid-cols-2">
            <Field label="Empresa" required>
              <input required value={form.empresa} onChange={(e) => update("empresa", e.target.value)} placeholder="Razón social" className="field-input" />
            </Field>
            <Field label="Nombre" required>
              <input required value={form.nombre} onChange={(e) => update("nombre", e.target.value)} placeholder="Tu nombre" className="field-input" />
            </Field>
            <Field label="Email corporativo" required>
              <input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="vos@empresa.com" className="field-input" />
            </Field>
            <Field label="Teléfono">
              <input value={form.telefono} onChange={(e) => update("telefono", e.target.value)} placeholder="+54 9 ..." className="field-input" />
            </Field>
            <Field label="Tipo de consulta" full>
              <select value={form.tipoConsulta} onChange={(e) => update("tipoConsulta", e.target.value)} className="field-input">
                {contactSection.consultTypes.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Mensaje" full>
              <textarea rows={3} value={form.mensaje} onChange={(e) => update("mensaje", e.target.value)} placeholder="Contanos qué equipamiento necesitás..." className="field-input resize-none" />
            </Field>
            <label className="col-span-full flex items-center gap-2 text-[14px] font-medium text-[#3a4a40]">
              <input type="checkbox" checked={form.agendarReunion} onChange={(e) => update("agendarReunion", e.target.checked)} className="h-4 w-4 accent-verde" />
              Quiero agendar una reunión con un asesor
            </label>
          </div>

          {status === "error" && <p className="mt-4 rounded-lg bg-red-50 px-4 py-2.5 text-[13.5px] text-red-700" role="alert">{error}</p>}

          <button
            type="submit"
            disabled={status === "loading"}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-verde px-7 py-3.5 text-[15px] font-semibold text-white transition-all hover:bg-verde-acento hover:text-verde-deep hover:shadow-glow disabled:opacity-70"
          >
            {status === "loading" ? <><Loader2 size={18} className="animate-spin" /> Enviando...</> : <>{contactSection.submitLabel} <ArrowRight size={18} /></>}
          </button>
          <p className="mt-3 text-center text-[11.5px] text-[#6a7a70]">{contactSection.privacyNote}</p>
        </form>
      </div>

      <style>{`.field-input{font-family:inherit;font-size:14.5px;width:100%;padding:12px 14px;border-radius:12px;border:1px solid rgba(20,83,45,.18);background:#fff;color:#0F1F17;transition:.2s}
      .field-input:focus{outline:none;border-color:#14532D;box-shadow:0 0 0 3px rgba(34,197,94,.18)}`}</style>
    </section>
  );
}

function Field({ label, children, required, full }: { label: string; children: React.ReactNode; required?: boolean; full?: boolean }) {
  return (
    <label className={`flex flex-col gap-1.5 ${full ? "col-span-full" : ""}`}>
      <span className="text-[12.5px] font-semibold text-[#3a4a40]">
        {label} {required && <span className="text-bronce">*</span>}
      </span>
      {children}
    </label>
  );
}
