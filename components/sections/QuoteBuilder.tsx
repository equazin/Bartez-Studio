"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Headphones,
  Laptop,
  Loader2,
  MessageCircle,
  Network,
  Server,
  type LucideIcon,
} from "lucide-react";
import { contact } from "../../constants";
import { track } from "../Analytics";

const needs: Array<{
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    id: "equipos",
    label: "Actualizar equipos de trabajo",
    description: "Notebooks, estaciones y renovación tecnológica.",
    icon: Laptop,
  },
  {
    id: "servidores",
    label: "Mejorar servidores y almacenamiento",
    description: "Rendimiento, continuidad y protección de datos.",
    icon: Server,
  },
  {
    id: "redes",
    label: "Optimizar redes e infraestructura",
    description: "Conectividad, seguridad y crecimiento ordenado.",
    icon: Network,
  },
  {
    id: "servicios",
    label: "Implementar soporte y servicios IT",
    description: "Implementación, mantenimiento y asistencia técnica.",
    icon: Headphones,
  },
  {
    id: "integral",
    label: "Necesito una solución integral",
    description: "Equipos, infraestructura y servicios combinados, o no sé por dónde empezar.",
    icon: MessageCircle,
  },
];

const scales = ["Hasta 10 personas", "11 a 50 personas", "51 a 200 personas", "Más de 200 personas"];
const urgencies = ["Lo antes posible", "Durante este mes", "Próximos 3 meses", "Estoy evaluando opciones"];
const channels = ["Email", "WhatsApp", "Teléfono"];
const inputClass = "w-full rounded-xl border border-white/10 bg-[#030c07] px-4 py-3 text-[14px] text-white outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15 placeholder-slate-500";

