import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Barcode,
  Boxes,
  BarChart3,
  CheckCircle2,
  CircleDollarSign,
  Headset,
  MessageCircle,
  Monitor,
  Printer,
  ReceiptText,
  ScanLine,
  ShieldCheck,
  Store,
  Users,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BarposWhatsAppForm } from "@/components/BarposWhatsAppForm";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "BarPOS 4.0 — Punto de venta electrónico | Bartez Tecnología",
  description:
    "BarPOS 4.0: equipamiento, software, instalación y soporte para comercios. Consultá precio vigente o condiciones para distribuidores por WhatsApp.",
};

const included = [
  {
    title: "PC Bartho POS",
    description: "Equipo preparado para mostrador con monitor, teclado, mouse, Intel Core i3, 8 GB de memoria y disco de 500 GB según disponibilidad.",
    icon: Monitor,
  },
  {
    title: "Impresora térmica",
    description: "Impresora OCOM 80 mm USB + LAN con autocutter para emisión rápida de comprobantes y tickets.",
    icon: Printer,
  },
  {
    title: "Lector de códigos",
    description: "Lector OCOM láser USB con base para agilizar la venta en caja y reducir errores manuales.",
    icon: Barcode,
  },
  {
    title: "Software BarPOS 4.0",
    description: "Sistema de punto de venta electrónico con módulos comerciales, inventario, reportes y administración.",
    icon: ReceiptText,
  },
];

const modules = [
  { title: "Ventas", items: ["Caja / terminal de venta", "Gestión de clientes", "Gestión de pedidos", "Facturación electrónica"], icon: Store },
  { title: "Inventario", items: ["Control de stock", "Gestión de productos", "Movimientos de inventario"], icon: Boxes },
  { title: "Administración", items: ["Gestión de proveedores", "Gestión de usuarios", "Gestión de cajas"], icon: Users },
  { title: "Reportes", items: ["Reportes de ventas", "Análisis de rendimiento", "Reportes financieros"], icon: BarChart3 },
  { title: "Pagos", items: ["Gestión de pagos", "Registro de operaciones", "Control administrativo"], icon: CircleDollarSign },
];

const businessTargets = ["Minisúper", "Mini mercados", "Despensas", "Panaderías", "Bares", "Comercios con atención al público"];

const distributorBenefits = [
  "Solución completa: equipamiento + software + soporte.",
  "Oportunidad para vender una solución, no solo una caja.",
  "Acompañamiento técnico y comercial para el canal.",
  "Capacitación y herramientas para vender mejor.",
  "Zonas disponibles sujetas a evaluación comercial.",
];

