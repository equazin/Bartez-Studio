"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  MessageCircle,
  Clock,
  Clipboard,
  Briefcase,
  ShieldCheck,
  Check,
} from "lucide-react";
import { track } from "@/components/Analytics";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[14px] text-slate-900 outline-none transition focus:border-[#1236d8] focus:ring-2 focus:ring-[#1236d8]/15";

const highlights = [
  {
    icon: Clock,
    title: "Respuesta en 24 hs hábiles",
    text: "Un asesor exclusivo analiza tu pliego o lista técnica para armar una propuesta a medida.",
  },
  {
    icon: Briefcase,
    title: "Condiciones de cuenta corriente",
    text: "Evaluamos plazos de pago y facilidades B2B para operaciones de volumen recurrente.",
  },
  {
    icon: Clipboard,
    title: "Armado de pliegos y especificaciones",
    text: "Pegá tu lista de componentes, pliego de licitación o requisitos directamente en el formulario.",
  },
  {
    icon: ShieldCheck,
    title: "Seguimiento post-cotización",
    text: "Acompañamos el proceso desde la consulta hasta la entrega y soporte técnico.",
  },
];

export default function Rfq() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    empresa: "",
    cuit: "",
    telefono: "",
    provincia: "",
    entrega: "",
    cantidad: "10-30",
    plazo: "30 días",
    pago: "A convenir",
    sustituciones: "Sí, acepto alternativas equivalentes",
    detalle: "",
  });

  const update = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    track("rfq_submitted", {
      empresa: form.empresa,
      cantidad: form.cantidad,
      plazo: form.plazo,
    });

    const details = [
      "Origen: formulario RFQ de la web",
      `Empresa: ${form.empresa}`,
      form.cuit ? `CUIT: ${form.cuit}` : "",
      `Contacto: ${form.nombre}`,
      `Teléfono: ${form.telefono}`,
      form.email ? `Email: ${form.email}` : "",
      form.provincia ? `Provincia / localidad: ${form.provincia}` : "",
      form.entrega ? `Lugar de entrega: ${form.entrega}` : "",
      `Volumen requerido: ${form.cantidad}`,
      `Plazo esperado: ${form.plazo}`,
      `Condición de pago preferida: ${form.pago}`,
      `Sustituciones: ${form.sustituciones}`,
      `Detalle técnico:\n${form.detalle}`,
    ];

    window.open(
      buildWhatsAppUrl("rfq", details),
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="relative overflow-hidden bg-[#070a16] pb-16 pt-24 text-white md:pb-20 md:pt-28">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(18,54,216,0.25),transparent)]" />
          <div className="relative mx-auto max-w-[1200px] px-6">
            <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[12px] font-semibold text-blue-200">
                  <span className="size-1.5 rounded-full bg-[#ff8f1f]" />
                  Compras corporativas & Canal
                </span>
                <h1 className="mt-5 font-display text-[clamp(30px,4.5vw,48px)] font-extrabold leading-[1.05] tracking-[-0.035em]">
                  Cotización Masiva
                  <span className="text-[#0ea5ff]"> (RFQ)</span>
                </h1>
                <p className="mt-4 max-w-[48ch] text-[16px] leading-relaxed text-slate-300">
                  Para empresas y organismos que requieren cotizar volumen de
                  notebooks, servidores, soluciones de red o flotas completas.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {highlights.map((h) => {
                  const Icon = h.icon;
                  return (
                    <div
                      key={h.title}
                      className="rounded-xl border border-white/8 bg-white/[0.04] p-4"
                    >
                      <Icon
                        size={20}
                        className="text-[#0ea5ff]"
                        strokeWidth={1.8}
                      />
                      <h3 className="mt-3 text-[13px] font-bold text-white">
                        {h.title}
                      </h3>
                      <p className="mt-1 text-[12px] leading-relaxed text-slate-400">
                        {h.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Form section */}
        <section className="relative -mt-6 pb-20">
          <div className="mx-auto max-w-[860px] px-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card md:p-10">
              <div className="mb-8 border-b border-slate-100 pb-6">
                <h2 className="font-display text-[22px] font-extrabold text-[#11142a]">
                  Detalle de la cotización
                </h2>
                <p className="mt-1 text-[14px] text-slate-500">
                  Completá los datos y el equipo comercial preparará una
                  propuesta formal.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact info */}
                <fieldset>
                  <legend className="mb-4 text-[12px] font-bold uppercase tracking-[0.1em] text-slate-400">
                    Datos de contacto
                  </legend>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-600">
                        Nombre de contacto *
                      </span>
                      <input
                        required
                        value={form.nombre}
                        onChange={(e) => update("nombre", e.target.value)}
                        className={inputClass}
                        placeholder="Ej: Marcelo Fernández"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-600">
                        Email corporativo *
                      </span>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        className={inputClass}
                        placeholder="mfernandez@empresa.com"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-600">
                        Empresa / Razón Social *
                      </span>
                      <input
                        required
                        value={form.empresa}
                        onChange={(e) => update("empresa", e.target.value)}
                        className={inputClass}
                        placeholder="Logística Central S.A."
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-600">
                        Teléfono directo
                      </span>
                      <input
                        value={form.telefono}
                        onChange={(e) => update("telefono", e.target.value)}
                        className={inputClass}
                        placeholder="+54 9 341 ..."
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-600">
                        Provincia y localidad *
                      </span>
                      <input
                        required
                        value={form.provincia}
                        onChange={(e) => update("provincia", e.target.value)}
                        className={inputClass}
                        placeholder="Rosario, Santa Fe"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-600">
                        CUIT (opcional)
                      </span>
                      <input
                        value={form.cuit}
                        onChange={(e) => update("cuit", e.target.value)}
                        className={inputClass}
                        placeholder="30-12345678-9"
                      />
                    </label>
                  </div>
                </fieldset>

                {/* Logistics */}
                <fieldset>
                  <legend className="mb-4 text-[12px] font-bold uppercase tracking-[0.1em] text-slate-400">
                    Logística y condiciones
                  </legend>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-600">
                        Lugar de entrega *
                      </span>
                      <input
                        required
                        value={form.entrega}
                        onChange={(e) => update("entrega", e.target.value)}
                        className={inputClass}
                        placeholder="Dirección, sucursal o varias sedes"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-600">
                        Volumen requerido
                      </span>
                      <select
                        value={form.cantidad}
                        onChange={(e) => update("cantidad", e.target.value)}
                        className={inputClass}
                      >
                        <option value="10-30">10 a 30 unidades</option>
                        <option value="31-100">31 a 100 unidades</option>
                        <option value="100+">
                          Más de 100 unidades / Licitación
                        </option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-600">
                        Plazo de entrega
                      </span>
                      <select
                        value={form.plazo}
                        onChange={(e) => update("plazo", e.target.value)}
                        className={inputClass}
                      >
                        <option value="Inmediato">
                          Urgente (menos de 7 días)
                        </option>
                        <option value="30 días">Este mes (30 días)</option>
                        <option value="Planificado">Próximos 3 meses</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-600">
                        Condición de pago
                      </span>
                      <select
                        value={form.pago}
                        onChange={(e) => update("pago", e.target.value)}
                        className={inputClass}
                      >
                        <option value="A convenir">A convenir</option>
                        <option value="Transferencia">
                          Transferencia bancaria
                        </option>
                        <option value="Evaluar alternativas">
                          Necesito evaluar alternativas
                        </option>
                      </select>
                    </label>
                    <label className="block sm:col-span-2">
                      <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-600">
                        ¿Aceptás alternativas equivalentes?
                      </span>
                      <select
                        value={form.sustituciones}
                        onChange={(e) =>
                          update("sustituciones", e.target.value)
                        }
                        className={inputClass}
                      >
                        <option>Sí, acepto alternativas equivalentes</option>
                        <option>Solo los modelos indicados</option>
                        <option>Consultar antes de reemplazar</option>
                      </select>
                    </label>
                  </div>
                </fieldset>

                {/* Technical detail */}
                <fieldset>
                  <legend className="mb-4 text-[12px] font-bold uppercase tracking-[0.1em] text-slate-400">
                    Detalle técnico
                  </legend>
                  <label className="block">
                    <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-600">
                      Pliego, modelos, marcas o componentes *
                    </span>
                    <textarea
                      required
                      rows={5}
                      value={form.detalle}
                      onChange={(e) => update("detalle", e.target.value)}
                      className={`${inputClass} resize-none font-mono text-[13px]`}
                      placeholder={"Ej:\n- 25 Notebooks Lenovo ThinkPad E14 AMD Ryzen 5, 16GB, 512GB SSD\n- 1 Servidor Dell PowerEdge R450 16GB, 2TB SATA\n- 2 Switches Cisco Catalyst 24 puertos Gigabit"}
                    />
                  </label>
                </fieldset>

                <div className="border-t border-slate-100 pt-6">
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#11142a] px-6 py-4 text-[15px] font-bold text-white transition hover:bg-[#1236d8]"
                  >
                    <MessageCircle size={18} /> Continuar RFQ por WhatsApp
                  </button>
                  <p className="mt-3 text-center text-[12px] text-slate-500">
                    WhatsApp abrirá el detalle completo para revisarlo antes de
                    enviar.
                  </p>
                </div>
              </form>
            </div>

            {/* Trust bar */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12px] font-semibold text-slate-400">
              {[
                "SLA 24 hs hábiles",
                "Condiciones B2B",
                "Stock verificado",
                "Cobertura nacional",
              ].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <Check size={13} className="text-[#1236d8]" />
                  {item}
                </span>
              ))}
            </div>

            {/* Reseller callout */}
            <div className="mt-8 rounded-2xl border border-[#1236d8]/15 bg-[#1236d8]/[0.03] p-5 text-center">
              <p className="text-[13px] text-slate-600">
                <strong className="text-[#11142a]">
                  ¿Sos revendedor de tecnología?
                </strong>{" "}
                Te sugerimos ingresar a nuestra sección de{" "}
                <a
                  href="/revendedores"
                  className="font-bold text-[#1236d8] hover:underline"
                >
                  Revendedores
                </a>{" "}
                para acceder a condiciones de canal y precios especiales.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