export function QuoteBuilder() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [need, setNeed] = useState("");
  const [form, setForm] = useState({
    empresa: "",
    cuit: "",
    escala: "",
    urgencia: "",
    nombre: "",
    email: "",
    telefono: "",
    canalPreferido: "Email",
    mensaje: "",
    website: "",
    consent: false,
  });
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  const selectedNeed = useMemo(() => needs.find((item) => item.id === need), [need]);
  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const canContinue =
    step === 0
      ? Boolean(need)
      : Boolean(form.empresa.trim().length >= 2 && form.escala && form.urgencia);

  function chooseNeed(id: string) {
    if (!need) track("guided_consultation_started", { need: id });
    setNeed(id);
  }

  function next() {
    if (!canContinue) return;
    setStep((current) => Math.min(2, current + 1));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedNeed || !form.consent) {
      setStatus("error");
      setError("Confirmá que podemos usar estos datos para responder tu consulta.");
      return;
    }

    setStatus("loading");
    setError("");
    const message = [
      `Necesidad: ${selectedNeed.label}`,
      `Escala: ${form.escala}`,
      `Urgencia: ${form.urgencia}`,
      `Canal preferido: ${form.canalPreferido}`,
      form.mensaje ? `Contexto adicional: ${form.mensaje}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empresa: form.empresa,
          nombre: form.nombre,
          email: form.email,
          telefono: form.telefono,
          tipoConsulta: "asesoramiento",
          mensaje: message,
          necesidad: selectedNeed.label,
          escala: form.escala,
          urgencia: form.urgencia,
          canalPreferido: form.canalPreferido.toLowerCase(),
          origen: "guided-consultation",
          website: form.website,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        setStatus("error");
        setError(data?.error || "No pudimos enviar la consulta. Probá nuevamente.");
        return;
      }
      track("guided_consultation_completed", {
        need: need,
        preferred_channel: form.canalPreferido,
      });
      router.push("/gracias");
    } catch {
      setStatus("error");
      setError("No pudimos conectarnos. Podés continuar por WhatsApp.");
    }
  }

  const whatsappText = selectedNeed
    ? `Hola, vengo de la web. Necesito asesoramiento para: ${selectedNeed.label}. Empresa: ${form.empresa || "a confirmar"}.`
    : contact.whatsappMessage;
  const whatsappHref = `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(whatsappText)}`;

  return (
    <section id="cotiza" className="scroll-mt-24 bg-[#030c07] py-20 text-white md:py-28">
      <div className="mx-auto grid max-w-[1200px] gap-12 px-6 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
        <div>
          <h2 className="font-display text-[clamp(34px,4.7vw,58px)] font-bold leading-[1.02] tracking-[-0.045em] text-white">
            Contanos qué necesita tu empresa.
          </h2>
          <p className="mt-6 max-w-[38ch] text-[16px] leading-relaxed text-slate-400">
            Respondé unas preguntas breves y un especialista te contactará con una propuesta adecuada a tu contexto en <strong>24 hs hábiles</strong> (Lun–Vie 9 a 18 hs).
          </p>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-9 inline-flex items-center gap-2 rounded-lg border border-white/30 px-5 py-3 text-[14px] font-semibold transition-colors hover:border-accent hover:text-accent"
            data-track="guided_whatsapp_handoff"
          >
            <MessageCircle size={18} /> Prefiero hablar por WhatsApp
          </a>
        </div>

        <div className="rounded-3xl bg-[#082214] border border-white/5 p-6 text-white shadow-glow md:p-9">
          <div className="mb-8 flex items-center gap-2" aria-label={`Paso ${step + 1} de 3`}>
            {["Necesidad", "Contexto", "Contacto"].map((label, index) => (
              <div key={label} className="flex flex-1 items-center gap-2">
                <span
                  className={`grid size-8 flex-none place-items-center rounded-full border text-[12px] font-bold ${
                    index <= step ? "border-accent bg-accent text-ink" : "border-white/10 text-slate-400"
                  }`}
                >
                  {index < step ? <Check size={14} /> : index + 1}
                </span>
                <span className={`hidden text-[12px] font-semibold sm:block ${index <= step ? "text-white" : "text-slate-400"}`}>
                  {label}
                </span>
                {index < 2 && <span className={`h-px flex-1 ${index < step ? "bg-accent" : "bg-white/10"}`} />}
              </div>
            ))}
          </div>

          {step === 0 && (
            <div>
              <h3 className="font-display text-[22px] font-bold text-white">¿Qué querés resolver?</h3>
              <p className="mt-2 text-[13.5px] text-slate-400">Seleccioná la opción que mejor describe tu necesidad principal.</p>
              <div className="mt-6 flex flex-col gap-2.5">
                {needs.map((item) => {
                  const active = need === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => chooseNeed(item.id)}
                      aria-pressed={active}
                      className={`group flex items-center gap-4 rounded-xl border p-4 text-left transition-all ${
                        active ? "border-accent bg-accent/10 ring-1 ring-accent" : "border-white/10 bg-[#030c07] hover:border-accent/40"
                      }`}
                    >
                      <span className={`grid size-10 flex-none place-items-center rounded-lg ${active ? "bg-accent text-ink" : "bg-white/5 text-accent"}`}>
                        <item.icon size={19} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[14px] font-semibold text-white">{item.label}</span>
                        <span className="mt-0.5 block text-[12.5px] leading-relaxed text-slate-400">{item.description}</span>
                      </span>
                      <span className={`ml-auto grid size-5 flex-none place-items-center rounded-full border ${active ? "border-accent bg-accent text-ink" : "border-white/20"}`}>
                        {active && <Check size={12} strokeWidth={3} />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h3 className="font-display text-[22px] font-bold text-white">Contanos el contexto</h3>
              <p className="mt-2 text-[13.5px] text-slate-400">No necesitamos modelos ni cantidades exactas para orientarte.</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="sm:col-span-2">
                  <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-350 font-display">Empresa o razón social</span>
                  <input required value={form.empresa} onChange={(event) => update("empresa", event.target.value)} className={inputClass} placeholder="Nombre de la empresa" />
                </label>
                <label>
                  <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-350 font-display">CUIT (opcional)</span>
                  <input value={form.cuit} onChange={(event) => update("cuit", event.target.value)} className={inputClass} placeholder="20-00000000-0" />
                </label>
                <label>
                  <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-350 font-display">Tamaño del equipo</span>
                  <select required value={form.escala} onChange={(event) => update("escala", event.target.value)} className={inputClass}>
                    <option value="" className="bg-[#030c07]">Seleccionar</option>
                    {scales.map((scale) => <option key={scale} className="bg-[#030c07]">{scale}</option>)}
                  </select>
                </label>
                <label>
                  <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-350 font-display">¿Para cuándo?</span>
                  <select required value={form.urgencia} onChange={(event) => update("urgencia", event.target.value)} className={inputClass}>
                    <option value="" className="bg-[#030c07]">Seleccionar</option>
                    {urgencies.map((urgency) => <option key={urgency} className="bg-[#030c07]">{urgency}</option>)}
                  </select>
                </label>
                <label className="sm:col-span-2">
                  <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-350 font-display">Información adicional (opcional)</span>
                  <textarea rows={3} value={form.mensaje} onChange={(event) => update("mensaje", event.target.value)} className={`${inputClass} resize-none`} placeholder="Objetivo, situación actual o restricciones relevantes" />
                </label>
              </div>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={submit} noValidate>
              <h3 className="font-display text-[22px] font-bold text-white">¿Cómo te contactamos?</h3>
              <p className="mt-2 text-[13.5px] text-slate-400">Un asesor utilizará estos datos únicamente para responder tu consulta.</p>
              <input type="text" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => update("website", event.target.value)} className="hidden" aria-hidden />
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label>
                  <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-350 font-display">Nombre</span>
                  <input required value={form.nombre} onChange={(event) => update("nombre", event.target.value)} className={inputClass} placeholder="Tu nombre" />
                </label>
                <label>
                  <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-350 font-display">Email corporativo</span>
                  <input required type="email" value={form.email} onChange={(event) => update("email", event.target.value)} className={inputClass} placeholder="nombre@empresa.com" />
                </label>
                <label>
                  <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-350 font-display">Teléfono (opcional)</span>
                  <input value={form.telefono} onChange={(event) => update("telefono", event.target.value)} className={inputClass} placeholder="+54 9 ..." />
                </label>
                <label>
                  <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-350 font-display">Canal preferido</span>
                  <select value={form.canalPreferido} onChange={(event) => update("canalPreferido", event.target.value)} className={inputClass}>
                    {channels.map((channel) => <option key={channel} className="bg-[#030c07]">{channel}</option>)}
                  </select>
                </label>
              </div>
              <label className="mt-5 flex items-start gap-3 text-[12.5px] leading-relaxed text-slate-400">
                <input type="checkbox" checked={form.consent} onChange={(event) => update("consent", event.target.checked)} className="mt-0.5 size-4 accent-accent" />
                <span>Acepto que Bartez utilice estos datos para contactarme y responder esta consulta.</span>
              </label>
              {status === "error" && <p role="alert" className="mt-4 rounded-lg bg-red-950/40 border border-red-500/20 px-4 py-3 text-[13px] text-red-200">{error}</p>}
              <button
                type="submit"
                disabled={status === "loading" || !form.nombre || !form.email || !form.consent}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-[14.5px] font-bold text-ink transition-all hover:scale-[1.02] hover:bg-[#10b981] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {status === "loading" ? <><Loader2 size={17} className="animate-spin" /> Enviando...</> : <>Recibir asesoramiento <ArrowRight size={17} /></>}
              </button>
            </form>
          )}

          <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5">
            <button
              type="button"
              onClick={() => setStep((current) => Math.max(0, current - 1))}
              className={`inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-slate-400 hover:text-white ${step === 0 ? "invisible" : ""}`}
            >
              <ArrowLeft size={15} /> Atrás
            </button>
            {step < 2 && (
              <button
                type="button"
                onClick={next}
                disabled={!canContinue}
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-[13.5px] font-bold text-ink transition-all hover:scale-[1.02] hover:bg-[#10b981] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Continuar <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}