export default function BarposPage() {
  const quoteHref = buildWhatsAppUrl("barpos", ["Consulta: precio vigente de BarPOS 4.0", "Origen: landing BarPOS"]);
  const resellerHref = buildWhatsAppUrl("barpos", ["Consulta: condiciones para distribuir/revender BarPOS", "Origen: landing BarPOS"]);

  return (
    <>
      <Navbar />
      <main className="bg-[#030c07] pt-20 text-white">
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(42,185,255,0.16),transparent_34%),radial-gradient(circle_at_20%_0%,rgba(84,255,153,0.12),transparent_30%)]" />
          <div className="relative mx-auto grid max-w-[1200px] gap-12 px-6 py-20 md:py-28 lg:grid-cols-[0.98fr_1.02fr] lg:items-center">
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-accent">BarPOS 4.0 · Punto de venta electrónico</p>
              <h1 className="mt-5 max-w-[760px] font-display text-[clamp(42px,6.5vw,78px)] font-bold leading-[0.94] tracking-[-0.058em] text-balance">
                Punto de venta completo para negocios que necesitan vender mejor.
              </h1>
              <p className="mt-7 max-w-[65ch] text-[clamp(16px,1.45vw,18px)] leading-relaxed text-slate-300">
                BarPOS integra equipamiento, software, instalación y soporte para comercios con caja, stock, reportes y facturación electrónica. Ideal para mostradores que necesitan orden, velocidad y control.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a href={quoteHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-[14px] font-bold text-ink transition hover:scale-[1.02]">
                  <MessageCircle size={18} /> Consultar precio vigente
                </a>
                <a href={resellerHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 px-6 py-3.5 text-[14px] font-semibold text-white transition hover:border-accent hover:text-accent">
                  Quiero distribuir BarPOS <ArrowRight size={16} />
                </a>
              </div>

              <div className="mt-8 grid gap-3 text-[13px] text-slate-300 sm:grid-cols-3">
                {["Controladora fiscal homologada", "Software + equipamiento + soporte", "Implementación por única vez"].map((item) => (
                  <div key={item} className="flex items-start gap-2 border-l border-accent/50 pl-3">
                    <CheckCircle2 className="mt-0.5 flex-none text-accent" size={16} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-accent/10 blur-3xl" />
              <div className="relative border border-white/10 bg-[#06140d] p-5 shadow-2xl shadow-black/35">
                <div className="grid gap-4 sm:grid-cols-[1.05fr_0.95fr]">
                  <div className="relative min-h-[350px] overflow-hidden bg-[#061833] p-5">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_20%,rgba(43,202,255,0.2),transparent_34%),linear-gradient(135deg,rgba(34,197,94,0.16),transparent_42%)]" />
                    <div className="relative flex h-full min-h-[310px] flex-col justify-between">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">Punto de venta electrónico</p>
                        <div className="mt-4 rounded-2xl border border-white/15 bg-[#020817] p-4 shadow-2xl shadow-black/30">
                          <div className="rounded-xl border border-[#2aa8ff]/30 bg-gradient-to-br from-[#08285f] to-[#020817] p-5">
                            <p className="font-display text-[36px] font-black leading-none tracking-[-0.08em] text-white">BAR<span className="text-[#2aa8ff]">POS</span></p>
                            <p className="mt-1 text-[22px] font-black text-[#2aa8ff]">4.0</p>
                            <div className="mt-5 grid grid-cols-3 gap-2 text-[9px] font-semibold text-slate-300">
                              <span>Caja</span>
                              <span>Stock</span>
                              <span>Reportes</span>
                            </div>
                          </div>
                          <div className="mx-auto h-6 w-16 bg-[#0b1020]" />
                          <div className="mx-auto h-2 w-28 rounded-full bg-[#0b1020]" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                          <Printer className="text-accent" size={18} />
                          <p className="mt-2 text-[11px] font-bold text-white">Impresora térmica</p>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                          <ScanLine className="text-accent" size={18} />
                          <p className="mt-2 text-[11px] font-bold text-white">Lector de códigos</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-3">
                    {included.slice(0, 3).map((item) => (
                      <div key={item.title} className="border border-white/10 bg-white/[0.03] p-4">
                        <item.icon className="text-accent" size={22} strokeWidth={1.7} />
                        <h2 className="mt-3 font-display text-[17px] font-bold text-white">{item.title}</h2>
                        <p className="mt-2 text-[12.5px] leading-relaxed text-slate-400">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-white/10 bg-[#06140d] py-14">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-5 px-6 md:flex-row md:items-center md:justify-between">
            <h2 className="font-display text-[26px] font-bold tracking-[-0.035em] text-white">Ideal para comercios con atención diaria al público.</h2>
            <div className="flex flex-wrap gap-2">
              {businessTargets.map((item) => (
                <span key={item} className="rounded-full border border-white/10 px-3 py-2 text-[12.5px] font-semibold text-slate-300">{item}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
              <div>
                <h2 className="font-display text-[clamp(32px,4.5vw,54px)] font-bold leading-[1.02] tracking-[-0.05em] text-white">Qué incluye BarPOS.</h2>
                <p className="mt-5 text-[15.5px] leading-relaxed text-slate-400">
                  La propuesta está pensada para resolver el puesto de venta completo: hardware, periféricos, software y puesta en marcha.
                </p>
              </div>
              <div className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2">
                {included.map((item) => (
                  <article key={item.title} className="bg-[#06140d] p-6 md:p-7">
                    <item.icon className="text-accent" size={28} strokeWidth={1.6} />
                    <h3 className="mt-5 font-display text-[20px] font-bold text-white">{item.title}</h3>
                    <p className="mt-3 text-[13.5px] leading-relaxed text-slate-400">{item.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-[#07160f] py-16 md:py-24">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="max-w-[760px]">
              <h2 className="font-display text-[clamp(32px,4.5vw,54px)] font-bold leading-[1.02] tracking-[-0.05em] text-white">Módulos para controlar caja, stock y administración.</h2>
              <p className="mt-5 text-[15.5px] leading-relaxed text-slate-400">
                BarPOS está orientado a simplificar la operación diaria del comercio: vender, facturar, controlar productos, revisar reportes y ordenar pagos.
              </p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              {modules.map((module) => (
                <article key={module.title} className="border border-white/10 bg-[#030c07] p-5">
                  <module.icon className="text-accent" size={24} strokeWidth={1.6} />
                  <h3 className="mt-4 font-display text-[18px] font-bold text-white">{module.title}</h3>
                  <ul className="mt-4 grid gap-2">
                    {module.items.map((item) => (
                      <li key={item} className="flex gap-2 text-[12.5px] leading-relaxed text-slate-400">
                        <span className="mt-2 size-1.5 flex-none rounded-full bg-accent" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="mx-auto grid max-w-[1200px] gap-10 px-6 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-accent">Canal y distribuidores</p>
              <h2 className="mt-4 font-display text-[clamp(32px,4.5vw,54px)] font-bold leading-[1.02] tracking-[-0.05em] text-white">
                Sumá BarPOS a tu oferta y vendé una solución completa.
              </h2>
              <p className="mt-5 text-[15.5px] leading-relaxed text-slate-400">
                Para revendedores, integradores y comercios tecnológicos, BarPOS permite ofrecer valor más allá del hardware: instalación, capacitación, soporte y una propuesta fácil de explicar al cliente final.
              </p>
              <div className="mt-7 border-t border-white/10">
                {distributorBenefits.map((item) => (
                  <div key={item} className="flex gap-3 border-b border-white/10 py-4 text-[14px] leading-relaxed text-slate-300">
                    <CheckCircle2 className="mt-0.5 flex-none text-accent" size={18} />
                    {item}
                  </div>
                ))}
              </div>
              <a href={resellerHref} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-[14px] font-bold text-ink transition hover:scale-[1.02]">
                <MessageCircle size={18} /> Consultar condiciones de distribución
              </a>
            </div>

            <div className="border border-white/10 bg-[#06140d] p-5">
              <div className="relative overflow-hidden bg-[#061833] p-6 sm:p-8">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(42,168,255,0.24),transparent_34%),radial-gradient(circle_at_10%_95%,rgba(34,197,94,0.18),transparent_34%)]" />
                <div className="relative">
                  <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
                    <Store size={14} /> Red comercial
                  </div>
                  <h3 className="mt-6 max-w-[12ch] font-display text-[clamp(34px,5vw,62px)] font-black leading-[0.88] tracking-[-0.07em] text-white">
                    Buscamos distribuidores BarPOS.
                  </h3>
                  <p className="mt-5 max-w-[42ch] text-[14px] leading-relaxed text-slate-300">
                    Una propuesta para revendedores que quieren sumar soluciones de caja, software, implementación y soporte a su cartera.
                  </p>

                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    {[
                      { label: "Zonas disponibles", icon: ScanLine },
                      { label: "Excelente rentabilidad", icon: BarChart3 },
                      { label: "Soporte continuo", icon: Headset },
                      { label: "Capacitación comercial", icon: Users },
                    ].map((item) => (
                      <div key={item.label} className="rounded-2xl border border-white/10 bg-[#020817]/70 p-4">
                        <item.icon className="text-accent" size={20} strokeWidth={1.7} />
                        <p className="mt-3 text-[13px] font-bold text-white">{item.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Modelo de canal</p>
                        <p className="mt-2 font-display text-[22px] font-bold text-white">Solución completa, lista para vender.</p>
                      </div>
                      <div className="grid size-14 place-items-center rounded-2xl bg-accent text-ink">
                        <MessageCircle size={24} />
                      </div>
                    </div>
                    <div className="mt-5 grid grid-cols-3 gap-2 text-center text-[11px] font-semibold text-slate-300">
                      <span className="rounded-xl bg-white/5 px-2 py-3">Equipos</span>
                      <span className="rounded-xl bg-white/5 px-2 py-3">Software</span>
                      <span className="rounded-xl bg-white/5 px-2 py-3">Soporte</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-[#06140d] py-16 md:py-24">
          <div className="mx-auto grid max-w-[1200px] gap-10 px-6 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <h2 className="font-display text-[clamp(32px,4.5vw,54px)] font-bold leading-[1.02] tracking-[-0.05em] text-white">
                Precio: mejor por WhatsApp que fijo en web.
              </h2>
              <p className="mt-5 text-[15.5px] leading-relaxed text-slate-400">
                Para esta línea conviene trabajar el precio como cotización vigente, no como lista pública permanente. Cambian costos, configuración, instalación, zona y condiciones del canal.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: ShieldCheck, title: "Evita precios vencidos", text: "El flyer puede usarse en campañas con vigencia. La página debe derivar a consulta actualizada." },
                { icon: ScanLine, title: "Permite calificar el lead", text: "No vale lo mismo un comercio con una caja que una red de sucursales o un revendedor." },
                { icon: Headset, title: "Incluye implementación", text: "La puesta en marcha puede variar por alcance, ubicación y necesidad de capacitación." },
                { icon: MessageCircle, title: "Cierra mejor por WhatsApp", text: "Ventas puede responder con precio, disponibilidad, condiciones y próximos pasos en el mismo hilo." },
              ].map((item) => (
                <article key={item.title} className="border border-white/10 bg-[#030c07] p-6">
                  <item.icon className="text-accent" size={24} strokeWidth={1.7} />
                  <h3 className="mt-4 font-display text-[18px] font-bold text-white">{item.title}</h3>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-slate-400">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="mx-auto grid max-w-[1200px] gap-10 px-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-accent">Cotización directa</p>
              <h2 className="mt-4 font-display text-[clamp(32px,4.5vw,54px)] font-bold leading-[1.02] tracking-[-0.05em] text-white">
                Consultá BarPOS con los datos que ventas necesita.
              </h2>
              <p className="mt-5 text-[15.5px] leading-relaxed text-slate-400">
                Si sos comercio, pedí precio vigente e implementación. Si sos revendedor, consultá zona, margen, soporte y modalidad de trabajo.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/revendedores" className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 px-6 py-3.5 text-[14px] font-semibold text-white transition hover:border-accent hover:text-accent">
                  Ver canal revendedores <ArrowRight size={16} />
                </Link>
                <Link href="/contacto" className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 px-6 py-3.5 text-[14px] font-semibold text-white transition hover:border-accent hover:text-accent">
                  Ver datos de contacto
                </Link>
              </div>
            </div>
            <BarposWhatsAppForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
