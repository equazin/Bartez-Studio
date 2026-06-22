"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { 
  Send, 
  Clock, 
  Clipboard, 
  Briefcase,
  AlertCircle
} from "lucide-react";
import { track } from "../../components/Analytics";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[14px] text-slate-900 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15";

export default function Rfq() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    empresa: "",
    cuit: "",
    telefono: "",
    cantidad: "10-50",
    plazo: "30 días",
    pago: "Transferencia",
    detalle: "",
    consent: false,
  });

  const update = (key: string, value: string | boolean) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.consent) {
      setError("Tenés que aceptar los términos de tratamiento de datos.");
      return;
    }

    setStatus("loading");
    setError("");

    track("rfq_submitted", {
      empresa: form.empresa,
      cantidad: form.cantidad,
      plazo: form.plazo,
    });

    const detailedMessage = `Solicitud de Cotización Masiva (RFQ) Bartez.\n` +
      `Cantidad Solicitada: ${form.cantidad}\n` +
      `Plazo Requerido: ${form.plazo}\n` +
      `Forma de Pago Preferida: ${form.pago}\n` +
      `CUIT / Razón Social: ${form.cuit}\n` +
      `Especificaciones y Modelos:\n` +
      `${form.detalle}`;

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empresa: form.empresa,
          nombre: form.nombre,
          email: form.email,
          telefono: form.telefono,
          tipoConsulta: "rfq-masivo",
          mensaje: detailedMessage,
          necesidad: `RFQ Masivo - ${form.cantidad} uds`,
          escala: form.cantidad,
          urgencia: form.plazo,
          canalPreferido: "email",
          origen: "rfq-page",
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.ok) {
        setStatus("error");
        setError(data?.error || "Error al procesar la cotización masiva. Por favor intente de nuevo.");
        return;
      }

      setStatus("success");
      setTimeout(() => {
        router.push("/gracias");
      }, 1500);
    } catch {
      setStatus("error");
      setError("Ocurrió un problema de conexión al enviar el formulario.");
    }
  };

  return (
    <>
      <Navbar />
      <main className="bg-slate-50 min-h-screen pt-32 pb-24">
        <div className="mx-auto max-w-[1200px] px-6">
          
          <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr]">
            
            {/* Información RFQ */}
            <div className="flex flex-col justify-center">
              <span className="text-[13px] font-semibold uppercase tracking-[0.12em] text-brand">
                Compras Corporativas & Canal
              </span>
              <h1 className="mt-3 font-display text-[clamp(32px,4.5vw,52px)] font-bold leading-[1.06] tracking-[-0.035em] text-ink">
                Solicitud de Cotización Masiva (RFQ)
              </h1>
              <p className="mt-5 text-[16px] text-slate-600 leading-relaxed">
                Diseñado para empresas y organismos que requieren cotizar volumen de notebooks, servidores, soluciones de red o flotas completas de equipamiento.
              </p>

              <div className="mt-8 space-y-6">
                <div className="flex gap-4">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-emerald/10 text-emerald flex-none">
                    <Clock size={20} />
                  </span>
                  <div>
                    <h3 className="text-[15px] font-bold text-ink">SLA prioritario de 24 hs hábiles</h3>
                    <p className="text-[13.5px] text-slate-500 mt-1 leading-relaxed">
                      Un asesor comercial exclusivo del canal mayorista analizará tu pliego o lista técnica para armar una propuesta a medida.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-emerald/10 text-emerald flex-none">
                    <Briefcase size={20} />
                  </span>
                  <div>
                    <h3 className="text-[15px] font-bold text-ink">Condiciones de cuenta corriente</h3>
                    <p className="text-[13.5px] text-slate-500 mt-1 leading-relaxed">
                      Evaluamos plazos de pago y facilidades B2B para operaciones de volumen recurrente.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-emerald/10 text-emerald flex-none">
                    <Clipboard size={20} />
                  </span>
                  <div>
                    <h3 className="text-[15px] font-bold text-ink">Armado de pliegos y especificaciones</h3>
                    <p className="text-[13.5px] text-slate-500 mt-1 leading-relaxed">
                      Podés pegar directamente tu lista de componentes, pliego de licitación o requisitos específicos en el formulario.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-xl bg-ink p-5 text-white flex gap-3.5 items-start">
                <AlertCircle className="text-accent flex-none mt-0.5" size={18} />
                <p className="text-[12.5px] leading-relaxed text-slate-300">
                  <strong>¿Sos revendedor de tecnología?</strong> Te sugerimos ingresar a nuestra sección de <a href="/revendedores" className="font-bold text-accent hover:underline">Revendedores</a> para registrarte en el canal de distribución y acceder a precios especiales.
                </p>
              </div>
            </div>

            {/* Formulario RFQ */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-soft p-6 md:p-10">
              <h2 className="font-display text-[22px] font-bold text-ink mb-6">
                Completá los detalles de la cotización
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1 block text-[12.5px] font-semibold text-slate-600">Nombre de contacto</span>
                    <input
                      required
                      value={form.nombre}
                      onChange={e => update("nombre", e.target.value)}
                      className={inputClass}
                      placeholder="Ej: Marcelo Fernández"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-[12.5px] font-semibold text-slate-600">Email Corporativo</span>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={e => update("email", e.target.value)}
                      className={inputClass}
                      placeholder="Ej: mfernandez@empresa.com"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-[12.5px] font-semibold text-slate-600">Empresa / Razón Social</span>
                    <input
                      required
                      value={form.empresa}
                      onChange={e => update("empresa", e.target.value)}
                      className={inputClass}
                      placeholder="Ej: Logística Central S.A."
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-[12.5px] font-semibold text-slate-600">CUIT (opcional para cotización)</span>
                    <input
                      value={form.cuit}
                      onChange={e => update("cuit", e.target.value)}
                      className={inputClass}
                      placeholder="Ej: 30-12345678-9"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-[12.5px] font-semibold text-slate-600">Teléfono directo</span>
                    <input
                      value={form.telefono}
                      onChange={e => update("telefono", e.target.value)}
                      className={inputClass}
                      placeholder="+54 9 341 ..."
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-[12.5px] font-semibold text-slate-600">Volumen requerido</span>
                    <select 
                      value={form.cantidad} 
                      onChange={e => update("cantidad", e.target.value)}
                      className={inputClass}
                    >
                      <option value="10-30">10 a 30 unidades</option>
                      <option value="31-100">31 a 100 unidades</option>
                      <option value="100+">Más de 100 unidades / Licitación</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-[12.5px] font-semibold text-slate-600">Plazo de entrega esperado</span>
                    <select 
                      value={form.plazo} 
                      onChange={e => update("plazo", e.target.value)}
                      className={inputClass}
                    >
                      <option value="Inmediato">Urgente (menos de 7 días)</option>
                      <option value="30 días">Durante este mes (30 días)</option>
                      <option value="Planificado">Próximos 3 meses</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-[12.5px] font-semibold text-slate-600">Condición de pago preferida</span>
                    <select 
                      value={form.pago} 
                      onChange={e => update("pago", e.target.value)}
                      className={inputClass}
                    >
                      <option value="Transferencia">Transferencia bancaria directa</option>
                      <option value="Cheques">Cheques diferidos (30/60 días)</option>
                      <option value="Cuenta Corriente">Cuenta corriente comercial</option>
                      <option value="Acuerdo B2B">A convenir con el comercial</option>
                    </select>
                  </label>
                </div>

                <label className="block">
                  <span className="mb-1 block text-[12.5px] font-semibold text-slate-600">
                    Detalle del requerimiento técnico (pliego, modelos, marcas o componentes)
                  </span>
                  <textarea
                    required
                    rows={6}
                    value={form.detalle}
                    onChange={e => update("detalle", e.target.value)}
                    className={`${inputClass} resize-none font-mono text-[13px]`}
                    placeholder="Ej: &#10;- 25 Notebooks Lenovo ThinkPad E14 AMD Ryzen 5, 16GB RAM, 512GB SSD&#10;- 1 Servidor Rackeable Dell PowerEdge R450 16GB, 2TB SATA&#10;- 2 Switches Cisco Catalyst 24 puertos Gigabit"
                  />
                </label>

                <label className="flex items-start gap-3 text-[12.5px] leading-relaxed text-slate-600 pt-2">
                  <input
                    required
                    type="checkbox"
                    checked={form.consent}
                    onChange={e => update("consent", e.target.checked)}
                    className="mt-0.5 size-4 accent-brand flex-none"
                  />
                  <span>
                    Acepto que Bartez Tecnología almacene y procese mis datos comerciales para la generación del presupuesto formal.
                  </span>
                </label>

                {status === "error" && (
                  <div className="rounded-lg bg-red-50 px-4 py-3 text-[13px] text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "loading" || status === "success"}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-ink px-6 py-3.5 text-[14.5px] font-bold text-white transition-colors hover:bg-brand disabled:opacity-60"
                >
                  {status === "loading" ? (
                    "Enviando solicitud..."
                  ) : status === "success" ? (
                    "¡Solicitud enviada correctamente!"
                  ) : (
                    <>
                      <Send size={16} /> Enviar Solicitud de Cotización (RFQ)
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
